from typing import Optional
from fastapi import APIRouter, HTTPException
from app.services.recipe_service import search_recipes, normalize_spoonacular_recipe
from app.data.seed_data import get_all_recipes, get_recipe
from app.core.config import settings
from app.core.database import db

router = APIRouter(prefix="/recipes", tags=["recipes"])

@router.get("")
async def list_recipes(
    category: Optional[str] = None,
    country: Optional[str] = None,
    region: Optional[str] = None,
    condition: Optional[str] = None,
    goal: Optional[str] = None,
    tag: Optional[str] = None,
    tier: Optional[str] = None,
    budget: Optional[str] = None,
    search: Optional[str] = None,
):
    active_category = category if category and category != "all" else "healthcare"

    if settings.SPOONACULAR_API_KEY:
        spoon_results = await search_recipes(
            query=search or condition or goal,
            cuisine=country or region,
            type=category if category != "all" else None,
            number=20,
            db=db
        )
        if spoon_results:
            normalized = [normalize_spoonacular_recipe(r, category=active_category) for r in spoon_results]
            if tier and tier != "all":
                normalized = [r for r in normalized if r.get("tier") == tier]
            if budget and budget != "all":
                try:
                    b_val = int(budget)
                    normalized = [r for r in normalized if (r.get("nutrition", {}).get("calories") or 0) <= b_val * 2]
                except: pass
            return normalized

    recipes = get_all_recipes()
    if category and category != "all":
        recipes = [r for r in recipes if r["category"] == category]
    if country and country != "all":
        recipes = [r for r in recipes if r.get("country", "").lower() == country.lower()]
    if region and region != "all":
        recipes = [r for r in recipes if region.lower() in r.get("region", "").lower()]
    if condition:
        recipes = [r for r in recipes if condition in r.get("conditions", [])]
    if goal:
        recipes = [r for r in recipes if goal in r.get("goals", [])]
    if tag:
        recipes = [r for r in recipes if tag in r.get("tags", [])]
    if tier and tier != "all":
        recipes = [r for r in recipes if r.get("tier") == tier]
    if budget and budget != "all":
        try:
            budget_val = int(budget)
            recipes = [r for r in recipes if (r.get("cost_per_serving") or 0) <= budget_val or r.get("tier") == "budget"]
        except ValueError: pass
    if search:
        s = search.lower()
        recipes = [r for r in recipes if s in r["title"].lower()
                   or s in r.get("description", "").lower()
                   or s in r.get("region", "").lower()
                   or s in r.get("country", "").lower()
                   or s in r.get("cuisine", "").lower()]
    return recipes

@router.get("/countries")
async def list_countries():
    return sorted({r.get("country") for r in get_all_recipes() if r.get("country")})

@router.get("/regions")
async def list_regions(country: Optional[str] = None):
    pool = get_all_recipes()
    if country:
        pool = [r for r in pool if r.get("country", "").lower() == country.lower()]
    return sorted({r.get("region") for r in pool if r.get("region")})

@router.get("/{recipe_id}")
async def recipe_detail(recipe_id: str):
    recipe = get_recipe(recipe_id)
    if not recipe: raise HTTPException(404, "Recipe not found")
    return recipe
