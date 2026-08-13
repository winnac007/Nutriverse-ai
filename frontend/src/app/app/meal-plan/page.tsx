"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, CalendarDays, ChevronRight, Clock3, RefreshCw, ShoppingBasket, Sparkles } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";
import styles from "../wellnessMeals.module.css";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
const MEALS = ["breakfast", "lunch", "dinner"] as const;
const MEAL_LABELS = { breakfast: "Breakfast", lunch: "Lunch", dinner: "Dinner" } as const;
const FALLBACK_IMG = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=360";

type Recipe = { id: string; title: string; image?: string; nutrition?: { calories?: number } };
type PlanItem = { day: string; meal_type: string; recipe_id: string; reason?: string };
type MealPlanData = { items?: PlanItem[] };
type SmartPlan = {
  is_premium?: boolean;
  calorie_estimate?: number;
  macros?: { protein_g?: number; carbs_g?: number; fat_g?: number };
  analysis?: string;
  upgrade_message?: string;
};

export default function MealPlan() {
  const { refresh } = useAuth();
  const [smart, setSmart] = useState<SmartPlan | null>(null);
  const [generating, setGenerating] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [recipesById, setRecipesById] = useState<Record<string, Recipe>>({});
  const [savedPlan, setSavedPlan] = useState<MealPlanData>({ items: [] });
  const [activeTab, setActiveTab] = useState<(typeof MEALS)[number]>("breakfast");

  const loadPlan = useCallback(async () => {
    setInitialLoading(true);
    setLoadError("");
    const [recipesResult, planResult] = await Promise.allSettled([
      api.get<Recipe[]>("/recipes"),
      api.get<MealPlanData>("/meal-plan"),
    ]);
    if (recipesResult.status === "fulfilled") {
      setRecipesById(Object.fromEntries(recipesResult.value.data.map((recipe) => [recipe.id, recipe])));
    }
    if (planResult.status === "fulfilled") {
      setSavedPlan(planResult.value.data);
    }
    if (recipesResult.status === "rejected" || planResult.status === "rejected") {
      setLoadError("Some plan details could not be loaded. Try again to refresh them.");
    }
    setInitialLoading(false);
  }, []);

  useEffect(() => { void loadPlan(); }, [loadPlan]);

  const generate = async () => {
    setGenerating(true);
    try {
      const { data } = await api.post<SmartPlan>("/ai/smart-plan", { context: "" });
      setSmart(data);
      if (data.is_premium) {
        const response = await api.get<MealPlanData>("/meal-plan");
        setSavedPlan(response.data);
      }
      toast.success(data.is_premium ? "Your seven-day plan is ready" : "Your preview is ready");
    } catch (error: unknown) {
      const message = typeof error === "object" && error && "response" in error
        ? (error as { response?: { data?: { detail?: string } } }).response?.data?.detail
        : undefined;
      toast.error(message || "We couldn’t generate a plan right now");
    } finally {
      setGenerating(false);
    }
  };

  const upgrade = async () => {
    try {
      await api.post("/user/upgrade");
      await refresh();
      toast.success("Premium is now active");
    } catch {
      toast.error("Premium could not be activated");
    }
  };

  const itemFor = (day: string, mealType: string) =>
    savedPlan.items?.find((item) => item.day === day && item.meal_type.toLowerCase() === mealType);
  const todayDay = useMemo(() => new Date().toLocaleDateString("en-US", { weekday: "short" }), []);
  const hasPlan = Boolean(savedPlan.items?.length);

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <nav className={styles.topbar} aria-label="Meal plan navigation">
          <Link className={styles.backLink} href="/app" aria-label="Back to home"><ArrowLeft size={19} /></Link>
          <span className={styles.brand}><span className={styles.brandMark}>❧</span> Zenplate</span>
          <Link className={styles.iconButton} href="/app/daily-plan" aria-label="Open today’s plan"><CalendarDays size={20} /></Link>
        </nav>

        <header className={styles.hero}>
          <p className={styles.eyebrow}>Your nourishment, considered</p>
          <h1 className={styles.title}>The Week Ahead <span className={styles.leaf}>❧</span></h1>
          <p className={styles.subtitle}>A flexible plan shaped around your body, health goals, and everyday rhythm.</p>
        </header>

        <div className={styles.plannerGrid}>
          <aside className={styles.plannerAside}>
            <div className={styles.actionRail}>
              <ActionLink href="/app/daily-plan" label="Today"><CalendarDays size={19} /></ActionLink>
              <ActionLink href="/app/grocery" label="Grocery"><ShoppingBasket size={19} /></ActionLink>
              <ActionLink href="/app/food-guidelines" label="Food Guide"><BookOpen size={19} /></ActionLink>
            </div>

            <section className={`${styles.editorialCard} ${styles.generateCard}`}>
              <span className={styles.featureIcon}><Sparkles size={19} /></span>
              <div><h2 className={styles.cardTitle}>{smart ? "Refresh your plan" : "Build your meal plan"}</h2><p className={styles.cardText}>Personalized to your goals and conditions.</p></div>
              <button className={styles.primaryButton} type="button" onClick={generate} disabled={generating}>
                {generating ? "Creating…" : smart ? "Refresh" : "Generate"}
              </button>
            </section>

            {smart && (
              <section className={`${styles.editorialCard} ${styles.targetCard}`}>
                <p className={styles.sectionLabel}>Daily targets</p>
                <div className={styles.metricGrid}>
                  <Metric value={smart.calorie_estimate ?? "—"} label="Calories" />
                  <Metric value={smart.macros?.protein_g != null ? `${smart.macros.protein_g}g` : "—"} label="Protein" />
                  <Metric value={smart.macros?.carbs_g != null ? `${smart.macros.carbs_g}g` : "—"} label="Carbs" />
                  <Metric value={smart.macros?.fat_g != null ? `${smart.macros.fat_g}g` : "—"} label="Fat" />
                </div>
                {smart.analysis && <p className={styles.analysis}>“{smart.analysis}”</p>}
              </section>
            )}

            {smart && !smart.is_premium && (
              <section className={styles.premiumCard}>
                <p className={styles.sectionLabel}>Premium</p>
                <h2 className={styles.cardTitle}>Unlock your full seven-day plan</h2>
                <p className={styles.cardText}>{smart.upgrade_message || "Turn your preview into a practical weekly rhythm."}</p>
                <ul className={styles.featureList}>
                  <li>Twenty-one personalized meals</li><li>A grocery list organized by category</li><li>Adaptive nutrition guidance</li>
                </ul>
                <button className={styles.secondaryButton} type="button" onClick={upgrade}>Activate premium</button>
              </section>
            )}
          </aside>

          <section aria-labelledby="week-heading">
            <p id="week-heading" className={styles.sectionLabel}>Seven-day rhythm</p>
            <div className={`${styles.tabs} ${styles.mealTabs}`} role="tablist" aria-label="Weekly meal type">
              {MEALS.map((meal) => (
                <button
                  key={meal}
                  className={`${styles.tab} ${activeTab === meal ? styles.activeTab : ""}`}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === meal}
                  onClick={() => setActiveTab(meal)}
                >
                  {MEAL_LABELS[meal]}
                </button>
              ))}
            </div>

            {initialLoading ? (
              <div className={styles.state} aria-live="polite"><div className={styles.skeleton} aria-label="Loading weekly plan" /></div>
            ) : loadError && !hasPlan ? (
              <State title="The week didn’t load" text={loadError} action={<button className={styles.primaryButton} type="button" onClick={loadPlan}><RefreshCw size={14} /> Try again</button>} />
            ) : !hasPlan ? (
              <State title="A clear week starts here" text="Generate your personalized plan to fill each day with thoughtful meals." />
            ) : (
              <div className={styles.weekList} role="tabpanel">
                {loadError && <div className={styles.disclaimer}>{loadError} <button className={styles.secondaryButton} type="button" onClick={loadPlan}>Retry</button></div>}
                {DAYS.map((day) => {
                  const item = itemFor(day, activeTab);
                  const recipe = item ? recipesById[item.recipe_id] : undefined;
                  const content = (
                    <>
                      <span className={day === todayDay ? styles.todayPill : styles.dayName}>{day === todayDay ? "Today" : day}</span>
                      {recipe ? <img className={styles.dayImage} src={recipe.image || FALLBACK_IMG} alt="" loading="lazy" onError={(event) => { event.currentTarget.src = FALLBACK_IMG; }} /> : <span className={`${styles.dayImage} ${styles.emptySlot}`} />}
                      <span><span className={styles.dayTitle}>{recipe?.title || "Open meal slot"}</span><span className={styles.dayMeta}>{item?.reason || (recipe ? "Selected for your plan" : "Generate a plan to fill this day")}{recipe?.nutrition?.calories ? ` · ${recipe.nutrition.calories} kcal` : ""}</span></span>
                      <ChevronRight className={styles.chevron} size={18} />
                    </>
                  );
                  return recipe ? <Link key={day} className={styles.dayRow} href={`/app/recipe/${recipe.id}`}>{content}</Link> : <div key={day} className={`${styles.dayRow} ${styles.emptySlot}`}>{content}</div>;
                })}
              </div>
            )}

            <div className={styles.disclaimer}><span>ⓘ</span><span>This plan offers general nutritional guidance, not medical advice. Consult a qualified professional before changing a condition-specific diet.</span></div>
          </section>
        </div>
      </div>
    </main>
  );
}

function ActionLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return <Link className={styles.actionLink} href={href}><span className={styles.actionGlyph}>{children}</span><span>{label}</span></Link>;
}
function Metric({ value, label }: { value: string | number; label: string }) {
  return <div className={styles.metric}><p className={styles.metricValue}>{value}</p><p className={styles.metricLabel}>{label}</p></div>;
}
function State({ title, text, action }: { title: string; text: string; action?: React.ReactNode }) {
  return <div className={styles.state} role="status"><div><span className={styles.stateIcon}><Clock3 size={20} /></span><h2 className={styles.stateTitle}>{title}</h2><p className={styles.stateText}>{text}</p>{action}</div></div>;
}
