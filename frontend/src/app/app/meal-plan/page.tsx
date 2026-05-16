"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import Link from "next/link";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MEALS = ["breakfast", "lunch", "dinner"];
const MEAL_LABELS: Record<string, { label: string; emoji: string }> = {
  breakfast: { label: "Breakfast", emoji: "🌅" },
  lunch: { label: "Lunch", emoji: "☀️" },
  dinner: { label: "Dinner", emoji: "🌙" },
};

export default function MealPlan() {
  const { user, refresh } = useAuth();
  const [smart, setSmart] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [recipesById, setRecipesById] = useState<Record<string, any>>({});
  const [savedPlan, setSavedPlan] = useState<any>({ items: [] });
  const [activeTab, setActiveTab] = useState("breakfast");

  useEffect(() => {
    api.get("/recipes").then((r) => setRecipesById(Object.fromEntries(r.data.map((x: any) => [x.id, x]))));
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
    } catch (e: any) {
      toast.error(e?.response?.data?.detail || "AI plan failed");
    } finally {
      setLoading(false);
    }
  };

  const upgrade = async () => {
    try { await api.post("/user/upgrade"); await refresh(); toast.success("Welcome to Premium!"); } catch { toast.error("Failed"); }
  };

  const itemFor = (day: string, meal_type: string) =>
    savedPlan.items?.find((i: any) => i.day === day && i.meal_type === meal_type);

  const todayDay = new Date().toLocaleDateString("en-US", { weekday: "short" });

  return (
    <div style={{ minHeight: "100vh", background: "#FAF7F0", paddingBottom: "6rem" }}>
      {/* Header */}
      <div style={{ position: "relative", background: "linear-gradient(180deg, #F0EBE0 0%, #FAF7F0 100%)", padding: "2.5rem 1.25rem 1.25rem", overflow: "hidden" }}>
        <svg style={{ position: "absolute", top: -10, right: -10, width: 120, height: 120, opacity: 0.28 }} viewBox="0 0 120 120" fill="none">
          <ellipse cx="85" cy="28" rx="25" ry="44" fill="#3D5C3E" transform="rotate(-28 85 28)"/>
          <ellipse cx="105" cy="62" rx="18" ry="32" fill="#3D5C3E" opacity="0.6" transform="rotate(12 105 62)"/>
          <line x1="85" y1="28" x2="62" y2="105" stroke="#5A7A5B" strokeWidth="1.4" opacity="0.4"/>
        </svg>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
          <Link href="/app" style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.7)", border: "1px solid #E5DDD0", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3D5C3E" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          </Link>
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.75rem", fontWeight: 400, color: "#1F2E1F", margin: "0 0 0.2rem" }}>Today's Plan 🌿</h1>
        <p style={{ fontSize: "0.8rem", color: "#8D9E8D", margin: 0 }}>Personalized for your goals and wellness journey.</p>
      </div>

      <div style={{ padding: "1rem 1.25rem 0", display: "flex", flexDirection: "column", gap: "1rem" }}>

        {/* Quick actions */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.65rem" }}>
          {[
            { label: "Today", emoji: "📅", href: "/app/daily-plan" },
            { label: "Grocery", emoji: "🛒", href: "/app/grocery" },
            { label: "Food Guide", emoji: "🥗", href: "/app/food-guidelines" },
          ].map(({ label, emoji, href }) => (
            <Link key={label} href={href} style={{ textDecoration: "none" }}>
              <div style={{ background: "#FFFFFF", borderRadius: "1rem", border: "1px solid #E5DDD0", padding: "0.85rem 0.5rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.35rem", boxShadow: "0 1px 8px rgba(61,92,62,0.05)" }}>
                <span style={{ fontSize: "1.2rem" }}>{emoji}</span>
                <span style={{ fontFamily: "'DM Sans'", fontSize: "0.72rem", fontWeight: 500, color: "#4A5E4A" }}>{label}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Generate plan card */}
        <div style={{ background: "#FFFFFF", borderRadius: "1.25rem", border: "1px solid #E5DDD0", padding: "1.25rem", boxShadow: "0 2px 12px rgba(61,92,62,0.06)", display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ width: 44, height: 44, borderRadius: "0.75rem", background: "rgba(61,92,62,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3D5C3E" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: "#1F2E1F", margin: "0 0 0.15rem" }}>{smart ? "Refresh your plan" : "Generate AI meal plan"}</p>
            <p style={{ fontFamily: "'DM Sans'", fontSize: "0.75rem", color: "#8D9E8D", margin: 0 }}>Personalized to your body, goals & conditions.</p>
          </div>
          <button onClick={generate} disabled={loading} style={{ background: loading ? "#A8B8A8" : "#3D5C3E", color: "#FFFFFF", border: "none", borderRadius: 999, padding: "0.6rem 1.1rem", fontSize: "0.8rem", fontWeight: 600, fontFamily: "'DM Sans'", cursor: loading ? "default" : "pointer", flexShrink: 0 }}>
            {loading ? "…" : smart ? "Refresh" : "Generate"}
          </button>
        </div>

        {/* Macros summary if generated */}
        {smart && (
          <div style={{ background: "#FFFFFF", borderRadius: "1.25rem", border: "1px solid #E5DDD0", padding: "1.25rem", boxShadow: "0 2px 12px rgba(61,92,62,0.06)" }}>
            <p style={{ fontFamily: "'DM Sans'", fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#A8B8A8", margin: "0 0 0.75rem" }}>Your Daily Targets</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center">
              {[
                { val: smart.calorie_estimate, unit: "kcal", label: "Calories" },
                { val: `${smart.macros?.protein_g}g`, unit: "", label: "Protein" },
                { val: `${smart.macros?.carbs_g}g`, unit: "", label: "Carbs" },
                { val: `${smart.macros?.fat_g}g`, unit: "", label: "Fat" },
              ].map(m => (
                <div key={m.label} style={{ padding: "0.6rem", background: "#FAF7F0", borderRadius: "0.75rem", border: "1px solid #E8E0D4" }}>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: "#3D5C3E", margin: 0 }}>{m.val}</p>
                  <p style={{ fontSize: "0.6rem", color: "#A8B8A8", margin: "0.15rem 0 0", textTransform: "uppercase", letterSpacing: "0.08em" }}>{m.label}</p>
                </div>
              ))}
            </div>
            {smart.analysis && <p style={{ fontSize: "0.82rem", color: "#7D8E7D", margin: "0.9rem 0 0", lineHeight: 1.6, fontStyle: "italic", fontFamily: "'Playfair Display', serif" }}>"{smart.analysis}"</p>}
          </div>
        )}

        {/* Premium upsell */}
        {smart && !smart.is_premium && (
          <div style={{ background: "linear-gradient(135deg, #2D4A2E 0%, #1A2E1B 100%)", borderRadius: "1.25rem", padding: "1.5rem", boxShadow: "0 8px 32px rgba(61,92,62,0.25)" }}>
            <p style={{ fontFamily: "'DM Sans'", fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(196,151,74,0.9)", margin: "0 0 0.5rem" }}>✦ Premium</p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: "#FFFFFF", margin: "0 0 0.5rem" }}>Unlock your full 7-day plan</p>
            <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)", margin: "0 0 1rem", lineHeight: 1.6 }}>{smart.upgrade_message}</p>
            <ul style={{ margin: "0 0 1.25rem", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
              {["21 personalised meals (Mon–Sun)", "Smart grocery list by budget", "Adaptive AI coach", "Lifestyle engine: sleep, hydration"].map(f => (
                <li key={f} style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.75)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ color: "#C4974A" }}>✓</span> {f}
                </li>
              ))}
            </ul>
            <button onClick={upgrade} style={{ background: "#FFFFFF", color: "#1F2E1F", border: "none", borderRadius: 999, padding: "0.75rem 2rem", fontSize: "0.9rem", fontWeight: 700, fontFamily: "'DM Sans'", cursor: "pointer" }}>
              Unlock for ₹300/mo
            </button>
          </div>
        )}

        {/* Meal tabs + week view */}
        {savedPlan.items?.length > 0 && (
          <>
            {/* Tab bar */}
            <div style={{ background: "#FFFFFF", borderRadius: "1.25rem", border: "1px solid #E5DDD0", padding: "0.3rem", display: "flex", boxShadow: "0 2px 12px rgba(61,92,62,0.06)" }}>
              {MEALS.map(m => (
                <button key={m} onClick={() => setActiveTab(m)} style={{ flex: 1, padding: "0.6rem", borderRadius: "0.85rem", border: "none", fontFamily: "'DM Sans'", fontSize: "0.82rem", fontWeight: activeTab === m ? 600 : 400, cursor: "pointer", transition: "all 0.2s", background: activeTab === m ? "#3D5C3E" : "transparent", color: activeTab === m ? "#FFFFFF" : "#8D9E8D" }}>
                  {MEAL_LABELS[m].emoji} {MEAL_LABELS[m].label}
                </button>
              ))}
            </div>

            {/* Day cards */}
            {DAYS.map((d) => {
              const item = itemFor(d, activeTab);
              const rec = item && recipesById[item.recipe_id];
              return (
                <div key={d} style={{ background: "#FFFFFF", borderRadius: "1.25rem", border: d === todayDay ? "1.5px solid #3D5C3E" : "1px solid #E5DDD0", padding: "0", overflow: "hidden", boxShadow: d === todayDay ? "0 4px 20px rgba(61,92,62,0.12)" : "0 2px 8px rgba(61,92,62,0.04)" }}>
                  {d === todayDay && (
                    <div style={{ background: "#3D5C3E", padding: "0.3rem 1rem" }}>
                      <span style={{ fontFamily: "'DM Sans'", fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.8)" }}>Today</span>
                    </div>
                  )}
                  {rec ? (
                    <Link href={`/app/recipe/${rec.id}`} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.9rem", padding: "0.9rem 1rem" }}>
                      <div style={{ width: 64, height: 64, borderRadius: "0.75rem", overflow: "hidden", flexShrink: 0, border: "1px solid #E5DDD0" }}>
                        <img src={rec.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200"} alt={rec.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200"; }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontFamily: "'DM Sans'", fontSize: "0.6rem", color: "#A8B8A8", margin: "0 0 0.15rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>{d}</p>
                        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.95rem", color: "#1F2E1F", margin: "0 0 0.2rem", lineHeight: 1.3 }}>{rec.title}</p>
                        <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                          {item.reason && <span style={{ fontSize: "0.65rem", color: "#8D9E8D" }}>{item.reason}</span>}
                          {rec.nutrition?.calories && <span style={{ fontSize: "0.65rem", color: "#A8B8A8" }}>· {rec.nutrition.calories} kcal</span>}
                        </div>
                      </div>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C8D4C8" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                    </Link>
                  ) : (
                    <div style={{ padding: "1rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <div style={{ width: 64, height: 64, borderRadius: "0.75rem", background: "#F0EBE0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ fontSize: "1.5rem" }}>🍽️</span>
                      </div>
                      <div>
                        <p style={{ fontFamily: "'DM Sans'", fontSize: "0.6rem", color: "#A8B8A8", margin: "0 0 0.15rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>{d}</p>
                        <p style={{ fontSize: "0.82rem", color: "#A8B8A8", margin: 0 }}>Generate a plan to fill this slot</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}

        {/* Empty state */}
        {(!savedPlan.items?.length && !loading) && (
          <div style={{ background: "#FFFFFF", borderRadius: "1.25rem", border: "1px solid #E5DDD0", padding: "2.5rem 1.5rem", textAlign: "center" }}>
            <span style={{ fontSize: "2.5rem" }}>🍽️</span>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: "#1F2E1F", margin: "0.75rem 0 0.4rem" }}>No plan yet</p>
            <p style={{ fontSize: "0.82rem", color: "#8D9E8D", margin: 0 }}>Generate your personalised 7-day plan above</p>
          </div>
        )}

        {/* Medical disclaimer */}
        <div style={{ background: "#F5F0E8", borderRadius: "1rem", border: "1px solid #E5DDD0", padding: "0.85rem 1rem", display: "flex", alignItems: "flex-start", gap: "0.6rem" }}>
          <span style={{ fontSize: "0.9rem", flexShrink: 0 }}>🔒</span>
          <p style={{ fontFamily: "'DM Sans'", fontSize: "0.72rem", color: "#8D9E8D", margin: 0, lineHeight: 1.6 }}>
            This app provides general nutritional guidance and is not a substitute for medical advice. Always consult your doctor before making dietary changes.
          </p>
        </div>
      </div>
    </div>
  );
}
