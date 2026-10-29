"use client";

import { Suspense, use } from "react";
import ZenRecipeDetail from "@/components/recipe/ZenRecipeDetail";
import MealPlanDetailClient from "@/components/recipe/MealPlanDetailClient";

const MEAL_PLAN_RECIPE_IDS = [
  "moong-dal-chilla",
  "moong-dal-cheela",
  "greek-yogurt-bowl",
  "quinoa-buddha-bowl",
  "masala-buttermilk",
  "paneer-veg-stir-fry",
];

export default function RecipeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  if (MEAL_PLAN_RECIPE_IDS.includes(id)) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-[#f8f3ec]" />}>
        <MealPlanDetailClient recipeId={id} />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={null}>
      <ZenRecipeDetail recipeId={id} />
    </Suspense>
  );
}
