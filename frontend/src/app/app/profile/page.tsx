"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";
import api from "@/lib/api";
import PremiumGate from "@/components/PremiumGate";
import RecipeCard from "@/components/RecipeCard";
import { useTheme } from "next-themes";
import Link from "next/link";
import { LogOut, Moon, Sun, Droplets, Activity, ChevronRight, BookOpen, ShoppingCart, TrendingUp } from "lucide-react";

export default function Profile() {
  const { user, refresh, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [form, setForm] = useState<any>({});
  const [saved, setSaved] = useState<any[]>([]);
  const [busy, setBusy] = useState(false);
  const [lifestyle, setLifestyle] = useState<any>({});

  useEffect(() => {
    if (user) setForm({
      name: user.name || "",
      age: user.age || "", gender: user.gender || "male",
      weight_kg: user.weight_kg || "", height_cm: user.height_cm || "",
      body_type: user.body_type || "mesomorph",
      activity_level: user.activity_level || "moderate",
      goal: user.goal || "maintain", condition: user.condition || "",
      location: user.location || "",
      cooking_ability: user.cooking_ability || "intermediate",
      budget: user.budget || "medium",
      timeline_weeks: user.timeline_weeks || "",
    });
  }, [user]);

  useEffect(() => {
    if (!user?.saved_recipes?.length) { setSaved([]); return; }
    Promise.all(user.saved_recipes.map((id: string) => api.get(`/recipes/${id}`).then((r) => r.data).catch(() => null)))
      .then((arr) => setSaved(arr.filter(Boolean)));
  }, [user?.saved_recipes]);

  useEffect(() => {
    if (user?.is_premium) api.get("/lifestyle/today").then((r) => setLifestyle(r.data)).catch(() => {});
  }, [user?.is_premium]);

  const save = async () => {
    setBusy(true);
    try {
      const payload = { ...form };
      ["age", "weight_kg", "height_cm", "timeline_weeks"].forEach((k) => {
        if (payload[k] !== "" && payload[k] != null) payload[k] = Number(payload[k]);
        else delete payload[k];
      });
      await api.put("/user/profile", payload);
      await refresh();
      toast.success("Profile saved");
    } catch { toast.error("Save failed"); }
    finally { setBusy(false); }
  };

  const setVal = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));
  const setLs = (k: string, v: any) => setLifestyle((l: any) => ({ ...l, [k]: v }));

  const saveLifestyle = async () => {
    try {
      const payload: any = {};
      if (lifestyle.sleep_hours !== "" && lifestyle.sleep_hours != null) payload.sleep_hours = Number(lifestyle.sleep_hours);
      if (lifestyle.water_ml !== "" && lifestyle.water_ml != null) payload.water_ml = Number(lifestyle.water_ml);
      if (lifestyle.workout_minutes !== "" && lifestyle.workout_minutes != null) payload.workout_minutes = Number(lifestyle.workout_minutes);
      if (lifestyle.mood) payload.mood = lifestyle.mood;
      if (lifestyle.notes) payload.notes = lifestyle.notes;
      await api.post("/lifestyle/log", payload);
      toast.success("Lifestyle saved");
    } catch { toast.error("Failed"); }
  };

  if (!user) return null;

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground mt-1">{user.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="rounded-full" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>
          <Button variant="outline" size="icon" className="rounded-full" onClick={logout}>
            <LogOut className="size-4" />
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-2">
        {[
          { href: "/app/food-guidelines", icon: BookOpen, label: "Food Guide" },
          { href: "/app/grocery", icon: ShoppingCart, label: "Grocery List" },
          { href: "/app/progress", icon: TrendingUp, label: "Progress" },
        ].map(({ href, icon: Icon, label }) => (
          <Link key={href} href={href}
            className="nv-card p-3 flex flex-col items-center gap-1.5 text-center hover:-translate-y-0.5 transition-transform">
            <Icon className="size-5 text-primary" />
            <span className="text-xs font-medium">{label}</span>
            <ChevronRight className="size-3 text-muted-foreground" />
          </Link>
        ))}
      </div>

      {!user.is_premium ? (
        <PremiumGate
          title="Upgrade to Premium · ₹300/mo"
          description="Unlock the adaptive AI coach, full 7-day plans, lifestyle engine (sleep · hydration · workouts), and lab report analysis."
        />
      ) : (
        <div className="nv-card nv-shadow p-5 relative overflow-hidden">
          <div className="absolute inset-0 nv-gradient-pm opacity-15" />
          <div className="relative flex items-center gap-4">
            <div className="size-11 rounded-2xl nv-gradient-pm grid place-items-center text-black font-bold">★</div>
            <div>
              <div className="font-semibold">Premium active</div>
              <div className="text-xs text-muted-foreground">Adaptive AI coach + Lifestyle Engine unlocked.</div>
            </div>
          </div>
        </div>
      )}

      {user.is_premium && (
        <section className="nv-card nv-shadow p-5 space-y-4">
          <h3 className="font-display text-lg font-semibold">Lifestyle Engine — Today</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <label className="space-y-1.5">
              <span className="text-xs text-muted-foreground inline-flex items-center gap-1"><Moon className="size-3" /> Sleep (h)</span>
              <Input type="number" step="0.5" value={lifestyle.sleep_hours ?? ""} onChange={(e: any) => setLs("sleep_hours", e.target.value)} />
            </label>
            <label className="space-y-1.5">
              <span className="text-xs text-muted-foreground inline-flex items-center gap-1"><Droplets className="size-3" /> Water (ml)</span>
              <Input type="number" value={lifestyle.water_ml ?? ""} onChange={(e: any) => setLs("water_ml", e.target.value)} />
            </label>
            <label className="space-y-1.5">
              <span className="text-xs text-muted-foreground inline-flex items-center gap-1"><Activity className="size-3" /> Workout (min)</span>
              <Input type="number" value={lifestyle.workout_minutes ?? ""} onChange={(e: any) => setLs("workout_minutes", e.target.value)} />
            </label>
            <label className="space-y-1.5">
              <span className="text-xs text-muted-foreground">Mood</span>
              <Select value={lifestyle.mood || ""} onValueChange={(v) => setLs("mood", v)}>
                <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="great">Great</SelectItem>
                  <SelectItem value="ok">OK</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </label>
          </div>
          <Button onClick={saveLifestyle} className="rounded-full">Save lifestyle</Button>
        </section>
      )}

      <section className="nv-card nv-shadow p-5 space-y-4">
        <h3 className="font-display text-lg font-semibold">Your details</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2"><Label>Name</Label><Input value={form.name || ""} onChange={(e: any) => setVal("name", e.target.value)} /></div>
          <div className="space-y-2"><Label>Location</Label><Input placeholder="e.g. Indiranagar, Bangalore" value={form.location || ""} onChange={(e: any) => setVal("location", e.target.value)} /></div>
          <div className="space-y-2"><Label>Age</Label><Input type="number" value={form.age || ""} onChange={(e: any) => setVal("age", e.target.value)} /></div>
          <div className="space-y-2">
            <Label>Gender</Label>
            <Select value={form.gender} onValueChange={(v) => setVal("gender", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2"><Label>Weight (kg)</Label><Input type="number" value={form.weight_kg || ""} onChange={(e: any) => setVal("weight_kg", e.target.value)} /></div>
          <div className="space-y-2"><Label>Height (cm)</Label><Input type="number" value={form.height_cm || ""} onChange={(e: any) => setVal("height_cm", e.target.value)} /></div>
          <div className="space-y-2">
            <Label>Body type</Label>
            <Select value={form.body_type} onValueChange={(v) => setVal("body_type", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ectomorph">Ectomorph (lean)</SelectItem>
                <SelectItem value="mesomorph">Mesomorph (athletic)</SelectItem>
                <SelectItem value="endomorph">Endomorph (rounder)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Activity</Label>
            <Select value={form.activity_level} onValueChange={(v) => setVal("activity_level", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="sedentary">Sedentary</SelectItem>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="very_active">Very Active</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Cooking ability</Label>
            <Select value={form.cooking_ability} onValueChange={(v) => setVal("cooking_ability", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Budget</Label>
            <Select value={form.budget} onValueChange={(v) => setVal("budget", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2"><Label>Timeline (weeks)</Label><Input type="number" value={form.timeline_weeks || ""} onChange={(e: any) => setVal("timeline_weeks", e.target.value)} /></div>
        </div>
        <Button onClick={save} disabled={busy} className="rounded-full">{busy ? "Saving…" : "Save changes"}</Button>
      </section>

      {saved.length > 0 && (
        <section>
          <h3 className="font-display text-lg font-semibold mb-3">Saved recipes</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {saved.map((r) => <RecipeCard key={r.id} recipe={r} />)}
          </div>
        </section>
      )}
    </div>
  );
}
