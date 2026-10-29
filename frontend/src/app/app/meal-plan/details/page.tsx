"use client";

import { Suspense } from "react";
import MealPlanDetailClient from "@/components/recipe/MealPlanDetailClient";

export default function MealPlanDetailsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f8f3ec]" />}>
      <MealPlanDetailClient />
    </Suspense>
  );
}

