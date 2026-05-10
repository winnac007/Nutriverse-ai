from fastapi import APIRouter, Depends
from app.models.schema import ProfileUpdate
from app.core.database import db
from app.core.security import get_current_user

router = APIRouter(prefix="/user", tags=["users"])

@router.get("/profile")
async def get_profile(user=Depends(get_current_user)):
    return user

@router.put("/profile")
async def update_profile(body: ProfileUpdate, user=Depends(get_current_user)):
    update = {k: v for k, v in body.model_dump(exclude_unset=True).items() if v is not None}
    if update:
        await db.users.update_one({"id": user["id"]}, {"$set": update})
        # Invalidate meal plan if diet-critical fields changed
        plan_invalidating_fields = {"conditions", "dietary_type", "allergies", "goal_30day", "budget"}
        if plan_invalidating_fields & set(update.keys()):
            await db.meal_plans.update_one(
                {"user_id": user["id"]},
                {"$set": {"invalidated": True}},
            )
    return await db.users.find_one({"id": user["id"]}, {"_id": 0, "password": 0})

@router.post("/upgrade")
async def upgrade_premium(user=Depends(get_current_user)):
    """Mock ₹300 premium upgrade (no real payment)."""
    await db.users.update_one({"id": user["id"]}, {"$set": {"is_premium": True}})
    return await db.users.find_one({"id": user["id"]}, {"_id": 0, "password": 0})

@router.post("/save-recipe/{recipe_id}")
async def save_recipe(recipe_id: str, user=Depends(get_current_user)):
    saved = set(user.get("saved_recipes", []))
    if recipe_id in saved:
        saved.remove(recipe_id)
    else:
        saved.add(recipe_id)
    await db.users.update_one({"id": user["id"]}, {"$set": {"saved_recipes": list(saved)}})
    return {"saved_recipes": list(saved)}
