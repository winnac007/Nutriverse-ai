"""
Clinical rule engine for tagging recipes with health condition suitability.
"""

from typing import Dict, Any, List, Tuple

CONDITION_PRIORITY = {
    "kidney-disease": 1, "celiac": 1, "diabetes-t1": 1, "pregnancy": 1,
    "diabetes": 2, "heart-disease": 2, "hypertension": 2,
    "pcos": 3, "thyroid": 3, "hyperthyroid": 3, "hashimotos": 3, "ibs": 3, "gerd": 3, "fatty-liver": 3, "gastritis": 3, "kidney-stones": 3,
    "iron-deficiency": 4, "b12-deficiency": 4, "vitamin-d": 4, "calcium-deficiency": 4, "prediabetes": 4, "insulin-resistance": 4, "high-cholesterol": 4, "high-triglycerides": 4, "gluten-intolerance": 4, "gout": 4, "osteoporosis": 4, "rheumatoid-arthritis": 4,
    "lactose-intolerance": 5, "menopause": 5, "obesity": 5,
    "weight-management": 6, "immunity": 6, "gut-health": 6, "depression": 6, "migraine": 6,
}

def resolve_macro_conflicts(conditions: List[str], base_macros: Dict[str, float]) -> Tuple[Dict[str, float], List[str]]:
    trade_offs = []
    macros = dict(base_macros)
    if "kidney-disease" in conditions:
        if macros.get("protein_g", 0) > 50:
            macros["protein_g"] = 50
            trade_offs.append("Kidney disease requires lower protein (≤50g/day). Other conditions requesting high protein have been adjusted.")
    if "pregnancy" in conditions and macros.get("protein_g", 0) < 71:
        macros["protein_g"] = max(macros.get("protein_g", 60), 71)
        trade_offs.append("Pregnancy increases protein needs to at least 71g/day.")
    if any(c in conditions for c in ["diabetes", "diabetes-t1", "prediabetes"]):
        max_carbs = 150 if "diabetes-t1" in conditions else 130
        if macros.get("carbs_g", 0) > max_carbs:
            macros["carbs_g"] = max_carbs
            trade_offs.append(f"Diabetes management requires limiting carbs to ≤{max_carbs}g/day. Carbs have been adjusted down.")
    if "high-cholesterol" in conditions and macros.get("fat_g", 0) > 60:
        macros["fat_g"] = 60
        trade_offs.append("High cholesterol requires limiting fat to ≤60g/day, prioritising unsaturated sources.")
    return macros, trade_offs

THYROID_GOITROGENS = {"broccoli", "cauliflower", "cabbage", "kale", "brussels sprouts", "bok choy", "collard greens", "kohlrabi", "turnip", "radish", "millet", "soy", "tofu", "soybean", "edamame"}
HIGH_FODMAP = {"garlic", "onion", "leek", "asparagus", "artichoke", "mushroom", "apple", "pear", "mango", "watermelon", "honey", "wheat", "rye", "barley", "milk", "ice cream", "soft cheese", "cottage cheese", "cashew", "pistachio", "legume", "chickpea", "lentil", "kidney bean"}
HIGH_POTASSIUM_INGREDIENTS = {"banana", "potato", "sweet potato", "tomato", "orange", "avocado", "spinach", "beet", "prune", "dried fruit", "nuts", "seeds", "salmon", "tuna", "halibut", "cod", "beef", "pork"}
HIGH_PHOSPHORUS_INGREDIENTS = {"dairy", "milk", "cheese", "yogurt", "processed food", "cola", "nuts", "seeds", "chocolate", "organ meat", "sardine"}
ANTI_INFLAMMATORY = {"turmeric", "ginger", "garlic", "salmon", "sardine", "mackerel", "berries", "blueberry", "strawberry", "cherry", "walnut", "flaxseed", "olive oil", "spinach", "kale", "broccoli", "green tea"}
IMMUNITY_BOOSTERS = {"citrus", "lemon", "orange", "grapefruit", "bell pepper", "capsicum", "broccoli", "spinach", "garlic", "ginger", "turmeric", "yogurt", "almond", "sunflower seed", "sweet potato", "green tea", "amla", "gooseberry", "papaya", "kiwi"}

def _ingredient_names(recipe: Dict[str, Any]) -> set:
    names = set()
    for ing in recipe.get("extendedIngredients", []):
        name = (ing.get("name") or ing.get("nameClean") or "").lower()
        if name: names.add(name)
        for word in name.split():
            if len(word) > 3: names.add(word)
    return names

def _nutrition(recipe: Dict[str, Any]) -> Dict[str, float]:
    out = {}
    nutrients = recipe.get("nutrition", {}).get("nutrients") or recipe.get("nutritionInfo", {}).get("nutrients") or []
    for n in nutrients:
        key = n.get("name", "").lower().replace(" ", "_")
        out[key] = float(n.get("amount", 0))
    return out

def tag_diabetes(recipe, ingredients, nutrition):
    carbs, sugar, fiber = nutrition.get("carbohydrates", 9999), nutrition.get("sugar", 9999), nutrition.get("fiber", 0)
    net_carbs = max(0, carbs - fiber)
    return net_carbs <= 50 and sugar <= 15 and (carbs < 80 and fiber >= 3)

def tag_heart_disease(recipe, ingredients, nutrition):
    sodium, sat_fat, fiber, cholesterol = nutrition.get("sodium", 9999), nutrition.get("saturated_fat", 9999), nutrition.get("fiber", 0), nutrition.get("cholesterol", 9999)
    return sodium <= 700 and sat_fat <= 8 and cholesterol <= 200

def tag_pcos(recipe, ingredients, nutrition):
    sugar, fiber, carbs, sat_fat = nutrition.get("sugar", 9999), nutrition.get("fiber", 0), nutrition.get("carbohydrates", 9999), nutrition.get("saturated_fat", 9999)
    if sugar > 12 or (carbs > 60 and fiber < 4) or sat_fat > 10: return False
    return sugar <= 8 or len(ingredients & ANTI_INFLAMMATORY) >= 1

def tag_thyroid(recipe, ingredients, nutrition):
    title = (recipe.get("title") or "").lower()
    is_likely_raw = any(s in title for s in {"raw", "salad", "slaw", "smoothie", "juice", "uncooked"})
    if is_likely_raw and len(ingredients & THYROID_GOITROGENS) >= 2: return False
    if len(ingredients & {"soy", "tofu", "edamame", "soybean", "tempeh"}) >= 2: return False
    return True

def tag_weight_management(recipe, ingredients, nutrition):
    calories, protein, fiber, fat = nutrition.get("calories", 9999), nutrition.get("protein", 0), nutrition.get("fiber", 0), nutrition.get("fat", 9999)
    if calories > 600: return False
    if fat > 25 and protein < 15: return False
    return not (protein < 8 and fiber < 3)

def tag_gut_health(recipe, ingredients, nutrition):
    fiber, fat, sat_fat = nutrition.get("fiber", 0), nutrition.get("fat", 9999), nutrition.get("saturated_fat", 9999)
    if sat_fat > 12: return False
    fodmap_hits = len(ingredients & HIGH_FODMAP)
    if fodmap_hits >= 3: return False
    return not (fiber < 2 and fodmap_hits >= 2)

def tag_kidney_disease(recipe, ingredients, nutrition):
    sodium, potassium, phos, protein = nutrition.get("sodium", 9999), nutrition.get("potassium", 9999), nutrition.get("phosphorus", 9999), nutrition.get("protein", 9999)
    if sodium > 450 or potassium > 500 or phos > 300 or protein > 25: return False
    return len(ingredients & HIGH_POTASSIUM_INGREDIENTS) < 3 and len(ingredients & HIGH_PHOSPHORUS_INGREDIENTS) < 2

def tag_immunity(recipe, ingredients, nutrition):
    vit_c, zinc, fiber, sugar = nutrition.get("vitamin_c", 0), nutrition.get("zinc", 0), nutrition.get("fiber", 0), nutrition.get("sugar", 9999)
    if sugar > 20: return False
    return vit_c >= 10 or zinc >= 1.5 or len(ingredients & IMMUNITY_BOOSTERS) >= 2 or fiber >= 5

CONDITION_TAGGERS = {"diabetes": tag_diabetes, "heart-disease": tag_heart_disease, "pcos": tag_pcos, "thyroid": tag_thyroid, "weight-management": tag_weight_management, "gut-health": tag_gut_health, "kidney-disease": tag_kidney_disease, "immunity": tag_immunity}

def apply_condition_tags(recipe: Dict[str, Any]) -> List[str]:
    ingredients, nutrition = _ingredient_names(recipe), _nutrition(recipe)
    matched = []
    for condition, tagger in CONDITION_TAGGERS.items():
        try:
            if tagger(recipe, ingredients, nutrition): matched.append(condition)
        except: pass
    return matched

def filter_for_conditions(recipes: List[Dict[str, Any]], conditions: List[str]) -> List[Dict[str, Any]]:
    if not conditions: return recipes
    result = []
    for recipe in recipes:
        tags = apply_condition_tags(recipe)
        if all(c in tags for c in conditions):
            recipe["condition_tags"] = tags
            recipe["condition_match_count"] = len(tags)
            result.append(recipe)
    result.sort(key=lambda r: r["condition_match_count"], reverse=True)
    return result

def generate_why_this_works(recipe: Dict[str, Any], conditions: List[str]) -> Dict[str, str]:
    ingredients, nutrition, explanations = _ingredient_names(recipe), _nutrition(recipe), {}
    for condition in conditions:
        if condition == "diabetes": explanations[condition] = f"Low in sugar ({nutrition.get('sugar', 0):.0f}g) and rich in fiber ({nutrition.get('fiber', 0):.0f}g), which slows glucose absorption."
        elif condition == "heart-disease": explanations[condition] = f"Heart-friendly with only {nutrition.get('sodium', 0):.0f}mg sodium and {nutrition.get('fiber', 0):.0f}g fiber."
        elif condition == "pcos":
            anti_hits = ingredients & ANTI_INFLAMMATORY
            explanations[condition] = f"Contains anti-inflammatory ingredients ({', '.join(list(anti_hits)[:2])}) and low sugar ({nutrition.get('sugar', 0):.0f}g)." if anti_hits else f"Low glycemic with {nutrition.get('sugar', 0):.0f}g sugar."
        elif condition == "thyroid": explanations[condition] = "Thyroid-supportive — avoids excessive raw goitrogens and soy."
        elif condition == "weight-management": explanations[condition] = f"Calorie-controlled ({nutrition.get('calories', 0):.0f} kcal) with {nutrition.get('protein', 0):.0f}g protein."
        elif condition == "gut-health": explanations[condition] = f"Gut-friendly with {nutrition.get('fiber', 0):.0f}g fiber to feed beneficial bacteria."
        elif condition == "kidney-disease": explanations[condition] = f"Kidney-safe: low in potassium ({nutrition.get('potassium', 0):.0f}mg) and sodium ({nutrition.get('sodium', 0):.0f}mg)."
        elif condition == "immunity":
            immunity_hits = ingredients & IMMUNITY_BOOSTERS
            explanations[condition] = f"Packed with immunity boosters ({', '.join(list(immunity_hits)[:2])}) and {nutrition.get('vitamin_c', 0):.0f}mg vitamin C." if immunity_hits else "Rich in nutrients that support immune function."
    return explanations
