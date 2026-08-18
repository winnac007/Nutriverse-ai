"use client";

import * as Dialog from "@radix-ui/react-dialog";
import {
  ArrowRight,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  HeartPulse,
  Languages,
  Leaf,
  MessageCircle,
  Phone,
  Sparkles,
  Star,
  TrendingUp,
  Utensils,
  Video,
  X,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";
import styles from "./Home.module.css";

type MealPlanItem = {
  day: string;
  meal_type?: string;
  recipe_id: string;
};

type MealPlan = {
  items?: MealPlanItem[];
};

type RecipeSummary = {
  id?: string;
  title?: string;
  image?: string;
};

type ConsultationMode = "chat" | "video" | "audio";
type ConditionKey = "diabetes" | "thyroid" | "pcos" | "heart" | "digestive" | "other";
type DialogView = "profile" | "booking" | null;

type ModeOption = {
  id: ConsultationMode;
  title: string;
  description: string;
  icon: LucideIcon;
};

type ConditionOption = {
  id: ConditionKey;
  label: string;
  title: string;
  shortLabel: string;
};

const MEALS = [
  { label: "Breakfast", fallback: "/landing/hero-bowl.jpg", symbol: "☼" },
  { label: "Lunch", fallback: "/landing/dish-india.jpg", symbol: "◒" },
  { label: "Dinner", fallback: "/landing/healthcare-bowl.jpg", symbol: "☾" },
] as const;

const CONSULTATION_MODES: ModeOption[] = [
  {
    id: "chat",
    title: "Chat Consultation",
    description: "Ask questions and share food or meal concerns.",
    icon: MessageCircle,
  },
  {
    id: "video",
    title: "Video Consultation",
    description: "One-to-one consultation with your nutritionist.",
    icon: Video,
  },
  {
    id: "audio",
    title: "Audio Consultation",
    description: "For a simple phone-style consultation.",
    icon: Phone,
  },
];

const CONDITION_OPTIONS: ConditionOption[] = [
  { id: "diabetes", label: "Diabetes", title: "Diabetes", shortLabel: "blood sugar" },
  { id: "thyroid", label: "Thyroid", title: "Thyroid", shortLabel: "thyroid health" },
  { id: "pcos", label: "PCOS", title: "PCOS", shortLabel: "hormone health" },
  { id: "heart", label: "Heart health", title: "Heart Health", shortLabel: "heart health" },
  { id: "digestive", label: "Digestive concerns", title: "Digestive Health", shortLabel: "digestive health" },
  { id: "other", label: "Other goals", title: "Personal", shortLabel: "wellness" },
];

const CONDITION_ALIASES: Record<string, ConditionKey> = {
  pcos: "pcos",
  diabetes: "diabetes",
  "diabetes-t1": "diabetes",
  "diabetes-t2": "diabetes",
  prediabetes: "diabetes",
  "insulin-resistance": "diabetes",
  "metabolic-syndrome": "diabetes",
  thyroid: "thyroid",
  hypothyroid: "thyroid",
  hyperthyroid: "thyroid",
  hashimotos: "thyroid",
  pcod: "pcos",
  "heart-disease": "heart",
  hypertension: "heart",
  "high-cholesterol": "heart",
  "high-triglycerides": "heart",
  ibs: "digestive",
  gerd: "digestive",
  "gut-health": "digestive",
  celiac: "digestive",
  "fatty-liver": "digestive",
};

const CONSULTANT = {
  name: "Dt. Ananya Sharma",
  qualification: "M.Sc. Clinical Nutrition",
  role: "Clinical Nutritionist & Dietician",
  experience: "8 years experience",
  languages: "English, Hindi",
  fee: "₹800",
  rating: "4.9",
  reviews: "120",
  specializations: [
    "PCOS",
    "Diabetes",
    "Thyroid",
    "Weight Management",
    "Heart Health",
    "Digestive Health",
  ],
};

const CARE_STEPS = [
  {
    title: "Nutritionist notes",
    description: "Personalized guidance based on your health, food preferences and goals.",
    icon: ClipboardCheck,
  },
  {
    title: "ZenPlate meal updates",
    description: "Your plan reflects practical food, portion and timing adjustments.",
    icon: Utensils,
  },
  {
    title: "Follow-up progress",
    description: "Observe what works and refine the plan together over time.",
    icon: TrendingUp,
  },
] as const;

const CONSULTATION_OUTCOMES = [
  "Personalized recommendations",
  "Meal adjustments",
  "Foods & ingredients to focus on",
  "Meal timing guidance",
  "Progress observations",
  "Follow-up plan",
];

function resolveCondition(conditions: string[] | undefined): ConditionKey {
  for (const condition of conditions ?? []) {
    const normalized = condition.trim().toLowerCase().replaceAll("_", "-").replaceAll(" ", "-");
    const match = CONDITION_ALIASES[normalized];
    if (match) return match;
  }
  return "other";
}

function getFoodRules(healthPlan: unknown): string[] {
  if (!healthPlan || typeof healthPlan !== "object") return [];
  const foodRules = (healthPlan as { food_rules?: unknown }).food_rules;
  if (!Array.isArray(foodRules)) return [];
  return foodRules.filter((rule): rule is string => typeof rule === "string" && rule.trim().length > 0);
}

function scrollToSection(element: HTMLElement | null) {
  if (!element) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  element.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
}

export default function Home() {
  const { user } = useAuth();
  const recommendationRef = useRef<HTMLElement>(null);
  const modesRef = useRef<HTMLElement>(null);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [planRecipes, setPlanRecipes] = useState<Record<string, RecipeSummary>>({});
  const [streak, setStreak] = useState(0);
  const [water, setWater] = useState(6);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [mealPlanStatus, setMealPlanStatus] = useState<"loading" | "ready" | "error">("loading");
  const [showNotice, setShowNotice] = useState(false);
  const [conditionOverride, setConditionOverride] = useState<ConditionKey | null>(null);
  const [dialogView, setDialogView] = useState<DialogView>(null);
  const [selectedMode, setSelectedMode] = useState<ConsultationMode>("chat");
  const [preferredTime, setPreferredTime] = useState("Morning · 9am–12pm");
  const [requestSaved, setRequestSaved] = useState(false);

  const loadDashboard = useCallback(async () => {
    if (!user?.id) return;
    setStatus("loading");
    setMealPlanStatus("loading");

    const [planResult, streakResult] = await Promise.allSettled([
      api.get("/meal-plan"),
      api.get("/healthcare/streak"),
    ]);

    if (planResult.status === "fulfilled") {
      setMealPlan(planResult.value.data as MealPlan);
      setMealPlanStatus("ready");
    } else {
      setMealPlanStatus("error");
    }

    if (streakResult.status === "fulfilled") {
      setStreak(streakResult.value.data?.current_streak_days ?? 0);
    }

    setStatus(
      planResult.status === "rejected" && streakResult.status === "rejected"
        ? "error"
        : "ready",
    );
  }, [user?.id]);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    const stored = window.localStorage.getItem("zenplate-water-glasses");
    if (stored) setWater(Math.min(8, Math.max(0, Number(stored) || 0)));
  }, []);

  useEffect(() => {
    if (!mealPlan?.items?.length) return;
    let active = true;
    const today = new Date().toLocaleDateString("en-US", { weekday: "short" });
    const ids = [...new Set(
      mealPlan.items.filter((item) => item.day === today).map((item) => item.recipe_id),
    )];

    void Promise.all(ids.map(async (id) => {
      try {
        const response = await api.get(`/recipes/${id}`);
        return [id, response.data as RecipeSummary] as const;
      } catch {
        return null;
      }
    })).then((results) => {
      if (!active) return;
      setPlanRecipes(Object.fromEntries(
        results.filter((entry): entry is readonly [string, RecipeSummary] => Boolean(entry)),
      ));
    });

    return () => {
      active = false;
    };
  }, [mealPlan]);

  const todayMeals = useMemo(() => {
    const today = new Date().toLocaleDateString("en-US", { weekday: "short" });
    return mealPlan?.items?.filter((item) => item.day === today).slice(0, 3) ?? [];
  }, [mealPlan]);

  const primaryCondition = conditionOverride ?? resolveCondition(user?.conditions);
  const condition = CONDITION_OPTIONS.find((option) => option.id === primaryCondition) ?? CONDITION_OPTIONS[5];
  const foodRules = getFoodRules(user?.health_plan);
  const firstName = user?.name?.split(" ")[0] || "Friend";
  const featuredPlanItem = todayMeals[0];
  const featuredRecipe = featuredPlanItem ? planRecipes[featuredPlanItem.recipe_id] : undefined;
  const consultantSpecializations = CONSULTANT.specializations;
  const consultantMatchCopy = condition.id === "other"
    ? "Sample profile · Explore support for your goals"
    : `Sample match · Matched for ${condition.label}`;
  const planFocusLabel = foodRules.length
    ? "What your health plan is focusing on"
    : mealPlanStatus === "ready"
      ? "Suggested plan focus"
      : mealPlanStatus === "loading"
        ? "Loading your plan"
        : "Plan unavailable";
  const planFocusRules = foodRules.length
    ? foodRules.slice(0, 3)
    : mealPlanStatus === "ready"
      ? [
          `Meals aligned with your ${condition.shortLabel} goals`,
          "Steady energy through balanced portions",
          "Practical foods you can enjoy consistently",
        ]
      : mealPlanStatus === "loading"
        ? ["Loading your current meal plan…"]
        : ["We couldn’t load your meal plan. Refresh the page to try again."];

  const updateWater = (next: number) => {
    const value = Math.min(8, Math.max(0, next));
    setWater(value);
    window.localStorage.setItem("zenplate-water-glasses", String(value));
  };

  const openBooking = (mode?: ConsultationMode) => {
    if (mode) setSelectedMode(mode);
    setRequestSaved(false);
    setDialogView("booking");
  };

  const saveConsultationPreference = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    window.sessionStorage.setItem("zenplate-consultation-preference", JSON.stringify({
      consultant: CONSULTANT.name,
      condition: condition.label,
      mode: selectedMode,
      preferredTime,
    }));
    setRequestSaved(true);
  };

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <Link href="/app" className={styles.heroBrand} aria-label="ZenPlate home">
          <span className={styles.brandMark}><Leaf aria-hidden="true" /></span>
          <span>
            <strong>ZenPlate</strong>
            <small>Eat with intention. Heal with food.</small>
          </span>
        </Link>

        <div className={styles.headerActions}>
          <div className={styles.notificationWrap}>
            <button
              className={styles.iconButton}
              type="button"
              aria-label="Show consultation update"
              aria-expanded={showNotice}
              onClick={() => setShowNotice((visible) => !visible)}
            >
              <Bell aria-hidden="true" />
              <span className={styles.notificationDot} />
            </button>
            {showNotice ? (
              <div className={styles.notice} role="status">
                <strong>Your expert match is ready.</strong>
                <span>We used your {condition.shortLabel} focus to personalize this recommendation.</span>
              </div>
            ) : null}
          </div>
          <Link href="/app/profile" className={styles.avatar} aria-label="Open profile">
            {firstName.charAt(0).toUpperCase()}
          </Link>
        </div>

        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Consultation</p>
          <h1>Talk to a<br /><span>Nutrition Expert</span></h1>
          <p className={styles.heroDescription}>
            Get personalized guidance for your health and nutrition journey.
          </p>
          <button
            type="button"
            className={styles.primaryCta}
            onClick={() => scrollToSection(recommendationRef.current)}
          >
            <CalendarDays aria-hidden="true" />
            <span>Find My Nutritionist</span>
            <ArrowRight aria-hidden="true" />
          </button>
          <p className={styles.heroMatch}>
            <Sparkles aria-hidden="true" /> Recommended for your {condition.shortLabel} plan
          </p>
        </div>

        <div className={styles.heroPortrait} aria-hidden="true">
          <span className={styles.heroHalo} />
          <Image
            src="/app-ui/nutritionist-ananya.webp"
            alt=""
            fill
            priority
            sizes="(max-width: 639px) 48vw, (max-width: 959px) 42vw, 30rem"
          />
        </div>
      </header>

      <div className={styles.content} aria-busy={status === "loading"}>
        {status === "error" ? (
          <div className={styles.errorBanner} role="alert">
            <div>
              <strong>We couldn’t refresh your plan.</strong>
              <span>Your consultation options are still available.</span>
            </div>
            <button type="button" onClick={() => void loadDashboard()}>Try again</button>
          </div>
        ) : null}

        <section
          className={styles.recommendationSection}
          aria-labelledby="recommended-title"
          id="recommended-consultant"
          ref={recommendationRef}
        >
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.sectionLabel}>Your expert match</p>
              <h2 id="recommended-title">Recommended Consultant</h2>
            </div>
            <span className={styles.matchNote}><Sparkles aria-hidden="true" /> {consultantMatchCopy}</span>
          </div>

          <article className={styles.consultantCard}>
            <div className={styles.consultantPortrait}>
              <Image
                src="/app-ui/nutritionist-ananya.webp"
                alt={`${CONSULTANT.name}, clinical nutritionist`}
                fill
                sizes="(max-width: 639px) 7rem, 11rem"
              />
              <span className={styles.sampleTag}>Sample</span>
            </div>

            <div className={styles.consultantMain}>
              <div className={styles.consultantTitleRow}>
                <div>
                  <h3>{CONSULTANT.name}</h3>
                  <p>{CONSULTANT.qualification}</p>
                  <span>{CONSULTANT.role}</span>
                </div>
                <div className={styles.mobileRating} aria-label={`${CONSULTANT.rating} out of 5 from ${CONSULTANT.reviews} reviews`}>
                  <Star aria-hidden="true" />
                  <strong>{CONSULTANT.rating}</strong>
                  <span>({CONSULTANT.reviews})</span>
                </div>
              </div>

              <div className={styles.specializations} aria-label="Specializations">
                {consultantSpecializations.map((specialization) => (
                  <span key={specialization}>{specialization}</span>
                ))}
              </div>

              <div className={styles.consultantMeta}>
                <span><BriefcaseBusiness aria-hidden="true" /> {CONSULTANT.experience}</span>
                <span><Languages aria-hidden="true" /> {CONSULTANT.languages}</span>
              </div>
            </div>

            <div className={styles.consultantAside}>
              <div className={styles.desktopRating} aria-label={`${CONSULTANT.rating} out of 5 from ${CONSULTANT.reviews} reviews`}>
                <Star aria-hidden="true" />
                <strong>{CONSULTANT.rating}</strong>
                <span>({CONSULTANT.reviews})</span>
              </div>
              <p className={styles.fee}>{CONSULTANT.fee}<span>Consultation fee</span></p>
            </div>

            <div className={styles.consultantActions}>
              <button type="button" className={styles.secondaryButton} onClick={() => setDialogView("profile")}>
                View Profile
              </button>
              <button type="button" className={styles.bookButton} onClick={() => openBooking()}>
                Book Consultation <ArrowRight aria-hidden="true" />
              </button>
            </div>
          </article>
        </section>

        <section className={styles.modesSection} aria-labelledby="modes-title" ref={modesRef} id="consultation-types">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.sectionLabel}>Consultation types</p>
              <h2 id="modes-title">Choose how you’d like to connect</h2>
            </div>
            <p className={styles.sectionDescription}>Simple support, in the format that feels right for you.</p>
          </div>

          <div className={styles.modeGrid}>
            {CONSULTATION_MODES.map((mode) => {
              const Icon = mode.icon;
              return (
                <button
                  type="button"
                  className={styles.modeCard}
                  key={mode.id}
                  onClick={() => openBooking(mode.id)}
                >
                  <span className={styles.modeIcon}><Icon aria-hidden="true" /></span>
                  <span className={styles.modeCopy}>
                    <strong>{mode.title}</strong>
                    <small>{mode.description}</small>
                  </span>
                  <span className={styles.modeArrow}><ArrowRight aria-hidden="true" /></span>
                </button>
              );
            })}
          </div>
        </section>

        <section className={styles.conditionSection} aria-labelledby="condition-title">
          <div className={styles.conditionPanel}>
            <div className={styles.conditionCopy}>
              <p className={styles.sectionLabel}>For your health needs</p>
              <h2 id="condition-title">Your {condition.title} Nutrition Support</h2>
              <p>
                Your meal plan is personalized for {condition.id === "other" ? "your goals" : condition.label}.
                For deeper guidance, connect with a nutritionist who specializes in {condition.shortLabel}.
              </p>
              <div className={styles.conditionActions}>
                <button type="button" className={styles.bookButton} onClick={() => openBooking()}>
                  Talk to a Nutritionist <ArrowRight aria-hidden="true" />
                </button>
                <Link href="/app/daily-plan">View my meal plan <ChevronRight aria-hidden="true" /></Link>
              </div>
            </div>

            <div className={styles.planExpertBridge} aria-label="Your meal plan and nutritionist work together">
              <div className={styles.mealOrb}>
                <img
                  src={featuredRecipe?.image || MEALS[0].fallback}
                  alt={featuredRecipe?.title || (mealPlanStatus === "ready" ? "Your personalized meal" : "Meal inspiration")}
                  onError={(event) => {
                    event.currentTarget.src = MEALS[0].fallback;
                  }}
                />
              </div>
              <span className={styles.bridgeLine}><Leaf aria-hidden="true" /></span>
              <div className={styles.expertOrb}>
                <Image
                  src="/app-ui/nutritionist-ananya.webp"
                  alt="Your recommended nutritionist"
                  fill
                  sizes="7rem"
                />
              </div>
            </div>
          </div>

          <div className={styles.conditionPicker} aria-label="Choose a health goal">
            {CONDITION_OPTIONS.map((option) => (
              <button
                type="button"
                key={option.id}
                className={option.id === condition.id ? styles.activeCondition : ""}
                aria-pressed={option.id === condition.id}
                onClick={() => setConditionOverride(option.id)}
              >
                <HeartPulse aria-hidden="true" />
                {option.label}
              </button>
            ))}
          </div>
        </section>

        <section className={styles.planSection} aria-labelledby="plan-title">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.sectionLabel}>AI plan + human guidance</p>
              <h2 id="plan-title">Your ZenPlate plan today</h2>
            </div>
            <Link className={styles.textLink} href="/app/daily-plan">View full plan <ArrowRight aria-hidden="true" /></Link>
          </div>

          <div className={styles.planGrid}>
            <div className={styles.mealGrid}>
              {MEALS.map((meal, index) => {
                const planItem = todayMeals[index];
                const recipe = planItem ? planRecipes[planItem.recipe_id] : undefined;
                return (
                  <Link className={styles.mealCard} href="/app/daily-plan" key={meal.label}>
                    <span className={styles.mealImage}>
                      <img
                        src={recipe?.image || meal.fallback}
                        alt={recipe?.title || `${meal.label} meal`}
                        onError={(event) => {
                          event.currentTarget.src = meal.fallback;
                        }}
                      />
                    </span>
                    <span className={styles.mealMeta}>
                      <span aria-hidden="true">{meal.symbol}</span>
                      <span>
                        <strong>{meal.label}</strong>
                        <small>
                          {recipe?.title || (
                            mealPlanStatus === "loading"
                              ? "Preparing your pick…"
                              : mealPlanStatus === "ready"
                                ? "Personalized pick"
                                : "Sample meal"
                          )}
                        </small>
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>

            <aside className={styles.planSummary} aria-label="Today’s personalized plan summary">
              <div className={styles.planMetrics}>
                <button
                  type="button"
                  onClick={() => updateWater(water === 8 ? 0 : water + 1)}
                  aria-label={water === 8 ? "Reset water tracker" : "Add one glass of water"}
                >
                  <span>Water</span>
                  <strong>{water}<small>/8 glasses</small></strong>
                </button>
                <Link href="/app/progress">
                  <span>Mindful rhythm</span>
                  <strong>{streak}<small>day streak</small></strong>
                </Link>
              </div>
              <div className={styles.planRules}>
                <p className={styles.sectionLabel}>{planFocusLabel}</p>
                <ul>
                  {planFocusRules.map((rule) => <li key={rule}><Check aria-hidden="true" />{rule}</li>)}
                </ul>
              </div>
            </aside>
          </div>
        </section>

        <section className={styles.afterSection} aria-labelledby="after-title">
          <div className={styles.afterIntro}>
            <p className={styles.sectionLabel}>Continuous care</p>
            <h2 id="after-title">After your consultation</h2>
            <p>Your nutritionist’s guidance works with your ZenPlate meal plan—not beside it.</p>
          </div>

          <div className={styles.careFlow}>
            {CARE_STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <div className={styles.careStep} key={step.title}>
                  <span className={styles.careIcon}><Icon aria-hidden="true" /></span>
                  <div>
                    <strong>{step.title}</strong>
                    <p>{step.description}</p>
                  </div>
                  {index < CARE_STEPS.length - 1 ? <ArrowRight className={styles.flowArrow} aria-hidden="true" /> : null}
                </div>
              );
            })}
          </div>

          <div className={styles.outcomesWrap}>
            <div>
              <p className={styles.sectionLabel}>What you can expect</p>
              <h3>Your plan keeps evolving with expert input.</h3>
            </div>
            <ul className={styles.outcomesGrid}>
              {CONSULTATION_OUTCOMES.map((outcome) => (
                <li key={outcome}><span><Check aria-hidden="true" /></span>{outcome}</li>
              ))}
            </ul>
          </div>

          <div className={styles.closingCta}>
            <div>
              <p className={styles.sectionLabel}>One connected care journey</p>
              <h3>AI planning, guided by human expertise.</h3>
              <p>Thoughtfully personalized and ready to adapt with you.</p>
            </div>
            <button type="button" className={styles.bookButton} onClick={() => openBooking()}>
              Book a Consultation <ArrowRight aria-hidden="true" />
            </button>
          </div>
        </section>

        <nav className={styles.moreLinks} aria-label="Continue your ZenPlate journey">
          <Link href="/app/food-guidelines">
            <Leaf aria-hidden="true" />
            <span><small>Your health plan</small><strong>Food guidelines</strong></span>
            <ChevronRight aria-hidden="true" />
          </Link>
          <Link href="/app/ebook">
            <Sparkles aria-hidden="true" />
            <span><small>Clinical guide</small><strong>Your health guide</strong></span>
            <ChevronRight aria-hidden="true" />
          </Link>
          <Link href="/app/explore/welcome">
            <Utensils aria-hidden="true" />
            <span><small>Culinary journey</small><strong>Discover the Plate</strong></span>
            <ChevronRight aria-hidden="true" />
          </Link>
        </nav>
      </div>

      <Dialog.Root
        open={dialogView !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDialogView(null);
            setRequestSaved(false);
          }
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className={styles.dialogOverlay} />
          <Dialog.Content className={styles.dialogContent}>
            <Dialog.Close className={styles.dialogClose} aria-label="Close consultation panel">
              <X aria-hidden="true" />
            </Dialog.Close>

            {dialogView === "profile" ? (
              <div className={styles.profileDialog}>
                <div className={styles.dialogPortrait}>
                  <Image
                    src="/app-ui/nutritionist-ananya.webp"
                    alt={`${CONSULTANT.name}, clinical nutritionist`}
                    fill
                    sizes="8rem"
                  />
                </div>
                <div>
                  <p className={styles.sectionLabel}>{consultantMatchCopy}</p>
                  <Dialog.Title>{CONSULTANT.name}</Dialog.Title>
                  <Dialog.Description className={styles.dialogDescription}>{CONSULTANT.role}</Dialog.Description>
                </div>
                <div className={styles.profileFacts}>
                  <span><BriefcaseBusiness aria-hidden="true" /><strong>{CONSULTANT.qualification}</strong></span>
                  <span><Clock3 aria-hidden="true" /><strong>{CONSULTANT.experience}</strong></span>
                  <span><Languages aria-hidden="true" /><strong>{CONSULTANT.languages}</strong></span>
                  <span><Star aria-hidden="true" /><strong>{CONSULTANT.rating} rating</strong></span>
                </div>
                <div className={styles.dialogSpecializations}>
                  {consultantSpecializations.map((specialization) => <span key={specialization}>{specialization}</span>)}
                </div>
                <p className={styles.profileBio}>
                  Ananya combines clinical nutrition with practical meal planning, helping people make condition-aware changes that fit everyday life.
                </p>
                <button type="button" className={styles.bookButton} onClick={() => openBooking()}>
                  Book Consultation <ArrowRight aria-hidden="true" />
                </button>
              </div>
            ) : (
              <div className={styles.bookingDialog}>
                {requestSaved ? (
                  <div className={styles.savedState} role="status">
                    <span><Check aria-hidden="true" /></span>
                    <p className={styles.sectionLabel}>Preview ready</p>
                    <Dialog.Title>You’re ready for the next step.</Dialog.Title>
                    <Dialog.Description className={styles.dialogDescription}>
                      Your {selectedMode} preference is saved in this browser tab as a preview. No request has been sent or appointment scheduled.
                    </Dialog.Description>
                    <button type="button" className={styles.bookButton} onClick={() => setDialogView(null)}>Done</button>
                  </div>
                ) : (
                  <form onSubmit={saveConsultationPreference}>
                    <p className={styles.sectionLabel}>Book a consultation</p>
                    <Dialog.Title>Choose how you’d like to connect</Dialog.Title>
                    <Dialog.Description className={styles.dialogDescription}>
                      Preview your preferred format and time. Live provider availability still needs to be connected before scheduling.
                    </Dialog.Description>

                    <fieldset className={styles.dialogModes}>
                      <legend>Consultation type</legend>
                      {CONSULTATION_MODES.map((mode) => {
                        const Icon = mode.icon;
                        return (
                          <button
                            type="button"
                            key={mode.id}
                            className={selectedMode === mode.id ? styles.selectedDialogMode : ""}
                            aria-pressed={selectedMode === mode.id}
                            onClick={() => setSelectedMode(mode.id)}
                          >
                            <Icon aria-hidden="true" />
                            <span>{mode.title.replace(" Consultation", "")}</span>
                          </button>
                        );
                      })}
                    </fieldset>

                    <label className={styles.timeField}>
                      <span>Preferred time</span>
                      <select value={preferredTime} onChange={(event) => setPreferredTime(event.target.value)}>
                        <option>Morning · 9am–12pm</option>
                        <option>Afternoon · 12pm–4pm</option>
                        <option>Evening · 4pm–8pm</option>
                      </select>
                    </label>

                    <div className={styles.bookingSummary}>
                      <span><CalendarDays aria-hidden="true" /> {condition.label} support</span>
                      <span><Star aria-hidden="true" /> {CONSULTANT.rating} rated</span>
                      <span><strong>{CONSULTANT.fee}</strong> consultation fee</span>
                    </div>

                    <button type="submit" className={styles.bookButton}>
                      Preview consultation request <ArrowRight aria-hidden="true" />
                    </button>
                  </form>
                )}
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
