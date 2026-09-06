"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Clock3,
  Flame,
  Sprout,
  Dumbbell,
  Globe2,
  ChefHat,
  Bookmark,
  Moon,
  Heart,
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

type MetricItem = {
  id: string;
  label: string;
  value: string;
  denominator?: string;
  percent: number;
  color: string;
  icon: LucideIcon;
  iconColor: string;
};

type Chapter = {
  id: string;
  number: string;
  overline: string;
  title: string;
  tags: string;
  href: string;
  image: string;
  icon: LucideIcon;
};

const CHAPTERS: Chapter[] = [
  {
    id: "healthcare",
    number: "01",
    overline: "Healthcare",
    title: "Heal &\nRestore",
    tags: "PCOS · Diabetes ·\nThyroid · Gut",
    href: "/app/healthcare",
    image: "/app-ui/dish-ch1.png",
    icon: Sprout,
  },
  {
    id: "fitness",
    number: "02",
    overline: "Fitness",
    title: "Strength &\nFuel",
    tags: "Protein ·\nPerformance ·\nBalance",
    href: "/app/fitness",
    image: "/app-ui/dish-ch2.png",
    icon: Dumbbell,
  },
  {
    id: "discover",
    number: "03",
    overline: "Discover",
    title: "Travel the\nPlate",
    tags: "Cuisines from\naround the\nworld",
    href: "/app/explore",
    image: "/app-ui/dish-ch3.png",
    icon: Globe2,
  },
  {
    id: "indulgence",
    number: "04",
    overline: "Indulgence",
    title: "Chef\nSpecials",
    tags: "Desserts ·\nBakery ·\nMindful treats",
    href: "/app/chef",
    image: "/app-ui/dish-ch4.png",
    icon: ChefHat,
  },
];

const FEATURED_FALLBACKS: RecipeSummary[] = [
  {
    id: "featured-lentil-dal",
    title: "Turmeric Ginger Lentil Dal",
    href: "/app/meals?search=lentil",
    image: "/app-ui/recipe1-crop.png",
    country: "India",
    cook_time: 30,
    nutrition: { calories: 245 },
  },
  {
    id: "featured-salmon",
    title: "Baked Salmon Broccoli",
    href: "/app/meals?search=salmon",
    image: "/app-ui/recipe2-crop.png",
    country: "USA",
    cook_time: 25,
    nutrition: { calories: 320 },
  },
];

function NameSprig() {
  return (
    <svg viewBox="0 0 32 32" className={styles.nameSprig} fill="none" aria-hidden="true">
      <path d="M7 26C11 20 15 15 26 5" stroke="#78886D" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M26 5C20.5 5 17 9 18 13.5C19.5 11 23 8.5 26 5Z" fill="#88987D" />
      <path d="M18 13.5C14 13.5 11.5 16 12.5 19.5C14 17 17 15.5 18 13.5Z" fill="#99A88E" />
      <path d="M21 9C19 8 16.5 9 15.5 11.5C17 10.5 19.5 9.5 21 9Z" fill="#99A88E" />
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

function FeaturedRecipeCard({ recipe }: { recipe: RecipeSummary }) {
  const [saved, setSaved] = useState(false);
  const country = recipe.country || recipe.category || "Global";

  return (
    <div className={styles.featuredCard}>
      <Link href={recipe.href || `/app/recipe/${recipe.id}`} className={styles.featuredImageWrapper}>
        <img
          src={recipe.image || "/app-ui/recipe1-crop.png"}
          alt={recipe.title}
          className={styles.featuredImage}
          loading="lazy"
        />
        <span className={styles.countryBadge}>{country}</span>
      </Link>
      <div className={styles.featuredCopy}>
        <Link href={recipe.href || `/app/recipe/${recipe.id}`} style={{ textDecoration: "none", color: "inherit" }}>
          <h3 className={styles.featuredTitle}>{recipe.title}</h3>
        </Link>
        <div className={styles.featuredBottomRow}>
          <div className={styles.featuredMeta}>
            <span className={styles.featuredMetaItem}>
              <Clock3 /> {recipe.cook_time || 30}m
            </span>
            <span className={styles.featuredMetaItem}>
              <Flame /> {recipe.nutrition?.calories || 250} kcal
            </span>
          </div>
          <button
            type="button"
            className={`${styles.bookmarkBtn} ${saved ? styles.bookmarkBtnActive : ""}`}
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

function greetingForHour(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function Home() {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState("Good morning");
  const [, setTotals] = useState<NutritionTotals>({});
  const [featured, setFeatured] = useState<RecipeSummary[]>(FEATURED_FALLBACKS);

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
      if (recipesResult.status === "fulfilled" && Array.isArray(recipesResult.value.data) && recipesResult.value.data.length > 0) {
        const liveRecipes = recipesResult.value.data.slice(0, 2);
        const filled = [
          ...liveRecipes,
          ...FEATURED_FALLBACKS.filter((recipe) => !liveRecipes.some((lr) => lr.id === recipe.id)),
        ].slice(0, 2);
        setFeatured(filled);
      } else {
        setFeatured(FEATURED_FALLBACKS);
      }
      if (nutritionResult.status === "fulfilled" && nutritionResult.value.data?.totals) {
        setTotals(nutritionResult.value.data.totals);
      }
    };

    void loadHome();
    return () => {
      active = false;
    };
  }, [user?.category]);

  const firstName = user?.name ? user.name.trim().split(" ")[0] : "Aditi";

  const metrics: MetricItem[] = [
    {
      id: "water",
      label: "Water",
      value: "5",
      denominator: "/ 8 cups",
      percent: 62.5,
      color: "#627555",
      icon: Sprout,
      iconColor: "#5E7252",
    },
    {
      id: "sleep",
      label: "Sleep",
      value: "7h 20m",
      percent: 85,
      color: "#8071B8",
      icon: Moon,
      iconColor: "#6A5D9E",
    },
    {
      id: "movement",
      label: "Movement",
      value: "30",
      denominator: "/ 45 min",
      percent: 66.7,
      color: "#E36F3C",
      icon: Flame,
      iconColor: "#E06A3B",
    },
    {
      id: "meals",
      label: "Mindful meals",
      value: "2",
      denominator: "/ 3",
      percent: 66.7,
      color: "#DE6E6E",
      icon: Heart,
      iconColor: "#DE6B6B",
    },
  ];

  return (
    <div className={styles.page}>
      {/* 1. Hero & Greeting with Top-Right Botanical Visual */}
      <section className={styles.hero} aria-label="Greeting">
        <div className={styles.heroContent}>
          <h1 className={styles.greetingTitle}>
            {greeting},<br />
            <span className={styles.nameRow}>
              {firstName}
              <NameSprig />
            </span>
          </h1>
          <p className={styles.heroSubtitle}>
            Let&apos;s nourish your body and mind,
            <br />
            one plate at a time.
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

      {/* 2. Your AI Nutrition Guide Card */}
      <Link href="/app/meal-plan" className={styles.guideCard} aria-label="Your AI nutrition guide">
        <span className={styles.guideBadge} aria-hidden="true">
          <GuideSparkle />
        </span>
        <div className={styles.guideText}>
          <h2>Your AI nutrition guide</h2>
          <p>A 7-day plan, grocery list, and adaptive coach — tuned to you.</p>
        </div>
        <span className={styles.guideOpen}>
          Open <ArrowRight size={16} />
        </span>
      </Link>

      {/* 3. Today at a Glance (4 Progress Metrics) */}
      <section className={styles.glanceSection} aria-label="Today at a glance">
        <div className={styles.sectionHeader}>
          <h2>Today at a glance</h2>
          <Link href="/app/progress" className={styles.sectionAction}>
            See insights <ArrowRight />
          </Link>
        </div>
        <div className={styles.metricsGrid}>
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div key={metric.id} className={styles.metricCard}>
                <div className={styles.metricTop}>
                  <Icon className={styles.metricIcon} style={{ color: metric.iconColor }} />
                  <span className={styles.metricLabel}>{metric.label}</span>
                </div>
                <div className={styles.metricValue}>
                  {metric.value}
                  {metric.denominator && (
                    <span className={styles.metricDenominator}> {metric.denominator}</span>
                  )}
                </div>
                <div className={styles.metricProgressTrack}>
                  <div
                    className={styles.metricProgressBar}
                    style={{
                      width: `${metric.percent}%`,
                      backgroundColor: metric.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Explore Your Plate (2x2 Chapter Grid) */}
      <section className={styles.chaptersSection} aria-label="Explore your plate">
        <div className={styles.sectionHeader}>
          <h2>Explore your plate</h2>
          <Link href="/app/explore" className={styles.sectionAction}>
            See all <ArrowRight />
          </Link>
        </div>
        <div className={styles.chaptersGrid}>
          {CHAPTERS.map((chapter) => {
            const Icon = chapter.icon;
            return (
              <Link key={chapter.id} href={chapter.href} className={styles.chapterCard}>
                <div className={styles.chapterContent}>
                  <div className={styles.chapterOverlineRow}>
                    <span className={styles.chapterNumber}>{chapter.number}</span>
                    <span className={styles.chapterOverline}>{chapter.overline}</span>
                  </div>
                  <h3 className={styles.chapterTitle}>{chapter.title}</h3>
                  <div className={styles.chapterLine} />
                  <p className={styles.chapterTags}>{chapter.tags}</p>
                  <div className={styles.chapterBadge}>
                    <Icon />
                  </div>
                </div>
                <div className={styles.chapterDishWrapper} aria-hidden="true">
                  <img
                    src={chapter.image}
                    alt=""
                    className={styles.chapterDishImg}
                    loading="lazy"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 5. Featured For You */}
      <section className={styles.featuredSection} aria-label="Featured recipes">
        <div className={styles.sectionHeader}>
          <h2>Featured for you</h2>
          <Link href="/app/meals" className={styles.sectionAction}>
            View all <ArrowRight />
          </Link>
        </div>
        <div className={styles.featuredGrid}>
          {featured.slice(0, 2).map((recipe) => (
            <FeaturedRecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </section>

      {/* 6. Motivational Bottom Action Banner */}
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
  );
}
