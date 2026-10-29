"use client";

import { Suspense, use } from "react";
import MealPlanDetailClient from "@/components/recipe/MealPlanDetailClient";

export default function MealPlanItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f8f3ec]" />}>
      <MealPlanDetailClient recipeId={id} />
    </Suspense>
  );
}

