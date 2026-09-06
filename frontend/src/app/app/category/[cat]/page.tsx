"use client";

import { use, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, Sprout } from "lucide-react";
import api from "@/lib/api";
import RecipeCard from "@/components/RecipeCard";
import FitnessClient from "@/app/app/fitness/FitnessClient";
import styles from "../../wellnessMeals.module.css";

type Recipe = { id: string; title: string; [key: string]: unknown };
const CATEGORY_COPY: Record<string, { label: string; eyebrow: string; intro: string }> = {
  healthcare: { label: "Healthcare", eyebrow: "Food that supports", intro: "Thoughtful recipes selected to complement your health priorities without losing comfort or flavor." },
  fitness: { label: "Fitness", eyebrow: "Fuel for movement", intro: "Balanced recipes for training, recovery, and the energy needed for an active week." },
  cultural: { label: "Cultural", eyebrow: "Tradition at the table", intro: "Recipes rooted in place, memory, and the food traditions that make nourishment feel like home." },
};

function GenericCategoryView({ cat }: { cat: string }) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const copy = CATEGORY_COPY[cat] || { label: cat.replace(/-/g, " "), eyebrow: "Recipe collection", intro: "Explore recipes selected for this part of your wellness journey." };

  const loadRecipes = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get<Recipe[]>("/recipes", { params: { category: cat } });
      setRecipes(data);
    } catch {
      setError("This recipe collection could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, [cat]);

  useEffect(() => { void loadRecipes(); }, [loadRecipes]);

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <nav className={styles.topbar} aria-label="Recipe collection navigation">
          <Link className={styles.backLink} href="/app" aria-label="Back to home"><ArrowLeft size={19} /></Link>
          <span className={styles.brand}><span className={styles.brandMark}>❧</span> Zenplate</span>
          <span className={styles.iconButton} aria-hidden="true"><Sprout size={20} /></span>
        </nav>

        <header className={styles.categoryHero}>
          <div><p className={styles.eyebrow}>{copy.eyebrow}</p><h1 className={`${styles.leftTitle} capitalize`}>{copy.label}</h1><p className={styles.weekLabel}>{loading ? "Gathering recipes…" : `${recipes.length} ${recipes.length === 1 ? "recipe" : "recipes"}`}</p></div>
          <p className={styles.categoryIntro}>{copy.intro}</p>
        </header>

        {loading ? (
          <div className={styles.state} aria-live="polite"><div className={styles.skeleton} aria-label="Loading recipes" /></div>
        ) : error ? (
          <div className={styles.state}><div><span className={styles.stateIcon}><Sprout size={20} /></span><h2 className={styles.stateTitle}>Collection unavailable</h2><p className={styles.stateText}>{error}</p><button className={styles.primaryButton} type="button" onClick={loadRecipes}><RefreshCw size={14} /> Try again</button></div></div>
        ) : recipes.length ? (
          <div className={styles.recipeGrid}>{recipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)}</div>
        ) : (
          <div className={styles.state}><div><span className={styles.stateIcon}><Sprout size={20} /></span><h2 className={styles.stateTitle}>A new collection is growing</h2><p className={styles.stateText}>There are no recipes in {copy.label.toLowerCase()} yet. Explore another path from home in the meantime.</p><Link className={styles.secondaryButton} href="/app">Return home</Link></div></div>
        )}
      </div>
    </main>
  );
}

export default function Category({ params }: { params: Promise<{ cat: string }> }) {
  const { cat } = use(params);
  if (cat === "fitness") {
    return <FitnessClient />;
  }
  return <GenericCategoryView cat={cat} />;
}
