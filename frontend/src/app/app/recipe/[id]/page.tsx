"use client";

import { use } from "react";

import ZenRecipeDetail from "@/components/recipe/ZenRecipeDetail";

export default function RecipeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <ZenRecipeDetail recipeId={id} />;
}
