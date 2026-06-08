import os
import csv
import json
import ast
import asyncio
import logging
import requests
from typing import List, Dict, Any
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# CSV columns: name,id,minutes,contributor_id,submitted,tags,nutrition,n_steps,steps,description,ingredients,n_ingredients
# nutrition: [calories (kcal), total fat (PDV), sugar (PDV), sodium (PDV), protein (PDV), saturated fat (PDV), carbohydrates (PDV)]

USDA_BASE_URL = "https://api.nal.usda.gov/fdc/v1"

async def enrich_nutrition_usda(ingredients: List[str]) -> Dict[str, float]:
    """
    Enriches recipe with nutrition data from USDA FoodData Central.
    This is a simplified version. A production version would cache ingredient-level nutrition.
    """
    if not settings.USDA_API_KEY:
        return {}

    # Placeholder: In a real implementation, you'd iterate through ingredients,
    # fetch data for each, and aggregate. For brevity, we'll return a sample or 
    # use the data provided in the Food.com dataset if available.
    return {}

# FDA Daily Values — used to convert Food.com's % Daily Value back to absolute units.
# Food.com stores everything except calories as PDV (% of these), NOT grams.
FDA_DAILY_VALUES = {
    "fat": 78.0,            # g
    "sugar": 50.0,          # g
    "sodium": 2300.0,       # mg
    "protein": 50.0,        # g
    "saturated_fat": 20.0,  # g
    "carbs": 275.0,         # g
}


def parse_nutrition(nutr_str: str) -> Dict[str, float]:
    """
    Parses Food.com nutrition string and converts PDV -> absolute units:
    [calories (kcal), total fat (PDV), sugar (PDV), sodium (PDV),
     protein (PDV), saturated fat (PDV), carbohydrates (PDV)]
    Only calories is already absolute (kcal). The rest are % Daily Value,
    so grams = PDV/100 * FDA daily value. (sodium is mg.)
    """
    try:
        vals = ast.literal_eval(nutr_str)
        if not isinstance(vals, list) or len(vals) < 7:
            return {}
        return {
            "calories": round(float(vals[0])),
            "fat": round(float(vals[1]) / 100 * FDA_DAILY_VALUES["fat"], 1),
            "sugar": round(float(vals[2]) / 100 * FDA_DAILY_VALUES["sugar"], 1),
            "sodium": round(float(vals[3]) / 100 * FDA_DAILY_VALUES["sodium"]),
            "protein": round(float(vals[4]) / 100 * FDA_DAILY_VALUES["protein"], 1),
            "saturated_fat": round(float(vals[5]) / 100 * FDA_DAILY_VALUES["saturated_fat"], 1),
            "carbs": round(float(vals[6]) / 100 * FDA_DAILY_VALUES["carbs"], 1),
        }
    except Exception:
        return {}

async def import_recipes(csv_path: str):
    client = AsyncIOMotorClient(settings.MONGO_URL)
    db = client[settings.DB_NAME]
    collection = db.recipes

    await collection.create_index([("title", "text"), ("tags", "text"), ("cuisine", 1)])
    await collection.create_index([("nutrition.calories", 1), ("cuisine", 1), ("cook_time", 1)])
    # separate indexes — MongoDB forbids compound index on two array fields
    await collection.create_index([("diets", 1)])
    await collection.create_index([("intolerances", 1)])

    if not os.path.exists(csv_path):
        logger.error(f"File not found: {csv_path}")
        return

    count = 0
    with open(csv_path, mode='r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            try:
                recipe_id = f"local-{row['id']}"
                
                # Basic parsing
                tags = ast.literal_eval(row['tags'])
                steps = ast.literal_eval(row['steps'])
                ingredients_list = ast.literal_eval(row['ingredients'])
                nutrition_data = parse_nutrition(row['nutrition'])

                # Cuisine classification (placeholder logic)
                cuisine = "International"
                for tag in tags:
                    if "indian" in tag: cuisine = "Indian"
                    elif "mexican" in tag: cuisine = "Mexican"
                    elif "italian" in tag: cuisine = "Italian"
                    # Add more mappings as needed

                recipe = {
                    "id": recipe_id,
                    "local_id": row['id'],
                    "title": row['name'].title(),
                    "description": row['description'][:200] if row['description'] else "",
                    "image": "",  # Food.com dataset has no images; source.unsplash.com is dead. Frontend falls back. Enrich later.
                    "category": "healthcare", # Default category to match expected normalized schema
                    "cuisine": cuisine,
                    "featured": False,  # long-tail; MealDB (featured) recipes surface first
                    "prep_minutes": 0,
                    "cook_time": int(row['minutes']),
                    "servings": 1,
                    "nutrition": nutrition_data,
                    "ingredients": [{"name": ing, "amount": 0, "unit": ""} for ing in ingredients_list],
                    "steps": steps,
                    "tags": tags,
                    "diets": [t for t in tags if t in ["vegan", "vegetarian", "paleo", "keto"]],
                    "source": "food.com",
                    "source_url": f"https://www.food.com/recipe/{row['id']}",
                    "created_at": row['submitted']
                }

                await collection.update_one(
                    {"id": recipe_id},
                    {"$set": recipe},
                    upsert=True
                )
                
                count += 1
                if count % 100 == 0:
                    logger.info(f"Imported {count} recipes...")

            except Exception as e:
                logger.error(f"Error parsing row {row.get('id')}: {e}")

    logger.info(f"Successfully imported {count} recipes.")

if __name__ == "__main__":
    csv_file = "../archive/RAW_recipes.csv" # Adjusted path to point to the archive folder
    asyncio.run(import_recipes(csv_file))
