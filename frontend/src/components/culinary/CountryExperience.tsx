"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import api from "@/lib/api";
import {
  CURATED_RECIPE_REFERENCES,
  getCulinaryDestination,
  getCulinaryRegions,
  getCulinaryStates,
  type CuratedRecipeReference,
} from "@/lib/culinary";

import {
  ArrowIcon,
  CulinaryPage,
  CulinaryShell,
  DownloadIcon,
  EmptyState,
  HeartIcon,
  PrimaryLink,
  ScreenHeader,
  SectionHeading,
} from "./CulinaryPrimitives";
import styles from "./CountryExperience.module.css";

type RecipeSummary = {
  id: string;
  title: string;
  cuisine?: string;
  image?: string;
  description?: string;
  cook_time?: number;
  cookTime?: number;
};

type ActionState = "idle" | "working" | "done" | "error";

const DISCOVERY_TERMS: Record<string, readonly string[]> = {
  japan: ["Sushi", "Tempura", "Udon", "Yakitori", "Okonomiyaki"],
  india: ["Thali", "Dosa", "Chaat", "Biryani", "Kheer"],
  italy: ["Pasta", "Risotto", "Polenta", "Focaccia", "Gelato"],
  mexico: ["Tacos", "Tamales", "Pozole", "Tostadas", "Churros"],
  thailand: ["Pad Thai", "Green Curry", "Som Tam", "Satay", "Mango Rice"],
  mediterranean: ["Mezze", "Grilled Fish", "Fasolia", "Dolma", "Baklava"],
  korea: ["Kimchi", "Japchae", "Tteokbokki", "Bulgogi", "Hotteok"],
  morocco: ["Couscous", "Harira", "Pastilla", "Maakouda", "Chebakia"],
  global: ["Grain Bowl", "Noodle Bowl", "Roast Vegetables", "Flatbread", "Fruit Plate"],
};

function normalizeRecipe(recipe: CuratedRecipeReference): RecipeSummary {
  return {
    id: recipe.id,
    title: recipe.title,
    cuisine: recipe.cuisine,
    image: recipe.image,
    description: recipe.description,
    cookTime: recipe.cookTime,
  };
}

function RecipeTile({ recipe }: { recipe: RecipeSummary }) {
  return (
    <article className={styles.recipeTile}>
      <Link href={`/app/recipe/${recipe.id}`}>
        <img
          src={recipe.image || "/landing/journey-discover.jpg"}
          alt={recipe.title}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.src = "/landing/journey-discover.jpg";
          }}
        />
        <span>
          <strong>{recipe.title}</strong>
          <small>{recipe.cuisine || "World table"} · {recipe.cook_time || recipe.cookTime || 30} min</small>
        </span>
      </Link>
    </article>
  );
}

function IndiaMap() {
  return (
    <svg className={styles.indiaMap} viewBox="0 0 220 250" role="img" aria-label="Stylised map of India with culinary regions">
      <defs>
        <linearGradient id="india-map-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#b3ad62" />
          <stop offset="1" stopColor="#5d602d" />
        </linearGradient>
      </defs>
      <path
        d="M70 18 93 25l18-9 25 14 18-3 10 16 18 5-3 24 17 19-10 22-16 7-5 26-18 18-6 25-17 15-10 33-12 2-7-34-16-17-4-24-18-13-10-27-14-10 4-20-11-17 12-16-3-24 18-6 8-16Z"
        fill="url(#india-map-fill)"
      />
      <path d="M76 61c26 12 52 12 83 4M56 105c35-6 78 8 113 18M72 157c24-8 49-3 72 10" />
      <circle cx="151" cy="121" r="6" />
      <text x="161" y="126">Odisha</text>
    </svg>
  );
}

export default function CountryExperience({ slug }: { slug: string }) {
  const destination = getCulinaryDestination(slug);
  const regionSectionRef = useRef<HTMLElement>(null);
  const [liveRecipes, setLiveRecipes] = useState<RecipeSummary[]>([]);
  const [recipeState, setRecipeState] = useState<"loading" | "ready" | "error">("loading");
  const [saveState, setSaveState] = useState<ActionState>("idle");
  const [guideState, setGuideState] = useState<ActionState>("idle");

  useEffect(() => {
    if (!destination) return;
    let active = true;
    setRecipeState("loading");

    api.get("/recipes", { params: { country: destination.cuisine } })
      .then((response) => {
        if (!active) return;
        setLiveRecipes(Array.isArray(response.data) ? response.data : []);
        setRecipeState("ready");
      })
      .catch(() => {
        if (active) setRecipeState("error");
      });

    return () => {
      active = false;
    };
  }, [destination]);

  const curatedRecipes = useMemo(
    () => CURATED_RECIPE_REFERENCES.filter((recipe) => recipe.destinationSlug === slug).map(normalizeRecipe),
    [slug],
  );
  const recipes = useMemo(() => {
    const merged = new Map<string, RecipeSummary>();
    curatedRecipes.forEach((recipe) => merged.set(recipe.id, recipe));
    liveRecipes.forEach((recipe) => {
      if (recipe.id) merged.set(recipe.id, recipe);
    });
    return Array.from(merged.values());
  }, [curatedRecipes, liveRecipes]);

  if (!destination) {
    return (
      <CulinaryPage>
        <CulinaryShell narrow>
          <ScreenHeader title="Destination" backHref="/app/explore#countries" />
          <div className={styles.notFound}>
            <EmptyState
              title="This destination is not in the guide yet"
              message="Return to the country catalogue and choose one of the available culinary journeys."
              action={<PrimaryLink href="/app/explore#countries">Browse countries</PrimaryLink>}
            />
          </div>
        </CulinaryShell>
      </CulinaryPage>
    );
  }

  const regions = getCulinaryRegions(destination.slug);
  const indiaRegionalView = destination.slug === "india";

  const exploreCountry = async () => {
    setSaveState("working");
    try {
      await api.post(`/passport/explore/${destination.slug}`);
      setSaveState("done");
      regionSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch {
      setSaveState("error");
    }
  };

  const downloadGuide = () => {
    setGuideState("working");
    const dishNames = recipes.slice(0, 8).map((recipe) => `• ${recipe.title}`).join("\n");
    const regionNames = regions.map((region) => `• ${region.name}: ${region.note}`).join("\n");
    const guide = `${destination.name} culinary guide\n\n${destination.note}\n\nRegions\n${regionNames || "• Regional guide coming soon"}\n\nDishes to try\n${dishNames || "• Explore the live recipe collection"}\n`;
    const url = URL.createObjectURL(new Blob([guide], { type: "text/plain;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${destination.slug}-culinary-guide.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
    setGuideState("done");
  };

  return (
    <CulinaryPage>
      <CulinaryShell>
        <ScreenHeader title={destination.name} backHref="/app/explore#countries" />

        <main>
          <section className={styles.hero}>
            <div className={styles.heroCopy}>
              <span className={styles.flag} aria-hidden="true">{destination.flag}</span>
              <h2>{destination.name}</h2>
              <p className={styles.lead}>
                {destination.slug === "japan" ? "Simple. Beautiful. Nourishing." : destination.note}
              </p>
              <p>
                Discover {destination.name} through its authentic flavours, regional kitchens, and living traditions.
              </p>

              <div className={styles.actions}>
                <button type="button" className={styles.primaryButton} onClick={() => void exploreCountry()}>
                  {saveState === "working" ? "Saving journey…" : "Explore Now"} <ArrowIcon />
                </button>
                <button type="button" className={styles.outlineButton} onClick={() => void exploreCountry()}>
                  <HeartIcon filled={saveState === "done"} />
                  {saveState === "done" ? "Country Saved" : "Save Country"}
                </button>
                <button type="button" className={styles.outlineButton} onClick={downloadGuide}>
                  <DownloadIcon />
                  {guideState === "done" ? "Guide Downloaded" : "Download Guide"}
                </button>
              </div>

              {saveState === "error" ? (
                <p className={styles.inlineError} role="status">The guide is open, but Passport sync is unavailable. Try saving again.</p>
              ) : null}
            </div>

            <div className={styles.heroImage}>
              <img src={destination.image} alt={`A dish representing ${destination.name}`} />
            </div>
          </section>

          {indiaRegionalView ? (
            <section ref={regionSectionRef} className={styles.regionExplorer} aria-labelledby="india-regions-title">
              <div className={styles.indiaVisual}>
                <div>
                  <p className={styles.kicker}>A country of many kitchens</p>
                  <h2 id="india-regions-title">Explore India by region</h2>
                  <p>Move through spice, climate, grain, coast, and tradition—then enter Odisha through East India.</p>
                </div>
                <IndiaMap />
              </div>

              <div className={styles.regionList}>
                {regions.map((region) => {
                  const states = getCulinaryStates(region.slug);
                  const href = states[0]
                    ? `/app/explore/country/${destination.slug}/state/${states[0].slug}`
                    : `/app/explore?cuisine=${destination.slug}&search=${encodeURIComponent(region.name)}`;
                  return (
                    <Link key={region.slug} href={href}>
                      <span>
                        <strong>{region.name}</strong>
                        <small>{region.note}</small>
                      </span>
                      <ArrowIcon />
                    </Link>
                  );
                })}
              </div>
            </section>
          ) : (
            <section ref={regionSectionRef} className={styles.recipeSection} aria-labelledby="traditional-dishes-title">
              <SectionHeading title="Traditional Dishes" href={`/app/explore?cuisine=${destination.slug}`} />
              {recipeState === "error" ? (
                <p className={styles.dataNotice} role="status">Live recipes are unavailable; the curated destination guide remains ready.</p>
              ) : null}
              <div className={styles.recipeRail}>
                {recipes.slice(0, 6).map((recipe) => <RecipeTile key={recipe.id} recipe={recipe} />)}
                {recipeState === "loading" ? <div className={styles.skeleton} aria-label="Loading live recipes" /> : null}
              </div>
            </section>
          )}

          <section className={styles.discoverySection} aria-labelledby="discover-more-title">
            <SectionHeading title={indiaRegionalView ? "Taste across India" : "Street Food"} href={`/app/explore?cuisine=${destination.slug}`} />
            <div className={styles.discoveryRail}>
              {(DISCOVERY_TERMS[destination.slug] || DISCOVERY_TERMS.global).map((term, index) => (
                <Link key={term} href={`/app/explore?cuisine=${destination.slug}&search=${encodeURIComponent(term)}`}>
                  <img src={recipes[index % Math.max(recipes.length, 1)]?.image || destination.image} alt="" aria-hidden="true" />
                  <span>{term}</span>
                </Link>
              ))}
            </div>
          </section>
        </main>
      </CulinaryShell>
    </CulinaryPage>
  );
}
