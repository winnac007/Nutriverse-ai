import os
import hashlib
import json
import logging
import requests
from datetime import datetime, timezone, timedelta
from typing import Any, Dict, List, Optional
from app.core.config import settings
from app.data.seed_data import get_all_recipes, get_recipe

logger = logging.getLogger(__name__)

SPOONACULAR_BASE = "https://api.spoonacular.com"
CACHE_TTL_DAYS = 30

LOCATION_TO_CUISINE = {
    "india": "Indian", "indian": "Indian", "italy": "Italian", "italian": "Italian",
    "france": "French", "french": "French", "china": "Chinese", "chinese": "Chinese",
    "japan": "Japanese", "japanese": "Japanese", "mexico": "Mexican", "mexican": "Mexican",
    "thailand": "Thai", "thai": "Thai", "greece": "Greek", "greek": "Greek",
    "lebanon": "Middle Eastern", "turkish": "Middle Eastern", "turkey": "Middle Eastern",
    "vietnam": "Vietnamese", "korea": "Korean", "spanish": "Spanish", "spain": "Spanish",
    "american": "American", "usa": "American", "us": "American", "british": "British",
    "uk": "British", "german": "German", "germany": "German",
}

APP_CUISINE_TO_SPOONACULAR = {
    "indian": "Indian", "mediterranean": "Mediterranean",
    "east-asian": "Chinese,Japanese,Korean", "continental": "European",
    "middle-eastern": "Middle Eastern", "mexican": "Mexican",
    "african": "African", "american": "American",
}

DIETARY_TO_SPOONACULAR = {
    "vegetarian": "vegetarian", "vegan": "vegan",
    "eggetarian": "vegetarian", "non-vegetarian": "",
}

ALLERGY_TO_INTOLERANCE = {
    "lactose": "dairy", "Lactose": "dairy", "gluten": "gluten", "Gluten": "gluten",
    "nuts": "tree nut,peanut", "Nuts": "tree nut,peanut", "shellfish": "shellfish", "Shellfish": "shellfish",
}

COOKING_TO_MAX_TIME = {
    "full": 60, "quick": 20, "eat-out": 30, "minimal": 20,
}

# Standard Spoonacular meal types
VALID_SPOON_TYPES = {
    "main course", "side dish", "dessert", "appetizer", "salad", "bread", 
    "breakfast", "soup", "beverage", "sauce", "marinade", "fingerfood", 
    "snack", "drink"
}

def _cuisine_from_location(location: Optional[str]) -> str:
    if not location:
        return ""
    loc_lower = location.lower()
    for key, cuisine in LOCATION_TO_CUISINE.items():
        if key in loc_lower:
            return cuisine
    return ""

def _build_query_params(user: Dict[str, Any]) -> Dict[str, Any]:
    params: Dict[str, Any] = {
        "apiKey": settings.SPOONACULAR_API_KEY,
        "number": 20,
        "addRecipeNutrition": True,
        "addRecipeInformation": True,
        "fillIngredients": True,
        "instructionsRequired": True,
        "sort": "healthiness",
        "sortDirection": "desc",
    }
    prefs = user.get("preferences") or {}
    preferred_cuisines = prefs.get("cuisines", [])
    if preferred_cuisines:
        cuisine_names = [APP_CUISINE_TO_SPOONACULAR.get(c, "") for c in preferred_cuisines]
        cuisine_str = ",".join(c for c in cuisine_names if c)
        if cuisine_str:
            params["cuisine"] = cuisine_str
    else:
        loc_cuisine = _cuisine_from_location(user.get("location") or user.get("city"))
        if loc_cuisine:
            params["cuisine"] = loc_cuisine
    dietary_type = user.get("dietary_type", "")
    spoon_diet = DIETARY_TO_SPOONACULAR.get(dietary_type, "")
    if spoon_diet:
        params["diet"] = spoon_diet
    allergies = user.get("allergies") or []
    intolerances = []
    for allergy in allergies:
        mapped = ALLERGY_TO_INTOLERANCE.get(allergy, "")
        if mapped:
            intolerances.extend(mapped.split(","))
    if intolerances:
        params["intolerances"] = ",".join(set(intolerances))
    disliked = prefs.get("disliked_ingredients", [])
    if disliked:
        exclude = [d.split("/")[0].strip().lower() for d in disliked]
        params["excludeIngredients"] = ",".join(exclude)
    cooking_ability = user.get("cooking_ability", "quick")
    params["maxReadyTime"] = COOKING_TO_MAX_TIME.get(cooking_ability, 30)
    spice_level = prefs.get("spice_level", "medium")
    if spice_level == "mild":
        params["excludeIngredients"] = (params.get("excludeIngredients", "") + ",chili,jalapeño,cayenne").strip(",")
    return params

def _cache_key(params: Dict[str, Any]) -> str:
    safe = {k: v for k, v in params.items() if k != "apiKey"}
    serialized = json.dumps(safe, sort_keys=True)
    return hashlib.sha256(serialized.encode()).hexdigest()[:32]

async def fetch_personalized_recipes(user: Dict[str, Any], db) -> List[Dict[str, Any]]:
    if not settings.SPOONACULAR_API_KEY:
        logger.warning("fetch_personalized_recipes: SPOONACULAR_API_KEY is missing")
        return []
    params = _build_query_params(user)
    key = _cache_key(params)
    cached = await db.spoonacular_cache.find_one({"cache_key": key}, {"_id": 0})
    if cached:
        cached_at = datetime.fromisoformat(cached["cached_at"])
        age = datetime.now(timezone.utc) - cached_at.replace(tzinfo=timezone.utc)
        if age < timedelta(days=CACHE_TTL_DAYS):
            return cached.get("recipes", [])
    try:
        resp = requests.get(f"{SPOONACULAR_BASE}/recipes/complexSearch", params=params, timeout=15)
        resp.raise_for_status()
        recipes = resp.json().get("results", [])
    except Exception as exc:
        logger.error("Spoonacular API error: %s", exc)
        return []
    await db.spoonacular_cache.update_one(
        {"cache_key": key},
        {"$set": {
            "cache_key": key, "recipes": recipes,
            "cached_at": datetime.now(timezone.utc).isoformat(),
            "query_params": {k: v for k, v in params.items() if k != "apiKey"},
        }},
        upsert=True,
    )
    return recipes

async def search_recipes(
    query: Optional[str] = None, cuisine: Optional[str] = None,
    diet: Optional[str] = None, intolerances: Optional[str] = None,
    type: Optional[str] = None, maxReadyTime: Optional[int] = None,
    number: int = 12, db = None
) -> List[Dict[str, Any]]:
    if not settings.SPOONACULAR_API_KEY:
        logger.warning("search_recipes: SPOONACULAR_API_KEY is missing")
        return []
    
    params = {
        "apiKey": settings.SPOONACULAR_API_KEY, "query": query, "cuisine": cuisine,
        "diet": diet, "intolerances": intolerances, 
        "maxReadyTime": maxReadyTime, "number": number,
        "addRecipeNutrition": True, "addRecipeInformation": True, "fillIngredients": True,
        "sort": "healthiness",
    }

    # Map NutriVerse categories to Spoonacular filters
    if type == "healthcare":
        params["minHealthScore"] = 40
        if not query: params["query"] = "healthy"
    elif type == "fitness":
        params["minProtein"] = 25
        if not query: params["query"] = "high protein"
    elif type == "chef-special":
        params["sort"] = "popularity"
    elif type in VALID_SPOON_TYPES:
        params["type"] = type
    
    params = {k: v for k, v in params.items() if v is not None}
    key = f"search_{_cache_key(params)}"
    
    if db is not None:
        cached = await db.spoonacular_cache.find_one({"cache_key": key})
        if cached:
            return cached.get("recipes", [])
    try:
        resp = requests.get(f"{SPOONACULAR_BASE}/recipes/complexSearch", params=params, timeout=10)
        resp.raise_for_status()
        results = resp.json().get("results", [])
        if db is not None:
            await db.spoonacular_cache.update_one(
                {"cache_key": key},
                {"$set": {"cache_key": key, "recipes": results, "cached_at": datetime.now(timezone.utc).isoformat()}},
                upsert=True
            )
        return results
    except Exception as e:
        logger.error(f"Spoonacular search error: {e}")
        return []

def normalize_spoonacular_recipe(recipe: Dict[str, Any], category: str = "healthcare") -> Dict[str, Any]:
    nutrients = {}
    for n in (recipe.get("nutrition") or {}).get("nutrients", []):
        name = n.get("name", "").lower()
        amount = n.get("amount", 0)
        if "calorie" in name: nutrients["calories"] = round(amount)
        elif "protein" in name: nutrients["protein"] = round(amount, 1)
        elif "carbohydrate" in name: nutrients["carbs"] = round(amount, 1)
        elif name == "fat": nutrients["fat"] = round(amount, 1)
        elif "fiber" in name: nutrients["fiber"] = round(amount, 1)
        elif "sodium" in name: nutrients["sodium"] = round(amount)
    ingredients = [{"name": ing.get("name", ""), "amount": ing.get("amount", 0), "unit": ing.get("unit", "")} for ing in (recipe.get("extendedIngredients") or [])]
    steps = [step.get("step", "") for instruction in (recipe.get("analyzedInstructions") or []) for step in (instruction.get("steps") or [])]
    return {
        "id": f"sp-{recipe['id']}", "spoonacular_id": recipe["id"], "title": recipe.get("title", ""),
        "description": recipe.get("summary", "")[:200] if recipe.get("summary") else "",
        "image": recipe.get("image", ""), "category": category, "cuisine": (recipe.get("cuisines") or [""])[0],
        "prep_minutes": recipe.get("preparationMinutes") or 0, "cook_time": recipe.get("readyInMinutes") or 0,
        "servings": recipe.get("servings") or 1, "nutrition": nutrients, "ingredients": ingredients, "steps": steps,
        "tags": recipe.get("diets", []) + recipe.get("dishTypes", []), "source": "spoonacular",
        "source_url": recipe.get("sourceUrl", ""), "condition_tags": recipe.get("condition_tags", []),
        "why_this_works": recipe.get("why_this_works", {}),
    }
