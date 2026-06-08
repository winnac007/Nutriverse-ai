from fastapi import APIRouter, HTTPException, Depends
from app.core.database import db
from app.core.security import get_current_user, calc_tdee
from app.data.healthcare_data import CONDITIONS

router = APIRouter(prefix="/ebook", tags=["ebook"])

VALID_CONDITIONS = ["pcos", "diabetes", "thyroid", "gut-health", "anti-inflammatory", "menopause"]

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
async def get_my_ebook(user=Depends(get_current_user)):
    """The single ebook for the logged-in user, auto-resolved from their
    onboarding condition, plus a profile-based personalised summary."""
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
