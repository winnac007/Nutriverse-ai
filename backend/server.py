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

from seed_data import get_all_recipes, get_recipe
from healthcare_data import CONDITIONS, SWAPS

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

JWT_SECRET = os.environ.get('JWT_SECRET', 'nutriverse-dev')
JWT_ALG = "HS256"
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY', '')

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
    condition: Optional[str] = None
    goal: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    weight_kg: Optional[float] = None
    height_cm: Optional[float] = None
    body_type: Optional[str] = None  # ectomorph | mesomorph | endomorph
    activity_level: Optional[str] = None
    location: Optional[str] = None
    country: Optional[str] = None
    state: Optional[str] = None
    city: Optional[str] = None
    dietary_prefs: Optional[List[str]] = None
    allergies: Optional[List[str]] = None
    timeline_weeks: Optional[int] = None
    cooking_ability: Optional[str] = None  # beginner | intermediate | advanced
    budget: Optional[str] = None  # low | medium | high
    challenges: Optional[str] = None
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
        "category": None, "condition": None, "goal": None,
        "age": None, "gender": None, "weight_kg": None, "height_cm": None,
        "body_type": None, "activity_level": None,
        "location": None, "country": None, "state": None, "city": None,
        "dietary_prefs": [], "allergies": [], "saved_recipes": [],
        "timeline_weeks": None, "cooking_ability": None, "budget": None, "challenges": None,
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
    """Conditions list with recipe counts."""
    recipes = [r for r in get_all_recipes() if r.get("category") == "healthcare"]
    out = []
    for c in CONDITIONS:
        count = sum(1 for r in recipes if c["id"] in r.get("conditions", []))
        out.append({**c, "recipe_count": count})
    return out


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
    return plan or {"user_id": user["id"], "items": []}


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
    # Strip markdown fences
    text = re.sub(r"```(?:json)?", "", text).strip("` \n")
    m = re.search(r"\{.*\}", text, re.DOTALL)
    return json.loads(m.group(0)) if m else None


def _user_profile_text(user: Dict[str, Any]) -> str:
    return (
        f"name: {user.get('name')}\n"
        f"age: {user.get('age')} | gender: {user.get('gender')} | "
        f"weight: {user.get('weight_kg')}kg | height: {user.get('height_cm')}cm | "
        f"body_type: {user.get('body_type') or 'unknown'}\n"
        f"category: {user.get('category')} | goal: {user.get('goal')} | condition: {user.get('condition') or 'none'}\n"
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
        from emergentintegrations.llm.chat import LlmChat, UserMessage
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"smartplan-{user['id']}-{uuid.uuid4().hex[:8]}",
            system_message=SMART_PLANNER_SYSTEM,
        ).with_model("anthropic", "claude-sonnet-4-5-20250929")
        raw = await chat.send_message(UserMessage(text=user_text))
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
        from emergentintegrations.llm.chat import LlmChat, UserMessage
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"coach-{user['id']}",
            system_message=COACH_SYSTEM,
        ).with_model("anthropic", "claude-sonnet-4-5-20250929")
        reply = await chat.send_message(UserMessage(text=context))
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
