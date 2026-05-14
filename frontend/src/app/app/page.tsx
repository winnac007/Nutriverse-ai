"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Bell, ChevronRight, Leaf, Droplets, Zap, User, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function Home() {
  const { user } = useAuth();
  const [mealPlan, setMealPlan] = useState<any>(null);
  const [planRecipes, setPlanRecipes] = useState<Record<string, any>>({});
  const [today, setToday] = useState({ totals: { calories: 0, water_glasses: 6 } });

  useEffect(() => {
    if (!user?.id) return;
    api.get("/nutrition/today").then((r) => setToday(r.data)).catch(() => {});
    api.get("/meal-plan").then((r) => setMealPlan(r.data)).catch(() => {});
  }, [user?.id]);

  useEffect(() => {
    if (!mealPlan?.items?.length) return;
    const todayDay = new Date().toLocaleDateString("en-US", { weekday: "short" });
    const todayItems = mealPlan.items.filter((i: any) => i.day === todayDay);
    const ids: string[] = [...new Set(todayItems.map((i: any) => i.recipe_id))] as string[];
    ids.forEach((id) => {
      if (!planRecipes[id]) {
        api.get(`/recipes/${id}`).then((r) => {
          setPlanRecipes((prev) => ({ ...prev, [id]: r.data }));
        }).catch(() => {});
      }
    });
  }, [mealPlan]);

  const todayDay = new Date().toLocaleDateString("en-US", { weekday: "short" });
  const todayMeals = mealPlan?.items
    ? mealPlan.items.filter((i: any) => i.day === todayDay).slice(0, 3)
    : [];

  return (
    <div className="min-h-screen bg-background pb-32 pt-8 px-6 max-w-md mx-auto space-y-8">
      {/* Top Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-foreground">
            {getGreeting()}, <br />
            <span className="text-primary italic font-serif">{user?.name?.split(" ")[0] || "Aisha"} ✨</span>
          </h1>
          <p className="text-foreground/40 text-[10px] uppercase tracking-widest font-bold mt-1">Today is a fresh start.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="size-10 rounded-full glass-zen grid place-items-center text-foreground/60 border border-border/40">
            <Bell className="size-5" />
          </button>
          <div className="size-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
            <img src="https://i.pravatar.cc/100?u=aisha" alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      {/* Today's Focus Card */}
      <motion.section 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-white border border-border/40 rounded-[2rem] p-6 shadow-sm overflow-hidden"
      >
        <div className="relative z-10">
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-foreground/40 mb-2 block">Today's Focus</span>
          <h2 className="font-serif text-xl text-foreground max-w-[180px]">Eat mindfully and stay hydrated</h2>
        </div>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10">
          <Leaf className="size-16 text-primary" />
        </div>
      </motion.section>

      {/* Today's Meals */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg text-foreground">Today's Meals</h3>
          <Link href="/app/meal-plan" className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-1">
            View plan <ChevronRight className="size-3" />
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {["Breakfast", "Lunch", "Dinner"].map((meal, i) => {
            const item = todayMeals[i];
            const recipe = item ? planRecipes[item.recipe_id] : null;
            return (
              <div key={meal} className="space-y-2 group cursor-pointer">
                <div className="aspect-square rounded-[1.5rem] overflow-hidden border border-border/20 shadow-inner relative">
                  <img 
                    src={recipe?.image || `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&sig=${i}`} 
                    alt={meal}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 text-center">{meal}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Trackers Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-border/40 rounded-[2rem] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[9px] font-bold uppercase tracking-widest text-foreground/40">Water</span>
            <Droplets className="size-4 text-blue-400/60" />
          </div>
          <div className="text-2xl font-serif text-foreground mb-4">6/8 <span className="text-[10px] font-sans text-foreground/30 ml-1">glasses</span></div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= 6 ? "bg-blue-400" : "bg-blue-50"}`} />
            ))}
          </div>
        </div>
        <div className="bg-white border border-border/40 rounded-[2rem] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[9px] font-bold uppercase tracking-widest text-foreground/40">Mindful Streak</span>
            <Leaf className="size-4 text-primary/60" />
          </div>
          <div className="text-2xl font-serif text-foreground mb-4">7 <span className="text-[10px] font-sans text-foreground/30 ml-1">days</span></div>
          <div className="h-1.5 w-full bg-primary/10 rounded-full overflow-hidden">
            <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                className="h-full bg-primary" 
            />
          </div>
        </div>
      </div>

      {/* Tip of the Day Card */}
      <motion.section 
        whileHover={{ scale: 0.98 }}
        className="bg-[#FAF8F2] border border-border/60 rounded-[2rem] p-6 flex items-start gap-4 relative overflow-hidden"
      >
        <div className="size-10 rounded-full bg-white grid place-items-center shrink-0 shadow-sm border border-border/20">
            <Zap className="size-5 text-accent" />
        </div>
        <div className="flex-1 pr-4">
            <span className="text-[9px] font-bold uppercase tracking-widest text-foreground/40 mb-1 block">Tip of the Day</span>
            <p className="text-xs text-foreground/70 leading-relaxed italic font-serif">
                "Chew slowly. Your body listens to every bite. Take deep breaths."
            </p>
        </div>
        <ChevronRight className="size-4 text-foreground/20 absolute right-6 top-1/2 -translate-y-1/2" />
      </motion.section>
    </div>
  );
}
