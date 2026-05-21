from fastapi import APIRouter, Depends, HTTPException
from app.models.schema import SaveMealPlan, MealSwapRequest, UpdateMealRequest
from app.core.database import db
from app.core.security import get_current_user
from app.services.recipe_service import search_recipes, normalize_spoonacular_recipe, get_spoonacular_recipe_by_id, get_recipe_by_id
from datetime import datetime, timezone, timedelta
from typing import Dict

router = APIRouter(prefix="/meal-plan", tags=["meal-plans"])

@router.get("")
async def get_meal_plan(user=Depends(get_current_user)):
    plan = await db.meal_plans.find_one({"user_id": user["id"]}, {"_id": 0})
    if not plan: return {"user_id": user["id"], "items": []}
    needs_refresh = bool(plan.get("invalidated"))
    if not needs_refresh and plan.get("updated_at"):
        try:
            updated = datetime.fromisoformat(plan["updated_at"].replace("Z", "+00:00"))
            if datetime.now(timezone.utc) - updated > timedelta(days=7): needs_refresh = True
        except: pass
    plan["needs_refresh"] = needs_refresh
    return plan

@router.post("")
async def save_meal_plan(body: SaveMealPlan, user=Depends(get_current_user)):
    doc = {
        "user_id": user["id"], "items": [i.model_dump() for i in body.items],
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.meal_plans.update_one({"user_id": user["id"]}, {"$set": doc}, upsert=True)
    return doc

@router.post("/swap")
async def meal_swap(body: MealSwapRequest, user=Depends(get_current_user)):
    # Resolve current recipe to get its calorie target
    target_cal = 400
    recipe = await get_recipe_by_id(body.current_recipe_id, db)
    if recipe:
        if recipe.get("source") == "spoonacular":
            recipe = normalize_spoonacular_recipe(recipe)
        target_cal = recipe.get("nutrition", {}).get("calories") or 400
        
    cal_lo, cal_hi = target_cal * 0.85, target_cal * 1.15
    conditions = user.get("conditions") or ([user["condition"]] if user.get("condition") else [])
    
    # Search local recipes for swap candidates
    query = conditions[0] if conditions else "healthy"
    raw_pool = await search_recipes(query=query, number=20, db=db)
    plan = await db.meal_plans.find_one({"user_id": user["id"]}, {"_id": 0})
    used_ids = {item["recipe_id"] for item in (plan or {}).get("items", [])}
    used_ids.discard(body.current_recipe_id)
    
    candidates = []
    for r in raw_pool:
        if r.get("source") == "spoonacular":
            normalized = normalize_spoonacular_recipe(r)
        else:
            normalized = r
            
        if normalized["id"] == body.current_recipe_id or normalized["id"] in used_ids: continue
        cal = normalized.get("nutrition", {}).get("calories", 0)
        if cal and not (cal_lo <= cal <= cal_hi): continue
        candidates.append(normalized)
    return candidates[:3]

@router.put("/update-meal")
async def update_meal(body: UpdateMealRequest, user=Depends(get_current_user)):
    plan = await db.meal_plans.find_one({"user_id": user["id"]}, {"_id": 0})
    if not plan: raise HTTPException(404, "No meal plan found")
    items = plan.get("items", [])
    updated = False
    for item in items:
        if item["day"] == body.day and item["meal_type"] == body.meal_type:
            item["recipe_id"] = body.recipe_id
            item["swapped"] = True
            updated = True
            break
    if not updated: items.append({"day": body.day, "meal_type": body.meal_type, "recipe_id": body.recipe_id, "swapped": True})
    await db.meal_plans.update_one({"user_id": user["id"]}, {"$set": {"items": items, "updated_at": datetime.now(timezone.utc).isoformat()}})
    return {"ok": True, "updated": updated}

@router.get("/grocery-list")
async def grocery_list(user=Depends(get_current_user)):
    plan = await db.meal_plans.find_one({"user_id": user["id"]}, {"_id": 0})
    if plan and plan.get("grocery_list"):
        raw = plan["grocery_list"]
        CATEGORY_KEYWORDS = {
            "Produce": ["spinach", "tomato", "onion", "garlic", "lemon", "ginger", "carrot", "cucumber", "broccoli", "apple", "banana", "berry", "pepper", "potato", "avocado", "capsicum"],
            "Protein": ["chicken", "fish", "salmon", "egg", "tofu", "lentil", "dal", "beans", "chickpea", "paneer", "tuna"],
            "Grains": ["rice", "quinoa", "oat", "bread", "pasta", "wheat", "roti", "millet"],
            "Dairy": ["milk", "yogurt", "curd", "ghee", "butter", "cheese"],
            "Oils & Condiments": ["olive oil", "oil", "vinegar", "soy sauce", "mustard", "honey", "salt", "pepper", "cumin", "turmeric", "spice"],
            "Nuts & Seeds": ["walnut", "almond", "cashew", "peanut", "seed", "flaxseed"],
        }
        grouped = {cat: [] for cat in CATEGORY_KEYWORDS}
        grouped["Other"] = []
        for item in raw:
            item_lower = item.lower()
            placed = False
            for cat, keywords in CATEGORY_KEYWORDS.items():
                if any(kw in item_lower for kw in keywords):
                    grouped[cat].append(item)
                    placed = True
                    break
            if not placed: grouped["Other"].append(item)
        return {k: v for k, v in grouped.items() if v}
    if not plan or not plan.get("items"): return {}
    recipe_ids = list({item["recipe_id"] for item in plan["items"]})
    ingredient_map: Dict[str, list] = {}
    for rid in recipe_ids:
        recipe = await get_recipe_by_id(rid, db)
        if recipe and recipe.get("source") == "spoonacular":
            recipe = normalize_spoonacular_recipe(recipe)
            
        if not recipe: continue
        for ing in recipe.get("ingredients", []):
            name = ing.get("name", "")
            amt = ing.get("amount", "")
            key = name.lower()
            if key not in ingredient_map: ingredient_map[key] = {"name": name, "amounts": []}
            ingredient_map[key]["amounts"].append(str(amt))
    return {"All Ingredients": [f"{v['name']} ({', '.join(v['amounts'][:2])})" for v in ingredient_map.values()]}
