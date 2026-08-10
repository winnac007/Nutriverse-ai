"use client";

import { use } from "react";

import RecipeExperience from "@/components/culinary/RecipeExperience";

export default function RecipeIngredientsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <RecipeExperience recipeId={id} view="ingredients" />;
}
