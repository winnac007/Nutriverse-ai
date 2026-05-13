from typing import Optional
from fastapi import APIRouter, HTTPException
from app.services.recipe_service import (
    search_recipes, normalize_spoonacular_recipe, get_spoonacular_recipe_by_id
)
from app.core.config import settings
from app.core.database import db

router = APIRouter(prefix="/recipes", tags=["recipes"])

# Cuisines supported by Spoonacular — used for country/cuisine dropdown
SPOONACULAR_CUISINES = [
    "African", "American", "British", "Cajun", "Caribbean", "Chinese",
    "Eastern European", "European", "French", "German", "Greek", "Indian",
    "Irish", "Italian", "Japanese", "Jewish", "Korean", "Latin American",
    "Mediterranean", "Mexican", "Middle Eastern", "Nordic", "Southern",
    "Spanish", "Thai", "Vietnamese",
]

# Sub-regions per cuisine (UI convenience, no API filtering)
CUISINE_REGIONS: dict[str, list[str]] = {
    "Indian": ["North Indian", "South Indian", "Bengali", "Gujarati", "Punjabi", "Rajasthani"],
    "Chinese": ["Cantonese", "Sichuan", "Hunan", "Shanghainese"],
    "Italian": ["Sicilian", "Neapolitan", "Venetian", "Roman"],
    "Mexican": ["Oaxacan", "Yucatecan", "Jalisco"],
    "Japanese": ["Tokyo", "Osaka", "Kyoto"],
    "American": ["Southern", "Cajun", "New England", "Tex-Mex"],
}


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
    offset: int = 0,
):
    if not settings.SPOONACULAR_API_KEY:
        raise HTTPException(503, "Recipe search unavailable: Spoonacular API key not configured")

    active_category = category if category and category != "all" else "healthcare"

    DIET_TAGS = {"vegetarian", "vegan", "gluten-free", "dairy-free", "pescatarian"}
    diet_param = tag if tag and tag.lower() in DIET_TAGS else None

    # Use country/region as cuisine filter; region overrides when it maps cleanly
    cuisine = None
    if country and country != "all":
        cuisine = country
    if region and region != "all":
        cuisine = region  # Spoonacular accepts sub-region names as cuisine strings

    spoon_results = await search_recipes(
        query=search or condition or goal,
        cuisine=cuisine,
        type=category if category and category != "all" else None,
        diet=diet_param,
        number=20,
        offset=offset,
        db=db,
    )

    if not spoon_results:
        return []

    normalized = [normalize_spoonacular_recipe(r, category=active_category) for r in spoon_results]

    if tier and tier != "all":
        normalized = [r for r in normalized if r.get("tier") == tier]

    # Non-diet tags filtered locally
    if tag and tag.lower() not in DIET_TAGS:
        normalized = [r for r in normalized if tag.lower() in [t.lower() for t in r.get("tags", [])]]

    # Budget → calorie band proxy (Spoonacular has no cost data)
    if budget and budget != "all":
        try:
            b_val = int(budget)
            calorie_cap = {100: 600, 200: 1200}.get(b_val)
            if calorie_cap:
                normalized = [r for r in normalized if (r.get("nutrition", {}).get("calories") or 0) <= calorie_cap]
        except (ValueError, TypeError):
            pass

    return normalized[:12]


@router.get("/countries")
async def list_countries():
    return SPOONACULAR_CUISINES


@router.get("/regions")
async def list_regions(country: Optional[str] = None):
    if not country:
        return []
    return CUISINE_REGIONS.get(country, [])


@router.get("/{recipe_id}")
async def recipe_detail(recipe_id: str):
    if not recipe_id.startswith("sp-"):
        raise HTTPException(404, "Recipe not found")
    try:
        spoon_id = int(recipe_id[3:])
    except ValueError:
        raise HTTPException(404, "Invalid recipe id")

    raw = await get_spoonacular_recipe_by_id(spoon_id, db)
    if not raw:
        raise HTTPException(404, "Recipe not found")
    return normalize_spoonacular_recipe(raw)
