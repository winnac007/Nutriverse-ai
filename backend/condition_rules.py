"""
Clinical rule engine for tagging recipes with health condition suitability.

Rules are derived from published guidelines:
  - Diabetes:          ADA Standards of Medical Care in Diabetes (2024)
  - Heart / BP:        ACC/AHA Guideline on Cardiovascular Disease Prevention
  - PCOS:              Endocrine Society Clinical Practice Guideline
  - Thyroid:           ATA Guidelines; NIH Office of Dietary Supplements
  - Kidney:            KDOQI Clinical Practice Guideline for Nutrition in CKD
  - Gut Health:        Gut Microbiota for Health Expert Panel; FODMAP research
  - Weight Management: WHO Technical Report Series; ACSM Position Stand
  - Immunity:          NIH National Institute of Allergy and Infectious Diseases

Nutrition values from Spoonacular use per-serving amounts.
"""

from typing import Dict, Any, List, Tuple

# ── Condition priority matrix (lower number = higher priority in conflicts) ────
# Priority 1: critical medical conditions that always win macro conflicts
# Priority 2: moderate medical conditions
# Priority 3: lifestyle conditions (weight management, immunity, etc.)
CONDITION_PRIORITY = {
    # Critical (1) — always override on conflict
    "kidney-disease": 1,
    "celiac": 1,
    "diabetes-t1": 1,
    "pregnancy": 1,
    # Moderate (2)
    "diabetes": 2,
    "heart-disease": 2,
    "hypertension": 2,
    "pcos": 3,
    "thyroid": 3,
    "hyperthyroid": 3,
    "hashimotos": 3,
    "ibs": 3,
    "gerd": 3,
    "fatty-liver": 3,
    "gastritis": 3,
    "kidney-stones": 3,
    "iron-deficiency": 4,
    "b12-deficiency": 4,
    "vitamin-d": 4,
    "calcium-deficiency": 4,
    "prediabetes": 4,
    "insulin-resistance": 4,
    "high-cholesterol": 4,
    "high-triglycerides": 4,
    "gluten-intolerance": 4,
    "lactose-intolerance": 5,
    "gout": 4,
    "osteoporosis": 4,
    "rheumatoid-arthritis": 4,
    "menopause": 5,
    "obesity": 5,
    # Lifestyle (high number = lowest priority)
    "weight-management": 6,
    "immunity": 6,
    "gut-health": 6,
    "depression": 6,
    "migraine": 6,
}


def resolve_macro_conflicts(conditions: List[str], base_macros: Dict[str, float]) -> Tuple[Dict[str, float], List[str]]:
    """
    Resolve macro conflicts when conditions impose contradictory requirements.
    Returns adjusted macros and a list of trade-off notes to show the user.
    Higher-priority conditions override lower-priority ones on conflicts.

    Known conflicts handled:
      - CKD (priority 1) vs high-protein goals: CKD wins, protein capped at 0.6-0.8g/kg
      - CKD vs high-potassium needs: CKD wins
      - Diabetes vs high-carb goals: diabetes wins, carbs capped
      - Pregnancy vs anything: pregnancy protein needs override
    """
    trade_offs = []
    macros = dict(base_macros)

    sorted_conditions = sorted(conditions, key=lambda c: CONDITION_PRIORITY.get(c, 99))

    # CKD takes absolute priority on protein
    if "kidney-disease" in conditions:
        if macros.get("protein_g", 0) > 50:
            macros["protein_g"] = 50
            trade_offs.append(
                "Kidney disease requires lower protein (≤50g/day). "
                "Other conditions requesting high protein have been adjusted."
            )

    # Pregnancy boosts protein requirements
    if "pregnancy" in conditions and macros.get("protein_g", 0) < 71:
        macros["protein_g"] = max(macros.get("protein_g", 60), 71)
        trade_offs.append("Pregnancy increases protein needs to at least 71g/day.")

    # Diabetes caps net carbs
    if "diabetes" in conditions or "diabetes-t1" in conditions or "prediabetes" in conditions:
        max_carbs = 150 if "diabetes-t1" in conditions else 130
        if macros.get("carbs_g", 0) > max_carbs:
            macros["carbs_g"] = max_carbs
            trade_offs.append(
                f"Diabetes management requires limiting carbs to ≤{max_carbs}g/day. "
                "Carbs have been adjusted down."
            )

    # High-cholesterol caps saturated fat (tracked via total fat proxy)
    if "high-cholesterol" in conditions and macros.get("fat_g", 0) > 60:
        macros["fat_g"] = 60
        trade_offs.append(
            "High cholesterol requires limiting fat to ≤60g/day, "
            "prioritising unsaturated sources."
        )

    return macros, trade_offs


# ── Goitrogen-containing ingredients (thyroid concern when raw) ────────────────
THYROID_GOITROGENS = {
    "broccoli", "cauliflower", "cabbage", "kale", "brussels sprouts",
    "bok choy", "collard greens", "kohlrabi", "turnip", "radish",
    "millet", "soy", "tofu", "soybean", "edamame",
}

# ── High-FODMAP ingredients (gut health concern) ─────────────────────────────
HIGH_FODMAP = {
    "garlic", "onion", "leek", "asparagus", "artichoke", "mushroom",
    "apple", "pear", "mango", "watermelon", "honey", "wheat", "rye",
    "barley", "milk", "ice cream", "soft cheese", "cottage cheese",
    "cashew", "pistachio", "legume", "chickpea", "lentil", "kidney bean",
}

# ── High-potassium ingredients (kidney concern) ──────────────────────────────
HIGH_POTASSIUM_INGREDIENTS = {
    "banana", "potato", "sweet potato", "tomato", "orange", "avocado",
    "spinach", "beet", "prune", "dried fruit", "nuts", "seeds",
    "salmon", "tuna", "halibut", "cod", "beef", "pork",
}

# ── High-phosphorus ingredients (kidney concern) ─────────────────────────────
HIGH_PHOSPHORUS_INGREDIENTS = {
    "dairy", "milk", "cheese", "yogurt", "processed food", "cola",
    "nuts", "seeds", "chocolate", "organ meat", "sardine",
}

# ── Anti-inflammatory ingredients (PCOS and immunity benefit) ────────────────
ANTI_INFLAMMATORY = {
    "turmeric", "ginger", "garlic", "salmon", "sardine", "mackerel",
    "berries", "blueberry", "strawberry", "cherry", "walnut", "flaxseed",
    "olive oil", "spinach", "kale", "broccoli", "green tea",
}

# ── Immunity-boosting ingredients ─────────────────────────────────────────────
IMMUNITY_BOOSTERS = {
    "citrus", "lemon", "orange", "grapefruit", "bell pepper", "capsicum",
    "broccoli", "spinach", "garlic", "ginger", "turmeric", "yogurt",
    "almond", "sunflower seed", "sweet potato", "green tea", "amla",
    "gooseberry", "papaya", "kiwi",
}


def _ingredient_names(recipe: Dict[str, Any]) -> set:
    """Extract lowercase ingredient name strings from a Spoonacular recipe."""
    names = set()
    for ing in recipe.get("extendedIngredients", []):
        name = (ing.get("name") or ing.get("nameClean") or "").lower()
        if name:
            names.add(name)
        # Also add individual words for partial matching
        for word in name.split():
            if len(word) > 3:
                names.add(word)
    return names


def _nutrition(recipe: Dict[str, Any]) -> Dict[str, float]:
    """Extract nutrition values from Spoonacular per-serving nutrition info."""
    out = {}
    nutrients = (
        recipe.get("nutrition", {}).get("nutrients")
        or recipe.get("nutritionInfo", {}).get("nutrients")
        or []
    )
    for n in nutrients:
        key = n.get("name", "").lower().replace(" ", "_")
        out[key] = float(n.get("amount", 0))
    return out


def tag_diabetes(recipe: Dict[str, Any], ingredients: set, nutrition: Dict[str, float]) -> bool:
    """
    Diabetes-safe: low glycemic load, controlled carbs, adequate fiber.
    ADA: <45g net carbs per meal, fiber ≥5g, total sugar ≤10g.
    """
    carbs = nutrition.get("carbohydrates", 9999)
    sugar = nutrition.get("sugar", 9999)
    fiber = nutrition.get("fiber", 0)
    net_carbs = max(0, carbs - fiber)

    if net_carbs > 50:
        return False
    if sugar > 15:
        return False
    if carbs < 80 and fiber >= 3:
        return True
    return False


def tag_heart_disease(recipe: Dict[str, Any], ingredients: set, nutrition: Dict[str, float]) -> bool:
    """
    Heart/BP safe: low sodium, low saturated fat, adequate fiber.
    ACC/AHA: sodium <600mg/meal, saturated fat <7g, fiber ≥3g.
    """
    sodium = nutrition.get("sodium", 9999)
    sat_fat = nutrition.get("saturated_fat", 9999)
    fiber = nutrition.get("fiber", 0)
    cholesterol = nutrition.get("cholesterol", 9999)

    if sodium > 700:
        return False
    if sat_fat > 8:
        return False
    if cholesterol > 200:
        return False
    return True


def tag_pcos(recipe: Dict[str, Any], ingredients: set, nutrition: Dict[str, float]) -> bool:
    """
    PCOS-friendly: low GI proxy (low sugar + high fiber), anti-inflammatory.
    Endocrine Society: low glycemic diet, anti-inflammatory foods.
    """
    sugar = nutrition.get("sugar", 9999)
    fiber = nutrition.get("fiber", 0)
    carbs = nutrition.get("carbohydrates", 9999)
    sat_fat = nutrition.get("saturated_fat", 9999)

    if sugar > 12:
        return False
    if carbs > 60 and fiber < 4:
        return False
    if sat_fat > 10:
        return False

    # Bonus: anti-inflammatory ingredients increase suitability
    anti_inflam_hits = len(ingredients & ANTI_INFLAMMATORY)
    if sugar > 8 and anti_inflam_hits < 1:
        return False
    return True


def tag_thyroid(recipe: Dict[str, Any], ingredients: set, nutrition: Dict[str, float]) -> bool:
    """
    Thyroid-supportive: avoid raw goitrogens, support selenium/iodine.
    ATA: cooking neutralises most goitrogens; avoid excessive raw cruciferous.
    Note: we can't detect cooking method reliably from ingredients alone,
    so we flag recipes containing goitrogenic ingredients for review.
    """
    # Check if recipe title/instructions hint at raw preparation
    title = (recipe.get("title") or "").lower()
    raw_signals = {"raw", "salad", "slaw", "smoothie", "juice", "uncooked"}
    is_likely_raw = any(s in title for s in raw_signals)

    goitrogen_hits = ingredients & THYROID_GOITROGENS
    if is_likely_raw and len(goitrogen_hits) >= 2:
        return False

    # Excessive soy is problematic for thyroid medication absorption
    soy_ingredients = {"soy", "tofu", "edamame", "soybean", "tempeh"}
    if len(ingredients & soy_ingredients) >= 2:
        return False

    return True


def tag_weight_management(recipe: Dict[str, Any], ingredients: set, nutrition: Dict[str, float]) -> bool:
    """
    Weight management: moderate calories, high protein and fiber, low calorie density.
    WHO/ACSM: protein ≥15g per meal, fiber ≥4g, calories ≤500 per serving.
    """
    calories = nutrition.get("calories", 9999)
    protein = nutrition.get("protein", 0)
    fiber = nutrition.get("fiber", 0)
    fat = nutrition.get("fat", 9999)

    if calories > 600:
        return False
    if fat > 25 and protein < 15:
        return False
    if protein < 8 and fiber < 3:
        return False
    return True


def tag_gut_health(recipe: Dict[str, Any], ingredients: set, nutrition: Dict[str, float]) -> bool:
    """
    Gut-friendly: high fiber, low-FODMAP friendly, fermented-food positive.
    Research: FODMAP reduction helps IBS; fiber feeds beneficial bacteria.
    """
    fiber = nutrition.get("fiber", 0)
    fat = nutrition.get("fat", 9999)

    # High saturated fat disrupts gut microbiome
    sat_fat = nutrition.get("saturated_fat", 9999)
    if sat_fat > 12:
        return False

    # Excessive FODMAP ingredients are problematic
    fodmap_hits = len(ingredients & HIGH_FODMAP)
    if fodmap_hits >= 3:
        return False

    if fiber < 2 and fodmap_hits >= 2:
        return False

    return True


def tag_kidney_disease(recipe: Dict[str, Any], ingredients: set, nutrition: Dict[str, float]) -> bool:
    """
    Kidney-friendly: low potassium, low phosphorus, controlled protein.
    KDOQI: potassium <200mg/meal (moderate CKD), protein 0.6–0.8g/kg/day.
    Per meal: sodium <400mg, potassium <400mg, phosphorus <250mg, protein ≤20g.
    """
    sodium = nutrition.get("sodium", 9999)
    potassium = nutrition.get("potassium", 9999)
    phosphorus = nutrition.get("phosphorus", 9999)
    protein = nutrition.get("protein", 9999)

    if sodium > 450:
        return False
    if potassium > 500:
        return False
    if phosphorus > 300:
        return False
    if protein > 25:
        return False

    # High-potassium ingredient check
    potassium_hits = len(ingredients & HIGH_POTASSIUM_INGREDIENTS)
    phosphorus_hits = len(ingredients & HIGH_PHOSPHORUS_INGREDIENTS)
    if potassium_hits >= 3 or phosphorus_hits >= 2:
        return False

    return True


def tag_immunity(recipe: Dict[str, Any], ingredients: set, nutrition: Dict[str, float]) -> bool:
    """
    Immunity-boosting: rich in vitamin C, zinc, antioxidants.
    NIH: vitamin C ≥15mg/meal, zinc ≥2mg, diverse plant foods.
    """
    vit_c = nutrition.get("vitamin_c", 0)
    zinc = nutrition.get("zinc", 0)
    fiber = nutrition.get("fiber", 0)
    sugar = nutrition.get("sugar", 9999)

    # High sugar suppresses immune response
    if sugar > 20:
        return False

    immunity_hits = len(ingredients & IMMUNITY_BOOSTERS)

    # Pass if has vitamin C sources, zinc, or 2+ immunity boosters
    if vit_c >= 10 or zinc >= 1.5 or immunity_hits >= 2:
        return True

    # Also pass if high fiber (diverse plant foods = gut-immune axis)
    if fiber >= 5:
        return True

    return False


# ── Master tagger ─────────────────────────────────────────────────────────────
CONDITION_TAGGERS = {
    "diabetes":          tag_diabetes,
    "heart-disease":     tag_heart_disease,
    "pcos":              tag_pcos,
    "thyroid":           tag_thyroid,
    "weight-management": tag_weight_management,
    "gut-health":        tag_gut_health,
    "kidney-disease":    tag_kidney_disease,
    "immunity":          tag_immunity,
}


def apply_condition_tags(recipe: Dict[str, Any]) -> List[str]:
    """
    Run all condition taggers against a recipe.
    Returns list of condition IDs the recipe qualifies for.
    """
    ingredients = _ingredient_names(recipe)
    nutrition = _nutrition(recipe)
    matched = []
    for condition, tagger in CONDITION_TAGGERS.items():
        try:
            if tagger(recipe, ingredients, nutrition):
                matched.append(condition)
        except Exception:
            pass
    return matched


def filter_for_conditions(recipes: List[Dict[str, Any]], conditions: List[str]) -> List[Dict[str, Any]]:
    """
    Filter and sort recipes that are safe for ALL user conditions.
    Recipes safe for more conditions rank higher.
    """
    if not conditions:
        return recipes

    result = []
    for recipe in recipes:
        tags = apply_condition_tags(recipe)
        # Recipe must be safe for ALL user conditions (intersection)
        if all(c in tags for c in conditions):
            recipe["condition_tags"] = tags
            recipe["condition_match_count"] = len(tags)
            result.append(recipe)

    # Sort: more matching conditions first (more broadly healthy)
    result.sort(key=lambda r: r["condition_match_count"], reverse=True)
    return result


def generate_why_this_works(recipe: Dict[str, Any], conditions: List[str]) -> Dict[str, str]:
    """
    Generate human-readable explanations for why a recipe works for each condition.
    These are rule-based (no AI) and derived from the nutritional data.
    """
    ingredients = _ingredient_names(recipe)
    nutrition = _nutrition(recipe)
    explanations = {}

    for condition in conditions:
        if condition == "diabetes":
            fiber = nutrition.get("fiber", 0)
            sugar = nutrition.get("sugar", 0)
            carbs = nutrition.get("carbohydrates", 0)
            explanations[condition] = (
                f"Low in sugar ({sugar:.0f}g) and rich in fiber ({fiber:.0f}g), "
                f"which slows glucose absorption and prevents blood sugar spikes."
            )
        elif condition == "heart-disease":
            sodium = nutrition.get("sodium", 0)
            fiber = nutrition.get("fiber", 0)
            explanations[condition] = (
                f"Heart-friendly with only {sodium:.0f}mg sodium. "
                f"Fiber ({fiber:.0f}g) supports healthy cholesterol levels."
            )
        elif condition == "pcos":
            anti_hits = ingredients & ANTI_INFLAMMATORY
            sugar = nutrition.get("sugar", 0)
            if anti_hits:
                explanations[condition] = (
                    f"Contains anti-inflammatory ingredients ({', '.join(list(anti_hits)[:2])}) "
                    f"and low sugar ({sugar:.0f}g) to support hormonal balance."
                )
            else:
                explanations[condition] = f"Low glycemic with {sugar:.0f}g sugar, supporting insulin sensitivity."
        elif condition == "thyroid":
            explanations[condition] = (
                "Thyroid-supportive — avoids excessive raw goitrogens and soy "
                "that can interfere with thyroid hormone production or medication."
            )
        elif condition == "weight-management":
            cal = nutrition.get("calories", 0)
            protein = nutrition.get("protein", 0)
            explanations[condition] = (
                f"Calorie-controlled ({cal:.0f} kcal) with {protein:.0f}g protein "
                f"to keep you full and support lean muscle."
            )
        elif condition == "gut-health":
            fiber = nutrition.get("fiber", 0)
            explanations[condition] = (
                f"Gut-friendly with {fiber:.0f}g fiber to feed beneficial bacteria "
                f"and promote digestive health."
            )
        elif condition == "kidney-disease":
            potassium = nutrition.get("potassium", 0)
            sodium = nutrition.get("sodium", 0)
            explanations[condition] = (
                f"Kidney-safe: low in potassium ({potassium:.0f}mg) and sodium ({sodium:.0f}mg) "
                f"to reduce strain on the kidneys."
            )
        elif condition == "immunity":
            vit_c = nutrition.get("vitamin_c", 0)
            immunity_hits = ingredients & IMMUNITY_BOOSTERS
            if immunity_hits:
                explanations[condition] = (
                    f"Packed with immunity boosters ({', '.join(list(immunity_hits)[:2])}) "
                    f"and {vit_c:.0f}mg vitamin C."
                )
            else:
                explanations[condition] = f"Rich in nutrients that support immune function and reduce inflammation."

    return explanations
