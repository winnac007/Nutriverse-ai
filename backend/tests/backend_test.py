"""NutriVerse end-to-end backend tests covering auth, recipes, TDEE, nutrition, AI plan, coach, lifestyle."""
import os
import time
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
if not BASE_URL:
    # fallback: read frontend/.env
    with open("/app/frontend/.env") as f:
        for line in f:
            if line.startswith("REACT_APP_BACKEND_URL"):
                BASE_URL = line.split("=", 1)[1].strip().rstrip("/")
API = f"{BASE_URL}/api"


# ============== Fixtures ==============
@pytest.fixture(scope="session")
def s():
    sess = requests.Session()
    sess.headers.update({"Content-Type": "application/json"})
    return sess


@pytest.fixture(scope="session")
def free_user(s):
    """Register a fresh free user."""
    email = f"test_{uuid.uuid4().hex[:8]}@nutri.example.com"
    r = s.post(f"{API}/auth/register", json={"email": email, "password": "Pass1234!", "name": "Free User"})
    assert r.status_code == 200, r.text
    data = r.json()
    return {"email": email, "password": "Pass1234!", "token": data["token"], "user": data["user"]}


@pytest.fixture(scope="session")
def premium_user(s):
    email = f"prem_{uuid.uuid4().hex[:8]}@nutri.example.com"
    r = s.post(f"{API}/auth/register", json={"email": email, "password": "Pass1234!", "name": "Prem User"})
    assert r.status_code == 200, r.text
    data = r.json()
    token = data["token"]
    headers = {"Authorization": f"Bearer {token}"}
    # Set profile then upgrade
    s.put(f"{API}/user/profile", headers=headers, json={
        "age": 28, "gender": "male", "weight_kg": 75, "height_cm": 178,
        "activity_level": "active", "goal": "muscle-gain", "category": "fitness",
        "body_type": "mesomorph", "cooking_ability": "intermediate", "budget": "medium",
        "timeline_weeks": 12, "location": "Bengaluru", "country": "India",
        "onboarded": True,
    })
    r2 = s.post(f"{API}/user/upgrade", headers=headers)
    assert r2.status_code == 200, r2.text
    assert r2.json().get("is_premium") is True
    return {"email": email, "password": "Pass1234!", "token": token, "user": r2.json()}


def auth(token):
    return {"Authorization": f"Bearer {token}"}


# ============== Auth ==============
class TestAuth:
    def test_register_returns_token_and_user(self, s):
        email = f"reg_{uuid.uuid4().hex[:8]}@nutri.example.com"
        r = s.post(f"{API}/auth/register", json={"email": email, "password": "Pass1234!", "name": "Reg"})
        assert r.status_code == 200
        d = r.json()
        assert "token" in d and isinstance(d["token"], str) and len(d["token"]) > 10
        assert d["user"]["email"] == email
        assert d["user"]["is_premium"] is False
        assert d["user"]["onboarded"] is False
        assert "password" not in d["user"]

    def test_register_duplicate_email_400(self, s, free_user):
        r = s.post(f"{API}/auth/register", json={"email": free_user["email"], "password": "x", "name": "x"})
        assert r.status_code == 400

    def test_login_valid(self, s, free_user):
        r = s.post(f"{API}/auth/login", json={"email": free_user["email"], "password": free_user["password"]})
        assert r.status_code == 200
        assert "token" in r.json()

    def test_login_invalid_401(self, s, free_user):
        r = s.post(f"{API}/auth/login", json={"email": free_user["email"], "password": "wrong"})
        assert r.status_code == 401

    def test_me_with_token(self, s, free_user):
        r = s.get(f"{API}/auth/me", headers=auth(free_user["token"]))
        assert r.status_code == 200
        assert r.json()["email"] == free_user["email"]

    def test_me_without_token_401(self, s):
        r = s.get(f"{API}/auth/me")
        assert r.status_code == 401


# ============== Profile / Upgrade / Save ==============
class TestUserActions:
    def test_profile_update_and_persist(self, s, free_user):
        payload = {"body_type": "ectomorph", "cooking_ability": "beginner",
                   "budget": "low", "timeline_weeks": 8, "location": "Mumbai",
                   "onboarded": True}
        r = s.put(f"{API}/user/profile", headers=auth(free_user["token"]), json=payload)
        assert r.status_code == 200
        # GET to verify persistence
        me = s.get(f"{API}/auth/me", headers=auth(free_user["token"])).json()
        assert me["body_type"] == "ectomorph"
        assert me["cooking_ability"] == "beginner"
        assert me["budget"] == "low"
        assert me["timeline_weeks"] == 8
        assert me["location"] == "Mumbai"
        assert me["onboarded"] is True

    def test_upgrade_premium(self, s):
        email = f"up_{uuid.uuid4().hex[:8]}@nutri.example.com"
        reg = s.post(f"{API}/auth/register", json={"email": email, "password": "Pass1234!", "name": "U"}).json()
        token = reg["token"]
        r = s.post(f"{API}/user/upgrade", headers=auth(token))
        assert r.status_code == 200
        assert r.json()["is_premium"] is True

    def test_save_recipe_toggle(self, s, free_user):
        rid = "in-south-001"
        r1 = s.post(f"{API}/user/save-recipe/{rid}", headers=auth(free_user["token"]))
        assert r1.status_code == 200
        assert rid in r1.json()["saved_recipes"]
        r2 = s.post(f"{API}/user/save-recipe/{rid}", headers=auth(free_user["token"]))
        assert rid not in r2.json()["saved_recipes"]


# ============== Recipes ==============
class TestRecipes:
    def test_list_recipes_count(self, s):
        r = s.get(f"{API}/recipes")
        assert r.status_code == 200
        items = r.json()
        # 31 base + 7 healthcare extras (hc-006..hc-012) = 38
        assert len(items) >= 31, f"Expected >=31, got {len(items)}"
        cats = {x["category"] for x in items}
        for c in ["healthcare", "fitness", "cultural", "chef-special"]:
            assert c in cats, f"Missing category {c}"

    def test_filter_country_india(self, s):
        r = s.get(f"{API}/recipes", params={"country": "India"})
        assert r.status_code == 200
        items = r.json()
        assert len(items) > 0
        assert all(x.get("country", "").lower() == "india" for x in items)

    def test_filter_region_south_india(self, s):
        r = s.get(f"{API}/recipes", params={"country": "India", "region": "South India"})
        assert r.status_code == 200
        items = r.json()
        ids = sorted([x["id"] for x in items])
        assert ids == ["in-south-001", "in-south-002"], f"Got {ids}"

    def test_filter_tier_premium(self, s):
        r = s.get(f"{API}/recipes", params={"tier": "premium"})
        assert r.status_code == 200
        items = r.json()
        assert len(items) > 0
        assert all(x.get("tier") == "premium" for x in items)

    def test_filter_tag_dessert(self, s):
        r = s.get(f"{API}/recipes", params={"tag": "dessert"})
        assert r.status_code == 200
        assert len(r.json()) > 0

    def test_search_idli(self, s):
        r = s.get(f"{API}/recipes", params={"search": "idli"})
        assert r.status_code == 200
        titles = [x["title"].lower() for x in r.json()]
        assert any("idli" in t for t in titles)

    def test_countries_list(self, s):
        r = s.get(f"{API}/recipes/countries")
        assert r.status_code == 200
        c = r.json()
        assert isinstance(c, list) and "India" in c

    def test_regions_for_india(self, s):
        r = s.get(f"{API}/recipes/regions", params={"country": "India"})
        assert r.status_code == 200
        regs = r.json()
        assert any("South" in x for x in regs)

    def test_recipe_detail_has_ingredient_images_and_video(self, s):
        r = s.get(f"{API}/recipes/in-south-001")
        assert r.status_code == 200
        d = r.json()
        assert d["title"] == "Idli Sambar"
        assert "ingredients" in d and len(d["ingredients"]) > 0
        # ingredient images
        assert any(i.get("image") for i in d["ingredients"]), "No ingredient images"
        assert d.get("video_url"), "Missing video_url"
        assert "nutrition" in d and "calories" in d["nutrition"]

    def test_recipe_404(self, s):
        r = s.get(f"{API}/recipes/does-not-exist")
        assert r.status_code == 404


# ============== TDEE ==============
class TestTDEE:
    def test_male_28_75kg_178cm_active_muscle_gain(self, s):
        r = s.post(f"{API}/tdee/calculate", json={
            "age": 28, "gender": "male", "weight_kg": 75, "height_cm": 178,
            "activity_level": "active", "goal": "muscle-gain"
        })
        assert r.status_code == 200
        d = r.json()
        # BMR ~ 1728, TDEE ~ 2980
        assert 1700 <= d["bmr"] <= 1750
        assert 2950 <= d["tdee"] <= 3010
        assert d["protein_g"] > 0


# ============== Nutrition ==============
class TestNutrition:
    def test_log_today_week_delete(self, s, free_user):
        h = auth(free_user["token"])
        r = s.post(f"{API}/nutrition/log", headers=h, json={
            "recipe_id": "in-south-001", "meal_type": "breakfast", "servings": 1.0
        })
        assert r.status_code == 200
        log_id = r.json()["id"]
        # today
        t = s.get(f"{API}/nutrition/today", headers=h)
        assert t.status_code == 200
        assert any(x["id"] == log_id for x in t.json()["logs"])
        assert t.json()["totals"]["calories"] > 0
        # week
        w = s.get(f"{API}/nutrition/week", headers=h)
        assert w.status_code == 200
        assert isinstance(w.json(), list) and len(w.json()) == 7
        # delete
        d = s.delete(f"{API}/nutrition/log/{log_id}", headers=h)
        assert d.status_code == 200


# ============== Meal Plan ==============
class TestMealPlan:
    def test_get_post(self, s, free_user):
        h = auth(free_user["token"])
        r = s.post(f"{API}/meal-plan", headers=h, json={
            "items": [{"day": "Mon", "meal_type": "breakfast", "recipe_id": "in-south-001"}]
        })
        assert r.status_code == 200
        g = s.get(f"{API}/meal-plan", headers=h)
        assert g.status_code == 200
        items = g.json()["items"]
        assert any(i["recipe_id"] == "in-south-001" for i in items)


# ============== AI Smart Plan ==============
class TestAIPlan:
    def test_free_preview_no_weekly(self, s, free_user):
        h = auth(free_user["token"])
        r = s.post(f"{API}/ai/smart-plan", headers=h, json={"context": "test"}, timeout=60)
        assert r.status_code == 200
        d = r.json()
        assert d.get("is_premium") is False
        assert "preview_meal" in d
        assert "weekly_plan" not in d
        assert "grocery_list" not in d
        assert "upgrade_message" in d

    def test_premium_full_plan(self, s, premium_user):
        h = auth(premium_user["token"])
        r = s.post(f"{API}/ai/smart-plan", headers=h, json={"context": "muscle gain plan"}, timeout=120)
        assert r.status_code == 200
        d = r.json()
        assert d.get("is_premium") is True
        assert "weekly_plan" in d and len(d["weekly_plan"]) >= 1
        assert "grocery_list" in d
        # 21 items (7 days x 3 meals) persisted
        plan = s.get(f"{API}/meal-plan", headers=h).json()
        assert len(plan.get("items", [])) >= 1


# ============== AI Coach ==============
class TestCoach:
    def test_free_403(self, s, free_user):
        r = s.post(f"{API}/ai/coach", headers=auth(free_user["token"]), json={"question": "what to eat"})
        assert r.status_code == 403

    def test_premium_replies(self, s, premium_user):
        r = s.post(f"{API}/ai/coach", headers=auth(premium_user["token"]),
                   json={"question": "I ate pizza, what now?"}, timeout=60)
        assert r.status_code == 200
        assert isinstance(r.json().get("reply"), str) and len(r.json()["reply"]) > 0
        h = s.get(f"{API}/ai/coach/history", headers=auth(premium_user["token"]))
        assert h.status_code == 200
        assert len(h.json()) >= 1


# ============== Lifestyle ==============
class TestLifestyle:
    def test_free_403(self, s, free_user):
        r = s.post(f"{API}/lifestyle/log", headers=auth(free_user["token"]),
                   json={"sleep_hours": 7, "water_ml": 2000, "mood": "ok"})
        assert r.status_code == 403

    def test_premium_log_and_today(self, s, premium_user):
        h = auth(premium_user["token"])
        r = s.post(f"{API}/lifestyle/log", headers=h,
                   json={"sleep_hours": 8, "water_ml": 2500, "mood": "great", "workout_minutes": 45})
        assert r.status_code == 200
        t = s.get(f"{API}/lifestyle/today", headers=h)
        assert t.status_code == 200
        assert t.json().get("sleep_hours") == 8
        assert t.json().get("mood") == "great"


# ============== Healthcare Hub ==============
class TestHealthcare:
    def test_conditions_returns_8_items(self, s):
        r = s.get(f"{API}/healthcare/conditions")
        assert r.status_code == 200, r.text
        items = r.json()
        assert len(items) == 8, f"Expected 8, got {len(items)}"
        ids = {x["id"] for x in items}
        for needed in ["heart-disease", "diabetes", "thyroid", "pcos",
                       "weight-management", "hypertension", "gut-health", "immunity"]:
            assert needed in ids, f"Missing condition {needed}"
        # required keys
        first = items[0]
        for k in ["id", "label", "icon", "blurb", "image", "recipe_count"]:
            assert k in first, f"Missing key {k}"
        assert isinstance(first["recipe_count"], int)

    def test_recipes_heart_disease_min_6(self, s):
        r = s.get(f"{API}/healthcare/recipes", params={"condition": "heart-disease"})
        assert r.status_code == 200, r.text
        items = r.json()
        assert len(items) >= 6, f"Heart-disease only returned {len(items)}"
        for it in items:
            assert "health_scores" in it
            assert "nutritional_tags" in it
            assert "meal_type" in it
            assert "prep_minutes" in it
            assert "why_this_works_for_condition" in it
            # must be string or None
            wtw = it["why_this_works_for_condition"]
            assert wtw is None or isinstance(wtw, str)

    def test_recipes_diabetes_breakfast_only(self, s):
        r = s.get(f"{API}/healthcare/recipes",
                  params={"condition": "diabetes", "meal_type": "breakfast"})
        assert r.status_code == 200
        items = r.json()
        assert len(items) > 0, "Expected at least 1 breakfast for diabetes"
        for it in items:
            assert it.get("meal_type") == "breakfast", f"Non-breakfast item: {it.get('id')}"

    def test_recipes_pcos_quick_15min(self, s):
        r = s.get(f"{API}/healthcare/recipes",
                  params={"condition": "pcos", "quick": "true"})
        assert r.status_code == 200
        items = r.json()
        assert len(items) > 0
        for it in items:
            pm = it.get("prep_minutes") or it.get("cook_time", 999)
            assert pm <= 15, f"Recipe {it.get('id')} has prep_minutes={pm}"

    def test_recipes_immunity_search_tea(self, s):
        r = s.get(f"{API}/healthcare/recipes",
                  params={"condition": "immunity", "search": "tea"})
        assert r.status_code == 200
        items = r.json()
        titles = [it["title"] for it in items]
        assert any("Lemon Ginger" in t for t in titles), f"Got titles: {titles}"

    def test_swaps_diabetes(self, s):
        r = s.get(f"{API}/healthcare/swaps", params={"condition": "diabetes"})
        assert r.status_code == 200
        swaps = r.json()
        assert len(swaps) > 0
        for sw in swaps:
            assert "from" in sw and "to" in sw and "reason" in sw
            assert "diabetes" in sw.get("best_for", [])
        # Sugar -> Dates is for diabetes
        assert any(sw["from"].lower().startswith("sugar") for sw in swaps)

    def test_swaps_no_condition_returns_all(self, s):
        r = s.get(f"{API}/healthcare/swaps")
        assert r.status_code == 200
        assert len(r.json()) >= 8

    def test_streak_requires_auth(self, s):
        r = s.get(f"{API}/healthcare/streak")
        assert r.status_code == 401

    def test_streak_authenticated(self, s, free_user):
        h = auth(free_user["token"])
        r = s.get(f"{API}/healthcare/streak", headers=h)
        assert r.status_code == 200
        d = r.json()
        for k in ["current_streak_days", "meals_this_week", "distinct_recipes_this_week"]:
            assert k in d, f"Missing {k}"
            assert isinstance(d[k], int)

    def test_streak_after_log_meal(self, s):
        """Register fresh user, log a meal, verify streak increments."""
        email = f"hc_{uuid.uuid4().hex[:8]}@nutri.example.com"
        reg = s.post(f"{API}/auth/register", json={"email": email, "password": "Pass1234!", "name": "HC"}).json()
        h = auth(reg["token"])
        # log a healthcare meal
        log = s.post(f"{API}/nutrition/log", headers=h, json={
            "recipe_id": "hc-001", "meal_type": "lunch", "servings": 1.0
        })
        assert log.status_code == 200, log.text
        r = s.get(f"{API}/healthcare/streak", headers=h)
        assert r.status_code == 200
        d = r.json()
        assert d["current_streak_days"] >= 1
        assert d["meals_this_week"] >= 1
        assert d["distinct_recipes_this_week"] >= 1

    def test_extra_recipes_present(self, s):
        """Verify hc-006..hc-012 were merged into healthcare pool."""
        r = s.get(f"{API}/healthcare/recipes", params={"condition": "heart-disease"})
        ids = {x["id"] for x in r.json()}
        # hc-006 (beetroot) + hc-008 (spinach egg) + hc-011 + hc-012 are heart
        for needed in ["hc-006", "hc-011", "hc-012"]:
            assert needed in ids, f"Missing extra recipe {needed} for heart-disease. Got: {ids}"

    def test_immunity_has_lemon_ginger_tea(self, s):
        r = s.get(f"{API}/healthcare/recipes", params={"condition": "immunity"})
        ids = {x["id"] for x in r.json()}
        assert "hc-010" in ids, f"hc-010 missing from immunity. Got {ids}"
