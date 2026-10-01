"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Bookmark,
  CalendarDays,
  Check,
  FileText,
  Flower2,
  Gauge,
  Heart,
  Leaf,
  Scale,
  Shield,
  Sparkles,
  Sprout,
  Stethoscope,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import styles from "./HealthRestoreLanding.module.css";

export type LandingCondition = {
  id: string;
  label: string;
  blurb: string;
};

type HealthRestoreLandingProps = {
  conditions: LandingCondition[];
  primaryConditionId: string;
  onChooseCondition: (condition: LandingCondition) => void;
  onBrowseConditions: () => void;
  onPrepareReports: () => void;
};

type ConditionShortcut = {
  id: string;
  label: string;
  blurb: string;
  icon: LucideIcon;
  browse?: boolean;
};

type LearnCard = {
  title: string;
  description: string;
  href: string;
  image: string;
  imagePosition?: string;
};

type ToolCard = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  tone: "sage" | "gold" | "paper";
};

const CONDITION_SHORTCUTS: ConditionShortcut[] = [
  {
    id: "pcos",
    label: "PCOS",
    blurb: "Insulin-friendly, anti-inflammatory guidance for hormonal balance.",
    icon: Flower2,
  },
  {
    id: "hormonal-balance",
    label: "Hormonal Balance",
    blurb: "Browse thyroid, PCOS and other hormone-related needs.",
    icon: Sparkles,
    browse: true,
  },
  {
    id: "diabetes",
    label: "Diabetes Support",
    blurb: "Low-GI, high-fibre balance to manage blood glucose.",
    icon: Activity,
  },
  {
    id: "gut-health",
    label: "Gut Health",
    blurb: "Gentle meals and habits that support digestion.",
    icon: Leaf,
  },
  {
    id: "high-cholesterol",
    label: "Cholesterol Care",
    blurb: "Soluble fibre and unsaturated fats to support healthy LDL levels.",
    icon: Heart,
  },
];

const LEARN_CARDS: LearnCard[] = [
  {
    title: "Understanding your condition",
    description: "Causes, symptoms and everyday management",
    href: "/app/ebook/mobile",
    image: "/app-ui/card1-ref.png",
  },
  {
    title: "Nutrition for balance",
    description: "Food choices that support your goals",
    href: "/app/meals",
    image: "/landing/discover-bowl.jpg",
  },
  {
    title: "Movement & lifestyle",
    description: "Simple habits for steady progress",
    href: "/app/fitness",
    image: "/landing/fitness-plate.jpg",
    imagePosition: "center 58%",
  },
];

const TOOL_CARDS: ToolCard[] = [
  {
    title: "Nutrition calculations",
    description: "BMR, TDEE & logged totals",
    href: "/app/track",
    icon: Scale,
    tone: "sage",
  },
  {
    title: "Goal setting",
    description: "Review your health goals",
    href: "/app/profile",
    icon: Gauge,
    tone: "gold",
  },
  {
    title: "Meal plans",
    description: "Personalized and flexible",
    href: "/app/meal-plan",
    icon: CalendarDays,
    tone: "paper",
  },
  {
    title: "Progress tracking",
    description: "Insights from what you log",
    href: "/app/progress",
    icon: Activity,
    tone: "sage",
  },
];

function cleanConditionLabel(value: string) {
  const normalized = value.trim();
  if (normalized.toLowerCase() === "pcos") return "PCOS";
  return normalized
    .replace(/\s*\([^)]*\)\s*/g, "")
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function SectionHeading({
  id,
  title,
  action,
}: {
  id: string;
  title: string;
  action: ReactNode;
}) {
  return (
    <div className={styles.sectionHeading}>
      <h2 id={id}>{title}</h2>
      {action}
    </div>
  );
}

export default function HealthRestoreLanding({
  conditions,
  primaryConditionId,
  onChooseCondition,
  onBrowseConditions,
  onPrepareReports,
}: HealthRestoreLandingProps) {
  const [saved, setSaved] = useState(false);
  const activeCondition =
    conditions.find((condition) => condition.id === primaryConditionId) ||
    CONDITION_SHORTCUTS.find((condition) => condition.id === primaryConditionId) ||
    CONDITION_SHORTCUTS[0];
  const conditionLabel = cleanConditionLabel(activeCondition.label);

  const chooseShortcut = (shortcut: ConditionShortcut) => {
    if (shortcut.browse) {
      onBrowseConditions();
      return;
    }
    const condition = conditions.find((item) => item.id === shortcut.id);
    onChooseCondition(condition || shortcut);
  };

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <Link href="/app" className={styles.iconButton} aria-label="Back to home">
          <ArrowLeft aria-hidden="true" />
        </Link>
        <button
          type="button"
          className={[styles.iconButton, saved ? styles.saved : ""].filter(Boolean).join(" ")}
          aria-label={saved ? "Remove Health & Restore from saved pages" : "Save Health & Restore"}
          aria-pressed={saved}
          onClick={() => setSaved((current) => !current)}
        >
          <Bookmark fill={saved ? "currentColor" : "none"} aria-hidden="true" />
        </button>
      </div>

      <header className={styles.header}>
        <h1>Health &amp; Restore</h1>
        <p>Understand your body, manage symptoms and build sustainable habits.</p>
      </header>

      <nav className={styles.conditionRail} aria-label="Health focus shortcuts">
        {CONDITION_SHORTCUTS.map((shortcut) => {
          const Icon = shortcut.icon;
          const isActive = shortcut.id === activeCondition.id;
          return (
            <button
              type="button"
              key={shortcut.id}
              className={[styles.conditionShortcut, isActive ? styles.activeCondition : ""].filter(Boolean).join(" ")}
              aria-pressed={isActive}
              onClick={() => chooseShortcut(shortcut)}
            >
              <Icon aria-hidden="true" />
              <span>{shortcut.label}</span>
            </button>
          );
        })}
      </nav>

      <section className={styles.journeyCard} aria-labelledby="journey-heading">
        <div className={styles.journeyMedia} aria-hidden="true">
          <Image
            src="/landing/healthcare-bowl.jpg"
            alt=""
            fill
            priority
            sizes="(max-width: 640px) 58vw, 430px"
          />
        </div>
        <Image
          className={styles.journeyLeaves}
          src="/app-ui/botanical-branch-clean.png"
          alt=""
          width={300}
          height={240}
        />
        <div className={styles.journeyContent}>
          <p className={styles.eyebrow}>Your support journey</p>
          <h2 id="journey-heading">{conditionLabel} Care,<br />made simple</h2>
          <ul>
            <li><Check aria-hidden="true" /> Personalized nutrition</li>
            <li><Check aria-hidden="true" /> Symptom-aware guidance</li>
            <li><Check aria-hidden="true" /> Expert support</li>
            <li><Check aria-hidden="true" /> Sustainable daily habits</li>
          </ul>
          <button type="button" onClick={() => onChooseCondition(activeCondition)}>
            Continue your {conditionLabel} journey
            <ArrowRight aria-hidden="true" />
          </button>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="learn-heading">
        <SectionHeading
          id="learn-heading"
          title="Learn & Understand"
          action={<Link href="/app/ebook/mobile">View all <ArrowRight aria-hidden="true" /></Link>}
        />
        <div className={styles.learnGrid}>
          {LEARN_CARDS.map((card) => (
            <Link href={card.href} className={styles.learnCard} key={card.title}>
              <div className={styles.learnMedia}>
                <Image
                  src={card.image}
                  alt=""
                  fill
                  sizes="(max-width: 620px) 33vw, 230px"
                  style={{ objectPosition: card.imagePosition }}
                />
              </div>
              <div className={styles.learnBody}>
                <h3>{card.title === "Understanding your condition" ? <>Understanding {conditionLabel}</> : card.title}</h3>
                <div>
                  <p>{card.description}</p>
                  <span aria-hidden="true"><ArrowRight /></span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="track-heading">
        <SectionHeading
          id="track-heading"
          title="Track Your Health"
          action={<Link href="/app/progress">See all <ArrowRight aria-hidden="true" /></Link>}
        />
        <div className={styles.trackGrid}>
          <Link href="/app/track" className={styles.trackCard}>
            <span className={[styles.trackIcon, styles.sage].join(" ")}><UtensilsCrossed aria-hidden="true" /></span>
            <strong>Log meals</strong>
            <small>Track what you eat</small>
          </Link>
          <Link href="/onboarding/conditions" className={styles.trackCard}>
            <span className={[styles.trackIcon, styles.sage].join(" ")}><Sprout aria-hidden="true" /></span>
            <strong>Review symptoms</strong>
            <small>Update patterns and needs</small>
          </Link>
          <Link href="/app/progress" className={styles.trackCard}>
            <span className={[styles.trackIcon, styles.gold].join(" ")}><Activity aria-hidden="true" /></span>
            <strong>View lifestyle</strong>
            <small>See your logged rhythm</small>
          </Link>
          <button type="button" className={styles.trackCard} onClick={onPrepareReports}>
            <span className={[styles.trackIcon, styles.paper].join(" ")}><FileText aria-hidden="true" /></span>
            <strong>Prepare reports</strong>
            <small>Choose locally; not uploaded</small>
          </button>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="expert-heading">
        <SectionHeading
          id="expert-heading"
          title="Work With an Expert"
          action={<Link href="/app/consult">See all <ArrowRight aria-hidden="true" /></Link>}
        />
        <Link href="/app/consult" className={styles.expertCard}>
          <div className={styles.expertAvatars} aria-hidden="true">
            {["coach-av-neha.png", "coach-av-kavya.png", "coach-av-ritika.png"].map((avatar) => (
              <Image key={avatar} src={"/app-ui/" + avatar} alt="" width={48} height={48} />
            ))}
            <span>+</span>
          </div>
          <div className={styles.expertCopy}>
            <strong>Consult nutritionists, fitness coaches and wellness experts</strong>
            <small>Personalized guidance for your goals</small>
          </div>
          <ArrowRight className={styles.expertArrow} aria-hidden="true" />
        </Link>
      </section>

      <section className={styles.section} aria-labelledby="tools-heading">
        <SectionHeading
          id="tools-heading"
          title="Explore Tools"
          action={<Link href="/app/profile">Your profile <ArrowRight aria-hidden="true" /></Link>}
        />
        <div className={styles.toolsGrid}>
          {TOOL_CARDS.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link href={tool.href} className={styles.toolCard} key={tool.title}>
                <span className={[styles.toolIcon, styles[tool.tone]].join(" ")}><Icon aria-hidden="true" /></span>
                <span>
                  <strong>{tool.title}</strong>
                  <small>{tool.description}</small>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <aside className={styles.guidanceNote}>
        <Shield aria-hidden="true" />
        <p>Nutrition guidance supports your care; it does not replace advice from a qualified clinician.</p>
        <Link href="/app/consult" aria-label="Find a qualified health expert"><Stethoscope aria-hidden="true" /></Link>
      </aside>
    </div>
  );
}
