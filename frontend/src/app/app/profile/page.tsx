"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import api from "@/lib/api";
import Link from "next/link";

const inp: React.CSSProperties = {
  width: "100%", padding: "0.7rem 0.9rem", border: "1.5px solid #E0D8CC",
  borderRadius: "0.65rem", fontSize: "0.88rem", color: "#1F2E1F",
  fontFamily: "'DM Sans', sans-serif", background: "#FDFAF6", outline: "none",
};

const sel: React.CSSProperties = {
  ...inp, appearance: "none", WebkitAppearance: "none", cursor: "pointer",
};

const SETTINGS_ROWS = [
  { icon: "🎯", label: "My Goals", desc: "View and update your health goals", href: null },
  { icon: "👤", label: "Personal Information", desc: "Manage your basic details", href: null },
  { icon: "🍽️", label: "Dietary Preferences", desc: "Allergies, dislikes, food choices", href: null },
  { icon: "❤️", label: "Health Conditions", desc: "PCOS, Diabetes, Thyroid, and more", href: null },
  { icon: "🛒", label: "Grocery List", desc: "View this week's list", href: "/app/grocery" },
  { icon: "📊", label: "Progress & Journey", desc: "Weight, streaks, nutrient tracking", href: "/app/progress" },
  { icon: "🔔", label: "Notifications", desc: "Manage reminders and alerts", href: null },
  { icon: "🔒", label: "Privacy & Security", desc: "Manage your data and privacy", href: null },
  { icon: "💬", label: "Help & Support", desc: "FAQs, chat with support", href: null },
  { icon: "🌿", label: "About ZenPlate", desc: "App version, terms and policies", href: null },
];

export default function Profile() {
  const { user, refresh, logout } = useAuth();
  const [form, setForm] = useState<any>({});
  const [busy, setBusy] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (user) setForm({
      name: user.name || "",
      age: user.age || "", gender: user.gender || "male",
      weight_kg: user.weight_kg || "", height_cm: user.height_cm || "",
      activity_level: user.activity_level || "moderate",
      cooking_ability: user.cooking_ability || "intermediate",
      budget: user.budget || "medium",
      location: user.location || "",
    });
  }, [user]);

  const save = async () => {
    setBusy(true);
    try {
      const payload = { ...form };
      ["age", "weight_kg", "height_cm"].forEach((k) => {
        if (payload[k] !== "" && payload[k] != null) payload[k] = Number(payload[k]);
        else delete payload[k];
      });
      await api.put("/user/profile", payload);
      await refresh();
      toast.success("Profile saved");
      setExpanded(false);
    } catch { toast.error("Save failed"); }
    finally { setBusy(false); }
  };

  const setVal = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  if (!user) return null;

  const firstName = user.name?.split(" ")[0] || "Friend";

  return (
    <div style={{ minHeight: "100vh", background: "#FAF7F0", paddingBottom: "6rem" }}>
      {/* Header */}
      <div style={{ position: "relative", background: "linear-gradient(180deg, #F0EBE0 0%, #FAF7F0 100%)", padding: "2.5rem 1.25rem 1.25rem", overflow: "hidden" }}>
        {/* Botanical leaf */}
        <svg style={{ position: "absolute", top: -10, right: -10, width: 130, height: 130, opacity: 0.3 }} viewBox="0 0 130 130" fill="none">
          <ellipse cx="90" cy="30" rx="28" ry="48" fill="#3D5C3E" transform="rotate(-30 90 30)"/>
          <ellipse cx="110" cy="70" rx="20" ry="36" fill="#3D5C3E" opacity="0.6" transform="rotate(10 110 70)"/>
          <line x1="90" y1="30" x2="65" y2="110" stroke="#5A7A5B" strokeWidth="1.5" opacity="0.4"/>
        </svg>
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <Link href="/app" style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.7)", border: "1px solid #E5DDD0", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3D5C3E" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            </Link>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.7)", border: "1px solid #E5DDD0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3D5C3E" strokeWidth="1.8"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>
              </button>
              <button onClick={logout} style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.7)", border: "1px solid #E5DDD0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#C4974A" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
              </button>
            </div>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.7rem", fontWeight: 400, color: "#1F2E1F", margin: "0 0 0.2rem" }}>Profile & Settings</h1>
          <p style={{ fontSize: "0.8rem", color: "#8D9E8D", margin: 0 }}>Manage your journey, preferences and app experience.</p>
        </div>
      </div>

      <div style={{ padding: "1rem 1.25rem 0", maxWidth: 480, margin: "0 auto", display: "flex", flexDirection: "column", gap: "1rem" }}>

        {/* User card */}
        <div style={{ background: "#FFFFFF", borderRadius: "1.25rem", border: "1px solid #E5DDD0", padding: "1.25rem", boxShadow: "0 2px 12px rgba(61,92,62,0.06)", display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ position: "relative" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", overflow: "hidden", border: "2.5px solid #3D5C3E" }}>
              <img src={`https://i.pravatar.cc/128?u=${user.email}`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            </div>
            <button onClick={() => setExpanded(true)} style={{ position: "absolute", bottom: -2, right: -2, width: 22, height: 22, borderRadius: "50%", background: "#3D5C3E", border: "2px solid #FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: "#1F2E1F", margin: "0 0 0.15rem", fontWeight: 500 }}>{user.name || firstName}</p>
            <p style={{ fontSize: "0.72rem", color: "#8D9E8D", margin: "0 0 0.5rem" }}>Eat with intention.</p>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <span style={{ fontSize: "0.65rem", color: "#A8B8A8" }}>📅 {user.email}</span>
            </div>
          </div>
        </div>

        {/* Wellness score */}
        <div style={{ background: "#FFFFFF", borderRadius: "1.25rem", border: "1px solid #E5DDD0", padding: "1.1rem 1.25rem", boxShadow: "0 2px 12px rgba(61,92,62,0.06)", display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", border: "3px solid #3D5C3E", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: "#3D5C3E", margin: 0, lineHeight: 1 }}>86</p>
              <p style={{ fontSize: "0.45rem", color: "#8D9E8D", margin: 0 }}>/100</p>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.9rem", color: "#1F2E1F", margin: "0 0 0.15rem" }}>Your wellness score</p>
            <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
              <div style={{ flex: 1, height: 4, background: "#EAE4D8", borderRadius: 999, overflow: "hidden" }}>
                <div style={{ width: "86%", height: "100%", background: "#3D5C3E", borderRadius: 999 }} />
              </div>
            </div>
          </div>
          <span style={{ fontSize: "0.72rem", color: "#3D5C3E", fontWeight: 600, background: "rgba(61,92,62,0.08)", padding: "0.2rem 0.6rem", borderRadius: 999 }}>Great progress!</span>
        </div>

        {/* Conditions */}
        {user.conditions?.length > 0 && (
          <div style={{ background: "#FFFFFF", borderRadius: "1.25rem", border: "1px solid #E5DDD0", padding: "1.1rem 1.25rem", boxShadow: "0 2px 12px rgba(61,92,62,0.06)" }}>
            <p style={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#A8B8A8", margin: "0 0 0.75rem" }}>Health Conditions</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
              {user.conditions.map((c: string) => (
                <span key={c} style={{ padding: "0.25rem 0.75rem", borderRadius: 999, background: "rgba(61,92,62,0.08)", color: "#3D5C3E", fontSize: "0.75rem", fontWeight: 500, border: "1px solid rgba(61,92,62,0.15)" }}>{c}</span>
              ))}
            </div>
          </div>
        )}

        {/* Settings rows */}
        <div style={{ background: "#FFFFFF", borderRadius: "1.25rem", border: "1px solid #E5DDD0", overflow: "hidden", boxShadow: "0 2px 12px rgba(61,92,62,0.06)" }}>
          {SETTINGS_ROWS.map((row, i) => {
            const content = (
              <div style={{ display: "flex", alignItems: "center", gap: "0.9rem", padding: "0.9rem 1.1rem", borderBottom: i < SETTINGS_ROWS.length - 1 ? "1px solid #F0EBE0" : "none", cursor: "pointer" }}
                onClick={() => row.label === "Personal Information" ? setExpanded(!expanded) : undefined}>
                <span style={{ fontSize: "1.1rem", width: 28, textAlign: "center" }}>{row.icon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", fontWeight: 500, color: "#1F2E1F", margin: 0 }}>{row.label}</p>
                  <p style={{ fontSize: "0.72rem", color: "#A8B8A8", margin: "0.1rem 0 0" }}>{row.desc}</p>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C8D4C8" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
              </div>
            );
            return row.href ? (
              <Link key={row.label} href={row.href} style={{ textDecoration: "none", display: "block" }}>{content}</Link>
            ) : (
              <div key={row.label}>{content}</div>
            );
          })}
        </div>

        {/* Edit form — expanded inline */}
        {expanded && (
          <div style={{ background: "#FFFFFF", borderRadius: "1.25rem", border: "1.5px solid #3D5C3E", padding: "1.25rem", boxShadow: "0 4px 24px rgba(61,92,62,0.1)" }}>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: "#1F2E1F", margin: "0 0 1rem" }}>Edit Personal Information</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
              {[
                { key: "name", label: "Name", type: "text" },
                { key: "age", label: "Age", type: "number" },
                { key: "weight_kg", label: "Weight (kg)", type: "number" },
                { key: "height_cm", label: "Height (cm)", type: "number" },
                { key: "location", label: "Location", type: "text" },
              ].map(f => (
                <label key={f.key} style={{ display: "flex", flexDirection: "column", gap: "0.3rem", ...(f.key === "name" || f.key === "location" ? { gridColumn: "span 2" } : {}) }}>
                  <span style={{ fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#8D9E8D" }}>{f.label}</span>
                  <input style={inp} type={f.type} value={form[f.key] || ""} onChange={e => setVal(f.key, e.target.value)} />
                </label>
              ))}
              <label style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                <span style={{ fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#8D9E8D" }}>Gender</span>
                <select style={sel} value={form.gender} onChange={e => setVal("gender", e.target.value)}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                <span style={{ fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#8D9E8D" }}>Activity</span>
                <select style={sel} value={form.activity_level} onChange={e => setVal("activity_level", e.target.value)}>
                  <option value="sedentary">Sedentary</option>
                  <option value="light">Light</option>
                  <option value="moderate">Moderate</option>
                  <option value="active">Active</option>
                  <option value="very_active">Very active</option>
                </select>
              </label>
            </div>
            <div style={{ display: "flex", gap: "0.6rem" }}>
              <button onClick={save} disabled={busy} style={{ flex: 1, background: busy ? "#A8B8A8" : "#3D5C3E", color: "#FFFFFF", border: "none", borderRadius: 999, padding: "0.75rem", fontSize: "0.88rem", fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: busy ? "default" : "pointer" }}>
                {busy ? "Saving…" : "Save changes"}
              </button>
              <button onClick={() => setExpanded(false)} style={{ padding: "0.75rem 1.25rem", background: "transparent", border: "1.5px solid #E0D8CC", borderRadius: 999, fontSize: "0.88rem", color: "#8D9E8D", fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Bottom motivation card */}
        <div style={{ background: "linear-gradient(135deg, #F5F0E8 0%, #EDE5D8 100%)", borderRadius: "1.25rem", border: "1px solid #E5DDD0", padding: "1.25rem", display: "flex", alignItems: "center", gap: "1rem", position: "relative", overflow: "hidden" }}>
          <svg style={{ position: "absolute", right: -10, bottom: -10, opacity: 0.15 }} width="80" height="80" viewBox="0 0 24 24" fill="#3D5C3E">
            <path d="M17 8C8 10 5.9 16.17 3.82 22c3.5-5 9-7 13.18-7 0-3.17-1.5-6.17-4-8z"/>
          </svg>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(61,92,62,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontSize: "1.2rem" }}>🌿</span>
          </div>
          <div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.95rem", color: "#1F2E1F", margin: "0 0 0.15rem" }}>You're doing amazing, {firstName}!</p>
            <p style={{ fontSize: "0.75rem", color: "#7D8E7D", margin: "0 0 0.5rem" }}>Small choices, big transformation.</p>
            <Link href="/app/progress" style={{ fontSize: "0.72rem", color: "#3D5C3E", fontWeight: 600, textDecoration: "none" }}>Continue your journey →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
