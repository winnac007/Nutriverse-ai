"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  ChevronRight,
  Flame,
  Leaf,
  RefreshCcw,
  UtensilsCrossed,
} from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";
import styles from "./page.module.css";

type ProgressTab = "Today" | "Nutrition" | "Rhythm";

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
  logged_at?: string;
}

interface TodayNutrition {
  date: string;
  totals: NutritionTotals;
  logs: NutritionLog[];
}

interface WeekNutrition extends NutritionTotals {
  date: string;
}

interface StreakSummary {
  current_streak_days: number;
  meals_this_week: number;
  distinct_recipes_this_week: number;
}

interface NutritionTargets {
  target_calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
}

const EMPTY_TODAY: TodayNutrition = {
  date: "",
  totals: { calories: 0, protein: 0, carbs: 0, fat: 0 },
  logs: [],
};

const EMPTY_STREAK: StreakSummary = {
  current_streak_days: 0,
  meals_this_week: 0,
  distinct_recipes_this_week: 0,
};

const TABS: ProgressTab[] = ["Today", "Nutrition", "Rhythm"];

const number = (value: number | undefined) => Math.round(value ?? 0);

const formatDay = (date: string, long = false) => {
  if (!date) return "Today";
  return new Date(`${date}T00:00:00`).toLocaleDateString(undefined, long
    ? { weekday: "long", month: "long", day: "numeric" }
    : { weekday: "short" });
};

export default function ProgressPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ProgressTab>("Today");
  const [today, setToday] = useState<TodayNutrition>(EMPTY_TODAY);
  const [week, setWeek] = useState<WeekNutrition[]>([]);
  const [streak, setStreak] = useState<StreakSummary>(EMPTY_STREAK);
  const [targets, setTargets] = useState<NutritionTargets | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  const loadProgress = useCallback(async () => {
    if (!user?.id) return;
    setStatus("loading");

    try {
      const [todayResponse, weekResponse, streakResponse] = await Promise.all([
        api.get<TodayNutrition>("/nutrition/today"),
        api.get<WeekNutrition[]>("/nutrition/week"),
        api.get<StreakSummary>("/healthcare/streak"),
      ]);
      setToday(todayResponse.data);
      setWeek(weekResponse.data);
      setStreak(streakResponse.data);
      setStatus("ready");
    } catch {
      setStatus("error");
    }

    if (user.age && user.weight_kg && user.height_cm) {
      try {
        const targetResponse = await api.post<NutritionTargets>("/tdee/calculate", {
          age: user.age,
          gender: user.gender || "female",
          weight_kg: user.weight_kg,
          height_cm: user.height_cm,
          activity_level: user.activity_level || "moderate",
          goal: user.goal || "maintain",
        });
        setTargets(targetResponse.data);
      } catch {
        setTargets(null);
      }
    } else {
      setTargets(null);
    }
  }, [user]);

  useEffect(() => {
    void loadProgress();
  }, [loadProgress]);

  const caloriePercent = targets?.target_calories
    ? Math.min(100, Math.round((today.totals.calories / targets.target_calories) * 100))
    : 0;

  const weekMaximum = useMemo(
    () => Math.max(...week.map((day) => day.calories), targets?.target_calories ?? 0, 1),
    [targets?.target_calories, week],
  );

  if (status === "loading") {
    return (
      <main className={styles.page} aria-busy="true" aria-label="Loading wellness journey">
        <div className={styles.loadingHeader} />
        <div className={styles.loadingTabs} />
        <div className={styles.loadingGrid}>
          <div className={styles.loadingCard} />
          <div className={styles.loadingCard} />
        </div>
        <span className={styles.srOnly}>Loading your nutrition and streak data.</span>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className={styles.page}>
        <section className={styles.stateCard} role="alert">
          <Leaf aria-hidden="true" />
          <p className={styles.eyebrow}>Wellness journey</p>
          <h1>We couldn&apos;t load your progress.</h1>
          <p>Your saved information is safe. Check your connection and try again.</p>
          <button className={styles.primaryButton} type="button" onClick={() => void loadProgress()}>
            <RefreshCcw size={16} aria-hidden="true" />
            Try again
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroArt} aria-hidden="true">
          <span className={styles.sun} />
          <span className={styles.mountainOne} />
          <span className={styles.mountainTwo} />
        </div>
        <button className={styles.iconButton} type="button" onClick={() => router.back()} aria-label="Go back">
          <ArrowLeft size={20} aria-hidden="true" />
        </button>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Your week in view</p>
          <h1>Wellness Journey <Leaf size={20} aria-hidden="true" /></h1>
          <p>Nurture your body, notice your rhythm, and build from what you have actually logged.</p>
        </div>
        <p className={styles.heroDate}><CalendarDays size={15} aria-hidden="true" /> {formatDay(today.date, true)}</p>
      </header>

      <nav className={styles.tabs} aria-label="Progress views">
        {TABS.map((tab) => (
          <button
            className={activeTab === tab ? styles.activeTab : styles.tab}
            type="button"
            key={tab}
            onClick={() => setActiveTab(tab)}
            aria-pressed={activeTab === tab}
          >
            {tab}
          </button>
        ))}
      </nav>

      <section className={styles.summaryCard} aria-label="Today's nutrition summary">
        <div className={styles.ringWrap}>
          <svg className={styles.ring} viewBox="0 0 112 112" aria-hidden="true">
            <circle className={styles.ringTrack} cx="56" cy="56" r="47" />
            {targets && (
              <circle
                className={styles.ringValue}
                cx="56"
                cy="56"
                r="47"
                pathLength="100"
                strokeDasharray={`${caloriePercent} 100`}
              />
            )}
          </svg>
          <div className={styles.ringLabel}>
            <strong>{number(today.totals.calories)}</strong>
            <span>kcal logged</span>
          </div>
        </div>
        <div className={styles.summaryCopy}>
          <p className={styles.eyebrow}>Today&apos;s nourishment</p>
          <h2>{today.logs.length ? "Your day is taking shape." : "A fresh page for today."}</h2>
          <p>
            {targets
              ? `${caloriePercent}% of your personal ${number(targets.target_calories)} kcal planning target is logged.`
              : "Add your age, height and weight in Profile to see a personal nutrition target."}
          </p>
          <div className={styles.summaryStats}>
            <div><UtensilsCrossed size={15} /><strong>{today.logs.length}</strong><span>meals today</span></div>
            <div><Flame size={15} /><strong>{streak.current_streak_days}</strong><span>day streak</span></div>
            <div><Leaf size={15} /><strong>{streak.distinct_recipes_this_week}</strong><span>recipes this week</span></div>
          </div>
        </div>
      </section>

      <div className={styles.contentGrid}>
        <section className={styles.journeyCard}>
          {activeTab === "Today" && (
            <>
              <div className={styles.sectionHeading}>
                <div>
                  <p className={styles.eyebrow}>Today</p>
                  <h2>Your meal rhythm</h2>
                </div>
                <Link href="/app/daily-plan">Plan meals <ChevronRight size={15} /></Link>
              </div>
              {today.logs.length === 0 ? (
                <div className={styles.emptyState}>
                  <UtensilsCrossed size={24} aria-hidden="true" />
                  <h3>No meals logged yet</h3>
                  <p>Choose a meal from your plan, then use “Log meal” on its recipe.</p>
                  <Link className={styles.secondaryButton} href="/app/daily-plan">Open today&apos;s plan</Link>
                </div>
              ) : (
                <ol className={styles.timeline}>
                  {today.logs.map((log, index) => (
                    <li key={log.id}>
                      <span className={styles.timelineMarker}>{index + 1}</span>
                      <div>
                        <p className={styles.mealType}>{log.meal_type || "Meal"}</p>
                        <h3>{log.recipe_title}</h3>
                        <p>{number(log.nutrition?.calories)} kcal · {number(log.nutrition?.protein)} g protein</p>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </>
          )}

          {activeTab === "Nutrition" && (
            <>
              <div className={styles.sectionHeading}>
                <div>
                  <p className={styles.eyebrow}>Nutrition</p>
                  <h2>What you have logged</h2>
                </div>
                <Link href="/app/track">Full log <ChevronRight size={15} /></Link>
              </div>
              <div className={styles.macroList}>
                {[
                  { label: "Calories", value: today.totals.calories, target: targets?.target_calories, unit: "kcal" },
                  { label: "Protein", value: today.totals.protein, target: targets?.protein_g, unit: "g" },
                  { label: "Carbohydrates", value: today.totals.carbs, target: targets?.carbs_g, unit: "g" },
                  { label: "Fat", value: today.totals.fat, target: targets?.fat_g, unit: "g" },
                ].map((macro) => {
                  const macroPercent = macro.target ? Math.min(100, Math.round((macro.value / macro.target) * 100)) : 0;
                  return (
                    <div className={styles.macroRow} key={macro.label}>
                      <div><strong>{macro.label}</strong><span>{number(macro.value)}{macro.unit}{macro.target ? ` / ${number(macro.target)}${macro.unit}` : " logged"}</span></div>
                      <div className={styles.progressTrack}>
                        <span style={{ width: `${macro.target ? macroPercent : macro.value > 0 ? 12 : 0}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              {!targets && <p className={styles.dataNote}>Targets are not shown until your core profile details are complete.</p>}
            </>
          )}

          {activeTab === "Rhythm" && (
            <>
              <div className={styles.sectionHeading}>
                <div>
                  <p className={styles.eyebrow}>Last seven days</p>
                  <h2>Your logging rhythm</h2>
                </div>
              </div>
              <div className={styles.weekChart} role="img" aria-label="Calories logged over the last seven days">
                {week.map((day) => (
                  <div className={styles.dayColumn} key={day.date}>
                    <div className={styles.barArea}>
                      <span className={styles.barValue}>{day.calories ? number(day.calories) : ""}</span>
                      <span className={styles.bar} style={{ height: `${Math.max(day.calories ? 10 : 2, (day.calories / weekMaximum) * 100)}%` }} />
                    </div>
                    <span>{formatDay(day.date)}</span>
                  </div>
                ))}
              </div>
              <p className={styles.dataNote}>Bars show calories from meals you logged, not estimated activity or wearable data.</p>
            </>
          )}
        </section>

        <aside className={styles.insightColumn}>
          <section className={styles.insightCard}>
            <span className={styles.roundIcon}><Flame size={18} aria-hidden="true" /></span>
            <p className={styles.eyebrow}>Consistency</p>
            <h2>{streak.current_streak_days ? `${streak.current_streak_days} day streak` : "Begin with one meal"}</h2>
            <p>{streak.meals_this_week} meals across {streak.distinct_recipes_this_week} recipes have been logged this week.</p>
            <Link href="/app/track">Review your log <ChevronRight size={15} /></Link>
          </section>

          <blockquote className={styles.quoteCard}>
            <Leaf size={18} aria-hidden="true" />
            <p>“Small progress, noticed honestly, becomes a rhythm you can keep.”</p>
          </blockquote>
        </aside>
      </div>
    </main>
  );
}
