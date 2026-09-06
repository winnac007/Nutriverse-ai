"use client";

import { Suspense, use } from "react";
import ZenRecipeDetail from "@/components/recipe/ZenRecipeDetail";

export default function RecipeNutritionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <Suspense fallback={null}>
      <ZenRecipeDetail recipeId={id} initialTab="nutrition" />
    </Suspense>
  );
}
