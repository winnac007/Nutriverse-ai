"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import api from "@/lib/api";
import { useAuth } from "@/lib/auth";
import {
  getCulinaryDestinationByCuisine,
  getCuratedRecipeReference,
} from "@/lib/culinary";

import styles from "./RecipeExperience.module.css";

export type RecipeExperienceView = "overview" | "ingredients" | "steps";

type Ingredient = {
  name: string;
  amount: string;
  unit: string;
  image?: string;
};

type StepDetail = {
  title: string;
  description: string;
  image?: string;
};

type RecipeNutrition = {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  sodium?: number;
};

type RecipeData = {
  id: string;
  title: string;
  description: string;
  image: string;
  cuisine: string;
  country: string;
  region: string;
  state?: string;
  prepMinutes: number;
  cookTime: number;
  servings: number;
  difficulty: string;
  rating?: number;
  ratingCount?: number;
  nutrition: RecipeNutrition;
  ingredients: Ingredient[];
  steps: string[];
  stepDetails: StepDetail[];
  story: string;
  tags: string[];
};

type CookingStage = "overview" | "ingredients" | "steps" | "complete";

type CookingProgress = {
  version: 1;
  stage: CookingStage;
  currentStep: number;
  completedSteps: number[];
};

type LoadState =
  | { status: "loading" }
  | { status: "ready"; recipe: RecipeData }
  | { status: "error"; kind: "not-found" | "network" };

type RawIngredient = {
  name?: unknown;
  amount?: unknown;
  unit?: unknown;
  image?: unknown;
};

type RawStepDetail = {
  title?: unknown;
  description?: unknown;
  image?: unknown;
};

type RawRecipe = {
  id?: unknown;
  title?: unknown;
  description?: unknown;
  image?: unknown;
  cuisine?: unknown;
  country?: unknown;
  region?: unknown;
  state?: unknown;
  prep_minutes?: unknown;
  prepMinutes?: unknown;
  cook_time?: unknown;
  cookTime?: unknown;
  servings?: unknown;
  cooking_ability?: unknown;
  difficulty?: unknown;
  rating?: unknown;
  rating_count?: unknown;
  ratingCount?: unknown;
  nutrition?: unknown;
  ingredients?: unknown;
  steps?: unknown;
  step_details?: unknown;
  stepDetails?: unknown;
  story?: unknown;
  tags?: unknown;
  recipe?: unknown;
};

type PassportCompletion = {
  created?: boolean;
  stamp_awarded?: boolean;
  destination?: {
    name?: string;
    dishes_cooked?: number;
    stamp_goal?: number;
  };
};

const FALLBACK_IMAGE = "/landing/journey-discover.jpg";
const DEFAULT_PROGRESS: CookingProgress = {
  version: 1,
  stage: "overview",
  currentStep: 0,
  completedSteps: [],
};

function ArrowIcon({ direction = "right" }: { direction?: "left" | "right" }) {
  return (
    <svg className={direction === "left" ? styles.iconLeft : undefined} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function HeartIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={filled ? styles.heartFilled : undefined}>
      <path d="M20.8 4.7a5.5 5.5 0 0 0-7.8 0L12 5.8l-1.1-1.1a5.5 5.5 0 0 0-7.7 7.8l1 1L12 21l7.8-7.5 1-1a5.5 5.5 0 0 0 0-7.8Z" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 15V3m0 0L8 7m4-4 4 4M6 10H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-1" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2M9 2h6" />
    </svg>
  );
}

function GaugeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M7 15v-3m5 3V8m5 7v-5" />
    </svg>
  );
}

function FlameIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M13.8 2.8c.8 3.7-2.5 4.8-2.1 8.1.7-1.4 1.8-2.2 3-2.7 2.7 2.1 4.3 4.4 4.3 7.1A7 7 0 0 1 5 15.3c0-3.5 2.1-6.7 6.4-9.8.1 2 .7 2.7 1.2 3.2.2-2.3.7-4.1 1.2-5.9Z" />
    </svg>
  );
}

function LeafIcon() {
  return (
    <svg viewBox="0 0 30 30" aria-hidden="true">
      <path d="M6 20C16 20 22 14 24 5c-9 2-15 8-15 17" />
      <path d="M8 23c4-7 8-11 15-16" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path className={styles.playFill} d="m10 8 6 4-6 4Z" />
    </svg>
  );
}

function BasketIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 9h16l-1.5 11h-13L4 9Zm4 0 4-6 4 6M9 13v3m6-3v3" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function stripMarkup(value: string) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function stringValue(value: unknown, fallback = "") {
  if (typeof value === "string") return stripMarkup(value);
  if (typeof value === "number") return String(value);
  return fallback;
}

function numberValue(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function recordValue(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? value as Record<string, unknown> : {};
}

function normalizeIngredient(value: unknown): Ingredient | null {
  if (typeof value === "string") {
    const name = stripMarkup(value);
    return name ? { name, amount: "", unit: "" } : null;
  }

  const ingredient = recordValue(value) as RawIngredient;
  const name = stringValue(ingredient.name);
  if (!name) return null;

  return {
    name,
    amount: stringValue(ingredient.amount),
    unit: stringValue(ingredient.unit),
    image: stringValue(ingredient.image) || undefined,
  };
}

function normalizeStepDetail(value: unknown, index: number, fallbackStep = ""): StepDetail | null {
  const detail = recordValue(value) as RawStepDetail;
  const description = stringValue(detail.description, fallbackStep);
  if (!description) return null;

  return {
    title: stringValue(detail.title, `Step ${index + 1}`),
    description,
    image: stringValue(detail.image) || undefined,
  };
}

function normalizeRecipe(value: unknown, requestedId: string): RecipeData | null {
  const rawValue = recordValue(value) as RawRecipe;
  const nestedRecipe = rawValue.recipe ? recordValue(rawValue.recipe) as RawRecipe : null;
  const raw = nestedRecipe ?? rawValue;
  const title = stringValue(raw.title);
  if (!title) return null;

  const nutritionValue = recordValue(raw.nutrition);
  const nutrition: RecipeNutrition = {
    calories: numberValue(nutritionValue.calories ?? recordValue(raw).calories) || undefined,
    protein: numberValue(nutritionValue.protein) || undefined,
    carbs: numberValue(nutritionValue.carbs) || undefined,
    fat: numberValue(nutritionValue.fat) || undefined,
    fiber: numberValue(nutritionValue.fiber) || undefined,
    sodium: numberValue(nutritionValue.sodium) || undefined,
  };
  const ingredients = Array.isArray(raw.ingredients)
    ? raw.ingredients.map(normalizeIngredient).filter((item): item is Ingredient => Boolean(item))
    : [];
  const steps = Array.isArray(raw.steps)
    ? raw.steps.map((step) => stringValue(step)).filter(Boolean)
    : [];
  const rawDetails = Array.isArray(raw.step_details)
    ? raw.step_details
    : Array.isArray(raw.stepDetails) ? raw.stepDetails : [];
  const stepDetails = rawDetails
    .map((detail, index) => normalizeStepDetail(detail, index, steps[index]))
    .filter((detail): detail is StepDetail => Boolean(detail));
  const completeSteps = steps.length > 0
    ? steps
    : stepDetails.map((step) => step.description);

  return {
    id: stringValue(raw.id, requestedId),
    title,
    description: stringValue(raw.description, "A dish shaped by local ingredients, patient technique, and the table it comes from."),
    image: stringValue(raw.image, FALLBACK_IMAGE),
    cuisine: stringValue(raw.cuisine, "International"),
    country: stringValue(raw.country),
    region: stringValue(raw.region),
    state: stringValue(raw.state) || undefined,
    prepMinutes: numberValue(raw.prep_minutes ?? raw.prepMinutes),
    cookTime: numberValue(raw.cook_time ?? raw.cookTime),
    servings: Math.max(1, Math.round(numberValue(raw.servings, 1))),
    difficulty: stringValue(raw.cooking_ability ?? raw.difficulty, "Medium"),
    rating: numberValue(raw.rating) || undefined,
    ratingCount: numberValue(raw.rating_count ?? raw.ratingCount) || undefined,
    nutrition,
    ingredients,
    steps: completeSteps,
    stepDetails: completeSteps.map((step, index) => (
      stepDetails[index] ?? { title: `Step ${index + 1}`, description: step }
    )),
    story: stringValue(raw.story),
    tags: Array.isArray(raw.tags) ? raw.tags.map((tag) => stringValue(tag)).filter(Boolean) : [],
  };
}

function getHttpStatus(error: unknown) {
  const response = recordValue(recordValue(error).response);
  return numberValue(response.status);
}

function formatNumber(value: number | undefined, unit: string) {
  return value == null ? "—" : `${Math.round(value)} ${unit}`;
}

function formatDuration(minutes: number) {
  const roundedMinutes = Math.round(minutes);
  if (roundedMinutes <= 0) return "Not listed";
  if (roundedMinutes < 60) return `${roundedMinutes} min`;
  const hours = Math.floor(roundedMinutes / 60);
  const remainingMinutes = roundedMinutes % 60;
  return remainingMinutes > 0 ? `${hours} hr ${remainingMinutes} min` : `${hours} hr`;
}

function formatRatingCount(value: number | undefined) {
  if (value == null) return "";
  if (value < 1000) return `${Math.round(value)}`;
  return `${(value / 1000).toFixed(value >= 10_000 ? 0 : 1).replace(/\.0$/, "")}k`;
}

function formatIngredient(ingredient: Ingredient) {
  return [ingredient.amount, ingredient.unit, ingredient.name].filter(Boolean).join(" ");
}

function progressKey(recipeId: string) {
  return `zenplato:recipe-progress:v1:${recipeId}`;
}

function readProgress(recipeId: string): CookingProgress {
  try {
    const saved = JSON.parse(window.localStorage.getItem(progressKey(recipeId)) ?? "null") as Partial<CookingProgress> | null;
    if (!saved || saved.version !== 1) return DEFAULT_PROGRESS;

    return {
      version: 1,
      stage: ["overview", "ingredients", "steps", "complete"].includes(saved.stage ?? "")
        ? saved.stage as CookingStage
        : "overview",
      currentStep: Math.max(0, numberValue(saved.currentStep)),
      completedSteps: Array.isArray(saved.completedSteps)
        ? saved.completedSteps.filter((step): step is number => typeof step === "number" && step >= 0)
        : [],
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

function useCookingProgress(recipeId: string) {
  const [progress, setProgress] = useState<CookingProgress>(DEFAULT_PROGRESS);
  const [loadedFor, setLoadedFor] = useState<string | null>(null);

  useEffect(() => {
    setProgress(readProgress(recipeId));
    setLoadedFor(recipeId);
  }, [recipeId]);

  useEffect(() => {
    if (loadedFor !== recipeId) return;
    window.localStorage.setItem(progressKey(recipeId), JSON.stringify(progress));
  }, [loadedFor, progress, recipeId]);

  return { progress, setProgress, ready: loadedFor === recipeId };
}

async function copyText(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const field = document.createElement("textarea");
  field.value = value;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.opacity = "0";
  document.body.appendChild(field);
  field.select();
  const copied = document.execCommand("copy");
  document.body.removeChild(field);
  if (!copied) throw new Error("Clipboard unavailable");
}

function RecipeImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <img
      className={className}
      src={src || FALLBACK_IMAGE}
      alt={alt}
      onError={(event) => {
        event.currentTarget.onerror = null;
        event.currentTarget.src = FALLBACK_IMAGE;
      }}
    />
  );
}

function RecipeSkeleton() {
  return (
    <div className={styles.page} aria-busy="true" aria-label="Preparing recipe">
      <div className={styles.shell}>
        <div className={`${styles.skeleton} ${styles.skeletonHero}`} />
        <div className={`${styles.skeleton} ${styles.skeletonTitle}`} />
        <div className={`${styles.skeleton} ${styles.skeletonLine}`} />
        <div className={`${styles.skeleton} ${styles.skeletonLineShort}`} />
        <span className={styles.loadingLabel}>Preparing the recipe…</span>
      </div>
    </div>
  );
}

function RecipeError({ kind, onRetry }: { kind: "not-found" | "network"; onRetry: () => void }) {
  const notFound = kind === "not-found";
  return (
    <div className={styles.page}>
      <section className={styles.errorState} aria-labelledby="recipe-error-title">
        <span className={styles.errorMark}><LeafIcon /></span>
        <p className={styles.eyebrow}>{notFound ? "Recipe not found" : "Connection interrupted"}</p>
        <h1 id="recipe-error-title">
          {notFound ? "This plate is no longer on the table." : "We couldn’t bring this recipe in."}
        </h1>
        <p>
          {notFound
            ? "The recipe may have moved or its link may be incomplete. Return to Discover to choose another dish."
            : "Check your connection, then retry without losing your place."}
        </p>
        <div className={styles.errorActions}>
          {notFound ? null : (
            <button type="button" className={styles.primaryAction} onClick={onRetry}>Try again</button>
          )}
          <Link className={styles.secondaryAction} href="/app/explore">Back to Discover</Link>
        </div>
      </section>
    </div>
  );
}

function RouteHeader({
  title,
  onBack,
  onShare,
}: {
  title: string;
  onBack: () => void;
  onShare?: () => void;
}) {
  return (
    <header className={styles.routeHeader}>
      <button type="button" className={styles.roundButton} aria-label="Back to recipe" onClick={onBack}>
        <ArrowIcon direction="left" />
      </button>
      <h1>{title}</h1>
      {onShare ? (
        <button type="button" className={styles.roundButton} aria-label="Share recipe" onClick={onShare}>
          <ShareIcon />
        </button>
      ) : <span aria-hidden="true" />}
    </header>
  );
}

function RecipeTabs({ recipeId, active }: { recipeId: string; active: RecipeExperienceView }) {
  const root = `/app/recipe/${encodeURIComponent(recipeId)}`;
  const items = [
    { label: "Overview", href: root, key: "overview" },
    { label: "Ingredients", href: `${root}/ingredients`, key: "ingredients" },
    { label: "Steps", href: `${root}/steps`, key: "steps" },
    { label: "Nutrition", href: `${root}#nutrition`, key: "nutrition" },
    { label: "Story", href: `${root}#story`, key: "story" },
  ];

  return (
    <nav className={styles.tabs} aria-label="Recipe sections">
      {items.map((item) => (
        <Link
          key={item.key}
          className={item.key === active ? styles.tabActive : undefined}
          aria-current={item.key === active ? "page" : undefined}
          href={item.href}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

function Overview({
  recipe,
  saved,
  progress,
  onBack,
  onSave,
  onShare,
  onStart,
}: {
  recipe: RecipeData;
  saved: boolean;
  progress: CookingProgress;
  onBack: () => void;
  onSave: () => void;
  onShare: () => void;
  onStart: () => void;
}) {
  const destination = getCulinaryDestinationByCuisine(recipe.cuisine);
  const origin = recipe.state || recipe.country || destination?.name || recipe.cuisine;
  const totalTime = recipe.prepMinutes + recipe.cookTime || recipe.cookTime || recipe.prepMinutes;
  const locationLine = [origin, recipe.region && recipe.region !== origin ? recipe.region : ""].filter(Boolean).join(" · ");
  const nutritionItems = [
    ["Calories", formatNumber(recipe.nutrition.calories, "kcal")],
    ["Protein", formatNumber(recipe.nutrition.protein, "g")],
    ["Carbohydrates", formatNumber(recipe.nutrition.carbs, "g")],
    ["Fat", formatNumber(recipe.nutrition.fat, "g")],
    ["Fiber", formatNumber(recipe.nutrition.fiber, "g")],
    ["Sodium", formatNumber(recipe.nutrition.sodium, "mg")],
  ];

  return (
    <>
      <article className={styles.overviewGrid}>
        <div className={styles.hero}>
          <RecipeImage className={styles.heroImage} src={recipe.image} alt={`${recipe.title}, ready to serve`} />
          <div className={styles.heroShade} />
          <div className={styles.heroBar}>
            <button type="button" className={styles.heroButton} aria-label="Back to Discover" onClick={onBack}>
              <ArrowIcon direction="left" />
            </button>
            <div className={styles.heroActions}>
              <button
                type="button"
                className={styles.heroButton}
                aria-label={saved ? `Remove ${recipe.title} from saved recipes` : `Save ${recipe.title}`}
                aria-pressed={saved}
                onClick={onSave}
              >
                <HeartIcon filled={saved} />
              </button>
              <button type="button" className={styles.heroButton} aria-label={`Share ${recipe.title}`} onClick={onShare}>
                <ShareIcon />
              </button>
            </div>
          </div>
          <span className={styles.heroCountry}>{locationLine}</span>
        </div>

        <div className={styles.overviewIntro}>
          <p className={styles.eyebrow}>Discover the plate</p>
          <h1>{recipe.title}</h1>
          <p className={styles.origin}>
            <span>{locationLine || "A recipe from the world table"}</span>
            {recipe.rating ? (
              <span className={styles.rating} aria-label={`${recipe.rating} out of 5${recipe.ratingCount ? ` from ${recipe.ratingCount} ratings` : ""}`}>
                <span aria-hidden="true">★</span> {recipe.rating.toFixed(1)}{recipe.ratingCount ? ` (${formatRatingCount(recipe.ratingCount)})` : ""}
              </span>
            ) : null}
          </p>
          <p className={styles.description}>{recipe.description}</p>

          <dl className={styles.metrics}>
            <div>
              <ClockIcon />
              <dt>Time</dt>
              <dd>{formatDuration(totalTime)}</dd>
            </div>
            <div>
              <GaugeIcon />
              <dt>Difficulty</dt>
              <dd>{recipe.difficulty}</dd>
            </div>
            <div>
              <FlameIcon />
              <dt>Calories</dt>
              <dd>{formatNumber(recipe.nutrition.calories, "kcal")}</dd>
            </div>
          </dl>
        </div>
      </article>

      <RecipeTabs recipeId={recipe.id} active="overview" />

      <section className={styles.editorialSection} aria-labelledby="about-dish-title">
        <p className={styles.sectionNumber}>01</p>
        <div>
          <h2 id="about-dish-title">About this dish</h2>
          <p>{recipe.description}</p>
          {recipe.tags.length > 0 ? (
            <ul className={styles.tagList} aria-label="Recipe qualities">
              {recipe.tags.slice(0, 4).map((tag) => <li key={tag}>{tag}</li>)}
            </ul>
          ) : null}
        </div>
      </section>

      <section id="nutrition" className={styles.editorialSection} aria-labelledby="nutrition-title">
        <p className={styles.sectionNumber}>02</p>
        <div>
          <p className={styles.eyebrow}>Per serving</p>
          <h2 id="nutrition-title">Nutrition</h2>
          <dl className={styles.nutritionGrid}>
            {nutritionItems.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          <p className={styles.finePrint}>Nutritional values are estimates and can vary with ingredient brands and portions.</p>
        </div>
      </section>

      <section id="story" className={styles.storySection} aria-labelledby="story-title">
        <div className={styles.storyMark}><LeafIcon /></div>
        <p className={styles.eyebrow}>From the table</p>
        <h2 id="story-title">The story behind the plate</h2>
        <p>{recipe.story || `${recipe.title} reflects the ingredients and cooking customs associated with ${origin || recipe.cuisine}. Cook it slowly, taste as you go, and make the final plate your own.`}</p>
      </section>

      <div className={styles.actionArea}>
        <button type="button" className={styles.primaryAction} onClick={onStart}>
          <span>{progress.stage === "complete" ? "View Passport" : progress.stage === "overview" ? "Start cooking" : "Continue cooking"}</span>
          <ArrowIcon />
        </button>
      </div>
    </>
  );
}

function IngredientsView({
  recipe,
  onBack,
  onShare,
  onCopyGroceries,
  groceryMessage,
  onViewSteps,
}: {
  recipe: RecipeData;
  onBack: () => void;
  onShare: () => void;
  onCopyGroceries: () => void;
  groceryMessage: string;
  onViewSteps: () => void;
}) {
  return (
    <>
      <RouteHeader title="Ingredients" onBack={onBack} onShare={onShare} />
      <RecipeTabs recipeId={recipe.id} active="ingredients" />
      <div className={styles.subpageIntro}>
        <div>
          <p className={styles.eyebrow}>{recipe.title}</p>
          <p>For {recipe.servings} {recipe.servings === 1 ? "serving" : "servings"}</p>
        </div>
        <button type="button" className={styles.copyButton} onClick={onCopyGroceries}>
          <BasketIcon />
          <span>Copy grocery checklist</span>
        </button>
      </div>

      {groceryMessage ? <p className={styles.inlineStatus} role="status">{groceryMessage}</p> : null}

      {recipe.ingredients.length > 0 ? (
        <ul className={styles.ingredientList} aria-label={`Ingredients for ${recipe.title}`}>
          {recipe.ingredients.map((ingredient, index) => (
            <li key={`${ingredient.name}-${index}`}>
              <span className={styles.ingredientVisual} aria-hidden="true">
                {ingredient.image ? (
                  <RecipeImage src={ingredient.image} alt="" />
                ) : (
                  <LeafIcon />
                )}
              </span>
              <span className={styles.ingredientText}>
                <strong>{ingredient.name}</strong>
                <span>{[ingredient.amount, ingredient.unit].filter(Boolean).join(" ") || "As needed"}</span>
              </span>
              <span className={styles.ingredientIndex} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            </li>
          ))}
        </ul>
      ) : (
        <section className={styles.emptySection}>
          <LeafIcon />
          <h2>Ingredients aren’t listed yet</h2>
          <p>You can still review the available method, but this recipe cannot be added to a grocery checklist.</p>
        </section>
      )}

      <div className={styles.actionArea}>
        <button type="button" className={styles.primaryAction} onClick={onViewSteps} disabled={recipe.steps.length === 0}>
          <span>{recipe.steps.length > 0 ? "View steps" : "Steps unavailable"}</span>
          <ArrowIcon />
        </button>
      </div>
    </>
  );
}

function StepsView({
  recipe,
  progress,
  guided,
  completing,
  completionError,
  onBack,
  onSelectStep,
  onToggleGuided,
  onPrevious,
  onNext,
  onFinish,
}: {
  recipe: RecipeData;
  progress: CookingProgress;
  guided: boolean;
  completing: boolean;
  completionError: string;
  onBack: () => void;
  onSelectStep: (index: number) => void;
  onToggleGuided: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onFinish: () => void;
}) {
  const currentIndex = Math.min(progress.currentStep, Math.max(0, recipe.stepDetails.length - 1));
  const currentStep = recipe.stepDetails[currentIndex];
  const completedCount = new Set(progress.completedSteps).size;
  const atLastStep = currentIndex === recipe.stepDetails.length - 1;
  const isComplete = progress.stage === "complete";

  return (
    <>
      <RouteHeader title="Steps" onBack={onBack} />
      <RecipeTabs recipeId={recipe.id} active="steps" />

      {recipe.stepDetails.length === 0 ? (
        <section className={styles.emptySection}>
          <LeafIcon />
          <h2>The method isn’t available yet</h2>
          <p>This recipe does not include enough information for guided cooking. Return to Discover and choose another plate.</p>
          <Link className={styles.secondaryAction} href="/app/explore">Back to Discover</Link>
        </section>
      ) : (
        <>
          <div className={styles.stepsIntro}>
            <div>
              <p className={styles.eyebrow}>{recipe.title}</p>
              <p>{recipe.stepDetails.length} guided {recipe.stepDetails.length === 1 ? "step" : "steps"}</p>
            </div>
            <div className={styles.progressSummary}>
              <span>{completedCount}/{recipe.stepDetails.length}</span>
              <span>complete</span>
            </div>
          </div>
          <progress className={styles.recipeProgress} max={recipe.stepDetails.length} value={Math.min(completedCount, recipe.stepDetails.length)}>
            {completedCount} of {recipe.stepDetails.length} steps complete
          </progress>

          {guided && currentStep ? (
            <section id="guided-cooking" className={styles.guidedCard} aria-labelledby="guided-step-title">
              <div className={styles.guidedImage}>
                <RecipeImage src={currentStep.image || recipe.image} alt={`Cooking ${recipe.title}: ${currentStep.title}`} />
                <span>Step {currentIndex + 1} of {recipe.stepDetails.length}</span>
              </div>
              <div className={styles.guidedCopy}>
                <p className={styles.eyebrow}>Cook along</p>
                <h2 id="guided-step-title">{currentStep.title}</h2>
                <p>{currentStep.description}</p>
                <div className={styles.guideControls}>
                  <button type="button" className={styles.secondaryAction} onClick={onPrevious} disabled={currentIndex === 0}>
                    Previous
                  </button>
                  {atLastStep ? (
                    <button type="button" className={styles.primaryAction} onClick={onFinish} disabled={completing || isComplete}>
                      {completing ? "Adding to Passport…" : isComplete ? "Added to Passport" : "Finish this plate"}
                    </button>
                  ) : (
                    <button type="button" className={styles.primaryAction} onClick={onNext}>
                      Mark done & continue
                    </button>
                  )}
                </div>
              </div>
            </section>
          ) : null}

          {completionError ? <p className={styles.errorMessage} role="alert">{completionError}</p> : null}

          {isComplete ? (
            <section className={styles.completionCard} aria-labelledby="completion-title">
              <span><CheckIcon /></span>
              <div>
                <p className={styles.eyebrow}>Journey recorded</p>
                <h2 id="completion-title">Your plate is in the Passport.</h2>
                <p>The recipe stays complete on this device, so you can return to it whenever you want.</p>
              </div>
              <Link className={styles.primaryAction} href="/app/passport">View Passport <ArrowIcon /></Link>
            </section>
          ) : null}

          <ol className={styles.stepTimeline} aria-label={`Method for ${recipe.title}`}>
            {recipe.stepDetails.map((step, index) => {
              const done = progress.completedSteps.includes(index) || isComplete;
              const selected = index === currentIndex;
              return (
                <li key={`${step.title}-${index}`} className={selected && guided ? styles.stepSelected : undefined}>
                  <button
                    type="button"
                    className={styles.stepNumber}
                    aria-label={`Open step ${index + 1}: ${step.title}`}
                    aria-current={selected ? "step" : undefined}
                    onClick={() => onSelectStep(index)}
                  >
                    {done ? <CheckIcon /> : index + 1}
                  </button>
                  <button type="button" className={styles.stepCard} onClick={() => onSelectStep(index)}>
                    <span className={styles.stepImage}>
                      <RecipeImage src={step.image || recipe.image} alt="" />
                    </span>
                    <span className={styles.stepCopy}>
                      <strong>{step.title}</strong>
                      <span>{step.description}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          <section className={styles.guideInvitation}>
            <div>
              <p className={styles.eyebrow}>Hands-free alternative</p>
              <h2>{guided ? "Guided cooking is open" : "Cook one step at a time"}</h2>
              <p>There is no recipe video attached, so guided mode keeps the instructions large, focused, and easy to advance while you cook.</p>
            </div>
            <button type="button" className={styles.primaryAction} onClick={onToggleGuided}>
              <span>{guided ? "Close guided mode" : progress.currentStep > 0 ? "Continue guided cooking" : "Start guided cooking"}</span>
              <PlayIcon />
            </button>
          </section>
        </>
      )}
    </>
  );
}

export default function RecipeExperience({ recipeId, view }: { recipeId: string; view: RecipeExperienceView }) {
  const router = useRouter();
  const { user, refresh } = useAuth();
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [requestVersion, setRequestVersion] = useState(0);
  const [guided, setGuided] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [completionError, setCompletionError] = useState("");
  const [groceryMessage, setGroceryMessage] = useState("");
  const [shareMessage, setShareMessage] = useState("");
  const { progress, setProgress, ready: progressReady } = useCookingProgress(recipeId);

  useEffect(() => {
    let active = true;
    setLoadState({ status: "loading" });

    api.get(`/recipes/${encodeURIComponent(recipeId)}`)
      .then(({ data }) => {
        if (!active) return;
        const recipe = normalizeRecipe(data, recipeId);
        setLoadState(recipe ? { status: "ready", recipe } : { status: "error", kind: "not-found" });
      })
      .catch((error: unknown) => {
        if (!active) return;
        const status = getHttpStatus(error);
        const curated = status === 404 ? getCuratedRecipeReference(recipeId) : undefined;
        const curatedRecipe = normalizeRecipe(curated, recipeId);
        setLoadState(curatedRecipe
          ? { status: "ready", recipe: curatedRecipe }
          : { status: "error", kind: status === 404 ? "not-found" : "network" });
      });

    return () => {
      active = false;
    };
  }, [recipeId, requestVersion]);

  useEffect(() => {
    if (!progressReady) return;
    setProgress((current) => {
      if (current.stage === "complete") return current;
      if (view === "steps" && current.stage !== "steps") return { ...current, stage: "steps" };
      if (view === "ingredients" && current.stage === "overview") return { ...current, stage: "ingredients" };
      return current;
    });
  }, [progressReady, setProgress, view]);

  const recipe = loadState.status === "ready" ? loadState.recipe : null;
  const saved = Boolean(user?.saved_recipes?.includes(recipeId));

  const recipeRoot = useMemo(() => `/app/recipe/${encodeURIComponent(recipeId)}`, [recipeId]);

  const handleBack = useCallback(() => {
    if (view !== "overview") {
      router.push(recipeRoot);
      return;
    }

    try {
      const referrer = document.referrer ? new URL(document.referrer) : null;
      if (
        referrer?.origin === window.location.origin
        && referrer.pathname.startsWith("/app/")
        && referrer.pathname !== window.location.pathname
        && window.history.length > 1
      ) {
        router.back();
        return;
      }
    } catch {
      // A malformed referrer should never trap someone on a recipe.
    }
    router.push("/app/explore");
  }, [recipeRoot, router, view]);

  const handleSave = useCallback(async () => {
    try {
      await api.post(`/user/save-recipe/${encodeURIComponent(recipeId)}`);
      await refresh();
      toast.success(saved ? "Removed from saved recipes" : "Saved for later");
    } catch {
      toast.error("We couldn’t update your saved recipes. Try again.");
    }
  }, [recipeId, refresh, saved]);

  const handleShare = useCallback(async () => {
    if (!recipe) return;
    const url = window.location.href;
    setShareMessage("");
    try {
      if (navigator.share) {
        await navigator.share({ title: recipe.title, text: `Cook ${recipe.title} with Zenplato.`, url });
        return;
      }
      await copyText(url);
      toast.success("Recipe link copied");
    } catch (error) {
      if (recordValue(error).name === "AbortError") return;
      setShareMessage(`Sharing is unavailable. Copy this link: ${url}`);
    }
  }, [recipe]);

  const handleCopyGroceries = useCallback(async () => {
    if (!recipe || recipe.ingredients.length === 0) return;
    const list = [
      `${recipe.title} — ingredients`,
      ...recipe.ingredients.map((ingredient) => `• ${formatIngredient(ingredient)}`),
    ].join("\n");
    try {
      await copyText(list);
      setGroceryMessage("Ingredient checklist copied. Weekly-plan grocery syncing is not available yet.");
      toast.success("Grocery checklist copied");
    } catch {
      setGroceryMessage("Grocery syncing is not available yet, and this browser blocked copying. The ingredient list remains above for manual use.");
    }
  }, [recipe]);

  const startCooking = useCallback(() => {
    if (progress.stage === "complete") {
      router.push("/app/passport");
      return;
    }
    const nextView = progress.stage === "steps" ? "steps" : "ingredients";
    setProgress((current) => ({ ...current, stage: nextView }));
    router.push(nextView === "steps" ? `${recipeRoot}/steps` : `${recipeRoot}/ingredients`);
  }, [progress.stage, recipeRoot, router, setProgress]);

  const viewSteps = useCallback(() => {
    setProgress((current) => ({ ...current, stage: "steps" }));
    router.push(`${recipeRoot}/steps`);
  }, [recipeRoot, router, setProgress]);

  const selectStep = useCallback((index: number) => {
    setGuided(true);
    setProgress((current) => ({ ...current, stage: "steps", currentStep: index }));
    window.setTimeout(() => document.getElementById("guided-cooking")?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  }, [setProgress]);

  const previousStep = useCallback(() => {
    setProgress((current) => ({ ...current, currentStep: Math.max(0, current.currentStep - 1) }));
  }, [setProgress]);

  const nextStep = useCallback(() => {
    if (!recipe) return;
    setProgress((current) => ({
      ...current,
      currentStep: Math.min(recipe.steps.length - 1, current.currentStep + 1),
      completedSteps: current.completedSteps.includes(current.currentStep)
        ? current.completedSteps
        : [...current.completedSteps, current.currentStep],
    }));
  }, [recipe, setProgress]);

  const finishCooking = useCallback(async () => {
    if (!recipe || progress.stage === "complete") return;
    setCompleting(true);
    setCompletionError("");
    try {
      const { data } = await api.post(`/passport/complete/${encodeURIComponent(recipeId)}`);
      const completion = recordValue(data).completion as PassportCompletion | undefined;
      setProgress((current) => ({
        ...current,
        stage: "complete",
        completedSteps: recipe.steps.map((_, index) => index),
      }));
      if (completion?.stamp_awarded) {
        toast.success(`${completion.destination?.name || recipe.cuisine} stamp earned`);
      } else if (completion?.created) {
        const destination = completion.destination;
        toast.success(destination?.dishes_cooked != null && destination.stamp_goal != null
          ? `Passport updated · ${destination.dishes_cooked}/${destination.stamp_goal} dishes`
          : "Recipe added to your Passport");
      } else {
        toast.success("This dish is already in your Passport");
      }
    } catch {
      setCompletionError("Your cooking progress is safe on this device, but we couldn’t update the Passport. Try finishing again.");
    } finally {
      setCompleting(false);
    }
  }, [progress.stage, recipe, recipeId, setProgress]);

  if (loadState.status === "loading") return <RecipeSkeleton />;
  if (loadState.status === "error") {
    return <RecipeError kind={loadState.kind} onRetry={() => setRequestVersion((version) => version + 1)} />;
  }

  return (
    <div className={styles.page}>
      <div className={styles.ambient} aria-hidden="true" />
      <div className={styles.shell}>
        {shareMessage ? <p className={styles.shareStatus} role="status">{shareMessage}</p> : null}
        {view === "overview" ? (
          <Overview
            recipe={loadState.recipe}
            saved={saved}
            progress={progress}
            onBack={handleBack}
            onSave={handleSave}
            onShare={handleShare}
            onStart={startCooking}
          />
        ) : view === "ingredients" ? (
          <IngredientsView
            recipe={loadState.recipe}
            onBack={handleBack}
            onShare={handleShare}
            onCopyGroceries={handleCopyGroceries}
            groceryMessage={groceryMessage}
            onViewSteps={viewSteps}
          />
        ) : (
          <StepsView
            recipe={loadState.recipe}
            progress={progress}
            guided={guided}
            completing={completing}
            completionError={completionError}
            onBack={handleBack}
            onSelectStep={selectStep}
            onToggleGuided={() => setGuided((open) => !open)}
            onPrevious={previousStep}
            onNext={nextStep}
            onFinish={finishCooking}
          />
        )}
      </div>
    </div>
  );
}
