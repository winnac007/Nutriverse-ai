"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent } from "react";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  ArrowRightLeft,
  Bookmark,
  Bone,
  BookOpen,
  Brain,
  CalendarDays,
  Check,
  ChevronDown,
  Droplets,
  FileText,
  FileUp,
  Flag,
  Flower2,
  Gauge,
  Heart,
  Leaf,
  Plus,
  Scale,
  Search,
  Shield,
  ShieldOff,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Sprout,
  Stethoscope,
  Sun,
  Trophy,
  X,
  Zap,
  Clock3,
  Flame,
  type LucideIcon,
} from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";
import styles from "./Healthcare.module.css";

type Condition = {
  id: string;
  label: string;
  blurb: string;
  category?: string;
  keywords?: string[];
  icon?: string;
  recipe_count?: number;
};

type HealthcareRecipe = {
  id: string;
  title: string;
  image?: string;
  prep_minutes?: number;
  cook_time?: number;
  meal_type?: MealType;
  nutrition?: { calories?: number };
  nutritional_tags?: string[];
  health_scores?: string[];
  why_this_works_for_condition?: string;
};

type Swap = {
  from: string;
  to: string;
  reason: string;
};

type Streak = {
  current_streak_days?: number;
  meals_this_week?: number;
  distinct_recipes_this_week?: number;
};

type MealType = "breakfast" | "lunch" | "dinner" | "snack";
type MealFilter = "all" | MealType;
type ViewMode = "browse" | "day-plan";

const ICON_MAP: Record<string, LucideIcon> = {
  Activity,
  Bone,
  Brain,
  Droplets,
  Flower2,
  Gauge,
  Heart,
  Leaf,
  Scale,
  Shield,
  ShieldOff,
  Sparkles,
  Sun,
};

const CATEGORY_LABELS: Record<string, string> = {
  metabolic: "Metabolic",
  cardiovascular: "Heart",
  digestive: "Digestive",
  "kidney-liver": "Kidney & liver",
  deficiency: "Deficiencies",
  allergy: "Allergies",
  hormonal: "Hormonal",
  autoimmune: "Autoimmune",
  mental: "Mental wellbeing",
  other: "Other needs",
};

const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024;
const ACCEPTED_DOCUMENT_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp", "image/heic"];
const ACCEPTED_DOCUMENT_EXTENSIONS = ["pdf", "jpg", "jpeg", "png", "webp", "heic"];

const MEAL_TYPES: MealFilter[] = ["all", "breakfast", "lunch", "dinner", "snack"];
const MEAL_ORDER: MealType[] = ["breakfast", "lunch", "dinner", "snack"];
const DAY_PLAN_ORDER: MealType[] = ["breakfast", "lunch", "snack", "dinner"];

const SCORE_STYLES: Record<string, { color: string; background: string; icon: LucideIcon }> = {
  "heart-friendly": { color: "#ef4f6f", background: "#fde7ec", icon: Heart },
  "diabetes-safe": { color: "#3b82f6", background: "#e0ecfd", icon: Activity },
  "thyroid-supportive": { color: "#a855f7", background: "#f1e7fc", icon: Sparkles },
  "pcos-friendly": { color: "#ec4899", background: "#fde4f0", icon: Flower2 },
  "kidney-friendly": { color: "#0891b2", background: "#d6f1f7", icon: Gauge },
  "gut-friendly": { color: "#16a34a", background: "#dcfce7", icon: Leaf },
  "immunity-boost": { color: "#b77900", background: "#fef3c7", icon: Shield },
  "anti-inflammatory": { color: "#0e86b7", background: "#dff2fc", icon: Sparkles },
  "post-surgery-safe": { color: "#64748b", background: "#e2e8f0", icon: Shield },
  "gentle-on-gut": { color: "#16a34a", background: "#dcfce7", icon: Leaf },
};

function HealthScoreBadge({ score }: { score: string }) {
  const scoreStyle = SCORE_STYLES[score] || { color: "#5b554d", background: "#eee9df", icon: Heart };
  const Icon = scoreStyle.icon;
  const badgeStyle = { color: scoreStyle.color, background: scoreStyle.background };
  return <span className={styles.healthBadge} style={badgeStyle}><Icon /> {score.replaceAll("-", " ")}</span>;
}

function HealthIntake({ onContinue }: { onContinue: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [document, setDocument] = useState<File | null>(null);
  const [documentError, setDocumentError] = useState("");

  const chooseDocument = (file: File | undefined) => {
    setDocumentError("");
    if (!file) return;
    const extension = file.name.split(".").pop()?.toLowerCase() || "";
    if (!ACCEPTED_DOCUMENT_TYPES.includes(file.type) && !ACCEPTED_DOCUMENT_EXTENSIONS.includes(extension)) {
      setDocumentError("Choose a PDF, JPG, PNG, WEBP or HEIC file.");
      return;
    }
    if (file.size > MAX_DOCUMENT_SIZE) {
      setDocumentError("Choose a file smaller than 10 MB.");
      return;
    }
    setDocument(file);
  };

  const clearDocument = () => {
    setDocument(null);
    setDocumentError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <section className={styles.intake} aria-labelledby="health-intake-title">
      <header className={styles.intakeHeader}>
        <p className={styles.overline}>Personalise your care</p>
        <h1 id="health-intake-title">Start with what you know</h1>
        <p>Add a report, diagnosis or other health document if you have one. This step is optional.</p>
      </header>

      <div className={styles.intakeLayout}>
        <div className={styles.documentPanel}>
          <div className={styles.documentHeading}>
            <span><FileText aria-hidden="true" /></span>
            <div>
              <h2>Share a health document</h2>
              <p>Lab report, prescription, diagnosis or discharge summary</p>
            </div>
            <small>Optional</small>
          </div>

          {document ? (
            <div className={styles.selectedDocument}>
              <span><Check aria-hidden="true" /></span>
              <div>
                <strong>{document.name}</strong>
                <small>{(document.size / 1024 / 1024).toFixed(1)} MB selected</small>
              </div>
              <button type="button" onClick={clearDocument} aria-label={`Remove ${document.name}`}>
                <X aria-hidden="true" />
              </button>
            </div>
          ) : (
            <label className={styles.documentPicker}>
              <FileUp aria-hidden="true" />
              <span>
                <strong>Choose a document</strong>
                <small>PDF or image, up to 10 MB</small>
              </span>
              <input
                ref={inputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp,.heic,application/pdf,image/jpeg,image/png,image/webp,image/heic"
                onChange={(event) => chooseDocument(event.target.files?.[0])}
                aria-describedby={documentError ? "document-privacy document-error" : "document-privacy"}
                aria-invalid={Boolean(documentError)}
              />
            </label>
          )}

          <p className={styles.documentPrivacy} id="document-privacy">
            Your file stays on this device for now. It is not uploaded or stored by Nutriverse.
          </p>
          {documentError ? <p className={styles.documentError} id="document-error" role="alert">{documentError}</p> : null}

          <button className={styles.continueButton} type="button" onClick={onContinue}>
            Continue to conditions <span>→</span>
          </button>
        </div>

        <aside className={styles.diagnosisHelp}>
          <span className={styles.diagnosisIcon}><Stethoscope aria-hidden="true" /></span>
          <p className={styles.overline}>Not sure of the diagnosis?</p>
          <h2>Get clarity from a professional</h2>
          <p>A consultant can review your symptoms and guide you toward the right next step.</p>
          <Link href="/app/consult?category=healthcare&reason=diagnosis">
            Find a consultant <span>→</span>
          </Link>
        </aside>
      </div>
    </section>
  );
}

function ConditionPicker({
  conditions,
  onPick,
  onPickCustom,
  onBack,
}: {
  conditions: Condition[];
  onPick: (condition: Condition) => void;
  onPickCustom: (condition: string) => void;
  onBack: () => void;
}) {
  const [conditionSearch, setConditionSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [customCondition, setCustomCondition] = useState("");

  const categories = useMemo(
    () => Array.from(new Set(conditions.map((condition) => condition.category).filter((value): value is string => Boolean(value)))),
    [conditions],
  );

  const filteredConditions = useMemo(() => {
    const query = conditionSearch.trim().toLowerCase();
    return conditions.filter((condition) => {
      const matchesCategory = category === "all" || condition.category === category;
      const searchable = [condition.label, condition.blurb, condition.category, ...(condition.keywords || [])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return matchesCategory && (!query || searchable.includes(query));
    });
  }, [category, conditionSearch, conditions]);

  const submitCustomCondition = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = customCondition.trim();
    if (value) onPickCustom(value);
  };

  return (
    <section className={styles.picker}>
      <header className={styles.pageHeader}>
        <button className={styles.changeCondition} type="button" onClick={onBack}>← Back to health details</button>
        <p className={styles.overline}>Recommended for</p>
        <h1>Pick your focus</h1>
        <p>Search for a condition or browse by health area. We will tailor meals to the focus you choose.</p>
      </header>

      <div className={styles.conditionTools}>
        <div className={styles.conditionSearch}>
          <Search aria-hidden="true" />
          <input
            type="search"
            value={conditionSearch}
            onChange={(event) => setConditionSearch(event.target.value)}
            placeholder="Search diabetes, thyroid, blood pressure..."
            aria-label="Search health conditions"
          />
          {conditionSearch ? (
            <button type="button" onClick={() => setConditionSearch("")} aria-label="Clear condition search"><X aria-hidden="true" /></button>
          ) : null}
        </div>

        <div className={styles.categoryFilters} aria-label="Filter conditions by health area">
          <button type="button" className={category === "all" ? styles.activeCategory : ""} aria-pressed={category === "all"} onClick={() => setCategory("all")}>All</button>
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              className={category === item ? styles.activeCategory : ""}
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
            >
              {CATEGORY_LABELS[item] || item.replaceAll("-", " ")}
            </button>
          ))}
        </div>

        <p className={styles.resultCount} aria-live="polite">
          {filteredConditions.length} {filteredConditions.length === 1 ? "condition" : "conditions"}
        </p>
      </div>

      {filteredConditions.length ? (
        <div className={styles.conditionGrid}>
          {filteredConditions.map((condition, index) => {
          const Icon = ICON_MAP[condition.icon || ""] || Heart;
          const entranceStyle = { "--condition-delay": `${index * 40}ms` } as CSSProperties;
          return (
            <button
              key={condition.id}
              className={styles.conditionCard}
              style={entranceStyle}
              type="button"
              onClick={() => onPick(condition)}
            >
              <span className={styles.conditionIcon}><Icon /></span>
              <strong>{condition.label}</strong>
              <span className={styles.conditionBlurb}>{condition.blurb}</span>
              <span className={styles.recipeCount}>{condition.recipe_count || 0} recipes</span>
            </button>
          );
          })}
        </div>
      ) : (
        <div className={styles.conditionEmpty}>
          <Search aria-hidden="true" />
          <strong>No listed condition matches “{conditionSearch}”</strong>
          <p>You can enter the diagnosis yourself below.</p>
        </div>
      )}

      <form className={styles.otherCondition} onSubmit={submitCustomCondition}>
        <span className={styles.otherIcon}><Plus aria-hidden="true" /></span>
        <div>
          <p className={styles.overline}>Something else?</p>
          <h2>Enter another condition</h2>
          <p>If your diagnosis is not listed, type it exactly as it appears in your report.</p>
        </div>
        <div className={styles.otherField}>
          <input
            value={customCondition}
            onChange={(event) => setCustomCondition(event.target.value)}
            placeholder="Type your condition"
            maxLength={80}
            aria-label="Other condition or diagnosis"
          />
          <button type="submit" disabled={!customCondition.trim()}>Use this condition</button>
        </div>
      </form>
    </section>
  );
}

function StreakCard({ streak }: { streak: Streak }) {
  const stats = [
    { value: streak.current_streak_days || 0, label: "Day streak", icon: Trophy, tone: styles.goldStat },
    { value: streak.meals_this_week || 0, label: "Meals this week", icon: Flag, tone: styles.greenStat },
    { value: streak.distinct_recipes_this_week || 0, label: "Recipes tried", icon: BookOpen, tone: styles.blueStat },
  ];

  return (
    <section className={styles.streakCard} aria-label="Healthcare streak">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label}>
            <span className={`${styles.statIcon} ${stat.tone}`}><Icon /></span>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        );
      })}
    </section>
  );
}

function RecipeCard({ recipe }: { recipe: HealthcareRecipe }) {
  const scores = recipe.health_scores || [];
  const tags = recipe.nutritional_tags || [];
  const time = recipe.prep_minutes || recipe.cook_time || 30;

  return (
    <Link className={styles.recipeCard} href={`/app/recipe/${recipe.id}`}>
      <span className={styles.recipeImage}>
        <img
          src={recipe.image || "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80"}
          alt=""
          loading="lazy"
        />
        {time <= 15 ? <span className={styles.quickBadge}><Zap /> {time}-min</span> : null}
      </span>
      <span className={styles.recipeBody}>
        <strong>{recipe.title}</strong>
        <span className={styles.recipeMeta}>
          <span><Clock3 /> {time}m</span>
          <span><Flame /> {recipe.nutrition?.calories || 0} kcal</span>
        </span>
        <span className={styles.tags}>
          {scores.slice(0, 2).map((score) => <HealthScoreBadge key={score} score={score} />)}
          {tags.slice(0, 2).map((tag) => <span className={styles.tag} key={tag}>{tag}</span>)}
        </span>
        {recipe.why_this_works_for_condition ? (
          <span className={styles.why}><b>Why it works:</b> {recipe.why_this_works_for_condition}</span>
        ) : null}
      </span>
    </Link>
  );
}

function FocusSprig() {
  return (
    <svg viewBox="0 0 24 24" className={styles.focusSprig} fill="none" aria-hidden="true">
      <path d="M4 20C8 15 12 11 20 4" stroke="#8A987D" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="14" cy="9" r="2.2" fill="#99A88E" />
      <circle cx="17" cy="6" r="2.2" fill="#88987D" />
      <circle cx="10" cy="13" r="2" fill="#AAB99F" />
    </svg>
  );
}

function GuideSparkle() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C12 7.5 7.5 12 2 12C7.5 12 12 16.5 12 22C12 16.5 16.5 12 22 12C16.5 12 12 7.5 12 2Z" fill="currentColor" fillOpacity="0.12" />
      <circle cx="18" cy="5.5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="5.5" cy="18.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

type FocusCardConfig = {
  id: string;
  conditionKey: string;
  title: string;
  blurb: string;
  count: string;
  icon: LucideIcon;
  image: string;
};

const FOCUS_CARDS: FocusCardConfig[] = [
  {
    id: "cholesterol",
    conditionKey: "high-cholesterol",
    title: "Cholesterol",
    blurb: "Heart health & lipid balance.",
    count: "6 recipes",
    icon: Heart,
    image: "/app-ui/focus-cholesterol.png",
  },
  {
    id: "diabetes",
    conditionKey: "diabetes",
    title: "Diabetes",
    blurb: "Stable blood sugar & better control.",
    count: "5 recipes",
    icon: Activity,
    image: "/app-ui/focus-diabetes.png",
  },
  {
    id: "thyroid",
    conditionKey: "thyroid",
    title: "Thyroid",
    blurb: "Support metabolism & energy.",
    count: "4 recipes",
    icon: Sparkles,
    image: "/app-ui/focus-thyroid.png",
  },
  {
    id: "pcos",
    conditionKey: "pcos",
    title: "PCOS",
    blurb: "Hormonal balance & menstrual health.",
    count: "3 recipes",
    icon: Flower2,
    image: "/app-ui/focus-pcos.png",
  },
];

type PopularRecipe = {
  id: string;
  title: string;
  time: string;
  calories: number;
  image: string;
  href: string;
};

const POPULAR_HEALTHCARE_RECIPES: PopularRecipe[] = [
  {
    id: "pop-dal",
    title: "Turmeric Ginger Lentil Dal",
    time: "10 min",
    calories: 220,
    image: "/app-ui/pop-dal.png",
    href: "/app/meals?search=lentil",
  },
  {
    id: "pop-salmon",
    title: "Lemon Herb Grilled Salmon",
    time: "15 min",
    calories: 320,
    image: "/app-ui/pop-salmon.png",
    href: "/app/meals?search=salmon",
  },
  {
    id: "pop-bowl",
    title: "Quinoa Power Bowl",
    time: "12 min",
    calories: 280,
    image: "/app-ui/pop-bowl.png",
    href: "/app/meals?search=quinoa",
  },
];

function PopularRecipeCard({ recipe }: { recipe: PopularRecipe }) {
  const [saved, setSaved] = useState(false);

  return (
    <div className={styles.popCard}>
      <Link href={recipe.href} className={styles.popImageWrapper}>
        <img src={recipe.image} alt={recipe.title} className={styles.popImage} loading="lazy" />
        <span className={styles.popTimeBadge}>
          <Zap /> {recipe.time}
        </span>
      </Link>
      <div className={styles.popBody}>
        <Link href={recipe.href} style={{ textDecoration: "none", color: "inherit" }}>
          <h4 className={styles.popTitle}>{recipe.title}</h4>
        </Link>
        <div className={styles.popBottomRow}>
          <div className={styles.popMeta}>
            <span className={styles.popMetaItem}>
              <Clock3 /> {recipe.time.replace(" min", "m")}
            </span>
            <span className={styles.popMetaItem}>
              <Flame /> {recipe.calories} kcal
            </span>
          </div>
          <button
            type="button"
            className={`${styles.popBookmarkBtn} ${saved ? styles.popBookmarkBtnActive : ""}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSaved((prev) => !prev);
            }}
            aria-label={saved ? "Remove bookmark" : "Bookmark recipe"}
          >
            <Bookmark fill={saved ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
    </div>
  );
}

function HeroSprig() {
  return (
    <svg viewBox="0 0 54 32" className={styles.hubTitleSprig} fill="none" aria-hidden="true">
      <path d="M4 28C16 23 28 16 48 5" stroke="#8A9A7B" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M19 22C17 17 21 14 26 15C25 20 22 22 19 22Z" fill="#99A88E" stroke="#8A9A7B" strokeWidth="1" />
      <path d="M30 17C30 11 35 9 39 10C38 15 34 17 30 17Z" fill="#99A88E" stroke="#8A9A7B" strokeWidth="1" />
      <path d="M39 12C38 7 43 4 47 6C46 11 42 13 39 12Z" fill="#88987D" stroke="#8A9A7B" strokeWidth="1" />
      <circle cx="12" cy="25" r="1.8" fill="#AAB99F" />
      <circle cx="23" cy="18" r="1.6" fill="#88987D" />
      <circle cx="34" cy="13" r="1.6" fill="#99A88E" />
    </svg>
  );
}

type BenefitItem = {
  icon: LucideIcon;
  line1: string;
  line2: string;
};

const CONDITION_BENEFITS: Record<string, BenefitItem[]> = {
  cholesterol: [
    { icon: Heart, line1: "Support heart", line2: "health" },
    { icon: Droplets, line1: "Maintain healthy", line2: "lipid levels" },
    { icon: Shield, line1: "Reduce risk", line2: "factors" },
  ],
  "high-cholesterol": [
    { icon: Heart, line1: "Support heart", line2: "health" },
    { icon: Droplets, line1: "Maintain healthy", line2: "lipid levels" },
    { icon: Shield, line1: "Reduce risk", line2: "factors" },
  ],
  diabetes: [
    { icon: Activity, line1: "Stable blood", line2: "sugar levels" },
    { icon: Shield, line1: "Low glycemic", line2: "impact meals" },
    { icon: Zap, line1: "Sustained daily", line2: "energy release" },
  ],
  thyroid: [
    { icon: Sparkles, line1: "Support metabolism", line2: "& energy" },
    { icon: Droplets, line1: "Selenium & zinc", line2: "rich nutrients" },
    { icon: Leaf, line1: "Target cellular", line2: "inflammation" },
  ],
  pcos: [
    { icon: Flower2, line1: "Hormonal balance", line2: "& insulin" },
    { icon: Shield, line1: "Anti-inflammatory", line2: "whole foods" },
    { icon: Heart, line1: "Support ovarian", line2: "wellness" },
  ],
};

const DEFAULT_BENEFITS: BenefitItem[] = [
  { icon: Heart, line1: "Support overall", line2: "vitality" },
  { icon: Droplets, line1: "Maintain balanced", line2: "nutrition" },
  { icon: Shield, line1: "Reduce health", line2: "risk factors" },
];

type HubCuratedRecipe = {
  id: string;
  title: string;
  image: string;
  time: string;
  minutes: number;
  calories: number;
  meal_type: MealType;
  tags: { label: string; type: "heart" | "fiber" | "fat" | "omega" | "default" }[];
  href: string;
};

const CURATED_HUB_RECIPES: Record<string, HubCuratedRecipe[]> = {
  cholesterol: [
    {
      id: "hub-rec-toast",
      title: "Avocado Egg Toast with Flax Seeds",
      image: "/app-ui/hub-toast.png",
      time: "8 min",
      minutes: 8,
      calories: 210,
      meal_type: "breakfast",
      tags: [
        { label: "heart friendly", type: "heart" },
        { label: "high-fiber", type: "fiber" },
      ],
      href: "/app/recipe/spinach-egg-scramble",
    },
    {
      id: "hub-rec-khichdi",
      title: "Moong Dal Khichdi with Vegetables",
      image: "/app-ui/hub-khichdi.png",
      time: "15 min",
      minutes: 15,
      calories: 280,
      meal_type: "lunch",
      tags: [
        { label: "low fat", type: "fat" },
        { label: "high-fiber", type: "fiber" },
      ],
      href: "/app/recipe/hub-rec-khichdi",
    },
    {
      id: "hub-rec-salmon",
      title: "Lemon Herb Grilled Salmon",
      image: "/app-ui/hub-salmon.png",
      time: "12 min",
      minutes: 12,
      calories: 320,
      meal_type: "dinner",
      tags: [
        { label: "omega-3 rich", type: "omega" },
        { label: "heart friendly", type: "heart" },
      ],
      href: "/app/recipe/hub-rec-salmon",
    },
  ],
};

export default function HealthcareClient() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const conditionId = searchParams.get("c");
  const customConditionName = searchParams.get("name")?.trim() || "";
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [recipes, setRecipes] = useState<HealthcareRecipe[]>([]);
  const [swaps, setSwaps] = useState<Swap[]>([]);
  const [streak, setStreak] = useState<Streak | null>(null);
  const [search, setSearch] = useState("");
  const [mealType, setMealType] = useState<MealFilter>("all");
  const [view, setView] = useState<ViewMode>("browse");
  const [quick, setQuick] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAllPicker, setShowAllPicker] = useState(false);
  const [showIntake, setShowIntake] = useState(false);
  const [savedBookmarks, setSavedBookmarks] = useState<Set<string>>(new Set());

  const toggleBookmark = (id: string) => {
    setSavedBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const conditionKey = conditionId?.toLowerCase() || "";
  const baseCurated =
    conditionKey.includes("cholesterol") || !CURATED_HUB_RECIPES[conditionKey]
      ? CURATED_HUB_RECIPES.cholesterol
      : CURATED_HUB_RECIPES[conditionKey] || CURATED_HUB_RECIPES.cholesterol;

  const curatedToDisplay = useMemo(() => {
    return baseCurated.filter((item) => {
      if (mealType !== "all" && item.meal_type !== mealType) return false;
      if (quick && item.minutes > 15) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesTag = item.tags.some((t) => t.label.toLowerCase().includes(q));
        if (!matchesTitle && !matchesTag) return false;
      }
      return true;
    });
  }, [baseCurated, mealType, quick, search]);

  const activeBenefits = useMemo(() => {
    const key = conditionId?.toLowerCase() || "";
    if (key.includes("cholesterol")) return CONDITION_BENEFITS.cholesterol;
    if (CONDITION_BENEFITS[key]) return CONDITION_BENEFITS[key];
    return DEFAULT_BENEFITS;
  }, [conditionId]);

  const streakDays = streak?.current_streak_days ?? 2;
  const streakCircumference = 2 * Math.PI * 30;
  const streakOffset = streakCircumference * (1 - Math.min(Math.max(streakDays / 7, 0.15), 1));

  const condition = useMemo(
    () => conditionId === "custom" && customConditionName
      ? { id: "custom", label: customConditionName, blurb: "Thoughtful recipes selected around the condition you shared." }
      : conditions.find((item) => item.id === conditionId),
    [conditions, conditionId, customConditionName],
  );

  useEffect(() => {
    let active = true;
    const loadOverview = async () => {
      const [conditionsResult, streakResult] = await Promise.allSettled([
        api.get<Condition[]>("/healthcare/conditions/all"),
        user ? api.get<Streak>("/healthcare/streak") : Promise.resolve(null),
      ]);
      if (!active) return;
      if (conditionsResult.status === "fulfilled") setConditions(conditionsResult.value.data);
      if (streakResult.status === "fulfilled" && streakResult.value) setStreak(streakResult.value.data);
      setLoading(false);
    };
    void loadOverview();
    return () => { active = false; };
  }, [user]);

  useEffect(() => {
    if (!conditionId) {
      setRecipes([]);
      setSwaps([]);
      return;
    }

    let active = true;
    const loadCondition = async () => {
      setLoading(true);
      const params: Record<string, string | boolean> = { condition: customConditionName || conditionId };
      if (mealType !== "all") params.meal_type = mealType;
      if (search.trim()) params.search = search.trim();
      if (quick) params.quick = true;

      const [recipesResult, swapsResult] = await Promise.allSettled([
        api.get<HealthcareRecipe[]>("/healthcare/recipes", { params }),
        api.get<Swap[]>("/healthcare/swaps", { params: { condition: customConditionName || conditionId } }),
      ]);
      if (!active) return;
      setRecipes(recipesResult.status === "fulfilled" ? recipesResult.value.data : []);
      setSwaps(swapsResult.status === "fulfilled" ? swapsResult.value.data : []);
      setLoading(false);
    };

    const timeout = window.setTimeout(() => void loadCondition(), search ? 220 : 0);
    return () => {
      active = false;
      window.clearTimeout(timeout);
    };
  }, [conditionId, customConditionName, mealType, quick, search]);

  const grouped = useMemo(() => {
    const groups: Record<MealType, HealthcareRecipe[]> = { breakfast: [], lunch: [], dinner: [], snack: [] };
    recipes.forEach((recipe) => groups[recipe.meal_type || "lunch"].push(recipe));
    return groups;
  }, [recipes]);

  const pickCondition = (next: Condition) => {
    setMealType("all");
    setSearch("");
    router.replace(`/app/healthcare?c=${encodeURIComponent(next.id)}`, { scroll: false });
  };

  const pickCustomCondition = (name: string) => {
    setMealType("all");
    setSearch("");
    router.replace(`/app/healthcare?c=custom&name=${encodeURIComponent(name)}`, { scroll: false });
  };

  const clearCondition = () => {
    setMealType("all");
    setSearch("");
    router.replace("/app/healthcare", { scroll: false });
  };

  return (
    <div className={styles.page}>
      {!conditionId && (
        <Link className={styles.backLink} href="/app"><ArrowLeft /> Home</Link>
      )}

      {!conditionId && showIntake ? (
        <HealthIntake onContinue={() => { setShowIntake(false); setShowAllPicker(true); }} />
      ) : !conditionId && showAllPicker ? (
        <>
          <button
            type="button"
            className={styles.backLink}
            style={{ border: "none", background: "none", cursor: "pointer", padding: 0 }}
            onClick={() => setShowAllPicker(false)}
          >
            <ArrowLeft /> Back to recommended focus
          </button>
          {loading ? (
            <div className={styles.loadingState}>Preparing your health library…</div>
          ) : (
            <ConditionPicker
              conditions={conditions}
              onPick={pickCondition}
              onPickCustom={pickCustomCondition}
              onBack={() => setShowAllPicker(false)}
            />
          )}
          {streak && (streak.meals_this_week || 0) > 0 ? <StreakCard streak={streak} /> : null}
        </>
      ) : !conditionId ? (
        <>
          {/* 1. Hero with Top-Right Botanical Visual */}
          <section className={styles.hero} aria-label="Pick your focus">
            <div className={styles.heroContent}>
              <span className={styles.overline}>RECOMMENDED FOR YOU</span>
              <h1 className={styles.heroTitle}>Pick your focus</h1>
              <p className={styles.heroSubtitle}>
                Every meal we suggest will be tailored to your selected condition — with the science of why it works.
              </p>
            </div>
            <div className={styles.heroPlantWrapper} aria-hidden="true">
              <img
                src="/app-ui/hero-plant-blended.png"
                alt=""
                className={styles.heroPlant}
                loading="eager"
              />
            </div>
          </section>

          {/* 2. Condition Focus Cards (2x2 Grid) */}
          <div className={styles.focusGrid}>
            {FOCUS_CARDS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className={styles.focusCard}
                  onClick={() => {
                    const matched = conditions.find(
                      (c) =>
                        c.id === item.conditionKey ||
                        c.id === item.id ||
                        c.label.toLowerCase().includes(item.id)
                    );
                    pickCondition(
                      matched || {
                        id: item.conditionKey,
                        label: item.title,
                        blurb: item.blurb,
                      }
                    );
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      const matched = conditions.find(
                        (c) =>
                          c.id === item.conditionKey ||
                          c.id === item.id ||
                          c.label.toLowerCase().includes(item.id)
                      );
                      pickCondition(
                        matched || {
                          id: item.conditionKey,
                          label: item.title,
                          blurb: item.blurb,
                        }
                      );
                    }
                  }}
                >
                  <div className={styles.focusContent}>
                    <div className={styles.focusTopRow}>
                      <span className={styles.focusIconBadge}>
                        <Icon />
                      </span>
                      <FocusSprig />
                    </div>
                    <h3 className={styles.focusTitle}>{item.title}</h3>
                    <p className={styles.focusBlurb}>{item.blurb}</p>
                    <div className={styles.focusDivider} />
                    <span className={styles.focusCount}>{item.count}</span>
                  </div>
                  <div className={styles.focusDishWrapper} aria-hidden="true">
                    <img src={item.image} alt="" className={styles.focusDishImg} loading="lazy" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* 3. Quiz Banner */}
          <div className={styles.quizCard}>
            <span className={styles.quizBadge} aria-hidden="true">
              <GuideSparkle />
            </span>
            <div className={styles.quizText}>
              <h3>Not sure what to choose?</h3>
              <p>Take our quick quiz and let Zenplato suggest what fits you best.</p>
            </div>
            <Link href="/onboarding/conditions" className={styles.quizBtn}>
              <span>Take quiz</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Marketplace Banner */}
          <div className={styles.quizCard} style={{ background: "#FAF7F2", borderColor: "#E8E2D6" }}>
            <span className={styles.quizBadge} style={{ background: "#DCEEE7", color: "#275242" }} aria-hidden="true">
              <ShoppingBag size={18} />
            </span>
            <div className={styles.quizText}>
              <h3>Healthcare Marketplace</h3>
              <p>Explore doctor-inspired kits &amp; Ayurvedic essentials for your focus.</p>
            </div>
            <Link href="/app/marketplace" className={styles.quizBtn} style={{ background: "#374B33" }}>
              <span>Shop kits</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* 4. Popular Right Now (3-Card Rail) */}
          <section className={styles.popularSection} aria-label="Popular recipes">
            <div className={styles.sectionHeader}>
              <h2>Popular right now</h2>
              <Link href="/app/meals" className={styles.sectionAction}>
                View all <ArrowRight />
              </Link>
            </div>
            <div className={styles.popularGrid}>
              {POPULAR_HEALTHCARE_RECIPES.map((recipe) => (
                <PopularRecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </section>

          {/* 5. Motivational Bottom Action Banner */}
          <section className={styles.bottomBanner} aria-label="Motivational prompt">
            <div className={styles.bannerLeft}>
              <img
                src="/app-ui/botanical-branch-icon.png"
                alt=""
                className={styles.bannerIcon}
                loading="lazy"
              />
              <p className={styles.bannerCopy}>
                <span>Small choices today,</span>
                <span>powerful changes tomorrow.</span>
              </p>
            </div>
            <Link href="/app/track" className={styles.logMealBtn}>
              <span>Log your meal</span>
              <Sprout />
            </Link>
          </section>
        </>
      ) : (
        <div className={styles.conditionHub}>
          {/* Top Nav: Back & Change condition */}
          <div className={styles.hubTopNav}>
            <button className={styles.hubBackBtn} type="button" onClick={clearCondition}>
              <ArrowLeft />
              <span>Back</span>
            </button>
            <button className={styles.hubChangeBtn} type="button" onClick={clearCondition}>
              <ArrowRightLeft />
              <span>Change condition</span>
            </button>
          </div>

          {/* Hero: Overline, Title with Sprig, Subtitle, Dish Visual */}
          <header className={styles.hubHero} aria-label={condition?.label || "Cholesterol"}>
            <div className={styles.hubHeroContent}>
              <span className={styles.hubOverline}>MEALS RECOMMENDED FOR</span>
              <div className={styles.hubTitleRow}>
                <h1 className={styles.hubTitle}>{condition?.label || "Cholesterol"}</h1>
                <HeroSprig />
              </div>
              <p className={styles.hubSubtitle}>
                {condition?.blurb || "Heart health & lipid balance."}
              </p>
            </div>
            <div className={styles.hubDishWrapper} aria-hidden="true">
              <img
                src="/app-ui/hub-header-dish.png"
                alt=""
                className={styles.hubDishImg}
                loading="eager"
              />
            </div>
          </header>

          {/* 3 Benefit Chips */}
          <div className={styles.hubBenefitChips} aria-label="Condition benefits">
            {activeBenefits.map((b, idx) => {
              const Icon = b.icon;
              return (
                <div key={idx} className={styles.hubBenefitChip}>
                  <div className={styles.benefitIconCircle}>
                    <Icon />
                  </div>
                  <div className={styles.benefitText}>
                    <span>{b.line1}</span>
                    <span>{b.line2}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Search Input with Filter Sliders Icon */}
          <div className={styles.hubSearchContainer}>
            <Search className={styles.hubSearchIcon} size={18} />
            <input
              type="text"
              className={styles.hubSearchInput}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search within ${condition?.label?.toLowerCase() || "cholesterol"} meals...`}
              aria-label="Search recipes"
            />
            <button
              type="button"
              className={styles.hubFilterBtn}
              aria-label="Filter settings"
              onClick={() => setQuick((q) => !q)}
            >
              <SlidersHorizontal size={15} />
            </button>
          </div>

          {/* Filter Toggle Pills: Browse recipes, Day meal plan, 15-min quick meals */}
          <div className={styles.hubFilterRow} role="toolbar" aria-label="View and filter options">
            <button
              type="button"
              className={`${styles.hubFilterPill} ${view === "browse" ? styles.hubFilterPillActive : ""}`}
              onClick={() => setView("browse")}
            >
              <BookOpen size={14} />
              <span>Browse recipes</span>
            </button>
            <button
              type="button"
              className={`${styles.hubFilterPill} ${view === "day-plan" ? styles.hubFilterPillActive : ""}`}
              onClick={() => setView("day-plan")}
            >
              <CalendarDays size={14} />
              <span>Day meal plan</span>
            </button>
            <button
              type="button"
              className={`${styles.hubFilterPill} ${quick ? styles.hubFilterPillActive : ""}`}
              onClick={() => setQuick((prev) => !prev)}
            >
              <Zap size={14} />
              <span>15-min quick meals</span>
            </button>
          </div>

          {/* "Your progress" Card */}
          <section className={styles.hubProgressCard} aria-label="Your progress">
            <div className={styles.progressDialWrapper}>
              <svg className={styles.progressDialSvg} viewBox="0 0 76 76" aria-hidden="true">
                <circle
                  className={styles.dialTrack}
                  cx="38"
                  cy="38"
                  r="30"
                  strokeWidth="5.5"
                />
                <circle
                  className={styles.dialProgress}
                  cx="38"
                  cy="38"
                  r="30"
                  strokeWidth="5.5"
                  strokeDasharray={streakCircumference}
                  strokeDashoffset={streakOffset}
                />
              </svg>
              <div className={styles.dialCenter}>
                <span className={styles.dialValue}>{streak?.current_streak_days ?? 2}</span>
                <span className={styles.dialLabel}>DAY STREAK</span>
              </div>
            </div>

            <div className={styles.progressStatsCol}>
              <div className={styles.progressStatItem}>
                <Flag size={14} className={styles.progressStatIcon} />
                <span className={styles.progressStatValue}>{streak?.meals_this_week ?? 6}</span>
                <span className={styles.progressStatName}>MEALS THIS WEEK</span>
              </div>
              <div className={styles.progressStatItem}>
                <BookOpen size={14} className={styles.progressStatIcon} />
                <span className={styles.progressStatValue}>{streak?.distinct_recipes_this_week ?? 8}</span>
                <span className={styles.progressStatName}>RECIPES TRIED</span>
              </div>
            </div>

            <div className={styles.progressDivider} aria-hidden="true" />

            <div className={styles.progressInsightsCol}>
              <h4 className={styles.progressInsightsTitle}>Your progress</h4>
              <p className={styles.progressInsightsBlurb}>
                Great start! Consistency is the key to heart health.
              </p>
              <Link href="/app/progress" className={styles.progressInsightsLink}>
                <span>View insights</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </section>

          {view === "browse" ? (
            <>
              {/* Category Tabs & Sort Dropdown */}
              <div className={styles.hubCategoryRow}>
                <div className={styles.hubCategoryTabs} role="tablist" aria-label="Meal categories">
                  {MEAL_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      role="tab"
                      aria-selected={mealType === type}
                      className={`${styles.hubCategoryPill} ${mealType === type ? styles.hubCategoryPillActive : ""}`}
                      onClick={() => setMealType(type)}
                    >
                      {type === "all" ? "All" : type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>

                <div className={styles.hubSortWrapper}>
                  <button type="button" className={styles.hubSortBtn}>
                    <span>Latest</span>
                    <ChevronDown size={14} />
                  </button>
                </div>
              </div>

              {/* Recommended For You Section */}
              <section className={styles.hubRecSection} aria-label="Recommended recipes">
                <div className={styles.hubSectionHeader}>
                  <h2>Recommended for you</h2>
                  <Link href="/app/meals" className={styles.hubViewAllLink}>
                    <span>View all</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>

                <div className={styles.hubRecGrid}>
                  {curatedToDisplay.length > 0 ? (
                    curatedToDisplay.map((recipe) => (
                      <div key={recipe.id} className={styles.hubRecCard}>
                        <div className={styles.hubRecImageWrapper}>
                          <img
                            src={recipe.image}
                            alt={recipe.title}
                            className={styles.hubRecImage}
                            loading="lazy"
                          />
                          <span className={styles.hubRecTimeBadge}>
                            <Zap size={11} /> {recipe.time}
                          </span>
                          <button
                            type="button"
                            className={`${styles.hubRecBookmarkBtn} ${savedBookmarks.has(recipe.id) ? styles.hubRecBookmarkActive : ""}`}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleBookmark(recipe.id);
                            }}
                            aria-label={savedBookmarks.has(recipe.id) ? "Remove bookmark" : "Bookmark recipe"}
                          >
                            <Bookmark
                              size={13}
                              fill={savedBookmarks.has(recipe.id) ? "currentColor" : "none"}
                            />
                          </button>
                        </div>
                        <div className={styles.hubRecBody}>
                          <Link href={recipe.href} className={styles.hubRecTitleLink}>
                            <h3 className={styles.hubRecTitle}>{recipe.title}</h3>
                          </Link>
                          <div className={styles.hubRecMeta}>
                            <span className={styles.hubRecMetaItem}>
                              <Clock3 size={12} /> {recipe.time}
                            </span>
                            <span className={styles.hubRecMetaItem}>
                              <Flame size={12} /> {recipe.calories} kcal
                            </span>
                          </div>
                          <div className={styles.hubRecTags}>
                            {recipe.tags.map((tag) => (
                              <span
                                key={tag.label}
                                className={`${styles.hubRecTag} ${
                                  tag.type === "heart"
                                    ? styles.hubTagHeart
                                    : tag.type === "fiber"
                                    ? styles.hubTagFiber
                                    : tag.type === "fat"
                                    ? styles.hubTagFat
                                    : tag.type === "omega"
                                    ? styles.hubTagOmega
                                    : styles.hubTagDefault
                                }`}
                              >
                                {tag.label}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={styles.emptyState} style={{ gridColumn: "1 / -1" }}>
                      No recipes found matching your filters. Try clearing search or selecting All.
                    </div>
                  )}
                </div>
              </section>

              {/* Smart Swaps Card */}
              <section className={styles.hubSwapsCard} aria-label="Smart swaps">
                <div className={styles.hubSwapsHeader}>
                  <div className={styles.hubSwapsHeaderLeft}>
                    <span className={styles.hubSwapsIconBadge}>
                      <Leaf size={16} />
                    </span>
                    <div>
                      <h3 className={styles.hubSwapsTitle}>
                        Smart swaps for {condition?.label?.toLowerCase().includes("cholesterol") ? "heart health" : condition?.label || "wellness"}
                      </h3>
                      <p className={styles.hubSwapsSubtitle}>Small swaps. Big impact.</p>
                    </div>
                  </div>
                  <Link href="/app/meals" className={styles.hubSwapsViewAllLink}>
                    <span>See all swaps</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>

                <div className={styles.hubSwapsItemsRow}>
                  {/* Swap 1: Butter -> Olive oil */}
                  <div className={styles.hubSwapItemPair}>
                    <div className={styles.hubSwapFood}>
                      <img src="/app-ui/swap-butter.png" alt="Butter" className={styles.hubSwapFoodImg} />
                      <span className={styles.hubSwapFoodName}>Butter</span>
                    </div>
                    <div className={styles.hubSwapArrowWrapper}>
                      <ArrowRight size={14} />
                    </div>
                    <div className={styles.hubSwapFood}>
                      <img src="/app-ui/swap-oil.png" alt="Olive oil" className={styles.hubSwapFoodImg} />
                      <span className={styles.hubSwapFoodName}>Olive oil</span>
                    </div>
                  </div>

                  <div className={styles.hubSwapItemsDivider} aria-hidden="true" />

                  {/* Swap 2: Cream -> Greek yogurt */}
                  <div className={styles.hubSwapItemPair}>
                    <div className={styles.hubSwapFood}>
                      <img src="/app-ui/swap-cream.png" alt="Cream" className={styles.hubSwapFoodImg} />
                      <span className={styles.hubSwapFoodName}>Cream</span>
                    </div>
                    <div className={styles.hubSwapArrowWrapper}>
                      <ArrowRight size={14} />
                    </div>
                    <div className={styles.hubSwapFood}>
                      <img src="/app-ui/swap-yogurt.png" alt="Greek yogurt" className={styles.hubSwapFoodImg} />
                      <span className={styles.hubSwapFoodName}>Greek yogurt</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Tip of the Day Card */}
              <section className={styles.hubTipCard} aria-label="Tip of the day">
                <div className={styles.hubTipLeft}>
                  <div className={styles.hubTipTitleRow}>
                    <span className={styles.hubTipIconBadge}>
                      <FileText size={14} />
                    </span>
                    <h4 className={styles.hubTipTitle}>Tip of the day</h4>
                  </div>
                  <p className={styles.hubTipCopy}>
                    Oats, nuts and fatty fish help support healthy cholesterol levels naturally.
                  </p>
                </div>
                <div className={styles.hubTipVisualWrapper} aria-hidden="true">
                  <img src="/app-ui/tip-oats.png" alt="" className={styles.hubTipImg} />
                </div>
              </section>
            </>
          ) : (
            <section className={styles.dayPlan}>
              <p className={styles.overline}>A day for {condition?.label}</p>
              {DAY_PLAN_ORDER.map((type) => (
                <div key={type}>
                  <h2>{type}</h2>
                  {grouped[type][0] ? (
                    <RecipeCard recipe={grouped[type][0]} />
                  ) : (
                    <div className={styles.missingMeal}>No {type} recipe yet for this condition.</div>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* Bottom Consult or Motivational Banner */}
          <section className={styles.bottomBanner} aria-label="Motivational prompt">
            <div className={styles.bannerLeft}>
              <img
                src="/app-ui/botanical-branch-icon.png"
                alt=""
                className={styles.bannerIcon}
                loading="lazy"
              />
              <p className={styles.bannerCopy}>
                <span>Small choices today,</span>
                <span>powerful changes tomorrow.</span>
              </p>
            </div>
            <Link href="/app/track" className={styles.logMealBtn}>
              <span>Log your meal</span>
              <Sprout />
            </Link>
          </section>
        </div>
      )}
    </div>
  );
}
