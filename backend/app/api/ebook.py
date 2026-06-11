from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional, Dict, Any
import json
from datetime import datetime, timezone
from app.core.database import db
from app.core.security import get_current_user, calc_tdee
from app.data.healthcare_data import CONDITIONS

from app.models.schema import PremiumEbookRequest

router = APIRouter(prefix="/ebook", tags=["ebook"])

VALID_CONDITIONS = ["pcos", "diabetes", "thyroid", "gut-health", "anti-inflammatory", "menopause"]

@router.post("/craft")
async def generate_premium_ebook(answers: Dict[str, Any], user=Depends(get_current_user)):
    """Generate a hyper-personalised AI ebook on-demand."""
    from app.services.ai_service import call_ai, user_profile_text, extract_json
    
    primary = _resolve_primary_condition(user)
    condition_label = "General Wellness"
    if primary:
        rec = _condition_record(primary)
        condition_label = rec["label"] if rec else primary.replace("-", " ").title()

    profile = user_profile_text(user)
    
    system_prompt = f"""You are a master clinical nutritionist and wellness alchemist. 
    You create hyper-personalised, high-end nutritional blueprints.
    Your tone is sophisticated, empathetic, and scientifically rigorous yet accessible.
    
    OUTPUT FORMAT: Return a JSON object with:
    {{
      "condition_id": "premium",
      "condition_label": "Personalised Blueprint",
      "is_premium": true,
      "summary": {{
        "greeting": "...",
        "condition_blurb": "...",
        "focus_points": ["...", "...", "..."],
        "stats": [{{ "label": "...", "value": "..." }}]
      }},
      "chapters": [
        {{ "id": 1, "title": "Your Biological North Star", "html_content": "..." }},
        {{ "id": 2, "title": "The Alchemist's Kitchen", "html_content": "..." }},
        {{ "id": 3, "title": "90-Day Transformation Protocol", "html_content": "..." }},
        {{ "id": 4, "title": "Signature Recipes for {answers.get('aspiration', 'wellness')}", "html_content": "..." }},
        {{ "id": 5, "title": "The Daily Rituals", "html_content": "..." }}
      ]
    }}
    
    STYLING RULES:
    - Use <div class="callout insight">, <div class="compare">, <div class="pillars"> as defined in our design system.
    - Each chapter should be 500+ words of rich, specific advice.
    - Focus heavily on the user's aspiration: {answers.get('aspiration', 'wellness')}
    - Respect their flavor palette: {answers.get('flavor', 'balanced')}
    - Keep cooking times under: {answers.get('time', '30m')}
    """

    user_prompt = f"""User Profile:
    {profile}
    
    Premium Questionnaire Answers:
    {json.dumps(answers)}
    
    Primary Condition to address: {condition_label}
    
    Generate a 5-chapter masterpiece tailored ONLY to this person. 
    Make them feel like this was written specifically for their soul and body.
    Include a chapter on recipes that fit their flavor palette and time constraints.
    """

    try:
        raw_response = await call_ai(system_prompt, user_prompt, max_tokens=8192)
        ebook_data = extract_json(raw_response)
        
        if not ebook_data:
            raise HTTPException(500, "Failed to parse AI response.")
            
        ebook_data["user_id"] = user["id"]
        ebook_data["generated_at"] = datetime.now(timezone.utc).isoformat()
        
        # Merge stats from general summary if missing
        general_summary = _build_summary(user, {"condition_label": condition_label}, primary)
        if "summary" not in ebook_data: ebook_data["summary"] = {}
        if "stats" not in ebook_data["summary"] or not ebook_data["summary"]["stats"]:
            ebook_data["summary"]["stats"] = general_summary["stats"]
        
        # Add other missing fields for frontend compatibility
        ebook_data["summary"]["all_conditions"] = general_summary["all_conditions"]
        ebook_data["summary"]["goal_30day"] = user.get("goal_30day")
        ebook_data["summary"]["diet"] = general_summary["diet"]
        
        await db.premium_ebooks.update_one(
            {"user_id": user["id"]},
            {"$set": ebook_data},
            upsert=True
        )
        
        return ebook_data
    except Exception as e:
        import logging
        logging.exception("Premium ebook generation failed")
        raise HTTPException(500, f"Generation failed: {str(e)}")

# Default book used when a user has no condition, or their condition maps to nothing.
DEFAULT_EBOOK = "anti-inflammatory"

# Maps every condition in healthcare_data.py to one of the 6 generated ebooks.
# Many conditions → one book; anything unmapped falls back to DEFAULT_EBOOK.
CONDITION_TO_EBOOK = {
    # Metabolic / blood-sugar / weight
    "diabetes": "diabetes",
    "diabetes-t1": "diabetes",
    "prediabetes": "diabetes",
    "insulin-resistance": "diabetes",
    "fatty-liver": "diabetes",
    "obesity": "diabetes",
    "weight-management": "diabetes",
    # PCOS
    "pcos": "pcos",
    # Thyroid
    "thyroid": "thyroid",
    "hyperthyroid": "thyroid",
    "hashimotos": "thyroid",
    # Gut / digestive
    "gut-health": "gut-health",
    "ibs": "gut-health",
    "gerd": "gut-health",
    "gastritis": "gut-health",
    "celiac": "gut-health",
    "gluten-intolerance": "gut-health",
    "lactose-intolerance": "gut-health",
    # Menopause
    "menopause": "menopause",
    # Cardio / inflammatory / mood / immune → anti-inflammatory
    "heart-disease": "anti-inflammatory",
    "hypertension": "anti-inflammatory",
    "high-cholesterol": "anti-inflammatory",
    "high-triglycerides": "anti-inflammatory",
    "rheumatoid-arthritis": "anti-inflammatory",
    "gout": "anti-inflammatory",
    "migraine": "anti-inflammatory",
    "depression": "anti-inflammatory",
    "immunity": "anti-inflammatory",
}

CHAPTER_TITLES = {
    "1": "Introduction",
    "2": "Understanding the Condition",
    "3": "The Nutrition Connection",
    "4": "Symptom Assessment",
    "5": "Nutrition Foundations",
    "6": "Foods to Prioritize",
    "7": "Foods to Limit",
    "8": "Building Your Plate",
    "9": "Recipes",
    "10": "Meal Plans",
    "11": "Lifestyle Support",
    "12": "Common Challenges & Solutions",
    "13": "Progress Tracking",
    "14": "FAQs",
    "15": "Key Takeaways",
    "16": "References",
}


@router.get("/conditions")
async def list_conditions():
    """List available ebook conditions with their generation status."""
    result = []
    for slug in VALID_CONDITIONS:
        doc = await db.ebooks.find_one({"condition_id": slug}, {"condition_label": 1, "status": 1, "generated_at": 1})
        result.append({
            "id": slug,
            "label": doc["condition_label"] if doc else slug.replace("-", " ").title(),
            "status": doc["status"] if doc else "not_generated",
            "generated_at": doc.get("generated_at") if doc else None,
        })
    return result


def _condition_record(cid):
    """Look up a condition by id in healthcare_data.CONDITIONS."""
    for c in CONDITIONS:
        if c["id"] == cid:
            return c
    return None


def _resolve_primary_condition(user):
    """Pick the user's most book-relevant condition.

    Prefers the first condition that maps to a *specific* ebook (not the
    anti-inflammatory catch-all), so e.g. [hypertension, pcos] → pcos.
    Returns a condition id, or None if the user has no conditions.
    """
    conds = list(user.get("conditions") or [])
    if not conds and user.get("condition"):
        conds = [user["condition"]]
    for cid in conds:
        slug = CONDITION_TO_EBOOK.get(cid)
        if slug and slug != DEFAULT_EBOOK:
            return cid
    return conds[0] if conds else None


def _bmi(weight_kg, height_cm):
    if not weight_kg or not height_cm:
        return None
    h = height_cm / 100.0
    if h <= 0:
        return None
    return round(weight_kg / (h * h), 1)


def _bmi_band(bmi):
    if bmi < 18.5:
        return "Underweight"
    if bmi < 25:
        return "Healthy"
    if bmi < 30:
        return "Overweight"
    return "Higher range"


def _build_summary(user, ebook_doc, primary_cid):
    """Profile-based personalised summary — no AI, built from the user doc."""
    name = (user.get("name") or "").strip()
    first = name.split()[0] if name else "there"

    rec = _condition_record(primary_cid) if primary_cid else None

    conds = list(user.get("conditions") or [])
    if not conds and user.get("condition"):
        conds = [user["condition"]]
    all_labels = []
    for cid in conds:
        r = _condition_record(cid)
        all_labels.append(r["label"] if r else cid.replace("-", " ").title())

    age = user.get("age")
    gender = user.get("gender")
    weight = user.get("weight_kg")
    height = user.get("height_cm")
    activity = user.get("activity_level")
    goal = user.get("goal")

    stats = []
    if age:
        stats.append({"label": "Age", "value": str(age)})
    bmi = _bmi(weight, height)
    if bmi:
        stats.append({"label": "BMI", "value": f"{bmi} · {_bmi_band(bmi)}"})
    if activity:
        stats.append({"label": "Activity", "value": str(activity).replace("_", " ").title()})
    if age and gender and weight and height:
        try:
            t = calc_tdee(age, gender, weight, height, activity, goal or "maintain")
            stats.append({"label": "Daily target", "value": f"{t['target_calories']:,} kcal"})
        except Exception:
            pass

    focus = []
    if rec and rec.get("food_rules"):
        focus = rec["food_rules"][:3]
    else:
        focus = [
            "A balanced, whole-food foundation tailored to you.",
            "Anti-inflammatory staples to support long-term wellness.",
            "Steady energy and simple, sustainable habits.",
        ]

    diet_type = (user.get("dietary_type") or "").replace("_", " ").title() or None

    return {
        "greeting": f"Welcome, {first}",
        "headline": ebook_doc["condition_label"],
        "condition_label": rec["label"] if rec else (all_labels[0] if all_labels else "General Wellness"),
        "condition_blurb": (rec.get("blurb") if rec else None)
        or "A personalised nutrition guide built around your profile.",
        "all_conditions": all_labels,
        "goal_30day": user.get("goal_30day"),
        "stats": stats,
        "diet": {"type": diet_type, "allergies": user.get("allergies") or []},
        "focus_points": focus,
    }


@router.get("/me")
async def get_my_ebook(type: Optional[str] = None, user=Depends(get_current_user)):
    """The single ebook for the logged-in user. 
    If type='premium', fetches their personalised AI guide."""
    if type == "premium":
        doc = await db.premium_ebooks.find_one({"user_id": user["id"]})
        if not doc:
            raise HTTPException(404, "No premium guide found.")
        return doc

    primary = _resolve_primary_condition(user)
    slug = CONDITION_TO_EBOOK.get(primary, DEFAULT_EBOOK) if primary else DEFAULT_EBOOK

    doc = await db.ebooks.find_one({"condition_id": slug})
    # If their mapped book isn't ready, fall back to the default book.
    if (not doc or doc.get("status") != "ready") and slug != DEFAULT_EBOOK:
        slug = DEFAULT_EBOOK
        doc = await db.ebooks.find_one({"condition_id": slug})

    if not doc:
        raise HTTPException(404, "No ebook available yet. Run generate_ebooks.py script.")
    if doc.get("status") != "ready":
        raise HTTPException(202, "Your guide is still being prepared. Check back shortly.")

    chapters = []
    for cid in [str(i) for i in range(1, 17)]:
        chapters.append({
            "id": int(cid),
            "title": CHAPTER_TITLES.get(cid, f"Chapter {cid}"),
            "html_content": doc.get("chapters", {}).get(cid, ""),
        })

    return {
        "condition_id": doc["condition_id"],
        "condition_label": doc["condition_label"],
        "generated_at": doc.get("generated_at"),
        "chapters": chapters,
        "summary": _build_summary(user, doc, primary),
    }


@router.get("/{condition_id}")
async def get_ebook(condition_id: str):
    if condition_id not in VALID_CONDITIONS:
        raise HTTPException(400, f"Unknown condition. Valid: {VALID_CONDITIONS}")

    doc = await db.ebooks.find_one({"condition_id": condition_id})
    if not doc:
        raise HTTPException(404, "Ebook not yet generated. Run generate_ebooks.py script.")

    if doc.get("status") != "ready":
        raise HTTPException(202, "Ebook is still being generated. Try again in a moment.")

    # Build ordered chapter list
    chapters = []
    for cid in [str(i) for i in range(1, 17)]:
        content = doc.get("chapters", {}).get(cid, "")
        chapters.append({
            "id": int(cid),
            "title": CHAPTER_TITLES.get(cid, f"Chapter {cid}"),
            "html_content": content,
        })

    if "_id" in doc:
        doc["_id"] = str(doc["_id"])

    return {
        "condition_id": doc["condition_id"],
        "condition_label": doc["condition_label"],
        "generated_at": doc.get("generated_at"),
        "chapters": chapters,
    }
