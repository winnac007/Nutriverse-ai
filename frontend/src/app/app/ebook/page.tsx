"use client";

import React, { useCallback, useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { User } from "@/lib/types";
import { motion } from "framer-motion";
import { ZENPLATO_CSS } from "./styles";
import { 
  Sparkles, 
  BookOpen, 
  ArrowRight, 
  Check, 
  Clock, 
  Target, 
  Heart,
  ChevronLeft
} from "lucide-react";

/* ─── Types ─────────────────────────────────────────────────────────────── */
interface Chapter {
  id: number;
  title: string;
  html_content: string;
}

interface Summary {
  greeting: string;
  headline: string;
  condition_label: string;
  condition_blurb: string;
  personalized_welcome?: string;
  health_snapshot?: string;
  finding_1?: string;
  finding_2?: string;
  finding_3?: string;
  finding_4?: string;
  key_findings?: SummaryFindingInput[];
  core_takeaway?: string;
  focus_area_1?: string;
  focus_area_2?: string;
  focus_area_3?: string;
  focus_area_4?: string;
  focus_area_5?: string;
  focus_area_6?: string;
  key_health_focus_areas?: FocusAreaInput[];
  nutrition_insights?: string;
  lifestyle_insights?: string;
  triggers_patterns?: string;
  path_forward?: string;
  at_glance?: GlanceMetricInput[];
  next_best_step_headline?: string;
  next_best_step_body?: string;
  next_best_step_cta?: string;
  opportunity_1?: OpportunityInput;
  opportunity_2?: OpportunityInput;
  opportunity_3?: OpportunityInput;
  biggest_opportunities?: OpportunityInput[];
  what_it_means?: string;
  why_it_matters?: string;
  daily_life_impact?: string;
  understanding_items?: UnderstandingItemInput[];
  symptom_flow_steps?: SymptomFlowStepInput[];
  symptom_flow_takeaway?: string;
  nutrition_influence_items?: NutritionInfluenceItemInput[];
  nutrition_influence_takeaway?: string;
  foods_to_prioritize?: FoodGalleryItemInput[];
  foods_to_prioritise?: FoodGalleryItemInput[];
  foods_to_be_mindful_of?: FoodGalleryItemInput[];
  hydration_guidance?: HydrationGuidanceInput;
  meal_timing_guidance?: MealTimingGuidanceInput;
  food_swaps?: FoodSwapsInput;
  stress_insight?: string;
  daily_habits?: DailyHabitInput[];
  recipe_collection_intro?: string;
  breakfast_recipes?: BreakfastRecipeInput[];
  snack_recipes?: SnackRecipeInput[];
  snack_features?: RecipeHighlightInput[];
  snack_benefits?: RecipeHighlightInput[];
  beverage_recipes?: BeverageRecipeInput[];
  beverage_features?: RecipeHighlightInput[];
  beverage_benefits?: RecipeHighlightInput[];
  grocery_list?: GroceryListInput;
  week_1_plan?: ActionPlanWeekInput;
  week_2_plan?: ActionPlanWeekInput;
  week_3_plan?: ActionPlanWeekInput;
  week_4_plan?: ActionPlanWeekInput;
  action_plan_tips?: string[];
  action_plan_remember?: string;
  closing_message?: string;
  next_chapter_steps?: NextChapterStepInput[];
  faq_items?: FaqItemInput[];
  all_conditions: string[];
  goal_30day: string | null;
  stats: { label: string; value: string }[];
  diet: { type: string | null; allergies: string[] };
  focus_points: string[];
}

interface Ebook {
  condition_id: string;
  condition_label: string;
  generated_at: string;
  chapters: Chapter[];
  summary: Summary;
  is_premium?: boolean;
  media?: Record<string, string>;
}

function getEbookMedia(ebook: Ebook, key: string, fallback: string) {
  const value = ebook.media?.[key];
  return typeof value === "string" && value.trim() ? value : fallback;
}

interface PremiumAnswers {
  aspiration: string;
  flavor: string;
  time: string;
  why: string;
}

type SnapshotIcon = "hormone" | "avocado" | "inflammation" | "sleep";
type FindingIcon = "insulin" | "stress" | "hormone" | "gut";
type FocusIcon = "balance" | "avocado" | "gut" | "stress" | "sleep" | "leaf";
type ProfileIcon = "age" | "gender" | "height" | "weight";
type GlanceIcon = "search" | "star" | "trend" | "heart";
type UnderstandingIcon = "leaf" | "balance" | "sun";
type SymptomFlowIcon = "hormone" | "bloodSugar" | "cravings" | "daily";
type NutritionInfluenceIcon = "energy" | "cravings" | "balance" | "leaf";

interface SnapshotConcern {
  title: string;
  role: string;
  description: string;
  icon: SnapshotIcon;
}

interface KeyFinding {
  priority: string;
  title: string;
  description: string;
  icon: FindingIcon;
}

type SummaryFindingInput = string | Partial<KeyFinding>;

interface FocusArea {
  eyebrow: string;
  title: string;
  status: string;
  description: string;
  icon: FocusIcon;
  progress: number;
}

type FocusAreaInput = string | Partial<FocusArea>;

interface ProfileRow {
  label: string;
  value: string;
  icon: ProfileIcon;
}

interface GlanceMetric {
  label: string;
  value: string;
  description: string;
  icon: GlanceIcon;
}

type GlanceMetricInput = string | Partial<GlanceMetric>;

interface Opportunity {
  number: string;
  title: string;
  paragraphs: string[];
}

type OpportunityInput = string | Partial<Opportunity>;

interface UnderstandingItem {
  title: string;
  body: string;
  icon: UnderstandingIcon;
}

type UnderstandingItemInput = string | Partial<UnderstandingItem>;

interface SymptomFlowStep {
  number: string;
  title: string;
  body: string;
  icon: SymptomFlowIcon;
}

type SymptomFlowStepInput = string | Partial<SymptomFlowStep>;

interface NutritionInfluenceItem {
  number: string;
  title: string;
  body: string;
  icon: NutritionInfluenceIcon;
}

type NutritionInfluenceItemInput = string | Partial<NutritionInfluenceItem>;

interface FoodGalleryItem {
  title: string;
  description: string;
  imageUrl?: string;
}

type FoodGalleryItemInput = string | (Partial<FoodGalleryItem> & { image_url?: string });

interface HydrationStep {
  title: string;
  body: string;
}

type HydrationStepInput = string | Partial<HydrationStep>;

interface HydrationGuidance {
  intro: string;
  dailyGoal: string;
  morningRitual: string;
  eveningRitual: string;
  steps: HydrationStep[];
  tips: string[];
  quote: string;
}

type HydrationGuidanceInput = string | Partial<{
  intro: string;
  daily_goal: string;
  dailyGoal: string;
  morning_ritual: string;
  morningRitual: string;
  evening_ritual: string;
  eveningRitual: string;
  steps: HydrationStepInput[];
  tips: string[];
  quote: string;
}>;

type PlateSegmentIconName = "leaf" | "fish" | "grain";
type HydrationStepIconName = "glass" | "clock" | "drop" | "sprig" | "meditation";
type HydrationTipIconName = "bottle" | "cup" | "shower" | "phone";
type DailyHabitIconName = "bottle" | "bowl" | "shoe" | "lotus";
type RecipeMetaIconName = "time" | "servings" | "difficulty";
type RecipeFeatureIconName = "leaf" | "balance" | "energy" | "heart" | "protein";
type SnackMetricIconName = "time" | "chill" | "servings" | "fridge" | "oven" | "blend" | "cook";
type SnackRecipeIconName = "moon" | "energy" | "leaf";
type BeverageRecipeIconName = "berry" | "cup" | "leaf";

interface MealTimingEntry {
  time: string;
  title: string;
  body: string;
}

type MealTimingEntryInput = string | Partial<MealTimingEntry>;

interface MealTimingGuidance {
  intro: string;
  entries: MealTimingEntry[];
  consistencyTitle: string;
  consistencyBody: string;
  quote: string;
}

type MealTimingGuidanceInput = string | Partial<{
  intro: string;
  entries: MealTimingEntryInput[];
  timeline: MealTimingEntryInput[];
  consistency_title: string;
  consistencyTitle: string;
  consistency_body: string;
  consistencyBody: string;
  quote: string;
}>;

interface FoodSwapItem {
  beforeTitle: string;
  beforeBody: string;
  afterTitle: string;
  afterBody: string;
}

type FoodSwapItemInput = string | Partial<{
  beforeTitle: string;
  before_title: string;
  beforeBody: string;
  before_body: string;
  afterTitle: string;
  after_title: string;
  afterBody: string;
  after_body: string;
}>;

interface FoodSwaps {
  intro: string;
  swaps: FoodSwapItem[];
  quote: string;
}

type FoodSwapsInput = FoodSwapItemInput[] | Partial<{
  intro: string;
  swaps: FoodSwapItemInput[];
  items: FoodSwapItemInput[];
  quote: string;
}>;

interface DailyHabit {
  title: string;
  body: string;
  icon: DailyHabitIconName;
}

type DailyHabitInput = string | Partial<DailyHabit>;

interface RecipeMethodStep {
  title?: string;
  body: string;
}

type RecipeMethodStepInput = string | Partial<RecipeMethodStep>;

interface RecipeHighlight {
  title: string;
  body: string;
  icon: RecipeFeatureIconName;
}

type RecipeHighlightInput = string | Partial<RecipeHighlight>;

interface RecipeNutritionItem {
  ingredient: string;
  amount: string;
}

type RecipeNutritionItemInput = string | Partial<RecipeNutritionItem>;

interface BreakfastRecipe {
  name: string;
  subtitle: string;
  prepTime: string;
  servings: string;
  difficulty: string;
  ingredients: string[];
  method: RecipeMethodStep[];
  makeItYoursTitle: string;
  makeItYoursBody: string;
  nutritionHighlights: RecipeHighlight[];
  benefits: RecipeHighlight[];
  proteinSummaryTitle: string;
  proteinSummaryBody: string;
  nutritionBreakdown: RecipeNutritionItem[];
  totalProtein: string;
}

type BreakfastRecipeInput = string | Partial<{
  name: string;
  title: string;
  subtitle: string;
  description: string;
  prep_time: string;
  prepTime: string;
  servings: string;
  difficulty: string;
  ingredients: string[];
  method: RecipeMethodStepInput[];
  method_steps: RecipeMethodStepInput[];
  make_it_yours_title: string;
  makeItYoursTitle: string;
  make_it_yours_body: string;
  makeItYoursBody: string;
  nutrition_highlights: RecipeHighlightInput[];
  nutritionHighlights: RecipeHighlightInput[];
  benefits: RecipeHighlightInput[];
  protein_summary_title: string;
  proteinSummaryTitle: string;
  protein_summary_body: string;
  proteinSummaryBody: string;
  nutrition_breakdown: RecipeNutritionItemInput[];
  nutritionBreakdown: RecipeNutritionItemInput[];
  total_protein: string;
  totalProtein: string;
}>;

interface CompactRecipeMetric {
  label: string;
  value: string;
  icon: SnackMetricIconName;
}

type CompactRecipeMetricInput = string | Partial<{
  label: string;
  value: string;
  icon: SnackMetricIconName;
}>;

interface SnackRecipe {
  name: string;
  subtitle: string;
  ingredients: string[];
  metrics: CompactRecipeMetric[];
  icon: SnackRecipeIconName;
}

type SnackRecipeInput = string | Partial<{
  name: string;
  title: string;
  subtitle: string;
  description: string;
  ingredients: string[];
  metrics: CompactRecipeMetricInput[];
  prep_time: string;
  prepTime: string;
  chill_time: string;
  chillTime: string;
  bake_time: string;
  bakeTime: string;
  store_in: string;
  storeIn: string;
  servings: string;
  serves: string;
  icon: SnackRecipeIconName;
}>;

interface BeverageRecipe {
  name: string;
  subtitle: string;
  ingredients: string[];
  metrics: CompactRecipeMetric[];
  accent: "berry" | "gold" | "green";
  icon: BeverageRecipeIconName;
}

type BeverageRecipeInput = string | Partial<{
  name: string;
  title: string;
  subtitle: string;
  description: string;
  ingredients: string[];
  metrics: CompactRecipeMetricInput[];
  prep_time: string;
  prepTime: string;
  blend_time: string;
  blendTime: string;
  cook_time: string;
  cookTime: string;
  servings: string;
  serves: string;
  accent: "berry" | "gold" | "green";
  icon: BeverageRecipeIconName;
}>;

interface GroceryCatalogItem {
  name: string;
  description: string;
  tags: string[];
  imageUrl?: string;
}

type GroceryCatalogItemInput = string | Partial<{
  name: string;
  title: string;
  description: string;
  body: string;
  tags: string[];
  benefits: string[];
  image_url: string;
  imageUrl: string;
}>;

interface GroceryCategory {
  title: string;
  summary: string;
  items: GroceryCatalogItem[];
}

type GroceryCategoryInput = GroceryCatalogItemInput[] | Partial<{
  title: string;
  summary: string;
  items: GroceryCatalogItemInput[];
}>;

interface GroceryList {
  intro: string;
  proteinSources: GroceryCategory;
  vegetables: GroceryCategory;
  fruits: GroceryCategory;
  fruitCatalog: GroceryCatalogItem[];
  vegetableCatalog: GroceryCatalogItem[];
}

type GroceryListInput = Partial<{
  intro: string;
  protein_sources: GroceryCategoryInput;
  proteinSources: GroceryCategoryInput;
  vegetables: GroceryCategoryInput;
  fruits: GroceryCategoryInput;
  fruit_catalog: GroceryCatalogItemInput[];
  fruitCatalog: GroceryCatalogItemInput[];
  vegetable_catalog: GroceryCatalogItemInput[];
  vegetableCatalog: GroceryCatalogItemInput[];
}>;

interface ActionPlanDay {
  day: number;
  action: string;
}

type ActionPlanDayInput = string | Partial<{
  day: number;
  action: string;
  text: string;
  body: string;
}>;

interface ActionPlanWeek {
  week: string;
  title: string;
  range: string;
  focus: string;
  days: ActionPlanDay[];
}

type ActionPlanWeekInput = string[] | Partial<{
  week: string;
  label: string;
  title: string;
  range: string;
  days_range: string;
  daysRange: string;
  focus: string;
  days: ActionPlanDayInput[];
  actions: ActionPlanDayInput[];
}>;

interface NextChapterStep {
  title: string;
  body: string;
  icon: RecipeFeatureIconName;
}

type NextChapterStepInput = string | Partial<NextChapterStep>;

interface FaqItem {
  question: string;
  answer: string;
}

type FaqItemInput = string | Partial<{
  question: string;
  answer: string;
  body: string;
}>;

/* ─── Constants ──────────────────────────────────────────────────────────── */
const CONDITION_COLORS: Record<string, { clay: string; forest: string; accent: string }> = {
  pcos: { clay: "#BC5B38", forest: "#3F5247", accent: "#A85B86" },
  diabetes: { clay: "#BC5B38", forest: "#3F5247", accent: "#3F6E9E" },
  thyroid: { clay: "#BC5B38", forest: "#3F5247", accent: "#3E8F76" },
  "gut-health": { clay: "#BC5B38", forest: "#3F5247", accent: "#5E7D3C" },
  "anti-inflammatory": { clay: "#BC5B38", forest: "#3F5247", accent: "#C07248" },
  menopause: { clay: "#BC5B38", forest: "#3F5247", accent: "#8A5CA0" },
};

const CONDITION_LABELS: Record<string, string> = {
  pcos: "PCOS",
  diabetes: "Diabetes",
  thyroid: "Thyroid",
  "gut-health": "Gut Health",
  "anti-inflammatory": "Anti-Inflammatory",
  menopause: "Menopause",
  "diabetes-t1": "Diabetes",
  prediabetes: "Diabetes",
  "insulin-resistance": "Insulin Resistance",
  hashimotos: "Hashimoto's",
  ibs: "Gut Health",
};

const SYMPTOM_LABELS: Record<string, string> = {
  fatigue: "Fatigue",
  "low-energy": "Low Energy",
  "energy-crashes": "Energy Crashes",
  "sugar-cravings": "Sugar Cravings",
  "difficulty-losing-weight": "Difficulty Losing Weight",
  "unexplained-weight-gain": "Unexplained Weight Gain",
  "excessive-hunger": "Excessive Hunger",
  "irregular-periods": "Irregular Periods",
  acne: "Acne",
  "hair-fall": "Hair Fall",
  pms: "PMS Symptoms",
  "facial-hair-growth": "Facial Hair Growth",
  bloating: "Bloating & Digestive Issues",
  gas: "Gas",
  indigestion: "Indigestion",
  constipation: "Constipation",
  diarrhea: "Diarrhea",
  "acidity-heartburn": "Acidity / Heartburn",
  "heavy-stomach": "Heavy Stomach",
  "food-sensitivities": "Food Sensitivities",
  "poor-sleep": "Poor Sleep",
  "difficulty-falling-asleep": "Difficulty Falling Asleep",
  "waking-up-tired": "Waking Up Tired",
  "brain-fog": "Brain Fog",
  "poor-concentration": "Poor Concentration",
  "stress-eating": "Stress Eating",
  "mood-swings": "Mood Swings",
  "food-anxiety": "Anxiety Around Food",
  inflammation: "Inflammation",
  "joint-pain": "Joint Pain",
  headaches: "Frequent Headaches",
  "low-immunity": "Low Immunity",
};

/* ─── Injected CSS ────────────────────────────────────────────────────────── */

/* ─── Sub-components ─────────────────────────────────────────────────────── */
function Reveal({ children, delay = 0, y = 22 }: { children: React.ReactNode; delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

function BotanicalSVG() {
  return (
    <svg className="absolute right-[-60px] top-1/2 -translate-y-1/2 w-[min(620px,70vw)] opacity-[0.16] pointer-events-none text-[var(--forest)]" viewBox="0 0 400 600" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M200 580 C200 420 200 300 200 120" />
      <path d="M200 200 C150 180 120 140 110 90 C160 100 195 140 200 200Z" fill="currentColor" fillOpacity=".05"/>
      <path d="M200 260 C250 240 280 200 290 150 C240 160 205 200 200 260Z" fill="currentColor" fillOpacity=".05"/>
      <circle cx="200" cy="90" r="9" fill="currentColor" fillOpacity=".12"/>
    </svg>
  );
}

function CoverLeafMark() {
  return (
    <svg className="cover-leaf" viewBox="0 0 28 44" fill="none" aria-hidden="true">
      <path d="M14 42V4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M14 12C9 11 6 8 5 4C10 4.7 13 7.5 14 12Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M14 18C19 17 22 14 23 10C18 10.7 15 13.5 14 18Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M14 24C9 23 6 20 5 16C10 16.7 13 19.5 14 24Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M14 30C19 29 22 26 23 22C18 22.7 15 25.5 14 30Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M14 36C10 35.3 7.5 33 6.5 29.5C10.6 30 13.1 32.3 14 36Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

function titleizeSlug(value?: string | null) {
  if (!value) return "";
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function sentenceFromSlug(value?: string | null) {
  if (!value) return "";
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatKnownLabel(value?: string | null) {
  if (!value) return "";
  const normalized = value.trim();
  const lower = normalized.toLowerCase();
  return CONDITION_LABELS[lower] || SYMPTOM_LABELS[lower] || sentenceFromSlug(normalized);
}

function toStringArray(value: unknown) {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  if (typeof value === "string" && value.trim()) return [value];
  return [];
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[char];
  });
}

function resolveCoverCondition(ebook: Ebook, user: User | null) {
  if (ebook.condition_id && ebook.condition_id !== "premium") {
    return ebook.condition_label || CONDITION_LABELS[ebook.condition_id] || titleizeSlug(ebook.condition_id) || "PCOS";
  }

  const primaryUserCondition = user?.conditions?.includes("pcos")
    ? "pcos"
    : user?.conditions?.[0] || user?.condition;

  return CONDITION_LABELS[primaryUserCondition || ""] || titleizeSlug(primaryUserCondition) || "PCOS";
}

function getCoverPersonalization(user: User | null, ebook: Ebook, plan: any) {
  const firstName = user?.name?.trim().split(/\s+/)[0];
  const goal = (user?.goal_30day || ebook.summary.goal_30day || plan?.summary || "").trim().replace(/\.$/, "");

  if (firstName && goal) return `Prepared for ${firstName}. Primary focus: ${goal}.`;
  if (firstName) return `Prepared for ${firstName}'s unique hormonal health journey.`;
  if (goal) return `Personalized for your ${goal} journey.`;
  return "Personalized for your unique hormonal health journey.";
}

function getWelcomeParagraphs(user: User | null, ebook: Ebook, plan: any) {
  const personalizedWelcome = ebook.summary.personalized_welcome?.trim();
  if (personalizedWelcome) {
    return personalizedWelcome
      .split(/\n{2,}|\r?\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);
  }

  const firstName = user?.name?.trim().split(/\s+/)[0];
  const goal = (user?.goal_30day || ebook.summary.goal_30day || plan?.summary || "").trim().replace(/\.$/, "");

  return [
    `${firstName ? `${firstName}, your` : "Your"} body is not a problem to fix; it is a system to understand. This blueprint is designed to help you reconnect with your body's wisdom, support your hormones, and build sustainable habits that fit your life.`,
    goal
      ? `Inside these pages, you will find more than a plan. You will find practical guidance for ${goal}, with clarity, compassion, and a partnership rooted in food intelligence.`
      : "Inside these pages, you will find more than a plan. You will find clarity, compassion, and a partnership rooted in food intelligence.",
    "Let's begin together.",
  ];
}

function isOpeningNoteChapter(chapter: Chapter) {
  return /a note for you|notice you are here|journey to balance|the beginning/i.test(chapter.title);
}

function isHealthSnapshotChapter(chapter: Chapter) {
  return /health snapshot|selected condition|personalized summary/i.test(chapter.title);
}

function isKeyFindingsChapter(chapter: Chapter) {
  return /key findings|top patterns|core takeaway|highest priority/i.test(chapter.title);
}

function isFocusAreasChapter(chapter: Chapter) {
  return /key health focus|focus areas|six pillars|hormonal balance|insulin sensitivity/i.test(chapter.title);
}

function isPersonalizedInsightsChapter(chapter: Chapter) {
  return /personalized insights|personalised insights|personalized narrative|personalised narrative|body is telling/i.test(chapter.title);
}

function isAtAGlanceChapter(chapter: Chapter) {
  return /at a glance|quick overview|current health insights|next best step/i.test(chapter.title);
}

function isOpportunityChapter(chapter: Chapter) {
  return /biggest opportunities|biggest opportunity|opportunity_[123]|opportunity 1|opportunity one|greatest potential|starting point/i.test(chapter.title);
}

function isUnderstandingJourneyChapter(chapter: Chapter) {
  return /understanding .*journey|understanding pcos|hormonal rhythms|what it means|why it matters/i.test(chapter.title);
}

function isWhySymptomsChapter(chapter: Chapter) {
  return /why symptoms happen|symptoms happen|hormonal changes|blood sugar fluctuations|cravings.*energy dips|daily challenges/i.test(chapter.title);
}

function isNutritionInfluenceChapter(chapter: Chapter) {
  return /what nutrition can influence|nutrition can influence|food is more than fuel|energy|cravings|hormonal balance|long-term health/i.test(chapter.title);
}

function isCommonPcosChallengesChapter(chapter: Chapter) {
  return /common pcos challenges|pcos challenges|weight management|irregular cycles/i.test(chapter.title);
}

function isZenplatoFrameworkChapter(chapter: Chapter) {
  return /zenplato framework|protein.*fibre.*movement.*recovery/i.test(chapter.title);
}

function isFoodNutritionGuideChapter(chapter: Chapter) {
  return /your food\s*(?:&|and)\s*nutrition guide|section\s*3.*nutrition|food\s*&\s*nutrition guide/i.test(chapter.title);
}

function isFoodsToPrioritizeChapter(chapter: Chapter) {
  return /foods?\s+to\s+prioriti[sz]e|foods?\s+to\s+prioritise/i.test(chapter.title);
}

function isFoodsToBeMindfulChapter(chapter: Chapter) {
  return /foods?\s+to\s+be\s+(?:more\s+)?mindful|mindful\s+of/i.test(chapter.title);
}

function isBalancedPlateChapter(chapter: Chapter) {
  return /balanced plate|50%\s*vegetables|25%\s*protein|smart carbohydrates/i.test(chapter.title);
}

function isHydrationChapter(chapter: Chapter) {
  return /hydration recommendation|hydration guidance|hydration framework|daily goal/i.test(chapter.title);
}

function isMealTimingChapter(chapter: Chapter) {
  return /meal timing|daily nutrition timeline|sustainable rhythm|consistency is key|breakfast|mid-morning snack|evening snack/i.test(chapter.title);
}

function isSmartFoodSwapsChapter(chapter: Chapter) {
  return /smart food swaps|food swaps|before.*after|sugary cereals|white bread|sweetened yogurt|sugary drinks/i.test(chapter.title);
}

function isLifestyleFoundationChapter(chapter: Chapter) {
  return /lifestyle foundation|section\s*4|daily choices|balance is built|not found/i.test(chapter.title);
}

function isSleepRecoveryChapter(chapter: Chapter) {
  return /sleep\s*&?\s*recovery|sleep and energy|sleep and cravings|recovery habits|rest is productive/i.test(chapter.title);
}

function isStressWellbeingChapter(chapter: Chapter) {
  return /stress\s*&?\s*wellbeing|stress impact cycle|stress insight|food choices.*energy.*consistency|manage stress/i.test(chapter.title);
}

function isDailyWellnessChapter(chapter: Chapter) {
  return /daily wellness|daily habits|morning hydration|balanced breakfast|daily movement|recovery habits/i.test(chapter.title);
}

function isConsistencyChapter(chapter: Chapter) {
  return /perfection.*required|consistency|keep going|progress over perfection|building consistency/i.test(chapter.title);
}

function isRecipeCollectionChapter(chapter: Chapter) {
  return /personalized recipe collection|personalised recipe collection|section\s*5|recipe collection introduction|good food should feel|real ingredients/i.test(chapter.title);
}

function isBreakfastRecipeChapter(chapter: Chapter) {
  return /building better breakfasts|breakfast recipes|breakfasts|matcha chia|chia pudding|overnight oats|what this bowl does|ingredients|method of cooking|recipe method/i.test(chapter.title);
}

function isSnackBeverageGroceryChapter(chapter: Chapter) {
  return /smart snacks|snacks|nourishing beverages|beverages|smoothie|golden milk|detox drink|grocery essentials|grocery list|fruits|vegetables|protein sources/i.test(chapter.title);
}

function isActionPlanChapter(chapter: Chapter) {
  return /30-day action plan|30 day action plan|action plan|week\s*[1-4]|foundation|building consistency|strengthening habits|sustain.*thrive/i.test(chapter.title);
}

function isNextChapterChapter(chapter: Chapter) {
  return /next chapter|faq|frequently asked|continuing your wellness journey|closing message|long-term success|professional support/i.test(chapter.title);
}

function getPrimaryConditionLabel(user: User | null, ebook: Ebook) {
  const fromSummary = ebook.summary.all_conditions?.[0];
  if (fromSummary) return fromSummary;
  return resolveCoverCondition(ebook, user);
}

function getSnapshotConcerns(user: User | null, ebook: Ebook): SnapshotConcern[] {
  const conditionLabels = ebook.summary.all_conditions?.length
    ? ebook.summary.all_conditions
    : (user?.conditions || []).map((condition) => CONDITION_LABELS[condition] || titleizeSlug(condition));

  const primaryCondition = conditionLabels[0] || getPrimaryConditionLabel(user, ebook);
  const secondaryCondition = conditionLabels.find((label) => label && label !== primaryCondition);

  return [
    {
      title: primaryCondition || "PCOS",
      role: "Primary Focus",
      description: "Affects hormonal balance, metabolism, and overall well-being.",
      icon: "hormone",
    },
    {
      title: secondaryCondition || "Insulin Resistance",
      role: "Associated Concern",
      description: "May impact energy, weight management, and hormonal balance.",
      icon: "avocado",
    },
    {
      title: "Inflammation",
      role: "Associated Concern",
      description: "Can contribute to fatigue, bloating, and hormone imbalances.",
      icon: "inflammation",
    },
    {
      title: "Sleep Quality",
      role: "Additional Concern",
      description: "Affects recovery, hormones, mood, cravings, and daily energy levels.",
      icon: "sleep",
    },
  ];
}

function getSnapshotParagraphs(ebook: Ebook) {
  const snapshot = ebook.summary.health_snapshot?.trim();
  if (snapshot) {
    return snapshot
      .split(/\n{2,}|\r?\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);
  }

  return [
    "Based on your responses, your body is asking for support in key areas that are closely connected.",
    "Your hormonal balance, insulin response, inflammation levels, and sleep quality are the foundational pillars that influence your energy, mood, metabolism, and long-term health.",
    "The good news is: small, consistent shifts in the right direction can create powerful, lasting change.",
    "This blueprint is designed around your unique biology, lifestyle, and goals to help you feel more balanced, energized, and in control.",
  ];
}

function normalizeFindingInput(input: SummaryFindingInput, index: number): Partial<KeyFinding> {
  if (typeof input !== "string") return input;

  const [possibleTitle, ...rest] = input.split(":");
  if (rest.length > 0 && possibleTitle.trim().length < 56) {
    return {
      title: possibleTitle.trim(),
      description: rest.join(":").trim(),
    };
  }

  return {
    description: input.trim(),
    title: ["Insulin Resistance Pattern", "Inflammation & Stress Load", "Hormonal Imbalance", "Digestive & Gut Health"][index],
  };
}

function getKeyFindings(user: User | null, ebook: Ebook): KeyFinding[] {
  const condition = getPrimaryConditionLabel(user, ebook);
  const defaultFindings: KeyFinding[] = [
    {
      priority: "Highest Priority",
      title: condition === "PCOS" ? "Insulin Resistance Pattern" : `${condition} Pattern`,
      description: "Your responses suggest signs of insulin resistance which may be affecting your energy levels, weight management, and hormonal balance.",
      icon: "insulin",
    },
    {
      priority: "High Impact",
      title: "Inflammation & Stress Load",
      description: "Chronic inflammation and elevated stress markers may be contributing to fatigue, poor recovery, and hormonal imbalances.",
      icon: "stress",
    },
    {
      priority: "Moderate Impact",
      title: "Hormonal Imbalance",
      description: "Your hormonal responses indicate potential imbalances that could be influencing mood swings, cravings, and cycle regularity.",
      icon: "hormone",
    },
    {
      priority: "Foundational Area",
      title: "Digestive & Gut Health",
      description: "Your digestive health shows room for improvement, which can impact nutrient absorption, immunity, and overall wellbeing.",
      icon: "gut",
    },
  ];

  const explicitFindings = ebook.summary.key_findings?.length
    ? ebook.summary.key_findings
    : [ebook.summary.finding_1, ebook.summary.finding_2, ebook.summary.finding_3, ebook.summary.finding_4].filter(Boolean) as string[];

  if (!explicitFindings.length) return defaultFindings;

  return defaultFindings.map((fallback, index) => {
    const input = explicitFindings[index];
    if (!input) return fallback;
    const normalized = normalizeFindingInput(input, index);
    return {
      ...fallback,
      ...normalized,
      icon: normalized.icon || fallback.icon,
      priority: normalized.priority || fallback.priority,
      title: normalized.title || fallback.title,
      description: normalized.description || fallback.description,
    };
  });
}

function getCoreTakeaway(ebook: Ebook) {
  return ebook.summary.core_takeaway?.trim() || "These patterns help us understand what your body needs most right now.";
}

function normalizeFocusAreaInput(input: FocusAreaInput, index: number): Partial<FocusArea> {
  if (typeof input !== "string") return input;

  const [possibleTitle, ...rest] = input.split(":");
  if (rest.length > 0 && possibleTitle.trim().length < 52) {
    return {
      title: possibleTitle.trim(),
      description: rest.join(":").trim(),
    };
  }

  return {
    title: ["Hormonal Balance", "Insulin Sensitivity", "Digestive Health", "Stress & Recovery", "Sleep Quality", "Inflammation Level"][index],
    description: input.trim(),
  };
}

function normalizeProgress(value: unknown, fallback: number) {
  if (typeof value !== "number" || Number.isNaN(value)) return fallback;
  return Math.max(8, Math.min(92, value));
}

function getFocusAreas(ebook: Ebook): FocusArea[] {
  const defaults: FocusArea[] = [
    {
      eyebrow: "01 | Hormonal Balance",
      title: "Hormonal Balance",
      status: "Needs Attention",
      description: "Your hormones may benefit from more consistent support through nutrition, stress management, and quality sleep.",
      icon: "balance",
      progress: 48,
    },
    {
      eyebrow: "02 | Insulin Sensitivity",
      title: "Insulin Sensitivity",
      status: "Needs Attention",
      description: "Improving insulin response can help support steady energy, balanced mood, and long-term metabolic health.",
      icon: "avocado",
      progress: 49,
    },
    {
      eyebrow: "03 | Digestive Health",
      title: "Digestive Health",
      status: "Moderate",
      description: "Your gut health shows room for improvement to support better absorption and reduce bloating.",
      icon: "gut",
      progress: 68,
    },
    {
      eyebrow: "04 | Stress & Recovery",
      title: "Stress & Recovery",
      status: "Needs Attention",
      description: "Your body may benefit from deeper recovery to improve resilience and hormonal harmony.",
      icon: "stress",
      progress: 40,
    },
    {
      eyebrow: "05 | Sleep Quality",
      title: "Sleep Quality",
      status: "Needs Attention",
      description: "Better sleep consistency can positively impact hormones, energy levels, and overall well-being.",
      icon: "sleep",
      progress: 49,
    },
    {
      eyebrow: "06 | Inflammation Level",
      title: "Inflammation Level",
      status: "Moderate",
      description: "Anti-inflammatory foods and lifestyle habits can make a meaningful difference.",
      icon: "leaf",
      progress: 63,
    },
  ];

  const explicitAreas = ebook.summary.key_health_focus_areas?.length
    ? ebook.summary.key_health_focus_areas
    : [ebook.summary.focus_area_1, ebook.summary.focus_area_2, ebook.summary.focus_area_3, ebook.summary.focus_area_4, ebook.summary.focus_area_5, ebook.summary.focus_area_6].filter(Boolean) as string[];

  if (!explicitAreas.length) return defaults;

  return defaults.map((fallback, index) => {
    const input = explicitAreas[index];
    if (!input) return fallback;
    const normalized = normalizeFocusAreaInput(input, index);
    return {
      ...fallback,
      ...normalized,
      eyebrow: normalized.eyebrow || fallback.eyebrow,
      status: normalized.status || fallback.status,
      title: normalized.title || fallback.title,
      description: normalized.description || fallback.description,
      icon: normalized.icon || fallback.icon,
      progress: normalizeProgress(normalized.progress, fallback.progress),
    };
  });
}

function formatProfileValue(value: string | number | null | undefined, suffix = "") {
  if (value === null || value === undefined || value === "") return "Not shared";
  return `${value}${suffix}`;
}

function getProfileRows(user: User | null): ProfileRow[] {
  const answers = user?.condition_answers || {};
  const gender = user?.gender || (typeof answers.gender === "string" ? answers.gender : "");

  return [
    {
      label: "Age",
      value: formatProfileValue(user?.age, " Years"),
      icon: "age",
    },
    {
      label: "Gender",
      value: gender ? sentenceFromSlug(gender) : "Not shared",
      icon: "gender",
    },
    {
      label: "Height",
      value: formatProfileValue(user?.height_cm, " cm"),
      icon: "height",
    },
    {
      label: "Weight",
      value: formatProfileValue(user?.weight_kg, " kg"),
      icon: "weight",
    },
  ];
}

function getSelectedConcerns(user: User | null, ebook: Ebook) {
  const answers = user?.condition_answers || {};
  const rawItems = [
    ...(ebook.summary.all_conditions || []),
    ...((user?.conditions || []).map((condition) => CONDITION_LABELS[condition] || titleizeSlug(condition))),
    ...toStringArray(answers.conditions),
    ...toStringArray(answers.diagnosedSymptoms),
    ...toStringArray(answers.symptoms),
  ];

  const unique = rawItems
    .map(formatKnownLabel)
    .filter(Boolean)
    .filter((label, index, arr) => arr.findIndex((item) => item.toLowerCase() === label.toLowerCase()) === index)
    .filter((label) => !/none of these|none/i.test(label));

  if (unique.length) return unique.slice(0, 6);

  return [
    getPrimaryConditionLabel(user, ebook),
    "Energy & Cravings",
    "Sleep & Recovery",
    "Digestive Balance",
  ].filter(Boolean).slice(0, 6);
}

function splitInsightText(value?: string | null) {
  if (!value?.trim()) return [];
  return value
    .split(/\n{2,}|\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function getPersonalizedInsightCopy(user: User | null, ebook: Ebook, plan: any) {
  const explicit = [
    ebook.summary.nutrition_insights,
    ebook.summary.lifestyle_insights,
    ebook.summary.triggers_patterns,
  ].flatMap(splitInsightText);

  const healthSnapshot = splitInsightText(ebook.summary.health_snapshot);
  const fallbackPlanText = [
    plan?.analysis,
    ...(Array.isArray(ebook.summary.focus_points) ? ebook.summary.focus_points : []),
    Array.isArray(plan?.food_rules) ? plan.food_rules.slice(0, 2).join(" ") : "",
  ].filter((item): item is string => typeof item === "string" && item.trim().length > 0);

  const paragraphs = explicit.length
    ? explicit
    : healthSnapshot.length
      ? healthSnapshot
      : fallbackPlanText.length
        ? fallbackPlanText
        : [
            "Your hormonal health appears to be one of the core areas influencing many of your current symptoms. Nutrition rhythm, protein intake, and steady blood sugar support can help your body feel more predictable through the day.",
            "Your lifestyle patterns may be adding extra demand to your recovery systems. Sleep consistency, stress load, hydration, and meal timing can all influence energy, cravings, mood, and digestion.",
            "The good news is small, consistent shifts in food choices, stress support, and daily routines can create powerful improvements in how you feel each day.",
          ];

  const firstName = user?.name?.trim().split(/\s+/)[0];

  return {
    lead: firstName
      ? `${firstName}, your responses reveal a body that is working hard to maintain balance, with several key systems asking for additional support.`
      : "Your responses reveal a body that is working hard to maintain balance, with several key systems asking for additional support.",
    paragraphs: paragraphs.slice(0, 3),
    pathForward: ebook.summary.path_forward?.trim()
      || "This snapshot is the first step toward understanding your unique patterns and creating a plan that truly fits you.",
  };
}

function normalizeGlanceMetricInput(input: GlanceMetricInput, index: number): Partial<GlanceMetric> {
  if (typeof input !== "string") return input;

  const [possibleLabel, ...rest] = input.split(":");
  if (rest.length > 0 && possibleLabel.trim().length < 42) {
    return {
      label: possibleLabel.trim(),
      description: rest.join(":").trim(),
    };
  }

  return {
    description: input.trim(),
    label: ["Focus Areas Analyzed", "Priority Needs", "Moderate Status", "Strong Areas"][index],
  };
}

function getAtGlanceMetrics(ebook: Ebook): GlanceMetric[] {
  const focusAreas = getFocusAreas(ebook);
  const priorityCount = focusAreas.filter((area) => /attention|priority|immediate/i.test(area.status) || area.progress < 50).length;
  const strongCount = focusAreas.filter((area) => /strong|good|balanced|resilient/i.test(area.status) || area.progress >= 75).length;
  const moderateCount = Math.max(0, focusAreas.length - priorityCount - strongCount);

  const defaults: GlanceMetric[] = [
    {
      label: "Focus Areas Analyzed",
      value: String(focusAreas.length),
      description: "Key areas of your health have been assessed based on your responses.",
      icon: "search",
    },
    {
      label: "Priority Needs",
      value: String(priorityCount),
      description: "Areas that need your immediate attention and consistent support.",
      icon: "star",
    },
    {
      label: "Moderate Status",
      value: String(moderateCount),
      description: "Areas showing moderate balance with room for improvement.",
      icon: "trend",
    },
    {
      label: "Strong Areas",
      value: String(strongCount),
      description: "Areas where your body is functioning well and showing good resilience.",
      icon: "heart",
    },
  ];

  if (!ebook.summary.at_glance?.length) return defaults;

  return defaults.map((fallback, index) => {
    const input = ebook.summary.at_glance?.[index];
    if (!input) return fallback;
    const normalized = normalizeGlanceMetricInput(input, index);
    return {
      ...fallback,
      ...normalized,
      label: normalized.label || fallback.label,
      value: normalized.value || fallback.value,
      description: normalized.description || fallback.description,
      icon: normalized.icon || fallback.icon,
    };
  });
}

function getNextBestStepCopy(ebook: Ebook) {
  return {
    headline: ebook.summary.next_best_step_headline?.trim() || "Personalized. Practical. Powerful.",
    body: ebook.summary.next_best_step_body?.trim()
      || "Your personalized plan is designed around your unique biology, lifestyle, and goals, helping you take the right actions for lasting change.",
    cta: ebook.summary.next_best_step_cta?.trim() || "View Your Plan",
  };
}

function normalizeOpportunityInput(input: OpportunityInput, index: number): Partial<Opportunity> {
  if (typeof input !== "string") return input;

  const [possibleTitle, ...rest] = input.split(":");
  if (rest.length > 0 && possibleTitle.trim().length < 64) {
    return {
      title: possibleTitle.trim(),
      paragraphs: splitInsightText(rest.join(":")),
    };
  }

  return {
    paragraphs: splitInsightText(input),
    title: `Opportunity ${index + 1}`,
  };
}

function getBiggestOpportunities(ebook: Ebook): Opportunity[] {
  const sortedFocusAreas = getFocusAreas(ebook)
    .slice()
    .sort((a, b) => a.progress - b.progress);

  const defaults: Opportunity[] = [0, 1, 2].map((index) => {
    const focus = sortedFocusAreas[index] || sortedFocusAreas[0];
    return {
      number: String(index + 1).padStart(2, "0"),
      title: focus?.title || `Opportunity ${index + 1}`,
      paragraphs: [
        index === 0
          ? "This is the area with the greatest potential to create meaningful change for your energy, balance, and long-term wellbeing."
          : "This opportunity is about creating deeper harmony between your mind, body, and daily life.",
        focus?.description || "Your responses suggest this area plays a key role in your overall wellbeing and long-term vitality.",
        "When we nurture this area with the right support and consistent small steps, you may experience improvements that ripple across your overall health.",
        "This is your starting point, where awareness becomes action, and action creates lasting transformation.",
      ],
    };
  });

  const explicit = ebook.summary.biggest_opportunities?.length
    ? ebook.summary.biggest_opportunities
    : [ebook.summary.opportunity_1, ebook.summary.opportunity_2, ebook.summary.opportunity_3].filter(Boolean) as OpportunityInput[];

  if (!explicit.length) return defaults;

  return defaults.map((fallback, index) => {
    const input = explicit[index];
    if (!input) return fallback;
    const normalized = normalizeOpportunityInput(input, index);
    return {
      ...fallback,
      ...normalized,
      number: normalized.number || fallback.number,
      title: normalized.title || fallback.title,
      paragraphs: normalized.paragraphs?.length ? normalized.paragraphs : fallback.paragraphs,
    };
  });
}

function normalizeUnderstandingItemInput(input: UnderstandingItemInput, index: number): Partial<UnderstandingItem> {
  if (typeof input !== "string") return input;

  const [possibleTitle, ...rest] = input.split(":");
  if (rest.length > 0 && possibleTitle.trim().length < 64) {
    return {
      title: possibleTitle.trim(),
      body: rest.join(":").trim(),
    };
  }

  return {
    body: input.trim(),
    title: ["What It Means", "Why It Matters", "How It May Affect Daily Life"][index] || "What This Means",
  };
}

function getUnderstandingItems(ebook: Ebook, user: User | null): UnderstandingItem[] {
  const conditionLabel = getPrimaryConditionLabel(user, ebook);
  const defaults: UnderstandingItem[] = [
    {
      title: "What It Means",
      body: `${conditionLabel} is a hormonal pattern that can influence how your body manages energy, appetite, cycle rhythm, inflammation, and metabolism in connected ways.`,
      icon: "leaf",
    },
    {
      title: "Why It Matters",
      body: `Understanding ${conditionLabel} helps you look beneath symptoms and notice the systems asking for support, so your plan can focus on root patterns instead of scattered fixes.`,
      icon: "balance",
    },
    {
      title: "How It May Affect Daily Life",
      body: `${conditionLabel} can show up through fatigue, cravings, mood shifts, cycle changes, skin changes, weight fluctuations, or recovery challenges. Recognizing the pattern is the first step toward lasting change.`,
      icon: "sun",
    },
  ];

  const explicit = ebook.summary.understanding_items?.length
    ? ebook.summary.understanding_items
    : [ebook.summary.what_it_means, ebook.summary.why_it_matters, ebook.summary.daily_life_impact].filter(Boolean) as UnderstandingItemInput[];

  if (!explicit.length) return defaults;

  return defaults.map((fallback, index) => {
    const input = explicit[index];
    if (!input) return fallback;
    const normalized = normalizeUnderstandingItemInput(input, index);
    return {
      ...fallback,
      ...normalized,
      title: normalized.title || fallback.title,
      body: normalized.body || fallback.body,
      icon: normalized.icon || fallback.icon,
    };
  });
}

function normalizeSymptomFlowStepInput(input: SymptomFlowStepInput, index: number): Partial<SymptomFlowStep> {
  if (typeof input !== "string") return input;

  const [possibleTitle, ...rest] = input.split(":");
  if (rest.length > 0 && possibleTitle.trim().length < 72) {
    return {
      title: possibleTitle.trim(),
      body: rest.join(":").trim(),
    };
  }

  return {
    body: input.trim(),
    title: ["Hormonal Changes", "Blood Sugar Fluctuations", "Cravings & Energy Dips", "Daily Challenges"][index] || "Body Signal",
  };
}

function getSymptomFlowSteps(ebook: Ebook): SymptomFlowStep[] {
  const defaults: SymptomFlowStep[] = [
    {
      number: "01.",
      title: "Hormonal Changes",
      body: "Hormonal imbalances, especially elevated androgens and insulin resistance, can disrupt normal ovulation and throw your body's systems off balance.",
      icon: "hormone",
    },
    {
      number: "02.",
      title: "Blood Sugar Fluctuations",
      body: "These hormonal shifts affect how your body processes glucose, leading to spikes and crashes in blood sugar throughout the day.",
      icon: "bloodSugar",
    },
    {
      number: "03.",
      title: "Cravings & Energy Dips",
      body: "Blood sugar ups and downs can trigger intense cravings, irritability, and fatigue as your body struggles to find steady fuel and balance.",
      icon: "cravings",
    },
    {
      number: "04.",
      title: "Daily Challenges",
      body: "The cycle shows up in real life through mood swings, low energy, poor sleep, skin flare-ups, weight changes, and fertility struggles.",
      icon: "daily",
    },
  ];

  if (!ebook.summary.symptom_flow_steps?.length) return defaults;

  return defaults.map((fallback, index) => {
    const input = ebook.summary.symptom_flow_steps?.[index];
    if (!input) return fallback;
    const normalized = normalizeSymptomFlowStepInput(input, index);
    return {
      ...fallback,
      ...normalized,
      number: normalized.number || fallback.number,
      title: normalized.title || fallback.title,
      body: normalized.body || fallback.body,
      icon: normalized.icon || fallback.icon,
    };
  });
}

function getSymptomFlowTakeaway(ebook: Ebook) {
  return ebook.summary.symptom_flow_takeaway?.trim()
    || "Understanding the why behind your symptoms is the first step toward lasting balance and healing.";
}

function normalizeNutritionInfluenceInput(input: NutritionInfluenceItemInput, index: number): Partial<NutritionInfluenceItem> {
  if (typeof input !== "string") return input;

  const [possibleTitle, ...rest] = input.split(":");
  if (rest.length > 0 && possibleTitle.trim().length < 72) {
    return {
      title: possibleTitle.trim(),
      body: rest.join(":").trim(),
    };
  }

  return {
    body: input.trim(),
    title: ["Energy", "Cravings", "Hormonal Balance", "Long-Term Health"][index] || "Nutrition Support",
  };
}

function getNutritionInfluenceItems(ebook: Ebook): NutritionInfluenceItem[] {
  const defaults: NutritionInfluenceItem[] = [
    {
      number: "01.",
      title: "Energy",
      body: "The right nutrients help stabilize blood sugar and support steady energy throughout the day, so you can feel more awake, focused, and resilient.",
      icon: "energy",
    },
    {
      number: "02.",
      title: "Cravings",
      body: "Balanced meals and blood sugar stability can reduce intense cravings and help you feel more satisfied and in control.",
      icon: "cravings",
    },
    {
      number: "03.",
      title: "Hormonal Balance",
      body: "Nutrition plays a powerful role in regulating hormones like insulin, estrogen, and testosterone, supporting ovulation, mood, and cycle regularity.",
      icon: "balance",
    },
    {
      number: "04.",
      title: "Long-Term Health",
      body: "Nourishing your body today supports your future, reducing the risk of metabolic issues, inflammation, and chronic disease down the road.",
      icon: "leaf",
    },
  ];

  if (!ebook.summary.nutrition_influence_items?.length) return defaults;

  return defaults.map((fallback, index) => {
    const input = ebook.summary.nutrition_influence_items?.[index];
    if (!input) return fallback;
    const normalized = normalizeNutritionInfluenceInput(input, index);
    return {
      ...fallback,
      ...normalized,
      number: normalized.number || fallback.number,
      title: normalized.title || fallback.title,
      body: normalized.body || fallback.body,
      icon: normalized.icon || fallback.icon,
    };
  });
}

function getNutritionInfluenceTakeaway(ebook: Ebook) {
  return ebook.summary.nutrition_influence_takeaway?.trim()
    || "Food is more than fuel, it's information. The right nutrition helps your body function, heal, and thrive.";
}

const PRIORITIZE_FOOD_DEFAULTS: FoodGalleryItem[] = [
  {
    title: "Leafy Greens",
    description: "Rich in fiber, folate, and magnesium to support hormones and detoxification.",
  },
  {
    title: "Berries",
    description: "Low in sugar, high in antioxidants to reduce inflammation and support insulin sensitivity.",
  },
  {
    title: "Lean Proteins",
    description: "Support stable blood sugar, muscle repair, and long-lasting satiety.",
  },
  {
    title: "Whole Grains",
    description: "Provide complex carbohydrates and fiber for steady energy and balanced blood sugar.",
  },
  {
    title: "Healthy Fats",
    description: "Support hormone production and keep you feeling full and satisfied.",
  },
  {
    title: "Nuts & Seeds",
    description: "Packed with healthy fats, zinc, and selenium to support hormone balance.",
  },
  {
    title: "Legumes",
    description: "High in fiber and plant protein to support gut health and stable energy.",
  },
  {
    title: "Fermented Foods",
    description: "Support gut health, reduce bloating, and improve nutrient absorption.",
  },
];

const MINDFUL_FOOD_DEFAULTS: FoodGalleryItem[] = [
  {
    title: "Refined Sugars",
    description: "Can cause blood sugar spikes and crashes, leading to increased cravings and energy dips.",
  },
  {
    title: "Refined Carbs",
    description: "Such as white bread, pastries, and white pasta may impact blood sugar balance and satiety.",
  },
  {
    title: "Fried & Fast Foods",
    description: "Often high in unhealthy fats and additives that may increase inflammation and hormonal imbalance.",
  },
  {
    title: "Processed Meats",
    description: "May contain additives and preservatives that could affect inflammation and hormone health.",
  },
  {
    title: "Flavored Yogurts",
    description: "Often high in added sugars and artificial ingredients that can impact gut and metabolic health.",
  },
  {
    title: "Sugary Drinks",
    description: "Linked to insulin resistance and increased risk of weight gain and energy fluctuations.",
  },
  {
    title: "Alcohol",
    description: "Can disrupt sleep, stress hormones, and blood sugar balance, especially in excess.",
  },
  {
    title: "Highly Processed Snacks",
    description: "Often low in nutrients and high in additives, which may contribute to inflammation and cravings.",
  },
];

function normalizeFoodGalleryInput(input: FoodGalleryItemInput): Partial<FoodGalleryItem> {
  if (typeof input !== "string") return { ...input, imageUrl: input.imageUrl || input.image_url };

  const [possibleTitle, ...rest] = input.split(":");
  if (rest.length > 0 && possibleTitle.trim().length < 52) {
    return {
      title: possibleTitle.trim(),
      description: rest.join(":").trim(),
    };
  }

  return {
    title: input.trim(),
  };
}

function getPlanFoodItems(values: unknown): FoodGalleryItemInput[] {
  if (!Array.isArray(values)) return [];
  return values
    .map((value) => {
      if (typeof value === "string") return value;
      if (value && typeof value === "object") return value as Partial<FoodGalleryItem>;
      return null;
    })
    .filter((value): value is FoodGalleryItemInput => Boolean(value));
}

function mergeFoodGalleryItems(defaults: FoodGalleryItem[], explicit: FoodGalleryItemInput[]) {
  if (!explicit.length) return defaults;

  return defaults.map((fallback, index) => {
    const input = explicit[index];
    if (!input) return fallback;
    const normalized = normalizeFoodGalleryInput(input);
    return {
      title: normalized.title || fallback.title,
      description: normalized.description || fallback.description,
      imageUrl: normalized.imageUrl || fallback.imageUrl,
    };
  });
}

function getFoodsToPrioritize(ebook: Ebook, plan: any) {
  const explicit = ebook.summary.foods_to_prioritize?.length
    ? ebook.summary.foods_to_prioritize
    : ebook.summary.foods_to_prioritise?.length
      ? ebook.summary.foods_to_prioritise
      : getPlanFoodItems(plan?.foods_to_eat);

  return mergeFoodGalleryItems(PRIORITIZE_FOOD_DEFAULTS, explicit);
}

function getFoodsToBeMindfulOf(ebook: Ebook, plan: any) {
  const explicit = ebook.summary.foods_to_be_mindful_of?.length
    ? ebook.summary.foods_to_be_mindful_of
    : getPlanFoodItems(plan?.foods_to_avoid);

  return mergeFoodGalleryItems(MINDFUL_FOOD_DEFAULTS, explicit);
}

const HYDRATION_DEFAULT_TIPS = [
  "Keep a water bottle with you to stay on track.",
  "Herbal teas and infused water count towards your intake.",
  "Include electrolytes if you sweat heavily or feel low energy.",
  "Use reminders or hydration apps to build the habit.",
];

function normalizeHydrationStepInput(input: HydrationStepInput, fallback: HydrationStep): HydrationStep {
  if (typeof input !== "string") {
    return {
      title: input.title || fallback.title,
      body: input.body || fallback.body,
    };
  }

  const [possibleTitle, ...rest] = input.split(":");
  if (rest.length > 0 && possibleTitle.trim().length < 54) {
    return {
      title: possibleTitle.trim(),
      body: rest.join(":").trim() || fallback.body,
    };
  }

  return {
    ...fallback,
    body: input.trim() || fallback.body,
  };
}

function getHydrationGuidance(ebook: Ebook): HydrationGuidance {
  const input = ebook.summary.hydration_guidance;
  const objectInput = input && typeof input === "object" ? input : {};
  const dailyGoal = objectInput.dailyGoal || objectInput.daily_goal || "8-10 glasses";
  const morningRitual = objectInput.morningRitual || objectInput.morning_ritual || "a full glass of water";
  const eveningRitual = objectInput.eveningRitual || objectInput.evening_ritual || "calming herbal tea or warm water";

  const defaults: HydrationStep[] = [
    {
      title: "Daily Goal",
      body: `Aim for ${dailyGoal} spread throughout the day.`,
    },
    {
      title: "Sip Consistently",
      body: "Drink a glass of water every 1-2 hours. Consistent sips keep your body hydrated and your energy steady.",
    },
    {
      title: "Start & End Your Day",
      body: `Begin your morning with ${morningRitual} and unwind at night with ${eveningRitual}.`,
    },
    {
      title: "Enhance Naturally",
      body: "Add hydrating, nutrient-rich ingredients like lemon, cucumber, mint, or berries to make water more refreshing.",
    },
    {
      title: "Listen To Your Body",
      body: "Thirst, dry skin, fatigue, or headaches can be signs you need more fluids. Check in and rehydrate.",
    },
  ];

  const explicitSteps = objectInput.steps || [];

  return {
    intro: objectInput.intro || (typeof input === "string" ? input : "") || "Proper hydration supports hormone balance, energy levels, digestion, and glowing skin. Small, consistent habits make a big difference.",
    dailyGoal,
    morningRitual,
    eveningRitual,
    steps: defaults.map((fallback, index) => {
      const explicit = explicitSteps[index];
      return explicit ? normalizeHydrationStepInput(explicit, fallback) : fallback;
    }),
    tips: objectInput.tips?.length ? objectInput.tips.slice(0, 4) : HYDRATION_DEFAULT_TIPS,
    quote: objectInput.quote || "Hydration is self-care. Nourish your body with water, and it will nourish you in return.",
  };
}

const MEAL_TIMING_DEFAULTS: MealTimingEntry[] = [
  {
    time: "7:00 - 8:30 AM",
    title: "Breakfast",
    body: "Start your day with a balanced meal rich in protein, healthy fats, and fiber to support stable energy and hormone balance.",
  },
  {
    time: "10:30 - 11:00 AM",
    title: "Mid-Morning Snack",
    body: "A small, nutrient-dense snack can help curb cravings and keep energy levels steady until lunch.",
  },
  {
    time: "12:30 - 1:30 PM",
    title: "Lunch",
    body: "Aim for a balanced plate with protein, vegetables, and smart carbohydrates to support focus and sustained energy.",
  },
  {
    time: "4:00 - 4:30 PM",
    title: "Evening Snack",
    body: "Choose a protein- or fiber-rich snack to stabilize blood sugar and prevent overeating later.",
  },
  {
    time: "6:30 - 7:30 PM",
    title: "Dinner",
    body: "Keep dinner light yet satisfying with protein and vegetables to support digestion and restful sleep.",
  },
];

function normalizeMealTimingEntry(input: MealTimingEntryInput, fallback: MealTimingEntry): MealTimingEntry {
  if (typeof input !== "string") {
    return {
      time: input.time || fallback.time,
      title: input.title || fallback.title,
      body: input.body || fallback.body,
    };
  }

  const parts = input.split("|").map((part) => part.trim()).filter(Boolean);
  if (parts.length >= 3) {
    return {
      time: parts[0] || fallback.time,
      title: parts[1] || fallback.title,
      body: parts.slice(2).join(" ") || fallback.body,
    };
  }

  return {
    ...fallback,
    body: input.trim() || fallback.body,
  };
}

function getMealTimingGuidance(ebook: Ebook): MealTimingGuidance {
  const input = ebook.summary.meal_timing_guidance;
  const objectInput = input && typeof input === "object" ? input : {};
  const explicitEntries = objectInput.entries || objectInput.timeline || [];

  return {
    intro: objectInput.intro || (typeof input === "string" ? input : "") || "When you eat is just as important as what you eat. Consistent meal timing helps stabilize blood sugar, balance hormones, and support steady energy throughout the day.",
    entries: MEAL_TIMING_DEFAULTS.map((fallback, index) => {
      const explicit = explicitEntries[index];
      return explicit ? normalizeMealTimingEntry(explicit, fallback) : fallback;
    }),
    consistencyTitle: objectInput.consistencyTitle || objectInput.consistency_title || "Consistency Is Key",
    consistencyBody: objectInput.consistencyBody || objectInput.consistency_body || "Try to eat at regular times each day. This helps regulate hunger, balance hormones, and support overall well-being.",
    quote: objectInput.quote || "Small, consistent habits create meaningful long-term change.",
  };
}

const FOOD_SWAP_DEFAULTS: FoodSwapItem[] = [
  {
    beforeTitle: "Sugary Cereals",
    beforeBody: "High in refined sugar and low in fiber, can cause energy crashes.",
    afterTitle: "Oats with Seeds & Berries",
    afterBody: "High in fiber and healthy fats to keep you full and energized.",
  },
  {
    beforeTitle: "White Bread",
    beforeBody: "Refined carbs that spike blood sugar and increase cravings.",
    afterTitle: "Whole Grain Sourdough",
    afterBody: "Rich in fiber and nutrients, supports steady energy and gut health.",
  },
  {
    beforeTitle: "Sweetened Yogurt",
    beforeBody: "Often high in added sugar and artificial ingredients.",
    afterTitle: "Plain Greek Yogurt with Fruits & Nuts",
    afterBody: "High in protein and healthy fats to support hormone balance.",
  },
  {
    beforeTitle: "Sugary Drinks",
    beforeBody: "Empty calories that lead to energy crashes and sugar spikes.",
    afterTitle: "Infused Water or Herbal Tea",
    afterBody: "Hydrating, refreshing, and supports overall well-being.",
  },
];

function normalizeFoodSwapInput(input: FoodSwapItemInput, fallback: FoodSwapItem): FoodSwapItem {
  if (typeof input !== "string") {
    return {
      beforeTitle: input.beforeTitle || input.before_title || fallback.beforeTitle,
      beforeBody: input.beforeBody || input.before_body || fallback.beforeBody,
      afterTitle: input.afterTitle || input.after_title || fallback.afterTitle,
      afterBody: input.afterBody || input.after_body || fallback.afterBody,
    };
  }

  const [beforeTitle, beforeBody, afterTitle, afterBody] = input.split("|").map((part) => part.trim());
  return {
    beforeTitle: beforeTitle || fallback.beforeTitle,
    beforeBody: beforeBody || fallback.beforeBody,
    afterTitle: afterTitle || fallback.afterTitle,
    afterBody: afterBody || fallback.afterBody,
  };
}

function getFoodSwaps(ebook: Ebook): FoodSwaps {
  const input = ebook.summary.food_swaps;
  const objectInput = input && !Array.isArray(input) && typeof input === "object" ? input : {};
  const explicitSwaps = Array.isArray(input) ? input : objectInput.swaps || objectInput.items || [];

  return {
    intro: objectInput.intro || "Small swaps can make a big difference. Choose foods that nourish your body, balance hormones, and support long-term well-being.",
    swaps: FOOD_SWAP_DEFAULTS.map((fallback, index) => {
      const explicit = explicitSwaps[index];
      return explicit ? normalizeFoodSwapInput(explicit, fallback) : fallback;
    }),
    quote: objectInput.quote || "Small choices repeated consistently become powerful habits.",
  };
}

const DAILY_HABIT_DEFAULTS: DailyHabit[] = [
  {
    title: "Morning Hydration",
    body: "Start your day with water to rehydrate your body, support metabolism, and improve focus.",
    icon: "bottle",
  },
  {
    title: "Balanced Breakfast",
    body: "Fuel your body with protein, healthy fats, and fiber to stabilize blood sugar and sustain energy.",
    icon: "bowl",
  },
  {
    title: "Daily Movement",
    body: "Move your body every day - walk, stretch, or do yoga to boost mood and hormone balance.",
    icon: "shoe",
  },
  {
    title: "Recovery Habits",
    body: "Prioritize quality sleep, stress management, and downtime to help your body heal and reset.",
    icon: "lotus",
  },
];

function normalizeDailyHabitInput(input: DailyHabitInput, fallback: DailyHabit): DailyHabit {
  if (typeof input !== "string") {
    return {
      title: input.title || fallback.title,
      body: input.body || fallback.body,
      icon: input.icon || fallback.icon,
    };
  }

  const [title, body] = input.split("|").map((part) => part.trim());
  return {
    ...fallback,
    title: title || fallback.title,
    body: body || fallback.body,
  };
}

function getStressInsight(ebook: Ebook) {
  return ebook.summary.stress_insight
    || "Stress may be making consistency harder by increasing cravings, lowering energy, and pushing your body toward quick comfort choices. Gentle regulation, steady meals, and recovery cues can help your nervous system feel safer and your choices feel easier.";
}

function getDailyHabits(ebook: Ebook) {
  const explicit = ebook.summary.daily_habits || [];
  return DAILY_HABIT_DEFAULTS.map((fallback, index) => {
    const input = explicit[index];
    return input ? normalizeDailyHabitInput(input, fallback) : fallback;
  });
}

const BREAKFAST_RECIPE_DEFAULTS: BreakfastRecipe[] = [
  {
    name: "Balanced Overnight Berry Oats",
    subtitle: "These breakfasts are designed to nourish your body, balance hormones, and keep you energized and satisfied for hours.",
    prepTime: "10 mins",
    servings: "2",
    difficulty: "Easy",
    ingredients: [
      "1 cup rolled oats (gluten-free)",
      "1 cup unsweetened almond milk",
      "1/2 cup plain Greek yogurt (dairy-free or regular)",
      "1/2 cup mixed berries (fresh or frozen)",
      "1 tbsp ground flaxseeds",
      "1 tbsp chia seeds",
      "1 tsp maple syrup (optional)",
      "1 tbsp almond butter",
      "1/4 tsp vanilla extract",
      "Pinch of cinnamon",
    ],
    method: [
      { body: "In a jar or bowl, combine oats, ground flaxseeds, chia seeds, almond milk, Greek yogurt, maple syrup, vanilla extract, and cinnamon." },
      { body: "Stir well until everything is combined." },
      { body: "Fold in the mixed berries and almond butter." },
      { body: "Cover and refrigerate overnight (or at least 4 hours)." },
      { body: "In the morning, give it a good stir and enjoy chilled. Top with extra berries, seeds, or nuts if desired." },
    ],
    makeItYoursTitle: "Make It Yours",
    makeItYoursBody: "Add a scoop of protein powder or swap berries for diced apple and cinnamon for extra satisfaction.",
    nutritionHighlights: [
      { title: "High In Fiber", body: "Supports digestion and keeps you full longer.", icon: "leaf" },
      { title: "Hormone Balancing", body: "Flaxseeds and oats help support healthy estrogen metabolism.", icon: "balance" },
      { title: "Steady Energy", body: "Complex carbs and healthy fats provide long-lasting energy without spikes.", icon: "energy" },
      { title: "Rich In Antioxidants", body: "Berries help reduce inflammation and support overall wellness.", icon: "heart" },
    ],
    benefits: [
      { title: "High In Fiber", body: "Supports digestion and keeps you full longer.", icon: "leaf" },
      { title: "Hormone Balancing", body: "Helps support healthy estrogen metabolism and balanced appetite cues.", icon: "balance" },
      { title: "Steady Energy", body: "Complex carbs and healthy fats provide long-lasting energy without spikes.", icon: "energy" },
      { title: "Rich In Antioxidants", body: "Berries help reduce inflammation and support overall wellness.", icon: "heart" },
      { title: "Protein Support", body: "Protein-rich ingredients support fullness, muscle repair, and steady mornings.", icon: "protein" },
      { title: "Gut Friendly", body: "Fiber-rich oats and seeds help nourish digestion and daily regularity.", icon: "leaf" },
    ],
    proteinSummaryTitle: "Protein",
    proteinSummaryBody: "A balanced blend of plant-based proteins to keep you full, support muscle health, and balance hormones.",
    nutritionBreakdown: [
      { ingredient: "Rolled Oats", amount: "6 g" },
      { ingredient: "Greek Yogurt", amount: "10 g" },
      { ingredient: "Chia Seeds", amount: "3 g" },
      { ingredient: "Ground Flaxseeds", amount: "2 g" },
      { ingredient: "Almond Butter", amount: "3 g" },
    ],
    totalProtein: "24 g",
  },
  {
    name: "Matcha Chia Pudding Bowl",
    subtitle: "A refreshing, antioxidant-rich breakfast that supports balanced energy and hormone health.",
    prepTime: "10 mins",
    servings: "2",
    difficulty: "Easy",
    ingredients: [
      "1/2 cup chia seeds",
      "2 cups unsweetened almond milk",
      "1 tsp matcha powder",
      "1 tbsp maple syrup",
      "1/2 tsp vanilla extract",
      "Kiwi and blueberries",
      "Coconut flakes",
      "Pumpkin seeds",
    ],
    method: [
      { title: "Prepare Matcha", body: "In a small bowl, whisk matcha powder with a splash of warm water until smooth and lump-free." },
      { title: "Make Pudding", body: "In a jar or bowl, combine chia seeds, milk, maple syrup, vanilla, and the whisked matcha. Stir well." },
      { title: "Chill", body: "Cover and refrigerate for at least 4 hours or overnight, until thick and pudding-like." },
      { title: "Prepare Toppings", body: "Slice kiwi and gather your toppings like blueberries, pumpkin seeds, and coconut flakes." },
      { title: "Assemble", body: "Spoon the chilled matcha chia pudding into a bowl." },
      { title: "Top & Enjoy", body: "Top with kiwi, blueberries, pumpkin seeds, coconut flakes, and any other favorites. Enjoy!" },
    ],
    makeItYoursTitle: "Tip",
    makeItYoursBody: "Feel free to customize your toppings with seasonal fruits or your favorites.",
    nutritionHighlights: [
      { title: "Hormone Balance", body: "Supports estrogen balance and helps regulate hormonal fluctuations naturally.", icon: "balance" },
      { title: "Gut Health", body: "High in fiber and prebiotics to nourish good bacteria and support smooth digestion.", icon: "leaf" },
      { title: "Immune Support", body: "Packed with antioxidants, vitamins, and minerals to strengthen immunity and resilience.", icon: "heart" },
      { title: "Mood & Stress", body: "L-theanine in matcha promotes calm focus and helps reduce daily stress.", icon: "leaf" },
    ],
    benefits: [
      { title: "Hormone Balance", body: "Supports estrogen balance and helps regulate hormonal fluctuations naturally.", icon: "balance" },
      { title: "Gut Health", body: "High in fiber and prebiotics to nourish good bacteria and support smooth digestion.", icon: "leaf" },
      { title: "Immune Support", body: "Packed with antioxidants, vitamins, and minerals to strengthen immunity and resilience.", icon: "heart" },
      { title: "Mood & Stress", body: "L-theanine in matcha promotes calm focus and helps reduce daily stress.", icon: "leaf" },
      { title: "Sustained Energy", body: "A balanced blend of protein, healthy fats, and complex carbs for long-lasting energy.", icon: "energy" },
      { title: "Skin Glow", body: "Antioxidants and omega-3s help fight inflammation and promote clear, radiant skin.", icon: "heart" },
    ],
    proteinSummaryTitle: "Protein",
    proteinSummaryBody: "A balanced blend of plant-based proteins to keep you full, support muscle health, and balance hormones.",
    nutritionBreakdown: [
      { ingredient: "Chia Seeds", amount: "5 g" },
      { ingredient: "Pumpkin Seeds", amount: "3 g" },
      { ingredient: "Hemp Seeds", amount: "2 g" },
      { ingredient: "Coconut Flakes", amount: "1 g" },
      { ingredient: "Blueberries", amount: "1 g" },
    ],
    totalProtein: "12 g",
  },
];

const SNACK_RECIPE_DEFAULTS: SnackRecipe[] = [
  {
    name: "Overnight Chia Protein Pudding",
    subtitle: "Creamy, filling and perfect make-ahead snack.",
    icon: "moon",
    ingredients: ["Chia seeds", "Almond milk", "Vanilla protein powder", "Maple syrup", "Blueberries & almonds"],
    metrics: [
      { label: "Prep Time", value: "5 mins", icon: "time" },
      { label: "Chill Time", value: "Overnight", icon: "chill" },
      { label: "Serves", value: "1", icon: "servings" },
    ],
  },
  {
    name: "No-Bake Energy Bites",
    subtitle: "Quick, no-bake bites for sustained energy.",
    icon: "energy",
    ingredients: ["Oats", "Peanut butter", "Honey", "Flaxseeds", "Dark chocolate chips"],
    metrics: [
      { label: "Prep Time", value: "10 mins", icon: "time" },
      { label: "Serves", value: "2", icon: "servings" },
      { label: "Store In", value: "Fridge", icon: "fridge" },
    ],
  },
  {
    name: "Spiced Roasted Chickpeas",
    subtitle: "Crunchy, savory and perfect on-the-go.",
    icon: "leaf",
    ingredients: ["Chickpeas", "Olive oil", "Paprika", "Cumin powder", "Sea salt"],
    metrics: [
      { label: "Prep Time", value: "5 mins", icon: "time" },
      { label: "Bake Time", value: "25 mins", icon: "oven" },
      { label: "Serves", value: "2", icon: "servings" },
    ],
  },
];

const SNACK_FEATURE_DEFAULTS: RecipeHighlight[] = [
  { title: "Nutrient Dense", body: "Packed with essential nutrients", icon: "leaf" },
  { title: "Energy Boost", body: "Keeps you energized and focused", icon: "energy" },
  { title: "Satisfying", body: "Keeps cravings in check longer", icon: "heart" },
  { title: "Good For You", body: "Clean ingredients, real benefits", icon: "heart" },
];

const SNACK_BENEFIT_DEFAULTS: RecipeHighlight[] = [
  { title: "Stabilizes Blood Sugar", body: "Supports steady energy between meals.", icon: "leaf" },
  { title: "Improves Focus", body: "Balanced fuel for productive afternoons.", icon: "energy" },
  { title: "Supports Healthy Digestion", body: "Fiber-rich ingredients help gut rhythm.", icon: "leaf" },
  { title: "Strengthens Immunity", body: "Nutrients that support daily resilience.", icon: "heart" },
  { title: "Helps Manage Weight", body: "Satisfying snacks reduce grazing.", icon: "balance" },
  { title: "Keeps You Full", body: "Protein and fiber promote fullness.", icon: "protein" },
];

const BEVERAGE_RECIPE_DEFAULTS: BeverageRecipe[] = [
  {
    name: "Berry Protein Smoothie",
    subtitle: "A creamy, protein-packed smoothie to fuel your day.",
    accent: "berry",
    icon: "berry",
    ingredients: ["Blueberries", "Chia seeds", "Banana", "Protein powder", "Greek yogurt", "Almond milk"],
    metrics: [
      { label: "Prep Time", value: "5 mins", icon: "time" },
      { label: "Blend Time", value: "1 min", icon: "blend" },
      { label: "Serves", value: "1", icon: "servings" },
    ],
  },
  {
    name: "Golden Milk (Turmeric Latte)",
    subtitle: "A warm, soothing drink to support immunity and relaxation.",
    accent: "gold",
    icon: "cup",
    ingredients: ["Milk (dairy or plant-based)", "Cinnamon", "Turmeric powder", "Black pepper", "Ginger powder", "Honey or maple syrup"],
    metrics: [
      { label: "Prep Time", value: "5 mins", icon: "time" },
      { label: "Cook Time", value: "5 mins", icon: "cook" },
      { label: "Serves", value: "1", icon: "servings" },
    ],
  },
  {
    name: "Green Detox Drink",
    subtitle: "A refreshing blend to detox, hydrate and rejuvenate.",
    accent: "green",
    icon: "leaf",
    ingredients: ["Cucumber", "Lemon juice", "Celery", "Ginger", "Spinach", "Mint leaves"],
    metrics: [
      { label: "Prep Time", value: "5 mins", icon: "time" },
      { label: "Blend Time", value: "1 min", icon: "blend" },
      { label: "Serves", value: "1", icon: "servings" },
    ],
  },
];

const BEVERAGE_FEATURE_DEFAULTS: RecipeHighlight[] = [
  { title: "Nutrient Rich", body: "Packed with vitamins, minerals & antioxidants", icon: "leaf" },
  { title: "Energizing", body: "Naturally boosts energy and reduces fatigue", icon: "energy" },
  { title: "Immunity Support", body: "Strengthens immunity and builds resilience", icon: "heart" },
  { title: "Hydrating", body: "Supports hydration and detoxification", icon: "leaf" },
];

const BEVERAGE_BENEFIT_DEFAULTS: RecipeHighlight[] = [
  { title: "Rich in Antioxidants", body: "Colorful ingredients support cellular health.", icon: "balance" },
  { title: "Supports Digestion", body: "Gentle ingredients help digestive comfort.", icon: "leaf" },
  { title: "Promotes Healthy Skin", body: "Hydrating nutrients support glow.", icon: "heart" },
  { title: "Helps Manage Weight", body: "Satisfying drinks reduce sugary cravings.", icon: "protein" },
  { title: "Improves Mood", body: "Steady nourishment supports well-being.", icon: "heart" },
];

const GROCERY_PROTEIN_DEFAULTS: GroceryCatalogItem[] = [
  { name: "Chicken Breast", description: "Lean, high in protein and essential nutrients.", tags: ["Builds Tissue", "Muscle Support", "Lean Protein"] },
  { name: "Eggs", description: "Versatile and packed with high-quality protein.", tags: ["Protein Rich", "Choline", "Satisfying"] },
  { name: "Fish (Salmon, Tuna)", description: "Rich in omega-3 fatty acids for heart and brain health.", tags: ["Omega-3", "Heart Health", "Brain Support"] },
  { name: "Tofu", description: "Great plant-based protein for muscle and bone health.", tags: ["Plant Protein", "Minerals", "Balanced"] },
  { name: "Lentils & Pulses", description: "High in protein, fiber and iron.", tags: ["Fiber Rich", "Iron", "Gut Support"] },
  { name: "Greek Yogurt", description: "Probiotic-rich and supports gut health.", tags: ["Probiotics", "Protein", "Creamy"] },
];

const GROCERY_VEGETABLE_OVERVIEW_DEFAULTS: GroceryCatalogItem[] = [
  { name: "Spinach", description: "Rich in iron, calcium and antioxidants.", tags: ["Nutrient Dense", "Iron", "Leafy Green"] },
  { name: "Broccoli", description: "High in fiber, vitamin C and supports immunity.", tags: ["Fiber", "Vitamin C", "Immunity"] },
  { name: "Bell Peppers", description: "Loaded with vitamin C and antioxidants.", tags: ["Colorful", "Antioxidants", "Vitamin C"] },
  { name: "Carrots", description: "Great source of beta-carotene and eye health.", tags: ["Eye Health", "Beta-Carotene", "Crunchy"] },
  { name: "Zucchini", description: "Low in calories, high in water and fiber.", tags: ["Hydrating", "Light", "Fiber"] },
  { name: "Cherry Tomatoes", description: "Rich in lycopene and heart-healthy nutrients.", tags: ["Lycopene", "Heart Health", "Fresh"] },
];

const GROCERY_FRUIT_OVERVIEW_DEFAULTS: GroceryCatalogItem[] = [
  { name: "Bananas", description: "Great source of potassium and natural energy.", tags: ["Energy Booster", "Potassium", "Snackable"] },
  { name: "Berries (Blueberries, Strawberries)", description: "High in antioxidants and vitamin C.", tags: ["Antioxidants", "Vitamin C", "Low Sugar"] },
  { name: "Apples", description: "High in fiber and supports digestion.", tags: ["Fiber", "Digestion", "Everyday"] },
  { name: "Oranges", description: "Boosts immunity with vitamin C.", tags: ["Immunity", "Vitamin C", "Juicy"] },
  { name: "Avocado", description: "Rich in healthy fats, vitamins and fiber.", tags: ["Healthy Fats", "Fiber", "Satisfying"] },
  { name: "Grapes", description: "Hydrating and packed with antioxidants.", tags: ["Hydration", "Antioxidants", "Sweet"] },
];

const GROCERY_FRUIT_CATALOG_DEFAULTS: GroceryCatalogItem[] = [
  { name: "Bananas", description: "Great source of potassium and natural energy.", tags: ["Energy Booster", "Heart Health", "Supports Digestion"] },
  { name: "Berries (Blueberries, Strawberries)", description: "High in antioxidants and vitamin C.", tags: ["Boosts Immunity", "Healthy Skin", "Rich in Antioxidants"] },
  { name: "Apples", description: "High in fiber and supports digestion.", tags: ["Heart Health", "Aids Digestion", "Supports Weight Control"] },
  { name: "Oranges", description: "Boosts immunity with vitamin C.", tags: ["Immunity Boost", "Healthy Skin", "Antioxidant Rich"] },
  { name: "Avocado", description: "Rich in healthy fats, vitamins E & K, and fiber.", tags: ["Heart Health", "Supports Brain Function", "Healthy Skin"] },
  { name: "Grapes", description: "Hydrating and packed with antioxidants.", tags: ["Heart Health", "Hydration", "Anti-aging Benefits"] },
  { name: "Kiwi", description: "Rich in vitamin C, fiber, and potassium.", tags: ["Immunity Boost", "Gut Health", "Skin Health"] },
  { name: "Papaya", description: "Aids digestion and rich in vitamins A & C.", tags: ["Aids Digestion", "Boosts Immunity", "Healthy Skin"] },
  { name: "Pomegranate", description: "Rich in antioxidants that support heart health.", tags: ["Heart Health", "Anti-inflammatory", "Cell Protection"] },
  { name: "Mango", description: "Rich in vitamin A and supports immune function.", tags: ["Immunity Boost", "Healthy Eyes", "Healthy Skin"] },
  { name: "Pineapple", description: "Aids digestion and rich in vitamin C.", tags: ["Aids Digestion", "Immunity Boost", "Anti-inflammatory"] },
  { name: "Watermelon", description: "Hydrating and rich in vitamins A & C.", tags: ["Hydration", "Skin Health", "Supports Heart Health"] },
  { name: "Pears", description: "High in fiber and supports gut health.", tags: ["Aids Digestion", "Heart Health", "Supports Immunity"] },
  { name: "Lemons", description: "Detoxifying and rich in vitamin C.", tags: ["Detoxifies Body", "Boosts Immunity", "Healthy Skin"] },
  { name: "Dates", description: "Natural source of energy and iron.", tags: ["Energy Booster", "Improves Digestion", "Supports Bone Health"] },
];

const GROCERY_VEGETABLE_CATALOG_DEFAULTS: GroceryCatalogItem[] = [
  { name: "Spinach", description: "Rich in iron, calcium, vitamins A, C & K, and antioxidants.", tags: ["Nutrient Dense", "Iron", "Antioxidants"] },
  { name: "Broccoli", description: "High in fiber, vitamin C, and sulforaphane that supports immunity.", tags: ["Fiber", "Immunity", "Gut Support"] },
  { name: "Bell Peppers", description: "Excellent source of vitamin C and antioxidants for healthy skin & immunity.", tags: ["Vitamin C", "Colorful", "Skin Support"] },
  { name: "Carrots", description: "High in beta-carotene which supports eye health and immunity.", tags: ["Eye Health", "Immunity", "Crunchy"] },
  { name: "Zucchini", description: "Low in calories and rich in water, vitamins A & C, and potassium.", tags: ["Hydration", "Light", "Potassium"] },
  { name: "Cherry Tomatoes", description: "Rich in lycopene and vitamin C; supports heart health and skin.", tags: ["Heart Health", "Lycopene", "Fresh"] },
  { name: "Cucumber", description: "Hydrating and low in calories; good source of vitamin K.", tags: ["Hydration", "Vitamin K", "Cooling"] },
  { name: "Kale", description: "Packed with vitamins A, C, K, calcium, and powerful antioxidants.", tags: ["Leafy Green", "Calcium", "Antioxidants"] },
  { name: "Cauliflower", description: "High in fiber and vitamin C; supports digestion and detoxification.", tags: ["Fiber", "Detox", "Vitamin C"] },
  { name: "Green Beans", description: "Good source of fiber, folate, and vitamins A, C, K; supports heart health.", tags: ["Fiber", "Folate", "Heart Health"] },
  { name: "Sweet Potato", description: "Rich in beta-carotene, fiber, and complex carbohydrates.", tags: ["Complex Carbs", "Fiber", "Eye Health"] },
  { name: "Beets", description: "Supports blood health and detoxification; rich in folate and iron.", tags: ["Blood Health", "Iron", "Detox"] },
  { name: "Cabbage", description: "High in fiber and vitamin K; supports digestion and immune health.", tags: ["Fiber", "Vitamin K", "Immunity"] },
  { name: "Brussels Sprouts", description: "Rich in fiber, vitamin C & K, and antioxidants that support overall wellness.", tags: ["Fiber", "Antioxidants", "Wellness"] },
  { name: "Asparagus", description: "Good source of folate, vitamins A, C, E, and K; supports detox.", tags: ["Folate", "Detox", "Micronutrients"] },
  { name: "Mushrooms", description: "Low in calories, high in B vitamins and selenium; supports immunity.", tags: ["B Vitamins", "Selenium", "Immunity"] },
  { name: "Onions", description: "Contains antioxidants and compounds that support heart health.", tags: ["Antioxidants", "Heart Health", "Flavor"] },
  { name: "Garlic", description: "Known for its immune-boosting and anti-inflammatory properties.", tags: ["Immunity", "Anti-inflammatory", "Flavor"] },
  { name: "Ginger", description: "Aids digestion, reduces inflammation, and supports overall wellness.", tags: ["Digestion", "Anti-inflammatory", "Warming"] },
  { name: "Lettuce", description: "Hydrating and rich in vitamins A & K; supports healthy digestion.", tags: ["Hydration", "Vitamin K", "Light"] },
];

const GROCERY_DEFAULTS: GroceryList = {
  intro: "Wholesome ingredients for everyday meals and better living.",
  proteinSources: {
    title: "Protein Sources",
    summary: "Builds and repairs tissues, supports muscle health.",
    items: GROCERY_PROTEIN_DEFAULTS,
  },
  vegetables: {
    title: "Vegetables",
    summary: "Rich in vitamins, minerals and fiber. Keep you energized.",
    items: GROCERY_VEGETABLE_OVERVIEW_DEFAULTS,
  },
  fruits: {
    title: "Fruits",
    summary: "Natural sweetness packed with antioxidants and nutrients.",
    items: GROCERY_FRUIT_OVERVIEW_DEFAULTS,
  },
  fruitCatalog: GROCERY_FRUIT_CATALOG_DEFAULTS,
  vegetableCatalog: GROCERY_VEGETABLE_CATALOG_DEFAULTS,
};

const ACTION_PLAN_DEFAULTS: ActionPlanWeek[] = [
  {
    week: "Week 1",
    title: "Build Momentum",
    range: "Days 1-7",
    focus: "Hydration, whole foods & movement",
    days: [
      { day: 1, action: "Start your day with warm lemon water." },
      { day: 2, action: "Choose a balanced breakfast." },
      { day: 3, action: "Add 1 green or nourishing beverage." },
      { day: 4, action: "Fill half your plate with vegetables." },
      { day: 5, action: "Move your body for 30 minutes." },
      { day: 6, action: "Choose healthy snacks mindfully." },
      { day: 7, action: "Reflect, journal & plan for next week." },
    ],
  },
  {
    week: "Week 2",
    title: "Strengthen Habits",
    range: "Days 8-14",
    focus: "Nutrition, consistency & self-care",
    days: [
      { day: 8, action: "Try a new healthy recipe." },
      { day: 9, action: "Eat a variety of colorful fruits." },
      { day: 10, action: "Drink at least 8 glasses of water." },
      { day: 11, action: "Include quality protein in your meals." },
      { day: 12, action: "Add healthy fats like nuts, seeds, avocado." },
      { day: 13, action: "Practice mindfulness or meditation." },
      { day: 14, action: "Review your progress & adjust goals." },
    ],
  },
  {
    week: "Week 3",
    title: "Elevate & Challenge",
    range: "Days 15-21",
    focus: "Energy, variety & sleep",
    days: [
      { day: 15, action: "Add more fiber-rich foods." },
      { day: 16, action: "Try a plant-based meal." },
      { day: 17, action: "Increase your activity intensity." },
      { day: 18, action: "Limit sugar & processed foods." },
      { day: 19, action: "Support your gut with probiotic foods." },
      { day: 20, action: "Unplug & relax before bed." },
      { day: 21, action: "Prioritize 7-8 hours of quality sleep." },
    ],
  },
  {
    week: "Week 4",
    title: "Sustain & Thrive",
    range: "Days 22-30",
    focus: "Mindset, balance & long-term well-being",
    days: [
      { day: 22, action: "Plan your meals for success." },
      { day: 23, action: "Nourish your body intentionally." },
      { day: 24, action: "Spend time in nature." },
      { day: 25, action: "Choose whole, unprocessed foods." },
      { day: 26, action: "Move, breathe & stay active." },
      { day: 27, action: "Practice gratitude daily." },
      { day: 28, action: "Celebrate small wins." },
      { day: 29, action: "Stay consistent, stay kind." },
      { day: 30, action: "You did it! Keep thriving!" },
    ],
  },
];

const ACTION_PLAN_TIPS_DEFAULTS = [
  "Plan ahead and prep meals.",
  "Stay hydrated throughout the day.",
  "Take it one day at a time.",
  "Celebrate progress, not perfection.",
  "Lean on your support system.",
];

const NEXT_CHAPTER_STEP_DEFAULTS: NextChapterStep[] = [
  {
    title: "Stay Consistent",
    body: "Repeat the simple meals, hydration cues, and movement habits that felt realistic this month.",
    icon: "leaf",
  },
  {
    title: "Track Your Signals",
    body: "Notice energy, cravings, sleep, digestion, mood, and cycle patterns without judging yourself.",
    icon: "balance",
  },
  {
    title: "Adjust Gently",
    body: "Use your progress notes to simplify what is hard and strengthen what is already working.",
    icon: "energy",
  },
  {
    title: "Get Support",
    body: "Bring your notes to a qualified professional when symptoms persist or you need deeper care.",
    icon: "heart",
  },
];

const FAQ_DEFAULTS: FaqItem[] = [
  {
    question: "How should I use this blueprint?",
    answer: "Start with one or two actions at a time, then build consistency before adding more.",
  },
  {
    question: "What if I miss a day?",
    answer: "Restart with the next simple meal or habit. Progress comes from returning, not perfection.",
  },
  {
    question: "When should I adjust the plan?",
    answer: "Adjust when energy, hunger, sleep, digestion, or stress signals show the routine needs support.",
  },
  {
    question: "When should I seek professional help?",
    answer: "Use medical guidance for persistent symptoms, medication questions, pregnancy, or complex conditions.",
  },
];

function normalizeRecipeMethodStep(input: RecipeMethodStepInput, fallback: RecipeMethodStep): RecipeMethodStep {
  if (typeof input !== "string") {
    return {
      title: input.title || fallback.title,
      body: input.body || fallback.body,
    };
  }

  const [title, body] = input.split("|").map((part) => part.trim());
  return body
    ? { title: title || fallback.title, body }
    : { ...fallback, body: input.trim() || fallback.body };
}

function normalizeRecipeHighlight(input: RecipeHighlightInput, fallback: RecipeHighlight): RecipeHighlight {
  if (typeof input !== "string") {
    return {
      title: input.title || fallback.title,
      body: input.body || fallback.body,
      icon: input.icon || fallback.icon,
    };
  }

  const [title, body] = input.split("|").map((part) => part.trim());
  return {
    ...fallback,
    title: title || fallback.title,
    body: body || fallback.body,
  };
}

function normalizeRecipeNutritionItem(input: RecipeNutritionItemInput, fallback: RecipeNutritionItem): RecipeNutritionItem {
  if (typeof input !== "string") {
    return {
      ingredient: input.ingredient || fallback.ingredient,
      amount: input.amount || fallback.amount,
    };
  }

  const [ingredient, amount] = input.split("|").map((part) => part.trim());
  return {
    ingredient: ingredient || fallback.ingredient,
    amount: amount || fallback.amount,
  };
}

function normalizeCompactRecipeMetric(input: CompactRecipeMetricInput, fallback: CompactRecipeMetric): CompactRecipeMetric {
  if (typeof input !== "string") {
    return {
      label: input.label || fallback.label,
      value: input.value || fallback.value,
      icon: input.icon || fallback.icon,
    };
  }

  const [label, value] = input.split("|").map((part) => part.trim());
  return {
    ...fallback,
    label: label || fallback.label,
    value: value || fallback.value,
  };
}

function normalizeSnackRecipeInput(input: SnackRecipeInput, fallback: SnackRecipe): SnackRecipe {
  if (typeof input === "string") {
    return {
      ...fallback,
      subtitle: input.trim() || fallback.subtitle,
    };
  }

  const explicitMetrics = input.metrics || [];
  const derivedMetrics: CompactRecipeMetric[] = [
    {
      label: "Prep Time",
      value: input.prepTime || input.prep_time || fallback.metrics[0]?.value || "5 mins",
      icon: "time",
    },
    {
      label: input.bakeTime || input.bake_time ? "Bake Time" : input.storeIn || input.store_in ? "Store In" : "Chill Time",
      value: input.bakeTime || input.bake_time || input.storeIn || input.store_in || input.chillTime || input.chill_time || fallback.metrics[1]?.value || "10 mins",
      icon: input.bakeTime || input.bake_time ? "oven" : input.storeIn || input.store_in ? "fridge" : "chill",
    },
    {
      label: "Serves",
      value: input.serves || input.servings || fallback.metrics[2]?.value || "1",
      icon: "servings",
    },
  ];

  return {
    name: input.name || input.title || fallback.name,
    subtitle: input.subtitle || input.description || fallback.subtitle,
    ingredients: input.ingredients?.length ? input.ingredients.slice(0, 6) : fallback.ingredients,
    metrics: derivedMetrics.map((metric, index) => {
      const explicit = explicitMetrics[index];
      return explicit ? normalizeCompactRecipeMetric(explicit, metric) : metric;
    }),
    icon: input.icon || fallback.icon,
  };
}

function normalizeBeverageRecipeInput(input: BeverageRecipeInput, fallback: BeverageRecipe): BeverageRecipe {
  if (typeof input === "string") {
    return {
      ...fallback,
      subtitle: input.trim() || fallback.subtitle,
    };
  }

  const explicitMetrics = input.metrics || [];
  const derivedMetrics: CompactRecipeMetric[] = [
    {
      label: "Prep Time",
      value: input.prepTime || input.prep_time || fallback.metrics[0]?.value || "5 mins",
      icon: "time",
    },
    {
      label: input.cookTime || input.cook_time ? "Cook Time" : "Blend Time",
      value: input.cookTime || input.cook_time || input.blendTime || input.blend_time || fallback.metrics[1]?.value || "1 min",
      icon: input.cookTime || input.cook_time ? "cook" : "blend",
    },
    {
      label: "Serves",
      value: input.serves || input.servings || fallback.metrics[2]?.value || "1",
      icon: "servings",
    },
  ];

  return {
    name: input.name || input.title || fallback.name,
    subtitle: input.subtitle || input.description || fallback.subtitle,
    ingredients: input.ingredients?.length ? input.ingredients.slice(0, 6) : fallback.ingredients,
    metrics: derivedMetrics.map((metric, index) => {
      const explicit = explicitMetrics[index];
      return explicit ? normalizeCompactRecipeMetric(explicit, metric) : metric;
    }),
    accent: input.accent || fallback.accent,
    icon: input.icon || fallback.icon,
  };
}

function getSnackRecipes(ebook: Ebook) {
  const explicit = ebook.summary.snack_recipes || [];
  return SNACK_RECIPE_DEFAULTS.map((fallback, index) => {
    const input = explicit[index];
    return input ? normalizeSnackRecipeInput(input, fallback) : fallback;
  });
}

function getBeverageRecipes(ebook: Ebook) {
  const explicit = ebook.summary.beverage_recipes || [];
  return BEVERAGE_RECIPE_DEFAULTS.map((fallback, index) => {
    const input = explicit[index];
    return input ? normalizeBeverageRecipeInput(input, fallback) : fallback;
  });
}

function mergeRecipeHighlights(defaults: RecipeHighlight[], explicit: RecipeHighlightInput[] | undefined) {
  if (!explicit?.length) return defaults;
  return defaults.map((fallback, index) => {
    const input = explicit[index];
    return input ? normalizeRecipeHighlight(input, fallback) : fallback;
  });
}

function getSnackFeatures(ebook: Ebook) {
  return mergeRecipeHighlights(SNACK_FEATURE_DEFAULTS, ebook.summary.snack_features).slice(0, 4);
}

function getSnackBenefits(ebook: Ebook) {
  return mergeRecipeHighlights(SNACK_BENEFIT_DEFAULTS, ebook.summary.snack_benefits).slice(0, 6);
}

function getBeverageFeatures(ebook: Ebook) {
  return mergeRecipeHighlights(BEVERAGE_FEATURE_DEFAULTS, ebook.summary.beverage_features).slice(0, 4);
}

function getBeverageBenefits(ebook: Ebook) {
  return mergeRecipeHighlights(BEVERAGE_BENEFIT_DEFAULTS, ebook.summary.beverage_benefits).slice(0, 5);
}

function normalizeGroceryCatalogItem(input: GroceryCatalogItemInput, fallback: GroceryCatalogItem): GroceryCatalogItem {
  if (typeof input !== "string") {
    return {
      name: input.name || input.title || fallback.name,
      description: input.description || input.body || fallback.description,
      tags: input.tags?.length ? input.tags.slice(0, 3) : input.benefits?.length ? input.benefits.slice(0, 3) : fallback.tags,
      imageUrl: input.imageUrl || input.image_url || fallback.imageUrl,
    };
  }

  const parts = input.split("|").map((part) => part.trim()).filter(Boolean);
  if (parts.length >= 2) {
    return {
      name: parts[0] || fallback.name,
      description: parts[1] || fallback.description,
      tags: parts.slice(2, 5).length ? parts.slice(2, 5) : fallback.tags,
    };
  }

  const [possibleName, ...rest] = input.split(":");
  if (rest.length > 0 && possibleName.trim().length < 54) {
    return {
      ...fallback,
      name: possibleName.trim() || fallback.name,
      description: rest.join(":").trim() || fallback.description,
    };
  }

  return {
    ...fallback,
    description: input.trim() || fallback.description,
  };
}

function mergeGroceryCatalogItems(defaults: GroceryCatalogItem[], explicit: GroceryCatalogItemInput[] | undefined, maxItems = defaults.length) {
  return defaults.slice(0, maxItems).map((fallback, index) => {
    const input = explicit?.[index];
    return input ? normalizeGroceryCatalogItem(input, fallback) : fallback;
  });
}

function normalizeGroceryCategory(input: GroceryCategoryInput | undefined, fallback: GroceryCategory): GroceryCategory {
  if (!input) return fallback;
  const objectInput: Partial<{ title: string; summary: string; items: GroceryCatalogItemInput[] }> = !Array.isArray(input) && typeof input === "object" ? input : {};
  const explicitItems = Array.isArray(input) ? input : objectInput.items;

  return {
    title: objectInput.title || fallback.title,
    summary: objectInput.summary || fallback.summary,
    items: mergeGroceryCatalogItems(fallback.items, explicitItems, fallback.items.length),
  };
}

function getGroceryList(ebook: Ebook): GroceryList {
  const input: GroceryListInput = ebook.summary.grocery_list || {};
  return {
    intro: input.intro || GROCERY_DEFAULTS.intro,
    proteinSources: normalizeGroceryCategory(input.proteinSources || input.protein_sources, GROCERY_DEFAULTS.proteinSources),
    vegetables: normalizeGroceryCategory(input.vegetables, GROCERY_DEFAULTS.vegetables),
    fruits: normalizeGroceryCategory(input.fruits, GROCERY_DEFAULTS.fruits),
    fruitCatalog: mergeGroceryCatalogItems(GROCERY_DEFAULTS.fruitCatalog, input.fruitCatalog || input.fruit_catalog, 15),
    vegetableCatalog: mergeGroceryCatalogItems(GROCERY_DEFAULTS.vegetableCatalog, input.vegetableCatalog || input.vegetable_catalog, 20),
  };
}

function normalizeActionPlanDay(input: ActionPlanDayInput, fallback: ActionPlanDay): ActionPlanDay {
  if (typeof input !== "string") {
    return {
      day: input.day || fallback.day,
      action: input.action || input.text || input.body || fallback.action,
    };
  }

  const [possibleDay, ...rest] = input.split(":").map((part) => part.trim());
  const parsedDay = Number(possibleDay.replace(/^day\s*/i, ""));
  if (rest.length && Number.isFinite(parsedDay)) {
    return {
      day: parsedDay,
      action: rest.join(":").trim() || fallback.action,
    };
  }

  return {
    ...fallback,
    action: input.trim() || fallback.action,
  };
}

function normalizeActionPlanWeek(input: ActionPlanWeekInput | undefined, fallback: ActionPlanWeek): ActionPlanWeek {
  if (!input) return fallback;

  if (Array.isArray(input)) {
    return {
      ...fallback,
      days: fallback.days.map((day, index) => {
        const explicit = input[index];
        return explicit ? normalizeActionPlanDay(explicit, day) : day;
      }),
    };
  }

  const explicitDays = input.days || input.actions || [];
  return {
    week: input.week || input.label || fallback.week,
    title: input.title || fallback.title,
    range: input.range || input.daysRange || input.days_range || fallback.range,
    focus: input.focus || fallback.focus,
    days: fallback.days.map((day, index) => {
      const explicit = explicitDays[index];
      return explicit ? normalizeActionPlanDay(explicit, day) : day;
    }),
  };
}

function getActionPlanWeeks(ebook: Ebook) {
  const inputs = [
    ebook.summary.week_1_plan,
    ebook.summary.week_2_plan,
    ebook.summary.week_3_plan,
    ebook.summary.week_4_plan,
  ];

  return ACTION_PLAN_DEFAULTS.map((fallback, index) => normalizeActionPlanWeek(inputs[index], fallback));
}

function getActionPlanTips(ebook: Ebook) {
  return ebook.summary.action_plan_tips?.length
    ? ebook.summary.action_plan_tips.slice(0, 5)
    : ACTION_PLAN_TIPS_DEFAULTS;
}

function normalizeNextChapterStep(input: NextChapterStepInput, fallback: NextChapterStep): NextChapterStep {
  if (typeof input !== "string") {
    return {
      title: input.title || fallback.title,
      body: input.body || fallback.body,
      icon: input.icon || fallback.icon,
    };
  }

  const [title, body] = input.split("|").map((part) => part.trim());
  return {
    ...fallback,
    title: title || fallback.title,
    body: body || fallback.body,
  };
}

function getNextChapterSteps(ebook: Ebook) {
  const explicit = ebook.summary.next_chapter_steps || [];
  return NEXT_CHAPTER_STEP_DEFAULTS.map((fallback, index) => {
    const input = explicit[index];
    return input ? normalizeNextChapterStep(input, fallback) : fallback;
  });
}

function normalizeFaqItem(input: FaqItemInput, fallback: FaqItem): FaqItem {
  if (typeof input !== "string") {
    return {
      question: input.question || fallback.question,
      answer: input.answer || input.body || fallback.answer,
    };
  }

  const [question, answer] = input.split("|").map((part) => part.trim());
  return {
    question: question || fallback.question,
    answer: answer || fallback.answer,
  };
}

function getFaqItems(ebook: Ebook) {
  const explicit = ebook.summary.faq_items || [];
  return FAQ_DEFAULTS.map((fallback, index) => {
    const input = explicit[index];
    return input ? normalizeFaqItem(input, fallback) : fallback;
  });
}

function getClosingMessage(ebook: Ebook) {
  return ebook.summary.closing_message
    || "You now have a clear, personal starting point. Keep returning to the small actions that help your body feel supported, steady, and cared for.";
}

function normalizeBreakfastRecipeInput(input: BreakfastRecipeInput, fallback: BreakfastRecipe): BreakfastRecipe {
  if (typeof input === "string") {
    return {
      ...fallback,
      subtitle: input.trim() || fallback.subtitle,
    };
  }

  const explicitMethod = input.method || input.method_steps || [];
  const explicitHighlights = input.nutritionHighlights || input.nutrition_highlights || [];
  const explicitBenefits = input.benefits || [];
  const explicitBreakdown = input.nutritionBreakdown || input.nutrition_breakdown || [];

  return {
    name: input.name || input.title || fallback.name,
    subtitle: input.subtitle || input.description || fallback.subtitle,
    prepTime: input.prepTime || input.prep_time || fallback.prepTime,
    servings: input.servings || fallback.servings,
    difficulty: input.difficulty || fallback.difficulty,
    ingredients: input.ingredients?.length ? input.ingredients.slice(0, 10) : fallback.ingredients,
    method: fallback.method.map((step, index) => {
      const explicit = explicitMethod[index];
      return explicit ? normalizeRecipeMethodStep(explicit, step) : step;
    }),
    makeItYoursTitle: input.makeItYoursTitle || input.make_it_yours_title || fallback.makeItYoursTitle,
    makeItYoursBody: input.makeItYoursBody || input.make_it_yours_body || fallback.makeItYoursBody,
    nutritionHighlights: fallback.nutritionHighlights.map((highlight, index) => {
      const explicit = explicitHighlights[index];
      return explicit ? normalizeRecipeHighlight(explicit, highlight) : highlight;
    }),
    benefits: fallback.benefits.map((benefit, index) => {
      const explicit = explicitBenefits[index];
      return explicit ? normalizeRecipeHighlight(explicit, benefit) : benefit;
    }),
    proteinSummaryTitle: input.proteinSummaryTitle || input.protein_summary_title || fallback.proteinSummaryTitle,
    proteinSummaryBody: input.proteinSummaryBody || input.protein_summary_body || fallback.proteinSummaryBody,
    nutritionBreakdown: fallback.nutritionBreakdown.map((item, index) => {
      const explicit = explicitBreakdown[index];
      return explicit ? normalizeRecipeNutritionItem(explicit, item) : item;
    }),
    totalProtein: input.totalProtein || input.total_protein || fallback.totalProtein,
  };
}

function getRecipeCollectionIntro(ebook: Ebook) {
  return ebook.summary.recipe_collection_intro
    || "Your recipes are designed around steady energy, hormone support, satisfying flavors, and ingredients that fit the way you actually live.";
}

function getBreakfastRecipes(ebook: Ebook) {
  const explicit = ebook.summary.breakfast_recipes || [];
  return BREAKFAST_RECIPE_DEFAULTS.map((fallback, index) => {
    const input = explicit[index];
    return input ? normalizeBreakfastRecipeInput(input, fallback) : fallback;
  });
}

function SnapshotIcon({ type }: { type: SnapshotIcon }) {
  if (type === "avocado") {
    return (
      <svg viewBox="0 0 56 56" fill="none" aria-hidden="true">
        <path d="M28 9C19 18 16 25 16 33c0 8 5 14 12 14s12-6 12-14c0-8-3-15-12-24Z" stroke="currentColor" strokeWidth="2" />
        <circle cx="28" cy="34" r="5.5" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }

  if (type === "inflammation") {
    return (
      <svg viewBox="0 0 56 56" fill="none" aria-hidden="true">
        <circle cx="28" cy="28" r="10" stroke="currentColor" strokeWidth="1.8" />
        {Array.from({ length: 18 }).map((_, index) => {
          const angle = (index * 20 * Math.PI) / 180;
          const x = 28 + Math.cos(angle) * 19;
          const y = 28 + Math.sin(angle) * 19;
          return <circle key={index} cx={x} cy={y} r="1.2" fill="currentColor" />;
        })}
      </svg>
    );
  }

  if (type === "sleep") {
    return (
      <svg viewBox="0 0 56 56" fill="none" aria-hidden="true">
        <path d="M36 39c-9 1-17-5-18-14-.8-6 2-12 7-15-1 3-1 7 1 11 3 7 10 11 18 9-1 5-4 8-8 9Z" stroke="currentColor" strokeWidth="2" />
        <path d="M38 14l1.5 3 3 1.5-3 1.5-1.5 3-1.5-3-3-1.5 3-1.5 1.5-3Z" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 56 56" fill="none" aria-hidden="true">
      <circle cx="28" cy="28" r="9" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="20" cy="28" r="9" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="36" cy="28" r="9" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="28" cy="20" r="9" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="28" cy="36" r="9" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function ProfileMetricIcon({ type }: { type: ProfileIcon }) {
  if (type === "age") {
    return (
      <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <circle cx="20" cy="14" r="5.4" stroke="currentColor" strokeWidth="1.7" />
        <path d="M10.5 30c1.8-6 5-9 9.5-9s7.7 3 9.5 9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === "gender") {
    return (
      <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <circle cx="20" cy="16" r="7.2" stroke="currentColor" strokeWidth="1.7" />
        <path d="M20 23.2V34M15.5 29h9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === "height") {
    return (
      <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <path d="M12 11h16M12 29h16M20 12v16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M16 16l4-4 4 4M16 24l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path d="M12 16h16l2 17H10l2-17Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M15 16c.8-5 2.5-7.5 5-7.5s4.2 2.5 5 7.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M17 23h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function FocusAreaIcon({ type }: { type: FocusIcon }) {
  if (type === "balance") {
    return (
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <path d="M32 14v31M20 21h24M22 21l-8 16M22 21l8 16M14 37h16M42 21l-8 16M42 21l8 16M34 37h16M24 45h16M28 49h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="32" cy="14" r="2.2" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    );
  }

  if (type === "avocado") {
    return (
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <path d="M32 12C21.8 22.2 18 30.2 18 39.2 18 47.6 23.9 54 32 54s14-6.4 14-14.8C46 30.2 42.2 22.2 32 12Z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
        <circle cx="32" cy="40.2" r="6.2" stroke="currentColor" strokeWidth="1.7" />
      </svg>
    );
  }

  if (type === "gut") {
    return (
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <path d="M30 12c-4 0-7 3-7 7 0 3.8 3 6.7 7 6.7h8.5c3.8 0 6.5 2.7 6.5 6.3s-2.7 6.4-6.5 6.4H23.8c-3.7 0-6.3 2.5-6.3 6s2.6 6.1 6.3 6.1h12.8c2.6 0 4.5 1.9 4.5 4.3 0 2.2-1.4 3.8-3.4 4.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M34 12c4.1 0 7 3 7 7 0 3.8-2.9 6.7-7 6.7H22.5M26 32h15.5M27 45.5h17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === "stress") {
    return (
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <path d="M35.5 53H27c0-5-2.5-7.8-5.1-10.6-2.7-2.9-5.4-6.1-5.4-12.2C16.5 20 24.2 12.5 34 12.5c8.2 0 14 5.6 14 13.2 0 4.7-2 8.2-5.2 10.4-2.3 1.6-4.6 2-7.3 1.7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M34.5 22.8c-3.4 1.2-5.4 4-5.2 7.5 3.7-.3 6.5-2.6 7.2-6.5 2.9 2.4 3.9 5.6 2.7 9-4.3-.5-7.6-2.8-9.9-6.9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type === "sleep") {
    return (
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <path d="M43.5 45.4c-10.7 1.2-20.2-6-21.4-16.2-.8-6.8 2.3-13.2 7.6-16.7-.9 4-.2 8.4 2.4 12.3 3.5 5.4 9.7 8.2 16.1 7.4-.9 6.8-5.1 11.8-11.3 13" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M43 17h6l-6 6h6M50 27h4.6L50 32h4.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M32 55V12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M32 24c-7-1.2-12.2-5.9-14-12 7.2.9 12.2 5.4 14 12ZM32 34c7.4-1.2 12.5-5.9 14.3-12.1-7.4 1-12.4 5.5-14.3 12.1ZM32 43.8c-7.8-1.2-13.5-6-15.6-12.8 7.9 1 13.5 5.8 15.6 12.8ZM32 52c6.2-.9 10.9-4.5 12.8-9.8-6.2.7-10.9 4.4-12.8 9.8Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FocusSprig({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 248 92" fill="none" aria-hidden="true">
      <path d="M8 76C64 71 113 52 164 26C189 13 213 7 240 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      {[
        [56, 61, -34], [68, 58, 31], [87, 51, -32], [101, 47, 29], [121, 39, -31],
        [137, 35, 28], [158, 25, -30], [174, 20, 27], [196, 14, -28], [212, 11, 26],
      ].map(([x, y, rotate]) => (
        <path
          key={`${x}-${y}`}
          d="M0 0C7-4 15-4 22 0C15 5 7 5 0 0Z"
          transform={`translate(${x} ${y}) rotate(${rotate})`}
          stroke="currentColor"
          strokeWidth="1.1"
          fill="none"
        />
      ))}
    </svg>
  );
}

function FocusSpark() {
  return (
    <svg viewBox="0 0 54 54" fill="none" aria-hidden="true">
      <path d="M27 8c2.8 10 8.9 16.1 19 19-10.1 2.9-16.2 9-19 19-2.9-10-9-16.1-19-19 10-2.9 16.1-9 19-19Z" fill="currentColor" />
    </svg>
  );
}

function GlanceMetricIcon({ type }: { type: GlanceIcon }) {
  if (type === "star") {
    return (
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <path d="M32 12l5.8 13.2 14.2 1.4-10.7 9.5 3.1 14-12.4-7.2-12.4 7.2 3.1-14L12 26.6l14.2-1.4L32 12Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type === "trend") {
    return (
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <path d="M13 45l14-14 10 9 15-17" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M42 23h10v10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type === "heart") {
    return (
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <path d="M32 50S15 39.2 15 25.6C15 18.9 19.2 15 24.7 15c3.5 0 6.1 1.7 7.3 4 1.2-2.3 3.8-4 7.3-4C44.8 15 49 18.9 49 25.6 49 39.2 32 50 32 50Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <circle cx="28" cy="28" r="13" stroke="currentColor" strokeWidth="2.2" />
      <path d="M38 38l12 12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function GlanceBranch() {
  const leaves = [
    [70, 72, -62, 1], [88, 62, 42, .85], [111, 48, -58, 1], [132, 38, 42, .9],
    [158, 27, -57, 1.08], [181, 18, 39, .88], [207, 10, -50, .72],
    [132, 95, 34, .75], [154, 84, -45, .82], [177, 72, 35, .75],
  ];

  return (
    <svg className="glance-branch" viewBox="0 0 300 250" fill="none" aria-hidden="true">
      <path className="glance-branch-shadow" d="M20 219C88 171 133 118 178 59C191 42 209 26 238 14" />
      <path d="M17 214C86 168 132 116 176 57C190 38 209 24 239 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {leaves.map(([x, y, rotate, scale]) => (
        <path
          key={`${x}-${y}-${rotate}`}
          d="M0 0C13-8 29-8 42 0C29 10 13 10 0 0Z"
          transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}
          stroke="currentColor"
          strokeWidth="1.5"
          fill="rgba(93, 107, 64, .18)"
        />
      ))}
    </svg>
  );
}

function OpportunityPage({ ebook, opportunityIndex = 0, phonePanel = false }: { ebook: Ebook; opportunityIndex?: number; phonePanel?: boolean }) {
  const opportunities = getBiggestOpportunities(ebook);
  const opportunity = opportunities[Math.min(opportunityIndex, opportunities.length - 1)] || opportunities[0];

  return (
    <section className={`cover ebook-opportunity-page${phonePanel ? " phone-opportunity-panel" : ""}`} id={phonePanel ? `phone-opportunity-${opportunityIndex + 1}` : "biggest-opportunities"} aria-label="Your biggest opportunities">
      <div className="ebook-opportunity-sheet">
        <Image
          src="/ebook/opportunity-botanical.png"
          alt=""
          fill
          sizes="(max-width: 820px) 100vw, min(1086px, 75vw)"
          className="opportunity-artwork"
          aria-hidden="true"
        />
        <div className="opportunity-topline">ZenPlato <span>|</span> 01 Your Story</div>

        <article className="opportunity-copy">
          <div className="opportunity-kicker">Your Biggest Opportunities</div>
          <div className="opportunity-rule opportunity-rule-short" aria-hidden="true" />
          <div className="opportunity-number">{opportunity.number}</div>
          <div className="opportunity-rule opportunity-rule-clay" aria-hidden="true" />
          <h2>
            <span aria-hidden="true">{"{{"}</span>
            {opportunity.title}
            <span aria-hidden="true">{"}}"}</span>
          </h2>
          <div className="opportunity-rule opportunity-rule-green" aria-hidden="true" />
          <div className="opportunity-body">
            {opportunity.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </article>

        <div className="opportunity-visual">
          <Image
            src="/ebook/opportunity-botanical.png"
            alt=""
            width={1086}
            height={1448}
            className="opportunity-mobile-artwork"
            aria-hidden="true"
          />
        </div>

        <div className="opportunity-brand" aria-hidden="true">
          <div>Zen</div>
          <span>Your food intelligence companionship</span>
        </div>

        <div className="opportunity-page-number" aria-hidden="true">08</div>
      </div>
    </section>
  );
}

function SectionDividerLeaf() {
  return (
    <svg className="section-divider-leaf" viewBox="0 0 42 18" fill="none" aria-hidden="true">
      <path d="M4 15C13 12 20 8 27 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M17 9C12 7 9 4 8 1C13 1.4 16 4.2 17 9Z" stroke="currentColor" strokeWidth="1.1" fill="none" />
      <path d="M21 7C23 2.8 26.5 1 31 1C30 5.5 26.2 7.7 21 7Z" stroke="currentColor" strokeWidth="1.1" fill="none" />
      <path d="M13 12C8.5 11.4 5.4 9.4 3 6C7.6 5.8 11 8 13 12Z" stroke="currentColor" strokeWidth="1.1" fill="none" />
      <path d="M25 5C28 3.2 31.2 3.4 35 5.5C31.5 8 28.1 7.9 25 5Z" stroke="currentColor" strokeWidth="1.1" fill="none" />
    </svg>
  );
}

function UnderstandingJourneyPage({ ebook, user }: { ebook: Ebook; user: User | null }) {
  const conditionLabel = getPrimaryConditionLabel(user, ebook);

  return (
    <section className="cover ebook-understanding-page" id="understanding-journey" aria-label={`Understanding your ${conditionLabel} journey`}>
      <div className="ebook-understanding-sheet">
        <Image
          src={getEbookMedia(ebook, "understanding_journey", "/ebook/understanding-pcos-journey.png")}
          alt=""
          fill
          sizes="(max-width: 820px) 100vw, min(1086px, 72vw)"
          className="understanding-photo"
          aria-hidden="true"
        />
        <div className="understanding-wash" aria-hidden="true" />

        <div className="understanding-topline">ZenPlato <span>|</span> 02 Hormonal Rhythms</div>
        <div className="understanding-top-rule" aria-hidden="true" />
        <FocusSprig className="understanding-top-sprig" />

        <div className="understanding-title-block">
          <div className="understanding-section-label">Section 02</div>
          <h2>Understanding<br />Your {conditionLabel} Journey</h2>
          <div className="understanding-divider" aria-hidden="true">
            <i />
            <SectionDividerLeaf />
            <i />
          </div>
        </div>

        <div className="understanding-page-number" aria-hidden="true">11</div>
      </div>
    </section>
  );
}

function UnderstandingGlyph({ type }: { type: UnderstandingIcon }) {
  if (type === "balance") {
    return (
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <path d="M32 13v34" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M20 20h24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M18 20l-9 18h18L18 20Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M46 20l-9 18h18L46 20Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M22 51h20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M26 47h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === "sun") {
    return (
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <path d="M13 41h38" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M18 49h28" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M24 57h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M20 36c2-10 8-16 12-16s10 6 12 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M32 8v7M12 22l5 4M52 22l-5 4M20 12l4 6M44 12l-4 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M32 51V13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M32 24C25 22 21 18 20 12C27 13 31 17 32 24Z" stroke="currentColor" strokeWidth="1.6" fill="none" />
      <path d="M32 32C40 30 45 25 46 18C38 19 33 24 32 32Z" stroke="currentColor" strokeWidth="1.6" fill="none" />
      <path d="M32 40C25 38 20 34 18 27C26 28 31 33 32 40Z" stroke="currentColor" strokeWidth="1.6" fill="none" />
      <path d="M32 47C39 45 44 41 46 35C38 36 33 41 32 47Z" stroke="currentColor" strokeWidth="1.6" fill="none" />
    </svg>
  );
}

function UnderstandingDetailPage({ ebook, user }: { ebook: Ebook; user: User | null }) {
  const conditionLabel = getPrimaryConditionLabel(user, ebook);
  const items = getUnderstandingItems(ebook, user);

  return (
    <section className="cover ebook-understanding-detail-page" id="understanding-pcos" aria-label={`Understanding ${conditionLabel}`}>
      <div className="ebook-understanding-detail-sheet">
        <div className="understanding-detail-image">
          <Image
            src={getEbookMedia(ebook, "understanding_detail", "/ebook/understanding-pcos-detail.png")}
            alt=""
            fill
            sizes="(max-width: 820px) 100vw, min(500px, 36vw)"
            className="understanding-detail-photo"
            aria-hidden="true"
          />
        </div>
        <div className="understanding-detail-photo-wash" aria-hidden="true" />

        <div className="understanding-detail-topline">ZenPlato <span>|</span> 02 Hormonal Rhythms</div>
        <div className="understanding-detail-top-rule" aria-hidden="true" />
        <FocusSprig className="understanding-detail-top-sprig" />

        <article className="understanding-detail-content">
          <h2>Understanding<br />{conditionLabel}</h2>
          <div className="understanding-detail-divider" aria-hidden="true">
            <i />
            <SectionDividerLeaf />
            <i />
          </div>

          <div className="understanding-detail-list">
            {items.map((item) => (
              <section className="understanding-detail-item" key={item.title}>
                <div className="understanding-detail-icon">
                  <UnderstandingGlyph type={item.icon} />
                </div>
                <div className="understanding-detail-dot" aria-hidden="true" />
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </section>
            ))}
          </div>
        </article>

        <div className="understanding-detail-page-number" aria-hidden="true">13</div>
      </div>
    </section>
  );
}

function SymptomFlowGlyph({ type }: { type: SymptomFlowIcon }) {
  if (type === "bloodSugar") {
    return (
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <path d="M28 11C18 24 14 32 14 40c0 8 6 14 14 14s14-6 14-14c0-8-4-16-14-29Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M40 31l10 6v12l-10 6-10-6V37l10-6Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" fill="rgba(246,241,232,.45)" />
        <path d="M30 37l10 6 10-6M40 43v12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === "cravings") {
    return (
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <path d="M18 30c1-8 7-13 14-13s13 5 14 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M17 31h30l-4 22H21l-4-22Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M23 31c0-5 4-9 9-9s9 4 9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M25 38v8M32 38v8M39 38v8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === "daily") {
    return (
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <path d="M21 52v-6c0-6 5-11 11-11s11 5 11 11v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="32" cy="25" r="8" stroke="currentColor" strokeWidth="1.8" />
        <path d="M42 18c2.5-4 7-5 11-2 3 2.5 3 7 0 9.5-2 1.8-5 3-8 5.5-1-3-3.5-4.7-5-7-1.3-2-1-4.3 2-6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M13 42l11-7 11 7v13l-11 7-11-7V42Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" transform="translate(0 -8)" />
      <path d="M32 25l10-6 10 6v12l-10 6-10-6V25Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M35 21l-7-7M48 21l5-9M24 34l8-5M42 43v8M52 24l5-3M52 36l6 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="28" cy="14" r="3" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="53" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function WhySymptomsHappenPage({ ebook }: { ebook: Ebook }) {
  const steps = getSymptomFlowSteps(ebook);
  const takeaway = getSymptomFlowTakeaway(ebook);

  return (
    <section className="cover ebook-symptom-flow-page" id="why-symptoms-happen" aria-label="Why symptoms happen">
      <div className="ebook-symptom-flow-sheet">
        <div className="symptom-flow-media-slot" aria-hidden="true">
          <Image
            src={getEbookMedia(ebook, "symptoms", "/ebook/why-symptoms-happen.png")}
            alt=""
            fill
            sizes="(max-width: 820px) 100vw, min(480px, 36vw)"
            className="symptom-flow-photo"
          />
        </div>

        <div className="symptom-flow-topline">ZenPlato <span>|</span> 02 Hormonal Rhythms</div>
        <div className="symptom-flow-top-rule" aria-hidden="true" />
        <FocusSprig className="symptom-flow-top-sprig" />

        <article className="symptom-flow-content">
          <h2>Why Symptoms<br />Happen</h2>
          <div className="symptom-flow-divider" aria-hidden="true">
            <i />
            <SectionDividerLeaf />
            <i />
          </div>

          <div className="symptom-flow-list">
            {steps.map((step, index) => (
              <section className="symptom-flow-step" key={step.title}>
                <div className="symptom-flow-icon">
                  <SymptomFlowGlyph type={step.icon} />
                </div>
                {index < steps.length - 1 && <div className="symptom-flow-connector" aria-hidden="true" />}
                <div className="symptom-flow-number">{step.number}</div>
                <div className="symptom-flow-step-copy">
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </section>
            ))}
          </div>

          <div className="symptom-flow-takeaway">
            <FocusSprig className="symptom-flow-takeaway-sprig" />
            <p>{takeaway}</p>
          </div>
        </article>

        <div className="symptom-flow-page-number" aria-hidden="true">14</div>
      </div>
    </section>
  );
}

function NutritionInfluenceGlyph({ type }: { type: NutritionInfluenceIcon }) {
  if (type === "cravings") {
    return (
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <path d="M25 49c-8-3-13-9-13-17 0-9 7-16 16-16 7 0 13 5 15 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M29 50c5-2 9-6 11-12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M42 30c5 0 9 4 9 9s-4 9-9 9h-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M25 31c3-2 7-2 10 0M25 38c3 2 7 2 10 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M24 20c-2-5 0-9 5-12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === "balance") {
    return <UnderstandingGlyph type="balance" />;
  }

  if (type === "leaf") {
    return <UnderstandingGlyph type="leaf" />;
  }

  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M35 8L20 34h12l-3 22 16-29H33l2-19Z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
      <path d="M15 32h-5M20 19l-4-4M46 19l4-4M49 32h5M44 46l4 4M18 46l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function NutritionInfluencePage({ ebook }: { ebook: Ebook }) {
  const items = getNutritionInfluenceItems(ebook);
  const takeaway = getNutritionInfluenceTakeaway(ebook);

  return (
    <section className="cover ebook-nutrition-influence-page" id="nutrition-influence" aria-label="What nutrition can influence">
      <div className="ebook-nutrition-influence-sheet">
        <div className="nutrition-influence-media-slot" aria-hidden="true">
          <Image
            src={getEbookMedia(ebook, "nutrition_influence", "/ebook/nutrition-influence.png")}
            alt=""
            fill
            sizes="(max-width: 820px) 100vw, min(440px, 34vw)"
            className="nutrition-influence-photo"
          />
        </div>

        <div className="nutrition-influence-topline">ZenPlato <span>|</span> 02 Hormonal Rhythms</div>
        <div className="nutrition-influence-top-rule" aria-hidden="true" />
        <FocusSprig className="nutrition-influence-top-sprig" />

        <article className="nutrition-influence-content">
          <h2>What Nutrition<br />Can Influence</h2>
          <div className="nutrition-influence-divider" aria-hidden="true">
            <i />
            <SectionDividerLeaf />
            <i />
          </div>

          <div className="nutrition-influence-list">
            {items.map((item, index) => (
              <section className="nutrition-influence-item" key={item.title}>
                <div className="nutrition-influence-icon">
                  <NutritionInfluenceGlyph type={item.icon} />
                </div>
                {index < items.length - 1 && <div className="nutrition-influence-connector" aria-hidden="true" />}
                {index < items.length - 1 && <div className="nutrition-influence-dot" aria-hidden="true" />}
                <div className="nutrition-influence-number">{item.number}</div>
                <div className="nutrition-influence-copy">
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </section>
            ))}
          </div>

          <div className="nutrition-influence-takeaway">
            <FocusSprig className="nutrition-influence-takeaway-sprig" />
            <p>{takeaway}</p>
          </div>
        </article>

        <div className="nutrition-influence-page-number" aria-hidden="true">16</div>
      </div>
    </section>
  );
}

const commonPcosChallenges = [
  {
    title: "Cravings",
    body: "Hormonal fluctuations and blood sugar imbalances can trigger intense cravings, making it hard to stick to healthy choices.",
  },
  {
    title: "Fatigue",
    body: "Low energy, constant tiredness, and brain fog are common with PCOS due to insulin resistance, poor sleep, and hormonal imbalances.",
  },
  {
    title: "Weight Management",
    body: "PCOS can make it harder to lose weight or maintain it, especially around the belly, due to insulin resistance and hormonal factors.",
  },
  {
    title: "Irregular Cycles",
    body: "Irregular or missed periods are a hallmark of PCOS, caused by hormonal imbalances that affect ovulation.",
  },
];

function CommonPcosChallengesPage() {
  return (
    <section className="cover ebook-common-challenges-page" id="common-pcos-challenges" aria-label="Common PCOS challenges">
      <div className="ebook-common-challenges-sheet">
        <Image
          src="/ebook/common-pcos-challenges-bg.png"
          alt=""
          fill
          sizes="(max-width: 820px) 100vw, min(1086px, 75vw)"
          className="common-challenges-artwork"
          aria-hidden="true"
        />

        <div className="common-challenges-topline">ZenPlato <span>|</span> 02 Hormonal Rhythms</div>
        <article className="common-challenges-content">
          <h2 className="common-challenges-heading">Common<br />PCOS Challenges</h2>
          <p className="common-challenges-intro">
            PCOS shows up differently for everyone. These are some of the most common challenges, and you are not alone.
          </p>

          <div className="common-challenges-list">
            {commonPcosChallenges.map((challenge) => (
              <section className="common-challenge-copy" key={challenge.title}>
                <h3>{challenge.title}</h3>
                <p>{challenge.body}</p>
              </section>
            ))}
          </div>
        </article>

        <div className="common-challenges-page-number" aria-hidden="true">19</div>
      </div>
    </section>
  );
}

const zenplatoFrameworkItems = [
  {
    title: "Protein",
    body: "Supports stable blood sugar, reduces cravings, and helps build and repair lean muscle.",
  },
  {
    title: "Fibre",
    body: "Feeds your gut, supports hormone balance, and keeps you feeling full and satisfied longer.",
  },
  {
    title: "Movement",
    body: "Improves insulin sensitivity, lifts your mood, and helps your body function at its best.",
  },
  {
    title: "Recovery",
    body: "Rest, sleep, and stress management are essential for hormone balance and long-term wellbeing.",
  },
];

function ZenplatoFrameworkPage() {
  return (
    <section className="cover ebook-zenplato-framework-page" id="zenplato-framework" aria-label="The ZenPlato framework">
      <div className="ebook-zenplato-framework-sheet">
        <Image
          src="/ebook/zenplato-framework-bg.png"
          alt=""
          fill
          sizes="(max-width: 820px) 100vw, min(1086px, 75vw)"
          className="zenplato-framework-artwork"
          aria-hidden="true"
        />

        <div className="zenplato-framework-topline">ZenPlato <span>|</span> 02 Hormonal Rhythms</div>
        <article className="zenplato-framework-content">
          <h2>The ZenPlato<br />Framework</h2>
          <p className="zenplato-framework-intro">
            A simple, sustainable framework to nourish your body, balance your hormones, and support your PCOS journey, every day.
          </p>

          <div className="zenplato-framework-list">
            {zenplatoFrameworkItems.map((item) => (
              <section className="zenplato-framework-item" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </section>
            ))}
          </div>

          <blockquote className="zenplato-framework-quote">
            Balance isn&rsquo;t about perfection, it&rsquo;s about supporting your body with what it truly needs.
          </blockquote>
        </article>

        <div className="zenplato-framework-page-number" aria-hidden="true">20</div>
      </div>
    </section>
  );
}

function FoodGuideBranch({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 118" fill="none" aria-hidden="true">
      <path d="M13 108C20 82 28 60 40 38C46 26 52 16 57 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M24 81C14 72 9 61 10 48C22 55 28 65 24 81Z" stroke="currentColor" strokeWidth="1.3" fill="rgba(63,82,71,.18)" strokeLinejoin="round" />
      <path d="M31 65C20 56 16 45 18 32C30 39 36 50 31 65Z" stroke="currentColor" strokeWidth="1.3" fill="rgba(63,82,71,.18)" strokeLinejoin="round" />
      <path d="M39 48C29 39 26 29 29 17C40 24 45 34 39 48Z" stroke="currentColor" strokeWidth="1.3" fill="rgba(63,82,71,.18)" strokeLinejoin="round" />
      <path d="M27 78C40 75 49 67 54 55C41 57 31 65 27 78Z" stroke="currentColor" strokeWidth="1.3" fill="rgba(63,82,71,.18)" strokeLinejoin="round" />
      <path d="M34 61C47 58 55 50 59 38C47 40 38 48 34 61Z" stroke="currentColor" strokeWidth="1.3" fill="rgba(63,82,71,.18)" strokeLinejoin="round" />
      <path d="M43 43C53 39 59 31 61 21C51 24 45 31 43 43Z" stroke="currentColor" strokeWidth="1.3" fill="rgba(63,82,71,.18)" strokeLinejoin="round" />
    </svg>
  );
}

function PlateSegmentIcon({ kind }: { kind: PlateSegmentIconName }) {
  if (kind === "fish") {
    return (
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <path d="M12 32c8.5-11.5 23.5-12 35-2.5l7-7v19l-7-7C35.5 44 20.5 43.5 12 32Z" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M34 24c-3.4 4.6-3.4 11.4 0 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="22" cy="30" r="1.7" fill="currentColor" />
        <path d="M10 32H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (kind === "grain") {
    return (
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <path d="M32 54V13" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M31 21C23 20 18 16 16 9c8 1 13 5 15 12Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M33 21c8-1 13-5 15-12-8 1-13 5-15 12Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M31 34c-8-1-13-5-15-12 8 1 13 5 15 12Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M33 34c8-1 13-5 15-12-8 1-13 5-15 12Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M31 47c-8-1-13-5-15-12 8 1 13 5 15 12Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M33 47c8-1 13-5 15-12-8 1-13 5-15 12Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M32 55V14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M31 23C20 21 14 15 13 6c11 2 17 8 18 17Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M33 33c12-1 19-7 21-17-12 1-19 7-21 17Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M31 44c-12-1-19-7-21-17 12 1 19 7 21 17Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M33 50c8-.5 13-4.5 15-12-8 .5-13 4.5-15 12Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function HydrationStepIcon({ kind }: { kind: HydrationStepIconName }) {
  if (kind === "clock") {
    return (
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <circle cx="32" cy="32" r="22" stroke="currentColor" strokeWidth="2.4" />
        <path d="M32 18v15l10 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18 32h-3M49 32h-3M32 15v3M32 49v-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (kind === "drop") {
    return (
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <path d="M32 8c8.8 12 17 21.8 17 32a17 17 0 0 1-34 0C15 29.8 23.2 20 32 8Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M23 42c1.8 5.4 6.3 8.1 12.3 7.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (kind === "sprig") {
    return (
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <path d="M20 53c6-19 14.5-32 28-42" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
        <path d="M27 38c-8-1-14-6-16-14 9 1 15 6 16 14ZM34 27c-7-1-12-6-14-13 8 1 13 6 14 13ZM37 31c9-1 15-6 18-14-9 1-15 6-18 14ZM30 44c8 0 14-4 18-11-8 0-14 4-18 11Z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
      </svg>
    );
  }

  if (kind === "meditation") {
    return (
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <circle cx="32" cy="16" r="6" stroke="currentColor" strokeWidth="2.3" />
        <path d="M32 23v17M22 33c4 4 16 4 20 0M22 46l-10 7h16l4-7 4 7h16l-10-7" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M23 29c-4 2-7 5-9 9M41 29c4 2 7 5 9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M18 16h28l-4 35H22L18 16Z" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M22 30c4-3 8-3 12 0s8 3 12 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 16l2-5h24l2 5" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
    </svg>
  );
}

function HydrationTipIcon({ kind }: { kind: HydrationTipIconName }) {
  if (kind === "cup") {
    return (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <path d="M10 18h22v8c0 7-5 12-11 12S10 33 10 26v-8Z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
        <path d="M32 21h5c2.5 0 4 1.7 4 4s-1.5 4-4 4h-5" stroke="currentColor" strokeWidth="1.9" />
        <path d="M15 12c-1.5-2-1.5-4 0-6M23 12c-1.5-2-1.5-4 0-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    );
  }

  if (kind === "shower") {
    return (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <path d="M15 18c0-5 4-9 9-9s9 4 9 9H15Z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
        <path d="M24 9V5M14 25v2M21 25v2M28 25v2M35 25v2M17 34v2M24 34v2M31 34v2M20 42v1M28 42v1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (kind === "phone") {
    return (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <rect x="14" y="5" width="20" height="38" rx="4" stroke="currentColor" strokeWidth="1.9" />
        <path d="M20 10h8M21 36h6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M24 16c3 3.8 5.5 7 5.5 10.3a5.5 5.5 0 0 1-11 0C18.5 23 21 19.8 24 16Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M18 13h12l3 4v25H15V17l3-4Z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
      <path d="M19 6h10v7H19V6ZM15 25h18" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
      <path d="M20 31h8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function DailyHabitIcon({ kind }: { kind: DailyHabitIconName }) {
  if (kind === "bowl") {
    return (
      <svg viewBox="0 0 56 56" fill="none" aria-hidden="true">
        <path d="M13 28h30c0 8-6.5 14-15 14s-15-6-15-14Z" stroke="currentColor" strokeWidth="2.1" strokeLinejoin="round" />
        <path d="M17 42h22M18 24c3-4 7-6 12-6 3.5 0 6.5 1 9 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M31 14c2-3 5-4.5 9-4.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
        <path d="M36 10c3 1 5 3 6 6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      </svg>
    );
  }

  if (kind === "shoe") {
    return (
      <svg viewBox="0 0 56 56" fill="none" aria-hidden="true">
        <path d="M11 34c5.5 1.8 10.5 1 15-2.5l6.5-5c2.6 4.2 6.7 7.4 12.5 9.5 1.8.6 3 2.2 3 4.1V43H12c-2.2 0-4-1.8-4-4v-3.7c0-1 .9-1.7 1.8-1.4L11 34Z" stroke="currentColor" strokeWidth="2.1" strokeLinejoin="round" />
        <path d="M18 35.5 23 43M25 33.2 31 43M31.5 27l7 10M14 43h34" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (kind === "lotus") {
    return (
      <svg viewBox="0 0 56 56" fill="none" aria-hidden="true">
        <path d="M28 16c6 6 8 12 0 20-8-8-6-14 0-20Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M18 24c7 1 11 5 10 13-8 0-12-5-10-13ZM38 24c-7 1-11 5-10 13 8 0 12-5 10-13Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M11 33c8-1 14 2 17 8-8 3-14 0-17-8ZM45 33c-8-1-14 2-17 8 8 3 14 0 17-8ZM17 44h22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 56 56" fill="none" aria-hidden="true">
      <path d="M21 15h14l3 5v27H18V20l3-5Z" stroke="currentColor" strokeWidth="2.1" strokeLinejoin="round" />
      <path d="M22 8h12v7H22V8ZM18 28h20" stroke="currentColor" strokeWidth="2.1" strokeLinejoin="round" />
      <path d="M24 35h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function RecipeMetaIcon({ kind }: { kind: RecipeMetaIconName }) {
  if (kind === "servings") {
    return (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <circle cx="24" cy="15" r="6" stroke="currentColor" strokeWidth="1.9" />
        <path d="M13 39c1.4-7 5.5-11 11-11s9.6 4 11 11" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      </svg>
    );
  }

  if (kind === "difficulty") {
    return (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <path d="M24 8c-8 8-11 14-11 21 0 6 4.5 11 11 11s11-5 11-11c0-7-3-13-11-21Z" stroke="currentColor" strokeWidth="1.9" />
        <path d="M17 31c6-1 11-4 15-9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx="24" cy="25" r="15" stroke="currentColor" strokeWidth="1.9" />
      <path d="M24 25V14M24 25l8 5M18 5h12M24 5v5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

function RecipeFeatureIcon({ kind }: { kind: RecipeFeatureIconName }) {
  if (kind === "balance") {
    return (
      <svg viewBox="0 0 56 56" fill="none" aria-hidden="true">
        <path d="M28 12v31M17 19h22M20 19l-8 14h16l-8-14ZM36 19l-8 14h16l-8-14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M22 43h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (kind === "energy") {
    return (
      <svg viewBox="0 0 56 56" fill="none" aria-hidden="true">
        <path d="M32 6 17 31h11l-4 19 16-27H29l3-17Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    );
  }

  if (kind === "heart") {
    return (
      <svg viewBox="0 0 56 56" fill="none" aria-hidden="true">
        <path d="M28 44S12 34 12 22c0-5 4-9 9-9 3 0 5.5 1.5 7 4 1.5-2.5 4-4 7-4 5 0 9 4 9 9 0 12-16 22-16 22Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    );
  }

  if (kind === "protein") {
    return (
      <svg viewBox="0 0 56 56" fill="none" aria-hidden="true">
        <path d="M17 28h22M17 21v14M39 21v14M10 25v6M46 25v6M13 22h4v12h-4V22ZM39 22h4v12h-4V22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 56 56" fill="none" aria-hidden="true">
      <path d="M28 47C21 36 18 28 18 20c0-7 4-11 10-11s10 4 10 11c0 8-3 16-10 27Z" stroke="currentColor" strokeWidth="2" />
      <path d="M20 31c8-1 14-5 18-13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function FoodNutritionGuidePage() {
  return (
    <section className="cover ebook-food-guide-page" id="food-nutrition-guide" aria-label="Your food and nutrition guide">
      <div className="ebook-food-guide-sheet">
        <Image
          src="/ebook/food-nutrition-guide-bg.png"
          alt=""
          fill
          sizes="(max-width: 820px) 100vw, min(1055px, 72vw)"
          className="food-guide-photo"
          aria-hidden="true"
        />
        <div className="food-guide-paper-wash" aria-hidden="true" />

        <FoodGuideBranch className="food-guide-top-mark" />
        <div className="food-guide-topline">ZenPlato <span>|</span> 03 Your Food &amp; Nutrition Guide</div>
        <div className="food-guide-top-rule" aria-hidden="true" />

        <article className="food-guide-content">
          <div className="food-guide-section-label">Section 3</div>
          <div className="food-guide-section-rule" aria-hidden="true" />
          <h2>Your Food &amp;<br />Nutrition Guide</h2>
          <div className="food-guide-divider" aria-hidden="true">
            <i />
            <SectionDividerLeaf />
            <i />
          </div>

          <div className="food-guide-meta">
            <div className="food-guide-medallion">
              <FoodGuideBranch className="food-guide-medallion-branch" />
            </div>
            <div className="food-guide-page-count">6 pages</div>
          </div>

          <div className="food-guide-purpose">
            <div className="food-guide-purpose-label">Purpose</div>
            <p>Translate insights into practical nutrition strategies.</p>
          </div>
          <div className="food-guide-bottom-rule" aria-hidden="true" />
        </article>

        <div className="food-guide-page-number" aria-hidden="true">21</div>
      </div>
    </section>
  );
}

function FoodGalleryPage({
  id,
  title,
  intro,
  dynamicKey,
  imageSrc,
  pageNumber,
  items,
  quote,
}: {
  id: string;
  title: string;
  intro: string;
  dynamicKey: string;
  imageSrc: string;
  pageNumber: string;
  items: FoodGalleryItem[];
  quote: string;
}) {
  return (
    <section className="cover ebook-food-gallery-page" id={id} aria-label={title}>
      <div className="ebook-food-gallery-sheet">
        <Image
          src={imageSrc}
          alt=""
          fill
          sizes="(max-width: 820px) 100vw, min(1055px, 72vw)"
          className="food-gallery-photo"
          aria-hidden="true"
        />
        <div className="food-gallery-paper-wash" aria-hidden="true" />

        <div className="food-gallery-topline">ZenPlato <span>|</span> 03 Your Food &amp; Nutrition Guide</div>
        <div className="food-gallery-title">
          <h2>{title}</h2>
          <div className="food-gallery-divider" aria-hidden="true">
            <i />
            <SectionDividerLeaf />
            <i />
          </div>
          <p>{intro}</p>
          <div className="food-gallery-dynamic">
            <FoodGuideBranch className="food-gallery-dynamic-branch" />
            <span>Dynamic: {dynamicKey}</span>
          </div>
        </div>

        <div className="food-gallery-card-copy">
          {items.map((item) => (
            <article className="food-gallery-card-text" key={item.title}>
              {item.imageUrl && (
                <div className="food-gallery-card-image" aria-hidden="true">
                  <Image src={item.imageUrl} alt="" fill sizes="8vw" />
                </div>
              )}
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>

        <div className="food-gallery-quote">
          <p>{quote}</p>
        </div>

        <div className="food-gallery-page-number" aria-hidden="true">{pageNumber}</div>
      </div>
    </section>
  );
}

function FoodsToPrioritizePage({ ebook, plan }: { ebook: Ebook; plan: any }) {
  return (
    <FoodGalleryPage
      id="foods-to-prioritize"
      title="Foods To Prioritize"
      intro="Nourish your body with whole, nutrient-dense foods that support hormonal balance, steady energy, and long-term wellness."
      dynamicKey="{{foods_to_prioritize}}"
      imageSrc="/ebook/foods-to-prioritize-bg.png"
      pageNumber="22"
      items={getFoodsToPrioritize(ebook, plan)}
      quote="Focus on real, whole foods most of the time. Small, consistent choices create lasting change."
    />
  );
}

function FoodsToBeMindfulPage({ ebook, plan }: { ebook: Ebook; plan: any }) {
  return (
    <FoodGalleryPage
      id="foods-to-be-mindful"
      title="Foods To Be More Mindful Of"
      intro={'These foods aren\'t "bad", but they may impact hormone balance, energy, and cravings when consumed too often or in excess.'}
      dynamicKey="{{foods_to_be_mindful_of}}"
      imageSrc="/ebook/foods-to-be-mindful-bg.png"
      pageNumber="23"
      items={getFoodsToBeMindfulOf(ebook, plan)}
      quote="Mindfulness is about balance, not restriction. Enjoy these foods occasionally and choose what supports your body most of the time."
    />
  );
}

function BalancedPlatePage() {
  const segments: Array<{ value: string; title: string; body: string; icon: PlateSegmentIconName }> = [
    {
      value: "50%",
      title: "Vegetables",
      body: "Fill half your plate with non-starchy vegetables for fiber, vitamins, minerals, and antioxidants.",
      icon: "leaf",
    },
    {
      value: "25%",
      title: "Protein",
      body: "Include quality protein to support muscle repair, hormones, and lasting fullness.",
      icon: "fish",
    },
    {
      value: "25%",
      title: "Smart Carbohydrates",
      body: "Choose whole, fiber-rich carbs to fuel your body, balance blood sugar, and support mood.",
      icon: "grain",
    },
  ];

  return (
    <section className="cover ebook-balanced-plate-page" id="balanced-plate" aria-label="The balanced plate">
      <div className="ebook-balanced-plate-sheet">
        <Image
          src="/ebook/balanced-plate-bg.png"
          alt=""
          fill
          sizes="(max-width: 820px) 100vw, min(1055px, 72vw)"
          className="balanced-plate-photo"
          aria-hidden="true"
        />
        <div className="balanced-plate-paper-wash" aria-hidden="true" />

        <FoodGuideBranch className="balanced-plate-top-mark" />
        <div className="balanced-plate-topline">ZenPlato <span>|</span> 03 Your Food &amp; Nutrition Guide</div>
        <div className="balanced-plate-top-rule" aria-hidden="true" />

        <article className="balanced-plate-copy">
          <h2>The<br />Balanced<br />Plate</h2>
          <div className="balanced-plate-divider" aria-hidden="true">
            <i />
            <SectionDividerLeaf />
            <i />
          </div>
          <p className="balanced-plate-intro">
            A simple visual guide to help you build balanced, nourishing meals that support hormone balance, steady energy, and long-term wellness.
          </p>
        </article>

        <div className="balanced-plate-segments">
          {segments.map((segment) => (
            <article className="balanced-plate-segment" key={segment.title}>
              <div className="balanced-plate-icon">
                <PlateSegmentIcon kind={segment.icon} />
              </div>
              <div className="balanced-plate-segment-copy">
                <div className="balanced-plate-value">{segment.value}</div>
                <h3>{segment.title}</h3>
                <p>{segment.body}</p>
              </div>
              <span className="balanced-plate-guide" aria-hidden="true" />
            </article>
          ))}
        </div>

        <div className="balanced-plate-quote">
          <FoodGuideBranch className="balanced-plate-quote-branch" />
          <p>Balance is not about perfection, it&rsquo;s about consistency. Small, mindful choices create lasting changes.</p>
        </div>

        <div className="balanced-plate-page-number" aria-hidden="true">24</div>
      </div>
    </section>
  );
}

function HydrationRecommendationsPage({ ebook }: { ebook: Ebook }) {
  const hydration = getHydrationGuidance(ebook);
  const stepIcons: HydrationStepIconName[] = ["glass", "clock", "drop", "sprig", "meditation"];
  const tipIcons: HydrationTipIconName[] = ["bottle", "cup", "shower", "phone"];

  return (
    <section className="cover ebook-hydration-page" id="hydration-recommendations" aria-label="Hydration recommendations">
      <div className="ebook-hydration-sheet">
        <Image
          src="/ebook/hydration-recommendations-bg.png"
          alt=""
          fill
          sizes="(max-width: 820px) 100vw, min(1055px, 72vw)"
          className="hydration-photo"
          aria-hidden="true"
        />
        <div className="hydration-paper-wash" aria-hidden="true" />

        <FoodGuideBranch className="hydration-top-mark" />
        <div className="hydration-topline">ZenPlato <span>|</span> 03 Your Food &amp; Nutrition Guide</div>
        <div className="hydration-top-rule" aria-hidden="true" />

        <article className="hydration-copy">
          <h2>Hydration<br />Recommendations</h2>
          <div className="hydration-divider" aria-hidden="true">
            <i />
            <SectionDividerLeaf />
            <i />
          </div>
          <p className="hydration-intro">{hydration.intro}</p>
          <div className="hydration-framework-label">Your Hydration Framework</div>
        </article>

        <div className="hydration-steps">
          {hydration.steps.map((step, index) => (
            <article className="hydration-step" key={step.title}>
              <div className="hydration-step-icon">
                <HydrationStepIcon kind={stepIcons[index] || "glass"} />
              </div>
              <div className="hydration-step-copy">
                <h3>{index + 1}. {step.title}</h3>
                <p>{step.body}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="hydration-tips">
          <h3>Additional Tips</h3>
          {hydration.tips.map((tip, index) => (
            <div className="hydration-tip" key={tip}>
              <HydrationTipIcon kind={tipIcons[index] || "bottle"} />
              <p>{tip}</p>
            </div>
          ))}
        </div>

        <div className="hydration-quote">
          <FoodGuideBranch className="hydration-quote-branch" />
          <p>{hydration.quote}</p>
        </div>

        <div className="hydration-page-number" aria-hidden="true">25</div>
      </div>
    </section>
  );
}

function MealTimingGuidancePage({ ebook }: { ebook: Ebook }) {
  const mealTiming = getMealTimingGuidance(ebook);

  return (
    <section className="cover ebook-meal-timing-page" id="meal-timing-guidance" aria-label="Meal timing guidance">
      <div className="ebook-meal-timing-sheet">
        <Image
          src="/ebook/meal-timing-bg.png"
          alt=""
          fill
          sizes="(max-width: 820px) 100vw, min(1054px, 72vw)"
          className="meal-timing-photo"
          aria-hidden="true"
        />
        <div className="meal-timing-paper-wash" aria-hidden="true" />

        <div className="meal-timing-topline">ZenPlato <span>|</span> 03 Your Food &amp; Nutrition Guide</div>

        <article className="meal-timing-copy">
          <h2>Meal Timing<br />Guidance</h2>
          <div className="meal-timing-divider" aria-hidden="true">
            <i />
            <SectionDividerLeaf />
            <i />
          </div>
          <p>{mealTiming.intro}</p>
        </article>

        <div className="meal-timing-timeline-label">Daily Nutrition Timeline</div>
        <div className="meal-timing-entries">
          {mealTiming.entries.map((entry) => (
            <article className="meal-timing-entry" key={entry.title}>
              <div className="meal-timing-time">{entry.time}</div>
              <h3>{entry.title}</h3>
              <p>{entry.body}</p>
            </article>
          ))}
        </div>

        <div className="meal-timing-consistency">
          <h3>{mealTiming.consistencyTitle}</h3>
          <p>{mealTiming.consistencyBody}</p>
        </div>

        <div className="meal-timing-page-number" aria-hidden="true">26</div>
      </div>
    </section>
  );
}

function SustainableRhythmPage({ ebook }: { ebook: Ebook }) {
  const mealTiming = getMealTimingGuidance(ebook);
  const eveningEntries = mealTiming.entries.slice(3, 5);

  return (
    <section className="cover ebook-sustainable-rhythm-page" id="sustainable-rhythm" aria-label="Building a sustainable rhythm">
      <div className="ebook-sustainable-rhythm-sheet">
        <Image
          src="/ebook/sustainable-rhythm-bg.png"
          alt=""
          fill
          sizes="(max-width: 820px) 100vw, min(1054px, 72vw)"
          className="sustainable-rhythm-photo"
          aria-hidden="true"
        />
        <div className="sustainable-rhythm-paper-wash" aria-hidden="true" />

        <div className="sustainable-rhythm-topline">ZenPlato <span>|</span> 03 Your Food &amp; Nutrition Guide</div>

        <article className="sustainable-rhythm-copy">
          <h2>Building a<br />Sustainable Rhythm</h2>
          <div className="sustainable-rhythm-divider" aria-hidden="true">
            <i />
            <SectionDividerLeaf />
            <i />
          </div>
          <p>Your body thrives on rhythm and routine. When you nourish yourself consistently, you create a foundation for balance, energy, and long-term wellness.</p>
        </article>

        <div className="sustainable-rhythm-entries">
          {eveningEntries.map((entry) => (
            <article className="sustainable-rhythm-entry" key={entry.title}>
              <div className="sustainable-rhythm-time">{entry.time}</div>
              <h3>{entry.title}</h3>
              <p>{entry.body}</p>
            </article>
          ))}
        </div>

        <div className="sustainable-rhythm-consistency">
          <h3>{mealTiming.consistencyTitle}</h3>
          <p>{mealTiming.consistencyBody}</p>
        </div>

        <div className="sustainable-rhythm-quote">
          <p>{mealTiming.quote}</p>
        </div>

        <div className="sustainable-rhythm-page-number" aria-hidden="true">27</div>
      </div>
    </section>
  );
}

function SmartSwapTextCard({ item, index, className = "" }: { item: FoodSwapItem; index: number; className?: string }) {
  return (
    <article className={`smart-swap-text-card ${className}`}>
      <div className="smart-swap-number">{String(index + 1).padStart(2, "0")}</div>
      <div className="smart-swap-before">
        <div className="smart-swap-label">Before</div>
        <h3>{item.beforeTitle}</h3>
        <p>{item.beforeBody}</p>
      </div>
      <div className="smart-swap-after">
        <div className="smart-swap-label">After</div>
        <h3>{item.afterTitle}</h3>
        <p>{item.afterBody}</p>
      </div>
    </article>
  );
}

function SmartFoodSwapsPage({ ebook }: { ebook: Ebook }) {
  const foodSwaps = getFoodSwaps(ebook);
  const firstSwaps = foodSwaps.swaps.slice(0, 2);

  return (
    <section className="cover ebook-smart-food-swaps-page" id="smart-food-swaps" aria-label="Smart food swaps">
      <div className="ebook-smart-food-swaps-sheet">
        <Image
          src="/ebook/smart-food-swaps-bg.png"
          alt=""
          fill
          sizes="(max-width: 820px) 100vw, min(1054px, 72vw)"
          className="smart-food-swaps-photo"
          aria-hidden="true"
        />
        <div className="smart-food-swaps-paper-wash" aria-hidden="true" />

        <div className="smart-food-swaps-topline">ZenPlato <span>|</span> 03 Your Food &amp; Nutrition Guide</div>

        <article className="smart-food-swaps-copy">
          <h2>Smart<br />Food Swaps</h2>
          <div className="smart-food-swaps-divider" aria-hidden="true">
            <i />
            <SectionDividerLeaf />
            <i />
          </div>
          <p>{foodSwaps.intro}</p>
          <div className="smart-food-swaps-dynamic">
            <span>Dynamic: {'{{food_swaps}}'}</span>
          </div>
        </article>

        <div className="smart-food-swaps-cards">
          {firstSwaps.map((swap, index) => (
            <SmartSwapTextCard item={swap} index={index} key={`${swap.beforeTitle}-${swap.afterTitle}`} />
          ))}
        </div>

        <div className="smart-food-swaps-page-number" aria-hidden="true">28</div>
      </div>
    </section>
  );
}

function SmartSwapsContinuedPage({ ebook }: { ebook: Ebook }) {
  const foodSwaps = getFoodSwaps(ebook);
  const continuedSwaps = foodSwaps.swaps.slice(2, 4);

  return (
    <section className="cover ebook-smart-swaps-continued-page" id="smart-swaps-continued" aria-label="Smart food swaps continued">
      <div className="ebook-smart-swaps-continued-sheet">
        <Image
          src="/ebook/smart-swaps-continued-bg.png"
          alt=""
          fill
          sizes="(max-width: 820px) 100vw, min(1055px, 72vw)"
          className="smart-swaps-continued-photo"
          aria-hidden="true"
        />
        <div className="smart-swaps-continued-paper-wash" aria-hidden="true" />

        <div className="smart-swaps-continued-topline">ZenPlato <span>|</span> 03 Your Food &amp; Nutrition Guide</div>

        <div className="smart-swaps-continued-cards">
          {continuedSwaps.map((swap, index) => (
            <SmartSwapTextCard item={swap} index={index + 2} key={`${swap.beforeTitle}-${swap.afterTitle}`} />
          ))}
        </div>

        <div className="smart-swaps-continued-quote">
          <p>{foodSwaps.quote}</p>
        </div>

        <div className="smart-swaps-continued-page-number" aria-hidden="true">29</div>
      </div>
    </section>
  );
}

function LifestyleFoundationPage() {
  return (
    <section className="cover ebook-lifestyle-foundation-page" id="lifestyle-foundation" aria-label="Your lifestyle foundation">
      <div className="ebook-lifestyle-foundation-sheet">
        <Image
          src="/ebook/lifestyle-foundation-bg.png"
          alt=""
          fill
          sizes="(max-width: 820px) 100vw, min(1055px, 72vw)"
          className="lifestyle-foundation-photo"
          aria-hidden="true"
        />
        <div className="lifestyle-foundation-paper-wash" aria-hidden="true" />

        <div className="lifestyle-foundation-topline">ZenPlato <span>|</span> 04 Your Lifestyle Foundation</div>

        <article className="lifestyle-foundation-content">
          <div className="lifestyle-foundation-section-label">Section</div>
          <div className="lifestyle-foundation-number">04</div>
          <div className="lifestyle-foundation-divider" aria-hidden="true">
            <i />
            <SectionDividerLeaf />
            <i />
          </div>
          <h2>Your Lifestyle<br />Foundation</h2>
          <p className="lifestyle-foundation-body">
            True healing happens when daily choices support your body, mind, and hormones. This section is about building a lifestyle that feels good, is sustainable, and helps you thrive-inside and out.
          </p>
        </article>

        <div className="lifestyle-foundation-badge">
          Balance is built, not found. One choice at a time.
        </div>

        <div className="lifestyle-foundation-page-number" aria-hidden="true">30</div>
      </div>
    </section>
  );
}

function SleepRecoveryPage() {
  const sleepItems = [
    {
      title: "Sleep And Energy",
      body: "Good sleep restores your body and balance your hormones, helping you wake up refreshed and stay energized all day.",
    },
    {
      title: "Sleep And Cravings",
      body: "Poor sleep increases hunger hormones and cravings, especially for sugar and carbs. Better sleep helps you make better choices.",
    },
    {
      title: "Recovery Habits",
      body: "Gentle movement, stretching, breathwork, and downtime support your nervous system and reduce stress, helping your body heal and reset.",
    },
  ];

  return (
    <section className="cover ebook-sleep-recovery-page" id="sleep-recovery" aria-label="Sleep and recovery">
      <div className="ebook-sleep-recovery-sheet">
        <Image
          src="/ebook/sleep-recovery-bg.png"
          alt=""
          fill
          sizes="(max-width: 820px) 100vw, min(1054px, 72vw)"
          className="sleep-recovery-photo"
          aria-hidden="true"
        />
        <div className="sleep-recovery-paper-wash" aria-hidden="true" />

        <div className="sleep-recovery-topline">ZenPlato <span>|</span> 04 Your Lifestyle Foundation</div>

        <article className="sleep-recovery-copy">
          <h2>Sleep &amp;<br />Recovery</h2>
          <div className="sleep-recovery-divider" aria-hidden="true">
            <i />
            <SectionDividerLeaf />
            <i />
          </div>
          <p className="sleep-recovery-intro">
            Sleep is the foundation of healing, hormone balance, and emotional wellbeing. Your body repairs, restores, and resets while you rest.
          </p>
        </article>

        <div className="sleep-recovery-items">
          {sleepItems.map((item) => (
            <article className="sleep-recovery-item" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>

        <div className="sleep-recovery-quote">
          <p>Rest isn&rsquo;t lazy. It&rsquo;s part of your healing.</p>
        </div>

        <div className="sleep-recovery-page-number" aria-hidden="true">32</div>
      </div>
    </section>
  );
}

function StressWellbeingPage({ ebook }: { ebook: Ebook }) {
  const cycleCards = [
    {
      title: "Stress \u2191",
      body: "Triggers cortisol and throws hormones off balance.",
    },
    {
      title: "Food Choices \u2193",
      body: "Leads to more cravings, emotional eating, and poor food choices.",
    },
    {
      title: "Energy \u2193",
      body: "Causes fatigue, mood swings, and low motivation.",
    },
    {
      title: "Consistency \u2193",
      body: "Makes it harder to stick to healthy habits and create lasting change.",
    },
  ];

  return (
    <section className="cover ebook-stress-wellbeing-page" id="stress-wellbeing" aria-label="Stress and wellbeing">
      <div className="ebook-stress-wellbeing-sheet">
        <Image
          src="/ebook/stress-wellbeing-bg.png"
          alt=""
          fill
          sizes="(max-width: 820px) 100vw, min(1054px, 72vw)"
          className="stress-wellbeing-photo"
          aria-hidden="true"
        />
        <div className="stress-wellbeing-paper-wash" aria-hidden="true" />

        <div className="stress-wellbeing-topline">ZenPlato <span>|</span> 04 Your Lifestyle Foundation</div>

        <article className="stress-wellbeing-copy">
          <h2>Stress &amp;<br />Wellbeing</h2>
          <div className="stress-wellbeing-divider" aria-hidden="true">
            <i />
            <SectionDividerLeaf />
            <i />
          </div>
          <p className="stress-wellbeing-intro">
            Stress affects hormones, blood sugar, digestion, sleep, and cravings. When stress stays high, your body shifts into survival mode-making healthy habits feel harder.
          </p>
        </article>

        <div className="stress-cycle-label">The Stress Impact Cycle</div>
        <div className="stress-cycle-cards">
          {cycleCards.map((card) => (
            <article className="stress-cycle-card" key={card.title}>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </article>
          ))}
        </div>

        <div className="stress-insight-box">
          <p><strong>Insight:</strong> {getStressInsight(ebook)}</p>
        </div>

        <div className="stress-wellbeing-quote">
          <p>When you manage stress, you protect your energy, your choices, and your future.</p>
        </div>

        <div className="stress-wellbeing-page-number" aria-hidden="true">33</div>
      </div>
    </section>
  );
}

function DailyWellnessHabitsPage({ ebook }: { ebook: Ebook }) {
  const dailyHabits = getDailyHabits(ebook);

  return (
    <section className="cover ebook-daily-wellness-page" id="daily-wellness-habits" aria-label="Daily wellness habits">
      <div className="ebook-daily-wellness-sheet">
        <Image
          src="/ebook/daily-wellness-bg.png"
          alt=""
          fill
          sizes="(max-width: 820px) 100vw, min(1055px, 72vw)"
          className="daily-wellness-photo"
          aria-hidden="true"
        />
        <div className="daily-wellness-paper-wash" aria-hidden="true" />

        <div className="daily-wellness-topline">ZenPlato <span>|</span> 04 Your Lifestyle Foundation</div>

        <article className="daily-wellness-copy">
          <h2>Daily<br />Wellness<br />Habits</h2>
          <div className="daily-wellness-divider" aria-hidden="true">
            <i />
            <SectionDividerLeaf />
            <i />
          </div>
          <p className="daily-wellness-intro">
            Small, repeatable habits help your body feel safe, supported, and consistent. Focus on simple daily anchors that are easy to return to.
          </p>
          <div className="daily-wellness-dynamic">
            <span>Dynamic: {'{{daily_habits}}'}</span>
          </div>
        </article>

        <div className="daily-wellness-cards">
          {dailyHabits.map((habit, index) => (
            <article className="daily-wellness-card" key={habit.title}>
              <div className="daily-wellness-card-number">{String(index + 1).padStart(2, "0")}</div>
              <div className="daily-wellness-card-icon">
                <DailyHabitIcon kind={habit.icon} />
              </div>
              <h3>{habit.title}</h3>
              <p>{habit.body}</p>
            </article>
          ))}
        </div>

        <div className="daily-wellness-page-number" aria-hidden="true">34</div>
      </div>
    </section>
  );
}

function PerfectionConsistencyPage() {
  return (
    <section className="cover ebook-perfection-consistency-page" id="perfection-consistency" aria-label="Perfection is not required, consistency is">
      <div className="ebook-perfection-consistency-sheet">
        <Image
          src="/ebook/perfection-consistency-bg.png"
          alt=""
          fill
          sizes="(max-width: 820px) 100vw, min(1086px, 72vw)"
          className="perfection-consistency-photo"
          aria-hidden="true"
        />
        <div className="perfection-consistency-paper-wash" aria-hidden="true" />

        <div className="perfection-consistency-topline">ZenPlato <span>|</span> 04 Your Lifestyle Foundation</div>

        <article className="perfection-consistency-copy">
          <h2>Perfection Is<br />Not Required.<br /><em>Consistency Is.</em></h2>
          <div className="perfection-consistency-divider" aria-hidden="true">
            <i />
            <SectionDividerLeaf />
            <i />
          </div>
          <p className="perfection-consistency-body">
            It&rsquo;s the small, everyday choices you keep showing up for that create real change-physically, mentally, and emotionally.
          </p>
        </article>

        <div className="perfection-consistency-badge">
          Keep going. You&rsquo;re building something powerful.
        </div>

        <div className="perfection-consistency-page-number" aria-hidden="true">35</div>
      </div>
    </section>
  );
}

function RecipeCollectionSectionPage() {
  return (
    <section className="cover ebook-recipe-section-page" id="recipe-collection-section" aria-label="Your personalized recipe collection">
      <div className="ebook-recipe-section-sheet">
        <Image
          src="/ebook/recipe-collection-section-bg.png"
          alt=""
          fill
          sizes="(max-width: 820px) 100vw, min(1086px, 72vw)"
          className="recipe-section-photo"
          aria-hidden="true"
        />
        <div className="recipe-section-paper-wash" aria-hidden="true" />

        <FoodGuideBranch className="recipe-section-top-mark" />
        <div className="recipe-section-topline">ZenPlato <span>|</span> 05 Your Personalized Recipe Collection</div>
        <div className="recipe-section-top-rule" aria-hidden="true" />

        <article className="recipe-section-content">
          <div className="recipe-section-label">Section</div>
          <div className="recipe-section-number">05</div>
          <div className="recipe-section-divider" aria-hidden="true">
            <i />
            <SectionDividerLeaf />
            <i />
          </div>
          <h2>Your<br />Personalized<br />Recipe<br />Collection</h2>
          <p>
            Good food should feel nourishing, satisfying, and simple to prepare. These recipes are designed to support your hormones, energy, and overall wellbeing-without sacrifice or restriction.
          </p>
        </article>

        <div className="recipe-section-badge">
          <div className="recipe-section-badge-icon"><FoodGuideBranch /></div>
          <p>Real ingredients.<br />Real nourishment. Real you.</p>
        </div>

        <div className="recipe-section-page-number" aria-hidden="true">36</div>
      </div>
    </section>
  );
}

function RecipeCollectionIntroPage({ ebook }: { ebook: Ebook }) {
  const features: Array<{ label: string; icon: RecipeFeatureIconName }> = [
    { label: "Whole Ingredients", icon: "leaf" },
    { label: "Hormone Balancing", icon: "balance" },
    { label: "Sustained Energy", icon: "energy" },
    { label: "Nourishing & Delicious", icon: "heart" },
  ];

  return (
    <section className="cover ebook-recipe-intro-page" id="recipe-collection-intro" aria-label="Recipe collection introduction">
      <div className="ebook-recipe-intro-sheet">
        <Image
          src="/ebook/recipe-collection-intro-bg.png"
          alt=""
          fill
          sizes="(max-width: 820px) 100vw, min(1086px, 72vw)"
          className="recipe-intro-photo"
          aria-hidden="true"
        />
        <div className="recipe-intro-paper-wash" aria-hidden="true" />

        <FoodGuideBranch className="recipe-intro-top-mark" />
        <div className="recipe-intro-topline">ZenPlato <span>|</span> 05 Your Personalized Recipe Collection</div>
        <div className="recipe-intro-top-rule" aria-hidden="true" />

        <article className="recipe-intro-copy">
          <div className="recipe-intro-kicker">Welcome To</div>
          <h2>Your<br />Personalized<br />Recipe<br />Collection</h2>
          <div className="recipe-intro-divider" aria-hidden="true">
            <i />
            <SectionDividerLeaf />
            <i />
          </div>
          <p>
            Every recipe in this collection is crafted with your unique needs in mind-balancing hormones, supporting energy, and making healthy eating simple and enjoyable.
          </p>
          <p>
            These meals focus on whole ingredients, balanced nutrients, and delicious flavors to help you feel your best every day.
          </p>
        </article>

        <div className="recipe-intro-dynamic">
          <div className="recipe-intro-dynamic-icon"><FoodGuideBranch /></div>
          <div>
            <h3>Dynamic Insight</h3>
            <p>{getRecipeCollectionIntro(ebook)}</p>
          </div>
        </div>

        <div className="recipe-intro-features">
          {features.map((feature) => (
            <div className="recipe-intro-feature" key={feature.label}>
              <div className="recipe-intro-feature-icon">
                <RecipeFeatureIcon kind={feature.icon} />
              </div>
              <span>{feature.label}</span>
            </div>
          ))}
        </div>

        <div className="recipe-intro-footer">
          <FoodGuideBranch />
          <span>Nourish your body. Support your hormones. Enjoy the journey.</span>
        </div>

        <div className="recipe-intro-page-number" aria-hidden="true">37</div>
      </div>
    </section>
  );
}

function BreakfastsPage({ ebook }: { ebook: Ebook }) {
  const recipe = getBreakfastRecipes(ebook)[0];
  const meta: Array<{ label: string; value: string; icon: RecipeMetaIconName }> = [
    { label: "Preparation Time", value: recipe.prepTime, icon: "time" },
    { label: "Servings", value: recipe.servings, icon: "servings" },
    { label: "Difficulty", value: recipe.difficulty, icon: "difficulty" },
  ];

  return (
    <section className="cover ebook-breakfasts-page" id="building-better-breakfasts" aria-label="Building better breakfasts">
      <div className="ebook-breakfasts-sheet">
        <Image
          src="/ebook/breakfasts-bg.png"
          alt=""
          fill
          sizes="(max-width: 820px) 100vw, min(1024px, 72vw)"
          className="breakfasts-photo"
          aria-hidden="true"
        />
        <div className="breakfasts-paper-wash" aria-hidden="true" />

        <FoodGuideBranch className="breakfasts-top-mark" />
        <div className="breakfasts-topline">ZenPlato <span>|</span> 05 Your Personalized Recipe Collection</div>
        <div className="breakfasts-top-rule" aria-hidden="true" />

        <article className="breakfasts-copy">
          <div className="breakfasts-kicker">Building Better</div>
          <h2>Breakfasts</h2>
          <div className="breakfasts-divider" aria-hidden="true">
            <i />
            <SectionDividerLeaf />
            <i />
          </div>
          <p className="breakfasts-lead">Start your day with balance.</p>
          <p className="breakfasts-intro">{recipe.subtitle}</p>
        </article>

        <div className="breakfasts-meta">
          {meta.map((item) => (
            <div className="breakfasts-meta-item" key={item.label}>
              <RecipeMetaIcon kind={item.icon} />
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>

        <section className="breakfasts-ingredients" aria-label="Breakfast ingredients">
          <h3>Ingredients</h3>
          <i aria-hidden="true" />
          <ul>
            {recipe.ingredients.map((ingredient) => (
              <li key={ingredient}>{ingredient}</li>
            ))}
          </ul>
          <div className="breakfasts-make-yours">
            <FoodGuideBranch />
            <div>
              <h4>{recipe.makeItYoursTitle}</h4>
              <p>{recipe.makeItYoursBody}</p>
            </div>
          </div>
        </section>

        <section className="breakfasts-method" aria-label="Breakfast method">
          <h3>Method</h3>
          <i aria-hidden="true" />
          {recipe.method.slice(0, 5).map((step, index) => (
            <article className="breakfasts-method-step" key={`${index}-${step.body}`}>
              <span>{index + 1}</span>
              <p>{step.body}</p>
            </article>
          ))}
        </section>

        <section className="breakfasts-highlights" aria-label="Breakfast nutrition highlights">
          <h3>Nutrition Highlights</h3>
          <i aria-hidden="true" />
          {recipe.nutritionHighlights.map((highlight) => (
            <article className="breakfasts-highlight" key={highlight.title}>
              <div className="breakfasts-highlight-icon">
                <RecipeFeatureIcon kind={highlight.icon} />
              </div>
              <div>
                <h4>{highlight.title}</h4>
                <p>{highlight.body}</p>
              </div>
            </article>
          ))}
        </section>

        <div className="breakfasts-page-number" aria-hidden="true">38</div>
      </div>
    </section>
  );
}

function BreakfastNutritionPage({ ebook }: { ebook: Ebook }) {
  const recipe = getBreakfastRecipes(ebook)[1] || getBreakfastRecipes(ebook)[0];
  const meta: Array<{ label: string; value: string; icon: RecipeMetaIconName }> = [
    { label: "Preparation Time", value: recipe.prepTime, icon: "time" },
    { label: "Servings", value: recipe.servings, icon: "servings" },
    { label: "Difficulty", value: recipe.difficulty, icon: "difficulty" },
  ];

  return (
    <section className="cover ebook-breakfast-nutrition-page" id="breakfast-nutrition" aria-label="Breakfast nutrition highlights">
      <div className="ebook-breakfast-nutrition-sheet">
        <Image
          src="/ebook/breakfast-nutrition-bg.png"
          alt=""
          fill
          sizes="(max-width: 820px) 100vw, min(1055px, 72vw)"
          className="breakfast-nutrition-photo"
          aria-hidden="true"
        />
        <div className="breakfast-nutrition-paper-wash" aria-hidden="true" />

        <FoodGuideBranch className="breakfast-nutrition-top-mark" />
        <div className="breakfast-nutrition-topline">ZenPlato <span>|</span> 05 Your Personalized Recipe Collection</div>
        <div className="breakfast-nutrition-top-rule" aria-hidden="true" />

        <article className="breakfast-nutrition-copy">
          <div className="breakfast-nutrition-kicker">Building Better</div>
          <div className="breakfast-nutrition-kicker-rule" aria-hidden="true">
            <SectionDividerLeaf />
            <i />
          </div>
          <h2>{recipe.name}</h2>
          <p>{recipe.subtitle}</p>
        </article>

        <div className="breakfast-nutrition-meta">
          {meta.map((item) => (
            <div className="breakfast-nutrition-meta-item" key={item.label}>
              <RecipeMetaIcon kind={item.icon} />
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>

        <section className="breakfast-protein-card" aria-label="Protein summary">
          <div className="breakfast-protein-icon">
            <RecipeFeatureIcon kind="protein" />
          </div>
          <h3>{recipe.proteinSummaryTitle}</h3>
          <p>{recipe.proteinSummaryBody}</p>
        </section>

        <section className="breakfast-nutrition-table" aria-label="Protein source nutrition table">
          <h3>Nutrition Highlights</h3>
          <div className="breakfast-nutrition-table-divider" aria-hidden="true">
            <i />
            <SectionDividerLeaf />
            <i />
          </div>
          <div className="breakfast-nutrition-table-head">
            <span>Ingredient (Protein Source)</span>
            <span>Amount Per Serving</span>
          </div>
          {recipe.nutritionBreakdown.map((item) => (
            <div className="breakfast-nutrition-row" key={item.ingredient}>
              <span>{item.ingredient}</span>
              <strong>{item.amount}</strong>
            </div>
          ))}
          <div className="breakfast-nutrition-total">
            <span>Total Protein</span>
            <strong>{recipe.totalProtein}</strong>
          </div>
        </section>

        <div className="breakfast-nutrition-page-number" aria-hidden="true">39</div>
      </div>
    </section>
  );
}

function splitIngredientLabel(ingredient: string) {
  const amountMatch = ingredient.match(/^([\d./\s]+(?:cup|cups|tsp|tbsp|g|oz|ml|pinch|scoop|slices?)?)\s+(.+)$/i);
  if (!amountMatch) return { amount: "", name: ingredient };
  return {
    amount: amountMatch[1].trim(),
    name: amountMatch[2].trim(),
  };
}

function BreakfastBenefitsPage({ ebook }: { ebook: Ebook }) {
  const recipe = getBreakfastRecipes(ebook)[1] || getBreakfastRecipes(ebook)[0];

  return (
    <section className="cover ebook-breakfast-benefits-page" id="breakfast-benefits" aria-label="What this breakfast bowl does for you">
      <div className="ebook-breakfast-benefits-sheet">
        <Image
          src="/ebook/breakfast-benefits-bg.png"
          alt=""
          fill
          sizes="(max-width: 820px) 100vw, min(1055px, 72vw)"
          className="breakfast-benefits-photo"
          aria-hidden="true"
        />
        <div className="breakfast-benefits-paper-wash" aria-hidden="true" />

        <FoodGuideBranch className="breakfast-benefits-top-mark" />
        <div className="breakfast-benefits-topline">ZenPlato <span>|</span> 05 Your Personalized Recipe Collection</div>
        <div className="breakfast-benefits-top-rule" aria-hidden="true" />

        <article className="breakfast-benefits-copy">
          <div className="breakfast-benefits-kicker">Beyond Nutrition</div>
          <div className="breakfast-benefits-kicker-rule" aria-hidden="true">
            <SectionDividerLeaf />
            <i />
          </div>
          <h2>What This Bowl<br />Does For You</h2>
          <p>More than just a meal - this bowl nourishes your body, balances your hormones, and supports your everyday well-being.</p>
        </article>

        <div className="breakfast-benefits-cards">
          {recipe.benefits.slice(0, 6).map((benefit) => (
            <article className="breakfast-benefit-card" key={benefit.title}>
              <div className="breakfast-benefit-icon">
                <RecipeFeatureIcon kind={benefit.icon} />
              </div>
              <h3>{benefit.title}</h3>
              <p>{benefit.body}</p>
              <i aria-hidden="true" />
            </article>
          ))}
        </div>

        <div className="breakfast-benefits-footer">
          <div className="breakfast-benefits-footer-icon">
            <RecipeFeatureIcon kind="leaf" />
          </div>
          <div>
            <h3>Nourish. Balance. Thrive.</h3>
            <p>Small choices today, lasting changes tomorrow.</p>
          </div>
          <RecipeFeatureIcon kind="leaf" />
        </div>

        <div className="breakfast-benefits-page-number" aria-hidden="true">40</div>
      </div>
    </section>
  );
}

function BreakfastIngredientsMethodPage({ ebook }: { ebook: Ebook }) {
  const recipe = getBreakfastRecipes(ebook)[1] || getBreakfastRecipes(ebook)[0];
  const ingredients = recipe.ingredients.slice(0, 8).map(splitIngredientLabel);
  const method = recipe.method.slice(0, 4);

  return (
    <section className="cover ebook-breakfast-ingredients-method-page" id="breakfast-ingredients-method" aria-label="Breakfast ingredients and method">
      <div className="ebook-breakfast-ingredients-method-sheet">
        <Image
          src="/ebook/breakfast-ingredients-method-bg.png"
          alt=""
          fill
          sizes="(max-width: 820px) 100vw, min(1055px, 72vw)"
          className="breakfast-ingredients-method-photo"
          aria-hidden="true"
        />
        <div className="breakfast-ingredients-method-paper-wash" aria-hidden="true" />

        <FoodGuideBranch className="breakfast-ingredients-method-left-mark" />
        <div className="breakfast-ingredients-method-left-topline">ZenPlato <span>|</span> 05 Your Personalized Recipe Collection</div>
        <FoodGuideBranch className="breakfast-ingredients-method-right-mark" />
        <div className="breakfast-ingredients-method-right-topline">ZenPlato <span>|</span> 05 Your Personalized Recipe Collection</div>

        <article className="breakfast-ingredients-copy">
          <div className="breakfast-ingredients-recipe-name">{recipe.name}</div>
          <h2>Ingredients</h2>
          <div className="breakfast-ingredients-divider" aria-hidden="true">
            <i />
            <SectionDividerLeaf />
            <i />
          </div>
        </article>

        <div className="breakfast-ingredient-labels">
          {ingredients.map((ingredient, index) => (
            <div className="breakfast-ingredient-label" key={`${ingredient.name}-${index}`}>
              {ingredient.amount && <span>{ingredient.amount}</span>}
              <strong>{ingredient.name}</strong>
            </div>
          ))}
        </div>

        <div className="breakfast-ingredients-tip">
          <div className="breakfast-ingredients-tip-icon">
            <RecipeFeatureIcon kind="leaf" />
          </div>
          <div>
            <h3>{recipe.makeItYoursTitle}</h3>
            <p>{recipe.makeItYoursBody}</p>
          </div>
        </div>

        <article className="breakfast-method-spread-copy">
          <div className="breakfast-method-spread-recipe-name">{recipe.name}</div>
          <h2>Method</h2>
          <div className="breakfast-method-spread-divider" aria-hidden="true">
            <i />
            <SectionDividerLeaf />
            <i />
          </div>
        </article>

        <div className="breakfast-method-spread-steps">
          {method.map((step, index) => (
            <article className="breakfast-method-spread-step" key={`${index}-${step.body}`}>
              <span>{index + 1}</span>
              <p>{step.body}</p>
            </article>
          ))}
        </div>

        <div className="breakfast-method-spread-tip">
          <div className="breakfast-method-spread-tip-icon">
            <RecipeFeatureIcon kind="leaf" />
          </div>
          <div>
            <h3>Make It Yours</h3>
            <p>Add a spoon of nut butter or a sprinkle of hemp seeds for extra protein and healthy fats.</p>
          </div>
        </div>

        <div className="breakfast-ingredients-method-page-number" aria-hidden="true">41</div>
      </div>
    </section>
  );
}

function BreakfastMethodCookingPage({ ebook }: { ebook: Ebook }) {
  const recipe = getBreakfastRecipes(ebook)[1] || getBreakfastRecipes(ebook)[0];

  return (
    <section className="cover ebook-breakfast-method-cooking-page" id="breakfast-method-cooking" aria-label="Breakfast method of cooking">
      <div className="ebook-breakfast-method-cooking-sheet">
        <Image
          src="/ebook/breakfast-method-cooking-bg.png"
          alt=""
          fill
          sizes="(max-width: 820px) 100vw, min(1055px, 72vw)"
          className="breakfast-method-cooking-photo"
          aria-hidden="true"
        />
        <div className="breakfast-method-cooking-paper-wash" aria-hidden="true" />

        <FoodGuideBranch className="breakfast-method-cooking-top-mark" />
        <div className="breakfast-method-cooking-topline">ZenPlato <span>|</span> 05 Your Personalized Recipe Collection</div>
        <div className="breakfast-method-cooking-top-rule" aria-hidden="true" />

        <article className="breakfast-method-cooking-copy">
          <div className="breakfast-method-cooking-kicker">Building Better</div>
          <h2>{recipe.name}</h2>
        </article>

        <div className="breakfast-method-cooking-label">
          <span>Method</span>
          <div aria-hidden="true">
            <i />
            <SectionDividerLeaf />
            <i />
          </div>
        </div>

        <div className="breakfast-method-cooking-steps">
          {recipe.method.slice(0, 6).map((step, index) => (
            <article className="breakfast-method-cooking-step" key={`${index}-${step.body}`}>
              <div className="breakfast-method-cooking-step-title">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{step.title || `Step ${index + 1}`}</h3>
              </div>
              <p>{step.body}</p>
            </article>
          ))}
        </div>

        <div className="breakfast-method-cooking-tip">
          <div className="breakfast-method-cooking-tip-icon">
            <RecipeFeatureIcon kind="leaf" />
          </div>
          <div>
            <h3>Tip</h3>
            <p>For a creamier texture, use full-fat coconut milk. Adjust sweetness to your preference.</p>
          </div>
        </div>

        <div className="breakfast-method-cooking-page-number" aria-hidden="true">42</div>
      </div>
    </section>
  );
}

function SnackMetricIcon({ kind }: { kind: SnackMetricIconName }) {
  if (kind === "chill") {
    return (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <path d="M32 34c-7.5.8-14-4.2-15-11.4-.7-5 1.5-9.8 5.5-12.6-.4 2.6.1 5.2 1.7 7.6 2.9 4.4 8.5 6.4 13.4 4.8-.5 6-2.7 10-5.6 11.6Z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
        <path d="M35 11l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    );
  }

  if (kind === "fridge") {
    return (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <rect x="15" y="6" width="18" height="36" rx="2.5" stroke="currentColor" strokeWidth="1.9" />
        <path d="M15 22h18M20 13v4M20 28v7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    );
  }

  if (kind === "oven") {
    return (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <rect x="11" y="9" width="26" height="30" rx="2.5" stroke="currentColor" strokeWidth="1.9" />
        <path d="M11 17h26M17 13h2M24 13h2M31 13h2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <rect x="17" y="23" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
      </svg>
    );
  }

  if (kind === "blend") {
    return (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <path d="M17 12h14l-2 22H19L17 12Z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
        <path d="M20 34h8l2 6H18l2-6ZM19 7h10v5H19V7ZM31 18h3c2 0 3.5 1.5 3.5 3.5S36 25 34 25h-3" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      </svg>
    );
  }

  if (kind === "cook") {
    return (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <path d="M14 24h20v10c0 4-3.5 7-10 7s-10-3-10-7V24Z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
        <path d="M18 19c-1.5-2-1.5-4 0-6M24 19c-1.5-2-1.5-4 0-6M30 19c-1.5-2-1.5-4 0-6M13 24h22" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    );
  }

  return <RecipeMetaIcon kind={kind === "servings" ? "servings" : "time"} />;
}

function SnackRecipeBadge({ kind }: { kind: SnackRecipeIconName }) {
  if (kind === "energy") return <RecipeFeatureIcon kind="energy" />;
  if (kind === "leaf") return <RecipeFeatureIcon kind="leaf" />;
  return (
    <svg viewBox="0 0 56 56" fill="none" aria-hidden="true">
      <path d="M36 39c-9 1-17-5-18-14-.8-6 2-12 7-15-1 3-1 7 1 11 3 7 10 11 18 9-1 5-4 8-8 9Z" stroke="currentColor" strokeWidth="2" />
      <path d="M39 12l1 2.4 2.4 1-2.4 1-1 2.4-1-2.4-2.4-1 2.4-1 1-2.4ZM44 21l.8 1.8 1.8.8-1.8.8-.8 1.8-.8-1.8-1.8-.8 1.8-.8.8-1.8Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

function BeverageRecipeBadge({ kind }: { kind: BeverageRecipeIconName }) {
  if (kind === "cup") {
    return (
      <svg viewBox="0 0 56 56" fill="none" aria-hidden="true">
        <path d="M14 23h25v9c0 7-5.5 12-12.5 12S14 39 14 32v-9Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M39 25h5c2.5 0 4 1.8 4 4.2s-1.5 4.2-4 4.2h-5M20 17c-1.5-2-1.5-4 0-6M28 17c-1.5-2-1.5-4 0-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (kind === "berry") {
    return (
      <svg viewBox="0 0 56 56" fill="none" aria-hidden="true">
        <circle cx="24" cy="31" r="8" stroke="currentColor" strokeWidth="2" />
        <circle cx="34" cy="30" r="7" stroke="currentColor" strokeWidth="2" />
        <circle cx="30" cy="39" r="7" stroke="currentColor" strokeWidth="2" />
        <path d="M29 20c-2-5 1-8 6-9 1 5-1 8-6 9ZM28 22c-3-4-7-5-12-3 3 5 7 6 12 3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      </svg>
    );
  }

  return <RecipeFeatureIcon kind="leaf" />;
}

function SmartSnacksIngredientsPage({ ebook }: { ebook: Ebook }) {
  const snacks = getSnackRecipes(ebook);

  return (
    <section className="cover ebook-smart-snacks-ingredients-page" id="smart-snacks-ingredients" aria-label="Smart snacks ingredients">
      <div className="ebook-smart-snacks-ingredients-sheet">
        <Image
          src="/ebook/smart-snacks-ingredients-bg.png"
          alt=""
          fill
          sizes="(max-width: 820px) 100vw, min(1055px, 72vw)"
          className="smart-snacks-ingredients-photo"
          aria-hidden="true"
        />
        <div className="smart-snacks-ingredients-paper-wash" aria-hidden="true" />

        <FoodGuideBranch className="smart-snacks-ingredients-top-mark" />
        <div className="smart-snacks-ingredients-topline">ZenPlato <span>|</span> 06 Your Personalized Recipe Collection</div>

        <article className="smart-snacks-ingredients-copy">
          <h2>Smart Snacks</h2>
          <div className="smart-snacks-ingredients-divider" aria-hidden="true">
            <SectionDividerLeaf />
            <i />
          </div>
          <p>Wholesome ingredients. Smarter choices.</p>
        </article>

        <div className="smart-snacks-ingredient-columns">
          {snacks.map((snack) => (
            <article className="smart-snacks-ingredient-column" key={snack.name}>
              <h3>{snack.name}</h3>
              <i aria-hidden="true" />
              <h4>Ingredients</h4>
              <ul>
                {snack.ingredients.slice(0, 5).map((ingredient) => (
                  <li key={ingredient}>{ingredient}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="smart-snacks-ingredients-footer">
          <div className="smart-snacks-ingredients-footer-title">
            <h3>Real Ingredients. Real Benefits.</h3>
            <p>Simple, wholesome ingredients to fuel your body and mind.</p>
          </div>
          <div className="smart-snacks-ingredients-footer-features">
            <span>Naturally Nourishing</span>
            <span>Clean &amp; Wholesome</span>
            <span>No Artificial Additives</span>
          </div>
        </div>

        <div className="smart-snacks-ingredients-bottom-note" aria-hidden="true">Small bites. Big impact.</div>
        <div className="smart-snacks-ingredients-page-number" aria-hidden="true">43</div>
      </div>
    </section>
  );
}

function SmartSnacksCardsPage({ ebook }: { ebook: Ebook }) {
  const snacks = getSnackRecipes(ebook);
  const features = getSnackFeatures(ebook);
  const benefits = getSnackBenefits(ebook);

  return (
    <section className="cover ebook-smart-snacks-cards-page" id="smart-snacks" aria-label="Smart snacks recipe cards">
      <div className="ebook-smart-snacks-cards-sheet">
        <Image
          src="/ebook/smart-snacks-cards-bg.png"
          alt=""
          fill
          sizes="(max-width: 820px) 100vw, min(1055px, 72vw)"
          className="smart-snacks-cards-photo"
          aria-hidden="true"
        />
        <div className="smart-snacks-cards-paper-wash" aria-hidden="true" />

        <FoodGuideBranch className="smart-snacks-cards-top-mark" />
        <div className="smart-snacks-cards-topline">ZenPlato <span>|</span> 06 Your Personalized Recipe Collection</div>

        <article className="smart-snacks-cards-copy">
          <h2>Smart Snacks</h2>
          <div className="smart-snacks-cards-divider" aria-hidden="true">
            <SectionDividerLeaf />
            <i />
          </div>
          <p>Delicious choices that fuel your day, satisfy cravings, and support your goals.</p>
        </article>

        <div className="smart-snacks-feature-row">
          {features.map((feature) => (
            <article className="smart-snacks-feature" key={feature.title}>
              <h3>{feature.title}</h3>
              <p>{feature.body}</p>
            </article>
          ))}
        </div>

        <div className="smart-snacks-recipe-cards">
          {snacks.map((snack) => (
            <article className="smart-snacks-recipe-card" key={snack.name}>
              <div className="smart-snacks-recipe-badge" aria-hidden="true">
                <SnackRecipeBadge kind={snack.icon} />
              </div>
              <h3>{snack.name}</h3>
              <p>{snack.subtitle}</p>
              <div className="smart-snacks-recipe-rule" aria-hidden="true" />
              <h4>Ingredients</h4>
              <ul>
                {snack.ingredients.slice(0, 5).map((ingredient) => (
                  <li key={ingredient}>{ingredient}</li>
                ))}
              </ul>
              <div className="smart-snacks-recipe-metrics">
                {snack.metrics.slice(0, 3).map((metric) => (
                  <div className="smart-snacks-recipe-metric" key={`${metric.label}-${metric.value}`}>
                    <SnackMetricIcon kind={metric.icon} />
                    <span>{metric.label}</span>
                    <strong>{metric.value}</strong>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="smart-snacks-benefits-row">
          <h3>Smart Snacking = Smarter You</h3>
          <div className="smart-snacks-benefits-grid">
            {benefits.map((benefit) => (
              <article className="smart-snacks-benefit" key={benefit.title}>
                <div className="smart-snacks-benefit-icon">
                  <RecipeFeatureIcon kind={benefit.icon} />
                </div>
                <span>{benefit.title}</span>
              </article>
            ))}
          </div>
        </div>

        <div className="smart-snacks-cards-bottom-note" aria-hidden="true">Small bites. Big impact.</div>
        <div className="smart-snacks-cards-page-number" aria-hidden="true">44</div>
      </div>
    </section>
  );
}

function NourishingBeveragesPage({ ebook }: { ebook: Ebook }) {
  const beverages = getBeverageRecipes(ebook);
  const features = getBeverageFeatures(ebook);
  const benefits = getBeverageBenefits(ebook);

  return (
    <section className="cover ebook-nourishing-beverages-page" id="nourishing-beverages" aria-label="Nourishing beverages">
      <div className="ebook-nourishing-beverages-sheet">
        <Image
          src="/ebook/nourishing-beverages-bg.png"
          alt=""
          fill
          sizes="(max-width: 820px) 100vw, min(1024px, 72vw)"
          className="nourishing-beverages-photo"
          aria-hidden="true"
        />
        <div className="nourishing-beverages-paper-wash" aria-hidden="true" />

        <FoodGuideBranch className="nourishing-beverages-top-mark" />
        <div className="nourishing-beverages-topline">ZenPlato <span>|</span> 07 Your Personalized Recipe Collection</div>

        <article className="nourishing-beverages-copy">
          <h2>Nourishing<br />Beverages</h2>
          <div className="nourishing-beverages-divider" aria-hidden="true">
            <i />
            <SectionDividerLeaf />
            <i />
          </div>
          <p className="nourishing-beverages-lead">Sip well. Live well.</p>
          <p>Delicious beverages crafted with real ingredients for a healthier you.</p>
        </article>

        <div className="nourishing-beverages-feature-row">
          {features.map((feature) => (
            <article className="nourishing-beverages-feature" key={feature.title}>
              <h3>{feature.title}</h3>
              <p>{feature.body}</p>
            </article>
          ))}
        </div>

        <div className="nourishing-beverages-cards">
          {beverages.map((beverage) => (
            <article className={`nourishing-beverage-card is-${beverage.accent}`} key={beverage.name}>
              <div className="nourishing-beverage-badge" aria-hidden="true">
                <BeverageRecipeBadge kind={beverage.icon} />
              </div>
              <h3>{beverage.name}</h3>
              <i aria-hidden="true" />
              <p>{beverage.subtitle}</p>
              <h4>Ingredients</h4>
              <ul>
                {beverage.ingredients.slice(0, 6).map((ingredient) => (
                  <li key={ingredient}>{ingredient}</li>
                ))}
              </ul>
              <div className="nourishing-beverage-metrics">
                {beverage.metrics.slice(0, 3).map((metric) => (
                  <div className="nourishing-beverage-metric" key={`${metric.label}-${metric.value}`}>
                    <SnackMetricIcon kind={metric.icon} />
                    <span>{metric.label}</span>
                    <strong>{metric.value}</strong>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="nourishing-beverages-benefits-row">
          <div className="nourishing-beverages-benefit-lead">
            <h3>Good For You.<br />Good For Life.</h3>
            <p>Simple ingredients. Lasting impact.</p>
          </div>
          <div className="nourishing-beverages-benefits-grid">
            {benefits.map((benefit) => (
              <article className="nourishing-beverages-benefit" key={benefit.title}>
                <RecipeFeatureIcon kind={benefit.icon} />
                <span>{benefit.title}</span>
              </article>
            ))}
          </div>
        </div>

        <div className="nourishing-beverages-bottom-note" aria-hidden="true">Good ingredients. Real results.</div>
        <div className="nourishing-beverages-page-number" aria-hidden="true">45</div>
      </div>
    </section>
  );
}

function GroceryCategoryCard({ category, variant }: { category: GroceryCategory; variant: "protein" | "vegetables" | "fruits" }) {
  return (
    <article className={`grocery-essentials-card is-${variant}`}>
      <h3>{category.title}</h3>
      <div className="grocery-essentials-items">
        {category.items.slice(0, 6).map((item) => (
          <div className="grocery-essentials-item" key={item.name}>
            {item.imageUrl && (
              <div className="grocery-essentials-item-image" aria-hidden="true">
                <Image src={item.imageUrl} alt="" fill sizes="8vw" />
              </div>
            )}
            <strong>{item.name}</strong>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
      <div className="grocery-essentials-summary">
        <p>{category.summary}</p>
      </div>
    </article>
  );
}

function GroceryEssentialsPage({ ebook }: { ebook: Ebook }) {
  const grocery = getGroceryList(ebook);

  return (
    <section className="cover ebook-grocery-essentials-page" id="grocery-essentials" aria-label="Grocery essentials">
      <div className="ebook-grocery-essentials-sheet">
        <Image
          src="/ebook/grocery-essentials-bg.png"
          alt=""
          fill
          sizes="(max-width: 820px) 100vw, min(1024px, 72vw)"
          className="grocery-essentials-photo"
          aria-hidden="true"
        />
        <div className="grocery-essentials-paper-wash" aria-hidden="true" />

        <FoodGuideBranch className="grocery-essentials-top-mark" />
        <div className="grocery-essentials-topline">ZenPlato <span>|</span> 08 Your Personalized Recipe Collection</div>

        <article className="grocery-essentials-copy">
          <h2>Grocery<br />Essentials</h2>
          <div className="grocery-essentials-divider" aria-hidden="true">
            <i />
            <SectionDividerLeaf />
            <i />
          </div>
          <p>{grocery.intro}</p>
        </article>

        <div className="grocery-essentials-badge">Real Food.<br />Real Good.</div>
        <div className="grocery-essentials-page-label">Page 1 of 3</div>

        <div className="grocery-essentials-grid">
          <GroceryCategoryCard category={grocery.proteinSources} variant="protein" />
          <GroceryCategoryCard category={grocery.vegetables} variant="vegetables" />
          <GroceryCategoryCard category={grocery.fruits} variant="fruits" />
        </div>

        <div className="grocery-essentials-benefits-row">
          <div className="grocery-essentials-benefit-lead">
            <h3>Good Food.<br />Better You.</h3>
            <p>Choose whole foods for a healthier, happier life every day.</p>
          </div>
          <div className="grocery-essentials-benefits-grid">
            {["Nutrient Dense", "Supports Immunity", "Aids Digestion", "Heart Healthy", "Weight Friendly"].map((benefit, index) => (
              <article className="grocery-essentials-benefit" key={benefit}>
                <RecipeFeatureIcon kind={(["leaf", "heart", "leaf", "heart", "balance"] as RecipeFeatureIconName[])[index]} />
                <span>{benefit}</span>
              </article>
            ))}
          </div>
        </div>

        <div className="grocery-essentials-bottom-note" aria-hidden="true">Good ingredients. Real results.</div>
        <div className="grocery-essentials-page-number" aria-hidden="true">46</div>
      </div>
    </section>
  );
}

function ProduceTagIcon({ index }: { index: number }) {
  const icons: RecipeFeatureIconName[] = ["energy", "heart", "leaf", "balance", "protein"];
  return <RecipeFeatureIcon kind={icons[index % icons.length]} />;
}

function FruitCatalogPage({ ebook }: { ebook: Ebook }) {
  const grocery = getGroceryList(ebook);

  return (
    <section className="cover ebook-fruit-catalog-page" id="grocery-fruits" aria-label="Fruits grocery catalog">
      <div className="ebook-fruit-catalog-sheet">
        <Image
          src="/ebook/grocery-fruits-bg.png"
          alt=""
          fill
          sizes="(max-width: 820px) 100vw, min(1024px, 72vw)"
          className="fruit-catalog-photo"
          aria-hidden="true"
        />
        <div className="fruit-catalog-paper-wash" aria-hidden="true" />

        <FoodGuideBranch className="fruit-catalog-top-mark" />
        <div className="fruit-catalog-topline">ZenPlato <span>|</span> 08 Your Personalized Recipe Collection</div>

        <article className="fruit-catalog-copy">
          <h2>Fruits</h2>
          <div className="fruit-catalog-divider" aria-hidden="true">
            <i />
            <SectionDividerLeaf />
            <i />
          </div>
          <p>Nature's sweetest gifts packed with vitamins, minerals, and antioxidants for a healthier you.</p>
        </article>

        <div className="fruit-catalog-badge">Real Fruit.<br />Real Benefits.</div>

        <div className="fruit-catalog-grid">
          {grocery.fruitCatalog.slice(0, 15).map((fruit) => (
            <article className="fruit-catalog-card" key={fruit.name}>
              {fruit.imageUrl && (
                <div className="fruit-catalog-item-image" aria-hidden="true">
                  <Image src={fruit.imageUrl} alt="" fill sizes="8vw" />
                </div>
              )}
              <div className="fruit-catalog-card-copy">
                <h3>{fruit.name}</h3>
                <i aria-hidden="true" />
                <p>{fruit.description}</p>
              </div>
              <div className="fruit-catalog-tags">
                {fruit.tags.slice(0, 3).map((tag, index) => (
                  <span key={`${fruit.name}-${tag}`}>
                    <ProduceTagIcon index={index} />
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="fruit-catalog-benefits-row">
          <div className="fruit-catalog-benefit-lead">
            <h3>Eat The Rainbow</h3>
            <p>Different colors, different nutrients. Enjoy a variety of fruits every day.</p>
          </div>
          <div className="fruit-catalog-benefits-grid">
            {["Strengthens Immunity", "Promotes Healthy Skin", "Supports Digestion", "Supports Heart Health", "Aids In Weight Management"].map((benefit, index) => (
              <article className="fruit-catalog-benefit" key={benefit}>
                <RecipeFeatureIcon kind={(["heart", "heart", "leaf", "heart", "balance"] as RecipeFeatureIconName[])[index]} />
                <span>{benefit}</span>
              </article>
            ))}
          </div>
        </div>

        <div className="fruit-catalog-bottom-note" aria-hidden="true">Good ingredients. Real results.</div>
        <div className="fruit-catalog-page-number" aria-hidden="true">47</div>
      </div>
    </section>
  );
}

function VegetableCatalogPage({ ebook }: { ebook: Ebook }) {
  const grocery = getGroceryList(ebook);

  return (
    <section className="cover ebook-vegetable-catalog-page" id="grocery-vegetables" aria-label="Vegetables grocery catalog">
      <div className="ebook-vegetable-catalog-sheet">
        <Image
          src="/ebook/grocery-vegetables-bg.png"
          alt=""
          fill
          sizes="(max-width: 820px) 100vw, min(1024px, 72vw)"
          className="vegetable-catalog-photo"
          aria-hidden="true"
        />
        <div className="vegetable-catalog-paper-wash" aria-hidden="true" />

        <FoodGuideBranch className="vegetable-catalog-top-mark" />
        <div className="vegetable-catalog-topline">ZenPlato <span>|</span> 08 Your Personalized Recipe Collection</div>

        <article className="vegetable-catalog-copy">
          <h2>Vegetables</h2>
          <div className="vegetable-catalog-divider" aria-hidden="true">
            <i />
            <SectionDividerLeaf />
            <i />
          </div>
          <p>Nutrient-rich vegetables to add color, flavor, and health to your meals.</p>
        </article>

        <div className="vegetable-catalog-grid">
          {grocery.vegetableCatalog.slice(0, 20).map((vegetable) => (
            <article className="vegetable-catalog-card" key={vegetable.name}>
              {vegetable.imageUrl && (
                <div className="vegetable-catalog-item-image" aria-hidden="true">
                  <Image src={vegetable.imageUrl} alt="" fill sizes="7vw" />
                </div>
              )}
              <h3>{vegetable.name}</h3>
              <p>{vegetable.description}</p>
            </article>
          ))}
        </div>

        <div className="vegetable-catalog-benefits-row">
          <div className="vegetable-catalog-benefit-lead">
            <h3>Eat A Rainbow</h3>
            <p>Variety in vegetables ensures a wide range of nutrients for a stronger, healthier you.</p>
          </div>
          <div className="vegetable-catalog-benefits-grid">
            {["Boosts Immunity", "Supports Digestion", "Promotes Healthy Skin", "Strengthens Bones", "Aids Weight Management"].map((benefit, index) => (
              <article className="vegetable-catalog-benefit" key={benefit}>
                <RecipeFeatureIcon kind={(["heart", "leaf", "heart", "protein", "balance"] as RecipeFeatureIconName[])[index]} />
                <span>{benefit}</span>
              </article>
            ))}
          </div>
        </div>

        <div className="vegetable-catalog-bottom-note" aria-hidden="true">Good ingredients. Real results.</div>
        <div className="vegetable-catalog-page-number" aria-hidden="true">48</div>
      </div>
    </section>
  );
}

function ActionPlan30DayPage({ ebook }: { ebook: Ebook }) {
  const weeks = getActionPlanWeeks(ebook);
  const tips = getActionPlanTips(ebook);
  const remember = ebook.summary.action_plan_remember
    || "Consistency creates change. Keep showing up for yourself every single day.";

  return (
    <section className="cover ebook-action-plan-page" id="action-plan-30-day" aria-label="Your 30-day action plan">
      <div className="ebook-action-plan-sheet">
        <Image
          src="/ebook/action-plan-30-day-bg.png"
          alt=""
          fill
          sizes="(max-width: 820px) 100vw, min(1024px, 72vw)"
          className="action-plan-photo"
          aria-hidden="true"
        />
        <div className="action-plan-paper-wash" aria-hidden="true" />

        <FoodGuideBranch className="action-plan-top-mark" />
        <div className="action-plan-topline">ZenPlato <span>|</span> 06 Your 30-Day Action Plan</div>

        <article className="action-plan-copy">
          <div className="action-plan-section-badge">Section 6</div>
          <h2>Your 30-Day<br />Action Plan</h2>
          <div className="action-plan-divider" aria-hidden="true">
            <i />
            <SectionDividerLeaf />
            <i />
          </div>
          <h3>Purpose</h3>
          <p>Turn recommendations into daily action.</p>
        </article>

        <div className="action-plan-calendar-note">
          <strong>30</strong>
          <span>Days To<br />A Healthier<br />You</span>
          <SectionDividerLeaf />
        </div>

        <div className="action-plan-principles">
          {[
            "Small steps. Consistent days. Big results.",
            "30 days to build better habits that last.",
            "Focus on progress, not perfection. You've got this!",
            "Track daily, stay accountable and celebrate wins.",
          ].map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>

        <div className="action-plan-week-grid">
          {weeks.map((week) => (
            <section className="action-plan-week-row" key={week.week}>
              <aside className="action-plan-week-card">
                <span>{week.week}</span>
                <strong>{week.title}</strong>
                <em>{week.range}</em>
                <p>Focus:<br />{week.focus}</p>
              </aside>
              <div className="action-plan-days">
                {week.days.map((day) => (
                  <article className="action-plan-day" key={day.day}>
                    <h3>Day {day.day}</h3>
                    <p>{day.action}</p>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="action-plan-footer">
          <div className="action-plan-remember">
            <h3>Remember</h3>
            <p>{remember}</p>
          </div>
          <div className="action-plan-tips">
            <h3>Tips For Success</h3>
            <div>
              {tips.map((tip) => (
                <p key={tip}>{tip}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="action-plan-bottom-note" aria-hidden="true">Small steps today, a healthier you tomorrow.</div>
        <div className="action-plan-page-number" aria-hidden="true">49</div>
      </div>
    </section>
  );
}

function NextChapterPage({ ebook }: { ebook: Ebook }) {
  const steps = getNextChapterSteps(ebook);
  const faqs = getFaqItems(ebook);
  const closingMessage = getClosingMessage(ebook);

  return (
    <section className="cover ebook-next-chapter-page" id="next-chapter" aria-label="Your next chapter">
      <div className="ebook-next-chapter-sheet">
        <Image
          src="/ebook/recipe-collection-intro-bg.png"
          alt=""
          fill
          sizes="(max-width: 820px) 100vw, min(1086px, 72vw)"
          className="next-chapter-photo"
          aria-hidden="true"
        />
        <div className="next-chapter-paper-wash" aria-hidden="true" />

        <FoodGuideBranch className="next-chapter-top-mark" />
        <div className="next-chapter-topline">ZenPlato <span>|</span> 07 Your Next Chapter</div>
        <div className="next-chapter-top-rule" aria-hidden="true" />

        <article className="next-chapter-copy">
          <div className="next-chapter-section-badge">Section 7</div>
          <h2>Your Next<br />Chapter</h2>
          <div className="next-chapter-divider" aria-hidden="true">
            <i />
            <SectionDividerLeaf />
            <i />
          </div>
          <p>{closingMessage}</p>
        </article>

        <div className="next-chapter-steps">
          {steps.map((step, index) => (
            <article className="next-chapter-step" key={step.title}>
              <div className="next-chapter-step-icon">
                <RecipeFeatureIcon kind={step.icon} />
              </div>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </div>

        <section className="next-chapter-faqs" aria-label="Frequently asked questions">
          <h3>Frequently Asked Questions</h3>
          <div>
            {faqs.map((item) => (
              <article className="next-chapter-faq" key={item.question}>
                <h4>{item.question}</h4>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="next-chapter-closing">
          <div className="next-chapter-closing-icon">
            <RecipeFeatureIcon kind="leaf" />
          </div>
          <p>Keep going gently. Your body responds to what you repeat with care.</p>
        </div>

        <div className="next-chapter-bottom-note" aria-hidden="true">This is not the end. This is your rhythm beginning.</div>
        <div className="next-chapter-page-number" aria-hidden="true">50</div>
      </div>
    </section>
  );
}

function buildFallbackEbook(user: User | null, answers: Partial<PremiumAnswers> = {}): Ebook {
  const firstName = user?.name?.trim().split(/\s+/)[0] || "Maya";
  const goal = user?.goal_30day || "steady energy, calmer cravings, and hormone-supportive meals";
  const eatingStyle = user?.dietary_type || "Balanced whole-food";
  const flavor = answers.flavor || "Mediterranean";
  const time = answers.time || "15m";
  const aspiration = answers.aspiration
    ? answers.aspiration.replace(/-/g, " ")
    : "hormonal peace";

  const safeFirstName = escapeHtml(firstName);
  const safeGoal = escapeHtml(goal);
  const safeEatingStyle = escapeHtml(eatingStyle);
  const safeFlavor = escapeHtml(flavor);
  const safeTime = escapeHtml(time);
  const safeAspiration = escapeHtml(aspiration);

  return {
    condition_id: "pcos",
    condition_label: "PCOS",
    generated_at: new Date().toISOString(),
    is_premium: true,
    summary: {
      greeting: `Hi ${firstName}`,
      headline: "Your sample PCOS blueprint is ready",
      condition_label: "PCOS",
      condition_blurb:
        "This fallback preview uses realistic example content so the premium ebook template remains visible when AI generation or the ebook API is unavailable.",
      personalized_welcome: `${firstName}, this preview shows how your premium blueprint can translate onboarding answers into a calm, personalized wellness guide. The final AI version should adapt every page to your biology, food preferences, symptoms, and lifestyle rhythm.`,
      health_snapshot:
        "Your responses suggest a body working hard to maintain balance while several systems ask for steadier support. Hormonal rhythm, blood sugar response, inflammation, sleep, and stress recovery appear closely connected in your current profile.\n\nThis snapshot turns those patterns into a clear starting point so your plan can focus on the few changes most likely to help you feel better.",
      nutrition_insights:
        "Your nutrition pattern may benefit from steadier protein, fiber-rich plants, and predictable meal timing. These anchors can support blood sugar rhythm, reduce cravings, and make energy feel more consistent through the day.",
      lifestyle_insights:
        "Sleep, stress, and recovery appear to be important levers in your profile. Gentle daily movement, a calmer evening routine, and hydration cues can make nutrition changes easier to sustain.",
      triggers_patterns:
        "Likely triggers include long gaps between meals, low-protein breakfasts, high-stress eating windows, and inconsistent recovery. These patterns are workable when the plan stays simple and repeatable.",
      path_forward:
        "Use this snapshot as the first step toward a plan that fits your body, schedule, preferences, and energy instead of forcing a generic routine.",
      at_glance: [
        {
          label: "Focus Areas Analyzed",
          value: "6",
          description: "Key areas of your health have been assessed based on your responses.",
          icon: "search",
        },
        {
          label: "Priority Needs",
          value: "3",
          description: "Areas that need your immediate attention and consistent support.",
          icon: "star",
        },
        {
          label: "Moderate Status",
          value: "2",
          description: "Areas showing moderate balance with room for improvement.",
          icon: "trend",
        },
        {
          label: "Strong Areas",
          value: "1",
          description: "Areas where your body is functioning well and showing good resilience.",
          icon: "heart",
        },
      ],
      next_best_step_headline: "Personalized. Practical. Powerful.",
      next_best_step_body:
        "Your personalized plan is designed around your unique biology, lifestyle, and goals, helping you take the right actions for lasting change.",
      next_best_step_cta: "View Your Plan",
      opportunity_1: {
        number: "01",
        title: "Stress & Recovery",
        paragraphs: [
          "This is the area with the greatest potential to create meaningful change for your energy, balance, and long-term wellbeing.",
          "Your responses indicate this opportunity is closely connected to how your body is functioning and adapting each day.",
          "When we nurture this area with the right support and consistent small steps, you may experience improvements that ripple across your overall health.",
          "This is your starting point, where awareness becomes action, and action creates lasting transformation.",
        ],
      },
      opportunity_2: {
        number: "02",
        title: "Insulin Sensitivity",
        paragraphs: [
          "This opportunity focuses on steadier meal rhythm, protein anchors, and fiber-rich choices that can help your body feel less reactive.",
          "The goal is not restriction. It is giving your metabolism clearer signals so cravings, energy dips, and hunger feel easier to understand.",
        ],
      },
      opportunity_3: {
        number: "03",
        title: "Sleep Quality",
        paragraphs: [
          "Better recovery can make every nutrition step easier to sustain, especially when stress and hormones are already asking for support.",
          "Small evening rituals, hydration timing, and gentle movement can create a calmer baseline for the next day.",
        ],
      },
      understanding_items: [
        {
          title: "What It Means",
          body: "PCOS is a hormonal condition that affects how your ovaries and hormones function. It can influence ovulation, hormone balance, and metabolism in unique and complex ways.",
          icon: "leaf",
        },
        {
          title: "Why It Matters",
          body: "Understanding PCOS helps you identify the underlying imbalances rather than just managing symptoms. With the right knowledge and support, your body can heal, recalibrate, and thrive.",
          icon: "balance",
        },
        {
          title: "How It May Affect Daily Life",
          body: "PCOS can show up as irregular cycles, fatigue, mood shifts, skin changes, weight fluctuations, or fertility challenges. Recognizing these patterns is the first step toward creating lasting positive change.",
          icon: "sun",
        },
      ],
      symptom_flow_steps: [
        {
          number: "01.",
          title: "Hormonal Changes",
          body: "Hormonal imbalances, especially elevated androgens and insulin resistance, can disrupt normal ovulation and throw your body's systems off balance.",
          icon: "hormone",
        },
        {
          number: "02.",
          title: "Blood Sugar Fluctuations",
          body: "These hormonal shifts affect how your body processes glucose, leading to spikes and crashes in blood sugar throughout the day.",
          icon: "bloodSugar",
        },
        {
          number: "03.",
          title: "Cravings & Energy Dips",
          body: "Blood sugar ups and downs trigger intense cravings, irritability, and fatigue as your body struggles to find steady fuel and balance.",
          icon: "cravings",
        },
        {
          number: "04.",
          title: "Daily Challenges",
          body: "The cycle shows up in real life through mood swings, low energy, poor sleep, skin flare-ups, weight changes, and fertility struggles.",
          icon: "daily",
        },
      ],
      symptom_flow_takeaway: "Understanding the why behind your symptoms is the first step toward lasting balance and healing.",
      nutrition_influence_items: [
        {
          number: "01.",
          title: "Energy",
          body: "The right nutrients help stabilize blood sugar and support steady energy throughout the day, so you can feel more awake, focused, and resilient.",
          icon: "energy",
        },
        {
          number: "02.",
          title: "Cravings",
          body: "Balanced meals and blood sugar stability can reduce intense cravings and help you feel more satisfied and in control.",
          icon: "cravings",
        },
        {
          number: "03.",
          title: "Hormonal Balance",
          body: "Nutrition plays a powerful role in regulating hormones like insulin, estrogen, and testosterone, supporting ovulation, mood, and cycle regularity.",
          icon: "balance",
        },
        {
          number: "04.",
          title: "Long-Term Health",
          body: "Nourishing your body today supports your future, reducing the risk of metabolic issues, inflammation, and chronic disease down the road.",
          icon: "leaf",
        },
      ],
      nutrition_influence_takeaway: "Food is more than fuel, it's information. The right nutrition helps your body function, heal, and thrive.",
      foods_to_prioritize: [
        {
          title: "Leafy Greens",
          description: "Rich in magnesium, folate, and fiber to support hormones and calmer digestion.",
        },
        {
          title: "Berries",
          description: "Lower-sugar fruit with antioxidants that can support inflammation and cravings.",
        },
        {
          title: "Lean Proteins",
          description: "Protein anchors help keep blood sugar steadier and meals more satisfying.",
        },
        {
          title: "Whole Grains",
          description: "Fiber-rich carbohydrates support energy without the sharp highs and lows.",
        },
      ],
      foods_to_be_mindful_of: [
        {
          title: "Sweet Drinks",
          description: "Liquid sugars can move quickly through the body and intensify energy dips.",
        },
        {
          title: "Refined Snacks",
          description: "Low-fiber snacks may make cravings harder to read and harder to settle.",
        },
        {
          title: "Fried Foods",
          description: "Frequent fried choices may add inflammatory load for some hormone profiles.",
        },
        {
          title: "Alcohol",
          description: "Can disrupt sleep, stress recovery, and next-day appetite regulation.",
        },
      ],
      hydration_guidance: {
        intro:
          "Proper hydration supports hormone balance, energy levels, digestion, and glowing skin. Small, consistent habits make a big difference.",
        daily_goal: "8-10 glasses",
        morning_ritual: "a full glass of water",
        evening_ritual: "calming herbal tea or warm water",
        steps: [
          {
            title: "Daily Goal",
            body: "Aim for 8-10 glasses spread throughout the day, adjusting upward when you sweat, travel, or feel energy dipping.",
          },
          {
            title: "Sip Consistently",
            body: "Drink a glass of water every 1-2 hours. Consistent sips keep your body hydrated and your energy steady.",
          },
          {
            title: "Start & End Your Day",
            body: "Begin your morning with a full glass of water and unwind at night with calming herbal tea or warm water.",
          },
          {
            title: "Enhance Naturally",
            body: "Add hydrating, nutrient-rich ingredients like lemon, cucumber, mint, or berries to make water more refreshing.",
          },
          {
            title: "Listen To Your Body",
            body: "Thirst, dry skin, fatigue, or headaches can be signs you need more fluids. Check in and rehydrate.",
          },
        ],
        tips: HYDRATION_DEFAULT_TIPS,
        quote: "Hydration is self-care. Nourish your body with water, and it will nourish you in return.",
      },
      meal_timing_guidance: {
        intro:
          "When you eat is just as important as what you eat. Consistent meal timing helps stabilize blood sugar, balance hormones, and support steady energy throughout the day.",
        entries: MEAL_TIMING_DEFAULTS,
        consistency_title: "Consistency Is Key",
        consistency_body:
          "Try to eat at regular times each day. This helps regulate hunger, balance hormones, and support overall well-being.",
        quote: "Small, consistent habits create meaningful long-term change.",
      },
      food_swaps: {
        intro:
          "Small swaps can make a big difference. Choose foods that nourish your body, balance hormones, and support long-term well-being.",
        swaps: FOOD_SWAP_DEFAULTS,
        quote: "Small choices repeated consistently become powerful habits.",
      },
      stress_insight:
        "Stress may be making consistency harder by increasing cravings, lowering energy, and pushing your body toward quick comfort choices. Gentle regulation, steady meals, and recovery cues can help your nervous system feel safer and your choices feel easier.",
      daily_habits: DAILY_HABIT_DEFAULTS,
      recipe_collection_intro:
        "Your recipes are designed around steady energy, hormone support, satisfying flavors, and ingredients that fit the way you actually live.",
      breakfast_recipes: BREAKFAST_RECIPE_DEFAULTS,
      snack_recipes: SNACK_RECIPE_DEFAULTS,
      snack_features: SNACK_FEATURE_DEFAULTS,
      snack_benefits: SNACK_BENEFIT_DEFAULTS,
      beverage_recipes: BEVERAGE_RECIPE_DEFAULTS,
      beverage_features: BEVERAGE_FEATURE_DEFAULTS,
      beverage_benefits: BEVERAGE_BENEFIT_DEFAULTS,
      grocery_list: GROCERY_DEFAULTS,
      week_1_plan: ACTION_PLAN_DEFAULTS[0],
      week_2_plan: ACTION_PLAN_DEFAULTS[1],
      week_3_plan: ACTION_PLAN_DEFAULTS[2],
      week_4_plan: ACTION_PLAN_DEFAULTS[3],
      action_plan_tips: ACTION_PLAN_TIPS_DEFAULTS,
      action_plan_remember: "Consistency creates change. Keep showing up for yourself every single day.",
      closing_message:
        "You now have a clear, personal starting point. Keep returning to the small actions that help your body feel supported, steady, and cared for.",
      next_chapter_steps: NEXT_CHAPTER_STEP_DEFAULTS,
      faq_items: FAQ_DEFAULTS,
      finding_1: "Insulin Resistance Pattern: Signs of blood sugar fluctuation may be affecting energy, cravings, and hormonal balance.",
      finding_2: "Inflammation & Stress Load: Stress and inflammatory patterns may be making recovery and consistency harder.",
      finding_3: "Hormonal Imbalance: Hormonal shifts may be influencing mood, cycle rhythm, skin, and appetite cues.",
      finding_4: "Digestive & Gut Health: Digestive comfort and nutrient absorption may improve with calmer, fiber-forward meals.",
      core_takeaway: "These patterns help us understand what your body needs most right now.",
      all_conditions: ["PCOS"],
      goal_30day: goal,
      stats: [
        { label: "Mode", value: "Example preview" },
        { label: "Focus", value: "PCOS" },
        { label: "Goal", value: goal },
        { label: "Style", value: eatingStyle },
      ],
      diet: {
        type: eatingStyle,
        allergies: user?.allergies || [],
      },
      focus_points: [
        "Anchor each meal with protein and fiber to support steadier blood sugar.",
        "Plan gentle daily movement after meals to improve energy and consistency.",
        "Use simple swaps and repeatable breakfasts before adding complexity.",
      ],
    },
    chapters: [
      {
        id: 2,
        title: "A Note For You",
        html_content: `
          <h3>A Note For You</h3>
          <p>${safeFirstName}, this is sample fallback content for previewing the premium blueprint experience while AI generation is unavailable. It is written to show the intended tone, spacing, chapter rhythm, and personalisation structure.</p>
          <div class="callout insight">
            <span class="clabel">Primary focus</span>
            <p>Your current example goal is <strong>${safeGoal}</strong>. The full AI version should turn this into specific food priorities, habit prompts, and a realistic action plan.</p>
          </div>
          <p>The blueprint should feel calm and personal: less like a generic report, more like a guided wellness journal that understands your context before asking you to change anything.</p>
        `,
      },
      {
        id: 3,
        title: "Your Health Snapshot",
        html_content: `
          <h3>Your Health Snapshot</h3>
          <p>This page demonstrates how the AI-generated profile summary can translate onboarding answers into a concise wellness snapshot.</p>
          <div class="pillars">
            <div class="pcard"><div class="pn">I</div><h5>Condition</h5><p>PCOS support with a focus on blood sugar rhythm, cravings, and sustainable meal structure.</p></div>
            <div class="pcard"><div class="pn">II</div><h5>Eating style</h5><p>${safeEatingStyle} meals, adjusted around preferences, allergies, budget, and cooking confidence.</p></div>
            <div class="pcard"><div class="pn">III</div><h5>Daily pattern</h5><p>Repeatable breakfasts, planned snacks, hydration cues, and low-friction grocery choices.</p></div>
          </div>
        `,
      },
      {
        id: 4,
        title: "Your Key Findings",
        html_content: `
          <h3>Your Key Findings</h3>
          <ul>
            <li><strong>Meal rhythm matters.</strong> Long gaps between meals may increase cravings and energy dips.</li>
            <li><strong>Protein is the anchor.</strong> A reliable protein source at breakfast can make the rest of the day easier.</li>
            <li><strong>Fiber creates steadiness.</strong> Vegetables, legumes, seeds, and whole grains help make meals more satisfying.</li>
            <li><strong>Recovery supports consistency.</strong> Sleep, stress, and gentle movement shape how sustainable nutrition feels.</li>
          </ul>
        `,
      },
      {
        id: 5,
        title: "Foods To Prioritize",
        html_content: `
          <h3>Foods To Prioritize</h3>
          <p>This sample uses a ${safeFlavor} flavor direction and a busy-day cooking target of ${safeTime}.</p>
          <div class="compare">
            <div class="ccol good">
              <h5>Build around</h5>
              <ul><li>Eggs, Greek yogurt, tofu, lentils, fish, or chicken</li><li>Leafy greens, berries, avocado, peppers, and cruciferous vegetables</li><li>Oats, quinoa, beans, chickpeas, and seeded whole-grain options</li></ul>
            </div>
            <div class="ccol bad">
              <h5>Be mindful of</h5>
              <ul><li>Sweet drinks and frequent refined snacks</li><li>Breakfasts without protein or fiber</li><li>Ultra-processed foods that make hunger harder to read</li></ul>
            </div>
          </div>
        `,
      },
      {
        id: 6,
        title: "Your 30-Day Foundation",
        html_content: `
          <h3>Your 30-Day Foundation</h3>
          <p>The premium AI version should turn your aspiration for ${safeAspiration} into a week-by-week plan. This preview shows the layout style.</p>
          <div class="callout practice">
            <span class="clabel">Week 1</span>
            <p>Choose one breakfast you can repeat three times. Add protein, fiber, and one calming morning cue.</p>
          </div>
          <div class="callout practice">
            <span class="clabel">Week 2</span>
            <p>Build a simple grocery list and prepare two meal anchors before the week begins.</p>
          </div>
          <div class="callout practice">
            <span class="clabel">Week 3</span>
            <p>Add one smart swap for cravings and one short walk after the meal that usually feels hardest.</p>
          </div>
        `,
      },
    ],
  };
}

function NoteForYouPage({ ebook, user, plan }: { ebook: Ebook; user: User | null; plan: any }) {
  const paragraphs = getWelcomeParagraphs(user, ebook, plan);

  return (
    <section className="cover ebook-note-page" id="note" aria-label="A note for you">
      <div className="ebook-note-sheet">
        <div className="note-watermark" aria-hidden="true">WELCOME</div>
        <div className="note-topline">ZenPlato <span>|</span> The Beginning</div>
        <div className="note-copy">
          <div className="note-chapter-number">01</div>
          <div className="note-chapter-label">Chapter One</div>
          <div className="note-rule" aria-hidden="true" />
          <h2>Your Journey<br />to Balance<br />Starts Here.</h2>
          <div className="note-body">
            <p className="note-lede">{paragraphs[0]}</p>
            {paragraphs.slice(1).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
        <div className="note-image-panel" aria-hidden="true">
          <Image
            src={getEbookMedia(ebook, "opening_note", "/ebook/note-hero.png")}
            alt=""
            fill
            sizes="(max-width: 820px) 100vw, min(360px, 28vw)"
            className="note-image"
          />
        </div>
        <div className="note-page-number" aria-hidden="true">02</div>
      </div>
    </section>
  );
}

function HealthSnapshotPage({ ebook, user }: { ebook: Ebook; user: User | null }) {
  const concerns = getSnapshotConcerns(user, ebook);
  const paragraphs = getSnapshotParagraphs(ebook);

  return (
    <section className="cover ebook-snapshot-page" id="health-snapshot" aria-label="Your health snapshot">
      <div className="ebook-snapshot-sheet">
        <Image
          src={getEbookMedia(ebook, "health_snapshot", "/ebook/snapshot-bg.png")}
          alt=""
          fill
          sizes="(max-width: 820px) 100vw, min(1024px, 70vw)"
          className="snapshot-background"
          aria-hidden="true"
        />
        <div className="snapshot-topline">ZenPlato <span>|</span> 02 Health Snapshot</div>

        <div className="snapshot-left">
          <h2>Your<br />Health<br />Snapshot</h2>
          <div className="snapshot-title-rule" aria-hidden="true" />
          <div className="snapshot-side-label">Your Selected<br />Conditions &amp; Concerns</div>
          <div className="snapshot-concern-list">
            {concerns.map((concern) => (
              <div className="snapshot-concern" key={`${concern.title}-${concern.role}`}>
                <div className="snapshot-icon-wrap">
                  <SnapshotIcon type={concern.icon} />
                </div>
                <div>
                  <h3>{concern.title}</h3>
                  <p className="snapshot-role">{concern.role}</p>
                  <p>{concern.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="snapshot-brand">
            <div>Zen</div>
            <span>Your food intelligence companionship</span>
          </div>
        </div>

        <div className="snapshot-spine" aria-hidden="true">
          <span />
        </div>

        <div className="snapshot-right">
          <div className="snapshot-summary-label">The Personalized Summary</div>
          <div className="snapshot-summary-rule" aria-hidden="true" />
          <blockquote>
            <span>&ldquo;</span>
            Your body is always communicating. This snapshot helps us listen with clarity.
          </blockquote>
          <div className="snapshot-ornament" aria-hidden="true">
            <i />
            <CoverLeafMark />
            <i />
          </div>
          <div className="snapshot-paragraphs">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="snapshot-page-number" aria-hidden="true">03</div>
      </div>
    </section>
  );
}

function KeyFindingsPage({ ebook, user, phonePanel }: { ebook: Ebook; user: User | null; phonePanel?: "intro" | "details" }) {
  const findings = getKeyFindings(user, ebook);
  const takeaway = getCoreTakeaway(ebook);

  return (
    <section className={`cover ebook-findings-page${phonePanel ? ` phone-findings-${phonePanel}` : ""}`} id={phonePanel ? `phone-findings-${phonePanel}` : "key-findings"} aria-label="Your key findings">
      <div className="ebook-findings-sheet">
        <Image
          src="/ebook/findings-bg.png"
          alt=""
          fill
          sizes="(max-width: 820px) 100vw, min(1086px, 75vw)"
          className="findings-background"
          aria-hidden="true"
        />
        <div className="findings-topline">ZenPlato <span>|</span> 01 Your Story</div>

        <div className="findings-left">
          <h2>Your<br />Key<br />Findings</h2>
          <div className="findings-kicker">The top patterns we<br />identified in your profile.</div>

          <div className="findings-takeaway-label">The Core Takeaway</div>
          <blockquote>{takeaway}</blockquote>
          <p>
            By addressing these key areas with the right nutrition, lifestyle, and support,
            you can create meaningful shifts in energy, hormonal balance, and long-term wellbeing.
          </p>

          <div className="findings-brand">
            <div>Zen</div>
            <span>Your food intelligence companionship</span>
          </div>
        </div>

        <div className="findings-card-stack">
          {findings.map((finding) => (
            <article className="finding-card" key={`${finding.priority}-${finding.title}`}>
              <div className="finding-card-copy">
                <div className="finding-priority">{finding.priority}</div>
                <h3>{finding.title}</h3>
                <p>{finding.description}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="findings-page-number" aria-hidden="true">
          <span>04</span>
          <i />
        </div>
      </div>
    </section>
  );
}

function KeyHealthFocusAreasPage({ ebook }: { ebook: Ebook }) {
  const areas = getFocusAreas(ebook);

  return (
    <section className="cover ebook-focus-page" id="focus-areas" aria-label="Key health focus areas">
      <div className="ebook-focus-sheet">
        <div className="focus-top-rule" aria-hidden="true" />
        <FocusSprig className="focus-top-sprig" />
        <div className="focus-topline">ZenPlato <span>|</span> 02 Health Snapshot</div>

        <div className="focus-hero">
          <h2>Key Health<br />Focus Areas</h2>
          <div className="focus-title-rule" aria-hidden="true" />
          <div className="focus-kicker">Six pillars. One balanced you.</div>
        </div>

        <p className="focus-intro">
          These six areas represent the core systems influencing your health and wellbeing.
          Each tile reflects your current status based on your responses and where your body
          may benefit most from support.
        </p>

        <div className="focus-card-grid">
          {areas.map((area) => (
            <article className="focus-card" key={`${area.eyebrow}-${area.title}`}>
              <div className="focus-card-eyebrow">{area.eyebrow}</div>
              <div className="focus-card-heading">
                <div className="focus-icon-medallion">
                  <FocusAreaIcon type={area.icon} />
                </div>
                <h3>{area.title}</h3>
              </div>
              <div className="focus-card-status">{area.status}</div>
              <div className="focus-progress" aria-hidden="true">
                <span style={{ width: `${area.progress}%` }} />
              </div>
              <p>{area.description}</p>
            </article>
          ))}
        </div>

        <div className="focus-remember">
          <div className="focus-remember-icon">
            <FocusSpark />
          </div>
          <div className="focus-remember-copy">
            <div>Remember</div>
            <p>Small, consistent actions across these areas create powerful, long-lasting transformation.</p>
          </div>
          <FocusSprig className="focus-remember-sprig" />
        </div>

        <div className="focus-page-number" aria-hidden="true">05</div>
      </div>
    </section>
  );
}

function PersonalizedInsightsPage({ ebook, user, plan }: { ebook: Ebook; user: User | null; plan: any }) {
  const profileRows = getProfileRows(user);
  const concerns = getSelectedConcerns(user, ebook);
  const insights = getPersonalizedInsightCopy(user, ebook, plan);

  return (
    <section className="cover ebook-personalized-page" id="personalized-insights" aria-label="Your personalized insights">
      <div className="ebook-personalized-sheet">
        <div className="personalized-topline">ZenPlato <span>|</span> 01 Your Story</div>
        <div className="personalized-top-rule" aria-hidden="true" />
        <FocusSprig className="personalized-top-sprig" />

        <aside className="personalized-sidebar">
          <h2>Your<br />Health<br />Snapshot</h2>
          <div className="personalized-title-rule" aria-hidden="true" />
          <p className="personalized-kicker">A personalized view<br />of your wellbeing<br />journey.</p>

          <div className="personalized-section-label">Selected Profile</div>
          <div className="personalized-profile-card">
            {profileRows.map((row) => (
              <div className="personalized-profile-row" key={row.label}>
                <div className="personalized-profile-icon">
                  <ProfileMetricIcon type={row.icon} />
                </div>
                <div>
                  <div>{row.label}</div>
                  <p>{row.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="personalized-section-label personalized-concern-label">Selected Conditions<br />&amp; Concerns</div>
          <div className="personalized-concern-list">
            {concerns.map((concern) => (
              <div className="personalized-concern" key={concern}>
                <i aria-hidden="true" />
                <span>{concern}</span>
              </div>
            ))}
          </div>

          <FocusSprig className="personalized-bottom-sprig" />
        </aside>

        <article className="personalized-narrative-panel">
          <div className="personalized-panel-label">Personalized Narrative Analysis</div>
          <div className="personalized-panel-rule" aria-hidden="true" />
          <h3>Here&rsquo;s what your<br />body is <em>telling us.</em></h3>
          <p className="personalized-lead">{insights.lead}</p>

          <div className="personalized-quote-mark" aria-hidden="true">&ldquo;</div>
          <div className="personalized-quote-body">
            {insights.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="personalized-path">
            <div className="personalized-path-icon">
              <CoverLeafMark />
            </div>
            <div>
              <div>Your Path Forward</div>
              <p>{insights.pathForward}</p>
            </div>
          </div>
        </article>

        <div className="personalized-page-number" aria-hidden="true">06</div>
      </div>
    </section>
  );
}

function AtAGlancePage({ ebook, nextHref }: { ebook: Ebook; nextHref: string }) {
  const metrics = getAtGlanceMetrics(ebook);
  const nextStep = getNextBestStepCopy(ebook);

  return (
    <section className="cover ebook-glance-page" id="at-a-glance" aria-label="At a glance">
      <div className="ebook-glance-sheet">
        <div className="glance-topline">ZenPlato <span>|</span> 02 Health Snapshot</div>
        <div className="glance-top-rule" aria-hidden="true" />
        <FocusSprig className="glance-top-sprig" />

        <div className="glance-hero">
          <h2>At a Glance</h2>
          <div className="glance-title-rule" aria-hidden="true" />
          <p>A quick overview of your<br />current health insights.</p>
        </div>

        <div className="glance-card-grid">
          {metrics.map((metric) => (
            <article className="glance-card" key={metric.label}>
              <div className="glance-icon-medallion">
                <GlanceMetricIcon type={metric.icon} />
              </div>
              <div className="glance-value">{metric.value}</div>
              <div className="glance-card-rule" aria-hidden="true" />
              <h3>{metric.label}</h3>
              <p>{metric.description}</p>
            </article>
          ))}
        </div>

        <div className="glance-lower-rule" aria-hidden="true" />

        <div className="glance-next">
          <div className="glance-next-label">Your Next Best Step</div>
          <div className="glance-next-rule" aria-hidden="true" />
          <h3>{nextStep.headline}</h3>
          <p>{nextStep.body}</p>
          <a href={nextHref} className="glance-cta">
            <span>{nextStep.cta}</span>
            <ArrowRight size={28} strokeWidth={1.6} />
          </a>
        </div>

        <GlanceBranch />

        <div className="glance-page-number" aria-hidden="true">07</div>
      </div>
    </section>
  );
}

const getApiStatus = (error: unknown) => {
  if (typeof error !== "object" || error === null) return undefined;
  return (error as { response?: { status?: number } }).response?.status;
};

const PHONE_EBOOK_CSS = `
  .phone-ebook-shell {
    position: relative;
    width: 100vw;
    height: 100dvh;
    overflow: hidden;
    background: #F7F1E8;
  }

  .phone-ebook-track {
    display: flex;
    width: 100vw;
    height: 100dvh;
    overflow-x: auto;
    overflow-y: hidden;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    scrollbar-width: none;
    overscroll-behavior-x: contain;
    touch-action: pan-x pinch-zoom;
  }

  .phone-ebook-track::-webkit-scrollbar { display: none; }

  .phone-ebook-track > .cover {
    flex: 0 0 100vw;
    width: 100vw;
    min-width: 100vw;
    height: 100dvh;
    min-height: 100dvh;
    scroll-snap-align: start;
    scroll-snap-stop: always;
  }

  .phone-ebook-track > .cover > div:first-child {
    width: 100%;
    height: 100%;
    min-height: 100%;
  }

  .phone-ebook-track > .phone-findings-intro .findings-card-stack { display: none; }
  .phone-ebook-track > .phone-findings-intro .findings-left { width: 72cqw; }
  .phone-ebook-track > .phone-findings-details .findings-left { display: none; }
  .phone-ebook-track > .phone-findings-details .findings-card-stack {
    left: 8cqw;
    right: 8cqw;
    width: auto;
  }

  .phone-ebook-controls {
    position: fixed;
    z-index: 120;
    left: 50%;
    bottom: max(12px, 2.2dvh);
    display: flex;
    align-items: center;
    gap: 18px;
    transform: translateX(-50%);
  }

  .phone-ebook-controls button {
    display: grid;
    width: 42px;
    height: 42px;
    place-items: center;
    border: 1px solid rgba(255, 255, 255, .75);
    border-radius: 999px;
    background: rgba(250, 247, 239, .88);
    box-shadow: 0 5px 20px rgba(41, 35, 26, .1);
    color: #3F5247;
    font: 400 30px/1 Georgia, serif;
    backdrop-filter: blur(8px);
  }

  .phone-ebook-controls button:disabled {
    opacity: 0;
    pointer-events: none;
  }

  .phone-ebook-controls button:focus-visible {
    outline: 2px solid #3F5247;
    outline-offset: 2px;
  }

  .phone-ebook-controls span {
    min-width: 58px;
    color: #26331F;
    font: 600 12px/1 var(--sans);
    letter-spacing: .12em;
    text-align: center;
  }

  .phone-ebook-live {
    position: fixed;
    width: 1px;
    height: 1px;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
  }

  @media (prefers-reduced-motion: reduce) {
    .phone-ebook-track { scroll-behavior: auto; }
  }
`;

/**
 * Phone reader for the supplied portrait page set. Page text and simple line
 * art remain real DOM/SVG; the existing /public/ebook artwork files are kept
 * as images because they contain the complex photography and compositions.
 */
// Kept as an internal compatibility reader while /app/ebook/mobile owns the routed phone experience.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function PhoneEbookReader() {
  const { user } = useAuth();
  const readerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const ebook = buildFallbackEbook(user);
  const plan = user?.health_plan || {};
  const colors = CONDITION_COLORS[ebook.condition_id] || CONDITION_COLORS["anti-inflammatory"];
  const pages = [
    <section className="cover ebook-cover-page" id="phone-cover" aria-label="Personalized ebook cover" key="cover">
      <div className="ebook-cover-sheet">
        <Image src="/ebook/cover-hero.png" alt="" fill priority sizes="100vw" className="ebook-cover-photo" aria-hidden="true" />
        <div className="ebook-cover-wash" aria-hidden="true" />
        <div className="ebook-cover-content">
          <div className="cover-section-label"><CoverLeafMark /><span>Section 01 - Your Personalized {resolveCoverCondition(ebook, user)} Blueprint</span></div>
          <h1 className="cover-title">Your<span>Personalized</span><span>{resolveCoverCondition(ebook, user)}</span><span>Blueprint</span></h1>
          <div className="cover-kicker">Eat with intention. Heal with food.</div>
          <div className="cover-rule" aria-hidden="true" />
          <p className="cover-personalization">{getCoverPersonalization(user, ebook, plan)}</p>
          <div className="cover-brand"><div className="cover-brand-name">Zen</div><div className="cover-brand-subtitle">Your food intelligence companionship</div></div>
          <blockquote className="cover-quote">&ldquo;I&rsquo;m not here to guide your meals. I&rsquo;m here to understand you, support you, and grow with you.&rdquo;</blockquote>
        </div>
        <div className="cover-page-number" aria-hidden="true">01</div>
      </div>
    </section>,
    <NoteForYouPage ebook={ebook} user={user} plan={plan} key="note" />,
    <HealthSnapshotPage ebook={ebook} user={user} key="snapshot" />,
    <KeyFindingsPage ebook={ebook} user={user} phonePanel="intro" key="findings-intro" />,
    <KeyFindingsPage ebook={ebook} user={user} phonePanel="details" key="findings-details" />,
    <KeyHealthFocusAreasPage ebook={ebook} key="focus" />,
    <PersonalizedInsightsPage ebook={ebook} user={user} plan={plan} key="insights" />,
    <AtAGlancePage ebook={ebook} nextHref="#phone-food-guide" key="glance" />,
    <OpportunityPage ebook={ebook} opportunityIndex={2} phonePanel key="opportunity-three" />,
    <OpportunityPage ebook={ebook} opportunityIndex={0} phonePanel key="opportunity-one" />,
    <GroceryEssentialsPage ebook={ebook} key="grocery" />,
    <UnderstandingJourneyPage ebook={ebook} user={user} key="understanding-journey" />,
    <UnderstandingDetailPage ebook={ebook} user={user} key="understanding-detail" />,
    <WhySymptomsHappenPage ebook={ebook} key="symptoms" />,
    <NutritionInfluencePage ebook={ebook} key="nutrition-influence" />,
    <CommonPcosChallengesPage key="challenges" />,
    <ZenplatoFrameworkPage key="framework" />,
    <FoodNutritionGuidePage key="food-guide" />,
    <FoodsToBeMindfulPage ebook={ebook} plan={plan} key="mindful" />,
    <FoodsToPrioritizePage ebook={ebook} plan={plan} key="prioritize" />,
    <BalancedPlatePage key="plate" />,
    <HydrationRecommendationsPage ebook={ebook} key="hydration" />,
    <MealTimingGuidancePage ebook={ebook} key="meal-timing" />,
    <SustainableRhythmPage ebook={ebook} key="rhythm" />,
    <SmartFoodSwapsPage ebook={ebook} key="swaps" />,
    <SmartSwapsContinuedPage ebook={ebook} key="swaps-continued" />,
    <LifestyleFoundationPage key="lifestyle" />,
    <SleepRecoveryPage key="sleep" />,
    <StressWellbeingPage ebook={ebook} key="stress" />,
    <DailyWellnessHabitsPage ebook={ebook} key="wellness" />,
    <PerfectionConsistencyPage key="consistency" />,
    <RecipeCollectionSectionPage key="recipe-section" />,
    <RecipeCollectionIntroPage ebook={ebook} key="recipe-intro" />,
    <BreakfastsPage ebook={ebook} key="breakfasts" />,
    <BreakfastNutritionPage ebook={ebook} key="breakfast-nutrition" />,
    <BreakfastBenefitsPage ebook={ebook} key="breakfast-benefits" />,
    <BreakfastIngredientsMethodPage ebook={ebook} key="breakfast-ingredients" />,
    <BreakfastMethodCookingPage ebook={ebook} key="breakfast-method" />,
    <SmartSnacksIngredientsPage ebook={ebook} key="snack-ingredients" />,
    <SmartSnacksCardsPage ebook={ebook} key="snacks" />,
    <NourishingBeveragesPage ebook={ebook} key="beverages" />,
    <FruitCatalogPage ebook={ebook} key="fruits" />,
    <VegetableCatalogPage ebook={ebook} key="vegetables" />,
    <ActionPlan30DayPage ebook={ebook} key="action-plan" />,
  ];

  const goToPage = useCallback((page: number) => {
    const nextPage = Math.max(0, Math.min(pages.length - 1, page));
    const reader = readerRef.current;
    if (reader) reader.scrollTo({ left: reader.clientWidth * nextPage, behavior: "smooth" });
    setCurrentPage(nextPage);
  }, [pages.length]);

  useEffect(() => {
    const reader = readerRef.current;
    if (!reader) return;
    const updatePage = () => setCurrentPage(Math.max(0, Math.min(pages.length - 1, Math.round(reader.scrollLeft / Math.max(reader.clientWidth, 1)))));
    reader.addEventListener("scroll", updatePage, { passive: true });
    window.addEventListener("resize", updatePage);
    return () => {
      reader.removeEventListener("scroll", updatePage);
      window.removeEventListener("resize", updatePage);
    };
  }, [pages.length]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") goToPage(currentPage - 1);
      if (event.key === "ArrowRight") goToPage(currentPage + 1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [currentPage, goToPage]);

  return (
    <main className="phone-ebook-shell zen-wrapper" style={{ "--clay": colors.clay, "--forest": colors.forest, "--accent": colors.accent } as React.CSSProperties} aria-label="ZenPlato phone ebook">
      <style>{ZENPLATO_CSS}</style>
      <style>{PHONE_EBOOK_CSS}</style>
      <div ref={readerRef} className="phone-ebook-track">{pages}</div>
      <nav className="phone-ebook-controls" aria-label="Ebook page navigation">
        <button type="button" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 0} aria-label="Previous page">‹</button>
        <span>{String(currentPage + 1).padStart(2, "0")} / {String(pages.length).padStart(2, "0")}</span>
        <button type="button" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === pages.length - 1} aria-label="Next page">›</button>
      </nav>
      <div className="phone-ebook-live" aria-live="polite">Page {currentPage + 1} of {pages.length}</div>
    </main>
  );
}

function MobileReaderLink() {
  return (
    <Link
      href="/app/ebook/mobile"
      className="fixed right-4 top-[max(1rem,env(safe-area-inset-top))] z-[80] inline-flex items-center gap-2 rounded-full border border-[#DCD0BD] bg-[#F7F1E8]/95 px-4 py-2.5 text-xs font-bold text-[#26211B] shadow-lg shadow-[#26211B]/10 transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BC5B38]"
    >
      <BookOpen size={16} aria-hidden="true" /> Open phone reader
    </Link>
  );
}

function EbookHomeLink({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link
      href="/app"
      className={`fixed left-4 top-[max(1rem,env(safe-area-inset-top))] z-[80] inline-flex items-center gap-1.5 rounded-full border px-4 py-2.5 text-xs font-bold shadow-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BC5B38] ${
        inverse
          ? "border-white/15 bg-[#26211B]/90 text-white shadow-black/20 hover:bg-[#3F5247]"
          : "border-[#DCD0BD] bg-[#F7F1E8]/95 text-[#26211B] shadow-[#26211B]/10 hover:bg-white"
      }`}
      aria-label="Back to home"
    >
      <ChevronLeft size={16} aria-hidden="true" /> Home
    </Link>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────────────── */
export default function EbookPage() {
  const { user } = useAuth();
  const [view, setView] = useState<'loading' | 'summary' | 'choice' | 'questionnaire' | 'generating' | 'reader'>('loading');
  const [ebook, setEbook] = useState<Ebook | null>(null);
  const [isNavVisible, setIsNavVisible] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [generationError, setGenerationError] = useState("");

  // Questionnaire state
  const [premiumAnswers, setPremiumAnswers] = useState<PremiumAnswers>({
    aspiration: "",
    flavor: "",
    time: "",
    why: ""
  });

  const chapterRefs = useRef<Record<number, HTMLElement | null>>({});

  const openFallbackSummary = useCallback(() => {
    setEbook({ ...buildFallbackEbook(user), is_premium: false });
    setView('summary');
  }, [user]);

  const fetchEbook = useCallback(async () => {
    try {
      // Check if user has a premium ebook already
      if (user?.is_premium) {
        const premiumRes = await api.get("/ebook/me?type=premium").catch(() => null);
        if (premiumRes?.data?.is_premium) {
          setEbook(premiumRes.data);
          setView('reader');
          return;
        }
      }

      // Otherwise check general
      const generalRes = await api.get("/ebook/me").catch(() => null);
      if (generalRes?.data) {
        setEbook({ ...generalRes.data, is_premium: Boolean(generalRes.data.is_premium && user?.is_premium) });
        setView('summary');
      } else {
        openFallbackSummary();
      }
    } catch {
      openFallbackSummary();
    }
  }, [openFallbackSummary, user?.is_premium]);

  useEffect(() => {
    fetchEbook();
  }, [fetchEbook]);

  /* Scroll effects */
  useEffect(() => {
    if (view !== 'reader') return;
    const handleScroll = () => {
      const h = document.documentElement;
      const st = window.pageYOffset || h.scrollTop;
      const sh = h.scrollHeight || document.body.scrollHeight;
      const ch = h.clientHeight;
      setScrollProgress((st / (sh - ch)) * 100);
      setIsNavVisible(st > window.innerHeight * 0.7);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [view]);

  const handlePremiumGenerate = async () => {
    setGenerationError("");
    setView('generating');

    try {
      const res = await api.post("/ebook/craft", premiumAnswers);
      setEbook(res.data);
      setView('reader');
    } catch (error) {
      setGenerationError(
        getApiStatus(error) === 403
          ? "A premium account is required to generate your personalized ebook."
          : "We could not generate your personalized ebook. Please try again.",
      );
      setView('questionnaire');
    }
  };

  const plan = user?.health_plan || {};
  const summaryInsights = ebook ? [
    {
      label: "Key findings",
      value: ebook.summary.goal_30day || plan.summary || "Your habits, food preferences and health goals are ready for a guided starting plan.",
    },
    {
      label: "Nutrition insights",
      value: ebook.summary.focus_points?.[0] || plan.analysis || "Your profile benefits from steady meals, whole-food anchors and simple repeatable routines.",
    },
    {
      label: "Foods to prioritize",
      value: (plan.foods_to_eat || ebook.summary.focus_points || ["Balanced proteins", "Fiber-rich plants", "Hydrating meals"]).slice(0, 4).join(", "),
    },
    {
      label: "Foods to limit",
      value: (plan.foods_to_avoid || ebook.summary.diet?.allergies || ["Refined sugar", "Ultra-processed snacks"]).slice(0, 4).join(", "),
    },
    {
      label: "Starter action plan",
      value: Array.isArray(plan.food_rules) && plan.food_rules.length ? plan.food_rules.slice(0, 2).join(" ") : "Start with regular meal timing, a protein source at each meal, and one planned grocery list.",
    },
  ] : [];
  const canOpenPremiumReader = Boolean(user?.is_premium && ebook?.is_premium);

  if (view === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F7F1E8]">
        <EbookHomeLink />
        <motion.div 
          animate={{ rotateY: [0, 180, 360], scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-6xl"
        >
          📖
        </motion.div>
      </div>
    );
  }

  /* ─── Personalised Summary View ───────────────────────────────────────── */
  if (view === 'summary' && ebook) {
    return (
      <div className="min-h-screen bg-[#F7F1E8] p-5 md:p-8 flex items-center justify-center relative overflow-hidden">
        <style>{ZENPLATO_CSS}</style>
        <BotanicalSVG />
        <EbookHomeLink />
        <MobileReaderLink />

        <div className="relative z-10 w-full max-w-5xl">
          <Reveal y={-16}>
            <div className="mb-8 md:mb-10">
              <span className="inline-flex rounded-full border border-[#DCD0BD] px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C8071]">
                Your ZenPlato report preview
              </span>
              <h1 className="mt-5 max-w-3xl font-serif text-4xl md:text-6xl leading-[1.04] text-[#26211B]">
                {ebook.summary.greeting}. Your {ebook.summary.condition_label || ebook.condition_label} plan is ready.
              </h1>
              <p className="mt-5 max-w-2xl text-[#5E5447] text-base md:text-lg leading-relaxed">
                {ebook.summary.condition_blurb}
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-5 md:gap-6">
            <Reveal delay={0.1}>
              <div className="bg-white/78 border border-[#DCD0BD] rounded-[28px] p-5 md:p-8 shadow-xl shadow-[#26211B]/5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {summaryInsights.map((item) => (
                    <div key={item.label} className="rounded-2xl bg-[#F7F1E8] border border-[#DCD0BD]/70 p-5">
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#BC5B38]">{item.label}</p>
                      <p className="m-0 text-sm leading-relaxed text-[#26211B]/78">{item.value}</p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setView('questionnaire')}
                  className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#26211B] px-7 py-4 text-sm font-bold text-white transition hover:bg-[#3F5247]"
                >
                  Create My Personalized Ebook <BookOpen size={18} />
                </button>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="bg-[#26211B] rounded-[28px] p-6 md:p-8 shadow-2xl relative overflow-hidden">
                <Sparkles className="absolute right-6 top-6 text-[#BC5B38]/25" size={92} />
                <p className="relative text-[10px] font-bold uppercase tracking-[0.2em] text-[#BC5B38] mb-4">
                  There is more beneath the surface
                </p>
                <h2 className="relative font-serif text-3xl md:text-4xl leading-tight text-[#F7F1E8] mb-4">
                  Unlock your personalised premium blueprint.
                </h2>
                <p className="relative text-sm leading-relaxed text-[#F7F1E8]/62 mb-6">
                  The premium ebook reveals deeper condition guidance, personalised recipes, grocery lists, food swaps, nutrition strategies, lifestyle recommendations and practical steps to follow.
                </p>
                <ul className="relative space-y-3 mb-8">
                  {["Foods to prioritize", "Foods to be mindful of", "Personalized recipes", "Grocery lists", "Lifestyle recommendations"].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-[#F7F1E8]/72">
                      <Check size={15} className="text-[#BC5B38]" /> {item}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setView('questionnaire')}
                  className="relative inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#BC5B38] px-7 py-4 text-sm font-bold text-white transition hover:bg-[#A94F31]"
                >
                  Personalize My Premium Ebook <ArrowRight size={18} />
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    );
  }

  /* ─── Choice View ─────────────────────────────────────────────────────── */
  if (view === 'choice') {
    return (
      <div className="min-h-screen bg-[#F7F1E8] p-6 flex flex-col items-center justify-center relative overflow-hidden">
        <style>{ZENPLATO_CSS}</style>
        <BotanicalSVG />
        <EbookHomeLink />
        <MobileReaderLink />
        
        <Reveal y={-20}>
          <div className="text-center mb-12">
            <h2 className="font-serif text-5xl text-[#26211B] mb-4">Choose Your Path</h2>
            <p className="text-[#5E5447] text-lg max-w-md mx-auto">Select the guide that matches your commitment level today.</p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full">
          {/* General Card */}
          <motion.div 
            whileHover={{ y: -10, rotateY: -5 }}
            className="bg-white/60 backdrop-blur rounded-[40px] p-10 border border-[#DCD0BD] shadow-xl flex flex-col cursor-pointer group"
            onClick={() => setView('summary')}
          >
            <div className="w-16 h-16 bg-[#F7F1E8] rounded-2xl flex items-center justify-center mb-6">
              <BookOpen className="text-[#8C8071]" />
            </div>
            <h3 className="font-serif text-3xl mb-4">The Essential Handbook</h3>
            <p className="text-[#5E5447] mb-8 flex-grow">A comprehensive, evidence-based guide tailored to your primary condition.</p>
            <ul className="space-y-3 mb-10">
              {["16 Chapters", "Standard Nutrition", "Lifestyle Tips"].map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-[#8C8071]">
                  <Check size={14} className="text-[#3F5247]" /> {f}
                </li>
              ))}
            </ul>
            <button className="w-full py-4 bg-transparent border border-[#DCD0BD] rounded-full font-bold text-[#26211B] group-hover:bg-[#26211B] group-hover:text-white transition-all flex items-center justify-center gap-2">
              View Free Preview <ArrowRight size={18} />
            </button>
          </motion.div>

          {/* Premium Card */}
          <motion.div 
            whileHover={{ y: -10, rotateY: 5 }}
            className="bg-[#26211B] rounded-[40px] p-10 shadow-2xl flex flex-col relative overflow-hidden group cursor-pointer"
            onClick={() => setView('questionnaire')}
          >
            <div className="absolute top-0 right-0 p-8 opacity-20">
              <Sparkles size={120} className="text-[#BC5B38]" />
            </div>
            <div className="w-16 h-16 bg-[#BC5B38]/20 rounded-2xl flex items-center justify-center mb-6">
              <Sparkles className="text-[#BC5B38]" />
            </div>
            <h3 className="font-serif text-3xl text-[#F7F1E8] mb-4">The AI Alchemist Guide</h3>
            <p className="text-[#8C8071] mb-8 flex-grow">A hyper-personalised, AI-crafted masterpiece that evolves with your unique goals.</p>
            <ul className="space-y-3 mb-10">
              {["100% Personalised", "Goal-Specific AI Content", "Deep Biological Insights"].map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-[#F7F1E8]/60">
                  <Check size={14} className="text-[#BC5B38]" /> {f}
                </li>
              ))}
            </ul>
            <button className="w-full py-4 bg-[#BC5B38] text-white rounded-full font-bold shadow-lg shadow-[#BC5B38]/30 group-hover:scale-105 transition-all flex items-center justify-center gap-2">
              Personalize My Premium Ebook <ArrowRight size={18} />
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  /* ─── Questionnaire View ──────────────────────────────────────────────── */
  if (view === 'questionnaire') {
    return (
      <div className="min-h-screen bg-[#F7F1E8] p-6 flex items-center justify-center">
        <style>{ZENPLATO_CSS}</style>
        <EbookHomeLink />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full bg-white/80 backdrop-blur-md rounded-[48px] p-12 border border-[#DCD0BD] shadow-2xl"
        >
          <button onClick={() => setView('choice')} className="flex items-center gap-2 text-[#8C8071] mb-8 hover:text-[#26211B] transition-colors">
            <ChevronLeft size={18} /> Back
          </button>
          
          <div className="mb-10">
            <span className="text-[#BC5B38] font-bold text-xs uppercase tracking-[0.2em] block mb-2">Personalisation Phase</span>
            <h2 className="font-serif text-4xl text-[#26211B]">Fine-tuning your AI.</h2>
          </div>

          {generationError && (
            <p role="alert" className="mb-6 rounded-2xl border border-[#BC5B38]/30 bg-[#BC5B38]/10 px-4 py-3 text-sm text-[#8C3D21]">
              {generationError}
            </p>
          )}

          <div className="space-y-8">
            <div>
              <label className="block text-sm font-bold text-[#26211B] mb-3 flex items-center gap-2">
                <Target size={16} className="text-[#BC5B38]" /> What's your primary aspiration?
              </label>
              <select 
                value={premiumAnswers.aspiration}
                onChange={e => setPremiumAnswers({...premiumAnswers, aspiration: e.target.value})}
                className="w-full bg-[#F7F1E8] border border-[#DCD0BD] rounded-2xl p-4 text-[#26211B] focus:ring-2 focus:ring-[#BC5B38] outline-none"
              >
                <option value="">Select an aspiration...</option>
                <option value="boundless-energy">Boundless Energy</option>
                <option value="zero-bloating">Zero Bloating & Gut Comfort</option>
                <option value="mental-clarity">Peak Mental Clarity</option>
                <option value="weight-freedom">Sustainable Weight Freedom</option>
                <option value="hormonal-peace">Balanced Hormones & Calm</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#26211B] mb-3 flex items-center gap-2">
                <Heart size={16} className="text-[#BC5B38]" /> Which flavor palette speaks to you?
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['Mediterranean', 'Spiced & Warm', 'Fresh & Green', 'Bold & Umami'].map(p => (
                  <button 
                    key={p}
                    onClick={() => setPremiumAnswers({...premiumAnswers, flavor: p})}
                    className={`py-3 px-4 rounded-xl border text-sm transition-all ${premiumAnswers.flavor === p ? 'bg-[#BC5B38] text-white border-[#BC5B38]' : 'bg-[#F7F1E8] text-[#5E5447] border-[#DCD0BD]'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#26211B] mb-3 flex items-center gap-2">
                <Clock size={16} className="text-[#BC5B38]" /> Cooking time on busy days?
              </label>
              <div className="flex gap-3">
                {['5m', '15m', '30m+'].map(t => (
                  <button 
                    key={t}
                    onClick={() => setPremiumAnswers({...premiumAnswers, time: t})}
                    className={`flex-1 py-3 rounded-xl border text-sm transition-all ${premiumAnswers.time === t ? 'bg-[#BC5B38] text-white border-[#BC5B38]' : 'bg-[#F7F1E8] text-[#5E5447] border-[#DCD0BD]'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <button 
              disabled={!premiumAnswers.aspiration || !premiumAnswers.flavor || !premiumAnswers.time}
              onClick={handlePremiumGenerate}
              className="w-full py-5 bg-[#26211B] text-white rounded-full font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#3F5247] transition-all flex items-center justify-center gap-3"
            >
              Craft My Premium Guide <Sparkles size={20} />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  /* ─── Generating View ─────────────────────────────────────────────────── */
  if (view === 'generating') {
    return (
      <div className="min-h-screen bg-[#26211B] flex flex-col items-center justify-center p-8 text-center">
        <style>{ZENPLATO_CSS}</style>
        <EbookHomeLink inverse />
        
        {/* 3D Animated Elements */}
        <div className="relative w-64 h-64 mb-12">
          <motion.div 
            animate={{ rotateY: 360, rotateZ: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            style={{ transformStyle: "preserve-3d" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-48 h-64 bg-[#BC5B38] rounded-r-2xl border-2 border-[#DCD0BD]/20 shadow-2xl relative">
              <div className="absolute left-0 top-0 bottom-0 w-4 bg-[#8C3D21] rounded-r-sm shadow-inner" />
              <div className="absolute inset-4 border border-white/10 rounded-lg flex flex-col justify-center items-center text-white">
                <Sparkles size={48} className="mb-4 opacity-50" />
                <div className="text-[8px] tracking-[0.4em] font-bold opacity-30">ALCHEMIST</div>
              </div>
            </div>
          </motion.div>
          
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                y: [-20, 20], 
                x: [-20, 20],
                opacity: [0, 1, 0],
                scale: [0.5, 1.5, 0.5]
              }}
              transition={{ 
                duration: 2 + i, 
                repeat: Infinity, 
                delay: i * 0.4 
              }}
              className="absolute text-[#BC5B38] opacity-0"
              style={{ 
                left: `${Math.random() * 100}%`, 
                top: `${Math.random() * 100}%` 
              }}
            >
              <Sparkles size={16} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-md"
        >
          <h2 className="font-serif text-3xl text-[#F7F1E8] mb-4">AI Alchemist at work...</h2>
          <p className="text-[#8C8071] leading-relaxed">
            We're synthesising biological data, culinary preferences, and health goals into your unique nutritional blueprint. This takes about 30 seconds.
          </p>
          
          <div className="mt-12 flex justify-center gap-2">
            {[0, 1, 2].map(i => (
              <motion.div 
                key={i}
                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                className="w-2 h-2 rounded-full bg-[#BC5B38]"
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  /* ─── Reader View ─────────────────────────────────────────────────────── */
  if (view === 'reader' && !canOpenPremiumReader) {
    return (
      <div className="min-h-screen bg-[#F7F1E8] p-6 flex items-center justify-center relative overflow-hidden">
        <style>{ZENPLATO_CSS}</style>
        <BotanicalSVG />
        <EbookHomeLink />
        <MobileReaderLink />

        <div className="relative z-10 max-w-xl w-full bg-white/80 border border-[#DCD0BD] rounded-[32px] p-8 md:p-10 shadow-xl shadow-[#26211B]/5 text-center">
          <Sparkles className="mx-auto mb-5 text-[#BC5B38]" size={42} />
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#BC5B38]">
            Premium guide locked
          </p>
          <h2 className="font-serif text-3xl md:text-5xl leading-tight text-[#26211B] mb-4">
            Upgrade to open the full image ebook.
          </h2>
          <p className="text-sm md:text-base leading-relaxed text-[#5E5447] mb-8">
            Your free preview stays available here, while the full personalised premium blueprint is reserved for premium accounts.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              onClick={() => setView('summary')}
              className="inline-flex items-center justify-center rounded-full border border-[#DCD0BD] px-6 py-3 text-sm font-bold text-[#26211B] transition hover:bg-[#F7F1E8]"
            >
              Free Preview
            </button>
            <button
              onClick={() => setView('questionnaire')}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#BC5B38] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#A94F31]"
            >
              Unlock Premium <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!ebook) return null;
  const colors = CONDITION_COLORS[ebook.condition_id] || CONDITION_COLORS["anti-inflammatory"];
  const coverCondition = resolveCoverCondition(ebook, user);
  const coverPersonalization = getCoverPersonalization(user, ebook, plan);
  const visibleChapters = ebook.chapters.filter((chapter) => !isOpeningNoteChapter(chapter) && !isHealthSnapshotChapter(chapter) && !isKeyFindingsChapter(chapter) && !isFocusAreasChapter(chapter) && !isPersonalizedInsightsChapter(chapter) && !isAtAGlanceChapter(chapter) && !isOpportunityChapter(chapter) && !isUnderstandingJourneyChapter(chapter) && !isWhySymptomsChapter(chapter) && !isNutritionInfluenceChapter(chapter) && !isCommonPcosChallengesChapter(chapter) && !isZenplatoFrameworkChapter(chapter) && !isFoodNutritionGuideChapter(chapter) && !isFoodsToPrioritizeChapter(chapter) && !isFoodsToBeMindfulChapter(chapter) && !isBalancedPlateChapter(chapter) && !isHydrationChapter(chapter) && !isMealTimingChapter(chapter) && !isSmartFoodSwapsChapter(chapter) && !isLifestyleFoundationChapter(chapter) && !isSleepRecoveryChapter(chapter) && !isStressWellbeingChapter(chapter) && !isDailyWellnessChapter(chapter) && !isConsistencyChapter(chapter) && !isRecipeCollectionChapter(chapter) && !isBreakfastRecipeChapter(chapter) && !isSnackBeverageGroceryChapter(chapter) && !isActionPlanChapter(chapter) && !isNextChapterChapter(chapter));
  const firstContentHref = "#food-nutrition-guide";

  return (
    <div className="zen-wrapper" style={{ 
      "--clay": colors.clay,
      "--forest": colors.forest,
      "--accent": colors.accent
    } as React.CSSProperties}>
      <style>{ZENPLATO_CSS}</style>
      <EbookHomeLink />
      <MobileReaderLink />

      {/* Progress bar */}
      <div className="progress" style={{ width: `${scrollProgress}%` }} />

      {/* Navigation */}
      <nav className={`nav ${isNavVisible ? "show" : ""}`}>
        <div className="flex items-center gap-4">
          <div className="font-bold tracking-[0.3em] text-xs">ZEN <span>·</span> PLATO</div>
          <button 
            onClick={() => setView('choice')}
            className="text-[10px] font-bold uppercase tracking-widest text-[#8C8071] hover:text-[#26211B] transition-colors"
          >
            Switch Guide
          </button>
        </div>
        <button className="text-xs font-bold uppercase tracking-widest bg-[#26211B] text-white px-6 py-2 rounded-full" onClick={() => setIsDrawerOpen(true)}>
          Contents
        </button>
      </nav>

      {/* Drawer */}
      <aside className={`drawer ${isDrawerOpen ? "open" : ""}`}>
        <button className="absolute top-8 right-8 text-2xl" onClick={() => setIsDrawerOpen(false)}>×</button>
        <h4 className="text-[10px] tracking-[0.3em] uppercase text-[#8C8071] mb-12">Navigation</h4>
        <div className="space-y-6">
          <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({top:0, behavior:'smooth'}); setIsDrawerOpen(false); }} className="block font-serif text-2xl hover:text-[#BC5B38] transition-colors">Cover</a>
          <a href="#note" onClick={(e) => { e.preventDefault(); const el = document.getElementById('note'); if(el) window.scrollTo({top: el.offsetTop - 80, behavior:'smooth'}); setIsDrawerOpen(false); }} className="flex items-baseline gap-4 group">
            <span className="text-xs font-serif italic text-[#BC5B38]">02</span>
            <span className="text-lg font-medium group-hover:pl-2 transition-all">A Note For You</span>
          </a>
          <a href="#health-snapshot" onClick={(e) => { e.preventDefault(); const el = document.getElementById('health-snapshot'); if(el) window.scrollTo({top: el.offsetTop - 80, behavior:'smooth'}); setIsDrawerOpen(false); }} className="flex items-baseline gap-4 group">
            <span className="text-xs font-serif italic text-[#BC5B38]">03</span>
            <span className="text-lg font-medium group-hover:pl-2 transition-all">Your Health Snapshot</span>
          </a>
          <a href="#key-findings" onClick={(e) => { e.preventDefault(); const el = document.getElementById('key-findings'); if(el) window.scrollTo({top: el.offsetTop - 80, behavior:'smooth'}); setIsDrawerOpen(false); }} className="flex items-baseline gap-4 group">
            <span className="text-xs font-serif italic text-[#BC5B38]">04</span>
            <span className="text-lg font-medium group-hover:pl-2 transition-all">Your Key Findings</span>
          </a>
          <a href="#focus-areas" onClick={(e) => { e.preventDefault(); const el = document.getElementById('focus-areas'); if(el) window.scrollTo({top: el.offsetTop - 80, behavior:'smooth'}); setIsDrawerOpen(false); }} className="flex items-baseline gap-4 group">
            <span className="text-xs font-serif italic text-[#BC5B38]">05</span>
            <span className="text-lg font-medium group-hover:pl-2 transition-all">Key Health Focus Areas</span>
          </a>
          <a href="#personalized-insights" onClick={(e) => { e.preventDefault(); const el = document.getElementById('personalized-insights'); if(el) window.scrollTo({top: el.offsetTop - 80, behavior:'smooth'}); setIsDrawerOpen(false); }} className="flex items-baseline gap-4 group">
            <span className="text-xs font-serif italic text-[#BC5B38]">06</span>
            <span className="text-lg font-medium group-hover:pl-2 transition-all">Personalized Insights</span>
          </a>
          <a href="#at-a-glance" onClick={(e) => { e.preventDefault(); const el = document.getElementById('at-a-glance'); if(el) window.scrollTo({top: el.offsetTop - 80, behavior:'smooth'}); setIsDrawerOpen(false); }} className="flex items-baseline gap-4 group">
            <span className="text-xs font-serif italic text-[#BC5B38]">07</span>
            <span className="text-lg font-medium group-hover:pl-2 transition-all">At a Glance</span>
          </a>
          <a href="#biggest-opportunities" onClick={(e) => { e.preventDefault(); const el = document.getElementById('biggest-opportunities'); if(el) window.scrollTo({top: el.offsetTop - 80, behavior:'smooth'}); setIsDrawerOpen(false); }} className="flex items-baseline gap-4 group">
            <span className="text-xs font-serif italic text-[#BC5B38]">08</span>
            <span className="text-lg font-medium group-hover:pl-2 transition-all">Biggest Opportunities</span>
          </a>
          <a href="#understanding-journey" onClick={(e) => { e.preventDefault(); const el = document.getElementById('understanding-journey'); if(el) window.scrollTo({top: el.offsetTop - 80, behavior:'smooth'}); setIsDrawerOpen(false); }} className="flex items-baseline gap-4 group">
            <span className="text-xs font-serif italic text-[#BC5B38]">11</span>
            <span className="text-lg font-medium group-hover:pl-2 transition-all">Understanding {coverCondition}</span>
          </a>
          <a href="#understanding-pcos" onClick={(e) => { e.preventDefault(); const el = document.getElementById('understanding-pcos'); if(el) window.scrollTo({top: el.offsetTop - 80, behavior:'smooth'}); setIsDrawerOpen(false); }} className="flex items-baseline gap-4 group">
            <span className="text-xs font-serif italic text-[#BC5B38]">13</span>
            <span className="text-lg font-medium group-hover:pl-2 transition-all">What {coverCondition} Means</span>
          </a>
          <a href="#why-symptoms-happen" onClick={(e) => { e.preventDefault(); const el = document.getElementById('why-symptoms-happen'); if(el) window.scrollTo({top: el.offsetTop - 80, behavior:'smooth'}); setIsDrawerOpen(false); }} className="flex items-baseline gap-4 group">
            <span className="text-xs font-serif italic text-[#BC5B38]">14</span>
            <span className="text-lg font-medium group-hover:pl-2 transition-all">Why Symptoms Happen</span>
          </a>
          <a href="#nutrition-influence" onClick={(e) => { e.preventDefault(); const el = document.getElementById('nutrition-influence'); if(el) window.scrollTo({top: el.offsetTop - 80, behavior:'smooth'}); setIsDrawerOpen(false); }} className="flex items-baseline gap-4 group">
            <span className="text-xs font-serif italic text-[#BC5B38]">16</span>
            <span className="text-lg font-medium group-hover:pl-2 transition-all">Nutrition Influence</span>
          </a>
          <a href="#common-pcos-challenges" onClick={(e) => { e.preventDefault(); const el = document.getElementById('common-pcos-challenges'); if(el) window.scrollTo({top: el.offsetTop - 80, behavior:'smooth'}); setIsDrawerOpen(false); }} className="flex items-baseline gap-4 group">
            <span className="text-xs font-serif italic text-[#BC5B38]">19</span>
            <span className="text-lg font-medium group-hover:pl-2 transition-all">Common PCOS Challenges</span>
          </a>
          <a href="#zenplato-framework" onClick={(e) => { e.preventDefault(); const el = document.getElementById('zenplato-framework'); if(el) window.scrollTo({top: el.offsetTop - 80, behavior:'smooth'}); setIsDrawerOpen(false); }} className="flex items-baseline gap-4 group">
            <span className="text-xs font-serif italic text-[#BC5B38]">20</span>
            <span className="text-lg font-medium group-hover:pl-2 transition-all">The ZenPlato Framework</span>
          </a>
          <a href="#food-nutrition-guide" onClick={(e) => { e.preventDefault(); const el = document.getElementById('food-nutrition-guide'); if(el) window.scrollTo({top: el.offsetTop - 80, behavior:'smooth'}); setIsDrawerOpen(false); }} className="flex items-baseline gap-4 group">
            <span className="text-xs font-serif italic text-[#BC5B38]">21</span>
            <span className="text-lg font-medium group-hover:pl-2 transition-all">Food &amp; Nutrition Guide</span>
          </a>
          <a href="#foods-to-prioritize" onClick={(e) => { e.preventDefault(); const el = document.getElementById('foods-to-prioritize'); if(el) window.scrollTo({top: el.offsetTop - 80, behavior:'smooth'}); setIsDrawerOpen(false); }} className="flex items-baseline gap-4 group">
            <span className="text-xs font-serif italic text-[#BC5B38]">22</span>
            <span className="text-lg font-medium group-hover:pl-2 transition-all">Foods To Prioritize</span>
          </a>
          <a href="#foods-to-be-mindful" onClick={(e) => { e.preventDefault(); const el = document.getElementById('foods-to-be-mindful'); if(el) window.scrollTo({top: el.offsetTop - 80, behavior:'smooth'}); setIsDrawerOpen(false); }} className="flex items-baseline gap-4 group">
            <span className="text-xs font-serif italic text-[#BC5B38]">23</span>
            <span className="text-lg font-medium group-hover:pl-2 transition-all">Foods To Be Mindful Of</span>
          </a>
          <a href="#balanced-plate" onClick={(e) => { e.preventDefault(); const el = document.getElementById('balanced-plate'); if(el) window.scrollTo({top: el.offsetTop - 80, behavior:'smooth'}); setIsDrawerOpen(false); }} className="flex items-baseline gap-4 group">
            <span className="text-xs font-serif italic text-[#BC5B38]">24</span>
            <span className="text-lg font-medium group-hover:pl-2 transition-all">The Balanced Plate</span>
          </a>
          <a href="#hydration-recommendations" onClick={(e) => { e.preventDefault(); const el = document.getElementById('hydration-recommendations'); if(el) window.scrollTo({top: el.offsetTop - 80, behavior:'smooth'}); setIsDrawerOpen(false); }} className="flex items-baseline gap-4 group">
            <span className="text-xs font-serif italic text-[#BC5B38]">25</span>
            <span className="text-lg font-medium group-hover:pl-2 transition-all">Hydration Recommendations</span>
          </a>
          <a href="#meal-timing-guidance" onClick={(e) => { e.preventDefault(); const el = document.getElementById('meal-timing-guidance'); if(el) window.scrollTo({top: el.offsetTop - 80, behavior:'smooth'}); setIsDrawerOpen(false); }} className="flex items-baseline gap-4 group">
            <span className="text-xs font-serif italic text-[#BC5B38]">26</span>
            <span className="text-lg font-medium group-hover:pl-2 transition-all">Meal Timing Guidance</span>
          </a>
          <a href="#sustainable-rhythm" onClick={(e) => { e.preventDefault(); const el = document.getElementById('sustainable-rhythm'); if(el) window.scrollTo({top: el.offsetTop - 80, behavior:'smooth'}); setIsDrawerOpen(false); }} className="flex items-baseline gap-4 group">
            <span className="text-xs font-serif italic text-[#BC5B38]">27</span>
            <span className="text-lg font-medium group-hover:pl-2 transition-all">Sustainable Rhythm</span>
          </a>
          <a href="#smart-food-swaps" onClick={(e) => { e.preventDefault(); const el = document.getElementById('smart-food-swaps'); if(el) window.scrollTo({top: el.offsetTop - 80, behavior:'smooth'}); setIsDrawerOpen(false); }} className="flex items-baseline gap-4 group">
            <span className="text-xs font-serif italic text-[#BC5B38]">28</span>
            <span className="text-lg font-medium group-hover:pl-2 transition-all">Smart Food Swaps</span>
          </a>
          <a href="#smart-swaps-continued" onClick={(e) => { e.preventDefault(); const el = document.getElementById('smart-swaps-continued'); if(el) window.scrollTo({top: el.offsetTop - 80, behavior:'smooth'}); setIsDrawerOpen(false); }} className="flex items-baseline gap-4 group">
            <span className="text-xs font-serif italic text-[#BC5B38]">29</span>
            <span className="text-lg font-medium group-hover:pl-2 transition-all">Smart Swaps Continued</span>
          </a>
          <a href="#lifestyle-foundation" onClick={(e) => { e.preventDefault(); const el = document.getElementById('lifestyle-foundation'); if(el) window.scrollTo({top: el.offsetTop - 80, behavior:'smooth'}); setIsDrawerOpen(false); }} className="flex items-baseline gap-4 group">
            <span className="text-xs font-serif italic text-[#BC5B38]">30</span>
            <span className="text-lg font-medium group-hover:pl-2 transition-all">Lifestyle Foundation</span>
          </a>
          <a href="#sleep-recovery" onClick={(e) => { e.preventDefault(); const el = document.getElementById('sleep-recovery'); if(el) window.scrollTo({top: el.offsetTop - 80, behavior:'smooth'}); setIsDrawerOpen(false); }} className="flex items-baseline gap-4 group">
            <span className="text-xs font-serif italic text-[#BC5B38]">32</span>
            <span className="text-lg font-medium group-hover:pl-2 transition-all">Sleep &amp; Recovery</span>
          </a>
          <a href="#stress-wellbeing" onClick={(e) => { e.preventDefault(); const el = document.getElementById('stress-wellbeing'); if(el) window.scrollTo({top: el.offsetTop - 80, behavior:'smooth'}); setIsDrawerOpen(false); }} className="flex items-baseline gap-4 group">
            <span className="text-xs font-serif italic text-[#BC5B38]">33</span>
            <span className="text-lg font-medium group-hover:pl-2 transition-all">Stress &amp; Wellbeing</span>
          </a>
          <a href="#daily-wellness-habits" onClick={(e) => { e.preventDefault(); const el = document.getElementById('daily-wellness-habits'); if(el) window.scrollTo({top: el.offsetTop - 80, behavior:'smooth'}); setIsDrawerOpen(false); }} className="flex items-baseline gap-4 group">
            <span className="text-xs font-serif italic text-[#BC5B38]">34</span>
            <span className="text-lg font-medium group-hover:pl-2 transition-all">Daily Wellness Habits</span>
          </a>
          <a href="#perfection-consistency" onClick={(e) => { e.preventDefault(); const el = document.getElementById('perfection-consistency'); if(el) window.scrollTo({top: el.offsetTop - 80, behavior:'smooth'}); setIsDrawerOpen(false); }} className="flex items-baseline gap-4 group">
            <span className="text-xs font-serif italic text-[#BC5B38]">35</span>
            <span className="text-lg font-medium group-hover:pl-2 transition-all">Perfection &amp; Consistency</span>
          </a>
          <a href="#recipe-collection-section" onClick={(e) => { e.preventDefault(); const el = document.getElementById('recipe-collection-section'); if(el) window.scrollTo({top: el.offsetTop - 80, behavior:'smooth'}); setIsDrawerOpen(false); }} className="flex items-baseline gap-4 group">
            <span className="text-xs font-serif italic text-[#BC5B38]">36</span>
            <span className="text-lg font-medium group-hover:pl-2 transition-all">Recipe Collection</span>
          </a>
          <a href="#recipe-collection-intro" onClick={(e) => { e.preventDefault(); const el = document.getElementById('recipe-collection-intro'); if(el) window.scrollTo({top: el.offsetTop - 80, behavior:'smooth'}); setIsDrawerOpen(false); }} className="flex items-baseline gap-4 group">
            <span className="text-xs font-serif italic text-[#BC5B38]">37</span>
            <span className="text-lg font-medium group-hover:pl-2 transition-all">Recipe Collection Intro</span>
          </a>
          <a href="#building-better-breakfasts" onClick={(e) => { e.preventDefault(); const el = document.getElementById('building-better-breakfasts'); if(el) window.scrollTo({top: el.offsetTop - 80, behavior:'smooth'}); setIsDrawerOpen(false); }} className="flex items-baseline gap-4 group">
            <span className="text-xs font-serif italic text-[#BC5B38]">38</span>
            <span className="text-lg font-medium group-hover:pl-2 transition-all">Building Better Breakfasts</span>
          </a>
          <a href="#breakfast-nutrition" onClick={(e) => { e.preventDefault(); const el = document.getElementById('breakfast-nutrition'); if(el) window.scrollTo({top: el.offsetTop - 80, behavior:'smooth'}); setIsDrawerOpen(false); }} className="flex items-baseline gap-4 group">
            <span className="text-xs font-serif italic text-[#BC5B38]">39</span>
            <span className="text-lg font-medium group-hover:pl-2 transition-all">Breakfast Nutrition</span>
          </a>
          <a href="#breakfast-benefits" onClick={(e) => { e.preventDefault(); const el = document.getElementById('breakfast-benefits'); if(el) window.scrollTo({top: el.offsetTop - 80, behavior:'smooth'}); setIsDrawerOpen(false); }} className="flex items-baseline gap-4 group">
            <span className="text-xs font-serif italic text-[#BC5B38]">40</span>
            <span className="text-lg font-medium group-hover:pl-2 transition-all">Breakfast Benefits</span>
          </a>
          <a href="#breakfast-ingredients-method" onClick={(e) => { e.preventDefault(); const el = document.getElementById('breakfast-ingredients-method'); if(el) window.scrollTo({top: el.offsetTop - 80, behavior:'smooth'}); setIsDrawerOpen(false); }} className="flex items-baseline gap-4 group">
            <span className="text-xs font-serif italic text-[#BC5B38]">41</span>
            <span className="text-lg font-medium group-hover:pl-2 transition-all">Breakfast Ingredients &amp; Method</span>
          </a>
          <a href="#breakfast-method-cooking" onClick={(e) => { e.preventDefault(); const el = document.getElementById('breakfast-method-cooking'); if(el) window.scrollTo({top: el.offsetTop - 80, behavior:'smooth'}); setIsDrawerOpen(false); }} className="flex items-baseline gap-4 group">
            <span className="text-xs font-serif italic text-[#BC5B38]">42</span>
            <span className="text-lg font-medium group-hover:pl-2 transition-all">Breakfast Method</span>
          </a>
          <a href="#smart-snacks-ingredients" onClick={(e) => { e.preventDefault(); const el = document.getElementById('smart-snacks-ingredients'); if(el) window.scrollTo({top: el.offsetTop - 80, behavior:'smooth'}); setIsDrawerOpen(false); }} className="flex items-baseline gap-4 group">
            <span className="text-xs font-serif italic text-[#BC5B38]">43</span>
            <span className="text-lg font-medium group-hover:pl-2 transition-all">Smart Snacks Ingredients</span>
          </a>
          <a href="#smart-snacks" onClick={(e) => { e.preventDefault(); const el = document.getElementById('smart-snacks'); if(el) window.scrollTo({top: el.offsetTop - 80, behavior:'smooth'}); setIsDrawerOpen(false); }} className="flex items-baseline gap-4 group">
            <span className="text-xs font-serif italic text-[#BC5B38]">44</span>
            <span className="text-lg font-medium group-hover:pl-2 transition-all">Smart Snacks</span>
          </a>
          <a href="#nourishing-beverages" onClick={(e) => { e.preventDefault(); const el = document.getElementById('nourishing-beverages'); if(el) window.scrollTo({top: el.offsetTop - 80, behavior:'smooth'}); setIsDrawerOpen(false); }} className="flex items-baseline gap-4 group">
            <span className="text-xs font-serif italic text-[#BC5B38]">45</span>
            <span className="text-lg font-medium group-hover:pl-2 transition-all">Nourishing Beverages</span>
          </a>
          <a href="#grocery-essentials" onClick={(e) => { e.preventDefault(); const el = document.getElementById('grocery-essentials'); if(el) window.scrollTo({top: el.offsetTop - 80, behavior:'smooth'}); setIsDrawerOpen(false); }} className="flex items-baseline gap-4 group">
            <span className="text-xs font-serif italic text-[#BC5B38]">46</span>
            <span className="text-lg font-medium group-hover:pl-2 transition-all">Grocery Essentials</span>
          </a>
          <a href="#grocery-fruits" onClick={(e) => { e.preventDefault(); const el = document.getElementById('grocery-fruits'); if(el) window.scrollTo({top: el.offsetTop - 80, behavior:'smooth'}); setIsDrawerOpen(false); }} className="flex items-baseline gap-4 group">
            <span className="text-xs font-serif italic text-[#BC5B38]">47</span>
            <span className="text-lg font-medium group-hover:pl-2 transition-all">Fruits</span>
          </a>
          <a href="#grocery-vegetables" onClick={(e) => { e.preventDefault(); const el = document.getElementById('grocery-vegetables'); if(el) window.scrollTo({top: el.offsetTop - 80, behavior:'smooth'}); setIsDrawerOpen(false); }} className="flex items-baseline gap-4 group">
            <span className="text-xs font-serif italic text-[#BC5B38]">48</span>
            <span className="text-lg font-medium group-hover:pl-2 transition-all">Vegetables</span>
          </a>
          <a href="#action-plan-30-day" onClick={(e) => { e.preventDefault(); const el = document.getElementById('action-plan-30-day'); if(el) window.scrollTo({top: el.offsetTop - 80, behavior:'smooth'}); setIsDrawerOpen(false); }} className="flex items-baseline gap-4 group">
            <span className="text-xs font-serif italic text-[#BC5B38]">49</span>
            <span className="text-lg font-medium group-hover:pl-2 transition-all">30-Day Action Plan</span>
          </a>
          <a href="#next-chapter" onClick={(e) => { e.preventDefault(); const el = document.getElementById('next-chapter'); if(el) window.scrollTo({top: el.offsetTop - 80, behavior:'smooth'}); setIsDrawerOpen(false); }} className="flex items-baseline gap-4 group">
            <span className="text-xs font-serif italic text-[#BC5B38]">50</span>
            <span className="text-lg font-medium group-hover:pl-2 transition-all">Your Next Chapter</span>
          </a>
          {visibleChapters.map(ch => (
            <a key={ch.id} href={`#c${ch.id}`} onClick={(e) => { e.preventDefault(); const el = chapterRefs.current[ch.id]; if(el) window.scrollTo({top: el.offsetTop - 80, behavior:'smooth'}); setIsDrawerOpen(false); }} className="flex items-baseline gap-4 group">
              <span className="text-xs font-serif italic text-[#BC5B38]">{ch.id.toString().padStart(2, '0')}</span>
              <span className="text-lg font-medium group-hover:pl-2 transition-all">{ch.title}</span>
            </a>
          ))}
        </div>
      </aside>

      {/* COVER */}
      <section className="cover ebook-cover-page" id="top" aria-label="Personalized ebook cover">
        <div className="ebook-cover-sheet">
          <Image
            src="/ebook/cover-hero.png"
            alt=""
            fill
            priority
            sizes="(max-width: 820px) 100vw, min(1024px, 70vw)"
            className="ebook-cover-photo"
            aria-hidden="true"
          />
          <div className="ebook-cover-wash" aria-hidden="true" />

          <div className="ebook-cover-content">
            <div className="cover-section-label">
              <CoverLeafMark />
              <span>Section 01 - Your Personalized {coverCondition} Blueprint</span>
            </div>

            <h1 className="cover-title">
              Your
              <span>Personalized</span>
              <span>{coverCondition}</span>
              <span>Blueprint</span>
            </h1>

            <div className="cover-kicker">Eat with intention. Heal with food.</div>
            <div className="cover-rule" aria-hidden="true" />
            <p className="cover-personalization">{coverPersonalization}</p>

            <div className="cover-brand">
              <div className="cover-brand-name">Zen</div>
              <div className="cover-brand-subtitle">Your food intelligence companionship</div>
            </div>

            <blockquote className="cover-quote">
              &ldquo;I&rsquo;m not here to guide your meals. I&rsquo;m here to understand you,
              support you, and grow with you.&rdquo;
            </blockquote>
          </div>

          <div className="cover-page-number" aria-hidden="true">01</div>
        </div>
      </section>

      {/* A NOTE FOR YOU */}
      <NoteForYouPage ebook={ebook} user={user} plan={plan} />

      {/* HEALTH SNAPSHOT */}
      <HealthSnapshotPage ebook={ebook} user={user} />

      {/* KEY FINDINGS */}
      <KeyFindingsPage ebook={ebook} user={user} />

      {/* KEY HEALTH FOCUS AREAS */}
      <KeyHealthFocusAreasPage ebook={ebook} />

      {/* PERSONALIZED INSIGHTS */}
      <PersonalizedInsightsPage ebook={ebook} user={user} plan={plan} />

      {/* AT A GLANCE */}
      <AtAGlancePage ebook={ebook} nextHref={firstContentHref} />

      {/* BIGGEST OPPORTUNITIES */}
      <OpportunityPage ebook={ebook} />

      {/* UNDERSTANDING YOUR JOURNEY */}
      <UnderstandingJourneyPage ebook={ebook} user={user} />

      {/* UNDERSTANDING PCOS */}
      <UnderstandingDetailPage ebook={ebook} user={user} />

      {/* WHY SYMPTOMS HAPPEN */}
      <WhySymptomsHappenPage ebook={ebook} />

      {/* WHAT NUTRITION CAN INFLUENCE */}
      <NutritionInfluencePage ebook={ebook} />

      {/* COMMON PCOS CHALLENGES */}
      <CommonPcosChallengesPage />

      {/* THE ZENPLATO FRAMEWORK */}
      <ZenplatoFrameworkPage />

      {/* SECTION 3 FOOD & NUTRITION GUIDE */}
      <FoodNutritionGuidePage />

      {/* FOODS TO PRIORITIZE */}
      <FoodsToPrioritizePage ebook={ebook} plan={plan} />

      {/* FOODS TO BE MINDFUL OF */}
      <FoodsToBeMindfulPage ebook={ebook} plan={plan} />

      {/* THE BALANCED PLATE */}
      <BalancedPlatePage />

      {/* HYDRATION RECOMMENDATIONS */}
      <HydrationRecommendationsPage ebook={ebook} />

      {/* MEAL TIMING GUIDANCE */}
      <MealTimingGuidancePage ebook={ebook} />

      {/* BUILDING A SUSTAINABLE RHYTHM */}
      <SustainableRhythmPage ebook={ebook} />

      {/* SMART FOOD SWAPS */}
      <SmartFoodSwapsPage ebook={ebook} />

      {/* SMART SWAPS CONTINUED */}
      <SmartSwapsContinuedPage ebook={ebook} />

      {/* SECTION 4 LIFESTYLE FOUNDATION */}
      <LifestyleFoundationPage />

      {/* SLEEP & RECOVERY */}
      <SleepRecoveryPage />

      {/* STRESS & WELLBEING */}
      <StressWellbeingPage ebook={ebook} />

      {/* DAILY WELLNESS HABITS */}
      <DailyWellnessHabitsPage ebook={ebook} />

      {/* PERFECTION & CONSISTENCY */}
      <PerfectionConsistencyPage />

      {/* SECTION 5 RECIPE COLLECTION */}
      <RecipeCollectionSectionPage />

      {/* RECIPE COLLECTION INTRO */}
      <RecipeCollectionIntroPage ebook={ebook} />

      {/* BUILDING BETTER BREAKFASTS */}
      <BreakfastsPage ebook={ebook} />

      {/* BREAKFAST NUTRITION */}
      <BreakfastNutritionPage ebook={ebook} />

      {/* BREAKFAST BENEFITS */}
      <BreakfastBenefitsPage ebook={ebook} />

      {/* BREAKFAST INGREDIENTS & METHOD */}
      <BreakfastIngredientsMethodPage ebook={ebook} />

      {/* BREAKFAST METHOD COOKING */}
      <BreakfastMethodCookingPage ebook={ebook} />

      {/* SMART SNACKS INGREDIENTS */}
      <SmartSnacksIngredientsPage ebook={ebook} />

      {/* SMART SNACKS */}
      <SmartSnacksCardsPage ebook={ebook} />

      {/* NOURISHING BEVERAGES */}
      <NourishingBeveragesPage ebook={ebook} />

      {/* GROCERY ESSENTIALS */}
      <GroceryEssentialsPage ebook={ebook} />

      {/* FRUITS */}
      <FruitCatalogPage ebook={ebook} />

      {/* VEGETABLES */}
      <VegetableCatalogPage ebook={ebook} />

      {/* 30-DAY ACTION PLAN */}
      <ActionPlan30DayPage ebook={ebook} />

      {/* YOUR NEXT CHAPTER */}
      <NextChapterPage ebook={ebook} />

      {/* CHAPTERS */}
      {visibleChapters.map(ch => (
        <section 
          key={ch.id} 
          className="py-24 max-w-4xl mx-auto px-6" 
          id={`c${ch.id}`}
          ref={el => { chapterRefs.current[ch.id] = el; }}
        >
          <Reveal delay={0.1}>
            <div className="flex items-center gap-6 mb-12">
              <span className="text-6xl font-serif text-transparent stroke-1" style={{ WebkitTextStroke: "1px var(--clay)" }}>{ch.id.toString().padStart(2, '0')}</span>
              <div className="h-[1px] flex-grow bg-[#DCD0BD]" />
              <h2 className="font-serif text-4xl">{ch.title}</h2>
            </div>
          </Reveal>
          
          <Reveal delay={0.3}>
            <div 
              className="ebook-content leading-relaxed text-[#26211B]/80"
              dangerouslySetInnerHTML={{ __html: ch.html_content }}
            />
          </Reveal>
        </section>
      ))}

      {/* FOOTER */}
      <footer className="bg-[#26211B] text-[#F7F1E8] py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="text-2xl font-bold tracking-[0.5em] mb-8">ZEN · PLATO</div>
          <p className="text-sm text-[#8C8071] max-w-xl mx-auto leading-loose italic">
            "Your body is the vessel for your spirit. Treat it with the reverence it deserves."
          </p>
          <div className="mt-20 pt-8 border-t border-white/5 text-[10px] text-[#5E5447] tracking-widest uppercase">
            © 2026 NutriVerse AI · Personalised Wellness
          </div>
        </div>
      </footer>
    </div>
  );
}
