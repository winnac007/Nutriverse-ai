"""
Import recipes from TheMealDB (free API) into MongoDB `recipes` collection.

Why this exists:
- Food.com (RAW_recipes.csv) gives 230K recipes but ZERO images and no real
  per-dish photos. TheMealDB ships a real, CC-licensed photo for every recipe
  (`strMealThumb`), so these become the "featured" set shown first in the UI.
- TheMealDB has no nutrition, so we enrich each recipe with Claude Haiku
  (batched, one-time, cheap). If ANTHROPIC_API_KEY is unset the import still
  succeeds — nutrition is left empty and flagged `nutrition_estimated=False`.

Run:
    cd backend && source venv/bin/activate
    python -m app.scripts.import_mealdb
"""
import json
import logging
import asyncio
import requests
from typing import List, Dict, Any
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

MEALDB_BASE = "https://www.themealdb.com/api/json/v1/1"

# TheMealDB `strArea` -> our app cuisine label (matches LOCATION_TO_CUISINE in recipe_service)
AREA_TO_CUISINE = {
    "Indian": "Indian", "Italian": "Italian", "French": "French",
    "Chinese": "Chinese", "Japanese": "Japanese", "Mexican": "Mexican",
    "Thai": "Thai", "Greek": "Greek", "Turkish": "Middle Eastern",
    "Vietnamese": "Vietnamese", "Spanish": "Spanish", "American": "American",
    "British": "British", "Canadian": "American", "Irish": "British",
    "Moroccan": "Middle Eastern", "Tunisian": "Middle Eastern",
    "Egyptian": "Middle Eastern", "Croatian": "European", "Dutch": "European",
    "Filipino": "Filipino", "Jamaican": "Caribbean", "Kenyan": "African",
    "Malaysian": "Malaysian", "Polish": "European", "Portuguese": "European",
    "Russian": "European", "Ukrainian": "European", "Uruguayan": "Latin American",
}

DIET_KEYWORDS = {"vegan", "vegetarian"}


def fetch_all_meals() -> List[Dict[str, Any]]:
    """Sweep search.php?f=a..z to pull every meal with full detail."""
    meals: Dict[str, Dict[str, Any]] = {}
    for letter in "abcdefghijklmnopqrstuvwxyz":
        try:
            resp = requests.get(f"{MEALDB_BASE}/search.php", params={"f": letter}, timeout=30)
            resp.raise_for_status()
            data = resp.json().get("meals") or []
            for m in data:
                meals[m["idMeal"]] = m
            logger.info("letter %s -> %d meals (total unique: %d)", letter, len(data), len(meals))
        except Exception as exc:
            logger.warning("fetch failed for letter %s: %s", letter, exc)
    return list(meals.values())


def normalize_meal(m: Dict[str, Any]) -> Dict[str, Any]:
    """Map a TheMealDB meal object to our local recipe schema."""
    ingredients = []
    for i in range(1, 21):
        name = (m.get(f"strIngredient{i}") or "").strip()
        measure = (m.get(f"strMeasure{i}") or "").strip()
        if name:
            ingredients.append({"name": name, "amount": 0, "unit": measure})

    instructions = (m.get("strInstructions") or "").strip()
    steps = [s.strip() for s in instructions.replace("\r", "").split("\n") if s.strip()]

    area = (m.get("strArea") or "").strip()
    cuisine = AREA_TO_CUISINE.get(area, area or "International")

    raw_tags = (m.get("strTags") or "")
    tags = [t.strip().lower() for t in raw_tags.split(",") if t.strip()]
    category = (m.get("strCategory") or "").strip()
    if category:
        tags.append(category.lower())

    diets = [t for t in tags if t in DIET_KEYWORDS]
    if category.lower() in {"vegetarian", "vegan"} and category.lower() not in diets:
        diets.append(category.lower())

    return {
        "id": f"mdb-{m['idMeal']}",
        "mealdb_id": m["idMeal"],
        "title": (m.get("strMeal") or "").strip(),
        "description": instructions[:200],
        "image": m.get("strMealThumb") or "",        # real, CC-licensed photo
        "category": "healthcare",
        "meal_category": category,
        "cuisine": cuisine,
        "prep_minutes": 0,
        "cook_time": 30,                              # MealDB has no time; sane default
        "servings": 2,
        "nutrition": {},                              # filled by enrichment step
        "nutrition_estimated": False,
        "ingredients": ingredients,
        "steps": steps,
        "tags": tags,
        "diets": diets,
        "intolerances": [],
        "youtube": m.get("strYoutube") or "",
        "source": "themealdb",
        "source_url": m.get("strSource") or f"https://www.themealdb.com/meal/{m['idMeal']}",
        "featured": True,                             # shown first in UI
    }


# Category-based nutrition estimates (per serving, USDA averages).
# Used as a fast offline fallback when AI enrichment is unavailable.
CATEGORY_NUTRITION = {
    "Beef":       {"calories": 380, "protein": 28.0, "carbs": 12.0, "fat": 22.0, "fiber": 1.5, "sodium": 520},
    "Chicken":    {"calories": 320, "protein": 32.0, "carbs": 14.0, "fat": 12.0, "fiber": 1.2, "sodium": 480},
    "Lamb":       {"calories": 360, "protein": 26.0, "carbs": 10.0, "fat": 22.0, "fiber": 1.0, "sodium": 500},
    "Pork":       {"calories": 350, "protein": 27.0, "carbs": 11.0, "fat": 20.0, "fiber": 1.0, "sodium": 510},
    "Seafood":    {"calories": 260, "protein": 28.0, "carbs": 10.0, "fat": 10.0, "fiber": 0.5, "sodium": 600},
    "Pasta":      {"calories": 400, "protein": 14.0, "carbs": 62.0, "fat": 10.0, "fiber": 3.0, "sodium": 420},
    "Vegetarian": {"calories": 280, "protein": 10.0, "carbs": 40.0, "fat": 9.0,  "fiber": 6.0, "sodium": 340},
    "Vegan":      {"calories": 260, "protein": 9.0,  "carbs": 42.0, "fat": 7.0,  "fiber": 7.0, "sodium": 310},
    "Dessert":    {"calories": 420, "protein": 5.0,  "carbs": 68.0, "fat": 15.0, "fiber": 1.5, "sodium": 200},
    "Breakfast":  {"calories": 340, "protein": 14.0, "carbs": 42.0, "fat": 12.0, "fiber": 3.0, "sodium": 460},
    "Side":       {"calories": 200, "protein": 5.0,  "carbs": 30.0, "fat": 7.0,  "fiber": 3.0, "sodium": 280},
    "Starter":    {"calories": 180, "protein": 7.0,  "carbs": 20.0, "fat": 8.0,  "fiber": 2.0, "sodium": 320},
    "Miscellaneous": {"calories": 300, "protein": 12.0, "carbs": 35.0, "fat": 12.0, "fiber": 2.5, "sodium": 400},
    "Goat":       {"calories": 310, "protein": 24.0, "carbs": 8.0,  "fat": 18.0, "fiber": 0.8, "sodium": 440},
}
DEFAULT_NUTRITION = {"calories": 320, "protein": 15.0, "carbs": 35.0, "fat": 12.0, "fiber": 2.5, "sodium": 420}


def enrich_nutrition_by_category(recipes: List[Dict[str, Any]]) -> None:
    """Assign per-serving nutrition estimates from a category lookup table (offline, instant)."""
    for r in recipes:
        cat = r.get("meal_category", "")
        r["nutrition"] = dict(CATEGORY_NUTRITION.get(cat, DEFAULT_NUTRITION))
        r["nutrition_estimated"] = True
    logger.info("Applied category-based nutrition estimates to %d recipes.", len(recipes))


async def import_mealdb():
    client = AsyncIOMotorClient(settings.MONGO_URL)
    db = client[settings.DB_NAME]
    collection = db.recipes

    # Only create non-text indexes here; text index already exists from import_recipes.py
    try:
        await collection.create_index([("featured", -1), ("cuisine", 1)])
    except Exception as e:
        logger.warning("Index creation warning (non-fatal): %s", e)

    raw = fetch_all_meals()
    logger.info("fetched %d meals from TheMealDB", len(raw))
    recipes = [normalize_meal(m) for m in raw if m.get("idMeal")]

    enrich_nutrition_by_category(recipes)

    count = 0
    for r in recipes:
        await collection.update_one({"id": r["id"]}, {"$set": r}, upsert=True)
        count += 1
    logger.info("Imported %d TheMealDB recipes (featured).", count)


if __name__ == "__main__":
    asyncio.run(import_mealdb())
