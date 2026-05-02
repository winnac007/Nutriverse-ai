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
  { id: "healthcare", title: "Healthcare", desc: "Disease-specific nutrition", icon: HeartPulse, gradient: "nv-gradient-hc" },
  { id: "fitness", title: "Fitness", desc: "Goal-based meal plans", icon: Dumbbell, gradient: "nv-gradient-ft" },
  { id: "cultural", title: "Cultural", desc: "Explore global cuisines", icon: Globe2, gradient: "nv-gradient-cu" },
];

const CONDITIONS = [
  "diabetes", "heart-disease", "kidney-disease", "thyroid", "obesity",
  "hypertension", "pcos", "cancer", "elderly-nutrition", "post-surgery",
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
    <div className="min-h-screen p-6 max-w-2xl mx-auto flex flex-col">
      <div className="flex items-center gap-2 mb-10">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-muted"}`} />
        ))}
      </div>

      {step === 0 && (
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold">What brings you here?</h1>
            <p className="text-muted-foreground mt-2">Pick a primary focus. You can always change this later.</p>
          </div>
          <div className="grid gap-4">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                data-testid={`onboard-category-${c.id}`}
                onClick={() => set("category", c.id)}
                className={`text-left nv-card p-5 flex items-center gap-4 transition-all ${data.category === c.id ? "ring-2 ring-primary" : "hover:-translate-y-0.5"}`}
              >
                <div className={`size-12 rounded-2xl grid place-items-center text-white ${c.gradient}`}><c.icon className="size-6" /></div>
                <div className="flex-1">
                  <div className="font-semibold">{c.title}</div>
                  <div className="text-sm text-muted-foreground">{c.desc}</div>
                </div>
                {data.category === c.id && <Check className="size-5 text-primary" />}
              </button>
            ))}
          </div>
          <Button data-testid="onboard-next-1" disabled={!data.category} onClick={next} className="w-full rounded-full">Continue</Button>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-display font-bold">Tell us a bit about you</h1>
            <p className="text-muted-foreground mt-2">Used to personalize your macros and recipes.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Age</Label>
              <Input data-testid="onboard-age" type="number" value={data.age} onChange={(e) => set("age", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select value={data.gender} onValueChange={(v) => set("gender", v)}>
                <SelectTrigger data-testid="onboard-gender"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Weight (kg)</Label>
              <Input data-testid="onboard-weight" type="number" value={data.weight_kg} onChange={(e) => set("weight_kg", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Height (cm)</Label>
              <Input data-testid="onboard-height" type="number" value={data.height_cm} onChange={(e) => set("height_cm", e.target.value)} />
            </div>
            <div className="space-y-2 col-span-2">
              <Label>Activity level</Label>
              <Select value={data.activity_level} onValueChange={(v) => set("activity_level", v)}>
                <SelectTrigger data-testid="onboard-activity"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Sedentary (desk job)</SelectItem>
                  <SelectItem value="light">Light (1–3 days/week)</SelectItem>
                  <SelectItem value="moderate">Moderate (3–5 days/week)</SelectItem>
                  <SelectItem value="active">Active (6–7 days/week)</SelectItem>
                  <SelectItem value="very_active">Very Active (athlete)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 col-span-2">
              <Label>Location / Region</Label>
              <Input data-testid="onboard-location" placeholder="e.g. Mumbai, India" value={data.location} onChange={(e) => set("location", e.target.value)} />
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={prev} className="rounded-full flex-1">Back</Button>
            <Button data-testid="onboard-next-2" onClick={next} className="rounded-full flex-1">Continue</Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-display font-bold">Finalize your plan</h1>
            <p className="text-muted-foreground mt-2">Pick what matters most for your daily meals.</p>
          </div>
          {showHealthcare && (
            <div className="space-y-2">
              <Label>Condition</Label>
              <Select value={data.condition} onValueChange={(v) => set("condition", v)}>
                <SelectTrigger data-testid="onboard-condition"><SelectValue placeholder="Select a condition" /></SelectTrigger>
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
              <Label>Goal</Label>
              <Select value={data.goal} onValueChange={(v) => set("goal", v)}>
                <SelectTrigger data-testid="onboard-goal"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {GOALS.map((g) => (
                    <SelectItem key={g} value={g} className="capitalize">{g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {data.category === "cultural" && (
            <div className="nv-card p-5 text-sm text-muted-foreground">
              You'll browse recipes from 40+ countries. No extra info needed.
            </div>
          )}
          <div className="flex gap-3">
            <Button variant="outline" onClick={prev} className="rounded-full flex-1">Back</Button>
            <Button data-testid="onboard-finish" onClick={finish} className="rounded-full flex-1">Enter NutriVerse</Button>
          </div>
        </div>
      )}
    </div>
  );
}
