import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "../lib/auth";
import RecipeCard from "../components/RecipeCard";
import MedicalDisclaimer from "../components/MedicalDisclaimer";
import { ArrowRight, MapPin, Flame, Utensils, Apple, ChevronRight, Lightbulb, Zap } from "lucide-react";

// ── Condition meta ──────────────────────────────────────────────────────────
const CONDITION_META = {
  diabetes:              { emoji: "🩸", label: "Diabetes" },
  "diabetes-t1":         { emoji: "🩸", label: "Diabetes T1" },
  prediabetes:           { emoji: "🩸", label: "Pre-Diabetes" },
  "heart-disease":       { emoji: "❤️",  label: "Heart Health" },
  hypertension:          { emoji: "💓", label: "Blood Pressure" },
  "high-cholesterol":    { emoji: "❤️",  label: "High Cholesterol" },
  "high-triglycerides":  { emoji: "❤️",  label: "High Triglycerides" },
  thyroid:               { emoji: "🦋", label: "Thyroid" },
  hyperthyroid:          { emoji: "🦋", label: "Hyperthyroid" },
  pcos:                  { emoji: "🌸", label: "PCOS" },
  menopause:             { emoji: "🌸", label: "Menopause" },
  pregnancy:             { emoji: "🤱", label: "Pregnancy" },
  "weight-management":   { emoji: "⚖️", label: "Weight Mgmt" },
  obesity:               { emoji: "⚖️", label: "Obesity" },
  "gut-health":          { emoji: "🌿", label: "Gut Health" },
  ibs:                   { emoji: "🌿", label: "IBS" },
  gerd:                  { emoji: "🌿", label: "Acid Reflux" },
  "fatty-liver":         { emoji: "🫀", label: "Fatty Liver" },
  celiac:                { emoji: "🌾", label: "Coeliac" },
  gastritis:             { emoji: "🌿", label: "Gastritis" },
  "kidney-disease":      { emoji: "💧", label: "Kidney Health" },
  "kidney-stones":       { emoji: "💧", label: "Kidney Stones" },
  immunity:              { emoji: "🛡️",  label: "Immunity" },
  "iron-deficiency":     { emoji: "🩸", label: "Iron Deficiency" },
  "b12-deficiency":      { emoji: "✨", label: "B12 Deficiency" },
  "vitamin-d":           { emoji: "☀️",  label: "Vitamin D" },
  "calcium-deficiency":  { emoji: "🦴", label: "Calcium Deficiency" },
  "gluten-intolerance":  { emoji: "🌾", label: "Gluten Intolerance" },
  "lactose-intolerance": { emoji: "🥛", label: "Lactose Intolerance" },
  hashimotos:            { emoji: "🦋", label: "Hashimoto's" },
  "rheumatoid-arthritis":{ emoji: "🦴", label: "Rheumatoid Arthritis" },
  depression:            { emoji: "🧠", label: "Depression" },
  migraine:              { emoji: "🧠", label: "Migraine" },
  gout:                  { emoji: "💧", label: "Gout" },
  osteoporosis:          { emoji: "🦴", label: "Osteoporosis" },
  "insulin-resistance":  { emoji: "🩸", label: "Insulin Resistance" },
};

// ── Daily health tips per condition (rotate by day of year) ─────────────────
const DAILY_TIPS = {
  diabetes: [
    "Eat meals at consistent times every day to prevent blood sugar swings.",
    "Choose low-GI foods like oats, lentils, and most non-starchy vegetables.",
    "Add a 10-minute walk after meals — it can reduce post-meal glucose spikes by 30%.",
    "Avoid skipping meals. Fasting too long raises stress hormones that spike blood sugar.",
    "Pair carbs with protein or fat to slow glucose absorption.",
    "Stay hydrated — even mild dehydration can raise blood sugar levels.",
    "Include cinnamon in your diet — it's been shown to improve insulin sensitivity.",
  ],
  "heart-disease": [
    "Replace saturated fats with unsaturated fats from nuts, seeds, and avocado.",
    "Eat fatty fish like salmon or mackerel twice a week for heart-protective omega-3s.",
    "Reduce sodium to under 1500mg/day — read labels on packaged foods carefully.",
    "A handful of walnuts daily has been shown to improve cholesterol levels.",
    "Oats contain beta-glucan which actively reduces LDL (bad) cholesterol.",
    "Garlic can naturally help lower blood pressure — include it in daily cooking.",
    "DASH diet principles: more vegetables, whole grains, lean protein — less salt.",
  ],
  thyroid: [
    "Selenium-rich foods (Brazil nuts, sunflower seeds) support thyroid hormone production.",
    "Avoid raw cruciferous vegetables in large amounts — cook them instead.",
    "Take your thyroid medication on an empty stomach, 30–60 min before breakfast.",
    "Iron deficiency can worsen hypothyroidism — include leafy greens and legumes.",
    "Limit soy products if you're on thyroid medication — they can block absorption.",
    "Zinc from pumpkin seeds and lentils supports healthy thyroid function.",
    "Eat iodine-rich foods like fish and dairy — iodine is essential for thyroid hormones.",
  ],
  pcos: [
    "Low-GI eating helps manage insulin resistance common in PCOS.",
    "Anti-inflammatory foods like turmeric, berries, and omega-3s can ease PCOS symptoms.",
    "Inositol (found in fruits and legumes) supports hormonal balance in PCOS.",
    "Reducing refined sugar intake is one of the most impactful changes for PCOS.",
    "Regular meals prevent blood sugar crashes that worsen hormonal imbalances.",
    "Magnesium in dark chocolate, almonds, and spinach helps with insulin sensitivity.",
    "Spearmint tea has been shown to reduce androgen levels in PCOS.",
  ],
  "weight-management": [
    "Protein at every meal increases satiety and boosts metabolism.",
    "Eating slowly and without screens helps you eat 20–30% less naturally.",
    "Drinking 500ml of water before meals can reduce calorie intake significantly.",
    "Adequate sleep (7–8 hrs) is non-negotiable for healthy weight management.",
    "Strength training builds muscle which burns more calories even at rest.",
    "Fibre from vegetables and legumes keeps you full for longer.",
    "Don't cut calories too drastically — it slows metabolism and causes muscle loss.",
  ],
  "gut-health": [
    "Eat a diverse range of plant foods — aim for 30 different plants per week.",
    "Fermented foods like curd, idli, and dosa naturally boost gut bacteria.",
    "Prebiotic foods (garlic, onions, bananas) feed your beneficial gut bacteria.",
    "Stay well hydrated — water keeps things moving smoothly through your gut.",
    "Stress directly harms your gut microbiome — include daily relaxation practices.",
    "Chew your food thoroughly — digestion begins in the mouth.",
    "Eat plenty of fibre from fruits, vegetables, and whole grains daily.",
  ],
  "kidney-disease": [
    "Limit sodium to reduce blood pressure and fluid retention.",
    "Control portion sizes of high-potassium foods like bananas and potatoes.",
    "Boiling vegetables and discarding the water reduces potassium content significantly.",
    "Work with your doctor on protein intake — the right amount varies by CKD stage.",
    "Stay hydrated but follow your doctor's recommended daily fluid limit.",
    "Avoid processed and packaged foods which are high in hidden phosphorus and sodium.",
    "Egg whites are an excellent low-phosphorus protein source for kidney health.",
  ],
  immunity: [
    "Vitamin C from amla, bell peppers, and citrus is a powerful immune booster.",
    "Zinc (from pumpkin seeds, legumes) is essential for immune cell function.",
    "Turmeric with black pepper has strong anti-inflammatory and immune properties.",
    "Adequate sleep is the single most important factor for a healthy immune system.",
    "Fermented foods support gut health, where 70% of your immune system lives.",
    "Reduce refined sugar — it can suppress immune response for several hours after consumption.",
    "Regular moderate exercise boosts immune surveillance and reduces inflammation.",
  ],
};

function getDailyTip(conditions) {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  for (const cond of conditions) {
    const tips = DAILY_TIPS[cond];
    if (tips) return { tip: tips[dayOfYear % tips.length], condition: cond };
  }
  // Generic fallback for conditions without specific tips
  const genericTips = [
    "Eat whole foods, stay hydrated, and move your body daily.",
    "Consistent meal timing supports both metabolism and energy levels.",
    "Include a variety of colorful vegetables at every meal for micronutrient coverage.",
    "Sleep 7-9 hours — it's the foundation of all other health goals.",
    "Drink water before you feel thirsty; thirst is a late sign of mild dehydration.",
  ];
  return { tip: genericTips[dayOfYear % genericTips.length], condition: null };
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

// ── Macro ring (simple progress arc) ────────────────────────────────────────
function MacroBar({ label, value, max, color }) {
  const pct = Math.min(100, max > 0 ? Math.round((value / max) * 100) : 0);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}g</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────
export default function Home() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [today, setToday] = useState({ totals: { calories: 0, protein: 0, carbs: 0, fat: 0 } });
  const [mealPlan, setMealPlan] = useState(null);
  const [planRecipes, setPlanRecipes] = useState({});
  const [streak, setStreak] = useState(null);

  const conditions = user?.conditions || (user?.condition ? [user.condition] : []);
  const healthPlan = user?.health_plan;
  const { tip: dailyTip, condition: tipCondition } = getDailyTip(conditions);
  const tipMeta = tipCondition ? CONDITION_META[tipCondition] : null;

  useEffect(() => {
    // Fetch personalised recipes (Spoonacular + condition rules)
    api.get("/recipes/personalized")
      .then((r) => setRecipes(r.data.slice(0, 6)))
      .catch(() => {
        // fallback: seed data filtered by condition
        const condParam = conditions[0];
        const params = condParam ? { condition: condParam } : { category: "healthcare" };
        api.get("/recipes", { params }).then((r) => setRecipes(r.data.slice(0, 6))).catch(() => {});
      });

    api.get("/nutrition/today").then((r) => setToday(r.data)).catch(() => {});
    api.get("/meal-plan").then((r) => setMealPlan(r.data)).catch(() => {});
    api.get("/healthcare/streak").then((r) => setStreak(r.data)).catch(() => {});
  }, [user?.id]);

  // Load recipe details for today's meal plan items
  useEffect(() => {
    if (!mealPlan?.items?.length) return;
    const today = new Date().toLocaleDateString("en-US", { weekday: "short" }); // Mon, Tue, etc.
    const todayItems = mealPlan.items.filter((i) => i.day === today || mealPlan.items.length <= 3);
    const ids = [...new Set(todayItems.map((i) => i.recipe_id))];
    ids.forEach((id) => {
      if (!planRecipes[id]) {
        api.get(`/recipes/${id}`).then((r) => {
          setPlanRecipes((prev) => ({ ...prev, [id]: r.data }));
        }).catch(() => {});
      }
    });
  }, [mealPlan]);

  const macroTargets = healthPlan?.macros || { protein_g: 60, carbs_g: 200, fat_g: 55 };
  const calTarget = healthPlan?.daily_calories || 2000;

  // Get today's meal plan items (first 3 for today's view)
  const todayDay = new Date().toLocaleDateString("en-US", { weekday: "short" });
  const todayMeals = mealPlan?.items
    ? mealPlan.items.filter((i) => i.day === todayDay).slice(0, 3)
    : [];

  return (
    <div className="space-y-8 pb-6">
      {/* ── Header ── */}
      <header className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{getGreeting()}</p>
          <h1 className="text-3xl font-display font-bold tracking-tight mt-1">
            {user?.name?.split(" ")[0]}
          </h1>
          {user?.location && (
            <p className="text-sm text-muted-foreground mt-1 inline-flex items-center gap-1">
              <MapPin className="size-3.5" /> {user.location}
            </p>
          )}
          {conditions.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {conditions.map((c) => {
                const meta = CONDITION_META[c];
                return meta ? (
                  <span key={c} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    {meta.emoji} {meta.label}
                  </span>
                ) : null;
              })}
            </div>
          )}
        </div>
        {user?.is_premium ? (
          <span className="text-xs font-semibold px-3 py-1 rounded-full nv-gradient-pm text-black">PREMIUM</span>
        ) : (
          <Link to="/app/profile" className="text-xs font-semibold px-3 py-1 rounded-full border border-[#c28a00]/40 text-[#c28a00] hover:bg-[#ffd166]/10">
            Upgrade
          </Link>
        )}
      </header>

      {/* ── Today's Snapshot ── */}
      <section className="nv-card nv-shadow p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold flex items-center gap-1.5">
            <Flame className="size-4 text-orange-500" /> Today's nutrition
          </h2>
          <Link to="/app/track" className="text-xs text-primary inline-flex items-center gap-1">
            Track <ArrowRight className="size-3" />
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-3xl font-display font-bold">{today.totals.calories || 0}</div>
            <div className="text-xs text-muted-foreground">/ {calTarget} kcal</div>
          </div>
          <div className="flex-1 space-y-2">
            <MacroBar label="Protein" value={today.totals.protein || 0} max={macroTargets.protein_g} color="bg-blue-500" />
            <MacroBar label="Carbs"   value={today.totals.carbs || 0}   max={macroTargets.carbs_g}   color="bg-amber-500" />
            <MacroBar label="Fat"     value={today.totals.fat || 0}     max={macroTargets.fat_g}     color="bg-rose-500" />
          </div>
        </div>
      </section>

      {/* ── Streak Card ── */}
      {streak && (streak.current_streak_days > 0 || streak.meals_this_week > 0) && (
        <section className="nv-card p-4 flex items-center gap-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/20 border-orange-200/60 dark:border-orange-800/40">
          <div className="size-12 rounded-2xl bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center text-2xl shrink-0">
            🔥
          </div>
          <div className="flex-1">
            <div className="font-semibold text-sm">
              {streak.current_streak_days > 0
                ? `${streak.current_streak_days}-day streak`
                : "Start your streak today"}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {streak.meals_this_week} meal{streak.meals_this_week !== 1 ? "s" : ""} logged this week
              {streak.distinct_recipes_this_week > 0 && ` · ${streak.distinct_recipes_this_week} different recipes`}
            </div>
          </div>
          <Zap className="size-5 text-orange-400 shrink-0" />
        </section>
      )}

      {/* ── Health Plan Rules ── */}
      {healthPlan?.food_rules?.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-display text-lg font-semibold">Your health rules</h2>
          <div className="space-y-2">
            {healthPlan.food_rules.map((rule, i) => (
              <div key={i} className="nv-card p-4 flex items-start gap-3">
                <div className="size-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <p className="text-sm">{rule}</p>
              </div>
            ))}
          </div>
          {conditions.length > 0 && <MedicalDisclaimer variant="inline" />}
        </section>
      )}

      {/* ── Health Plan Summary (if no rules yet) ── */}
      {healthPlan?.summary && !healthPlan?.food_rules?.length && (
        <section className="nv-card nv-shadow p-5 bg-primary/5 border-primary/20 border">
          <p className="text-sm leading-relaxed">{healthPlan.summary}</p>
        </section>
      )}

      {/* ── Today's Meal Plan ── */}
      {todayMeals.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold flex items-center gap-1.5">
              <Utensils className="size-4" /> Today's meals
            </h2>
            <Link to="/app/meal-plan" className="text-xs text-primary inline-flex items-center gap-1">
              Full plan <ChevronRight className="size-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {todayMeals.map((item) => {
              const recipe = planRecipes[item.recipe_id];
              return (
                <Link key={item.recipe_id + item.meal_type} to={`/app/recipe/${item.recipe_id}`}
                  className="nv-card p-4 flex items-center gap-3 hover:-translate-y-0.5 transition-transform block">
                  <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-lg shrink-0">
                    {item.meal_type === "breakfast" ? "🌅" : item.meal_type === "lunch" ? "☀️" : "🌙"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-muted-foreground capitalize">{item.meal_type}</div>
                    <div className="font-medium text-sm truncate">{recipe?.title || "Loading…"}</div>
                    {recipe && (
                      <div className="text-xs text-muted-foreground">{recipe.nutrition?.calories} kcal</div>
                    )}
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground shrink-0" />
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* ── CTA if no meal plan yet ── */}
      {!todayMeals.length && (
        <Link to="/app/meal-plan" className="block nv-card nv-shadow p-5 hover:-translate-y-0.5 transition-transform">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-2xl nv-gradient-hc grid place-items-center text-white text-2xl">🍽️</div>
            <div className="flex-1">
              <h3 className="font-semibold">Get your meal plan</h3>
              <p className="text-sm text-muted-foreground">AI-powered meals tailored to your conditions</p>
            </div>
            <ChevronRight className="size-5 text-muted-foreground" />
          </div>
        </Link>
      )}

      {/* ── Daily Health Tip ── */}
      <section className="nv-card p-5 border-l-4 border-l-primary bg-primary/5">
        <div className="flex items-start gap-3">
          <Lightbulb className="size-5 text-primary shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-semibold text-primary mb-1 uppercase tracking-wide">
              {tipMeta ? `${tipMeta.emoji} ${tipMeta.label} tip` : "Daily tip"}
            </div>
            <p className="text-sm leading-relaxed">{dailyTip}</p>
          </div>
        </div>
      </section>

      {/* ── Recipes For You ── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold flex items-center gap-1.5">
            <Apple className="size-4" /> Recipes for you
          </h2>
          <Link to="/app/explore" className="text-xs text-primary inline-flex items-center gap-1">
            Explore all <ChevronRight className="size-3" />
          </Link>
        </div>
        {recipes.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {recipes.map((r) => <RecipeCard key={r.id} recipe={r} />)}
          </div>
        ) : (
          <div className="nv-card p-8 text-center text-muted-foreground text-sm">
            Loading personalised recipes…
          </div>
        )}
      </section>

      {/* ── Foods to avoid (from health plan) ── */}
      {healthPlan?.foods_to_avoid?.length > 0 && (
        <section className="nv-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm flex items-center gap-1.5">
              <span>⚠️</span> Foods to limit or avoid
            </h3>
            <Link to="/app/food-guidelines" className="text-xs text-primary">See all</Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {healthPlan.foods_to_avoid.map((f) => (
              <span key={f} className="px-3 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-medium">
                {f}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* ── Foods to eat (from health plan) ── */}
      {healthPlan?.foods_to_eat?.length > 0 && (
        <section className="nv-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm flex items-center gap-1.5">
              <span>✅</span> Focus foods for your conditions
            </h3>
            <Link to="/app/food-guidelines" className="text-xs text-primary">Full guide</Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {healthPlan.foods_to_eat.map((f) => (
              <span key={f} className="px-3 py-1 rounded-full bg-green-500/10 text-green-700 dark:text-green-400 text-xs font-medium">
                {f}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* ── Track Progress link ── */}
      <Link to="/app/track"
        className="flex items-center justify-between nv-card p-5 hover:-translate-y-0.5 transition-transform">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center text-lg">📊</div>
          <div>
            <div className="font-semibold text-sm">Track your progress</div>
            <div className="text-xs text-muted-foreground">Log meals and see weekly trends</div>
          </div>
        </div>
        <ChevronRight className="size-5 text-muted-foreground" />
      </Link>
    </div>
  );
}
