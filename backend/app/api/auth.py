from fastapi import APIRouter, HTTPException, Depends
from app.models.schema import UserRegister, UserLogin
from app.core.database import db
from app.core.security import hash_password, verify_password, create_token, sanitize_user, get_current_user
import uuid
from datetime import datetime, timezone

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register")
async def register(body: UserRegister):
    if await db.users.find_one({"email": body.email}):
        raise HTTPException(400, "Email already registered")
    user_id = str(uuid.uuid4())
    user_doc = {
        "id": user_id, "email": body.email, "password": hash_password(body.password),
        "name": body.name, "is_premium": False, "onboarded": False,
        "category": "healthcare",
        "conditions": [], "condition_answers": {}, "condition": None,
        "goal": None, "goal_30day": None,
        "age": None, "gender": None, "weight_kg": None, "height_cm": None,
        "body_type": None, "activity_level": None,
        "location": None, "country": None, "state": None, "city": None,
        "dietary_type": None, "dietary_prefs": [], "allergies": [], "saved_recipes": [],
        "timeline_weeks": None, "cooking_ability": None, "budget": None, "challenges": None,
        "health_plan": None,
        "preferences": {},
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.users.insert_one(user_doc)
    return {"token": create_token(user_id), "user": sanitize_user(user_doc)}

@router.post("/login")
async def login(body: UserLogin):
    user = await db.users.find_one({"email": body.email})
    if not user or not verify_password(body.password, user["password"]):
        raise HTTPException(401, "Invalid credentials")
    return {"token": create_token(user["id"]), "user": sanitize_user(user)}

@router.get("/me")
async def me(user=Depends(get_current_user)):
    return user
