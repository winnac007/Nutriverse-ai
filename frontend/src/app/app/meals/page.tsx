"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CalendarDays, Search, Sparkles, Wallet } from "lucide-react";
import RecipeCard from "@/components/RecipeCard";
import { useDebounce } from "@/hooks/use-debounce";
import { CURATED_RECIPE_REFERENCES } from "@/lib/culinary";
import api from "@/lib/api";
import styles from "./page.module.css";

type Tier = "all" | "budget" | "premium";

type Meal = {
  id: string;
  title: string;
  image?: string;
  is_premium?: boolean;
  tier?: string;
  cook_time?: number;
  category?: string;
  country?: string;
  cuisine?: string;
  tags?: string[];
  diets?: string[];
  nutrition?: { calories?: number };
};

const CATEGORIES = [
  ["all", "All"],
  ["healthcare", "Health"],
  ["fitness", "Fitness"],
  ["cultural", "Cultural"],
  ["chef-special", "Chef"],
] as const;

const TAGS = ["vegetarian", "vegan", "gluten-free", "dairy-free", "high-protein", "pescatarian", "dessert"];

const FALLBACK_MEALS: Meal[] = CURATED_RECIPE_REFERENCES.map((recipe, index) => ({
  id: recipe.id,
  title: recipe.title,
  image: recipe.image,
  cook_time: recipe.cookTime,
  category: "cultural",
  country: recipe.cuisine,
  tier: index % 4 === 0 ? "premium" : "budget",
  is_premium: index % 4 === 0,
  nutrition: { calories: recipe.calories },
  tags: recipe.difficulty === "Easy" ? ["budget"] : [],
}));

export default function MealsPage() {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [tag, setTag] = useState("");
  const [tier, setTier] = useState<Tier>("all");
  const [country, setCountry] = useState("all");
  const [region, setRegion] = useState("all");
  const [countries, setCountries] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialCountry = params.get("country");
    const initialSearch = params.get("search");
    if (initialCountry) setCountry(initialCountry);
    if (initialSearch) setSearch(initialSearch);
  }, []);

  useEffect(() => {
    api.get<string[]>("/recipes/countries")
      .then(({ data }) => setCountries(data))
      .catch(() => setCountries(["Indian", "Japanese", "Italian", "Greek", "French", "Chinese", "Korean", "Mexican"]));
  }, []);

  useEffect(() => {
    const params = country !== "all" ? { country } : {};
    api.get<string[]>("/recipes/regions", { params })
      .then(({ data }) => setRegions(data))
      .catch(() => setRegions([]));
    setRegion("all");
  }, [country]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError(false);
    const params: Record<string, string> = {};
    if (category !== "all") params.category = category;
    if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
    if (tag) params.tag = tag;
    if (tier !== "all") params.tier = tier;
    if (country !== "all") params.country = country;
    if (region !== "all") params.region = region;

    api.get<Meal[]>("/recipes", { params })
      .then(({ data }) => {
        if (active) setRecipes(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!active) return;
        setRecipes([]);
        setLoadError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [category, country, debouncedSearch, region, tag, tier]);

  const fallbackResults = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();
    return FALLBACK_MEALS.filter((recipe) => {
      if (category !== "all" && recipe.category !== category) return false;
      if (tier !== "all" && recipe.tier !== tier) return false;
      if (country !== "all" && !`${recipe.country} ${recipe.cuisine}`.toLowerCase().includes(country.toLowerCase())) return false;
      if (tag && ![...(recipe.tags || []), ...(recipe.diets || [])].includes(tag)) return false;
      return !query || `${recipe.title} ${recipe.country} ${recipe.cuisine}`.toLowerCase().includes(query);
    });
  }, [category, country, debouncedSearch, tag, tier]);

  const visibleRecipes = loadError ? fallbackResults : recipes;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div><p className={styles.eyebrow}>Find your next plate</p><h1>Explore meals</h1></div>
        <Link href="/app/daily-plan">Today&apos;s meals <CalendarDays /></Link>
      </header>

      <label className={styles.searchBox}>
        <Search aria-hidden="true" />
        <span className="sr-only">Search meals</span>
        <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Try “idli sambar”, “Korean”, “PCOS”…" />
      </label>

      <div className={styles.categoryTabs} role="tablist" aria-label="Meal categories">
        {CATEGORIES.map(([value, label]) => (
          <button key={value} type="button" role="tab" aria-selected={category === value} className={category === value ? styles.activeTab : ""} onClick={() => setCategory(value)}>{label}</button>
        ))}
      </div>

      <div className={styles.locationFilters}>
        <label><span className="sr-only">Country</span><select value={country} onChange={(event) => setCountry(event.target.value)}><option value="all">All countries</option>{countries.map((item) => <option value={item} key={item}>{item}</option>)}</select></label>
        <label><span className="sr-only">Region</span><select value={region} onChange={(event) => setRegion(event.target.value)} disabled={!regions.length}><option value="all">All regions</option>{regions.map((item) => <option value={item} key={item}>{item}</option>)}</select></label>
      </div>

      <div className={styles.tierTabs} aria-label="Meal price tier">
        {([
          ["all", "All", null],
          ["budget", "Budget", Wallet],
          ["premium", "Premium", Sparkles],
        ] as const).map(([value, label, Icon]) => (
          <button type="button" key={value} aria-pressed={tier === value} className={tier === value ? styles.activeTier : ""} onClick={() => setTier(value)}>{Icon ? <Icon aria-hidden="true" /> : null}{label}</button>
        ))}
      </div>

      <div className={styles.tagRail} aria-label="Dietary filters">
        <button type="button" className={!tag ? styles.activeChip : ""} aria-pressed={!tag} onClick={() => setTag("")}>All</button>
        {TAGS.map((item) => <button type="button" key={item} className={tag === item ? styles.activeChip : ""} aria-pressed={tag === item} onClick={() => setTag((current) => current === item ? "" : item)}>{item.replace("-", " ")}</button>)}
      </div>

      <section className={styles.results} aria-labelledby="meal-results-title">
        <div className={styles.resultsHeading}><h2 id="meal-results-title">Meals for you</h2><span>{loading ? "Finding dishes…" : `${visibleRecipes.length} ${visibleRecipes.length === 1 ? "recipe" : "recipes"}`}</span></div>
        {loading ? (
          <div className={styles.recipeGrid} aria-label="Loading meals">{[0, 1, 2, 3].map((item) => <div className={styles.skeleton} key={item} />)}</div>
        ) : visibleRecipes.length ? (
          <><div className={styles.recipeGrid}>{visibleRecipes.map((recipe) => <RecipeCard recipe={recipe} key={recipe.id} />)}</div>{loadError ? <p className={styles.fallbackNotice}>Live recipes are temporarily unavailable, so curated dishes are shown.</p> : null}</>
        ) : (
          <div className={styles.emptyState}><Sparkles /><h3>No matching plates</h3><p>Try clearing a filter or choosing another country.</p><button type="button" onClick={() => { setCategory("all"); setCountry("all"); setTier("all"); setTag(""); setSearch(""); }}>Clear filters</button></div>
        )}
      </section>

      <Link className={styles.planDock} href="/app/meal-plan">
        <span className={styles.planIcon}><Sparkles /></span>
        <span><strong>View Full Plan</strong><small>See your complete seven-day meal plan</small></span>
        <span className={styles.planArrow}><ArrowRight /></span>
      </Link>
    </div>
  );
}
