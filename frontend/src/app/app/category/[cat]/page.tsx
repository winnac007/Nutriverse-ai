"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import api from "@/lib/api";
import RecipeCard from "@/components/RecipeCard";
import { ArrowLeft } from "lucide-react";

const labels: Record<string, string> = {
  healthcare: "Healthcare",
  fitness: "Fitness",
  cultural: "Cultural",
};

export default function Category({ params }: { params: Promise<{ cat: string }> }) {
  const { cat } = use(params);
  const [recipes, setRecipes] = useState<any[]>([]);

  useEffect(() => {
    api.get("/recipes", { params: { category: cat } }).then((r) => setRecipes(r.data));
  }, [cat]);

  return (
    <div className="space-y-6">
      <Link href="/app" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Home
      </Link>
      <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight capitalize">{labels[cat] || cat}</h1>
      <p className="text-muted-foreground -mt-3">{recipes.length} recipes</p>

      <div className="grid gap-4 sm:grid-cols-2">
        {recipes.map((r) => <RecipeCard key={r.id} recipe={r} />)}
      </div>
    </div>
  );
}
