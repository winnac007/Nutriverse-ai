"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { ChevronRight, Calendar, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snacks"];

function todayDayKey() {
  return new Date().toLocaleDateString("en-US", { weekday: "short" });
}

export default function DailyPlan() {
  const { user } = useAuth();
  const [selectedType, setSelectedType] = useState("Breakfast");
  const [plan, setPlan] = useState<any>(null);
  const [recipeCache, setRecipeCache] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  const fetchPlan = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/meal-plan");
      setPlan(data);
    } catch {
      toast.error("Could not load meal plan");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPlan(); }, [fetchPlan]);

  const todayDay = todayDayKey();
  const todayItems = (plan?.items || []).filter((i: any) => i.day === todayDay);

  useEffect(() => {
    todayItems.forEach(({ recipe_id }: { recipe_id: string }) => {
      if (!recipeCache[recipe_id]) {
        api.get(`/recipes/${recipe_id}`)
          .then(({ data }) => setRecipeCache((prev) => ({ ...prev, [recipe_id]: data })))
          .catch(() => {});
      }
    });
  }, [plan]);

  return (
    <div className="space-y-8 pb-32 pt-6">
      {/* Header - Image 5 */}
      <header className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-[#3A2618]">Today's Plan</h1>
        <Link href="/app/meal-plan" className="size-10 rounded-full border border-[#D9C39A]/40 bg-white grid place-items-center text-[#3A2618]/60">
          <Calendar className="size-5" />
        </Link>
      </header>

      {/* Meal Type Tabs - Image 5 */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
        {MEAL_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`shrink-0 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
              selectedType === type 
                ? "bg-[#3A2618] text-white border-[#3A2618]" 
                : "bg-white border-[#D9C39A]/40 text-[#3A2618]/60 hover:border-[#3A2618]"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Meal List - Image 5 */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center py-20 opacity-20">
            <Loader2 className="size-8 animate-spin text-[#004D40]" />
          </div>
        ) : todayItems.length > 0 ? (
          todayItems.map((item: any, i) => {
            const recipe = recipeCache[item.recipe_id];
            // Only show meals matching selected type (mocking Breakfast/Lunch/Dinner mapping)
            const matchesType = selectedType.toLowerCase() === item.meal_type.toLowerCase();
            if (!matchesType && selectedType !== "Snacks") return null;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link 
                  href={`/app/recipe/${item.recipe_id}`}
                  className="bg-white border border-[#D9C39A]/40 rounded-[2rem] p-4 flex items-center gap-4 group hover:shadow-xl hover:shadow-[#3A2618]/5 transition-all duration-500"
                >
                  <div className="size-20 rounded-full overflow-hidden border border-[#D9C39A]/20 shrink-0">
                    <img 
                      src={recipe?.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200"} 
                      alt="" 
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-lg text-[#3A2618] truncate group-hover:text-[#004D40] transition-colors">
                      {recipe?.title || "Loading..."}
                    </h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#3A2618]/40 mt-1">
                      {recipe?.category === 'healthcare' ? 'Balanced • Satisfying' : 'Light • Energizing'}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-[#3A2618]/30 uppercase tracking-widest mt-2">
                      <Clock className="size-3" /> {recipe?.cook_time || 20} min
                    </div>
                  </div>
                  <ChevronRight className="size-5 text-[#3A2618]/20 group-hover:text-[#3A2618] transition-colors shrink-0" />
                </Link>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-24 text-[#3A2618]/30 font-serif text-xl">
            Your plan is being prepared.
          </div>
        )}
      </div>

      {/* Footer CTA - Image 5 */}
      <div className="fixed bottom-32 left-6 right-6 flex justify-center">
        <Link href="/app/meal-plan" className="w-full max-w-sm">
          <button className="w-full bg-[#3A2618] text-white rounded-full py-5 text-sm font-bold uppercase tracking-[0.2em] shadow-xl shadow-[#3A2618]/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
            View Full Plan
          </button>
        </Link>
      </div>

      {/* Bottom Nav Sync */}
      <nav className="fixed bottom-6 left-6 right-6 h-16 bg-white border border-[#D9C39A]/40 rounded-full shadow-lg shadow-[#3A2618]/5 flex items-center justify-around px-4 z-50">
        <Link href="/app" className="p-3 text-[#3A2618]/30"><Leaf className="size-6" /></Link>
        <Link href="/app/daily-plan" className="p-3 text-[#004D40]"><Utensils className="size-6" /></Link>
        <button className="size-12 rounded-full bg-[#004D40] text-white flex items-center justify-center shadow-lg shadow-[#004D40]/20 -translate-y-4">
          <Search className="size-6" />
        </button>
        <Link href="/app/progress" className="p-3 text-[#3A2618]/30 hover:text-[#3A2618]"><BarChart2 className="size-6" /></Link>
        <Link href="/app/profile" className="p-3 text-[#3A2618]/30 hover:text-[#3A2618]"><User className="size-6" /></Link>
      </nav>
    </div>
  );
}

// Mock imports for navigation consistency
const Leaf = ({ className }: { className?: string }) => <div className={className}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 8-.5 2.2-2 4.4-3.8 6a7 7 0 0 1-5.2 4Z"/><path d="M7 20s0-2 1-4.5"/><path d="M14 20l1.5-3"/></svg></div>;
const Utensils = ({ className }: { className?: string }) => <div className={className}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg></div>;
const Search = ({ className }: { className?: string }) => <div className={className}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg></div>;
const BarChart2 = ({ className }: { className?: string }) => <div className={className}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg></div>;
const User = ({ className }: { className?: string }) => <div className={className}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>;
