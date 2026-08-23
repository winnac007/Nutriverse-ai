"use client";

import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  ChefHat,
  Clock3,
  Dumbbell,
  Flame,
  Globe2,
  Menu,
  Sparkles,
  Sprout,
  type LucideIcon,
} from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";
import styles from "./Home.module.css";

type NutritionTotals = {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
};

type RecipeSummary = {
  id: string;
  title: string;
  href?: string;
  image?: string;
  is_premium?: boolean;
  cook_time?: number;
  category?: string;
  country?: string;
  nutrition?: { calories?: number };
};

type Chapter = {
  id: string;
  number: string;
  overline: string;
  title: string;
  description: string;
  href: string;
  image: string;
  variant: "sage" | "cream" | "dark" | "warm";
  icon: LucideIcon;
};

const CHAPTERS: Chapter[] = [
  {
    id: "healthcare",
    number: "01",
    overline: "Healthcare",
    title: "Heal & Restore",
    description: "PCOS, diabetes, thyroid, gut — translated to everyday meals.",
    href: "/app/healthcare",
    image: "https://images.unsplash.com/photo-1604152135912-04a022e23696?w=1200&q=85",
    variant: "sage",
    icon: Sprout,
  },
  {
    id: "fitness",
    number: "02",
    overline: "Fitness",
    title: "Strength & Fuel",
    description: "High protein and balanced macros that fit your week.",
    href: "/app/category/fitness",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&q=85",
    variant: "cream",
    icon: Dumbbell,
  },
  {
    id: "discover",
    number: "03",
    overline: "Discover",
    title: "Travel the Plate",
    description: "Global cuisines, gently adapted to how you live.",
    href: "/app/explore",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=1200&q=85",
    variant: "dark",
    icon: Globe2,
  },
  {
    id: "chef-special",
    number: "04",
    overline: "Indulgence",
    title: "Chef Specials",
    description: "Mindful desserts & bakery — moments worth slowing for.",
    href: "/app/category/chef-special",
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=1200&q=85",
    variant: "warm",
    icon: ChefHat,
  },
];

const METRICS: Array<{ key: keyof NutritionTotals; label: string }> = [
  { key: "calories", label: "kcal" },
  { key: "protein", label: "protein g" },
  { key: "carbs", label: "carbs g" },
  { key: "fat", label: "fat g" },
];

const FEATURED_FALLBACKS: RecipeSummary[] = [
  {
    id: "featured-lentil-dal",
    title: "Turmeric Ginger Lentil Dal",
    href: "/app/meals?search=lentil",
    image: "https://images.unsplash.com/photo-1604152135912-04a022e23696?w=900&q=85",
    country: "India",
    cook_time: 30,
    nutrition: { calories: 245 },
  },
  {
    id: "featured-salmon",
    title: "Baked Salmon with Steamed Broccoli",
    href: "/app/meals?search=salmon",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=900&q=85",
    country: "USA",
    cook_time: 35,
    nutrition: { calories: 420 },
  },
  {
    id: "featured-quinoa",
    title: "Quinoa Veggie Bowl for Kidney Health",
    href: "/app/meals?search=quinoa",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=900&q=85",
    country: "Peru",
    cook_time: 25,
    nutrition: { calories: 390 },
  },
  {
    id: "featured-tofu-bowl",
    title: "Sesame Tofu Harvest Bowl",
    href: "/app/meals?search=tofu",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=900&q=85",
    country: "Korea",
    cook_time: 30,
    nutrition: { calories: 460 },
  },
];

function LeafBranch() {
  return (
    <svg viewBox="0 0 220 320" className={styles.leafBranch} aria-hidden="true">
      <path className={styles.leafStem} d="M105 10 Q60 60 70 130 Q80 200 50 280" />
      {Array.from({ length: 11 }, (_, index) => {
        const progress = index / 10;
        const x = 105 - Math.sin(progress * 3) * 30 - progress * 50;
        const y = 10 + progress * 270;
        const rotation = (index % 2 === 0 ? 35 : -35) - progress * 20;
        return (
          <path
            key={index}
            className={styles.leafShape}
            d="M0 0 Q14 -10 28 0 Q14 12 0 0 Z"
            transform={`translate(${x} ${y}) rotate(${rotation})`}
          />
        );
      })}
    </svg>
  );
}

function Sprig() {
  return (
    <svg viewBox="0 0 80 40" className={styles.sprig} aria-hidden="true">
      <path d="M5 25 Q30 5 75 18" />
      {Array.from({ length: 7 }, (_, index) => {
        const x = 12 + index * 9;
        const y = 22 - Math.sin(index / 2) * 6;
        return <ellipse key={index} cx={x} cy={y} rx="3.5" ry="1.6" transform={`rotate(${index * 9} ${x} ${y})`} />;
      })}
    </svg>
  );
}

function DotMap() {
  return (
    <svg viewBox="0 0 1000 500" className={styles.dotMap} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <pattern id="zenplate-dot-map" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
          <circle cx="6" cy="6" r="1.1" />
        </pattern>
      </defs>
      <g className={styles.mapLand}>
        <path d="M120 130 Q180 100 240 120 Q280 130 290 170 Q260 210 220 230 Q170 240 130 220 Q100 190 120 130 Z" />
        <path d="M250 270 Q280 260 300 290 Q320 340 300 400 Q280 440 260 430 Q240 400 240 350 Q240 300 250 270 Z" />
        <path d="M460 130 Q500 110 540 130 Q560 160 540 190 Q500 200 470 180 Q450 160 460 130 Z" />
        <path d="M470 220 Q510 210 540 240 Q560 290 540 350 Q510 390 480 380 Q450 340 450 280 Q450 240 470 220 Z" />
        <path d="M580 140 Q680 110 780 140 Q830 170 820 220 Q780 250 700 240 Q620 230 590 200 Q570 170 580 140 Z" />
        <path d="M730 260 Q780 250 810 280 Q800 310 760 310 Q720 300 720 280 Z" />
        <path d="M820 340 Q870 330 900 360 Q890 390 850 395 Q810 385 810 360 Z" />
      </g>
      <g className={styles.mapPins}>
        <circle cx="230" cy="210" r="3.5" />
        <circle cx="530" cy="220" r="3.5" />
        <circle cx="720" cy="275" r="3.5" />
        <circle cx="800" cy="240" r="3.5" />
        <circle cx="880" cy="220" r="3.5" />
        <circle cx="300" cy="350" r="3.5" />
      </g>
    </svg>
  );
}

function ChapterCard({ chapter, index }: { chapter: Chapter; index: number }) {
  const Icon = chapter.icon;
  const isDark = chapter.variant === "dark";
  const animationStyle = { "--chapter-delay": `${index * 80}ms` } as CSSProperties;

  return (
    <article className={styles.chapterEntrance} style={animationStyle}>
      <Link className={`${styles.chapterCard} ${styles[chapter.variant]}`} href={chapter.href}>
        {isDark ? <DotMap /> : <LeafBranch />}

        <div className={styles.chapterImage}>
          <img src={chapter.image} alt="" loading={index === 0 ? "eager" : "lazy"} />
          <span className={styles.imageFade} />
        </div>

        <div className={styles.chapterCopy}>
          {!isDark ? <Sprig /> : null}
          <div className={styles.chapterLabel}>
            <span className={styles.chapterNumber}>{chapter.number}</span>
            <span className={styles.chapterOverline}>{chapter.overline}</span>
          </div>
          <h2>{chapter.title}</h2>
          <span className={styles.divider} />
          <p>{chapter.description}</p>
          <span className={styles.chapterIcon}><Icon aria-hidden="true" /></span>
        </div>

        <span className={styles.chapterArrow} aria-hidden="true"><ArrowUpRight /></span>
      </Link>
    </article>
  );
}

function FeaturedRecipe({ recipe }: { recipe: RecipeSummary }) {
  const label = recipe.country || recipe.category;
  return (
    <Link className={styles.recipeCard} href={recipe.href || (recipe.is_premium ? "/app/profile" : `/app/recipe/${recipe.id}`)}>
      <span className={styles.recipeImage}>
        <img
          src={recipe.image || "https://images.unsplash.com/photo-1547592180-85f173990554?w=720&q=80"}
          alt=""
          loading="lazy"
        />
        {label ? <span className={styles.recipeLabel}>{label}</span> : null}
      </span>
      <span className={styles.recipeCopy}>
        <strong>{recipe.title}</strong>
        <span className={styles.recipeMeta}>
          <span><Clock3 /> {recipe.cook_time || 30}m</span>
          <span><Flame /> {recipe.nutrition?.calories || 0} kcal</span>
        </span>
      </span>
    </Link>
  );
}

function greetingForHour(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function Home() {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState("Good morning");
  const [totals, setTotals] = useState<NutritionTotals>({});
  const [featured, setFeatured] = useState<RecipeSummary[]>([]);

  useEffect(() => {
    setGreeting(greetingForHour(new Date().getHours()));
  }, []);

  useEffect(() => {
    let active = true;
    const loadHome = async () => {
      const [recipesResult, nutritionResult] = await Promise.allSettled([
        api.get<RecipeSummary[]>("/recipes", { params: { category: user?.category } }),
        api.get<{ totals?: NutritionTotals }>("/nutrition/today"),
      ]);

      if (!active) return;
      if (recipesResult.status === "fulfilled") {
        const liveRecipes = recipesResult.value.data.slice(0, 4);
        const liveIds = new Set(liveRecipes.map((recipe) => recipe.id));
        const filled = [...liveRecipes, ...FEATURED_FALLBACKS.filter((recipe) => !liveIds.has(recipe.id))].slice(0, 4);
        setFeatured(filled);
      } else {
        setFeatured(FEATURED_FALLBACKS);
      }
      if (nutritionResult.status === "fulfilled") setTotals(nutritionResult.value.data.totals || {});
    };

    void loadHome();
    return () => { active = false; };
  }, [user?.category]);

  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <div className={styles.page}>
      <header className={styles.appBar}>
        <Link className={styles.wordmark} href="/app" aria-label="Zenplato home">
          <Sprout />
          <span>Zenplato</span>
        </Link>
        <div className={styles.appActions}>
          <Link className={user?.is_premium ? styles.premiumPill : styles.startedPill} href="/app/profile">
            {user?.is_premium ? "Premium" : "Get started"}
          </Link>
          <Link className={styles.menuButton} href="/app/profile" aria-label="Open profile menu"><Menu /></Link>
        </div>
      </header>

      <section className={styles.greeting}>
        <h1>{greeting},<br />{firstName}.</h1>
        <p>Today is a new beginning.</p>
      </section>

      <section className={styles.focusCard} aria-labelledby="focus-heading">
        <div className={styles.focusHeading}>
          <h2 id="focus-heading">Today&apos;s focus</h2>
          <Link href="/app/track">See all <ArrowRight /></Link>
        </div>
        <p>Nourish your body. Calm your mind.</p>
        <div className={styles.metrics}>
          {METRICS.map((metric) => (
            <div key={metric.key}>
              <strong>{Math.round(totals[metric.key] || 0)}</strong>
              <span>{metric.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.chapters} aria-label="Wellness paths">
        {CHAPTERS.map((chapter, index) => <ChapterCard key={chapter.id} chapter={chapter} index={index} />)}
      </section>

      <section className={styles.guideCard}>
        <span className={styles.guideIcon}><Sparkles /></span>
        <div>
          <h2>Your AI nutrition guide</h2>
          <p>A 7-day plan, grocery list, and adaptive coach — tuned to you.</p>
        </div>
        <Link href="/app/meal-plan">Open →</Link>
      </section>

      <section className={styles.featured}>
        <div className={styles.sectionHeading}>
          <h2>Featured for you</h2>
          <Link href="/app/meals">View all</Link>
        </div>
        <div className={styles.recipeRail}>
          {(featured.length ? featured : FEATURED_FALLBACKS).map((recipe) => <FeaturedRecipe key={recipe.id} recipe={recipe} />)}
        </div>
      </section>
    </div>
  );
}
