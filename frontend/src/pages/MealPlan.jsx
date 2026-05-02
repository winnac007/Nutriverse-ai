import React, { useEffect, useState } from "react";
import api from "../lib/api";
import { Button } from "../components/ui/button";
import { Sparkles, Lock, Utensils } from "lucide-react";
import { useAuth } from "../lib/auth";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import PremiumGate from "../components/PremiumGate";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MEALS = ["breakfast", "lunch", "dinner"];

export default function MealPlan() {
  const { user, refresh } = useAuth();
  const [smart, setSmart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recipesById, setRecipesById] = useState({});
  const [savedPlan, setSavedPlan] = useState({ items: [] });

  useEffect(() => {
    api.get("/recipes").then((r) => setRecipesById(Object.fromEntries(r.data.map((x) => [x.id, x]))));
    api.get("/meal-plan").then((r) => setSavedPlan(r.data)).catch(() => {});
  }, []);

  const generate = async () => {
    setLoading(true);
    try {
      const { data } = await api.post("/ai/smart-plan", { context: "" });
      setSmart(data);
      if (data.is_premium) {
        const sp = await api.get("/meal-plan");
        setSavedPlan(sp.data);
      }
      toast.success(data.is_premium ? "Your 7-day plan is ready!" : "Preview ready");
    } catch (e) {
      toast.error(e?.response?.data?.detail || "AI plan failed");
    } finally {
      setLoading(false);
    }
  };

  const upgrade = async () => {
    try { await api.post("/user/upgrade"); await refresh(); toast.success("Welcome to Premium!"); } catch { toast.error("Failed"); }
  };

  const itemFor = (day, meal_type) => savedPlan.items?.find((i) => i.day === day && i.meal_type === meal_type);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">Smart Meal Plan</h1>
        <p className="text-muted-foreground mt-1">Body-type aware. Goal-tuned. Coach-led.</p>
      </header>

      {/* Generate / regenerate */}
      <div className="nv-card nv-shadow p-5 flex items-center gap-4 relative overflow-hidden">
        <div className="absolute inset-0 nv-gradient-cu opacity-10" />
        <div className="relative flex items-center gap-4 flex-1">
          <div className="size-11 rounded-2xl nv-gradient-cu grid place-items-center text-white"><Sparkles className="size-5" /></div>
          <div className="flex-1">
            <div className="font-semibold">{smart ? "Refresh your plan" : "Generate your plan"}</div>
            <div className="text-xs text-muted-foreground">Personalized to your body type, condition, goal & lifestyle.</div>
          </div>
          <Button data-testid="generate-plan-btn" onClick={generate} disabled={loading} className="rounded-full">
            {loading ? "Cooking…" : smart ? "Refresh" : "Generate"}
          </Button>
        </div>
      </div>

      {/* Smart plan preview */}
      {smart && (
        <section data-testid="smart-plan-output" className="space-y-5">
          <div className="nv-card nv-shadow p-5">
            <h3 className="font-display text-lg font-semibold mb-2">Your analysis</h3>
            <p className="text-sm leading-relaxed text-foreground/90">{smart.analysis}</p>
            <div className="grid grid-cols-4 gap-3 mt-4">
              <div className="text-center"><div className="text-2xl font-display font-bold">{smart.calorie_estimate}</div><div className="text-[10px] uppercase tracking-wider text-muted-foreground">kcal/day</div></div>
              <div className="text-center"><div className="text-2xl font-display font-bold">{smart.macros?.protein_g}g</div><div className="text-[10px] uppercase tracking-wider text-muted-foreground">protein</div></div>
              <div className="text-center"><div className="text-2xl font-display font-bold">{smart.macros?.carbs_g}g</div><div className="text-[10px] uppercase tracking-wider text-muted-foreground">carbs</div></div>
              <div className="text-center"><div className="text-2xl font-display font-bold">{smart.macros?.fat_g}g</div><div className="text-[10px] uppercase tracking-wider text-muted-foreground">fat</div></div>
            </div>
          </div>

          {smart.preview_meal && (
            <div className="nv-card nv-shadow p-5">
              <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-1">Sample meal · {smart.preview_meal.meal_type}</div>
              <h4 className="font-display text-xl font-semibold">{smart.preview_meal.title}</h4>
              <p className="text-sm text-muted-foreground mt-1">{smart.preview_meal.calories} kcal — {smart.preview_meal.reasoning}</p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {(smart.preview_meal.ingredients || []).map((i) => (
                  <li key={i} className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground">{i}</li>
                ))}
              </ul>
            </div>
          )}

          {!smart.is_premium ? (
            <div data-testid="smart-plan-paywall" className="nv-card nv-shadow p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute inset-0 nv-gradient-pm opacity-10" />
              <div className="relative space-y-3">
                <div className="flex items-center gap-2 text-[#c28a00]"><Lock className="size-4" /><span className="text-xs uppercase tracking-[0.25em] font-semibold">Premium unlocks</span></div>
                <h3 className="font-display text-2xl font-bold">Your full 7-day plan, grocery list & AI coach</h3>
                <p className="text-sm text-muted-foreground">{smart.upgrade_message}</p>
                <ul className="text-sm space-y-1.5">
                  <li>✓ 21 personalized meals (Mon–Sun, breakfast/lunch/dinner)</li>
                  <li>✓ Smart grocery list — per region & budget</li>
                  <li>✓ Adaptive AI coach for daily questions</li>
                  <li>✓ Lifestyle Engine: sleep, hydration, workouts</li>
                </ul>
                <Button data-testid="paywall-upgrade-btn" onClick={upgrade} className="rounded-full px-8 nv-gradient-pm text-black hover:opacity-90 border-0">
                  Unlock for ₹300/mo
                </Button>
              </div>
            </div>
          ) : (
            <>
              {smart.weekly_variations?.length > 0 && (
                <div className="nv-card nv-shadow p-5">
                  <h3 className="font-display text-lg font-semibold mb-2">Variations for the week</h3>
                  <ul className="text-sm space-y-1.5 list-disc pl-5 text-foreground/90">
                    {smart.weekly_variations.map((v, i) => <li key={i}>{v}</li>)}
                  </ul>
                </div>
              )}
              {smart.grocery_list?.length > 0 && (
                <div className="nv-card nv-shadow p-5">
                  <h3 className="font-display text-lg font-semibold mb-2">Grocery list</h3>
                  <div className="flex flex-wrap gap-2">
                    {smart.grocery_list.map((g, i) => <span key={i} className="text-xs px-3 py-1.5 rounded-full bg-muted">{g}</span>)}
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      )}

      {/* Calendar view of saved plan */}
      <section className="space-y-3">
        <h2 className="font-display text-xl font-semibold">Your week</h2>
        {savedPlan.items?.length === 0 ? (
          <div className="nv-card p-5 text-sm text-muted-foreground text-center">Generate a plan above to fill your week.</div>
        ) : (
          DAYS.map((d) => (
            <div key={d} className="nv-card nv-shadow p-4" data-testid={`mealplan-day-${d}`}>
              <div className="font-display font-semibold mb-3">{d}</div>
              <div className="grid sm:grid-cols-3 gap-3">
                {MEALS.map((m) => {
                  const it = itemFor(d, m);
                  const rec = it && recipesById[it.recipe_id];
                  return (
                    <div key={m} className="rounded-xl border border-border p-3 bg-background">
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">{m}</div>
                      {rec ? (
                        <Link to={`/app/recipe/${rec.id}`} className="block group">
                          <div className="aspect-[16/10] rounded-lg overflow-hidden mb-2">
                            <img src={rec.image} alt={rec.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          </div>
                          <div className="text-sm font-medium line-clamp-2">{rec.title}</div>
                          <div className="text-xs text-muted-foreground mt-1">{rec.nutrition.calories} kcal</div>
                          {it?.reason && <div className="text-[10px] text-muted-foreground mt-1 italic">{it.reason}</div>}
                        </Link>
                      ) : (
                        <div className="h-24 flex items-center justify-center text-xs text-muted-foreground">
                          <Utensils className="size-4 mr-1" /> Empty
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
