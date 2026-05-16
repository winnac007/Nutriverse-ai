from fastapi import APIRouter, Depends, HTTPException
from app.models.schema import AIPlanRequest, CoachAsk, OnboardingPlanRequest
from app.services.ai_service import call_ai, extract_json, user_profile_text
from app.services.recipe_service import fetch_personalized_recipes, normalize_spoonacular_recipe
from app.services.clinical_service import filter_for_conditions, generate_why_this_works, resolve_macro_conflicts
from app.core.database import db
from app.core.security import get_current_user, calc_tdee
from app.core.prompts import load_prompt
from app.core.config import settings
import uuid
from datetime import datetime, timezone
import json
import logging

router = APIRouter(prefix="/ai", tags=["ai"])

@router.post("/smart-plan")
async def smart_plan(body: AIPlanRequest, user=Depends(get_current_user)):
    raw_pool = await fetch_personalized_recipes(user, db)
    pool = [normalize_spoonacular_recipe(r) for r in raw_pool]
    pool_summary = [{"id": r["id"], "title": r["title"], "calories": r.get("nutrition", {}).get("calories"), "category": r.get("category"), "country": r.get("country"), "tier": r.get("tier")} for r in pool]
    user_text = user_profile_text(user) + f"\n\nextra_context: {body.context or 'none'}\n\nrecipes_pool:\n{json.dumps(pool_summary)}"
    try:
        raw = await call_ai(system_prompt=load_prompt("smart_planner"), user_prompt=user_text, max_tokens=4096, response_mime_type="application/json")
        plan = extract_json(raw)
    except: plan = None
    if not plan:
        targets = calc_tdee(user.get("age") or 30, user.get("gender") or "male", user.get("weight_kg") or 70, user.get("height_cm") or 170, user.get("activity_level") or "moderate", user.get("goal") or "maintain")
        ids = [r["id"] for r in pool[:6]]
        days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        weekly = [{"day": d, "breakfast": {"recipe_id": ids[i % len(ids)], "reason": "Balanced fuel"} if ids else {}, "lunch": {"recipe_id": ids[(i+1) % len(ids)], "reason": "Macro-aligned"} if ids else {}, "dinner": {"recipe_id": ids[(i+2) % len(ids)], "reason": "Protein-rich"} if ids else {}} for i, d in enumerate(days)]
        plan = {"analysis": f"Profile suggests {user.get('goal') or 'maintenance'} approach.", "calorie_estimate": targets["target_calories"], "macros": {"protein_g": targets["protein_g"], "carbs_g": targets["carbs_g"], "fat_g": targets["fat_g"]}, "weekly_plan": weekly, "grocery_list": ["chicken", "oats", "spinach"], "weekly_variations": ["Swap protein"]}
    is_premium = bool(user.get("is_premium"))
    response = {"analysis": plan.get("analysis"), "calorie_estimate": plan.get("calorie_estimate"), "macros": plan.get("macros"), "preview_meal": plan.get("preview_meal"), "is_premium": is_premium}
    if is_premium:
        items = [{"day": e["day"], "meal_type": mt, "recipe_id": e[mt]["recipe_id"], "reason": e[mt].get("reason", "")} for e in plan.get("weekly_plan", []) for mt in ["breakfast", "lunch", "dinner"] if e.get(mt) and e[mt].get("recipe_id")]
        await db.meal_plans.update_one({"user_id": user["id"]}, {"$set": {"user_id": user["id"], "items": items, "ai_generated": True, "updated_at": datetime.now(timezone.utc).isoformat()}}, upsert=True)
        response.update({"weekly_plan": plan.get("weekly_plan", []), "grocery_list": plan.get("grocery_list", []), "weekly_variations": plan.get("weekly_variations", [])})
    else: response["upgrade_message"] = "Unlock full personalized 7-day meal plan for ₹300/month."
    return response

@router.post("/coach")
async def ai_coach(body: CoachAsk, user=Depends(get_current_user)):
    if not user.get("is_premium"): raise HTTPException(403, "Premium required")
    today = datetime.now(timezone.utc).date().isoformat()
    logs = await db.meal_logs.find({"user_id": user["id"], "date": today}, {"_id": 0}).to_list(50)
    totals = {"calories": 0, "protein": 0, "carbs": 0, "fat": 0}
    for log in logs:
        for k in totals: totals[k] += log["nutrition"].get(k, 0)
    context = user_profile_text(user) + f"\n\ntoday_logs_count: {len(logs)}\ntoday_totals: {totals}\nuser_question: {body.question}"
    try:
        reply = await call_ai(system_prompt=load_prompt("coach"), user_prompt=context, max_tokens=512)
    except: reply = "Got it — keep it simple. Drink water, take a walk."
    msg_doc = {"id": str(uuid.uuid4()), "user_id": user["id"], "question": body.question, "reply": reply, "date": today, "created_at": datetime.now(timezone.utc).isoformat()}
    await db.coach_messages.insert_one(msg_doc)
    return {"reply": reply}

@router.get("/coach/history")
async def coach_history(user=Depends(get_current_user)):
    return await db.coach_messages.find({"user_id": user["id"]}, {"_id": 0}).sort("created_at", -1).to_list(20)

@router.post("/onboarding/generate-plan")
async def generate_onboarding_plan(body: OnboardingPlanRequest, user=Depends(get_current_user)):
    pool = []
    if settings.SPOONACULAR_API_KEY:
        mock_user = {"id": user["id"], "conditions": body.conditions, "dietary_type": body.dietary_type, "allergies": body.allergies, "cooking_ability": body.cooking_ability, "location": user.get("location"), "preferences": user.get("preferences", {})}
        raw_pool = await fetch_personalized_recipes(mock_user, db)
        if raw_pool:
            safe_pool = filter_for_conditions(raw_pool, body.conditions)
            pool = [normalize_spoonacular_recipe(r) for r in safe_pool[:40]]
    if not pool:
        pool = []  # No seed data; AI will generate plan without a pool
    pool_summary = [{"id": r["id"], "title": r["title"], "conditions": r.get("conditions", [])} for r in pool]
    user_text = f"conditions: {body.conditions}\ncondition_answers: {json.dumps(body.condition_answers)}\ndietary_type: {body.dietary_type} | allergies: {body.allergies}\ncooking_ability: {body.cooking_ability} | budget: {body.budget}\ngoal_30day: {body.goal_30day}\nage: {body.age} | gender: {body.gender} | weight_kg: {body.weight_kg} | height_cm: {body.height_cm}\nactivity_level: {body.activity_level}\nrecipes_pool: {json.dumps(pool_summary)}"
    try:
        raw = await call_ai(system_prompt=load_prompt("onboarding_plan"), user_prompt=user_text, max_tokens=1024, response_mime_type="application/json")
        plan = extract_json(raw)
    except: plan = None
    if not plan:
        tdee = calc_tdee(body.age or 30, body.gender or "female", body.weight_kg or 65, body.height_cm or 165, body.activity_level or "moderate", "maintain")
        plan = {"summary": f"Plan tailored for {', '.join(body.conditions)}.", "daily_calories": tdee["target_calories"], "macros": {"protein_g": tdee["protein_g"], "carbs_g": tdee["carbs_g"], "fat_g": tdee["fat_g"]}, "food_rules": ["Eat balanced meals"], "foods_to_eat": ["lentils"], "foods_to_avoid": ["refined sugar"], "first_week_recipe_ids": [r["id"] for r in pool[:5]]}
    if plan.get("macros"):
        resolved_macros, trade_offs = resolve_macro_conflicts(body.conditions, plan["macros"])
        plan["macros"] = resolved_macros
        if trade_offs: plan["conflict_notes"] = trade_offs
    update_fields: dict = {
        "health_plan": plan, "onboarded": True,
        "conditions": body.conditions, "condition_answers": body.condition_answers,
        "dietary_type": body.dietary_type, "allergies": body.allergies,
        "cooking_ability": body.cooking_ability, "budget": body.budget, "goal_30day": body.goal_30day,
    }
    if body.age: update_fields["age"] = body.age
    if body.gender: update_fields["gender"] = body.gender
    if body.weight_kg: update_fields["weight_kg"] = body.weight_kg
    if body.height_cm: update_fields["height_cm"] = body.height_cm
    if body.activity_level: update_fields["activity_level"] = body.activity_level
    await db.users.update_one({"id": user["id"]}, {"$set": update_fields})
    return plan
