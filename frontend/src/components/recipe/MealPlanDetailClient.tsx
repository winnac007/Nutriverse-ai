"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Bookmark,
  PlusCircle,
  Play,
  User,
  X,
} from "lucide-react";
import { toast } from "sonner";

// ── Custom SVG Icons for exact visual fidelity ──────────────────────────────
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

function ChefHatIcon({ className = "w-3 h-3" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
      <line x1="6" y1="17" x2="18" y2="17" />
    </svg>
  );
}

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

function WheatIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m2 22 10-10" />
      <path d="m16 8-4 4" />
      <path d="m8 16 4-4" />
      <path d="M7 6a4 4 0 0 1 4 4v.5" />
      <path d="M13.5 13a4 4 0 0 1 4-4H18" />
      <path d="M17.5 7.5a3.5 3.5 0 0 1 3.5 3.5v.5" />
      <path d="M12.5 17.5a3.5 3.5 0 0 1 3.5-3.5h.5" />
    </svg>
  );
}

function DropletIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
    </svg>
  );
}

function LeafIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 4 13c0-7 7-9 16-9 0 9-2 16-9 16Z" />
      <path d="M11 20v-7" />
    </svg>
  );
}

function DumbbellIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6.5 6.5 11 11" />
      <path d="m21 21-1-1a3 3 0 0 0-4.24 0l-.88.88a3 3 0 0 1-4.24 0l-5.66-5.66a3 3 0 0 1 0-4.24l.88-.88a3 3 0 0 0 0-4.24L6 6" />
      <path d="m3 3 1 1a3 3 0 0 0 4.24 0l.88-.88a3 3 0 0 1 4.24 0l5.66 5.66a3 3 0 0 1 0 4.24l-.88.88a3 3 0 0 0 0 4.24L18 18" />
    </svg>
  );
}

function VegBasketIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 11 4-7" />
      <path d="m19 11-4-7" />
      <path d="M2 11h20" />
      <path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.6-7.4" />
      <path d="M4.5 15.5h15" />
    </svg>
  );
}

// ── Recipe Data Collection ──────────────────────────────────────────────────
type RecipeDetailData = {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  description: string;
  prepTime: string;
  calories: string;
  difficulty: string;
  heroImage: string;
  nutrition: {
    protein: string;
    carbs: string;
    fat: string;
    fiber: string;
  };
  ingredients: {
    name: string;
    baseQty: string;
    img: string;
  }[];
  steps: string[];
  options: {
    title: string;
    subtitle: string;
    type: "swap-veggies" | "gluten-free" | "protein" | "low-oil";
  }[];
};

const RECIPES_BY_ID: Record<string, RecipeDetailData> = {
  "moong-dal-chilla": {
    id: "moong-dal-chilla",
    tag: "BREAKFAST",
    title: "Moong Dal Chilla",
    subtitle: "With mint chutney and fresh fruits",
    description: "A high-protein, fiber-rich breakfast that keeps you full and energised through the morning.",
    prepTime: "15 mins",
    calories: "350 kcal",
    difficulty: "Easy",
    heroImage: "/app-ui/meal-plan/hero-chilla.png",
    nutrition: {
      protein: "18 g",
      carbs: "45 g",
      fat: "12 g",
      fiber: "8 g",
    },
    ingredients: [
      { name: "Moong dal", baseQty: "½ cup (soaked)", img: "/app-ui/meal-plan/ing-moong-dal.png" },
      { name: "Onion", baseQty: "2 tbsp (chopped)", img: "/app-ui/meal-plan/ing-onion.png" },
      { name: "Tomato", baseQty: "2 tbsp (chopped)", img: "/app-ui/meal-plan/ing-tomato.png" },
      { name: "Coriander", baseQty: "2 tbsp (chopped)", img: "/app-ui/meal-plan/ing-coriander.png" },
      { name: "Spices", baseQty: "½ tsp each (turmeric, cumin, salt)", img: "/app-ui/meal-plan/ing-spices.png" },
      { name: "Mint chutney", baseQty: "2 tbsp (for serving)", img: "/app-ui/meal-plan/ing-chutney.png" },
    ],
    steps: [
      "Blend soaked moong dal with spices into a smooth batter.",
      "Add chopped vegetables and mix well.",
      "Cook on a non-stick pan with little oil until golden on both sides.",
      "Serve hot with mint chutney and fresh fruits.",
    ],
    options: [
      { title: "Swap veggies", subtitle: "Use seasonal vegetables", type: "swap-veggies" },
      { title: "Gluten-free", subtitle: "Naturally gluten-free", type: "gluten-free" },
      { title: "Higher protein", subtitle: "Add paneer or tofu on the side", type: "protein" },
      { title: "Low oil option", subtitle: "Use minimal oil or spray", type: "low-oil" },
    ],
  },
  "greek-yogurt-bowl": {
    id: "greek-yogurt-bowl",
    tag: "MID-MORNING",
    title: "Greek Yogurt Bowl",
    subtitle: "With nuts, seeds and berries",
    description: "Probiotic-rich gut harmony bowl with high-protein Greek yogurt, antioxidant-packed berries and pumpkin seeds.",
    prepTime: "5 mins",
    calories: "200 kcal",
    difficulty: "Easy",
    heroImage: "/app-ui/meal-plan/meal-mid-morning.png",
    nutrition: {
      protein: "12 g",
      carbs: "18 g",
      fat: "8 g",
      fiber: "4 g",
    },
    ingredients: [
      { name: "Greek yogurt", baseQty: "1 cup (plain)", img: "/app-ui/swap-yogurt.png" },
      { name: "Blueberries", baseQty: "¼ cup (fresh)", img: "/app-ui/meal-plan/ing-tomato.png" },
      { name: "Walnuts", baseQty: "1 tbsp (crushed)", img: "/app-ui/meal-plan/ing-spices.png" },
      { name: "Chia seeds", baseQty: "1 tsp", img: "/app-ui/meal-plan/ing-moong-dal.png" },
      { name: "Honey", baseQty: "½ tsp (optional)", img: "/app-ui/meal-plan/ing-chutney.png" },
      { name: "Mint leaves", baseQty: "A few sprigs", img: "/app-ui/meal-plan/ing-coriander.png" },
    ],
    steps: [
      "Whisk Greek yogurt until smooth and spoon into a shallow bowl.",
      "Top with fresh blueberries and sliced strawberries.",
      "Sprinkle crushed walnuts and chia seeds for crunch.",
      "Drizzle raw honey if desired and serve chilled.",
    ],
    options: [
      { title: "Dairy-free swap", subtitle: "Use coconut or almond yogurt", type: "swap-veggies" },
      { title: "Keto-friendly", subtitle: "Skip honey, add roasted flax", type: "gluten-free" },
      { title: "Higher protein", subtitle: "Stir in 1 scoop collagen peptides", type: "protein" },
      { title: "Low sugar", subtitle: "Use raspberries or unsweetened seeds", type: "low-oil" },
    ],
  },
  "quinoa-buddha-bowl": {
    id: "quinoa-buddha-bowl",
    tag: "LUNCH",
    title: "Quinoa Buddha Bowl",
    subtitle: "With roasted vegetables and tahini dressing",
    description: "Nutrient-dense powerhouse bowl packed with roasted sweet potatoes, chickpeas, purple cabbage, and fluffy quinoa.",
    prepTime: "20 mins",
    calories: "420 kcal",
    difficulty: "Easy",
    heroImage: "/app-ui/meal-plan/meal-lunch.png",
    nutrition: {
      protein: "18 g",
      carbs: "52 g",
      fat: "14 g",
      fiber: "10 g",
    },
    ingredients: [
      { name: "Cooked quinoa", baseQty: "¾ cup", img: "/app-ui/meal-plan/ing-moong-dal.png" },
      { name: "Chickpeas", baseQty: "½ cup (boiled)", img: "/app-ui/meal-plan/ing-spices.png" },
      { name: "Sweet potato", baseQty: "½ cup (cubed)", img: "/app-ui/meal-plan/ing-tomato.png" },
      { name: "Cabbage", baseQty: "¼ cup (shredded)", img: "/app-ui/meal-plan/ing-onion.png" },
      { name: "Tahini dressing", baseQty: "2 tbsp", img: "/app-ui/meal-plan/ing-chutney.png" },
      { name: "Microgreens", baseQty: "2 tbsp", img: "/app-ui/meal-plan/ing-coriander.png" },
    ],
    steps: [
      "Roast seasoned sweet potato cubes and chickpeas until crispy at 200°C.",
      "Warm cooked fluffy quinoa in a wide bowl.",
      "Arrange roasted vegetables, purple cabbage, and avocado slices in sections.",
      "Drizzle creamy lemon tahini dressing and garnish with microgreens.",
    ],
    options: [
      { title: "Grain-free swap", subtitle: "Use cauliflower rice base", type: "swap-veggies" },
      { title: "Gluten-free", subtitle: "100% certified gluten-free bowl", type: "gluten-free" },
      { title: "Higher protein", subtitle: "Add grilled paneer or organic tempeh", type: "protein" },
      { title: "Low oil option", subtitle: "Air-fry veggies without oil", type: "low-oil" },
    ],
  },
  "masala-buttermilk": {
    id: "masala-buttermilk",
    tag: "EVENING SNACK",
    title: "Masala Buttermilk",
    subtitle: "With roasted makhana",
    description: "Traditional cooling chaas infused with roasted cumin, fresh ginger, and mint paired with crunchy roasted foxnuts.",
    prepTime: "5 mins",
    calories: "120 kcal",
    difficulty: "Easy",
    heroImage: "/app-ui/meal-plan/meal-evening-snack.png",
    nutrition: {
      protein: "6 g",
      carbs: "14 g",
      fat: "4 g",
      fiber: "2 g",
    },
    ingredients: [
      { name: "Curd/Yogurt", baseQty: "½ cup (churned)", img: "/app-ui/swap-yogurt.png" },
      { name: "Foxnuts (Makhana)", baseQty: "1 cup (roasted)", img: "/app-ui/meal-plan/ing-moong-dal.png" },
      { name: "Ginger & Green Chili", baseQty: "½ tsp (finely grated)", img: "/app-ui/meal-plan/ing-spices.png" },
      { name: "Mint & Coriander", baseQty: "1 tbsp (finely chopped)", img: "/app-ui/meal-plan/ing-coriander.png" },
      { name: "Roasted Cumin", baseQty: "½ tsp (ground)", img: "/app-ui/meal-plan/ing-onion.png" },
      { name: "Black salt", baseQty: "A pinch", img: "/app-ui/meal-plan/ing-chutney.png" },
    ],
    steps: [
      "Blend fresh homemade curd with cold water, ginger, green chili, and black salt.",
      "Froth well until a light foam appears on top.",
      "Dry roast makhana with a hint of turmeric and rock salt in a skillet.",
      "Pour buttermilk in a tall glass, garnish with mint and serve with crispy makhana.",
    ],
    options: [
      { title: "Vegan swap", subtitle: "Use fermented peanut or almond curd", type: "swap-veggies" },
      { title: "Digestive boost", subtitle: "Add roasted carom seeds (ajwain)", type: "gluten-free" },
      { title: "Higher protein", subtitle: "Pair with roasted chana or edamame", type: "protein" },
      { title: "Zero oil", subtitle: "Air-popped makhana without ghee", type: "low-oil" },
    ],
  },
  "paneer-veg-stir-fry": {
    id: "paneer-veg-stir-fry",
    tag: "DINNER",
    title: "Paneer & Vegetable Stir Fry",
    subtitle: "With millets or brown rice",
    description: "Golden seared cottage cheese cubes tossed with bell peppers, broccoli, and fragrant mild herbs served over steaming millets.",
    prepTime: "20 mins",
    calories: "400 kcal",
    difficulty: "Easy",
    heroImage: "/app-ui/meal-plan/meal-dinner.png",
    nutrition: {
      protein: "22 g",
      carbs: "48 g",
      fat: "16 g",
      fiber: "7 g",
    },
    ingredients: [
      { name: "Paneer", baseQty: "100 g (cubed)", img: "/app-ui/meal-plan/ing-moong-dal.png" },
      { name: "Bell peppers", baseQty: "½ cup (diced)", img: "/app-ui/meal-plan/ing-tomato.png" },
      { name: "Broccoli florets", baseQty: "½ cup", img: "/app-ui/meal-plan/ing-coriander.png" },
      { name: "Foxtail millet", baseQty: "½ cup (cooked)", img: "/app-ui/meal-plan/ing-onion.png" },
      { name: "Cold-pressed oil", baseQty: "1 tsp", img: "/app-ui/swap-oil.png" },
      { name: "Herb spice blend", baseQty: "1 tsp", img: "/app-ui/meal-plan/ing-spices.png" },
    ],
    steps: [
      "Lightly sear paneer cubes in a warm non-stick pan until golden brown.",
      "Toss diced bell peppers and broccoli over high heat for 3 minutes until tender-crisp.",
      "Season with crushed black pepper, toasted cumin, and pink salt.",
      "Serve warm beside fluffy steamed foxtail millet or brown rice.",
    ],
    options: [
      { title: "Vegan swap", subtitle: "Substitute paneer with firm organic tofu", type: "swap-veggies" },
      { title: "Grain-free", subtitle: "Serve over sautéed zucchini noodles", type: "gluten-free" },
      { title: "Higher protein", subtitle: "Add 150g paneer / double portion", type: "protein" },
      { title: "Low oil option", subtitle: "Steam vegetables and grill paneer dry", type: "low-oil" },
    ],
  },
};

export default function MealPlanDetailClient({ recipeId }: { recipeId?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Query dish or param id
  const dishParam = searchParams.get("dish") || recipeId || "moong-dal-chilla";
  const recipe: RecipeDetailData = RECIPES_BY_ID[dishParam] || RECIPES_BY_ID["moong-dal-chilla"];

  const [servings, setServings] = useState<number>(1);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [showServingsModal, setShowServingsModal] = useState<boolean>(false);
  const [showVideoModal, setShowVideoModal] = useState<boolean>(false);
  const [showNutritionModal, setShowNutritionModal] = useState<boolean>(false);

  const handleToggleSave = () => {
    setIsSaved((prev) => !prev);
    if (!isSaved) {
      toast.success(`${recipe.title} saved to your favorites! 🔖`);
    } else {
      toast.info("Removed from favorites");
    }
  };

  const handleAddToPlan = () => {
    toast.success(`${recipe.title} added to your plan for today! ✨`);
  };

  return (
    <main className="min-h-screen bg-[#f8f3ec] text-[#1c1b18] font-sans antialiased selection:bg-[#707e63]/20 pb-28 relative overflow-hidden">
      
      {/* ── Top Right Botanical Watermark ─────────────────────────── */}
      <div className="absolute top-0 right-0 w-[120px] sm:w-[150px] pointer-events-none select-none opacity-80 z-0">
        <img
          src="/app-ui/meal-plan/top-plant.png"
          alt=""
          className="w-full h-auto object-contain"
        />
      </div>

      <div className="max-w-[500px] mx-auto px-4 pt-3 sm:pt-4 relative z-10">

        {/* ── Top Header ───────────────────────────────────────────── */}
        <header className="pt-1 pb-3">
          <button
            onClick={() => router.push("/app/meal-plan")}
            className="p-1 -ml-1 text-[#1a1917] hover:text-[#526348] transition-colors mb-2 inline-flex items-center"
            aria-label="Go back to Meal Plans"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
          </button>
          <h1 className="font-serif text-[26px] sm:text-[28px] font-bold text-[#141311] leading-none tracking-tight">
            Meal Plan Details
          </h1>
          <p className="text-[13px] text-[#6e6a62] font-normal mt-1 leading-normal">
            Simple, wholesome and tailored to your goals.
          </p>
        </header>

        {/* ── Hero Card: Moong Dal Chilla ───────────────────────────── */}
        <section className="relative mt-2 rounded-3xl bg-[#f5f3eb] border border-[#ede7dc] p-4 sm:p-4.5 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <div className="relative z-10 max-w-[55%]">
            {/* Tag */}
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#7a8d6f] text-white text-[9.5px] font-bold tracking-[0.08em] uppercase mb-1.5">
              {recipe.tag}
            </span>

            {/* Title & Subtitle */}
            <h2 className="font-serif text-[21px] sm:text-[23px] font-bold text-[#141311] leading-[1.18] tracking-tight mb-1">
              {recipe.title}
            </h2>
            <p className="text-[12px] font-medium text-[#5c5951] mb-2 leading-tight">
              {recipe.subtitle}
            </p>

            {/* Description */}
            <p className="text-[11px] leading-[1.42] text-[#636058] font-normal mb-3">
              {recipe.description}
            </p>

            {/* 3 Meta Info Stats */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Prep Time */}
              <div className="inline-flex items-center gap-1.5">
                <span className="w-6 h-6 rounded-full bg-[#e1ded5] flex items-center justify-center text-[#3c3a35] shrink-0">
                  <ClockIcon className="w-3.5 h-3.5" />
                </span>
                <div>
                  <span className="block text-[10.5px] font-bold text-[#191815] leading-none">
                    {recipe.prepTime}
                  </span>
                  <span className="block text-[8.5px] text-[#716d64] mt-0.5 leading-none">
                    Prep time
                  </span>
                </div>
              </div>

              {/* Calories */}
              <div className="inline-flex items-center gap-1.5">
                <span className="w-6 h-6 rounded-full bg-[#e1ded5] flex items-center justify-center text-[#3c3a35] shrink-0">
                  <BarChartIcon className="w-3.5 h-3.5" />
                </span>
                <div>
                  <span className="block text-[10.5px] font-bold text-[#191815] leading-none">
                    {recipe.calories}
                  </span>
                  <span className="block text-[8.5px] text-[#716d64] mt-0.5 leading-none">
                    Calories
                  </span>
                </div>
              </div>

              {/* Cooking Level */}
              <div className="inline-flex items-center gap-1.5">
                <span className="w-6 h-6 rounded-full bg-[#e1ded5] flex items-center justify-center text-[#3c3a35] shrink-0">
                  <ChefHatIcon className="w-3.5 h-3.5" />
                </span>
                <div>
                  <span className="block text-[10.5px] font-bold text-[#191815] leading-none">
                    {recipe.difficulty}
                  </span>
                  <span className="block text-[8.5px] text-[#716d64] mt-0.5 leading-none">
                    To cook
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Dish Image on the right */}
          <div className="absolute top-0 right-0 w-[200px] sm:w-[225px] h-full pointer-events-none select-none">
            <img
              src={recipe.heroImage}
              alt={recipe.title}
              className="w-full h-full object-cover object-left-center"
            />
          </div>
        </section>

        {/* ── Section: Nutrition per serving ────────────────────────── */}
        <section className="mt-5">
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="font-serif text-[18px] sm:text-[19px] font-bold text-[#141311] tracking-tight">
              Nutrition per serving
            </h3>
            <button
              onClick={() => setShowNutritionModal(true)}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#445839] hover:underline"
            >
              <span>View detailed nutrition</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 4 Macro Cards Grid */}
          <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
            {/* Protein */}
            <div className="rounded-2xl bg-[#fcf9f4] border border-[#ede7dd] p-2 sm:p-2.5 flex items-center gap-2 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <span className="w-7 h-7 rounded-full bg-[#deecdb] flex items-center justify-center text-[#3e5f37] shrink-0">
                <SproutIcon className="w-3.5 h-3.5" />
              </span>
              <div>
                <span className="block font-serif font-bold text-[13px] sm:text-[14px] text-[#1b1a17] leading-none">
                  {recipe.nutrition.protein}
                </span>
                <span className="block text-[9.5px] text-[#6e6a62] mt-0.5 leading-none">
                  Protein
                </span>
              </div>
            </div>

            {/* Carbs */}
            <div className="rounded-2xl bg-[#fcf9f4] border border-[#ede7dd] p-2 sm:p-2.5 flex items-center gap-2 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <span className="w-7 h-7 rounded-full bg-[#f9edd8] flex items-center justify-center text-[#a57626] shrink-0">
                <WheatIcon className="w-3.5 h-3.5" />
              </span>
              <div>
                <span className="block font-serif font-bold text-[13px] sm:text-[14px] text-[#1b1a17] leading-none">
                  {recipe.nutrition.carbs}
                </span>
                <span className="block text-[9.5px] text-[#6e6a62] mt-0.5 leading-none">
                  Carbs
                </span>
              </div>
            </div>

            {/* Fat */}
            <div className="rounded-2xl bg-[#fcf9f4] border border-[#ede7dd] p-2 sm:p-2.5 flex items-center gap-2 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <span className="w-7 h-7 rounded-full bg-[#fae8de] flex items-center justify-center text-[#b26442] shrink-0">
                <DropletIcon className="w-3.5 h-3.5" />
              </span>
              <div>
                <span className="block font-serif font-bold text-[13px] sm:text-[14px] text-[#1b1a17] leading-none">
                  {recipe.nutrition.fat}
                </span>
                <span className="block text-[9.5px] text-[#6e6a62] mt-0.5 leading-none">
                  Fat
                </span>
              </div>
            </div>

            {/* Fiber */}
            <div className="rounded-2xl bg-[#fcf9f4] border border-[#ede7dd] p-2 sm:p-2.5 flex items-center gap-2 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <span className="w-7 h-7 rounded-full bg-[#e2ecdf] flex items-center justify-center text-[#426645] shrink-0">
                <LeafIcon className="w-3.5 h-3.5" />
              </span>
              <div>
                <span className="block font-serif font-bold text-[13px] sm:text-[14px] text-[#1b1a17] leading-none">
                  {recipe.nutrition.fiber}
                </span>
                <span className="block text-[9.5px] text-[#6e6a62] mt-0.5 leading-none">
                  Fiber
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section: Ingredients (1 serving) ──────────────────────── */}
        <section className="mt-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-serif text-[18px] sm:text-[19px] font-bold text-[#141311] tracking-tight">
              Ingredients ({servings} {servings === 1 ? "serving" : "servings"})
            </h3>
            <button
              onClick={() => setShowServingsModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f4efe7] border border-[#dfd8cb] text-[#282724] text-[11px] font-medium hover:bg-[#eae4d8] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
            >
              <User className="w-3 h-3 text-[#55524b]" />
              <span>Adjust servings</span>
            </button>
          </div>

          {/* 6 Circular Ingredient Items */}
          <div className="grid grid-cols-6 gap-2 sm:gap-2.5 text-center">
            {recipe.ingredients.map((ing, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-[48px] h-[48px] sm:w-[54px] sm:h-[54px] rounded-full overflow-hidden bg-[#eee7dc] border-1.5 border-[#eae4d9] shadow-sm mb-1.5 shrink-0">
                  <img
                    src={ing.img}
                    alt={ing.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="font-bold text-[10.5px] sm:text-[11px] text-[#1b1a17] leading-tight">
                  {ing.name}
                </h4>
                <p className="text-[9px] sm:text-[9.5px] text-[#706c64] leading-tight mt-0.5">
                  {servings === 1 ? ing.baseQty : `${servings}x ${ing.baseQty}`}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section: Step by step method ──────────────────────────── */}
        <section className="relative mt-5 rounded-2xl bg-[#fdfbf7] border border-[#ede7dd] p-4 sm:p-4.5 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-3.5 relative z-10">
            <h3 className="font-serif text-[18px] sm:text-[19px] font-bold text-[#141311] tracking-tight">
              Step by step method
            </h3>
            <button
              onClick={() => setShowVideoModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f4efe7] border border-[#dfd8cb] text-[#282724] text-[11px] font-medium hover:bg-[#eae4d8] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
            >
              <Play className="w-3 h-3 text-[#282724] fill-current" />
              <span>Watch video</span>
            </button>
          </div>

          {/* Numbered Steps */}
          <div className="space-y-3 relative z-10 max-w-[84%]">
            {recipe.steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#526348] text-white flex items-center justify-center text-[10.5px] font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-[12px] sm:text-[12.5px] leading-[1.45] text-[#2c2b28]">
                  {step}
                </p>
              </div>
            ))}
          </div>

          {/* Decorative botanical leaf watermark at bottom right */}
          <div className="absolute bottom-0 right-0 w-[84px] sm:w-[98px] pointer-events-none select-none z-0 opacity-90">
            <img
              src="/app-ui/meal-plan/leaf-method.png"
              alt=""
              className="w-full h-auto object-contain"
            />
          </div>
        </section>

        {/* ── Section: More options for you ─────────────────────────── */}
        <section className="mt-5">
          <h3 className="font-serif text-[16px] sm:text-[17px] font-bold text-[#141311] tracking-tight mb-2.5">
            More options for you
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
            {recipe.options.map((opt, idx) => {
              let iconNode = <VegBasketIcon className="w-3.5 h-3.5 text-[#3b5b35]" />;
              let bgCircle = "bg-[#e2ece0]";

              if (opt.type === "gluten-free") {
                iconNode = <WheatIcon className="w-3.5 h-3.5 text-[#9e7428]" />;
                bgCircle = "bg-[#faedd9]";
              } else if (opt.type === "protein") {
                iconNode = <DumbbellIcon className="w-3.5 h-3.5 text-[#3f556b]" />;
                bgCircle = "bg-[#e7edf2]";
              } else if (opt.type === "low-oil") {
                iconNode = <DropletIcon className="w-3.5 h-3.5 text-[#af6445]" />;
                bgCircle = "bg-[#fae8de]";
              }

              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-[#fcf9f4] border border-[#ede7dd] p-2.5 flex items-center gap-2 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:border-[#ded7cb] transition-colors"
                >
                  <span className={`w-7 h-7 rounded-full ${bgCircle} flex items-center justify-center shrink-0`}>
                    {iconNode}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-[11px] sm:text-[11.5px] text-[#1b1a17] leading-tight truncate">
                      {opt.title}
                    </h4>
                    <p className="text-[9.5px] text-[#6d6961] leading-tight mt-0.5 truncate">
                      {opt.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </div>

      {/* ── Sticky Bottom Action Bar ───────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-[#f8f3ec]/95 backdrop-blur-md border-t border-[#dfd7ca]">
        <div className="max-w-[500px] mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={handleToggleSave}
            className={`flex-1 h-11 rounded-full border border-[#6b7168] text-[12.5px] font-semibold flex items-center justify-center gap-2 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.03)] ${
              isSaved
                ? "bg-[#627354] text-white border-[#627354]"
                : "bg-[#f7f4ed] hover:bg-[#eae5d8] text-[#242320]"
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`} />
            <span>{isSaved ? "Saved" : "Save to favorites"}</span>
          </button>

          <button
            onClick={handleAddToPlan}
            className="flex-1 h-11 rounded-full bg-[#627354] hover:bg-[#526245] text-white text-[12.5px] font-semibold flex items-center justify-center gap-2 transition-all shadow-[0_2px_6px_rgba(98,115,84,0.3)] active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add to my plan</span>
          </button>
        </div>
      </div>

      {/* ── Servings Adjuster Modal ─────────────────────────────────── */}
      {showServingsModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#fcfaf5] rounded-3xl max-w-xs w-full p-5 border border-[#dfd7ca] shadow-2xl relative text-center">
            <button
              onClick={() => setShowServingsModal(false)}
              className="absolute top-4 right-4 text-[#66635c] hover:text-[#1c1b18] p-1"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="font-serif text-lg font-bold text-[#181714] mb-1">
              Adjust Servings
            </h3>
            <p className="text-xs text-[#5d5952] mb-4">
              Scale ingredient quantities and nutrition dynamically.
            </p>

            <div className="flex items-center justify-center gap-3 my-4">
              {[1, 2, 3, 4].map((num) => (
                <button
                  key={num}
                  onClick={() => setServings(num)}
                  className={`w-10 h-10 rounded-full font-bold text-sm transition-all ${
                    servings === num
                      ? "bg-[#627354] text-white shadow-md scale-105"
                      : "bg-[#eee7dc] text-[#272623] hover:bg-[#e2dcd0]"
                  }`}
                >
                  {num}x
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setShowServingsModal(false);
                toast.success(`Portions adjusted to ${servings} serving(s)!`);
              }}
              className="w-full py-2.5 rounded-full bg-[#627354] text-white text-xs font-semibold hover:bg-[#536245] transition-colors"
            >
              Apply Portions
            </button>
          </div>
        </div>
      )}

      {/* ── Watch Video Modal ───────────────────────────────────────── */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#181816] rounded-3xl max-w-sm w-full p-4 border border-[#3b3a36] shadow-2xl relative text-white text-center">
            <button
              onClick={() => setShowVideoModal(false)}
              className="absolute top-3 right-3 text-white/70 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black/80 flex items-center justify-center mb-3 relative">
              <img
                src={recipe.heroImage}
                alt={recipe.title}
                className="w-full h-full object-cover opacity-60"
              />
              <span className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center text-[#526348] shadow-lg absolute">
                <Play className="w-5 h-5 fill-current ml-0.5" />
              </span>
            </div>
            <h4 className="font-serif text-base font-bold text-white mb-1">
              Cooking Tutorial: {recipe.title}
            </h4>
            <p className="text-[11px] text-white/70 mb-3">
              Learn chef tips for getting the perfect golden crispy texture without extra oil.
            </p>
            <button
              onClick={() => setShowVideoModal(false)}
              className="w-full py-2 rounded-full bg-[#7a8d6f] text-white text-xs font-semibold hover:bg-[#6c7d61] transition-colors"
            >
              Close Video
            </button>
          </div>
        </div>
      )}

      {/* ── Detailed Nutrition Modal ────────────────────────────────── */}
      {showNutritionModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#fcfaf5] rounded-3xl max-w-sm w-full p-5 border border-[#dfd7ca] shadow-2xl relative">
            <button
              onClick={() => setShowNutritionModal(false)}
              className="absolute top-4 right-4 text-[#66635c] hover:text-[#1c1b18] p-1"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="font-serif text-xl font-bold text-[#181714] mb-1">
              Detailed Nutrition
            </h3>
            <p className="text-xs text-[#5d5952] mb-4">Per 1 serving of {recipe.title}</p>

            <div className="space-y-2 text-xs mb-5">
              <div className="flex justify-between py-1.5 border-b border-[#eee7db]">
                <span className="text-[#55524b]">Energy / Calories</span>
                <span className="font-semibold text-[#181715]">{recipe.calories}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#eee7db]">
                <span className="text-[#55524b]">Protein</span>
                <span className="font-semibold text-[#181715]">{recipe.nutrition.protein}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#eee7db]">
                <span className="text-[#55524b]">Total Carbohydrates</span>
                <span className="font-semibold text-[#181715]">{recipe.nutrition.carbs}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#eee7db]">
                <span className="text-[#55524b]">Dietary Fiber</span>
                <span className="font-semibold text-[#181715]">{recipe.nutrition.fiber}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#eee7db]">
                <span className="text-[#55524b]">Total Fat</span>
                <span className="font-semibold text-[#181715]">{recipe.nutrition.fat}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#eee7db]">
                <span className="text-[#55524b]">Iron</span>
                <span className="font-semibold text-[#181715]">3.2 mg (18% DV)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#eee7db]">
                <span className="text-[#55524b]">Potassium</span>
                <span className="font-semibold text-[#181715]">420 mg</span>
              </div>
            </div>

            <button
              onClick={() => setShowNutritionModal(false)}
              className="w-full py-2.5 rounded-full bg-[#627354] text-white text-xs font-semibold hover:bg-[#536245] transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}

    </main>
  );
}
