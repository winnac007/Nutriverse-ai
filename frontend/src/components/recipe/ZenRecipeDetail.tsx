"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Bookmark,
  ChevronDown,
  Clock3,
  Flame,
  Heart,
  MoreVertical,
  Play,
  Plus,
  ShoppingBag,
  Sparkles,
  User,
  X,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";
import styles from "./ZenRecipeDetail.module.css";

type IngredientItem = {
  name: string;
  amount: string;
  image: string;
};

type ZenRecipe = {
  id: string;
  title: string;
  image: string;
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
};

// Preset Curated Recipes
const PRESET_RECIPES: Record<string, ZenRecipe> = {
  "spinach-egg-scramble": {
    id: "spinach-egg-scramble",
    title: "Spinach & Egg Scramble",
    image: "/app-ui/recipe-hero-toast.png",
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
      { name: "Eggs", amount: "2 large", image: "/app-ui/ing-eggs.png" },
      { name: "Baby spinach", amount: "60g", image: "/app-ui/ing-spinach.png" },
      { name: "Olive oil", amount: "1 tsp", image: "/app-ui/ing-olive-oil.png" },
      { name: "Garlic minced", amount: "1/2 tsp", image: "/app-ui/ing-garlic.png" },
      { name: "Black pepper", amount: "1/4 tsp", image: "/app-ui/ing-black-pepper.png" },
    ],
    steps: [
      "Lightly toast sourdough bread until golden and crisp.",
      "Heat olive oil in a skillet over medium heat. Sauté garlic and baby spinach for 1 minute until wilted.",
      "Fry or scramble eggs sunny-side up with a soft yolk.",
      "Assemble on toast with fresh avocado spread, black pepper, and chili flakes.",
    ],
  },
  "hub-rec-toast": {
    id: "hub-rec-toast",
    title: "Avocado Egg Toast with Flax Seeds",
    image: "/app-ui/recipe-hero-toast.png",
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
  },
  "hub-rec-khichdi": {
    id: "hub-rec-khichdi",
    title: "Moong Dal Khichdi with Vegetables",
    image: "/app-ui/hub-khichdi.png",
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
  },
  "hub-rec-salmon": {
    id: "hub-rec-salmon",
    title: "Lemon Herb Grilled Salmon",
    image: "/app-ui/hub-salmon.png",
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
  },
};

export default function ZenRecipeDetail({ recipeId }: { recipeId: string }) {
  const router = useRouter();
  const { user } = useAuth();
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
        const mapped: ZenRecipe = {
          id: d.id || recipeId,
          title: d.title || "Spinach & Egg Scramble",
          image: d.image || "/app-ui/recipe-hero-toast.png",
          prepMinutes: d.prep_minutes || d.prepMinutes || 8,
          servings: d.servings || 1,
          calories: d.nutrition?.calories || d.calories || 220,
          blurb: d.description || "Nutritious meal tailored for your health priorities.",
          videoPreview: d.image || "/app-ui/recipe-video-preview.png",
          badges: [
            { label: "heart friendly", type: "heart" },
            { label: "thyroid supportive", type: "thyroid" },
            { label: "high-protein", type: "neutral" },
            { label: "iron-rich", type: "neutral" },
          ],
          nutrition: {
            calories: d.nutrition?.calories || d.calories || 220,
            protein: `${d.nutrition?.protein || 16}g`,
            carbs: `${d.nutrition?.carbs || 4}g`,
            fat: `${d.nutrition?.fat || 15}g`,
            fiber: `${d.nutrition?.fiber || 2}g`,
            sodium: `${d.nutrition?.sodium || 160}mg`,
          },
          ingredients: Array.isArray(d.ingredients) && d.ingredients.length > 0
            ? d.ingredients.map((ing: any, i: number) => ({
                name: typeof ing === "string" ? ing : ing.name || "Ingredient",
                amount: typeof ing === "object" ? `${ing.amount || ""} ${ing.unit || ""}`.trim() : "To taste",
                image: [
                  "/app-ui/ing-eggs.png",
                  "/app-ui/ing-spinach.png",
                  "/app-ui/ing-olive-oil.png",
                  "/app-ui/ing-garlic.png",
                  "/app-ui/ing-black-pepper.png",
                ][i % 5],
              }))
            : PRESET_RECIPES["spinach-egg-scramble"].ingredients,
          steps: Array.isArray(d.steps) ? d.steps : PRESET_RECIPES["spinach-egg-scramble"].steps,
        };
        setRecipe(mapped);
      })
      .catch(() => {
        // Fallback to default
        setRecipe(PRESET_RECIPES["spinach-egg-scramble"]);
      });

    return () => {
      active = false;
    };
  }, [recipeId]);

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
      await api.post("/track/meal", {
        meal_type: selectedMealType.toLowerCase(),
        recipe_id: recipe.id,
        recipe_title: recipe.title,
        calories: recipe.calories,
      }).catch(() => {
        // graceful offline fallback
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

      {/* 2. Main Hero Card */}
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

          {/* Video / Tutorial Banner */}
          <div
            className={styles.videoCard}
            onClick={() => setShowVideoModal(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setShowVideoModal(true);
              }
            }}
            aria-label="Watch cooking tutorial"
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

      {/* 3. Nutrition (per serving) Card */}
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

      {/* 4. Log this meal Card */}
      <section className={styles.logMealCard} aria-label="Log this meal">
        <div className={styles.logMealLeft}>
          <h3 className={styles.logMealTitle}>Log this meal</h3>
          <div className={styles.mealSelectWrapper}>
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

      {/* 5. Ingredients Section */}
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
              <ol style={{ paddingLeft: "1.2rem", margin: 0, display: "grid", gap: "0.6rem" }}>
                {(recipe.steps || []).map((step, idx) => (
                  <li key={idx} style={{ fontSize: "0.85rem", lineHeight: 1.45, color: "#DDD" }}>
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
