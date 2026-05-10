from typing import Optional
from fastapi import APIRouter, Depends
from app.data.healthcare_data import CONDITIONS, COMMON_CONDITIONS, SWAPS
from app.data.seed_data import get_all_recipes
from app.core.database import db
from app.core.security import get_current_user
from datetime import datetime, timezone, timedelta

router = APIRouter(prefix="/healthcare", tags=["healthcare"])

@router.get("/conditions")
async def healthcare_conditions():
    recipes = [r for r in get_all_recipes() if r.get("category") == "healthcare"]
    out = []
    for c in COMMON_CONDITIONS:
        count = sum(1 for r in recipes if c["id"] in r.get("conditions", []))
        out.append({**c, "recipe_count": count})
    return out

@router.get("/conditions/all")
async def all_conditions():
    return CONDITIONS

@router.get("/conditions/search")
async def search_conditions(q: Optional[str] = None, category: Optional[str] = None):
    pool = CONDITIONS
    if category: pool = [c for c in pool if c.get("category") == category]
    if q:
        q_lower = q.lower()
        pool = [c for c in pool if q_lower in c["label"].lower() or any(q_lower in kw for kw in c.get("keywords", [])) or q_lower in c.get("blurb", "").lower() or q_lower in (c.get("category") or "").lower()]
    return pool

@router.get("/food-guidelines")
async def food_guidelines(conditions: Optional[str] = None, user=Depends(get_current_user)):
    cond_list = [c.strip() for c in conditions.split(",") if c.strip()] if conditions else (user.get("conditions") or ([user["condition"]] if user.get("condition") else []))
    cond_map = {c["id"]: c for c in CONDITIONS}
    result = {}
    for cid in cond_list:
        cdata = cond_map.get(cid)
        if not cdata: continue
        health_plan = user.get("health_plan") or {}
        result[cid] = {
            "id": cid, "label": cdata["label"],
            "foods_to_eat": cdata.get("foods_to_eat", []), "foods_to_avoid": cdata.get("foods_to_avoid", []),
            "food_rules": cdata.get("food_rules", []),
            "plan_foods_to_eat": health_plan.get("foods_to_eat", []), "plan_foods_to_avoid": health_plan.get("foods_to_avoid", []),
        }
    return result

@router.get("/recipes")
async def healthcare_recipes(condition: Optional[str] = None, meal_type: Optional[str] = None, search: Optional[str] = None, quick: Optional[bool] = None):
    pool = [r for r in get_all_recipes() if r.get("category") == "healthcare"]
    if condition: pool = [r for r in pool if condition in r.get("conditions", [])]
    if meal_type and meal_type != "all": pool = [r for r in pool if r.get("meal_type") == meal_type]
    if quick: pool = [r for r in pool if (r.get("prep_minutes") or r.get("cook_time", 999)) <= 15]
    if search:
        s = search.lower()
        pool = [r for r in pool if s in r["title"].lower() or s in r.get("description", "").lower() or any(s in t for t in r.get("nutritional_tags", [])) or any(s in t for t in r.get("health_scores", []))]
    out = []
    for r in pool:
        why = (r.get("why_this_works") or {}).get(condition) if condition else None
        out.append({**{k: v for k, v in r.items() if k != "why_this_works"}, "why_this_works_for_condition": why})
    return out

@router.get("/swaps")
async def healthcare_swaps(condition: Optional[str] = None):
    if not condition: return SWAPS
    return [s for s in SWAPS if condition in s.get("best_for", []) or not s.get("best_for")]

@router.get("/streak")
async def healthcare_streak(user=Depends(get_current_user)):
    today = datetime.now(timezone.utc).date()
    days = [(today - timedelta(days=i)).isoformat() for i in range(0, 30)]
    logs = await db.meal_logs.find({"user_id": user["id"], "date": {"$in": days}}, {"_id": 0, "date": 1, "recipe_id": 1}).to_list(500)
    days_with_logs = {log["date"] for log in logs}
    streak = 0
    for d in days:
        if d in days_with_logs: streak += 1
        else: break
    week = [(today - timedelta(days=i)).isoformat() for i in range(0, 7)]
    meals_this_week = sum(1 for log in logs if log["date"] in week)
    distinct_recipes = len({log["recipe_id"] for log in logs if log["date"] in week})
    return {"current_streak_days": streak, "meals_this_week": meals_this_week, "distinct_recipes_this_week": distinct_recipes}
