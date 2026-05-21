"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";

const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snacks"];

const MEAL_TAGS: Record<string, string[]> = {
  Breakfast: ["Light", "Energizing"],
  Lunch: ["Balanced", "Filling"],
  Dinner: ["Protein-rich", "Satisfying"],
  Snacks: ["Light", "Gut-friendly"],
};

const FALLBACK_IMG = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200";

function todayDayKey() {
  return new Date().toLocaleDateString("en-US", { weekday: "short" });
}

export default function DailyPlan() {
  const { user } = useAuth();
  const [selectedType, setSelectedType] = useState("Breakfast");
  const [plan, setPlan] = useState<any>(null);
  const [recipeCache, setRecipeCache] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  const fetchPlan = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/meal-plan");
      setPlan(data);
    } catch {
      /* fail silently */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPlan(); }, [fetchPlan]);

  const todayDay = todayDayKey();
  const todayItems = (plan?.items || []).filter((i: any) => i.day === todayDay);

  useEffect(() => {
    todayItems.forEach(({ recipe_id }: { recipe_id: string }) => {
      if (!recipeCache[recipe_id]) {
        api.get(`/recipes/${recipe_id}`)
          .then(({ data }) => setRecipeCache(prev => ({ ...prev, [recipe_id]: data })))
          .catch(() => {});
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan]);

  const currentMealItems = todayItems.filter(
    (i: any) => i.meal_type?.toLowerCase() === selectedType.toLowerCase()
  );

  return (
    <div style={{
      minHeight: "100vh",
      background: "#F5EFE2",
      fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
    }}>
      {/* Header */}
      <div style={{
        position: "relative",
        padding: "18px 20px 0",
        overflow: "hidden",
      }}>
        {/* Leaf decoration top-left */}
        <div style={{
          position: "absolute", top: 0, left: -10, width: 100, height: 130,
          pointerEvents: "none", opacity: 0.55,
          background: "radial-gradient(ellipse at 60% 40%, rgba(160,180,140,0.45), transparent 70%)",
        }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 2 }}>
          <button
            onClick={() => window.history.back()}
            style={{ background: "transparent", border: "none", cursor: "pointer", padding: 4 }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2D4530" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
          <Link href="/app/meal-plan" style={{ background: "transparent", border: "none", cursor: "pointer", padding: 4, display: "flex" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2D4530" strokeWidth="1.8" strokeLinecap="round">
              <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
          </Link>
        </div>
        <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "12px 20px 0" }}>
          <h1 style={{
            fontFamily: "var(--font-playfair), 'Playfair Display', serif",
            fontSize: 26, fontWeight: 500, color: "#2D4530", margin: 0,
            display: "inline-flex", alignItems: "center", gap: 8,
          }}>
            Today&apos;s Plan
            <svg width="20" height="16" viewBox="0 0 24 18" fill="none">
              <path d="M12 16 Q4 12 6 4 Q12 8 12 16 Z" fill="#C4974A" opacity="0.85" />
              <path d="M12 16 Q20 12 18 4 Q12 8 12 16 Z" fill="#C4974A" opacity="0.85" />
            </svg>
          </h1>
          <p style={{ fontSize: 13, color: "#7B8A7B", margin: "6px 0 0", lineHeight: 1.5 }}>
            Personalized for your goals and wellness journey.
          </p>
        </div>
      </div>

      {/* Meal type tabs */}
      <div style={{ padding: "16px 20px 0", display: "flex", gap: 8 }}>
        {MEAL_TYPES.map(type => {
          const active = selectedType === type;
          return (
            <button key={type} onClick={() => setSelectedType(type)} style={{
              padding: "8px 14px", borderRadius: 999, fontSize: 13.5, fontWeight: active ? 600 : 400,
              background: active ? "#3D5C3E" : "transparent",
              color: active ? "#fff" : "#5C6B5C",
              border: active ? "none" : "1px solid transparent",
              fontFamily: "inherit", cursor: "pointer", transition: "all 0.2s",
            }}>
              {type}
            </button>
          );
        })}
      </div>

      {/* Recipe rows */}
      <div style={{ padding: "16px 20px 0", display: "flex", flexDirection: "column", gap: 12 }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#A8B8A8", fontSize: 14 }}>
            Loading your plan…
          </div>
        ) : currentMealItems.length === 0 ? (
          <EmptyMealState mealType={selectedType} user={user} />
        ) : (
          currentMealItems.map((item: any) => {
            const recipe = recipeCache[item.recipe_id];
            const tags = MEAL_TAGS[selectedType] || [];
            return (
              <Link key={item.recipe_id} href={`/app/recipe/${item.recipe_id}`} style={{ textDecoration: "none" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 14,
                  background: "#FFFFFF", borderRadius: 18, overflow: "hidden",
                  boxShadow: "0 1px 8px rgba(31,46,31,0.06)",
                }}>
                  <div style={{ width: 100, height: 90, flexShrink: 0, background: "#F5F0E8" }}>
                    <img
                      src={recipe?.image || FALLBACK_IMG}
                      alt={recipe?.title || "Recipe"}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      loading="lazy"
                      onError={e => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }}
                    />
                  </div>
                  <div style={{ flex: 1, padding: "12px 14px 12px 0" }}>
                    <h3 style={{
                      fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                      fontSize: 16, fontWeight: 500, color: "#2D4530", margin: "0 0 4px",
                    }}>
                      {recipe?.title || item.recipe_id}
                    </h3>
                    <p style={{ fontSize: 12, color: "#7B8A7B", margin: "0 0 8px" }}>
                      {tags.join(" • ")}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9DA89D" strokeWidth="2" strokeLinecap="round">
                        <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                      </svg>
                      <span style={{ fontSize: 12, color: "#9DA89D" }}>
                        {recipe?.cook_time ? `${recipe.cook_time} min` : "—"}
                      </span>
                    </div>
                  </div>
                  <div style={{ paddingRight: 14 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C8D4C8" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>

      {/* View Full Plan banner */}
      <div style={{ padding: "20px 20px 0" }}>
        <Link href="/app/meal-plan" style={{ textDecoration: "none" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 14,
            background: "#FFFFFF", borderRadius: 18, padding: "14px 16px",
            boxShadow: "0 1px 8px rgba(31,46,31,0.06)",
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%", background: "#F0EDE0",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 18" fill="none">
                <path d="M12 16 Q4 12 6 4 Q12 8 12 16 Z" fill="#C4974A" opacity="0.85" />
                <path d="M12 16 Q20 12 18 4 Q12 8 12 16 Z" fill="#C4974A" opacity="0.85" />
                <path d="M12 16 Q12 8 12 2 Q14 9 12 16 Z" fill="#D4B070" />
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                fontSize: 15, fontWeight: 500, color: "#2D4530",
              }}>View Full Plan</div>
              <div style={{ fontSize: 12, color: "#7B8A7B", marginTop: 2 }}>See your complete meal plan</div>
            </div>
            <div style={{
              width: 34, height: 34, borderRadius: "50%", background: "#3D5C3E",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
            </div>
          </div>
        </Link>
      </div>

      {/* Landscape image slot */}
      <div style={{ padding: "20px 0 0", position: "relative", overflow: "hidden", height: 140 }}>
        <div
          data-image-slot="landscape-bottom"
          style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(170,180,150,0.45) 0%, rgba(200,200,170,0.25) 50%, transparent 100%)",
          }}
        />
      </div>
    </div>
  );
}

function EmptyMealState({ mealType, user }: { mealType: string; user: any }) {
  return (
    <div style={{
      background: "#FFFFFF", borderRadius: 18, padding: "28px 20px",
      textAlign: "center", boxShadow: "0 1px 8px rgba(31,46,31,0.06)",
    }}>
      <div style={{
        width: 52, height: 52, borderRadius: "50%", background: "#F0EDE0",
        display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px",
      }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3D5C3E" strokeWidth="1.6" strokeLinecap="round">
          <path d="M4 16 Q4 20 12 20 Q20 20 20 16 L18 10 H6 Z" />
          <path d="M8 10 Q8 6 12 6 Q16 6 16 10" />
        </svg>
      </div>
      <p style={{
        fontFamily: "var(--font-playfair), 'Playfair Display', serif",
        fontSize: 16, color: "#2D4530", margin: "0 0 8px",
      }}>
        No {mealType} planned yet
      </p>
      <p style={{ fontSize: 12.5, color: "#7B8A7B", margin: "0 0 16px", lineHeight: 1.5 }}>
        {user?.onboarded
          ? "Generate your personalized meal plan to see today's meals."
          : "Complete your profile to get a personalized plan."}
      </p>
      <Link href="/app/meal-plan" style={{
        display: "inline-block", background: "#3D5C3E", color: "#fff",
        borderRadius: 999, padding: "10px 22px", fontSize: 13, fontWeight: 500,
        textDecoration: "none",
      }}>
        Generate Plan
      </Link>
    </div>
  );
}
