"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BicepsFlexed,
  Bookmark,
  Calendar,
  Clock3,
  Dumbbell,
  Flame,
  Info,
  MessageSquare,
  MoreVertical,
  Target,
  Utensils,
  Check,
  Droplet,
} from "lucide-react";
import { toast } from "sonner";
import styles from "./Fitness.module.css";

type GoalKey = "all" | "muscle_gain" | "bulking" | "cutting" | "endurance";
type TimingKey = "before" | "after" | "rest" | "anytime";

interface WorkoutMeal {
  id: string;
  title: string;
  subtitle: string;
  time: string;
  calories: string;
  image: string;
  href: string;
}

interface RecommendedRecipe {
  id: string;
  title: string;
  tag: string;
  tagClass: string;
  time: string;
  calories: string;
  image: string;
  href: string;
}

const TIMING_MEALS: Record<TimingKey, WorkoutMeal[]> = {
  before: [
    {
      id: "smoothie-pre",
      title: "Banana & Peanut Butter Smoothie",
      subtitle: "Quick energy boost",
      time: "5 min",
      calories: "310 kcal",
      image: "/app-ui/fuel-dish-smoothie.png",
      href: "/app/recipe/spinach-egg-scramble",
    },
    {
      id: "oats-pre",
      title: "Oats & Berries Power Bowl",
      subtitle: "Sustained energy",
      time: "10 min",
      calories: "360 kcal",
      image: "/app-ui/fuel-dish-oats.png",
      href: "/app/recipe/spinach-egg-scramble",
    },
    {
      id: "toast-pre",
      title: "Avocado & Egg Toast",
      subtitle: "Light & focused fuel",
      time: "8 min",
      calories: "330 kcal",
      image: "/app-ui/fuel-dish-toast.png",
      href: "/app/recipe/spinach-egg-scramble",
    },
  ],
  after: [
    {
      id: "chicken-post",
      title: "Grilled Chicken & Quinoa Bowl",
      subtitle: "Lean protein & recovery",
      time: "25 min",
      calories: "540 kcal",
      image: "/app-ui/fuel-rec-chicken.png",
      href: "/app/recipe/spinach-egg-scramble",
    },
    {
      id: "salmon-post",
      title: "Salmon & Veggie Power Bowl",
      subtitle: "Omega-3 muscle repair",
      time: "28 min",
      calories: "580 kcal",
      image: "/app-ui/fuel-rec-salmon.png",
      href: "/app/recipe/hub-rec-salmon",
    },
    {
      id: "smoothie-post",
      title: "Banana & Peanut Butter Smoothie",
      subtitle: "Glycogen replenish",
      time: "5 min",
      calories: "310 kcal",
      image: "/app-ui/fuel-dish-smoothie.png",
      href: "/app/recipe/spinach-egg-scramble",
    },
  ],
  rest: [
    {
      id: "paneer-rest",
      title: "Paneer & Brown Rice Strength Bowl",
      subtitle: "Slow-release sustained casein",
      time: "30 min",
      calories: "620 kcal",
      image: "/app-ui/fuel-rec-paneer.png",
      href: "/app/recipe/spinach-egg-scramble",
    },
    {
      id: "tofu-rest",
      title: "Tofu & Chickpea Clean Bowl",
      subtitle: "Plant protein & micronutrients",
      time: "22 min",
      calories: "410 kcal",
      image: "/app-ui/fuel-rec-tofu.png",
      href: "/app/recipe/spinach-egg-scramble",
    },
    {
      id: "oats-rest",
      title: "Oats & Berries Power Bowl",
      subtitle: "Fiber & clean carbs",
      time: "10 min",
      calories: "360 kcal",
      image: "/app-ui/fuel-dish-oats.png",
      href: "/app/recipe/spinach-egg-scramble",
    },
  ],
  anytime: [
    {
      id: "toast-any",
      title: "Avocado & Egg Toast",
      subtitle: "Light & focused fuel",
      time: "8 min",
      calories: "330 kcal",
      image: "/app-ui/fuel-dish-toast.png",
      href: "/app/recipe/spinach-egg-scramble",
    },
    {
      id: "chicken-any",
      title: "Grilled Chicken & Quinoa Bowl",
      subtitle: "Complete protein",
      time: "25 min",
      calories: "540 kcal",
      image: "/app-ui/fuel-rec-chicken.png",
      href: "/app/recipe/spinach-egg-scramble",
    },
    {
      id: "tofu-any",
      title: "Tofu & Chickpea Clean Bowl",
      subtitle: "High-fiber clean meal",
      time: "22 min",
      calories: "410 kcal",
      image: "/app-ui/fuel-rec-tofu.png",
      href: "/app/recipe/spinach-egg-scramble",
    },
  ],
};

const RECOMMENDED_RECIPES: RecommendedRecipe[] = [
  {
    id: "rec-chicken",
    title: "Grilled Chicken & Quinoa Bowl",
    tag: "High in Protein",
    tagClass: styles.tagOrange,
    time: "25 min",
    calories: "540 kcal",
    image: "/app-ui/fuel-rec-chicken.png",
    href: "/app/recipe/spinach-egg-scramble",
  },
  {
    id: "rec-paneer",
    title: "Paneer & Brown Rice Strength Bowl",
    tag: "Muscle Gain",
    tagClass: styles.tagGreen,
    time: "30 min",
    calories: "620 kcal",
    image: "/app-ui/fuel-rec-paneer.png",
    href: "/app/recipe/spinach-egg-scramble",
  },
  {
    id: "rec-salmon",
    title: "Salmon & Veggie Power Bowl",
    tag: "Recovery",
    tagClass: styles.tagBlue,
    time: "28 min",
    calories: "580 kcal",
    image: "/app-ui/fuel-rec-salmon.png",
    href: "/app/recipe/hub-rec-salmon",
  },
  {
    id: "rec-tofu",
    title: "Tofu & Chickpea Clean Bowl",
    tag: "Cutting",
    tagClass: styles.tagLime,
    time: "22 min",
    calories: "410 kcal",
    image: "/app-ui/fuel-rec-tofu.png",
    href: "/app/recipe/spinach-egg-scramble",
  },
];

export default function FitnessClient() {
  const router = useRouter();
  const [activeGoal, setActiveGoal] = useState<GoalKey>("all");
  const [activeTiming, setActiveTiming] = useState<TimingKey>("before");
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set(["rec-chicken"]));
  const [pageBookmarked, setPageBookmarked] = useState(false);

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        toast.success("Removed from bookmarks");
      } else {
        next.add(id);
        toast.success("Saved to bookmarks");
      }
      return next;
    });
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/app");
    }
  };

  return (
    <div className={styles.container}>
      {/* 1. Top Navigation */}
      <nav className={styles.topNav} aria-label="Fitness page navigation">
        <button type="button" className={styles.backBtn} onClick={handleBack}>
          <ArrowLeft />
          <span>Home</span>
        </button>
        <div className={styles.navActions}>
          <button
            type="button"
            className={`${styles.iconBtn} ${pageBookmarked ? styles.bookmarkActive : ""}`}
            onClick={() => {
              setPageBookmarked(!pageBookmarked);
              toast.success(pageBookmarked ? "Removed Chapter from bookmarks" : "Bookmarked Strength & Fuel chapter");
            }}
            aria-label="Bookmark chapter"
          >
            <Bookmark fill={pageBookmarked ? "currentColor" : "none"} />
          </button>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => toast.info("Chapter options: Share, plan, or edit targets.")}
            aria-label="More options"
          >
            <MoreVertical />
          </button>
        </div>
      </nav>

      {/* 2. Chapter 02 Hero Header */}
      <header className={styles.heroHeader} aria-label="Chapter summary">
        <div className={styles.heroLeft}>
          <p className={styles.overline}>CHAPTER 02 • FITNESS</p>
          <h1 className={styles.heroTitle}>Strength &amp; Fuel</h1>
          <p className={styles.heroSubtitle}>
            Science-backed meals to build strength, fuel workouts and support your goals.
          </p>
        </div>
        <div className={styles.heroRight}>
          <img
            src="/app-ui/fuel-hero-gym.png"
            alt="Gym shaker and dumbbell"
            className={styles.heroImg}
          />
        </div>
      </header>

      {/* 3. Goal Filter Pills */}
      <nav className={styles.goalFilterRow} aria-label="Filter by fitness goal">
        <button
          type="button"
          className={`${styles.goalPill} ${activeGoal === "all" ? styles.goalPillActive : ""}`}
          onClick={() => setActiveGoal("all")}
        >
          <Calendar />
          <span>All goals</span>
        </button>
        <button
          type="button"
          className={`${styles.goalPill} ${activeGoal === "muscle_gain" ? styles.goalPillActive : ""}`}
          onClick={() => setActiveGoal("muscle_gain")}
        >
          <BicepsFlexed />
          <span>Muscle Gain</span>
        </button>
        <button
          type="button"
          className={`${styles.goalPill} ${activeGoal === "bulking" ? styles.goalPillActive : ""}`}
          onClick={() => setActiveGoal("bulking")}
        >
          <Dumbbell />
          <span>Bulking</span>
        </button>
        <button
          type="button"
          className={`${styles.goalPill} ${activeGoal === "cutting" ? styles.goalPillActive : ""}`}
          onClick={() => setActiveGoal("cutting")}
        >
          <Flame />
          <span>Cutting</span>
        </button>
        <button
          type="button"
          className={`${styles.goalPill} ${activeGoal === "endurance" ? styles.goalPillActive : ""}`}
          onClick={() => setActiveGoal("endurance")}
        >
          <Activity />
          <span>Endurance</span>
        </button>
      </nav>

      {/* 4. Set Your Goal Banner Card */}
      <section className={styles.setGoalCard} aria-label="Set goal banner">
        <div className={styles.setGoalLeft}>
          <div className={styles.setGoalIconCircle}>
            <Target />
          </div>
          <div className={styles.setGoalText}>
            <h3 className={styles.setGoalTitle}>Set your goal</h3>
            <p className={styles.setGoalDesc}>
              Tell us your goal and we&apos;ll personalize meals and targets just for you.
            </p>
          </div>
        </div>
        <button
          type="button"
          className={styles.setGoalBtn}
          onClick={() => router.push("/onboarding/conditions")}
        >
          <span>Set my target</span>
          <ArrowRight size={14} />
        </button>
      </section>

      {/* 5. Your Daily Fuel Target Card */}
      <section className={styles.fuelTargetCard} aria-label="Your daily fuel targets">
        <div className={styles.targetCardHeader}>
          <span className={styles.targetHeaderLeft}>
            <span>Your daily fuel target</span>
            <Info />
          </span>
          <button
            type="button"
            className={styles.editTargetsLink}
            onClick={() => toast.info("Personalize macro ratios in your profile settings.")}
          >
            Edit targets
          </button>
        </div>

        <div className={styles.targetMetricsStrip}>
          {/* Protein */}
          <div className={styles.targetCell}>
            <div className={styles.targetCellTop}>
              <div className={styles.targetIconBadge}>
                <Utensils />
              </div>
              <div className={styles.targetCellMeta}>
                <span className={styles.targetCellLabel}>Protein</span>
                <span className={styles.targetCellValue}>
                  110 <span style={{ fontSize: "0.75rem" }}>g</span>
                </span>
                <span className={styles.targetCellDenom}>/ 120 g</span>
              </div>
            </div>
            <div className={styles.targetProgressBar}>
              <div className={styles.targetProgressFill} style={{ width: "91%" }} />
            </div>
          </div>

          {/* Meals */}
          <div className={styles.targetCell}>
            <div className={styles.targetCellTop}>
              <div className={styles.targetIconBadge}>
                <Calendar />
              </div>
              <div className={styles.targetCellMeta}>
                <span className={styles.targetCellLabel}>Meals</span>
                <span className={styles.targetCellValue}>2 of 4</span>
                <span className={styles.targetCellDenom}>planned</span>
              </div>
            </div>
          </div>

          {/* Workout */}
          <div className={styles.targetCell}>
            <div className={styles.targetCellTop}>
              <div className={styles.targetIconBadge}>
                <Dumbbell />
              </div>
              <div className={styles.targetCellMeta}>
                <span className={styles.targetCellLabel}>Workout</span>
                <span className={styles.targetCellValue} style={{ fontSize: "0.82rem" }}>Training day</span>
                <span className={styles.targetCellDenom}>Today</span>
              </div>
            </div>
          </div>

          {/* Hydration */}
          <div className={styles.targetCell}>
            <div className={styles.targetCellTop}>
              <div className={styles.targetIconBadge}>
                <Droplet />
              </div>
              <div className={styles.targetCellMeta}>
                <span className={styles.targetCellLabel}>Hydration</span>
                <span className={styles.targetCellValue}>
                  1.4 <span style={{ fontSize: "0.75rem" }}>L</span>
                </span>
                <span className={styles.targetCellDenom}>/ 2.5 L</span>
              </div>
            </div>
            <div className={styles.targetProgressBar}>
              <div className={styles.targetProgressFill} style={{ width: "56%" }} />
            </div>
          </div>
        </div>
      </section>

      {/* 6. Fuel Around Your Workout Section */}
      <section className={styles.workoutSection} aria-label="Fuel around workout">
        <h2 className={styles.sectionTitle}>Fuel around your workout</h2>

        <div className={styles.timingFilterRow} role="tablist">
          <button
            type="button"
            className={`${styles.timingBtn} ${activeTiming === "before" ? styles.timingBtnActive : ""}`}
            onClick={() => setActiveTiming("before")}
          >
            Before workout
          </button>
          <button
            type="button"
            className={`${styles.timingBtn} ${activeTiming === "after" ? styles.timingBtnActive : ""}`}
            onClick={() => setActiveTiming("after")}
          >
            After workout
          </button>
          <button
            type="button"
            className={`${styles.timingBtn} ${activeTiming === "rest" ? styles.timingBtnActive : ""}`}
            onClick={() => setActiveTiming("rest")}
          >
            Rest day
          </button>
          <button
            type="button"
            className={`${styles.timingBtn} ${activeTiming === "anytime" ? styles.timingBtnActive : ""}`}
            onClick={() => setActiveTiming("anytime")}
          >
            Anytime
          </button>
        </div>

        <div className={styles.mealsHorizontalRail}>
          {TIMING_MEALS[activeTiming].map((meal) => (
            <Link key={meal.id} href={meal.href} className={styles.mealFuelCard}>
              <img src={meal.image} alt={meal.title} className={styles.mealFuelImg} />
              <div className={styles.mealFuelBody}>
                <h3 className={styles.mealFuelTitle}>{meal.title}</h3>
                <p className={styles.mealFuelSubtitle}>{meal.subtitle}</p>
                <div className={styles.mealFuelMeta}>
                  <Clock3 size={11} />
                  <span>{meal.time}</span>
                  <span>•</span>
                  <span>{meal.calories}</span>
                </div>
              </div>
            </Link>
          ))}

          {/* Action End Card */}
          <div
            className={styles.viewMoreMealsCard}
            onClick={() => router.push("/app/meals")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                router.push("/app/meals");
              }
            }}
          >
            <div className={styles.viewMoreIcon}>
              <Dumbbell size={18} />
            </div>
            <span className={styles.viewMoreText}>
              View all {activeTiming === "before" ? "Pre-workout" : activeTiming === "after" ? "Post-workout" : "Fitness"} meals
            </span>
            <div className={styles.viewMoreArrow}>
              <ArrowRight size={13} />
            </div>
          </div>
        </div>
      </section>

      {/* 7. Today's Strength Plan Banner Card */}
      <section className={styles.strengthPlanCard} aria-label="Today's strength plan">
        <div className={styles.planCardHeader}>
          <span className={styles.planHeaderLeft}>
            <span className={styles.planIconCircle}>
              <Calendar />
            </span>
            <span>Today&apos;s Strength Plan</span>
          </span>
          <button
            type="button"
            className={styles.viewAllLink}
            onClick={() => router.push("/app/daily-plan")}
          >
            <span>View full day</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div className={styles.planSlotsGrid}>
          {/* Breakfast */}
          <div className={styles.planSlotItem}>
            <span className={styles.planSlotName}>Breakfast</span>
            <span className={styles.planSlotType}>High Protein</span>
            <div className={styles.planThumbWrapper}>
              <img
                src="/app-ui/fuel-plan-breakfast.png"
                alt="Breakfast bowl"
                className={styles.planThumbImg}
              />
            </div>
            <div className={`${styles.slotStatusCircle} ${styles.slotDone}`}>
              <Check size={11} strokeWidth={3} />
            </div>
          </div>

          {/* Lunch */}
          <div className={styles.planSlotItem}>
            <span className={styles.planSlotName}>Lunch</span>
            <span className={styles.planSlotType}>Balanced</span>
            <div className={styles.planThumbWrapper}>
              <img
                src="/app-ui/fuel-plan-lunch.png"
                alt="Lunch bowl"
                className={styles.planThumbImg}
              />
            </div>
            <div className={`${styles.slotStatusCircle} ${styles.slotDone}`}>
              <Check size={11} strokeWidth={3} />
            </div>
          </div>

          {/* Pre-workout */}
          <div className={styles.planSlotItem}>
            <span className={styles.planSlotName}>Pre-workout</span>
            <span className={styles.planSlotType}>Energy Boost</span>
            <div className={styles.planThumbWrapper}>
              <img
                src="/app-ui/fuel-plan-preworkout.png"
                alt="Pre-workout shake"
                className={styles.planThumbImg}
              />
            </div>
            <div className={`${styles.slotStatusCircle} ${styles.slotPending}`} />
          </div>

          {/* Dinner */}
          <div className={styles.planSlotItem}>
            <span className={styles.planSlotName}>Dinner</span>
            <span className={styles.planSlotType}>Recovery</span>
            <div className={styles.planThumbWrapper}>
              <img
                src="/app-ui/fuel-plan-dinner.png"
                alt="Dinner bowl"
                className={styles.planThumbImg}
              />
            </div>
            <div className={`${styles.slotStatusCircle} ${styles.slotPending}`} />
          </div>
        </div>
      </section>

      {/* 8. Recommended For You Section */}
      <section className={styles.workoutSection} aria-label="Recommended for you">
        <div className={styles.sectionHeaderRow}>
          <h2 className={styles.sectionTitle}>Recommended for you</h2>
          <button
            type="button"
            className={styles.viewAllLink}
            onClick={() => router.push("/app/meals")}
          >
            <span>View all recipes</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div className={styles.recGridRail}>
          {RECOMMENDED_RECIPES.map((rec) => {
            const isBookmarked = bookmarkedIds.has(rec.id);
            return (
              <Link key={rec.id} href={rec.href} className={styles.recRecipeCard}>
                <div className={styles.recImgWrapper}>
                  <img src={rec.image} alt={rec.title} className={styles.recImg} />
                  <span className={`${styles.recTagPill} ${rec.tagClass}`}>{rec.tag}</span>
                  <button
                    type="button"
                    className={`${styles.recBookmarkBtn} ${isBookmarked ? styles.recBookmarkActive : ""}`}
                    onClick={(e) => toggleBookmark(rec.id, e)}
                    aria-label={isBookmarked ? "Remove bookmark" : "Bookmark recipe"}
                  >
                    <Bookmark size={12} fill={isBookmarked ? "currentColor" : "none"} />
                  </button>
                </div>
                <div className={styles.recBody}>
                  <h3 className={styles.recTitle}>{rec.title}</h3>
                  <div className={styles.recMeta}>
                    <Clock3 size={11} />
                    <span>{rec.time}</span>
                    <span>•</span>
                    <span>{rec.calories}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 9. Talk to a Sports Nutritionist Banner */}
      <section className={styles.nutritionistBanner} aria-label="Consult nutritionist">
        <div className={styles.nutritionistLeft}>
          <div className={styles.nutritionistIconCircle}>
            <MessageSquare />
          </div>
          <div className={styles.nutritionistText}>
            <h3 className={styles.nutritionistTitle}>Talk to a sports nutritionist</h3>
            <p className={styles.nutritionistDesc}>
              Get expert guidance tailored to your goal, workouts and lifestyle.
            </p>
          </div>
        </div>
        <div className={styles.nutritionistRight}>
          <Link href="/app/consult" className={styles.consultBtn}>
            <span>Consult now</span>
            <ArrowRight size={13} />
          </Link>
          <div className={styles.expertRatingStack}>
            <img
              src="/app-ui/fuel-nutritionist-avatars.png"
              alt="Expert nutritionists"
              className={styles.expertAvatarsImg}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
