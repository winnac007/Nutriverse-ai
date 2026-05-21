"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import api from "@/lib/api";
import Link from "next/link";

const SETTINGS_ROWS = [
  { icon: GoalIcon, label: "My Goals", desc: "View and update your health goals", href: null },
  { icon: PersonIcon, label: "Personal Information", desc: "Manage your basic details", href: null },
  { icon: DietIcon, label: "Dietary Preferences", desc: "Allergies, dislikes, food choices", href: null },
  { icon: HeartIcon, label: "Health Conditions", desc: "PCOS, Diabetes, Thyroid, and more", href: null },
  { icon: BellIcon, label: "Notifications", desc: "Manage reminders and alerts", href: null },
  { icon: LockIcon, label: "Privacy & Security", desc: "Manage your data and privacy", href: null },
  { icon: HelpIcon, label: "Help & Support", desc: "FAQs, chat with support", href: null },
  { icon: InfoIcon, label: "About ZenPlate", desc: "App version, terms and policies", href: null },
];

function GoalIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5A7A5B" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>;
}
function PersonIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5A7A5B" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></svg>;
}
function DietIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5A7A5B" strokeWidth="1.8" strokeLinecap="round"><path d="M3 11h18M3 17h18M3 5h18M12 5v16" /></svg>;
}
function HeartIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5A7A5B" strokeWidth="1.8" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>;
}
function BellIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5A7A5B" strokeWidth="1.8" strokeLinecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" /></svg>;
}
function LockIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5A7A5B" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>;
}
function HelpIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5A7A5B" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" /></svg>;
}
function InfoIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5A7A5B" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>;
}

export default function Profile() {
  const { user, refresh, logout } = useAuth();
  const router = useRouter();
  const [streak, setStreak] = useState(0);
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({ name: "", age: "", weight_kg: "", height_cm: "", activity_level: "moderate" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        age: user.age ? String(user.age) : "",
        weight_kg: user.weight_kg ? String(user.weight_kg) : "",
        height_cm: user.height_cm ? String(user.height_cm) : "",
        activity_level: user.activity_level || "moderate",
      });
    }
    api.get("/healthcare/streak").then(r => setStreak(r.data?.current_streak_days ?? 0)).catch(() => {});
  }, [user]);

  const save = async () => {
    setSaving(true);
    try {
      const payload: any = { name: form.name, activity_level: form.activity_level };
      if (form.age) payload.age = parseInt(form.age);
      if (form.weight_kg) payload.weight_kg = parseFloat(form.weight_kg);
      if (form.height_cm) payload.height_cm = parseFloat(form.height_cm);
      await api.put("/user/profile", payload);
      await refresh();
      toast.success("Profile saved");
      setEditOpen(false);
    } catch {
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/auth");
  };

  const firstName = user?.name?.split(" ")[0] || "Friend";
  const joinedDate = "May 2024"; // Would come from created_at field
  const wellnessScore = Math.min(100, 35 + Math.min(40, streak * 3) + 25);

  return (
    <div style={{
      minHeight: "100vh", background: "#F5EFE2",
      fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
    }}>
      {/* Header */}
      <div style={{ position: "relative", padding: "18px 20px 0", overflow: "hidden" }}>
        {/* Vase/botanical image slot top-right */}
        <div
          data-image-slot="profile-botanical-top-right"
          style={{
            position: "absolute", top: 0, right: 0, width: 160, height: 180,
            pointerEvents: "none", opacity: 0.6,
            background: "radial-gradient(ellipse at 30% 60%, rgba(160,180,140,0.4), transparent 65%)",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 2 }}>
          <button
            onClick={() => window.history.back()}
            style={{ background: "transparent", border: "none", cursor: "pointer", padding: 4 }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2D4530" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
          <div style={{ display: "flex", gap: 10 }}>
            <button style={{ background: "transparent", border: "none", cursor: "pointer", padding: 4 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2D4530" strokeWidth="1.8" strokeLinecap="round">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
              </svg>
            </button>
            <button style={{ background: "transparent", border: "none", cursor: "pointer", padding: 4 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2D4530" strokeWidth="1.8" strokeLinecap="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            </button>
          </div>
        </div>
        <div style={{ position: "relative", zIndex: 2, marginTop: 12 }}>
          <h1 style={{
            fontFamily: "var(--font-playfair), 'Playfair Display', serif",
            fontSize: 28, fontWeight: 500, color: "#2D4530", margin: 0,
            display: "inline-flex", alignItems: "center", gap: 8,
          }}>
            Profile &amp; Settings
            <svg width="18" height="14" viewBox="0 0 24 18" fill="none">
              <path d="M12 16 Q4 12 6 4 Q12 8 12 16 Z" fill="#C4974A" opacity="0.85" />
              <path d="M12 16 Q20 12 18 4 Q12 8 12 16 Z" fill="#C4974A" opacity="0.85" />
            </svg>
          </h1>
          <p style={{ fontSize: 13, color: "#7B8A7B", margin: "6px 0 0", lineHeight: 1.5 }}>
            Manage your journey, preferences and app experience.
          </p>
        </div>
      </div>

      <div style={{ padding: "18px 20px 0", display: "flex", flexDirection: "column", gap: 14 }}>
        {/* User card */}
        <div style={{
          background: "#FFFFFF", borderRadius: 20, padding: "18px",
          boxShadow: "0 1px 8px rgba(31,46,31,0.06)",
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
            {/* Avatar */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{
                width: 68, height: 68, borderRadius: "50%",
                background: "linear-gradient(135deg, #D9E0D3, #C8D4C8)",
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "3px solid #fff", boxShadow: "0 2px 10px rgba(61,92,62,0.15)",
                fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                fontSize: 24, fontWeight: 500, color: "#3D5C3E",
              }}>
                {firstName[0]?.toUpperCase()}
              </div>
              <button
                onClick={() => setEditOpen(true)}
                style={{
                  position: "absolute", bottom: -2, right: -2,
                  width: 22, height: 22, borderRadius: "50%",
                  background: "#3D5C3E", border: "2px solid #fff",
                  display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
            </div>
            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 style={{
                fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                fontSize: 20, fontWeight: 500, color: "#2D4530", margin: "0 0 2px",
              }}>{user?.name || "Loading…"}</h2>
              <p style={{ fontSize: 12.5, color: "#7B8A7B", fontStyle: "italic", margin: "0 0 8px" }}>Eat with intention.</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, color: "#9DA89D" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
                  </svg>
                  Joined {joinedDate}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, color: "#9DA89D" }}>
                  <svg width="12" height="12" viewBox="0 0 24 18" fill="none">
                    <path d="M12 16 Q4 12 6 4 Q12 8 12 16 Z" fill="#3D5C3E" opacity="0.7" />
                    <path d="M12 16 Q20 12 18 4 Q12 8 12 16 Z" fill="#3D5C3E" opacity="0.7" />
                  </svg>
                  ZenStreak {streak} days
                </div>
              </div>
            </div>
          </div>

          {/* Wellness score row */}
          <div style={{
            marginTop: 14, background: "#F5F0E8", borderRadius: 12,
            padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%", background: "#E8F0E8",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="14" height="14" viewBox="0 0 24 18" fill="none">
                  <path d="M12 16 Q4 12 6 4 Q12 8 12 16 Z" fill="#3D5C3E" opacity="0.85" />
                  <path d="M12 16 Q20 12 18 4 Q12 8 12 16 Z" fill="#3D5C3E" opacity="0.85" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 10.5, color: "#9DA89D", letterSpacing: "0.08em", textTransform: "uppercase" }}>Your wellness score</div>
                <div style={{
                  fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                  fontSize: 20, fontWeight: 500, color: "#2D4530",
                }}>
                  {wellnessScore}<span style={{ fontSize: 12, color: "#9DA89D" }}>/100</span>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 13, color: "#3D5C3E", fontWeight: 500 }}>Great progress!</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3D5C3E" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
            </div>
          </div>
        </div>

        {/* Settings rows */}
        <div style={{ background: "#FFFFFF", borderRadius: 20, overflow: "hidden", boxShadow: "0 1px 8px rgba(31,46,31,0.06)" }}>
          {SETTINGS_ROWS.map((row, i) => {
            const Icon = row.icon;
            const content = (
              <div style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "14px 16px",
                borderBottom: i < SETTINGS_ROWS.length - 1 ? "1px solid #F5F0E8" : "none",
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%", background: "#F5F0E8",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <Icon />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "#2D4530" }}>{row.label}</div>
                  <div style={{ fontSize: 11.5, color: "#9DA89D", marginTop: 1 }}>{row.desc}</div>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D7CFC0" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
              </div>
            );
            return row.href ? (
              <Link key={i} href={row.href} style={{ textDecoration: "none", display: "block" }}>{content}</Link>
            ) : (
              <button key={i} style={{ width: "100%", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}>
                {content}
              </button>
            );
          })}
        </div>

        {/* Encouragement banner */}
        <div style={{
          background: "#FFFFFF", borderRadius: 20, overflow: "hidden",
          boxShadow: "0 1px 6px rgba(31,46,31,0.05)", display: "flex",
        }}>
          <div style={{ padding: "18px 16px", flex: 1 }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%", background: "#E8F0E8",
              display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10,
            }}>
              <svg width="16" height="16" viewBox="0 0 24 18" fill="none">
                <path d="M12 16 Q4 12 6 4 Q12 8 12 16 Z" fill="#3D5C3E" opacity="0.85" />
                <path d="M12 16 Q20 12 18 4 Q12 8 12 16 Z" fill="#3D5C3E" opacity="0.85" />
              </svg>
            </div>
            <p style={{
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              fontSize: 15, color: "#2D4530", margin: "0 0 4px",
            }}>
              You&apos;re doing amazing, {firstName}!
            </p>
            <p style={{ fontSize: 12, color: "#7B8A7B", margin: "0 0 10px", lineHeight: 1.4 }}>
              Small choices, big transformation.
            </p>
            <button style={{
              background: "transparent", border: "none", cursor: "pointer",
              fontSize: 12.5, color: "#3D5C3E", fontFamily: "inherit", fontWeight: 500,
              padding: 0, display: "inline-flex", alignItems: "center", gap: 4,
            }}>
              Continue your journey →
            </button>
          </div>
          <div
            data-image-slot="profile-banner-right"
            style={{
              width: 110, background: "linear-gradient(135deg, rgba(170,185,150,0.4), rgba(200,210,180,0.3))",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <div style={{ fontSize: 36 }}>🏯</div>
          </div>
        </div>

        {/* Sign out */}
        <button onClick={handleLogout} style={{
          width: "100%", background: "transparent", border: "1.5px solid #EAE3D2",
          borderRadius: 999, padding: "14px 24px", fontSize: 14, color: "#C25E4B",
          fontFamily: "inherit", cursor: "pointer", fontWeight: 500,
        }}>
          Sign Out
        </button>
      </div>

      {/* Edit modal */}
      {editOpen && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 100,
          display: "flex", alignItems: "flex-end", justifyContent: "center",
        }}>
          <div style={{
            background: "#F5EFE2", borderTopLeftRadius: 28, borderTopRightRadius: 28,
            padding: "24px 20px 36px", width: "100%", maxWidth: 440,
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{
                fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                fontSize: 20, color: "#2D4530", margin: 0,
              }}>Edit Profile</h2>
              <button onClick={() => setEditOpen(false)} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 4 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2D4530" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "Name", key: "name", type: "text", placeholder: "Your name" },
                { label: "Age", key: "age", type: "number", placeholder: "25" },
                { label: "Weight (kg)", key: "weight_kg", type: "number", placeholder: "65" },
                { label: "Height (cm)", key: "height_cm", type: "number", placeholder: "165" },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7B8A7B", display: "block", marginBottom: 5 }}>{f.label}</label>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    value={(form as any)[f.key]}
                    onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    style={{
                      width: "100%", padding: "11px 14px", border: "1px solid #EAE3D2",
                      borderRadius: 12, fontSize: 14, color: "#2D4530", background: "#FFFFFF",
                      fontFamily: "inherit", outline: "none", boxSizing: "border-box",
                    }}
                  />
                </div>
              ))}
            </div>
            <button onClick={save} disabled={saving} style={{
              marginTop: 20, width: "100%", background: saving ? "#A8B8A8" : "#3D5C3E",
              color: "#fff", border: "none", borderRadius: 999, padding: "15px 24px",
              fontSize: 15, fontWeight: 500, fontFamily: "inherit", cursor: saving ? "default" : "pointer",
            }}>
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
