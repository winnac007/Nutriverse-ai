"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Bookmark,
  Search,
  SlidersHorizontal,
  Star,
} from "lucide-react";
import { CONSULTANTS } from "@/lib/consultants";
import styles from "./CoachesList.module.css";

const CATEGORIES = ["All", "Nutrition", "Fitness", "Lifestyle", "Mindfulness"];

export default function CoachesListClient() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  const toggleBookmark = (id: string, name: string) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        showToast(`Removed ${name} from saved coaches`);
      } else {
        next.add(id);
        showToast(`✓ Saved ${name} to your coaches list`);
      }
      return next;
    });
  };

  // Filter coaches to unique coaches (avoid duplicates from legacy e-00X aliases)
  const uniqueCoaches = useMemo(() => {
    const seen = new Set<string>();
    return CONSULTANTS.filter((coach) => {
      if (seen.has(coach.name)) return false;
      seen.add(coach.name);
      return true;
    });
  }, []);

  const filteredCoaches = useMemo(() => {
    return uniqueCoaches.filter((coach) => {
      // Category filter
      if (selectedCategory !== "All") {
        const coachCategory = coach.category || (
          coach.type === "nutritionist" ? "Nutrition" :
          coach.type === "fitness-trainer" ? "Fitness" :
          coach.type === "wellness-coach" ? "Mindfulness" : "Lifestyle"
        );
        if (coachCategory.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const searchable = [
          coach.name,
          coach.title,
          ...coach.specialties,
          ...coach.areas,
        ].join(" ").toLowerCase();
        if (!searchable.includes(query)) return false;
      }

      return true;
    });
  }, [uniqueCoaches, selectedCategory, searchQuery]);

  return (
    <div className={styles.container}>
      {/* Top Navigation Bar */}
      <header className={styles.topNav}>
        <button
          className={styles.navIconBtn}
          onClick={() => router.back()}
          aria-label="Back"
        >
          <ArrowLeft size={19} />
        </button>
        <button
          className={styles.navIconBtn}
          onClick={() => showToast("Filters: By Experience, Rating, Fee & Availability")}
          aria-label="Filter Options"
        >
          <SlidersHorizontal size={18} />
        </button>
      </header>

      {/* Header Section */}
      <section className={styles.headerSection}>
        <div className={styles.titleRow}>
          <h1 className={styles.pageTitle}>Health Coaches</h1>
          <span className={styles.leafEmoji} aria-hidden="true">🍃</span>
        </div>
        <p className={styles.subtitle}>Expert guidance for your wellness journey</p>
      </section>

      {/* Search Bar */}
      <div className={styles.searchWrapper}>
        <input
          type="text"
          placeholder="Search coaches, specialties..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
        <Search size={18} className={styles.searchIcon} />
      </div>

      {/* Category Filter Pills */}
      <div className={styles.pillRail} role="tablist" aria-label="Coach Categories">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              role="tab"
              aria-selected={isActive}
              onClick={() => setSelectedCategory(cat)}
              className={`${styles.filterPill} ${isActive ? styles.activeFilterPill : ""}`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Coaches List */}
      <main className={styles.coachList}>
        {filteredCoaches.length > 0 ? (
          filteredCoaches.map((coach) => {
            const isBookmarked = bookmarkedIds.has(coach.id);
            const specialtiesStr = coach.specialties.slice(0, 3).join(" • ");

            return (
              <div key={coach.id} className={styles.coachCard}>
                <Link
                  href={`/app/coaches/${coach.id}`}
                  className={styles.cardLeft}
                  style={{ textDecoration: "none" }}
                >
                  <div className={styles.avatarWrapper}>
                    <img
                      src={coach.photo}
                      alt={coach.name}
                      className={styles.avatarImg}
                    />
                  </div>
                  <div className={styles.coachInfoCol}>
                    <h2 className={styles.coachName}>{coach.name}</h2>
                    <p className={styles.coachTitle}>{coach.title}</p>
                    <p className={styles.coachSpecialties}>{specialtiesStr}</p>
                    <div className={styles.ratingRow}>
                      <Star size={11} className={styles.starIcon} />
                      <span>{coach.rating} ({coach.reviewsCount})</span>
                    </div>
                  </div>
                </Link>

                <button
                  className={`${styles.bookmarkBtn} ${isBookmarked ? styles.bookmarkedActive : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    toggleBookmark(coach.id, coach.name);
                  }}
                  aria-label={`Bookmark ${coach.name}`}
                >
                  <Bookmark
                    size={17}
                    fill={isBookmarked ? "#C4556F" : "none"}
                    stroke={isBookmarked ? "#C4556F" : "currentColor"}
                  />
                </button>
              </div>
            );
          })
        ) : (
          <div className={styles.emptyState}>
            <p>No coaches found matching &quot;{searchQuery}&quot; in {selectedCategory}.</p>
          </div>
        )}
      </main>

      {/* Toast Notice */}
      {toastMessage && (
        <div className={styles.toastNotice} role="status" aria-live="polite">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
