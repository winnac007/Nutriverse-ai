import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../components/ui/select";
import { Check, ChevronRight, Loader2, Sparkles } from "lucide-react";
import api from "../lib/api";
import { useAuth } from "../lib/auth";
import { toast } from "sonner";

// ── Health conditions ───────────────────────────────────────────────────────
const HEALTH_CONDITIONS = [
  { id: "diabetes",          label: "Diabetes",             emoji: "🩸", desc: "Blood sugar management" },
  { id: "heart-disease",     label: "Heart Health",         emoji: "❤️",  desc: "Cardiovascular wellness" },
  { id: "thyroid",           label: "Thyroid",              emoji: "🦋", desc: "Hypo / hyperthyroidism" },
  { id: "pcos",              label: "PCOS",                 emoji: "🌸", desc: "Hormonal balance" },
  { id: "weight-management", label: "Weight Management",   emoji: "⚖️",  desc: "Healthy weight goals" },
  { id: "gut-health",        label: "Gut Health",           emoji: "🌿", desc: "Digestive wellness" },
  { id: "kidney-disease",    label: "Kidney Health",        emoji: "💧", desc: "Kidney-friendly nutrition" },
  { id: "immunity",          label: "Immunity & Wellness",  emoji: "🛡️",  desc: "General health boost" },
];

// ── Condition-specific questions ────────────────────────────────────────────
const CONDITION_QUESTIONS = {
  diabetes: [
    { key: "type",       label: "What type of diabetes do you have?",            options: ["Type 1", "Type 2", "Pre-diabetes", "Not sure"] },
    { key: "control",    label: "How well is your blood sugar managed?",          options: ["Well controlled", "Needs improvement", "Newly diagnosed"] },
    { key: "medication", label: "Are you on diabetes medication or insulin?",     options: ["Yes", "No"] },
    { key: "concern",    label: "What's your main concern?",                      options: ["Blood sugar spikes", "Weight management", "Low energy", "All of these"] },
  ],
  "heart-disease": [
    { key: "type",       label: "What's your primary concern?",                   options: ["High blood pressure", "Heart disease", "Both", "Family history risk"] },
    { key: "severity",   label: "How would you describe your condition?",         options: ["Mild / managed well", "Moderate", "Severe", "Just precautionary"] },
    { key: "medication", label: "Are you on heart or BP medication?",             options: ["Yes", "No"] },
    { key: "sodium",     label: "Are you on a sodium-restricted diet?",           options: ["Strict restriction", "Moderate restriction", "Not yet"] },
  ],
  thyroid: [
    { key: "type",       label: "Which thyroid condition do you have?",           options: ["Hypothyroidism", "Hyperthyroidism", "Hashimoto's", "Not sure"] },
    { key: "medication", label: "Are you on thyroid medication?",                 options: ["Yes", "No"] },
    { key: "symptom",    label: "What's your biggest struggle?",                  options: ["Weight gain", "Weight loss", "Fatigue", "Brain fog / poor focus"] },
  ],
  pcos: [
    { key: "challenge",  label: "What's your main challenge with PCOS?",          options: ["Weight gain", "Irregular periods", "Hormonal acne", "Hair loss / thinning"] },
    { key: "insulin",    label: "Do you have or suspect insulin resistance?",     options: ["Yes, diagnosed", "I suspect it", "No / not sure"] },
    { key: "diet_pref",  label: "What's your dietary preference?",               options: ["Vegetarian", "Non-vegetarian", "Vegan"] },
  ],
  "weight-management": [
    { key: "goal",       label: "What's your weight goal?",                       options: ["Lose weight", "Maintain current weight", "Gain weight healthily"] },
    { key: "bmi",        label: "How would you describe your current weight?",    options: ["Underweight", "Normal weight", "Overweight", "Obese"] },
    { key: "activity",   label: "How active are you currently?",                  options: ["Very sedentary", "Lightly active", "Moderately active", "Very active"] },
  ],
  "gut-health": [
    { key: "issue",         label: "What's your primary gut issue?",              options: ["Bloating", "IBS / Irritable Bowel", "Acid reflux / GERD", "Constipation"] },
    { key: "intolerances",  label: "Do you have any food intolerances?",          options: ["None yet", "Lactose intolerant", "Gluten sensitive", "Multiple intolerances"] },
  ],
  "kidney-disease": [
    { key: "stage",      label: "What stage is your kidney condition?",           options: ["Early (Stage 1–2)", "Moderate (Stage 3)", "Advanced (Stage 4–5)", "Not sure"] },
    { key: "dialysis",   label: "Are you on dialysis?",                           options: ["Yes", "No"] },
    { key: "restriction",label: "What are you most restricted on?",               options: ["Potassium", "Phosphorus", "Protein", "All of the above"] },
  ],
  immunity: [
    { key: "goal",       label: "What's your primary health goal?",               options: ["Boost immunity", "Reduce inflammation", "Better energy levels", "General wellness"] },
  ],
};

// ── Goal options (dynamic by conditions) ────────────────────────────────────
const GOAL_OPTIONS_BY_CONDITION = {
  diabetes:          ["Manage blood sugar levels", "Reduce weight", "Boost energy", "Prevent complications"],
  "heart-disease":   ["Improve heart health", "Reduce blood pressure", "Lower cholesterol", "Maintain healthy weight"],
  thyroid:           ["Balance hormones", "Manage weight", "Boost energy and focus", "Reduce inflammation"],
  pcos:              ["Balance hormones", "Reduce weight", "Improve fertility", "Clear skin & hair"],
  "weight-management":["Lose weight steadily", "Maintain current weight", "Build lean muscle", "Improve metabolism"],
  "gut-health":      ["Reduce bloating", "Improve digestion", "Heal gut lining", "Eat for better bacteria"],
  "kidney-disease":  ["Slow disease progression", "Manage symptoms", "Maintain energy", "Improve quality of life"],
  immunity:          ["Boost immunity", "Reduce inflammation", "Improve energy", "General wellness"],
};

// ── Taste preference options ─────────────────────────────────────────────────
const CUISINE_OPTIONS = [
  { id: "indian",        label: "Indian",         emoji: "🇮🇳" },
  { id: "mediterranean", label: "Mediterranean",  emoji: "🫒" },
  { id: "east-asian",    label: "East Asian",     emoji: "🥢" },
  { id: "continental",   label: "Continental",    emoji: "🍽️" },
  { id: "middle-eastern",label: "Middle Eastern", emoji: "🧆" },
  { id: "mexican",       label: "Mexican",        emoji: "🌮" },
  { id: "african",       label: "African",        emoji: "🌍" },
  { id: "american",      label: "American",       emoji: "🍔" },
];

const DISLIKED_INGREDIENT_OPTIONS = [
  "Coriander / Cilantro", "Mushrooms", "Bitter Gourd", "Eggplant / Brinjal",
  "Capsicum / Bell Pepper", "Okra / Lady Finger", "Raw Onion", "Tofu / Soy",
  "Fish", "Eggs",
];

const TOTAL_OUTER_STEPS = 6; // metrics, conditions, cond-Q, lifestyle, preferences, goal (+loading)

// ── Helper: OptionCard ────────────────────────────────────────────────────
function OptionCard({ label, selected, onClick, description }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left w-full rounded-2xl border-2 p-4 transition-all
        ${selected ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/40"}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="font-medium text-sm">{label}</div>
          {description && <div className="text-xs text-muted-foreground mt-0.5">{description}</div>}
        </div>
        {selected && <Check className="size-4 text-primary shrink-0" />}
      </div>
    </button>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function Onboarding() {
  const { refresh } = useAuth();
  const nav = useNavigate();

  // outer step: 0=metrics, 1=conditions, 2=cond-Q, 3=lifestyle, 4=goal, 5=loading
  const [step, setStep] = useState(0);
  const [conditionIndex, setConditionIndex] = useState(0); // which condition's Qs we're on

  const [metrics, setMetrics] = useState({
    age: "", gender: "female", weight_kg: "", height_cm: "",
    activity_level: "moderate", location: "",
  });
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [conditionAnswers, setConditionAnswers] = useState({});
  const [lifestyle, setLifestyle] = useState({
    dietary_type: "", allergies: [], cooking_ability: "", budget: "",
  });
  const [preferences, setPreferences] = useState({
    cuisines: [], spice_level: "", disliked_ingredients: [], meal_pattern: "",
  });
  const [goal30day, setGoal30day] = useState("");
  const [loadingMsg, setLoadingMsg] = useState("Analysing your health profile…");

  const setMetric = (k, v) => setMetrics((m) => ({ ...m, [k]: v }));

  // ── Conditions toggle ───────────────────────────────────────────────────
  const toggleCondition = (id) => {
    setSelectedConditions((prev) => {
      if (prev.includes(id)) return prev.filter((c) => c !== id);
      if (prev.length >= 3) { toast.error("Select up to 3 conditions"); return prev; }
      return [...prev, id];
    });
  };

  // ── Condition answer setter ─────────────────────────────────────────────
  const setCondAnswer = (condId, key, value) => {
    setConditionAnswers((prev) => ({
      ...prev,
      [condId]: { ...(prev[condId] || {}), [key]: value },
    }));
  };

  // ── Dynamic goal options from selected conditions ───────────────────────
  const goalOptions = [...new Set(
    selectedConditions.flatMap((c) => GOAL_OPTIONS_BY_CONDITION[c] || [])
  )].slice(0, 6);

  // ── Progress bar calculation ────────────────────────────────────────────
  const totalSteps = TOTAL_OUTER_STEPS + selectedConditions.length;
  const currentProgress = step <= 2
    ? step === 2 ? 2 + conditionIndex : step
    : step + selectedConditions.length - 1;
  const progressPct = Math.min(100, Math.round((currentProgress / totalSteps) * 100));

  // ── Navigation helpers ─────────────────────────────────────────────────
  const next = () => {
    if (step === 2) {
      // cycling through condition questions
      if (conditionIndex < selectedConditions.length - 1) {
        setConditionIndex((i) => i + 1);
      } else {
        setStep(3);
      }
    } else {
      setStep((s) => s + 1);
    }
  };

  const prev = () => {
    if (step === 2) {
      if (conditionIndex > 0) {
        setConditionIndex((i) => i - 1);
      } else {
        setStep(1);
      }
    } else if (step === 3 && selectedConditions.length === 0) {
      setStep(1);
    } else {
      setStep((s) => Math.max(0, s - 1));
    }
  };

  // ── Loading messages cycle ──────────────────────────────────────────────
  useEffect(() => {
    if (step !== 6) return;
    const msgs = [
      "Analysing your health profile…",
      "Mapping condition-specific nutrition rules…",
      "Finding the best recipes for you…",
      "Building your personalised plan…",
      "Almost there — crafting your health summary…",
    ];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % msgs.length;
      setLoadingMsg(msgs[i]);
    }, 2000);
    return () => clearInterval(interval);
  }, [step]);

  // ── Final submission ────────────────────────────────────────────────────
  const finish = async () => {
    setStep(6);
    try {
      // Save base profile first
      const profilePayload = {
        category: "healthcare",
        conditions: selectedConditions,
        condition_answers: conditionAnswers,
        dietary_type: lifestyle.dietary_type,
        allergies: lifestyle.allergies,
        cooking_ability: lifestyle.cooking_ability,
        budget: lifestyle.budget,
        preferences,
        goal_30day: goal30day,
        age: metrics.age ? Number(metrics.age) : undefined,
        gender: metrics.gender,
        weight_kg: metrics.weight_kg ? Number(metrics.weight_kg) : undefined,
        height_cm: metrics.height_cm ? Number(metrics.height_cm) : undefined,
        activity_level: metrics.activity_level,
        location: metrics.location,
      };
      await api.put("/user/profile", profilePayload);

      // Generate AI health plan
      await api.post("/onboarding/generate-plan", {
        conditions: selectedConditions,
        condition_answers: conditionAnswers,
        dietary_type: lifestyle.dietary_type || "vegetarian",
        allergies: lifestyle.allergies,
        cooking_ability: lifestyle.cooking_ability || "quick",
        budget: lifestyle.budget || "medium",
        goal_30day: goal30day,
        age: metrics.age ? Number(metrics.age) : undefined,
        gender: metrics.gender,
        weight_kg: metrics.weight_kg ? Number(metrics.weight_kg) : undefined,
        height_cm: metrics.height_cm ? Number(metrics.height_cm) : undefined,
        activity_level: metrics.activity_level,
      });

      // Mark onboarded
      await api.put("/user/profile", { onboarded: true });
      await refresh();
      nav("/app");
    } catch (e) {
      toast.error("Something went wrong. Please try again.");
      setStep(5);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen p-6 max-w-lg mx-auto flex flex-col">
      {/* Progress bar */}
      {step < 6 && (
        <div className="mb-8 space-y-2">
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground text-right">
            Step {currentProgress + 1} of {totalSteps + 1}
          </p>
        </div>
      )}

      {/* ── STEP 0: Basic Metrics ── */}
      {step === 0 && (
        <div className="space-y-6 flex-1">
          <div>
            <h1 className="text-3xl font-display font-bold">Tell us about you</h1>
            <p className="text-muted-foreground mt-2">Used to personalise your macros and meal recommendations.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Age</Label>
              <Input
                type="number" placeholder="e.g. 32"
                value={metrics.age}
                onChange={(e) => setMetric("age", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select value={metrics.gender} onValueChange={(v) => setMetric("gender", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Weight (kg)</Label>
              <Input
                type="number" placeholder="e.g. 65"
                value={metrics.weight_kg}
                onChange={(e) => setMetric("weight_kg", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Height (cm)</Label>
              <Input
                type="number" placeholder="e.g. 162"
                value={metrics.height_cm}
                onChange={(e) => setMetric("height_cm", e.target.value)}
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label>Activity level</Label>
              <Select value={metrics.activity_level} onValueChange={(v) => setMetric("activity_level", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Sedentary (desk job, little movement)</SelectItem>
                  <SelectItem value="light">Light (1–3 days/week)</SelectItem>
                  <SelectItem value="moderate">Moderate (3–5 days/week)</SelectItem>
                  <SelectItem value="active">Active (6–7 days/week)</SelectItem>
                  <SelectItem value="very_active">Very Active (athlete / physical job)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 col-span-2">
              <Label>City / Location</Label>
              <Input
                placeholder="e.g. Mumbai, India"
                value={metrics.location}
                onChange={(e) => setMetric("location", e.target.value)}
              />
            </div>
          </div>
          <Button onClick={next} className="w-full rounded-full">
            Continue <ChevronRight className="size-4 ml-1" />
          </Button>
        </div>
      )}

      {/* ── STEP 1: Health Condition Multi-Select ── */}
      {step === 1 && (
        <div className="space-y-6 flex-1">
          <div>
            <h1 className="text-3xl font-display font-bold">What health conditions are you managing?</h1>
            <p className="text-muted-foreground mt-2">Select up to 3. We'll personalise everything around them.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {HEALTH_CONDITIONS.map((c) => {
              const selected = selectedConditions.includes(c.id);
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => toggleCondition(c.id)}
                  className={`rounded-2xl border-2 p-4 text-left transition-all
                    ${selected ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/40"}`}
                >
                  <div className="text-2xl mb-2">{c.emoji}</div>
                  <div className="font-semibold text-sm">{c.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{c.desc}</div>
                  {selected && (
                    <div className="mt-2 inline-flex items-center gap-1 text-xs text-primary font-medium">
                      <Check className="size-3" /> Selected
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={prev} className="rounded-full flex-1">Back</Button>
            <Button
              disabled={selectedConditions.length === 0}
              onClick={() => { setConditionIndex(0); next(); }}
              className="rounded-full flex-1"
            >
              Continue
            </Button>
          </div>
        </div>
      )}

      {/* ── STEP 2: Condition-specific questions (one condition at a time) ── */}
      {step === 2 && selectedConditions.length > 0 && (() => {
        const condId = selectedConditions[conditionIndex];
        const condMeta = HEALTH_CONDITIONS.find((c) => c.id === condId);
        const questions = CONDITION_QUESTIONS[condId] || [];
        const answers = conditionAnswers[condId] || {};
        const allAnswered = questions.every((q) => answers[q.key]);

        return (
          <div className="space-y-6 flex-1">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <span>{condMeta?.emoji}</span>
                <span className="font-medium text-foreground">{condMeta?.label}</span>
                {selectedConditions.length > 1 && (
                  <span className="ml-auto">{conditionIndex + 1} / {selectedConditions.length}</span>
                )}
              </div>
              <h1 className="text-2xl font-display font-bold">A few quick questions</h1>
              <p className="text-muted-foreground mt-1 text-sm">Helps us fine-tune your nutrition plan.</p>
            </div>
            <div className="space-y-5">
              {questions.map((q) => (
                <div key={q.key} className="space-y-2">
                  <Label className="text-sm font-medium">{q.label}</Label>
                  <div className="grid gap-2">
                    {q.options.map((opt) => (
                      <OptionCard
                        key={opt}
                        label={opt}
                        selected={answers[q.key] === opt}
                        onClick={() => setCondAnswer(condId, q.key, opt)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={prev} className="rounded-full flex-1">Back</Button>
              <Button disabled={!allAnswered} onClick={next} className="rounded-full flex-1">
                {conditionIndex < selectedConditions.length - 1 ? "Next condition" : "Continue"}
              </Button>
            </div>
          </div>
        );
      })()}

      {/* ── STEP 3: Lifestyle & Diet Preferences ── */}
      {step === 3 && (
        <div className="space-y-6 flex-1">
          <div>
            <h1 className="text-2xl font-display font-bold">Your diet & lifestyle</h1>
            <p className="text-muted-foreground mt-1 text-sm">Helps us recommend the right meals for your daily routine.</p>
          </div>

          {/* Dietary type */}
          <div className="space-y-2">
            <Label>What's your dietary preference?</Label>
            <div className="grid grid-cols-2 gap-2">
              {["Vegetarian", "Non-vegetarian", "Vegan", "Eggetarian"].map((t) => (
                <OptionCard
                  key={t} label={t}
                  selected={lifestyle.dietary_type === t}
                  onClick={() => setLifestyle((l) => ({ ...l, dietary_type: t }))}
                />
              ))}
            </div>
          </div>

          {/* Allergies */}
          <div className="space-y-2">
            <Label>Any food allergies or intolerances? <span className="text-muted-foreground font-normal">(select all that apply)</span></Label>
            <div className="grid grid-cols-2 gap-2">
              {["None", "Lactose", "Gluten", "Nuts", "Shellfish"].map((a) => {
                const isNone = a === "None";
                const selected = isNone
                  ? lifestyle.allergies.length === 0
                  : lifestyle.allergies.includes(a);
                return (
                  <OptionCard
                    key={a} label={a}
                    selected={selected}
                    onClick={() => {
                      if (isNone) {
                        setLifestyle((l) => ({ ...l, allergies: [] }));
                      } else {
                        setLifestyle((l) => ({
                          ...l,
                          allergies: l.allergies.includes(a)
                            ? l.allergies.filter((x) => x !== a)
                            : [...l.allergies, a],
                        }));
                      }
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Cooking ability */}
          <div className="space-y-2">
            <Label>How much time do you have for cooking?</Label>
            <div className="grid gap-2">
              {[
                { value: "full",    label: "Full meals",       desc: "I enjoy cooking and have time" },
                { value: "quick",   label: "Quick (≤ 20 min)", desc: "Simple and fast" },
                { value: "eat-out", label: "Mostly eat out",   desc: "I prefer ready-made meals" },
                { value: "minimal", label: "Very simple only", desc: "Minimum cooking skills or time" },
              ].map((o) => (
                <OptionCard
                  key={o.value} label={o.label} description={o.desc}
                  selected={lifestyle.cooking_ability === o.value}
                  onClick={() => setLifestyle((l) => ({ ...l, cooking_ability: o.value }))}
                />
              ))}
            </div>
          </div>

          {/* Budget */}
          <div className="space-y-2">
            <Label>Daily food budget</Label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: "low",     label: "Under ₹150" },
                { value: "medium",  label: "₹150 – ₹300" },
                { value: "high",    label: "₹300 – ₹500" },
                { value: "premium", label: "₹500+" },
              ].map((o) => (
                <OptionCard
                  key={o.value} label={o.label}
                  selected={lifestyle.budget === o.value}
                  onClick={() => setLifestyle((l) => ({ ...l, budget: o.value }))}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={prev} className="rounded-full flex-1">Back</Button>
            <Button
              disabled={!lifestyle.dietary_type || !lifestyle.cooking_ability || !lifestyle.budget}
              onClick={next}
              className="rounded-full flex-1"
            >
              Continue
            </Button>
          </div>
        </div>
      )}

      {/* ── STEP 4: Taste & Food Preferences ── */}
      {step === 4 && (
        <div className="space-y-6 flex-1">
          <div>
            <h1 className="text-2xl font-display font-bold">Your taste & food preferences</h1>
            <p className="text-muted-foreground mt-1 text-sm">Helps us find recipes from cuisines you'll actually enjoy.</p>
          </div>

          {/* Cuisines */}
          <div className="space-y-2">
            <Label>Which cuisines do you enjoy? <span className="text-muted-foreground font-normal">(pick all that apply)</span></Label>
            <div className="grid grid-cols-2 gap-2">
              {CUISINE_OPTIONS.map((c) => {
                const selected = preferences.cuisines.includes(c.id);
                return (
                  <OptionCard
                    key={c.id}
                    label={`${c.emoji} ${c.label}`}
                    selected={selected}
                    onClick={() =>
                      setPreferences((p) => ({
                        ...p,
                        cuisines: selected
                          ? p.cuisines.filter((x) => x !== c.id)
                          : [...p.cuisines, c.id],
                      }))
                    }
                  />
                );
              })}
            </div>
          </div>

          {/* Spice level */}
          <div className="space-y-2">
            <Label>Spice tolerance</Label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "mild",   label: "🌿 Mild",   desc: "No heat" },
                { value: "medium", label: "🌶️ Medium", desc: "Moderate" },
                { value: "spicy",  label: "🔥 Spicy",  desc: "Bring it on" },
              ].map((o) => (
                <OptionCard
                  key={o.value} label={o.label} description={o.desc}
                  selected={preferences.spice_level === o.value}
                  onClick={() => setPreferences((p) => ({ ...p, spice_level: o.value }))}
                />
              ))}
            </div>
          </div>

          {/* Disliked ingredients */}
          <div className="space-y-2">
            <Label>Ingredients you dislike or avoid <span className="text-muted-foreground font-normal">(optional)</span></Label>
            <div className="grid grid-cols-2 gap-2">
              {DISLIKED_INGREDIENT_OPTIONS.map((ing) => {
                const selected = preferences.disliked_ingredients.includes(ing);
                return (
                  <OptionCard
                    key={ing} label={ing}
                    selected={selected}
                    onClick={() =>
                      setPreferences((p) => ({
                        ...p,
                        disliked_ingredients: selected
                          ? p.disliked_ingredients.filter((x) => x !== ing)
                          : [...p.disliked_ingredients, ing],
                      }))
                    }
                  />
                );
              })}
            </div>
          </div>

          {/* Meal pattern */}
          <div className="space-y-2">
            <Label>How do you usually eat through the day?</Label>
            <div className="grid gap-2">
              {[
                { value: "3-meals",            label: "3 main meals",         desc: "Breakfast, lunch, dinner" },
                { value: "5-meals",            label: "5 small meals",        desc: "Smaller portions, more frequently" },
                { value: "intermittent-fasting",label: "Intermittent fasting", desc: "e.g. 16:8 or skip breakfast" },
                { value: "no-pattern",         label: "No fixed pattern",     desc: "Eat when hungry" },
              ].map((o) => (
                <OptionCard
                  key={o.value} label={o.label} description={o.desc}
                  selected={preferences.meal_pattern === o.value}
                  onClick={() => setPreferences((p) => ({ ...p, meal_pattern: o.value }))}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={prev} className="rounded-full flex-1">Back</Button>
            <Button
              disabled={!preferences.spice_level || !preferences.meal_pattern}
              onClick={next}
              className="rounded-full flex-1"
            >
              Continue
            </Button>
          </div>
        </div>
      )}

      {/* ── STEP 5: 30-day Goal ── */}
      {step === 5 && (
        <div className="space-y-6 flex-1">
          <div>
            <h1 className="text-2xl font-display font-bold">What's your primary goal in the next 30 days?</h1>
            <p className="text-muted-foreground mt-1 text-sm">We'll align your meal plan and tips to this goal.</p>
          </div>
          <div className="grid gap-2">
            {(goalOptions.length > 0 ? goalOptions : [
              "Improve overall health", "Lose weight", "Boost energy", "Reduce inflammation"
            ]).map((g) => (
              <OptionCard
                key={g} label={g}
                selected={goal30day === g}
                onClick={() => setGoal30day(g)}
              />
            ))}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={prev} className="rounded-full flex-1">Back</Button>
            <Button
              disabled={!goal30day}
              onClick={finish}
              className="rounded-full flex-1"
            >
              <Sparkles className="size-4 mr-2" /> Build my plan
            </Button>
          </div>
        </div>
      )}

      {/* ── STEP 6: AI Loading ── */}
      {step === 6 && (
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
          <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Loader2 className="size-10 text-primary animate-spin" />
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold mb-2">Building your plan</h2>
            <p className="text-muted-foreground animate-pulse">{loadingMsg}</p>
          </div>
          <div className="flex gap-2 mt-4">
            {selectedConditions.map((c) => {
              const meta = HEALTH_CONDITIONS.find((h) => h.id === c);
              return (
                <span key={c} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  {meta?.emoji} {meta?.label}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
