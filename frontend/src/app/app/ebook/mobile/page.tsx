"use client";

import Image from "next/image";
import type { ImageProps } from "next/image";
import { cloneElement, createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { User } from "@/lib/types";
import styles from "./mobile-ebook.module.css";

type EbookSummary = Record<string, unknown>;

interface MobileEbookPayload {
  condition_id: string;
  condition_label: string;
  is_premium?: boolean;
  summary: EbookSummary;
  media?: Record<string, string>;
}

interface MobileEbookContextValue {
  ebook: MobileEbookPayload;
  user: User | null;
  media: Record<string, string>;
}

const DEFAULT_MOBILE_MEDIA: Record<string, string> = {
  opening_note: "/ebook/note-hero.png",
  health_snapshot: "/ebook/snapshot-bg.png",
  opportunity: "/ebook/understanding-pcos-journey.png",
  grocery_essentials: "/ebook/grocery-essentials-bg.png",
  understanding_journey: "/ebook/understanding-pcos-journey.png",
  understanding_detail: "/ebook/phone-understanding-detail.png",
  symptoms: "/ebook/phone-why-symptoms.png",
  nutrition_influence: "/ebook/phone-nutrition-influence.png",
  framework: "/ebook/zenplato-framework-photo.png",
  food_guide: "/ebook/food-nutrition-guide-bg.png",
  balanced_plate: "/ebook/balanced-plate-bowl.png",
  hydration: "/ebook/hydration-scene.png",
  breakfast: "/ebook/breakfasts-hero.png",
  breakfast_benefits: "/ebook/matcha-benefits-phone-hero.png",
  beverages: "/ebook/nourishing-phone-hero.png",
};

const MobileEbookContext = createContext<MobileEbookContextValue | null>(null);

function useMobileEbook() {
  const value = useContext(MobileEbookContext);
  if (!value) throw new Error("Mobile ebook content must be rendered inside its provider.");
  return value;
}

function asText(value: unknown, fallback: string) {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return fallback;
}

function fitEbookText(value: unknown, fallback: string, maxLength: number) {
  const text = asText(value, fallback).replace(/\s+/g, " ");
  if (text.length <= maxLength) return text;
  const shortened = text.slice(0, maxLength - 1).replace(/\s+\S*$/, "").trimEnd();
  return `${shortened || text.slice(0, maxLength - 1)}…`;
}

function asRecords(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object")
    : [];
}

function asRecord(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function asStrings(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && Boolean(item.trim())) : [];
}

type RecipeIngredientItem = {
  name: string;
  image: string;
  detail?: string;
};

function normalizeRecipeIngredients(
  recipe: Record<string, unknown>,
  fallbacks: readonly string[],
  maxLength: number,
): RecipeIngredientItem[] {
  const supplied = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
  const imageRecords = asRecords(recipe.ingredient_images);
  return fallbacks.map((fallback, index) => {
    const suppliedIngredient = supplied[index];
    const ingredientRecord = asRecord(suppliedIngredient);
    const imageRecord = imageRecords[index] || {};
    return {
      name: fitEbookText(
        typeof suppliedIngredient === "string"
          ? suppliedIngredient
          : ingredientRecord.name ?? ingredientRecord.title ?? imageRecord.name,
        fallback,
        maxLength,
      ),
      image: asText(
        ingredientRecord.image_url
          ?? ingredientRecord.imageUrl
          ?? imageRecord.image_url
          ?? imageRecord.imageUrl,
        "",
      ),
      detail: fitEbookText(
        ingredientRecord.description
          ?? ingredientRecord.note
          ?? ingredientRecord.benefit
          ?? ingredientRecord.role,
        "",
        84,
      ),
    };
  });
}

function paragraphs(value: unknown, fallback: string[]) {
  const content = asText(value, "");
  const result = content.split(/\n\s*\n|\n/).map((item) => item.trim()).filter(Boolean);
  return result.length ? result : fallback;
}

function conditionLabel(ebook: MobileEbookPayload) {
  return asText(ebook.summary.condition_label, ebook.condition_label || "Wellness");
}

function buildMobileFallback(user: User | null): MobileEbookPayload {
  const condition = user?.conditions?.[0] || user?.condition || "wellness";
  const label = condition.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  const firstName = user?.name?.trim().split(/\s+/)[0] || "there";
  const plan = user?.health_plan || {};
  const conditions = user?.conditions?.length ? user.conditions.map((item) => item.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase())) : [label];

  return {
    condition_id: condition,
    condition_label: label,
    is_premium: false,
    media: DEFAULT_MOBILE_MEDIA,
    summary: {
      greeting: `Welcome, ${firstName}`,
      condition_label: label,
      condition_blurb: asText(plan.summary, `A personalised nutrition guide built around your ${label.toLowerCase()} profile.`),
      personalized_welcome: `Your body is not a problem to fix. This guide helps you understand its signals and build supportive habits that fit your life.`,
      health_snapshot: asText(plan.analysis, `Your responses point to a few connected areas where steady nutrition, recovery, and daily rhythm can offer meaningful support.`),
      nutrition_insights: asText(plan.analysis, "Balanced meals, steady protein, fibre-rich plants, and predictable timing can support more consistent energy."),
      lifestyle_insights: "Sleep, stress, hydration, and gentle movement work together with nutrition to support sustainable progress.",
      path_forward: asText(user?.goal_30day, "Start with small actions you can repeat consistently."),
      all_conditions: conditions,
      goal_30day: user?.goal_30day || null,
      focus_points: Array.isArray(plan.food_rules) ? plan.food_rules : [],
      stats: [
        user?.age ? { label: "Age", value: String(user.age) } : null,
        user?.activity_level ? { label: "Activity", value: user.activity_level.replace(/_/g, " ") } : null,
      ].filter(Boolean),
    },
  };
}

function normalizeMobileEbook(value: unknown, user: User | null): MobileEbookPayload {
  const fallback = buildMobileFallback(user);
  const record = asRecord(value);
  const summary = asRecord(record.summary);
  const media = asRecord(record.media);

  return {
    condition_id: asText(record.condition_id, fallback.condition_id),
    condition_label: asText(record.condition_label, fallback.condition_label),
    is_premium: Boolean(record.is_premium),
    summary: { ...fallback.summary, ...summary },
    media: {
      ...DEFAULT_MOBILE_MEDIA,
      ...Object.fromEntries(Object.entries(media).filter((entry): entry is [string, string] => typeof entry[1] === "string" && Boolean(entry[1]))),
    },
  };
}

function DynamicEbookImage({ mediaKey, fallbackSrc, alt, ...props }: Omit<ImageProps, "src"> & { mediaKey: string; fallbackSrc: ImageProps["src"] }) {
  const { media } = useMobileEbook();
  return <Image {...props} src={media[mediaKey] || fallbackSrc} alt={alt} />;
}

function CoverLeaf() {
  return (
    <svg className={styles.leaf} viewBox="0 0 28 58" fill="none" aria-hidden="true">
      <path d="M13.8 55.5V5.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M13.8 16.2C8.8 14.8 5.8 11.2 5.2 6.3c5.1.8 8.1 4.1 8.6 9.9Z" stroke="currentColor" strokeWidth="1.4" />
      <path d="M13.9 23.8c5.1-1.3 8.4-4.7 9.3-9.8-5.3.5-8.5 3.8-9.3 9.8Z" stroke="currentColor" strokeWidth="1.4" />
      <path d="M13.8 32.2c-5.7-1.3-9.1-4.9-9.8-10.5 5.8.7 9.2 4.2 9.8 10.5Z" stroke="currentColor" strokeWidth="1.4" />
      <path d="M13.9 40.4c5.6-1.4 9.2-5 10.2-10.5-5.8.6-9.3 4.1-10.2 10.5Z" stroke="currentColor" strokeWidth="1.4" />
      <path d="M13.8 48.8c-5.4-1.3-8.8-4.7-9.6-9.9 5.6.6 8.9 4 9.6 9.9Z" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function CoverPage() {
  const { ebook, user } = useMobileEbook();
  const label = conditionLabel(ebook);
  const personalization = asText(
    ebook.summary.goal_30day,
    user?.goal_30day || `Personalized for your unique ${label.toLowerCase()} journey.`,
  );

  return (
    <article className={`${styles.page} ${styles.coverPage}`} aria-label={`Page 1: Your Personalized ${label} Blueprint`}>
        <Image
          src="/ebook/cover-hero.png"
          alt={`Nourishing food selected for a personalized ${label} guide`}
          fill
          priority
          sizes="(max-aspect-ratio: 841/1870) 100vw, 45dvh"
          className={styles.photo}
        />
        <div className={styles.paperWash} aria-hidden="true" />

        <header className={styles.sectionLabel}>
          <CoverLeaf />
          <span>Section 01 — Your Personalized<br />{label} Blueprint</span>
        </header>

        <h1 className={styles.title}>
          <span>Your</span>
          <span>Personalized</span>
          <span>{label}</span>
          <span>Blueprint</span>
        </h1>

        <p className={styles.kicker}>Eat with intention. Heal with food.</p>
        <div className={styles.rule} aria-hidden="true" />
        <p className={styles.personalization}>{personalization}</p>

        <div className={styles.brand}>
          <div>Zen</div>
          <p>Your food intelligence<br />companionship</p>
        </div>

        <blockquote className={styles.quote}>
          <span aria-hidden="true">“</span>
          <p>I&rsquo;m not here to<br />guide your meals.<br />I&rsquo;m here to understand<br />you, support you, and<br />grow with you.”</p>
        </blockquote>

        <div className={styles.pageNumber} aria-hidden="true">01</div>
    </article>
  );
}

function BeginningPage() {
  const { ebook } = useMobileEbook();
  const welcome = paragraphs(ebook.summary.personalized_welcome, [
    "Your body is not a problem to fix, it is a system to understand.",
    "This blueprint helps you reconnect with your body's signals and build sustainable habits that fit your life.",
    "Inside these pages, you will find clarity, compassion, and practical food intelligence.",
  ]);

  return (
    <article className={`${styles.page} ${styles.beginningPage}`} aria-label="Page 2: Your Journey to Balance Starts Here">
      <div className={styles.beginningPhoto}>
        <DynamicEbookImage
          mediaKey="opening_note"
          fallbackSrc="/ebook/note-hero.png"
          alt="Hands holding a warm cup beside soft linen and flowers"
          fill
          priority
          sizes="14dvh"
          className={styles.beginningPhotoImage}
        />
      </div>
      <div className={styles.beginningPaper} aria-hidden="true" />
      <div className={styles.welcomeWord} aria-hidden="true">WELCOME</div>
      <header className={styles.beginningTopline}>ZenPlato <span>|</span> The Beginning</header>

      <section className={styles.beginningCopy}>
        <div className={styles.chapterNumber}>01</div>
        <p className={styles.chapterLabel}>Chapter One</p>
        <div className={styles.chapterRule} aria-hidden="true" />
        <h2>Your Journey<br />to Balance<br />Starts Here.</h2>

        <p className={styles.dropcap}>{welcome[0]}</p>
        <p>{welcome[1] || welcome[0]}</p>

        <div className={styles.bodyRule} aria-hidden="true" />
        <p>{welcome[2] || "Inside these pages, you will find a plan shaped around your needs and daily rhythm."}</p>
        <p className={styles.beginTogether}>Let&rsquo;s begin—together.</p>
      </section>

      <div className={styles.beginningPageNumber} aria-hidden="true">02</div>
    </article>
  );
}

type SnapshotIconName = "hormone" | "insulin" | "inflammation" | "sleep";

function SnapshotIcon({ name }: { name: SnapshotIconName }) {
  return (
    <svg viewBox="0 0 56 56" fill="none" aria-hidden="true">
      {name === "hormone" && <><circle cx="28" cy="28" r="9"/><circle cx="20" cy="28" r="9"/><circle cx="36" cy="28" r="9"/><circle cx="28" cy="20" r="9"/><circle cx="28" cy="36" r="9"/></>}
      {name === "insulin" && <><path d="M28 8C18 19 15 27 15 35c0 8 5.5 14 13 14s13-6 13-14c0-8-3-16-13-27Z"/><circle cx="28" cy="36" r="6"/></>}
      {name === "inflammation" && <><circle cx="28" cy="28" r="10"/><circle cx="28" cy="7" r="1.4" fill="currentColor"/><circle cx="42.8" cy="13.2" r="1.4" fill="currentColor"/><circle cx="49" cy="28" r="1.4" fill="currentColor"/><circle cx="42.8" cy="42.8" r="1.4" fill="currentColor"/><circle cx="28" cy="49" r="1.4" fill="currentColor"/><circle cx="13.2" cy="42.8" r="1.4" fill="currentColor"/><circle cx="7" cy="28" r="1.4" fill="currentColor"/><circle cx="13.2" cy="13.2" r="1.4" fill="currentColor"/></>}
      {name === "sleep" && <><path d="M37 41c-10 1-18-6-18-16 0-6 3-12 8-15-1 4-1 8 1 12 3 7 10 11 18 9-1 5-4 8-9 10Z"/><path d="m39 13 1.5 3 3 1.5-3 1.5-1.5 3-1.5-3-3-1.5 3-1.5 1.5-3Z"/></>}
    </svg>
  );
}

const snapshotConcerns: Array<{ name: SnapshotIconName; title: string; role: string; copy: React.ReactNode }> = [
  { name: "hormone", title: "PCOS", role: "Primary Focus", copy: <>Affects hormonal<br />balance, metabolism,<br />and overall<br />well-being.</> },
  { name: "insulin", title: "Insulin Resistance", role: "Associated Concern", copy: <>May impact energy,<br />weight management,<br />and hormonal<br />balance.</> },
  { name: "inflammation", title: "Inflammation", role: "Associated Concern", copy: <>Can contribute to<br />fatigue, bloating, and<br />hormone imbalances.</> },
  { name: "sleep", title: "Sleep Quality", role: "Additional Concern", copy: <>Affects recovery,<br />hormones, mood, and<br />daily energy levels.</> },
];

function SnapshotPage() {
  const { ebook } = useMobileEbook();
  const dynamicConditions = asStrings(ebook.summary.all_conditions);
  const focusPoints = asStrings(ebook.summary.focus_points);
  const concerns = snapshotConcerns.map((concern, index) => ({
    ...concern,
    title: dynamicConditions[index] || concern.title,
    copy: focusPoints[index] || concern.copy,
  }));
  const snapshotCopy = paragraphs(ebook.summary.health_snapshot, [
    "Your responses show several connected areas where your body is asking for steadier support.",
    "Nutrition, sleep, stress, movement, and recovery all influence how you feel from day to day.",
    "Small, repeatable changes can create meaningful progress over time.",
  ]);

  return (
    <article className={`${styles.page} ${styles.snapshotPage}`} aria-label="Page 3: Your Health Snapshot">
      <DynamicEbookImage mediaKey="health_snapshot" fallbackSrc="/ebook/snapshot-bg.png" alt="" fill sizes="45dvh" className={styles.snapshotBackground} aria-hidden="true" />
      <header className={styles.snapshotTopline}>ZenPlato <span>|</span> 02 Health Snapshot</header>

      <section className={styles.snapshotLeft}>
        <h2>Your<br />Health<br />Snapshot</h2>
        <div className={styles.snapshotTitleRule} aria-hidden="true" />
        <p className={styles.snapshotSideLabel}>Your Selected<br />Conditions &amp; Concerns</p>
        <div className={styles.snapshotConcernList}>
          {concerns.map((concern) => (
            <article className={styles.snapshotConcern} key={concern.title}>
              <div className={styles.snapshotIcon}><SnapshotIcon name={concern.name} /></div>
              <div className={styles.snapshotConcernCopy}>
                <h3>{concern.title}</h3>
                <strong>{concern.role}</strong>
                <p>{concern.copy}</p>
              </div>
            </article>
          ))}
        </div>

        <div className={styles.snapshotBrand}>
          <div>Zen</div>
          <span>Your food intelligence companionship</span>
        </div>
      </section>

      <div className={styles.snapshotSpine} aria-hidden="true"><i /></div>

      <section className={styles.snapshotRight}>
        <p className={styles.snapshotSummaryLabel}>The Personalized Summary</p>
        <div className={styles.snapshotSummaryRule} aria-hidden="true" />
        <blockquote><span aria-hidden="true">“</span>Your body is always<br />communicating.<br />This snapshot helps us<br />listen with clarity.</blockquote>
        <div className={styles.snapshotOrnament} aria-hidden="true"><i /><CoverLeaf /><i /></div>
        <div className={styles.snapshotParagraphs}>
          {snapshotCopy.slice(0, 4).map((copy) => <p key={copy}>{copy}</p>)}
        </div>
      </section>

      <div className={styles.snapshotPageNumber} aria-hidden="true">03</div>
    </article>
  );
}

function FindingsDiagram() {
  return (
    <div className={styles.findingsDiagram} aria-label="Thoughts, hormones, lifestyle and nutrition wellbeing diagram">
      <svg viewBox="0 0 600 620" fill="none" aria-hidden="true">
        <circle cx="300" cy="296" r="196" stroke="#8b806d" strokeWidth="1.2" strokeDasharray="3 6" />
        <circle cx="300" cy="296" r="156" fill="rgba(200,205,177,.28)" stroke="#c7b99f" strokeWidth="1.2" />
        <circle cx="300" cy="296" r="128" fill="rgba(217,220,198,.35)" />
        <path d="M300 205c-21 0-34 17-34 39 0 17 8 29 19 36-12 9-20 23-23 43l-9 66m47-184c21 0 34 17 34 39 0 17-8 29-19 36 12 9 20 23 23 43l9 66m-77-69c18 17 42 17 60 0" stroke="#87916e" strokeWidth="2" opacity=".7" />
        <path d="M300 84v74M300 434v82M96 296h86M418 296h86" stroke="#a77852" strokeWidth="1.2" />
        <circle cx="300" cy="84" r="46" fill="#f6f1e8" stroke="#b58b69" />
        <circle cx="96" cy="296" r="46" fill="#f6f1e8" stroke="#b58b69" />
        <circle cx="504" cy="296" r="46" fill="#f6f1e8" stroke="#b58b69" />
        <circle cx="300" cy="516" r="46" fill="#f6f1e8" stroke="#b58b69" />
        <path d="M269 407C336 346 383 256 426 151" stroke="#697958" strokeWidth="2" />
        <path d="M365 302c34-25 67-30 99-16-25 31-58 39-99 16Zm31-69c26-26 52-35 79-27-16 30-42 40-79 27Zm-78 133c-28-20-53-22-77-8 21 24 46 27 77 8Z" fill="rgba(111,128,83,.42)" stroke="#71805d" />
        <circle cx="300" cy="158" r="4" fill="#82906d"/><circle cx="300" cy="434" r="4" fill="#a87851"/><circle cx="182" cy="296" r="4" fill="#82906d"/><circle cx="418" cy="296" r="4" fill="#82906d"/>
      </svg>
      <span className={styles.diagramThoughts}>Thoughts<br />&amp; Mind</span>
      <span className={styles.diagramHormones}>Biochemistry<br />&amp; Hormones</span>
      <span className={styles.diagramLifestyle}>Lifestyle<br />&amp; Habits</span>
      <span className={styles.diagramDigestion}>Digestion<br />&amp; Nutrition</span>
    </div>
  );
}

function FindingsIntroPage() {
  const { ebook } = useMobileEbook();
  const intro = paragraphs(ebook.summary.condition_blurb, [
    "Your responses reveal patterns across biology, lifestyle, and daily rhythm that deserve your attention.",
    "These insights are clues that help us understand what your body needs to feel supported.",
    "Awareness creates choice, and the right support makes lasting change possible.",
  ]);

  return (
    <article className={`${styles.page} ${styles.findingsIntroPage}`} aria-label="Page 4A: Your Key Findings overview">
      <header className={styles.findingsTopline}>ZenPlato <span>|</span> 01 Your Story</header>
      <div className={styles.findingsTopRule} aria-hidden="true" />
      <CoverLeaf />
      <h2>Your<br /><span>Key Findings</span></h2>
      <div className={styles.findingsTitleRule} aria-hidden="true" />
      <div className={styles.findingsIntroCopy}>
        {intro.slice(0, 3).map((copy) => <p key={copy}>{copy}</p>)}
      </div>
      <FindingsDiagram />
      <blockquote className={styles.findingsQuote}>
        <span aria-hidden="true">“</span>
        <p>The patterns we uncover today<br />become the roadmap<br />for the balance<br />you create tomorrow.</p>
      </blockquote>
      <div className={styles.findingsBrand}><div>Zen</div><span>Your food intelligence companionship</span></div>
      <div className={styles.findingsPageNumber} aria-hidden="true"><i />06<i /></div>
    </article>
  );
}

type FindingIconName = "drop" | "target" | "hormone" | "gut";

function FindingIcon({ name }: { name: FindingIconName }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      {name === "drop" && <><path d="M32 8C20 24 16 34 16 43c0 9 7 15 16 15s16-6 16-15c0-9-4-19-16-35Z"/><path d="M32 25c-6 8-8 13-8 18 0 5 3 8 8 8s8-3 8-8c0-5-2-10-8-18Z"/><circle cx="32" cy="5" r="1.5" fill="currentColor"/><circle cx="51" cy="30" r="1.5" fill="currentColor"/><circle cx="13" cy="30" r="1.5" fill="currentColor"/></>}
      {name === "target" && <><circle cx="32" cy="32" r="22"/><circle cx="32" cy="32" r="15"/><circle cx="32" cy="32" r="7"/></>}
      {name === "hormone" && <><circle cx="32" cy="32" r="10"/><circle cx="23" cy="32" r="10"/><circle cx="41" cy="32" r="10"/><circle cx="32" cy="23" r="10"/><circle cx="32" cy="41" r="10"/></>}
      {name === "gut" && <path d="M23 12v13c0 4 3 7 7 7h4c4 0 7 3 7 7v7c0 5-4 9-9 9h-5c-5 0-9-4-9-9v-5m23-29v12c0 5-4 9-9 9h-3c-4 0-7 3-7 7v11"/>}
    </svg>
  );
}

function BotanicalBranch({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 150 90" fill="none" aria-hidden="true">
      <path d="M8 80C45 63 81 41 139 8" stroke="currentColor" strokeWidth="1.2" />
      <path d="M33 66C20 63 13 56 10 45c13 2 21 9 23 21Zm15-9c-3-13 1-23 12-31 3 13-1 24-12 31Zm20-11c-13-1-22-7-27-18 13 0 22 6 27 18Zm15-10c-2-13 3-23 14-30 2 13-3 23-14 30Zm19-11c-12-2-20-8-24-18 12 1 20 7 24 18Zm16-10c0-8 4-13 12-16 0 8-4 13-12 16Z" fill="rgba(124,136,91,.18)" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

const findingCards: Array<{ icon: FindingIconName; priority: string; title: string; copy: React.ReactNode; accent: string }> = [
  { icon: "drop", priority: "Highest Priority", title: "Insulin Resistance Pattern", copy: <>Your responses suggest signs of insulin resistance,<br />which may be affecting your energy levels, weight<br />management, and hormonal balance.</>, accent: "clay" },
  { icon: "target", priority: "High Impact", title: "Inflammation & Stress Load", copy: <>Chronic inflammation and elevated stress markers<br />may be contributing to fatigue, poor recovery,<br />and hormonal imbalances.</>, accent: "green" },
  { icon: "hormone", priority: "Moderate Impact", title: "Hormonal Imbalance", copy: <>Your hormonal responses indicate potential<br />imbalances that could be influencing mood<br />swings, cravings, and cycle regularity.</>, accent: "green" },
  { icon: "gut", priority: "Foundational Area", title: "Digestive & Gut Health", copy: <>Your digestive health shows room for improvement,<br />which can impact nutrient absorption, immunity,<br />and overall wellbeing.</>, accent: "green" },
];

function FindingsCardsPage() {
  const { ebook } = useMobileEbook();
  const supplied = asRecords(ebook.summary.key_findings);
  const cards = findingCards.map((fallback, index) => {
    const record = supplied[index] || {};
    const compact = asText(ebook.summary[`finding_${index + 1}`], "");
    const [compactTitle, ...compactBody] = compact.split(":");
    return {
      ...fallback,
      priority: asText(record.priority, fallback.priority),
      title: asText(record.title, compactTitle || fallback.title),
      copy: asText(record.description, compactBody.join(":") || "A key pattern from your profile that deserves focused, consistent support."),
    };
  });

  return (
    <article className={`${styles.page} ${styles.findingsCardsPage}`} aria-label="Page 4B: Your Key Findings details">
      <header className={styles.findingsCardsTopline}>ZenPlato <span>|</span> 01 Your Story</header>
      <div className={styles.findingsCardsTopRule} aria-hidden="true" />
      <BotanicalBranch className={styles.findingsCardsTopBranch} />
      <h2>Your<br />Key<br />Findings</h2>
      <div className={styles.findingsCardsTitleRule} aria-hidden="true" />
      <p className={styles.findingsCardsKicker}>The Top Patterns We<br />Identified In Your Profile.</p>
      <BotanicalBranch className={styles.findingsCardsMiddleBranch} />

      <div className={styles.findingCardStack}>
        {cards.map((finding) => (
          <article className={styles.findingCard} key={finding.title}>
            <div className={`${styles.findingCardIcon} ${styles[finding.accent]}`}><FindingIcon name={finding.icon} /></div>
            <div className={`${styles.findingCardSpine} ${styles[finding.accent]}`} aria-hidden="true"><i /></div>
            <div className={styles.findingCardCopy}>
              <strong className={styles[finding.accent]}>{finding.priority}</strong>
              <h3>{finding.title}</h3>
              <p>{finding.copy}</p>
            </div>
          </article>
        ))}
      </div>

      <section className={styles.findingsTakeaway}>
        <p>The Core Takeaway</p>
        <h3>These patterns help us understand what your body needs most right now.</h3>
        <i aria-hidden="true" />
        <span>By addressing these key areas with the right nutrition, lifestyle, and support, you can create meaningful shifts in energy, hormonal balance, and long-term wellbeing.</span>
      </section>
      <BotanicalBranch className={styles.findingsCardsBottomBranch} />
      <div className={styles.findingsCardsBrand}><div>Zen</div><span>Your food intelligence companionship</span></div>
      <div className={styles.findingsCardsPageNumber} aria-hidden="true">04<i /></div>
    </article>
  );
}

type FocusIconName = "balance" | "insulin" | "gut" | "stress" | "sleep" | "leaf";

function FocusIcon({ name }: { name: FocusIconName }) {
  if (name === "insulin") return <SnapshotIcon name="insulin" />;
  if (name === "sleep") return <SnapshotIcon name="sleep" />;
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      {name === "balance" && <><path d="M32 11v37M19 19h26M20 19l-9 18h18L20 19Zm24 0-9 18h18L44 19ZM23 51h18M27 47h10"/><circle cx="32" cy="11" r="2"/></>}
      {name === "gut" && <><path d="M29 10c-5 0-8 3-8 8 0 4 3 7 8 7h9c4 0 7 3 7 7s-3 7-7 7H23c-4 0-7 3-7 7s3 7 7 7h13c3 0 5 2 5 5M34 10c5 0 8 3 8 8 0 4-3 7-8 7H21M26 32h18M27 46h18"/></>}
      {name === "stress" && <><path d="M37 54h-9c0-5-3-8-6-11-3-3-6-7-6-13 0-10 8-18 18-18 9 0 15 6 15 14 0 5-2 9-6 11-2 2-5 2-8 2"/><path d="M35 22c-4 1-6 4-6 8 4 0 7-3 8-7 3 2 4 6 3 9-5 0-8-3-11-7"/></>}
      {name === "leaf" && <><path d="M32 55V11"/><path d="M32 25c-7-1-12-6-14-13 7 1 12 6 14 13Zm0 10c7-1 12-6 14-13-7 1-12 6-14 13Zm0 10c-8-1-13-6-15-13 8 1 13 6 15 13Zm0 8c6-1 11-4 13-10-6 1-11 4-13 10Z"/></>}
    </svg>
  );
}

const focusAreas: Array<{ number: string; title: string; icon: FocusIconName; status: string; progress: string; copy: React.ReactNode }> = [
  { number: "01", title: "Hormonal Balance", icon: "balance", status: "Needs Attention", progress: "48%", copy: <>Your hormones may benefit from<br />more consistent support through<br />nutrition, stress management, and<br />quality sleep.</> },
  { number: "02", title: "Insulin Sensitivity", icon: "insulin", status: "Needs Attention", progress: "49%", copy: <>Improving insulin response can<br />help support steady energy,<br />balanced mood, and long-term<br />metabolic health.</> },
  { number: "03", title: "Digestive Health", icon: "gut", status: "Moderate", progress: "68%", copy: <>Your gut health shows room for<br />improvement to support better<br />absorption and reduce bloating.</> },
  { number: "04", title: "Stress & Recovery", icon: "stress", status: "Needs Attention", progress: "40%", copy: <>Your body may benefit from<br />deeper recovery to improve<br />resilience and hormonal harmony.</> },
  { number: "05", title: "Sleep Quality", icon: "sleep", status: "Needs Attention", progress: "49%", copy: <>Better sleep consistency can<br />positively impact hormones,<br />energy levels, and overall<br />well-being.</> },
  { number: "06", title: "Inflammation Level", icon: "leaf", status: "Moderate", progress: "63%", copy: <>Moderate inflammation detected.<br />Anti-inflammatory foods and<br />lifestyle habits can make a<br />meaningful difference.</> },
];

function FocusAreasPage() {
  const { ebook } = useMobileEbook();
  const supplied = asRecords(ebook.summary.key_health_focus_areas);
  const areas = focusAreas.map((fallback, index) => {
    const record = supplied[index] || {};
    return {
      ...fallback,
      title: asText(record.title, fallback.title),
      status: asText(record.status, fallback.status),
      progress: typeof record.progress === "number" ? `${record.progress}%` : fallback.progress,
      copy: asText(record.description, "A focused area in your personalised health plan."),
    };
  });

  return (
    <article className={`${styles.page} ${styles.focusAreasPage}`} aria-label="Page 5: Key Health Focus Areas">
      <header className={styles.focusTopline}>ZenPlato <span>|</span> 02 Health Snapshot</header>
      <div className={styles.focusTopRule} aria-hidden="true" />
      <BotanicalBranch className={styles.focusTopBranch} />
      <h2>Key Health<br />Focus Areas</h2>
      <div className={styles.focusTitleRule} aria-hidden="true" />
      <p className={styles.focusKicker}>Six Pillars.<br />One Balanced You.</p>
      <p className={styles.focusIntro}>These six areas represent the<br />core systems influencing your<br />health and wellbeing. Each tile<br />reflects your current status<br />based on your responses and<br />where your body may benefit<br />most from support.</p>

      <div className={styles.focusGrid}>
        {areas.map((area) => (
          <article className={styles.focusCard} key={area.number}>
            <div className={styles.focusEyebrow}>{area.number}<span>|</span>{area.title}</div>
            <div className={styles.focusCardHeading}>
              <div className={styles.focusIcon}><FocusIcon name={area.icon} /></div>
              <h3>{area.title}</h3>
            </div>
            <strong>{area.status}</strong>
            <div className={styles.focusProgress} aria-hidden="true"><i style={{ width: area.progress }} /></div>
            <p>{area.copy}</p>
          </article>
        ))}
      </div>

      <div className={styles.focusRemember}>
        <div className={styles.focusSpark} aria-hidden="true">✦</div>
        <div><strong>Remember</strong><p>Small, consistent actions across these areas create powerful, long-lasting transformation.</p></div>
        <BotanicalBranch />
      </div>
      <div className={styles.focusPageNumber} aria-hidden="true">03</div>
    </article>
  );
}

type ProfileIconName = "age" | "gender" | "height" | "weight";

function ProfileIcon({ name }: { name: ProfileIconName }) {
  return (
    <svg viewBox="0 0 44 44" fill="none" aria-hidden="true">
      {name === "age" && <><circle cx="22" cy="14" r="6"/><path d="M11 34c2-8 6-12 11-12s9 4 11 12"/></>}
      {name === "gender" && <><circle cx="22" cy="17" r="8"/><path d="M22 25v12M17 32h10"/></>}
      {name === "height" && <><rect x="8" y="14" width="28" height="16" rx="5"/><path d="M13 14v5M18 14v3M23 14v5M28 14v3M33 14v5"/></>}
      {name === "weight" && <><path d="M9 14h26l2 22H7l2-22Z"/><path d="M15 14c1-6 3-9 7-9s6 3 7 9M18 22l4 4 4-4"/></>}
    </svg>
  );
}

const profileRows: Array<{ icon: ProfileIconName; label: string; value: string }> = [
  { icon: "age", label: "Age", value: "29 Years" },
  { icon: "gender", label: "Gender", value: "Female" },
  { icon: "height", label: "Height", value: "163 cm" },
  { icon: "weight", label: "Weight", value: "62 kg" },
];

const selectedConditions = ["PCOS", "Insulin Resistance", "Hormonal Acne", "Fatigue & Low Energy", "Bloating & Digestive Issues", "Stress & Anxiety"];

function PersonalizedSummaryPage() {
  const { ebook, user } = useMobileEbook();
  const rows = profileRows.map((row) => {
    const values: Record<string, string | undefined> = {
      Age: user?.age ? `${user.age} Years` : undefined,
      Gender: user?.gender ? user.gender.replace(/\b\w/g, (letter) => letter.toUpperCase()) : undefined,
      Height: user?.height_cm ? `${user.height_cm} cm` : undefined,
      Weight: user?.weight_kg ? `${user.weight_kg} kg` : undefined,
    };
    return { ...row, value: values[row.label] || row.value };
  });
  const conditions = asStrings(ebook.summary.all_conditions);
  const narrative = paragraphs(ebook.summary.health_snapshot, [
    "Your responses reveal a body working hard to maintain balance while a few connected systems ask for support.",
    asText(ebook.summary.nutrition_insights, "Your nutrition patterns can support steadier energy, mood, digestion, and recovery."),
    asText(ebook.summary.lifestyle_insights, "Small, consistent shifts in food, sleep, movement, and stress care can create meaningful progress."),
  ]);
  const pathForward = asText(ebook.summary.path_forward, "This snapshot is the first step toward a plan that fits your patterns, preferences, and goals.");

  return (
    <article className={`${styles.page} ${styles.personalizedPage}`} aria-label="Page 6: Personalized health summary">
      <header className={styles.personalizedTopline}>ZenPlato <span>|</span> 01 Your Story</header>
      <div className={styles.personalizedTopRule} aria-hidden="true" />
      <BotanicalBranch className={styles.personalizedTopBranch} />

      <aside className={styles.personalizedSidebar}>
        <h2>Your<br />Health<br />Snapshot</h2>
        <i className={styles.personalizedTitleRule} aria-hidden="true" />
        <p className={styles.personalizedKicker}>A Personalized View<br />Of Your Wellbeing<br />Journey.</p>

        <h3>Selected Profile</h3>
        <div className={styles.profileCard}>
          {rows.map((row) => (
            <div className={styles.profileRow} key={row.label}>
              <div className={styles.profileIcon}><ProfileIcon name={row.icon} /></div>
              <div><strong>{row.label}</strong><span>{row.value}</span></div>
            </div>
          ))}
        </div>

        <h3 className={styles.conditionsLabel}>Selected Conditions<br />&amp; Concerns</h3>
        <div className={styles.conditionList}>
          {(conditions.length ? conditions : selectedConditions).slice(0, 6).map((condition) => <div key={condition}><i />{condition}</div>)}
        </div>
        <BotanicalBranch className={styles.personalizedBottomBranch} />
      </aside>

      <section className={styles.narrativePanel}>
        <p className={styles.narrativeLabel}>Personalized Narrative Analysis</p>
        <i className={styles.narrativeRule} aria-hidden="true" />
        <h2>Here&rsquo;s what your<br />body is <em>telling us.</em></h2>
        <p className={styles.narrativeLead}>{narrative[0]}</p>
        <div className={styles.narrativeQuote} aria-hidden="true">“</div>
        <div className={styles.narrativeBody}>
          {narrative.slice(1, 4).map((copy) => <p key={copy}>{copy}</p>)}
        </div>
        <div className={styles.pathForward}>
          <div className={styles.pathIcon}><CoverLeaf /></div>
          <div><strong>Your Path Forward</strong><p>{pathForward}</p></div>
        </div>
      </section>

      <div className={styles.personalizedPageNumber} aria-hidden="true"><i />01<i /></div>
    </article>
  );
}

type GlanceIconName = "search" | "star" | "trend" | "heart";

function GlanceIcon({ name }: { name: GlanceIconName }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      {name === "search" && <><circle cx="28" cy="28" r="14"/><path d="m39 39 12 12"/></>}
      {name === "star" && <path d="m32 10 6 14 15 1-11 10 3 15-13-8-13 8 3-15-11-10 15-1 6-14Z"/>}
      {name === "trend" && <><path d="m12 46 15-15 10 9 16-18"/><path d="M43 22h10v10"/></>}
      {name === "heart" && <path d="M32 51S14 40 14 25c0-7 5-11 11-11 4 0 6 2 7 5 1-3 4-5 8-5 6 0 10 4 10 11 0 15-18 26-18 26Z"/>}
    </svg>
  );
}

const glanceMetrics: Array<{ icon: GlanceIconName; value: string; label: React.ReactNode; copy: React.ReactNode; accent?: boolean }> = [
  { icon: "search", value: "6", label: <>Focus Areas<br />Analyzed</>, copy: <>Key areas of your health<br />have been assessed based<br />on your responses.</> },
  { icon: "star", value: "3", label: <>Priority Needs</>, copy: <>Areas that need your<br />immediate attention and<br />consistent support.</>, accent: true },
  { icon: "trend", value: "2", label: <>Moderate<br />Status</>, copy: <>Areas showing moderate<br />balance with room for<br />improvement.</> },
  { icon: "heart", value: "1", label: <>Strong<br />Areas</>, copy: <>Areas where your body<br />is functioning well and<br />showing good resilience.</> },
];

function AtGlancePage() {
  const { ebook } = useMobileEbook();
  const supplied = asRecords(ebook.summary.at_glance).length
    ? asRecords(ebook.summary.at_glance)
    : asRecords(ebook.summary.stats);
  const metrics = glanceMetrics.map((fallback, index) => {
    const record = supplied[index] || {};
    return {
      ...fallback,
      value: asText(record.value, fallback.value),
      label: asText(record.label, typeof fallback.label === "string" ? fallback.label : `Health insight ${index + 1}`),
      copy: asText(record.description, "Personalized from your profile and onboarding responses."),
    };
  });
  const nextHeadline = asText(ebook.summary.next_best_step_headline, "Personalized. Practical. Powerful.");
  const nextBody = asText(ebook.summary.next_best_step_body, "Your plan is shaped around your biology, lifestyle, and goals so the next action feels realistic.");

  return (
    <article className={`${styles.page} ${styles.glancePage}`} aria-label="Page 7: At a Glance">
      <header className={styles.glanceTopline}>ZenPlato <span>|</span> 02 Health Snapshot</header>
      <div className={styles.glanceTopRule} aria-hidden="true" />
      <BotanicalBranch className={styles.glanceTopBranch} />
      <h2>At a Glance</h2>
      <div className={styles.glanceTitleRule} aria-hidden="true" />
      <p className={styles.glanceKicker}>A Quick Overview Of Your<br />Current Health Insights.</p>

      <div className={styles.glanceGrid}>
        {metrics.map((metric) => (
          <article className={styles.glanceCard} key={metric.value}>
            <div className={`${styles.glanceIcon} ${metric.accent ? styles.glanceAccent : ""}`}><GlanceIcon name={metric.icon} /></div>
            <div className={`${styles.glanceValue} ${metric.accent ? styles.glanceAccent : ""}`}>{metric.value}</div>
            <i className={styles.glanceCardRule} aria-hidden="true" />
            <h3 className={metric.accent ? styles.glanceAccent : ""}>{metric.label}</h3>
            <p>{metric.copy}</p>
          </article>
        ))}
      </div>

      <div className={styles.glanceLowerRule} aria-hidden="true" />
      <section className={styles.glanceNext}>
        <p>Your Next Best Step</p>
        <i aria-hidden="true" />
        <h3>{nextHeadline}</h3>
        <span>{nextBody}</span>
        <button type="button">View Your Plan <b aria-hidden="true">→</b></button>
      </section>
      <BotanicalBranch className={styles.glanceBottomBranch} />
      <div className={styles.glancePageNumber} aria-hidden="true">03<i /></div>
    </article>
  );
}

function OpportunityThreePage() {
  const { ebook } = useMobileEbook();
  const opportunities = asRecords(ebook.summary.biggest_opportunities);
  const opportunity = opportunities[2] || (typeof ebook.summary.opportunity_3 === "object" && ebook.summary.opportunity_3 ? ebook.summary.opportunity_3 as Record<string, unknown> : {});
  const copy = asStrings(opportunity.paragraphs);

  return (
    <article className={`${styles.page} ${styles.opportunityThreePage}`} aria-label="Page 8: Your third biggest opportunity">
      <DynamicEbookImage
        mediaKey="opportunity"
        fallbackSrc="/ebook/opportunity-three-phone-reference.png"
        alt="A supportive wellness scene for your third opportunity"
        fill
        sizes="45dvh"
        className={styles.opportunityScenicPhoto}
      />
      <div className={styles.opportunityHeaderMask} aria-hidden="true" />
      <header className={styles.opportunityTopline}>ZenPlato <span>|</span> 01 Your Story</header>
      <div className={styles.opportunityTopRule} aria-hidden="true" />
      <BotanicalBranch className={styles.opportunityTopBranch} />
      <section className={styles.opportunityPanel}>
        <BotanicalBranch className={styles.opportunityPanelBranch} />
        <p className={styles.opportunityKicker}>Your Biggest Opportunities</p>
        <i className={styles.opportunityShortRule} aria-hidden="true" />
        <div className={styles.opportunityNumber}>03</div>
        <i className={styles.opportunityClayRule} aria-hidden="true" />
        <h2>{asText(opportunity.title, "Your next area of growth")}</h2>
        <i className={styles.opportunityGreenRule} aria-hidden="true" />
        <div className={styles.opportunityText}>
          {(copy.length ? copy : [
            "This opportunity supports deeper harmony between your body, mind, and daily rhythm.",
            "Your responses suggest it can influence your wellbeing and long-term vitality.",
            "Small, repeatable actions here can build resilience, clarity, and confidence.",
          ]).slice(0, 4).map((item) => <p key={item}>{item}</p>)}
        </div>
        <div className={styles.opportunityPanelFooter} aria-hidden="true"><i /><b /><i /></div>
      </section>
    </article>
  );
}

function OpportunityOnePage() {
  const { ebook } = useMobileEbook();
  const opportunities = asRecords(ebook.summary.biggest_opportunities);
  const opportunity = opportunities[0] || (typeof ebook.summary.opportunity_1 === "object" && ebook.summary.opportunity_1 ? ebook.summary.opportunity_1 as Record<string, unknown> : {});
  const copy = asStrings(opportunity.paragraphs);

  return (
    <article className={`${styles.page} ${styles.opportunityOnePage}`} aria-label="Page 9: Your first biggest opportunity">
      <DynamicEbookImage mediaKey="opportunity" fallbackSrc="/ebook/opportunity-botanical.png" alt="Artwork selected for your highest-impact opportunity" fill sizes="45dvh" className={styles.opportunityBotanical} />
      <header className={styles.opportunityOneTopline}>ZenPlato <span>|</span> 01 Your Story</header>
      <section className={styles.opportunityOneCopy}>
        <p className={styles.opportunityOneKicker}>Your Biggest Opportunities</p>
        <i className={styles.opportunityOneShortRule} aria-hidden="true" />
        <div className={styles.opportunityOneNumber}>01</div>
        <i className={styles.opportunityOneClayRule} aria-hidden="true" />
        <h2>{asText(opportunity.title, "Your highest-impact opportunity")}</h2>
        <i className={styles.opportunityOneGreenRule} aria-hidden="true" />
        <div className={styles.opportunityOneBody}>
          {(copy.length ? copy : [
            "This area has strong potential to improve your energy, balance, and long-term wellbeing.",
            "Your responses connect this opportunity to how your body adapts each day.",
            "Consistent small steps here can create improvements across your overall health.",
            "This is where awareness becomes action and action becomes lasting change.",
          ]).slice(0, 4).map((item) => <p key={item}>{item}</p>)}
        </div>
      </section>
      <div className={styles.opportunityOneBrand}><div>Zen</div><span>Your food intelligence companionship</span></div>
      <div className={styles.opportunityOnePageNumber} aria-hidden="true"><i />08<i /></div>
    </article>
  );
}

type MobileGroceryItem = {
  name: string;
  copy: string;
  image: string;
  tags: string[];
};

type MobileGroceryCategory = {
  title: string;
  summary: string;
  items: MobileGroceryItem[];
};

const groceryColumns = [
  {
    title: "Protein Sources",
    items: [
      ["Chicken Breast", "Lean, high in protein, and rich in essential nutrients."],
      ["Eggs", "Versatile and packed with high-quality protein."],
      ["Fish (Salmon, Tuna)", "Omega-3 fats support heart and brain health."],
      ["Tofu", "A plant-based protein for muscle and bone health."],
      ["Lentils & Pulses", "High in protein, fiber, and iron."],
      ["Greek Yogurt", "Protein and probiotics help support gut health."],
    ],
    summary: "Protein helps build and repair tissue while supporting strength, fullness, and steady energy.",
  },
  {
    title: "Vegetables",
    items: [
      ["Spinach", "Rich in iron, calcium, and protective antioxidants."],
      ["Broccoli", "Fiber and vitamin C support digestion and immunity."],
      ["Bell Peppers", "Colorful, crisp, and naturally high in vitamin C."],
      ["Carrots", "Beta-carotene helps support healthy eyes and skin."],
      ["Zucchini", "Hydrating, fiber-rich, and easy to add to meals."],
      ["Cherry Tomatoes", "Lycopene and vitamin C support heart health."],
    ],
    summary: "A colorful vegetable mix adds fiber, vitamins, minerals, and satisfying volume to everyday meals.",
  },
  {
    title: "Fruits",
    items: [
      ["Bananas", "Potassium and natural carbohydrates provide easy energy."],
      ["Berries", "Antioxidants and vitamin C support everyday wellness."],
      ["Apples", "Fiber helps support digestion and lasting fullness."],
      ["Oranges", "Juicy, hydrating, and naturally rich in vitamin C."],
      ["Avocado", "Healthy fats, vitamins, and fiber support balanced meals."],
      ["Grapes", "Hydrating fruit with naturally protective antioxidants."],
    ],
    summary: "Fruit brings natural sweetness, hydration, fiber, and a broad mix of protective plant nutrients.",
  },
] as const;

const groceryCategoryMeta = [
  {
    kicker: "Build your plate",
    hero: "/ebook/grocery-essentials-bg.png",
    heroAlt: "A reusable grocery bag filled with wholesome staples",
    accent: "Strength · Fullness · Recovery",
  },
  {
    kicker: "Eat more color",
    hero: "/ebook/grocery-vegetables-bg.png",
    heroAlt: "A basket filled with fresh colorful vegetables",
    accent: "Fiber · Variety · Everyday energy",
  },
  {
    kicker: "Naturally nourishing",
    hero: "/ebook/grocery-fruits-bg.png",
    heroAlt: "A basket filled with fresh colorful fruit",
    accent: "Hydration · Antioxidants · Balance",
  },
] as const;

const proteinSpritePositions = [
  "5.2% 40%", "5.2% 46.6%", "5.2% 53.4%", "5.2% 59%", "5.2% 65.7%", "5.2% 72.4%",
] as const;

const groceryFruitSpritePositions = [
  "11.7% 30.2%", "48.6% 30.2%", "87.3% 30.2%",
  "11.7% 45.1%", "48.6% 45.1%", "87.3% 45.1%",
] as const;

function normalizeGroceryItem(value: unknown, fallback: readonly [string, string]): MobileGroceryItem {
  if (typeof value === "string") {
    const [name, ...descriptionParts] = value.split(/[:|]/);
    return {
      name: fitEbookText(name, fallback[0], 38),
      copy: fitEbookText(descriptionParts.join(" "), fallback[1], 92),
      image: "",
      tags: [],
    };
  }

  const record = asRecord(value);
  const tags = [
    ...asStrings(record.tags),
    ...asStrings(record.benefits),
  ].slice(0, 2);

  return {
    name: fitEbookText(record.name ?? record.title, fallback[0], 38),
    copy: fitEbookText(record.description ?? record.body, fallback[1], 92),
    image: asText(record.image_url ?? record.imageUrl, ""),
    tags: tags.map((tag) => fitEbookText(tag, "", 22)).filter(Boolean),
  };
}

function normalizeGroceryCategory(value: unknown, fallback: typeof groceryColumns[number]): MobileGroceryCategory {
  const category = asRecord(value);
  const supplied = Array.isArray(value)
    ? value
    : Array.isArray(category.items)
      ? category.items
      : [];

  return {
    title: fitEbookText(category.title, fallback.title, 34),
    summary: fitEbookText(category.summary, fallback.summary, 130),
    items: fallback.items.map((item, index) => normalizeGroceryItem(supplied[index], item)),
  };
}

function grocerySpriteStyle(categoryIndex: number, itemIndex: number): React.CSSProperties {
  if (categoryIndex === 1) {
    return {
      backgroundImage: "url('/ebook/grocery-vegetables-bg.png')",
      ...produceSpriteStyle("vegetable", itemIndex),
    };
  }
  if (categoryIndex === 2) {
    return {
      backgroundImage: "url('/ebook/grocery-fruits-bg.png')",
      backgroundPosition: groceryFruitSpritePositions[itemIndex] || "50% 50%",
      backgroundSize: "650% auto",
    };
  }
  return {
    backgroundImage: "url('/ebook/grocery-essentials-bg.png')",
    backgroundPosition: proteinSpritePositions[itemIndex] || "5.2% 50%",
    backgroundSize: "850% auto",
  };
}

function GroceryEssentialsPhonePage({ categoryIndex }: { categoryIndex: number }) {
  const { ebook } = useMobileEbook();
  const grocery = asRecord(ebook.summary.grocery_list);
  const sourceKeys = ["protein_sources", "vegetables", "fruits"];
  const fallback = groceryColumns[categoryIndex] || groceryColumns[0];
  const category = normalizeGroceryCategory(grocery[sourceKeys[categoryIndex]], fallback);
  const meta = groceryCategoryMeta[categoryIndex] || groceryCategoryMeta[0];
  const intro = fitEbookText(
    grocery.intro,
    "A clear, practical grocery starting point selected for your current goals.",
    118,
  );

  return (
    <article className={`${styles.page} ${styles.laterEditorialPage} ${styles.laterWarmPage} ${styles.groceryPage}`} aria-label={`Grocery Essentials: ${category.title}`}>
      <LaterEbookChrome section="08" warm />
      <section className={styles.groceryIntro}>
        <p>{meta.kicker} <span>{String(categoryIndex + 1).padStart(2, "0")} / 03</span></p>
        <h2>{category.title}</h2>
        <div aria-hidden="true"><i /><BotanicalBranch /><i /></div>
        <span>{intro}</span>
      </section>

      <div className={styles.groceryHero}>
        <Image src={meta.hero} alt={meta.heroAlt} fill sizes="22dvh" priority={categoryIndex === 0} />
        <span>{String(categoryIndex + 1).padStart(2, "0")}</span>
      </div>

      <section className={styles.groceryItems} aria-label={`${category.title} grocery items`}>
        {category.items.map((item, index) => (
          <article className={styles.groceryItem} key={`${item.name}-${index}`}>
            <div className={styles.groceryItemImage} style={grocerySpriteStyle(categoryIndex, index)}>
              {item.image ? <Image src={item.image} alt="" fill sizes="7dvh" /> : null}
            </div>
            <div>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.name}</h3>
              <p>{item.copy}</p>
              {item.tags.length ? <small>{item.tags.join(" · ")}</small> : null}
            </div>
          </article>
        ))}
      </section>

      <section className={styles.grocerySummary}>
        <div aria-hidden="true"><CoverLeaf /></div>
        <div>
          <p>{meta.accent}</p>
          <strong>{category.summary}</strong>
        </div>
      </section>
      <LaterEbookFolio>{categoryIndex + 1} / 3</LaterEbookFolio>
    </article>
  );
}

function UnderstandingJourneyPage() {
  const { ebook } = useMobileEbook();
  const label = conditionLabel(ebook);

  return (
    <article className={`${styles.page} ${styles.understandingJourneyPage}`} aria-label={`Page 11A: Understanding Your ${label} Journey`}>
      <DynamicEbookImage mediaKey="understanding_journey" fallbackSrc="/ebook/understanding-pcos-journey.png" alt={`A calm scene introducing your ${label} journey`} fill sizes="45dvh" className={styles.understandingJourneyPhoto} />
      <div className={styles.understandingJourneyWash} aria-hidden="true" />
      <header className={styles.understandingJourneyTopline}>ZenPlato <span>|</span> 02 Hormonal Rhythms</header>
      <div className={styles.understandingJourneyTopRule} aria-hidden="true" />
      <BotanicalBranch className={styles.understandingJourneyTopBranch} />
      <section className={styles.understandingJourneyTitle}>
        <p>Section 02</p>
        <h2>Understanding<br />Your {label}<br />Journey</h2>
        <div aria-hidden="true"><i /><BotanicalBranch /><i /></div>
      </section>
      <div className={styles.understandingJourneyPageNumber} aria-hidden="true"><i />11<i /></div>
    </article>
  );
}

type UnderstandingIconName = "leaf" | "balance" | "sunrise";

function UnderstandingIcon({ name }: { name: UnderstandingIconName }) {
  if (name === "leaf") return <FocusIcon name="leaf" />;
  if (name === "balance") return <FocusIcon name="balance" />;
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M10 41h44M17 49h30M24 56h16M19 36c2-10 7-15 13-15s11 5 13 15M32 8v7M12 22l5 4M52 22l-5 4M20 12l4 6M44 12l-4 6" />
    </svg>
  );
}

const understandingRows: Array<{ icon: UnderstandingIconName; title: string; copy: React.ReactNode }> = [
  { icon: "leaf", title: "What It Means", copy: <>PCOS (Polycystic Ovary Syndrome) is<br />a hormonal condition that affects how<br />your ovaries and hormones function.<br />It can influence ovulation, hormone<br />balance, and metabolism in unique<br />and complex ways.</> },
  { icon: "balance", title: "Why It Matters", copy: <>Understanding PCOS helps you identify<br />the underlying imbalances rather than<br />just managing symptoms. With the right<br />knowledge and support, your body can<br />heal, recalibrate, and thrive.</> },
  { icon: "sunrise", title: "How It May Affect Daily Life", copy: <>PCOS can show up as irregular cycles,<br />fatigue, mood shifts, skin changes,<br />weight fluctuations, or fertility challenges.<br />Recognizing these patterns is the first<br />step toward creating lasting positive<br />change.</> },
];

function UnderstandingDetailPhonePage() {
  const { ebook } = useMobileEbook();
  const label = conditionLabel(ebook);
  const supplied = asRecords(ebook.summary.understanding_items);
  const rows = understandingRows.map((fallback, index) => {
    const record = supplied[index] || {};
    return {
      ...fallback,
      title: asText(record.title, typeof fallback.title === "string" ? fallback.title : "How It May Affect Daily Life"),
      copy: asText(record.body, `Personalized guidance about ${label.toLowerCase()} based on your profile and goals.`),
    };
  });

  return (
    <article className={`${styles.page} ${styles.understandingDetailPage}`} aria-label={`Page 11B: Understanding ${label}`}>
      <header className={styles.understandingDetailTopline}>ZenPlato <span>|</span> 02 Hormonal Rhythms</header>
      <div className={styles.understandingDetailTopRule} aria-hidden="true" />
      <BotanicalBranch className={styles.understandingDetailTopBranch} />
      <div className={styles.understandingDetailPhoto}>
        <DynamicEbookImage mediaKey="understanding_detail" fallbackSrc="/ebook/phone-understanding-detail.png" alt={`A reflective wellness scene for understanding ${label}`} fill sizes="45dvh" />
      </div>

      <section className={styles.understandingDetailContent}>
        <h2>Understanding<br />{label}</h2>
        <div className={styles.understandingDetailDivider} aria-hidden="true"><i /><BotanicalBranch /><i /></div>
        <div className={styles.understandingDetailRows}>
          {rows.map((row) => (
            <article className={styles.understandingDetailRow} key={String(row.title)}>
              <div className={styles.understandingDetailIcon}><UnderstandingIcon name={row.icon} /></div>
              <div className={styles.understandingDetailDot} aria-hidden="true" />
              <div><h3>{row.title}</h3><p>{row.copy}</p></div>
            </article>
          ))}
        </div>
      </section>
      <div className={styles.understandingDetailPageNumber} aria-hidden="true"><i />13<i /></div>
    </article>
  );
}

type SymptomIconName = "hormones" | "bloodSugar" | "cravings" | "daily";

function SymptomIcon({ name }: { name: SymptomIconName }) {
  if (name === "hormones") return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <circle cx="18" cy="22" r="6" /><circle cx="43" cy="17" r="5" /><circle cx="45" cy="43" r="7" /><circle cx="18" cy="45" r="4" />
      <path d="m23 20 15-2M21 27l20 12M22 44l16-1" />
    </svg>
  );
  if (name === "bloodSugar") return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M20 11c0 0-10 13-10 21a10 10 0 0 0 20 0c0-8-10-21-10-21Z" />
      <path d="m35 28 10-6 10 6v13l-10 6-10-6V28Zm0 0 10 6 10-6M45 34v13" />
    </svg>
  );
  if (name === "cravings") return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M17 29h26l-3 21H20l-3-21Z" /><path d="M20 29c0-6 4-10 9-10 2-5 10-5 12 1 5 0 8 4 8 9H20ZM25 35l2 10M34 35v10" />
      <path d="M13 18c-4-2-5-7-2-10M18 16c-1-4 1-7 4-9" />
    </svg>
  );
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <circle cx="25" cy="18" r="7" /><path d="M13 51c1-12 5-20 12-20s11 8 12 20M18 37l-7 9M32 37l8 9" />
      <path d="M39 13c1-5 5-8 10-8 6 0 10 4 10 9s-4 9-10 9h-3l-6 5 2-7c-3-2-4-5-3-8Z" />
    </svg>
  );
}

const symptomSteps: Array<{ icon: SymptomIconName; title: string; copy: string }> = [
  { icon: "hormones", title: "Hormonal Changes", copy: "Hormonal imbalances—especially elevated androgens and insulin resistance—disrupt normal ovulation and throw your body’s systems off balance." },
  { icon: "bloodSugar", title: "Blood Sugar Fluctuations", copy: "These hormonal shifts affect how your body processes glucose, leading to spikes and crashes in blood sugar throughout the day." },
  { icon: "cravings", title: "Cravings & Energy Dips", copy: "Blood sugar ups and downs trigger intense cravings, irritability, and fatigue as your body struggles to find steady fuel and balance." },
  { icon: "daily", title: "Daily Challenges", copy: "The cycle shows up in real life—through mood swings, low energy, poor sleep, skin flare-ups, weight changes, and fertility struggles." },
];

function WhySymptomsPhonePage() {
  const { ebook } = useMobileEbook();
  const supplied = asRecords(ebook.summary.symptom_flow_steps);
  const steps = symptomSteps.map((fallback, index) => {
    const record = supplied[index] || {};
    return {
      ...fallback,
      title: asText(record.title, fallback.title),
      copy: asText(record.body, fallback.copy),
    };
  });
  const takeaway = asText(ebook.summary.symptom_flow_takeaway, "Understanding the why behind your symptoms is the first step toward lasting balance and healing.");

  return (
    <article className={`${styles.page} ${styles.symptomPage}`} aria-label="Page 12: Why Symptoms Happen">
      <header className={styles.symptomTopline}>ZenPlato <span>|</span> 02 Hormonal Rhythms</header>
      <div className={styles.symptomTopRule} aria-hidden="true" />
      <BotanicalBranch className={styles.symptomTopBranch} />
      <div className={styles.symptomPhoto}>
        <DynamicEbookImage mediaKey="symptoms" fallbackSrc="/ebook/phone-why-symptoms.png" alt="A calm journal and wellness scene" fill sizes="45dvh" />
      </div>
      <section className={styles.symptomContent}>
        <h2>Why Symptoms<br />Happen</h2>
        <div className={styles.symptomDivider} aria-hidden="true"><i /><BotanicalBranch /><i /></div>
        <div className={styles.symptomSteps}>
          {steps.map((step, index) => (
            <article className={styles.symptomStep} key={step.title}>
              <div className={styles.symptomIcon}><SymptomIcon name={step.icon} /></div>
              {index < steps.length - 1 && <div className={styles.symptomConnector} aria-hidden="true">↓</div>}
              <div className={styles.symptomIndex}>{String(index + 1).padStart(2, "0")}.</div>
              <div><h3>{step.title}</h3><p>{step.copy}</p></div>
            </article>
          ))}
        </div>
      </section>
      <blockquote className={styles.symptomTakeaway}>
        <BotanicalBranch />
        <p>{takeaway}</p>
      </blockquote>
      <div className={styles.symptomPageNumber} aria-hidden="true"><i />14<i /></div>
    </article>
  );
}

type NutritionIconName = "energy" | "cravings" | "balance" | "health";

function NutritionIcon({ name }: { name: NutritionIconName }) {
  if (name === "energy") return <svg viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="m35 7-15 27h12l-4 23 17-30H33l2-20Z" /><path d="M13 17l5 4M9 34h7M13 51l5-4M51 17l-5 4M55 34h-7M51 51l-5-4" /></svg>;
  if (name === "cravings") return <svg viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M31 49V35c-6 0-12-4-12-11 0-8 7-13 14-10 5-6 16-2 16 6 6 2 8 10 4 15-3 4-8 5-13 5M31 35c5 0 8-2 10-6M39 48c0-9-2-13-8-13M27 22c4 0 7 3 7 7" /></svg>;
  if (name === "balance") return <svg viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M32 8v40M22 53h20M15 17h34M32 11l-17 6M32 11l17 6M15 17 7 18h14l-7-18ZM49 17l-7 18h14l-7-18ZM9 35c2 5 12 5 14 0M42 35c2 5 12 5 14 0" /></svg>;
  return <svg viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M32 56V17M32 46c-9 0-15-6-16-15 9 0 15 6 16 15ZM32 36c9 0 15-6 16-15-9 0-15 6-16 15ZM32 25c-6 0-10-4-11-10 6 0 10 4 11 10ZM32 19c5 0 9-4 10-10-6 0-10 4-10 10Z" /></svg>;
}

const nutritionInfluences: Array<{ icon: NutritionIconName; title: string; copy: string }> = [
  { icon: "energy", title: "Energy", copy: "The right nutrients help stabilize blood sugar and support steady energy throughout the day—so you can feel more awake, focused, and resilient." },
  { icon: "cravings", title: "Cravings", copy: "Balanced meals and blood sugar stability can reduce intense cravings and help you feel more satisfied and in control." },
  { icon: "balance", title: "Hormonal Balance", copy: "Nutrition plays a powerful role in regulating hormones like insulin, estrogen, and testosterone—supporting ovulation, mood, and cycle regularity." },
  { icon: "health", title: "Long-Term Health", copy: "Nourishing your body today supports your future—reducing the risk of metabolic issues, inflammation, and chronic disease down the road." },
];

function NutritionInfluencePhonePage() {
  const { ebook } = useMobileEbook();
  const supplied = asRecords(ebook.summary.nutrition_influence_items);
  const influences = nutritionInfluences.map((fallback, index) => {
    const record = supplied[index] || {};
    return {
      ...fallback,
      title: asText(record.title, fallback.title),
      copy: asText(record.body, fallback.copy),
    };
  });
  const takeaway = asText(ebook.summary.nutrition_influence_takeaway, "Food is information. The right nutrition helps your body function, recover, and thrive.");

  return (
    <article className={`${styles.page} ${styles.nutritionInfluencePage}`} aria-label="Page 13: What Nutrition Can Influence">
      <header className={styles.nutritionInfluenceTopline}>ZenPlato <span>|</span> 02 Hormonal Rhythms</header>
      <div className={styles.nutritionInfluenceTopRule} aria-hidden="true" />
      <BotanicalBranch className={styles.nutritionInfluenceTopBranch} />
      <div className={styles.nutritionInfluencePhoto}>
        <DynamicEbookImage mediaKey="nutrition_influence" fallbackSrc="/ebook/phone-nutrition-influence.png" alt="A balanced meal selected for your nutrition guide" fill sizes="45dvh" />
      </div>
      <section className={styles.nutritionInfluenceContent}>
        <h2>What Nutrition<br />Can Influence</h2>
        <div className={styles.nutritionInfluenceDivider} aria-hidden="true"><i /><BotanicalBranch /><i /></div>
        <div className={styles.nutritionInfluenceSteps}>
          {influences.map((item, index) => (
            <article className={styles.nutritionInfluenceStep} key={item.title}>
              <div className={styles.nutritionInfluenceIcon}><NutritionIcon name={item.icon} /></div>
              {index < influences.length - 1 && <div className={styles.nutritionInfluenceConnector} aria-hidden="true"><i /><b /></div>}
              <div className={styles.nutritionInfluenceIndex}>{String(index + 1).padStart(2, "0")}.</div>
              <div><h3>{item.title}</h3><p>{item.copy}</p></div>
            </article>
          ))}
        </div>
      </section>
      <blockquote className={styles.nutritionInfluenceTakeaway}>
        <BotanicalBranch />
        <p>{takeaway}</p>
      </blockquote>
      <div className={styles.nutritionInfluencePageNumber} aria-hidden="true"><i />16<i /></div>
    </article>
  );
}

type ChallengeIconName = "cravings" | "fatigue" | "weight" | "cycles";

function ChallengeIcon({ name }: { name: ChallengeIconName }) {
  if (name === "cravings") return <svg viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M17 29h30l-4 24H21l-4-24ZM21 29c0-5 4-9 9-9 1-6 10-8 14-3 5 0 9 5 8 10M25 35l2 12M34 35v12M43 35l-2 12" /></svg>;
  if (name === "fatigue") return <svg viewBox="0 0 64 64" fill="none" aria-hidden="true"><rect x="10" y="20" width="39" height="25" rx="2" /><path d="M49 27h5v11h-5M44 24v17" /></svg>;
  if (name === "weight") return <svg viewBox="0 0 64 64" fill="none" aria-hidden="true"><rect x="10" y="13" width="44" height="40" rx="4" /><circle cx="32" cy="23" r="9" /><path d="m32 23 5-4M16 17h8M40 17h8" /></svg>;
  return <svg viewBox="0 0 64 64" fill="none" aria-hidden="true"><rect x="10" y="14" width="44" height="40" rx="3" /><path d="M10 25h44M20 9v10M44 9v10M20 33h1M31 33h1M42 33h1M20 42h1M31 42h1M42 42h1" /></svg>;
}

const pcosChallenges: Array<{ icon: ChallengeIconName; image: string; title: React.ReactNode; copy: string }> = [
  { icon: "cravings", image: "/ebook/pcos-challenge-cravings.png", title: "Cravings", copy: "Hormonal fluctuations and blood sugar imbalances can trigger intense cravings, making it hard to stick to healthy choices." },
  { icon: "fatigue", image: "/ebook/pcos-challenge-fatigue.png", title: "Fatigue", copy: "Low energy, constant tiredness, and brain fog are common with PCOS due to insulin resistance, poor sleep, and hormonal imbalances." },
  { icon: "weight", image: "/ebook/pcos-challenge-weight.png", title: <>Weight<br />Management</>, copy: "PCOS can make it harder to lose weight or maintain it, especially around the belly, due to insulin resistance and hormonal factors." },
  { icon: "cycles", image: "/ebook/pcos-challenge-cycles.png", title: <>Irregular<br />Cycles</>, copy: "Irregular or missed periods are a hallmark of PCOS, caused by hormonal imbalances that affect ovulation." },
];

function CommonChallengesPhonePage() {
  const { ebook } = useMobileEbook();
  const label = conditionLabel(ebook);
  const findings = asRecords(ebook.summary.key_findings);
  const challenges = pcosChallenges.map((fallback, index) => {
    const record = findings[index] || {};
    return {
      ...fallback,
      title: asText(record.title, index === 0 ? `${label} Patterns` : `Health Pattern ${index + 1}`),
      copy: asText(record.description, `A personalized ${label.toLowerCase()} pattern identified from your profile.`),
    };
  });

  return (
    <article className={`${styles.page} ${styles.commonChallengesPage}`} aria-label={`Page 14: Common ${label} Challenges`}>
      <BotanicalBranch className={styles.commonChallengesTopBranch} />
      <header className={styles.commonChallengesTopline}>ZenPlato <span>|</span> 02 Hormonal Rhythms</header>
      <div className={styles.commonChallengesTopRule} aria-hidden="true" />
      <section className={styles.commonChallengesIntro}>
        <h2>Common<br />{label} Challenges</h2>
        <div className={styles.commonChallengesDivider} aria-hidden="true"><i /><BotanicalBranch /><i /></div>
        <p>{label} can show up differently for everyone. These are personalized patterns from your profile, and you are not alone.</p>
      </section>
      <section className={styles.commonChallengeCards}>
        {challenges.map((challenge, index) => (
          <article className={styles.commonChallengeCard} key={challenge.image}>
            <div className={styles.commonChallengePhoto}>
              <DynamicEbookImage mediaKey="opportunity" fallbackSrc={challenge.image} alt="" fill sizes="20dvh" />
              <b>{String(index + 1).padStart(2, "0")}</b>
            </div>
            <div className={styles.commonChallengeCopy}>
              <div className={styles.commonChallengeIcon}><ChallengeIcon name={challenge.icon} /></div>
              <div><h3>{challenge.title}</h3><i /><p>{challenge.copy}</p></div>
            </div>
          </article>
        ))}
      </section>
      <div className={styles.commonChallengesPageNumber} aria-hidden="true"><i />19<i /></div>
    </article>
  );
}

type FrameworkIconName = "protein" | "fibre" | "movement" | "recovery";

function FrameworkIcon({ name }: { name: FrameworkIconName }) {
  if (name === "protein") return <svg viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M32 54V20M32 35c-8 0-14-5-14-13 8 0 14 5 14 13ZM32 42c8 0 14-5 14-13-8 0-14 5-14 13ZM32 25c6-3 8-9 4-15-6 3-8 9-4 15Z" /><path d="M13 13h2M49 14h2M50 47h2" /></svg>;
  if (name === "fibre") return <svg viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M12 51c13-8 25-20 38-38M24 40c-8 0-12-4-13-10 8 0 12 4 13 10ZM34 31c-7-1-10-5-10-11 7 1 11 5 10 11ZM40 24c0-7 4-11 10-13 0 7-4 11-10 13ZM30 44c6 0 10 3 12 9-7 0-11-3-12-9Z" /><path d="M12 16h2M51 45h2" /></svg>;
  if (name === "movement") return <svg viewBox="0 0 64 64" fill="none" aria-hidden="true"><circle cx="31" cy="13" r="4" /><path d="M31 17v16l-9 10M31 25l10 7M18 51h31M23 43v8M40 32v19M31 20l-8 7" /></svg>;
  return <svg viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M43 10A24 24 0 1 0 53 43 20 20 0 0 1 43 10Z" /><path d="M45 20h5M47.5 17.5v5M52 30h4M54 28v4" /></svg>;
}

const frameworkItems: Array<{ icon: FrameworkIconName; title: string; copy: string }> = [
  { icon: "protein", title: "Protein", copy: "Supports stable blood sugar, reduces cravings, and helps build and repair lean muscle." },
  { icon: "fibre", title: "Fibre", copy: "Feeds your gut, supports hormone balance, and keeps you feeling full and satisfied longer." },
  { icon: "movement", title: "Movement", copy: "Improves insulin sensitivity, lifts your mood, and helps your body function at its best." },
  { icon: "recovery", title: "Recovery", copy: "Rest, sleep, and stress management are essential for hormone balance and long-term wellbeing." },
];

function ZenPlatoFrameworkPhonePage() {
  const { ebook } = useMobileEbook();
  const label = conditionLabel(ebook);

  return (
    <article className={`${styles.page} ${styles.frameworkPage}`} aria-label="Page 15: The ZenPlato Framework">
      <BotanicalBranch className={styles.frameworkTopBranch} />
      <header className={styles.frameworkTopline}>ZenPlato <span>|</span> 02 Hormonal Rhythms</header>
      <div className={styles.frameworkTopRule} aria-hidden="true" />
      <section className={styles.frameworkIntro}>
        <h2>The ZenPlato<br />Framework</h2>
        <div className={styles.frameworkDivider} aria-hidden="true"><i /><BotanicalBranch /><i /></div>
        <p>A simple, sustainable framework to nourish your body and support your {label} journey every day.</p>
      </section>
      <section className={styles.frameworkItems}>
        {frameworkItems.map((item, index) => (
          <article className={styles.frameworkItem} key={item.title}>
            <div className={styles.frameworkIcon}><FrameworkIcon name={item.icon} /></div>
            <div className={styles.frameworkIndex}>{String(index + 1).padStart(2, "0")}.</div>
            <div><h3>{item.title}</h3><i /><p>{item.copy}</p></div>
          </article>
        ))}
      </section>
      <blockquote className={styles.frameworkTakeaway}><BotanicalBranch /><p>Balance isn&rsquo;t about perfection—<br />it&rsquo;s about supporting your body<br />with what it truly needs.</p></blockquote>
      <div className={styles.frameworkPhoto}><DynamicEbookImage mediaKey="framework" fallbackSrc="/ebook/zenplato-framework-photo.png" alt="A balance journal, warm cup and leafy stems" fill sizes="45dvh" /></div>
    </article>
  );
}

function FoodNutritionGuidePhonePage() {
  return (
    <article className={`${styles.page} ${styles.foodGuidePage}`} aria-label="Page 16: Your Food and Nutrition Guide">
      <DynamicEbookImage mediaKey="food_guide" fallbackSrc="/ebook/food-nutrition-guide-bg.png" alt="A nourishing meal beside water and leafy branches" fill sizes="45dvh" className={styles.foodGuideBackground} />
      <header className={styles.foodGuideTopline}>ZenPlato <span>|</span> 03 Your Food &amp; Nutrition Guide</header>
      <section className={styles.foodGuideContent}>
        <p className={styles.foodGuideSection}>Section 3</p>
        <h2>Your Food &amp;<br />Nutrition Guide</h2>
        <div className={styles.foodGuideDivider} aria-hidden="true"><i /><BotanicalBranch /><i /></div>
        <div className={styles.foodGuidePages}>6 Pages</div>
        <div className={styles.foodGuidePurpose}>
          <h3>Purpose</h3>
          <p>Translate insights into practical<br />nutrition strategies.</p>
        </div>
      </section>
    </article>
  );
}

const mindfulFoods = [
  { image: "/ebook/mindful-refined-sugars.png", title: <>Refined<br />Sugars</>, copy: "Can cause blood sugar spikes and crashes, leading to increased cravings and energy dips." },
  { image: "/ebook/mindful-refined-carbs.png", title: <>Refined<br />Carbs</>, copy: "Such as white bread, pastries, and white pasta may impact blood sugar balance and satiety." },
  { image: "/ebook/mindful-fast-foods.png", title: <>Fried &<br />Fast Foods</>, copy: "Often high in unhealthy fats and additives that may increase inflammation and hormonal imbalance." },
  { image: "/ebook/mindful-processed-meats.png", title: <>Processed<br />Meats</>, copy: "May contain additives and preservatives that could affect inflammation and hormone health." },
  { image: "/ebook/mindful-yogurts.png", title: <>Flavored<br />Yogurts</>, copy: "Often high in added sugars and artificial ingredients that can impact gut and metabolic health." },
  { image: "/ebook/mindful-sugary-drinks.png", title: <>Sugary<br />Drinks</>, copy: "Linked to insulin resistance and increased risk of weight gain and energy fluctuations." },
  { image: "/ebook/mindful-alcohol.png", title: "Alcohol", copy: "Can disrupt sleep, stress hormones, and blood sugar balance—especially in excess." },
  { image: "/ebook/mindful-snacks.png", title: <>Highly<br />Processed<br />Snacks</>, copy: "Often low in nutrients and high in additives, which may contribute to inflammation and cravings." },
];

function MindfulFoodIcon({ index }: { index: number }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
      {index === 0 && <><circle cx="16" cy="16" r="6" /><circle cx="10" cy="16" r="4" /><circle cx="22" cy="16" r="4" /></>}
      {index === 1 && <><path d="M9 10h14v14H9zM12 10c0-3 8-3 8 0" /></>}
      {index === 2 && <><path d="M8 11h16l-2 14H10L8 11ZM12 7l2 5M18 7l-1 5M22 7l-2 5" /></>}
      {index === 3 && <><ellipse cx="16" cy="16" rx="10" ry="6" /><path d="M9 16c3-5 11-5 14 0-3 5-11 5-14 0Z" /></>}
      {index === 4 && <><path d="M10 10h12l-2 15h-8l-2-15ZM9 10h14M13 7h6" /><path d="M14 17c2-3 4-3 6 0" /></>}
      {index === 5 && <><path d="M10 9h12l-2 16h-8L10 9ZM9 9h14M14 6h5M18 6l3 3" /><path d="M14 15h4" /></>}
      {index === 6 && <><path d="M10 7h12c0 8-2 11-6 11s-6-3-6-11ZM16 18v7M11 25h10" /></>}
      {index === 7 && <><path d="M10 7h12l2 18H8l2-18ZM12 11h8M13 16c3-3 6 0 5 3-1 3-6 2-5-3Z" /></>}
    </svg>
  );
}

function MindfulFoodsPhonePage() {
  const { ebook } = useMobileEbook();
  const supplied = asRecords(ebook.summary.foods_to_be_mindful_of);
  const foods = mindfulFoods.map((fallback, index) => {
    const record = supplied[index] || {};
    return {
      ...fallback,
      title: asText(record.title, typeof fallback.title === "string" ? fallback.title : `Mindful choice ${index + 1}`),
      copy: asText(record.description, fallback.copy),
      image: asText(record.image_url, fallback.image),
    };
  });

  return (
    <article className={`${styles.page} ${styles.mindfulPage}`} aria-label="Page 17: Foods To Be More Mindful Of">
      <BotanicalBranch className={styles.mindfulTopBranch} />
      <header className={styles.mindfulTopline}>ZenPlato <span>|</span> 03 Your Food &amp; Nutrition Guide</header>
      <div className={styles.mindfulTopRule} aria-hidden="true" />
      <div className={styles.mindfulDecor} aria-hidden="true" />
      <section className={styles.mindfulIntro}>
        <h2>Foods To Be<br />More Mindful Of</h2>
        <div className={styles.mindfulDivider} aria-hidden="true"><i /><BotanicalBranch /><i /></div>
        <p>These foods aren&rsquo;t “bad”, but they may impact<br />hormone balance, energy, and cravings when<br />consumed too often or in excess.</p>
        <div className={styles.mindfulDynamic}><BotanicalBranch />Personalized from your health profile</div>
      </section>
      <section className={styles.mindfulGrid}>
        {foods.map((food, index) => (
          <article className={styles.mindfulCard} key={food.image}>
            <div className={styles.mindfulPhoto}><Image src={food.image} alt="" fill sizes="10dvh" /></div>
            <div className={styles.mindfulCardHeading}><span><MindfulFoodIcon index={index} /></span><h3>{food.title}</h3></div>
            <p>{food.copy}</p>
          </article>
        ))}
      </section>
      <blockquote className={styles.mindfulTakeaway}><BotanicalBranch /><p>Mindfulness is about balance, not restriction.<br />Enjoy these foods occasionally and<br />choose what supports your body most<br />of the time.</p></blockquote>
      <div className={styles.mindfulPageNumber} aria-hidden="true"><i />23<i /></div>
    </article>
  );
}

const priorityFoods = [
  { image: "/ebook/prioritize-greens.png", title: <>Leafy<br />Greens</>, copy: "Rich in fiber, folate, and magnesium to support hormones and detoxification." },
  { image: "/ebook/prioritize-berries.png", title: "Berries", copy: "Low in sugar, high in antioxidants to reduce inflammation and support insulin sensitivity." },
  { image: "/ebook/prioritize-proteins.png", title: <>Lean<br />Proteins</>, copy: "Support stable blood sugar, muscle repair, and long-lasting satiety." },
  { image: "/ebook/prioritize-grains.png", title: <>Whole<br />Grains</>, copy: "Provide complex carbohydrates and fiber for steady energy and balanced blood sugar." },
  { image: "/ebook/prioritize-fats.png", title: <>Healthy<br />Fats</>, copy: "Support hormone production and keep you feeling full and satisfied." },
  { image: "/ebook/prioritize-nuts.png", title: <>Nuts &<br />Seeds</>, copy: "Packed with healthy fats, zinc, and selenium to support hormone balance." },
  { image: "/ebook/prioritize-legumes.png", title: "Legumes", copy: "High in fiber and plant protein to support gut health and stable energy." },
  { image: "/ebook/prioritize-fermented.png", title: <>Fermented<br />Foods</>, copy: "Support gut health, reduce bloating, and improve nutrient absorption." },
];

function PriorityFoodsPhonePage() {
  const { ebook } = useMobileEbook();
  const supplied = asRecords(ebook.summary.foods_to_prioritize ?? ebook.summary.foods_to_prioritise);
  const foods = priorityFoods.map((fallback, index) => {
    const record = supplied[index] || {};
    return {
      ...fallback,
      title: asText(record.title, typeof fallback.title === "string" ? fallback.title : `Priority food ${index + 1}`),
      copy: asText(record.description, fallback.copy),
      image: asText(record.image_url, fallback.image),
    };
  });

  return (
    <article className={`${styles.page} ${styles.priorityPage}`} aria-label="Page 18: Foods To Prioritize">
      <BotanicalBranch className={styles.priorityTopBranch} />
      <header className={styles.priorityTopline}>ZenPlato <span>|</span> 03 Your Food &amp; Nutrition Guide</header>
      <div className={styles.priorityTopRule} aria-hidden="true" />
      <div className={styles.priorityDecor} aria-hidden="true" />
      <section className={styles.priorityIntro}>
        <h2>Foods To<br />Prioritize</h2>
        <div className={styles.priorityDivider} aria-hidden="true"><i /><BotanicalBranch /><i /></div>
        <p>Nourish your body with whole, nutrient-<br />dense foods that support hormonal<br />balance, steady energy, and long-term<br />wellness.</p>
        <div className={styles.priorityDynamic}><BotanicalBranch />Personalized from your health profile</div>
      </section>
      <section className={styles.priorityGrid}>
        {foods.map((food) => (
          <article className={styles.priorityCard} key={food.image}>
            <div className={styles.priorityPhoto}><Image src={food.image} alt="" fill sizes="10dvh" /></div>
            <div className={styles.priorityCardHeading}><span><FrameworkIcon name="protein" /></span><h3>{food.title}</h3></div>
            <p>{food.copy}</p>
          </article>
        ))}
      </section>
      <blockquote className={styles.priorityTakeaway}><BotanicalBranch /><p>Focus on real, whole foods most of the time.<br />Small, consistent choices create<br />lasting change.</p></blockquote>
      <div className={styles.priorityPageNumber} aria-hidden="true">22<i /></div>
    </article>
  );
}

function PlateIcon({ name }: { name: "vegetables" | "protein" | "carbs" }) {
  if (name === "vegetables") return <FrameworkIcon name="protein" />;
  if (name === "protein") return <svg viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M10 33c9-14 25-16 38-6l7-6v22l-7-6c-13 10-29 8-38-6Z" /><circle cx="39" cy="29" r="1.5" /><path d="M19 30h5M18 38c4-4 7-4 11 0" /></svg>;
  return <svg viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M32 55V10M32 18l-8-6M32 26l8-7M32 34l-8-7M32 42l8-7M32 50l-8-7" /></svg>;
}

const plateSections = [
  { icon: "vegetables" as const, amount: "50%", title: "Vegetables", copy: <>Fill half your plate with<br />non-starchy vegetables<br />for fiber, vitamins,<br />minerals, and<br />antioxidants.</> },
  { icon: "protein" as const, amount: "25%", title: "Protein", copy: <>Include quality protein<br />to support muscle<br />repair, hormones,<br />and lasting fullness.</> },
  { icon: "carbs" as const, amount: "25%", title: <>Smart<br />Carbohydrates</>, copy: <>Choose whole, fiber-rich<br />carbs to fuel your body,<br />balance blood sugar,<br />and support mood.</> },
];

function BalancedPlatePhonePage() {
  return (
    <article className={`${styles.page} ${styles.balancedPlatePage}`} aria-label="Page 19: The Balanced Plate">
      <BotanicalBranch className={styles.balancedPlateTopBranch} />
      <header className={styles.balancedPlateTopline}>ZenPlato <span>|</span> 03 Your Food &amp; Nutrition Guide</header>
      <div className={styles.balancedPlateTopRule} aria-hidden="true" />
      <div className={styles.balancedPlateHeaderDecor} aria-hidden="true" />
      <section className={styles.balancedPlateIntro}>
        <h2>The<br />Balanced<br />Plate</h2>
        <div className={styles.balancedPlateDivider} aria-hidden="true"><i /><BotanicalBranch /><i /></div>
        <p>A simple visual guide to help you<br />build balanced, nourishing meals<br />that support hormone balance,<br />steady energy, and long-term<br />wellness.</p>
      </section>
      <div className={styles.balancedPlateBowl}><DynamicEbookImage mediaKey="balanced_plate" fallbackSrc="/ebook/balanced-plate-bowl.png" alt="A balanced plate divided into vegetables, protein and smart carbohydrates" fill sizes="38dvh" /></div>
      <section className={styles.balancedPlateSections}>
        {plateSections.map((section) => (
          <article className={styles.balancedPlateSection} key={section.amount + String(section.title)}>
            <div className={styles.balancedPlateIcon}><PlateIcon name={section.icon} /></div>
            <div className={styles.balancedPlateMetric}><strong>{section.amount}</strong><h3>{section.title}</h3></div>
            <div className={styles.balancedPlateConnector} aria-hidden="true"><i /></div>
            <p>{section.copy}</p>
          </article>
        ))}
      </section>
      <blockquote className={styles.balancedPlateTakeaway}><BotanicalBranch /><p>Balance is not about perfection—<br />it&rsquo;s about consistency. Small, mindful<br />choices create lasting changes.</p></blockquote>
      <div className={styles.balancedPlatePageNumber} aria-hidden="true"><i />24<i /></div>
    </article>
  );
}

type HydrationIconName = "glass" | "clock" | "drop" | "leaf" | "body";

function HydrationIcon({ name }: { name: HydrationIconName }) {
  if (name === "clock") return <svg viewBox="0 0 64 64" fill="none" aria-hidden="true"><circle cx="32" cy="32" r="22" /><path d="M32 17v16l10 6M32 10v4M32 50v4M10 32h4M50 32h4" /></svg>;
  if (name === "drop") return <svg viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M32 8S15 29 15 40a17 17 0 0 0 34 0C49 29 32 8 32 8Z" /></svg>;
  if (name === "leaf") return <FrameworkIcon name="fibre" />;
  if (name === "body") return <svg viewBox="0 0 64 64" fill="none" aria-hidden="true"><circle cx="32" cy="13" r="6" /><path d="M32 19v19M20 30l12-8 12 8M32 38l-10 13M32 38l10 13M14 53c5-7 13-8 18-2 5-6 13-5 18 2" /></svg>;
  return <svg viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M17 14h30l-4 37H21l-4-37ZM21 35c7-5 15 5 22 0" /></svg>;
}

const hydrationSteps: Array<{ icon: HydrationIconName; title: string; copy: React.ReactNode }> = [
  { icon: "glass", title: "1. Daily Goal", copy: <>Aim for &#123;&#123;hydration_guidance.daily_goal&#125;&#125;<br />(about 8–10 glasses) spread<br />throughout the day.</> },
  { icon: "clock", title: "2. Sip Consistently", copy: <>Drink a glass of water every 1–2<br />hours. Consistent sips keep your<br />body hydrated and your energy<br />steady.</> },
  { icon: "drop", title: "3. Start & End Your Day", copy: <>Begin your morning with<br />&#123;&#123;hydration_guidance.morning_ritual&#125;&#125;<br />and unwind at night with<br />&#123;&#123;hydration_guidance.evening_ritual&#125;&#125;.</> },
  { icon: "leaf", title: "4. Enhance Naturally", copy: <>Add hydrating, nutrient-rich<br />ingredients like lemon, cucumber,<br />mint, or berries to make water<br />more refreshing.</> },
  { icon: "body", title: "5. Listen To Your Body", copy: <>Thirst, dry skin, fatigue, or<br />headaches can be signs you need<br />more fluids. Check in and rehydrate.</> },
];

function HydrationPhonePage() {
  const { ebook } = useMobileEbook();
  const guidance = asRecord(ebook.summary.hydration_guidance);
  const supplied = asRecords(guidance.steps);
  const steps = hydrationSteps.map((fallback, index) => {
    const record = supplied[index] || {};
    return {
      ...fallback,
      title: `${index + 1}. ${asText(record.title, fallback.title.replace(/^\d+\.\s*/, ""))}`,
      copy: asText(record.body, index === 0 ? asText(guidance.daily_goal, "Aim for 8 to 10 glasses spread throughout the day.") : `A practical hydration habit personalized to your routine.`),
    };
  });
  const tips = asStrings(guidance.tips);

  return (
    <article className={`${styles.page} ${styles.hydrationPage}`} aria-label="Page 20: Hydration Recommendations">
      <BotanicalBranch className={styles.hydrationTopBranch} />
      <header className={styles.hydrationTopline}>ZenPlato <span>|</span> 03 Your Food &amp; Nutrition Guide</header>
      <div className={styles.hydrationTopRule} aria-hidden="true" />
      <div className={styles.hydrationScene}><DynamicEbookImage mediaKey="hydration" fallbackSrc="/ebook/hydration-scene.png" alt="A glass pitcher infused with lemon and mint beside a water glass" fill sizes="35dvh" /></div>
      <section className={styles.hydrationIntro}>
        <h2>Hydration<br />Recommendations</h2>
        <div className={styles.hydrationDivider} aria-hidden="true"><i /><BotanicalBranch /><i /></div>
        <p>{asText(guidance.intro, "Proper hydration supports energy, digestion, recovery, and skin health. Small, consistent habits make a big difference.")}</p>
        <h3>Your Hydration Framework</h3>
      </section>
      <section className={styles.hydrationSteps}>
        {steps.map((step, index) => (
          <article className={styles.hydrationStep} key={step.title}>
            <div className={styles.hydrationIcon}><HydrationIcon name={step.icon} /></div>
            {index < steps.length - 1 && <i className={styles.hydrationConnector} aria-hidden="true" />}
            <div><h4>{step.title}</h4><p>{step.copy}</p></div>
          </article>
        ))}
      </section>
      <section className={styles.hydrationTips}>
        <h3>Additional Tips</h3>
        {(tips.length ? tips : ["Keep a water bottle with you to stay on track.", "Herbal teas and infused water count towards your intake.", "Include electrolytes when activity or climate increases your needs.", "Use reminders to make hydration automatic."]).slice(0, 4).map((tip) => <p key={tip}>• <span>{tip}</span></p>)}
      </section>
      <blockquote className={styles.hydrationTakeaway}><BotanicalBranch /><p>Hydration is self-care.<br />Nourish your body with water,<br />and it will nourish you in return.</p></blockquote>
      <div className={styles.hydrationPageNumber} aria-hidden="true"><i />25<i /></div>
    </article>
  );
}

type MealTimingIconName = "sun" | "leaf" | "moon";

interface MealTimingRowData {
  time: string;
  title: string;
  copy: string;
  image: string;
  alt: string;
  icon: MealTimingIconName;
}

const mealTimingRows: MealTimingRowData[] = [
  {
    time: "7:00 – 8:30 AM",
    title: "Breakfast",
    copy: "Start your day with a balanced meal rich in protein, healthy fats, and fibre to support stable energy and hormone balance.",
    image: "/ebook/meal-timing-breakfast.png",
    alt: "Breakfast bowl with berries, nuts, and seeds",
    icon: "sun",
  },
  {
    time: "10:30 – 11:00 AM",
    title: "Mid-Morning Snack",
    copy: "A small, nutrient-dense snack can help curb cravings and keep energy levels steady until lunch.",
    image: "/ebook/meal-timing-snack-am.png",
    alt: "Bowl of nuts for a mid-morning snack",
    icon: "leaf",
  },
  {
    time: "12:30 – 1:30 PM",
    title: "Lunch",
    copy: "Aim for a balanced plate with protein, vegetables, and smart carbohydrates to support focus and sustained energy.",
    image: "/ebook/meal-timing-lunch.png",
    alt: "Balanced lunch bowl with grains, vegetables, and avocado",
    icon: "sun",
  },
  {
    time: "4:00 – 4:30 PM",
    title: "Evening Snack",
    copy: "Choose a protein- or fibre-rich snack to stabilise blood sugar and prevent overeating later.",
    image: "/ebook/meal-timing-snack-pm.png",
    alt: "Yoghurt and berries for an afternoon snack",
    icon: "leaf",
  },
  {
    time: "6:30 – 7:30 PM",
    title: "Dinner",
    copy: "Keep dinner light yet satisfying with protein and vegetables to support digestion and restful sleep.",
    image: "/ebook/meal-timing-dinner.png",
    alt: "Salmon dinner with vegetables and chickpeas",
    icon: "moon",
  },
];

function MealTimingMarker({ name }: { name: MealTimingIconName }) {
  return (
    <svg viewBox="0 0 44 44" fill="none" aria-hidden="true">
      {name === "sun" && (
        <>
          <circle cx="22" cy="22" r="7" />
          <path d="M22 5v5M22 34v5M5 22h5M34 22h5M10 10l4 4M30 30l4 4M34 10l-4 4M14 30l-4 4" />
        </>
      )}
      {name === "leaf" && (
        <>
          <path d="M11 31C12 18 19 10 34 8c-1 15-9 23-23 23Z" />
          <path d="M11 35c5-10 11-16 21-23M18 25l-1-8M24 19l7 1" />
        </>
      )}
      {name === "moon" && <path d="M30 34A15 15 0 0 1 19 7a15 15 0 1 0 11 27Z" />}
    </svg>
  );
}

function MealTimingTimeline({
  rows,
}: {
  rows: MealTimingRowData[];
}) {
  return (
    <section className={styles.mealTimingTimeline}>
      <h3>Daily Nutrition Timeline</h3>
      <div className={styles.mealTimingRows}>
        {rows.map((row) => (
          <article className={styles.mealTimingRow} key={row.title}>
            <div className={styles.mealTimingRowCopy}>
              <h4>{row.time}</h4>
              <h5>{row.title}</h5>
              <p>{row.copy}</p>
            </div>
            <div className={styles.mealTimingMarker}><MealTimingMarker name={row.icon} /></div>
            <div className={styles.mealTimingPhoto}>
              <Image src={row.image} alt={row.alt} fill sizes="30vw" />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function useMealTimingContent() {
  const { ebook } = useMobileEbook();
  const guidance = asRecord(ebook.summary.meal_timing_guidance);
  const supplied = asRecords(guidance.entries);
  const rows = mealTimingRows.map((fallback, index) => {
    const record = supplied[index] || {};
    return {
      ...fallback,
      time: asText(record.time, fallback.time),
      title: asText(record.title, fallback.title),
      copy: asText(record.body, fallback.copy),
    };
  });

  return { guidance, rows };
}

function MealTimingPhonePage() {
  const { guidance, rows } = useMealTimingContent();

  return (
    <article className={`${styles.page} ${styles.mealTimingPage}`} aria-label="Page 21: Meal Timing Guidance">
      <BotanicalBranch className={styles.mealTimingTopBranch} />
      <header className={styles.mealTimingTopline}>ZenPlato <span>|</span> 03 Your Food &amp; Nutrition Guide</header>
      <div className={styles.mealTimingTopRule} aria-hidden="true" />

      <section className={styles.mealTimingIntro}>
        <h2>Meal Timing<br />Guidance</h2>
        <p>{asText(guidance.intro, "Consistent meal timing can support steadier energy, hunger, sleep, and recovery throughout your day.")}</p>
      </section>

      <MealTimingTimeline rows={rows.slice(0, 3)} />

      <div className={styles.mealTimingPageNumber} aria-hidden="true"><i />26<i /></div>
    </article>
  );
}

function MealTimingContinuationPhonePage() {
  const { guidance, rows } = useMealTimingContent();

  return (
    <article className={`${styles.page} ${styles.mealTimingPage} ${styles.mealTimingContinuationPage}`} aria-label="Page 22: Meal Timing Guidance continued">
      <BotanicalBranch className={styles.mealTimingTopBranch} />
      <header className={styles.mealTimingTopline}>ZenPlato <span>|</span> 03 Your Food &amp; Nutrition Guide</header>
      <div className={styles.mealTimingTopRule} aria-hidden="true" />

      <section className={styles.mealTimingIntro}>
        <p className={styles.mealTimingContinuedLabel}>Meal Timing Guidance</p>
        <h2>Afternoon<br />To Evening</h2>
        <p>A calm, consistent rhythm later in the day supports steadier energy, comfortable digestion, and more restful sleep.</p>
      </section>

      <MealTimingTimeline rows={rows.slice(3)} />

      <section className={styles.mealTimingKey}>
        <h3>{asText(guidance.consistency_title, "Consistency Is Key")}</h3>
        <p>{asText(guidance.consistency_body, "A repeatable rhythm helps regulate hunger, energy, and overall wellbeing.")}</p>
      </section>

      <p className={styles.mealTimingQuote}>{asText(guidance.quote, "Small, consistent habits create meaningful long-term change.")}</p>
      <div className={styles.mealTimingPageNumber} aria-hidden="true"><i />27<i /></div>
    </article>
  );
}

interface SmartSwapData {
  number: string;
  beforeTitle: string;
  beforeBody: string;
  afterTitle: string;
  afterBody: string;
  beforeImageClass: string;
  afterImageClass: string;
  beforeImageAlt: string;
  afterImageAlt: string;
}

const smartSwapFallbacks: SmartSwapData[] = [
  {
    number: "01",
    beforeTitle: "Sugary Cereals",
    beforeBody: "High in refined sugar and low in fibre, which can lead to energy crashes.",
    afterTitle: "Oats with Seeds & Berries",
    afterBody: "Fibre and healthy fats can support fullness and steadier energy.",
    beforeImageClass: "smartSwapOneBeforeImage",
    afterImageClass: "smartSwapOneAfterImage",
    beforeImageAlt: "Bowl of brightly coloured sugary cereal",
    afterImageAlt: "Bowl of oats topped with berries and seeds",
  },
  {
    number: "02",
    beforeTitle: "White Bread",
    beforeBody: "Refined carbohydrates may increase energy swings and cravings.",
    afterTitle: "Whole Grain Sourdough",
    afterBody: "A fibre-rich option can support steadier energy and gut health.",
    beforeImageClass: "smartSwapTwoBeforeImage",
    afterImageClass: "smartSwapTwoAfterImage",
    beforeImageAlt: "Slices of white bread on a plate",
    afterImageAlt: "Slices of whole grain sourdough bread",
  },
  {
    number: "03",
    beforeTitle: "Sweetened Yogurt",
    beforeBody: "Often high in added sugar and less supportive ingredients.",
    afterTitle: "Plain Greek Yogurt with Fruit & Nuts",
    afterBody: "Protein and healthy fats support fullness and balance.",
    beforeImageClass: "smartSwapThreeBeforeImage",
    afterImageClass: "smartSwapThreeAfterImage",
    beforeImageAlt: "Glass of sweetened pink yogurt",
    afterImageAlt: "Bowl of Greek yogurt with fruit and nuts",
  },
  {
    number: "04",
    beforeTitle: "Sugary Drinks",
    beforeBody: "Added sugars can contribute to spikes and energy crashes.",
    afterTitle: "Infused Water or Herbal Tea",
    afterBody: "A refreshing option that supports hydration and wellbeing.",
    beforeImageClass: "smartSwapFourBeforeImage",
    afterImageClass: "smartSwapFourAfterImage",
    beforeImageAlt: "Glass of dark sugary soda",
    afterImageAlt: "Lemon infused water and herbal tea",
  },
];

function useSmartSwapContent() {
  const { ebook } = useMobileEbook();
  const guidance = asRecord(ebook.summary.food_swaps);
  const swaps = asRecords(guidance.swaps);
  const items = smartSwapFallbacks.map((fallback, index) => {
    const supplied = swaps[index] || {};
    return {
      ...fallback,
      beforeTitle: asText(supplied.before_title, fallback.beforeTitle),
      beforeBody: asText(supplied.before_body, fallback.beforeBody),
      afterTitle: asText(supplied.after_title, fallback.afterTitle),
      afterBody: asText(supplied.after_body, fallback.afterBody),
    };
  });

  return { guidance, items };
}

function SmartSwapComparison({ swap }: { swap: SmartSwapData }) {
  return (
    <section
      className={`${styles.smartSwapComparison} ${styles[`smartSwapComparison${swap.number}`]}`}
      aria-label={`Swap ${swap.number}: ${swap.beforeTitle} for ${swap.afterTitle}`}
    >
      <div className={styles.smartSwapNumber}>{swap.number}</div>
      <div className={styles.smartSwapChoice}>
        <p className={styles.smartSwapLabel}>Before</p>
        <h3>{swap.beforeTitle}</h3>
        <p className={styles.smartSwapBody}>{swap.beforeBody}</p>
        <div
          className={`${styles.smartSwapPhoto} ${styles[swap.beforeImageClass]}`}
          role="img"
          aria-label={swap.beforeImageAlt}
        />
      </div>
      <div className={styles.smartSwapArrow} aria-hidden="true">→</div>
      <div className={styles.smartSwapChoice}>
        <p className={styles.smartSwapLabel}>After</p>
        <h3>{swap.afterTitle}</h3>
        <p className={styles.smartSwapBody}>{swap.afterBody}</p>
        <div
          className={`${styles.smartSwapPhoto} ${styles[swap.afterImageClass]}`}
          role="img"
          aria-label={swap.afterImageAlt}
        />
      </div>
    </section>
  );
}

function SmartFoodSwapsPhonePage() {
  const { guidance, items } = useSmartSwapContent();

  return (
    <article className={`${styles.page} ${styles.smartFoodSwapsPage}`} aria-label="Page 23: Smart Food Swaps">
      <BotanicalBranch className={styles.smartSwapTopBranch} />
      <header className={styles.smartSwapTopline}>ZenPlato <span>|</span> 03 Your Food &amp; Nutrition Guide</header>
      <div className={styles.smartSwapTopRule} aria-hidden="true" />

      <section className={styles.smartSwapIntro}>
        <h2>Smart Food<br />Swaps</h2>
        <p>{asText(guidance.intro, "Small swaps can make a big difference. Choose foods that nourish your body and support long-term wellbeing.")}</p>
      </section>

      <div className={styles.smartSwapList}>
        {items.slice(0, 2).map((swap) => <SmartSwapComparison swap={swap} key={swap.number} />)}
      </div>

      <div className={styles.smartSwapPageNumber} aria-hidden="true"><i />28<i /></div>
    </article>
  );
}

function SmartSwapsContinuedPhonePage() {
  const { items } = useSmartSwapContent();

  return (
    <article className={`${styles.page} ${styles.smartSwapsContinuedPage}`} aria-label="Page 24: Smart Swaps Continued">
      <BotanicalBranch className={styles.smartSwapTopBranch} />
      <header className={styles.smartSwapTopline}>ZenPlato <span>|</span> 03 Your Food &amp; Nutrition Guide</header>
      <div className={styles.smartSwapTopRule} aria-hidden="true" />

      <section className={`${styles.smartSwapIntro} ${styles.smartSwapContinuedIntro}`}>
        <p>Smart Food Swaps</p>
        <h2>Better Choices,<br />Continued</h2>
      </section>

      <div className={`${styles.smartSwapList} ${styles.smartSwapContinuedList}`}>
        {items.slice(2).map((swap) => <SmartSwapComparison swap={swap} key={swap.number} />)}
      </div>

      <div className={styles.smartSwapPageNumber} aria-hidden="true"><i />29<i /></div>
    </article>
  );
}

function LifestyleFoundationPhonePage() {
  return (
    <article className={`${styles.page} ${styles.lifestyleFoundationPage}`} aria-label="Page 25: Your Lifestyle Foundation">
      <BotanicalBranch className={styles.lifestyleFoundationTopBranch} />
      <header className={styles.lifestyleFoundationTopline}>ZenPlato <span>|</span> 03 Your Food &amp; Nutrition Guide</header>
      <div className={styles.lifestyleFoundationTopRule} aria-hidden="true" />

      <section className={styles.lifestyleFoundationIntro}>
        <p className={styles.lifestyleFoundationSectionLabel}>Section</p>
        <div className={styles.lifestyleFoundationNumber}>04</div>
        <div className={styles.lifestyleFoundationDivider} aria-hidden="true"><i /><BotanicalBranch /><i /></div>
        <h2>Your<br />Lifestyle<br />Foundation</h2>
        <i className={styles.lifestyleFoundationShortRule} aria-hidden="true" />
        <p className={styles.lifestyleFoundationCopy}>True healing happens when<br />daily choices support your<br />body, mind, and hormones.<br />This section is about building<br />a lifestyle that feels good,<br />is sustainable, and helps<br />you thrive—inside and out.</p>
      </section>

      <aside className={styles.lifestyleFoundationTakeaway}>
        <span aria-hidden="true"><BotanicalBranch /></span>
        <p>Balance is built,<br />not found.<br />One choice at a time.</p>
      </aside>

      <div className={styles.lifestyleFoundationPageNumber} aria-hidden="true"><i />30<i /></div>
    </article>
  );
}

type PhonePageProps = {
  "aria-label"?: string;
};

type SleepRecoveryIconName = "sleep" | "cravings" | "recovery";

const sleepRecoveryItems: Array<{ icon: SleepRecoveryIconName; title: string; copy: string }> = [
  {
    icon: "sleep",
    title: "Sleep And Energy",
    copy: "Good sleep restores your body and balances your hormones, helping you wake up refreshed and stay energized all day.",
  },
  {
    icon: "cravings",
    title: "Sleep And Cravings",
    copy: "Poor sleep increases hunger hormones and cravings, especially for sugar and carbs. Better sleep helps you make better choices.",
  },
  {
    icon: "recovery",
    title: "Recovery Habits",
    copy: "Gentle movement, stretching, breathwork, and downtime support your nervous system and reduce stress, helping your body heal and reset.",
  },
];

function SleepRecoveryIcon({ name }: { name: SleepRecoveryIconName }) {
  if (name === "sleep") return <FocusIcon name="sleep" />;
  if (name === "cravings") return <ChallengeIcon name="cravings" />;
  return <WellnessIcon name="lotus" />;
}

function SleepRecoveryFeature({ item }: { item: (typeof sleepRecoveryItems)[number] }) {
  return (
    <article className={styles.sleepRecoveryFeature}>
      <div><SleepRecoveryIcon name={item.icon} /></div>
      <section>
        <h3>{item.title}</h3>
        <p>{item.copy}</p>
      </section>
    </article>
  );
}

function SleepRecoveryPhonePage(props: PhonePageProps) {
  return (
    <article className={`${styles.page} ${styles.sleepRecoveryPage}`} aria-label={props["aria-label"] ?? "Sleep and Recovery"}>
      <BotanicalBranch className={styles.sleepRecoveryTopBranch} />
      <header className={styles.sleepRecoveryTopline}>ZenPlato <span>|</span> 04 Your Lifestyle Foundation</header>
      <div className={styles.sleepRecoveryTopRule} aria-hidden="true" />
      <div className={styles.sleepRecoveryArtwork} role="img" aria-label="A calm bedside scene with tea, a candle, soft bedding, and a journal" />

      <section className={styles.sleepRecoveryIntro}>
        <h2>Sleep &amp;<br />Recovery</h2>
        <p>Rest is productive. Quality sleep and intentional recovery help regulate hormones, stabilize mood, and support long-term healing.</p>
      </section>

      <section className={styles.sleepRecoveryLeadFeature}>
        <SleepRecoveryFeature item={sleepRecoveryItems[0]} />
      </section>

      <aside className={styles.sleepRecoveryContinue}>
        <span>Continue</span>
        <p>Sleep, cravings, and recovery habits</p>
      </aside>

      <div className={styles.sleepRecoveryPageNumber} aria-hidden="true"><i />32<i /></div>
    </article>
  );
}

function SleepRecoveryContinuationPhonePage(props: PhonePageProps) {
  return (
    <article className={`${styles.page} ${styles.lifestyleContinuationPage} ${styles.sleepRecoveryContinuationPage}`} aria-label={props["aria-label"] ?? "Sleep and Recovery continued"}>
      <BotanicalBranch className={styles.lifestyleContinuationTopBranch} />
      <header className={styles.lifestyleContinuationTopline}>ZenPlato <span>|</span> 04 Your Lifestyle Foundation</header>
      <div className={styles.lifestyleContinuationTopRule} aria-hidden="true" />
      <BotanicalBranch className={styles.lifestyleContinuationDecor} />

      <section className={styles.lifestyleContinuationIntro}>
        <p>Sleep &amp; Recovery</p>
        <h2>Recovery,<br />continued</h2>
      </section>

      <section className={styles.sleepRecoveryContinuationStack}>
        {sleepRecoveryItems.slice(1).map((item) => <SleepRecoveryFeature item={item} key={item.title} />)}
      </section>

      <blockquote className={styles.sleepRecoveryContinuationTakeaway}>
        <BotanicalBranch />
        <p>Rest isn&rsquo;t lazy.<br />It&rsquo;s part of your healing.</p>
      </blockquote>

      <div className={styles.lifestyleContinuationPageNumber} aria-hidden="true"><i />32 · 2<i /></div>
    </article>
  );
}

type StressCycleIconName = "stress" | "food" | "energy" | "consistency";

const stressCycleRows = [
  { icon: "stress" as const, title: "Stress ↑", copy: "Triggers cortisol and throws hormones off balance." },
  { icon: "food" as const, title: "Food Choices ↓", copy: "Leads to more cravings, emotional eating, and poor food choices." },
  { icon: "energy" as const, title: "Energy ↓", copy: "Causes fatigue, mood swings, and low motivation." },
  { icon: "consistency" as const, title: "Consistency ↓", copy: "Makes it harder to stick to healthy habits and create lasting change." },
];

function StressCycleIcon({ name }: { name: StressCycleIconName }) {
  if (name === "stress") return <FocusIcon name="stress" />;
  if (name === "food") return <ChallengeIcon name="cravings" />;
  if (name === "energy") {
    return (
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <rect x="20" y="13" width="24" height="40" rx="3" />
        <path d="M27 8h10M28 29h8l-5 8h8" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M47 22A20 20 0 1 0 51 38" />
      <path d="M46 11v13H33" />
    </svg>
  );
}

function StressCycleStep({ row }: { row: (typeof stressCycleRows)[number] }) {
  return (
    <article className={styles.stressCycleStep}>
      <div><StressCycleIcon name={row.icon} /></div>
      <section>
        <h4>{row.title}</h4>
        <p>{row.copy}</p>
      </section>
    </article>
  );
}

function StressWellbeingPhonePage(props: PhonePageProps) {
  return (
    <article className={`${styles.page} ${styles.stressWellbeingPage}`} aria-label={props["aria-label"] ?? "Stress and Wellbeing"}>
      <BotanicalBranch className={styles.stressWellbeingTopBranch} />
      <header className={styles.stressWellbeingTopline}>ZenPlato <span>|</span> 04 Your Lifestyle Foundation</header>
      <div className={styles.stressWellbeingTopRule} aria-hidden="true" />
      <div className={styles.stressWellbeingArtwork} role="img" aria-label="Tea, a journal, and leafy branches in warm natural light" />

      <section className={styles.stressWellbeingIntro}>
        <h2>Stress &amp;<br />Wellbeing</h2>
        <p>Stress doesn&rsquo;t just affect your mood. It impacts your hormones, cravings, energy, and ability to stay consistent.</p>
        <h3>The Stress Impact Cycle</h3>
      </section>

      <section className={styles.stressWellbeingCycle}>
        {stressCycleRows.slice(0, 2).map((row) => <StressCycleStep row={row} key={row.title} />)}
      </section>

      <aside className={styles.stressWellbeingContinue}>
        <span>Continue</span>
        <p>The cycle and your personalized insight</p>
      </aside>
      <div className={styles.stressWellbeingPageNumber} aria-hidden="true">33<i /></div>
    </article>
  );
}

function StressWellbeingContinuationPhonePage(props: PhonePageProps) {
  const { ebook } = useMobileEbook();
  const insight = asText(ebook.summary.stress_insight, "Stress can influence sleep, cravings, energy, and consistency. Gentle recovery habits help protect your progress.");

  return (
    <article className={`${styles.page} ${styles.lifestyleContinuationPage} ${styles.stressWellbeingContinuationPage}`} aria-label={props["aria-label"] ?? "Stress and Wellbeing continued"}>
      <BotanicalBranch className={styles.lifestyleContinuationTopBranch} />
      <header className={styles.lifestyleContinuationTopline}>ZenPlato <span>|</span> 04 Your Lifestyle Foundation</header>
      <div className={styles.lifestyleContinuationTopRule} aria-hidden="true" />
      <BotanicalBranch className={styles.lifestyleContinuationDecor} />

      <section className={styles.lifestyleContinuationIntro}>
        <p>Stress &amp; Wellbeing</p>
        <h2>The impact<br />cycle</h2>
        <h3>Final Steps</h3>
      </section>

      <section className={styles.stressContinuationCycle}>
        {stressCycleRows.slice(2).map((row) => <StressCycleStep row={row} key={row.title} />)}
      </section>

      <aside className={styles.stressContinuationInsight}>
        <span>Personalized Insight</span>
        <p>{insight}</p>
      </aside>

      <blockquote className={styles.stressContinuationQuote}>
        <span aria-hidden="true">“</span>
        <p>When you manage stress, you protect your energy, your choices, and your future.</p>
      </blockquote>

      <div className={styles.lifestyleContinuationPageNumber} aria-hidden="true"><i />33 · 2<i /></div>
    </article>
  );
}

type WellnessIconName = "bottle" | "bowl" | "shoe" | "lotus";

function WellnessIcon({ name }: { name: WellnessIconName }) {
  if (name === "bowl") return <PlateIcon name="vegetables" />;
  if (name === "shoe") return <svg viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M12 40c10 3 22 3 40 0 3 2 5 5 5 9H13c-4 0-7-2-7-6 0-5 3-9 7-15l7 8c4 2 11 3 18 0" /><path d="M18 36l7-10M26 38l7-10M33 39l7-9" /></svg>;
  if (name === "lotus") return <svg viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M32 47c-11-8-13-19 0-31 13 12 11 23 0 31Z" /><path d="M28 46c-13 1-21-6-22-20 15 1 22 8 22 20ZM36 46c13 1 21-6 22-20-15 1-22 8-22 20ZM16 50h32" /></svg>;
  return <svg viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M24 14h16M26 14v8h12v-8M22 22h20v30H22V22Z" /><path d="M48 34c4 5 6 9 6 13a6 6 0 0 1-12 0c0-4 2-8 6-13Z" /></svg>;
}

const dailyWellnessHabits: Array<{ icon: WellnessIconName; number: string; title: React.ReactNode; copy: React.ReactNode }> = [
  { icon: "bottle", number: "01", title: <>Morning<br />Hydration</>, copy: <>Start your day with<br />water to rehydrate<br />your body, support<br />metabolism, and<br />improve focus.</> },
  { icon: "bowl", number: "02", title: <>Balanced<br />Breakfast</>, copy: <>Fuel your body with<br />protein, healthy fats,<br />and fiber to stabilize<br />blood sugar and<br />sustain energy.</> },
  { icon: "shoe", number: "03", title: <>Daily<br />Movement</>, copy: <>Move your body<br />every day—walk,<br />stretch, or do yoga<br />to boost mood and<br />hormone balance.</> },
  { icon: "lotus", number: "04", title: <>Recovery<br />Habits</>, copy: <>Prioritize quality sleep,<br />stress management,<br />and downtime to<br />help your body<br />heal and reset.</> },
];

function DailyWellnessPhonePage() {
  const { ebook } = useMobileEbook();
  const supplied = asRecords(ebook.summary.daily_habits);
  const habits = dailyWellnessHabits.map((fallback, index) => {
    const record = supplied[index] || {};
    return {
      ...fallback,
      title: asText(record.title, typeof fallback.title === "string" ? fallback.title : `Daily habit ${index + 1}`),
      copy: asText(record.body, "A small daily action personalized to support your health goals."),
    };
  });

  return (
    <article className={`${styles.page} ${styles.dailyWellnessPage}`} aria-label="Page 28: Daily Wellness Habits">
      <BotanicalBranch className={styles.dailyWellnessTopBranch} />
      <header className={styles.dailyWellnessTopline}>ZenPlato <span>|</span> 04 Your Lifestyle Foundation</header>
      <div className={styles.dailyWellnessTopRule} aria-hidden="true" />

      <section className={styles.dailyWellnessIntro}>
        <h2>Daily<br />Wellness<br />Habits</h2>
        <div className={styles.dailyWellnessDivider} aria-hidden="true"><i /><BotanicalBranch /><i /></div>
        <p>Small daily habits create big shifts.<br />These simple, sustainable actions<br />support your hormones, boost energy,<br />and help you feel your best.</p>
        <aside><span>Personalized:</span> Based on your profile</aside>
      </section>

      <section className={styles.dailyWellnessCards}>
        {habits.map((habit) => (
          <article className={styles.dailyWellnessCard} key={habit.number}>
            <div className={styles.dailyWellnessCardHead}>
              <span>{habit.number}</span>
              <i aria-hidden="true" />
              <div><WellnessIcon name={habit.icon} /></div>
            </div>
            <h3>{habit.title}</h3>
            <b aria-hidden="true" />
            <p>{habit.copy}</p>
          </article>
        ))}
      </section>

      <div className={styles.dailyWellnessPageNumber} aria-hidden="true"><i />34<i /></div>
    </article>
  );
}

function PerfectionConsistencyPhonePage() {
  return (
    <article className={`${styles.page} ${styles.perfectionConsistencyPage}`} aria-label="Page 29: Perfection is not required">
      <BotanicalBranch className={styles.perfectionConsistencyTopBranch} />
      <header className={styles.perfectionConsistencyTopline}>ZenPlato <span>|</span> 04 Your Lifestyle Foundation</header>
      <div className={styles.perfectionConsistencyTopRule} aria-hidden="true" />

      <section className={styles.perfectionConsistencyIntro}>
        <h2>Perfection<br />Is Not<br />Required.<br /><em>Consistency<br />Is.</em></h2>
        <div className={styles.perfectionConsistencyDivider} aria-hidden="true"><i /><BotanicalBranch /><i /></div>
        <p>It&rsquo;s the small, everyday<br />choices you keep showing up<br />for that create real change—<br />physically, mentally,<br />and emotionally.</p>
      </section>

      <aside className={styles.perfectionConsistencyTakeaway}>
        <span aria-hidden="true"><BotanicalBranch /></span>
        <p>Keep going.<br />You&rsquo;re building<br />something<br />powerful.</p>
      </aside>

      <div className={styles.perfectionConsistencyPageNumber} aria-hidden="true"><i />35<i /></div>
    </article>
  );
}

function RecipeCollectionSectionPhonePage() {
  return (
    <article className={`${styles.page} ${styles.recipeCollectionSectionPage}`} aria-label="Page 30: Your Personalized Recipe Collection">
      <BotanicalBranch className={styles.recipeCollectionSectionTopBranch} />
      <header className={styles.recipeCollectionSectionTopline}>ZenPlato <span>|</span> 05 Your Personalized Recipe Collection</header>
      <div className={styles.recipeCollectionSectionTopRule} aria-hidden="true" />

      <section className={styles.recipeCollectionSectionIntro}>
        <p className={styles.recipeCollectionSectionLabel}>Section</p>
        <div className={styles.recipeCollectionSectionNumber}>05</div>
        <div className={styles.recipeCollectionSectionDivider} aria-hidden="true"><i /><BotanicalBranch /><i /></div>
        <h2>Your<br />Personalized<br />Recipe<br />Collection</h2>
        <i className={styles.recipeCollectionSectionShortRule} aria-hidden="true" />
        <p className={styles.recipeCollectionSectionCopy}>Good food should feel nourishing,<br />satisfying, and simple to prepare.<br />These recipes are designed to<br />support your hormones, energy,<br />and overall wellbeing—without<br />sacrifice or restriction.</p>
      </section>

      <aside className={styles.recipeCollectionSectionTakeaway}>
        <span aria-hidden="true"><BotanicalBranch /></span>
        <p>Real ingredients.<br />Real nourishment. Real you.</p>
      </aside>

      <div className={styles.recipeCollectionSectionPageNumber} aria-hidden="true"><i />69<i /></div>
    </article>
  );
}

const recipeCollectionPillars = [
  { icon: "whole", title: "Whole Ingredients", copy: "Simple foods selected for everyday nourishment." },
  { icon: "balance", title: "Hormone Balancing", copy: "Balanced meals designed to support steadier rhythms." },
  { icon: "energy", title: "Sustained Energy", copy: "Nutrients that help you feel supported through the day." },
  { icon: "heart", title: "Nourishing & Delicious", copy: "Satisfying food that still feels joyful and practical." },
] as const;

function RecipeCollectionPillarIcon({ name }: { name: (typeof recipeCollectionPillars)[number]["icon"] }) {
  if (name === "whole") return <FrameworkIcon name="fibre" />;
  if (name === "balance") return <FocusIcon name="balance" />;
  if (name === "energy") {
    return (
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <path d="M36 7 17 35h13l-2 22 19-30H34l2-20Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M32 52 12 33C2 23 17 8 32 23 47 8 62 23 52 33L32 52Z" />
    </svg>
  );
}

function useRecipeCollectionContent() {
  const { ebook } = useMobileEbook();
  const label = conditionLabel(ebook);
  const insight = asText(ebook.summary.recipe_collection_intro, `These recipes are selected to support your ${label.toLowerCase()} needs, preferences, energy, and daily schedule.`);
  return { label, insight };
}

function RecipeCollectionIntroPhonePage(props: PhonePageProps) {
  const { label } = useRecipeCollectionContent();

  return (
    <article className={`${styles.page} ${styles.recipeCollectionIntroPage}`} aria-label={props["aria-label"] ?? "Welcome to your personalized recipe collection"}>
      <BotanicalBranch className={styles.recipeCollectionIntroTopBranch} />
      <header className={styles.recipeCollectionIntroTopline}>ZenPlato <span>|</span> 05 Your Personalized Recipe Collection</header>
      <div className={styles.recipeCollectionIntroTopRule} aria-hidden="true" />
      <div className={styles.recipeCollectionIntroArtwork} role="img" aria-label="A nourishing grain bowl, lemon water, and fresh greenery in warm natural light" />

      <section className={styles.recipeCollectionIntroCopy}>
        <p className={styles.recipeCollectionIntroKicker}>Welcome To</p>
        <h2>Your<br />Personalized<br />Recipe<br />Collection</h2>
        <div className={styles.recipeCollectionIntroDivider} aria-hidden="true"><i /><BotanicalBranch /><i /></div>
        <p>Every recipe in this collection is crafted with your unique {label} needs and daily routine in mind.</p>
        <p>These meals focus on whole ingredients, balanced nutrients, and delicious flavors to help you feel your best every day.</p>
      </section>

      <aside className={styles.recipeCollectionIntroContinue}>
        <span>Continue</span>
        <p>Your recipe insight and guiding principles</p>
      </aside>

      <div className={styles.recipeCollectionIntroPageNumber} aria-hidden="true"><i />70<i /></div>
    </article>
  );
}

function RecipeCollectionContinuationPhonePage(props: PhonePageProps) {
  const { insight } = useRecipeCollectionContent();

  return (
    <article className={`${styles.page} ${styles.recipeCollectionContinuationPage}`} aria-label={props["aria-label"] ?? "Personalized recipe collection insights"}>
      <BotanicalBranch className={styles.recipeCollectionIntroTopBranch} />
      <header className={styles.recipeCollectionIntroTopline}>ZenPlato <span>|</span> 05 Your Personalized Recipe Collection</header>
      <div className={styles.recipeCollectionIntroTopRule} aria-hidden="true" />
      <BotanicalBranch className={styles.recipeCollectionContinuationDecor} />

      <section className={styles.recipeCollectionContinuationIntro}>
        <p>Personalized Recipe Collection</p>
        <h2>Designed<br />around you</h2>
      </section>

      <div className={styles.recipeCollectionContinuationBody}>
        <aside className={styles.recipeCollectionIntroInsight}>
          <span aria-hidden="true"><BotanicalBranch /></span>
          <p><strong>Your Recipe Insight</strong>{insight}</p>
        </aside>

        <section className={styles.recipeCollectionIntroPillars}>
          {recipeCollectionPillars.map((pillar) => (
            <article key={pillar.title}>
              <span><RecipeCollectionPillarIcon name={pillar.icon} /></span>
              <div>
                <h3>{pillar.title}</h3>
                <p>{pillar.copy}</p>
              </div>
            </article>
          ))}
        </section>

        <aside className={styles.recipeCollectionIntroTakeaway}>
          <BotanicalBranch />
          <p>Nourish your body. Support your hormones. Enjoy the journey.</p>
        </aside>
      </div>

      <div className={styles.recipeCollectionIntroPageNumber} aria-hidden="true"><i />70 · 2<i /></div>
    </article>
  );
}

const breakfastIngredients = [
  "1 cup rolled oats (gluten-free)",
  "1 cup unsweetened almond milk",
  "½ cup plain Greek yogurt (dairy-free or regular)",
  "½ cup mixed berries (fresh or frozen)",
  "1 tbsp ground flaxseeds",
  "1 tbsp chia seeds",
  "1 tsp maple syrup (optional)",
  "1 tbsp almond butter",
  "¼ tsp vanilla extract",
  "Pinch of cinnamon",
];

const breakfastMethod = [
  "In a jar or bowl, combine oats, ground flaxseeds, chia seeds, almond milk, Greek yogurt, maple syrup, vanilla extract, and cinnamon.",
  "Stir well until everything is combined.",
  "Fold in the mixed berries and almond butter.",
  "Cover and refrigerate overnight (or at least 4 hours).",
  "In the morning, give it a good stir and enjoy chilled. Top with extra berries, seeds, or nuts if desired.",
];

const breakfastHighlights = [
  ["High In Fiber", "Supports digestion and keeps you full longer."],
  ["Hormone Balancing", "Flaxseeds and oats help support healthy estrogen metabolism."],
  ["Steady Energy", "Complex carbs and healthy fats provide long-lasting energy without spikes."],
  ["Rich In Antioxidants", "Berries help reduce inflammation and support overall wellness."],
];

type IngredientSpriteSheet = "matcha" | "smartSnack" | "beverage";

type IngredientFallbackVisual = {
  sheet: IngredientSpriteSheet;
  index: number;
};

const matchaIngredientSpritePositions = [
  "10.9% 19.7%", "90.6% 19.7%",
  "10.9% 40.1%", "90.6% 40.1%",
  "10.9% 60.5%", "90.6% 60.5%",
  "10.9% 81.2%", "90.6% 81.2%",
];

const smartSnackIngredientSpritePositions = [
  "7.9% 61.3%", "7.9% 65.6%", "7.9% 69.5%", "7.9% 73.6%", "7.9% 78.1%",
  "40.1% 61.3%", "40.1% 65.6%", "40.1% 69.5%", "40.1% 73.6%", "40.1% 78.1%",
  "72.7% 61.3%", "72.7% 65.6%", "72.7% 69.5%", "72.7% 73.6%", "72.7% 78.1%",
];

function ingredientFallbackVisual(
  name: string,
  preferredSheet: IngredientSpriteSheet,
  fallbackIndex: number,
): IngredientFallbackVisual {
  const normalized = name.toLowerCase();
  if (normalized.includes("oat")) return { sheet: "smartSnack", index: 5 };
  if (normalized.includes("peanut butter") || normalized.includes("nut butter")) return { sheet: "smartSnack", index: 6 };
  if (normalized.includes("flax")) return { sheet: "smartSnack", index: 8 };
  if (normalized.includes("chocolate") || normalized.includes("cacao") || normalized.includes("cocoa")) return { sheet: "smartSnack", index: 9 };
  if (normalized.includes("chickpea")) return { sheet: "smartSnack", index: 10 };
  if (normalized.includes("olive oil")) return { sheet: "smartSnack", index: 11 };
  if (normalized.includes("paprika")) return { sheet: "smartSnack", index: 12 };
  if (normalized.includes("cumin")) return { sheet: "smartSnack", index: 13 };
  if (normalized.includes("salt")) return { sheet: "smartSnack", index: 14 };
  if (normalized.includes("chia") || normalized.includes("hemp") || normalized.includes("seed")) return { sheet: "matcha", index: 0 };
  if (normalized.includes("matcha")) return { sheet: "matcha", index: 2 };
  if (normalized.includes("maple") || normalized.includes("honey")) return { sheet: "matcha", index: 3 };
  if (normalized.includes("vanilla")) return { sheet: "matcha", index: 4 };
  if (normalized.includes("blueberr") || normalized.includes("berr")) return { sheet: "matcha", index: 5 };
  if (normalized.includes("coconut")) return { sheet: "matcha", index: 6 };
  if (normalized.includes("pumpkin")) return { sheet: "matcha", index: 7 };
  if (normalized.includes("yogurt") || normalized.includes("yoghurt")) return { sheet: "beverage", index: 4 };
  if (normalized.includes("protein") || normalized.includes("whey")) return { sheet: "beverage", index: 3 };
  if (normalized.includes("cinnamon")) return { sheet: "beverage", index: 7 };
  if (normalized.includes("almond") && !normalized.includes("milk")) return { sheet: "beverage", index: 5 };
  if (normalized.includes("milk")) return { sheet: "matcha", index: 1 };
  return { sheet: preferredSheet, index: fallbackIndex };
}

function recipeIngredientSpriteStyle(visual: IngredientFallbackVisual): React.CSSProperties {
  if (visual.sheet === "matcha") {
    return {
      backgroundPosition: matchaIngredientSpritePositions[visual.index] || "50% 50%",
      backgroundSize: "210.4% auto",
    };
  }
  if (visual.sheet === "smartSnack") {
    return {
      backgroundPosition: smartSnackIngredientSpritePositions[visual.index] || "50% 69.5%",
      backgroundSize: "1406.7% auto",
    };
  }
  return {
    backgroundPosition: beverageIngredientSpritePositions[visual.index] || "50% 72%",
    backgroundSize: "1280% auto",
  };
}

function RecipeIngredientArtwork({
  ingredient,
  visual,
  badge,
  className,
}: {
  ingredient: RecipeIngredientItem;
  visual: IngredientFallbackVisual;
  badge?: string;
  className?: string;
}) {
  const spriteClass = visual.sheet === "matcha"
    ? styles.recipeIngredientSpriteMatcha
    : visual.sheet === "smartSnack"
      ? styles.recipeIngredientSpriteSmartSnack
      : styles.recipeIngredientSpriteBeverage;
  return (
    <span className={`${styles.recipeIngredientArtwork} ${className || ""}`}>
      {ingredient.image ? (
        <Image src={ingredient.image} alt={ingredient.name} fill sizes="7dvh" />
      ) : (
        <i
          className={`${styles.recipeIngredientSprite} ${spriteClass}`}
          style={recipeIngredientSpriteStyle(visual)}
          role="img"
          aria-label={ingredient.name}
        />
      )}
      {badge ? <b aria-hidden="true">{badge}</b> : null}
    </span>
  );
}

type RecipeMetaIconName = "time" | "servings" | "difficulty";

function RecipeMetaIcon({ name }: { name: RecipeMetaIconName }) {
  if (name === "time") {
    return (
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <circle cx="32" cy="34" r="20" />
        <path d="M32 34V21M32 34l10 6M25 8h14M32 8v6" />
      </svg>
    );
  }
  if (name === "servings") {
    return (
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <path d="M16 10v17M11 10v10c0 5 3 7 5 7s5-2 5-7V10M16 27v27M42 10v44M42 10c8 4 10 13 0 22" />
      </svg>
    );
  }
  return <FrameworkIcon name="fibre" />;
}

function RecipeMeta({ className, recipe }: { className: string; recipe: Record<string, unknown> }) {
  return (
    <section className={className}>
      <article><RecipeMetaIcon name="time" /><h3>Preparation Time</h3><p>{asText(recipe.prep_time, "10 mins")}</p></article>
      <article><RecipeMetaIcon name="servings" /><h3>Servings</h3><p>{asText(recipe.servings, "2")}</p></article>
      <article><RecipeMetaIcon name="difficulty" /><h3>Difficulty</h3><p>{asText(recipe.difficulty, "Easy")}</p></article>
    </section>
  );
}

function useBreakfastRecipeContent() {
  const { ebook, media } = useMobileEbook();
  const recipe = asRecords(ebook.summary.breakfast_recipes)[0] || {};
  const method = asRecords(recipe.method).map((step) => asText(step.body, "")).filter(Boolean);
  const highlights = asRecords(recipe.nutrition_highlights);
  return {
    recipe,
    hero: asText(recipe.image_url, media.breakfast || "/ebook/breakfasts-hero.png"),
    ingredients: normalizeRecipeIngredients(recipe, breakfastIngredients, 58).slice(0, 10),
    method: (method.length ? method : breakfastMethod).slice(0, 5),
    highlights: (highlights.length
      ? highlights.map((item) => [asText(item.title, "Nutrition highlight"), asText(item.body, "A benefit selected for your health goals.")])
      : breakfastHighlights).slice(0, 4),
  };
}

function BreakfastsPhonePage(props: PhonePageProps) {
  const { recipe, hero, highlights } = useBreakfastRecipeContent();

  return (
    <article className={`${styles.page} ${styles.breakfastsPage}`} aria-label={props["aria-label"] ?? "Building Better Breakfasts"}>
      <BotanicalBranch className={styles.breakfastsTopBranch} />
      <header className={styles.breakfastsTopline}>ZenPlato <span>|</span> 05 Your Personalized Recipe Collection</header>
      <div className={styles.breakfastsTopRule} aria-hidden="true" />

      <section className={styles.breakfastsIntro}>
        <p>Building Better</p>
        <h2>{asText(recipe.name, "Breakfasts")}</h2>
        <div className={styles.breakfastsDivider} aria-hidden="true"><i /><BotanicalBranch /><i /></div>
        <em>Start your day with balance.</em>
        <p className={styles.breakfastsCopy}>{asText(recipe.subtitle, "A nourishing breakfast designed to support balanced energy and lasting satisfaction.")}</p>
      </section>

      <RecipeMeta className={styles.breakfastsMeta} recipe={recipe} />

      <div className={styles.breakfastsHero}><Image src={hero} alt={`A serving of ${asText(recipe.name, "a nourishing breakfast")}`} fill sizes="40dvh" /></div>

      <section className={styles.breakfastsHighlights}>
        <header><h3>Nutrition Highlights</h3><span>Ingredients &amp; method continue</span></header>
        {highlights.map(([title, copy]) => (
          <article key={title}>
            <span>{title === "Hormone Balancing" ? "♎" : title === "Steady Energy" ? "ϟ" : title === "Rich In Antioxidants" ? "♡" : <FrameworkIcon name="fibre" />}</span>
            <div><h4>{title}</h4><p>{copy}</p></div>
          </article>
        ))}
      </section>

      <div className={styles.breakfastsPageNumber} aria-hidden="true"><i />71<i /></div>
    </article>
  );
}

function BreakfastPreparationPhonePage(props: PhonePageProps) {
  const { recipe, hero, ingredients, method } = useBreakfastRecipeContent();

  return (
    <article className={`${styles.page} ${styles.breakfastPreparationPage}`} aria-label={props["aria-label"] ?? "Breakfast ingredients and method"}>
      <BotanicalBranch className={styles.breakfastsTopBranch} />
      <header className={styles.breakfastsTopline}>ZenPlato <span>|</span> 05 Your Personalized Recipe Collection</header>
      <div className={styles.breakfastsTopRule} aria-hidden="true" />
      <div className={styles.breakfastPreparationPhoto}><Image src={hero} alt="" fill sizes="18dvh" aria-hidden="true" /></div>

      <section className={styles.breakfastPreparationIntro}>
        <p>Building Better</p>
        <h2>Ingredients<br />&amp; Method</h2>
      </section>

      <div className={styles.breakfastPreparationColumns}>
        <section className={styles.breakfastsIngredients}>
          <h3>Ingredients</h3>
          <ul>
            {ingredients.map((ingredient, index) => (
              <li key={`${ingredient.name}-${index}`}>
                <RecipeIngredientArtwork
                  ingredient={ingredient}
                  visual={ingredientFallbackVisual(ingredient.name, "matcha", index % 8)}
                  className={styles.breakfastIngredientArtwork}
                />
                <span>{ingredient.name}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.breakfastsMethod}>
          <h3>Method</h3>
          <ol>{method.map((item) => <li key={item}>{item}</li>)}</ol>
          <aside><BotanicalBranch /><p><strong>{asText(recipe.make_it_yours_title, "Make It Yours")}</strong>{asText(recipe.make_it_yours_body, "Adjust toppings and texture to match your preferences.")}</p></aside>
        </section>
      </div>

      <div className={styles.breakfastsPageNumber} aria-hidden="true"><i />71 · 2<i /></div>
    </article>
  );
}

const matchaProteinRows = [
  ["Chia Seeds", "5 g"],
  ["Pumpkin Seeds", "3 g"],
  ["Hemp Seeds", "2 g"],
  ["Coconut Flakes", "1 g"],
  ["Blueberries", "1 g"],
];

function useMatchaNutritionContent() {
  const { ebook, media } = useMobileEbook();
  const recipe = asRecords(ebook.summary.breakfast_recipes)[1] || asRecords(ebook.summary.breakfast_recipes)[0] || {};
  const breakdown = asRecords(recipe.nutrition_breakdown);
  const recipeIngredients = normalizeRecipeIngredients(recipe, matchaIngredientFallback, 40);
  const breakdownRows = breakdown.length
    ? breakdown.map((item) => ({
        ingredient: asText(item.ingredient, "Ingredient"),
        amount: asText(item.amount, "-"),
        image: asText(item.image_url ?? item.imageUrl, ""),
      }))
    : matchaProteinRows.map(([ingredient, amount]) => ({ ingredient, amount, image: "" }));
  return {
    recipe,
    hero: asText(recipe.image_url, media.breakfast_benefits || "/ebook/matcha-benefits-phone-hero.png"),
    breakdown: breakdownRows.slice(0, 5).map((row) => {
      const normalizedName = row.ingredient.toLowerCase();
      const matchedIngredient = recipeIngredients.find((ingredient) => {
        const normalizedIngredient = ingredient.name.toLowerCase();
        return normalizedIngredient.includes(normalizedName) || normalizedName.includes(normalizedIngredient);
      });
      return { ...row, image: row.image || matchedIngredient?.image || "" };
    }),
  };
}

function MatchaChiaNutritionPhonePage(props: PhonePageProps) {
  const { recipe, hero } = useMatchaNutritionContent();

  return (
    <article className={`${styles.page} ${styles.matchaNutritionPage}`} aria-label={props["aria-label"] ?? "Matcha Chia Pudding Bowl nutrition overview"}>
      <BotanicalBranch className={styles.matchaNutritionTopBranch} />
      <header className={styles.matchaNutritionTopline}>ZenPlato <span>|</span> 05 Your Personalized Recipe Collection</header>
      <div className={styles.matchaNutritionTopRule} aria-hidden="true" />
      <div className={styles.matchaNutritionHero}><Image src={hero} alt={`A serving of ${asText(recipe.name, "Matcha Chia Pudding Bowl")}`} fill sizes="34dvh" /></div>

      <section className={styles.matchaNutritionIntro}>
        <p>Building Better</p>
        <h2>{asText(recipe.name, "Matcha Chia Pudding Bowl")}</h2>
        <p className={styles.matchaNutritionCopy}>{asText(recipe.subtitle, "A refreshing breakfast that supports balanced energy and everyday wellbeing.")}</p>
      </section>

      <RecipeMeta className={styles.matchaNutritionMeta} recipe={recipe} />

      <aside className={styles.matchaNutritionContinue}>
        <span>Nutrition Highlights</span>
        <p>Continue for your complete protein breakdown</p>
      </aside>

      <div className={styles.matchaNutritionPageNumber} aria-hidden="true"><i />72<i /></div>
    </article>
  );
}

function MatchaProteinBreakdownPhonePage(props: PhonePageProps) {
  const { recipe, breakdown } = useMatchaNutritionContent();

  return (
    <article className={`${styles.page} ${styles.matchaProteinBreakdownPage}`} aria-label={props["aria-label"] ?? "Matcha protein breakdown"}>
      <BotanicalBranch className={styles.matchaNutritionTopBranch} />
      <header className={styles.matchaNutritionTopline}>ZenPlato <span>|</span> 05 Your Personalized Recipe Collection</header>
      <div className={styles.matchaNutritionTopRule} aria-hidden="true" />
      <BotanicalBranch className={styles.matchaProteinBreakdownDecor} />

      <section className={styles.matchaProteinBreakdownIntro}>
        <p>Nutrition Highlights</p>
        <h2>Protein<br />breakdown</h2>
      </section>

      <section className={styles.matchaProteinCard}>
        <span><FrameworkIcon name="protein" /></span>
        <div>
          <h4>{asText(recipe.protein_summary_title, "Protein")}</h4>
          <p>{asText(recipe.protein_summary_body, "A balanced protein mix to support fullness, recovery, and steady energy.")}</p>
        </div>
      </section>

      <section className={styles.matchaProteinTable}>
        <header><span>Ingredient (Protein Source)</span><span>Amount Per Serving</span></header>
        {breakdown.map((row, index) => (
          <article key={row.ingredient}>
            <RecipeIngredientArtwork
              ingredient={{ name: row.ingredient, image: row.image }}
              visual={ingredientFallbackVisual(row.ingredient, "matcha", index)}
              badge={String(index + 1).padStart(2, "0")}
              className={styles.matchaProteinIngredientArtwork}
            />
            <span>{row.ingredient}</span>
            <strong>{row.amount}</strong>
          </article>
        ))}
        <footer><span>Total Protein</span><strong>{asText(recipe.total_protein, "12 g")}</strong></footer>
      </section>

      <div className={styles.matchaNutritionPageNumber} aria-hidden="true"><i />72 · 2<i /></div>
    </article>
  );
}

function LaterEbookChrome({ section, warm = false }: { section: string; warm?: boolean }) {
  return (
    <div className={`${styles.laterEbookChrome} ${warm ? styles.laterEbookChromeWarm : ""}`} aria-hidden="true">
      <BotanicalBranch />
      <header>ZenPlato <span>|</span> {section} <span>|</span> Your Personalized Recipe Collection</header>
      <i />
    </div>
  );
}

function LaterEbookFolio({ children }: { children: React.ReactNode }) {
  return <div className={styles.laterEbookFolio} aria-hidden="true"><i />{children}<i /></div>;
}

const matchaBenefitCards = [
  { icon: "♎", title: "Hormone Balance", copy: "Supports estrogen balance and helps regulate hormonal fluctuations naturally." },
  { icon: "⌁", title: "Gut Health", copy: "High in fiber and prebiotics to nourish good bacteria and support smooth digestion." },
  { icon: "♢", title: "Immune Support", copy: "Packed with antioxidants, vitamins, and minerals to strengthen immunity and resilience." },
  { icon: "☺", title: "Mood & Stress", copy: "L-theanine in matcha promotes calm focus and helps reduce daily stress." },
  { icon: "ϟ", title: "Sustained Energy", copy: "A balanced blend of protein, healthy fats, and complex carbs for long-lasting energy." },
  { icon: "♙", title: "Skin Glow", copy: "Antioxidants and omega-3s help fight inflammation and promote clear, radiant skin." },
];

function useMatchaBenefitsContent() {
  const { ebook, media } = useMobileEbook();
  const recipe = asRecords(ebook.summary.breakfast_recipes)[1] || asRecords(ebook.summary.breakfast_recipes)[0] || {};
  const benefits = asRecords(recipe.benefits);
  return {
    recipe,
    hero: asText(recipe.image_url, media.breakfast_benefits || "/ebook/matcha-benefits-phone-hero.png"),
    benefits: matchaBenefitCards.map((fallback, index) => ({
      icon: fallback.icon,
      title: fitEbookText(benefits[index]?.title, fallback.title, 34),
      copy: fitEbookText(benefits[index]?.body, fallback.copy, 118),
    })),
  };
}

function MatchaBenefitRows({ items }: { items: Array<{ icon: string; title: string; copy: string }> }) {
  return (
    <section className={styles.fixedBenefitRows}>
      {items.map((item) => (
        <article key={item.title}>
          <span>{item.icon}</span>
          <div><h3>{item.title}</h3><p>{item.copy}</p></div>
        </article>
      ))}
    </section>
  );
}

function MatchaChiaBenefitsPhonePage(props: PhonePageProps) {
  const { recipe, hero, benefits } = useMatchaBenefitsContent();

  return (
    <article className={`${styles.page} ${styles.laterEditorialPage} ${styles.fixedMatchaBenefitsPage}`} aria-label={props["aria-label"] ?? "What this bowl does for you"}>
      <LaterEbookChrome section="05" />
      <div className={styles.fixedMatchaBenefitsHero}><Image src={hero} alt={`Benefits of ${asText(recipe.name, "your personalized breakfast")}`} fill sizes="34dvh" /></div>

      <section className={styles.fixedMatchaBenefitsIntro}>
        <p>Beyond Nutrition</p>
        <h2>What This Bowl<br />Does For You</h2>
        <p>More than a meal, this bowl nourishes your body, balances your hormones, and supports everyday wellbeing.</p>
      </section>

      <MatchaBenefitRows items={benefits.slice(0, 3)} />

      <aside className={styles.fixedPageContinue}><strong>Continue</strong><span>Three more ways this recipe supports you</span></aside>
      <LaterEbookFolio>73</LaterEbookFolio>
    </article>
  );
}

function MatchaBenefitsContinuationPhonePage(props: PhonePageProps) {
  const { benefits } = useMatchaBenefitsContent();

  return (
    <article className={`${styles.page} ${styles.laterEditorialPage} ${styles.fixedMatchaBenefitsContinuationPage}`} aria-label={props["aria-label"] ?? "What this bowl does for you continued"}>
      <LaterEbookChrome section="05" />
      <BotanicalBranch className={styles.fixedPageDecorBranch} />
      <section className={styles.fixedContinuationTitle}>
        <p>Beyond Nutrition</p>
        <h2>Everyday<br />support</h2>
      </section>
      <MatchaBenefitRows items={benefits.slice(3, 6)} />
      <aside className={styles.fixedMatchaBenefitsTakeaway}>
        <span>♧</span>
        <div><strong>Nourish. Balance. Thrive.</strong><p>Small choices today create lasting change tomorrow.</p></div>
      </aside>
      <LaterEbookFolio>73 · 2</LaterEbookFolio>
    </article>
  );
}

const matchaIngredientFallback = [
  "Chia seeds",
  "Unsweetened almond milk",
  "Matcha powder",
  "Maple syrup",
  "Vanilla extract",
  "Blueberries",
  "Coconut flakes",
  "Pumpkin seeds",
];

function matchaIngredientDetail(name: string) {
  const normalized = name.toLowerCase();
  if (normalized.includes("chia")) return "Fiber-rich base that creates the pudding texture.";
  if (normalized.includes("almond") || normalized.includes("milk")) return "Keeps the bowl creamy and dairy-light.";
  if (normalized.includes("matcha") || normalized.includes("green tea")) return "Adds calm focus and antioxidant support.";
  if (normalized.includes("maple") || normalized.includes("syrup") || normalized.includes("honey")) return "A gentle touch of natural sweetness.";
  if (normalized.includes("vanilla")) return "Rounds out the flavor with a warm aroma.";
  if (normalized.includes("blueberr") || normalized.includes("berr")) return "Adds freshness and protective antioxidants.";
  if (normalized.includes("coconut")) return "Brings texture and satisfying healthy fats.";
  if (normalized.includes("pumpkin") || normalized.includes("seed")) return "Adds crunch, magnesium, and plant protein.";
  return "Adds balanced texture, flavor, and everyday nourishment.";
}

const matchaCookingRows = [
  { number: "01", title: "Prepare Matcha", copy: "Whisk matcha powder with a splash of warm water until smooth and lump-free." },
  { number: "02", title: "Make Pudding", copy: "Combine chia seeds, milk, maple syrup, vanilla, and the whisked matcha. Stir well." },
  { number: "03", title: "Chill", copy: "Cover and refrigerate for at least 4 hours or overnight, until thick and pudding-like." },
  { number: "04", title: "Prepare Toppings", copy: "Slice kiwi and gather blueberries, pumpkin seeds, coconut flakes, and your favorite toppings." },
  { number: "05", title: "Assemble", copy: "Spoon the chilled matcha chia pudding into a bowl." },
  { number: "06", title: "Top & Enjoy", copy: "Finish with kiwi, blueberries, pumpkin seeds, coconut flakes, and any other favorites." },
];

function useMatchaRecipeInstructions() {
  const { ebook } = useMobileEbook();
  const recipe = asRecords(ebook.summary.breakfast_recipes)[1] || asRecords(ebook.summary.breakfast_recipes)[0] || {};
  const method = asRecords(recipe.method);
  return {
    recipe,
    name: fitEbookText(recipe.name, "Matcha Chia Pudding Bowl", 42),
    ingredients: normalizeRecipeIngredients(recipe, matchaIngredientFallback, 36).map((ingredient) => ({
      ...ingredient,
      detail: ingredient.detail || matchaIngredientDetail(ingredient.name),
    })),
    methodMeta: [
      ["Prep Time", fitEbookText(recipe.prep_time, "10 mins", 16)],
      ["Servings", fitEbookText(recipe.servings, "2", 12)],
      ["Difficulty", fitEbookText(recipe.difficulty, "Easy", 16)],
    ],
    prepNote: fitEbookText(method[0]?.body, matchaCookingRows[0].copy, 94),
    steps: matchaCookingRows.map((fallback, index) => ({
      number: fallback.number,
      title: fitEbookText(method[index]?.title, fallback.title, 30),
      copy: fitEbookText(method[index]?.body, fallback.copy, 118),
    })),
    tipTitle: fitEbookText(recipe.make_it_yours_title, "Make It Yours", 30),
    tipCopy: fitEbookText(recipe.make_it_yours_body, "Adjust texture, toppings, and sweetness to your preference.", 105),
  };
}

function MatchaInstructionsSpreadPhonePage({ part, ...props }: PhonePageProps & { part: 0 | 1 }) {
  const { name, ingredients, prepNote, tipTitle, tipCopy } = useMatchaRecipeInstructions();
  const visibleIngredients = ingredients.slice(part * 4, part * 4 + 4);

  return (
    <article className={`${styles.page} ${styles.laterEditorialPage} ${part === 1 ? styles.fixedMatchaIngredientsContinuationPage : ""}`} aria-label={props["aria-label"] ?? `${name} ingredients ${part + 1}`}>
      <LaterEbookChrome section="05" />
      <div className={styles.fixedMatchaIngredientArtwork}>
        <Image
          src={part === 0 ? "/ebook/matcha-ingredients-bg.png" : "/ebook/matcha-benefits-phone-hero.png"}
          alt={part === 0 ? "Matcha pudding ingredients arranged in warm natural light" : "A finished matcha chia pudding bowl"}
          fill
          sizes="25dvh"
        />
      </div>
      <section className={styles.fixedMatchaIngredientsIntro}>
        <p>{name}</p>
        <h2>Ingredients<br /><span>{part === 0 ? "01–04" : "05–08"}</span></h2>
      </section>
      <section className={styles.fixedMatchaIngredientList}>
        {visibleIngredients.map((ingredient, index) => (
          <article key={ingredient.name}>
            <RecipeIngredientArtwork
              ingredient={ingredient}
              visual={ingredientFallbackVisual(ingredient.name, "matcha", part * 4 + index)}
              badge={String(part * 4 + index + 1).padStart(2, "0")}
              className={styles.matchaIngredientArtwork}
            />
            <div className={styles.fixedMatchaIngredientCopy}>
              <span>{ingredient.name}</span>
              <small>{ingredient.detail}</small>
            </div>
          </article>
        ))}
      </section>
      {part === 0 ? (
        <aside className={styles.fixedMatchaIngredientPrepNote}>
          <strong>Prep note</strong>
          <p>{prepNote}</p>
        </aside>
      ) : null}
      {part === 1 ? (
        <aside className={styles.fixedMatchaIngredientTip}>
          <BotanicalBranch /><div><h3>{tipTitle}</h3><p>{tipCopy}</p></div>
        </aside>
      ) : <aside className={styles.fixedPageContinue}><strong>Continue</strong><span>Four more ingredients and your customization tip</span></aside>}
      <LaterEbookFolio>{part === 0 ? "75" : "75 · 2"}</LaterEbookFolio>
    </article>
  );
}

function MatchaCookingMethodPhonePage({ part, ...props }: PhonePageProps & { part: 0 | 1 }) {
  const { name, methodMeta, steps, tipTitle, tipCopy } = useMatchaRecipeInstructions();
  const visibleSteps = steps.slice(part * 3, part * 3 + 3);

  return (
    <article className={`${styles.page} ${styles.laterEditorialPage}`} aria-label={props["aria-label"] ?? `${name} method ${part + 1}`}>
      <LaterEbookChrome section="05" />
      <div className={styles.fixedMatchaCookingHero}><Image src="/ebook/matcha-benefits-phone-hero.png" alt="" fill sizes="19dvh" aria-hidden="true" /></div>
      <section className={styles.fixedMatchaCookingIntro}>
        <p>Building Better</p>
        <h2>{name}</h2>
        <span>Method · {part === 0 ? "01–03" : "04–06"}</span>
      </section>
      <section className={styles.fixedMatchaCookingRows}>
        {visibleSteps.map((step) => (
          <article key={step.number}>
            <strong>{step.number}</strong>
            <div><h3>{step.title}</h3><p>{step.copy}</p></div>
          </article>
        ))}
      </section>
      {part === 0 ? (
        <aside className={styles.fixedMatchaMethodMeta} aria-label="Recipe preparation details">
          {methodMeta.map(([label, value]) => (
            <div key={label}><strong>{label}</strong><span>{value}</span></div>
          ))}
        </aside>
      ) : (
        <aside className={styles.fixedMatchaReadyCue}>
          <strong>Ready when</strong><span>Thick, spoonable, and fully chilled.</span>
        </aside>
      )}
      {part === 1 ? (
        <aside className={styles.fixedMatchaCookingTip}><BotanicalBranch /><div><h3>{tipTitle}</h3><p>{tipCopy}</p></div></aside>
      ) : <aside className={styles.fixedPageContinue}><strong>Continue</strong><span>Finish, assemble, and personalize your bowl</span></aside>}
      <LaterEbookFolio>{part === 0 ? "76" : "76 · 2"}</LaterEbookFolio>
    </article>
  );
}

const smartSnackColumns = [
  {
    title: <>Overnight Chia<br />Protein Pudding</>,
    ingredients: ["Chia seeds", "Almond milk", "Vanilla protein powder", "Maple syrup", "Blueberries & almonds"],
  },
  {
    title: <>No-Bake<br />Energy Bites</>,
    ingredients: ["Oats", "Peanut butter", "Honey", "Flaxseeds", "Dark chocolate chips"],
  },
  {
    title: <>Spiced Roasted<br />Chickpeas</>,
    ingredients: ["Chickpeas", "Olive oil", "Paprika", "Cumin powder", "Sea salt"],
  },
];

function SmartSnacksIngredientsPhonePage() {
  const { ebook } = useMobileEbook();
  const supplied = asRecords(ebook.summary.snack_recipes);
  const columns = smartSnackColumns.map((fallback, index) => {
    const record = supplied[index] || {};
    const ingredients = asStrings(record.ingredients);
    return {
      title: asText(record.name, typeof fallback.title === "string" ? fallback.title : `Smart snack ${index + 1}`),
      ingredients: ingredients.length ? ingredients : fallback.ingredients,
    };
  });

  return (
    <article className={`${styles.page} ${styles.smartSnacksIngredientsPage}`} aria-label="Page 38: Smart Snacks ingredients">
      <header className={styles.smartSnacksIngredientsTopline}>ZenPlato <span>|</span> 06 <span>|</span> Your Personalized Recipe Collection</header>
      <section className={styles.smartSnacksIngredientsIntro}>
        <h2>Smart Snacks</h2>
        <p>Wholesome ingredients. Smarter choices.</p>
      </section>
      <section className={styles.smartSnacksIngredientColumns}>
        {columns.map((column) => (
          <article key={String(column.ingredients[0])}>
            <h3>{column.title}</h3>
            <h4>Ingredients</h4>
            <ul>
              {column.ingredients.map((ingredient) => (
                <li key={ingredient}>{ingredient}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>
      <aside className={styles.smartSnacksBenefits}>
        <div>
          <h3>Real Ingredients.<br />Real Benefits.</h3>
          <i aria-hidden="true" />
          <p>Simple, wholesome<br />ingredients to fuel your<br />body and mind.</p>
        </div>
        <p>Naturally<br />Nourishing</p>
        <p>Clean &amp;<br />Wholesome</p>
        <p>No Artificial<br />Additives</p>
      </aside>
      <p className={styles.smartSnacksClosing}>Small bites. Big impact.</p>
    </article>
  );
}

const smartSnackFeatureRows = [
  { title: "Nutrient Dense", copy: <>Packed with essential<br />nutrients</> },
  { title: "Energy Boost", copy: <>Keeps you energized<br />and focused</> },
  { title: "Satisfying", copy: <>Keeps cravings in<br />check longer</> },
  { title: "Good For You", copy: <>Clean ingredients,<br />real benefits</> },
];

const smartSnackCards = [
  {
    title: <>Overnight Chia<br />Protein Pudding</>,
    copy: <>Creamy, filling &amp; perfect<br />make-ahead snack.</>,
    ingredients: ["Chia seeds", "Almond milk", "Vanilla protein powder", "Maple syrup", "Blueberries & almonds"],
    meta: [["Prep Time", "5 mins"], ["Chill Time", "Overnight"], ["Serves", "1"]],
  },
  {
    title: <>No-Bake<br />Energy Bites</>,
    copy: <>Quick, no-bake bites for<br />sustained energy.</>,
    ingredients: ["Oats", "Peanut butter", "Honey", "Flaxseeds", "Dark chocolate chips"],
    meta: [["Prep Time", "10 mins"], ["Serves", "2"], ["Store In", "Fridge"]],
  },
  {
    title: <>Spiced Roasted<br />Chickpeas</>,
    copy: <>Crunchy, savory &amp; perfect<br />on-the-go.</>,
    ingredients: ["Chickpeas", "Olive oil", "Paprika", "Cumin powder", "Sea salt"],
    meta: [["Prep Time", "5 mins"], ["Bake Time", "25 mins"], ["Serves", "2"]],
  },
];

const smartSnackingBenefits = [
  <>Stabilizes<br />blood sugar</>,
  <>Improves focus<br />&amp; productivity</>,
  <>Supports healthy<br />digestion</>,
  <>Strengthens<br />immunity</>,
  <>Helps manage<br />weight</>,
  <>Keeps you full<br />&amp; satisfied</>,
];

function SmartSnacksCardsPhonePage() {
  const { ebook } = useMobileEbook();
  const supplied = asRecords(ebook.summary.snack_recipes);
  const cards = smartSnackCards.map((fallback, index) => {
    const record = supplied[index] || {};
    const ingredients = asStrings(record.ingredients);
    return {
      title: asText(record.name, typeof fallback.title === "string" ? fallback.title : `Smart snack ${index + 1}`),
      copy: asText(record.subtitle, "A smart snack selected to support energy and satisfaction."),
      ingredients: ingredients.length ? ingredients : fallback.ingredients,
      meta: [
        ["Prep Time", asText(record.prep_time, fallback.meta[0][1])],
        [record.bake_time ? "Bake Time" : record.chill_time ? "Chill Time" : "Store In", asText(record.bake_time ?? record.chill_time ?? record.store_in, fallback.meta[1][1])],
        ["Serves", asText(record.servings, fallback.meta[2][1])],
      ],
    };
  });
  const features = asRecords(ebook.summary.snack_features);
  const benefits = asRecords(ebook.summary.snack_benefits);

  return (
    <article className={`${styles.page} ${styles.smartSnacksCardsPage}`} aria-label="Page 39: Smart Snacks recipe cards">
      <header className={styles.smartSnacksCardsTopline}>ZenPlato <span>|</span> 06 <span>|</span> Your Personalized Recipe Collection</header>
      <section className={styles.smartSnacksCardsIntro}>
        <h2>Smart Snacks</h2>
        <p>Delicious choices that fuel your day,<br />satisfy cravings, and support your goals.</p>
      </section>
      <section className={styles.smartSnackFeatureRows}>
        {smartSnackFeatureRows.map((fallback, index) => (
          <article key={fallback.title}>
            <h3>{asText(features[index]?.title, fallback.title)}</h3>
            <p>{asText(features[index]?.body, "A personalized smart-snacking benefit.")}</p>
          </article>
        ))}
      </section>
      <section className={styles.smartSnackCardsGrid}>
        {cards.map((card) => (
          <article key={String(card.ingredients[0])}>
            <h3>{card.title}</h3>
            <p>{card.copy}</p>
            <h4>Ingredients</h4>
            <ul>
              {card.ingredients.map((ingredient) => (
                <li key={ingredient}>{ingredient}</li>
              ))}
            </ul>
            <footer>
              {card.meta.map(([label, value]) => (
                <div key={label}>
                  <strong>{label}</strong>
                  <span>{value}</span>
                </div>
              ))}
            </footer>
          </article>
        ))}
      </section>
      <section className={styles.smartSnackingBenefitPanel}>
        <h3>Smart Snacking = Smarter You</h3>
        <div>
          {smartSnackingBenefits.map((benefit, index) => (
            <p key={index}>{asText(benefits[index]?.title, typeof benefit === "string" ? benefit : `Snack benefit ${index + 1}`)}</p>
          ))}
        </div>
      </section>
      <p className={styles.smartSnacksCardsClosing}>Small bites. Big impact.</p>
    </article>
  );
}

const fixedSmartSnackCards = [
  {
    title: "Overnight Chia Protein Pudding",
    copy: "A creamy, filling, make-ahead snack.",
    ingredients: ["Chia seeds", "Almond milk", "Vanilla protein powder", "Maple syrup", "Blueberries & almonds"],
    meta: [["Prep Time", "5 mins"], ["Chill Time", "Overnight"], ["Serves", "1"]],
  },
  {
    title: "No-Bake Energy Bites",
    copy: "Quick, no-bake bites for sustained energy.",
    ingredients: ["Oats", "Peanut butter", "Honey", "Flaxseeds", "Dark chocolate chips"],
    meta: [["Prep Time", "10 mins"], ["Store In", "Fridge"], ["Serves", "2"]],
  },
  {
    title: "Spiced Roasted Chickpeas",
    copy: "A crunchy, savory snack that travels well.",
    ingredients: ["Chickpeas", "Olive oil", "Paprika", "Cumin powder", "Sea salt"],
    meta: [["Prep Time", "5 mins"], ["Bake Time", "25 mins"], ["Serves", "2"]],
  },
] as const;

const fixedSmartSnackFeatures = [
  { title: "Nutrient Dense", copy: "Packed with essential nutrients." },
  { title: "Energy Boost", copy: "Keeps you energized and focused." },
  { title: "Satisfying", copy: "Helps keep cravings in check longer." },
  { title: "Good For You", copy: "Clean ingredients with real benefits." },
];

const fixedSmartSnackBenefits = [
  "Stabilizes blood sugar",
  "Improves focus and productivity",
  "Supports healthy digestion",
  "Strengthens immunity",
  "Helps manage weight",
  "Keeps you full and satisfied",
];

function useFixedSmartSnackContent() {
  const { ebook } = useMobileEbook();
  const supplied = asRecords(ebook.summary.snack_recipes);
  const featureRecords = asRecords(ebook.summary.snack_features);
  const benefitRecords = asRecords(ebook.summary.snack_benefits);

  return {
    cards: fixedSmartSnackCards.map((fallback, index) => {
      const record = supplied[index] || {};
      return {
        title: fitEbookText(record.name, fallback.title, 46),
        copy: fitEbookText(record.subtitle, fallback.copy, 86),
        ingredients: normalizeRecipeIngredients(record, fallback.ingredients, 34),
        image: asText(record.image_url, ""),
        meta: [
          ["Prep Time", fitEbookText(record.prep_time, fallback.meta[0][1], 16)],
          [record.bake_time ? "Bake Time" : record.chill_time ? "Chill Time" : "Store In", fitEbookText(record.bake_time ?? record.chill_time ?? record.store_in, fallback.meta[1][1], 16)],
          ["Serves", fitEbookText(record.servings, fallback.meta[2][1], 12)],
        ],
      };
    }),
    features: fixedSmartSnackFeatures.map((fallback, index) => ({
      title: fitEbookText(featureRecords[index]?.title, fallback.title, 30),
      copy: fitEbookText(featureRecords[index]?.body, fallback.copy, 78),
    })),
    benefits: fixedSmartSnackBenefits.map((fallback, index) => fitEbookText(benefitRecords[index]?.title, fallback, 42)),
  };
}

function FixedSmartSnacksOverviewPhonePage(props: PhonePageProps) {
  const { cards, features, benefits } = useFixedSmartSnackContent();

  return (
    <article className={`${styles.page} ${styles.laterEditorialPage}`} aria-label={props["aria-label"] ?? "Smart Snacks overview"}>
      <LaterEbookChrome section="06" />
      <div className={styles.fixedSmartSnacksArtwork}><Image src="/ebook/smart-snacks-ingredients-bg.png" alt="Three nourishing smart snack recipes" fill sizes="22dvh" /></div>
      <section className={styles.fixedSmartSnacksIntro}>
        <p>Building Better</p>
        <h2>Smart Snacks</h2>
        <span>Wholesome ingredients. Smarter choices.</span>
      </section>
      <section className={styles.fixedSmartSnackNames}>
        {cards.map((card, index) => (
          <article key={card.title}><i>0{index + 1}</i><div><h3>{card.title}</h3><p>{card.copy}</p></div></article>
        ))}
      </section>
      <section className={styles.fixedSmartSnackFeatures}>
        {features.map((feature) => (
          <article key={feature.title}><h3>{feature.title}</h3><p>{feature.copy}</p></article>
        ))}
      </section>
      <aside className={styles.fixedSmartSnackBenefitSummary}>
        <strong>Smart Snacking = Smarter You</strong>
        <p>{benefits.slice(0, 3).join(" · ")}</p>
        <small>Also supports: {benefits.slice(3, 6).join(" · ")}</small>
      </aside>
      <LaterEbookFolio>77</LaterEbookFolio>
    </article>
  );
}

function FixedSmartSnackDetailPhonePage({ index, ...props }: PhonePageProps & { index: 0 | 1 | 2 }) {
  const { cards, benefits } = useFixedSmartSnackContent();
  const card = cards[index];

  return (
    <article className={`${styles.page} ${styles.laterEditorialPage}`} aria-label={props["aria-label"] ?? card.title}>
      <LaterEbookChrome section="06" />
      <section className={styles.fixedSmartSnackDetailIntro}>
        <p>Smart Snack · 0{index + 1}</p>
        <h2>{card.title}</h2>
        <span>{card.copy}</span>
      </section>
      <div className={`${styles.fixedSmartSnackDetailPhoto} ${styles[`fixedSmartSnackDetailPhoto${index + 1}`]}`}>
        {card.image ? <Image src={card.image} alt={card.title} fill sizes="23dvh" /> : null}
      </div>
      <section className={styles.fixedSmartSnackIngredients}>
        <h3>Ingredients</h3>
        <ul>
          {card.ingredients.map((ingredient, ingredientIndex) => (
            <li key={ingredient.name}>
              <RecipeIngredientArtwork
                ingredient={ingredient}
                visual={ingredientFallbackVisual(ingredient.name, "smartSnack", index * 5 + ingredientIndex)}
                badge={String(ingredientIndex + 1).padStart(2, "0")}
                className={styles.smartSnackIngredientArtwork}
              />
              <span>{ingredient.name}</span>
            </li>
          ))}
        </ul>
      </section>
      <section className={styles.fixedSmartSnackMeta}>
        {card.meta.map(([label, value]) => <div key={label}><strong>{label}</strong><span>{value}</span></div>)}
      </section>
      <aside className={styles.fixedSmartSnackDetailBenefit}><strong>Why It Works</strong><p>{benefits[index]}.</p></aside>
      <LaterEbookFolio>78 · {index + 1}</LaterEbookFolio>
    </article>
  );
}

const beverageFeatures = [
  { title: "Nutrient Rich", copy: <>Packed with vitamins,<br />minerals &amp; antioxidants</> },
  { title: "Energizing", copy: <>Naturally boosts energy<br />and reduces fatigue</> },
  { title: "Immunity Support", copy: <>Strengthens immunity<br />and builds resilience</> },
  { title: "Hydrating", copy: <>Supports hydration<br />and detoxification</> },
];

const beverageCards = [
  {
    accent: "berry",
    image: "/ebook/nourishing-phone-berry.png",
    title: <>Berry Protein<br />Smoothie</>,
    copy: <>A creamy, protein-packed smoothie<br />to fuel your day.</>,
    ingredients: ["Blueberries", "Chia seeds", "Banana", "Protein powder", "Greek yogurt", "Almond milk"],
    metrics: [["Prep Time", "5 mins"], ["Blend Time", "1 min"], ["Serves", "1"]],
  },
  {
    accent: "gold",
    image: "/ebook/nourishing-phone-golden.png",
    title: <>Golden Milk<br />(Turmeric Latte)</>,
    copy: <>A warm, soothing drink to support<br />immunity and relaxation.</>,
    ingredients: ["Milk (dairy or plant-based)", "Cinnamon", "Turmeric powder", "Black pepper", "Ginger powder", "Honey or maple syrup"],
    metrics: [["Prep Time", "5 mins"], ["Cook Time", "5 mins"], ["Serves", "1"]],
  },
  {
    accent: "green",
    image: "/ebook/nourishing-phone-green.png",
    title: <>Green Detox<br />Drink</>,
    copy: <>A refreshing blend to detox, hydrate<br />and rejuvenate.</>,
    ingredients: ["Cucumber", "Lemon juice", "Celery", "Ginger", "Spinach", "Mint leaves"],
    metrics: [["Prep Time", "5 mins"], ["Blend Time", "1 min"], ["Serves", "1"]],
  },
];

const beverageBenefits = [
  <>Rich in<br />Antioxidants</>,
  <>Supports<br />Digestion</>,
  <>Promotes<br />Healthy Skin</>,
  <>Helps Manage<br />Weight</>,
  <>Improves Mood<br />&amp; Well-being</>,
];

function NourishingBeveragesPhonePage() {
  const { ebook } = useMobileEbook();
  const supplied = asRecords(ebook.summary.beverage_recipes);
  const cards = beverageCards.map((fallback, index) => {
    const record = supplied[index] || {};
    const ingredients = asStrings(record.ingredients);
    return {
      ...fallback,
      title: asText(record.name, typeof fallback.title === "string" ? fallback.title : `Nourishing beverage ${index + 1}`),
      copy: asText(record.subtitle, "A personalized beverage selected to support your health goals."),
      ingredients: ingredients.length ? ingredients : fallback.ingredients,
      image: asText(record.image_url, fallback.image),
      metrics: [
        ["Prep Time", asText(record.prep_time, fallback.metrics[0][1])],
        [record.cook_time ? "Cook Time" : "Blend Time", asText(record.cook_time ?? record.blend_time, fallback.metrics[1][1])],
        ["Serves", asText(record.servings, fallback.metrics[2][1])],
      ],
    };
  });
  const features = asRecords(ebook.summary.beverage_features);
  const benefits = asRecords(ebook.summary.beverage_benefits);

  return (
    <article className={`${styles.page} ${styles.nourishingBeveragesPage}`} aria-label="Page 40: Nourishing Beverages">
      <BotanicalBranch className={styles.nourishingTopBranch} />
      <header className={styles.nourishingTopline}>ZenPlato <span>|</span> 07 <span>|</span> Your Personalized Recipe Collection</header>
      <div className={styles.nourishingTopRule} aria-hidden="true" />
      <div className={styles.nourishingHero}>
        <DynamicEbookImage mediaKey="beverages" fallbackSrc="/ebook/nourishing-phone-hero.png" alt="A nourishing beverage selected for your guide" fill sizes="18dvh" />
      </div>
      <section className={styles.nourishingIntro}>
        <h2>Nourishing<br />Beverages</h2>
        <div aria-hidden="true"><i /><BotanicalBranch /><i /></div>
        <p><em>Sip well. Live well.</em></p>
        <p>Delicious beverages crafted with<br />real ingredients for a healthier you.</p>
      </section>
      <section className={styles.nourishingFeatures}>
        {beverageFeatures.map((fallback, index) => (
          <article key={fallback.title}>
            <h3>{asText(features[index]?.title, fallback.title)}</h3>
            <p>{asText(features[index]?.body, "A personalized benefit for your daily wellbeing.")}</p>
          </article>
        ))}
      </section>
      <section className={styles.nourishingCards}>
        {cards.map((card) => (
          <article className={styles[`nourishingCard${card.accent}`]} key={card.accent}>
            <div className={styles.nourishingCardPhoto}>
              <Image src={card.image} alt="" fill sizes="16dvh" aria-hidden="true" />
            </div>
            <div className={styles.nourishingCardCopy}>
              <h3>{card.title}</h3>
              <i aria-hidden="true" />
              <p>{card.copy}</p>
              <ul>
                {card.ingredients.map((ingredient) => (
                  <li key={ingredient}>{ingredient}</li>
                ))}
              </ul>
            </div>
            <footer>
              {card.metrics.map(([label, value]) => (
                <div key={label}><strong>{label}</strong><span>{value}</span></div>
              ))}
            </footer>
          </article>
        ))}
      </section>
      <section className={styles.nourishingBenefits}>
        <div><h3>Good For You.<br />Good For Life.</h3><p>Simple ingredients.<br />Lasting impact.</p></div>
        {beverageBenefits.map((benefit, index) => (
          <p key={index}>{asText(benefits[index]?.title, typeof benefit === "string" ? benefit : `Wellness benefit ${index + 1}`)}</p>
        ))}
      </section>
      <p className={styles.nourishingClosing}>Good ingredients. Real results.</p>
    </article>
  );
}

const fixedBeverageCards = [
  {
    accent: "berry",
    image: "/ebook/nourishing-phone-berry.png",
    title: "Berry Protein Smoothie",
    copy: "A creamy, protein-packed smoothie to fuel your day.",
    ingredients: ["Blueberries", "Chia seeds", "Banana", "Protein powder", "Greek yogurt", "Almond milk"],
    metrics: [["Prep Time", "5 mins"], ["Blend Time", "1 min"], ["Serves", "1"]],
  },
  {
    accent: "gold",
    image: "/ebook/nourishing-phone-golden.png",
    title: "Golden Milk (Turmeric Latte)",
    copy: "A warm, soothing drink to support immunity and relaxation.",
    ingredients: ["Milk (dairy or plant-based)", "Cinnamon", "Turmeric powder", "Black pepper", "Ginger powder", "Honey or maple syrup"],
    metrics: [["Prep Time", "5 mins"], ["Cook Time", "5 mins"], ["Serves", "1"]],
  },
  {
    accent: "green",
    image: "/ebook/nourishing-phone-green.png",
    title: "Green Detox Drink",
    copy: "A refreshing blend to hydrate and rejuvenate.",
    ingredients: ["Cucumber", "Lemon juice", "Celery", "Ginger", "Spinach", "Mint leaves"],
    metrics: [["Prep Time", "5 mins"], ["Blend Time", "1 min"], ["Serves", "1"]],
  },
] as const;

const fixedBeverageFeatures = [
  { title: "Nutrient Rich", copy: "Packed with vitamins, minerals, and antioxidants." },
  { title: "Energizing", copy: "Naturally supports energy and reduces fatigue." },
  { title: "Immunity Support", copy: "Strengthens immunity and builds resilience." },
  { title: "Hydrating", copy: "Supports daily hydration and refreshment." },
];

const fixedBeverageBenefits = [
  "Rich in antioxidants",
  "Supports digestion",
  "Promotes healthy skin",
  "Helps manage weight",
  "Supports mood and wellbeing",
];

const beverageIngredientSpritePositions = [
  "4.6% 65.4%", "20.9% 65.7%", "4.6% 69.4%", "20.9% 71%", "4.6% 75.3%", "4.6% 79.2%",
  "38.4% 65.9%", "54.7% 67.5%", "38.4% 71.2%", "54.7% 71.4%", "38.4% 75.6%", "54.7% 75.8%",
  "72.1% 65.5%", "88.4% 65.7%", "72.1% 69.9%", "72.1% 75.3%", "88.4% 71%", "88.4% 75.3%",
];

function beverageIngredientVisualIndex(name: string, fallbackIndex: number) {
  const normalized = name.toLowerCase();
  if (normalized.includes("blueberr") || normalized.includes("berr")) return 0;
  if (normalized.includes("chia") || normalized.includes("seed")) return 1;
  if (normalized.includes("banana")) return 2;
  if (normalized.includes("protein") || normalized.includes("whey")) return 3;
  if (normalized.includes("yogurt") || normalized.includes("yoghurt")) return 4;
  if (normalized.includes("almond")) return 5;
  if (normalized.includes("cinnamon")) return 7;
  if (normalized.includes("turmeric")) return 8;
  if (normalized.includes("pepper")) return 9;
  if (normalized.includes("honey") || normalized.includes("maple")) return 11;
  if (normalized.includes("cucumber")) return 12;
  if (normalized.includes("lemon") || normalized.includes("lime") || normalized.includes("citrus")) return 13;
  if (normalized.includes("celery")) return 14;
  if (normalized.includes("spinach") || normalized.includes("leafy green")) return 15;
  if (normalized.includes("ginger")) return fallbackIndex === 10 ? 10 : 16;
  if (normalized.includes("mint")) return 17;
  if (normalized.includes("milk")) return 6;
  return fallbackIndex;
}

function beverageIngredientSpriteStyle(index: number): React.CSSProperties {
  return {
    backgroundPosition: beverageIngredientSpritePositions[index] || "50% 72%",
    backgroundSize: "1280% auto",
  };
}

function useFixedBeverageContent() {
  const { ebook } = useMobileEbook();
  const supplied = asRecords(ebook.summary.beverage_recipes);
  const featureRecords = asRecords(ebook.summary.beverage_features);
  const benefitRecords = asRecords(ebook.summary.beverage_benefits);
  return {
    cards: fixedBeverageCards.map((fallback, index) => {
      const record = supplied[index] || {};
      const ingredients = Array.isArray(record.ingredients) ? record.ingredients : [];
      const ingredientImages = asRecords(record.ingredient_images);
      return {
        accent: fallback.accent,
        title: fitEbookText(record.name, fallback.title, 42),
        copy: fitEbookText(record.subtitle, fallback.copy, 86),
        ingredients: fallback.ingredients.map((fallbackIngredient, ingredientIndex) => {
          const suppliedIngredient = ingredients[ingredientIndex];
          const ingredientRecord = asRecord(suppliedIngredient);
          const imageRecord = ingredientImages[ingredientIndex] || {};
          const name = fitEbookText(
            typeof suppliedIngredient === "string"
              ? suppliedIngredient
              : ingredientRecord.name ?? ingredientRecord.title ?? imageRecord.name,
            fallbackIngredient,
            34,
          );
          const fallbackVisualIndex = index * 6 + ingredientIndex;
          return {
            name,
            image: asText(
              ingredientRecord.image_url
                ?? ingredientRecord.imageUrl
                ?? imageRecord.image_url
                ?? imageRecord.imageUrl,
              "",
            ),
            visualIndex: beverageIngredientVisualIndex(name, fallbackVisualIndex),
          };
        }),
        image: asText(record.image_url, fallback.image),
        metrics: [
          ["Prep Time", fitEbookText(record.prep_time, fallback.metrics[0][1], 16)],
          [record.cook_time ? "Cook Time" : "Blend Time", fitEbookText(record.cook_time ?? record.blend_time, fallback.metrics[1][1], 16)],
          ["Serves", fitEbookText(record.servings, fallback.metrics[2][1], 12)],
        ],
      };
    }),
    features: fixedBeverageFeatures.map((fallback, index) => ({
      title: fitEbookText(featureRecords[index]?.title, fallback.title, 30),
      copy: fitEbookText(featureRecords[index]?.body, fallback.copy, 78),
    })),
    benefits: fixedBeverageBenefits.map((fallback, index) => fitEbookText(benefitRecords[index]?.title, fallback, 42)),
  };
}

function FixedNourishingBeveragesOverviewPhonePage(props: PhonePageProps) {
  const { cards, features, benefits } = useFixedBeverageContent();
  return (
    <article className={`${styles.page} ${styles.laterEditorialPage} ${styles.laterWarmPage}`} aria-label={props["aria-label"] ?? "Nourishing Beverages overview"}>
      <LaterEbookChrome section="07" warm />
      <div className={styles.fixedBeverageOverviewHero}><Image src="/ebook/nourishing-phone-hero.png" alt="A nourishing green beverage" fill sizes="23dvh" /></div>
      <section className={styles.fixedBeverageOverviewIntro}>
        <p>Building Better</p>
        <h2>Nourishing<br />Beverages</h2>
        <span>Sip well. Live well.</span>
        <p>Real ingredients for a healthier you.</p>
      </section>
      <section className={styles.fixedBeverageFeatures}>
        {features.map((feature) => <article key={feature.title}><h3>{feature.title}</h3><p>{feature.copy}</p></article>)}
      </section>
      <section className={styles.fixedBeverageRecipeNames}>
        {cards.map((card, index) => <article key={card.title}><i>0{index + 1}</i><div><h3>{card.title}</h3><p>{card.copy}</p></div></article>)}
      </section>
      <aside className={styles.fixedBeverageOverviewBenefit}><strong>Good For You. Good For Life.</strong><p>{benefits.slice(0, 3).join(" · ")}</p></aside>
      <LaterEbookFolio>79</LaterEbookFolio>
    </article>
  );
}

function FixedNourishingBeverageDetailPhonePage({ index, ...props }: PhonePageProps & { index: 0 | 1 | 2 }) {
  const { cards, features, benefits } = useFixedBeverageContent();
  const card = cards[index];
  const feature = features[[0, 2, 3][index]];
  return (
    <article className={`${styles.page} ${styles.laterEditorialPage} ${styles.laterWarmPage}`} aria-label={props["aria-label"] ?? card.title}>
      <LaterEbookChrome section="07" warm />
      <section className={styles.fixedBeverageDetailIntro}>
        <p>Nourishing Beverage · 0{index + 1}</p>
        <h2>{card.title}</h2>
        <span>{card.copy}</span>
      </section>
      <div className={styles.fixedBeverageDetailPhoto}><Image src={card.image} alt={card.title} fill sizes="27dvh" /></div>
      <section className={styles.fixedBeverageIngredients}>
        <h3>Ingredients</h3>
        <ul>
          {card.ingredients.map((ingredient, ingredientIndex) => (
            <li key={`${ingredient.name}-${ingredientIndex}`}>
              <span className={styles.fixedBeverageIngredientVisual}>
                {ingredient.image ? (
                  <Image src={ingredient.image} alt={ingredient.name} fill sizes="7dvh" />
                ) : (
                  <i
                    className={styles.fixedBeverageIngredientSprite}
                    style={beverageIngredientSpriteStyle(ingredient.visualIndex)}
                    role="img"
                    aria-label={ingredient.name}
                  />
                )}
              </span>
              <span>{ingredient.name}</span>
            </li>
          ))}
        </ul>
      </section>
      <section className={styles.fixedBeverageMeta}>
        {card.metrics.map(([label, value]) => <div key={label}><strong>{label}</strong><span>{value}</span></div>)}
      </section>
      <aside className={styles.fixedBeverageFeatureNote} data-accent={card.accent}>
        <strong>Why it works</strong>
        <div><h3>{feature.title}</h3><p>{feature.copy}</p></div>
      </aside>
      <aside className={styles.fixedBeverageBenefit}><BotanicalBranch /><div><strong>Daily Benefit</strong><p>{benefits[index]}.</p></div></aside>
      <LaterEbookFolio>79 · {index + 1}</LaterEbookFolio>
    </article>
  );
}

const fruitCards = [
  { name: "Bananas", copy: <>Great source of<br />potassium and<br />natural energy.</>, benefits: ["Energy Booster", "Heart Health", "Supports Digestion"] },
  { name: <>Berries<br />(Blueberries,<br />Strawberries)</>, copy: <>High in antioxidants<br />and vitamin C.</>, benefits: ["Boosts Immunity", "Healthy Skin", "Rich in Antioxidants"] },
  { name: "Apples", copy: <>High in fiber and<br />supports<br />digestion.</>, benefits: ["Heart Health", "Aids Digestion", "Supports Weight Control"] },
  { name: "Oranges", copy: <>Boosts immunity<br />with vitamin C.</>, benefits: ["Immunity Boost", "Healthy Skin", "Antioxidant Rich"] },
  { name: "Avocado", copy: <>Rich in healthy<br />fats, vitamins E &amp; K,<br />and fiber.</>, benefits: ["Heart Health", "Supports Brain Function", "Healthy Skin"] },
  { name: "Grapes", copy: <>Hydrating and<br />packed with<br />antioxidants.</>, benefits: ["Heart Health", "Hydration", "Anti-aging Benefits"] },
  { name: "Kiwi", copy: <>Rich in vitamin C,<br />fiber, and<br />potassium.</>, benefits: ["Immunity Boost", "Gut Health", "Skin Health"] },
  { name: "Papaya", copy: <>Aids digestion and<br />rich in vitamins<br />A &amp; C.</>, benefits: ["Aids Digestion", "Boosts Immunity", "Healthy Skin"] },
  { name: "Pomegranate", copy: <>Rich in antioxidants<br />that support<br />heart health.</>, benefits: ["Heart Health", "Anti-inflammatory", "Cell Protection"] },
  { name: "Mango", copy: <>Rich in vitamin A<br />and supports<br />immune function.</>, benefits: ["Immunity Boost", "Healthy Eyes", "Healthy Skin"] },
  { name: "Pineapple", copy: <>Aids digestion<br />and rich in<br />vitamin C.</>, benefits: ["Aids Digestion", "Immunity Boost", "Anti-inflammatory"] },
  { name: "Watermelon", copy: <>Hydrating and rich<br />in vitamins A &amp; C.</>, benefits: ["Hydration", "Skin Health", "Supports Heart Health"] },
  { name: "Pears", copy: <>High in fiber and<br />supports gut<br />health.</>, benefits: ["Aids Digestion", "Heart Health", "Supports Immunity"] },
  { name: "Lemons", copy: <>Detoxifying and<br />rich in vitamin C.</>, benefits: ["Detoxifies Body", "Boosts Immunity", "Healthy Skin"] },
  { name: "Dates", copy: <>Natural source of<br />energy and iron.</>, benefits: ["Energy Booster", "Improves Digestion", "Supports Bone Health"] },
];

const fruitPanelBenefits = [
  <>Strengthens<br />Immunity</>,
  <>Promotes<br />Healthy Skin</>,
  <>Supports<br />Digestion</>,
  <>Supports Heart<br />Health</>,
  <>Aids in Weight<br />Management</>,
];

function GroceryFruitsPhonePage() {
  const { ebook } = useMobileEbook();
  const grocery = asRecord(ebook.summary.grocery_list);
  const supplied = asRecords(grocery.fruit_catalog);
  const fruits = fruitCards.map((fallback, index) => {
    const record = supplied[index] || {};
    const benefits = asStrings(record.benefits);
    return {
      ...fallback,
      name: asText(record.name, typeof fallback.name === "string" ? fallback.name : `Fruit ${index + 1}`),
      copy: asText(record.description, "A nutrient-rich fruit selected for your plan."),
      benefits: benefits.length ? benefits : fallback.benefits,
      image: asText(record.image_url, "/ebook/prioritize-berries.png"),
    };
  });

  return (
    <article className={`${styles.page} ${styles.groceryFruitsPage}`} aria-label="Page 41: Fruits">
      <header className={styles.groceryFruitsTopline}>ZenPlato <span>|</span> 08 <span>|</span> Your Personalized Recipe Collection</header>
      <section className={styles.groceryFruitsIntro}>
        <h2>Fruits</h2>
        <div aria-hidden="true"><i /><BotanicalBranch /><i /></div>
        <p>Nature&rsquo;s sweetest gifts—packed<br />with vitamins, minerals, and<br />antioxidants for a healthier you.</p>
      </section>
      <aside className={styles.groceryFruitsSeal}>Real Fruit.<br />Real Benefits.</aside>
      <section className={styles.groceryFruitsGrid}>
        {fruits.map((fruit) => (
          <article key={String(fruit.name)}>
            <div className={styles.catalogFoodImage}><Image src={fruit.image} alt="" fill sizes="8dvh" /></div>
            <h3>{fruit.name}</h3>
            <i aria-hidden="true" />
            <p>{fruit.copy}</p>
            <footer>
              {fruit.benefits.map((benefit) => (
                <span key={benefit}>{benefit}</span>
              ))}
            </footer>
          </article>
        ))}
      </section>
      <section className={styles.groceryFruitsBenefits}>
        <div>
          <h3>Eat The Rainbow</h3>
          <p>Different colors, different<br />nutrients. Enjoy a variety<br />of fruits every day.</p>
        </div>
        {fruitPanelBenefits.map((benefit, index) => (
          <p key={index}>{benefit}</p>
        ))}
      </section>
      <p className={styles.groceryFruitsClosing}>Good ingredients. Real results.</p>
    </article>
  );
}

const vegetableCards = [
  { name: "Spinach", copy: <>Rich in iron, calcium,<br />vitamins A, C &amp; K,<br />and antioxidants.</> },
  { name: "Broccoli", copy: <>High in fiber, vitamin C,<br />and sulforaphane that<br />supports immunity.</> },
  { name: "Bell Peppers", copy: <>Excellent source of<br />vitamin C and antioxidants<br />for healthy skin &amp; immunity.</> },
  { name: "Carrots", copy: <>High in beta-carotene<br />which supports eye health<br />and immunity.</> },
  { name: "Zucchini", copy: <>Low in calories and rich<br />in water, vitamins A &amp; C,<br />and potassium.</> },
  { name: "Cherry Tomatoes", copy: <>Rich in lycopene and<br />vitamin C; supports heart<br />health and skin.</> },
  { name: "Cucumber", copy: <>Hydrating and low in<br />calories; good source of<br />vitamin K.</> },
  { name: "Kale", copy: <>Packed with vitamins A, C, K,<br />calcium, and powerful<br />antioxidants.</> },
  { name: "Cauliflower", copy: <>High in fiber and vitamin C;<br />supports digestion and<br />detoxification.</> },
  { name: "Green Beans", copy: <>Good source of fiber,<br />folate, and vitamins A, C, K;<br />supports heart health.</> },
  { name: "Sweet Potato", copy: <>Rich in beta-carotene,<br />fiber, and complex<br />carbohydrates.</> },
  { name: "Beets", copy: <>Supports blood health<br />and detoxification; rich in<br />folate and iron.</> },
  { name: "Cabbage", copy: <>High in fiber and vitamin K;<br />supports digestion and<br />immune health.</> },
  { name: "Brussels Sprouts", copy: <>Rich in fiber, vitamin C &amp; K,<br />and antioxidants that support<br />overall wellness.</> },
  { name: "Asparagus", copy: <>Good source of folate,<br />vitamins A, C, E, and K;<br />supports detox.</> },
  { name: "Mushrooms", copy: <>Low in calories, high in B<br />vitamins and selenium;<br />supports immunity.</> },
  { name: "Onions", copy: <>Contains antioxidants and<br />compounds that support<br />heart health.</> },
  { name: "Garlic", copy: <>Known for its immune-<br />boosting and anti-<br />inflammatory properties.</> },
  { name: "Ginger", copy: <>Aids digestion, reduces<br />inflammation, and supports<br />overall wellness.</> },
  { name: "Lettuce", copy: <>Hydrating and rich in<br />vitamins A &amp; K; supports<br />healthy digestion.</> },
];

const vegetablePanelBenefits = [
  <>Boosts<br />Immunity</>,
  <>Supports<br />Digestion</>,
  <>Promotes<br />Healthy Skin</>,
  <>Strengthens<br />Bones</>,
  <>Aids Weight<br />Management</>,
];

function GroceryVegetablesPhonePage() {
  const { ebook } = useMobileEbook();
  const grocery = asRecord(ebook.summary.grocery_list);
  const supplied = asRecords(grocery.vegetable_catalog);
  const vegetables = vegetableCards.map((fallback, index) => {
    const record = supplied[index] || {};
    return {
      ...fallback,
      name: asText(record.name, fallback.name),
      copy: asText(record.description, "A nutrient-rich vegetable selected for your plan."),
      image: asText(record.image_url, "/ebook/prioritize-greens.png"),
    };
  });

  return (
    <article className={`${styles.page} ${styles.groceryVegetablesPage}`} aria-label="Page 42: Vegetables">
      <header className={styles.groceryVegetablesTopline}>ZenPlato <span>|</span> 08 <span>|</span> Your Personalized Recipe Collection</header>
      <section className={styles.groceryVegetablesIntro}>
        <h2>Vegetables</h2>
        <div aria-hidden="true"><i /><BotanicalBranch /><i /></div>
        <p>Nutrient-rich vegetables to add<br />color, flavor, and health to your<br />meals.</p>
      </section>
      <section className={styles.groceryVegetablesGrid}>
        {vegetables.map((vegetable) => (
          <article key={vegetable.name}>
            <div className={styles.catalogFoodImage}><Image src={vegetable.image} alt="" fill sizes="8dvh" /></div>
            <h3>{vegetable.name}</h3>
            <p>{vegetable.copy}</p>
          </article>
        ))}
      </section>
      <section className={styles.groceryVegetablesBenefits}>
        <div>
          <h3>Eat A Rainbow</h3>
          <p>Variety in vegetables<br />ensures a wide range<br />of nutrients for a<br />stronger, healthier you.</p>
        </div>
        {vegetablePanelBenefits.map((benefit, index) => (
          <p key={index}>{benefit}</p>
        ))}
      </section>
      <p className={styles.groceryVegetablesClosing}>Good ingredients. Real results.</p>
    </article>
  );
}

type FixedProduceItem = {
  name: string;
  copy: string;
  benefits?: string[];
  image: string;
};

const fruitSpritePositions = [
  "9.5% 29.5%", "48.5% 29.5%", "89.5% 29.5%",
  "9.5% 44.9%", "48.5% 44.9%", "89.5% 44.9%",
  "9.5% 59.9%", "48.5% 59.9%", "89.5% 59.9%",
  "9.5% 74.6%", "48.5% 74.6%", "89.5% 74.6%",
  "9.5% 89.2%", "48.5% 89.2%", "89.5% 89.2%",
];

const vegetableSpritePositions = [
  "4% 27.2%", "34.7% 27.2%", "65.3% 27.2%", "95.8% 27.2%",
  "4% 42%", "34.7% 42%", "65.3% 42%", "95.8% 42%",
  "4% 56.8%", "34.7% 56.8%", "65.3% 56.8%", "95.8% 56.8%",
  "4% 71.6%", "34.7% 71.6%", "65.3% 71.6%", "95.8% 71.6%",
  "4% 86.5%", "34.7% 86.5%", "65.3% 86.5%", "95.8% 86.5%",
];

function produceSpriteStyle(kind: "fruit" | "vegetable", index: number): React.CSSProperties {
  return {
    backgroundPosition: kind === "fruit"
      ? fruitSpritePositions[index] || "50% 50%"
      : vegetableSpritePositions[index] || "50% 50%",
    backgroundSize: kind === "fruit" ? "500% auto" : "550% auto",
  };
}

const fixedFruitCards = [
  { name: "Bananas", copy: "A source of potassium and natural energy.", benefits: ["Energy", "Heart health", "Digestion"] },
  { name: "Berries", copy: "High in antioxidants and vitamin C.", benefits: ["Immunity", "Healthy skin", "Antioxidants"] },
  { name: "Apples", copy: "High in fiber and supportive of digestion.", benefits: ["Heart health", "Digestion", "Weight support"] },
  { name: "Oranges", copy: "Vitamin C supports immunity and skin.", benefits: ["Immunity", "Healthy skin", "Antioxidants"] },
  { name: "Avocado", copy: "Rich in healthy fats, vitamins E and K, and fiber.", benefits: ["Heart health", "Brain function", "Healthy skin"] },
  { name: "Grapes", copy: "Hydrating and naturally rich in antioxidants.", benefits: ["Heart health", "Hydration", "Cell support"] },
  { name: "Kiwi", copy: "Rich in vitamin C, fiber, and potassium.", benefits: ["Immunity", "Gut health", "Skin health"] },
  { name: "Papaya", copy: "Supports digestion and provides vitamins A and C.", benefits: ["Digestion", "Immunity", "Healthy skin"] },
  { name: "Pomegranate", copy: "Antioxidants help support heart health.", benefits: ["Heart health", "Inflammation", "Cell protection"] },
  { name: "Mango", copy: "Vitamin A supports immune function and eye health.", benefits: ["Immunity", "Healthy eyes", "Healthy skin"] },
  { name: "Pineapple", copy: "Provides vitamin C and supports digestion.", benefits: ["Digestion", "Immunity", "Inflammation"] },
  { name: "Watermelon", copy: "Hydrating and rich in vitamins A and C.", benefits: ["Hydration", "Skin health", "Heart health"] },
  { name: "Pears", copy: "High in fiber and supportive of gut health.", benefits: ["Digestion", "Heart health", "Immunity"] },
  { name: "Lemons", copy: "Refreshing, detox-supportive, and rich in vitamin C.", benefits: ["Daily refresh", "Immunity", "Healthy skin"] },
  { name: "Dates", copy: "A natural source of energy and iron.", benefits: ["Energy", "Digestion", "Bone health"] },
];

const fixedVegetableCards = [
  { name: "Spinach", copy: "Rich in iron, calcium, vitamins A, C, and K, plus antioxidants." },
  { name: "Broccoli", copy: "High in fiber and vitamin C, supporting digestion and immunity." },
  { name: "Bell Peppers", copy: "Vitamin C and antioxidants support healthy skin and immunity." },
  { name: "Carrots", copy: "Beta-carotene supports eye health and immune function." },
  { name: "Zucchini", copy: "Hydrating, light, and a source of vitamins A, C, and potassium." },
  { name: "Cherry Tomatoes", copy: "Lycopene and vitamin C support heart health and skin." },
  { name: "Cucumber", copy: "Hydrating, low in calories, and a source of vitamin K." },
  { name: "Kale", copy: "Packed with vitamins A, C, and K, calcium, and antioxidants." },
  { name: "Cauliflower", copy: "Fiber and vitamin C support digestion and detoxification." },
  { name: "Green Beans", copy: "Fiber, folate, and vitamins A, C, and K support heart health." },
  { name: "Sweet Potato", copy: "Rich in beta-carotene, fiber, and complex carbohydrates." },
  { name: "Beets", copy: "Folate and iron help support blood health and detoxification." },
  { name: "Cabbage", copy: "Fiber and vitamin K support digestion and immune health." },
  { name: "Brussels Sprouts", copy: "Fiber, vitamin C, vitamin K, and antioxidants support wellbeing." },
  { name: "Asparagus", copy: "Folate and vitamins A, C, E, and K support everyday health." },
  { name: "Mushrooms", copy: "B vitamins and selenium help support immune health." },
  { name: "Onions", copy: "Antioxidant compounds help support heart health." },
  { name: "Garlic", copy: "Known for immune-supportive and anti-inflammatory properties." },
  { name: "Ginger", copy: "Supports digestion and a balanced inflammatory response." },
  { name: "Lettuce", copy: "Hydrating and rich in vitamins A and K." },
];

function useFixedFruitCatalog() {
  const { ebook } = useMobileEbook();
  const supplied = asRecords(asRecord(ebook.summary.grocery_list).fruit_catalog);
  return fixedFruitCards.map((fallback, index): FixedProduceItem => {
    const record = supplied[index] || {};
    const benefits = asStrings(record.benefits);
    return {
      name: fitEbookText(record.name, fallback.name, 28),
      copy: fitEbookText(record.description, fallback.copy, 96),
      benefits: fallback.benefits.map((fallbackBenefit, benefitIndex) => (
        fitEbookText(benefits[benefitIndex], fallbackBenefit, 26)
      )),
      image: asText(record.image_url, ""),
    };
  });
}

function useFixedVegetableCatalog() {
  const { ebook } = useMobileEbook();
  const supplied = asRecords(asRecord(ebook.summary.grocery_list).vegetable_catalog);
  return fixedVegetableCards.map((fallback, index): FixedProduceItem => {
    const record = supplied[index] || {};
    return {
      name: fitEbookText(record.name, fallback.name, 28),
      copy: fitEbookText(record.description, fallback.copy, 96),
      image: asText(record.image_url, ""),
    };
  });
}

function FixedProduceRows({
  items,
  startIndex,
  showBenefits,
  kind,
}: {
  items: FixedProduceItem[];
  startIndex: number;
  showBenefits: boolean;
  kind: "fruit" | "vegetable";
}) {
  return (
    <section className={styles.fixedProduceRows}>
      {items.map((item, index) => (
        <article key={item.name}>
          <div className={styles.fixedProduceMark}>
            {item.image ? (
              <Image src={item.image} alt={item.name} fill sizes="9dvh" />
            ) : (
              <span
                className={`${styles.fixedProduceSprite} ${kind === "fruit" ? styles.fixedFruitSprite : styles.fixedVegetableSprite}`}
                style={produceSpriteStyle(kind, startIndex + index)}
                role="img"
                aria-label={item.name}
              />
            )}
          </div>
          <div className={styles.fixedProduceCopy}><h3>{item.name}</h3><p>{item.copy}</p></div>
          {showBenefits ? <footer>{item.benefits?.map((benefit) => <span key={benefit}>{benefit}</span>)}</footer> : null}
        </article>
      ))}
    </section>
  );
}

function FixedGroceryFruitsPhonePage({ part, ...props }: PhonePageProps & { part: 0 | 1 | 2 }) {
  const fruits = useFixedFruitCatalog();
  const visible = fruits.slice(part * 5, part * 5 + 5);
  return (
    <article className={`${styles.page} ${styles.laterEditorialPage} ${styles.laterWarmPage}`} aria-label={props["aria-label"] ?? `Fruits catalog ${part + 1}`}>
      <LaterEbookChrome section="08" warm />
      {part === 0 ? <div className={styles.fixedProduceHero}><Image src="/ebook/grocery-fruits-bg.png" alt="A colorful collection of fresh fruit" fill sizes="20dvh" /></div> : <BotanicalBranch className={styles.fixedPageDecorBranch} />}
      <section className={styles.fixedProduceIntro}>
        <p>Grocery Essentials · {String(part + 1).padStart(2, "0")}</p>
        <h2>Fruits</h2>
        <span>{part === 0 ? "Nature’s sweetest gifts, rich in vitamins, minerals, and antioxidants." : "More colorful choices for everyday nourishment."}</span>
      </section>
      <FixedProduceRows items={visible} startIndex={part * 5} showBenefits kind="fruit" />
      {part === 2 ? (
        <aside className={styles.fixedProduceBenefits}>
          <strong>Eat The Rainbow</strong>
          <p>Different colors bring different nutrients. Enjoy a variety every day.</p>
        </aside>
      ) : <aside className={styles.fixedPageContinue}><strong>Continue</strong><span>Five more fruit choices</span></aside>}
      <LaterEbookFolio>80 · {part + 1}</LaterEbookFolio>
    </article>
  );
}

function FixedGroceryVegetablesPhonePage({ part, ...props }: PhonePageProps & { part: 0 | 1 | 2 | 3 }) {
  const vegetables = useFixedVegetableCatalog();
  const visible = vegetables.slice(part * 5, part * 5 + 5);
  return (
    <article className={`${styles.page} ${styles.laterEditorialPage} ${styles.laterWarmPage} ${styles.fixedVegetablePage}`} aria-label={props["aria-label"] ?? `Vegetables catalog ${part + 1}`}>
      <LaterEbookChrome section="08" warm />
      {part === 0 ? <div className={styles.fixedProduceHero}><Image src="/ebook/grocery-vegetables-bg.png" alt="A colorful collection of fresh vegetables" fill sizes="20dvh" /></div> : <BotanicalBranch className={styles.fixedPageDecorBranch} />}
      <section className={styles.fixedProduceIntro}>
        <p>Grocery Essentials · {String(part + 1).padStart(2, "0")}</p>
        <h2>Vegetables</h2>
        <span>{part === 0 ? "Nutrient-rich vegetables add color, flavor, and health to your meals." : "Build variety across the week, one choice at a time."}</span>
      </section>
      <FixedProduceRows items={visible} startIndex={part * 5} showBenefits={false} kind="vegetable" />
      {part === 3 ? (
        <aside className={styles.fixedProduceBenefits}>
          <strong>Eat A Rainbow</strong>
          <p>Variety supports immunity, digestion, healthy skin, strong bones, and balanced weight.</p>
        </aside>
      ) : <aside className={styles.fixedPageContinue}><strong>Continue</strong><span>Five more vegetable choices</span></aside>}
      <LaterEbookFolio>81 · {part + 1}</LaterEbookFolio>
    </article>
  );
}

const actionPlanWeeks = [
  { week: "Week 1", title: <>Build<br />Momentum</>, days: "Days 1–7", focus: <>Hydration, whole<br />foods &amp; movement</> },
  { week: "Week 2", title: <>Strengthen<br />Habits</>, days: "Days 8–14", focus: <>Nutrition,<br />consistency &amp;<br />self-care</> },
  { week: "Week 3", title: <>Elevate &amp;<br />Challenge</>, days: "Days 15–21", focus: <>Energy, variety &amp;<br />sleep</> },
  { week: "Week 4", title: <>Sustain &amp;<br />Thrive</>, days: "Days 22–30", focus: <>Mindset, balance<br />&amp; long-term<br />well-being</> },
];

const actionPlanDays = [
  "Start your day with warm lemon water.",
  "Choose a balanced breakfast.",
  "Add 1 green or nourishing beverage.",
  "Fill half your plate with vegetables.",
  "Move your body for 30 minutes.",
  "Choose healthy snacks mindfully.",
  "Reflect, journal & plan for next week.",
  "Try a new healthy recipe.",
  "Eat a variety of colorful fruits.",
  "Drink at least 8 glasses of water.",
  "Include a quality protein in your meals.",
  "Add healthy fats (nuts, seeds, avocado).",
  "Practice mindfulness or meditation.",
  "Review your progress & adjust goals.",
  "Add more fiber-rich foods.",
  "Try a plant-based meal.",
  "Increase your activity intensity.",
  "Limit sugar & processed foods.",
  "Support your gut with probiotic",
  "Unplug & relax before bed.",
  "Prioritize 7–8 hours of quality sleep.",
  "Plan your meals for success.",
  "Nourish your body intentionally.",
  "Spend time in nature.",
  "Choose whole, unprocessed foods.",
  "Move, breathe & stay active.",
  "Practice gratitude daily.",
  "Celebrate small wins.",
  "Stay consistent, stay kind.",
  "You did it! Keep thriving!",
];

const actionTips = [
  <>Plan ahead<br />and prep<br />meals.</>,
  <>Stay hydrated<br />throughout<br />the day.</>,
  <>Take it<br />one day<br />at a time.</>,
  <>Celebrate<br />progress,<br />not perfection.</>,
  <>Lean on your<br />support<br />system.</>,
];

function ActionPlanPhonePage() {
  const { ebook } = useMobileEbook();
  const weekRecords = [1, 2, 3, 4].map((number) => asRecord(ebook.summary[`week_${number}_plan`]));
  const weeks = actionPlanWeeks.map((fallback, index) => ({
    week: asText(weekRecords[index].week, fallback.week),
    title: asText(weekRecords[index].title, typeof fallback.title === "string" ? fallback.title : `Week ${index + 1}`),
    days: asText(weekRecords[index].range, fallback.days),
    focus: asText(weekRecords[index].focus, typeof fallback.focus === "string" ? fallback.focus : "Steady daily progress"),
  }));
  const generatedDays = weekRecords.flatMap((week) => asRecords(week.days)).map((day) => asText(day.action, "")).filter(Boolean);
  const tips = asStrings(ebook.summary.action_plan_tips);

  return (
    <article className={`${styles.page} ${styles.actionPlanPage}`} aria-label="Page 43: Your 30-Day Action Plan">
      <header className={styles.actionPlanTopline}>ZenPlato <span>|</span> 06 <span>|</span> Your Personalized Recipe Collection</header>
      <section className={styles.actionPlanIntro}>
        <p>Section 6</p>
        <h2>Your 30-Day<br />Action Plan</h2>
        <div aria-hidden="true"><i /><BotanicalBranch /><i /></div>
        <h3>Purpose</h3>
        <p>Turn recommendations<br />into daily action.</p>
      </section>
      <div className={styles.actionPlanNotebook}><strong>30</strong><span>Days To<br />A Healthier<br />You</span></div>
      <section className={styles.actionPlanPrinciples}>
        <p>Small steps.<br />Consistent days.<br />Big results.</p>
        <p>30 days to build<br />better habits<br />that last.</p>
        <p>Focus on progress,<br />not perfection.<br />You&rsquo;ve got this!</p>
        <p>Track daily, stay<br />accountable and<br />celebrate wins.</p>
      </section>
      <section className={styles.actionPlanTable}>
        {weeks.map((week, weekIndex) => (
          <div className={styles.actionPlanWeekRow} key={week.week}>
            <aside>
              <h3>{week.week}</h3>
              <p>{week.title}</p>
              <strong>{week.days}</strong>
              <span>Focus:<br />{week.focus}</span>
            </aside>
            {(generatedDays.length ? generatedDays : actionPlanDays).slice(weekIndex * 7, weekIndex === 3 ? 30 : weekIndex * 7 + 7).map((copy, dayIndex) => {
              const dayNumber = weekIndex * 7 + dayIndex + 1;
              return (
                <article key={dayNumber}>
                  <h4>Day {dayNumber}</h4>
                  <p>{copy}</p>
                </article>
              );
            })}
          </div>
        ))}
      </section>
      <section className={styles.actionPlanRemember}>
        <div>
          <h3>Remember</h3>
          <p>{asText(ebook.summary.action_plan_remember, "Consistency creates change. Keep showing up for yourself every day.")}</p>
        </div>
        <h4>Tips For Success</h4>
        {(tips.length ? tips : actionTips).slice(0, 5).map((tip, index) => (
          <p key={index}>{tip}</p>
        ))}
      </section>
      <p className={styles.actionPlanClosing}>Small steps today, a healthier you tomorrow.</p>
    </article>
  );
}

const fixedActionPlanWeeks = [
  { week: "Week 1", title: "Build Momentum", days: "Days 1–7", focus: "Hydration, whole foods, and movement" },
  { week: "Week 2", title: "Strengthen Habits", days: "Days 8–14", focus: "Nutrition, consistency, and self-care" },
  { week: "Week 3", title: "Elevate & Challenge", days: "Days 15–21", focus: "Energy, variety, and sleep" },
  { week: "Week 4", title: "Sustain & Thrive", days: "Days 22–30", focus: "Mindset, balance, and long-term wellbeing" },
] as const;

const fixedActionTips = [
  "Plan ahead and prep meals.",
  "Stay hydrated throughout the day.",
  "Take it one day at a time.",
  "Celebrate progress, not perfection.",
  "Lean on your support system.",
];

const actionVisualKeywords: Array<{ terms: string[]; index: number }> = [
  { terms: ["lemon"], index: 0 },
  { terms: ["breakfast", "oatmeal"], index: 1 },
  { terms: ["green drink", "green beverage", "smoothie"], index: 2 },
  { terms: ["vegetable", "salad"], index: 3 },
  { terms: ["walk", "move", "movement"], index: 4 },
  { terms: ["snack", "almond", "nut", "seed"], index: 5 },
  { terms: ["reflect", "journal", "track", "progress", "goal"], index: 6 },
  { terms: ["recipe", "meal plan", "plan your meal"], index: 7 },
  { terms: ["fruit"], index: 8 },
  { terms: ["water", "hydrat"], index: 9 },
  { terms: ["protein", "fish", "salmon", "chicken"], index: 10 },
  { terms: ["healthy fat", "avocado", "omega"], index: 11 },
  { terms: ["mindful", "meditat"], index: 12 },
  { terms: ["fiber"], index: 14 },
  { terms: ["plant-based"], index: 15 },
  { terms: ["activity", "intensity", "exercise"], index: 16 },
  { terms: ["sugar", "processed"], index: 17 },
  { terms: ["probiotic", "gut"], index: 18 },
  { terms: ["unplug", "relax", "bed"], index: 19 },
  { terms: ["sleep"], index: 20 },
  { terms: ["nature", "outside"], index: 23 },
  { terms: ["whole food", "unprocessed"], index: 24 },
  { terms: ["breathe", "active"], index: 25 },
  { terms: ["gratitude"], index: 26 },
  { terms: ["celebrate", "small win"], index: 27 },
  { terms: ["consistent", "stay kind"], index: 28 },
  { terms: ["thriv", "you did it"], index: 29 },
];

function actionVisualIndex(action: string, fallbackIndex: number) {
  const normalized = action.toLowerCase();
  return actionVisualKeywords.find(({ terms }) => terms.some((term) => normalized.includes(term)))?.index ?? fallbackIndex;
}

function actionSpriteStyle(index: number): React.CSSProperties {
  if (index >= 21) {
    const column = Math.min(8, Math.max(0, index - 21));
    return {
      backgroundPosition: `${17.6 + (column * 9.63)}% 83.5%`,
      backgroundSize: "1140% auto",
    };
  }

  const row = Math.min(2, Math.max(0, Math.floor(index / 7)));
  const column = Math.min(6, Math.max(0, index % 7));
  return {
    backgroundPosition: `${18.1 + (column * 12.8)}% ${[40, 55.5, 69.5][row]}%`,
    backgroundSize: "890% auto",
  };
}

function useFixedActionPlanContent() {
  const { ebook } = useMobileEbook();
  const weekRecords = [1, 2, 3, 4].map((number) => asRecord(ebook.summary[`week_${number}_plan`]));
  const tips = asStrings(ebook.summary.action_plan_tips);
  const dayCounts = [7, 7, 7, 9];
  let fallbackOffset = 0;
  const weeks = fixedActionPlanWeeks.map((fallback, index) => {
    const record = weekRecords[index];
    const generated = asRecords(record.days);
    const fallbackDays = actionPlanDays.slice(fallbackOffset, fallbackOffset + dayCounts[index]);
    const startDay = fallbackOffset + 1;
    fallbackOffset += dayCounts[index];
    return {
      week: fitEbookText(record.week, fallback.week, 18),
      title: fitEbookText(record.title, fallback.title, 34),
      daysLabel: fitEbookText(record.range, fallback.days, 18),
      focus: fitEbookText(record.focus, fallback.focus, 74),
      startDay,
      actions: fallbackDays.map((fallbackAction, dayIndex) => {
        const generatedDay = generated[dayIndex] || {};
        const copy = fitEbookText(generatedDay.action, fallbackAction, 52);
        const fallbackIndex = startDay + dayIndex - 1;
        return {
          copy,
          image: asText(generatedDay.image_url ?? generatedDay.imageUrl, ""),
          visualIndex: actionVisualIndex(copy, fallbackIndex),
        };
      }),
    };
  });
  return {
    weeks,
    tips: fixedActionTips.map((fallback, index) => fitEbookText(tips[index], fallback, 46)),
    remember: fitEbookText(ebook.summary.action_plan_remember, "Consistency creates change. Keep showing up for yourself every day.", 112),
  };
}

function FixedActionPlanOverviewPhonePage(props: PhonePageProps) {
  const { weeks, tips } = useFixedActionPlanContent();
  return (
    <article className={`${styles.page} ${styles.laterEditorialPage} ${styles.laterWarmPage}`} aria-label={props["aria-label"] ?? "Your 30-Day Action Plan overview"}>
      <LaterEbookChrome section="09" warm />
      <section className={styles.fixedActionOverviewIntro}>
        <p>Section 09</p>
        <h2>Your 30-Day<br />Action Plan</h2>
        <span>Turn recommendations into daily action.</span>
      </section>
      <div className={styles.fixedActionNotebook}><strong>30</strong><span>Days To A<br />Healthier You</span></div>
      <section className={styles.fixedActionPrinciples}>
        <article><i>01</i><p>Small steps. Consistent days. Big results.</p></article>
        <article><i>02</i><p>Build better habits that can last.</p></article>
        <article><i>03</i><p>Focus on progress, not perfection.</p></article>
        <article><i>04</i><p>Track daily and celebrate your wins.</p></article>
      </section>
      <section className={styles.fixedActionWeekPreview}>
        {weeks.map((week) => <article key={week.week}><strong>{week.week}</strong><h3>{week.title}</h3><p>{week.focus}</p></article>)}
      </section>
      <aside className={styles.fixedActionTips}><strong>Tips For Success</strong><p>{tips.join(" · ")}</p></aside>
      <LaterEbookFolio>82</LaterEbookFolio>
    </article>
  );
}

function FixedActionPlanWeekPhonePage({ weekIndex, ...props }: PhonePageProps & { weekIndex: 0 | 1 | 2 | 3 }) {
  const { weeks, remember } = useFixedActionPlanContent();
  const week = weeks[weekIndex];
  return (
    <article className={`${styles.page} ${styles.laterEditorialPage} ${styles.laterWarmPage}`} aria-label={props["aria-label"] ?? `${week.week}: ${week.title}`}>
      <LaterEbookChrome section="09" warm />
      <BotanicalBranch className={styles.fixedPageDecorBranch} />
      <section className={styles.fixedActionWeekIntro}>
        <p>{week.week} · {week.daysLabel}</p>
        <h2>{week.title}</h2>
        <span><strong>Focus:</strong> {week.focus}</span>
      </section>
      <section className={styles.fixedActionDays}>
        {week.actions.map((action, index) => (
          <article key={`${week.week}-${index}`}>
            <div className={styles.fixedActionDayVisual}>
              {action.image ? (
                <Image src={action.image} alt="" fill sizes="7dvh" aria-hidden="true" />
              ) : (
                <span className={styles.fixedActionDaySprite} style={actionSpriteStyle(action.visualIndex)} aria-hidden="true" />
              )}
              <i aria-hidden="true" />
            </div>
            <div><strong>Day {week.startDay + index}</strong><p>{action.copy}</p></div>
          </article>
        ))}
      </section>
      <aside className={styles.fixedActionRemember}><BotanicalBranch /><div><strong>{weekIndex === 3 ? "Keep Thriving" : "Remember"}</strong><p>{remember}</p></div></aside>
      <LaterEbookFolio>82 · {weekIndex + 2}</LaterEbookFolio>
    </article>
  );
}

const DEFAULT_PHONE_REFERENCE = [841, 1870] as const;

function ebookPage(
  title: string,
  element: React.ReactElement,
  reference: readonly [number, number] = DEFAULT_PHONE_REFERENCE,
) {
  return { title, element, reference };
}

function referenceFrameStyle([width, height]: readonly [number, number]) {
  return {
    "--reference-page-aspect": `${width} / ${height}`,
    "--reference-page-width": `${((width / height) * 100).toFixed(5)}cqh`,
  } as React.CSSProperties;
}

export default function MobileEbookPage() {
  const { user, loading: authLoading } = useAuth();
  const [ebook, setEbook] = useState<MobileEbookPayload>(() => buildMobileFallback(null));
  const shellRef = useRef<HTMLDivElement | null>(null);
  const readerControlsRef = useRef<HTMLElement | null>(null);
  const contentsPanelRef = useRef<HTMLElement | null>(null);
  const contentsButtonRef = useRef<HTMLButtonElement | null>(null);
  const contentsCloseButtonRef = useRef<HTMLButtonElement | null>(null);
  const pageRefs = useRef<Array<HTMLElement | null>>([]);
  const [activePage, setActivePage] = useState(0);
  const [contentsOpen, setContentsOpen] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;

    const loadEbook = async () => {
      const fallback = buildMobileFallback(user);
      setEbook(fallback);

      const premiumResponse = user?.is_premium
        ? await api.get("/ebook/me?type=premium").catch(() => null)
        : null;
      const response = premiumResponse || await api.get("/ebook/me").catch(() => null);
      if (!cancelled && response?.data) setEbook(normalizeMobileEbook(response.data, user));
    };

    void loadEbook();
    return () => {
      cancelled = true;
    };
  }, [authLoading, user]);

  const ebookContext = useMemo<MobileEbookContextValue>(() => ({
    ebook,
    user,
    media: { ...DEFAULT_MOBILE_MEDIA, ...(ebook.media || {}) },
  }), [ebook, user]);

  const dynamicCondition = conditionLabel(ebook);

  const pages = [
    ebookPage("Cover", <CoverPage />),
    ebookPage("The Beginning", <BeginningPage />),
    ebookPage("Health Snapshot", <SnapshotPage />),
    ebookPage("Your Key Findings", <FindingsIntroPage />),
    ebookPage("Key Findings Details", <FindingsCardsPage />, [851, 1847]),
    ebookPage("Key Health Focus Areas", <FocusAreasPage />),
    ebookPage("Personalized Summary", <PersonalizedSummaryPage />),
    ebookPage("At A Glance", <AtGlancePage />),
    ebookPage("Opportunity 3", <OpportunityThreePage />),
    ebookPage("Opportunity 1", <OpportunityOnePage />),
    ebookPage("Grocery Essentials · Protein Sources", <GroceryEssentialsPhonePage categoryIndex={0} />),
    ebookPage("Grocery Essentials · Vegetables", <GroceryEssentialsPhonePage categoryIndex={1} />),
    ebookPage("Grocery Essentials · Fruits", <GroceryEssentialsPhonePage categoryIndex={2} />),
    ebookPage("Understanding Your Journey", <UnderstandingJourneyPage />),
    ebookPage(`Understanding ${dynamicCondition}`, <UnderstandingDetailPhonePage />),
    ebookPage("Why Symptoms Happen", <WhySymptomsPhonePage />),
    ebookPage("What Nutrition Can Influence", <NutritionInfluencePhonePage />),
    ebookPage(`Common ${dynamicCondition} Challenges`, <CommonChallengesPhonePage />),
    ebookPage("ZenPlato Framework", <ZenPlatoFrameworkPhonePage />),
    ebookPage("Food & Nutrition Guide", <FoodNutritionGuidePhonePage />),
    ebookPage("Foods To Be More Mindful Of", <MindfulFoodsPhonePage />, [853, 1844]),
    ebookPage("Foods To Prioritize", <PriorityFoodsPhonePage />),
    ebookPage("The Balanced Plate", <BalancedPlatePhonePage />),
    ebookPage("Hydration Recommendations", <HydrationPhonePage />),
    ebookPage("Meal Timing Guidance", <MealTimingPhonePage />, [853, 1844]),
    ebookPage("Meal Timing Guidance Continued", <MealTimingContinuationPhonePage />, [853, 1844]),
    ebookPage("Smart Food Swaps", <SmartFoodSwapsPhonePage />),
    ebookPage("Smart Swaps Continued", <SmartSwapsContinuedPhonePage />, [853, 1844]),
    ebookPage("Lifestyle Foundation", <LifestyleFoundationPhonePage />),
    ebookPage("Sleep & Recovery", <SleepRecoveryPhonePage />, [853, 1844]),
    ebookPage("Sleep & Recovery Continued", <SleepRecoveryContinuationPhonePage />, [853, 1844]),
    ebookPage("Stress & Wellbeing", <StressWellbeingPhonePage />, [863, 1822]),
    ebookPage("Stress & Wellbeing Continued", <StressWellbeingContinuationPhonePage />, [863, 1822]),
    ebookPage("Daily Wellness Habits", <DailyWellnessPhonePage />, [904, 1740]),
    ebookPage("Consistency", <PerfectionConsistencyPhonePage />),
    ebookPage("Recipe Collection", <RecipeCollectionSectionPhonePage />),
    ebookPage("Personalized Recipe Collection", <RecipeCollectionIntroPhonePage />, [852, 1846]),
    ebookPage("Personalized Recipe Collection Insights", <RecipeCollectionContinuationPhonePage />, [852, 1846]),
    ebookPage("Building Better Breakfasts", <BreakfastsPhonePage />),
    ebookPage("Breakfast Ingredients & Method", <BreakfastPreparationPhonePage />),
    ebookPage("Matcha Chia Nutrition", <MatchaChiaNutritionPhonePage />),
    ebookPage("Matcha Protein Breakdown", <MatchaProteinBreakdownPhonePage />),
    ebookPage("Matcha Chia Benefits", <MatchaChiaBenefitsPhonePage />, [853, 1844]),
    ebookPage("Matcha Chia Benefits Continued", <MatchaBenefitsContinuationPhonePage />, [853, 1844]),
    ebookPage("Matcha Ingredients 01–04", <MatchaInstructionsSpreadPhonePage part={0} />, [864, 1821]),
    ebookPage("Matcha Ingredients 05–08", <MatchaInstructionsSpreadPhonePage part={1} />, [864, 1821]),
    ebookPage("Matcha Cooking Method 01–03", <MatchaCookingMethodPhonePage part={0} />, [864, 1821]),
    ebookPage("Matcha Cooking Method 04–06", <MatchaCookingMethodPhonePage part={1} />, [864, 1821]),
    ebookPage("Smart Snacks Overview", <FixedSmartSnacksOverviewPhonePage />, [863, 1822]),
    ebookPage("Overnight Chia Protein Pudding", <FixedSmartSnackDetailPhonePage index={0} />, [878, 1792]),
    ebookPage("No-Bake Energy Bites", <FixedSmartSnackDetailPhonePage index={1} />, [878, 1792]),
    ebookPage("Spiced Roasted Chickpeas", <FixedSmartSnackDetailPhonePage index={2} />, [878, 1792]),
    ebookPage("Nourishing Beverages Overview", <FixedNourishingBeveragesOverviewPhonePage />),
    ebookPage("Berry Protein Smoothie", <FixedNourishingBeverageDetailPhonePage index={0} />),
    ebookPage("Golden Milk", <FixedNourishingBeverageDetailPhonePage index={1} />),
    ebookPage("Green Detox Drink", <FixedNourishingBeverageDetailPhonePage index={2} />),
    ebookPage("Fruits 01–05", <FixedGroceryFruitsPhonePage part={0} />),
    ebookPage("Fruits 06–10", <FixedGroceryFruitsPhonePage part={1} />),
    ebookPage("Fruits 11–15", <FixedGroceryFruitsPhonePage part={2} />),
    ebookPage("Vegetables 01–05", <FixedGroceryVegetablesPhonePage part={0} />, [840, 1871]),
    ebookPage("Vegetables 06–10", <FixedGroceryVegetablesPhonePage part={1} />, [840, 1871]),
    ebookPage("Vegetables 11–15", <FixedGroceryVegetablesPhonePage part={2} />, [840, 1871]),
    ebookPage("Vegetables 16–20", <FixedGroceryVegetablesPhonePage part={3} />, [840, 1871]),
    ebookPage("30-Day Action Plan Overview", <FixedActionPlanOverviewPhonePage />),
    ebookPage("30-Day Action Plan Week 1", <FixedActionPlanWeekPhonePage weekIndex={0} />),
    ebookPage("30-Day Action Plan Week 2", <FixedActionPlanWeekPhonePage weekIndex={1} />),
    ebookPage("30-Day Action Plan Week 3", <FixedActionPlanWeekPhonePage weekIndex={2} />),
    ebookPage("30-Day Action Plan Week 4", <FixedActionPlanWeekPhonePage weekIndex={3} />),
  ];

  const scrollToPage = useCallback((index: number) => {
    const nextIndex = Math.max(0, Math.min(index, pages.length - 1));
    pageRefs.current[nextIndex]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
    setActivePage(nextIndex);
  }, [pages.length]);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;

    let frame = 0;
    const updateActivePage = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const nextPage = Math.round(shell.scrollLeft / Math.max(shell.clientWidth, 1));
        setActivePage(Math.max(0, Math.min(nextPage, pages.length - 1)));
      });
    };

    shell.addEventListener("scroll", updateActivePage, { passive: true });
    updateActivePage();

    return () => {
      cancelAnimationFrame(frame);
      shell.removeEventListener("scroll", updateActivePage);
    };
  }, [pages.length]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && contentsOpen) {
        setContentsOpen(false);
        return;
      }
      if (contentsOpen) return;
      if (event.key === "ArrowLeft") scrollToPage(activePage - 1);
      if (event.key === "ArrowRight") scrollToPage(activePage + 1);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePage, contentsOpen, scrollToPage]);

  useEffect(() => {
    if (!contentsOpen) return;

    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const shell = shellRef.current;
    const controls = readerControlsRef.current;
    const fallbackFocus = contentsButtonRef.current;
    shell?.setAttribute("inert", "");
    controls?.setAttribute("inert", "");
    contentsCloseButtonRef.current?.focus();

    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const focusable = Array.from(
        contentsPanelRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", trapFocus);
    return () => {
      window.removeEventListener("keydown", trapFocus);
      shell?.removeAttribute("inert");
      controls?.removeAttribute("inert");
      if (previousFocus?.isConnected) previousFocus.focus();
      else fallbackFocus?.focus();
    };
  }, [contentsOpen]);

  return (
    <MobileEbookContext.Provider value={ebookContext}>
      <div ref={shellRef} className={styles.shell} role="region" aria-label="ZenPlato phone ebook">
        {pages.map((page, index) => (
          <section
            className={styles.pageFrame}
            key={page.title}
            style={referenceFrameStyle(page.reference)}
            ref={(node) => {
              pageRefs.current[index] = node;
            }}
          >
            {cloneElement(page.element as React.ReactElement<{ "aria-label"?: string }>, {
              "aria-label": `Page ${index + 1} of ${pages.length}: ${page.title}`,
            })}
          </section>
        ))}
      </div>

      <nav ref={readerControlsRef} className={styles.readerControls} aria-label="Ebook page controls">
        <button type="button" onClick={() => scrollToPage(activePage - 1)} disabled={activePage === 0} aria-label="Previous page">
          ←
        </button>
        <button ref={contentsButtonRef} type="button" className={styles.contentsButton} onClick={() => setContentsOpen(true)} aria-haspopup="dialog" aria-expanded={contentsOpen}>
          Contents
        </button>
        <span aria-live="polite">{activePage + 1} / {pages.length}</span>
        <button type="button" onClick={() => scrollToPage(activePage + 1)} disabled={activePage === pages.length - 1} aria-label="Next page">
          →
        </button>
      </nav>

      {contentsOpen && (
        <div className={styles.contentsOverlay} role="presentation" onClick={() => setContentsOpen(false)}>
          <aside ref={contentsPanelRef} className={styles.contentsPanel} role="dialog" aria-modal="true" aria-label="Page contents" onClick={(event) => event.stopPropagation()}>
            <header>
              <div>
                <p>ZenPlato</p>
                <h2>Page Contents</h2>
              </div>
              <button ref={contentsCloseButtonRef} type="button" onClick={() => setContentsOpen(false)} aria-label="Close contents">×</button>
            </header>
            <ol>
              {pages.map((page, index) => (
                <li key={page.title}>
                  <button
                    type="button"
                    className={index === activePage ? styles.activeContentsItem : undefined}
                    onClick={() => {
                      scrollToPage(index);
                      setContentsOpen(false);
                    }}
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    {page.title}
                  </button>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      )}
    </MobileEbookContext.Provider>
  );
}
