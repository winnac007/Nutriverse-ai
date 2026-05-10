"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";
import MedicalDisclaimer from "@/components/MedicalDisclaimer";
import { CheckCircle, XCircle, BookOpen, ArrowLeftRight } from "lucide-react";

export default function FoodGuidelines() {
  const { user } = useAuth();
  const [guidelines, setGuidelines] = useState<Record<string, any>>({});
  const [swaps, setSwaps] = useState<any[]>([]);
  const [activeCondition, setActiveCondition] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const conditions = user?.conditions || [];

  useEffect(() => {
    if (!conditions.length) {
      setLoading(false);
      return;
    }
    Promise.all([
      api.get("/healthcare/food-guidelines"),
      api.get("/healthcare/swaps"),
    ])
      .then(([guidelinesRes, swapsRes]) => {
        setGuidelines(guidelinesRes.data);
        setSwaps(swapsRes.data);
        setActiveCondition(conditions[0]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?.id, conditions]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-muted rounded-lg animate-pulse" />
        <div className="h-48 bg-muted rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!conditions.length) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <BookOpen className="size-10 mx-auto mb-3 opacity-40" />
        <p className="text-sm">Add health conditions in your profile to see personalized food guidelines.</p>
      </div>
    );
  }

  const active = activeCondition ? guidelines[activeCondition] : null;

  const CONDITION_LABEL_MAP = Object.fromEntries(
    (user?.conditions || []).map((c) => [c, c.replace(/-/g, " ").replace(/\b\w/g, (ch) => ch.toUpperCase())])
  );

  const conditionSwaps = swaps.filter((s) => s.best_for?.includes(activeCondition));

  return (
    <div className="space-y-6 pb-8">
      <header>
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Personalized</p>
        <h1 className="text-2xl font-display font-bold tracking-tight">Food Guidelines</h1>
      </header>

      <MedicalDisclaimer variant="inline" />

      {conditions.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
          {conditions.map((cid) => (
            <button
              key={cid}
              onClick={() => setActiveCondition(cid)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                activeCondition === cid
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {CONDITION_LABEL_MAP[cid] || cid}
            </button>
          ))}
        </div>
      )}

      {active ? (
        <div className="space-y-5">
          <h2 className="font-display text-lg font-semibold">{active.label}</h2>

          {active.food_rules?.length > 0 && (
            <section className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Rules to follow</h3>
              {active.food_rules.map((rule: string, i: number) => (
                <div key={i} className="nv-card p-4 flex items-start gap-3">
                  <div className="size-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-sm leading-relaxed">{rule}</p>
                </div>
              ))}
            </section>
          )}

          {(active.foods_to_eat?.length > 0 || active.plan_foods_to_eat?.length > 0) && (
            <section className="nv-card p-5 space-y-3">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <CheckCircle className="size-4 text-green-500" />
                Foods to include
              </h3>
              <div className="space-y-1">
                {[...(active.plan_foods_to_eat || []), ...(active.foods_to_eat || [])]
                  .filter((f, i, arr) => arr.indexOf(f) === i)
                  .map((food) => (
                    <div key={food} className="flex items-center gap-2 py-1.5 border-b border-border/50 last:border-0">
                      <CheckCircle className="size-3.5 text-green-500 shrink-0" />
                      <span className="text-sm capitalize">{food}</span>
                    </div>
                  ))}
              </div>
            </section>
          )}

          {(active.foods_to_avoid?.length > 0 || active.plan_foods_to_avoid?.length > 0) && (
            <section className="nv-card p-5 space-y-3">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <XCircle className="size-4 text-destructive" />
                Foods to avoid or limit
              </h3>
              <div className="space-y-1">
                {[...(active.plan_foods_to_avoid || []), ...(active.foods_to_avoid || [])]
                  .filter((f, i, arr) => arr.indexOf(f) === i)
                  .map((food) => (
                    <div key={food} className="flex items-center gap-2 py-1.5 border-b border-border/50 last:border-0">
                      <XCircle className="size-3.5 text-destructive shrink-0" />
                      <span className="text-sm capitalize">{food}</span>
                    </div>
                  ))}
              </div>
            </section>
          )}

          {conditionSwaps.length > 0 && (
            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                <ArrowLeftRight className="size-3.5" /> Smart swaps
              </h3>
              {conditionSwaps.map((swap: any) => (
                <div key={swap.from} className="nv-card p-4 space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium line-through text-muted-foreground">{swap.from}</span>
                    <ArrowLeftRight className="size-3.5 text-primary shrink-0" />
                    <span className="font-semibold text-primary">{swap.to}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{swap.reason}</p>
                </div>
              ))}
            </section>
          )}
        </div>
      ) : (
        <div className="nv-card p-8 text-center text-muted-foreground text-sm">
          Select a condition above to view guidelines.
        </div>
      )}

      <MedicalDisclaimer variant="page-footer" />
    </div>
  );
}
