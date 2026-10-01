"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Bookmark,
  CalendarClock,
  ChevronRight,
  MessageCircle,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  Video,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import {
  CONSULTANTS,
  consultantMatchesConcern,
  resolveHealthConcern,
  type Consultant,
  type HealthConcernId,
} from "@/lib/consultants";
import styles from "./ConsultDirectory.module.css";

type CareFilterId = "all" | HealthConcernId | "nutrition" | "fitness" | "mindfulness";

const CARE_FILTERS: Array<{ id: CareFilterId; label: string }> = [
  { id: "all", label: "All" },
  { id: "pcos", label: "PCOS Care" },
  { id: "diabetes", label: "Diabetes" },
  { id: "digestive", label: "Gut Health" },
  { id: "nutrition", label: "Nutrition" },
  { id: "fitness", label: "Movement" },
  { id: "mindfulness", label: "Mind & Wellness" },
];

const UNIQUE_CONSULTANTS = (() => {
  const byName = new Map<string, Consultant>();
  for (const consultant of CONSULTANTS) {
    if (!byName.has(consultant.name)) byName.set(consultant.name, consultant);
  }
  return Array.from(byName.values());
})();

function matchesFilter(consultant: Consultant, filter: CareFilterId) {
  if (filter === "all") return true;
  if (["pcos", "diabetes", "thyroid", "weight", "digestive"].includes(filter)) {
    return consultantMatchesConcern(consultant, filter as HealthConcernId);
  }
  if (filter === "nutrition") return consultant.category === "Nutrition" || consultant.type.includes("nutritionist");
  if (filter === "fitness") return consultant.category === "Fitness" || consultant.type.includes("trainer") || consultant.type.includes("bodybuilding");
  return consultant.category === "Mindfulness" || consultant.category === "Lifestyle" || consultant.type === "wellness-coach";
}

function searchableText(consultant: Consultant) {
  return [
    consultant.name,
    consultant.title,
    consultant.category,
    consultant.location,
    ...consultant.specialties,
    ...consultant.areas,
    ...consultant.languages,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function Rating({ consultant, compact = false }: { consultant: Consultant; compact?: boolean }) {
  return (
    <span
      className={compact ? styles.compactRating : styles.rating}
      aria-label={`${consultant.rating} out of 5 from ${consultant.reviewsCount} reviews`}
    >
      <Star aria-hidden="true" fill="currentColor" />
      {consultant.rating} ({consultant.reviewsCount})
    </span>
  );
}

function SpecialistCard({ consultant }: { consultant: Consultant }) {
  return (
    <article className={styles.specialistCard}>
      <div className={styles.specialistTop}>
        <div className={styles.compactPortrait}>
          <Image
            src={consultant.photo}
            alt={`${consultant.name}, ${consultant.title}`}
            fill
            sizes="4rem"
          />
        </div>
        <div className={styles.specialistCopy}>
          <div className={styles.specialistMeta}>
            <Rating consultant={consultant} compact />
            <span>{consultant.available ? "Accepting preferences" : "Profile available"}</span>
          </div>
          <h3>{consultant.name}</h3>
          <p className={styles.role}>{consultant.title}</p>
          <p className={styles.specialties}>{consultant.specialties.slice(0, 3).join(" · ")}</p>
          <p className={styles.experience}>{consultant.yearsExperience} yrs experience · {consultant.languages.slice(0, 2).join(", ")}</p>
        </div>
      </div>
      <div className={styles.specialistAction}>
        <span>Consultation profile <strong>₹{consultant.feeInr}</strong></span>
        <Link href={`/app/consult/${consultant.id}`}>
          View profile <ChevronRight aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

export default function ConsultDirectoryClient() {
  const router = useRouter();
  const { user } = useAuth();
  const initialConcern = resolveHealthConcern(user?.conditions);
  const [activeFilter, setActiveFilter] = useState<CareFilterId>(initialConcern ?? "pcos");
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [savedRecommended, setSavedRecommended] = useState(false);

  const filteredConsultants = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return UNIQUE_CONSULTANTS.filter((consultant) => {
      if (!matchesFilter(consultant, activeFilter)) return false;
      return !normalizedQuery || searchableText(consultant).includes(normalizedQuery);
    });
  }, [activeFilter, query]);

  const recommended = filteredConsultants.find((consultant) => consultant.topMatch) ?? filteredConsultants[0];
  const moreSpecialists = recommended
    ? filteredConsultants.filter((consultant) => consultant.id !== recommended.id)
    : [];
  const visibleSpecialists = showAll ? moreSpecialists : moreSpecialists.slice(0, 2);
  const activeFilterLabel = CARE_FILTERS.find((filter) => filter.id === activeFilter)?.label ?? "your goals";

  return (
    <div className={styles.page}>
      <header className={styles.topBar}>
        <button type="button" onClick={() => router.back()} aria-label="Go back">
          <ArrowLeft aria-hidden="true" />
        </button>
        <span>Care Team &amp; Experts</span>
        <button
          type="button"
          className={savedRecommended ? styles.saved : undefined}
          onClick={() => setSavedRecommended((current) => !current)}
          aria-label={savedRecommended ? "Remove recommended specialist from saved" : "Save recommended specialist"}
          aria-pressed={savedRecommended}
          disabled={!recommended}
        >
          <Bookmark aria-hidden="true" fill={savedRecommended ? "currentColor" : "none"} />
        </button>
      </header>

      <div className={styles.content}>
        <section className={styles.intro} aria-labelledby="experts-title">
          <p>Holistic wellness support</p>
          <h1 id="experts-title">Work With Certified Specialists</h1>
          <span>Personalized guidance from nutritionists, fitness trainers and holistic wellness coaches.</span>
        </section>

        <section className={styles.discovery} aria-label="Find a specialist">
          <label className={styles.searchBox}>
            <Search aria-hidden="true" />
            <span className="sr-only">Search specialists</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search specialists, specialties, or concerns…"
            />
            <SlidersHorizontal aria-hidden="true" />
          </label>

          <div className={styles.filterRail} role="tablist" aria-label="Filter specialists by focus">
            {CARE_FILTERS.map((filter) => {
              const active = filter.id === activeFilter;
              return (
                <button
                  type="button"
                  role="tab"
                  aria-selected={active}
                  key={filter.id}
                  className={active ? styles.activeFilter : undefined}
                  onClick={() => {
                    setActiveFilter(filter.id);
                    setShowAll(false);
                  }}
                >
                  {filter.label}
                  {active ? <i aria-hidden="true" /> : null}
                </button>
              );
            })}
          </div>
        </section>

        {recommended ? (
          <>
            <section className={styles.recommended} aria-labelledby="recommended-heading">
              <div className={styles.sectionHeader}>
                <h2 id="recommended-heading">Recommended match</h2>
                <span>Focus match</span>
              </div>

              <article className={styles.featuredCard}>
                <div className={styles.featuredIdentity}>
                  <div className={styles.featuredPortrait}>
                    <Image
                      src={recommended.photo}
                      alt={`${recommended.name}, ${recommended.title}`}
                      fill
                      priority
                      sizes="(max-width: 639px) 5.25rem, 6rem"
                    />
                    <i aria-label="Profile includes credentials"><ShieldCheck aria-hidden="true" /></i>
                  </div>
                  <div className={styles.featuredCopy}>
                    <div className={styles.ratingRow}>
                      <Rating consultant={recommended} />
                      <span>Top match</span>
                    </div>
                    <h3>{recommended.name}</h3>
                    <p>{recommended.title}</p>
                    <small>{recommended.yearsExperience} yrs experience · {recommended.languages.slice(0, 2).join(", ")}</small>
                  </div>
                </div>

                <p className={styles.focusCopy}>
                  <strong>Key focus:</strong> {recommended.areas.slice(0, 4).join(", ")}.
                </p>

                <div className={styles.preferencePanel}>
                  <CalendarClock aria-hidden="true" />
                  <span><small>Booking preference</small><strong>Choose a time on the profile</strong></span>
                  <strong>₹{recommended.feeInr} <small>/ {recommended.sessionMinutes} min</small></strong>
                </div>

                <div className={styles.featuredActions}>
                  <Link href={`/app/consult/${recommended.id}?booking=1&mode=video`}>
                    Book consultation · ₹{recommended.feeInr}
                  </Link>
                  <Link href={`/app/consult/${recommended.id}`}>View profile</Link>
                </div>
                <p className={styles.actionNote}>Saves a preference only; no appointment or payment is created.</p>
              </article>
            </section>

            {moreSpecialists.length > 0 ? (
              <section className={styles.moreSection} aria-labelledby="more-specialists-heading">
                <div className={styles.sectionHeader}>
                  <h2 id="more-specialists-heading">More specialists</h2>
                  <button type="button" onClick={() => setShowAll((current) => !current)}>
                    {showAll ? "Show less" : `View all (${moreSpecialists.length})`}
                  </button>
                </div>
                <div className={styles.specialistList}>
                  {visibleSpecialists.map((consultant) => (
                    <SpecialistCard key={consultant.id} consultant={consultant} />
                  ))}
                </div>
              </section>
            ) : null}
          </>
        ) : (
          <section className={styles.emptyState} role="status">
            <Search aria-hidden="true" />
            <h2>No specialists found</h2>
            <p>Try another search or broaden the current focus filter.</p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setActiveFilter("all");
              }}
            >
              Browse all specialists
            </button>
          </section>
        )}

        <section className={styles.howItWorks} aria-labelledby="how-it-works-heading">
          <h2 id="how-it-works-heading">How ZenPlato Care Works</h2>
          <ol>
            <li>
              <span>1</span>
              <div><strong>Choose an expert</strong><p>Browse specialists based on your goals, concerns and preferred support style.</p></div>
            </li>
            <li>
              <span>2</span>
              <div><strong>Review profile and credentials</strong><p>Explore experience, areas of focus and catalogue reviews before deciding.</p></div>
            </li>
            <li>
              <span>3</span>
              <div><strong>Save your consultation preferences</strong><p>Choose a mode and preferred time. Live provider scheduling is not connected yet.</p></div>
            </li>
          </ol>
        </section>

        <section className={styles.reassurance} aria-label="Consultation catalogue details">
          <div><ShieldCheck aria-hidden="true" /><span>Clear credentials<small>Profile details</small></span></div>
          <div><Video aria-hidden="true" /><span>Flexible modes<small>Chat, audio or video</small></span></div>
          <div><MessageCircle aria-hidden="true" /><span>Preference first<small>No instant booking claim</small></span></div>
        </section>

        <p className={styles.catalogueNote}>
          Showing {filteredConsultants.length} specialist{filteredConsultants.length === 1 ? "" : "s"} for {activeFilterLabel.toLowerCase()}.
          Profiles are catalogue information; availability must be confirmed separately.
        </p>
      </div>
    </div>
  );
}
