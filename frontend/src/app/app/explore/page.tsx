"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  ArrowIcon,
  EmptyState,
  SearchIcon,
  ZenplatoMark,
} from "@/components/culinary/CulinaryPrimitives";
import { useDebounce } from "@/hooks/use-debounce";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";
import {
  CULINARY_DESTINATIONS,
  CURATED_RECIPE_REFERENCES,
  getCulinaryDestination,
} from "@/lib/culinary";

import styles from "./page.module.css";

type DiscoverRecipe = {
  id: string;
  title: string;
  cuisine?: string;
  country?: string;
  image?: string;
  cook_time?: number;
};

const FALLBACK_IMAGE = "/landing/journey-discover.jpg";

export default function DiscoverThePlate() {
  const router = useRouter();
  const { user, refresh } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 350);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [recipes, setRecipes] = useState<DiscoverRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [requestVersion, setRequestVersion] = useState(0);
  const [passportMessage, setPassportMessage] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const recipeSectionRef = useRef<HTMLElement>(null);

  const selectedDestination = useMemo(() => getCulinaryDestination(selectedSlug), [selectedSlug]);
  const savedRecipes = useMemo(() => new Set(user?.saved_recipes ?? []), [user?.saved_recipes]);

  const curatedForSelection = useMemo(() => {
    const query = debouncedSearch.trim().toLocaleLowerCase();
    return CURATED_RECIPE_REFERENCES
      .filter((recipe) => !selectedSlug || recipe.destinationSlug === selectedSlug)
      .filter((recipe) => !query || `${recipe.title} ${recipe.cuisine} ${recipe.description}`.toLocaleLowerCase().includes(query))
      .map<DiscoverRecipe>((recipe) => ({
        id: recipe.id,
        title: recipe.title,
        cuisine: recipe.cuisine,
        image: recipe.image,
        cook_time: recipe.cookTime,
      }));
  }, [debouncedSearch, selectedSlug]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedSlug = params.get("cuisine");
    const requestedSearch = params.get("search");
    if (getCulinaryDestination(requestedSlug)) setSelectedSlug(requestedSlug);
    if (requestedSearch) {
      setSearch(requestedSearch);
      setSearchOpen(true);
    }
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError(false);

    const params: Record<string, string> = {};
    if (selectedDestination) params.country = selectedDestination.cuisine;
    if (debouncedSearch.trim()) params.search = debouncedSearch.trim();

    api.get("/recipes", { params })
      .then((response) => {
        if (!active) return;
        const nextRecipes = Array.isArray(response.data) ? response.data : [];
        const uniqueRecipes = new Map<string, DiscoverRecipe>();
        nextRecipes.forEach((recipe: DiscoverRecipe) => {
          if (recipe.id) uniqueRecipes.set(recipe.id, recipe);
        });
        setRecipes(Array.from(uniqueRecipes.values()).slice(0, 12));
      })
      .catch(() => {
        if (!active) return;
        setRecipes([]);
        setLoadError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [debouncedSearch, selectedDestination, requestVersion]);

  const updateCuisineUrl = (slug: string | null) => {
    const url = new URL(window.location.href);
    if (slug) url.searchParams.set("cuisine", slug);
    else url.searchParams.delete("cuisine");
    window.history.replaceState({}, "", `${url.pathname}${url.search}`);
  };

  const exploreDestination = useCallback(async (slug: string, openGuide = false) => {
    const destination = getCulinaryDestination(slug);
    if (!destination) return;

    setSelectedSlug(slug);
    updateCuisineUrl(slug);
    setPassportMessage("Saving this stop…");

    try {
      await api.post(`/passport/explore/${slug}`);
      setPassportMessage(`${destination.name} added to your Passport journey`);
    } catch {
      setPassportMessage("Explore now; Passport sync is temporarily unavailable");
    }

    if (openGuide) {
      router.push(`/app/explore/country/${slug}`);
      return;
    }

    window.setTimeout(() => {
      recipeSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }, [router]);

  const clearFilters = () => {
    setSelectedSlug(null);
    setSearch("");
    setSearchOpen(false);
    setPassportMessage("");
    const url = new URL(window.location.href);
    url.searchParams.delete("cuisine");
    url.searchParams.delete("search");
    window.history.replaceState({}, "", url.pathname);
  };

  const toggleSaved = useCallback(async (recipeId: string, title: string) => {
    setSaveMessage("");
    try {
      await api.post(`/user/save-recipe/${recipeId}`);
      await refresh();
      setSaveMessage(`${title} saved`);
    } catch {
      setSaveMessage(`Could not save ${title}. Try again.`);
    }
  }, [refresh]);

  const visibleRecipes = loadError ? curatedForSelection : recipes;

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <Link href="/app/explore/welcome" className={styles.brand} aria-label="Zenplato welcome">
            <ZenplatoMark />
          </Link>
          <div className={styles.headerActions}>
            <Link href="/app/explore/categories" className={styles.categoriesButton}>Categories</Link>
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
          </div>
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
          Discover
          <span>The Plate</span>
        </h1>

        <section className={styles.hero} aria-labelledby="featured-destination-title">
          <img src="/landing/japan-fuji.png" alt="Mount Fuji and a traditional Japanese pagoda at dusk" />
          <div className={styles.heroShade} />
          <div className={styles.heroContent}>
            <h2 id="featured-destination-title">Explore<br />Japan</h2>
            <p>Experience centuries of Japanese culinary tradition.</p>
            <button type="button" onClick={() => void exploreDestination("japan", true)}>
              Explore Now <ArrowIcon />
            </button>
          </div>
        </section>

        <section id="countries" className={styles.section} aria-labelledby="countries-title">
          <div className={styles.sectionHeader}>
            <h2 id="countries-title">Explore by Country</h2>
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
                  onClick={() => void exploreDestination(destination.slug)}
                >
                  <span className={styles.flag} aria-hidden="true">{destination.flag}</span>
                  <span>{destination.name}</span>
                </button>
              );
            })}
          </div>
          <p className={styles.syncMessage} aria-live="polite">{passportMessage}</p>
        </section>

        <section ref={recipeSectionRef} className={styles.section} aria-labelledby="popular-title">
          <div className={styles.sectionHeader}>
            <div>
              <h2 id="popular-title">
                {selectedDestination ? `Popular in ${selectedDestination.name}` : "Popular Cuisines"}
              </h2>
              {selectedDestination ? <p>{selectedDestination.note}</p> : null}
            </div>
            {selectedDestination ? (
              <Link href={`/app/explore/country/${selectedDestination.slug}`}>Open guide <ArrowIcon /></Link>
            ) : (
              <Link href="/app/explore/categories">View all <ArrowIcon /></Link>
            )}
          </div>

          {loading ? (
            <div className={styles.recipeRail} aria-label="Loading recipes">
              {[0, 1, 2].map((item) => <div key={item} className={styles.recipeSkeleton} />)}
            </div>
          ) : loadError && visibleRecipes.length === 0 ? (
            <EmptyState
              title="Recipes could not be loaded"
              message="The destination guide is still available. Reconnect and try the live recipe collection again."
              action={<button className={styles.retryButton} type="button" onClick={() => setRequestVersion((value) => value + 1)}>Try again</button>}
            />
          ) : visibleRecipes.length === 0 ? (
            <EmptyState
              title="No plates found"
              message="Try a broader dish name, another destination, or clear the current filters."
              action={<button className={styles.retryButton} type="button" onClick={clearFilters}>Clear filters</button>}
            />
          ) : (
            <>
              {loadError ? (
                <div className={styles.errorBanner} role="status">
                  Live results are unavailable. Showing the curated Zenplato collection.
                  <button type="button" onClick={() => setRequestVersion((value) => value + 1)}>Retry</button>
                </div>
              ) : null}
              <div className={styles.recipeRail}>
                {visibleRecipes.slice(0, 6).map((recipe) => (
                  <article className={styles.recipeCard} key={recipe.id}>
                    <Link className={styles.recipeLink} href={`/app/recipe/${recipe.id}`}>
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
                        <p>{recipe.country || recipe.cuisine || "World table"}<span aria-hidden="true">⌁</span></p>
                        <span>{recipe.cook_time || 30} min</span>
                      </div>
                    </Link>
                    <button
                      type="button"
                      className={styles.saveButton}
                      aria-label={savedRecipes.has(recipe.id) ? `Remove ${recipe.title} from saved recipes` : `Save ${recipe.title}`}
                      aria-pressed={savedRecipes.has(recipe.id)}
                      onClick={() => void toggleSaved(recipe.id, recipe.title)}
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M20.8 4.7a5.4 5.4 0 0 0-7.7 0L12 5.8l-1.1-1.1a5.4 5.4 0 0 0-7.7 7.7l1.1 1.1L12 21l7.7-7.5 1.1-1.1a5.4 5.4 0 0 0 0-7.7Z" />
                      </svg>
                    </button>
                  </article>
                ))}
              </div>
              <p className={styles.syncMessage} aria-live="polite">{saveMessage}</p>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
