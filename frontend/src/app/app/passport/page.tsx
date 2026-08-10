"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import api from "@/lib/api";
import {
  getCulinaryDestination,
  getRecipeArticle,
  PassportDestinationProgress,
  PassportProgress,
} from "@/lib/culinary";

import styles from "./page.module.css";

const FEATURED_STAMP_ORDER = ["japan", "india", "italy", "mexico"];
const RECENT_DATE_FORMATTER = new Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function formatCompletedDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Completed recently" : RECENT_DATE_FORMATTER.format(date);
}

function ArrowIcon({ direction = "right" }: { direction?: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={direction === "left" ? styles.arrowLeft : undefined}>
      <path d="M5 12h13M13 6l6 6-6 6" />
    </svg>
  );
}

function PassportMark() {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <circle cx="60" cy="60" r="41" />
      <path d="M38 42h44L40 78h44" />
      <path d="M76 69c9 1 16-3 21-12-1 11-8 18-21 18" />
    </svg>
  );
}

function StampIcon({ slug }: { slug: string }) {
  if (slug === "japan") {
    return (
      <svg viewBox="0 0 72 72" aria-hidden="true">
        <path d="M15 40h42c-2 13-9 19-21 19S17 53 15 40Z" />
        <path d="M20 40c2-10 9-16 16-16s14 6 16 16M24 31c5 4 19 4 24 0M25 18l30 13M31 14l27 13" />
        <circle cx="30" cy="34" r="3" />
      </svg>
    );
  }

  if (slug === "india") {
    return (
      <svg viewBox="0 0 72 72" aria-hidden="true">
        <circle cx="36" cy="36" r="7" />
        <path d="M36 12c7 6 8 12 0 17-8-5-7-11 0-17ZM36 60c-7-6-8-12 0-17 8 5 7 11 0 17ZM12 36c6-7 12-8 17 0-5 8-11 7-17 0ZM60 36c-6 7-12 8-17 0 5-8 11-7 17 0ZM19 19c9 0 13 4 12 12-8 1-12-3-12-12ZM53 53c-9 0-13-4-12-12 8-1 12 3 12 12ZM53 19c0 9-4 13-12 12-1-8 3-12 12-12ZM19 53c0-9 4-13 12-12 1 8-3 12-12 12Z" />
      </svg>
    );
  }

  if (slug === "italy" || slug === "mediterranean") {
    return (
      <svg viewBox="0 0 72 72" aria-hidden="true">
        <path d="M17 22h29M17 28h29M17 34h29M17 40h22" />
        <path d="M48 16v28c0 10 4 15 11 15M42 16v23c0 7-4 11-11 11" />
      </svg>
    );
  }

  if (slug === "mexico") {
    return (
      <svg viewBox="0 0 72 72" aria-hidden="true">
        <path d="M20 47c14 3 27-7 31-25 6 16-2 34-18 37-8 2-14-3-13-12Z" />
        <path d="M49 24c-1-7 3-11 10-11-3 5-2 9 2 12" />
        <path d="M26 48c6 0 12-3 17-9" />
      </svg>
    );
  }

  if (slug === "thailand") {
    return (
      <svg viewBox="0 0 72 72" aria-hidden="true">
        <path d="M14 56h44M20 56V35h32v21M17 35h38L36 15 17 35ZM27 56V43h18v13M29 34l7-10 7 10" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 72 72" aria-hidden="true">
      <circle cx="36" cy="36" r="23" />
      <path d="M13 36h46M36 13c9 8 13 15 13 23S45 51 36 59c-9-8-13-15-13-23s4-15 13-23Z" />
    </svg>
  );
}

export default function FoodPassport() {
  const [progress, setProgress] = useState<PassportProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const loadPassport = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setLoadError(null);
    try {
      const response = await api.get<PassportProgress>("/passport", { signal });
      if (!signal?.aborted) setProgress(response.data);
    } catch {
      if (!signal?.aborted) {
        setLoadError("We couldn’t open your Passport. Check your connection and try again.");
      }
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void loadPassport(controller.signal);

    return () => {
      controller.abort();
    };
  }, [loadPassport]);

  const stampGallery = useMemo(() => {
    if (!progress) return [];
    const bySlug = new Map(progress.destinations.map((destination) => [destination.slug, destination]));
    const ordered: PassportDestinationProgress[] = [];
    const seen = new Set<string>();

    for (const destination of progress.recent_stamps) {
      if (!seen.has(destination.slug)) {
        ordered.push(destination);
        seen.add(destination.slug);
      }
    }

    for (const slug of FEATURED_STAMP_ORDER) {
      const destination = bySlug.get(slug);
      if (destination && !seen.has(slug)) {
        ordered.push(destination);
        seen.add(slug);
      }
    }

    if (showAll) {
      for (const destination of progress.destinations) {
        if (!seen.has(destination.slug)) ordered.push(destination);
      }
    }

    return showAll ? ordered : ordered.slice(0, 4);
  }, [progress, showAll]);

  return (
    <div className={styles.page} aria-busy={loading}>
      <div className={styles.mapTexture} aria-hidden="true" />
      <div className={styles.shell}>
        <header className={styles.header}>
          <Link href="/app/explore" className={styles.roundButton} aria-label="Back to Discover">
            <ArrowIcon direction="left" />
          </Link>
          <h1>My Passport</h1>
          <details className={styles.menu}>
            <summary aria-label="Passport menu"><span /><span /><span /></summary>
            <div>
              <strong>How stamps work</strong>
              <p>Cook five dishes from one cuisine to earn its stamp.</p>
              <Link href="/app/explore">Find a recipe</Link>
            </div>
          </details>
        </header>

        {loading && !progress ? (
          <section className={styles.statusCard} role="status" aria-live="polite">
            <span className={styles.loadingSeal} aria-hidden="true"><PassportMark /></span>
            <h2>Opening your Passport…</h2>
            <p>Gathering your dishes, destinations, and stamps.</p>
          </section>
        ) : null}

        {loadError && !progress ? (
          <section className={styles.statusCard} role="alert">
            <span className={styles.errorSeal} aria-hidden="true">!</span>
            <h2>Passport unavailable</h2>
            <p>{loadError}</p>
            <button type="button" onClick={() => void loadPassport()} disabled={loading}>
              {loading ? "Trying again…" : "Try again"}
            </button>
          </section>
        ) : null}

        {progress ? (
          <>
            {loadError ? (
              <div className={styles.inlineError} role="alert">
                <span>{loadError}</span>
                <button type="button" onClick={() => void loadPassport()} disabled={loading}>
                  {loading ? "Retrying…" : "Retry"}
                </button>
              </div>
            ) : null}

            <section className={styles.passportCover} aria-label="Zenplato food passport cover">
              <div className={styles.coverInner}>
                <p className={styles.coverBrand}>Zenplato</p>
                <div className={styles.monogram}><PassportMark /></div>
                <h2>Food Passport</h2>
              </div>
            </section>

            <section className={styles.stats} aria-label="Passport statistics">
          <div>
            <strong>{progress.summary.countries_explored}</strong>
            <span>Countries explored</span>
          </div>
          <div>
            <strong>{progress.summary.dishes_cooked}</strong>
            <span>Recipes cooked</span>
          </div>
          <div>
            <strong>{progress.summary.stamps_earned}</strong>
            <span>Badges earned</span>
          </div>
            </section>

            <section className={styles.stampsSection} aria-labelledby="recent-stamps-title">
          <div className={styles.sectionHeader}>
            <div>
              <h2 id="recent-stamps-title">Recent stamps</h2>
              <p>{progress.summary.stamps_earned > 0 ? "Your culinary trail so far" : "Your first stamp is waiting"}</p>
            </div>
            <button type="button" onClick={() => setShowAll((visible) => !visible)} aria-expanded={showAll}>
              {showAll ? "Show less" : "View all"} <ArrowIcon />
            </button>
          </div>

              <div className={`${styles.stampGrid} ${showAll ? styles.stampGridExpanded : ""}`}>
                {stampGallery.map((destination) => (
                  <Link
                    key={destination.slug}
                    href={`/app/explore?cuisine=${destination.slug}`}
                    aria-label={`Explore ${destination.name} recipes${destination.stamp_earned ? ", stamp earned" : ""}`}
                    className={`${styles.stampItem} ${destination.stamp_earned ? styles.stampEarned : styles.stampLocked}`}
                  >
                    <div className={styles.stampSeal}>
                      <span className={styles.stampName}>{destination.name}</span>
                      <StampIcon slug={destination.slug} />
                      <span className={styles.stampFlourish}>✦</span>
                    </div>
                    <h3>{destination.name}</h3>
                    <p>
                      {destination.stamp_earned
                        ? destination.earned_at
                          ? formatCompletedDate(destination.earned_at)
                          : "Earned"
                        : `${destination.dishes_cooked}/${destination.stamp_goal} dishes`}
                    </p>
                  </Link>
                ))}
              </div>
            </section>

            <section className={styles.dishesSection} aria-labelledby="recent-dishes-title">
              <div className={styles.sectionHeader}>
                <div>
                  <h2 id="recent-dishes-title">Recent dishes</h2>
                  <p>The plates behind your journey</p>
                </div>
              </div>

              {progress.recent_dishes.length > 0 ? (
                <div className={styles.dishList}>
                  {progress.recent_dishes.map((dish) => {
                    const destination = getCulinaryDestination(dish.destination_slug);
                    return (
                      <Link key={dish.recipe_id} href={`/app/recipe/${encodeURIComponent(dish.recipe_id)}`} className={styles.dishRow}>
                        <img
                          src={dish.image || destination?.image || "/landing/discover-bowl.jpg"}
                          alt=""
                          loading="lazy"
                          onError={(event) => {
                            event.currentTarget.src = destination?.image || "/landing/discover-bowl.jpg";
                          }}
                        />
                        <span className={styles.dishCopy}>
                          <span>{destination?.flag} {dish.cuisine}</span>
                          <strong>{dish.title}</strong>
                          <time dateTime={dish.completed_at}>{formatCompletedDate(dish.completed_at)}</time>
                        </span>
                        <ArrowIcon />
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className={styles.emptyDishes}>
                  <p>Your completed recipes will appear here.</p>
                  <Link href="/app/explore">Choose your first dish <ArrowIcon /></Link>
                </div>
              )}
            </section>

            <NextStampCard nextStamp={progress.next_stamp} />
          </>
        ) : null}
      </div>
    </div>
  );
}

function NextStampCard({ nextStamp }: { nextStamp: PassportProgress["next_stamp"] }) {
  const percentage = nextStamp.stamp_goal > 0
    ? Math.min(100, Math.round((nextStamp.dishes_cooked / nextStamp.stamp_goal) * 100))
    : 0;
  const article = getRecipeArticle(nextStamp.cuisine);

  return (
    <section className={styles.nextStamp} aria-labelledby="next-stamp-title">
      <div className={styles.nextStampHeading}>
        <div className={styles.nextStampIcon}><StampIcon slug={nextStamp.slug} /></div>
        <div>
          <p>Next stamp</p>
          <h2 id="next-stamp-title">{nextStamp.name}</h2>
          <span>
            {nextStamp.remaining === 1
              ? "Cook 1 more dish"
              : `Cook ${nextStamp.remaining} more dishes`}
          </span>
        </div>
      </div>
      <div className={styles.progressRow}>
        <div
          className={styles.progressTrack}
          role="progressbar"
          aria-label={`${nextStamp.name} stamp progress`}
          aria-valuemin={0}
          aria-valuemax={nextStamp.stamp_goal}
          aria-valuenow={Math.min(nextStamp.dishes_cooked, nextStamp.stamp_goal)}
        >
          <span style={{ width: `${percentage}%` }} />
        </div>
        <strong>{nextStamp.dishes_cooked}/{nextStamp.stamp_goal}</strong>
      </div>
      <Link href={`/app/explore?cuisine=${nextStamp.slug}`}>
        Find {article} {nextStamp.cuisine} recipe <ArrowIcon />
      </Link>
    </section>
  );
}
