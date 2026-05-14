"use client";

import React from "react";
import Link from "next/link";
import { Clock, Flame, Lock, ChevronRight } from "lucide-react";
import { useAuth } from "@/lib/auth";

export default function RecipeCard({ recipe }: { recipe: any }) {
  const { user } = useAuth();
  const locked = recipe.is_premium && !user?.is_premium;

  return (
    <Link
      href={locked ? "/app/profile" : `/app/recipe/${recipe.id}`}
      className="group block bg-white border border-[#D9C39A]/40 rounded-[2rem] overflow-hidden hover:shadow-xl hover:shadow-[#3A2618]/5 transition-all duration-500"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={recipe.image || `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800`}
          alt={recipe.title}
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${locked ? "blur-md" : ""}`}
          loading="lazy"
        />
        {recipe.is_premium && (
          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF3E6] border border-[#D9C39A] text-[#3A2618] text-[10px] font-bold uppercase tracking-widest shadow-sm">
            <Lock className="size-3" /> Premium
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#004D40]">{recipe.category}</span>
          <span className="size-1 rounded-full bg-[#D9C39A]" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#3A2618]/40">{recipe.country || "Global"}</span>
        </div>
        <h3 className="font-serif text-xl text-[#3A2618] leading-tight mb-4 group-hover:text-[#004D40] transition-colors">{recipe.title}</h3>
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-widest text-[#3A2618]/50">
            <span className="flex items-center gap-1.5"><Clock className="size-3.5" />{recipe.cook_time}m</span>
            <span className="flex items-center gap-1.5"><Flame className="size-3.5" />{recipe.nutrition?.calories || 0} Cal</span>
          </div>
          <div className="size-8 rounded-full border border-[#D9C39A]/40 grid place-items-center group-hover:bg-[#004D40] group-hover:border-[#004D40] group-hover:text-white transition-all duration-300">
            <ChevronRight className="size-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}
