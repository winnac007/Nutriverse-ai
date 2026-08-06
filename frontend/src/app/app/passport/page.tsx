"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import api from "@/lib/api";
import { CULINARY_DESTINATIONS, PassportDestinationProgress, PassportProgress } from "@/lib/culinary";

import styles from "./page.module.css";


const EMPTY_DESTINATIONS: PassportDestinationProgress[] = CULINARY_DESTINATIONS.map((destination) => ({
  slug: destination.slug,
  name: destination.name,
  cuisine: destination.cuisine,
  explored: false,
  dishes_cooked: 0,
  stamp_goal: 5,
  stamp_earned: false,
  earned_at: null,
}));

const EMPTY_PROGRESS: PassportProgress = {
  summary: { countries_explored: 0, dishes_cooked: 0, stamps_earned: 0 },
  destinations: EMPTY_DESTINATIONS,
  recent_stamps: [],
  recent_dishes: [],
  next_stamp: { ...EMPTY_DESTINATIONS[4], remaining: 5 },
};

const FEATURED_STAMP_ORDER = ["japan", "india", "italy", "mexico"];

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
      <path d="M43 79V40l34 39V40" />
      <path d="M76 49c10-1 17-7 21-17 1 12-5 22-18 25" />
      <path d="M79 55c5-8 10-13 17-18" />
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
  const [progress, setProgress] = useState<PassportProgress>(EMPTY_PROGRESS);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    let active = true;
    api.get("/passport")
      .then((response) => {
        if (active) setProgress(response.data);
      })
      .catch(() => {
        if (active) setProgress(EMPTY_PROGRESS);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const stampGallery = useMemo(() => {
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
  }, [progress.destinations, progress.recent_stamps, showAll]);

  const nextStamp = progress.next_stamp;
  const percentage = Math.min(100, Math.round((nextStamp.dishes_cooked / nextStamp.stamp_goal) * 100));

  return (
    <div className={styles.page} aria-busy={loading}>
      <div className={styles.mapTexture} aria-hidden="true" />
      <div className={styles.shell}>
        <header className={styles.header}>
          <Link href="/app/explore" className={styles.roundButton} aria-label="Back to Discover">
            <ArrowIcon direction="left" />
          </Link>
          <h1>My Food Passport</h1>
          <details className={styles.menu}>
            <summary aria-label="Passport menu"><span /><span /><span /></summary>
            <div>
              <strong>How stamps work</strong>
              <p>Cook five dishes from one cuisine to earn its stamp.</p>
              <Link href="/app/explore">Find a recipe</Link>
            </div>
          </details>
        </header>

        <section className={styles.passportCover} aria-label="Nutriverse culinary passport cover">
          <div className={styles.passportSpine} />
          <div className={styles.coverInner}>
            <p className={styles.coverBrand}>Nutriverse</p>
            <div className={styles.monogram}><PassportMark /></div>
            <h2>Culinary<br />Passport</h2>
            <div className={styles.coverDivider}><span /><i>⌁</i><span /></div>
            <p className={styles.coverSubtitle}>A record of dishes,<br />places &amp; stories</p>
          </div>
        </section>

        <section className={styles.stats} aria-label="Passport statistics">
          <div>
            <strong>{progress.summary.countries_explored}</strong>
            <span>Countries</span>
          </div>
          <div>
            <strong>{progress.summary.dishes_cooked}</strong>
            <span>Dishes</span>
          </div>
          <div>
            <strong>{progress.summary.stamps_earned}</strong>
            <span>Stamps</span>
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
              <article
                key={destination.slug}
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
                    ? "Earned"
                    : `${destination.dishes_cooked}/${destination.stamp_goal} dishes`}
                </p>
              </article>
            ))}
          </div>
        </section>

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
            <div className={styles.progressTrack}>
              <span style={{ width: `${percentage}%` }} />
            </div>
            <strong>{nextStamp.dishes_cooked}/{nextStamp.stamp_goal}</strong>
          </div>
          <Link href={`/app/explore?cuisine=${nextStamp.slug}`}>
            Find a {nextStamp.cuisine} recipe <ArrowIcon />
          </Link>
        </section>
      </div>
    </div>
  );
}
