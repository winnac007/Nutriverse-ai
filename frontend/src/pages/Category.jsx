import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../lib/api";
import RecipeCard from "../components/RecipeCard";
import { ArrowLeft } from "lucide-react";

const labels = {
  healthcare: "Healthcare",
  fitness: "Fitness",
  cultural: "Cultural",
};

export default function Category() {
  const { cat } = useParams();
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    api.get("/recipes", { params: { category: cat } }).then((r) => setRecipes(r.data));
  }, [cat]);

  return (
    <div className="space-y-6">
      <Link to="/app" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground" data-testid="category-back">
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
