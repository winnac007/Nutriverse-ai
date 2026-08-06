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

const WEEK_DAYS = ["M", "T", "W", "T", "F", "S", "S"];
const MEAL_FALLBACKS = [
  "1546069901-ba9599a7e63c",
  "1512621776951-a57141f2eefd",
  "1504674900247-0877df9cc836",
];

export default function Home() {
  const { user } = useAuth();
  const [mealPlan, setMealPlan] = useState<any>(null);
  const [planRecipes, setPlanRecipes] = useState<Record<string, any>>({});
  const [streak, setStreak] = useState(0);
  const [water] = useState(6);

  useEffect(() => {
    if (!user?.id) return;
    api.get("/meal-plan").then((r) => setMealPlan(r.data)).catch(() => {});
    api.get("/healthcare/streak").then((r) => {
      setStreak(r.data?.current_streak_days ?? 0);
    }).catch(() => {});
  }, [user?.id]);

  useEffect(() => {
    if (!mealPlan?.items?.length) return;
    const todayDay = new Date().toLocaleDateString("en-US", { weekday: "short" });
    const ids = [...new Set(
      mealPlan.items.filter((i: any) => i.day === todayDay).map((i: any) => i.recipe_id)
    )] as string[];
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

  const s = {
    page: {
      background: "#FAF7F0",
    } as React.CSSProperties,

    // ── Header ──────────────────────────────────────────────
    header: {
      position: "relative",
      background: "linear-gradient(180deg, #EDE8DC 0%, #FAF7F0 100%)",
      paddingTop: "calc(env(safe-area-inset-top, 0px) + 0.9rem)",
      paddingBottom: "1.25rem",
      paddingLeft: "1rem",
      paddingRight: "1rem",
      overflow: "hidden",
    } as React.CSSProperties,

    headerInner: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "0.5rem",
    } as React.CSSProperties,

    greeting: {
      fontFamily: "'Playfair Display', serif",
      fontSize: "clamp(1.35rem, 5vw, 1.75rem)",
      fontWeight: 400,
      color: "#1F2E1F",
      lineHeight: 1.2,
      margin: 0,
    } as React.CSSProperties,

    greetingName: {
      fontFamily: "'Playfair Display', serif",
      fontSize: "clamp(1.35rem, 5vw, 1.75rem)",
      fontWeight: 600,
      color: "#3D5C3E",
      lineHeight: 1.2,
      margin: "0 0 0.2rem",
    } as React.CSSProperties,

    subtitle: {
      fontFamily: "'DM Sans', sans-serif",
      fontSize: "0.75rem",
      color: "#8D9E8D",
      margin: 0,
    } as React.CSSProperties,

    avatarBtn: {
      width: 40,
      height: 40,
      minWidth: 40,
      borderRadius: "50%",
      background: "rgba(255,255,255,0.85)",
      border: "1px solid #E5DDD0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      flexShrink: 0,
    } as React.CSSProperties,

    avatar: {
      width: 40,
      height: 40,
      minWidth: 40,
      borderRadius: "50%",
      overflow: "hidden",
      border: "2px solid #3D5C3E",
      flexShrink: 0,
      background: "#E5DDD0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif",
      fontSize: "0.85rem",
      fontWeight: 600,
      color: "#3D5C3E",
    } as React.CSSProperties,

    // ── Body ────────────────────────────────────────────────
    body: {
      display: "flex",
      flexDirection: "column",
      gap: "0.9rem",
      padding: "0.9rem 1rem 0",
    } as React.CSSProperties,

    // ── Cards ───────────────────────────────────────────────
    card: {
      background: "#FFFFFF",
      borderRadius: "1.1rem",
      border: "1px solid #E5DDD0",
      padding: "0.95rem 1rem",
      boxShadow: "0 1px 8px rgba(61,92,62,0.06)",
      position: "relative",
      overflow: "hidden",
    } as React.CSSProperties,

    label: {
      fontFamily: "'DM Sans', sans-serif",
      fontSize: "0.58rem",
      fontWeight: 600,
      letterSpacing: "0.14em",
      textTransform: "uppercase" as const,
      color: "#A8B8A8",
      margin: "0 0 0.2rem",
    } as React.CSSProperties,

    bigNum: {
      fontFamily: "'Playfair Display', serif",
      fontSize: "clamp(1.2rem, 4vw, 1.4rem)",
      color: "#1F2E1F",
      margin: "0 0 0.6rem",
    } as React.CSSProperties,

    unit: {
      fontFamily: "'DM Sans', sans-serif",
      fontSize: "0.7rem",
      color: "#A8B8A8",
      marginLeft: 4,
      fontWeight: 400,
    } as React.CSSProperties,
  };

  return (
    <div style={s.page}>
      {/* ── Header ─────────────────────────────────────── */}
      <div style={s.header}>
        {/* Leaf decoration — clipped by overflow:hidden so won't cause scroll */}
        <svg
          style={{ position: "absolute", top: -10, right: -10, width: 90, height: 90, opacity: 0.25, pointerEvents: "none" }}
          viewBox="0 0 120 120" fill="none"
        >
          <ellipse cx="80" cy="25" rx="22" ry="38" fill="#3D5C3E" transform="rotate(-35 80 25)" />
          <ellipse cx="95" cy="50" rx="16" ry="30" fill="#3D5C3E" opacity="0.6" transform="rotate(-10 95 50)" />
        </svg>

        <div style={s.headerInner}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <h1 style={s.greeting}>{getGreeting()},</h1>
            <h1 style={s.greetingName}>{firstName} 🌿</h1>
            <p style={s.subtitle}>Today is a fresh start.</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
            <button style={s.avatarBtn} aria-label="Notifications">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#5A7A5B" strokeWidth="1.8" strokeLinecap="round">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
              </svg>
            </button>
            <div style={s.avatar}>
              {firstName[0].toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      <div style={s.body}>
        {/* ── Today's Focus ───────────────────────────── */}
        <div style={{ ...s.card, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ position: "absolute", right: 12, opacity: 0.06, pointerEvents: "none" }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="#3D5C3E">
              <path d="M17 8C8 10 5.9 16.17 3.82 22c3.5-5 9-7 13.18-7 0-3.17-1.5-6.17-4-8z"/>
            </svg>
          </div>
          <div style={{ minWidth: 0, flex: 1, paddingRight: "0.5rem" }}>
            <p style={s.label}>Today's Focus</p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.95rem", color: "#1F2E1F", margin: 0, lineHeight: 1.4 }}>
              Eat mindfully &amp; stay hydrated
            </p>
          </div>
          <div style={{ width: 34, height: 34, minWidth: 34, borderRadius: "50%", background: "rgba(61,92,62,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3D5C3E" strokeWidth="2">
              <path d="M17 8C8 10 5.9 16.17 3.82 22c3.5-5 9-7 13.18-7 0-3.17-1.5-6.17-4-8z"/>
            </svg>
          </div>
        </div>

        {/* ── Today's Meals ───────────────────────────── */}
        <section>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.65rem" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 500, color: "#1F2E1F", margin: 0 }}>
              Today's Meals
            </h2>
            <Link href="/app/meal-plan" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.73rem", color: "#3D5C3E", fontWeight: 500, textDecoration: "none", display: "flex", alignItems: "center", gap: "0.15rem" }}>
              View plan
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {meals.map((m, i) => {
              const item = todayMeals[i];
              const recipe = item ? planRecipes[item.recipe_id] : null;
              return (
                <Link key={m.label} href="/app/daily-plan" style={{ textDecoration: "none" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.35rem" }}>
                    <div style={{ width: "100%", aspectRatio: "1 / 1", borderRadius: "0.9rem", overflow: "hidden", border: "1px solid #E5DDD0", background: "#F5F0E8" }}>
                      <img
                        src={recipe?.image || `https://images.unsplash.com/photo-${MEAL_FALLBACKS[i]}?w=160`}
                        alt={m.label}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        loading="lazy"
                        onError={(e) => { (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-${MEAL_FALLBACKS[0]}?w=160`; }}
                      />
                    </div>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.65rem", color: "#8D9E8D", margin: 0, textAlign: "center", lineHeight: 1.2 }}>
                      {m.emoji} {m.label}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ── Water + Daily Rhythm ─────────────────────── */}
        <div className="grid grid-cols-2 gap-3">

          {/* Water */}
          <div style={s.card}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.4rem" }}>
              <p style={s.label}>Water</p>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9DA89D" strokeWidth="1.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
            </div>
            <p style={{ ...s.bigNum, marginBottom: "0.5rem" }}>
              {water}<span style={s.unit}>/ 8 glasses</span>
            </p>
            {/* Glass icons */}
            <div style={{ display: "flex", gap: "3px", flexWrap: "wrap" }}>
              {[1,2,3,4,5,6,7,8].map(i => (
                <svg key={i} width="14" height="18" viewBox="0 0 14 18" fill="none">
                  <path d="M2 2 L3 16 Q3.5 17 7 17 Q10.5 17 11 16 L12 2 Z" fill={i <= water ? "#7AACCF" : "#EAE4D8"} />
                  <path d="M2 2 L12 2 Q11 5 7 5 Q3 5 2 2 Z" fill={i <= water ? "#9BBFD8" : "#D5CEC4"} opacity="0.6" />
                </svg>
              ))}
            </div>
          </div>

          {/* Daily Rhythm */}
          <div style={s.card}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.4rem" }}>
              <p style={s.label}>Daily Rhythm</p>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9DA89D" strokeWidth="1.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
            </div>
            <p style={{ ...s.bigNum, marginBottom: "0.1rem" }}>
              {streak}<span style={s.unit}>days</span>
            </p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
              <svg width="28" height="36" viewBox="0 0 28 36" fill="none" opacity="0.7">
                <path d="M14 30 Q14 18 14 10" stroke="#3D5C3E" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M14 18 Q8 15 7 8 Q13 11 14 17 Z" fill="#3D5C3E" fillOpacity="0.7" />
                <path d="M14 18 Q20 15 21 8 Q15 11 14 17 Z" fill="#3D5C3E" />
              </svg>
            </div>
          </div>
        </div>

        {/* ── Tip of the Day ──────────────────────────── */}
        <div style={{ ...s.card, overflow: "hidden", padding: 0 }}>
          <div style={{ display: "flex", alignItems: "stretch" }}>
            <div style={{ flex: 1, padding: "0.95rem 1rem" }}>
              <p style={s.label}>Tip of the Day</p>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.88rem", color: "#4A5E4A", margin: "0.2rem 0 0", lineHeight: 1.55, fontStyle: "italic" }}>
                Chew slowly. Your body listens to every bite.
              </p>
            </div>
            <div
              data-image-slot="tip-landscape"
              style={{
                width: 90, minWidth: 90, flexShrink: 0,
                background: "linear-gradient(135deg, rgba(170,185,150,0.5), rgba(200,210,180,0.35))",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,0.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3D5C3E" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
              </div>
            </div>
          </div>
        </div>

        {/* ── Mindful Streak ───────────────────────────── */}
        <div style={s.card}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
            <div
              data-image-slot="streak-plant"
              style={{
                width: 52, height: 52, minWidth: 52, borderRadius: 12, flexShrink: 0,
                background: "linear-gradient(135deg, rgba(160,180,140,0.3), rgba(130,155,115,0.2))",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <svg width="24" height="32" viewBox="0 0 24 32" fill="none">
                <path d="M12 28 Q12 16 12 8" stroke="#3D5C3E" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M12 16 Q7 13 6 6 Q11 9 12 15 Z" fill="#3D5C3E" fillOpacity="0.6" />
                <path d="M12 16 Q17 13 18 6 Q13 9 12 15 Z" fill="#3D5C3E" />
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={s.label}>Mindful Streak</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.3rem", marginBottom: "0.6rem" }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", color: "#1F2E1F", fontWeight: 500 }}>{streak}</span>
                <span style={{ fontFamily: "'DM Sans'", fontSize: "0.7rem", color: "#A8B8A8" }}>days in a row</span>
              </div>
              <div style={{ display: "flex", gap: "3px", alignItems: "flex-end" }}>
                {WEEK_DAYS.map((d, i) => {
                  const done = i < (streak % 7 || (streak > 0 ? 7 : 0));
                  return (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, minWidth: 0 }}>
                      <div style={{
                        width: "100%", aspectRatio: "1", borderRadius: "50%",
                        background: done ? "#3D5C3E" : "#EAE4D8",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        {done && <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" style={{ width: "55%", height: "55%" }}><polyline points="20 6 9 17 4 12"/></svg>}
                      </div>
                      <span style={{ fontFamily: "'DM Sans'", fontSize: "0.48rem", color: "#A8B8A8", lineHeight: 1 }}>{d}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── Health Plan Rules ───────────────────────── */}
        {user?.health_plan && (user.health_plan.food_rules || []).length > 0 && (
          <div style={s.card}>
            <p style={s.label}>Your Health Plan</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", marginTop: "0.1rem" }}>
              {(user.health_plan.food_rules as string[]).slice(0, 3).map((rule, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                  <div style={{ width: 5, height: 5, minWidth: 5, borderRadius: "50%", background: "#3D5C3E", marginTop: 6, flexShrink: 0 }} />
                  <p style={{ fontFamily: "'DM Sans'", fontSize: "0.8rem", color: "#4A5E4A", margin: 0, lineHeight: 1.45 }}>{rule}</p>
                </div>
              ))}
            </div>
            <Link href="/app/food-guidelines" style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", marginTop: "0.8rem", fontFamily: "'DM Sans'", fontSize: "0.75rem", color: "#3D5C3E", fontWeight: 500, textDecoration: "none" }}>
              View full food guidelines
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </Link>
          </div>
        )}

        {/* ── Health Guides CTA ───────────────────────── */}
        <Link href="/app/ebook" style={{ textDecoration: "none", display: "block" }}>
          <div style={{ background: "linear-gradient(135deg, #1A0E2E 0%, #2A1442 100%)", borderRadius: "1.1rem", padding: "1.1rem 1rem", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 4px 16px rgba(80,40,120,0.22)", border: "1px solid rgba(180,120,220,0.15)" }}>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontFamily: "'DM Sans'", fontSize: "0.58rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(200,160,255,0.6)", margin: "0 0 0.2rem" }}>New · Clinical Guide</p>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", color: "#EAD8FF", margin: 0 }}>Your Health Guide</p>
              <p style={{ fontFamily: "'DM Sans'", fontSize: "0.73rem", color: "rgba(200,160,255,0.55)", margin: "0.1rem 0 0" }}>Personalised to your condition</p>
            </div>
            <div style={{ width: 40, height: 40, minWidth: 40, borderRadius: "50%", background: "rgba(180,120,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "0.75rem" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C4A0FF" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            </div>
          </div>
        </Link>

        {/* ── Explore CTA ─────────────────────────────── */}
        <Link href="/app/explore" style={{ textDecoration: "none", display: "block" }}>
          <div style={{ background: "linear-gradient(135deg, #3D5C3E 0%, #2D4A2E 100%)", borderRadius: "1.1rem", padding: "1.1rem 1rem", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 4px 16px rgba(61,92,62,0.22)" }}>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontFamily: "'DM Sans'", fontSize: "0.58rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", margin: "0 0 0.2rem" }}>Discover</p>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", color: "#FFFFFF", margin: 0 }}>Discover the Plate</p>
              <p style={{ fontFamily: "'DM Sans'", fontSize: "0.73rem", color: "rgba(255,255,255,0.6)", margin: "0.1rem 0 0" }}>Travel through recipes and cuisines</p>
            </div>
            <div style={{ width: 40, height: 40, minWidth: 40, borderRadius: "50%", background: "rgba(255,255,255,0.14)", display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "0.75rem" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
