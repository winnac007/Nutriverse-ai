import React, { useEffect, useState } from "react";
import api from "../lib/api";
import { useAuth } from "../lib/auth";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell,
} from "recharts";
import { TrendingDown, TrendingUp, Minus, Flame, Target, Calendar } from "lucide-react";
import { toast } from "sonner";

function WeightInput({ onLogged }) {
  const [weight, setWeight] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleLog(e) {
    e.preventDefault();
    if (!weight || isNaN(parseFloat(weight))) return;
    setSubmitting(true);
    try {
      await api.post("/health/weight", { weight_kg: parseFloat(weight) });
      toast.success("Weight logged!");
      setWeight("");
      onLogged();
    } catch {
      toast.error("Could not log weight");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleLog} className="flex gap-2">
      <input
        type="number" step="0.1" min="20" max="300"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        placeholder="Enter weight (kg)"
        className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
      <button
        type="submit" disabled={submitting || !weight}
        className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50 transition-opacity"
      >
        Log
      </button>
    </form>
  );
}

function WeightTrend({ data }) {
  if (!data?.length) return null;

  const first = data[data.length - 1]?.weight_kg;
  const last = data[0]?.weight_kg;
  const diff = last - first;
  const TrendIcon = diff < -0.5 ? TrendingDown : diff > 0.5 ? TrendingUp : Minus;
  const trendColor = diff < -0.5 ? "text-green-500" : diff > 0.5 ? "text-red-500" : "text-muted-foreground";

  const chartData = [...data].reverse().map((entry) => ({
    date: entry.date.slice(5),
    weight: entry.weight_kg,
  }));

  return (
    <section className="nv-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-sm">Weight Trend</h2>
        <div className={`flex items-center gap-1 text-sm font-medium ${trendColor}`}>
          <TrendIcon className="size-4" />
          {Math.abs(diff).toFixed(1)}kg
        </div>
      </div>
      <ResponsiveContainer width="100%" height={120}>
        <LineChart data={chartData}>
          <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
          <YAxis domain={["auto", "auto"]} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={35} />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8 }}
            formatter={(v) => [`${v} kg`, "Weight"]}
          />
          <Line type="monotone" dataKey="weight" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Current: <strong className="text-foreground">{last} kg</strong></span>
        <span>30-day change: <strong className={trendColor}>{diff >= 0 ? "+" : ""}{diff.toFixed(1)} kg</strong></span>
      </div>
    </section>
  );
}

function NutrientCompliance({ weekData, macroTargets }) {
  if (!weekData?.length || !macroTargets) return null;

  const metrics = [
    { key: "calories", label: "Calories", target: macroTargets.target_calories || 2000, unit: "kcal" },
    { key: "protein", label: "Protein", target: macroTargets.protein_g || 60, unit: "g" },
    { key: "carbs", label: "Carbs", target: macroTargets.carbs_g || 200, unit: "g" },
  ];

  return (
    <section className="nv-card p-5 space-y-3">
      <h2 className="font-semibold text-sm">7-Day Nutrient Compliance</h2>
      {metrics.map(({ key, label, target, unit }) => {
        const avg = weekData.reduce((s, d) => s + (d[key] || 0), 0) / Math.max(1, weekData.length);
        const pct = Math.min(100, target > 0 ? Math.round((avg / target) * 100) : 0);
        const color = pct >= 80 && pct <= 120 ? "bg-green-500" : pct < 60 ? "bg-red-400" : "bg-amber-400";
        return (
          <div key={key} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>{label}</span>
              <span className="text-muted-foreground">{Math.round(avg)}{unit} avg / {target}{unit} target</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </section>
  );
}

function ConditionInsights({ weekData, user }) {
  const conditions = user?.conditions || [];
  if (!conditions.length || !weekData?.length) return null;

  const avgSodium = weekData.reduce((s, d) => s + (d.sodium || 0), 0) / Math.max(1, weekData.length);
  const avgFiber = weekData.reduce((s, d) => s + (d.fiber || 0), 0) / Math.max(1, weekData.length);

  const insights = [];
  if (conditions.includes("hypertension") || conditions.includes("heart-disease")) {
    const sodiumLimit = 1500;
    insights.push(avgSodium < sodiumLimit
      ? `Your avg sodium is ${Math.round(avgSodium)}mg/day — well within the ${sodiumLimit}mg limit.`
      : `Your avg sodium is ${Math.round(avgSodium)}mg/day. Target is under ${sodiumLimit}mg.`
    );
  }
  if (conditions.includes("diabetes") || conditions.includes("gut-health")) {
    insights.push(avgFiber >= 25
      ? `Excellent fiber intake — avg ${Math.round(avgFiber)}g/day supports blood sugar control.`
      : `Fiber avg is ${Math.round(avgFiber)}g/day. Aim for 25-35g to support your conditions.`
    );
  }

  if (!insights.length) return null;

  return (
    <section className="space-y-2">
      <h2 className="font-semibold text-sm">Condition Insights</h2>
      {insights.map((insight, i) => (
        <div key={i} className="nv-card p-4 flex items-start gap-3">
          <Target className="size-4 text-primary shrink-0 mt-0.5" />
          <p className="text-sm">{insight}</p>
        </div>
      ))}
    </section>
  );
}

export default function Progress() {
  const { user } = useAuth();
  const [weightHistory, setWeightHistory] = useState([]);
  const [streak, setStreak] = useState(null);
  const [weekData, setWeekData] = useState([]);
  const [macroTargets, setMacroTargets] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadAll() {
    try {
      const [weightRes, streakRes, weekRes] = await Promise.all([
        api.get("/health/weight"),
        api.get("/healthcare/streak"),
        api.get("/nutrition/week"),
      ]);
      setWeightHistory(weightRes.data);
      setStreak(streakRes.data);
      setWeekData(weekRes.data);

      const healthPlan = user?.health_plan;
      if (healthPlan?.macros || healthPlan?.daily_calories) {
        setMacroTargets({
          target_calories: healthPlan.daily_calories || 2000,
          protein_g: healthPlan.macros?.protein_g || 60,
          carbs_g: healthPlan.macros?.carbs_g || 200,
          fat_g: healthPlan.macros?.fat_g || 55,
        });
      } else if (user?.age && user?.weight_kg) {
        const { data } = await api.post("/tdee/calculate", {
          age: user.age, gender: user.gender, weight_kg: user.weight_kg,
          height_cm: user.height_cm, activity_level: user.activity_level || "moderate",
          goal: user.goal || "maintain",
        });
        setMacroTargets(data);
      }
    } catch {
      // Continue with partial data
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadAll(); }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-muted rounded-lg animate-pulse" />
        {[1, 2, 3].map((i) => <div key={i} className="h-36 bg-muted rounded-2xl animate-pulse" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <header>
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Your</p>
        <h1 className="text-2xl font-display font-bold tracking-tight">Progress</h1>
      </header>

      {/* Streak summary */}
      {streak && (
        <section className="grid grid-cols-3 gap-3">
          {[
            { icon: "🔥", value: streak.current_streak_days, label: "Day streak" },
            { icon: "🍽️", value: streak.meals_this_week, label: "Meals this week" },
            { icon: "🥗", value: streak.distinct_recipes_this_week, label: "Unique recipes" },
          ].map(({ icon, value, label }) => (
            <div key={label} className="nv-card p-4 text-center">
              <div className="text-2xl mb-1">{icon}</div>
              <div className="text-2xl font-display font-bold">{value}</div>
              <div className="text-xs text-muted-foreground">{label}</div>
            </div>
          ))}
        </section>
      )}

      {/* Log weight */}
      <section className="nv-card p-5 space-y-3">
        <h2 className="font-semibold text-sm flex items-center gap-1.5">
          <Calendar className="size-4" /> Log today's weight
        </h2>
        <WeightInput onLogged={() => api.get("/health/weight").then(({ data }) => setWeightHistory(data)).catch(() => {})} />
      </section>

      {/* Weight trend chart */}
      <WeightTrend data={weightHistory} />

      {/* 7-day calorie chart */}
      {weekData.length > 0 && (
        <section className="nv-card p-5 space-y-3">
          <h2 className="font-semibold text-sm flex items-center gap-1.5">
            <Flame className="size-4 text-orange-500" /> 7-Day Calories
          </h2>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={weekData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="date" tickFormatter={(d) => d.slice(5)} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(v) => [`${v} kcal`, "Calories"]} />
              <Bar dataKey="calories" radius={[4, 4, 0, 0]}>
                {weekData.map((entry, index) => (
                  <Cell key={index} fill={entry.calories > 0 ? "hsl(var(--primary))" : "hsl(var(--muted))"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </section>
      )}

      {/* Nutrient compliance */}
      <NutrientCompliance weekData={weekData} macroTargets={macroTargets} />

      {/* Condition-specific insights */}
      <ConditionInsights weekData={weekData} user={user} />
    </div>
  );
}
