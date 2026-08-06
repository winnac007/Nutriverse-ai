"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useDebounce } from "@/hooks/use-debounce";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { CULINARY_DESTINATIONS } from "@/lib/culinary";

import styles from "./page.module.css";


type DiscoverRecipe = {
  id?: string;
  title: string;
  cuisine?: string;
  country?: string;
  image?: string;
  cook_time?: number;
};

const FALLBACK_RECIPES: DiscoverRecipe[] = [
  {
    title: "Miso & greens bowl",
    cuisine: "Japanese",
    image: "/landing/dish-japan.jpg",
    cook_time: 25,
  },
  {
    title: "South Indian tiffin",
    cuisine: "Indian",
    image: "/landing/dish-india.jpg",
    cook_time: 30,
  },
  {
    title: "Garden mezze plate",
    cuisine: "Mediterranean",
    image: "/landing/dish-greece.jpg",
    cook_time: 20,
  },
];

const FALLBACK_IMAGE = "/landing/journey-discover.jpg";

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h13M13 6l6 6-6 6" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m16.5 16.5 4 4" />
    </svg>
  );
}

function LeafMark() {
  return (
    <svg viewBox="0 0 44 44" aria-hidden="true">
      <circle cx="22" cy="22" r="19" />
      <path d="M13 27c8-1 14-7 17-15 2 8-2 17-11 19" />
      <path d="M16 29c3-6 7-10 13-14" />
    </svg>
  );
}

export default function DiscoverThePlate() {
  const { user, refresh } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 350);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [recipes, setRecipes] = useState<DiscoverRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const recipeSectionRef = useRef<HTMLElement>(null);

  const selectedDestination = useMemo(
    () => CULINARY_DESTINATIONS.find((destination) => destination.slug === selectedSlug) ?? null,
    [selectedSlug],
  );
  const savedRecipes = useMemo(() => new Set(user?.saved_recipes ?? []), [user?.saved_recipes]);

  useEffect(() => {
    const requestedSlug = new URLSearchParams(window.location.search).get("cuisine");
    if (CULINARY_DESTINATIONS.some((destination) => destination.slug === requestedSlug)) {
      setSelectedSlug(requestedSlug);
    }
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);

    const params: Record<string, string> = {};
    if (selectedDestination) params.country = selectedDestination.cuisine;
    if (debouncedSearch.trim()) params.search = debouncedSearch.trim();

    api.get("/recipes", { params })
      .then((response) => {
        if (active) setRecipes(Array.isArray(response.data) ? response.data.slice(0, 6) : []);
      })
      .catch(() => {
        if (active) setRecipes([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [debouncedSearch, selectedDestination]);

  const exploreDestination = useCallback((slug: string, scrollToRecipes = false) => {
    const destination = CULINARY_DESTINATIONS.find((item) => item.slug === slug);
    if (!destination) return;

    setSelectedSlug(slug);
    void api.post(`/passport/explore/${slug}`).catch(() => undefined);

    if (scrollToRecipes) {
      window.setTimeout(() => {
        recipeSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    }
  }, []);

  const toggleSaved = useCallback(async (recipeId: string) => {
    try {
      await api.post(`/user/save-recipe/${recipeId}`);
      await refresh();
    } catch {
      // The recipe remains usable even if saving is temporarily unavailable.
    }
  }, [refresh]);

  const visibleRecipes = recipes.length > 0 ? recipes : FALLBACK_RECIPES;

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <Link href="/app" className={styles.brand} aria-label="Nutriverse home">
            <span className={styles.brandMark}><LeafMark /></span>
            <span>Nutriverse</span>
          </Link>
          <button
            type="button"
            className={styles.searchButton}
            aria-label={searchOpen ? "Close recipe search" : "Search recipes"}
            aria-expanded={searchOpen}
            aria-controls="discover-search-panel"
            onClick={() => setSearchOpen((open) => !open)}
          >
            <SearchIcon />
          </button>
        </header>

        <div
          id="discover-search-panel"
          className={`${styles.searchPanel} ${searchOpen ? styles.searchPanelOpen : ""}`}
          aria-hidden={!searchOpen}
        >
          <label htmlFor="discover-search">Search dishes and cuisines</label>
          <div className={styles.searchField}>
            <SearchIcon />
            <input
              id="discover-search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Try ramen, curry, or tacos"
              autoComplete="off"
              tabIndex={searchOpen ? 0 : -1}
            />
          </div>
        </div>

        <h1 className={styles.headline}>
          Taste the world,
          <span>one plate at a time</span>
        </h1>

        <section className={styles.hero} aria-labelledby="featured-destination-title">
          <img src="/landing/journey-discover.jpg" alt="Japanese noodle bowl in a dark, atmospheric setting" />
          <div className={styles.heroShade} />
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>
              <span aria-hidden="true">⌁</span> Featured destination
            </p>
            <h2 id="featured-destination-title">Coastal<br />Japan</h2>
            <p>Umami, ritual, and the sea.</p>
            <button type="button" onClick={() => exploreDestination("japan", true)}>
              Explore <ArrowIcon />
            </button>
          </div>
        </section>

        <section id="countries" className={styles.section} aria-labelledby="countries-title">
          <div className={styles.sectionHeader}>
            <h2 id="countries-title">Explore by country</h2>
            <Link href="/app/story-map">View map <ArrowIcon /></Link>
          </div>
          <div className={styles.countryRail}>
            {CULINARY_DESTINATIONS.map((destination) => {
              const selected = destination.slug === selectedSlug;
              return (
                <button
                  type="button"
                  key={destination.slug}
                  className={selected ? styles.countrySelected : undefined}
                  aria-pressed={selected}
                  onClick={() => exploreDestination(destination.slug, true)}
                >
                  <span className={styles.flag} aria-hidden="true">{destination.flag}</span>
                  <span>{destination.name}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section ref={recipeSectionRef} className={styles.section} aria-labelledby="popular-title">
          <div className={styles.sectionHeader}>
            <div>
              <h2 id="popular-title">
                {selectedDestination ? `Popular in ${selectedDestination.name}` : "Popular near you"}
              </h2>
              {selectedDestination ? <p>{selectedDestination.note}</p> : null}
            </div>
            {selectedDestination ? (
              <button type="button" className={styles.clearButton} onClick={() => setSelectedSlug(null)}>
                Clear
              </button>
            ) : null}
          </div>

          {loading ? (
            <div className={styles.recipeRail} aria-label="Loading recipes">
              {[0, 1, 2].map((item) => <div key={item} className={styles.recipeSkeleton} />)}
            </div>
          ) : (
            <div className={styles.recipeRail}>
              {visibleRecipes.slice(0, 3).map((recipe, index) => {
                const liveRecipe = Boolean(recipe.id);
                const cardContent = (
                  <>
                    <div className={styles.recipeImage}>
                      <img
                        src={recipe.image || FALLBACK_IMAGE}
                        alt={recipe.title}
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.src = FALLBACK_IMAGE;
                        }}
                      />
                    </div>
                    <div className={styles.recipeCopy}>
                      <h3>{recipe.title}</h3>
                      <p>
                        {recipe.country || recipe.cuisine || "World table"}
                        <span aria-hidden="true">⌁</span>
                      </p>
                      <span>{recipe.cook_time || 30} min</span>
                    </div>
                  </>
                );

                return liveRecipe ? (
                  <article className={styles.recipeCard} key={recipe.id}>
                    <Link className={styles.recipeLink} href={`/app/recipe/${recipe.id}`}>
                      {cardContent}
                    </Link>
                    <button
                      type="button"
                      className={styles.saveButton}
                      aria-label={savedRecipes.has(recipe.id!) ? `Remove ${recipe.title} from saved recipes` : `Save ${recipe.title}`}
                      aria-pressed={savedRecipes.has(recipe.id!)}
                      onClick={() => void toggleSaved(recipe.id!)}
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M20.8 4.7a5.4 5.4 0 0 0-7.7 0L12 5.8l-1.1-1.1a5.4 5.4 0 0 0-7.7 7.7l1.1 1.1L12 21l7.7-7.5 1.1-1.1a5.4 5.4 0 0 0 0-7.7Z" />
                      </svg>
                    </button>
                  </article>
                ) : (
                  <article className={styles.recipeCard} key={`${recipe.title}-${index}`}>
                    {cardContent}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
