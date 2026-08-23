"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import {
  Activity,
  ArrowLeft,
  ArrowRightLeft,
  BookOpen,
  CalendarDays,
  Flag,
  Flower2,
  Gauge,
  Heart,
  Leaf,
  MessageCircle,
  Search,
  Shield,
  Sparkles,
  Trophy,
  Zap,
  Clock3,
  Flame,
  type LucideIcon,
} from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";
import styles from "./Healthcare.module.css";

type Condition = {
  id: string;
  label: string;
  blurb: string;
  icon?: string;
  recipe_count?: number;
};

type HealthcareRecipe = {
  id: string;
  title: string;
  image?: string;
  prep_minutes?: number;
  cook_time?: number;
  meal_type?: MealType;
  nutrition?: { calories?: number };
  nutritional_tags?: string[];
  health_scores?: string[];
  why_this_works_for_condition?: string;
};

type Swap = {
  from: string;
  to: string;
  reason: string;
};

type Streak = {
  current_streak_days?: number;
  meals_this_week?: number;
  distinct_recipes_this_week?: number;
};

type MealType = "breakfast" | "lunch" | "dinner" | "snack";
type MealFilter = "all" | MealType;
type ViewMode = "browse" | "day-plan";

const ICON_MAP: Record<string, LucideIcon> = {
  Activity,
  Flower2,
  Gauge,
  Heart,
  Leaf,
  Shield,
  Sparkles,
};

const MEAL_TYPES: MealFilter[] = ["all", "breakfast", "lunch", "dinner", "snack"];
const MEAL_ORDER: MealType[] = ["breakfast", "lunch", "dinner", "snack"];
const DAY_PLAN_ORDER: MealType[] = ["breakfast", "lunch", "snack", "dinner"];

const SCORE_STYLES: Record<string, { color: string; background: string; icon: LucideIcon }> = {
  "heart-friendly": { color: "#ef4f6f", background: "#fde7ec", icon: Heart },
  "diabetes-safe": { color: "#3b82f6", background: "#e0ecfd", icon: Activity },
  "thyroid-supportive": { color: "#a855f7", background: "#f1e7fc", icon: Sparkles },
  "pcos-friendly": { color: "#ec4899", background: "#fde4f0", icon: Flower2 },
  "kidney-friendly": { color: "#0891b2", background: "#d6f1f7", icon: Gauge },
  "gut-friendly": { color: "#16a34a", background: "#dcfce7", icon: Leaf },
  "immunity-boost": { color: "#b77900", background: "#fef3c7", icon: Shield },
  "anti-inflammatory": { color: "#0e86b7", background: "#dff2fc", icon: Sparkles },
  "post-surgery-safe": { color: "#64748b", background: "#e2e8f0", icon: Shield },
  "gentle-on-gut": { color: "#16a34a", background: "#dcfce7", icon: Leaf },
};

function HealthScoreBadge({ score }: { score: string }) {
  const scoreStyle = SCORE_STYLES[score] || { color: "#5b554d", background: "#eee9df", icon: Heart };
  const Icon = scoreStyle.icon;
  const badgeStyle = { color: scoreStyle.color, background: scoreStyle.background };
  return <span className={styles.healthBadge} style={badgeStyle}><Icon /> {score.replaceAll("-", " ")}</span>;
}

function ConditionPicker({ conditions, onPick }: { conditions: Condition[]; onPick: (condition: Condition) => void }) {
  return (
    <section className={styles.picker}>
      <header className={styles.pageHeader}>
        <p className={styles.overline}>Recommended for</p>
        <h1>Pick your focus</h1>
        <p>Every meal we suggest will be tailored to your selected condition — with the science of why it works.</p>
      </header>

      <div className={styles.conditionGrid}>
        {conditions.map((condition, index) => {
          const Icon = ICON_MAP[condition.icon || ""] || Heart;
          const entranceStyle = { "--condition-delay": `${index * 40}ms` } as CSSProperties;
          return (
            <button
              key={condition.id}
              className={styles.conditionCard}
              style={entranceStyle}
              type="button"
              onClick={() => onPick(condition)}
            >
              <span className={styles.conditionIcon}><Icon /></span>
              <strong>{condition.label}</strong>
              <span className={styles.conditionBlurb}>{condition.blurb}</span>
              <span className={styles.recipeCount}>{condition.recipe_count || 0} recipes</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function StreakCard({ streak }: { streak: Streak }) {
  const stats = [
    { value: streak.current_streak_days || 0, label: "Day streak", icon: Trophy, tone: styles.goldStat },
    { value: streak.meals_this_week || 0, label: "Meals this week", icon: Flag, tone: styles.greenStat },
    { value: streak.distinct_recipes_this_week || 0, label: "Recipes tried", icon: BookOpen, tone: styles.blueStat },
  ];

  return (
    <section className={styles.streakCard} aria-label="Healthcare streak">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label}>
            <span className={`${styles.statIcon} ${stat.tone}`}><Icon /></span>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        );
      })}
    </section>
  );
}

function RecipeCard({ recipe }: { recipe: HealthcareRecipe }) {
  const scores = recipe.health_scores || [];
  const tags = recipe.nutritional_tags || [];
  const time = recipe.prep_minutes || recipe.cook_time || 30;

  return (
    <Link className={styles.recipeCard} href={`/app/recipe/${recipe.id}`}>
      <span className={styles.recipeImage}>
        <img
          src={recipe.image || "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80"}
          alt=""
          loading="lazy"
        />
        {time <= 15 ? <span className={styles.quickBadge}><Zap /> {time}-min</span> : null}
      </span>
      <span className={styles.recipeBody}>
        <strong>{recipe.title}</strong>
        <span className={styles.recipeMeta}>
          <span><Clock3 /> {time}m</span>
          <span><Flame /> {recipe.nutrition?.calories || 0} kcal</span>
        </span>
        <span className={styles.tags}>
          {scores.slice(0, 2).map((score) => <HealthScoreBadge key={score} score={score} />)}
          {tags.slice(0, 2).map((tag) => <span className={styles.tag} key={tag}>{tag}</span>)}
        </span>
        {recipe.why_this_works_for_condition ? (
          <span className={styles.why}><b>Why it works:</b> {recipe.why_this_works_for_condition}</span>
        ) : null}
      </span>
    </Link>
  );
}

function SwapsCard({ swaps }: { swaps: Swap[] }) {
  if (swaps.length === 0) return null;
  return (
    <section className={styles.swapsCard}>
      <div className={styles.cardTitle}><ArrowRightLeft /><h2>Smart swaps</h2></div>
      <div className={styles.swapGrid}>
        {swaps.slice(0, 6).map((swap) => (
          <div className={styles.swap} key={`${swap.from}-${swap.to}`}>
            <s>{swap.from}</s>
            <ArrowRightLeft />
            <div><strong>{swap.to}</strong><span>{swap.reason}</span></div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function HealthcareClient() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const conditionId = searchParams.get("c");
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [recipes, setRecipes] = useState<HealthcareRecipe[]>([]);
  const [swaps, setSwaps] = useState<Swap[]>([]);
  const [streak, setStreak] = useState<Streak | null>(null);
  const [search, setSearch] = useState("");
  const [mealType, setMealType] = useState<MealFilter>("all");
  const [view, setView] = useState<ViewMode>("browse");
  const [quick, setQuick] = useState(false);
  const [loading, setLoading] = useState(true);

  const condition = useMemo(
    () => conditions.find((item) => item.id === conditionId),
    [conditions, conditionId],
  );

  useEffect(() => {
    let active = true;
    const loadOverview = async () => {
      const [conditionsResult, streakResult] = await Promise.allSettled([
        api.get<Condition[]>("/healthcare/conditions"),
        user ? api.get<Streak>("/healthcare/streak") : Promise.resolve(null),
      ]);
      if (!active) return;
      if (conditionsResult.status === "fulfilled") setConditions(conditionsResult.value.data);
      if (streakResult.status === "fulfilled" && streakResult.value) setStreak(streakResult.value.data);
      setLoading(false);
    };
    void loadOverview();
    return () => { active = false; };
  }, [user]);

  useEffect(() => {
    if (!conditionId) {
      setRecipes([]);
      setSwaps([]);
      return;
    }

    let active = true;
    const loadCondition = async () => {
      setLoading(true);
      const params: Record<string, string | boolean> = { condition: conditionId };
      if (mealType !== "all") params.meal_type = mealType;
      if (search.trim()) params.search = search.trim();
      if (quick) params.quick = true;

      const [recipesResult, swapsResult] = await Promise.allSettled([
        api.get<HealthcareRecipe[]>("/healthcare/recipes", { params }),
        api.get<Swap[]>("/healthcare/swaps", { params: { condition: conditionId } }),
      ]);
      if (!active) return;
      setRecipes(recipesResult.status === "fulfilled" ? recipesResult.value.data : []);
      setSwaps(swapsResult.status === "fulfilled" ? swapsResult.value.data : []);
      setLoading(false);
    };

    const timeout = window.setTimeout(() => void loadCondition(), search ? 220 : 0);
    return () => {
      active = false;
      window.clearTimeout(timeout);
    };
  }, [conditionId, mealType, quick, search]);

  const grouped = useMemo(() => {
    const groups: Record<MealType, HealthcareRecipe[]> = { breakfast: [], lunch: [], dinner: [], snack: [] };
    recipes.forEach((recipe) => groups[recipe.meal_type || "lunch"].push(recipe));
    return groups;
  }, [recipes]);

  const pickCondition = (next: Condition) => {
    setMealType("all");
    setSearch("");
    router.replace(`/app/healthcare?c=${encodeURIComponent(next.id)}`, { scroll: false });
  };

  const clearCondition = () => {
    setMealType("all");
    setSearch("");
    router.replace("/app/healthcare", { scroll: false });
  };

  return (
    <div className={styles.page}>
      <Link className={styles.backLink} href="/app"><ArrowLeft /> Home</Link>

      {!conditionId ? (
        <>
          {loading ? <div className={styles.loadingState}>Preparing your health library…</div> : <ConditionPicker conditions={conditions} onPick={pickCondition} />}
          {streak && (streak.meals_this_week || 0) > 0 ? <StreakCard streak={streak} /> : null}
        </>
      ) : (
        <div className={styles.conditionHub}>
          <header className={styles.pageHeader}>
            <button className={styles.changeCondition} type="button" onClick={clearCondition}>← Change condition</button>
            <p className={styles.overline}>Meals recommended for</p>
            <h1>{condition?.label || "Your focus"}</h1>
            <p>{condition?.blurb || "Thoughtful recipes selected for your health priorities."}</p>
          </header>

          <label className={styles.searchBox}>
            <Search />
            <span className={styles.srOnly}>Search recipes</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={`Search within ${condition?.label?.toLowerCase() || "this focus"}…`}
            />
          </label>

          <div className={styles.filters}>
            <div className={styles.viewToggle}>
              <button className={view === "browse" ? styles.activeToggle : ""} type="button" onClick={() => setView("browse")}><BookOpen /> Browse recipes</button>
              <button className={view === "day-plan" ? styles.activeToggle : ""} type="button" onClick={() => setView("day-plan")}><CalendarDays /> Day meal plan</button>
            </div>
            <button className={`${styles.quickToggle} ${quick ? styles.quickActive : ""}`} type="button" onClick={() => setQuick((current) => !current)}><Zap /> 15-min quick meals</button>
          </div>

          {streak ? <StreakCard streak={streak} /> : null}

          {view === "browse" ? (
            <>
              <div className={styles.mealTabs} role="tablist" aria-label="Meal type">
                {MEAL_TYPES.map((type) => (
                  <button
                    key={type}
                    className={mealType === type ? styles.activeMealTab : ""}
                    type="button"
                    role="tab"
                    aria-selected={mealType === type}
                    onClick={() => setMealType(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {loading ? (
                <div className={styles.loadingState}>Finding the right recipes…</div>
              ) : recipes.length === 0 ? (
                <div className={styles.emptyState}>No recipes match. Try a different search or meal type.</div>
              ) : mealType !== "all" ? (
                <div className={styles.recipeGrid}>{recipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)}</div>
              ) : (
                MEAL_ORDER.map((type) => grouped[type].length > 0 ? (
                  <section className={styles.mealSection} key={type}>
                    <h2>{type}</h2>
                    <div className={styles.recipeGrid}>{grouped[type].map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)}</div>
                  </section>
                ) : null)
              )}
            </>
          ) : (
            <section className={styles.dayPlan}>
              <p className={styles.overline}>A day for {condition?.label}</p>
              {DAY_PLAN_ORDER.map((type) => (
                <div key={type}>
                  <h2>{type}</h2>
                  {grouped[type][0] ? <RecipeCard recipe={grouped[type][0]} /> : <div className={styles.missingMeal}>No {type} recipe yet for this condition.</div>}
                </div>
              ))}
            </section>
          )}

          <SwapsCard swaps={swaps} />

          <Link className={styles.consultCard} href="/app/consult?category=healthcare">
            <span className={styles.consultIcon}><MessageCircle /></span>
            <span>
              <strong>Not sure? Talk to a nutritionist.</strong>
              <small>Certified experts who specialize in {condition?.label}. From ₹700 / session.</small>
            </span>
            <b>Consult →</b>
          </Link>
        </div>
      )}
    </div>
  );
}
