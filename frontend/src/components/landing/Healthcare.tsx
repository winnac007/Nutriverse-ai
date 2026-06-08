"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Droplets, Brain, Zap, Heart, Wind, Flame, 
  ArrowRight, Star, Info, Apple, Leaf, Utensils
} from "lucide-react";

type FoodItem = { name: string; note: string; img: string };
type ConditionDetail = {
  id: string;
  name: string;
  subtitle: string;
  eat: FoodItem[];
  moderation: FoodItem[];
  skip: FoodItem[];
  nutrients: string[];
  recipe: { name: string; meta: string; img: string };
  angle: number; // degrees for circle positioning
};

const CONDITIONS: ConditionDetail[] = [
  {
    id: "diabetes",
    name: "Diabetes friendly",
    subtitle: "Steady-blood-sugar meals for everyday balance.",
    eat: [
      { name: "Millet khichdi", note: "High fibre", img: "/landing/hero-bowl.jpg" },
      { name: "Cinnamon oats", note: "Balances sugar", img: "/landing/healthcare-bowl.jpg" },
      { name: "Methi paratha", note: "Supports insulin", img: "/landing/discover-bowl.jpg" },
    ],
    moderation: [
      { name: "Brown rice", note: "Whole grain", img: "/landing/fitness-plate.jpg" },
      { name: "Sweet potato", note: "Slow release", img: "/landing/dish-india.jpg" },
    ],
    skip: [
      { name: "White rice", note: "High GI", img: "/landing/dish-japan.jpg" },
      { name: "Sugary chai", note: "Spikes sugar", img: "/landing/dish-morocco.jpg" },
    ],
    nutrients: ["Fibre", "Magnesium", "Chromium", "Omega-3"],
    recipe: { name: "Cinnamon Moong Oats", meta: "20 mins · Easy", img: "/landing/healthcare-bowl.jpg" },
    angle: -90,
  },
  {
    id: "pcos",
    name: "PCOS smart swaps",
    subtitle: "Hormone-aware nourishment for rhythmic health.",
    eat: [
      { name: "Flaxseed bowl", note: "Estrogen balance", img: "/landing/hero-bowl.jpg" },
      { name: "Spearmint tea", note: "Anti-androgen", img: "/landing/healthcare-bowl.jpg" },
    ],
    moderation: [
      { name: "Full-fat dairy", note: "Limited quantities", img: "/landing/fitness-plate.jpg" },
    ],
    skip: [
      { name: "Refined sugar", note: "Inflammatory", img: "/landing/dish-japan.jpg" },
    ],
    nutrients: ["Inositol", "Zinc", "Vitamin D"],
    recipe: { name: "Spearmint Berry Bowl", meta: "15 mins · Light", img: "/landing/hero-bowl.jpg" },
    angle: 0,
  },
  {
    id: "gut",
    name: "Gut health",
    subtitle: "Calm-belly recipes for microbiome diversity.",
    eat: [
      { name: "Fermented kanji", note: "Probiotic rich", img: "/landing/dish-india.jpg" },
      { name: "Stewed apples", note: "Pectin for lining", img: "/landing/healthcare-bowl.jpg" },
    ],
    moderation: [
      { name: "Raw crucifers", note: "Cook for comfort", img: "/landing/hero-bowl.jpg" },
    ],
    skip: [
      { name: "Spicy oils", note: "Lining irritant", img: "/landing/dish-morocco.jpg" },
    ],
    nutrients: ["Probiotics", "L-Glutamine", "Butyrate"],
    recipe: { name: "Golden Kanji Soup", meta: "30 mins · Healing", img: "/landing/dish-india.jpg" },
    angle: 180,
  },
  {
    id: "thyroid",
    name: "Thyroid balance",
    subtitle: "Gentle metabolic care for sustained energy.",
    eat: [
      { name: "Brazil nuts", note: "Selenium boost", img: "/landing/hero-bowl.jpg" },
      { name: "Seaweed soup", note: "Iodine source", img: "/landing/dish-japan.jpg" },
    ],
    moderation: [
      { name: "Soy products", note: "May block uptake", img: "/landing/fitness-plate.jpg" },
    ],
    skip: [
      { name: "Gluten loads", note: "Often reactive", img: "/landing/dish-morocco.jpg" },
    ],
    nutrients: ["Selenium", "Iodine", "Tyrosine"],
    recipe: { name: "Brazil Nut Pesto Pasta", meta: "25 mins · Rich", img: "/landing/fitness-plate.jpg" },
    angle: 90,
  },
  {
    id: "cholesterol",
    name: "Cholesterol smart",
    subtitle: "Heart-soft cooking for arterial wellness.",
    eat: [
      { name: "Steamed sprouts", note: "Fibre scrub", img: "/landing/dish-india.jpg" },
      { name: "Walnut stack", note: "Healthy fats", img: "/landing/hero-bowl.jpg" },
    ],
    moderation: [
      { name: "Red meat", note: "Choose lean cuts", img: "/landing/fitness-plate.jpg" },
    ],
    skip: [
      { name: "Trans fats", note: "Clogs pipes", img: "/landing/dish-japan.jpg" },
    ],
    nutrients: ["Sterols", "Soluble Fibre", "CoQ10"],
    recipe: { name: "Walnut Crusted Tofu", meta: "20 mins · Hearty", img: "/landing/hero-bowl.jpg" },
    angle: 135,
  },
];

export function Healthcare() {
  const [activeId, setActiveId] = useState("diabetes");
  const active = CONDITIONS.find((c) => c.id === activeId)!;

  return (
    <section id="healthcare" className="relative min-h-screen bg-[#F4F1E8] py-24 md:py-32 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sage/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-16">
          <p className="eyebrow text-espresso/60 mb-4">Chapter one · Heal & Restore</p>
          <h2 className="font-serif text-4xl md:text-7xl text-espresso leading-tight">
            When food gets confusing,<br />
            Zenplato becomes your guide.
          </h2>
          <p className="mt-6 text-espresso/60 max-w-lg text-lg">
            One platform, every condition. Tap a restorative vessel — the artifacts show what to eat, what to limit, and what to avoid.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1.1fr_1.4fr] gap-16 items-center">
          {/* LEFT: CONDITION SELECTOR */}
          <div className="flex flex-col gap-4 w-full max-w-sm mx-auto lg:mx-0 lg:py-10">
            {CONDITIONS.map((c, i) => {
              const isActive = activeId === c.id;

              return (
                <motion.button
                  key={c.id}
                  onClick={() => setActiveId(c.id)}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`w-full text-left p-5 rounded-3xl transition-all duration-500 flex items-center justify-between border ${
                    isActive 
                      ? "bg-white/80 backdrop-blur-xl border-gold/30 shadow-[0_20px_40px_-15px_rgba(74,64,54,0.1)] scale-[1.02]" 
                      : "bg-white/30 backdrop-blur-sm border-transparent hover:bg-white/60 hover:border-espresso/10"
                  }`}
                >
                  <div className="flex items-center gap-5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors duration-500 ${
                      isActive ? "bg-gold/20 text-olive" : "bg-espresso/5 text-espresso/40"
                    }`}>
                      {c.id === 'diabetes' && <Droplets className="w-6 h-6" />}
                      {c.id === 'pcos' && <Wind className="w-6 h-6" />}
                      {c.id === 'gut' && <Leaf className="w-6 h-6" />}
                      {c.id === 'thyroid' && <Zap className="w-6 h-6" />}
                      {c.id === 'cholesterol' && <Heart className="w-6 h-6" />}
                    </div>
                    <div>
                      <h4 className={`font-serif text-xl transition-colors duration-500 ${isActive ? "text-espresso" : "text-espresso/60"}`}>
                        {c.name}
                      </h4>
                      <p className={`text-xs mt-1 transition-colors duration-500 ${isActive ? "text-espresso/70" : "text-espresso/40"}`}>
                        Tap to explore
                      </p>
                    </div>
                  </div>
                  {isActive ? (
                    <motion.div 
                      layoutId="active-indicator"
                      className="w-2.5 h-2.5 rounded-full bg-gold"
                    />
                  ) : (
                    <div className="w-2.5 h-2.5 rounded-full bg-transparent" />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* RIGHT: INSIGHT CARD */}
          <div className="relative min-h-[700px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="w-full bg-white/80 backdrop-blur-2xl rounded-[3rem] p-8 md:p-12 shadow-[0_40px_100px_-30px_rgba(74,64,54,0.2)] border border-white/50 relative overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-sage/20 flex items-center justify-center text-sage">
                      <Leaf className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="font-serif text-3xl md:text-4xl text-espresso">{active.name}</h3>
                      <p className="text-espresso/50 text-sm mt-1">{active.subtitle}</p>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-sage/10 text-sage text-[10px] font-bold tracking-widest uppercase">
                    <div className="w-1.5 h-1.5 rounded-full bg-sage animate-pulse" /> Active
                  </div>
                </div>

                {/* Dietary Guidance Columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                  {/* Eat Freely */}
                  <div>
                    <div className="flex items-center gap-2 mb-6">
                      <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-sage">Eat Freely</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-sage" />
                    </div>
                    <div className="space-y-4">
                      {active.eat.map((item) => (
                        <div key={item.name} className="flex items-center gap-4">
                          <img src={item.img} alt="" className="w-12 h-12 rounded-xl object-cover" />
                          <div>
                            <p className="text-sm font-bold text-espresso">{item.name}</p>
                            <p className="text-[10px] text-espresso/40 uppercase tracking-wider">{item.note}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* In Moderation */}
                  <div>
                    <div className="flex items-center gap-2 mb-6">
                      <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-gold">In Moderation</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                    </div>
                    <div className="space-y-4">
                      {active.moderation.map((item) => (
                        <div key={item.name} className="flex items-center gap-4">
                          <img src={item.img} alt="" className="w-12 h-12 rounded-xl object-cover" />
                          <div>
                            <p className="text-sm font-bold text-espresso">{item.name}</p>
                            <p className="text-[10px] text-espresso/40 uppercase tracking-wider">{item.note}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skip */}
                  <div>
                    <div className="flex items-center gap-2 mb-6">
                      <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#C47D64]">Skip These</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-[#C47D64]" />
                    </div>
                    <div className="space-y-4">
                      {active.skip.map((item) => (
                        <div key={item.name} className="flex items-center gap-4">
                          <img src={item.img} alt="" className="w-12 h-12 rounded-xl object-cover opacity-60 grayscale" />
                          <div>
                            <p className="text-sm font-bold text-espresso/60">{item.name}</p>
                            <p className="text-[10px] text-espresso/40 uppercase tracking-wider">{item.note}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Insight Cards */}
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  <div className="bg-sage/5 rounded-3xl p-6 border border-sage/10">
                    <p className="text-[11px] font-bold tracking-widest uppercase text-sage mb-4">Healing nutrients to focus on</p>
                    <div className="flex flex-wrap gap-4">
                      {active.nutrients.map((n) => (
                        <div key={n} className="flex flex-col items-center gap-1">
                          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                            <Star className="w-4 h-4 text-sage" />
                          </div>
                          <span className="text-[10px] text-espresso/60">{n}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gold/5 rounded-3xl p-6 border border-gold/10 group cursor-pointer hover:bg-gold/10 transition-colors">
                    <p className="text-[11px] font-bold tracking-widest uppercase text-gold mb-4">Recipes you'll love</p>
                    <div className="flex items-center gap-4">
                      <img src={active.recipe.img} alt="" className="w-14 h-14 rounded-xl object-cover" />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-espresso">{active.recipe.name}</p>
                        <p className="text-[11px] text-espresso/50">{active.recipe.meta}</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gold shadow-sm group-hover:translate-x-1 transition-transform">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Primary CTA */}
                <button className="w-full py-5 rounded-2xl bg-olive text-ivory font-bold flex items-center justify-center gap-3 hover:bg-olive-deep transition-colors shadow-lg shadow-olive/20 group">
                  View full meal plan
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            </AnimatePresence>
            
            {/* Small Footer Note */}
            <div className="mt-8 flex items-start gap-4 text-espresso/40 max-w-md mx-auto lg:mx-0">
              <Leaf className="w-6 h-6 shrink-0 opacity-50" />
              <p className="text-[13px] italic leading-relaxed">
                Your body is unique. Recommendations adapt as you log your meals and symptoms. 
                The more you share, the better we guide.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Health Areas Strip */}
        <div className="mt-32 pt-8 border-t border-espresso/5 flex flex-wrap justify-between gap-8 md:gap-12 opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700">
           <div className="flex items-center gap-3 text-xs font-bold tracking-widest uppercase">
             <Brain className="w-5 h-5" /> Stress & Mood
           </div>
           <div className="flex items-center gap-3 text-xs font-bold tracking-widest uppercase">
             <Flame className="w-5 h-5" /> Immunity
           </div>
           <div className="flex items-center gap-3 text-xs font-bold tracking-widest uppercase">
             <Heart className="w-5 h-5" /> Heart Health
           </div>
           <div className="flex items-center gap-3 text-xs font-bold tracking-widest uppercase">
             <Leaf className="w-5 h-5" /> Skin Health
           </div>
           <div className="flex items-center gap-3 text-xs font-bold tracking-widest uppercase">
             <Zap className="w-5 h-5" /> Sleep
           </div>
           <div className="flex items-center gap-3 text-xs font-bold tracking-widest uppercase">
             <Utensils className="w-5 h-5" /> Weight care
           </div>
        </div>
      </div>
    </section>
  );
}
