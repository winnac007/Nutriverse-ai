"use client";

import * as Dialog from "@radix-ui/react-dialog";
import {
  ArrowLeft,
  Award,
  CalendarDays,
  Check,
  Ellipsis,
  Globe2,
  GraduationCap,
  MapPin,
  MessageCircle,
  Phone,
  Share2,
  ShieldCheck,
  Sprout,
  Star,
  UsersRound,
  Video,
  X,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import {
  CONSULTATION_MODES,
  type Consultant,
  type ConsultationMode,
} from "@/lib/consultants";
import styles from "./Profile.module.css";

const MODE_ICONS: Record<ConsultationMode, LucideIcon> = {
  chat: MessageCircle,
  video: Video,
  audio: Phone,
};

type ConsultantProfileClientProps = {
  consultant: Consultant;
  initialBooking: boolean;
  initialMode: ConsultationMode;
};

export default function ConsultantProfileClient({ consultant, initialBooking, initialMode }: ConsultantProfileClientProps) {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState<ConsultationMode>(initialMode);
  const [preferredTime, setPreferredTime] = useState("Morning · 9am–12pm");
  const [requestSaved, setRequestSaved] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (initialBooking) setBookingOpen(true);
  }, [initialBooking]);

  const openBooking = (mode?: ConsultationMode) => {
    if (mode) setSelectedMode(mode);
    setRequestSaved(false);
    setBookingOpen(true);
  };

  const saveBookingPreview = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    window.sessionStorage.setItem("zenplate-consultation-preference", JSON.stringify({
      consultantId: consultant.id,
      consultant: consultant.name,
      mode: selectedMode,
      preferredTime,
    }));
    setRequestSaved(true);
  };

  const shareProfile = async () => {
    setShowMenu(false);
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: consultant.name, text: `View ${consultant.name}'s ZenPlate profile`, url });
        return;
      }
      await navigator.clipboard.writeText(url);
    } catch {
      // Sharing can be cancelled without affecting the profile experience.
    }
  };

  const stats = [
    { label: "Happy Clients", value: `${consultant.consultations}+`, icon: UsersRound },
    { label: "Experience", value: `${consultant.yearsExperience}+ yrs`, icon: CalendarDays },
    { label: "Client Rating", value: `${consultant.rating}/5`, icon: Star },
    { label: "Consultations", value: consultant.consultations >= 1000 ? "1K+" : `${consultant.consultations}+`, icon: MessageCircle },
  ];

  return (
    <div className={styles.page}>
      <header className={styles.profileHeader}>
        <Link href="/app/consult" aria-label="Back to consultations"><ArrowLeft aria-hidden="true" /></Link>
        <h1>Nutritionist Profile</h1>
        <div className={styles.menuWrap}>
          <button
            type="button"
            aria-label="More profile options"
            aria-expanded={showMenu}
            onClick={() => setShowMenu((current) => !current)}
          >
            <Ellipsis aria-hidden="true" />
          </button>
          {showMenu ? (
            <div className={styles.profileMenu}>
              <button type="button" onClick={() => void shareProfile()}><Share2 aria-hidden="true" /> Share profile</button>
              <Link href="/app/consult">Browse consultants</Link>
            </div>
          ) : null}
        </div>
      </header>

      <section className={styles.identityCard} aria-labelledby="consultant-name">
        <div className={styles.identityTop}>
          <div className={styles.portrait}>
            <Image
              src={consultant.photo}
              alt={`${consultant.name}, ${consultant.title}`}
              fill
              priority
              sizes="(max-width: 639px) 6rem, 10rem"
            />
          </div>

          <div className={styles.identityCopy}>
            <div className={styles.nameRow}>
              <h2 id="consultant-name">{consultant.name}</h2>
              {consultant.available ? <span><i /> Available</span> : <span className={styles.unavailable}>Next slot soon</span>}
            </div>
            <p>{consultant.title}</p>
            <div className={styles.primaryMeta}>
              <span><Star aria-hidden="true" /> {consultant.rating} ({consultant.reviewsCount} Reviews)</span>
              <i aria-hidden="true">·</i>
              <span><ShieldCheck aria-hidden="true" /> {consultant.yearsExperience} yrs Experience</span>
            </div>
          </div>
        </div>

        <div className={styles.specializesPanel}>
          <Sprout aria-hidden="true" />
          <div>
            <span>Specialises in</span>
            <p>{consultant.specialties.join(", ")}</p>
          </div>
        </div>

        <div className={styles.secondaryMeta}>
          <span><Globe2 aria-hidden="true" /> {consultant.languages.join(", ")}</span>
          <span><MapPin aria-hidden="true" /> {consultant.location}</span>
        </div>
      </section>

      <div className={styles.profileGrid}>
        <section className={styles.infoCard}>
          <h2><Sprout aria-hidden="true" /> About</h2>
          <p>{consultant.about}</p>
        </section>

        <section className={styles.infoCard}>
          <h2><Sprout aria-hidden="true" /> Areas of expertise</h2>
          <div className={styles.chips}>
            {consultant.areas.map((area) => <span key={area}>{area}</span>)}
          </div>
        </section>
      </div>

      <div className={styles.credentialsGrid}>
        <section className={styles.infoCard}>
          <h2><GraduationCap aria-hidden="true" /> Education</h2>
          <strong>{consultant.education.degree}</strong>
          <p>{consultant.education.school}</p>
        </section>

        <section className={styles.infoCard}>
          <h2><Award aria-hidden="true" /> Certifications</h2>
          <ul>
            {consultant.certifications.map((certification) => (
              <li key={certification}><Check aria-hidden="true" /> {certification}</li>
            ))}
          </ul>
        </section>
      </div>

      <section className={styles.statsGrid} aria-label="Consultant statistics">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label}>
              <span><Icon aria-hidden="true" /></span>
              <strong>{stat.value}</strong>
              <small>{stat.label}</small>
            </div>
          );
        })}
      </section>

      <section className={styles.reviewsCard}>
        <div className={styles.reviewsHeading}>
          <h2><Sprout aria-hidden="true" /> What clients say</h2>
          <span>{consultant.reviewsCount} reviews</span>
        </div>
        <div className={styles.reviewGrid}>
          {consultant.reviews.map((review) => (
            <article key={`${review.by}-${review.text}`}>
              <div className={styles.reviewStars} aria-label={`${review.stars} out of 5 stars`}>
                {Array.from({ length: review.stars }, (_, index) => <Star key={index} aria-hidden="true" />)}
              </div>
              <p>{review.text}</p>
              <span>— {review.by}</span>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.actionBar} aria-label="Consultation actions">
        <div className={styles.actionFee}>
          <span>Consultation Fee</span>
          <strong>₹{consultant.feeInr}</strong>
          <small>{consultant.sessionMinutes} mins session</small>
        </div>
        <button type="button" className={styles.chatButton} onClick={() => openBooking("chat")}>
          <MessageCircle aria-hidden="true" /> Chat Now
        </button>
        <button type="button" className={styles.bookButton} onClick={() => openBooking()}>
          Book Consultation
        </button>
      </section>

      <Dialog.Root
        open={bookingOpen}
        onOpenChange={(open) => {
          setBookingOpen(open);
          if (!open) setRequestSaved(false);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className={styles.dialogOverlay} />
          <Dialog.Content className={styles.dialogContent}>
            <Dialog.Close className={styles.dialogClose} aria-label="Close booking preview"><X aria-hidden="true" /></Dialog.Close>
            {requestSaved ? (
              <div className={styles.savedState} role="status">
                <span><Check aria-hidden="true" /></span>
                <p>Preference saved</p>
                <Dialog.Title>Ready for the next step.</Dialog.Title>
                <Dialog.Description>
                  Your {selectedMode} preference with {consultant.name} is saved in this browser tab. No request has been sent or appointment scheduled.
                </Dialog.Description>
                <Dialog.Close className={styles.bookButton}>Done</Dialog.Close>
              </div>
            ) : (
              <form onSubmit={saveBookingPreview}>
                <p className={styles.dialogEyebrow}>Book a consultation</p>
                <Dialog.Title>Choose how you’d like to connect</Dialog.Title>
                <Dialog.Description>
                  Select a consultation type and preferred time. Live provider availability still needs to be connected before scheduling.
                </Dialog.Description>

                <fieldset className={styles.modeChoices}>
                  <legend>Consultation type</legend>
                  {CONSULTATION_MODES.map((mode) => {
                    const Icon = MODE_ICONS[mode.id];
                    return (
                      <label key={mode.id}>
                        <input
                          type="radio"
                          name="consultation-mode"
                          value={mode.id}
                          checked={selectedMode === mode.id}
                          onChange={() => setSelectedMode(mode.id)}
                        />
                        <span><Icon aria-hidden="true" /><strong>{mode.label}</strong></span>
                      </label>
                    );
                  })}
                </fieldset>

                <label className={styles.timeField}>
                  Preferred time
                  <select value={preferredTime} onChange={(event) => setPreferredTime(event.target.value)}>
                    <option>Morning · 9am–12pm</option>
                    <option>Afternoon · 12pm–4pm</option>
                    <option>Evening · 4pm–8pm</option>
                  </select>
                </label>

                <button type="submit" className={styles.bookButton}>Save booking preference</button>
              </form>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
