"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CalendarDays, ChevronRight, Clock3, Leaf, UtensilsCrossed } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";
import styles from "../wellnessMeals.module.css";

const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snacks"] as const;
const MEAL_TAGS: Record<(typeof MEAL_TYPES)[number], string[]> = {
  Breakfast: ["Light", "Energizing"],
  Lunch: ["Balanced", "Filling"],
  Dinner: ["Protein-rich", "Satisfying"],
  Snacks: ["Light", "Gut-friendly"],
};
const FALLBACK_IMG = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=480";

type MealItem = { day: string; meal_type: string; recipe_id: string; reason?: string };
type MealPlanData = { items?: MealItem[] };
type Recipe = { id?: string; title?: string; image?: string; cook_time?: number };

function todayDayKey() {
  return new Date().toLocaleDateString("en-US", { weekday: "short" });
}

export default function DailyPlan() {
  const { user } = useAuth();
  const [selectedType, setSelectedType] = useState<(typeof MEAL_TYPES)[number]>("Breakfast");
  const [plan, setPlan] = useState<MealPlanData | null>(null);
  const [recipeCache, setRecipeCache] = useState<Record<string, Recipe>>({});
  const [recipeFailures, setRecipeFailures] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPlan = useCallback(async () => {
    setLoading(true);
    setError("");
    setRecipeFailures({});
    try {
      const { data } = await api.get("/meal-plan");
      setPlan(data);
    } catch {
      setError("We couldn’t load your plan. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void fetchPlan(); }, [fetchPlan]);

  const todayItems = useMemo(
    () => (plan?.items || []).filter((item) => item.day === todayDayKey()),
    [plan],
  );
  const recipeIds = useMemo(
    () => [...new Set(todayItems.map((item) => item.recipe_id))],
    [todayItems],
  );

  useEffect(() => {
    let cancelled = false;
    const missing = recipeIds.filter((id) => !recipeCache[id] && !recipeFailures[id]);
    if (!missing.length) return;
    void Promise.all(missing.map(async (id) => {
      try {
        const { data } = await api.get(`/recipes/${id}`);
        return { id, data, failed: false };
      } catch {
        return { id, data: null, failed: true };
      }
    })).then((results) => {
      if (cancelled) return;
      const loaded = results.filter((result) => !result.failed).map((result) => [result.id, result.data] as const);
      const failed = results.filter((result) => result.failed).map((result) => result.id);
      if (loaded.length) setRecipeCache((current) => ({ ...current, ...Object.fromEntries(loaded) }));
      if (failed.length) setRecipeFailures((current) => ({ ...current, ...Object.fromEntries(failed.map((id) => [id, true])) }));
    });
    return () => { cancelled = true; };
  }, [recipeCache, recipeFailures, recipeIds]);

  const currentMealItems = todayItems.filter(
    (item) => item.meal_type?.toLowerCase() === selectedType.toLowerCase(),
  );

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <nav className={styles.topbar} aria-label="Meal plan navigation">
          <Link className={styles.backLink} href="/app" aria-label="Back to home"><ArrowLeft size={19} /></Link>
          <span className={styles.brand}><span className={styles.brandMark}>❧</span> Zenplate</span>
          <Link className={styles.iconButton} href="/app/meal-plan" aria-label="Open full meal plan"><CalendarDays size={20} /></Link>
        </nav>

        <header className={styles.hero}>
          <p className={styles.eyebrow}>Your daily rhythm</p>
          <h1 className={styles.title}>Today&apos;s Plan <span className={styles.leaf}>❧</span></h1>
          <p className={styles.subtitle}>Personalized for your goals and wellness journey.</p>
        </header>

        <div className={styles.tabs} role="tablist" aria-label="Meal type">
          {MEAL_TYPES.map((type) => (
            <button
              key={type}
              className={`${styles.tab} ${selectedType === type ? styles.activeTab : ""}`}
              type="button"
              role="tab"
              aria-selected={selectedType === type}
              onClick={() => setSelectedType(type)}
            >
              {type}
            </button>
          ))}
        </div>

        {loading ? (
          <div className={styles.state} aria-live="polite"><div className={styles.skeleton} aria-label="Loading your meal plan" /></div>
        ) : error ? (
          <State title="Your plan is resting" text={error} action={<button className={styles.primaryButton} type="button" onClick={fetchPlan}>Try again</button>} />
        ) : currentMealItems.length === 0 ? (
          <EmptyMealState mealType={selectedType} onboarded={Boolean(user?.onboarded)} />
        ) : (
          <div className={styles.recipeList} role="tabpanel">
            {currentMealItems.map((item) => {
              const recipe = recipeCache[item.recipe_id];
              return (
                <Link key={`${item.meal_type}-${item.recipe_id}`} href={`/app/recipe/${item.recipe_id}`} className={styles.recipeRow}>
                  <img
                    className={styles.recipeImage}
                    src={recipe?.image || FALLBACK_IMG}
                    alt=""
                    loading="lazy"
                    onError={(event) => { event.currentTarget.src = FALLBACK_IMG; }}
                  />
                  <div className={styles.recipeCopy}>
                    <h2 className={styles.recipeTitle}>{recipe?.title || (recipeFailures[item.recipe_id] ? "Recipe details unavailable" : "Preparing recipe details…")}</h2>
                    <p className={styles.recipeTags}>{MEAL_TAGS[selectedType].join(" · ")}</p>
                    <span className={styles.meta}><Clock3 size={15} /> {recipe?.cook_time ? `${recipe.cook_time} min` : recipeFailures[item.recipe_id] ? "Open to try again" : "Time available in recipe"}</span>
                  </div>
                  <ChevronRight className={styles.chevron} size={21} aria-hidden="true" />
                </Link>
              );
            })}
          </div>
        )}

        <Link className={styles.featureLink} href="/app/meal-plan">
          <span className={styles.featureIcon}><Leaf size={19} /></span>
          <span><span className={styles.featureTitle}>View Full Plan</span><span className={styles.featureText}>See your complete seven-day meal plan</span></span>
          <span className={styles.roundArrow}><ChevronRight size={19} /></span>
        </Link>
        <div className={styles.landscape} aria-hidden="true" />
      </div>
    </main>
  );
}

function State({ title, text, action }: { title: string; text: string; action?: React.ReactNode }) {
  return (
    <div className={styles.state} role="status">
      <div><span className={styles.stateIcon}><UtensilsCrossed size={20} /></span><h2 className={styles.stateTitle}>{title}</h2><p className={styles.stateText}>{text}</p>{action}</div>
    </div>
  );
}

function EmptyMealState({ mealType, onboarded }: { mealType: string; onboarded: boolean }) {
  return (
    <State
      title={`No ${mealType.toLowerCase()} planned yet`}
      text={onboarded ? "Generate your personalized meal plan to fill today’s rhythm." : "Complete your profile to receive a personalized plan."}
      action={<Link className={styles.secondaryButton} href="/app/meal-plan">Build my plan</Link>}
    />
  );
}
