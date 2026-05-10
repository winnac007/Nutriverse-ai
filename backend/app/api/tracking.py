from fastapi import APIRouter, Depends, HTTPException
from app.models.schema import MealLog, WeightLog, LifestyleLog
from app.data.seed_data import get_recipe
from app.core.database import db
from app.core.security import get_current_user
import uuid
from datetime import datetime, timezone, timedelta

router = APIRouter(tags=["tracking"])

@router.post("/nutrition/log")
async def log_meal(body: MealLog, user=Depends(get_current_user)):
    recipe = get_recipe(body.recipe_id)
    if not recipe: raise HTTPException(404, "Recipe not found")
    today = datetime.now(timezone.utc).date().isoformat()
    entry = {
        "id": str(uuid.uuid4()), "user_id": user["id"], "date": today,
        "recipe_id": body.recipe_id, "recipe_title": recipe["title"],
        "meal_type": body.meal_type, "servings": body.servings,
        "nutrition": {k: round(v * body.servings, 1) for k, v in recipe["nutrition"].items()},
        "logged_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.meal_logs.insert_one(entry)
    return {k: v for k, v in entry.items() if k != "_id"}

@router.get("/nutrition/today")
async def today_nutrition(user=Depends(get_current_user)):
    today = datetime.now(timezone.utc).date().isoformat()
    logs = await db.meal_logs.find({"user_id": user["id"], "date": today}, {"_id": 0}).to_list(100)
    totals = {"calories": 0, "protein": 0, "carbs": 0, "fat": 0, "fiber": 0, "sodium": 0}
    for log in logs:
        for key in totals: totals[key] += log["nutrition"].get(key, 0)
    return {"date": today, "logs": logs, "totals": {k: round(v, 1) for k, v in totals.items()}}

@router.get("/nutrition/week")
async def week_nutrition(user=Depends(get_current_user)):
    today = datetime.now(timezone.utc).date()
    days = [(today - timedelta(days=i)).isoformat() for i in range(6, -1, -1)]
    logs = await db.meal_logs.find({"user_id": user["id"], "date": {"$in": days}}, {"_id": 0}).to_list(500)
    by_day = {d: {"calories": 0, "protein": 0, "carbs": 0, "fat": 0} for d in days}
    for log in logs:
        for k in ["calories", "protein", "carbs", "fat"]:
            by_day[log["date"]][k] += log["nutrition"].get(k, 0)
    return [{"date": d, **{k: round(v, 1) for k, v in by_day[d].items()}} for d in days]

@router.delete("/nutrition/log/{log_id}")
async def delete_log(log_id: str, user=Depends(get_current_user)):
    await db.meal_logs.delete_one({"id": log_id, "user_id": user["id"]})
    return {"ok": True}

@router.post("/health/weight")
async def log_weight(body: WeightLog, user=Depends(get_current_user)):
    today = datetime.now(timezone.utc).date().isoformat()
    doc = {
        "id": str(uuid.uuid4()), "user_id": user["id"], "weight_kg": body.weight_kg,
        "note": body.note, "date": today, "logged_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.weight_logs.update_one({"user_id": user["id"], "date": today}, {"$set": doc}, upsert=True)
    return {k: v for k, v in doc.items() if k != "_id"}

@router.get("/health/weight")
async def get_weight_history(user=Depends(get_current_user)):
    return await db.weight_logs.find({"user_id": user["id"]}, {"_id": 0}).sort("date", -1).to_list(30)

@router.post("/lifestyle/log")
async def lifestyle_log(body: LifestyleLog, user=Depends(get_current_user)):
    if not user.get("is_premium"): raise HTTPException(403, "Premium feature required")
    today = datetime.now(timezone.utc).date().isoformat()
    doc = {**body.model_dump(exclude_none=True), "user_id": user["id"], "date": today, "created_at": datetime.now(timezone.utc).isoformat()}
    await db.lifestyle.update_one({"user_id": user["id"], "date": today}, {"$set": doc}, upsert=True)
    return doc

@router.get("/lifestyle/today")
async def lifestyle_today(user=Depends(get_current_user)):
    today = datetime.now(timezone.utc).date().isoformat()
    doc = await db.lifestyle.find_one({"user_id": user["id"], "date": today}, {"_id": 0})
    return doc or {"date": today, "user_id": user["id"]}
