import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "../lib/auth";
import MedicalDisclaimer from "../components/MedicalDisclaimer";
import { ChevronLeft, ChevronRight, RefreshCw, Calendar, Utensils, Check } from "lucide-react";
import { toast } from "sonner";

const MEAL_ICONS = { breakfast: "🌅", lunch: "☀️", dinner: "🌙" };
const MEAL_LABELS = { breakfast: "Breakfast", lunch: "Lunch", dinner: "Dinner" };

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function todayDayKey() {
  return new Date().toLocaleDateString("en-US", { weekday: "short" });
}

export default function DailyPlan() {
  const { user } = useAuth();
  const [selectedDay, setSelectedDay] = useState(todayDayKey());
  const [plan, setPlan] = useState(null);
  const [recipeCache, setRecipeCache] = useState({});
  const [swapping, setSwapping] = useState(null); // meal_type being swapped
  const [swapCandidates, setSwapCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPlan = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/meal-plan");
      setPlan(data);
    } catch {
      toast.error("Could not load meal plan");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPlan(); }, [fetchPlan]);

  // Load recipe details for today's meals
  const todayItems = (plan?.items || []).filter((i) => i.day === selectedDay);

  useEffect(() => {
    todayItems.forEach(({ recipe_id }) => {
      if (!recipeCache[recipe_id]) {
        api.get(`/recipes/${recipe_id}`)
          .then(({ data }) => setRecipeCache((prev) => ({ ...prev, [recipe_id]: data })))
          .catch(() => {});
      }
    });
  }, [plan, selectedDay]);

  async function handleSwap(meal_type, current_recipe_id) {
    setSwapping(meal_type);
    setSwapCandidates([]);
    try {
      const { data } = await api.post("/meal-plan/swap", {
        day: selectedDay,
        meal_type,
        current_recipe_id,
      });
      if (data.length === 0) {
        toast.info("No alternative recipes found — try adjusting your preferences.");
        setSwapping(null);
        return;
      }
      // Preload candidate details
      data.forEach((r) => setRecipeCache((prev) => ({ ...prev, [r.id]: r })));
      setSwapCandidates(data);
    } catch {
      toast.error("Could not get swap suggestions");
      setSwapping(null);
    }
  }

  async function confirmSwap(meal_type, recipe_id) {
    try {
      await api.put("/meal-plan/update-meal", { day: selectedDay, meal_type, recipe_id });
      await fetchPlan();
      toast.success("Meal swapped!");
    } catch {
      toast.error("Swap failed");
    } finally {
      setSwapping(null);
      setSwapCandidates([]);
    }
  }

  async function logMeal(recipe_id, meal_type) {
    try {
      await api.post("/nutrition/log", { recipe_id, meal_type, servings: 1 });
      toast.success("Meal logged!");
    } catch {
      toast.error("Could not log meal");
    }
  }

  const hasPlan = plan?.items?.length > 0;
  const healthPlan = user?.health_plan;
  const calTarget = healthPlan?.daily_calories || 2000;

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Today's</p>
          <h1 className="text-2xl font-display font-bold tracking-tight">Daily Plan</h1>
        </div>
        <Link to="/app/meal-plan" className="text-xs text-primary inline-flex items-center gap-1">
          <Calendar className="size-3.5" /> Full week
        </Link>
      </header>

      {/* Day selector */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
        {DAYS.map((day) => {
          const isToday = day === todayDayKey();
          const isSelected = day === selectedDay;
          const hasItems = (plan?.items || []).some((i) => i.day === day);
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {day}
              {isToday && <span className="block text-[9px] leading-tight opacity-70">Today</span>}
              {!isToday && hasItems && <span className="block w-1 h-1 rounded-full bg-current opacity-40 mx-auto" />}
            </button>
          );
        })}
      </div>

      {/* Plan refresh notice */}
      {plan?.needs_refresh && (
        <div className="nv-card p-4 flex items-center gap-3 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/40">
          <RefreshCw className="size-4 text-blue-500 animate-spin" />
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Your plan is being refreshed with your updated preferences.
          </p>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {["breakfast", "lunch", "dinner"].map((mt) => (
            <div key={mt} className="nv-card p-5 h-28 animate-pulse bg-muted/50" />
          ))}
        </div>
      ) : !hasPlan ? (
        <div className="nv-card p-8 text-center space-y-3">
          <Utensils className="size-10 mx-auto text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">No meal plan yet.</p>
          <Link to="/app/meal-plan"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
            Generate your plan <ChevronRight className="size-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {["breakfast", "lunch", "dinner"].map((meal_type) => {
            const item = todayItems.find((i) => i.meal_type === meal_type);
            const recipe = item ? recipeCache[item.recipe_id] : null;
            const isSwappingThis = swapping === meal_type;

            return (
              <div key={meal_type} className="space-y-2">
                <div className="nv-card p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-lg shrink-0">
                      {MEAL_ICONS[meal_type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-muted-foreground">{MEAL_LABELS[meal_type]}</div>
                      {recipe ? (
                        <Link to={`/app/recipe/${item.recipe_id}`}
                          className="font-semibold text-sm hover:text-primary truncate block">
                          {recipe.title}
                        </Link>
                      ) : item ? (
                        <div className="text-sm font-medium text-muted-foreground">Loading…</div>
                      ) : (
                        <div className="text-sm text-muted-foreground italic">No meal assigned</div>
                      )}
                      {recipe && (
                        <div className="text-xs text-muted-foreground">
                          {recipe.nutrition?.calories} kcal ·{" "}
                          {recipe.nutrition?.protein}g protein ·{" "}
                          {recipe.nutrition?.carbs}g carbs
                        </div>
                      )}
                    </div>
                  </div>

                  {item && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => logMeal(item.recipe_id, meal_type)}
                        className="flex-1 text-xs font-medium py-1.5 px-3 rounded-lg bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20 transition-colors flex items-center justify-center gap-1"
                      >
                        <Check className="size-3" /> Log meal
                      </button>
                      <button
                        onClick={() => handleSwap(meal_type, item.recipe_id)}
                        disabled={isSwappingThis}
                        className="flex-1 text-xs font-medium py-1.5 px-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
                      >
                        <RefreshCw className={`size-3 ${isSwappingThis ? "animate-spin" : ""}`} />
                        {isSwappingThis ? "Finding…" : "Swap"}
                      </button>
                    </div>
                  )}
                </div>

                {/* Swap candidates bottom sheet */}
                {isSwappingThis && swapCandidates.length > 0 && (
                  <div className="nv-card p-4 space-y-2 border-primary/30 bg-primary/5">
                    <p className="text-xs font-semibold text-primary">Choose a swap:</p>
                    {swapCandidates.map((candidate) => (
                      <button
                        key={candidate.id}
                        onClick={() => confirmSwap(meal_type, candidate.id)}
                        className="w-full text-left p-3 rounded-lg hover:bg-background/80 transition-colors flex items-center gap-3"
                      >
                        {candidate.image && (
                          <img src={candidate.image} alt="" className="size-10 rounded-lg object-cover shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{candidate.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {candidate.nutrition?.calories} kcal
                          </div>
                        </div>
                        <ChevronRight className="size-4 text-muted-foreground shrink-0" />
                      </button>
                    ))}
                    <button
                      onClick={() => { setSwapping(null); setSwapCandidates([]); }}
                      className="w-full text-xs text-muted-foreground py-1.5"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Daily calorie summary */}
      {hasPlan && todayItems.length > 0 && (
        <section className="nv-card p-4">
          <div className="text-xs text-muted-foreground mb-2">Today's planned intake</div>
          {(() => {
            const totalCal = todayItems.reduce((sum, item) => {
              const r = recipeCache[item.recipe_id];
              return sum + (r?.nutrition?.calories || 0);
            }, 0);
            const pct = Math.min(100, calTarget > 0 ? Math.round((totalCal / calTarget) * 100) : 0);
            return (
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{totalCal} kcal</span>
                  <span className="text-muted-foreground">/ {calTarget} target</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })()}
        </section>
      )}

      <MedicalDisclaimer variant="page-footer" />
    </div>
  );
}
