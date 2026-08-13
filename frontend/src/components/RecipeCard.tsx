"use client";

import Link from "next/link";
import { ArrowUpRight, Clock3, Flame, LockKeyhole } from "lucide-react";
import { useAuth } from "@/lib/auth";
import styles from "./RecipeCard.module.css";

type Recipe = {
  id: string;
  title: string;
  image?: string;
  is_premium?: boolean;
  cook_time?: number;
  category?: string;
  country?: string;
  nutrition?: { calories?: number };
  conditions?: string[];
};

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=640";

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  const { user } = useAuth();
  const locked = Boolean(recipe.is_premium && !user?.is_premium);

  return (
    <Link className={styles.card} href={locked ? "/app/profile" : `/app/recipe/${recipe.id}`} aria-label={`${recipe.title}${locked ? ", premium recipe" : ""}`}>
      <div className={styles.imageWrap}>
        <img className={`${styles.image} ${locked ? styles.lockedImage : ""}`} src={recipe.image || FALLBACK_IMAGE} alt="" loading="lazy" onError={(event) => { event.currentTarget.src = FALLBACK_IMAGE; }} />
        {locked && <span className={styles.premium}><LockKeyhole size={11} /> Premium</span>}
        {recipe.cook_time && <span className={styles.time}><Clock3 size={12} /> {recipe.cook_time} min</span>}
      </div>
      <div className={styles.copy}>
        {(recipe.category || recipe.country) && <p className={styles.eyebrow}>{[recipe.category, recipe.country].filter(Boolean).join(" · ")}</p>}
        <h2 className={styles.title}>{recipe.title}</h2>
        <div className={styles.meta}>
          {recipe.nutrition?.calories ? <span><Flame size={13} /> {recipe.nutrition.calories} kcal</span> : <span>Open recipe</span>}
          <span className={styles.arrow}><ArrowUpRight size={15} /></span>
        </div>
        {recipe.conditions?.length ? <div className={styles.tags}>{recipe.conditions.slice(0, 2).map((condition) => <span key={condition}>{condition}</span>)}</div> : null}
      </div>
    </Link>
  );
}
