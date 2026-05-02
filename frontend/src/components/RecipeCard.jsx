import React from "react";
import { Link } from "react-router-dom";
import { Clock, Flame, Lock } from "lucide-react";
import { useAuth } from "../lib/auth";

const catColor = {
  healthcare: "bg-[#00d4aa]/15 text-[#00d4aa] border-[#00d4aa]/30",
  fitness: "bg-[#ff6b35]/15 text-[#ff6b35] border-[#ff6b35]/30",
  cultural: "bg-[#7c5cfc]/15 text-[#7c5cfc] border-[#7c5cfc]/30",
};

export default function RecipeCard({ recipe }) {
  const { user } = useAuth();
  const locked = recipe.is_premium && !user?.is_premium;

  return (
    <Link
      to={locked ? "/app/profile" : `/app/recipe/${recipe.id}`}
      data-testid={`recipe-card-${recipe.id}`}
      className="group block nv-card overflow-hidden hover:-translate-y-1 transition-all duration-300"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={recipe.image}
          alt={recipe.title}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${locked ? "blur-md" : ""}`}
          loading="lazy"
        />
        {recipe.is_premium && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFD166] text-black text-xs font-semibold">
            <Lock className="size-3" /> Premium
          </div>
        )}
        <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full border text-xs font-medium capitalize ${catColor[recipe.category]}`}>
          {recipe.country || recipe.category}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-base font-semibold leading-tight line-clamp-2">{recipe.title}</h3>
        <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1"><Clock className="size-4" />{recipe.cook_time}m</span>
          <span className="inline-flex items-center gap-1"><Flame className="size-4" />{recipe.nutrition.calories} kcal</span>
        </div>
      </div>
    </Link>
  );
}
