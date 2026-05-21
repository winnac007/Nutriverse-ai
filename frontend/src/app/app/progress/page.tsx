"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";

const TABS = ["Today", "Mind", "Body", "Nutrition", "Sleep"];

const PLAN_ITEMS = [
  { time: "7:00 AM", icon: "☀️", title: "Morning Meditation", sub: "10 min · Mind", status: "Completed" },
  { time: "8:00 AM", icon: "🥗", title: "Healthy Breakfast", sub: "Eat a nutritious meal", status: "Completed" },
  { time: "12:30 PM", icon: "👟", title: "Walk 30 Minutes", sub: "Get your steps in", status: "In Progress" },
  { time: "6:30 PM", icon: "💪", title: "Strength Training", sub: "Full body workout", status: "Upcoming" },
  { time: "9:30 PM", icon: "🌙", title: "Wind Down", sub: "Relax and prepare for sleep", status: "Upcoming" },
];

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  Completed: { bg: "#E8F0E8", color: "#3D5C3E" },
  "In Progress": { bg: "#EEF4FF", color: "#4A7ACC" },
  Upcoming: { bg: "#F5F0E8", color: "#9DA89D" },
};

export default function Progress() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("Today");
  const [todayNutrition, setTodayNutrition] = useState<any>(null);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (!user?.id) return;
    api.get("/nutrition/today").then(r => setTodayNutrition(r.data)).catch(() => {});
    api.get("/healthcare/streak").then(r => setStreak(r.data?.current_streak_days ?? 0)).catch(() => {});
  }, [user?.id]);

  const calories = todayNutrition?.totals?.calories ?? 0;
  const wellnessScore = Math.min(100, Math.round(
    (streak > 0 ? Math.min(40, streak * 3) : 0) +
    (calories > 0 && calories < 2200 ? 30 : calories > 0 ? 20 : 0) +
    35
  ));

  return (
    <div style={{
      minHeight: "100vh", background: "#F5EFE2",
      fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
    }}>
      {/* Header with landscape image slot */}
      <div style={{ position: "relative", overflow: "hidden", paddingBottom: 20 }}>
        {/* Landscape placeholder */}
        <div
          data-image-slot="wellness-landscape"
          style={{
            position: "absolute", top: 0, right: 0, bottom: 0, width: "55%",
            pointerEvents: "none",
            background: "linear-gradient(135deg, rgba(200,210,180,0.4), rgba(170,185,150,0.2))",
          }}
        />
        <div style={{ position: "relative", zIndex: 2, padding: "18px 20px 0" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <button
              onClick={() => window.history.back()}
              style={{ background: "transparent", border: "none", cursor: "pointer", padding: 4 }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2D4530" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
              </svg>
            </button>
            <button style={{ background: "transparent", border: "none", cursor: "pointer", padding: 4 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2D4530" strokeWidth="1.8" strokeLinecap="round">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
              </svg>
            </button>
          </div>
          <div style={{ marginTop: 14 }}>
            <h1 style={{
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              fontSize: 28, fontWeight: 500, color: "#2D4530", margin: 0,
              display: "inline-flex", alignItems: "center", gap: 8,
            }}>
              Wellness Journey
              <svg width="18" height="14" viewBox="0 0 24 18" fill="none">
                <path d="M12 16 Q4 12 6 4 Q12 8 12 16 Z" fill="#C4974A" opacity="0.85" />
                <path d="M12 16 Q20 12 18 4 Q12 8 12 16 Z" fill="#C4974A" opacity="0.85" />
              </svg>
            </h1>
            <p style={{ fontSize: 13, color: "#7B8A7B", margin: "6px 0 0", lineHeight: 1.55 }}>
              Nurture your body. Calm your mind.{"\n"}Live your best life.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ padding: "0 20px 0", overflowX: "auto", display: "flex", gap: 8, scrollbarWidth: "none" }}>
        {TABS.map(tab => {
          const active = activeTab === tab;
          return (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: "8px 16px", borderRadius: 999, fontSize: 13, fontWeight: active ? 600 : 400,
              background: active ? "#3D5C3E" : "transparent",
              color: active ? "#fff" : "#5C6B5C",
              border: "none", fontFamily: "inherit", cursor: "pointer",
              display: "inline-flex", alignItems: "center", gap: 6, whiteSpace: "nowrap",
            }}>
              {tab === "Today" && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>}
              {tab}
            </button>
          );
        })}
      </div>

      <div style={{ padding: "14px 20px 0", display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Wellness Score Card */}
        <div style={{
          background: "#FFFFFF", borderRadius: 20, padding: "16px",
          boxShadow: "0 1px 8px rgba(31,46,31,0.06)", display: "flex", gap: 16, alignItems: "center",
        }}>
          {/* Circular score */}
          <div style={{ position: "relative", width: 90, height: 90, flexShrink: 0 }}>
            <svg width="90" height="90" viewBox="0 0 90 90">
              <circle cx="45" cy="45" r="38" fill="none" stroke="#EAE3D2" strokeWidth="7" />
              <circle
                cx="45" cy="45" r="38" fill="none" stroke="#3D5C3E" strokeWidth="7"
                strokeDasharray={`${(wellnessScore / 100) * 239} 239`}
                strokeLinecap="round"
                transform="rotate(-90 45 45)"
              />
              <text x="45" y="40" textAnchor="middle" fontSize="11" fill="#7B8A7B" fontFamily="'DM Sans', sans-serif">Today's</text>
              <text x="45" y="52" textAnchor="middle" fontSize="9.5" fill="#7B8A7B" fontFamily="'DM Sans', sans-serif">Wellness Score</text>
            </svg>
            <div style={{
              position: "absolute", inset: 0, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", marginTop: 12,
            }}>
              <span style={{
                fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                fontSize: 22, fontWeight: 500, color: "#2D4530",
              }}>{wellnessScore}</span>
              <span style={{ fontSize: 10, color: "#7B8A7B" }}>/100</span>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              fontSize: 15, color: "#2D4530", margin: "0 0 8px", fontWeight: 500,
            }}>
              You&apos;re doing amazing!
            </p>
            <p style={{ fontSize: 12, color: "#7B8A7B", margin: "0 0 10px", lineHeight: 1.4 }}>
              Keep up the great work and stay consistent.
            </p>
            {/* Stats row */}
            <div style={{ display: "flex", gap: 12 }}>
              {[
                { emoji: "🔥", label: `${Math.round(calories)}`, sub: "Calories" },
                { emoji: "👟", label: "7,842", sub: "Steps" },
                { emoji: "❤️", label: "68", sub: "BPM" },
              ].map(s => (
                <div key={s.sub} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#2D4530" }}>
                    <span style={{ fontSize: 12 }}>{s.emoji}</span> {s.label}
                  </div>
                  <div style={{ fontSize: 10, color: "#9DA89D" }}>{s.sub}</div>
                </div>
              ))}
            </div>
            <button style={{
              marginTop: 8, background: "transparent", border: "none", cursor: "pointer",
              fontSize: 12, color: "#3D5C3E", fontFamily: "inherit", fontWeight: 500,
              padding: 0, display: "inline-flex", alignItems: "center", gap: 4,
            }}>
              View insights
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          </div>
        </div>

        {/* Today's Plan timeline */}
        <div style={{ background: "#FFFFFF", borderRadius: 20, padding: "16px", boxShadow: "0 1px 8px rgba(31,46,31,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <h2 style={{
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              fontSize: 16, fontWeight: 500, color: "#2D4530", margin: 0,
            }}>Today&apos;s Plan</h2>
            <button style={{
              background: "transparent", border: "none", cursor: "pointer",
              fontSize: 12, color: "#3D5C3E", fontFamily: "inherit", fontWeight: 500,
              display: "inline-flex", alignItems: "center", gap: 4,
            }}>
              Edit
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
            </button>
          </div>
          {PLAN_ITEMS.map((item, i) => {
            const st = STATUS_STYLE[item.status] || STATUS_STYLE.Upcoming;
            const done = item.status === "Completed";
            return (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: i < PLAN_ITEMS.length - 1 ? 14 : 0 }}>
                {/* Time + check */}
                <div style={{ width: 54, flexShrink: 0, textAlign: "right" }}>
                  <span style={{ fontSize: 11, color: "#9DA89D" }}>{item.time}</span>
                </div>
                {/* Connector */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: "50%",
                    background: done ? "#3D5C3E" : "#EAE3D2",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    border: done ? "none" : "1.5px solid #D7CFC0",
                  }}>
                    {done && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5"><polyline points="20 6 9 17 4 12" /></svg>}
                  </div>
                  {i < PLAN_ITEMS.length - 1 && (
                    <div style={{ width: 1, flex: 1, minHeight: 14, background: "#EAE3D2", marginTop: 4 }} />
                  )}
                </div>
                {/* Content */}
                <div style={{ flex: 1, paddingBottom: 4 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: "50%", background: "#F0EDE0",
                          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13,
                        }}>
                          {item.icon}
                        </div>
                        <div style={{ fontSize: 13.5, fontWeight: 500, color: "#2D4530" }}>{item.title}</div>
                      </div>
                      <div style={{ fontSize: 11.5, color: "#9DA89D", marginTop: 3, marginLeft: 36 }}>{item.sub}</div>
                    </div>
                    <div style={{
                      padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 500,
                      background: st.bg, color: st.color, flexShrink: 0, whiteSpace: "nowrap",
                    }}>
                      {item.status}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mind/Body/Nutrition quick cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {[
            { icon: "🧘", title: "Mind", desc: "Find calm and reduce stress." },
            { icon: "🏃", title: "Body", desc: "Stay active and build strength." },
            { icon: "🥗", title: "Nutrition", desc: "Fuel your body the right way." },
          ].map(card => (
            <div key={card.title} style={{
              background: "#FFFFFF", borderRadius: 16, padding: "14px 12px",
              boxShadow: "0 1px 6px rgba(31,46,31,0.05)",
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%", background: "#F0EDE0",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, marginBottom: 8,
              }}>
                {card.icon}
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#2D4530", marginBottom: 4 }}>{card.title}</div>
              <div style={{ fontSize: 11, color: "#9DA89D", lineHeight: 1.4, marginBottom: 8 }}>{card.desc}</div>
              <button style={{
                background: "transparent", border: "none", cursor: "pointer",
                fontSize: 11.5, color: "#3D5C3E", fontFamily: "inherit", fontWeight: 500,
                padding: 0, display: "inline-flex", alignItems: "center", gap: 3,
              }}>
                Explore
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
              </button>
            </div>
          ))}
        </div>

        {/* Quote banner */}
        <div style={{
          background: "#FFFFFF", borderRadius: 20, overflow: "hidden",
          boxShadow: "0 1px 8px rgba(31,46,31,0.06)", display: "flex", gap: 0,
        }}>
          <div style={{ flex: 1, padding: "18px 16px" }}>
            <svg width="16" height="12" viewBox="0 0 24 18" fill="none" style={{ marginBottom: 6 }}>
              <path d="M4 14 Q2 10 6 6 L8 8 Q6 10 7 14 Z" fill="#C4974A" opacity="0.7" />
              <path d="M14 14 Q12 10 16 6 L18 8 Q16 10 17 14 Z" fill="#C4974A" opacity="0.7" />
            </svg>
            <p style={{
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              fontSize: 14, color: "#2D4530", margin: 0, lineHeight: 1.55, fontStyle: "italic",
            }}>
              Small progress every day leads to big results.
            </p>
          </div>
          <div
            data-image-slot="quote-banner-right"
            style={{
              width: 100, background: "linear-gradient(135deg, rgba(170,185,150,0.4), rgba(200,210,180,0.3))",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <div style={{ fontSize: 28 }}>🪨</div>
          </div>
        </div>
      </div>
    </div>
  );
}
