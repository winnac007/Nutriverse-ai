"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Bookmark,
  ChevronDown,
  Clock3,
  Flame,
  Heart,
  Leaf,
  Lightbulb,
  MoreVertical,
  Play,
  Plus,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Star,
  Sun,
  User,
  X,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";
import styles from "./ZenRecipeDetail.module.css";

export type RecipeTab = "overview" | "ingredients" | "method" | "nutrition";

export type IngredientItem = {
  name: string;
  amount: string;
  image: string;
};

export type MethodStep = {
  stepNumber: number;
  instruction: string;
  illustration?: string;
  cookingPhoto: string;
  highlightWords?: string[];
  subTip?: {
    text: string;
    icon?: "star" | "leaf";
  };
};

function renderInstruction(text: string, highlightWords?: string[]) {
  if (!highlightWords || highlightWords.length === 0) {
    return text;
  }
  const escaped = highlightWords.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const regex = new RegExp(`(${escaped.join("|")})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, index) => {
    const isMatch = highlightWords.some((w) => w.toLowerCase() === part.toLowerCase());
    if (isMatch) {
      return (
        <strong key={index} className={styles.stepHighlightWord}>
          {part}
        </strong>
      );
    }
    return part;
  });
}

export type ChefTip = {
  text: string;
  image: string;
};

export type ZenRecipe = {
  id: string;
  title: string;
  image: string;
  thumbImage?: string;
  prepMinutes: number;
  servings: number;
  calories: number;
  blurb: string;
  videoPreview: string;
  videoUrl?: string;
  badges: { label: string; type: "heart" | "thyroid" | "neutral" }[];
  nutrition: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
    fiber: string;
    sodium: string;
  };
  ingredients: IngredientItem[];
  steps?: string[];
  methodSteps: MethodStep[];
  chefTip?: ChefTip;
};

// Preset Curated Recipes
const PRESET_RECIPES: Record<string, ZenRecipe> = {
  "spinach-egg-scramble": {
    id: "spinach-egg-scramble",
    title: "Spinach & Egg Scramble",
    image: "/app-ui/recipe-hero-toast.png",
    thumbImage: "/app-ui/method-thumb-toast.png",
    prepMinutes: 8,
    servings: 1,
    calories: 220,
    blurb: "12-minute breakfast: complete protein + leafy greens.",
    videoPreview: "/app-ui/recipe-video-preview.png",
    badges: [
      { label: "heart friendly", type: "heart" },
      { label: "thyroid supportive", type: "thyroid" },
      { label: "high-protein", type: "neutral" },
      { label: "iron-rich", type: "neutral" },
    ],
    nutrition: {
      calories: 220,
      protein: "16g",
      carbs: "4g",
      fat: "15g",
      fiber: "2g",
      sodium: "160mg",
    },
    ingredients: [
      { name: "Eggs", amount: "2 large", image: "/app-ui/ing-grid-eggs.png" },
      { name: "Baby spinach", amount: "60g", image: "/app-ui/ing-grid-spinach.png" },
      { name: "Olive oil", amount: "1 tsp", image: "/app-ui/ing-grid-oil.png" },
      { name: "Garlic minced", amount: "1/2 tsp", image: "/app-ui/ing-grid-garlic.png" },
      { name: "Black pepper", amount: "1/4 tsp", image: "/app-ui/ing-grid-pepper.png" },
      { name: "Salt", amount: "A pinch", image: "/app-ui/ing-grid-salt.png" },
    ],
    steps: [
      "Heat 1 tsp olive oil in a non-stick pan over medium heat.",
      "Add minced garlic (20 sec), then toss in baby spinach until wilted (~1 min).",
      "Pour whisked eggs with black pepper and salt over the spinach.",
      "Gently stir over low heat until soft curds form (~2 min). Serve warm.",
    ],
    methodSteps: [
      {
        stepNumber: 1,
        instruction: "Heat 1 tsp olive oil in a non-stick pan over medium heat.",
        illustration: "/app-ui/method-ill1.png",
        cookingPhoto: "/app-ui/meth-step1-pan.png",
        highlightWords: ["1 tsp olive oil"],
        subTip: {
          text: "Use medium heat.",
          icon: "star",
        },
      },
      {
        stepNumber: 2,
        instruction: "Add minced garlic (20 sec), then toss in baby spinach until wilted (~1 min).",
        illustration: "/app-ui/method-ill2.png",
        cookingPhoto: "/app-ui/meth-step2-pan.png",
        highlightWords: ["baby spinach"],
        subTip: {
          text: "Don't overcook spinach.",
          icon: "leaf",
        },
      },
      {
        stepNumber: 3,
        instruction: "Pour whisked eggs with black pepper and salt over the spinach.",
        illustration: "/app-ui/method-ill3.png",
        cookingPhoto: "/app-ui/meth-step3-bowl.png",
        highlightWords: ["eggs"],
        subTip: {
          text: "Whisk well for fluffy eggs.",
          icon: "star",
        },
      },
      {
        stepNumber: 4,
        instruction: "Gently stir over low heat until soft curds form (~2 min). Serve warm.",
        illustration: "/app-ui/method-ill4.png",
        cookingPhoto: "/app-ui/meth-step4-pan.png",
        highlightWords: ["soft curds"],
        subTip: {
          text: "Soft curds = perfect texture.",
          icon: "star",
        },
      },
    ],
    chefTip: {
      text: "A pinch of black pepper enhances nutrient absorption and brings out flavor.",
      image: "/app-ui/method-tip-peppercorn.png",
    },
  },
  "hub-rec-toast": {
    id: "hub-rec-toast",
    title: "Avocado Egg Toast with Flax Seeds",
    image: "/app-ui/recipe-hero-toast.png",
    thumbImage: "/app-ui/method-thumb-toast.png",
    prepMinutes: 8,
    servings: 1,
    calories: 210,
    blurb: "10-minute breakfast: healthy fats, dietary fiber + complete protein.",
    videoPreview: "/app-ui/recipe-video-preview.png",
    badges: [
      { label: "heart friendly", type: "heart" },
      { label: "high-fiber", type: "neutral" },
      { label: "thyroid supportive", type: "thyroid" },
      { label: "high-protein", type: "neutral" },
    ],
    nutrition: {
      calories: 210,
      protein: "15g",
      carbs: "6g",
      fat: "14g",
      fiber: "3g",
      sodium: "150mg",
    },
    ingredients: [
      { name: "Eggs", amount: "2 large", image: "/app-ui/ing-eggs.png" },
      { name: "Baby spinach", amount: "50g", image: "/app-ui/ing-spinach.png" },
      { name: "Olive oil", amount: "1 tsp", image: "/app-ui/ing-olive-oil.png" },
      { name: "Flax seeds", amount: "1 tsp", image: "/app-ui/ing-pepper.png" },
      { name: "Black pepper", amount: "1/4 tsp", image: "/app-ui/ing-black-pepper.png" },
    ],
    steps: [
      "Toast whole-grain sourdough slices to desired crispness.",
      "Mash ripe avocado with a pinch of sea salt, lemon juice, and crushed flax seeds.",
      "Fry or poach the egg to a soft yolk consistency.",
      "Layer avocado and eggs onto toast and sprinkle cracked black pepper.",
    ],
    methodSteps: [
      {
        stepNumber: 1,
        instruction: "Toast artisanal sourdough slice until golden brown.",
        illustration: "/app-ui/method-ill1.png",
        cookingPhoto: "/app-ui/method-p1.png",
      },
      {
        stepNumber: 2,
        instruction: "Mash avocado with lemon and crushed golden flax seeds.",
        illustration: "/app-ui/method-ill2.png",
        cookingPhoto: "/app-ui/method-p2.png",
      },
      {
        stepNumber: 3,
        instruction: "Poach fresh egg in simmering water for 3 minutes.",
        illustration: "/app-ui/method-ill3.png",
        cookingPhoto: "/app-ui/method-p3.png",
      },
      {
        stepNumber: 4,
        instruction: "Plate toast, spread avocado, top with egg & pepper.",
        illustration: "/app-ui/method-ill4.png",
        cookingPhoto: "/app-ui/method-p4.png",
      },
    ],
    chefTip: {
      text: "Adding freshly milled flax seeds right before serving preserves delicate omega-3 oils.",
      image: "/app-ui/method-tip-peppercorn.png",
    },
  },
  "hub-rec-khichdi": {
    id: "hub-rec-khichdi",
    title: "Moong Dal Khichdi with Vegetables",
    image: "/app-ui/hub-khichdi.png",
    thumbImage: "/app-ui/hub-khichdi.png",
    prepMinutes: 15,
    servings: 2,
    calories: 280,
    blurb: "15-minute comforting bowl: prebiotic fiber + warming spices.",
    videoPreview: "/app-ui/hub-khichdi.png",
    badges: [
      { label: "heart friendly", type: "heart" },
      { label: "low fat", type: "neutral" },
      { label: "high-fiber", type: "neutral" },
      { label: "digestive ease", type: "neutral" },
    ],
    nutrition: {
      calories: 280,
      protein: "14g",
      carbs: "38g",
      fat: "6g",
      fiber: "7g",
      sodium: "210mg",
    },
    ingredients: [
      { name: "Moong dal", amount: "1/2 cup", image: "/app-ui/ing-garlic.png" },
      { name: "Brown rice", amount: "1/2 cup", image: "/app-ui/ing-pepper.png" },
      { name: "Olive oil", amount: "1 tsp", image: "/app-ui/ing-olive-oil.png" },
      { name: "Baby spinach", amount: "60g", image: "/app-ui/ing-spinach.png" },
      { name: "Black pepper", amount: "1/4 tsp", image: "/app-ui/ing-black-pepper.png" },
    ],
    steps: [
      "Rinse yellow moong dal and rice until water runs clear.",
      "Sauté cumin, ginger, and turmeric in olive oil until aromatic.",
      "Add vegetables, dal, rice, and water. Simmer until tender and creamy.",
      "Garnish with fresh cilantro and a dollop of Greek yogurt.",
    ],
    methodSteps: [
      {
        stepNumber: 1,
        instruction: "Rinse moong dal and rice thoroughly under cold running water.",
        illustration: "/app-ui/method-ill1.png",
        cookingPhoto: "/app-ui/method-p1.png",
      },
      {
        stepNumber: 2,
        instruction: "Sauté cumin, grated ginger, and turmeric in olive oil for 30 seconds.",
        illustration: "/app-ui/method-ill2.png",
        cookingPhoto: "/app-ui/method-p2.png",
      },
      {
        stepNumber: 3,
        instruction: "Add chopped vegetables, dal, rice, and 3 cups of water.",
        illustration: "/app-ui/method-ill3.png",
        cookingPhoto: "/app-ui/method-p3.png",
      },
      {
        stepNumber: 4,
        instruction: "Simmer on low heat until creamy and velvety, then fold in spinach.",
        illustration: "/app-ui/method-ill4.png",
        cookingPhoto: "/app-ui/method-p4.png",
      },
    ],
    chefTip: {
      text: "A dash of freshly ground cumin and black pepper enhances digestive fire and nutrient uptake.",
      image: "/app-ui/method-tip-peppercorn.png",
    },
  },
  "hub-rec-salmon": {
    id: "hub-rec-salmon",
    title: "Lemon Herb Grilled Salmon",
    image: "/app-ui/hub-salmon.png",
    thumbImage: "/app-ui/hub-salmon.png",
    prepMinutes: 12,
    servings: 1,
    calories: 320,
    blurb: "12-minute dinner: omega-3 fatty acids + antioxidant rich greens.",
    videoPreview: "/app-ui/hub-salmon.png",
    badges: [
      { label: "omega-3 rich", type: "thyroid" },
      { label: "heart friendly", type: "heart" },
      { label: "high-protein", type: "neutral" },
      { label: "anti-inflammatory", type: "neutral" },
    ],
    nutrition: {
      calories: 320,
      protein: "34g",
      carbs: "2g",
      fat: "18g",
      fiber: "1g",
      sodium: "180mg",
    },
    ingredients: [
      { name: "Salmon fillet", amount: "180g", image: "/app-ui/hub-salmon.png" },
      { name: "Olive oil", amount: "1 tsp", image: "/app-ui/ing-olive-oil.png" },
      { name: "Garlic minced", amount: "1/2 tsp", image: "/app-ui/ing-garlic.png" },
      { name: "Baby spinach", amount: "80g", image: "/app-ui/ing-spinach.png" },
      { name: "Black pepper", amount: "1/4 tsp", image: "/app-ui/ing-black-pepper.png" },
    ],
    steps: [
      "Pat salmon fillet dry and season with sea salt, black pepper, and lemon zest.",
      "Heat olive oil in a skillet over medium-high heat. Sear skin-side down for 4 minutes.",
      "Flip gently and cook for an additional 3 minutes until tender and flaky.",
      "Serve hot with sautéed garlic greens and lemon wedges.",
    ],
    methodSteps: [
      {
        stepNumber: 1,
        instruction: "Heat 1 tsp olive oil in a heavy cast-iron or non-stick skillet.",
        illustration: "/app-ui/method-ill1.png",
        cookingPhoto: "/app-ui/method-p1.png",
      },
      {
        stepNumber: 2,
        instruction: "Season salmon fillet with sea salt, lemon zest, and cracked pepper.",
        illustration: "/app-ui/method-ill2.png",
        cookingPhoto: "/app-ui/method-p2.png",
      },
      {
        stepNumber: 3,
        instruction: "Sear skin-side down for 4 minutes until crisp, then flip gently.",
        illustration: "/app-ui/method-ill3.png",
        cookingPhoto: "/app-ui/method-p3.png",
      },
      {
        stepNumber: 4,
        instruction: "Toss baby spinach with minced garlic in pan juices and serve.",
        illustration: "/app-ui/method-ill4.png",
        cookingPhoto: "/app-ui/method-p4.png",
      },
    ],
    chefTip: {
      text: "Searing salmon skin-down first retains natural juices and preserves tender heart-healthy omega-3s.",
      image: "/app-ui/method-tip-peppercorn.png",
    },
  },
};

export default function ZenRecipeDetail({
  recipeId,
  initialTab,
}: {
  recipeId: string;
  initialTab?: RecipeTab;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const validTabs: RecipeTab[] = ["overview", "ingredients", "method", "nutrition"];
  const urlTab = searchParams.get("tab") as RecipeTab | null;

  // Screen 5 is the Method tab; default to "method" if specified or if viewing Screen 5 directly
  const [activeTab, setActiveTab] = useState<RecipeTab>(() => {
    if (initialTab && validTabs.includes(initialTab)) return initialTab;
    if (urlTab && validTabs.includes(urlTab)) return urlTab;
    return "method";
  });

  const [recipe, setRecipe] = useState<ZenRecipe>(PRESET_RECIPES["spinach-egg-scramble"]);
  const [saved, setSaved] = useState(Boolean(user?.saved_recipes?.includes(recipeId)));
  const [selectedMealType, setSelectedMealType] = useState<string>("Lunch");
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [logging, setLogging] = useState(false);

  // Match preset or fetch API
  useEffect(() => {
    const key = recipeId.toLowerCase();
    if (PRESET_RECIPES[key]) {
      setRecipe(PRESET_RECIPES[key]);
      return;
    }

    let active = true;
    api
      .get(`/recipes/${encodeURIComponent(recipeId)}`)
      .then(({ data }) => {
        if (!active || !data) return;
        const d = data.recipe || data;
        const defaultPreset = PRESET_RECIPES["spinach-egg-scramble"];
        const mapped: ZenRecipe = {
          id: d.id || recipeId,
          title: d.title || defaultPreset.title,
          image: d.image || defaultPreset.image,
          thumbImage: d.image || defaultPreset.thumbImage,
          prepMinutes: d.prep_minutes || d.prepMinutes || defaultPreset.prepMinutes,
          servings: d.servings || defaultPreset.servings,
          calories: d.nutrition?.calories || d.calories || defaultPreset.calories,
          blurb: d.description || defaultPreset.blurb,
          videoPreview: d.image || defaultPreset.videoPreview,
          badges: defaultPreset.badges,
          nutrition: {
            calories: d.nutrition?.calories || d.calories || defaultPreset.calories,
            protein: `${d.nutrition?.protein || 16}g`,
            carbs: `${d.nutrition?.carbs || 4}g`,
            fat: `${d.nutrition?.fat || 15}g`,
            fiber: `${d.nutrition?.fiber || 2}g`,
            sodium: `${d.nutrition?.sodium || 160}mg`,
          },
          ingredients:
            Array.isArray(d.ingredients) && d.ingredients.length > 0
              ? d.ingredients.map((ing: any, i: number) => ({
                  name: typeof ing === "string" ? ing : ing.name || "Ingredient",
                  amount:
                    typeof ing === "object"
                      ? `${ing.amount || ""} ${ing.unit || ""}`.trim()
                      : "To taste",
                  image: [
                    "/app-ui/ing-eggs.png",
                    "/app-ui/ing-spinach.png",
                    "/app-ui/ing-olive-oil.png",
                    "/app-ui/ing-garlic.png",
                    "/app-ui/ing-black-pepper.png",
                  ][i % 5],
                }))
              : defaultPreset.ingredients,
          steps: Array.isArray(d.steps) && d.steps.length > 0 ? d.steps : defaultPreset.steps,
          methodSteps: defaultPreset.methodSteps,
          chefTip: defaultPreset.chefTip,
        };
        setRecipe(mapped);
      })
      .catch(() => {
        setRecipe(PRESET_RECIPES["spinach-egg-scramble"]);
      });

    return () => {
      active = false;
    };
  }, [recipeId]);

  // Handle Tab Change with URL sync
  const handleTabChange = (tab: RecipeTab) => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", tab);
      window.history.replaceState(null, "", url.toString());
    }
  };

  // Handle Back
  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/app/healthcare");
    }
  };

  // Handle Save / Bookmark
  const handleToggleSave = () => {
    setSaved((prev) => {
      const next = !prev;
      toast.success(next ? "Saved to your bookmarks" : "Removed from bookmarks");
      return next;
    });
  };

  // Handle Log Meal
  const handleLogMeal = async () => {
    setLogging(true);
    try {
      await api
        .post("/track/meal", {
          meal_type: selectedMealType.toLowerCase(),
          recipe_id: recipe.id,
          recipe_title: recipe.title,
          calories: recipe.calories,
        })
        .catch(() => {
          // offline fallback
        });
      toast.success(`Logged as ${selectedMealType}! 🥗`);
    } catch {
      toast.success(`Logged as ${selectedMealType}! 🥗`);
    } finally {
      setLogging(false);
    }
  };

  // Handle Shop All
  const handleShopAll = () => {
    const list = recipe.ingredients.map((ing) => `• ${ing.name} (${ing.amount})`).join("\n");
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(`${recipe.title} Ingredients:\n${list}`);
      toast.success("Ingredients copied to shopping list! 🛍");
    } else {
      toast.success("Ingredients ready for shopping! 🛍");
    }
  };

  return (
    <div className={styles.container}>
      {/* 1. Top Navigation Bar */}
      <nav className={styles.topNav} aria-label="Recipe navigation">
        <button type="button" className={styles.backBtn} onClick={handleBack}>
          <ArrowLeft />
          <span>Back</span>
        </button>
        <div className={styles.topNavActions}>
          <button
            type="button"
            className={`${styles.iconBtn} ${saved ? styles.bookmarkActive : ""}`}
            onClick={handleToggleSave}
            aria-label={saved ? "Remove bookmark" : "Bookmark recipe"}
          >
            <Bookmark fill={saved ? "currentColor" : "none"} />
          </button>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => toast.info("Recipe options: Share, print, or export.")}
            aria-label="More options"
          >
            <MoreVertical />
          </button>
        </div>
      </nav>

      {/* 2. Header Area:
          - In Method / Ingredients / Nutrition tabs: Compact header matching Screen 5 mockup
          - In Overview tab: Large Hero Card matching Screen 4 mockup
      */}
      {activeTab !== "overview" && (
        <header className={styles.compactHeader} aria-label="Recipe summary">
          <img
            src={recipe.thumbImage || recipe.image}
            alt={recipe.title}
            className={styles.compactThumb}
          />
          <div className={styles.compactInfo}>
            <h1 className={styles.compactTitle}>{recipe.title}</h1>
            <div className={styles.compactMeta}>
              <span className={styles.compactMetaItem}>
                <Clock3 />
                <span>{recipe.prepMinutes} min</span>
              </span>
              <span className={styles.compactMetaItem}>
                <User />
                <span>{recipe.servings} serving</span>
              </span>
              <span className={styles.compactMetaItem}>
                <Flame />
                <span>{recipe.calories} kcal</span>
              </span>
              {recipe.badges?.some((b) => b.type === "heart" || b.label.includes("heart")) && (
                <span className={styles.headerHeartBadge}>
                  <Heart />
                  <span>heart friendly</span>
                </span>
              )}
            </div>
          </div>
        </header>
      )}

      {/* 3. Underline Tab Bar: [ Overview | Ingredients | Method | Nutrition ] */}
      <nav className={styles.underlineTabBar} aria-label="Recipe tabs">
        {(["overview", "ingredients", "method", "nutrition"] as RecipeTab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            className={`${styles.tabUnderlineBtn} ${
              activeTab === tab ? styles.tabUnderlineActive : ""
            }`}
            onClick={() => handleTabChange(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </nav>

      {/* =========================================================================
          SCREEN 5 VIEW: METHOD TAB ACTIVE
          ========================================================================= */}
      {activeTab === "method" && (
        <>
          {/* Chef's Tip Card (Placed at the Top per Mockup) */}
          {recipe.chefTip && (
            <aside className={styles.chefTipCard} aria-label="Chef tip">
              <div className={styles.chefTipLeft}>
                <div className={styles.chefTipIconBadge}>
                  <Lightbulb />
                </div>
                <div className={styles.chefTipBody}>
                  <h4 className={styles.chefTipTitle}>Chef&apos;s tip</h4>
                  <p className={styles.chefTipText}>{recipe.chefTip.text}</p>
                </div>
              </div>
              <img
                src={recipe.chefTip.image}
                alt="Chef's spice tip"
                className={styles.chefTipImg}
              />
            </aside>
          )}

          {/* Step-by-Step Cooking Timeline with Dashed Line & Reversed Layout */}
          <section className={styles.dashedTimeline} aria-label="Step-by-step preparation method">
            {recipe.methodSteps.map((step) => (
              <div key={step.stepNumber} className={styles.stepItem}>
                <span className={styles.stepBadge}>{step.stepNumber}</span>
                <article className={styles.stepCardReversed}>
                  <div className={styles.stepLeftPhotoWrapper}>
                    <img
                      src={step.cookingPhoto}
                      alt={`Step ${step.stepNumber} photo`}
                      className={styles.stepLeftPhoto}
                    />
                  </div>
                  <div className={styles.stepRightBody}>
                    <p className={styles.stepInstructionText}>
                      {renderInstruction(step.instruction, step.highlightWords)}
                    </p>
                    {step.subTip && (
                      <span
                        className={`${styles.stepTipPill} ${
                          step.subTip.icon === "leaf" ? styles.stepTipPillGreen : ""
                        }`}
                      >
                        {step.subTip.icon === "leaf" ? (
                          <Leaf />
                        ) : (
                          <Star fill="#C8963E" stroke="#C8963E" />
                        )}
                        <span>{step.subTip.text}</span>
                      </span>
                    )}
                  </div>
                </article>
              </div>
            ))}
          </section>

          {/* Log this meal Card */}
          <section className={styles.logMealCard} aria-label="Log this meal">
            <div className={styles.logMealLeft}>
              <h3 className={styles.logMealTitle}>Log this meal</h3>
              <div className={styles.mealSelectWrapper}>
                <Sun className={styles.mealSelectSun} />
                <select
                  className={styles.mealSelect}
                  value={selectedMealType}
                  onChange={(e) => setSelectedMealType(e.target.value)}
                  aria-label="Select meal slot"
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snack">Snack</option>
                </select>
                <ChevronDown className={styles.mealSelectChevron} />
              </div>
            </div>
            <button
              type="button"
              className={styles.logMealBtn}
              onClick={handleLogMeal}
              disabled={logging}
            >
              <Plus />
              <span>{logging ? "Logging…" : "Log meal"}</span>
            </button>
          </section>

          {/* Watch Full Recipe Banner Card */}
          <div
            className={styles.watchFullRecipeBanner}
            onClick={() => setShowVideoModal(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setShowVideoModal(true);
              }
            }}
            aria-label="Watch full recipe tutorial"
          >
            <div className={styles.watchBannerLeft}>
              <span className={styles.watchPlayCircle}>
                <Play />
              </span>
              <div className={styles.watchText}>
                <h3 className={styles.watchTitle}>Watch full recipe</h3>
                <p className={styles.watchSubtitle}>
                  Detailed video with chef tips and delicious variations.
                </p>
              </div>
            </div>
            <div className={styles.watchImgWrapper}>
              <img
                src={recipe.thumbImage || recipe.image}
                alt={recipe.title}
                className={styles.watchBannerImg}
              />
              <span className={styles.watchImgPlayBadge}>
                <Play />
              </span>
            </div>
          </div>
        </>
      )}

      {/* =========================================================================
          SCREEN 4 VIEW: OVERVIEW TAB ACTIVE
          ========================================================================= */}
      {activeTab === "overview" && (
        <>
          {/* Main Hero Card */}
          <article className={styles.heroCard}>
            <div className={styles.heroImageContainer}>
              <img src={recipe.image} alt={recipe.title} className={styles.heroImage} />
              <span className={styles.timeBadge}>
                <Zap />
                <span>{recipe.prepMinutes}-min</span>
              </span>
            </div>

            <div className={styles.heroBody}>
              <div className={styles.titleRow}>
                <h1 className={styles.recipeTitle}>{recipe.title}</h1>
                <button
                  type="button"
                  className={styles.heroBookmarkBtn}
                  onClick={handleToggleSave}
                  aria-label={saved ? "Remove bookmark" : "Bookmark recipe"}
                >
                  <Bookmark fill={saved ? "currentColor" : "none"} />
                </button>
              </div>

              <div className={styles.metaRow}>
                <span className={styles.metaItem}>
                  <Clock3 />
                  <span>{recipe.prepMinutes} min</span>
                </span>
                <span className={styles.metaItem}>
                  <User />
                  <span>{recipe.servings} serving</span>
                </span>
                <span className={styles.metaItem}>
                  <Flame />
                  <span>{recipe.calories} kcal</span>
                </span>
              </div>

              <div className={styles.badgeRow}>
                {recipe.badges.map((b) => (
                  <span
                    key={b.label}
                    className={`${styles.badgePill} ${
                      b.type === "heart"
                        ? styles.badgeHeart
                        : b.type === "thyroid"
                        ? styles.badgeThyroid
                        : styles.badgeNeutral
                    }`}
                  >
                    {b.type === "heart" ? <Heart /> : b.type === "thyroid" ? <Sparkles /> : null}
                    <span>{b.label}</span>
                  </span>
                ))}
              </div>

              <p className={styles.recipeBlurb}>{recipe.blurb}</p>

              {/* Video / Tutorial Banner -> switches to Method */}
              <div
                className={styles.videoCard}
                onClick={() => handleTabChange("method")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleTabChange("method");
                  }
                }}
                aria-label="View cooking method and tutorial"
              >
                <img
                  src={recipe.videoPreview}
                  alt=""
                  className={styles.videoBgImg}
                  aria-hidden="true"
                />
                <div className={styles.videoOverlayContent}>
                  <span className={styles.playButtonCircle}>
                    <Play />
                  </span>
                  <span className={styles.videoLabel}>How to cook • Watch tutorial</span>
                </div>
              </div>
            </div>
          </article>

          {/* Nutrition (per serving) Card */}
          <section className={styles.nutritionCard} aria-label="Nutrition information">
            <h2 className={styles.nutritionHeader}>Nutrition (per serving)</h2>
            <div className={styles.nutritionGrid}>
              <div className={styles.nutritionMetric}>
                <span className={styles.nutritionValue}>{recipe.nutrition.calories}</span>
                <span className={styles.nutritionLabel}>CALORIES</span>
              </div>
              <div className={styles.nutritionMetric}>
                <span className={styles.nutritionValue}>{recipe.nutrition.protein}</span>
                <span className={styles.nutritionLabel}>PROTEIN</span>
              </div>
              <div className={styles.nutritionMetric}>
                <span className={styles.nutritionValue}>{recipe.nutrition.carbs}</span>
                <span className={styles.nutritionLabel}>CARBS</span>
              </div>

              <div className={styles.nutritionDivider} aria-hidden="true" />

              <div className={styles.nutritionMetric}>
                <span className={styles.nutritionValue}>{recipe.nutrition.fat}</span>
                <span className={styles.nutritionLabel}>FAT</span>
              </div>
              <div className={styles.nutritionMetric}>
                <span className={styles.nutritionValue}>{recipe.nutrition.fiber}</span>
                <span className={styles.nutritionLabel}>FIBER</span>
              </div>
              <div className={styles.nutritionMetric}>
                <span className={styles.nutritionValue}>{recipe.nutrition.sodium}</span>
                <span className={styles.nutritionLabel}>SODIUM</span>
              </div>
            </div>
          </section>

          {/* Log this meal Card */}
          <section className={styles.logMealCard} aria-label="Log this meal">
            <div className={styles.logMealLeft}>
              <h3 className={styles.logMealTitle}>Log this meal</h3>
              <div className={styles.mealSelectWrapper}>
                <Sun className={styles.mealSelectSun} />
                <select
                  className={styles.mealSelect}
                  value={selectedMealType}
                  onChange={(e) => setSelectedMealType(e.target.value)}
                  aria-label="Select meal slot"
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snack">Snack</option>
                </select>
                <ChevronDown className={styles.mealSelectChevron} />
              </div>
            </div>
            <button
              type="button"
              className={styles.logMealBtn}
              onClick={handleLogMeal}
              disabled={logging}
            >
              <Plus />
              <span>{logging ? "Logging…" : "Log meal"}</span>
            </button>
          </section>

          {/* Ingredients Section */}
          <section className={styles.ingredientsSection} aria-label="Ingredients">
            <div className={styles.ingredientsHeader}>
              <h2 className={styles.ingredientsTitle}>Ingredients</h2>
              <button type="button" className={styles.shopAllBtn} onClick={handleShopAll}>
                <ShoppingBag />
                <span>Shop all</span>
              </button>
            </div>

            <div className={styles.ingredientsRail}>
              {recipe.ingredients.map((ing) => (
                <div key={ing.name} className={styles.ingredientCard}>
                  <div className={styles.ingredientImgWrapper}>
                    <img src={ing.image} alt={ing.name} className={styles.ingredientImg} />
                  </div>
                  <strong className={styles.ingredientName}>{ing.name}</strong>
                  <span className={styles.ingredientAmount}>{ing.amount}</span>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* =========================================================================
          INGREDIENTS TAB ACTIVE
          ========================================================================= */}
      {activeTab === "ingredients" && (
        <>
          {/* 3x2 Photo Grid Section */}
          <section className={styles.ingredientsGridSection} aria-label="Ingredients Grid">
            <div className={styles.ingredientsGridHeader}>
              <h2 className={styles.ingredientsGridTitle}>Ingredients</h2>
              <button type="button" className={styles.shopAllPill} onClick={handleShopAll}>
                <ShoppingCart />
                <span>Shop all ingredients</span>
              </button>
            </div>

            <div className={styles.ingredientsGrid}>
              {recipe.ingredients.map((ing) => (
                <div key={ing.name} className={styles.ingredientGridCard}>
                  <div className={styles.ingredientPlateHalo}>
                    <img src={ing.image} alt={ing.name} className={styles.ingredientGridImg} />
                  </div>
                  <h3 className={styles.ingredientGridName}>{ing.name}</h3>
                  <span className={styles.ingredientGridAmount}>{ing.amount}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Horizontal Nutrition Strip Card */}
          <section className={styles.horizontalNutritionCard} aria-label="Nutrition Summary">
            <div className={styles.nutritionHeaderRow}>
              <span className={styles.nutritionLeafBadge}>
                <Leaf />
              </span>
              <h3 className={styles.nutritionHeaderTitle}>Nutrition (per serving)</h3>
            </div>
            <div className={styles.nutritionStatStrip}>
              <div className={styles.statStripItem}>
                <span className={styles.statStripValue}>{recipe.nutrition.calories}</span>
                <span className={styles.statStripLabel}>CALORIES</span>
              </div>
              <div className={styles.statStripItem}>
                <span className={styles.statStripValue}>{recipe.nutrition.protein}</span>
                <span className={styles.statStripLabel}>PROTEIN</span>
              </div>
              <div className={styles.statStripItem}>
                <span className={styles.statStripValue}>{recipe.nutrition.carbs}</span>
                <span className={styles.statStripLabel}>CARBS</span>
              </div>
              <div className={styles.statStripItem}>
                <span className={styles.statStripValue}>{recipe.nutrition.fat}</span>
                <span className={styles.statStripLabel}>FAT</span>
              </div>
              <div className={styles.statStripItem}>
                <span className={styles.statStripValue}>{recipe.nutrition.fiber}</span>
                <span className={styles.statStripLabel}>FIBER</span>
              </div>
              <div className={styles.statStripItem}>
                <span className={styles.statStripValue}>{recipe.nutrition.sodium}</span>
                <span className={styles.statStripLabel}>SODIUM</span>
              </div>
            </div>
            <p className={styles.nutritionDisclaimer}>
              Values are approximate based on standard serving sizes.
            </p>
          </section>

          {/* Log this meal Card */}
          <section className={styles.logMealCard} aria-label="Log this meal">
            <div className={styles.logMealLeft}>
              <h3 className={styles.logMealTitle}>Log this meal</h3>
              <div className={styles.mealSelectWrapper}>
                <Sun className={styles.mealSelectSun} />
                <select
                  className={styles.mealSelect}
                  value={selectedMealType}
                  onChange={(e) => setSelectedMealType(e.target.value)}
                  aria-label="Select meal slot"
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snack">Snack</option>
                </select>
                <ChevronDown className={styles.mealSelectChevron} />
              </div>
            </div>
            <button
              type="button"
              className={styles.logMealBtn}
              onClick={handleLogMeal}
              disabled={logging}
            >
              <Plus />
              <span>{logging ? "Logging…" : "Log meal"}</span>
            </button>
          </section>

          {/* Chef's Tip Card */}
          {recipe.chefTip && (
            <aside className={styles.chefTipCard} aria-label="Chef tip">
              <div className={styles.chefTipLeft}>
                <div className={styles.chefTipIconBadge}>
                  <Lightbulb />
                </div>
                <div className={styles.chefTipBody}>
                  <h4 className={styles.chefTipTitle}>Chef&apos;s tip</h4>
                  <p className={styles.chefTipText}>{recipe.chefTip.text}</p>
                </div>
              </div>
              <img
                src={recipe.chefTip.image}
                alt="Chef's spice tip"
                className={styles.chefTipImg}
              />
            </aside>
          )}

          {/* Watch Full Recipe Banner Card */}
          <div
            className={styles.watchFullRecipeBanner}
            onClick={() => setShowVideoModal(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setShowVideoModal(true);
              }
            }}
            aria-label="Watch full recipe tutorial"
          >
            <div className={styles.watchBannerLeft}>
              <span className={styles.watchPlayCircle}>
                <Play />
              </span>
              <div className={styles.watchText}>
                <h3 className={styles.watchTitle}>Watch full recipe</h3>
                <p className={styles.watchSubtitle}>
                  Detailed video with chef tips and delicious variations.
                </p>
              </div>
            </div>
            <div className={styles.watchImgWrapper}>
              <img
                src={recipe.thumbImage || recipe.image}
                alt={recipe.title}
                className={styles.watchBannerImg}
              />
              <span className={styles.watchImgPlayBadge}>
                <Play />
              </span>
            </div>
          </div>
        </>
      )}

      {/* =========================================================================
          NUTRITION TAB ACTIVE
          ========================================================================= */}
      {activeTab === "nutrition" && (
        <section className={styles.nutritionCard} aria-label="Detailed nutrition breakdown">
          <h2 className={styles.nutritionHeader}>Nutrition (per serving)</h2>
          <div className={styles.nutritionGrid}>
            <div className={styles.nutritionMetric}>
              <span className={styles.nutritionValue}>{recipe.nutrition.calories}</span>
              <span className={styles.nutritionLabel}>CALORIES</span>
            </div>
            <div className={styles.nutritionMetric}>
              <span className={styles.nutritionValue}>{recipe.nutrition.protein}</span>
              <span className={styles.nutritionLabel}>PROTEIN</span>
            </div>
            <div className={styles.nutritionMetric}>
              <span className={styles.nutritionValue}>{recipe.nutrition.carbs}</span>
              <span className={styles.nutritionLabel}>CARBS</span>
            </div>

            <div className={styles.nutritionDivider} aria-hidden="true" />

            <div className={styles.nutritionMetric}>
              <span className={styles.nutritionValue}>{recipe.nutrition.fat}</span>
              <span className={styles.nutritionLabel}>FAT</span>
            </div>
            <div className={styles.nutritionMetric}>
              <span className={styles.nutritionValue}>{recipe.nutrition.fiber}</span>
              <span className={styles.nutritionLabel}>FIBER</span>
            </div>
            <div className={styles.nutritionMetric}>
              <span className={styles.nutritionValue}>{recipe.nutrition.sodium}</span>
              <span className={styles.nutritionLabel}>SODIUM</span>
            </div>
          </div>

          <div
            style={{
              marginTop: "1.25rem",
              paddingTop: "1rem",
              borderTop: "1px solid #ece6da",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            <h4
              style={{
                margin: 0,
                fontSize: "0.85rem",
                color: "#1d1b18",
                fontWeight: 700,
              }}
            >
              Functional Benefits
            </h4>
            <div className={styles.badgeRow}>
              {recipe.badges.map((b) => (
                <span
                  key={b.label}
                  className={`${styles.badgePill} ${
                    b.type === "heart"
                      ? styles.badgeHeart
                      : b.type === "thyroid"
                      ? styles.badgeThyroid
                      : styles.badgeNeutral
                  }`}
                >
                  {b.type === "heart" ? <Heart /> : b.type === "thyroid" ? <Sparkles /> : null}
                  <span>{b.label}</span>
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Video / Cooking Modal */}
      {showVideoModal && (
        <div
          className={styles.videoModalOverlay}
          onClick={() => setShowVideoModal(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Cooking instructions"
        >
          <div className={styles.videoModal} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.videoModalClose}
              onClick={() => setShowVideoModal(false)}
              aria-label="Close"
            >
              <X size={16} />
            </button>
            <div className={styles.videoModalBody}>
              <h3>How to cook {recipe.title}</h3>
              <p>Step-by-step preparation method:</p>
              <ol
                style={{
                  paddingLeft: "1.2rem",
                  margin: 0,
                  display: "grid",
                  gap: "0.6rem",
                }}
              >
                {(recipe.steps || []).map((step, idx) => (
                  <li
                    key={idx}
                    style={{ fontSize: "0.85rem", lineHeight: 1.45, color: "#DDD" }}
                  >
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

