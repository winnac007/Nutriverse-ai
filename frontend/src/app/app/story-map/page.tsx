"use client";

import type { CSSProperties } from "react";
import { useState } from "react";

import {
  ArrowIcon,
  CulinaryPage,
  CulinaryShell,
  PrimaryLink,
  ScreenHeader,
} from "@/components/culinary/CulinaryPrimitives";
import api from "@/lib/api";
import { CULINARY_DESTINATIONS, type CulinaryDestination } from "@/lib/culinary";

import styles from "./page.module.css";

type ExploreState = "idle" | "saving" | "saved" | "unavailable";

export default function StoryMapPage() {
  const [selected, setSelected] = useState<CulinaryDestination | null>(null);
  const [exploreState, setExploreState] = useState<ExploreState>("idle");

  const chooseDestination = async (destination: CulinaryDestination) => {
    setSelected(destination);
    setExploreState("saving");

    try {
      await api.post(`/passport/explore/${destination.slug}`);
      setExploreState("saved");
    } catch {
      setExploreState("unavailable");
    }
  };

  return (
    <CulinaryPage>
      <CulinaryShell>
        <ScreenHeader title="Explore the World" backHref="/app/explore" />

        <main className={styles.layout}>
          <section className={styles.mapSection} aria-label="Culinary world map">
            <div className={styles.mapCanvas}>
              <img src="/landing/map-dark.jpg" alt="A warm gold map of the world at night" />
              <svg className={styles.routes} viewBox="0 0 100 60" preserveAspectRatio="none" aria-hidden="true">
                <path d="M19 28 C35 15, 55 52, 68 29 S78 16,84 21" />
                <path d="M45 26 C52 21, 64 24, 75 31 S60 43,50 32" />
              </svg>

              {CULINARY_DESTINATIONS.filter((destination) => destination.slug !== "global").map((destination) => {
                const style = {
                  "--hotspot-x": `${destination.mapPosition.x}%`,
                  "--hotspot-y": `${destination.mapPosition.y}%`,
                } as CSSProperties;
                const active = selected?.slug === destination.slug;

                return (
                  <button
                    type="button"
                    key={destination.slug}
                    className={`${styles.hotspot} ${active ? styles.hotspotActive : ""}`}
                    style={style}
                    aria-label={`Explore ${destination.name}`}
                    aria-pressed={active}
                    onClick={() => void chooseDestination(destination)}
                  >
                    <img src={destination.image} alt="" aria-hidden="true" />
                    <span>{destination.name}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <aside className={styles.prompt} aria-live="polite">
            {selected ? (
              <>
                <span className={styles.flag} aria-hidden="true">{selected.flag}</span>
                <div className={styles.promptCopy}>
                  <p className={styles.kicker}>Your next plate</p>
                  <h2>{selected.name}</h2>
                  <p>{selected.note}</p>
                  <span className={styles.saveState}>
                    {exploreState === "saving" ? "Saving this stop…" : null}
                    {exploreState === "saved" ? "Added to your Passport journey" : null}
                    {exploreState === "unavailable" ? "You can explore now; Passport sync is temporarily unavailable" : null}
                  </span>
                </div>
                <PrimaryLink href={`/app/explore/country/${selected.slug}`}>Explore cuisine</PrimaryLink>
              </>
            ) : (
              <>
                <div className={styles.compass} aria-hidden="true">✦</div>
                <div className={styles.promptCopy}>
                  <h2>Where will your next plate take you?</h2>
                  <p>Choose a destination on the map to explore its food, regions, and stories.</p>
                </div>
                <a className={styles.categoryLink} href="/app/explore/categories">
                  Browse categories <ArrowIcon />
                </a>
              </>
            )}
          </aside>
        </main>
      </CulinaryShell>
    </CulinaryPage>
  );
}
