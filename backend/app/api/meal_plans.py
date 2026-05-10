from fastapi import APIRouter, Depends, HTTPException
from app.models.schema import SaveMealPlan, MealSwapRequest, UpdateMealRequest
from app.core.database import db
from app.core.security import get_current_user
from app.data.seed_data import get_all_recipes, get_recipe
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
    current = get_recipe(body.current_recipe_id)
    target_cal = (current["nutrition"]["calories"] if current else 400)
    cal_lo, cal_hi = target_cal * 0.85, target_cal * 1.15
    conditions = user.get("conditions") or ([user["condition"]] if user.get("condition") else [])
    pool = get_all_recipes()
    plan = await db.meal_plans.find_one({"user_id": user["id"]}, {"_id": 0})
    used_ids = {item["recipe_id"] for item in (plan or {}).get("items", [])}
    used_ids.discard(body.current_recipe_id)
    candidates = []
    for r in pool:
        if r["id"] == body.current_recipe_id or r["id"] in used_ids: continue
        cal = r.get("nutrition", {}).get("calories", 0)
        if not (cal_lo <= cal <= cal_hi): continue
        if conditions and not any(c in r.get("conditions", []) for c in conditions): continue
        candidates.append(r)
    candidates.sort(key=lambda r: sum(1 for c in conditions if c in r.get("conditions", [])), reverse=True)
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
        recipe = get_recipe(rid)
        if not recipe: continue
        for ing in recipe.get("ingredients", []):
            name = ing.get("name", "")
            amt = ing.get("amount", "")
            key = name.lower()
            if key not in ingredient_map: ingredient_map[key] = {"name": name, "amounts": []}
            ingredient_map[key]["amounts"].append(str(amt))
    return {"All Ingredients": [f"{v['name']} ({', '.join(v['amounts'][:2])})" for v in ingredient_map.values()]}
