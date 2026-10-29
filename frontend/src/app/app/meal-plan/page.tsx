"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Info,
  CalendarDays,
  SlidersHorizontal,
  X,
  Check,
} from "lucide-react";
import { toast } from "sonner";

// ── Custom Visual Icons matching mockups ─────────────────────────────────────
function SproutIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 20h10" />
      <path d="M12 20v-8" />
      <path d="M12 12c0-4.5 4-7 8-7-1 4-3.5 7-8 7Z" />
      <path d="M12 12c0-4.5-4-7-8-7 1 4 3.5 7 8 7Z" />
    </svg>
  );
}

function ChefHatIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
      <line x1="6" y1="17" x2="18" y2="17" />
    </svg>
  );
}

function HeartIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

function ClockIcon({ className = "w-3 h-3" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function BarChartIcon({ className = "w-3 h-3" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function TargetIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

// ── Categories & Meals Data ──────────────────────────────────────────────────
const CATEGORIES = [
  { id: "my-plan", label: "My Plan" },
  { id: "pcos", label: "PCOS" },
  { id: "diabetes", label: "Diabetes" },
  { id: "thyroid", label: "Thyroid" },
  { id: "heart-health", label: "Heart Health" },
  { id: "weight-loss", label: "Weight Loss" },
];

export type MealPlanItem = {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  time: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  image: string;
};

const MEALS_DATA: MealPlanItem[] = [
  {
    id: "moong-dal-chilla",
    tag: "BREAKFAST",
    title: "Moong Dal Chilla",
    subtitle: "With mint chutney and fresh fruits",
    time: "15 mins",
    calories: "350 kcal",
    protein: "18 g",
    carbs: "45 g",
    fat: "12 g",
    image: "/app-ui/meal-plan/meal-breakfast.png",
  },
  {
    id: "greek-yogurt-bowl",
    tag: "MID-MORNING",
    title: "Greek Yogurt Bowl",
    subtitle: "With nuts, seeds and berries",
    time: "5 mins",
    calories: "200 kcal",
    protein: "12 g",
    carbs: "18 g",
    fat: "8 g",
    image: "/app-ui/meal-plan/meal-mid-morning.png",
  },
  {
    id: "quinoa-buddha-bowl",
    tag: "LUNCH",
    title: "Quinoa Buddha Bowl",
    subtitle: "With roasted vegetables and tahini dressing",
    time: "20 mins",
    calories: "420 kcal",
    protein: "18 g",
    carbs: "52 g",
    fat: "14 g",
    image: "/app-ui/meal-plan/meal-lunch.png",
  },
  {
    id: "masala-buttermilk",
    tag: "EVENING SNACK",
    title: "Masala Buttermilk",
    subtitle: "With roasted makhana",
    time: "5 mins",
    calories: "120 kcal",
    protein: "6 g",
    carbs: "14 g",
    fat: "4 g",
    image: "/app-ui/meal-plan/meal-evening-snack.png",
  },
  {
    id: "paneer-veg-stir-fry",
    tag: "DINNER",
    title: "Paneer & Vegetable Stir Fry",
    subtitle: "With millets or brown rice",
    time: "20 mins",
    calories: "400 kcal",
    protein: "22 g",
    carbs: "48 g",
    fat: "16 g",
    image: "/app-ui/meal-plan/meal-dinner.png",
  },
];

export default function MealPlansPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("my-plan");
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showBreakdownModal, setShowBreakdownModal] = useState(false);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [currentDateIndex, setCurrentDateIndex] = useState(0);

  const dates = [
    "Mon, 12 Oct 2026",
    "Tue, 13 Oct 2026",
    "Wed, 14 Oct 2026",
    "Thu, 15 Oct 2026",
    "Fri, 16 Oct 2026",
  ];

  const handlePrevDate = () => {
    setCurrentDateIndex((prev) => (prev > 0 ? prev - 1 : dates.length - 1));
  };

  const handleNextDate = () => {
    setCurrentDateIndex((prev) => (prev < dates.length - 1 ? prev + 1 : 0));
  };

  const handleUsePlan = () => {
    toast.success("This plan has been activated for your daily routine! 🌿");
  };

  return (
    <main className="min-h-screen bg-[#f6f1eb] text-[#1c1b18] font-sans antialiased selection:bg-[#707e63]/20 pb-28">
      {/* Container with mobile-optimized width and proportions */}
      <div className="max-w-[500px] mx-auto px-4 pt-3 sm:pt-4">
        
        {/* ── Top Header ─────────────────────────────────────────────── */}
        <header className="flex items-start justify-between pt-1 pb-3">
          <div>
            <button
              onClick={() => router.back()}
              className="p-1 -ml-1 text-[#1a1917] hover:text-[#526348] transition-colors mb-2 inline-flex items-center"
              aria-label="Go back"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
            </button>
            <h1 className="font-serif text-[27px] sm:text-[30px] font-bold text-[#141311] leading-none tracking-tight">
              Meal Plans
            </h1>
            <p className="text-[13px] text-[#6e6a62] font-normal mt-1 leading-normal">
              Personalised and flexible plans for your goals.
            </p>
          </div>

          <button
            onClick={() => setShowHowItWorks(true)}
            className="mt-6 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f4efe8] border border-[#dcd6ca] text-[#2c2b27] text-[11.5px] font-medium shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:bg-[#eae4d7] transition-colors"
          >
            <Info className="w-3.5 h-3.5 text-[#55524b]" />
            <span>How it works</span>
          </button>
        </header>

        {/* ── Category Filters Row ──────────────────────────────────── */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2.5 -mx-4 px-4">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-[12.5px] font-medium transition-all ${
                  isActive
                    ? "bg-[#748268] text-white shadow-sm font-semibold"
                    : "bg-[#fbf8f2] border border-[#ded8cb] text-[#2c2b28] hover:bg-[#f2ece2]"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* ── Banner Hero Card ──────────────────────────────────────── */}
        <section className="relative mt-2 rounded-2xl bg-[#ebecde] border border-[#dedecc] p-4 sm:p-4.5 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <div className="relative z-10 max-w-[58%]">
            <span className="block text-[9px] sm:text-[9.5px] font-bold tracking-[0.14em] text-[#55694a] uppercase mb-1">
              YOUR PERSONALIZED PLAN
            </span>
            <h2 className="font-serif text-[19px] sm:text-[21px] font-bold text-[#141311] leading-[1.18] tracking-tight mb-1.5">
              Balanced for your unique needs
            </h2>
            <p className="text-[11px] leading-[1.38] text-[#5d5a52] font-normal mb-3.5">
              Meals crafted around your goals, nutrition targets and food preferences.
            </p>

            {/* 3 Value badges */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <div className="inline-flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#d6dbce] flex items-center justify-center text-[#405436] shrink-0">
                  <SproutIcon className="w-3 h-3" />
                </span>
                <span className="text-[10px] text-[#2b2a26] font-medium">Wholesome ingredients</span>
              </div>

              <div className="inline-flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#d6dbce] flex items-center justify-center text-[#405436] shrink-0">
                  <ChefHatIcon className="w-3 h-3" />
                </span>
                <span className="text-[10px] text-[#2b2a26] font-medium">Easy to cook</span>
              </div>

              <div className="inline-flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#d6dbce] flex items-center justify-center text-[#405436] shrink-0">
                  <HeartIcon className="w-3 h-3" />
                </span>
                <span className="text-[10px] text-[#2b2a26] font-medium">Culturally familiar</span>
              </div>
            </div>
          </div>

          {/* Banner bowl image on the right */}
          <div className="absolute -top-1 -right-2 w-[190px] sm:w-[215px] h-[180px] pointer-events-none select-none">
            <img
              src="/app-ui/meal-plan/banner-bowl.png"
              alt="Balanced meal bowl"
              className="w-full h-full object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
            />
          </div>
        </section>

        {/* ── Section: Today's plan & Date Selector ─────────────────── */}
        <div className="flex items-center justify-between mt-5 mb-2.5">
          <h2 className="font-serif text-[21px] sm:text-[23px] font-bold text-[#141311] tracking-tight">
            Today&apos;s plan
          </h2>

          <div className="flex items-center gap-1.5">
            <div className="inline-flex items-center rounded-full bg-[#fcf9f3] border border-[#dfd9cd] px-2 py-1 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <button
                onClick={handlePrevDate}
                className="p-0.5 text-[#55524c] hover:text-[#1c1b18] transition-colors"
                aria-label="Previous date"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-medium text-[#292825] px-1.5 whitespace-nowrap">
                {dates[currentDateIndex]}
              </span>
              <button
                onClick={handleNextDate}
                className="p-0.5 text-[#55524c] hover:text-[#1c1b18] transition-colors"
                aria-label="Next date"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={() => toast.info("Opening meal calendar...")}
              className="w-7 h-7 rounded-lg bg-[#fcf9f3] border border-[#dfd9cd] flex items-center justify-center text-[#2c2b28] hover:bg-[#f4efe5] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
              aria-label="Open calendar"
            >
              <CalendarDays className="w-3.5 h-3.5 text-[#3b3a36]" />
            </button>
          </div>
        </div>

        {/* ── 5 Meal Cards List ─────────────────────────────────────── */}
        <div className="space-y-2.5">
          {MEALS_DATA.map((meal) => (
            <div
              key={meal.id}
              className="rounded-2xl bg-[#fdfbf7] border border-[#ede7dd] p-2.5 sm:p-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center justify-between gap-2.5 hover:border-[#dfd8cc] transition-colors"
            >
              {/* Left Dish Photo */}
              <div className="w-[108px] sm:w-[116px] h-[78px] rounded-xl overflow-hidden shrink-0 bg-[#f0eae1] shadow-inner">
                <img
                  src={meal.image}
                  alt={meal.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Middle Dish Info */}
              <div className="flex-1 min-w-0 pr-1">
                <span className="block text-[8.5px] font-bold tracking-[0.1em] text-[#7a776f] uppercase">
                  {meal.tag}
                </span>
                <h3 className="font-serif text-[15px] sm:text-[16px] font-bold text-[#171613] leading-snug truncate mt-0.5">
                  {meal.title}
                </h3>
                <p className="text-[11px] text-[#69655e] truncate mt-0.5 leading-tight">
                  {meal.subtitle}
                </p>

                {/* Meta: prep time + calories */}
                <div className="flex items-center gap-2.5 mt-2">
                  <div className="inline-flex items-center gap-1 text-[10.5px] text-[#4f4c45] font-medium">
                    <ClockIcon className="w-3 h-3 text-[#6a665d]" />
                    <span>{meal.time}</span>
                  </div>
                  <div className="inline-flex items-center gap-1 text-[10.5px] text-[#4f4c45] font-medium">
                    <BarChartIcon className="w-3 h-3 text-[#6a665d]" />
                    <span>{meal.calories}</span>
                  </div>
                </div>
              </div>

              {/* Right: Macros & View Recipe button */}
              <div className="flex flex-col items-end justify-between self-stretch shrink-0 pt-0.5">
                {/* 3 Macros */}
                <div className="flex items-center gap-2 text-right">
                  <div>
                    <span className="block font-serif font-bold text-[12px] sm:text-[13px] text-[#1a1916] leading-none">
                      {meal.protein}
                    </span>
                    <span className="block text-[8.5px] text-[#75726a] mt-0.5">Protein</span>
                  </div>
                  <div>
                    <span className="block font-serif font-bold text-[12px] sm:text-[13px] text-[#1a1916] leading-none">
                      {meal.carbs}
                    </span>
                    <span className="block text-[8.5px] text-[#75726a] mt-0.5">Carbs</span>
                  </div>
                  <div>
                    <span className="block font-serif font-bold text-[12px] sm:text-[13px] text-[#1a1916] leading-none">
                      {meal.fat}
                    </span>
                    <span className="block text-[8.5px] text-[#75726a] mt-0.5">Fat</span>
                  </div>
                </div>

                {/* View Recipe Pill & Chevron */}
                <div className="flex items-center gap-1 mt-auto">
                  <Link
                    href={`/app/meal-plan/details?dish=${meal.id}`}
                    className="inline-flex items-center px-3 py-1 rounded-full bg-[#ede8dc] text-[#252421] text-[10.5px] font-semibold hover:bg-[#e2ddd0] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                  >
                    View Recipe
                  </Link>
                  <Link
                    href={`/app/meal-plan/details?dish=${meal.id}`}
                    className="text-[#55524a] hover:text-[#1a1916] p-0.5"
                    aria-label={`View recipe for ${meal.title}`}
                  >
                    <ChevronRight className="w-3.5 h-3.5 stroke-[2.2]" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Daily Nutrition Summary Card ─────────────────────────── */}
        <section className="mt-3.5 rounded-2xl bg-[#ebecde] border border-[#dedecc] p-3 sm:p-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-5 h-5 rounded-full bg-[#d8ddd0] flex items-center justify-center text-[#405436] shrink-0">
              <TargetIcon className="w-3 h-3" />
            </span>
            <h3 className="text-[12.5px] font-bold text-[#1f1e1b] tracking-tight">
              Daily nutrition summary
            </h3>
          </div>

          <div className="flex items-center justify-between gap-3">
            {/* Left Nutrition Bar and Stats */}
            <div className="flex-1">
              {/* Multi-segmented bar */}
              <div className="h-2 w-full rounded-full overflow-hidden flex bg-[#ded8ca] shadow-inner">
                <div className="bg-[#5c6e4e] w-[26%]" />
                <div className="bg-[#dca472] w-[46%]" />
                <div className="bg-[#cfc19c] w-[28%]" />
              </div>

              {/* 4 Macro columns */}
              <div className="grid grid-cols-4 gap-1 mt-2 text-left">
                <div>
                  <span className="block font-serif font-bold text-[14px] text-[#1b1a17] leading-none">
                    76 g
                  </span>
                  <span className="block text-[9px] text-[#6d6961] mt-0.5">Protein</span>
                </div>
                <div>
                  <span className="block font-serif font-bold text-[14px] text-[#1b1a17] leading-none">
                    177 g
                  </span>
                  <span className="block text-[9px] text-[#6d6961] mt-0.5">Carbs</span>
                </div>
                <div>
                  <span className="block font-serif font-bold text-[14px] text-[#1b1a17] leading-none">
                    52 g
                  </span>
                  <span className="block text-[9px] text-[#6d6961] mt-0.5">Fat</span>
                </div>
                <div>
                  <span className="block font-serif font-bold text-[14px] text-[#1b1a17] leading-none">
                    2,000
                  </span>
                  <span className="block text-[9px] text-[#6d6961] mt-0.5">kcal</span>
                </div>
              </div>
            </div>

            {/* Right: View full breakdown button */}
            <div className="border-l border-[#ded8cb] pl-3 shrink-0">
              <button
                onClick={() => setShowBreakdownModal(true)}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-[#787b6d] bg-transparent text-[#21201d] text-[10.5px] font-semibold hover:bg-[#e1dfd1] transition-colors"
              >
                <span>View full breakdown</span>
                <span>&rarr;</span>
              </button>
            </div>
          </div>
        </section>

      </div>

      {/* ── Sticky Bottom Action Bar ───────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-[#f6f1eb]/95 backdrop-blur-md border-t border-[#dfd8cc]">
        <div className="max-w-[500px] mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setShowCustomizeModal(true)}
            className="flex-1 h-11 rounded-full border border-[#6b7168] bg-[#f7f4ed] hover:bg-[#eae5d8] text-[#242320] text-[12.5px] font-semibold flex items-center justify-center gap-2 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#3e3d39]" />
            <span>Customize my plan</span>
          </button>

          <button
            onClick={handleUsePlan}
            className="flex-1 h-11 rounded-full bg-[#627354] hover:bg-[#526245] text-white text-[12.5px] font-semibold flex items-center justify-center transition-all shadow-[0_2px_6px_rgba(98,115,84,0.3)] active:scale-[0.98]"
          >
            Use this plan
          </button>
        </div>
      </div>

      {/* ── How it works Modal ─────────────────────────────────────── */}
      {showHowItWorks && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#fcfaf5] rounded-3xl max-w-sm w-full p-5 border border-[#dfd7ca] shadow-2xl relative">
            <button
              onClick={() => setShowHowItWorks(false)}
              className="absolute top-4 right-4 text-[#66635c] hover:text-[#1c1b18] p-1"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="font-serif text-xl font-bold text-[#181714] mb-2">
              How Meal Plans Work
            </h3>
            <p className="text-xs text-[#5d5952] leading-relaxed mb-4">
              ZenPlate balances regional food traditions, glycemic index targets, and clinical biomarkers to generate flexible daily plans that you actually enjoy eating.
            </p>
            <ul className="space-y-2.5 text-xs text-[#3f3e39] mb-5">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#5e7150] shrink-0 mt-0.5" />
                <span>Tailored macro-ratios for sustained metabolic energy.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#5e7150] shrink-0 mt-0.5" />
                <span>Smart ingredient substitutions for your pantry and taste.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#5e7150] shrink-0 mt-0.5" />
                <span>Condition-friendly guardrails (PCOS, Diabetes, Thyroid).</span>
              </li>
            </ul>
            <button
              onClick={() => setShowHowItWorks(false)}
              className="w-full py-2.5 rounded-full bg-[#627354] text-white text-xs font-semibold hover:bg-[#536245] transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* ── View Full Breakdown Modal ───────────────────────────────── */}
      {showBreakdownModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#fcfaf5] rounded-3xl max-w-sm w-full p-5 border border-[#dfd7ca] shadow-2xl relative">
            <button
              onClick={() => setShowBreakdownModal(false)}
              className="absolute top-4 right-4 text-[#66635c] hover:text-[#1c1b18] p-1"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="font-serif text-xl font-bold text-[#181714] mb-1">
              Nutritional Breakdown
            </h3>
            <p className="text-xs text-[#5d5952] mb-4">Total target: 2,000 kcal / day</p>

            <div className="space-y-2 text-xs mb-5">
              <div className="flex justify-between py-1.5 border-b border-[#eee7db]">
                <span className="text-[#55524b]">Protein (15%)</span>
                <span className="font-semibold text-[#181715]">76 g · 304 kcal</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#eee7db]">
                <span className="text-[#55524b]">Complex Carbohydrates (35%)</span>
                <span className="font-semibold text-[#181715]">177 g · 708 kcal</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#eee7db]">
                <span className="text-[#55524b]">Healthy Fats (23%)</span>
                <span className="font-semibold text-[#181715]">52 g · 468 kcal</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#eee7db]">
                <span className="text-[#55524b]">Dietary Fiber</span>
                <span className="font-semibold text-[#181715]">34 g</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#eee7db]">
                <span className="text-[#55524b]">Sodium</span>
                <span className="font-semibold text-[#181715]">1,620 mg</span>
              </div>
            </div>

            <button
              onClick={() => setShowBreakdownModal(false)}
              className="w-full py-2.5 rounded-full bg-[#627354] text-white text-xs font-semibold hover:bg-[#536245] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ── Customize Modal ────────────────────────────────────────── */}
      {showCustomizeModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#fcfaf5] rounded-3xl max-w-sm w-full p-5 border border-[#dfd7ca] shadow-2xl relative">
            <button
              onClick={() => setShowCustomizeModal(false)}
              className="absolute top-4 right-4 text-[#66635c] hover:text-[#1c1b18] p-1"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="font-serif text-xl font-bold text-[#181714] mb-1">
              Customize Your Plan
            </h3>
            <p className="text-xs text-[#5d5952] mb-4">Adjust dietary preferences and meal frequency</p>

            <div className="space-y-3 mb-5 text-xs">
              <label className="block">
                <span className="font-semibold text-[#272623] block mb-1">Cuisine preference</span>
                <select className="w-full rounded-xl border border-[#ded8cb] bg-white p-2 text-xs">
                  <option>North & South Indian</option>
                  <option>Mediterranean</option>
                  <option>Pan-Asian</option>
                  <option>Global Blend</option>
                </select>
              </label>

              <label className="block">
                <span className="font-semibold text-[#272623] block mb-1">Calorie Target</span>
                <select className="w-full rounded-xl border border-[#ded8cb] bg-white p-2 text-xs">
                  <option>1,800 - 2,000 kcal (Current)</option>
                  <option>1,500 - 1,700 kcal (Fat Loss)</option>
                  <option>2,100 - 2,400 kcal (Muscle Gain)</option>
                </select>
              </label>

              <label className="block">
                <span className="font-semibold text-[#272623] block mb-1">Cooking Time Preference</span>
                <select className="w-full rounded-xl border border-[#ded8cb] bg-white p-2 text-xs">
                  <option>Quick (under 20 mins)</option>
                  <option>Standard (20 - 40 mins)</option>
                </select>
              </label>
            </div>

            <button
              onClick={() => {
                setShowCustomizeModal(false);
                toast.success("Preferences updated! Recalibrating plan.");
              }}
              className="w-full py-2.5 rounded-full bg-[#627354] text-white text-xs font-semibold hover:bg-[#536245] transition-colors"
            >
              Save & Recalculate
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
