"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

export default function Home() {
  const { user } = useAuth();
  const [mealPlan, setMealPlan] = useState<any>(null);
  const [planRecipes, setPlanRecipes] = useState<Record<string, any>>({});
  const [streak, setStreak] = useState(7);
  const [water, setWater] = useState(6);

  useEffect(() => {
    if (!user?.id) return;
    api.get("/meal-plan").then((r) => setMealPlan(r.data)).catch(() => {});
    api.get("/nutrition/today").then((r) => {
      const w = r.data?.totals?.water_glasses;
      if (w) setWater(Math.min(w, 8));
    }).catch(() => {});
  }, [user?.id]);

  useEffect(() => {
    if (!mealPlan?.items?.length) return;
    const todayDay = new Date().toLocaleDateString("en-US", { weekday: "short" });
    const todayItems = mealPlan.items.filter((i: any) => i.day === todayDay);
    const ids: string[] = [...new Set(todayItems.map((i: any) => i.recipe_id))] as string[];
    ids.forEach((id) => {
      api.get(`/recipes/${id}`).then((r) => {
        setPlanRecipes((prev) => ({ ...prev, [id]: r.data }));
      }).catch(() => {});
    });
  }, [mealPlan]);

  const todayDay = new Date().toLocaleDateString("en-US", { weekday: "short" });
  const todayMeals = mealPlan?.items
    ? mealPlan.items.filter((i: any) => i.day === todayDay).slice(0, 3)
    : [];

  const firstName = user?.name?.split(" ")[0] || "Friend";

  const meals = [
    { label: "Breakfast", emoji: "🌅" },
    { label: "Lunch", emoji: "☀️" },
    { label: "Dinner", emoji: "🌙" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#FAF7F0", paddingBottom: "6rem" }}>
      {/* Botanical header bg */}
      <div style={{ position: "relative", background: "linear-gradient(180deg, #F0EBE0 0%, #FAF7F0 100%)", paddingTop: "3rem", paddingBottom: "1.5rem", paddingLeft: "1.25rem", paddingRight: "1.25rem" }}>
        {/* Decorative leaf top-right */}
        <svg style={{ position: "absolute", top: 0, right: 0, width: 110, height: 110, opacity: 0.35 }} viewBox="0 0 120 120" fill="none">
          <ellipse cx="80" cy="25" rx="22" ry="38" fill="#3D5C3E" transform="rotate(-35 80 25)" />
          <ellipse cx="95" cy="50" rx="16" ry="30" fill="#3D5C3E" opacity="0.6" transform="rotate(-10 95 50)" />
          <line x1="80" y1="25" x2="60" y2="80" stroke="#5A7A5B" strokeWidth="1.2" opacity="0.5" />
        </svg>

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", maxWidth: 480, margin: "0 auto" }}>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.9rem", fontWeight: 400, color: "#1F2E1F", lineHeight: 1.2, margin: 0 }}>
              {getGreeting()},
            </h1>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.9rem", fontWeight: 500, color: "#3D5C3E", lineHeight: 1.2, margin: "0 0 0.25rem" }}>
              {firstName} 🌿
            </h1>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", color: "#8D9E8D", margin: 0, fontWeight: 400 }}>Today is a fresh start.</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <button style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.8)", border: "1px solid #E5DDD0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5A7A5B" strokeWidth="1.8" strokeLinecap="round">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
              </svg>
            </button>
            <div style={{ width: 40, height: 40, borderRadius: "50%", overflow: "hidden", border: "2.5px solid #3D5C3E" }}>
              <img src={`https://i.pravatar.cc/80?u=${user?.email}`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: "1rem 1.25rem 0", maxWidth: 480, margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

        {/* Today's Focus */}
        <div style={{ background: "#FFFFFF", borderRadius: "1.25rem", border: "1px solid #E5DDD0", padding: "1.1rem 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 12px rgba(61,92,62,0.06)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", opacity: 0.08 }}>
            <svg width="52" height="52" viewBox="0 0 24 24" fill="#3D5C3E"><path d="M17 8C8 10 5.9 16.17 3.82 22c3.5-5 9-7 13.18-7 0-3.17-1.5-6.17-4-8z"/><path d="M17 8c2 2 3 4 3 7-3.17 0-7.17-1-11 0"/></svg>
          </div>
          <div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#A8B8A8", margin: "0 0 0.25rem" }}>Today's Focus</p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: "#1F2E1F", margin: 0, lineHeight: 1.4 }}>Eat mindfully and stay hydrated</p>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(61,92,62,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3D5C3E" strokeWidth="2"><path d="M17 8C8 10 5.9 16.17 3.82 22c3.5-5 9-7 13.18-7 0-3.17-1.5-6.17-4-8z"/></svg>
          </div>
        </div>

        {/* Today's Meals */}
        <section>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 500, color: "#1F2E1F", margin: 0 }}>Today's Meals</h2>
            <Link href="/app/meal-plan" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", color: "#3D5C3E", fontWeight: 500, textDecoration: "none", display: "flex", alignItems: "center", gap: "0.2rem" }}>
              View plan
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.65rem" }}>
            {meals.map((m, i) => {
              const item = todayMeals[i];
              const recipe = item ? planRecipes[item.recipe_id] : null;
              return (
                <Link key={m.label} href="/app/daily-plan" style={{ textDecoration: "none" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem" }}>
                    <div style={{ width: "100%", aspectRatio: "1", borderRadius: "1rem", overflow: "hidden", border: "1px solid #E5DDD0", background: "#F5F0E8" }}>
                      <img
                        src={recipe?.image || `https://images.unsplash.com/photo-${["1546069901-ba9599a7e63c", "1512621776951-a57141f2eefd", "1504674900247-0877df9cc836"][i]}?w=200`}
                        alt={m.label}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        loading="lazy"
                        onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200"; }}
                      />
                    </div>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.68rem", color: "#8D9E8D", margin: 0, textAlign: "center" }}>{m.emoji} {m.label}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Water + Streak cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
          {/* Water */}
          <div style={{ background: "#FFFFFF", borderRadius: "1.25rem", border: "1px solid #E5DDD0", padding: "1.1rem", boxShadow: "0 2px 12px rgba(61,92,62,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#A8B8A8", margin: 0 }}>Water</p>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7AACCF" strokeWidth="2"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/></svg>
            </div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: "#1F2E1F", margin: "0 0 0.75rem" }}>{water}<span style={{ fontFamily: "'DM Sans'", fontSize: "0.72rem", color: "#A8B8A8", marginLeft: 4 }}>/ 8 glasses</span></p>
            <div style={{ display: "flex", gap: "3px" }}>
              {[1,2,3,4,5,6,7,8].map(i => (
                <div key={i} style={{ flex: 1, height: 4, borderRadius: 999, background: i <= water ? "#7AACCF" : "#EAE4D8" }} />
              ))}
            </div>
          </div>
          {/* Streak */}
          <div style={{ background: "#FFFFFF", borderRadius: "1.25rem", border: "1px solid #E5DDD0", padding: "1.1rem", boxShadow: "0 2px 12px rgba(61,92,62,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#A8B8A8", margin: 0 }}>Mindful Streak</p>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3D5C3E" strokeWidth="2"><path d="M17 8C8 10 5.9 16.17 3.82 22c3.5-5 9-7 13.18-7 0-3.17-1.5-6.17-4-8z"/></svg>
            </div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: "#1F2E1F", margin: "0 0 0.75rem" }}>{streak}<span style={{ fontFamily: "'DM Sans'", fontSize: "0.72rem", color: "#A8B8A8", marginLeft: 4 }}>days</span></p>
            <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
              {DAYS.map((d, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", background: i < streak % 7 ? "#3D5C3E" : "#EAE4D8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {i < streak % 7 && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                  </div>
                  <span style={{ fontFamily: "'DM Sans'", fontSize: "0.55rem", color: "#A8B8A8" }}>{d}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tip of the Day */}
        <div style={{ background: "#FFFFFF", borderRadius: "1.25rem", border: "1px solid #E5DDD0", padding: "1.1rem 1.25rem", display: "flex", alignItems: "flex-start", gap: "0.9rem", boxShadow: "0 2px 12px rgba(61,92,62,0.05)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", bottom: -10, right: -10, opacity: 0.06 }}>
            <svg width="80" height="80" viewBox="0 0 24 24" fill="#3D5C3E"><path d="M17 8C8 10 5.9 16.17 3.82 22c3.5-5 9-7 13.18-7 0-3.17-1.5-6.17-4-8z"/></svg>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#FDF5E6", border: "1px solid #F0E0BC", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#C4974A" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: "'DM Sans'", fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#A8B8A8", margin: "0 0 0.3rem" }}>Tip of the Day</p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.9rem", color: "#4A5E4A", margin: 0, lineHeight: 1.55, fontStyle: "italic" }}>
              "Chew slowly. Your body listens to every bite."
            </p>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C8D4C8" strokeWidth="2" style={{ flexShrink: 0, marginTop: 4 }}><polyline points="9 18 15 12 9 6"/></svg>
        </div>

        {/* Health plan quick links */}
        {user?.health_plan && (
          <div style={{ background: "#FFFFFF", borderRadius: "1.25rem", border: "1px solid #E5DDD0", padding: "1.1rem 1.25rem", boxShadow: "0 2px 12px rgba(61,92,62,0.05)" }}>
            <p style={{ fontFamily: "'DM Sans'", fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#A8B8A8", margin: "0 0 0.75rem" }}>Your Health Plan</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {(user.health_plan.food_rules || []).slice(0, 3).map((rule: string, i: number) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem" }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#3D5C3E", marginTop: 7, flexShrink: 0 }} />
                  <p style={{ fontFamily: "'DM Sans'", fontSize: "0.82rem", color: "#4A5E4A", margin: 0, lineHeight: 1.5 }}>{rule}</p>
                </div>
              ))}
            </div>
            <Link href="/app/food-guidelines" style={{ display: "flex", alignItems: "center", gap: "0.3rem", marginTop: "0.9rem", fontFamily: "'DM Sans'", fontSize: "0.78rem", color: "#3D5C3E", fontWeight: 500, textDecoration: "none" }}>
              View full food guidelines
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            </Link>
          </div>
        )}

        {/* Explore CTA */}
        <Link href="/app/explore" style={{ textDecoration: "none" }}>
          <div style={{ background: "linear-gradient(135deg, #3D5C3E 0%, #2D4A2E 100%)", borderRadius: "1.25rem", padding: "1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 4px 20px rgba(61,92,62,0.25)" }}>
            <div>
              <p style={{ fontFamily: "'DM Sans'", fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", margin: "0 0 0.25rem" }}>Discover</p>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: "#FFFFFF", margin: 0 }}>Explore Recipes</p>
              <p style={{ fontFamily: "'DM Sans'", fontSize: "0.75rem", color: "rgba(255,255,255,0.6)", margin: "0.15rem 0 0" }}>Tailored to your conditions</p>
            </div>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
