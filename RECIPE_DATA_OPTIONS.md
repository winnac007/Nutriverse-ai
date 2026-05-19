# Recipe Data Source Alternatives to Spoonacular

> Written: 2026-05-19  
> Context: Nutriverse AI currently uses Spoonacular API. This doc evaluates replacements.

---

## What We Actually Need from Spoonacular

Before picking an alternative, here is the exact data our code consumes (`normalize_spoonacular_recipe`):

| Field | Used for |
|---|---|
| `id` | Recipe key (`sp-{id}`) |
| `title` | Display name |
| `image` | Recipe card thumbnail |
| `summary` | Short description (first 200 chars) |
| `cuisines[]` | Cuisine tag (Indian, Italian, etc.) |
| `preparationMinutes`, `readyInMinutes` | Cook-time filter |
| `servings` | Portion display |
| `nutrition.nutrients[]` | calories, protein, carbs, fat, fiber, sodium |
| `extendedIngredients[]` | name + amount + unit |
| `analyzedInstructions[].steps[].step` | Step-by-step cooking guide |
| `diets[]`, `dishTypes[]` | Diet tags (vegan, vegetarian, etc.) |
| `sourceUrl` | Attribution link |
| `healthScore` | `minHealthScore` filter in search |

**Search filters used:** `cuisine`, `diet`, `intolerances`, `maxReadyTime`, `minHealthScore`, `minProtein`, `sort=healthiness/popularity`, `excludeIngredients`

---

## The 4 Realistic Options

---

### Option 1 — Self-Hosted Open Dataset (Recommended)

**How it works:** Import a free open-source recipe dataset into MongoDB once. Enrich with USDA FoodData Central API for nutrition. Never call an external recipe API again.

**Best dataset: Food.com (Kaggle)**
- 230,000+ recipes with ingredients and instructions
- CC-BY license (attribution required, commercial use allowed)
- Download: `kaggle datasets download -d shuyangli94/food-com-recipes-and-user-interactions`
- Lacks nutritional data → enrich via USDA FoodData Central (free, no rate limit cap)

**Alternative dataset: RecipeNLG**
- 2.2 million recipes scraped from public cooking sites
- Has title, ingredients, instructions — no nutrition, no images
- Download: https://recipenlg.cs.put.poznan.pl

**USDA FoodData Central (nutrition enrichment)**
- Free API, no cost
- Takes ingredient list → returns calories, protein, carbs, fat, fiber, sodium
- Rate limit: 1000 req/hour (enough to bulk-import overnight)
- Endpoint: `https://api.nal.usda.gov/fdc/v1/foods/search`

**Images:** Use a deterministic Unsplash source URL based on recipe title keywords (already used as fallback in the app).

**Cost:** $0/month ongoing. One-time ~2–4 days of engineering.

**What changes in code:**
- Replace `recipe_service.py` fetch functions with MongoDB queries
- Write a one-time Python import script (parse dataset → enrich nutrition → insert to `recipes` collection)
- Add MongoDB text index on `title`, `tags`, `cuisine` for search
- Replace `sp-{id}` prefix with `local-{id}`
- Remove `SPOONACULAR_API_KEY` dependency

**Pros:**
- Zero ongoing cost
- Full ownership of data — no API outages
- Can add your own health-condition tags and curate quality
- Scales to millions of recipes if needed

**Cons:**
- 2–4 days of one-time engineering effort
- No automatic new recipes (static snapshot)
- Nutrition enrichment via USDA is approximate (ingredient-level, not recipe-level)
- Images must be sourced separately (Unsplash placeholder or scrape thumbnails)
- Cuisine/diet tagging is rough — needs post-processing or Claude API to classify

---

### Option 2 — Edamam Recipe API

**How it works:** Drop-in API replacement for Spoonacular with similar features.

**URL:** https://developer.edamam.com/edamam-recipe-api

**Pricing:**
- Free tier: 10,000 calls/month, 10 calls/minute
- Developer plan: $29/month — 100,000 calls/month
- Enterprise: custom pricing

**Features:**
- Full nutritional breakdown (calories, protein, carbs, fat, fiber, sodium) ✅
- Diet labels: vegan, vegetarian, keto, paleo, low-carb, etc. ✅
- Allergy/intolerance filters: gluten-free, dairy-free, nut-free, etc. ✅
- Cuisine type filter ✅
- Health labels (heart-healthy, diabetic-friendly, etc.) ✅ ← better than Spoonacular for health use
- Ingredient-level search ✅
- Images ✅

**What changes in code:**
- Swap `SPOONACULAR_BASE` + param mapping in `recipe_service.py`
- Edamam returns `recipe.totalNutrients` instead of `recipe.nutrition.nutrients[]`
- Edamam uses `app_id` + `app_key` auth instead of single `apiKey`
- Response shape is slightly different — need to rewrite `normalize_spoonacular_recipe()`

**Pros:**
- Better health labels than Spoonacular (explicit diabetic, heart-healthy labels = better condition matching)
- Similar pricing to Spoonacular
- Good free tier for early stage (10K calls/month is enough if caching is aggressive)
- 1–2 days to migrate

**Cons:**
- Still a paid external dependency
- 10 calls/minute limit on free tier can bottleneck bulk onboarding
- Recipe database is smaller than Spoonacular (~2M vs ~5M)

---

### Option 3 — TheMealDB + USDA Combo

**How it works:** Use TheMealDB for recipe base data, USDA for nutrition. Both are nearly free.

**TheMealDB:** https://www.themealdb.com/api.php
- Free (non-commercial) or $2/month Patreon for full access
- ~300 recipes total — very small library
- Has: recipe name, category (cuisine type), ingredients, instructions, YouTube link, image
- Missing: nutritional data, diet/allergy filters, portions/servings amounts

**Why this probably won't work:**
- 300 recipes is nowhere near enough for a personalized health app
- No nutritional data natively (must enrich every recipe via USDA)
- No diet/allergy filtering
- Users will see the same recipes repeatedly

**Verdict:** Only viable as a supplementary source or proof-of-concept. Skip for production.

---

### Option 4 — Hand-Curated MongoDB Collection (Quality play)

**How it works:** Build a focused library of 500–1,500 high-quality, health-condition-aligned recipes, curated manually and stored directly in MongoDB.

**Approach:**
1. Hire a freelance nutritionist/food blogger on Upwork ($200–500 one-time) to contribute recipes
2. Use Claude API (`claude-sonnet-4-6`) to auto-generate nutritional estimates, condition tags, and "why this works" copy for each recipe
3. Source images from Unsplash API (free) or upload to Cloudinary (free tier)
4. Store in `recipes` MongoDB collection with full schema matching your normalized format

**Cost:** ~$300–600 one-time, $0/month ongoing

**Pros:**
- Highest quality — recipes designed for your target conditions (diabetes, PCOS, CKD, etc.)
- Complete control over nutritional accuracy, tags, images
- Can pre-compute `condition_tags` and `why_this_works` for every recipe
- Zero API dependency
- "Curated for your condition" becomes a product differentiator

**Cons:**
- High one-time effort and coordination
- Limited variety early on (500 recipes vs. millions from Spoonacular)
- Needs regular content updates to feel fresh

---

## Recommendation

**For now (MVP/early stage):** Go with **Option 1 — Self-Hosted Food.com Dataset**

- Zero ongoing cost
- 230K recipes is more than enough
- Engineering effort is bounded and one-time
- You keep the same MongoDB architecture and caching layer you already have

**Longer term (post-PMF):** Layer in **Option 4 — Hand-Curated Collection** for your top 20 health conditions. Use the curated recipes as premium/featured content, bulk dataset as the long tail.

**Avoid:** Edamam unless you specifically need real-time recipe search (it solves the same problem as Spoonacular at a similar cost).

---

## Migration Plan for Option 1

### Step 1: Import script (1 day)
```python
# scripts/import_foodcom.py
# 1. Parse Food.com RAW_recipes.csv
# 2. Map columns: name → title, minutes → cook_time, tags → diets
# 3. For each recipe, call USDA FoodData Central for top 5 ingredients → aggregate nutrition
# 4. Classify cuisine via keyword matching (same LOCATION_TO_CUISINE map already in recipe_service.py)
# 5. Insert to MongoDB `recipes` collection
```

### Step 2: MongoDB indexes (30 min)
```javascript
db.recipes.createIndex({ title: "text", tags: "text", cuisine: 1 })
db.recipes.createIndex({ "nutrition.calories": 1, cuisine: 1, cook_time: 1 })
db.recipes.createIndex({ diets: 1, intolerances: 1 })
```

### Step 3: Replace recipe_service.py (1 day)
```python
# New fetch_personalized_recipes() queries MongoDB directly:
# db.recipes.find({
#   cuisine: { $in: user_cuisines },
#   diets: user_diet,
#   intolerances: { $nin: user_allergies },
#   cook_time: { $lte: max_time },
#   "nutrition.protein": { $gte: min_protein }  # for fitness category
# }).sort("nutrition.calories", 1).limit(20)
```

### Step 4: Remove Spoonacular env var + update next.config.ts image domains (30 min)

### Step 5: Test condition filter pipeline (2 hours)
- `filter_for_conditions()` in `condition_rules.py` already works on normalized nutrition dicts — no changes needed

**Total estimated time: 2–4 days**

---

## Nutrition Enrichment Quality Note

USDA FoodData Central gives ingredient-level nutrition. Aggregating per recipe is an approximation (doesn't account for cooking losses, water evaporation, etc.). For a health app:
- Accuracy is ±10–15% vs. lab-tested values — acceptable for general wellness use
- Add a disclaimer: "Nutritional values are estimates"
- For clinical users (CKD, dialysis), flag that values are approximate and doctor consultation is required

This is the same disclaimer standard used by MyFitnessPal, Cronometer, and similar apps.
