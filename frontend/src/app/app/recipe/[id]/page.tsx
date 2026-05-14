"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { ArrowLeft, Heart, Clock, Users, Plus, PlayCircle, Star, Leaf } from "lucide-react";
import { toast } from "sonner";
import PremiumGate from "@/components/PremiumGate";
import { useAuth } from "@/lib/auth";
import { motion } from "framer-motion";

export default function RecipeDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user, refresh } = useAuth();
  const [recipe, setRecipe] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("ingredients");

  useEffect(() => {
    api.get(`/recipes/${id}`).then((r) => setRecipe(r.data));
  }, [id]);

  if (!recipe) return (
    <div className="min-h-screen bg-[#FAF3E6] flex items-center justify-center font-serif text-[#3A2618]/30 text-xl">
      Preparing...
    </div>
  );

  const locked = recipe.is_premium && !user?.is_premium;

  const toggleSave = async () => {
    try {
      await api.post(`/user/save-recipe/${recipe.id}`);
      await refresh();
      toast.success("Saved to favorites");
    } catch { toast.error("Failed to save"); }
  };

  const saved = user?.saved_recipes?.includes(recipe.id);

  if (locked) {
    return (
      <div className="space-y-6 p-6 bg-[#FAF3E6] min-h-screen">
        <Link href="/app/explore" className="inline-flex items-center gap-2 text-[#3A2618]"><ArrowLeft className="size-5" /></Link>
        <PremiumGate title={recipe.title} description={recipe.description + " — Premium recipe."} />
      </div>
    );
  }

  return (
    <div className="bg-[#FAF3E6] min-h-screen pb-32">
      {/* Top Image Area */}
      <div className="relative h-[45vh] w-full rounded-b-[3rem] overflow-hidden shadow-sm">
        <img 
          src={recipe.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800"} 
          alt={recipe.title} 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/10" />
        
        {/* Top Bar */}
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
          <Link href="/app/daily-plan" className="size-10 rounded-full bg-white/20 backdrop-blur-md grid place-items-center text-white border border-white/20">
            <ArrowLeft className="size-5" />
          </Link>
          <button onClick={toggleSave} className="size-10 rounded-full bg-white/20 backdrop-blur-md grid place-items-center text-white border border-white/20">
            <Heart className={`size-5 ${saved ? "fill-current" : ""}`} />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="px-6 pt-8 max-w-3xl mx-auto">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="font-serif text-3xl text-[#3A2618] leading-tight flex items-center gap-2">
              {recipe.title} <Leaf className="size-5 text-[#004D40]" />
            </h1>
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#3A2618]/50 mt-2">
              High fiber • Protein rich • Anti-inflammatory
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-[11px] font-bold uppercase tracking-widest text-[#3A2618]/60 mb-8">
          <span className="flex items-center gap-1.5"><Clock className="size-4" /> {recipe.cook_time || 25} min</span>
          <span className="flex items-center gap-1.5"><Star className="size-4" /> Easy</span>
          <span className="flex items-center gap-1.5"><Users className="size-4" /> Serves {recipe.servings || 1}</span>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-[#D9C39A]/40 mb-6">
          {["ingredients", "nutrition", "steps"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-bold uppercase tracking-widest transition-colors relative ${
                activeTab === tab ? "text-[#004D40]" : "text-[#3A2618]/40 hover:text-[#3A2618]/70"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div layoutId="recipe-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#004D40]" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-4">
          {activeTab === "ingredients" && (
            <ul className="space-y-4">
              {recipe.ingredients.map((i: any, idx: number) => (
                <li key={idx} className="flex items-center gap-4 text-sm text-[#3A2618]">
                  <div className="size-1.5 rounded-full bg-[#004D40]" />
                  <span className="font-bold">{i.amount}</span>
                  <span className="capitalize">{i.name}</span>
                </li>
              ))}
            </ul>
          )}
          {activeTab === "nutrition" && (
            <div className="grid grid-cols-2 gap-4">
              {["calories", "protein", "carbs", "fat"].map((k) => (
                <div key={k} className="bg-white border border-[#D9C39A]/40 rounded-2xl p-4 flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#3A2618]/40">{k}</span>
                  <span className="font-serif text-xl text-[#3A2618]">{recipe.nutrition?.[k]}{k !== 'calories' ? 'g' : ''}</span>
                </div>
              ))}
            </div>
          )}
          {activeTab === "steps" && (
            <ol className="space-y-6">
              {recipe.steps.map((s: string, idx: number) => (
                <li key={idx} className="flex gap-4">
                  <span className="font-serif text-2xl text-[#004D40]/30">{idx + 1}</span>
                  <span className="text-sm text-[#3A2618] leading-relaxed pt-1">{s}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={() => toast.success("Added to today's plan")}
        className="fixed bottom-8 right-6 size-14 rounded-full bg-[#004D40] text-white shadow-xl shadow-[#004D40]/30 grid place-items-center hover:scale-105 transition-transform z-50"
      >
        <Plus className="size-6" />
      </button>
    </div>
  );
}
