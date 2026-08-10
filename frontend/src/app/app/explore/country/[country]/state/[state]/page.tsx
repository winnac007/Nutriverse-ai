import Link from "next/link";
import { notFound } from "next/navigation";

import {
  CulinaryPage,
  CulinaryShell,
  ScreenHeader,
  SectionHeading,
} from "@/components/culinary/CulinaryPrimitives";
import {
  CURATED_RECIPE_REFERENCES,
  getCulinaryDestination,
  getCulinaryState,
} from "@/lib/culinary";

import styles from "./page.module.css";

const STATE_COLLECTIONS: Record<string, readonly string[]> = {
  odisha: ["Temple Cuisine", "Coastal Cuisine", "Street Food", "Festive Traditions"],
  fukuoka: ["Hakata Kitchens", "Yatai Stalls", "Seafood", "Kyushu Comfort"],
};

const STATE_SEARCH_DISHES: Record<string, readonly string[]> = {
  odisha: ["Pakhala", "Santula"],
  fukuoka: ["Mentaiko", "Motsunabe"],
};

export default async function CulinaryStatePage({
  params,
}: {
  params: Promise<{ country: string; state: string }>;
}) {
  const { country, state: stateSlug } = await params;
  const destination = getCulinaryDestination(country);
  const state = getCulinaryState(stateSlug);

  if (!destination || !state || state.destinationSlug !== destination.slug) notFound();

  const recipes = CURATED_RECIPE_REFERENCES.filter((recipe) => state.recipeIds.includes(recipe.id));
  const collections = STATE_COLLECTIONS[state.slug] || ["Home Cooking", "Seasonal Table", "Street Food", "Celebration Food"];
  const searchDishes = STATE_SEARCH_DISHES[state.slug] || [];

  return (
    <CulinaryPage>
      <CulinaryShell>
        <ScreenHeader title={state.name} backHref={`/app/explore/country/${destination.slug}`} />

        <main>
          <section className={styles.hero}>
            <img src={state.image} alt={`A cultural view of ${state.name}`} />
            <div className={styles.shade} />
            <div className={styles.heroCopy}>
              <p>{destination.name} · {state.note}</p>
              <h2>{state.name}</h2>
              <span>{state.description}</span>
            </div>
          </section>

          <section className={styles.section} aria-labelledby="state-cuisines-title">
            <SectionHeading title="Famous Cuisines" href={`/app/explore?cuisine=${destination.slug}`} />
            <div className={styles.collectionGrid}>
              {collections.map((collection, index) => (
                <Link
                  key={collection}
                  href={`/app/explore?cuisine=${destination.slug}&search=${encodeURIComponent(collection)}`}
                >
                  <img
                    src={recipes[index % Math.max(recipes.length, 1)]?.image || destination.image}
                    alt=""
                    aria-hidden="true"
                  />
                  <span>{collection}</span>
                </Link>
              ))}
            </div>
          </section>

          <section className={styles.section} aria-labelledby="must-try-title">
            <SectionHeading title="Must Try Dishes" href={`/app/explore?cuisine=${destination.slug}`} />
            <div className={styles.dishGrid}>
              {recipes.map((recipe) => (
                <article key={recipe.id}>
                  <Link href={`/app/recipe/${recipe.id}`}>
                    <img src={recipe.image} alt={recipe.title} />
                    <span>
                      <strong>{recipe.title}</strong>
                      <small>{recipe.cookTime} min · {recipe.difficulty}</small>
                    </span>
                  </Link>
                </article>
              ))}
              {searchDishes.map((dish, index) => (
                <article key={dish}>
                  <Link href={`/app/explore?cuisine=${destination.slug}&search=${encodeURIComponent(dish)}`}>
                    <img src={recipes[index % Math.max(recipes.length, 1)]?.image || destination.image} alt="" aria-hidden="true" />
                    <span>
                      <strong>{dish}</strong>
                      <small>Explore recipes</small>
                    </span>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        </main>
      </CulinaryShell>
    </CulinaryPage>
  );
}
