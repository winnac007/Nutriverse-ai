"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronRight,
  Flame,
  Leaf,
  RefreshCcw,
  Trash2,
  UtensilsCrossed,
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";
import styles from "./page.module.css";

interface NutritionTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface NutritionLog {
  id: string;
  recipe_title: string;
  meal_type: string;
  nutrition: NutritionTotals;
}

interface TodayNutrition {
  totals: NutritionTotals;
  logs: NutritionLog[];
}

interface WeekNutrition extends NutritionTotals {
  date: string;
}

interface NutritionTargets {
  target_calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
}

interface PlannedMeal {
  recipe_id: string;
  meal_type: string;
  title: string;
}

interface MealPlanResponse {
  items?: Array<{ day: string; recipe_id: string; meal_type: string }>;
}

const EMPTY_TODAY: TodayNutrition = {
  totals: { calories: 0, protein: 0, carbs: 0, fat: 0 },
  logs: [],
};

const rounded = (value: number | undefined) => Math.round(value ?? 0);

const NutritionWeekChart = dynamic(() => import("./NutritionWeekChart"), {
  ssr: false,
  loading: () => <div className={styles.chartLoading} aria-label="Preparing seven-day nutrition chart" />,
});

export default function TrackPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [today, setToday] = useState<TodayNutrition>(EMPTY_TODAY);
  const [week, setWeek] = useState<WeekNutrition[]>([]);
  const [targets, setTargets] = useState<NutritionTargets | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [targetStatus, setTargetStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [plannedMeals, setPlannedMeals] = useState<PlannedMeal[]>([]);
  const [loggingId, setLoggingId] = useState<string | null>(null);

  const loadNutrition = useCallback(async () => {
    setStatus("loading");
    try {
      const [todayResponse, weekResponse] = await Promise.all([
        api.get<TodayNutrition>("/nutrition/today"),
        api.get<WeekNutrition[]>("/nutrition/week"),
      ]);
      setToday(todayResponse.data);
      setWeek(weekResponse.data);
      setStatus("ready");

      try {
        const planResponse = await api.get<MealPlanResponse>("/meal-plan");
        const day = new Date().toLocaleDateString("en-US", { weekday: "short" });
        const items = (planResponse.data?.items ?? []).filter((item) => item.day === day);
        const details = await Promise.allSettled(items.map(async (item) => {
          const recipeResponse = await api.get<{ title?: string }>(`/recipes/${item.recipe_id}`);
          return {
            recipe_id: item.recipe_id,
            meal_type: item.meal_type,
            title: recipeResponse.data?.title || "Planned recipe",
          };
        }));
        setPlannedMeals(details.flatMap((result) => result.status === "fulfilled" ? [result.value] : []));
      } catch {
        setPlannedMeals([]);
      }
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void loadNutrition();
  }, [loadNutrition]);

  useEffect(() => {
    if (!user?.age || !user.weight_kg || !user.height_cm) {
      setTargets(null);
      setTargetStatus("idle");
      return;
    }

    let active = true;
    setTargetStatus("loading");
    api.post<NutritionTargets>("/tdee/calculate", {
      age: user.age,
      gender: user.gender || "female",
      weight_kg: user.weight_kg,
      height_cm: user.height_cm,
      activity_level: user.activity_level || "moderate",
      goal: user.goal || "maintain",
    }).then((response) => {
      if (!active) return;
      setTargets(response.data);
      setTargetStatus("ready");
    }).catch(() => {
      if (!active) return;
      setTargets(null);
      setTargetStatus("error");
    });

    return () => { active = false; };
  }, [user]);

  const deleteLog = async (log: NutritionLog) => {
    if (!window.confirm(`Remove “${log.recipe_title}” from today's log?`)) return;
    setDeletingId(log.id);
    try {
      await api.delete(`/nutrition/log/${log.id}`);
      toast.success("Meal removed from today's log");
      await loadNutrition();
    } catch {
      toast.error("Could not remove that meal. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const logPlannedMeal = async (meal: PlannedMeal) => {
    setLoggingId(meal.recipe_id);
    try {
      await api.post("/nutrition/log", {
        recipe_id: meal.recipe_id,
        meal_type: meal.meal_type,
        servings: 1,
      });
      toast.success(`${meal.title} added to today’s log`);
      await loadNutrition();
    } catch {
      toast.error("That planned meal could not be logged. Please try again.");
    } finally {
      setLoggingId(null);
    }
  };

  const percent = (current: number, target: number | undefined) => {
    if (!target) return 0;
    return Math.min(100, Math.round((current / target) * 100));
  };

  const weekHasData = week.some((day) => day.calories > 0);

  if (status === "loading") {
    return (
      <main className={styles.page} aria-busy="true" aria-label="Loading nutrition tracker">
        <div className={styles.loadingHero} />
        <div className={styles.loadingGrid}>
          <div className={styles.loadingCard} />
          <div className={styles.loadingCard} />
        </div>
        <span className={styles.srOnly}>Loading your meal log and nutrition totals.</span>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className={styles.page}>
        <section className={styles.stateCard} role="alert">
          <Leaf aria-hidden="true" />
          <p className={styles.eyebrow}>Nutrition log</p>
          <h1>Your log is temporarily unavailable.</h1>
          <p>We could not reach your saved meals. Nothing has been changed.</p>
          <button type="button" className={styles.primaryButton} onClick={() => void loadNutrition()}>
            <RefreshCcw size={16} /> Try again
          </button>
        </section>
      </main>
    );
  }

  const macroRows = [
    { label: "Calories", value: today.totals.calories, target: targets?.target_calories, unit: "kcal" },
    { label: "Protein", value: today.totals.protein, target: targets?.protein_g, unit: "g" },
    { label: "Carbohydrates", value: today.totals.carbs, target: targets?.carbs_g, unit: "g" },
    { label: "Fat", value: today.totals.fat, target: targets?.fat_g, unit: "g" },
  ];

  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.botanical} aria-hidden="true"><span /><i /></div>
        <button className={styles.iconButton} type="button" onClick={() => router.back()} aria-label="Go back">
          <ArrowLeft size={20} />
        </button>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Mindful tracking</p>
          <h1>Nutrition Log <Leaf size={20} aria-hidden="true" /></h1>
          <p>A clear record of what you logged—without guessed activity, wearable data, or hidden scoring.</p>
        </div>
        <div className={styles.heroTotal}>
          <span>Today</span>
          <strong>{rounded(today.totals.calories)}</strong>
          <small>kcal logged</small>
        </div>
      </header>

      <div className={styles.contentGrid}>
        <div className={styles.primaryColumn}>
          <section className={styles.card}>
            <div className={styles.sectionHeading}>
              <div>
                <p className={styles.eyebrow}>{targets ? "Today vs your target" : "Today's totals"}</p>
                <h2>Your nutrition at a glance</h2>
              </div>
              <span className={styles.mealCount}><UtensilsCrossed size={14} /> {today.logs.length} meals</span>
            </div>

            {targetStatus === "loading" && <p className={styles.inlineStatus}>Calculating your personal planning targets…</p>}
            {targetStatus === "error" && <p className={styles.inlineError}>Targets could not be calculated. Your logged totals are still shown below.</p>}

            <div className={styles.macroList}>
              {macroRows.map((macro) => (
                <div className={styles.macroRow} key={macro.label}>
                  <div className={styles.macroLabel}>
                    <strong>{macro.label}</strong>
                    <span>{rounded(macro.value)} {macro.unit}{macro.target ? ` / ${rounded(macro.target)} ${macro.unit}` : " logged"}</span>
                  </div>
                  <div className={styles.progressTrack} aria-hidden="true">
                    <span style={{ width: `${macro.target ? percent(macro.value, macro.target) : macro.value > 0 ? 12 : 0}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {!targets && targetStatus !== "loading" && (
              <div className={styles.profilePrompt}>
                <div>
                  <strong>Want personal planning targets?</strong>
                  <p>Add your age, height, and weight in Profile. These are nutrition planning estimates, not medical goals.</p>
                </div>
                <Link href="/app/profile">Complete profile <ChevronRight size={15} /></Link>
              </div>
            )}
          </section>

          <section className={styles.logSection}>
            <div className={styles.sectionHeading}>
              <div>
                <p className={styles.eyebrow}>Today</p>
                <h2>Meals you logged</h2>
              </div>
              <Link href="/app/daily-plan">Find a meal <ChevronRight size={15} /></Link>
            </div>

            {plannedMeals.length > 0 ? (
              <div className={styles.quickLog}>
                <p>Log from today’s plan</p>
                <div>
                  {plannedMeals.map((meal) => (
                    <button
                      type="button"
                      key={`${meal.meal_type}-${meal.recipe_id}`}
                      onClick={() => void logPlannedMeal(meal)}
                      disabled={loggingId !== null}
                    >
                      <span>{meal.meal_type}</span>
                      <strong>{meal.title}</strong>
                      <small>{loggingId === meal.recipe_id ? "Adding…" : "+ Log meal"}</small>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {today.logs.length === 0 ? (
              <div className={styles.emptyState}>
                <span className={styles.emptyIcon}><UtensilsCrossed size={22} /></span>
                <h3>No meals logged yet</h3>
                <p>{plannedMeals.length ? "Choose one of today’s planned meals above after you have eaten it." : "Your meal log is empty. Build a daily plan first, then return here to log what you ate."}</p>
                <Link className={styles.secondaryButton} href="/app/daily-plan">Open daily plan</Link>
              </div>
            ) : (
              <ul className={styles.logList}>
                {today.logs.map((log) => (
                  <li key={log.id}>
                    <span className={styles.mealGlyph}><Leaf size={16} aria-hidden="true" /></span>
                    <div className={styles.logCopy}>
                      <span>{log.meal_type || "Meal"}</span>
                      <h3>{log.recipe_title}</h3>
                      <p>{rounded(log.nutrition?.calories)} kcal · {rounded(log.nutrition?.protein)} g protein</p>
                    </div>
                    <button
                      type="button"
                      className={styles.deleteButton}
                      onClick={() => void deleteLog(log)}
                      disabled={deletingId === log.id}
                      aria-label={`Remove ${log.recipe_title} from today's log`}
                    >
                      {deletingId === log.id ? <span className={styles.spinner} /> : <Trash2 size={16} />}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside className={styles.sideColumn}>
          <section className={styles.chartCard}>
            <div className={styles.sectionHeading}>
              <div>
                <p className={styles.eyebrow}>Seven day view</p>
                <h2>Logged calories</h2>
              </div>
              <Flame className={styles.goldIcon} size={19} aria-hidden="true" />
            </div>
            {weekHasData ? (
              <div className={styles.chart} role="img" aria-label="Bar chart of calories logged during the last seven days">
                <NutritionWeekChart data={week} />
              </div>
            ) : (
              <div className={styles.weekEmpty}>
                <span><Leaf size={20} /></span>
                <p>Your seven-day chart will grow as you log meals.</p>
              </div>
            )}
            <p className={styles.dataNote}>This chart only includes saved meal-log data.</p>
          </section>

          <blockquote className={styles.quoteCard}>
            <Leaf size={17} aria-hidden="true" />
            <p>Notice the pattern. Keep what nourishes you.</p>
          </blockquote>
        </aside>
      </div>
    </main>
  );
}
