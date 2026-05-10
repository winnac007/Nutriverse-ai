"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { ShoppingCart, Check, Copy, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

const CATEGORY_ICONS: Record<string, string> = {
  Produce: "🥦",
  Protein: "🍗",
  Grains: "🌾",
  Dairy: "🥛",
  "Oils & Condiments": "🫙",
  "Nuts & Seeds": "🥜",
  "All Ingredients": "🛒",
  Other: "📦",
};

export default function GroceryList() {
  const [grouped, setGrouped] = useState<Record<string, string[]>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    if (typeof window === "undefined") return {};
    try { return JSON.parse(localStorage.getItem("nv_grocery_checked") || "{}"); }
    catch { return {}; }
  });
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/meal-plan/grocery-list")
      .then(({ data }) => setGrouped(data))
      .catch(() => toast.error("Could not load grocery list"))
      .finally(() => setLoading(false));
  }, []);

  function toggleItem(key: string) {
    const next = { ...checked, [key]: !checked[key] };
    setChecked(next);
    localStorage.setItem("nv_grocery_checked", JSON.stringify(next));
  }

  function clearChecked() {
    const next = Object.fromEntries(Object.entries(checked).filter(([, v]) => !v));
    setChecked(next);
    localStorage.setItem("nv_grocery_checked", JSON.stringify(next));
  }

  function copyToClipboard() {
    const lines = Object.entries(grouped).flatMap(([cat, items]) => [
      `== ${cat} ==`,
      ...items.map((item) => `• ${item}`),
    ]);
    navigator.clipboard.writeText(lines.join("\n"))
      .then(() => toast.success("Grocery list copied!"))
      .catch(() => toast.error("Could not copy"));
  }

  function toggleSection(cat: string) {
    setCollapsed((prev) => ({ ...prev, [cat]: !prev[cat] }));
  }

  const hasItems = Object.values(grouped).some((items) => items.length > 0);
  const totalItems = Object.values(grouped).reduce((s, items) => s + items.length, 0);
  const checkedCount = Object.values(checked).filter(Boolean).length;

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-muted rounded-lg animate-pulse" />
        <div className="h-40 bg-muted rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-8">
      <header className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">This week's</p>
          <h1 className="text-2xl font-display font-bold tracking-tight">Grocery List</h1>
        </div>
        {hasItems && (
          <div className="flex gap-2">
            <button onClick={clearChecked} title="Clear checked"
              className="size-9 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
              <Trash2 className="size-4 text-muted-foreground" />
            </button>
            <button onClick={copyToClipboard} title="Copy list"
              className="size-9 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
              <Copy className="size-4 text-muted-foreground" />
            </button>
          </div>
        )}
      </header>

      {hasItems && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{checkedCount} / {totalItems} items checked</span>
          <div className="h-1.5 flex-1 mx-4 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all"
              style={{ width: `${totalItems > 0 ? (checkedCount / totalItems) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}

      {!hasItems ? (
        <div className="nv-card p-10 text-center space-y-3">
          <ShoppingCart className="size-10 mx-auto text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">No grocery list yet.</p>
          <p className="text-xs text-muted-foreground">Generate a meal plan first to auto-create your grocery list.</p>
          <Link href="/app/meal-plan"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary">
            Go to Meal Plan →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {Object.entries(grouped).map(([category, items]) => {
            if (!items.length) return null;
            const isCollapsed = collapsed[category];

            return (
              <div key={category} className="nv-card overflow-hidden">
                <button
                  onClick={() => toggleSection(category)}
                  className="w-full p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{CATEGORY_ICONS[category] || "📦"}</span>
                    <span className="font-semibold text-sm">{category}</span>
                    <span className="text-xs text-muted-foreground">
                      ({items.filter((item) => checked[`${category}:${item}`]).length}/{items.length})
                    </span>
                  </div>
                  {isCollapsed
                    ? <ChevronDown className="size-4 text-muted-foreground" />
                    : <ChevronUp className="size-4 text-muted-foreground" />
                  }
                </button>

                {!isCollapsed && (
                  <div className="px-4 pb-4 space-y-1">
                    {items.map((item) => {
                      const key = `${category}:${item}`;
                      const isChecked = checked[key];
                      return (
                        <button
                          key={key}
                          onClick={() => toggleItem(key)}
                          className={`w-full flex items-center gap-3 py-2.5 px-2 rounded-lg transition-colors hover:bg-muted/50 ${
                            isChecked ? "opacity-50" : ""
                          }`}
                        >
                          <div className={`size-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                            isChecked
                              ? "bg-green-500 border-green-500"
                              : "border-muted-foreground/40"
                          }`}>
                            {isChecked && <Check className="size-3 text-white" />}
                          </div>
                          <span className={`text-sm text-left ${isChecked ? "line-through text-muted-foreground" : ""}`}>
                            {item}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
