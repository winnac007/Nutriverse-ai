"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import {
  ArrowRight,
  Bell,
  CalendarDays,
  Dumbbell,
  Flame,
  Leaf,
  MessageCircle,
  Sprout,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";
import styles from "./Home.module.css";

type NutritionTotals = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

type NutritionSnapshot = {
  totals: NutritionTotals;
  logs: Array<{ id: string }>;
};

type StreakSnapshot = {
  current_streak_days: number;
  distinct_recipes_this_week: number;
};

type HomeSnapshot = NutritionTotals & {
  mealsToday: number;
  streakDays: number;
  weeklyVariety: number;
};

type ExploreItem = {
  title: string;
  description: string;
  href: string;
  image: string;
  imagePosition?: string;
};

type FocusItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  tone: "sage" | "gold" | "forest" | "paper";
};

const EMPTY_SNAPSHOT: HomeSnapshot = {
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  mealsToday: 0,
  streakDays: 0,
  weeklyVariety: 0,
};

const EXPLORE_ITEMS: ExploreItem[] = [
  {
    title: "Health & Restore",
    description: "Conditions, gut health & more",
    href: "/app/healthcare",
    image: "/landing/healthcare-bowl.jpg",
  },
  {
    title: "Strength & Fuel",
    description: "Fitness, energy & performance",
    href: "/app/fitness",
    image: "/landing/fitness-plate.jpg",
  },
  {
    title: "Meals & Recipes",
    description: "Personalized meal inspiration",
    href: "/app/meals",
    image: "/landing/discover-bowl.jpg",
  },
  {
    title: "Consult Experts",
    description: "Nutritionists, coaches & more",
    href: "/app/consult",
    image: "/app-ui/nutritionist-ananya.webp",
    imagePosition: "center 26%",
  },
  {
    title: "Marketplace",
    description: "Trusted wellness essentials",
    href: "/app/marketplace",
    image: "/app-ui/market-hero-plate.png",
  },
  {
    title: "Track & Journal",
    description: "Meals, habits & progress",
    href: "/app/track",
    image: "/app-ui/card4-ref.png",
  },
];

const FOCUS_ITEMS: FocusItem[] = [
  { title: "Log your meals", href: "/app/track", icon: UtensilsCrossed, tone: "sage" },
  { title: "Plan today’s plate", href: "/app/daily-plan", icon: CalendarDays, tone: "gold" },
  { title: "Move with intention", href: "/app/fitness", icon: Dumbbell, tone: "forest" },
  { title: "Talk to a coach", href: "/app/consult", icon: MessageCircle, tone: "paper" },
];

function greetingForHour(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function displayCondition(value: string) {
  if (value.trim().toLowerCase() === "pcos") return "PCOS";
  return value
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function rounded(value: number) {
  return Math.round(value || 0);
}

export default function Home() {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState("Welcome back");
  const [snapshot, setSnapshot] = useState<HomeSnapshot>(EMPTY_SNAPSHOT);
  const [snapshotStatus, setSnapshotStatus] = useState<"loading" | "ready">("loading");

  useEffect(() => {
    setGreeting(greetingForHour(new Date().getHours()));
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    let active = true;
    const loadSnapshot = async () => {
      const [nutritionResult, streakResult] = await Promise.allSettled([
        api.get<NutritionSnapshot>("/nutrition/today"),
        api.get<StreakSnapshot>("/healthcare/streak"),
      ]);

      if (!active) return;

      const nutrition = nutritionResult.status === "fulfilled" ? nutritionResult.value.data : null;
      const streak = streakResult.status === "fulfilled" ? streakResult.value.data : null;

      setSnapshot({
        calories: nutrition?.totals.calories ?? 0,
        protein: nutrition?.totals.protein ?? 0,
        carbs: nutrition?.totals.carbs ?? 0,
        fat: nutrition?.totals.fat ?? 0,
        mealsToday: nutrition?.logs.length ?? 0,
        streakDays: streak?.current_streak_days ?? 0,
        weeklyVariety: streak?.distinct_recipes_this_week ?? 0,
      });
      setSnapshotStatus("ready");
    };

    void loadSnapshot();
    return () => {
      active = false;
    };
  }, [user?.id]);

  const firstName = user?.name?.trim().split(/\s+/)[0] || "there";
  const initials = user?.name
    ? user.name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("")
    : "NV";

  const primaryCondition = user?.conditions?.[0] || user?.condition;
  const conditionLabel = primaryCondition ? displayCondition(primaryCondition) : "wellness";
  const profileSignals = [
    Boolean(primaryCondition),
    Boolean(user?.dietary_type),
    Boolean(user?.goal || user?.goal_30day),
    Boolean(user?.activity_level),
    Boolean(user?.age && user?.weight_kg && user?.height_cm),
  ].filter(Boolean).length;
  const profileProgress = Math.round((profileSignals / 5) * 100);
  const mealRhythmPercent = Math.min(100, Math.round((snapshot.mealsToday / 3) * 100));
  const displayValue = (value: string) => (snapshotStatus === "loading" ? "—" : value);

  const progressItems = [
    {
      label: "Meals logged",
      value: displayValue(String(snapshot.mealsToday)),
      icon: UtensilsCrossed,
    },
    {
      label: "Energy logged",
      value: displayValue(`${rounded(snapshot.calories)} kcal`),
      icon: Flame,
    },
    {
      label: "Protein logged",
      value: displayValue(`${rounded(snapshot.protein)} g`),
      icon: Dumbbell,
    },
    {
      label: "Current streak",
      value: displayValue(`${snapshot.streakDays} ${snapshot.streakDays === 1 ? "day" : "days"}`),
      icon: Sprout,
    },
    {
      label: "Weekly variety",
      value: displayValue(`${snapshot.weeklyVariety} recipes`),
      icon: CalendarDays,
    },
  ];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/app" className={styles.brand} aria-label="NutriVerse home">
          <Leaf aria-hidden="true" />
          <span>NutriVerse</span>
        </Link>
        <div className={styles.headerActions}>
          <span
            className={styles.notification}
            role="img"
            aria-label="Notifications are coming soon"
            title="Notifications are coming soon"
          >
            <Bell aria-hidden="true" />
          </span>
          <Link href="/app/profile" className={styles.avatar} aria-label="Open your profile">
            {initials}
          </Link>
        </div>
      </header>

      <section className={styles.hero} aria-labelledby="home-greeting">
        <div className={styles.heroCopy}>
          <h1 id="home-greeting">
            {greeting},
            <span>{firstName}</span>
          </h1>
          <p>Small, consistent choices create lasting change.</p>
        </div>
        <div className={styles.heroMedia} aria-hidden="true">
          <Image
            src="/landing/hero-bowl.jpg"
            alt=""
            fill
            priority
            sizes="(max-width: 640px) 58vw, 420px"
          />
        </div>
      </section>

      <Link href="/app/healthcare" className={styles.journeyCard}>
        <div className={styles.journeyCopy}>
          <p className={styles.eyebrow}>Continue your journey</p>
          <h2>{primaryCondition ? `Manage ${conditionLabel}` : "Build your wellness plan"}</h2>
          <div className={styles.journeyProgressMeta}>
            <span>{profileSignals} of 5 profile signals ready</span>
            <strong>{profileProgress}%</strong>
          </div>
          <div
            className={styles.progressTrack}
            role="progressbar"
            aria-label="Wellness profile readiness"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={profileProgress}
          >
            <span style={{ width: `${profileProgress}%` }} />
          </div>
        </div>
        <span className={styles.journeyAction} aria-hidden="true">
          <ArrowRight />
        </span>
        <Image
          className={styles.journeyBotanical}
          src="/app-ui/botanical-branch-clean.png"
          alt=""
          width={300}
          height={240}
        />
      </Link>

      <section className={styles.section} aria-labelledby="explore-heading">
        <div className={styles.sectionHeader}>
          <h2 id="explore-heading">Explore</h2>
          <Link href="/app/explore" className={styles.sectionAction}>
            View all <ArrowRight aria-hidden="true" />
          </Link>
        </div>
        <div className={styles.exploreGrid}>
          {EXPLORE_ITEMS.map((item) => (
            <Link key={item.title} href={item.href} className={styles.exploreCard}>
              <div className={styles.exploreMedia}>
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="(max-width: 620px) 50vw, 240px"
                  style={{ objectPosition: item.imagePosition }}
                />
              </div>
              <div className={styles.exploreCopy}>
                <h3>{item.title}</h3>
                <div className={styles.exploreFooter}>
                  <p>{item.description}</p>
                  <span aria-hidden="true">
                    <ArrowRight />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="progress-heading">
        <div className={styles.sectionHeader}>
          <h2 id="progress-heading">Your progress</h2>
          <Link href="/app/progress" className={styles.sectionAction}>
            View details <ArrowRight aria-hidden="true" />
          </Link>
        </div>
        <Link href="/app/progress" className={styles.progressCard}>
          <div
            className={styles.progressRing}
            style={{ "--progress": `${mealRhythmPercent * 3.6}deg` } as CSSProperties}
            aria-label={`${mealRhythmPercent}% of a three-meal daily rhythm logged`}
          >
            <span>
              <strong>{displayValue(`${mealRhythmPercent}%`)}</strong>
              <small>Meal rhythm</small>
            </span>
          </div>
          <div className={styles.progressList}>
            {progressItems.map((item) => {
              const Icon = item.icon;
              return (
                <div className={styles.progressItem} key={item.label}>
                  <Icon aria-hidden="true" />
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              );
            })}
          </div>
          <ArrowRight className={styles.progressArrow} aria-hidden="true" />
        </Link>
      </section>

      <section className={styles.section} aria-labelledby="focus-heading">
        <div className={styles.sectionHeader}>
          <h2 id="focus-heading">Today’s focus</h2>
          <Link href="/app/daily-plan" className={styles.sectionAction}>
            Open plan <ArrowRight aria-hidden="true" />
          </Link>
        </div>
        <div className={styles.focusGrid}>
          {FOCUS_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link href={item.href} className={styles.focusCard} key={item.title}>
                <span className={`${styles.focusIcon} ${styles[item.tone]}`}>
                  <Icon aria-hidden="true" />
                </span>
                <span>{item.title}</span>
                <ArrowRight className={styles.focusArrow} aria-hidden="true" />
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
