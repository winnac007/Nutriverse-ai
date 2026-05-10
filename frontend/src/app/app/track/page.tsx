"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function Track() {
  const { user } = useAuth();
  const [today, setToday] = useState({ totals: { calories: 0, protein: 0, carbs: 0, fat: 0 }, logs: [] as any[] });
  const [week, setWeek] = useState<any[]>([]);
  const [targets, setTargets] = useState<any>(null);

  const load = () => {
    api.get("/nutrition/today").then((r) => setToday(r.data));
    api.get("/nutrition/week").then((r) => setWeek(r.data));
  };
  useEffect(load, []);

  useEffect(() => {
    if (!user?.age || !user?.weight_kg || !user?.height_cm) return;
    api.post("/tdee/calculate", {
      age: user.age, gender: user.gender || "male",
      weight_kg: user.weight_kg, height_cm: user.height_cm,
      activity_level: user.activity_level || "moderate",
      goal: user.goal || "maintain",
    }).then((r) => setTargets(r.data));
  }, [user]);

  const del = async (id: string) => {
    await api.delete(`/nutrition/log/${id}`);
    toast.success("Removed");
    load();
  };

  const pct = (cur: number, target: number) => Math.min(100, Math.round((cur / target) * 100)) || 0;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">Track</h1>
        <p className="text-muted-foreground mt-1">Today's nutrition & weekly progress.</p>
      </header>

      {targets && (
        <section className="nv-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Today vs goal</h3>
            <span className="text-xs text-muted-foreground">{today.totals.calories} / {targets.target_calories} kcal</span>
          </div>
          {[
            { k: "calories", t: targets.target_calories, color: "#00d4aa", label: "Calories" },
            { k: "protein", t: targets.protein_g, color: "#ff6b35", label: "Protein" },
            { k: "carbs", t: targets.carbs_g, color: "#7c5cfc", label: "Carbs" },
            { k: "fat", t: targets.fat_g, color: "#ffd166", label: "Fat" },
          ].map((row) => (
            <div key={row.k} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span>{row.label}</span>
                <span className="text-muted-foreground">{(today.totals as any)[row.k]} / {row.t}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${pct((today.totals as any)[row.k], row.t)}%`, background: row.color }} />
              </div>
            </div>
          ))}
        </section>
      )}

      <section className="nv-card p-5">
        <h3 className="font-semibold mb-3">Calories – last 7 days</h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={week}>
              <CartesianGrid stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="date" tickFormatter={(d) => d.slice(5)} stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
              <Bar dataKey="calories" fill="#00d4aa" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section>
        <h3 className="font-semibold mb-3">Today's log</h3>
        {today.logs.length === 0 ? (
          <div className="nv-card p-5 text-center text-muted-foreground text-sm">No meals logged yet. Open a recipe and tap “Log meal”.</div>
        ) : (
          <ul className="space-y-2">
            {today.logs.map((l: any) => (
              <li key={l.id} className="nv-card px-4 py-3 flex items-center justify-between">
                <div>
                  <div className="font-medium">{l.recipe_title}</div>
                  <div className="text-xs text-muted-foreground capitalize">{l.meal_type} · {l.nutrition.calories} kcal</div>
                </div>
                <button onClick={() => del(l.id)} className="size-8 grid place-items-center rounded-full hover:bg-muted">
                  <Trash2 className="size-4 text-muted-foreground" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
