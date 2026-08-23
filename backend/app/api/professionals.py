from datetime import datetime, timezone
from typing import Any, Dict, List, Literal, Optional
import uuid

import jwt
from fastapi import APIRouter, Depends, Header, HTTPException
from pydantic import BaseModel, EmailStr, Field, field_validator

from app.core.database import db
from app.core.security import (
    create_refresh_token,
    create_token,
    decode_token,
    hash_password,
    sanitize_user,
    verify_password,
)
from app.models.schema import RefreshTokenRequest

ProfessionalRole = Literal["consultant", "chef"]
router = APIRouter(prefix="/professionals", tags=["professionals"])


class ProfessionalRegister(BaseModel):
    role: ProfessionalRole
    name: str = Field(min_length=2, max_length=80)
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)
    headline: str = Field(min_length=3, max_length=120)
    credentials: str = Field(min_length=2, max_length=160)
    location: str = Field(default="", max_length=120)
    bio: str = Field(default="", max_length=800)
    specialties: List[str] = Field(default_factory=list, max_length=12)

    @field_validator("name", "headline", "credentials", "location", "bio")
    @classmethod
    def strip_text(cls, value: str) -> str:
        return value.strip()

    @field_validator("specialties")
    @classmethod
    def clean_specialties(cls, values: List[str]) -> List[str]:
        return [value.strip() for value in values if value.strip()]


class ProfessionalLogin(BaseModel):
    role: ProfessionalRole
    email: EmailStr
    password: str


class ProfessionalUpdate(BaseModel):
    headline: Optional[str] = Field(default=None, min_length=3, max_length=120)
    credentials: Optional[str] = Field(default=None, min_length=2, max_length=160)
    location: Optional[str] = Field(default=None, max_length=120)
    bio: Optional[str] = Field(default=None, max_length=800)
    specialties: Optional[List[str]] = Field(default=None, max_length=12)
    accepting_clients: Optional[bool] = None


class ChefSpecialCreate(BaseModel):
    title: str = Field(min_length=3, max_length=120)
    description: str = Field(min_length=10, max_length=1200)
    image: str = Field(default="/landing/footer-still.jpg", max_length=1000)
    country: str = Field(default="International", max_length=80)
    cuisine: str = Field(default="International", max_length=80)
    cook_time: int = Field(default=30, ge=1, le=480)
    servings: int = Field(default=2, ge=1, le=30)
    tier: Literal["budget", "premium"] = "premium"
    tags: List[str] = Field(default_factory=list, max_length=16)
    ingredients: List[str] = Field(min_length=1, max_length=40)
    steps: List[str] = Field(min_length=1, max_length=30)
    calories: int = Field(default=0, ge=0, le=5000)
    protein: float = Field(default=0, ge=0, le=500)
    carbs: float = Field(default=0, ge=0, le=1000)
    fat: float = Field(default=0, ge=0, le=500)

    @field_validator("title", "description", "image", "country", "cuisine")
    @classmethod
    def strip_recipe_text(cls, value: str) -> str:
        return value.strip()

    @field_validator("tags", "ingredients", "steps")
    @classmethod
    def clean_lists(cls, values: List[str]) -> List[str]:
        return [value.strip() for value in values if value.strip()]


def professional_session_payload(professional: Dict[str, Any]) -> Dict[str, Any]:
    access_token = create_token(professional["id"], kind="professional")
    return {
        "token": access_token,
        "access_token": access_token,
        "refresh_token": create_refresh_token(professional["id"], kind="professional"),
        "expires_in": 86400,
        "professional": sanitize_user(professional),
    }


async def get_current_professional(
    authorization: Optional[str] = Header(None),
) -> Dict[str, Any]:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(401, "Missing professional auth token")
    try:
        payload = decode_token(
            authorization.split(" ", 1)[1],
            expected_type="access",
            expected_kind="professional",
        )
        professional = await db.professionals.find_one(
            {"id": payload["sub"]}, {"_id": 0, "password": 0}
        )
    except jwt.PyJWTError:
        raise HTTPException(401, "Invalid professional session")
    if not professional:
        raise HTTPException(401, "Professional account not found")
    return professional


def build_chef_special(body: ChefSpecialCreate, chef: Dict[str, Any]) -> Dict[str, Any]:
    now = datetime.now(timezone.utc).isoformat()
    return {
        "id": f"chef-{uuid.uuid4()}",
        "title": body.title,
        "description": body.description,
        "image": body.image or "/landing/footer-still.jpg",
        "category": "chef-special",
        "cuisine": body.cuisine,
        "country": body.country,
        "region": "Chef's table",
        "prep_minutes": 0,
        "cook_time": body.cook_time,
        "servings": body.servings,
        "nutrition": {
            "calories": body.calories,
            "protein": body.protein,
            "carbs": body.carbs,
            "fat": body.fat,
        },
        "ingredients": [
            {"name": ingredient, "amount": "", "unit": ""}
            for ingredient in body.ingredients
        ],
        "steps": body.steps,
        "tags": list(dict.fromkeys([*body.tags, "chef-special"])),
        "diets": [
            tag
            for tag in body.tags
            if tag
            in {"vegetarian", "vegan", "gluten-free", "dairy-free", "pescatarian"}
        ],
        "tier": body.tier,
        "is_premium": body.tier == "premium",
        "featured": True,
        "source": "chef",
        "status": "published",
        "chef_id": chef["id"],
        "chef": {
            "name": chef["name"],
            "credentials": chef.get("credentials", "Chef"),
        },
        "created_at": now,
        "updated_at": now,
    }


@router.post("/register")
async def register_professional(body: ProfessionalRegister):
    email = str(body.email).strip().lower()
    if await db.professionals.find_one({"email": email}):
        raise HTTPException(400, "A professional account already uses this email")
    now = datetime.now(timezone.utc).isoformat()
    professional = {
        "id": str(uuid.uuid4()),
        "role": body.role,
        "name": body.name,
        "email": email,
        "password": hash_password(body.password),
        "headline": body.headline,
        "credentials": body.credentials,
        "location": body.location,
        "bio": body.bio,
        "specialties": body.specialties,
        "accepting_clients": body.role == "consultant",
        "status": "active",
        "created_at": now,
        "updated_at": now,
    }
    await db.professionals.insert_one(professional)
    return professional_session_payload(professional)


@router.post("/login")
async def login_professional(body: ProfessionalLogin):
    professional = await db.professionals.find_one(
        {"email": str(body.email).strip().lower(), "role": body.role}
    )
    if not professional or not verify_password(body.password, professional["password"]):
        raise HTTPException(401, "Invalid professional credentials")
    return professional_session_payload(professional)


@router.post("/refresh")
async def refresh_professional_session(body: RefreshTokenRequest):
    try:
        payload = decode_token(
            body.refresh_token,
            expected_type="refresh",
            expected_kind="professional",
        )
    except jwt.PyJWTError:
        raise HTTPException(401, "Professional session expired. Please sign in again.")
    professional = await db.professionals.find_one({"id": payload["sub"]})
    if not professional:
        raise HTTPException(401, "Professional account not found")
    return professional_session_payload(professional)


@router.get("/me")
async def professional_me(professional=Depends(get_current_professional)):
    return professional


@router.patch("/me")
async def update_professional(
    body: ProfessionalUpdate, professional=Depends(get_current_professional)
):
    changes = body.model_dump(exclude_none=True)
    if "specialties" in changes:
        changes["specialties"] = [
            value.strip() for value in changes["specialties"] if value.strip()
        ]
    for key, value in list(changes.items()):
        if isinstance(value, str):
            changes[key] = value.strip()
    changes["updated_at"] = datetime.now(timezone.utc).isoformat()
    await db.professionals.update_one({"id": professional["id"]}, {"$set": changes})
    updated = await db.professionals.find_one(
        {"id": professional["id"]}, {"_id": 0, "password": 0}
    )
    return updated


@router.get("/dashboard")
async def professional_dashboard(professional=Depends(get_current_professional)):
    payload: Dict[str, Any] = {
        "professional": professional,
        "status": professional.get("status", "active"),
    }
    if professional["role"] == "chef":
        recipes = (
            await db.recipes.find({"chef_id": professional["id"]}, {"_id": 0})
            .sort("created_at", -1)
            .to_list(length=100)
        )
        payload["recipes"] = recipes
        payload["metrics"] = {
            "published_recipes": len(recipes),
            "premium_recipes": sum(1 for recipe in recipes if recipe.get("is_premium")),
        }
    else:
        requests = (
            await db.consultation_requests.find(
                {"consultant_id": professional["id"]}, {"_id": 0}
            )
            .sort("created_at", -1)
            .to_list(length=100)
        )
        payload["requests"] = requests
        payload["metrics"] = {
            "session_requests": len(requests),
            "upcoming_sessions": sum(
                1 for request in requests if request.get("status") == "confirmed"
            ),
        }
    return payload


@router.post("/chef-specials", status_code=201)
async def publish_chef_special(
    body: ChefSpecialCreate, professional=Depends(get_current_professional)
):
    if professional["role"] != "chef":
        raise HTTPException(403, "Only chef accounts can publish Chef Specials")
    recipe = build_chef_special(body, professional)
    await db.recipes.insert_one(recipe)
    return {key: value for key, value in recipe.items() if key != "_id"}


@router.get("/chef-specials")
async def list_own_chef_specials(professional=Depends(get_current_professional)):
    if professional["role"] != "chef":
        raise HTTPException(403, "Only chef accounts have a Chef Specials catalogue")
    return (
        await db.recipes.find({"chef_id": professional["id"]}, {"_id": 0})
        .sort("created_at", -1)
        .to_list(length=100)
    )
