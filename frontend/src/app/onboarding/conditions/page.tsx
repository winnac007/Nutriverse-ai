"use client";

import React, { CSSProperties, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import api from "@/lib/api";

const BG = "#F5EFE2";
const GREEN = "#3D5C3E";
const DARK = "#2D4530";
const MUTED = "#6F806F";
const CARD = "#FFFDF8";
const LINE = "#E6DDCA";
const SAGE = "#E7E7D7";
const CLAY = "#B96545";

type Option = {
  id: string;
  label: string;
  sub?: string;
};

type Step = {
  id: string;
  phase: string;
  title: string;
  sub: string;
  field?: string;
  type: "single" | "multi" | "input" | "review";
  options?: Option[];
  required?: boolean;
  max?: number;
  placeholder?: string;
  inputType?: "text" | "number";
  unit?: string;
};

type Answers = Record<string, string | string[]>;

const COUNTRIES: Option[] = [
  { id: "India", label: "India" },
  { id: "United States", label: "United States" },
  { id: "United Kingdom", label: "United Kingdom" },
  { id: "Canada", label: "Canada" },
  { id: "Australia", label: "Australia" },
  { id: "United Arab Emirates", label: "United Arab Emirates" },
  { id: "Singapore", label: "Singapore" },
  { id: "Other", label: "Other" },
];

const AGE_RANGES: Option[] = [
  { id: "under-18", label: "Under 18" },
  { id: "18-24", label: "18-24" },
  { id: "25-34", label: "25-34" },
  { id: "35-44", label: "35-44" },
  { id: "45-54", label: "45-54" },
  { id: "55-plus", label: "55+" },
];

const GENDERS: Option[] = [
  { id: "female", label: "Female" },
  { id: "male", label: "Male" },
  { id: "other", label: "Other" },
  { id: "prefer-not", label: "Prefer not to say" },
];

const JOURNEYS: Option[] = [
  {
    id: "heal",
    label: "Heal & Restore",
    sub: "Support for health conditions, symptoms and overall wellbeing.",
  },
  {
    id: "strength",
    label: "Strength & Fuel",
    sub: "Support for fitness, energy, performance and body composition goals.",
  },
];

const HEALTH_CONTEXT: Option[] = [
  { id: "diagnosed", label: "I have a diagnosed condition" },
  { id: "symptoms", label: "I've been noticing symptoms or concerns" },
];

const CONDITIONS: Option[] = [
  { id: "diabetes", label: "Type 2 Diabetes" },
  { id: "prediabetes", label: "Prediabetes" },
  { id: "insulin-resistance", label: "Insulin Resistance" },
  { id: "pcos", label: "Polycystic Ovary Syndrome (PCOS)" },
  { id: "thyroid", label: "Hypothyroidism" },
  { id: "hyperthyroid", label: "Hyperthyroidism" },
  { id: "hypertension", label: "Hypertension" },
  { id: "high-cholesterol", label: "High Cholesterol" },
  { id: "fatty-liver", label: "Fatty Liver" },
  { id: "ibs", label: "IBS" },
  { id: "gerd", label: "GERD" },
  { id: "anemia", label: "Anemia" },
  { id: "kidney-disease", label: "Kidney Disease" },
  { id: "heart-disease", label: "Heart Disease" },
  { id: "autoimmune", label: "Autoimmune Conditions" },
  { id: "pregnancy-postpartum", label: "Pregnancy & Postpartum" },
  { id: "menopause", label: "Menopause" },
  { id: "endometriosis", label: "Endometriosis" },
  { id: "obesity", label: "Obesity" },
];

const CONDITION_SYMPTOMS: Record<string, Option[]> = {
  pcos: [
    { id: "fatigue", label: "Fatigue" },
    { id: "sugar-cravings", label: "Sugar Cravings" },
    { id: "difficulty-losing-weight", label: "Difficulty Losing Weight" },
    { id: "irregular-periods", label: "Irregular Periods" },
    { id: "acne", label: "Acne" },
    { id: "hair-fall", label: "Hair Fall" },
    { id: "none", label: "None of these" },
  ],
  diabetes: [
    { id: "energy-crashes", label: "Energy Crashes" },
    { id: "excessive-hunger", label: "Excessive Hunger" },
    { id: "sugar-cravings", label: "Sugar Cravings" },
    { id: "blood-sugar-difficulty", label: "Difficulty Managing Blood Sugar" },
    { id: "none", label: "None of these" },
  ],
};

const GENERAL_CONDITION_SYMPTOMS: Option[] = [
  { id: "fatigue", label: "Fatigue" },
  { id: "sugar-cravings", label: "Sugar Cravings" },
  { id: "difficulty-losing-weight", label: "Difficulty Losing Weight" },
  { id: "low-energy", label: "Low Energy" },
  { id: "bloating", label: "Bloating" },
  { id: "poor-sleep", label: "Poor Sleep" },
  { id: "none", label: "None of these" },
];

const SYMPTOMS: Option[] = [
  { id: "acidity-heartburn", label: "Acidity / Heartburn", sub: "Digestive health" },
  { id: "bloating", label: "Bloating", sub: "Digestive health" },
  { id: "heavy-stomach", label: "Heavy Stomach", sub: "Digestive health" },
  { id: "gas", label: "Gas", sub: "Digestive health" },
  { id: "indigestion", label: "Indigestion", sub: "Digestive health" },
  { id: "constipation", label: "Constipation", sub: "Digestive health" },
  { id: "diarrhea", label: "Diarrhea", sub: "Digestive health" },
  { id: "food-sensitivities", label: "Food Sensitivities", sub: "Digestive health" },
  { id: "nausea", label: "Nausea", sub: "Digestive health" },
  { id: "fatigue", label: "Fatigue", sub: "Energy & mental well-being" },
  { id: "low-energy", label: "Low Energy", sub: "Energy & mental well-being" },
  { id: "brain-fog", label: "Brain Fog", sub: "Energy & mental well-being" },
  { id: "poor-concentration", label: "Poor Concentration", sub: "Energy & mental well-being" },
  { id: "stress-eating", label: "Stress Eating", sub: "Energy & mental well-being" },
  { id: "mood-swings", label: "Mood Swings", sub: "Energy & mental well-being" },
  { id: "food-anxiety", label: "Anxiety Around Food", sub: "Energy & mental well-being" },
  { id: "poor-sleep", label: "Poor Sleep", sub: "Sleep & recovery" },
  { id: "difficulty-falling-asleep", label: "Difficulty Falling Asleep", sub: "Sleep & recovery" },
  { id: "waking-up-tired", label: "Waking Up Tired", sub: "Sleep & recovery" },
  { id: "unexplained-weight-gain", label: "Unexplained Weight Gain", sub: "Weight & metabolism" },
  { id: "difficulty-losing-weight", label: "Difficulty Losing Weight", sub: "Weight & metabolism" },
  { id: "excessive-hunger", label: "Excessive Hunger", sub: "Weight & metabolism" },
  { id: "sugar-cravings", label: "Sugar Cravings", sub: "Weight & metabolism" },
  { id: "energy-crashes", label: "Frequent Energy Crashes", sub: "Weight & metabolism" },
  { id: "hair-fall", label: "Hair Fall", sub: "Skin, hair & hormones" },
  { id: "acne", label: "Acne", sub: "Skin, hair & hormones" },
  { id: "irregular-periods", label: "Irregular Periods", sub: "Skin, hair & hormones" },
  { id: "pms", label: "PMS Symptoms", sub: "Skin, hair & hormones" },
  { id: "facial-hair-growth", label: "Facial Hair Growth", sub: "Skin, hair & hormones" },
  { id: "headaches", label: "Frequent Headaches", sub: "General concerns" },
  { id: "low-immunity", label: "Low Immunity", sub: "General concerns" },
  { id: "inflammation", label: "Inflammation", sub: "General concerns" },
  { id: "joint-pain", label: "Joint Pain", sub: "General concerns" },
  { id: "general-wellness", label: "General Wellness Improvement", sub: "General concerns" },
];

const FITNESS_GOALS: Option[] = [
  { id: "healthy-weight-loss", label: "Healthy Weight Loss" },
  { id: "healthy-weight-gain", label: "Healthy Weight Gain" },
  { id: "building-strength", label: "Building Strength" },
  { id: "better-energy", label: "Better Energy" },
  { id: "better-stamina", label: "Better Stamina & Endurance" },
  { id: "better-recovery", label: "Better Recovery" },
  { id: "better-sleep", label: "Better Sleep" },
  { id: "better-digestion", label: "Better Digestion" },
  { id: "everyday-wellness", label: "Everyday Wellness" },
  { id: "healthier-eating", label: "Healthier Eating Habits" },
  { id: "athletic-performance", label: "Improved Athletic Performance" },
  { id: "healthy-aging", label: "Healthy Aging & Longevity" },
  { id: "not-sure", label: "I'm not sure yet" },
];

const NARROW_GOALS: Option[] = [
  { id: "more-energy", label: "Having more energy" },
  { id: "healthier-overall", label: "Feeling healthier overall" },
  { id: "sleeping-better", label: "Sleeping better" },
  { id: "feeling-stronger", label: "Feeling stronger" },
  { id: "losing-weight", label: "Losing weight" },
  { id: "gaining-weight", label: "Gaining healthy weight" },
  { id: "improving-fitness", label: "Improving my fitness" },
  { id: "healthier-habits", label: "Building healthier eating habits" },
  { id: "improving-digestion", label: "Improving digestion" },
  { id: "recovering-better", label: "Recovering better after activity" },
  { id: "food-confidence", label: "Feeling more confident in my food choices" },
  { id: "healthier-lifestyle", label: "I just want a healthier lifestyle" },
];

const TRAINING_FREQUENCY: Option[] = [
  { id: "rarely", label: "Rarely" },
  { id: "1-2", label: "1-2 times per week" },
  { id: "3-4", label: "3-4 times per week" },
  { id: "5-plus", label: "5+ times per week" },
];

const MOVEMENT: Option[] = [
  { id: "strength-training", label: "Strength Training" },
  { id: "running-cardio", label: "Running / Cardio" },
  { id: "sports", label: "Sports" },
  { id: "yoga", label: "Yoga" },
  { id: "walking", label: "Walking" },
  { id: "mixed", label: "A mix of different activities" },
];

const DIETS: Option[] = [
  { id: "vegetarian", label: "Vegetarian" },
  { id: "eggetarian", label: "Eggetarian" },
  { id: "non-vegetarian", label: "Non vegetarian" },
  { id: "vegan", label: "Vegan" },
];

const FOODS_TO_ENJOY: Option[] = [
  "Rice", "Roti", "Paneer", "Eggs", "Chicken", "Fish", "Fruits", "Dairy", "Millets", "Nuts & Seeds", "Surprise Me",
].map((label) => ({ id: slug(label), label }));

const FOODS_TO_AVOID: Option[] = [
  "Dairy", "Gluten", "Soy", "Eggs", "Seafood", "Nuts", "None",
].map((label) => ({ id: slug(label), label }));

const CUISINES: Option[] = [
  "Indian", "Mediterranean", "East Asian", "Southeast Asian", "Middle Eastern", "European", "Latin American", "North American", "African", "I enjoy a variety of cuisines",
].map((label) => ({ id: slug(label), label }));

const MEAL_PREP: Option[] = [
  { id: "daily", label: "Daily" },
  { id: "few-times-week", label: "A few times a week" },
  { id: "rarely", label: "Rarely" },
  { id: "almost-never", label: "Almost never" },
];

const DAY_ACTIVITY: Option[] = [
  { id: "sedentary", label: "Mostly sitting" },
  { id: "light", label: "Lightly active" },
  { id: "moderate", label: "Moderately active" },
  { id: "very_active", label: "Very active" },
];

const SLEEP: Option[] = [
  { id: "less-than-5", label: "Less than 5 hours" },
  { id: "5-6", label: "5-6 hours" },
  { id: "7-8", label: "7-8 hours" },
  { id: "more-than-8", label: "More than 8 hours" },
];

const WATER: Option[] = [
  { id: "less-than-1l", label: "Less than 1L" },
  { id: "1-2l", label: "1-2L" },
  { id: "2-3l", label: "2-3L" },
  { id: "more-than-3l", label: "More than 3L" },
];

const MEAL_TIMING: Option[] = [
  { id: "almost-always", label: "Almost always" },
  { id: "most-days", label: "Most days" },
  { id: "not-really", label: "Not really" },
];

const DAY_TYPE: Option[] = [
  { id: "desk-job", label: "Desk Job" },
  { id: "student", label: "Student" },
  { id: "shift-worker", label: "Shift Worker" },
  { id: "physical-job", label: "Physically Active Job" },
  { id: "homemaker", label: "Homemaker" },
];

const EAT_OUT: Option[] = [
  { id: "rarely", label: "Rarely" },
  { id: "1-2-week", label: "1-2 times a week" },
  { id: "3-5-week", label: "3-5 times a week" },
  { id: "most-meals", label: "Most meals" },
];

const FREQUENCY: Option[] = [
  { id: "never", label: "Never" },
  { id: "sometimes", label: "Sometimes" },
  { id: "often", label: "Often" },
];

function slug(label: string) {
  return label.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function selectedLabels(options: Option[], ids: string[]) {
  return ids.map((id) => options.find((o) => o.id === id)?.label || id);
}

function asArray(value: string | string[] | undefined) {
  return Array.isArray(value) ? value : [];
}

function asString(value: string | string[] | undefined) {
  return typeof value === "string" ? value : "";
}

function compactLabel(value: string | string[] | undefined, options: Option[]) {
  const id = asString(value);
  return options.find((o) => o.id === id)?.label || id || "Not answered";
}

function ageFromRange(range: string) {
  const map: Record<string, number> = {
    "under-18": 17,
    "18-24": 21,
    "25-34": 30,
    "35-44": 40,
    "45-54": 50,
    "55-plus": 58,
  };
  return map[range];
}

function isDigestive(symptoms: string[]) {
  return symptoms.some((s) => ["acidity-heartburn", "bloating", "heavy-stomach", "gas", "indigestion", "constipation", "diarrhea", "food-sensitivities", "nausea", "better-digestion", "improving-digestion"].includes(s));
}

function deriveConditions(answers: Answers) {
  const journey = asString(answers.journey);
  const healthContext = asString(answers.healthContext);
  if (journey === "heal" && healthContext === "diagnosed") {
    const selected = asArray(answers.conditions).filter((id) => id !== "none");
    return selected.length ? selected : ["general"];
  }
  if (journey === "heal") {
    const symptoms = asArray(answers.symptoms);
    if (symptoms.some((s) => ["irregular-periods", "pms", "facial-hair-growth", "acne", "hair-fall"].includes(s))) return ["pcos"];
    if (isDigestive(symptoms)) return ["gut-health"];
    if (symptoms.some((s) => ["sugar-cravings", "energy-crashes", "excessive-hunger", "difficulty-losing-weight", "unexplained-weight-gain"].includes(s))) return ["prediabetes"];
    return ["anti-inflammatory"];
  }
  const goals = [...asArray(answers.fitnessGoals), ...asArray(answers.narrowGoals)];
  if (isDigestive(goals)) return ["gut-health"];
  if (goals.some((g) => ["healthy-weight-loss", "losing-weight"].includes(g))) return ["weight-management"];
  return ["general"];
}

function deriveGoal(answers: Answers) {
  const goals = [...asArray(answers.fitnessGoals), ...asArray(answers.narrowGoals)].filter((g) => g !== "not-sure");
  if (goals.length) return selectedLabels([...FITNESS_GOALS, ...NARROW_GOALS], goals).join(", ");
  const symptoms = asArray(answers.symptoms);
  if (symptoms.length) return `Improve ${selectedLabels(SYMPTOMS, symptoms.slice(0, 2)).join(" and ")}`;
  const conditions = asArray(answers.conditions);
  if (conditions.length) return `Support ${selectedLabels(CONDITIONS, conditions.slice(0, 2)).join(" and ")}`;
  return "Feel healthier";
}

function cookingAbility(mealPrep: string) {
  if (mealPrep === "daily") return "advanced";
  if (mealPrep === "few-times-week") return "intermediate";
  return "beginner";
}

function ButtonIcon({ active }: { active: boolean }) {
  return (
    <span
      style={{
        width: 20,
        height: 20,
        borderRadius: "50%",
        border: active ? `2px solid ${GREEN}` : "1.5px solid #D4CAB8",
        background: active ? GREEN : "transparent",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {active && (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.2">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </span>
  );
}

function ProgressBar({ index, total }: { index: number; total: number }) {
  const pct = Math.max(4, Math.round(((index + 1) / total) * 100));
  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ height: 4, background: "#D7CDBA", borderRadius: 999, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: GREEN, borderRadius: 999, transition: "width 0.25s" }} />
      </div>
    </div>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: BG,
        fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: 520, minHeight: "100vh", background: BG, display: "flex", flexDirection: "column" }}>
        {children}
      </div>
    </div>
  );
}

function Header({ step, index, total, onBack }: { step: Step; index: number; total: number; onBack: () => void }) {
  return (
    <div style={{ padding: "18px 24px 0" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <button onClick={onBack} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 4 }}>
          <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke={DARK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        <span style={{ color: MUTED, fontSize: 12, fontWeight: 600 }}>
          {index + 1} of {total}
        </span>
      </div>
      <ProgressBar index={index} total={total} />
      <p style={{ margin: "24px 0 8px", color: CLAY, fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase" }}>
        {step.phase}
      </p>
      <h1
        style={{
          margin: 0,
          fontFamily: "var(--font-playfair), 'Playfair Display', serif",
          fontSize: 31,
          lineHeight: 1.12,
          color: DARK,
          fontWeight: 500,
        }}
      >
        {step.title}
      </h1>
      <p style={{ margin: "10px 0 0", color: MUTED, fontSize: 14, lineHeight: 1.55 }}>{step.sub}</p>
    </div>
  );
}

function OptionButton({ option, active, onClick, subMuted = false }: { option: Option; active: boolean; onClick: () => void; subMuted?: boolean }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 14,
        width: "100%",
        border: active ? `1.5px solid ${GREEN}` : `1px solid ${LINE}`,
        background: active ? "rgba(61,92,62,0.065)" : CARD,
        borderRadius: 16,
        padding: "14px 15px",
        cursor: "pointer",
        fontFamily: "inherit",
        textAlign: "left",
        boxShadow: active ? "0 8px 24px rgba(61,92,62,0.08)" : "0 1px 6px rgba(31,46,31,0.035)",
        transition: "border-color 0.18s, background 0.18s, box-shadow 0.18s",
      }}
    >
      <span>
        <span style={{ display: "block", color: DARK, fontSize: 15, fontWeight: 650 }}>{option.label}</span>
        {option.sub && (
          <span style={{ display: "block", marginTop: 4, color: subMuted ? "#8F9C8F" : MUTED, fontSize: 12.5, lineHeight: 1.35 }}>
            {option.sub}
          </span>
        )}
      </span>
      <ButtonIcon active={active} />
    </button>
  );
}

function InputStep({ step, value, onChange }: { step: Step; value: string; onChange: (value: string) => void }) {
  return (
    <div style={{ position: "relative" }}>
      <input
        type={step.inputType || "text"}
        inputMode={step.inputType === "number" ? "decimal" : "text"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={step.placeholder}
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: step.unit ? "17px 54px 17px 18px" : "17px 18px",
          background: CARD,
          color: DARK,
          border: `1px solid ${LINE}`,
          borderRadius: 18,
          fontSize: 18,
          outline: "none",
          fontFamily: "inherit",
        }}
      />
      {step.unit && (
        <span style={{ position: "absolute", right: 18, top: "50%", transform: "translateY(-50%)", color: MUTED, fontSize: 13 }}>
          {step.unit}
        </span>
      )}
    </div>
  );
}

export default function OnboardingQuestionnaire() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [answers, setAnswers] = useState<Answers>({});
  const [index, setIndex] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const selectedConditions = asArray(answers.conditions);
  const diagnosedSymptomOptions = useMemo(() => {
    if (selectedConditions.includes("pcos")) return CONDITION_SYMPTOMS.pcos;
    if (selectedConditions.some((id) => ["diabetes", "prediabetes", "insulin-resistance"].includes(id))) return CONDITION_SYMPTOMS.diabetes;
    return GENERAL_CONDITION_SYMPTOMS;
  }, [selectedConditions]);

  const steps = useMemo<Step[]>(() => {
    const journey = asString(answers.journey);
    const healthContext = asString(answers.healthContext);
    const fitnessGoals = asArray(answers.fitnessGoals);
    return [
      { id: "country", phase: "About you", title: "Where are you currently based?", sub: "This helps us adapt foods, cuisine cues and grocery suggestions.", field: "country", type: "single", options: COUNTRIES, required: true },
      { id: "ageRange", phase: "About you", title: "How old are you?", sub: "Choose the range that fits you best.", field: "ageRange", type: "single", options: AGE_RANGES, required: true },
      { id: "gender", phase: "About you", title: "How do you identify?", sub: "Used only to tune nutrition estimates and health context.", field: "gender", type: "single", options: GENDERS, required: true },
      { id: "height", phase: "About you", title: "Your height?", sub: "An approximate value is enough.", field: "heightCm", type: "input", inputType: "number", placeholder: "165", unit: "cm", required: true },
      { id: "weight", phase: "About you", title: "Current weight?", sub: "This helps calculate your starter targets.", field: "weightKg", type: "input", inputType: "number", placeholder: "65", unit: "kg", required: true },
      { id: "journey", phase: "Your journey", title: "What brings you to ZenPlato today?", sub: "Pick the path that best matches what you need right now.", field: "journey", type: "single", options: JOURNEYS, required: true },
      ...(journey === "heal" ? [
        { id: "healthContext", phase: "Heal & Restore", title: "Tell us a little about your health.", sub: "Which feels most like you?", field: "healthContext", type: "single", options: HEALTH_CONTEXT, required: true },
        ...(healthContext === "diagnosed" ? [
          { id: "conditions", phase: "Heal & Restore", title: "Which conditions are part of your journey today?", sub: "Select all that apply.", field: "conditions", type: "multi", options: CONDITIONS, required: true },
          { id: "diagnosedSymptoms", phase: "Heal & Restore", title: "Are any of these affecting you right now?", sub: "Select what applies, or choose none of these.", field: "diagnosedSymptoms", type: "multi", options: diagnosedSymptomOptions, required: false },
        ] : []),
        ...(healthContext === "symptoms" ? [
          { id: "symptoms", phase: "Heal & Restore", title: "What have you been experiencing lately?", sub: "Select all symptoms or concerns that apply.", field: "symptoms", type: "multi", options: SYMPTOMS, required: true },
        ] : []),
      ] as Step[] : []),
      ...(journey === "strength" ? [
        { id: "fitnessGoals", phase: "Strength & Fuel", title: "What would you like to improve right now?", sub: "Choose up to 2.", field: "fitnessGoals", type: "multi", options: FITNESS_GOALS, required: true, max: 2 },
        ...(fitnessGoals.includes("not-sure") ? [
          { id: "narrowGoals", phase: "Strength & Fuel", title: "Let's help narrow it down.", sub: "Which of these would make the biggest difference in your life right now? Choose up to 2.", field: "narrowGoals", type: "multi", options: NARROW_GOALS, required: true, max: 2 },
        ] : []),
        { id: "trainingFrequency", phase: "Strength & Fuel", title: "How often do you train?", sub: "This includes workouts, sport, classes or structured activity.", field: "trainingFrequency", type: "single", options: TRAINING_FREQUENCY, required: true },
        { id: "movement", phase: "Strength & Fuel", title: "What kind of movement do you enjoy?", sub: "Pick the one that sounds most like your routine.", field: "movement", type: "single", options: MOVEMENT, required: true },
      ] as Step[] : []),
      { id: "diet", phase: "Food preferences", title: "What best describes your diet?", sub: "We will keep recipes aligned with this choice.", field: "dietaryType", type: "single", options: DIETS, required: true },
      { id: "foodsEnjoy", phase: "Food preferences", title: "What foods would you enjoy seeing in your recipes?", sub: "Select all that apply.", field: "foodsEnjoy", type: "multi", options: FOODS_TO_ENJOY, required: true },
      { id: "foodsAvoid", phase: "Food preferences", title: "Are there any foods you'd prefer to avoid?", sub: "Select all that apply.", field: "foodsAvoid", type: "multi", options: FOODS_TO_AVOID, required: false },
      { id: "cuisines", phase: "Food preferences", title: "Which cuisines do you enjoy most?", sub: "Select every cuisine you would like in your plan.", field: "cuisines", type: "multi", options: CUISINES, required: true },
      { id: "mealPrep", phase: "Lifestyle", title: "How often do you prepare your own meals?", sub: "This helps us choose practical recipes.", field: "mealPrep", type: "single", options: MEAL_PREP, required: true },
      { id: "dayActivity", phase: "Lifestyle", title: "How active does your day usually feel?", sub: "Think about your full day, not only exercise.", field: "dayActivity", type: "single", options: DAY_ACTIVITY, required: true },
      { id: "sleep", phase: "Lifestyle", title: "How much sleep do you usually get?", sub: "A consistent estimate is enough.", field: "sleep", type: "single", options: SLEEP, required: true },
      { id: "water", phase: "Lifestyle", title: "How much water do you usually drink in a day?", sub: "Choose the closest range.", field: "water", type: "single", options: WATER, required: true },
      { id: "mealTiming", phase: "Lifestyle", title: "Do your meals usually happen around the same time each day?", sub: "Meal rhythm can influence cravings, energy and digestion.", field: "mealTiming", type: "single", options: MEAL_TIMING, required: true },
      { id: "dayType", phase: "Lifestyle", title: "What best describes your day?", sub: "Pick the option that feels closest.", field: "dayType", type: "single", options: DAY_TYPE, required: true },
      { id: "eatOut", phase: "Lifestyle", title: "How often do you eat out or order food?", sub: "No judgment, this just shapes your action plan.", field: "eatOut", type: "single", options: EAT_OUT, required: true },
      { id: "distractedEating", phase: "Mindful eating", title: "I often eat while doing something else.", sub: "Choose the answer that feels most honest.", field: "distractedEating", type: "single", options: FREQUENCY, required: true },
      { id: "stressEating", phase: "Mindful eating", title: "I sometimes eat when I'm feeling stressed.", sub: "This helps us tune coaching and habit suggestions.", field: "stressEating", type: "single", options: FREQUENCY, required: true },
      { id: "skippedMeals", phase: "Mindful eating", title: "I sometimes skip meals.", sub: "This affects energy, hunger and meal planning.", field: "skippedMeals", type: "single", options: FREQUENCY, required: true },
      { id: "review", phase: "Results", title: "Your ZenPlato report preview", sub: "We will now build your nutrition profile and ebook summary.", type: "review" },
    ];
  }, [answers, diagnosedSymptomOptions]);

  const step = steps[Math.min(index, steps.length - 1)];

  const setField = (field: string, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
  };

  const toggleMulti = (field: string, id: string, max?: number) => {
    const current = asArray(answers[field]);
    if (id === "none") {
      setField(field, current.includes("none") ? [] : ["none"]);
      return;
    }
    const withoutNone = current.filter((item) => item !== "none");
    if (withoutNone.includes(id)) {
      setField(field, withoutNone.filter((item) => item !== id));
      return;
    }
    const next = max && withoutNone.length >= max ? [...withoutNone.slice(1), id] : [...withoutNone, id];
    setField(field, next);
  };

  const isStepComplete = (s: Step) => {
    if (!s.required || !s.field) return true;
    const value = answers[s.field];
    return Array.isArray(value) ? value.length > 0 : Boolean(value);
  };

  const back = () => {
    if (index === 0) router.push("/onboarding");
    else setIndex((i) => Math.max(0, i - 1));
  };

  const next = () => setIndex((i) => Math.min(steps.length - 1, i + 1));

  const submit = async () => {
    setGenerating(true);
    setError("");
    const conditions = deriveConditions(answers);
    const foodsAvoid = asArray(answers.foodsAvoid).filter((item) => item !== "none");
    const preferences = {
      journey: asString(answers.journey),
      foods_enjoy: selectedLabels(FOODS_TO_ENJOY, asArray(answers.foodsEnjoy)),
      cuisines: selectedLabels(CUISINES, asArray(answers.cuisines)),
      meal_prep: compactLabel(answers.mealPrep, MEAL_PREP),
      sleep: compactLabel(answers.sleep, SLEEP),
      water: compactLabel(answers.water, WATER),
      meal_timing: compactLabel(answers.mealTiming, MEAL_TIMING),
      day_type: compactLabel(answers.dayType, DAY_TYPE),
      eat_out: compactLabel(answers.eatOut, EAT_OUT),
      mindful_eating: {
        distracted_eating: compactLabel(answers.distractedEating, FREQUENCY),
        stress_eating: compactLabel(answers.stressEating, FREQUENCY),
        skipped_meals: compactLabel(answers.skippedMeals, FREQUENCY),
      },
      fitness: {
        goals: selectedLabels(FITNESS_GOALS, asArray(answers.fitnessGoals)),
        narrowed_goals: selectedLabels(NARROW_GOALS, asArray(answers.narrowGoals)),
        training_frequency: compactLabel(answers.trainingFrequency, TRAINING_FREQUENCY),
        movement: compactLabel(answers.movement, MOVEMENT),
      },
    };

    try {
      await api.post("/ai/onboarding/generate-plan", {
        category: asString(answers.journey),
        country: asString(answers.country),
        location: asString(answers.country),
        conditions,
        condition_answers: answers,
        dietary_type: asString(answers.dietaryType) || "non-vegetarian",
        allergies: selectedLabels(FOODS_TO_AVOID, foodsAvoid),
        cooking_ability: cookingAbility(asString(answers.mealPrep)),
        budget: "medium",
        goal_30day: deriveGoal(answers),
        age: ageFromRange(asString(answers.ageRange)),
        gender: asString(answers.gender) || undefined,
        weight_kg: asString(answers.weightKg) ? parseFloat(asString(answers.weightKg)) : undefined,
        height_cm: asString(answers.heightCm) ? parseFloat(asString(answers.heightCm)) : undefined,
        activity_level: asString(answers.dayActivity) || undefined,
        preferences,
      });
      await refresh();
      router.push("/app/ebook");
    } catch (e: any) {
      setError(e?.response?.data?.detail || "Something went wrong. Please try again.");
      setGenerating(false);
    }
  };

  if (generating) {
    return (
      <PageShell>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "42px 28px", textAlign: "center" }}>
          <div style={{ width: 76, height: 76, borderRadius: "50%", background: SAGE, display: "grid", placeItems: "center", marginBottom: 24 }}>
            <svg width="44" height="44" viewBox="0 0 64 64" fill="none">
              <path d="M32 8 C32 22 32 30 32 42" stroke={GREEN} strokeWidth="3" strokeLinecap="round">
                <animateTransform attributeName="transform" type="rotate" from="0 32 32" to="360 32 32" dur="1.8s" repeatCount="indefinite" />
              </path>
              <path d="M22 42 H42 C41 53 35 58 32 58 C29 58 23 53 22 42Z" fill={GREEN} />
              <path d="M32 28 C24 24 21 17 21 10 C29 13 33 19 32 28Z" fill={GREEN} fillOpacity="0.68" />
              <path d="M32 28 C40 24 43 17 43 10 C35 13 31 19 32 28Z" fill={GREEN} />
            </svg>
          </div>
          <h2 style={{ margin: 0, fontFamily: "var(--font-playfair), 'Playfair Display', serif", color: DARK, fontSize: 27, fontWeight: 500 }}>
            Building your nutrition profile
          </h2>
          <p style={{ margin: "12px 0 0", maxWidth: 340, color: MUTED, fontSize: 14, lineHeight: 1.6 }}>
            Understanding your habits, preferences and goals so your ebook preview starts with the right context.
          </p>
          {error && (
            <div style={{ marginTop: 22, padding: "14px 16px", background: "#F7E4DC", border: "1px solid #E6B9A7", borderRadius: 14, color: "#8F3E28", fontSize: 13 }}>
              {error}
              <button onClick={submit} style={{ display: "block", margin: "12px auto 0", background: GREEN, color: "#fff", border: "none", borderRadius: 999, padding: "9px 18px", cursor: "pointer" }}>
                Try again
              </button>
            </div>
          )}
        </div>
      </PageShell>
    );
  }

  const field = step.field;
  const canContinue = isStepComplete(step);
  const optionGridStyle: CSSProperties = step.id === "symptoms" || step.id === "conditions"
    ? { display: "grid", gridTemplateColumns: "1fr", gap: 9 }
    : { display: "flex", flexDirection: "column", gap: 10 };

  return (
    <PageShell>
      <Header step={step} index={index} total={steps.length} onBack={back} />
      <div style={{ padding: "22px 20px 14px", flex: 1, overflowY: "auto" }}>
        {step.type === "single" && field && step.options && (
          <div style={optionGridStyle}>
            {step.options.map((option) => (
              <OptionButton
                key={option.id}
                option={option}
                active={asString(answers[field]) === option.id}
                onClick={() => setField(field, option.id)}
                subMuted
              />
            ))}
          </div>
        )}

        {step.type === "multi" && field && step.options && (
          <>
            {step.max && (
              <p style={{ margin: "0 0 12px", color: MUTED, fontSize: 12 }}>
                {asArray(answers[field]).length} of {step.max} selected
              </p>
            )}
            <div style={optionGridStyle}>
              {step.options.map((option) => (
                <OptionButton
                  key={option.id}
                  option={option}
                  active={asArray(answers[field]).includes(option.id)}
                  onClick={() => toggleMulti(field, option.id, step.max)}
                  subMuted
                />
              ))}
            </div>
          </>
        )}

        {step.type === "input" && field && (
          <InputStep step={step} value={asString(answers[field])} onChange={(value) => setField(field, value)} />
        )}

        {step.type === "review" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { label: "Key findings", value: deriveGoal(answers) },
              { label: "Nutrition insights", value: `${compactLabel(answers.dietaryType, DIETS)} profile in ${compactLabel(answers.country, COUNTRIES)}` },
              { label: "Foods to prioritize", value: selectedLabels(FOODS_TO_ENJOY, asArray(answers.foodsEnjoy)).join(", ") || "Balanced whole foods" },
              { label: "Foods to limit", value: selectedLabels(FOODS_TO_AVOID, asArray(answers.foodsAvoid)).join(", ") || "No specific avoid list" },
              { label: "Starter action plan", value: `${compactLabel(answers.sleep, SLEEP)} sleep, ${compactLabel(answers.water, WATER)} water, ${compactLabel(answers.mealTiming, MEAL_TIMING).toLowerCase()} meal timing` },
            ].map((item) => (
              <div key={item.label} style={{ background: CARD, border: `1px solid ${LINE}`, borderRadius: 18, padding: "16px 17px" }}>
                <p style={{ margin: "0 0 6px", color: CLAY, fontSize: 11, fontWeight: 800, letterSpacing: "0.13em", textTransform: "uppercase" }}>{item.label}</p>
                <p style={{ margin: 0, color: DARK, fontSize: 15, lineHeight: 1.45 }}>{item.value}</p>
              </div>
            ))}
            <div style={{ background: "#2A2B22", color: "#F7F1E8", borderRadius: 20, padding: 18, marginTop: 6 }}>
              <p style={{ margin: "0 0 8px", color: "#C8B77B", fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase" }}>
                There is more beneath the surface
              </p>
              <p style={{ margin: 0, color: "rgba(247,241,232,0.72)", fontSize: 13.5, lineHeight: 1.55 }}>
                Your free preview will show the strongest starting signals. The premium blueprint unlocks deeper condition guidance, recipes, grocery lists, food swaps, lifestyle recommendations and a practical implementation guide.
              </p>
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: "16px 20px 28px" }}>
        <button
          onClick={step.type === "review" ? submit : next}
          disabled={!canContinue}
          style={{
            width: "100%",
            background: canContinue ? GREEN : "#BBC9BB",
            color: "#fff",
            border: "none",
            borderRadius: 999,
            padding: "16px 24px",
            fontSize: 15,
            fontWeight: 700,
            fontFamily: "inherit",
            cursor: canContinue ? "pointer" : "default",
            boxShadow: canContinue ? "0 8px 22px rgba(61,92,62,0.22)" : "none",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          {step.type === "review" ? "Generate My Ebook Preview" : "Continue"}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
        {error && <p style={{ margin: "12px 0 0", color: "#A33A24", fontSize: 12, textAlign: "center" }}>{error}</p>}
      </div>
    </PageShell>
  );
}
