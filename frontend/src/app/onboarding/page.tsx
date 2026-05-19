"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

type Slide = {
  title: string;
  body: string;
};

const SLIDES: Slide[] = [
  {
    title: "Mindful eating\nfor a healthier you",
    body: "Small choices, made\nwith awareness,\ncreate lasting change.",
  },
  {
    title: "Nourishment\nrooted in tradition",
    body: "Recipes that honor\nyour culture and\nfit your body.",
  },
  {
    title: "Your body,\nyour rhythm",
    body: "A plan that adapts to\nyour cycles, energy\nand goals.",
  },
];

export default function OnboardingIntro() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const next = () => {
    if (step < SLIDES.length - 1) {
      setStep((s) => s + 1);
    } else {
      router.push("/onboarding/conditions");
    }
  };

  const skip = () => router.push("/onboarding/conditions");

  const slide = SLIDES[step];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F5EFE2",
        fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 440,
          minHeight: "100vh",
          background: "#F5EFE2",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Image slot — decorative leaf top-left */}
        <div
          data-image-slot="leaf-top-left"
          style={{
            position: "absolute",
            top: 12,
            left: 18,
            width: 70,
            height: 90,
            opacity: 0.55,
            pointerEvents: "none",
            background:
              "radial-gradient(ellipse at 30% 40%, rgba(160,180,140,0.4), transparent 70%)",
          }}
        />

        {/* Top bar — Skip right-aligned */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "20px 26px 0",
          }}
        >
          <button
            onClick={skip}
            style={{
              background: "transparent",
              border: "none",
              color: "#6B7B6B",
              fontSize: 15,
              fontWeight: 400,
              fontFamily: "inherit",
              cursor: "pointer",
              padding: "8px 4px",
            }}
          >
            Skip
          </button>
        </div>

        {/* Headline */}
        <div style={{ padding: "8px 32px 0" }}>
          <h1
            style={{
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              fontSize: 32,
              fontWeight: 500,
              color: "#2D4530",
              lineHeight: 1.2,
              margin: 0,
              whiteSpace: "pre-line",
            }}
          >
            {slide.title}
          </h1>

          {/* Gold lotus divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginTop: 18,
              width: 170,
            }}
          >
            <div style={{ flex: 1, height: 1, background: "#C4A66A", opacity: 0.55 }} />
            <svg width="18" height="14" viewBox="0 0 24 18" fill="none">
              <path d="M12 16 Q4 12 6 4 Q12 8 12 16 Z" fill="#C4974A" opacity="0.85" />
              <path d="M12 16 Q20 12 18 4 Q12 8 12 16 Z" fill="#C4974A" opacity="0.85" />
              <path d="M12 16 Q12 8 12 2 Q14 9 12 16 Z" fill="#D4B070" />
            </svg>
            <div style={{ flex: 1, height: 1, background: "#C4A66A", opacity: 0.55 }} />
          </div>

          {/* Body copy */}
          <p
            style={{
              marginTop: 18,
              fontSize: 14.5,
              color: "#3A4A3A",
              lineHeight: 1.6,
              whiteSpace: "pre-line",
              fontWeight: 400,
            }}
          >
            {slide.body}
          </p>
        </div>

        {/* Hero image slot */}
        <div style={{ flex: 1, padding: "20px 0 0", minHeight: 260 }}>
          <div
            data-image-slot={`hero-slide-${step + 1}`}
            style={{
              width: "100%",
              height: "100%",
              minHeight: 260,
              background:
                "linear-gradient(180deg, rgba(170,180,150,0.18) 0%, rgba(200,200,170,0.28) 60%, rgba(170,180,150,0.18) 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontSize: 12,
                color: "#8D9E8D",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                fontWeight: 500,
              }}
            >
              Image placeholder
            </span>
          </div>
        </div>

        {/* Bottom card */}
        <div
          style={{
            background: "#FFFFFF",
            borderTopLeftRadius: 26,
            borderTopRightRadius: 26,
            padding: "28px 28px 30px",
            boxShadow: "0 -8px 30px rgba(31,46,31,0.06)",
          }}
        >
          {/* "You'll get" header */}
          <div style={{ textAlign: "center", marginBottom: 22 }}>
            <h3
              style={{
                fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                fontSize: 18,
                fontWeight: 500,
                color: "#2D4530",
                margin: 0,
              }}
            >
              You&apos;ll get
            </h3>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                marginTop: 4,
              }}
            >
              <div style={{ width: 30, height: 1, background: "#C4A66A", opacity: 0.5 }} />
              <svg width="10" height="6" viewBox="0 0 12 8" fill="none">
                <path d="M2 6 Q6 2 10 6" stroke="#A8B8A8" strokeWidth="1" fill="none" />
              </svg>
              <div style={{ width: 30, height: 1, background: "#C4A66A", opacity: 0.5 }} />
            </div>
          </div>

          {/* Three benefit columns */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 18,
              marginBottom: 22,
            }}
          >
            <BenefitColumn
              label={"Mindful\nchoices"}
              icon={
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#3D5C3E" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 22 V14" />
                  <path d="M14 14 Q8 12 7 6 Q13 8 14 14 Z" fill="#3D5C3E" fillOpacity="0.15" />
                  <path d="M14 14 Q20 12 21 6 Q15 8 14 14 Z" fill="#3D5C3E" fillOpacity="0.25" />
                </svg>
              }
            />
            <BenefitColumn
              label={"Personalized\nnutrition"}
              icon={
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="#3D5C3E" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 16 L24 16 Q24 23 15 24 Q6 23 6 16 Z" fill="#3D5C3E" fillOpacity="0.18" />
                  <path d="M15 16 V10" />
                  <path d="M15 12 Q11 10 10 6 Q14 8 15 12 Z" fill="#3D5C3E" fillOpacity="0.4" />
                  <path d="M15 12 Q19 10 20 6 Q16 8 15 12 Z" fill="#3D5C3E" fillOpacity="0.4" />
                </svg>
              }
            />
            <BenefitColumn
              label={"Lasting\nwellness"}
              icon={
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#3D5C3E" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 22 Q6 18 8 8 Q14 13 14 22 Z" fill="#3D5C3E" fillOpacity="0.15" />
                  <path d="M14 22 Q22 18 20 8 Q14 13 14 22 Z" fill="#3D5C3E" fillOpacity="0.15" />
                  <path d="M14 22 Q14 13 14 6 Q16 14 14 22 Z" fill="#3D5C3E" fillOpacity="0.3" />
                </svg>
              }
            />
          </div>

          {/* Pagination dots */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 8,
              marginBottom: 18,
            }}
          >
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                aria-label={`Slide ${i + 1}`}
                style={{
                  width: i === step ? 8 : 6,
                  height: i === step ? 8 : 6,
                  borderRadius: "50%",
                  background: i === step ? "#3D5C3E" : "#D7CFC0",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              />
            ))}
          </div>

          {/* Next button */}
          <button
            onClick={next}
            style={{
              width: "100%",
              background: "#3D5C3E",
              color: "#FFFFFF",
              border: "none",
              borderRadius: 999,
              padding: "16px 24px",
              fontSize: 16,
              fontWeight: 500,
              fontFamily: "inherit",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              boxShadow: "0 8px 22px rgba(61,92,62,0.25)",
            }}
          >
            {step === SLIDES.length - 1 ? "Begin" : "Next"}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function BenefitColumn({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "#EEEDE2",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </div>
      <p
        style={{
          margin: 0,
          fontSize: 12.5,
          lineHeight: 1.35,
          color: "#3A4A3A",
          textAlign: "center",
          whiteSpace: "pre-line",
          fontWeight: 400,
        }}
      >
        {label}
      </p>
    </div>
  );
}
