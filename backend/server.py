from fastapi import FastAPI, APIRouter, HTTPException, Depends, Header
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
import json
import re
import anthropic
from google import genai
from google.genai import types

from seed_data import get_all_recipes, get_recipe
from healthcare_data import CONDITIONS, COMMON_CONDITIONS, SWAPS
from condition_rules import filter_for_conditions, generate_why_this_works, resolve_macro_conflicts
from spoonacular import fetch_personalized_recipes, normalize_spoonacular_recipe

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

JWT_SECRET = os.environ.get('JWT_SECRET', 'nutriverse-dev-secure-key-32-chars-long')
JWT_ALG = "HS256"
ANTHROPIC_API_KEY = os.environ.get('ANTHROPIC_API_KEY', '')
SPOONACULAR_API_KEY = os.environ.get('SPOONACULAR_API_KEY', '')
anthropic_client = anthropic.AsyncAnthropic(api_key=ANTHROPIC_API_KEY)

GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', '')
gemini_client = None
if GEMINI_API_KEY:
    gemini_client = genai.Client(api_key=GEMINI_API_KEY)


async def call_ai(system_prompt: str, user_prompt: str, max_tokens: int = 2048, model_gemini: str = "gemini-3-pro-preview", model_anthropic: str = "claude-3-5-sonnet-20240620", response_mime_type: str = None):
    """
    Tries Gemini first, falls back to Anthropic.
    """
    # Try Gemini
    if gemini_client:
        try:
            config = {
                "system_instruction": system_prompt,
                "max_output_tokens": max_tokens,
            }
            if response_mime_type:
                config["response_mime_type"] = response_mime_type

            response = await gemini_client.aio.models.generate_content(
                model=model_gemini,
                contents=user_prompt,
                config=types.GenerateContentConfig(**config)
            )
            return response.text
        except Exception:
            logging.exception("Gemini AI failed, falling back to Anthropic")

    # Fallback to Anthropic
    if ANTHROPIC_API_KEY:
        try:
            response = await anthropic_client.messages.create(
                model=model_anthropic,
                max_tokens=max_tokens,
                system=system_prompt,
                messages=[{"role": "user", "content": user_prompt}],
            )
            return response.content[0].text
        except Exception:
            logging.exception("Anthropic AI failed")

    raise Exception("All AI providers failed")


app = FastAPI(title="NutriVerse API")
api_router = APIRouter(prefix="/api")


# ============ MODELS ============
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    # Legacy single-condition (kept for backward compat)
    condition: Optional[str] = None
    # New multi-condition support
    conditions: Optional[List[str]] = None
    condition_answers: Optional[Dict[str, Any]] = None
    goal: Optional[str] = None
    goal_30day: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    weight_kg: Optional[float] = None
    height_cm: Optional[float] = None
    body_type: Optional[str] = None
    activity_level: Optional[str] = None
    location: Optional[str] = None
    country: Optional[str] = None
    state: Optional[str] = None
    city: Optional[str] = None
    dietary_type: Optional[str] = None  # vegetarian | non-veg | vegan | eggetarian
    dietary_prefs: Optional[List[str]] = None
    allergies: Optional[List[str]] = None
    timeline_weeks: Optional[int] = None
    cooking_ability: Optional[str] = None
    budget: Optional[str] = None
    challenges: Optional[str] = None
    health_plan: Optional[Dict[str, Any]] = None
    preferences: Optional[Dict[str, Any]] = None
    onboarded: Optional[bool] = None


class TDEERequest(BaseModel):
    age: int
    gender: str
    weight_kg: float
    height_cm: float
    activity_level: str
    goal: str = "maintain"


class MealLog(BaseModel):
    recipe_id: str
    meal_type: str
    servings: float = 1.0


class MealPlanItem(BaseModel):
    day: str
    meal_type: str
    recipe_id: str


class SaveMealPlan(BaseModel):
    items: List[MealPlanItem]


class AIPlanRequest(BaseModel):
    context: Optional[str] = ""


class CoachAsk(BaseModel):
    question: str


class MealSwapRequest(BaseModel):
    day: str
    meal_type: str
    current_recipe_id: str


class UpdateMealRequest(BaseModel):
    day: str
    meal_type: str
    recipe_id: str


class WeightLog(BaseModel):
    weight_kg: float
    note: Optional[str] = None


# ============ AUTH HELPERS ============
def hash_password(pw: str) -> str:
    return bcrypt.hashpw(pw.encode(), bcrypt.gensalt()).decode()


def verify_password(pw: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(pw.encode(), hashed.encode())
    except Exception:
        return False


def create_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(days=30),
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)


async def get_current_user(authorization: Optional[str] = Header(None)) -> Dict[str, Any]:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(401, "Missing auth token")
    token = authorization.split(" ", 1)[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
        user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password": 0})
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
    factors = {"sedentary": 1.2, "light": 1.375, "moderate": 1.55, "active": 1.725, "very_active": 1.9}
    tdee = bmr * factors.get(activity_level or "moderate", 1.375)
    adj = {"lose": -500, "cutting": -400, "maintain": 0, "gain": 300, "bulking": 400, "endurance": 200}
    target = tdee + adj.get(goal or "maintain", 0)
    protein_g = round(weight_kg * 2)
    fat_g = round((target * 0.25) / 9)
    carbs_g = round((target - (protein_g * 4) - (fat_g * 9)) / 4)
    return {
        "bmr": round(bmr), "tdee": round(tdee),
        "target_calories": round(target),
        "protein_g": protein_g, "carbs_g": carbs_g, "fat_g": fat_g,
    }


# ============ ROUTES ============
@api_router.get("/")
async def root():
    return {"message": "NutriVerse API", "version": "2.0"}


@api_router.post("/auth/register")
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


@api_router.post("/auth/login")
async def login(body: UserLogin):
    user = await db.users.find_one({"email": body.email})
    if not user or not verify_password(body.password, user["password"]):
        raise HTTPException(401, "Invalid credentials")
    return {"token": create_token(user["id"]), "user": sanitize_user(user)}


@api_router.get("/auth/me")
async def me(user=Depends(get_current_user)):
    return user


@api_router.put("/user/profile")
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


@api_router.post("/user/upgrade")
async def upgrade_premium(user=Depends(get_current_user)):
    """Mock ₹300 premium upgrade (no real payment)."""
    await db.users.update_one({"id": user["id"]}, {"$set": {"is_premium": True}})
    return await db.users.find_one({"id": user["id"]}, {"_id": 0, "password": 0})


@api_router.post("/user/save-recipe/{recipe_id}")
async def save_recipe(recipe_id: str, user=Depends(get_current_user)):
    saved = set(user.get("saved_recipes", []))
    if recipe_id in saved:
        saved.remove(recipe_id)
    else:
        saved.add(recipe_id)
    await db.users.update_one({"id": user["id"]}, {"$set": {"saved_recipes": list(saved)}})
    return {"saved_recipes": list(saved)}


# ========= RECIPES =========
@api_router.get("/recipes")
async def list_recipes(
    category: Optional[str] = None,
    country: Optional[str] = None,
    region: Optional[str] = None,
    condition: Optional[str] = None,
    goal: Optional[str] = None,
    tag: Optional[str] = None,
    tier: Optional[str] = None,  # budget | premium
    budget: Optional[str] = None,  # "100" | "200" | "300" — filters by cost_per_serving
    search: Optional[str] = None,
):
    recipes = get_all_recipes()
    if category:
        recipes = [r for r in recipes if r["category"] == category]
    if country:
        recipes = [r for r in recipes if r.get("country", "").lower() == country.lower()]
    if region:
        recipes = [r for r in recipes if region.lower() in r.get("region", "").lower()]
    if condition:
        recipes = [r for r in recipes if condition in r.get("conditions", [])]
    if goal:
        recipes = [r for r in recipes if goal in r.get("goals", [])]
    if tag:
        recipes = [r for r in recipes if tag in r.get("tags", [])]
    if tier:
        recipes = [r for r in recipes if r.get("tier") == tier]
    if budget:
        try:
            budget_val = int(budget)
            recipes = [r for r in recipes if (r.get("cost_per_serving") or 0) <= budget_val or r.get("tier") == "budget"]
        except ValueError:
            pass
    if search:
        s = search.lower()
        recipes = [r for r in recipes if s in r["title"].lower()
                   or s in r.get("description", "").lower()
                   or s in r.get("region", "").lower()
                   or s in r.get("country", "").lower()
                   or s in r.get("cuisine", "").lower()]
    return recipes


@api_router.get("/recipes/countries")
async def list_countries():
    countries = sorted({r.get("country") for r in get_all_recipes() if r.get("country")})
    return countries


@api_router.get("/recipes/regions")
async def list_regions(country: Optional[str] = None):
    pool = get_all_recipes()
    if country:
        pool = [r for r in pool if r.get("country", "").lower() == country.lower()]
    regions = sorted({r.get("region") for r in pool if r.get("region")})
    return regions


@api_router.get("/recipes/{recipe_id}")
async def recipe_detail(recipe_id: str):
    recipe = get_recipe(recipe_id)
    if not recipe:
        raise HTTPException(404, "Recipe not found")
    return recipe


# ========= TDEE =========
@api_router.post("/tdee/calculate")
async def calculate_tdee(body: TDEERequest):
    return calc_tdee(body.age, body.gender, body.weight_kg, body.height_cm, body.activity_level, body.goal)


# ========= HEALTHCARE HUB =========
@api_router.get("/healthcare/conditions")
async def healthcare_conditions():
    """Common conditions list (backward-compatible 8 conditions) with recipe counts."""
    recipes = [r for r in get_all_recipes() if r.get("category") == "healthcare"]
    out = []
    for c in COMMON_CONDITIONS:
        count = sum(1 for r in recipes if c["id"] in r.get("conditions", []))
        out.append({**c, "recipe_count": count})
    return out


@api_router.get("/healthcare/conditions/all")
async def all_conditions():
    """Full conditions list across all 10 categories."""
    return CONDITIONS


@api_router.get("/healthcare/conditions/search")
async def search_conditions(q: Optional[str] = None, category: Optional[str] = None):
    """Search conditions by name or keyword; optionally filter by category."""
    pool = CONDITIONS
    if category:
        pool = [c for c in pool if c.get("category") == category]
    if q:
        q_lower = q.lower()
        pool = [
            c for c in pool
            if q_lower in c["label"].lower()
            or any(q_lower in kw for kw in c.get("keywords", []))
            or q_lower in c.get("blurb", "").lower()
            or q_lower in (c.get("category") or "").lower()
        ]
    return pool


@api_router.get("/healthcare/food-guidelines")
async def food_guidelines(conditions: Optional[str] = None, user=Depends(get_current_user)):
    """
    Structured per-condition food guidelines.
    Falls back to user's conditions if ?conditions param omitted.
    """
    if conditions:
        cond_list = [c.strip() for c in conditions.split(",") if c.strip()]
    else:
        cond_list = user.get("conditions") or ([user["condition"]] if user.get("condition") else [])

    cond_map = {c["id"]: c for c in CONDITIONS}
    result = {}
    for cid in cond_list:
        cdata = cond_map.get(cid)
        if not cdata:
            continue
        # Merge health_plan foods if available (AI-generated from onboarding)
        health_plan = user.get("health_plan") or {}
        result[cid] = {
            "id": cid,
            "label": cdata["label"],
            "foods_to_eat": cdata.get("foods_to_eat", []),
            "foods_to_avoid": cdata.get("foods_to_avoid", []),
            "food_rules": cdata.get("food_rules", []),
            "plan_foods_to_eat": health_plan.get("foods_to_eat", []),
            "plan_foods_to_avoid": health_plan.get("foods_to_avoid", []),
        }
    return result


@api_router.get("/healthcare/recipes")
async def healthcare_recipes(
    condition: Optional[str] = None,
    meal_type: Optional[str] = None,
    search: Optional[str] = None,
    quick: Optional[bool] = None,
):
    pool = [r for r in get_all_recipes() if r.get("category") == "healthcare"]
    if condition:
        pool = [r for r in pool if condition in r.get("conditions", [])]
    if meal_type and meal_type != "all":
        pool = [r for r in pool if r.get("meal_type") == meal_type]
    if quick:
        pool = [r for r in pool if (r.get("prep_minutes") or r.get("cook_time", 999)) <= 15]
    if search:
        s = search.lower()
        pool = [r for r in pool if s in r["title"].lower()
                or s in r.get("description", "").lower()
                or any(s in t for t in r.get("nutritional_tags", []))
                or any(s in t for t in r.get("health_scores", []))]
    # Project a focused-payload (keeps the why-this-works for the asked condition)
    out = []
    for r in pool:
        why = (r.get("why_this_works") or {}).get(condition) if condition else None
        out.append({
            **{k: v for k, v in r.items() if k != "why_this_works"},
            "why_this_works_for_condition": why,
        })
    return out


@api_router.get("/healthcare/swaps")
async def healthcare_swaps(condition: Optional[str] = None):
    if not condition:
        return SWAPS
    return [s for s in SWAPS if condition in s.get("best_for", []) or not s.get("best_for")]


@api_router.get("/healthcare/streak")
async def healthcare_streak(user=Depends(get_current_user)):
    """Compute current streak of days with at least one logged meal, plus weekly count."""
    today = datetime.now(timezone.utc).date()
    days = [(today - timedelta(days=i)).isoformat() for i in range(0, 30)]
    logs = await db.meal_logs.find(
        {"user_id": user["id"], "date": {"$in": days}}, {"_id": 0, "date": 1, "recipe_id": 1}
    ).to_list(500)
    days_with_logs = {log["date"] for log in logs}
    # Current streak: walk back from today
    streak = 0
    for d in days:
        if d in days_with_logs:
            streak += 1
        else:
            break
    week = [(today - timedelta(days=i)).isoformat() for i in range(0, 7)]
    meals_this_week = sum(1 for log in logs if log["date"] in week)
    distinct_recipes = len({log["recipe_id"] for log in logs if log["date"] in week})
    return {
        "current_streak_days": streak,
        "meals_this_week": meals_this_week,
        "distinct_recipes_this_week": distinct_recipes,
    }


# ========= NUTRITION TRACKING =========
@api_router.post("/nutrition/log")
async def log_meal(body: MealLog, user=Depends(get_current_user)):
    recipe = get_recipe(body.recipe_id)
    if not recipe:
        raise HTTPException(404, "Recipe not found")
    today = datetime.now(timezone.utc).date().isoformat()
    entry = {
        "id": str(uuid.uuid4()),
        "user_id": user["id"], "date": today,
        "recipe_id": body.recipe_id, "recipe_title": recipe["title"],
        "meal_type": body.meal_type, "servings": body.servings,
        "nutrition": {k: round(v * body.servings, 1) for k, v in recipe["nutrition"].items()},
        "logged_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.meal_logs.insert_one(entry)
    return {k: v for k, v in entry.items() if k != "_id"}


@api_router.get("/nutrition/today")
async def today_nutrition(user=Depends(get_current_user)):
    today = datetime.now(timezone.utc).date().isoformat()
    logs = await db.meal_logs.find({"user_id": user["id"], "date": today}, {"_id": 0}).to_list(100)
    totals = {"calories": 0, "protein": 0, "carbs": 0, "fat": 0, "fiber": 0, "sodium": 0}
    for log in logs:
        for key in totals:
            totals[key] += log["nutrition"].get(key, 0)
    return {"date": today, "logs": logs, "totals": {k: round(v, 1) for k, v in totals.items()}}


@api_router.get("/nutrition/week")
async def week_nutrition(user=Depends(get_current_user)):
    today = datetime.now(timezone.utc).date()
    days = [(today - timedelta(days=i)).isoformat() for i in range(6, -1, -1)]
    logs = await db.meal_logs.find({"user_id": user["id"], "date": {"$in": days}}, {"_id": 0}).to_list(500)
    by_day = {d: {"calories": 0, "protein": 0, "carbs": 0, "fat": 0} for d in days}
    for log in logs:
        for k in ["calories", "protein", "carbs", "fat"]:
            by_day[log["date"]][k] += log["nutrition"].get(k, 0)
    return [{"date": d, **{k: round(v, 1) for k, v in by_day[d].items()}} for d in days]


@api_router.delete("/nutrition/log/{log_id}")
async def delete_log(log_id: str, user=Depends(get_current_user)):
    await db.meal_logs.delete_one({"id": log_id, "user_id": user["id"]})
    return {"ok": True}


# ========= MEAL PLAN =========
@api_router.get("/meal-plan")
async def get_meal_plan(user=Depends(get_current_user)):
    plan = await db.meal_plans.find_one({"user_id": user["id"]}, {"_id": 0})
    if not plan:
        return {"user_id": user["id"], "items": []}
    # Signal to frontend whether the plan needs refreshing
    needs_refresh = bool(plan.get("invalidated"))
    if not needs_refresh and plan.get("updated_at"):
        try:
            updated = datetime.fromisoformat(plan["updated_at"].replace("Z", "+00:00"))
            if datetime.now(timezone.utc) - updated > timedelta(days=7):
                needs_refresh = True
        except Exception:
            pass
    plan["needs_refresh"] = needs_refresh
    return plan


@api_router.post("/meal-plan")
async def save_meal_plan(body: SaveMealPlan, user=Depends(get_current_user)):
    doc = {
        "user_id": user["id"],
        "items": [i.model_dump() for i in body.items],
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.meal_plans.update_one({"user_id": user["id"]}, {"$set": doc}, upsert=True)
    return doc


# ========= SMART AI MEAL PLANNER (preview-then-paywall) =========
SMART_PLANNER_SYSTEM = """You are a certified nutritionist and fitness coach AI for NutriVerse.
Analyze the user's personal data and generate a highly personalized nutrition plan.

OUTPUT must be valid JSON with this exact shape (no other text, no markdown fences):
{
  "analysis": "3-4 line analysis of the user's body condition, goals, and recommended approach.",
  "calorie_estimate": <integer>,
  "macros": {"protein_g": <int>, "carbs_g": <int>, "fat_g": <int>},
  "preview_meal": {
    "meal_type": "breakfast|lunch|dinner",
    "title": "<dish name>",
    "calories": <int>,
    "ingredients": ["<short item list>"],
    "reasoning": "<one-sentence why this meal>"
  },
  "weekly_plan": [
    {"day":"Mon","breakfast":{"recipe_id":"<id>","reason":"..."},"lunch":{"recipe_id":"<id>","reason":"..."},"dinner":{"recipe_id":"<id>","reason":"..."}},
    ... 7 entries Mon..Sun
  ],
  "grocery_list": ["item1","item2",...],
  "weekly_variations": ["short variation tip 1","tip 2","tip 3"]
}

Rules:
- Use ONLY recipe_ids from the recipes_pool the user provides.
- Match user's body_type, condition, goal, allergies, dietary_prefs, location, budget, cooking_ability.
- Use proper nutritional vocabulary; be concise and practical.
- Indian users: prefer Indian recipes; otherwise prefer their region's cuisine."""


def _extract_json(text: str):
    """
    Robustly extracts and parses JSON from text, handling markdown fences and common AI errors.
    """
    if not text:
        return None
        
    # Strip markdown fences
    text = re.sub(r"```(?:json)?", "", text).strip("` \n")
    
    # Find the outer-most JSON structure
    start_brace = text.find('{')
    start_bracket = text.find('[')
    
    if start_brace == -1 and start_bracket == -1:
        return None
        
    start = start_brace if (start_bracket == -1 or (start_brace != -1 and start_brace < start_bracket)) else start_bracket
    
    end_brace = text.rfind('}')
    end_bracket = text.rfind(']')
    end = end_brace if (end_bracket == -1 or (end_brace != -1 and end_brace > end_bracket)) else end_bracket
    
    if start != -1 and end != -1:
        text = text[start:end+1]
    
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        # Attempt to fix common missing comma issue
        try:
            # Fix missing comma between fields: "field": "value" "next_field":
            fixed = re.sub(r'("[\w]+"\s*:\s*(?:"[^"]*"|\d+|true|false|null))\s*("\w+"\s*:)', r'\1,\2', text)
            return json.loads(fixed)
        except Exception:
            logging.error(f"JSON extraction failed for text: {text[:200]}...")
            return None


def _user_profile_text(user: Dict[str, Any]) -> str:
    conditions = user.get("conditions") or ([user["condition"]] if user.get("condition") else [])
    return (
        f"name: {user.get('name')}\n"
        f"age: {user.get('age')} | gender: {user.get('gender')} | "
        f"weight: {user.get('weight_kg')}kg | height: {user.get('height_cm')}cm | "
        f"body_type: {user.get('body_type') or 'unknown'}\n"
        f"category: {user.get('category')} | goal: {user.get('goal')}\n"
        f"conditions: {conditions}\n"
        f"activity: {user.get('activity_level')} | location: {user.get('location') or user.get('city')}, {user.get('country')}\n"
        f"dietary_prefs: {user.get('dietary_prefs')} | allergies: {user.get('allergies')}\n"
        f"timeline_weeks: {user.get('timeline_weeks')} | cooking: {user.get('cooking_ability')} | budget: {user.get('budget')}\n"
        f"challenges: {user.get('challenges')}"
    )


@api_router.post("/ai/smart-plan")
async def smart_plan(body: AIPlanRequest, user=Depends(get_current_user)):
    """Returns analysis + preview always; full weekly plan only if Premium."""
    pool = get_all_recipes()
    # Filter pool by user's category for relevance
    if user.get("category") and user["category"] != "cultural":
        pool = [r for r in pool if r["category"] in (user["category"], "chef-special", "cultural")]
    pool_summary = [
        {"id": r["id"], "title": r["title"], "calories": r["nutrition"]["calories"],
         "category": r["category"], "country": r.get("country"), "tier": r.get("tier")}
        for r in pool
    ]

    user_text = (
        _user_profile_text(user)
        + f"\n\nextra_context: {body.context or 'none'}\n\nrecipes_pool:\n{json.dumps(pool_summary)}"
    )

    try:
        raw = await call_ai(
            system_prompt=SMART_PLANNER_SYSTEM,
            user_prompt=user_text,
            max_tokens=4096,
            model_anthropic="claude-3-5-sonnet-20240620",
            response_mime_type="application/json"
        )
        plan = _extract_json(raw)
    except Exception:
        logging.exception("AI plan failed, falling back")
        plan = None

    if not plan:
        # Fallback rule-based
        targets = calc_tdee(
            user.get("age") or 30, user.get("gender") or "male",
            user.get("weight_kg") or 70, user.get("height_cm") or 170,
            user.get("activity_level") or "moderate", user.get("goal") or "maintain",
        )
        sample = next((r for r in pool if r["category"] == user.get("category")), pool[0])
        ids = [r["id"] for r in pool[:6]] or [r["id"] for r in get_all_recipes()[:6]]
        days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        weekly = []
        for i, d in enumerate(days):
            weekly.append({
                "day": d,
                "breakfast": {"recipe_id": ids[(i) % len(ids)], "reason": "Balanced morning fuel"},
                "lunch": {"recipe_id": ids[(i + 1) % len(ids)], "reason": "Macro-aligned"},
                "dinner": {"recipe_id": ids[(i + 2) % len(ids)], "reason": "Light, protein-rich"},
            })
        plan = {
            "analysis": f"Your profile suggests a {user.get('goal') or 'maintenance'} approach. "
                        f"Focus on consistent protein intake and complex carbs around training.",
            "calorie_estimate": targets["target_calories"],
            "macros": {"protein_g": targets["protein_g"], "carbs_g": targets["carbs_g"], "fat_g": targets["fat_g"]},
            "preview_meal": {
                "meal_type": "lunch", "title": sample["title"],
                "calories": sample["nutrition"]["calories"],
                "ingredients": [i["name"] for i in sample["ingredients"][:5]],
                "reasoning": "Aligns with your macros and category.",
            },
            "weekly_plan": weekly,
            "grocery_list": ["chicken breast", "rolled oats", "spinach", "lentils", "olive oil", "berries"],
            "weekly_variations": ["Swap chicken for tofu twice a week", "Add post-workout banana", "Use seasonal vegetables"],
        }

    is_premium = bool(user.get("is_premium"))
    response = {
        "analysis": plan.get("analysis"),
        "calorie_estimate": plan.get("calorie_estimate"),
        "macros": plan.get("macros"),
        "preview_meal": plan.get("preview_meal"),
        "is_premium": is_premium,
    }
    if is_premium:
        # Persist as user's meal plan
        weekly = plan.get("weekly_plan", [])
        items = []
        for entry in weekly:
            day = entry.get("day")
            for mt in ["breakfast", "lunch", "dinner"]:
                m = entry.get(mt)
                if m and m.get("recipe_id"):
                    items.append({"day": day, "meal_type": mt, "recipe_id": m["recipe_id"], "reason": m.get("reason", "")})
        await db.meal_plans.update_one(
            {"user_id": user["id"]},
            {"$set": {"user_id": user["id"], "items": items, "ai_generated": True,
                      "updated_at": datetime.now(timezone.utc).isoformat()}},
            upsert=True,
        )
        response["weekly_plan"] = weekly
        response["grocery_list"] = plan.get("grocery_list", [])
        response["weekly_variations"] = plan.get("weekly_variations", [])
    else:
        response["upgrade_message"] = (
            "Unlock the full personalized 7-day meal plan, AI-generated grocery list, daily schedule, and "
            "your personalized AI nutrition assistant — for ₹300/month."
        )
    return response


# ========= ADAPTIVE AI COACH (Premium ask-anything) =========
COACH_SYSTEM = """You are an adaptive AI lifestyle and nutrition coach for NutriVerse Premium users.
Behavior:
- Be concise (max 6 short sentences), practical, personalized
- Act like a real coach, not a generic assistant
- Focus on sustainability over perfection
- Adapt tone based on the user's emotional/physical state
- For "I ate unhealthy" type messages, use Reality Mode: rebalance remaining meals without judgment
- For "What should I eat now?" answer with a specific food + portion + simple reason
- Suggest sleep/hydration/light-activity tips when relevant
Return plain text only — no JSON, no markdown fences."""


@api_router.post("/ai/coach")
async def ai_coach(body: CoachAsk, user=Depends(get_current_user)):
    if not user.get("is_premium"):
        raise HTTPException(403, "Premium feature — upgrade to access the adaptive AI coach.")

    today = datetime.now(timezone.utc).date().isoformat()
    logs = await db.meal_logs.find({"user_id": user["id"], "date": today}, {"_id": 0}).to_list(50)
    totals = {"calories": 0, "protein": 0, "carbs": 0, "fat": 0}
    for log in logs:
        for k in totals:
            totals[k] += log["nutrition"].get(k, 0)

    context = (
        _user_profile_text(user)
        + f"\n\ntoday_logs_count: {len(logs)}\ntoday_totals: {totals}\nuser_question: {body.question}"
    )
    try:
        reply = await call_ai(
            system_prompt=COACH_SYSTEM,
            user_prompt=context,
            max_tokens=512,
            model_anthropic="claude-3-5-sonnet-20240620"
        )
    except Exception:
        logging.exception("Coach AI failed")
        reply = ("Got it — keep it simple right now: a bowl of dal with rice or a protein smoothie. "
                 "Drink 500ml water, take a 10-min walk. We'll rebalance tomorrow.")
    # Persist
    msg_doc = {
        "id": str(uuid.uuid4()),
        "user_id": user["id"],
        "question": body.question,
        "reply": reply,
        "date": today,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.coach_messages.insert_one(msg_doc)
    return {"reply": reply}


@api_router.get("/ai/coach/history")
async def coach_history(user=Depends(get_current_user)):
    msgs = await db.coach_messages.find({"user_id": user["id"]}, {"_id": 0}).sort("created_at", -1).to_list(20)
    return msgs


# ========= LIFESTYLE LOG (sleep, hydration, mood) =========
class LifestyleLog(BaseModel):
    sleep_hours: Optional[float] = None
    water_ml: Optional[int] = None
    mood: Optional[str] = None  # great | ok | low
    workout_minutes: Optional[int] = None
    notes: Optional[str] = None


@api_router.post("/lifestyle/log")
async def lifestyle_log(body: LifestyleLog, user=Depends(get_current_user)):
    if not user.get("is_premium"):
        raise HTTPException(403, "Premium feature — Lifestyle Engine requires upgrade.")
    today = datetime.now(timezone.utc).date().isoformat()
    doc = {**body.model_dump(exclude_none=True), "user_id": user["id"], "date": today,
           "created_at": datetime.now(timezone.utc).isoformat()}
    await db.lifestyle.update_one({"user_id": user["id"], "date": today}, {"$set": doc}, upsert=True)
    return doc


@api_router.get("/lifestyle/today")
async def lifestyle_today(user=Depends(get_current_user)):
    today = datetime.now(timezone.utc).date().isoformat()
    doc = await db.lifestyle.find_one({"user_id": user["id"], "date": today}, {"_id": 0})
    return doc or {"date": today, "user_id": user["id"]}


# ========= PERSONALIZED RECIPES (Spoonacular + Condition Rules) =========
@api_router.get("/recipes/personalized")
async def personalized_recipes(user=Depends(get_current_user)):
    """
    Fetch recipes personalised for the user's conditions, preferences, and dietary type.
    Pipeline:
      1. Call Spoonacular with user's cuisine/diet/allergy/time preferences (cached 30 days)
      2. Apply clinical condition rules to filter out unsafe recipes
      3. Return normalized recipes with condition tags and explanations
    Falls back to seed_data if Spoonacular is unavailable or unconfigured.
    """
    conditions = user.get("conditions") or ([user["condition"]] if user.get("condition") else [])

    # Try Spoonacular first
    raw_recipes = await fetch_personalized_recipes(user, db)

    if raw_recipes:
        # Apply condition rule engine
        safe_recipes = filter_for_conditions(raw_recipes, conditions)

        # Normalize to app format
        normalized = []
        for recipe in safe_recipes[:12]:
            norm = normalize_spoonacular_recipe(recipe)
            if conditions:
                norm["why_this_works"] = generate_why_this_works(recipe, conditions)
            normalized.append(norm)

        if normalized:
            return normalized

    # Fallback: seed_data filtered by conditions
    seed = get_all_recipes()
    if conditions:
        seed = [r for r in seed if any(c in r.get("conditions", []) for c in conditions)]
    return seed[:12]


# ========= ONBOARDING PLAN GENERATION =========
ONBOARDING_PLAN_SYSTEM = """You are a certified clinical nutritionist AI for NutriVerse — a health-first nutrition app.
Based on the user's health conditions, condition-specific answers, and lifestyle data, generate a personalized health plan.

OUTPUT must be valid JSON with this exact shape (no other text, no markdown fences):
{
  "summary": "2-3 sentence personalized health summary addressing their specific conditions and goals.",
  "daily_calories": <integer>,
  "macros": {"protein_g": <int>, "carbs_g": <int>, "fat_g": <int>},
  "food_rules": [
    "Short actionable rule 1 (e.g., Avoid refined sugar — stabilises blood glucose)",
    "Short actionable rule 2",
    "Short actionable rule 3"
  ],
  "foods_to_eat": ["food1", "food2", "food3", "food4", "food5"],
  "foods_to_avoid": ["food1", "food2", "food3"],
  "first_week_recipe_ids": ["<id1>", "<id2>", "<id3>", "<id4>", "<id5>"]
}

Rules:
- food_rules must be specific to the user's exact condition combination
- first_week_recipe_ids must come ONLY from the provided recipes_pool
- Be clinically accurate but easy to understand"""


class OnboardingPlanRequest(BaseModel):
    conditions: List[str]
    condition_answers: Dict[str, Any]
    dietary_type: str
    allergies: List[str]
    cooking_ability: str
    budget: str
    goal_30day: str
    age: Optional[int] = None
    gender: Optional[str] = None
    weight_kg: Optional[float] = None
    height_cm: Optional[float] = None
    activity_level: Optional[str] = None


@api_router.post("/onboarding/generate-plan")
async def generate_onboarding_plan(body: OnboardingPlanRequest, user=Depends(get_current_user)):
    all_recipes = get_all_recipes()
    conditions_set = set(body.conditions)
    pool = [
        r for r in all_recipes
        if any(c in r.get("conditions", []) for c in conditions_set) or r.get("category") == "healthcare"
    ][:40]
    pool_summary = [{"id": r["id"], "title": r["title"], "conditions": r.get("conditions", [])} for r in pool]

    user_text = (
        f"conditions: {body.conditions}\n"
        f"condition_answers: {json.dumps(body.condition_answers)}\n"
        f"dietary_type: {body.dietary_type} | allergies: {body.allergies}\n"
        f"cooking_ability: {body.cooking_ability} | budget: {body.budget}\n"
        f"goal_30day: {body.goal_30day}\n"
        f"age: {body.age} | gender: {body.gender} | weight_kg: {body.weight_kg} | height_cm: {body.height_cm}\n"
        f"activity_level: {body.activity_level}\n"
        f"recipes_pool: {json.dumps(pool_summary)}"
    )

    try:
        raw = await call_ai(
            system_prompt=ONBOARDING_PLAN_SYSTEM,
            user_prompt=user_text,
            max_tokens=1024,
            model_anthropic="claude-3-5-sonnet-20240620",
            response_mime_type="application/json"
        )
        plan = _extract_json(raw)
    except Exception:
        logging.exception("Onboarding plan AI failed, using fallback")
        plan = None

    if not plan:
        tdee = calc_tdee(
            body.age or 30, body.gender or "female",
            body.weight_kg or 65, body.height_cm or 165,
            body.activity_level or "moderate", "maintain",
        )
        fallback_ids = [r["id"] for r in pool[:5]]
        plan = {
            "summary": f"Your plan is tailored for {', '.join(body.conditions)}. Focus on whole foods, consistent meal timing, and staying hydrated.",
            "daily_calories": tdee["target_calories"],
            "macros": {"protein_g": tdee["protein_g"], "carbs_g": tdee["carbs_g"], "fat_g": tdee["fat_g"]},
            "food_rules": [
                "Eat balanced meals every 3-4 hours to maintain energy",
                "Prioritise whole grains over refined carbohydrates",
                "Include a protein source in every meal",
            ],
            "foods_to_eat": ["lentils", "leafy greens", "oats", "curd", "nuts"],
            "foods_to_avoid": ["refined sugar", "processed foods", "fried snacks"],
            "first_week_recipe_ids": fallback_ids,
        }

    # Apply conflict resolution to macros
    if plan.get("macros"):
        resolved_macros, trade_offs = resolve_macro_conflicts(body.conditions, plan["macros"])
        plan["macros"] = resolved_macros
        if trade_offs:
            plan["conflict_notes"] = trade_offs

    # Save health_plan to user profile
    await db.users.update_one(
        {"id": user["id"]},
        {"$set": {"health_plan": plan, "conditions": body.conditions, "condition_answers": body.condition_answers,
                  "dietary_type": body.dietary_type, "allergies": body.allergies,
                  "cooking_ability": body.cooking_ability, "budget": body.budget, "goal_30day": body.goal_30day}},
    )
    return plan


# ========= MEAL SWAP =========
@api_router.post("/meal-plan/swap")
async def meal_swap(body: MealSwapRequest, user=Depends(get_current_user)):
    """Return up to 3 calorie-matched, condition-safe swap candidates."""
    # Get current recipe to know its calorie target
    current = get_recipe(body.current_recipe_id)
    target_cal = (current["nutrition"]["calories"] if current else 400)
    cal_lo, cal_hi = target_cal * 0.85, target_cal * 1.15

    # Load all recipes and apply condition filter
    conditions = user.get("conditions") or ([user["condition"]] if user.get("condition") else [])
    pool = get_all_recipes()

    # Get current week's plan to exclude already-used recipes
    plan = await db.meal_plans.find_one({"user_id": user["id"]}, {"_id": 0})
    used_ids = {item["recipe_id"] for item in (plan or {}).get("items", [])}
    used_ids.discard(body.current_recipe_id)  # allow swapping to current if no alternatives

    # Filter: condition-safe, calorie window, not the same recipe, not already used this week
    candidates = []
    for r in pool:
        if r["id"] == body.current_recipe_id:
            continue
        if r["id"] in used_ids:
            continue
        cal = r.get("nutrition", {}).get("calories", 0)
        if not (cal_lo <= cal <= cal_hi):
            continue
        if conditions:
            cond_match = any(c in r.get("conditions", []) for c in conditions)
            if not cond_match:
                continue
        candidates.append(r)

    # Sort by number of matching conditions, take top 3
    candidates.sort(key=lambda r: sum(1 for c in conditions if c in r.get("conditions", [])), reverse=True)
    return candidates[:3]


@api_router.put("/meal-plan/update-meal")
async def update_meal(body: UpdateMealRequest, user=Depends(get_current_user)):
    """Swap a single meal in the stored plan. Does not invalidate the whole plan."""
    plan = await db.meal_plans.find_one({"user_id": user["id"]}, {"_id": 0})
    if not plan:
        raise HTTPException(404, "No meal plan found")

    items = plan.get("items", [])
    updated = False
    for item in items:
        if item["day"] == body.day and item["meal_type"] == body.meal_type:
            item["recipe_id"] = body.recipe_id
            item["swapped"] = True
            updated = True
            break

    if not updated:
        items.append({"day": body.day, "meal_type": body.meal_type, "recipe_id": body.recipe_id, "swapped": True})

    await db.meal_plans.update_one(
        {"user_id": user["id"]},
        {"$set": {"items": items, "updated_at": datetime.now(timezone.utc).isoformat()}},
    )
    return {"ok": True, "updated": updated}


@api_router.get("/meal-plan/grocery-list")
async def grocery_list(user=Depends(get_current_user)):
    """
    Derive a deduplicated grocery list from the current week's meal plan.
    Returns items grouped by category.
    """
    plan = await db.meal_plans.find_one({"user_id": user["id"]}, {"_id": 0})

    # If AI generated a grocery list, return it grouped
    if plan and plan.get("grocery_list"):
        raw = plan["grocery_list"]
        # AI lists are flat strings — categorise them heuristically
        CATEGORY_KEYWORDS = {
            "Produce": ["spinach", "tomato", "onion", "garlic", "lemon", "ginger", "carrot", "cucumber",
                        "broccoli", "apple", "banana", "berry", "pepper", "potato", "avocado", "lime",
                        "cilantro", "parsley", "mint", "kale", "lettuce", "capsicum"],
            "Protein": ["chicken", "fish", "salmon", "egg", "tofu", "lentil", "dal", "beans", "chickpea",
                        "paneer", "tuna", "beef", "turkey", "shrimp", "lamb"],
            "Grains": ["rice", "quinoa", "oat", "bread", "pasta", "wheat", "roti", "chapati", "millet",
                       "barley", "buckwheat", "corn", "flour"],
            "Dairy": ["milk", "yogurt", "curd", "ghee", "butter", "cheese", "cream"],
            "Oils & Condiments": ["olive oil", "oil", "vinegar", "soy sauce", "mustard", "honey", "maple",
                                  "salt", "pepper", "cumin", "turmeric", "paprika", "cinnamon", "spice"],
            "Nuts & Seeds": ["walnut", "almond", "cashew", "peanut", "seed", "flaxseed", "chia", "pumpkin"],
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
            if not placed:
                grouped["Other"].append(item)
        return {k: v for k, v in grouped.items() if v}

    # Fallback: aggregate from recipe ingredients
    if not plan or not plan.get("items"):
        return {}

    recipe_ids = list({item["recipe_id"] for item in plan["items"]})
    ingredient_map: Dict[str, list] = {}
    for rid in recipe_ids:
        recipe = get_recipe(rid)
        if not recipe:
            continue
        for ing in recipe.get("ingredients", []):
            name = ing.get("name", "")
            amt = ing.get("amount", "")
            key = name.lower()
            if key not in ingredient_map:
                ingredient_map[key] = {"name": name, "amounts": []}
            ingredient_map[key]["amounts"].append(str(amt))

    flat = [f"{v['name']} ({', '.join(v['amounts'][:2])})" for v in ingredient_map.values()]
    return {"All Ingredients": flat}


# ========= WEIGHT TRACKING =========
@api_router.post("/health/weight")
async def log_weight(body: WeightLog, user=Depends(get_current_user)):
    today = datetime.now(timezone.utc).date().isoformat()
    doc = {
        "id": str(uuid.uuid4()),
        "user_id": user["id"],
        "weight_kg": body.weight_kg,
        "note": body.note,
        "date": today,
        "logged_at": datetime.now(timezone.utc).isoformat(),
    }
    # Upsert by date — only one weight log per day
    await db.weight_logs.update_one(
        {"user_id": user["id"], "date": today},
        {"$set": doc},
        upsert=True,
    )
    return {k: v for k, v in doc.items() if k != "_id"}


@api_router.get("/health/weight")
async def get_weight_history(user=Depends(get_current_user)):
    logs = await db.weight_logs.find(
        {"user_id": user["id"]}, {"_id": 0}
    ).sort("date", -1).to_list(30)
    return logs


# Wire up
app.include_router(api_router)
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
