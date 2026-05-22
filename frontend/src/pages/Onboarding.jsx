import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../components/ui/select";
import { HeartPulse, Dumbbell, Globe2, Check } from "lucide-react";
import api from "../lib/api";
import { useAuth } from "../lib/auth";
import { toast } from "sonner";

const CATEGORIES = [
  { id: "healthcare", title: "Heal & Restore", desc: "Disease-specific nutrition", icon: HeartPulse, gradient: "nv-gradient-hc" },
  { id: "fitness", title: "Strength & Fuel", desc: "Goal-based meal plans", icon: Dumbbell, gradient: "nv-gradient-ft" },
  { id: "cultural", title: "Travel the Plate", desc: "Explore global cuisines", icon: Globe2, gradient: "nv-gradient-cu" },
];

const CONDITIONS = [
  "diabetes", "heart-disease", "kidney-disease", "thyroid", "obesity",
  "hypertension", "pcos", "cancer", "elderly-nutrition", "post-surgery",
  "gut-health", "immunity", "iron-deficiency", "stress-sleep", "weight-management",
];
const GOALS = ["lose", "gain", "maintain", "bulking", "cutting", "endurance"];

export default function Onboarding() {
  const { refresh } = useAuth();
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    category: "", condition: "", goal: "maintain",
    age: "", gender: "male", weight_kg: "", height_cm: "",
    activity_level: "moderate", location: "",
  });

  const set = (k, v) => setData((d) => ({ ...d, [k]: v }));

  const finish = async () => {
    const payload = { ...data, onboarded: true };
    ["age", "weight_kg", "height_cm"].forEach((k) => {
      if (payload[k] !== "") payload[k] = Number(payload[k]);
      else delete payload[k];
    });
    if (!payload.condition) delete payload.condition;
    try {
      await api.put("/user/profile", payload);
      await refresh();
      toast.success("Profile set up");
      nav("/app");
    } catch (e) {
      toast.error("Failed to save profile");
    }
  };

  const next = () => setStep((s) => s + 1);
  const prev = () => setStep((s) => Math.max(0, s - 1));

  const showFitness = data.category === "fitness";
  const showHealthcare = data.category === "healthcare";

  return (
    <div className="min-h-screen p-6 max-w-2xl mx-auto flex flex-col" style={{ background: "#f7f3e7" }}>
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => nav("/")} className="text-xs uppercase tracking-widest" style={{ color: "#6b6258" }}>
          ← Back
        </button>
        <div className="font-overline" style={{ color: "#5e6b55" }}>Step {step + 1} of 3</div>
      </div>
      <div className="flex items-center gap-2 mb-10">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-1 flex-1 rounded-full transition-all" style={{ background: i <= step ? "#5e6b55" : "#e2dccb" }} />
        ))}
      </div>

      {step === 0 && (
        <div className="space-y-8">
          <div>
            <p className="font-overline" style={{ color: "#5e6b55" }}>Welcome</p>
            <h1 className="font-display text-3xl sm:text-4xl mt-2" style={{ color: "#2e2a26" }}>Let's understand you better.</h1>
            <p className="text-muted-foreground mt-2">Pick a primary focus — you can always change this later.</p>
          </div>
          <div className="grid gap-3">
            {CATEGORIES.map((c, i) => (
              <button
                key={c.id}
                data-testid={`onboard-category-${c.id}`}
                onClick={() => set("category", c.id)}
                className={`text-left rounded-2xl p-5 flex items-center gap-4 transition-all zp-card-soft nv-shadow ${data.category === c.id ? "ring-2" : "hover:-translate-y-0.5"}`}
                style={data.category === c.id ? { boxShadow: "0 0 0 2px #5e6b55, 0 12px 28px rgba(60,50,30,0.08)" } : {}}
              >
                <div className="size-12 rounded-2xl grid place-items-center shrink-0"
                  style={{ background: "rgba(94,107,85,0.14)", color: "#5e6b55" }}>
                  <c.icon className="size-5" />
                </div>
                <div className="flex-1">
                  <div className="font-overline" style={{ color: "#8a6e3a" }}>0{i + 1}</div>
                  <div className="font-display text-lg" style={{ color: "#2e2a26" }}>{c.title}</div>
                  <div className="text-xs" style={{ color: "#6b6258" }}>{c.desc}</div>
                </div>
                {data.category === c.id && <Check className="size-5" style={{ color: "#5e6b55" }} />}
              </button>
            ))}
          </div>
          <Button data-testid="onboard-next-1" disabled={!data.category} onClick={next}
            className="w-full rounded-full h-12 border-0"
            style={{ background: "#5e6b55", color: "#f4f1e8" }}>Continue</Button>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-6">
          <div>
            <p className="font-overline" style={{ color: "#5e6b55" }}>About you</p>
            <h1 className="font-display text-3xl mt-1" style={{ color: "#2e2a26" }}>Tell us a bit about you</h1>
            <p className="text-sm mt-2" style={{ color: "#6b6258" }}>So we can personalise your macros and recipes.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider" style={{ color: "#6b6258" }}>Age</Label>
              <Input data-testid="onboard-age" type="number" value={data.age} onChange={(e) => set("age", e.target.value)} className="h-11 bg-white" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider" style={{ color: "#6b6258" }}>Gender</Label>
              <Select value={data.gender} onValueChange={(v) => set("gender", v)}>
                <SelectTrigger data-testid="onboard-gender" className="h-11 bg-white"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider" style={{ color: "#6b6258" }}>Weight (kg)</Label>
              <Input data-testid="onboard-weight" type="number" value={data.weight_kg} onChange={(e) => set("weight_kg", e.target.value)} className="h-11 bg-white" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider" style={{ color: "#6b6258" }}>Height (cm)</Label>
              <Input data-testid="onboard-height" type="number" value={data.height_cm} onChange={(e) => set("height_cm", e.target.value)} className="h-11 bg-white" />
            </div>
            <div className="space-y-1.5 col-span-2">
              <Label className="text-xs uppercase tracking-wider" style={{ color: "#6b6258" }}>Activity level</Label>
              <Select value={data.activity_level} onValueChange={(v) => set("activity_level", v)}>
                <SelectTrigger data-testid="onboard-activity" className="h-11 bg-white"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Sedentary (desk job)</SelectItem>
                  <SelectItem value="light">Light (1–3 days/week)</SelectItem>
                  <SelectItem value="moderate">Moderate (3–5 days/week)</SelectItem>
                  <SelectItem value="active">Active (6–7 days/week)</SelectItem>
                  <SelectItem value="very_active">Very Active (athlete)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 col-span-2">
              <Label className="text-xs uppercase tracking-wider" style={{ color: "#6b6258" }}>Location / Region</Label>
              <Input data-testid="onboard-location" placeholder="e.g. Indiranagar, Bangalore" value={data.location} onChange={(e) => set("location", e.target.value)} className="h-11 bg-white" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={prev} className="rounded-full flex-1 h-12 border-stone-300 bg-white">Back</Button>
            <Button data-testid="onboard-next-2" onClick={next}
              className="rounded-full flex-1 h-12 border-0"
              style={{ background: "#5e6b55", color: "#f4f1e8" }}>Continue</Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div>
            <p className="font-overline" style={{ color: "#5e6b55" }}>Almost there</p>
            <h1 className="font-display text-3xl mt-1" style={{ color: "#2e2a26" }}>Finalise your plan</h1>
            <p className="text-sm mt-2" style={{ color: "#6b6258" }}>Pick what matters most for your daily meals.</p>
          </div>
          {showHealthcare && (
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider" style={{ color: "#6b6258" }}>Condition</Label>
              <Select value={data.condition} onValueChange={(v) => set("condition", v)}>
                <SelectTrigger data-testid="onboard-condition" className="h-12 bg-white"><SelectValue placeholder="Select a condition" /></SelectTrigger>
                <SelectContent>
                  {CONDITIONS.map((c) => (
                    <SelectItem key={c} value={c} className="capitalize">{c.replace("-", " ")}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {showFitness && (
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider" style={{ color: "#6b6258" }}>Goal</Label>
              <Select value={data.goal} onValueChange={(v) => set("goal", v)}>
                <SelectTrigger data-testid="onboard-goal" className="h-12 bg-white"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {GOALS.map((g) => (
                    <SelectItem key={g} value={g} className="capitalize">{g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {data.category === "cultural" && (
            <div className="rounded-2xl p-5 text-sm italic zp-card-soft" style={{ color: "#6b6258" }}>
              You'll travel through 40+ cuisines. No extra info needed — just curiosity.
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={prev} className="rounded-full flex-1 h-12 border-stone-300 bg-white">Back</Button>
            <Button data-testid="onboard-finish" onClick={finish}
              className="rounded-full flex-1 h-12 border-0"
              style={{ background: "#5e6b55", color: "#f4f1e8" }}>Enter Zenplato</Button>
          </div>
        </div>
      )}
    </div>
  );
}
