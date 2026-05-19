"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import api from "@/lib/api";

// ─── Design tokens ────────────────────────────────────────────────────────────
const BG = "#F5EFE2";
const GREEN = "#3D5C3E";
const DARK = "#2D4530";
// const GOLD = "#C4974A" // reserved for future use;
const MUTED = "#7B8A7B";
const CARD_BG = "#FFFFFF";
const SAGE = "#E8E5D6";

// ─── Step 0: Conditions ───────────────────────────────────────────────────────
const CONDITIONS_LIST = [
  {
    id: "pcos", label: "PCOS", sub: "Hormonal balance", iconBg: "#F5D7CC",
    icon: (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="#C25E4B" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 6 L16 22" /><ellipse cx="16" cy="10" rx="5" ry="4" />
        <path d="M10 24 Q10 28 16 28 Q22 28 22 24" /><path d="M11 16 L8 18 M21 16 L24 18" />
      </svg>
    ),
  },
  {
    id: "diabetes", label: "Diabetes", sub: "Blood sugar management", iconBg: "#E2E4D2",
    icon: (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="#3D5C3E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 4 Q8 14 8 20 Q8 26 16 28 Q24 26 24 20 Q24 14 16 4 Z" />
        <path d="M14 18 L18 18 M16 16 L16 20" />
      </svg>
    ),
  },
  {
    id: "thyroid", label: "Thyroid", sub: "Thyroid support", iconBg: "#D9E0D3",
    icon: (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="#3D5C3E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 14 Q10 22 16 24 Q22 22 22 14 Q22 10 16 10 Q10 10 10 14 Z" />
        <path d="M10 14 L7 12 M22 14 L25 12" />
        <circle cx="13" cy="16" r="0.8" fill="#3D5C3E" /><circle cx="19" cy="16" r="0.8" fill="#3D5C3E" />
      </svg>
    ),
  },
  {
    id: "heart", label: "Heart Health", sub: "Heart friendly nutrition", iconBg: "#F5D7CC",
    icon: (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="#C25E4B" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 26 Q6 19 6 12 Q6 7 11 7 Q14 7 16 10 Q18 7 21 7 Q26 7 26 12 Q26 19 16 26 Z" />
        <path d="M9 16 L12 16 L14 13 L17 19 L19 16 L23 16" />
      </svg>
    ),
  },
  {
    id: "ckd", label: "Kidney Health", sub: "Renal support", iconBg: "#E2E4D2",
    icon: (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="#3D5C3E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 8 Q6 12 6 18 Q6 24 12 26 Q16 27 18 22 Q20 28 24 26 Q28 22 26 16 Q24 10 20 8 Q16 6 10 8 Z" />
      </svg>
    ),
  },
];

// ─── Step 1: Diet types ───────────────────────────────────────────────────────
const DIET_TYPES = [
  { id: "vegetarian", label: "Vegetarian", sub: "No meat or fish" },
  { id: "vegan", label: "Vegan", sub: "Plant-based only" },
  { id: "non-vegetarian", label: "Non-Vegetarian", sub: "All foods" },
  { id: "pescatarian", label: "Pescatarian", sub: "Fish, no meat" },
  { id: "gluten-free", label: "Gluten-Free", sub: "No wheat/gluten" },
  { id: "keto", label: "Keto", sub: "Low carb, high fat" },
];

// ─── Step 2: Allergies ────────────────────────────────────────────────────────
const ALLERGY_LIST = ["Dairy", "Nuts", "Gluten", "Eggs", "Shellfish", "Soy", "None"];

// ─── Step 3: Lifestyle ────────────────────────────────────────────────────────
const COOKING_LEVELS = [
  { id: "beginner", label: "Beginner", sub: "Simple recipes, <30 min" },
  { id: "intermediate", label: "Intermediate", sub: "Comfortable with most dishes" },
  { id: "advanced", label: "Advanced", sub: "Love complex cooking" },
];
const BUDGETS = [
  { id: "low", label: "Budget-Friendly", sub: "Economical ingredients" },
  { id: "medium", label: "Moderate", sub: "Balanced spending" },
  { id: "high", label: "Premium", sub: "Best quality ingredients" },
];
const GOALS_30 = [
  "Lose 2–3 kg", "Balance hormones", "Manage blood sugar", "Improve heart health",
  "Boost energy", "Better digestion", "Build strength", "Reduce inflammation",
];

// ─── Step 4: Biometrics ───────────────────────────────────────────────────────
const GENDERS = [
  { id: "female", label: "Female" },
  { id: "male", label: "Male" },
  { id: "other", label: "Other" },
];
const ACTIVITY_LEVELS = [
  { id: "sedentary", label: "Sedentary", sub: "Desk job, little exercise" },
  { id: "light", label: "Light", sub: "Light exercise 1–3 days/week" },
  { id: "moderate", label: "Moderate", sub: "Moderate exercise 3–5 days" },
  { id: "active", label: "Active", sub: "Hard exercise 6–7 days" },
  { id: "very_active", label: "Very Active", sub: "Athlete / physical job" },
];

// ─── Shared UI helpers ────────────────────────────────────────────────────────
function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div style={{ display: "flex", gap: 5, marginTop: 6 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          flex: 1, height: 3, borderRadius: 999,
          background: i <= step ? GREEN : "#D7CFC0",
          transition: "background 0.3s",
        }} />
      ))}
    </div>
  );
}

function PageHeader({ step, total, onBack, title, sub }: {
  step: number; total: number; onBack: () => void; title: string; sub: string;
}) {
  return (
    <>
      <div style={{ padding: "18px 26px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={onBack} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 4 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={DARK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: MUTED }}>
          Step {step + 1} of {total}
        </span>
      </div>
      <div style={{ padding: "0 26px 0" }}>
        <ProgressBar step={step} total={total} />
      </div>
      <div style={{ padding: "20px 28px 0" }}>
        <h1 style={{
          fontFamily: "var(--font-playfair), 'Playfair Display', serif",
          fontSize: 28, fontWeight: 500, color: DARK, lineHeight: 1.2, margin: 0,
        }}>{title}</h1>
        <p style={{ marginTop: 8, fontSize: 13.5, color: MUTED }}>{sub}</p>
      </div>
    </>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function OnboardingQuestionnaire() {
  const router = useRouter();
  const { refresh } = useAuth();

  const [step, setStep] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  // Step 0
  const [conditions, setConditions] = useState<string[]>([]);
  // Step 1
  const [dietaryType, setDietaryType] = useState("");
  // Step 2
  const [allergies, setAllergies] = useState<string[]>([]);
  // Step 3
  const [cookingAbility, setCookingAbility] = useState("");
  const [budget, setBudget] = useState("");
  const [goal30, setGoal30] = useState("");
  // Step 4
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [activityLevel, setActivityLevel] = useState("");

  const TOTAL_STEPS = 5;

  const toggleCondition = (id: string) => {
    if (id === "none") { setConditions([]); return; }
    setConditions(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  const toggleAllergy = (a: string) => {
    if (a === "None") { setAllergies([]); return; }
    setAllergies(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);
  };

  const back = () => {
    if (step === 0) router.push("/onboarding");
    else setStep(s => s - 1);
  };

  const next = () => setStep(s => s + 1);

  const submit = async () => {
    setGenerating(true);
    setError("");
    try {
      await api.post("/ai/onboarding/generate-plan", {
        conditions: conditions.length ? conditions : ["general"],
        condition_answers: {},
        dietary_type: dietaryType || "non-vegetarian",
        allergies: allergies.filter(a => a !== "None"),
        cooking_ability: cookingAbility || "intermediate",
        budget: budget || "medium",
        goal_30day: goal30 || "Feel healthier",
        age: age ? parseInt(age) : undefined,
        gender: gender || undefined,
        weight_kg: weightKg ? parseFloat(weightKg) : undefined,
        height_cm: heightCm ? parseFloat(heightCm) : undefined,
        activity_level: activityLevel || undefined,
      });
      await refresh();
      router.push("/app");
    } catch (e: any) {
      setError(e?.response?.data?.detail || "Something went wrong. Please try again.");
      setGenerating(false);
    }
  };

  const wrap = (children: React.ReactNode) => (
    <div style={{
      minHeight: "100vh", background: BG,
      fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
      display: "flex", justifyContent: "center",
    }}>
      <div style={{
        width: "100%", maxWidth: 440, minHeight: "100vh", background: BG,
        display: "flex", flexDirection: "column",
      }}>
        {children}
      </div>
    </div>
  );

  // ── Generating screen ──────────────────────────────────────────────────────
  if (generating) {
    return wrap(
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 28px" }}>
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" style={{ marginBottom: 24 }}>
          <path d="M32 8 Q32 28 32 16" stroke={GREEN} strokeWidth="3" strokeLinecap="round">
            <animateTransform attributeName="transform" type="rotate" from="0 32 32" to="360 32 32" dur="2s" repeatCount="indefinite" />
          </path>
          <path d="M32 24 Q22 20 20 10 Q30 14 32 22 Z" fill={GREEN} fillOpacity="0.7" />
          <path d="M32 24 Q42 20 44 10 Q34 14 32 22 Z" fill={GREEN} />
          <path d="M20 44 L44 44 Q44 56 32 58 Q20 56 20 44 Z" fill={GREEN} opacity="0.9" />
          <ellipse cx="32" cy="44" rx="12" ry="2.5" fill={DARK} />
        </svg>
        <h2 style={{
          fontFamily: "var(--font-playfair), 'Playfair Display', serif",
          fontSize: 24, fontWeight: 500, color: DARK, textAlign: "center", margin: "0 0 10px",
        }}>
          Crafting your plan
        </h2>
        <p style={{ fontSize: 14, color: MUTED, textAlign: "center", lineHeight: 1.6 }}>
          We&apos;re personalizing your nutrition journey based on your goals and health conditions.
        </p>
        {error && (
          <div style={{ marginTop: 20, padding: "12px 16px", background: "#FDECEA", borderRadius: 12, fontSize: 13, color: "#C0392B", textAlign: "center" }}>
            {error}
            <br />
            <button onClick={submit} style={{ marginTop: 8, background: GREEN, color: "#fff", border: "none", borderRadius: 999, padding: "8px 20px", fontSize: 13, cursor: "pointer" }}>
              Try Again
            </button>
          </div>
        )}
      </div>
    );
  }

  // ── Step 0: Conditions ─────────────────────────────────────────────────────
  if (step === 0) {
    return wrap(
      <>
        <PageHeader step={0} total={TOTAL_STEPS} onBack={back} title="Tell us about you" sub="Select all that apply — we'll personalize your plan" />
        <div style={{ padding: "22px 20px 14px", display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
          {CONDITIONS_LIST.map(c => {
            const active = conditions.includes(c.id);
            return (
              <button key={c.id} onClick={() => toggleCondition(c.id)} style={{
                display: "flex", alignItems: "center", gap: 14,
                background: CARD_BG, border: active ? `1.5px solid ${GREEN}` : "1px solid #EAE3D2",
                borderRadius: 16, padding: "12px 14px", cursor: "pointer", width: "100%",
                textAlign: "left", fontFamily: "inherit", transition: "border-color 0.2s",
                boxShadow: "0 1px 6px rgba(31,46,31,0.04)",
              }}>
                <div style={{
                  width: 46, height: 46, borderRadius: "50%", background: c.iconBg,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  {c.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontSize: 16, fontWeight: 500, color: DARK }}>{c.label}</div>
                  <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{c.sub}</div>
                </div>
                <div style={{
                  width: 20, height: 20, borderRadius: "50%",
                  border: active ? `2px solid ${GREEN}` : "1.5px solid #D7CFC0",
                  background: active ? GREEN : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  {active && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>}
                </div>
              </button>
            );
          })}
          <button onClick={() => toggleCondition("other")} style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            background: SAGE, border: conditions.includes("other") ? `1.5px solid ${GREEN}` : "1px solid transparent",
            borderRadius: 999, padding: "12px 20px", cursor: "pointer",
            fontFamily: "inherit", fontSize: 14, color: GREEN, fontWeight: 500, marginTop: 4,
          }}>
            Other Condition
          </button>
        </div>
        <div style={{ padding: "16px 20px 28px" }}>
          <button onClick={next} style={{
            width: "100%", background: GREEN, color: "#fff", border: "none",
            borderRadius: 999, padding: "16px 24px", fontSize: 15, fontWeight: 500,
            fontFamily: "inherit", cursor: "pointer", boxShadow: "0 8px 22px rgba(61,92,62,0.25)",
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10,
          }}>
            Continue
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        </div>
      </>
    );
  }

  // ── Step 1: Diet type ──────────────────────────────────────────────────────
  if (step === 1) {
    return wrap(
      <>
        <PageHeader step={1} total={TOTAL_STEPS} onBack={back} title="Your food preference" sub="Choose what best describes your diet" />
        <div style={{ padding: "22px 20px 14px", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
          {DIET_TYPES.map(d => {
            const active = dietaryType === d.id;
            return (
              <button key={d.id} onClick={() => setDietaryType(d.id)} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: active ? "rgba(61,92,62,0.06)" : CARD_BG,
                border: active ? `1.5px solid ${GREEN}` : "1px solid #EAE3D2",
                borderRadius: 14, padding: "14px 16px", cursor: "pointer", width: "100%",
                textAlign: "left", fontFamily: "inherit", transition: "all 0.2s",
              }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 500, color: DARK }}>{d.label}</div>
                  <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{d.sub}</div>
                </div>
                <div style={{
                  width: 20, height: 20, borderRadius: "50%",
                  border: active ? `2px solid ${GREEN}` : "1.5px solid #D7CFC0",
                  background: active ? GREEN : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  {active && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>}
                </div>
              </button>
            );
          })}
        </div>
        <div style={{ padding: "16px 20px 28px" }}>
          <button onClick={next} disabled={!dietaryType} style={{
            width: "100%", background: dietaryType ? GREEN : "#C8D4C8", color: "#fff", border: "none",
            borderRadius: 999, padding: "16px 24px", fontSize: 15, fontWeight: 500,
            fontFamily: "inherit", cursor: dietaryType ? "pointer" : "default",
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10,
          }}>
            Continue
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        </div>
      </>
    );
  }

  // ── Step 2: Allergies ──────────────────────────────────────────────────────
  if (step === 2) {
    return wrap(
      <>
        <PageHeader step={2} total={TOTAL_STEPS} onBack={back} title="Any food allergies?" sub="We'll make sure to exclude them from your recipes" />
        <div style={{ padding: "22px 20px 14px", flex: 1 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {ALLERGY_LIST.map(a => {
              const isNone = a === "None";
              const active = isNone ? allergies.length === 0 : allergies.includes(a);
              return (
                <button key={a} onClick={() => toggleAllergy(a)} style={{
                  padding: "10px 18px", borderRadius: 999,
                  background: active ? GREEN : CARD_BG,
                  border: active ? `1.5px solid ${GREEN}` : "1px solid #EAE3D2",
                  color: active ? "#fff" : DARK,
                  fontSize: 14, fontWeight: active ? 500 : 400, fontFamily: "inherit",
                  cursor: "pointer", transition: "all 0.2s",
                }}>
                  {a}
                </button>
              );
            })}
          </div>
          <p style={{ marginTop: 20, fontSize: 12, color: MUTED, lineHeight: 1.5 }}>
            Tap all that apply. We&apos;ll ensure your recipes are always safe for you.
          </p>
        </div>
        <div style={{ padding: "16px 20px 28px" }}>
          <button onClick={next} style={{
            width: "100%", background: GREEN, color: "#fff", border: "none",
            borderRadius: 999, padding: "16px 24px", fontSize: 15, fontWeight: 500,
            fontFamily: "inherit", cursor: "pointer", boxShadow: "0 8px 22px rgba(61,92,62,0.25)",
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10,
          }}>
            Continue
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        </div>
      </>
    );
  }

  // ── Step 3: Lifestyle ──────────────────────────────────────────────────────
  if (step === 3) {
    return wrap(
      <>
        <PageHeader step={3} total={TOTAL_STEPS} onBack={back} title="Your lifestyle" sub="Help us find recipes that fit your daily life" />
        <div style={{ padding: "18px 20px 14px", flex: 1, overflowY: "auto" }}>
          {/* Cooking ability */}
          <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED, margin: "0 0 10px" }}>Cooking Comfort</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
            {COOKING_LEVELS.map(c => {
              const active = cookingAbility === c.id;
              return (
                <button key={c.id} onClick={() => setCookingAbility(c.id)} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: active ? "rgba(61,92,62,0.06)" : CARD_BG,
                  border: active ? `1.5px solid ${GREEN}` : "1px solid #EAE3D2",
                  borderRadius: 12, padding: "12px 14px", cursor: "pointer",
                  width: "100%", textAlign: "left", fontFamily: "inherit",
                }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: DARK }}>{c.label}</div>
                    <div style={{ fontSize: 11.5, color: MUTED, marginTop: 1 }}>{c.sub}</div>
                  </div>
                  <div style={{
                    width: 18, height: 18, borderRadius: "50%",
                    border: active ? `2px solid ${GREEN}` : "1.5px solid #D7CFC0",
                    background: active ? GREEN : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    {active && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5"><polyline points="20 6 9 17 4 12" /></svg>}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Budget */}
          <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED, margin: "0 0 10px" }}>Budget</p>
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            {BUDGETS.map(b => {
              const active = budget === b.id;
              return (
                <button key={b.id} onClick={() => setBudget(b.id)} style={{
                  flex: 1, padding: "10px 8px", borderRadius: 12, textAlign: "center",
                  background: active ? GREEN : CARD_BG,
                  border: active ? `1.5px solid ${GREEN}` : "1px solid #EAE3D2",
                  color: active ? "#fff" : DARK,
                  fontSize: 13, fontWeight: active ? 500 : 400, fontFamily: "inherit", cursor: "pointer",
                }}>
                  {b.label.split(" ")[0]}
                </button>
              );
            })}
          </div>

          {/* 30-day goal */}
          <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED, margin: "0 0 10px" }}>30-Day Goal</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {GOALS_30.map(g => {
              const active = goal30 === g;
              return (
                <button key={g} onClick={() => setGoal30(g)} style={{
                  padding: "8px 14px", borderRadius: 999,
                  background: active ? GREEN : CARD_BG,
                  border: active ? `1.5px solid ${GREEN}` : "1px solid #EAE3D2",
                  color: active ? "#fff" : DARK,
                  fontSize: 13, fontFamily: "inherit", cursor: "pointer", transition: "all 0.2s",
                }}>
                  {g}
                </button>
              );
            })}
          </div>
        </div>
        <div style={{ padding: "16px 20px 28px" }}>
          <button onClick={next} disabled={!cookingAbility || !budget || !goal30} style={{
            width: "100%", background: (cookingAbility && budget && goal30) ? GREEN : "#C8D4C8",
            color: "#fff", border: "none", borderRadius: 999, padding: "16px 24px",
            fontSize: 15, fontWeight: 500, fontFamily: "inherit",
            cursor: (cookingAbility && budget && goal30) ? "pointer" : "default",
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10,
          }}>
            Continue
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        </div>
      </>
    );
  }

  // ── Step 4: Biometrics ─────────────────────────────────────────────────────
  return wrap(
    <>
      <PageHeader step={4} total={TOTAL_STEPS} onBack={back} title="A little about you" sub="Helps us calculate your ideal nutrition targets" />
      <div style={{ padding: "18px 20px 14px", flex: 1, overflowY: "auto" }}>
        {/* Gender */}
        <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED, margin: "0 0 10px" }}>Gender</p>
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {GENDERS.map(g => {
            const active = gender === g.id;
            return (
              <button key={g.id} onClick={() => setGender(g.id)} style={{
                flex: 1, padding: "10px 8px", borderRadius: 12, textAlign: "center",
                background: active ? GREEN : CARD_BG,
                border: active ? `1.5px solid ${GREEN}` : "1px solid #EAE3D2",
                color: active ? "#fff" : DARK,
                fontSize: 13, fontWeight: active ? 500 : 400, fontFamily: "inherit", cursor: "pointer",
              }}>
                {g.label}
              </button>
            );
          })}
        </div>

        {/* Age + Weight + Height */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
          {[
            { label: "Age", placeholder: "25", value: age, onChange: setAge, unit: "yrs" },
            { label: "Weight", placeholder: "65", value: weightKg, onChange: setWeightKg, unit: "kg" },
            { label: "Height", placeholder: "165", value: heightCm, onChange: setHeightCm, unit: "cm" },
          ].map(f => (
            <div key={f.label}>
              <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: MUTED, margin: "0 0 6px" }}>{f.label}</p>
              <div style={{ position: "relative" }}>
                <input
                  type="number" inputMode="numeric" placeholder={f.placeholder}
                  value={f.value} onChange={e => f.onChange(e.target.value)}
                  style={{
                    width: "100%", padding: "10px 10px", border: "1px solid #EAE3D2",
                    borderRadius: 10, fontSize: 14, color: DARK, background: CARD_BG,
                    fontFamily: "inherit", outline: "none", boxSizing: "border-box",
                  }}
                />
                <span style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", fontSize: 10, color: MUTED }}>{f.unit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Activity level */}
        <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED, margin: "0 0 10px" }}>Activity Level</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {ACTIVITY_LEVELS.map(a => {
            const active = activityLevel === a.id;
            return (
              <button key={a.id} onClick={() => setActivityLevel(a.id)} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: active ? "rgba(61,92,62,0.06)" : CARD_BG,
                border: active ? `1.5px solid ${GREEN}` : "1px solid #EAE3D2",
                borderRadius: 12, padding: "10px 14px", cursor: "pointer",
                width: "100%", textAlign: "left", fontFamily: "inherit",
              }}>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 500, color: DARK }}>{a.label}</div>
                  <div style={{ fontSize: 11, color: MUTED, marginTop: 1 }}>{a.sub}</div>
                </div>
                <div style={{
                  width: 18, height: 18, borderRadius: "50%",
                  border: active ? `2px solid ${GREEN}` : "1.5px solid #D7CFC0",
                  background: active ? GREEN : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  {active && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5"><polyline points="20 6 9 17 4 12" /></svg>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Privacy notice */}
      <div style={{ padding: "10px 28px 0", display: "flex", alignItems: "center", gap: 6 }}>
        <svg width="13" height="14" viewBox="0 0 14 16" fill="none" stroke={MUTED} strokeWidth="1.4">
          <path d="M7 1 L12 3 V8 Q12 12 7 15 Q2 12 2 8 V3 Z" fill="none" />
          <path d="M5 8 L7 10 L10 6" />
        </svg>
        <span style={{ fontSize: 12, color: MUTED }}>Your data is private and never shared</span>
      </div>

      <div style={{ padding: "14px 20px 28px" }}>
        <button onClick={submit} style={{
          width: "100%", background: GREEN, color: "#fff", border: "none",
          borderRadius: 999, padding: "16px 24px", fontSize: 15, fontWeight: 500,
          fontFamily: "inherit", cursor: "pointer", boxShadow: "0 8px 22px rgba(61,92,62,0.25)",
          display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10,
        }}>
          Create My Plan
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
        </button>
      </div>
    </>
  );
}
