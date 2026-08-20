"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import api from "@/lib/api";
import styles from "./Conditions.module.css";

const GREEN = "#3D5C3E";
const DARK = "#2D4530";

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
    <span className={`${styles.check} ${active ? styles.checkActive : ""}`}>
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
    <div className={styles.progressWrap}>
      <div className={styles.progressTrack}>
        <div className={styles.progressValue} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className={styles.page}>
      <aside className={styles.rail} aria-hidden="true">
        <div className={styles.railImage} />
        <div className={styles.railWash} />
        <div className={styles.railBotanical} />
        <div className={styles.railCopy}>
          <p className={styles.railBrand}>ZENPLATE</p>
          <div className={styles.railRule}><span>✦</span></div>
          <h2>A plan shaped<br />around you.</h2>
          <p>Your answers help us understand the food, rhythm, and support that fit your life.</p>
        </div>
      </aside>
      <div className={styles.shell}>
        {children}
      </div>
    </main>
  );
}

function Header({ step, index, total, onBack }: { step: Step; index: number; total: number; onBack: () => void }) {
  return (
    <header className={styles.header}>
      <div className={styles.headerTop}>
        <button type="button" onClick={onBack} className={styles.back} aria-label="Go to previous question">
          <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke={DARK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        <span className={styles.stepCount}>
          {index + 1} of {total}
        </span>
      </div>
      <ProgressBar index={index} total={total} />
      <p className={styles.phase}>{step.phase}</p>
      <h1>{step.title}</h1>
      <div className={styles.titleRule} aria-hidden="true"><span>✦</span></div>
      <p className={styles.subtitle}>{step.sub}</p>
    </header>
  );
}

function OptionButton({ option, active, onClick, subMuted = false }: { option: Option; active: boolean; onClick: () => void; subMuted?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`${styles.option} ${active ? styles.optionActive : ""}`}
    >
      <span className={styles.optionCopy}>
        <span className={styles.optionLabel}>{option.label}</span>
        {option.sub && (
          <span className={`${styles.optionSub} ${subMuted ? styles.optionSubMuted : ""}`}>
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
    <div className={styles.inputWrap}>
      <input
        type={step.inputType || "text"}
        inputMode={step.inputType === "number" ? "decimal" : "text"}
        aria-label={step.title}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={step.placeholder}
        className={step.unit ? styles.inputWithUnit : styles.input}
      />
      {step.unit && (
        <span className={styles.unit}>{step.unit}</span>
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
      router.push("/app");
    } catch (e: any) {
      setError(e?.response?.data?.detail || "Something went wrong. Please try again.");
      setGenerating(false);
    }
  };

  if (generating) {
    return (
      <PageShell>
        <div className={styles.generating} role="status" aria-live="polite">
          <div className={styles.generatingIcon}>
            <svg width="44" height="44" viewBox="0 0 64 64" fill="none">
              <path d="M32 8 C32 22 32 30 32 42" stroke={GREEN} strokeWidth="3" strokeLinecap="round">
                <animateTransform attributeName="transform" type="rotate" from="0 32 32" to="360 32 32" dur="1.8s" repeatCount="indefinite" />
              </path>
              <path d="M22 42 H42 C41 53 35 58 32 58 C29 58 23 53 22 42Z" fill={GREEN} />
              <path d="M32 28 C24 24 21 17 21 10 C29 13 33 19 32 28Z" fill={GREEN} fillOpacity="0.68" />
              <path d="M32 28 C40 24 43 17 43 10 C35 13 31 19 32 28Z" fill={GREEN} />
            </svg>
          </div>
          <h2>Building your nutrition profile</h2>
          <p>
            Understanding your habits, preferences and goals so your ebook preview starts with the right context.
          </p>
          {error && (
            <div className={styles.generatingError} role="alert">
              {error}
              <button type="button" onClick={submit}>
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
  const optionListClass = step.id === "symptoms" || step.id === "conditions"
    ? `${styles.optionList} ${styles.optionListDense}`
    : styles.optionList;

  return (
    <PageShell>
      <Header step={step} index={index} total={steps.length} onBack={back} />
      <div className={styles.content}>
        {step.type === "single" && field && step.options && (
          <div className={optionListClass}>
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
              <p className={styles.selectionCount}>
                {asArray(answers[field]).length} of {step.max} selected
              </p>
            )}
            <div className={optionListClass}>
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
          <div className={styles.review}>
            {[
              { label: "Key findings", value: deriveGoal(answers) },
              { label: "Nutrition insights", value: `${compactLabel(answers.dietaryType, DIETS)} profile in ${compactLabel(answers.country, COUNTRIES)}` },
              { label: "Foods to prioritize", value: selectedLabels(FOODS_TO_ENJOY, asArray(answers.foodsEnjoy)).join(", ") || "Balanced whole foods" },
              { label: "Foods to limit", value: selectedLabels(FOODS_TO_AVOID, asArray(answers.foodsAvoid)).join(", ") || "No specific avoid list" },
              { label: "Starter action plan", value: `${compactLabel(answers.sleep, SLEEP)} sleep, ${compactLabel(answers.water, WATER)} water, ${compactLabel(answers.mealTiming, MEAL_TIMING).toLowerCase()} meal timing` },
            ].map((item) => (
              <div key={item.label} className={styles.reviewCard}>
                <p className={styles.reviewLabel}>{item.label}</p>
                <p className={styles.reviewValue}>{item.value}</p>
              </div>
            ))}
            <div className={styles.previewNote}>
              <p className={styles.previewEyebrow}>
                There is more beneath the surface
              </p>
              <p className={styles.previewCopy}>
                Your free preview will show the strongest starting signals. The premium blueprint unlocks deeper condition guidance, recipes, grocery lists, food swaps, lifestyle recommendations and a practical implementation guide.
              </p>
            </div>
          </div>
        )}
      </div>

      <footer className={styles.footer}>
        <button
          type="button"
          onClick={step.type === "review" ? submit : next}
          disabled={!canContinue}
          className={styles.continue}
        >
          {step.type === "review" ? "Generate My Ebook Preview" : "Continue"}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
        {error && <p className={styles.submitError} role="alert">{error}</p>}
      </footer>
    </PageShell>
  );
}
