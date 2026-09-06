"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Bookmark,
  Check,
  CheckCircle2,
  ChefHat,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock,
  CookingPot,
  Droplets,
  Heart,
  Leaf,
  Share2,
  Sprout,
  Star,
  Users,
  Wheat,
  WheatOff,
} from "lucide-react";
import styles from "./Chef.module.css";

interface FeaturedRecipe {
  id: string;
  tag: string;
  image: string;
  title: string;
  description: string;
  cookTime: string;
  level: string;
}

const FEATURED_RECIPES: FeaturedRecipe[] = [
  {
    id: "quinoa-pulao",
    tag: "High Protein",
    image: "/app-ui/chef-dish-quinoa.png",
    title: "Quinoa Pulao",
    description: "A wholesome one-pot meal full of protein and fibre.",
    cookTime: "25 mins",
    level: "Easy",
  },
  {
    id: "moong-dal-cheela",
    tag: "Diabetes Friendly",
    image: "/app-ui/chef-dish-cheela.png",
    title: "Moong Dal Cheela",
    description: "High in protein, low in GI and super delicious.",
    cookTime: "20 mins",
    level: "Easy",
  },
  {
    id: "beetroot-smoothie-bowl",
    tag: "Immunity Boost",
    image: "/app-ui/chef-dish-smoothie.png",
    title: "Beetroot Smoothie Bowl",
    description: "A refreshing bowl to boost your energy and immunity.",
    cookTime: "10 mins",
    level: "Easy",
  },
];

export default function ChefClient() {
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [isChefSaved, setIsChefSaved] = useState<boolean>(false);
  const [readMoreExpanded, setReadMoreExpanded] = useState<boolean>(false);
  const [bookmarkedRecipes, setBookmarkedRecipes] = useState<Set<string>>(new Set());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  const handleShare = async () => {
    const shareData = {
      title: "Chef Harshita • Zenplato Featured Chef",
      text: "Check out healthy recipes and culinary wisdom by Chef Harshita on Zenplato!",
      url: typeof window !== "undefined" ? window.location.href : "",
    };

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // User dismissed or share failed, fall back to copy
      }
    }

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(shareData.url);
      showToast("✓ Link copied to clipboard!");
    }
  };

  const toggleFollow = () => {
    setIsFollowing((prev) => {
      const next = !prev;
      showToast(next ? "✓ You are now following Chef Harshita!" : "Unfollowed Chef Harshita");
      return next;
    });
  };

  const toggleSaveChef = () => {
    setIsChefSaved((prev) => {
      const next = !prev;
      showToast(next ? "✓ Saved Chef Harshita to your favorites" : "Removed from saved chefs");
      return next;
    });
  };

  const toggleRecipeBookmark = (id: string, title: string) => {
    setBookmarkedRecipes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        showToast(`Removed ${title} from saved recipes`);
      } else {
        next.add(id);
        showToast(`✓ Saved ${title} to your cookbook`);
      }
      return next;
    });
  };

  return (
    <div className={styles.container}>
      {/* Top App Bar */}
      <header className={styles.topNav}>
        <button
          className={styles.backBtn}
          onClick={() => router.back()}
          aria-label="Back"
        >
          <ArrowLeft size={19} />
        </button>
        <h1 className={styles.pageTitle}>Featured Chef</h1>
        <button
          className={styles.shareBtn}
          onClick={handleShare}
          aria-label="Share Chef Profile"
        >
          <Share2 size={18} />
        </button>
      </header>

      {/* Chef Profile Hero */}
      <section className={styles.heroWrapper}>
        {/* Botanical sprig decoration */}
        <img
          src="/app-ui/chef-sprig.png"
          alt=""
          aria-hidden="true"
          className={styles.sprigDeco}
        />

        <div className={styles.chefHeroRow}>
          <div className={styles.chefInfoCol}>
            <div className={styles.nameRow}>
              <h2 className={styles.chefName}>Chef Harshita</h2>
              <CheckCircle2 size={19} className={styles.verifiedBadge} />
            </div>

            <p className={styles.chefTitle}>Healthy Indian Chef</p>

            <p className={styles.chefBioQuote}>
              Creating nourishing, delicious meals that heal the body and delight the soul.
            </p>

            {/* Attribute Tags */}
            <div className={styles.attrRow}>
              <span className={styles.attrItem}>
                <Leaf size={13} className={styles.attrIconLeaf} />
                <span>Healthy Cuisine</span>
              </span>
              <span className={styles.attrItem}>
                <Sprout size={13} className={styles.attrIconSprout} />
                <span>Clean Ingredients</span>
              </span>
              <span className={styles.attrItem}>
                <Heart size={13} className={styles.attrIconHeart} />
                <span>Mindful Cooking</span>
              </span>
            </div>

            {/* Action Buttons */}
            <div className={styles.actionBtnsRow}>
              <button
                className={`${styles.followBtn} ${isFollowing ? styles.followingActive : ""}`}
                onClick={toggleFollow}
              >
                {isFollowing ? (
                  <>
                    <Check size={15} /> Following
                  </>
                ) : (
                  "Follow Chef"
                )}
              </button>

              <button
                className={`${styles.saveChefBtn} ${isChefSaved ? styles.savedChefActive : ""}`}
                onClick={toggleSaveChef}
              >
                <Bookmark size={15} fill={isChefSaved ? "#C4556F" : "none"} />
                <span>{isChefSaved ? "Saved" : "Save"}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Portrait Card */}
          <div className={styles.chefPortraitCol}>
            <div className={styles.portraitCard}>
              <img
                src="/app-ui/chef-harshita.png"
                alt="Chef Harshita"
                className={styles.portraitImg}
              />
            </div>
          </div>
        </div>

        {/* Floating 4-Metric Stats Card */}
        <div className={styles.statsCard}>
          <div className={styles.statItem}>
            <div className={styles.statIconWrap}>
              <ChefHat size={18} />
            </div>
            <span className={styles.statValue}>125+</span>
            <span className={styles.statLabel}>Recipes</span>
          </div>

          <div className={styles.statItem}>
            <div className={styles.statIconWrap}>
              <Users size={18} />
            </div>
            <span className={styles.statValue}>58K+</span>
            <span className={styles.statLabel}>Followers</span>
          </div>

          <div className={styles.statItem}>
            <div className={styles.statIconWrap}>
              <Star size={18} fill="#E5A93B" color="#E5A93B" />
            </div>
            <span className={styles.statValue}>4.9</span>
            <span className={styles.statLabel}>Rating</span>
          </div>

          <div className={styles.statItem}>
            <div className={styles.statIconWrap}>
              <Sprout size={18} />
            </div>
            <span className={styles.statValue}>5+</span>
            <span className={styles.statLabel}>Years</span>
          </div>
        </div>
      </section>

      {/* "About Chef Harshita" Section */}
      <section className={styles.aboutSection}>
        <h2 className={styles.sectionTitle}>About Chef Harshita</h2>
        <p className={styles.aboutBio}>
          Chef Harshita believes healthy eating should never be boring or complicated. Her recipes are inspired by traditional Indian flavours with a modern, nutrition-first approach.
        </p>

        {readMoreExpanded && (
          <p className={styles.aboutBio} style={{ marginTop: 4 }}>
            With over 5 years of professional culinary mastery across Ayurvedic nutrition and contemporary mindful kitchens, she crafts nutrient-dense interpretations of beloved comfort classics. Her philosophy focuses on balancing macros, harnessing digestive spices, and using clean, seasonal produce to make wholesome eating an effortless daily celebration.
          </p>
        )}

        <button
          className={styles.readMoreBtn}
          onClick={() => setReadMoreExpanded(!readMoreExpanded)}
        >
          <span>{readMoreExpanded ? "Read Less" : "Read More"}</span>
          {readMoreExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </section>

      {/* "Chef's Specialties" Section */}
      <section className={styles.specialtiesSection}>
        <h2 className={styles.sectionTitle}>Chef&apos;s Specialties</h2>
        <div className={styles.specialtyGrid}>
          <div className={`${styles.specialtyBadge} ${styles.badgeIndian}`}>
            <CookingPot size={15} />
            <span>Indian Cuisine</span>
          </div>

          <div className={`${styles.specialtyBadge} ${styles.badgeProtein}`}>
            <Wheat size={15} />
            <span>High Protein</span>
          </div>

          <div className={`${styles.specialtyBadge} ${styles.badgeGlutenFree}`}>
            <WheatOff size={15} />
            <span>Gluten Free</span>
          </div>

          <div className={`${styles.specialtyBadge} ${styles.badgeDiabetes}`}>
            <Droplets size={15} />
            <span>Diabetes Friendly</span>
          </div>
        </div>
      </section>

      {/* "Featured Recipes" Section */}
      <section className={styles.recipesSection}>
        <div className={styles.recipesHeaderRow}>
          <h2 className={styles.sectionTitle}>Featured Recipes</h2>
          <Link href="/app/meals" className={styles.viewAllLink}>
            <span>View all</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        {/* Horizontal Recipe Rail */}
        <div className={styles.recipeRail}>
          {FEATURED_RECIPES.map((recipe) => {
            const isBookmarked = bookmarkedRecipes.has(recipe.id);

            return (
              <article key={recipe.id} className={styles.recipeCard}>
                <div className={styles.recipeMediaWrapper}>
                  <Link href={`/app/recipe/${recipe.id}`} tabIndex={-1}>
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className={styles.recipeImg}
                    />
                  </Link>
                  <span className={styles.recipeTagPill}>{recipe.tag}</span>
                  <button
                    className={`${styles.recipeBookmarkBtn} ${isBookmarked ? styles.bookmarkedActive : ""}`}
                    onClick={(e) => {
                      e.preventDefault();
                      toggleRecipeBookmark(recipe.id, recipe.title);
                    }}
                    aria-label={`Bookmark ${recipe.title}`}
                  >
                    <Bookmark size={14} fill={isBookmarked ? "#C4556F" : "none"} stroke={isBookmarked ? "#C4556F" : "currentColor"} />
                  </button>
                </div>

                <div className={styles.recipeCardBody}>
                  <Link href={`/app/recipe/${recipe.id}`} style={{ textDecoration: "none" }}>
                    <h3 className={styles.recipeTitle}>{recipe.title}</h3>
                  </Link>
                  <p className={styles.recipeDesc}>{recipe.description}</p>

                  <div className={styles.recipeMetaRow}>
                    <span className={styles.metaItem}>
                      <Clock size={12} />
                      <span>{recipe.cookTime}</span>
                    </span>
                    <span className={styles.metaItem}>
                      <Leaf size={12} />
                      <span>{recipe.level}</span>
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Carousel Dots */}
        <div className={styles.carouselDots} aria-hidden="true">
          <span className={`${styles.dot} ${styles.activeDot}`} />
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
        </div>
      </section>

      {/* Toast Notice */}
      {toastMessage && (
        <div className={styles.toastNotice} role="status" aria-live="polite">
          {toastMessage}
        </div>
      )}
    </div>
  );
}

