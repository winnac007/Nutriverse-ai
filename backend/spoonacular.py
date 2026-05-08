"""
Spoonacular API client with MongoDB caching.

Free tier: 150 points/day.
complexSearch with addRecipeNutrition=true costs ~1.3 points per call.
Individual recipe details cost ~1 point each.
Caching ensures each unique recipe is fetched only once.
"""

import os
import hashlib
import json
import logging
from datetime import datetime, timezone, timedelta
from typing import Any, Dict, List, Optional

import requests

SPOONACULAR_API_KEY = os.environ.get("SPOONACULAR_API_KEY", "")
SPOONACULAR_BASE = "https://api.spoonacular.com"
CACHE_TTL_DAYS = 30  # cache recipes for 30 days

logger = logging.getLogger(__name__)

# ── Location → Spoonacular cuisine mapping ────────────────────────────────────
LOCATION_TO_CUISINE = {
    "india": "Indian",
    "indian": "Indian",
    "italy": "Italian",
    "italian": "Italian",
    "france": "French",
    "french": "French",
    "china": "Chinese",
    "chinese": "Chinese",
    "japan": "Japanese",
    "japanese": "Japanese",
    "mexico": "Mexican",
    "mexican": "Mexican",
    "thailand": "Thai",
    "thai": "Thai",
    "greece": "Greek",
    "greek": "Greek",
    "lebanon": "Middle Eastern",
    "turkish": "Middle Eastern",
    "turkey": "Middle Eastern",
    "vietnam": "Vietnamese",
    "korea": "Korean",
    "spanish": "Spanish",
    "spain": "Spanish",
    "american": "American",
    "usa": "American",
    "us": "American",
    "british": "British",
    "uk": "British",
    "german": "German",
    "germany": "German",
}

# ── App cuisine IDs → Spoonacular cuisine names ───────────────────────────────
APP_CUISINE_TO_SPOONACULAR = {
    "indian": "Indian",
    "mediterranean": "Mediterranean",
    "east-asian": "Chinese,Japanese,Korean",
    "continental": "European",
    "middle-eastern": "Middle Eastern",
    "mexican": "Mexican",
    "african": "African",
    "american": "American",
}

# ── Dietary type → Spoonacular diet param ────────────────────────────────────
DIETARY_TO_SPOONACULAR = {
    "vegetarian": "vegetarian",
    "vegan": "vegan",
    "eggetarian": "vegetarian",   # closest Spoonacular equivalent
    "non-vegetarian": "",          # no restriction
}

# ── Allergy → Spoonacular intolerances ───────────────────────────────────────
ALLERGY_TO_INTOLERANCE = {
    "lactose":   "dairy",
    "Lactose":   "dairy",
    "gluten":    "gluten",
    "Gluten":    "gluten",
    "nuts":      "tree nut,peanut",
    "Nuts":      "tree nut,peanut",
    "shellfish": "shellfish",
    "Shellfish": "shellfish",
}

# ── Cooking ability → maxReadyTime (minutes) ─────────────────────────────────
COOKING_TO_MAX_TIME = {
    "full":     60,
    "quick":    20,
    "eat-out":  30,
    "minimal":  20,
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
    """Build Spoonacular complexSearch query params from user profile."""
    params: Dict[str, Any] = {
        "apiKey": SPOONACULAR_API_KEY,
        "number": 20,
        "addRecipeNutrition": True,
        "addRecipeInformation": True,
        "fillIngredients": True,
        "instructionsRequired": True,
        "sort": "healthiness",
        "sortDirection": "desc",
    }

    # Cuisine: preferred cuisines > location fallback
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

    # Diet
    dietary_type = user.get("dietary_type", "")
    spoon_diet = DIETARY_TO_SPOONACULAR.get(dietary_type, "")
    if spoon_diet:
        params["diet"] = spoon_diet

    # Intolerances from allergies
    allergies = user.get("allergies") or []
    intolerances = []
    for allergy in allergies:
        mapped = ALLERGY_TO_INTOLERANCE.get(allergy, "")
        if mapped:
            intolerances.extend(mapped.split(","))
    if intolerances:
        params["intolerances"] = ",".join(set(intolerances))

    # Disliked ingredients → excludeIngredients
    disliked = prefs.get("disliked_ingredients", [])
    if disliked:
        # Clean up compound names to first word for API compatibility
        exclude = [d.split("/")[0].strip().lower() for d in disliked]
        params["excludeIngredients"] = ",".join(exclude)

    # Max ready time from cooking ability
    cooking_ability = user.get("cooking_ability", "quick")
    max_time = COOKING_TO_MAX_TIME.get(cooking_ability, 30)
    params["maxReadyTime"] = max_time

    # Spice level (Spoonacular doesn't have a direct param, but we can use tags)
    spice_level = prefs.get("spice_level", "medium")
    if spice_level == "mild":
        params["excludeIngredients"] = (params.get("excludeIngredients", "") + ",chili,jalapeño,cayenne").strip(",")

    return params


def _cache_key(params: Dict[str, Any]) -> str:
    """Generate a stable cache key from query params (excluding apiKey)."""
    safe = {k: v for k, v in params.items() if k != "apiKey"}
    serialized = json.dumps(safe, sort_keys=True)
    return hashlib.sha256(serialized.encode()).hexdigest()[:32]


async def fetch_personalized_recipes(user: Dict[str, Any], db) -> List[Dict[str, Any]]:
    """
    Fetch recipes from Spoonacular (or MongoDB cache) personalised for the user.
    Returns list of Spoonacular recipe objects with nutrition info.
    """
    if not SPOONACULAR_API_KEY:
        logger.warning("SPOONACULAR_API_KEY not set — returning empty list")
        return []

    params = _build_query_params(user)
    key = _cache_key(params)

    # Check cache
    cached = await db.spoonacular_cache.find_one({"cache_key": key}, {"_id": 0})
    if cached:
        cached_at = datetime.fromisoformat(cached["cached_at"])
        age = datetime.now(timezone.utc) - cached_at.replace(tzinfo=timezone.utc)
        if age < timedelta(days=CACHE_TTL_DAYS):
            logger.info("Spoonacular cache hit: %s", key)
            return cached.get("recipes", [])

    # Call Spoonacular
    try:
        resp = requests.get(
            f"{SPOONACULAR_BASE}/recipes/complexSearch",
            params=params,
            timeout=15,
        )
        resp.raise_for_status()
        data = resp.json()
        recipes = data.get("results", [])
        logger.info("Spoonacular returned %d recipes for key %s", len(recipes), key)
    except Exception as exc:
        logger.error("Spoonacular API error: %s", exc)
        return []

    # Store in cache
    await db.spoonacular_cache.update_one(
        {"cache_key": key},
        {"$set": {
            "cache_key": key,
            "recipes": recipes,
            "cached_at": datetime.now(timezone.utc).isoformat(),
            "query_params": {k: v for k, v in params.items() if k != "apiKey"},
        }},
        upsert=True,
    )

    return recipes


def normalize_spoonacular_recipe(recipe: Dict[str, Any]) -> Dict[str, Any]:
    """
    Convert a Spoonacular recipe object to the app's internal recipe format
    so the frontend RecipeCard component can render it without changes.
    """
    # Extract nutrition
    nutrients = {}
    for n in (recipe.get("nutrition") or {}).get("nutrients", []):
        name = n.get("name", "").lower()
        amount = n.get("amount", 0)
        unit = n.get("unit", "")
        if "calorie" in name:
            nutrients["calories"] = round(amount)
        elif "protein" in name:
            nutrients["protein"] = round(amount, 1)
        elif "carbohydrate" in name:
            nutrients["carbs"] = round(amount, 1)
        elif name == "fat":
            nutrients["fat"] = round(amount, 1)
        elif "fiber" in name:
            nutrients["fiber"] = round(amount, 1)
        elif "sodium" in name:
            nutrients["sodium"] = round(amount)

    # Extract ingredients
    ingredients = [
        {"name": ing.get("name", ""), "amount": ing.get("amount", 0), "unit": ing.get("unit", "")}
        for ing in (recipe.get("extendedIngredients") or [])
    ]

    # Extract steps
    steps = []
    for instruction in (recipe.get("analyzedInstructions") or []):
        for step in (instruction.get("steps") or []):
            steps.append(step.get("step", ""))

    return {
        "id": f"sp-{recipe['id']}",
        "spoonacular_id": recipe["id"],
        "title": recipe.get("title", ""),
        "description": recipe.get("summary", "")[:200] if recipe.get("summary") else "",
        "image": recipe.get("image", ""),
        "category": "healthcare",
        "cuisine": (recipe.get("cuisines") or [""])[0],
        "prep_minutes": recipe.get("preparationMinutes") or 0,
        "cook_time": recipe.get("readyInMinutes") or 0,
        "servings": recipe.get("servings") or 1,
        "nutrition": nutrients,
        "ingredients": ingredients,
        "steps": steps,
        "tags": recipe.get("diets", []) + recipe.get("dishTypes", []),
        "source": "spoonacular",
        "source_url": recipe.get("sourceUrl", ""),
        "condition_tags": recipe.get("condition_tags", []),
        "why_this_works": recipe.get("why_this_works", {}),
    }
