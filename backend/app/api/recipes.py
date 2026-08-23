from typing import Any, Dict, Iterable, List, Optional

from fastapi import APIRouter, HTTPException

from app.core.database import db
from app.data.culinary_recipes import get_curated_recipe, search_curated_recipes
from app.services.recipe_service import (
    get_recipe_by_id,
    get_spoonacular_recipe_by_id,
    normalize_spoonacular_recipe,
    search_recipes,
)

router = APIRouter(prefix="/recipes", tags=["recipes"])

# Cuisines supported by Spoonacular — used for country/cuisine dropdown
SPOONACULAR_CUISINES = [
    "African",
    "American",
    "British",
    "Cajun",
    "Caribbean",
    "Chinese",
    "Eastern European",
    "European",
    "French",
    "German",
    "Greek",
    "Indian",
    "Irish",
    "Italian",
    "Japanese",
    "Jewish",
    "Korean",
    "Latin American",
    "Mediterranean",
    "Mexican",
    "Middle Eastern",
    "Nordic",
    "Southern",
    "Spanish",
    "Thai",
    "Vietnamese",
    "International",
]

# Sub-regions per cuisine (UI convenience, no API filtering)
CUISINE_REGIONS: dict[str, list[str]] = {
    "Indian": [
        "North India",
        "South India",
        "East India",
        "West India",
        "North-East India",
        "Central India",
    ],
    "Chinese": ["Cantonese", "Sichuan", "Hunan", "Shanghainese"],
    "Italian": ["Tuscany", "Sicily", "Campania", "Veneto"],
    "Mexican": ["Oaxaca", "Yucatan", "Jalisco", "Central Mexico"],
    "Japanese": ["Kanto", "Kansai", "Kyushu", "Hokkaido"],
    "Thai": ["Northern Thailand", "Isan", "Central Thailand", "Southern Thailand"],
    "Mediterranean": ["Aegean", "Levant", "Iberian Coast", "North African Coast"],
    "Korean": ["Seoul and Gyeonggi", "Jeonju", "Gyeongsang", "Jeju"],
    "Middle Eastern": ["Marrakech-Safi", "Fez-Meknes", "Rif", "Atlantic Coast"],
    "International": ["Global Crossroads"],
    "American": ["Southern", "Cajun", "New England", "Tex-Mex"],
}


def _normalize_recipes(
    recipes: Iterable[Dict[str, Any]], category: str
) -> List[Dict[str, Any]]:
    normalized: List[Dict[str, Any]] = []
    for recipe in recipes:
        item = dict(recipe)
        if "_id" in item:
            item["_id"] = str(item["_id"])
        if item.get("source") == "spoonacular" and (
            isinstance(item.get("id"), int) or "extendedIngredients" in item
        ):
            normalized.append(normalize_spoonacular_recipe(item, category=category))
        else:
            normalized.append(item)
    return normalized


def _merge_unique_recipes(
    *groups: Iterable[Dict[str, Any]], limit: int = 12
) -> List[Dict[str, Any]]:
    merged: List[Dict[str, Any]] = []
    seen: set[str] = set()
    for group in groups:
        for recipe in group:
            recipe_id = str(recipe.get("id") or "")
            if not recipe_id or recipe_id in seen:
                continue
            seen.add(recipe_id)
            merged.append(recipe)
            if len(merged) == limit:
                return merged
    return merged


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
    active_category = category if category and category != "all" else "healthcare"

    DIET_TAGS = {"vegetarian", "vegan", "gluten-free", "dairy-free", "pescatarian"}
    diet_param = tag if tag and tag.lower() in DIET_TAGS else None

    # Mongo/Spoonacular recipes use cuisine labels. Curated recipes additionally
    # understand first-class region/state labels.
    cuisine = country if country and country != "all" else None
    active_region = region if region and region != "all" else None
    database_cuisine = cuisine or active_region

    results = await search_recipes(
        query=search or condition or goal,
        cuisine=database_cuisine,
        type=category if category and category != "all" else None,
        diet=diet_param,
        number=20,
        offset=offset,
        db=db,
    )

    # Local recipes are already normalized, but cached Spoonacular documents may
    # still need conversion to the public recipe contract.
    normalized = _normalize_recipes(results, active_category)

    if active_region:
        expected_region = active_region.strip().lower()
        normalized = [
            recipe
            for recipe in normalized
            if expected_region
            in {
                str(recipe.get("region") or "").strip().lower(),
                str(recipe.get("region_slug") or "").strip().lower(),
                str(recipe.get("state") or "").strip().lower(),
                str(recipe.get("state_slug") or "").strip().lower(),
            }
        ]

    if tier == "budget":
        normalized = [
            recipe
            for recipe in normalized
            if recipe.get("tier") in (None, "free", "budget")
            and not recipe.get("is_premium")
        ]
    elif tier == "premium":
        normalized = [
            recipe
            for recipe in normalized
            if recipe.get("tier") == "premium" or recipe.get("is_premium")
        ]

    # Non-diet tags filtered locally
    if tag and tag.lower() not in DIET_TAGS:
        normalized = [
            r
            for r in normalized
            if tag.lower() in [t.lower() for t in r.get("tags", [])]
        ]

    # Budget → calorie band proxy
    if budget and budget != "all":
        try:
            b_val = int(budget)
            calorie_cap = {100: 600, 200: 1200}.get(b_val)
            if calorie_cap:
                normalized = [
                    r
                    for r in normalized
                    if (r.get("nutrition", {}).get("calories") or 0) <= calorie_cap
                ]
        except (ValueError, TypeError):
            pass

    diet_tag = tag if tag and tag.lower() in DIET_TAGS else None
    content_tag = tag if tag and tag.lower() not in DIET_TAGS else None
    calorie_cap = None
    if budget and budget != "all":
        try:
            calorie_cap = {100: 600, 200: 1200}.get(int(budget))
        except (ValueError, TypeError):
            calorie_cap = None

    curated = []
    if offset == 0:
        curated = search_curated_recipes(
            query=search or condition or goal,
            cuisine=cuisine,
            region=active_region,
            category=category if category and category != "all" else None,
            diet=diet_tag,
            tag=content_tag,
            tier=None if tier == "budget" else tier,
            max_calories=calorie_cap,
        )
        if tier == "budget":
            curated = [recipe for recipe in curated if not recipe.get("is_premium")]

    # For an explicit culinary search, surface matching editorial recipes first;
    # otherwise keep live/database ordering and use curated recipes as fallbacks.
    if search or cuisine or active_region:
        return _merge_unique_recipes(curated, normalized)
    return _merge_unique_recipes(normalized, curated)


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
    curated = get_curated_recipe(recipe_id)
    if curated:
        return curated

    # Support both local- and sp- prefixes
    recipe = await get_recipe_by_id(recipe_id, db)

    if not recipe and recipe_id.startswith("sp-"):
        # Fallback for legacy numeric IDs if needed
        try:
            spoon_id = int(recipe_id[3:])
            recipe = await get_spoonacular_recipe_by_id(spoon_id, db)
        except ValueError:
            pass

    if not recipe:
        raise HTTPException(404, "Recipe not found")

    if "_id" in recipe:
        recipe["_id"] = str(recipe["_id"])

    if recipe.get("source") == "spoonacular" and (
        isinstance(recipe.get("id"), int) or "extendedIngredients" in recipe
    ):
        return normalize_spoonacular_recipe(recipe)

    return recipe
