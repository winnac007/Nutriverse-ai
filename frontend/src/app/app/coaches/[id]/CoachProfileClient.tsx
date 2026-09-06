"use client";

import React, { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BicepsFlexed,
  CheckCircle2,
  Droplets,
  Dumbbell,
  Ellipsis,
  Flower2,
  Gauge,
  HeartPulse,
  Moon,
  Salad,
  Scale,
  Share2,
  Sparkles,
  Sprout,
  Star,
  X,
} from "lucide-react";
import type { Consultant } from "@/lib/consultants";
import styles from "./CoachProfile.module.css";

function getSpecialtyIcon(name: string): ReactNode {
  const lower = name.toLowerCase();
  if (lower.includes("pcos")) return <Flower2 size={16} />;
  if (lower.includes("diabetes")) return <Droplets size={16} />;
  if (lower.includes("weight") || lower.includes("fat")) return <Scale size={16} />;
  if (lower.includes("gut") || lower.includes("digestive")) return <Salad size={16} />;
  if (lower.includes("strength")) return <Dumbbell size={16} />;
  if (lower.includes("muscle")) return <BicepsFlexed size={16} />;
  if (lower.includes("performance")) return <Gauge size={16} />;
  if (lower.includes("stress")) return <Sparkles size={16} />;
  if (lower.includes("sleep")) return <Moon size={16} />;
  if (lower.includes("hormon") || lower.includes("thyroid")) return <Flower2 size={16} />;
  if (lower.includes("mindful")) return <HeartPulse size={16} />;
  return <Sprout size={16} />;
}

interface CoachProfileClientProps {
  coach: Consultant;
}

export default function CoachProfileClient({ coach }: CoachProfileClientProps) {
  const router = useRouter();
  const [readMoreExpanded, setReadMoreExpanded] = useState<boolean>(false);
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [isAvailabilityOpen, setIsAvailabilityOpen] = useState<boolean>(false);
  const [selectedSlot, setSelectedSlot] = useState<string>("Tomorrow, 10:00 AM");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  const handleShare = async () => {
    const shareData = {
      title: `${coach.name} • Health Coach on Zenplato`,
      text: `Connect with ${coach.name} (${coach.title}) for personalized wellness guidance!`,
      url: typeof window !== "undefined" ? window.location.href : "",
    };

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // User dismissed
      }
    }

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(shareData.url);
      showToast("✓ Coach profile link copied to clipboard!");
    }
  };

  const handleConfirmBooking = () => {
    setIsBookingOpen(false);
    showToast(`✓ Session requested with ${coach.name} for ${selectedSlot}!`);
  };

  // 4 main specialties
  const specialties = coach.specialties.slice(0, 4);

  // Qualifications or Certifications list
  const credentialsList =
    coach.qualifications && coach.qualifications.length > 0
      ? coach.qualifications
      : coach.certifications && coach.certifications.length > 0
      ? coach.certifications
      : [
          `Certified ${coach.title}`,
          `${coach.yearsExperience}+ Years Clinical Experience`,
        ];

  const credentialsTitle =
    coach.qualifications && coach.qualifications.length > 0
      ? "Qualifications"
      : "Certifications";

  // Featured review
  const clientReview = coach.reviews?.[0] || {
    by: "Priya S.",
    text: "Amazing guidance! The recommendations fit into my everyday routine and were very effective.",
    stars: 5.0,
    avatar: "/app-ui/coach-client-priya.png",
  };

  const heroImageSrc = coach.heroImage || coach.photo;

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
        <h1 className={styles.navTitle}>{coach.name}</h1>
        <div className={styles.rightNavGroup}>
          <button
            className={styles.navIconBtn}
            onClick={handleShare}
            aria-label="Share Coach Profile"
          >
            <Share2 size={18} />
          </button>
          <button
            className={styles.navIconBtn}
            onClick={() => showToast(`Options for ${coach.name}`)}
            aria-label="More Options"
          >
            <Ellipsis size={18} />
          </button>
        </div>
      </header>

      {/* Hero Portrait Card */}
      <div className={styles.heroCard}>
        <img
          src={heroImageSrc}
          alt={coach.name}
          className={styles.heroImg}
        />
        <div className={styles.ratingFloatingPill}>
          <Star size={12} className={styles.starIcon} />
          <span>{coach.rating} ({coach.reviewsCount} reviews)</span>
        </div>
      </div>

      {/* Coach Identity Section */}
      <section className={styles.identitySection}>
        <div className={styles.nameRow}>
          <h2 className={styles.coachName}>{coach.name}</h2>
          <CheckCircle2 size={19} className={styles.verifiedBadge} />
        </div>
        <p className={styles.coachRole}>{coach.title}</p>
        <p className={styles.experienceLabel}>{coach.yearsExperience}+ Years of Experience</p>
      </section>

      {/* 4 Specialty Badges */}
      <section className={styles.specialtiesGrid} aria-label="Specialties">
        {specialties.map((spec) => (
          <div key={spec} className={styles.specialtyCard}>
            <div className={styles.specialtyIconWrap}>
              {getSpecialtyIcon(spec)}
            </div>
            <span className={styles.specialtyLabel}>{spec}</span>
          </div>
        ))}
      </section>

      {/* About Section */}
      <section className={styles.sectionBlock}>
        <h3 className={styles.sectionTitle}>About</h3>
        <p className={styles.bodyText}>
          {coach.about}
        </p>
        {readMoreExpanded && (
          <p className={styles.bodyText} style={{ marginTop: 4 }}>
            Drawing upon deep evidence-based practice and empathetic coaching, {coach.name.split(" ")[0]} partners closely with clients to build actionable, sustainable daily habits that nurture long-term vitality and hormonal balance.
          </p>
        )}
        <button
          className={styles.readMoreBtn}
          onClick={() => setReadMoreExpanded(!readMoreExpanded)}
        >
          {readMoreExpanded ? "Read less" : "Read more"}
        </button>
      </section>

      {/* Qualifications / Certifications Section */}
      <section className={styles.sectionBlock}>
        <h3 className={styles.sectionTitle}>{credentialsTitle}</h3>
        <ul className={styles.bulletList}>
          {credentialsList.map((item, index) => (
            <li key={index} className={styles.bulletItem}>
              <span className={styles.bulletDot} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Action Buttons Row */}
      <div className={styles.actionBtnsRow}>
        <button
          className={styles.availabilityBtn}
          onClick={() => setIsAvailabilityOpen(true)}
        >
          View Availability
        </button>
        <button
          className={styles.bookSessionBtn}
          onClick={() => setIsBookingOpen(true)}
        >
          Book a Session
        </button>
      </div>

      {/* What Clients Say Section */}
      <section className={styles.sectionBlock}>
        <div className={styles.reviewsHeaderRow}>
          <h3 className={styles.sectionTitle}>What clients say</h3>
          <span
            className={styles.seeAllLink}
            onClick={() => showToast(`Showing all ${coach.reviewsCount} client reviews`)}
          >
            See all
          </span>
        </div>

        <div className={styles.testimonialCard}>
          <img
            src={clientReview.avatar || "/app-ui/coach-client-priya.png"}
            alt={clientReview.by}
            className={styles.clientAvatar}
          />
          <div className={styles.testimonialContent}>
            <h4 className={styles.clientName}>{clientReview.by}</h4>
            <p className={styles.clientQuote}>&ldquo;{clientReview.text}&rdquo;</p>
            <div className={styles.reviewStarsRow}>
              <Star size={11} className={styles.starIcon} />
              <span>{clientReview.stars.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Session Modal Sheet */}
      {isBookingOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsBookingOpen(false)}>
          <div className={styles.modalSheet} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Book with {coach.name}</h3>
              <button
                className={styles.closeModalBtn}
                onClick={() => setIsBookingOpen(false)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <p className={styles.bodyText}>
              Select your preferred consultation window for a 1-on-1 personalized session:
            </p>

            <div className={styles.slotList}>
              {[
                "Tomorrow, 10:00 AM",
                "Tomorrow, 2:30 PM",
                "Tomorrow, 6:00 PM",
                "Wednesday, 11:00 AM",
              ].map((slot) => (
                <button
                  key={slot}
                  className={`${styles.slotBtn} ${selectedSlot === slot ? styles.slotBtnSelected : ""}`}
                  onClick={() => setSelectedSlot(slot)}
                >
                  {slot}
                </button>
              ))}
            </div>

            <button
              className={styles.confirmBookingBtn}
              onClick={handleConfirmBooking}
            >
              Confirm {selectedSlot} • ₹{coach.feeInr}
            </button>
          </div>
        </div>
      )}

      {/* Availability Drawer */}
      {isAvailabilityOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsAvailabilityOpen(false)}>
          <div className={styles.modalSheet} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Weekly Availability</h3>
              <button
                className={styles.closeModalBtn}
                onClick={() => setIsAvailabilityOpen(false)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <ul className={styles.bulletList}>
              <li className={styles.bulletItem}>
                <span className={styles.bulletDot} />
                <span><strong>Monday – Friday:</strong> 9:00 AM – 1:00 PM, 4:00 PM – 7:30 PM</span>
              </li>
              <li className={styles.bulletItem}>
                <span className={styles.bulletDot} />
                <span><strong>Saturday:</strong> 10:00 AM – 3:00 PM</span>
              </li>
              <li className={styles.bulletItem}>
                <span className={styles.bulletDot} />
                <span><strong>Sunday:</strong> Rest day / By special appointment</span>
              </li>
            </ul>

            <button
              className={styles.confirmBookingBtn}
              onClick={() => {
                setIsAvailabilityOpen(false);
                setIsBookingOpen(true);
              }}
            >
              Pick a Slot &amp; Book
            </button>
          </div>
        </div>
      )}

      {/* Toast Notice */}
      {toastMessage && (
        <div className={styles.toastNotice} role="status" aria-live="polite">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
