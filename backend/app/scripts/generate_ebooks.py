"""
Pre-seed all condition ebooks into MongoDB `ebooks` collection.

Run ONCE (or re-run to regenerate a specific condition):
    cd backend && source venv/bin/activate
    python -m app.scripts.generate_ebooks                    # all conditions
    python -m app.scripts.generate_ebooks pcos               # one condition only
    python -m app.scripts.generate_ebooks pcos --force       # force re-generate
    python -m app.scripts.generate_ebooks --recipes-only     # cheap: refresh recipe
                                                             # chapter (incl. images),
                                                             # no Gemini calls

Uses gemini-2.5-flash-lite. Writes each chapter-group to DB as it completes
so a mid-run quota error loses at most one batch, not the whole ebook.
"""
import sys
import json
import time
import asyncio
import logging
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from motor.motor_asyncio import AsyncIOMotorClient
from google import genai
from google.genai import types as gtypes

from app.core.config import settings
from app.data.healthcare_data import CONDITIONS

logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
logger = logging.getLogger(__name__)

# ── Ebook conditions ─────────────────────────────────────────────────────────
# These are the 6 conditions the user wants ebooks for.
# Maps ebook slug → condition id in healthcare_data.py (or "virtual" for custom).
EBOOK_CONDITIONS = {
    "pcos": "pcos",
    "diabetes": "diabetes",
    "thyroid": "thyroid",
    "gut-health": "gut-health",
    "anti-inflammatory": "virtual",  # no single condition ID; lifestyle category
    "menopause": "menopause",
}

# ── Fixed references (never AI-generated to avoid hallucination) ───────────────
FIXED_REFERENCES = """
<h3>Evidence-Based Resources</h3>
<ul>
  <li><strong>WHO</strong> — Healthy diet guidelines: <em>who.int/nutrition/topics/healthydiet</em></li>
  <li><strong>NIH / PubMed</strong> — National Library of Medicine: <em>pubmed.ncbi.nlm.nih.gov</em></li>
  <li><strong>Harvard T.H. Chan School of Public Health</strong> — The Nutrition Source: <em>hsph.harvard.edu/nutritionsource</em></li>
  <li><strong>Academy of Nutrition and Dietetics</strong> — <em>eatright.org</em></li>
  <li><strong>Endocrine Society</strong> — Clinical practice guidelines: <em>endocrine.org/guidelines</em></li>
</ul>
<p class="disclaimer">
  <strong>Medical Disclaimer:</strong> This ebook is for general informational and educational purposes only.
  It is not a substitute for professional medical advice, diagnosis, or treatment.
  Always seek the guidance of your doctor or a qualified health provider with any questions
  you may have regarding a medical condition or diet change.
</p>
"""

DISCLAIMER_BANNER = """
<div class="disclaimer-banner">
  ⚕️ <strong>Medical Disclaimer:</strong> This ebook provides general nutrition education only.
  It is not medical advice. Consult your doctor before making significant dietary changes,
  especially for clinical conditions.
</div>
"""


def _get_condition_data(condition_id: str) -> Optional[Dict]:
    """Pull the condition record from healthcare_data.py by id."""
    for c in CONDITIONS:
        if c["id"] == condition_id:
            return c
    return None


def _condition_context(slug: str) -> str:
    """Build a context block from the app's own condition rules to inject into prompts."""
    if slug == "anti-inflammatory":
        return """
Condition: Anti-Inflammatory Diet
Description: A dietary approach focused on reducing chronic inflammation, which underlies many diseases including arthritis, heart disease, type 2 diabetes, and autoimmune conditions.
Foods to eat: turmeric, ginger, fatty fish (salmon, sardines), berries, leafy greens, olive oil, walnuts, flaxseed, green tea, colorful vegetables, legumes, whole grains
Foods to avoid: processed foods, refined sugar, trans fats, vegetable oils (corn, sunflower), alcohol, refined carbohydrates, artificial additives, red and processed meats
Key nutrition rules:
- Omega-3 to omega-6 ratio: aim for 1:4 or better (most Western diets are 1:20)
- Antioxidants (vitamins C, E, beta-carotene) are your primary anti-inflammatory tools
- Polyphenols in berries, tea, and dark chocolate reduce inflammatory markers
- A Mediterranean dietary pattern is the gold standard for anti-inflammatory eating
"""
    cond = _get_condition_data(slug)
    if not cond:
        return ""
    return f"""
Condition: {cond['label']}
Description: {cond['blurb']}
Foods to eat: {', '.join(cond.get('foods_to_eat', []))}
Foods to avoid: {', '.join(cond.get('foods_to_avoid', []))}
Key nutrition rules:
{chr(10).join(f'- {r}' for r in cond.get('food_rules', []))}
"""


def _call_gemini(client: Any, prompt: str, retries: int = 3) -> str:
    """Call Gemini with retry on 429 (quota)."""
    for attempt in range(retries):
        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash-lite",
                contents=prompt,
                config=gtypes.GenerateContentConfig(
                    temperature=0.4,
                    max_output_tokens=8192,
                ),
            )
            return response.text
        except Exception as e:
            if "429" in str(e) and attempt < retries - 1:
                wait = 20 * (attempt + 1)
                logger.warning("Rate limited, waiting %ds (attempt %d/%d)...", wait, attempt + 1, retries)
                time.sleep(wait)
            else:
                raise
    return ""


def _generate_batch(client: Any, slug: str, batch_num: int, context: str) -> Dict[str, str]:
    """
    Generate a batch of chapters. Returns dict: chapter_id (str) -> html_content.
    """
    batches = {
        1: {
            "chapters": [1, 2, 3, 4],
            "definitions": """
Chapter 1 — Introduction: What this condition is, why it matters, who this ebook is for, what you'll learn, how to use this guide.
Chapter 2 — Understanding the Condition: What happens in the body, causes and risk factors, common symptoms, long-term health impact, common myths.
Chapter 3 — The Nutrition Connection: How food affects the condition, blood sugar relationship, hormone relationship, inflammation relationship, gut health relationship, energy and metabolism.
Chapter 4 — Symptom Assessment: Identify your symptoms (include a self-check list), lifestyle assessment, eating habits assessment, current challenges, goal setting (include a goal-setting worksheet).
"""
        },
        2: {
            "chapters": [5, 6, 7, 8],
            "definitions": """
Chapter 5 — Nutrition Foundations: Protein (role + sources), Fiber (role + sources), Healthy fats, Carbohydrates, Hydration, Meal timing, Portion awareness.
Chapter 6 — Foods to Prioritize: Best foods for this condition with explanations, superfoods, protein sources, fruits, vegetables, healthy fats, functional ingredients (spices/herbs that help).
Chapter 7 — Foods to Limit: Highly processed foods, added sugars, refined carbohydrates, trigger foods specific to this condition, lifestyle habits affecting symptoms.
Chapter 8 — Building Your Plate: Breakfast formula, Lunch formula, Dinner formula, Snack formula, Eating out formula, Travel formula. Include a visual plate-building description (e.g., "fill half your plate with...").
"""
        },
        3: {
            "chapters": [10, 11, 12],
            "definitions": """
Chapter 10 — Meal Plans: Write a complete 7-day meal plan (breakfast, lunch, dinner, snack each day). Then write a 3-day plan variation. Include a vegetarian option note and a budget option note.
Chapter 11 — Lifestyle Support: Sleep (how it affects the condition), stress management (techniques), physical activity (recommendations), mindful eating, habit building (habit stacking tips), recovery.
Chapter 12 — Common Challenges & Solutions: Cravings (how to handle), fatigue, eating out tips, social event strategies, busy schedule meal prep tips, motivation maintenance.
"""
        },
        4: {
            "chapters": [13, 14, 15],
            "definitions": """
Chapter 13 — Progress Tracking: Include printable-style symptom tracker table (weekly columns), energy tracker, meal tracker template, habit tracker, weekly review questions.
Chapter 14 — FAQs: Write 8-10 most common questions and answers specific to this condition and nutrition. Include common misconceptions and practical concerns.
Chapter 15 — Key Takeaways: Concise summary of the entire ebook, 10 actionable steps to start today, a 30-day action plan (week by week).
"""
        },
    }

    b = batches[batch_num]
    chapters_list = b["chapters"]
    chapter_defs = b["definitions"]

    prompt = f"""You are a clinical nutritionist writing an expert ebook chapter on {slug.replace('-', ' ').title()}.

CONDITION CONTEXT (from our app's clinical database — your content MUST be consistent with these rules):
{context}

TASK: Generate rich, evidence-based HTML content for these chapters:
{chapter_defs}

OUTPUT FORMAT: Return a JSON object where each key is the chapter number (as string) and the value is a string of clean HTML content. Use proper HTML tags: <h3>, <h4>, <p>, <ul>, <li>, <ol>, <strong>, <em>, <table>, <tr>, <td>, <th>. No markdown. No code fences. No outer wrapper div.

Example format:
{{"5": "<h3>Protein</h3><p>...</p>", "6": "<h3>Best Foods</h3><p>...</p>"}}

IMPORTANT:
- Write at least 400 words per chapter, 600+ for chapters with many sections
- Be specific to {slug.replace('-', ' ').title()} — not generic nutrition advice
- Include practical, actionable tips
- For tracker chapters, create proper HTML tables
- For meal plan chapter, write actual complete meals (not "chicken dish" — write "Grilled lemon herb chicken with roasted sweet potato and spinach salad")
- Do NOT make up specific research citations or study authors — reference categories (WHO, NIH, Harvard) only
- Return ONLY the JSON object, no prose before or after
"""
    raw = _call_gemini(client, prompt)
    # strip markdown fences if model adds them
    raw = raw.strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1].lstrip("json").strip()
        if "```" in raw:
            raw = raw[:raw.rfind("```")]
    parsed = json.loads(raw)
    # normalise keys to strings
    return {str(k): v for k, v in parsed.items()}


async def _get_recipes_for_condition(slug: str, db) -> List[Dict]:
    """Pull 6-8 real MealDB recipes that match the condition."""
    CONDITION_KEYWORDS = {
        "pcos": ["chicken", "salmon", "quinoa", "lentil", "spinach", "salad"],
        "diabetes": ["chicken", "fish", "lentil", "vegetable", "soup", "salad"],
        "thyroid": ["salmon", "egg", "beef", "chicken", "seafood"],
        "gut-health": ["yogurt", "soup", "vegetable", "chicken", "fish"],
        "anti-inflammatory": ["salmon", "turmeric", "chicken", "salad", "vegetable"],
        "menopause": ["salmon", "chicken", "tofu", "vegetable", "lentil"],
    }
    keywords = CONDITION_KEYWORDS.get(slug, ["chicken", "vegetable"])
    # text search on MealDB recipes
    recipes = []
    for kw in keywords[:4]:
        hits = await db.recipes.find(
            {"source": "themealdb", "$text": {"$search": kw}},
            {"title": 1, "image": 1, "ingredients": 1, "cuisine": 1, "nutrition": 1, "steps": 1}
        ).limit(2).to_list(2)
        recipes.extend(hits)

    # deduplicate by title
    seen = set()
    unique = []
    for r in recipes:
        if r["title"] not in seen:
            seen.add(r["title"])
            unique.append(r)
    return unique[:8]


# Same Unsplash fallback the frontend uses, so a missing/broken MealDB photo
# degrades gracefully instead of showing a broken image icon.
RECIPE_FALLBACK_IMG = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600"


def _format_recipes_html(recipes: List[Dict]) -> str:
    if not recipes:
        return "<p>Browse our recipe collection in the app for condition-specific meals.</p>"
    html = ""
    for r in recipes:
        ings = "".join(f"<li>{i['unit']} {i['name']}".strip() + "</li>" for i in r.get("ingredients", [])[:8])
        steps = "".join(f"<li>{s}</li>" for s in r.get("steps", [])[:5])
        nutr = r.get("nutrition", {})
        img = r.get("image") or RECIPE_FALLBACK_IMG
        html += f"""
<div class="recipe-card">
  <img class="recipe-img" src="{img}" alt="{r['title']}" loading="lazy"
       onerror="this.onerror=null;this.src='{RECIPE_FALLBACK_IMG}'" />
  <div class="recipe-body">
    <h4>{r['title']}</h4>
    <p class="recipe-meta">Cuisine: {r.get('cuisine','—')} &nbsp;|&nbsp; Calories: ~{nutr.get('calories','?')} kcal &nbsp;|&nbsp; Protein: ~{nutr.get('protein','?')}g</p>
    <h5>Ingredients</h5><ul>{ings}</ul>
    <h5>Method</h5><ol>{steps}</ol>
  </div>
</div>"""
    return html


async def refresh_recipes_only(slug: str, db) -> None:
    """Re-write ONLY chapter 9 (recipes) for an existing ebook — no AI calls.

    Cheap path to push freshly-formatted recipe HTML (e.g. with images) into
    ebooks that are already generated, without burning Gemini quota.
    """
    recipes = await _get_recipes_for_condition(slug, db)
    chapter9_html = _format_recipes_html(recipes)
    res = await db.ebooks.update_one(
        {"condition_id": slug},
        {"$set": {"chapters.9": chapter9_html}},
    )
    if res.matched_count:
        logger.info("  Refreshed recipes (chapter 9) for %s — %d recipes.", slug, len(recipes))
    else:
        logger.warning("  No ebook doc for %s yet — generate it first.", slug)


async def generate_condition_ebook(slug: str, db, client: Any, force: bool = False) -> None:
    condition_id = EBOOK_CONDITIONS.get(slug)
    if not condition_id:
        logger.error("Unknown condition slug: %s", slug)
        return

    existing = await db.ebooks.find_one({"condition_id": slug})
    if existing and not force:
        existing_chapters = set(existing.get("chapters", {}).keys())
        all_expected = {str(i) for i in range(1, 17)}
        missing = all_expected - existing_chapters
        if not missing:
            logger.info("Ebook for %s already complete. Skipping. (use --force to regenerate)", slug)
            return
        logger.info("Ebook for %s exists but missing chapters %s — filling gaps.", slug, sorted(missing))

    label_map = {
        "pcos": "PCOS",
        "diabetes": "Diabetes (Type 2)",
        "thyroid": "Thyroid (Hypothyroidism)",
        "gut-health": "Gut Health",
        "anti-inflammatory": "Anti-Inflammatory Diet",
        "menopause": "Menopause",
    }
    label = label_map.get(slug, slug.replace("-", " ").title())
    context = _condition_context(slug)

    # Seed an ebook document; chapters filled as we go
    if not existing:
        await db.ebooks.insert_one({
            "condition_id": slug,
            "condition_label": label,
            "chapters": {},
            "status": "generating",
            "generated_at": None,
        })

    logger.info("=== Generating ebook: %s ===", label)

    # Chapter 9 is handled separately (real recipes from DB)
    recipes = await _get_recipes_for_condition(slug, db)
    chapter9_html = _format_recipes_html(recipes)

    BATCH_CHAPTERS = {1: ["1","2","3","4"], 2: ["5","6","7","8"], 3: ["10","11","12"], 4: ["13","14","15"]}
    existing_chapters = set((existing or {}).get("chapters", {}).keys())

    for batch_num in range(1, 5):
        needed = [c for c in BATCH_CHAPTERS[batch_num] if c not in existing_chapters]
        if not needed:
            logger.info("  Batch %d already complete, skipping.", batch_num)
            continue
        logger.info("  Batch %d/4 (need chapters %s)...", batch_num, needed)
        try:
            html_map = _generate_batch(client, slug, batch_num, context)
            await db.ebooks.update_one(
                {"condition_id": slug},
                {"$set": {f"chapters.{cid}": content for cid, content in html_map.items()}}
            )
            existing_chapters.update(html_map.keys())
            logger.info("  Batch %d saved (%d chapters).", batch_num, len(html_map))
        except Exception as e:
            logger.error("  Batch %d FAILED: %s", batch_num, e)
        time.sleep(5)  # respect rate limits between batches

    # Save chapter 9 (recipes from DB, not AI-generated)
    await db.ebooks.update_one(
        {"condition_id": slug},
        {"$set": {
            "chapters.9": chapter9_html,
            "chapters.16": FIXED_REFERENCES,
            "status": "ready",
            "generated_at": datetime.now(timezone.utc).isoformat(),
        }}
    )
    logger.info("=== Done: %s ===", label)


async def main():
    args = sys.argv[1:]
    force = "--force" in args
    recipes_only = "--recipes-only" in args
    slugs = [a for a in args if not a.startswith("--")]

    if not slugs:
        slugs = list(EBOOK_CONDITIONS.keys())

    db_client = AsyncIOMotorClient(settings.MONGO_URL)
    db = db_client[settings.DB_NAME]

    # Recipes-only refresh skips Gemini entirely (no API key needed).
    if recipes_only:
        logger.info("=== Refreshing recipe chapter (no AI) for: %s ===", slugs)
        for slug in slugs:
            if slug not in EBOOK_CONDITIONS:
                logger.error("Unknown slug: %s. Valid: %s", slug, list(EBOOK_CONDITIONS.keys()))
                continue
            await refresh_recipes_only(slug, db)
        logger.info("All done (recipes only).")
        return

    client = genai.Client(api_key=settings.GEMINI_API_KEY)

    await db.ebooks.create_index([("condition_id", 1)], unique=True)

    for slug in slugs:
        if slug not in EBOOK_CONDITIONS:
            logger.error("Unknown slug: %s. Valid: %s", slug, list(EBOOK_CONDITIONS.keys()))
            continue
        await generate_condition_ebook(slug, db, client, force=force)
        time.sleep(10)  # pause between conditions

    logger.info("All done.")


if __name__ == "__main__":
    asyncio.run(main())
