"use client";

import {
  Bell,
  BriefcaseBusiness,
  Dumbbell,
  Droplets,
  Flower2,
  HeartPulse,
  MessageCircle,
  Phone,
  Salad,
  Scale,
  Search,
  Sprout,
  Star,
  Stethoscope,
  Trophy,
  Video,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { useAuth } from "@/lib/auth";
import {
  CONSULTANTS,
  CONSULTATION_MODES,
  EXPERT_TYPES,
  HEALTH_CONCERNS,
  consultantMatchesConcern,
  resolveHealthConcern,
  type ConsultationMode,
  type ExpertTypeId,
  type HealthConcernId,
} from "@/lib/consultants";
import styles from "./Consult.module.css";

const EXPERT_ICONS: Record<ExpertTypeId, LucideIcon> = {
  nutritionist: Sprout,
  "health-specialist": Stethoscope,
  "wellness-coach": Flower2,
  "sports-nutritionist": Dumbbell,
  "bodybuilding-coach": Trophy,
  "fitness-trainer": HeartPulse,
};

const MODE_ICONS: Record<ConsultationMode, LucideIcon> = {
  chat: MessageCircle,
  video: Video,
  audio: Phone,
};

const CONCERN_ICONS: Record<HealthConcernId, LucideIcon> = {
  pcos: Flower2,
  diabetes: Droplets,
  thyroid: HeartPulse,
  weight: Scale,
  digestive: Salad,
};

export default function ConsultPage() {
  const { user } = useAuth();
  const userConcern = resolveHealthConcern(user?.conditions);
  const [selectedType, setSelectedType] = useState<ExpertTypeId | null>("nutritionist");
  const [selectedConcern, setSelectedConcern] = useState<HealthConcernId | null>(userConcern);
  const [selectedMode, setSelectedMode] = useState<ConsultationMode>("video");
  const [search, setSearch] = useState("");
  const [showNotice, setShowNotice] = useState(false);
  const [selectionFeedback, setSelectionFeedback] = useState("Showing nutritionists below");
  const recommendationsRef = useRef<HTMLElement>(null);

  const recommended = useMemo(() => {
    const query = search.trim().toLowerCase();
    return CONSULTANTS.filter((consultant) => {
      if (selectedType && consultant.type !== selectedType) return false;
      if (selectedConcern && !consultantMatchesConcern(consultant, selectedConcern)) return false;
      if (!query) return true;
      const searchable = [
        consultant.name,
        consultant.title,
        consultant.location,
        ...consultant.specialties,
        ...consultant.areas,
      ].join(" ").toLowerCase();
      return searchable.includes(query);
    }).sort((left, right) => Number(Boolean(right.topMatch)) - Number(Boolean(left.topMatch)));
  }, [search, selectedConcern, selectedType]);

  const revealRecommendations = (message: string) => {
    setSelectionFeedback(message);
    window.setTimeout(() => {
      recommendationsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      recommendationsRef.current?.focus({ preventScroll: true });
    }, 80);
  };

  const selectConcern = (id: HealthConcernId, label: string) => {
    const clearing = selectedConcern === id;
    setSelectedConcern(clearing ? null : id);
    setSelectedType(null);
    revealRecommendations(clearing ? "Showing all consultants below" : `Showing experts for ${label} below`);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <div className={styles.titleRow}>
            <h1>Consultations</h1>
            <Sprout aria-hidden="true" />
          </div>
          <p>Guidance that knows you. Connect with the right professional for your health, nutrition and wellness goals.</p>
        </div>

        <div className={styles.noticeWrap}>
          <button
            className={styles.iconButton}
            type="button"
            aria-label="Show consultation update"
            aria-expanded={showNotice}
            onClick={() => setShowNotice((current) => !current)}
          >
            <Bell aria-hidden="true" />
            <span />
          </button>
          {showNotice ? (
            <div className={styles.notice} role="status">
              <strong>Your consultation space is ready.</strong>
              <p>Choose an expert, consultation type and health focus to find the right match.</p>
            </div>
          ) : null}
        </div>
      </header>

      <section className={styles.expertTypes} aria-labelledby="expert-types-title">
        <h2 id="expert-types-title">Choose your expert</h2>
        <div className={styles.expertTypeGrid}>
          {EXPERT_TYPES.map((expertType) => {
            const Icon = EXPERT_ICONS[expertType.id];
            const active = selectedType === expertType.id;
            return (
              <button
                key={expertType.id}
                type="button"
                className={active ? styles.activeType : ""}
                aria-pressed={active}
                onClick={() => {
                  const clearing = selectedType === expertType.id;
                  setSelectedType(clearing ? null : expertType.id);
                  setSelectedConcern(null);
                  revealRecommendations(clearing ? "Showing all consultants below" : `Showing ${expertType.label.toLowerCase()}s below`);
                }}
              >
                <span className={styles.typeIcon}><Icon aria-hidden="true" /></span>
                <strong>{expertType.label}</strong>
                <small>{expertType.blurb}</small>
              </button>
            );
          })}
        </div>
        <button className={styles.selectionFeedback} type="button" onClick={() => revealRecommendations(selectionFeedback)} aria-live="polite">
          <Sprout aria-hidden="true" /> {selectionFeedback} <span>View matches ↓</span>
        </button>
      </section>

      <label className={styles.searchBox}>
        <Search aria-hidden="true" />
        <span className="sr-only">Search consultants</span>
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name, expertise or concern..."
        />
      </label>

      <section className={styles.modes} aria-labelledby="consultation-options-title">
        <h2 id="consultation-options-title">Consultation options</h2>
        <div className={styles.modeGrid}>
          {CONSULTATION_MODES.map((mode) => {
            const Icon = MODE_ICONS[mode.id];
            const active = selectedMode === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                className={`${styles.modeCard} ${styles[mode.id]} ${active ? styles.activeMode : ""}`}
                aria-pressed={active}
                onClick={() => setSelectedMode(mode.id)}
              >
                <span><Icon aria-hidden="true" /></span>
                <strong>{mode.label}</strong>
                <small>{mode.description}</small>
              </button>
            );
          })}
        </div>
      </section>

      <section className={styles.healthNeeds} aria-labelledby="health-needs-title">
        <div className={styles.sectionHeading}>
          <h2 id="health-needs-title">For your health needs</h2>
          <button
            type="button"
            onClick={() => {
              setSelectedConcern(null);
              setSelectedType(null);
              revealRecommendations("Showing all consultants below");
            }}
          >
            See all
          </button>
        </div>
        <div className={styles.concernGrid}>
          {HEALTH_CONCERNS.map((concern) => {
            const Icon = CONCERN_ICONS[concern.id];
            const active = selectedConcern === concern.id;
            return (
              <button
                key={concern.id}
                type="button"
                className={active ? styles.activeConcern : ""}
                aria-pressed={active}
                onClick={() => selectConcern(concern.id, concern.label)}
              >
                <Icon aria-hidden="true" />
                <span>{concern.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section ref={recommendationsRef} tabIndex={-1} className={styles.recommendations} aria-labelledby="recommended-title">
        <div className={styles.sectionHeading}>
          <h2 id="recommended-title"><Sprout aria-hidden="true" /> Recommended for you</h2>
          <span>{recommended.length}</span>
        </div>

        {recommended.length ? (
          <div className={styles.consultantList}>
            {recommended.map((consultant, index) => (
              <article className={styles.consultantCard} key={consultant.id}>
                <div className={styles.consultantHeader}>
                  <div className={styles.portrait}>
                    <Image
                      src={consultant.photo}
                      alt={`${consultant.name}, ${consultant.title}`}
                      fill
                      priority={index < 2}
                      sizes="(max-width: 699px) 5.5rem, 6.5rem"
                    />
                    {consultant.available ? <span aria-label="Available now" /> : null}
                  </div>

                  <div className={styles.consultantInfo}>
                    <div className={styles.nameRow}>
                      <h3>{consultant.name}</h3>
                      {consultant.topMatch ? <span>Top match</span> : null}
                    </div>
                    <p>{consultant.title}</p>
                    <div className={styles.ratingRow}>
                      <span><Star aria-hidden="true" /> {consultant.rating} ({consultant.reviewsCount})</span>
                      <i aria-hidden="true">·</i>
                      <span><BriefcaseBusiness aria-hidden="true" /> {consultant.yearsExperience} yrs exp.</span>
                    </div>
                    <small>Specializes in {consultant.specialties.join(", ")}</small>
                  </div>

                  <p className={styles.fee}>₹{consultant.feeInr}<span>/ consult</span></p>
                </div>

                <div className={styles.specialties} aria-label="Specialties">
                  {consultant.specialties.map((specialty) => <span key={specialty}>{specialty}</span>)}
                </div>

                <div className={styles.cardActions}>
                  <Link href={`/app/consult/${consultant.id}?mode=${selectedMode}`}>View Profile</Link>
                  <Link href={`/app/consult/${consultant.id}?mode=${selectedMode}&book=true`}>Book Consultation</Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <Sprout aria-hidden="true" />
            <h3>No exact matches yet</h3>
            <p>Try another expert type, health focus or search phrase.</p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedConcern(null);
                setSelectedType(null);
              }}
            >
              View all consultants
            </button>
          </div>
        )}
      </section>

      <aside className={styles.closingNote}>
        <span><Sprout aria-hidden="true" /></span>
        <div>
          <h2>Your health. Your way.</h2>
          <p>Our experts understand your body, your food preferences and your goals.</p>
        </div>
      </aside>
    </div>
  );
}
