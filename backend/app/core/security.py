import bcrypt
import jwt
from datetime import datetime, timezone, timedelta
from typing import Optional, Dict, Any
from fastapi import Header, HTTPException
from app.core.config import settings
from app.core.database import db


def hash_password(pw: str) -> str:
    return bcrypt.hashpw(pw.encode(), bcrypt.gensalt()).decode()


def verify_password(pw: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(pw.encode(), hashed.encode())
    except Exception:
        return False


ACCESS_TOKEN_LIFETIME = timedelta(days=1)
REFRESH_TOKEN_LIFETIME = timedelta(days=90)


def create_token(subject_id: str, kind: str = "user") -> str:
    """Create a short-lived access token.

    Tokens created before session refresh support did not carry ``type`` or
    ``kind`` claims. ``get_current_user`` continues to accept those legacy
    tokens until they expire so existing signed-in users are not interrupted.
    """
    payload = {
        "sub": subject_id,
        "type": "access",
        "kind": kind,
        "exp": datetime.now(timezone.utc) + ACCESS_TOKEN_LIFETIME,
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALG)


def create_refresh_token(subject_id: str, kind: str = "user") -> str:
    payload = {
        "sub": subject_id,
        "type": "refresh",
        "kind": kind,
        "exp": datetime.now(timezone.utc) + REFRESH_TOKEN_LIFETIME,
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALG)


def decode_token(
    token: str, expected_type: Optional[str] = None, expected_kind: Optional[str] = None
) -> Dict[str, Any]:
    payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALG])
    if expected_type and payload.get("type") != expected_type:
        raise jwt.InvalidTokenError("Unexpected token type")
    if expected_kind and payload.get("kind") != expected_kind:
        raise jwt.InvalidTokenError("Unexpected session kind")
    return payload


async def get_current_user(
    authorization: Optional[str] = Header(None),
) -> Dict[str, Any]:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(401, "Missing auth token")
    token = authorization.split(" ", 1)[1]
    try:
        payload = decode_token(token)
        if payload.get("type") not in (None, "access") or payload.get("kind") not in (
            None,
            "user",
        ):
            raise jwt.InvalidTokenError("Invalid user access token")
        user = await db.users.find_one(
            {"id": payload["sub"]}, {"_id": 0, "password": 0}
        )
        if not user:
            raise HTTPException(401, "User not found")
        return user
    except jwt.PyJWTError:
        raise HTTPException(401, "Invalid token")


def sanitize_user(user: Dict[str, Any]) -> Dict[str, Any]:
    return {k: v for k, v in user.items() if k not in ("_id", "password")}


def calc_tdee(age, gender, weight_kg, height_cm, activity_level, goal="maintain"):
    if (gender or "").lower() == "male":
        bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age + 5
    else:
        bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age - 161
    factors = {
        "sedentary": 1.2,
        "light": 1.375,
        "moderate": 1.55,
        "active": 1.725,
        "very_active": 1.9,
    }
    tdee = bmr * factors.get(activity_level or "moderate", 1.375)
    adj = {
        "lose": -500,
        "cutting": -400,
        "maintain": 0,
        "gain": 300,
        "bulking": 400,
        "endurance": 200,
    }
    target = tdee + adj.get(goal or "maintain", 0)
    protein_g = round(weight_kg * 2)
    fat_g = round((target * 0.25) / 9)
    carbs_g = round((target - (protein_g * 4) - (fat_g * 9)) / 4)
    return {
        "bmr": round(bmr),
        "tdee": round(tdee),
        "target_calories": round(target),
        "protein_g": protein_g,
        "carbs_g": carbs_g,
        "fat_g": fat_g,
    }
