import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import api from "../lib/api";
import { Input } from "../components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import {
  ArrowLeft, Search, Heart, Activity, Sparkles, Flower2, Scale, Gauge,
  Leaf, Shield, Clock, Flame, Zap, ArrowRightLeft, Trophy, Flag, BookOpen, CalendarDays, Moon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../lib/auth";

const ICON_MAP = { Heart, Activity, Sparkles, Flower2, Scale, Gauge, Leaf, Shield, Zap, Moon: Sparkles };

const HEALTH_SCORE_STYLES = {
  "heart-friendly": { color: "#ef4f6f", bg: "#fde7ec", icon: Heart },
  "diabetes-safe": { color: "#3b82f6", bg: "#e0ecfd", icon: Activity },
  "thyroid-supportive": { color: "#a855f7", bg: "#f1e7fc", icon: Sparkles },
  "pcos-friendly": { color: "#ec4899", bg: "#fde4f0", icon: Flower2 },
  "kidney-friendly": { color: "#0891b2", bg: "#d6f1f7", icon: Gauge },
  "gut-friendly": { color: "#16a34a", bg: "#dcfce7", icon: Leaf },
  "immunity-boost": { color: "#f59e0b", bg: "#fef3c7", icon: Shield },
  "anti-inflammatory": { color: "#0ea5e9", bg: "#dff2fc", icon: Sparkles },
  "post-surgery-safe": { color: "#64748b", bg: "#e2e8f0", icon: Shield },
  "gentle-on-gut": { color: "#16a34a", bg: "#dcfce7", icon: Leaf },
};

const MEAL_TYPES = ["all", "breakfast", "lunch", "dinner", "snack"];

function HealthScoreBadge({ score }) {
  const style = HEALTH_SCORE_STYLES[score] || { color: "#374151", bg: "#f3f4f6", icon: Heart };
  const Icon = style.icon;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium"
      style={{ color: style.color, background: style.bg }}>
      <Icon className="size-3" /> {score.replace(/-/g, " ")}
    </span>
  );
}

function ConditionPicker({ conditions, onPick }) {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Recommended for</p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mt-1">Pick your focus</h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-md">
          Every meal we suggest will be tailored to your selected condition — with the science of why it works.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {conditions.map((c, i) => {
          const Icon = ICON_MAP[c.icon] || Heart;
          return (
            <motion.button
              key={c.id} data-testid={`condition-${c.id}`}
              onClick={() => onPick(c)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="text-left nv-card nv-shadow p-4 hover:-translate-y-1 transition-all overflow-hidden relative"
            >
              <div className="size-11 rounded-2xl grid place-items-center mb-3"
                style={{ background: "rgba(0,212,170,0.12)", color: "#00b893" }}>
                <Icon className="size-5" />
              </div>
              <div className="font-display text-base font-semibold leading-tight">{c.label}</div>
              <p className="text-xs text-muted-foreground mt-1">{c.blurb}</p>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-3">{c.recipe_count} recipes</div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}

function StreakCard({ streak }) {
  if (!streak) return null;
  return (
    <div data-testid="healthcare-streak" className="nv-card nv-shadow p-5 grid grid-cols-3 gap-4">
      <div className="text-center">
        <div className="size-9 rounded-2xl mx-auto grid place-items-center mb-1.5" style={{ background: "#fff3cd", color: "#c28a00" }}>
          <Trophy className="size-4" />
        </div>
        <div className="text-2xl font-display font-bold">{streak.current_streak_days || 0}</div>
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Day streak</div>
      </div>
      <div className="text-center">
        <div className="size-9 rounded-2xl mx-auto grid place-items-center mb-1.5" style={{ background: "#dcfce7", color: "#16a34a" }}>
          <Flag className="size-4" />
        </div>
        <div className="text-2xl font-display font-bold">{streak.meals_this_week || 0}</div>
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Meals this week</div>
      </div>
      <div className="text-center">
        <div className="size-9 rounded-2xl mx-auto grid place-items-center mb-1.5" style={{ background: "#e0ecfd", color: "#3b82f6" }}>
          <BookOpen className="size-4" />
        </div>
        <div className="text-2xl font-display font-bold">{streak.distinct_recipes_this_week || 0}</div>
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Recipes tried</div>
      </div>
    </div>
  );
}

function SwapsCard({ swaps }) {
  if (!swaps?.length) return null;
  return (
    <section data-testid="healthcare-swaps" className="nv-card nv-shadow p-5 space-y-3">
      <div className="flex items-center gap-2">
        <ArrowRightLeft className="size-4 text-primary" />
        <h3 className="font-display text-base font-semibold">Smart swaps</h3>
      </div>
      <div className="grid sm:grid-cols-2 gap-2.5">
        {swaps.slice(0, 6).map((s, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-background">
            <span className="text-sm font-semibold line-through text-muted-foreground">{s.from}</span>
            <ArrowRightLeft className="size-3.5 text-muted-foreground shrink-0" />
            <div className="flex-1">
              <div className="text-sm font-semibold">{s.to}</div>
              <div className="text-[11px] text-muted-foreground leading-tight">{s.reason}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function RecipeCardHC({ recipe, condition }) {
  const tags = recipe.nutritional_tags || [];
  const scores = recipe.health_scores || [];
  return (
    <Link
      to={`/app/recipe/${recipe.id}`}
      data-testid={`hc-recipe-${recipe.id}`}
      className="nv-card nv-shadow overflow-hidden hover:-translate-y-1 transition-all duration-300 block"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" loading="lazy" />
        {recipe.prep_minutes && recipe.prep_minutes <= 15 && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/95 text-black text-[10px] font-semibold">
            <Zap className="size-3" /> {recipe.prep_minutes}-min
          </span>
        )}
      </div>
      <div className="p-4 space-y-2.5">
        <h3 className="font-semibold leading-snug">{recipe.title}</h3>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1"><Clock className="size-3.5" />{recipe.prep_minutes || recipe.cook_time}m</span>
          <span className="inline-flex items-center gap-1"><Flame className="size-3.5" />{recipe.nutrition.calories} kcal</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {scores.slice(0, 2).map((s) => <HealthScoreBadge key={s} score={s} />)}
          {tags.slice(0, 2).map((t) => (
            <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{t}</span>
          ))}
        </div>
        {recipe.why_this_works_for_condition && (
          <p className="text-xs text-foreground/80 italic leading-relaxed pt-1 border-t border-border">
            <span className="font-semibold not-italic">Why it works:</span> {recipe.why_this_works_for_condition}
          </p>
        )}
      </div>
    </Link>
  );
}

export default function Healthcare() {
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const [conditions, setConditions] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [swaps, setSwaps] = useState([]);
  const [streak, setStreak] = useState(null);
  const [search, setSearch] = useState("");
  const [mealType, setMealType] = useState("all");
  const [view, setView] = useState("browse"); // browse | day-plan
  const [quick, setQuick] = useState(false);
  const navigate = useNavigate();

  const conditionId = params.get("c");
  const condition = useMemo(() => conditions.find((c) => c.id === conditionId), [conditions, conditionId]);

  useEffect(() => {
    api.get("/healthcare/conditions").then((r) => setConditions(r.data));
    if (user) api.get("/healthcare/streak").then((r) => setStreak(r.data)).catch(() => {});
  }, [user]);

  useEffect(() => {
    if (!conditionId) { setRecipes([]); setSwaps([]); return; }
    const p = { condition: conditionId };
    if (mealType !== "all") p.meal_type = mealType;
    if (search) p.search = search;
    if (quick) p.quick = true;
    api.get("/healthcare/recipes", { params: p }).then((r) => setRecipes(r.data));
    api.get("/healthcare/swaps", { params: { condition: conditionId } }).then((r) => setSwaps(r.data));
  }, [conditionId, mealType, search, quick]);

  const pickCondition = (c) => setParams({ c: c.id });

  const grouped = useMemo(() => {
    const out = { breakfast: [], lunch: [], dinner: [], snack: [] };
    for (const r of recipes) {
      const k = r.meal_type || "lunch";
      if (out[k]) out[k].push(r);
    }
    return out;
  }, [recipes]);

  const dayPlan = useMemo(() => {
    return {
      breakfast: grouped.breakfast[0],
      lunch: grouped.lunch[0],
      snack: grouped.snack[0],
      dinner: grouped.dinner[0],
    };
  }, [grouped]);

  return (
    <div className="space-y-7">
      <Link to="/app" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground" data-testid="hc-back">
        <ArrowLeft className="size-4" /> Home
      </Link>

      <AnimatePresence mode="wait">
        {!conditionId ? (
          <motion.div key="picker" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <ConditionPicker conditions={conditions} onPick={pickCondition} />
            {streak && streak.meals_this_week > 0 && <StreakCard streak={streak} />}
          </motion.div>
        ) : (
          <motion.div key={`hub-${conditionId}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Header */}
            <header className="space-y-2">
              <button onClick={() => setParams({})} data-testid="hc-change-condition" className="text-xs text-primary hover:underline">
                ← Change condition
              </button>
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Meals recommended for</p>
              <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">{condition?.label}</h1>
              <p className="text-sm text-muted-foreground max-w-lg">{condition?.blurb}</p>
            </header>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input data-testid="hc-search" placeholder={`Search within ${condition?.label.toLowerCase()}…`}
                value={search} onChange={(e) => setSearch(e.target.value)}
                className="pl-9 rounded-full h-11 bg-card" />
            </div>

            {/* View toggle + Quick filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="inline-flex rounded-full border border-border p-1 bg-card">
                <button data-testid="hc-view-browse" onClick={() => setView("browse")}
                  className={`text-xs font-medium px-4 py-1.5 rounded-full inline-flex items-center gap-1.5 transition-all ${view === "browse" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
                  <BookOpen className="size-3.5" /> Browse recipes
                </button>
                <button data-testid="hc-view-dayplan" onClick={() => setView("day-plan")}
                  className={`text-xs font-medium px-4 py-1.5 rounded-full inline-flex items-center gap-1.5 transition-all ${view === "day-plan" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
                  <CalendarDays className="size-3.5" /> Day meal plan
                </button>
              </div>
              <button onClick={() => setQuick((q) => !q)} data-testid="hc-quick-toggle"
                className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${quick ? "bg-[#fef3c7] border-[#fcd34d] text-[#92400e]" : "bg-card border-border text-muted-foreground"}`}>
                <Zap className="size-3.5" /> 15-min quick meals
              </button>
            </div>

            {streak && <StreakCard streak={streak} />}

            {view === "browse" ? (
              <>
                <Tabs value={mealType} onValueChange={setMealType}>
                  <TabsList className="grid grid-cols-5 w-full" data-testid="hc-mealtype-tabs">
                    {MEAL_TYPES.map((m) => <TabsTrigger key={m} value={m} className="capitalize">{m}</TabsTrigger>)}
                  </TabsList>
                </Tabs>

                {recipes.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground text-sm">
                    No recipes match. Try a different search or meal type.
                  </div>
                ) : mealType !== "all" ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {recipes.map((r) => <RecipeCardHC key={r.id} recipe={r} condition={conditionId} />)}
                  </div>
                ) : (
                  ["breakfast", "lunch", "dinner", "snack"].map((m) => (
                    grouped[m].length > 0 && (
                      <section key={m}>
                        <h2 className="font-display text-xl font-semibold mb-3 capitalize">{m}</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                          {grouped[m].map((r) => <RecipeCardHC key={r.id} recipe={r} condition={conditionId} />)}
                        </div>
                      </section>
                    )
                  ))
                )}
              </>
            ) : (
              <section data-testid="hc-day-plan" className="space-y-4">
                <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">A day for {condition?.label}</div>
                {["breakfast", "lunch", "snack", "dinner"].map((m) => (
                  <div key={m}>
                    <h3 className="font-display text-base font-semibold mb-2 capitalize">{m}</h3>
                    {dayPlan[m] ? (
                      <RecipeCardHC recipe={dayPlan[m]} condition={conditionId} />
                    ) : (
                      <div className="nv-card p-4 text-xs text-muted-foreground">No {m} recipe yet for this condition.</div>
                    )}
                  </div>
                ))}
              </section>
            )}

            <SwapsCard swaps={swaps} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
