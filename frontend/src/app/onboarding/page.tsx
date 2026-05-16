"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";

// ── PERSONAS ──────────────────────────────────────────────────────────────────
const PERSONAS = {
  diseased: {
    id: "diseased", name: "The Healer", tagline: "Your food is your medicine.",
    description: "Managing a condition with intention", icon: "🌿",
    theme: {
      bg: "linear-gradient(160deg,#0d1a14 0%,#0a1510 50%,#0f1e17 100%)",
      glow: "rgba(134,196,147,0.07)", accent: "#86c493",
      accentSoft: "rgba(134,196,147,0.12)", text: "#e8f5eb",
      textMuted: "rgba(232,245,235,0.5)", textDim: "rgba(232,245,235,0.22)",
      card: "rgba(255,255,255,0.035)", cardBorder: "rgba(134,196,147,0.18)",
      selBg: "rgba(134,196,147,0.13)", selBorder: "rgba(134,196,147,0.6)",
    },
  },
  preventer: {
    id: "preventer", name: "The Guardian", tagline: "Stay ahead. Stay well.",
    description: "Protecting your future self", icon: "🛡️",
    theme: {
      bg: "linear-gradient(160deg,#0f1521 0%,#0a1020 50%,#131a28 100%)",
      glow: "rgba(107,163,240,0.07)", accent: "#6ba3f0",
      accentSoft: "rgba(107,163,240,0.12)", text: "#e8eefc",
      textMuted: "rgba(232,238,252,0.5)", textDim: "rgba(232,238,252,0.22)",
      card: "rgba(255,255,255,0.035)", cardBorder: "rgba(107,163,240,0.18)",
      selBg: "rgba(107,163,240,0.13)", selBorder: "rgba(107,163,240,0.6)",
    },
  },
  observer: {
    id: "observer", name: "The Listener", tagline: "Your body speaks. Let's learn its language.",
    description: "Tuning into body signals", icon: "🔮",
    theme: {
      bg: "linear-gradient(160deg,#1a0f1e 0%,#150c18 50%,#1e1226 100%)",
      glow: "rgba(196,154,237,0.07)", accent: "#c49aed",
      accentSoft: "rgba(196,154,237,0.12)", text: "#f2ebfc",
      textMuted: "rgba(242,235,252,0.5)", textDim: "rgba(242,235,252,0.22)",
      card: "rgba(255,255,255,0.035)", cardBorder: "rgba(196,154,237,0.18)",
      selBg: "rgba(196,154,237,0.13)", selBorder: "rgba(196,154,237,0.6)",
    },
  },
  optimizer: {
    id: "optimizer", name: "The Architect", tagline: "Build the best version of your body.",
    description: "Performance & longevity", icon: "⚡",
    theme: {
      bg: "linear-gradient(160deg,#1a1200 0%,#150f00 50%,#1f1500 100%)",
      glow: "rgba(220,184,74,0.07)", accent: "#dcb84a",
      accentSoft: "rgba(220,184,74,0.12)", text: "#fdf5e0",
      textMuted: "rgba(253,245,224,0.5)", textDim: "rgba(253,245,224,0.22)",
      card: "rgba(255,255,255,0.035)", cardBorder: "rgba(220,184,74,0.18)",
      selBg: "rgba(220,184,74,0.13)", selBorder: "rgba(220,184,74,0.6)",
    },
  },
} as const;
type PersonaId = keyof typeof PERSONAS;
type Theme = { bg: string; glow: string; accent: string; accentSoft: string; text: string; textMuted: string; textDim: string; card: string; cardBorder: string; selBg: string; selBorder: string; };

// ── HEALTH TRACKS ─────────────────────────────────────────────────────────────
const TRACKS: Record<string, { label: string; emoji: string; persona: PersonaId; conditions: string[] }> = {
  diabetes:   { label: "Diabetes / Blood Sugar",    emoji: "🩸", persona: "diseased",  conditions: ["diabetes"]         },
  pcos:       { label: "PCOS & Hormonal Balance",   emoji: "🌸", persona: "diseased",  conditions: ["pcos"]             },
  gut:        { label: "Gut Health & Digestion",    emoji: "🌀", persona: "observer",  conditions: ["gut-health"]       },
  heart:      { label: "Heart & Cholesterol",       emoji: "🫀", persona: "diseased",  conditions: ["heart-disease"]    },
  thyroid:    { label: "Thyroid",                   emoji: "🦋", persona: "diseased",  conditions: ["thyroid"]          },
  athlete:    { label: "Performance & Recovery",    emoji: "⚡", persona: "optimizer", conditions: []                   },
  longevity:  { label: "Longevity & Vitality",      emoji: "🔬", persona: "optimizer", conditions: []                   },
  menopause:  { label: "Menopause & Hormones",      emoji: "🌙", persona: "observer",  conditions: ["menopause"]        },
  weight:     { label: "Weight Balance",            emoji: "⚖️", persona: "preventer", conditions: ["weight-management"]},
  prevention: { label: "Disease Prevention",        emoji: "🛡️", persona: "preventer", conditions: []                   },
  energy:     { label: "Energy & Clarity",          emoji: "☀️", persona: "observer",  conditions: []                   },
  family:     { label: "Family & Children",         emoji: "👨‍👩‍👧", persona: "preventer", conditions: []                   },
};

// ── QUESTIONS ─────────────────────────────────────────────────────────────────
type Opt = { emoji: string; label: string; personaHint?: PersonaId; track?: string };
type Q = {
  id: string; question: string; subtext?: string;
  type: "single" | "multi" | "text"; options?: Opt[]; placeholder?: string; section?: string;
};

const GATEWAY: Q[] = [
  {
    id: "g1", question: "What pulled you to Nutriverse today?",
    subtext: "This one answer shapes everything we build for you.", type: "single",
    options: [
      { emoji: "🌿", label: "Something in my body changed and I need to understand it", personaHint: "diseased" },
      { emoji: "🛡️", label: "I want to get ahead of what my lifestyle might bring", personaHint: "preventer" },
      { emoji: "🔍", label: "I feel things my tests don't explain — I want to connect the dots", personaHint: "observer" },
      { emoji: "⚡", label: "I'm already well — I want to become exceptional", personaHint: "optimizer" },
    ],
  },
  {
    id: "g2", question: "Is there a specific area you're navigating?",
    subtext: "Be as specific as you like — or keep it broad. Both are fine.", type: "single",
    options: [
      ...Object.entries(TRACKS).map(([k, v]) => ({ emoji: v.emoji, label: v.label, track: k })),
      { emoji: "🤷", label: "Not sure yet — help me figure it out", track: "general" },
    ],
  },
  {
    id: "g3", question: "How long have you been on this path?",
    subtext: "There's no right stage — every starting point is valid.", type: "single",
    options: [
      { emoji: "🌱", label: "Just beginning — this is new to me" },
      { emoji: "📅", label: "A few months in — finding my footing" },
      { emoji: "🗓️", label: "Over a year — looking for what's missing" },
      { emoji: "⏳", label: "Years — I want a deeper, smarter approach" },
    ],
  },
];

const DEEP: Record<string, Q[]> = {
  diseased: [
    { id: "d1", section: "Your Condition", type: "single",
      question: "When your condition came into your life, what changed first?",
      subtext: "Not medically — personally. What shifted in how you live?",
      options: [
        { emoji: "🍽️", label: "My relationship with food became complicated" },
        { emoji: "😰", label: "I started worrying about what I eat constantly" },
        { emoji: "👨‍👩‍👧", label: "Family meals became harder to navigate" },
        { emoji: "💊", label: "I leaned on medication before trying food" },
      ] },
    { id: "d2", section: "Your Condition", type: "multi",
      question: "Which foods feel like the biggest question mark for you?",
      subtext: "The ones you're unsure about — not the ones you've given up.",
      options: [
        { emoji: "🍚", label: "Rice, roti, or grains" },
        { emoji: "🍌", label: "Fruits — especially sweet ones" },
        { emoji: "🧈", label: "Ghee, oils, and fats" },
        { emoji: "🫘", label: "Lentils and legumes" },
        { emoji: "🥛", label: "Dairy — milk, curd, paneer" },
        { emoji: "🍬", label: "Natural sweeteners like jaggery or honey" },
      ] },
    { id: "d3", section: "Your Body's Signals", type: "multi",
      question: "Which of these do you feel most days?",
      subtext: "Symptoms are data. Naming them helps us nourish you better.",
      options: [
        { emoji: "😴", label: "Fatigue — especially after meals" },
        { emoji: "🌊", label: "Energy that crashes mid-day" },
        { emoji: "🤔", label: "Brain fog or difficulty focusing" },
        { emoji: "😣", label: "Bloating or digestive discomfort" },
        { emoji: "😤", label: "Mood shifts tied to what I eat" },
        { emoji: "💧", label: "Unusual thirst or dryness" },
      ] },
    { id: "d4", section: "Your Care", type: "single",
      question: "Are you working with any medical support right now?",
      subtext: "Nutriverse works alongside your care team — never in place of them.",
      options: [
        { emoji: "👨‍⚕️", label: "Yes — my doctor and I are aligned on a plan" },
        { emoji: "🔄", label: "Occasionally — I check in when needed" },
        { emoji: "🌱", label: "Not currently — navigating on my own" },
        { emoji: "📅", label: "I have an appointment coming up" },
      ] },
  ],
  preventer: [
    { id: "p1", section: "Your Risk Awareness", type: "multi",
      question: "What's the health story in your family you think about most?",
      subtext: "Family history is a map — not a destiny.",
      options: [
        { emoji: "🩸", label: "Diabetes — in parents or grandparents" },
        { emoji: "🫀", label: "Heart disease or blood pressure" },
        { emoji: "⚖️", label: "Weight-related conditions" },
        { emoji: "🦋", label: "Thyroid or hormonal issues" },
        { emoji: "🧠", label: "Cognitive decline or memory" },
        { emoji: "✨", label: "None — I'm being proactive by choice" },
      ] },
    { id: "p2", section: "Your Risk Awareness", type: "single",
      question: "Have any recent check-ups flagged something to address?",
      subtext: "Even borderline numbers count. Early is powerful.",
      options: [
        { emoji: "📊", label: "Yes — blood sugar or insulin resistance" },
        { emoji: "📉", label: "Yes — cholesterol or lipids" },
        { emoji: "⚖️", label: "Yes — weight or BMI" },
        { emoji: "✅", label: "All clear — I want to keep it that way" },
        { emoji: "🤷", label: "Haven't checked recently" },
      ] },
    { id: "p3", section: "Your Lifestyle", type: "single",
      question: "How much does your current lifestyle work for your health?",
      subtext: "No judgment — just an honest starting point.",
      options: [
        { emoji: "✨", label: "Pretty well — I make mindful choices most days" },
        { emoji: "🔄", label: "Mixed — good habits alongside not-so-good ones" },
        { emoji: "😬", label: "Not great — work and life have taken over" },
        { emoji: "🌱", label: "Starting fresh — changing old patterns" },
      ] },
    { id: "p4", section: "Your Motivation", type: "single",
      question: "What would make prevention feel meaningful — not like sacrifice?",
      subtext: "We want to build something you actually want to sustain.",
      options: [
        { emoji: "😋", label: "Delicious food that also happens to be good for me" },
        { emoji: "📈", label: "Seeing measurable results — numbers, energy, weight" },
        { emoji: "🧘", label: "Feeling light and clear rather than heavy" },
        { emoji: "👨‍👩‍👧", label: "Setting a good example for my family" },
      ] },
  ],
  observer: [
    { id: "o1", section: "Your Body Signals", type: "multi",
      question: "What's the one pattern your body has that no one has explained?",
      subtext: "The recurring thing that makes you wonder — what is that about?",
      options: [
        { emoji: "😴", label: "I feel exhausted no matter how much I sleep" },
        { emoji: "🌊", label: "Energy waves I can't predict" },
        { emoji: "🤔", label: "Mental fog that comes and goes" },
        { emoji: "😣", label: "Bloating or gut feelings tied to mood" },
        { emoji: "😤", label: "Irritability connected to meals or hunger" },
        { emoji: "🌡️", label: "Temperature, skin, or hair changes I can't explain" },
      ] },
    { id: "o2", section: "Your Body Signals", type: "single",
      question: "When do you feel most in sync with your body?",
      subtext: "The moments of clarity are data too.",
      options: [
        { emoji: "🌅", label: "Right after a really good morning meal" },
        { emoji: "🏃", label: "After moving my body" },
        { emoji: "🌿", label: "When I've eaten simply and lightly" },
        { emoji: "😴", label: "After genuinely restful sleep" },
        { emoji: "🤷", label: "Honestly, I'm trying to find that feeling" },
      ] },
    { id: "o3", section: "Patterns & Triggers", type: "multi",
      question: "What happens in your body when you're stressed?",
      subtext: "Stress and digestion are deeply linked — this shapes your plan.",
      options: [
        { emoji: "🍫", label: "I crave something specific — sweet, salty, crunchy" },
        { emoji: "🙈", label: "My appetite disappears completely" },
        { emoji: "😣", label: "My gut goes into overdrive — bloating or discomfort" },
        { emoji: "😴", label: "I crash — physically and mentally" },
        { emoji: "🌙", label: "Sleep gets disrupted and food gets chaotic" },
      ] },
    { id: "o4", section: "Patterns & Triggers", type: "single",
      question: "How interested are you in understanding the 'why' behind your food?",
      subtext: "Some people want answers. Others want experiments. Both are valid.",
      options: [
        { emoji: "🔬", label: "Very — I want the science and the detail" },
        { emoji: "💡", label: "Somewhat — give me insights without overwhelm" },
        { emoji: "🎯", label: "Just tell me what works — keep theory light" },
        { emoji: "🌿", label: "I want to feel it, not just understand it" },
      ] },
  ],
  optimizer: [
    { id: "op1", section: "Your Performance", type: "multi",
      question: "What are you currently trying to build or improve?",
      subtext: "Be specific — this shapes every meal we recommend.",
      options: [
        { emoji: "💪", label: "Muscle and strength" },
        { emoji: "🏃", label: "Endurance and cardiovascular capacity" },
        { emoji: "🧠", label: "Cognitive performance and focus" },
        { emoji: "⚡", label: "Sustained energy without spikes or crashes" },
        { emoji: "🔬", label: "Longevity — cellular health and inflammation" },
        { emoji: "😴", label: "Recovery — sleep, soreness, and resilience" },
      ] },
    { id: "op2", section: "Your Performance", type: "single",
      question: "How does your training look right now?",
      subtext: "Your plate should match your output.",
      options: [
        { emoji: "🔥", label: "High intensity — 5+ days a week" },
        { emoji: "⚖️", label: "Moderate — 3–4 sessions, mix of strength and cardio" },
        { emoji: "🧘", label: "Functional — yoga, walking, mobility" },
        { emoji: "🌱", label: "Building a consistent routine" },
      ] },
    { id: "op3", section: "Your Gaps", type: "multi",
      question: "Where does your nutrition currently fall short?",
      subtext: "Most optimizers have one consistent blind spot.",
      options: [
        { emoji: "⏰", label: "Meal timing — eating at the wrong times" },
        { emoji: "🫘", label: "Protein — I know I'm not getting enough" },
        { emoji: "😴", label: "Recovery nutrition — I neglect the post-effort window" },
        { emoji: "💧", label: "Hydration and electrolytes" },
        { emoji: "🌿", label: "Anti-inflammatory foods — I eat too processed" },
        { emoji: "🧘", label: "Gut health — it affects my performance" },
      ] },
    { id: "op4", section: "Your Ambition", type: "single",
      question: "What would peak feel like — one year from now?",
      subtext: "We build your plan backwards from this vision.",
      options: [
        { emoji: "🏆", label: "I hit personal bests — in training and in life" },
        { emoji: "🧠", label: "I think sharper and sustain focus like never before" },
        { emoji: "⏳", label: "I feel younger than my age — turned back the clock" },
        { emoji: "⚡", label: "I wake up ready — every single day" },
      ] },
  ],
};

const SHARED: Q[] = [
  { id: "s1", section: "Your Plate", type: "multi",
    question: "Which cuisine feels most like home to you?",
    subtext: "Nourishment that speaks your food language works better.",
    options: [
      { emoji: "🌾", label: "North Indian — roti, dal, sabzi" },
      { emoji: "🥥", label: "South Indian — rice, rasam, sambhar" },
      { emoji: "🫙", label: "Gujarati or Rajasthani" },
      { emoji: "🐟", label: "Bengali or Coastal" },
      { emoji: "🌶️", label: "Maharashtrian or Konkan" },
      { emoji: "🌍", label: "Other or International" },
    ] },
  { id: "s2", section: "Your Plate", type: "single",
    question: "Do you follow any food practice or belief?",
    subtext: "We respect every tradition. Your plan will honour it.",
    options: [
      { emoji: "🐄", label: "Vegetarian" },
      { emoji: "🥚", label: "Eggetarian" },
      { emoji: "🐟", label: "I eat fish and seafood" },
      { emoji: "🍗", label: "I eat everything including meat" },
      { emoji: "🌱", label: "Vegan or mostly plant-based" },
    ] },
  { id: "s3", section: "Your Plate", type: "multi",
    question: "Any food allergies or intolerances?",
    subtext: "We'll keep these completely off your plate.",
    options: [
      { emoji: "🥛", label: "Dairy / Lactose" },
      { emoji: "🌾", label: "Gluten / Wheat" },
      { emoji: "🥜", label: "Tree nuts / Peanuts" },
      { emoji: "🦐", label: "Shellfish" },
      { emoji: "🫘", label: "Soy" },
      { emoji: "✨", label: "None that I know of" },
    ] },
  { id: "s4", section: "Your Kitchen", type: "single",
    question: "How much time can you give a meal?",
    subtext: "We'll never ask for what you don't have.",
    options: [
      { emoji: "⚡", label: "Under 15 min — make it fast" },
      { emoji: "⏱️", label: "15–30 min — I can manage this" },
      { emoji: "🍲", label: "30–45 min — I enjoy the process" },
      { emoji: "👨‍🍳", label: "As long as it takes — cooking is my thing" },
    ] },
  { id: "s5", section: "Your Budget", type: "single",
    question: "What's your food budget like?",
    subtext: "Nourishing food doesn't need to be expensive. We'll work with your reality.",
    options: [
      { emoji: "💚", label: "Tight — I count every rupee (₹50–100/day)" },
      { emoji: "💛", label: "Balanced — I'm thoughtful but flexible (₹100–250/day)" },
      { emoji: "💫", label: "Generous — health is worth spending on (₹250+/day)" },
    ] },
  { id: "s6", section: "Your Goal", type: "single",
    question: "What's your primary goal for the next 30 days?",
    subtext: "We'll build everything backwards from this.",
    options: [
      { emoji: "📉", label: "Lose weight sustainably" },
      { emoji: "💪", label: "Build strength and muscle" },
      { emoji: "❤️", label: "Improve a specific health marker" },
      { emoji: "⚡", label: "Boost energy and mental clarity" },
      { emoji: "🌿", label: "Maintain and feel consistently well" },
    ] },
  { id: "s7", section: "One Last Thing", type: "text",
    question: "If your plate could reflect the life you want — what would it feel like?",
    subtext: "Not what it looks like. What it feels like.",
    placeholder: "Calm. Colourful. Light. Like something my grandmother made..." },
];

// ── HELPERS ───────────────────────────────────────────────────────────────────
function detectPersona(answers: Record<string, any>): PersonaId {
  const g1 = answers["g1"] as string;
  if (g1) {
    const opt = GATEWAY[0].options?.find(o => o.label === g1);
    if (opt?.personaHint) return opt.personaHint;
  }
  const g2 = answers["g2"] as string;
  if (g2) {
    const entry = Object.entries(TRACKS).find(([, v]) => v.label === g2);
    if (entry) return entry[1].persona;
  }
  return "observer";
}

function buildPayload(answers: Record<string, any>, bio: Record<string, string>) {
  const g2 = answers["g2"] as string || "";
  const trackEntry = Object.entries(TRACKS).find(([, v]) => v.label === g2);
  const conditions = trackEntry ? trackEntry[1].conditions : [];

  const DIET_MAP: Record<string, string> = {
    "Vegetarian": "vegetarian", "Eggetarian": "eggetarian",
    "I eat fish and seafood": "non-vegetarian",
    "I eat everything including meat": "non-vegetarian",
    "Vegan or mostly plant-based": "vegan",
  };
  const dietary_type = DIET_MAP[answers["s2"]] || "vegetarian";

  const ALLERGY_LABEL: Record<string, string> = {
    "Dairy / Lactose": "Lactose", "Gluten / Wheat": "Gluten",
    "Tree nuts / Peanuts": "Nuts", "Shellfish": "Shellfish", "Soy": "soy",
  };
  const allergies = ((answers["s3"] as string[]) || [])
    .filter((a: string) => a !== "None that I know of")
    .map((a: string) => ALLERGY_LABEL[a] || a);

  const COOK_MAP: Record<string, string> = {
    "Under 15 min — make it fast": "quick",
    "15–30 min — I can manage this": "intermediate",
    "30–45 min — I enjoy the process": "intermediate",
    "As long as it takes — cooking is my thing": "full",
  };
  const cooking_ability = COOK_MAP[answers["s4"]] || "quick";

  const BUDGET_MAP: Record<string, string> = {
    "Tight — I count every rupee (₹50–100/day)": "low",
    "Balanced — I'm thoughtful but flexible (₹100–250/day)": "medium",
    "Generous — health is worth spending on (₹250+/day)": "high",
  };
  const budget = BUDGET_MAP[answers["s5"]] || "medium";

  const GOAL_MAP: Record<string, string> = {
    "Lose weight sustainably": "Lose 3-5kg in 30 days with sustainable habits",
    "Build strength and muscle": "Build strength and muscle through optimal nutrition",
    "Improve a specific health marker": "Improve key health markers through targeted eating",
    "Boost energy and mental clarity": "Boost energy and mental clarity throughout the day",
    "Maintain and feel consistently well": "Maintain weight and feel energetic every day",
  };
  const goal_30day = GOAL_MAP[answers["s6"]] || "Feel healthier and more energetic";

  const condition_answers: Record<string, any> = {
    journey_duration: answers["g3"],
    plate_vision: answers["s7"],
    cuisines: answers["s1"],
  };
  const deepKeys = ["d1","d2","d3","d4","p1","p2","p3","p4","o1","o2","o3","o4","op1","op2","op3","op4"];
  for (const k of deepKeys) { if (answers[k]) condition_answers[k] = answers[k]; }

  return {
    conditions, condition_answers, dietary_type, allergies, cooking_ability, budget, goal_30day,
    age: bio.age ? parseInt(bio.age) : undefined,
    gender: bio.gender || undefined,
    weight_kg: bio.weight ? parseFloat(bio.weight) : undefined,
    height_cm: bio.height ? parseFloat(bio.height) : undefined,
    activity_level: bio.activity || undefined,
  };
}

// ── OPTION BUTTON ─────────────────────────────────────────────────────────────
function OptionBtn({ opt, selected, onSelect, T }: {
  opt: Opt; selected: boolean; onSelect: (l: string) => void; T: Theme;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={() => onSelect(opt.label)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: "0.85rem",
        padding: "0.85rem 1.1rem",
        background: selected ? T.selBg : hov ? "rgba(255,255,255,0.05)" : T.card,
        border: `1px solid ${selected ? T.selBorder : hov ? "rgba(255,255,255,0.12)" : T.cardBorder}`,
        borderRadius: 14, cursor: "pointer", textAlign: "left", outline: "none",
        transition: "all 0.18s ease", width: "100%",
      }}
    >
      <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>{opt.emoji}</span>
      <span style={{ color: selected ? T.text : T.textMuted, flex: 1, fontSize: "0.87rem", fontWeight: selected ? 500 : 400, lineHeight: 1.4 }}>
        {opt.label}
      </span>
      {selected && <span style={{ color: T.accent, fontSize: "0.8rem", flexShrink: 0 }}>✓</span>}
    </button>
  );
}

// ── SHARED UI PIECES ──────────────────────────────────────────────────────────
const FONTS = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,600&family=DM+Sans:wght@300;400;500&display=swap";
const serif: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

function TopBar({ T, P, persona }: { T: Theme; P: typeof PERSONAS.diseased; persona: PersonaId | null }) {
  return (
    <div style={{ padding: "1.25rem 1.5rem 0", display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 2 }}>
      <span style={{ ...serif, fontSize: "1.25rem", fontWeight: 600, color: T.text }}>
        Nutri<span style={{ color: T.accent }}>verse</span>
      </span>
      {persona && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", background: T.accentSoft, border: `1px solid ${T.cardBorder}`, borderRadius: 20, padding: "0.22rem 0.65rem" }}>
          <span style={{ fontSize: "0.7rem" }}>{P.icon}</span>
          <span style={{ color: T.accent, fontSize: "0.6rem", fontWeight: 500, letterSpacing: "0.1em" }}>{P.name.toUpperCase()}</span>
        </div>
      )}
    </div>
  );
}

function ProgressBar({ T, progress, label }: { T: Theme; progress: number; label: string }) {
  return (
    <div style={{ padding: "0.7rem 1.5rem 0", position: "relative", zIndex: 2 }}>
      <div style={{ height: 2, background: "rgba(255,255,255,0.07)", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", background: T.accent, width: `${progress}%`, borderRadius: 2, transition: "width 0.5s ease", boxShadow: `0 0 10px ${T.accent}70` }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.4rem" }}>
        <span style={{ color: T.textDim, fontSize: "0.62rem", letterSpacing: "0.1em" }}>{label.toUpperCase()}</span>
        <span style={{ color: T.accent, fontSize: "0.62rem", fontWeight: 500 }}>{progress}%</span>
      </div>
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function Onboarding() {
  const router = useRouter();
  const { refresh } = useAuth();

  type Phase = "intro" | "gateway" | "persona-reveal" | "deep" | "shared" | "biometrics" | "generating";
  const [phase, setPhase] = useState<Phase>("intro");
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [persona, setPersona] = useState<PersonaId | null>(null);
  const [textVal, setTextVal] = useState("");
  const [vis, setVis] = useState(true);
  const [introStep, setIntroStep] = useState(0);
  const [revStep, setRevStep] = useState(0);
  const [bio, setBio] = useState({ age: "", gender: "", weight: "", height: "", activity: "" });
  const [genStep, setGenStep] = useState(0);
  const [error, setError] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const P = PERSONAS[persona ?? "diseased"];
  const T = P.theme;

  const qList = phase === "gateway" ? GATEWAY : phase === "deep" ? (DEEP[persona!] || []) : phase === "shared" ? SHARED : [];
  const q = qList[qIdx] as Q | undefined;
  const ans = q ? answers[q.id] : null;

  const deepLen = persona ? (DEEP[persona]?.length ?? 4) : 4;
  const totalQ = GATEWAY.length + deepLen + SHARED.length + 1;
  const doneQ = phase === "gateway" ? qIdx
    : phase === "deep" ? GATEWAY.length + qIdx
    : phase === "shared" ? GATEWAY.length + deepLen + qIdx
    : phase === "biometrics" || phase === "generating" ? GATEWAY.length + deepLen + SHARED.length
    : 0;
  const progress = Math.round((doneQ / totalQ) * 100);

  const isAnswered = () => {
    if (!q) return false;
    if (q.type === "text") return true;
    if (q.type === "single") return !!ans;
    if (q.type === "multi") return ans && ans.length > 0;
    return false;
  };

  const fade = (fn: () => void) => {
    setVis(false);
    setTimeout(() => { fn(); setVis(true); }, 320);
  };

  const goNext = () => {
    const newAns = { ...answers };
    if (q?.type === "text" && textVal.trim()) newAns[q.id] = textVal.trim();
    setAnswers(newAns);
    const next = qIdx + 1;
    if (phase === "gateway") {
      if (next >= GATEWAY.length) {
        const det = detectPersona(newAns);
        setPersona(det);
        fade(() => { setPhase("persona-reveal"); setRevStep(0); });
      } else fade(() => setQIdx(next));
    } else if (phase === "deep") {
      if (next >= (DEEP[persona!]?.length ?? 0)) fade(() => { setPhase("shared"); setQIdx(0); });
      else fade(() => setQIdx(next));
    } else if (phase === "shared") {
      if (next >= SHARED.length) fade(() => setPhase("biometrics"));
      else fade(() => setQIdx(next));
    }
  };

  const goBack = () => {
    if (phase === "gateway" && qIdx === 0) return;
    if (phase === "deep" && qIdx === 0) fade(() => { setPhase("gateway"); setQIdx(GATEWAY.length - 1); });
    else if (phase === "shared" && qIdx === 0) fade(() => { setPhase("deep"); setQIdx((DEEP[persona!]?.length ?? 1) - 1); });
    else if (phase === "biometrics") fade(() => { setPhase("shared"); setQIdx(SHARED.length - 1); });
    else fade(() => setQIdx(i => i - 1));
  };

  const selectOpt = (label: string) => {
    if (!q) return;
    if (q.type === "single") setAnswers(p => ({ ...p, [q.id]: label }));
    else if (q.type === "multi") {
      setAnswers(p => {
        const cur: string[] = p[q.id] || [];
        return cur.includes(label) ? { ...p, [q.id]: cur.filter(x => x !== label) } : { ...p, [q.id]: [...cur, label] };
      });
    }
  };

  const submitPlan = async () => {
    setPhase("generating");
    setGenStep(0);
    const GEN_MSGS = [
      "Understanding your health journey…",
      "Mapping your food preferences…",
      "Analysing condition-specific needs…",
      "Building your personalised plan…",
      "Almost ready…",
    ];
    let s = 0;
    const tick = setInterval(() => { s++; if (s < GEN_MSGS.length) setGenStep(s); }, 1400);
    try {
      const payload = buildPayload(answers, bio);
      await api.post("/ai/onboarding/generate-plan", payload);
      await refresh();
      clearInterval(tick);
      router.push("/app");
    } catch {
      clearInterval(tick);
      setError("Something went wrong generating your plan. Please try again.");
      setPhase("biometrics");
    }
  };

  // Intro animation
  useEffect(() => {
    if (phase !== "intro") return;
    let i = 0;
    const adv = () => { i++; if (i <= 2) { setIntroStep(i); timer.current = setTimeout(adv, i === 1 ? 1500 : 900); } };
    timer.current = setTimeout(adv, 700);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [phase]);

  // Persona reveal animation
  useEffect(() => {
    if (phase !== "persona-reveal") return;
    let s = 0;
    const adv = () => { s++; setRevStep(s); if (s < 3) timer.current = setTimeout(adv, s === 1 ? 1200 : 1000); };
    timer.current = setTimeout(adv, 400);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [phase]);

  useEffect(() => {
    if (q) setTextVal(answers[q.id] || "");
  }, [qIdx, phase]); // eslint-disable-line react-hooks/exhaustive-deps

  const wrap: React.CSSProperties = {
    minHeight: "100vh", background: T.bg,
    transition: "background 0.9s ease",
    display: "flex", flexDirection: "column",
    fontFamily: "'DM Sans', sans-serif",
    position: "relative", overflow: "hidden",
  };

  const glow = (
    <div style={{
      position: "fixed", width: "55vw", height: "55vw", borderRadius: "50%",
      background: T.glow, filter: "blur(90px)",
      pointerEvents: "none", zIndex: 0, top: "5%", left: "22%",
      transition: "background 0.9s ease",
    }} />
  );

  // ── INTRO ────────────────────────────────────────────────────────────────
  if (phase === "intro") {
    const DT = PERSONAS.diseased.theme;
    return (
      <div style={{ ...wrap, background: DT.bg }}>
        <link rel="stylesheet" href={FONTS} />
        <div style={{ position: "fixed", width: "55vw", height: "55vw", borderRadius: "50%", background: DT.glow, filter: "blur(90px)", pointerEvents: "none", zIndex: 0, top: "5%", left: "22%" }} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "3rem 2rem", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{ opacity: introStep >= 0 ? 1 : 0, transform: introStep >= 0 ? "translateY(0) scale(1)" : "translateY(40px) scale(0.88)", transition: "all 1s cubic-bezier(0.16,1,0.3,1)" }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", border: `1px solid ${DT.accent}40`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", fontSize: "2.4rem", background: DT.accentSoft, boxShadow: `0 0 60px ${DT.accent}20` }}>🥗</div>
            <h1 style={{ ...serif, fontSize: "clamp(3rem, 8vw, 5rem)", color: DT.text, fontWeight: 500, margin: 0, letterSpacing: "-0.02em", lineHeight: 1 }}>
              Nutri<span style={{ color: DT.accent }}>verse</span>
            </h1>
          </div>
          <div style={{ opacity: introStep >= 1 ? 1 : 0, transform: introStep >= 1 ? "translateY(0)" : "translateY(24px)", transition: "all 0.9s cubic-bezier(0.16,1,0.3,1)", marginTop: "1.75rem" }}>
            <p style={{ ...serif, fontSize: "clamp(1.1rem, 3vw, 1.5rem)", color: DT.textMuted, fontStyle: "italic", margin: 0, lineHeight: 1.6 }}>
              Eat with intention. Heal with food.
            </p>
          </div>
          <div style={{ opacity: introStep >= 2 ? 1 : 0, transform: introStep >= 2 ? "translateY(0)" : "translateY(16px)", transition: "all 0.8s cubic-bezier(0.16,1,0.3,1)", marginTop: "1.5rem" }}>
            <p style={{ color: DT.textDim, fontSize: "0.85rem", lineHeight: 1.9, maxWidth: 320, margin: "0 auto 2.5rem" }}>
              A short conversation — not a form.<br />We'll understand what your body needs and build something entirely yours.
            </p>
            <button
              onClick={() => fade(() => { setPhase("gateway"); setQIdx(0); })}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
              style={{ padding: "0.9rem 2.8rem", borderRadius: 50, background: DT.accent, border: "none", color: "#0a1510", fontFamily: "'DM Sans', sans-serif", fontSize: "0.92rem", fontWeight: 600, cursor: "pointer", letterSpacing: "0.05em", boxShadow: `0 8px 40px ${DT.accent}40`, transition: "transform 0.18s ease" }}
            >
              Begin →
            </button>
          </div>
        </div>
        <style>{`*{box-sizing:border-box}body{margin:0}`}</style>
      </div>
    );
  }

  // ── PERSONA REVEAL ───────────────────────────────────────────────────────
  if (phase === "persona-reveal") {
    return (
      <div style={wrap}>
        <link rel="stylesheet" href={FONTS} />
        {glow}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "3rem 2rem", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{ opacity: revStep >= 0 ? 1 : 0, transform: revStep >= 0 ? "scale(1)" : "scale(0.4)", transition: "all 0.9s cubic-bezier(0.34,1.56,0.64,1)" }}>
            <div style={{ width: 100, height: 100, borderRadius: "50%", background: T.accentSoft, border: `1px solid ${T.accent}50`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem", margin: "0 auto 1.5rem", boxShadow: `0 0 80px ${T.accent}25` }}>
              {P.icon}
            </div>
          </div>
          <div style={{ opacity: revStep >= 1 ? 1 : 0, transform: revStep >= 1 ? "translateY(0)" : "translateY(22px)", transition: "all 0.75s cubic-bezier(0.16,1,0.3,1)" }}>
            <p style={{ color: T.accent, fontSize: "0.68rem", letterSpacing: "0.22em", textTransform: "uppercase", margin: "0 0 0.6rem", fontWeight: 500 }}>You are</p>
            <h2 style={{ ...serif, fontSize: "clamp(2.2rem, 6vw, 3.6rem)", color: T.text, fontWeight: 600, margin: "0 0 0.4rem", letterSpacing: "-0.01em" }}>{P.name}</h2>
            <p style={{ ...serif, color: T.textMuted, fontStyle: "italic", fontSize: "1.3rem", margin: "0 0 2rem" }}>{P.tagline}</p>
          </div>
          <div style={{ opacity: revStep >= 2 ? 1 : 0, transform: revStep >= 2 ? "translateY(0)" : "translateY(14px)", transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)" }}>
            <div style={{ background: T.card, border: `1px solid ${T.cardBorder}`, borderRadius: 18, padding: "1rem 1.6rem", maxWidth: 340, margin: "0 auto 2rem" }}>
              <p style={{ color: T.textMuted, fontSize: "0.84rem", lineHeight: 1.8, margin: 0 }}>
                We've calibrated your experience. A few more questions and your personalised plan is ready.
              </p>
            </div>
            <button
              onClick={() => fade(() => { setPhase("deep"); setQIdx(0); })}
              style={{ padding: "0.85rem 2.4rem", borderRadius: 50, background: T.accent, border: "none", color: "#0a0a0a", fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", fontWeight: 600, cursor: "pointer", letterSpacing: "0.04em", boxShadow: `0 8px 32px ${T.accent}40` }}
            >
              Continue →
            </button>
          </div>
        </div>
        <style>{`*{box-sizing:border-box}body{margin:0}`}</style>
      </div>
    );
  }

  // ── GENERATING ───────────────────────────────────────────────────────────
  if (phase === "generating") {
    const GEN_MSGS = [
      "Understanding your health journey…",
      "Mapping your food preferences…",
      "Analysing condition-specific needs…",
      "Building your personalised plan…",
      "Almost ready…",
    ];
    return (
      <div style={wrap}>
        <link rel="stylesheet" href={FONTS} />
        {glow}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "3rem 2rem", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{ width: 60, height: 60, borderRadius: "50%", border: `2px solid ${T.accent}30`, borderTopColor: T.accent, animation: "spin 1s linear infinite", margin: "0 auto 2rem" }} />
          <h2 style={{ ...serif, fontSize: "clamp(1.8rem, 4vw, 2.5rem)", color: T.text, fontWeight: 500, margin: "0 0 1.25rem", lineHeight: 1.3 }}>Crafting your plan</h2>
          <div style={{ height: 48, position: "relative", width: "100%", maxWidth: 360 }}>
            {GEN_MSGS.map((msg, i) => (
              <p key={i} style={{
                position: "absolute", top: 0, left: 0, right: 0, margin: 0,
                color: T.textMuted, fontSize: "0.9rem", lineHeight: 1.7,
                opacity: i === genStep ? 1 : 0,
                transform: i === genStep ? "translateY(0)" : "translateY(10px)",
                transition: "all 0.5s ease",
              }}>{msg}</p>
            ))}
          </div>
          <div style={{ marginTop: "2rem", width: 260, height: 2, background: "rgba(255,255,255,0.07)", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ height: "100%", background: T.accent, borderRadius: 2, transition: "width 1.4s ease", width: `${Math.round(((genStep + 1) / GEN_MSGS.length) * 100)}%`, boxShadow: `0 0 12px ${T.accent}70` }} />
          </div>
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}*{box-sizing:border-box}body{margin:0}`}</style>
      </div>
    );
  }

  // ── BIOMETRICS ───────────────────────────────────────────────────────────
  if (phase === "biometrics") {
    const bioValid = !!(bio.age && bio.gender && bio.weight && bio.height && bio.activity);
    const GENDERS = [{ id: "male", label: "Male" }, { id: "female", label: "Female" }, { id: "other", label: "Other" }];
    const ACTIVITIES = [
      { id: "sedentary",  label: "Sedentary",  desc: "Little/no exercise" },
      { id: "light",      label: "Light",      desc: "1–3 days/week" },
      { id: "moderate",   label: "Moderate",   desc: "3–5 days/week" },
      { id: "active",     label: "Active",     desc: "6–7 days/week" },
      { id: "very_active",label: "Very active",desc: "Twice daily" },
    ];
    const inp: React.CSSProperties = {
      width: "100%", padding: "0.75rem 1rem", background: T.card,
      border: `1px solid ${T.cardBorder}`, borderRadius: 12,
      fontSize: "0.9rem", color: T.text, outline: "none",
      fontFamily: "'DM Sans', sans-serif", transition: "border-color 0.2s", boxSizing: "border-box",
    };
    return (
      <div style={wrap}>
        <link rel="stylesheet" href={FONTS} />
        {glow}
        <TopBar T={T} P={P} persona={persona} />
        <ProgressBar T={T} progress={progress} label="Almost there" />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "1rem 1.5rem", maxWidth: 620, margin: "0 auto", width: "100%", position: "relative", zIndex: 2, overflowY: "auto" }}>
          <h2 style={{ ...serif, fontSize: "clamp(1.5rem, 4vw, 2rem)", color: T.text, fontWeight: 500, margin: "0 0 0.35rem", lineHeight: 1.25 }}>A few final details</h2>
          <p style={{ color: T.textMuted, fontSize: "0.84rem", lineHeight: 1.7, margin: "0 0 1.5rem", fontWeight: 300 }}>These help us calculate your exact nutrition targets.</p>
          {error && <p style={{ color: "#f87171", fontSize: "0.8rem", margin: "0 0 1rem", padding: "0.6rem 1rem", background: "rgba(248,113,113,0.08)", borderRadius: 8, border: "1px solid rgba(248,113,113,0.2)" }}>{error}</p>}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            {[
              { key: "age",    label: "Age",         placeholder: "e.g. 28",  min: 15,  max: 90  },
              { key: "weight", label: "Weight (kg)", placeholder: "e.g. 68",  min: 30,  max: 200 },
              { key: "height", label: "Height (cm)", placeholder: "e.g. 165", min: 100, max: 230 },
            ].map(f => (
              <label key={f.key} style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                <span style={{ color: T.accent, fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500 }}>{f.label}</span>
                <input type="number" min={f.min} max={f.max} placeholder={f.placeholder}
                  value={bio[f.key as keyof typeof bio]}
                  onChange={e => setBio(b => ({ ...b, [f.key]: e.target.value }))}
                  onFocus={e => (e.target.style.borderColor = T.accent)}
                  onBlur={e => (e.target.style.borderColor = T.cardBorder)}
                  style={inp}
                />
              </label>
            ))}
          </div>

          <p style={{ color: T.accent, fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500, margin: "0 0 0.45rem" }}>Gender</p>
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.1rem" }}>
            {GENDERS.map(g => (
              <button key={g.id} onClick={() => setBio(b => ({ ...b, gender: g.id }))}
                style={{ flex: 1, padding: "0.65rem 0.5rem", borderRadius: 10, cursor: "pointer", outline: "none", transition: "all 0.18s ease", fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem",
                  background: bio.gender === g.id ? T.selBg : T.card,
                  border: `1px solid ${bio.gender === g.id ? T.selBorder : T.cardBorder}`,
                  color: bio.gender === g.id ? T.text : T.textMuted,
                  fontWeight: bio.gender === g.id ? 500 : 400,
                }}>
                {g.label}
              </button>
            ))}
          </div>

          <p style={{ color: T.accent, fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500, margin: "0 0 0.45rem" }}>Activity Level</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            {ACTIVITIES.map(a => (
              <button key={a.id} onClick={() => setBio(b => ({ ...b, activity: a.id }))}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.65rem 1rem", borderRadius: 10, cursor: "pointer", outline: "none", transition: "all 0.18s ease", fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", textAlign: "left",
                  background: bio.activity === a.id ? T.selBg : T.card,
                  border: `1px solid ${bio.activity === a.id ? T.selBorder : T.cardBorder}`,
                  color: bio.activity === a.id ? T.text : T.textMuted,
                  fontWeight: bio.activity === a.id ? 500 : 400,
                }}>
                <span>{a.label}</span>
                <span style={{ fontSize: "0.72rem", color: bio.activity === a.id ? T.textMuted : T.textDim }}>{a.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: "0.75rem 1.5rem 1.75rem", maxWidth: 620, margin: "0 auto", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", boxSizing: "border-box", position: "relative", zIndex: 2 }}>
          <button onClick={goBack}
            style={{ padding: "0.65rem 1.1rem", borderRadius: 10, background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: T.textMuted, cursor: "pointer", fontSize: "0.8rem", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" }}>
            ← Back
          </button>
          <button onClick={submitPlan} disabled={!bioValid}
            style={{ padding: "0.8rem 1.8rem", borderRadius: 50, background: bioValid ? T.accent : "rgba(255,255,255,0.06)", border: `1px solid ${bioValid ? "transparent" : "rgba(255,255,255,0.08)"}`, color: bioValid ? "#0a0a0a" : T.textDim, cursor: bioValid ? "pointer" : "default", fontSize: "0.87rem", fontWeight: 600, fontFamily: "'DM Sans', sans-serif", transition: "all 0.22s ease", boxShadow: bioValid ? `0 4px 24px ${T.accent}42` : "none", letterSpacing: "0.02em" }}
            onMouseEnter={e => { if (bioValid) (e.currentTarget.style.transform = "scale(1.03)"); }}
            onMouseLeave={e => { (e.currentTarget.style.transform = "scale(1)"); }}
          >
            Generate my plan ✦
          </button>
        </div>
        <style>{`*{box-sizing:border-box}body{margin:0}input::-webkit-outer-spin-button,input::-webkit-inner-spin-button{-webkit-appearance:none}input[type=number]{-moz-appearance:textfield}input::placeholder{color:${T.textDim}}`}</style>
      </div>
    );
  }

  // ── QUESTION SCREEN ──────────────────────────────────────────────────────
  if (!q) return null;
  const phaseLabel = phase === "gateway" ? "Getting to know you" : (q.section ?? P.name);
  const canSkip = q.type === "text";
  const btnActive = isAnswered();

  return (
    <div style={wrap}>
      <link rel="stylesheet" href={FONTS} />
      {glow}
      <TopBar T={T} P={P} persona={persona} />
      <ProgressBar T={T} progress={progress} label={phaseLabel} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "1rem 1.5rem 0.5rem", maxWidth: 620, margin: "0 auto", width: "100%", position: "relative", zIndex: 2, overflowY: "auto" }}>
        <div style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(18px)", transition: "all 0.32s cubic-bezier(0.16,1,0.3,1)" }}>
          <h2 style={{ ...serif, fontSize: "clamp(1.55rem, 4.5vw, 2.1rem)", color: T.text, fontWeight: 500, margin: "0 0 0.45rem", lineHeight: 1.25, letterSpacing: "-0.01em" }}>
            {q.question}
          </h2>
          {q.subtext && (
            <p style={{ color: T.textMuted, fontSize: "0.84rem", lineHeight: 1.7, margin: "0 0 1.3rem", fontWeight: 300 }}>
              {q.subtext}
            </p>
          )}
          {q.type === "multi" && (
            <p style={{ color: T.accent, fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 0.75rem", fontWeight: 500 }}>
              Select all that apply
            </p>
          )}
          {(q.type === "single" || q.type === "multi") && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
              {q.options?.map(opt => (
                <OptionBtn key={opt.label} opt={opt}
                  selected={q.type === "single" ? ans === opt.label : (ans as string[] | null)?.includes(opt.label) ?? false}
                  onSelect={selectOpt} T={T}
                />
              ))}
            </div>
          )}
          {q.type === "text" && (
            <div style={{ position: "relative" }}>
              <textarea value={textVal} onChange={e => setTextVal(e.target.value)}
                placeholder={q.placeholder} rows={4}
                style={{ width: "100%", padding: "1rem 1.2rem", background: T.card, border: `1px solid ${textVal ? T.selBorder : T.cardBorder}`, borderRadius: 14, fontSize: "0.88rem", color: T.text, resize: "none", outline: "none", lineHeight: 1.8, fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box", transition: "border-color 0.2s", caretColor: T.accent }}
              />
              <span style={{ position: "absolute", bottom: "0.65rem", right: "0.9rem", color: T.textDim, fontSize: "0.68rem" }}>
                {textVal.length > 0 ? `${textVal.length} chars` : "Share freely"}
              </span>
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: "0.75rem 1.5rem 1.75rem", maxWidth: 620, margin: "0 auto", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", boxSizing: "border-box", position: "relative", zIndex: 2 }}>
        <button onClick={goBack} disabled={phase === "gateway" && qIdx === 0}
          style={{ padding: "0.65rem 1.1rem", borderRadius: 10, background: "transparent", border: `1px solid ${phase === "gateway" && qIdx === 0 ? "transparent" : "rgba(255,255,255,0.1)"}`, color: phase === "gateway" && qIdx === 0 ? "transparent" : T.textMuted, cursor: phase === "gateway" && qIdx === 0 ? "default" : "pointer", fontSize: "0.8rem", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" }}>
          ← Back
        </button>
        <button onClick={goNext}
          onMouseEnter={e => { if (btnActive) (e.currentTarget.style.transform = "scale(1.03)"); }}
          onMouseLeave={e => { (e.currentTarget.style.transform = "scale(1)"); }}
          style={{ padding: "0.8rem 1.8rem", borderRadius: 50, background: btnActive ? T.accent : "rgba(255,255,255,0.06)", border: `1px solid ${btnActive ? "transparent" : "rgba(255,255,255,0.08)"}`, color: btnActive ? "#0a0a0a" : T.textDim, cursor: "pointer", fontSize: "0.87rem", fontWeight: 600, fontFamily: "'DM Sans', sans-serif", transition: "all 0.22s ease", boxShadow: btnActive ? `0 4px 24px ${T.accent}42` : "none", letterSpacing: "0.02em" }}>
          {canSkip && !textVal.trim() ? "Skip →" : phase === "shared" && qIdx === SHARED.length - 1 ? "Next →" : "Continue →"}
        </button>
      </div>
      <style>{`*{box-sizing:border-box}body{margin:0}::placeholder{color:rgba(255,255,255,0.16)}textarea{scrollbar-width:none}`}</style>
    </div>
  );
}
