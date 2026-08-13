"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";
import styles from "./Home.module.css";

type MealPlanItem = {
  day: string;
  meal_type?: string;
  recipe_id: string;
};

type MealPlan = {
  items?: MealPlanItem[];
};

type RecipeSummary = {
  id?: string;
  title?: string;
  image?: string;
};

const WEEK_DAYS = ["M", "T", "W", "T", "F", "S", "S"];
const MEALS = [
  { label: "Breakfast", fallback: "/landing/hero-bowl.jpg", symbol: "sunrise" },
  { label: "Lunch", fallback: "/landing/dish-india.jpg", symbol: "sun" },
  { label: "Dinner", fallback: "/landing/healthcare-bowl.jpg", symbol: "moon" },
] as const;

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function LeafIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21V10" />
      <path d="M12 14C7 14 4 10 4 5c5 0 8 3 8 8" />
      <path d="M12 10c0-4 3-7 8-7 0 5-3 9-8 9" />
    </svg>
  );
}

export default function Home() {
  const { user } = useAuth();
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [planRecipes, setPlanRecipes] = useState<Record<string, RecipeSummary>>({});
  const [streak, setStreak] = useState(0);
  const [water, setWater] = useState(6);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [showNotice, setShowNotice] = useState(false);

  const loadDashboard = useCallback(async () => {
    if (!user?.id) return;
    setStatus("loading");

    const [planResult, streakResult] = await Promise.allSettled([
      api.get("/meal-plan"),
      api.get("/healthcare/streak"),
    ]);

    if (planResult.status === "fulfilled") {
      setMealPlan(planResult.value.data as MealPlan);
    }

    if (streakResult.status === "fulfilled") {
      setStreak(streakResult.value.data?.current_streak_days ?? 0);
    }

    setStatus(
      planResult.status === "rejected" && streakResult.status === "rejected"
        ? "error"
        : "ready",
    );
  }, [user?.id]);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    const stored = window.localStorage.getItem("zenplate-water-glasses");
    if (stored) setWater(Math.min(8, Math.max(0, Number(stored) || 0)));
  }, []);

  useEffect(() => {
    if (!mealPlan?.items?.length) return;
    let active = true;
    const today = new Date().toLocaleDateString("en-US", { weekday: "short" });
    const ids = [...new Set(
      mealPlan.items.filter((item) => item.day === today).map((item) => item.recipe_id),
    )];

    void Promise.all(ids.map(async (id) => {
      try {
        const response = await api.get(`/recipes/${id}`);
        return [id, response.data as RecipeSummary] as const;
      } catch {
        return null;
      }
    })).then((results) => {
      if (!active) return;
      setPlanRecipes(Object.fromEntries(results.filter((entry): entry is readonly [string, RecipeSummary] => Boolean(entry))));
    });

    return () => {
      active = false;
    };
  }, [mealPlan]);

  const todayMeals = useMemo(() => {
    const today = new Date().toLocaleDateString("en-US", { weekday: "short" });
    return mealPlan?.items?.filter((item) => item.day === today).slice(0, 3) ?? [];
  }, [mealPlan]);

  const firstName = user?.name?.split(" ")[0] || "Friend";
  const completedDays = Math.min(7, streak > 0 ? streak % 7 || 7 : 0);

  const updateWater = (next: number) => {
    const value = Math.min(8, Math.max(0, next));
    setWater(value);
    window.localStorage.setItem("zenplate-water-glasses", String(value));
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerCopy}>
          <span className={styles.eyebrow}>Your daily ritual</span>
          <h1>{getGreeting()}, {firstName}<span aria-hidden="true">.</span></h1>
          <p>Today is a fresh start.</p>
        </div>

        <div className={styles.headerActions}>
          <div className={styles.notificationWrap}>
            <button
              className={styles.iconButton}
              type="button"
              aria-label="Show today’s update"
              aria-expanded={showNotice}
              onClick={() => setShowNotice((visible) => !visible)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M14 21h-4" />
              </svg>
              <span className={styles.notificationDot} />
            </button>
            {showNotice ? (
              <div className={styles.notice} role="status">
                <strong>Your day is ready.</strong>
                <span>Meals, hydration and your mindful rhythm are waiting below.</span>
              </div>
            ) : null}
          </div>
          <Link href="/app/profile" className={styles.avatar} aria-label="Open profile">
            {firstName.charAt(0).toUpperCase()}
          </Link>
        </div>

        <Image
          className={styles.headerBotanical}
          src="/app-ui/botanical-vase.webp"
          alt=""
          width={1122}
          height={1402}
          priority
        />
      </header>

      <main className={styles.content} aria-busy={status === "loading"}>
        {status === "error" ? (
          <div className={styles.errorBanner} role="alert">
            <div>
              <strong>We couldn’t refresh your day.</strong>
              <span>Your saved links are still available.</span>
            </div>
            <button type="button" onClick={() => void loadDashboard()}>Try again</button>
          </div>
        ) : null}

        <section className={styles.focusCard} aria-labelledby="focus-title">
          <div>
            <p className={styles.sectionLabel}>Today’s focus</p>
            <h2 id="focus-title">Eat mindfully and stay hydrated</h2>
          </div>
          <span className={styles.leafSeal}><LeafIcon /></span>
        </section>

        <div className={styles.dashboardGrid}>
          <div className={styles.primaryColumn}>
            <section className={styles.mealsSection} aria-labelledby="meals-title">
              <div className={styles.sectionHeading}>
                <div>
                  <p className={styles.sectionLabel}>Made for today</p>
                  <h2 id="meals-title">Today’s meals</h2>
                </div>
                <Link href="/app/daily-plan">View plan <ArrowIcon /></Link>
              </div>

              <div className={styles.mealGrid}>
                {MEALS.map((meal, index) => {
                  const planItem = todayMeals[index];
                  const recipe = planItem ? planRecipes[planItem.recipe_id] : undefined;
                  return (
                    <Link className={styles.mealCard} href="/app/daily-plan" key={meal.label}>
                      <span className={styles.mealImage}>
                        <img
                          src={recipe?.image || meal.fallback}
                          alt={recipe?.title || `${meal.label} meal`}
                          onError={(event) => {
                            event.currentTarget.src = meal.fallback;
                          }}
                        />
                      </span>
                      <span className={styles.mealMeta}>
                        <span className={styles.mealSymbol} aria-hidden="true">
                          {meal.symbol === "moon" ? "☾" : "☼"}
                        </span>
                        <span>
                          <strong>{meal.label}</strong>
                          <small>{recipe?.title || (status === "loading" ? "Preparing your pick…" : "Personalized pick")}</small>
                        </span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>

            <Link className={styles.tipCard} href="/app/food-guidelines">
              <div>
                <p className={styles.sectionLabel}>Tip of the day</p>
                <h2>Chew slowly. Your body listens to every bite.</h2>
                <span>Explore your food guidelines <ArrowIcon /></span>
              </div>
            </Link>
          </div>

          <aside className={styles.rail} aria-label="Daily wellness summary">
            <section className={styles.waterCard}>
              <div className={styles.cardHeading}>
                <div>
                  <p className={styles.sectionLabel}>Water</p>
                  <h2>{water}<span> / 8 glasses</span></h2>
                </div>
                <button
                  type="button"
                  className={styles.addWater}
                  onClick={() => updateWater(water === 8 ? 0 : water + 1)}
                  aria-label={water === 8 ? "Reset water tracker" : "Add one glass of water"}
                >
                  {water === 8 ? "↻" : "+"}
                </button>
              </div>
              <div className={styles.glasses} aria-label={`${water} of 8 glasses completed`}>
                {Array.from({ length: 8 }, (_, index) => (
                  <span className={index < water ? styles.filledGlass : ""} key={index} />
                ))}
              </div>
            </section>

            <Link className={styles.rhythmCard} href="/app/progress">
              <div>
                <p className={styles.sectionLabel}>Daily rhythm</p>
                <h2>{streak}<span> days</span></h2>
              </div>
              <span className={styles.rhythmLeaf}><LeafIcon /></span>
              <ArrowIcon />
            </Link>

            <section className={styles.streakCard} aria-labelledby="streak-title">
              <div className={styles.streakHeader}>
                <div>
                  <p className={styles.sectionLabel}>Mindful streak</p>
                  <h2 id="streak-title">{streak}<span> days in a row</span></h2>
                </div>
                <Link href="/app/progress" aria-label="View progress"><ArrowIcon /></Link>
              </div>
              <div className={styles.week}>
                {WEEK_DAYS.map((day, index) => (
                  <span key={`${day}-${index}`}>
                    <i className={index < completedDays ? styles.completeDay : ""}>
                      {index < completedDays ? "✓" : ""}
                    </i>
                    <small>{day}</small>
                  </span>
                ))}
              </div>
            </section>
          </aside>
        </div>

        <section className={styles.pathways} aria-label="More from ZenPlate">
          {user?.health_plan?.food_rules?.length ? (
            <div className={styles.guidelinesCard}>
              <div>
                <p className={styles.sectionLabel}>Your health plan</p>
                <h2>Food guidance built around you</h2>
              </div>
              <ul>
                {(user.health_plan.food_rules as string[]).slice(0, 3).map((rule) => <li key={rule}>{rule}</li>)}
              </ul>
              <Link href="/app/food-guidelines">View food guidelines <ArrowIcon /></Link>
            </div>
          ) : (
            <Link className={styles.pathwayCard} href="/app/food-guidelines">
              <span className={styles.pathwayIcon}><LeafIcon /></span>
              <div>
                <p className={styles.sectionLabel}>Your health plan</p>
                <h2>Personalized food guidance</h2>
                <span>See gentle, practical recommendations.</span>
              </div>
              <ArrowIcon />
            </Link>
          )}

          <Link className={styles.pathwayCard} href="/app/ebook">
            <span className={styles.pathwayIcon} aria-hidden="true">✦</span>
            <div>
              <p className={styles.sectionLabel}>Clinical guide</p>
              <h2>Your health guide</h2>
              <span>Read the guide personalized to your condition.</span>
            </div>
            <ArrowIcon />
          </Link>

          <Link className={`${styles.pathwayCard} ${styles.discoverCard}`} href="/app/explore/welcome">
            <span className={styles.pathwayIcon} aria-hidden="true">◎</span>
            <div>
              <p className={styles.sectionLabel}>A separate culinary journey</p>
              <h2>Discover the Plate</h2>
              <span>Travel through recipes, regions and food traditions.</span>
            </div>
            <ArrowIcon />
          </Link>
        </section>
      </main>
    </div>
  );
}
