"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./OnboardingIntro.module.css";

type Slide = {
  title: string;
  body: string;
  image: string;
  imageAlt: string;
  imagePosition: string;
};

const SLIDES: Slide[] = [
  {
    title: "Mindful eating\nfor a healthier you",
    body: "Small choices, made with awareness, create lasting change.",
    image: "/landing/journey-healthcare.jpg",
    imageAlt: "A nourishing bowl surrounded by fresh green leaves",
    imagePosition: "center",
  },
  {
    title: "Nourishment\nrooted in tradition",
    body: "Recipes that honour your culture and fit your body.",
    image: "/landing/hero-bowl.jpg",
    imageAlt: "A balanced bowl with grains, greens, chickpeas and avocado",
    imagePosition: "center",
  },
  {
    title: "Your body,\nyour rhythm",
    body: "A plan that adapts to your cycles, energy, and goals.",
    image: "/landing/journey-fitness.jpg",
    imageAlt: "A colourful balanced plate prepared for an active day",
    imagePosition: "center",
  },
];

const BENEFITS = [
  { label: "Mindful choices", icon: "leaf" },
  { label: "Personalized nutrition", icon: "bowl" },
  { label: "Lasting wellness", icon: "lotus" },
] as const;

function BenefitIcon({ kind }: { kind: (typeof BENEFITS)[number]["icon"] }) {
  if (kind === "bowl") {
    return (
      <svg viewBox="0 0 34 34" aria-hidden="true">
        <path d="M7 18h20c0 7-4.5 10-10 10S7 25 7 18Z" />
        <path d="M17 18v-7M17 13c-4-1-6-4-6-7 4 1 6 3 6 7ZM17 13c4-1 6-4 6-7-4 1-6 3-6 7Z" />
      </svg>
    );
  }

  if (kind === "lotus") {
    return (
      <svg viewBox="0 0 34 34" aria-hidden="true">
        <path d="M17 27c-7-2-10-7-9-14 5 2 8 6 9 14ZM17 27c7-2 10-7 9-14-5 2-8 6-9 14Z" />
        <path d="M17 27c-3-7-3-13 0-19 3 6 3 12 0 19Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 34 34" aria-hidden="true">
      <path d="M17 27V15M17 17c-5-1-8-4-8-9 5 1 8 4 8 9ZM17 17c5-1 8-4 8-9-5 1-8 4-8 9Z" />
    </svg>
  );
}

export default function OnboardingIntro() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const slide = SLIDES[step];

  const next = () => {
    if (step < SLIDES.length - 1) setStep((current) => current + 1);
    else router.push("/onboarding/conditions");
  };

  const skip = () => router.push("/onboarding/conditions");

  return (
    <main className={styles.page}>
      <div className={styles.botanical} aria-hidden="true" />

      <section className={styles.story} aria-live="polite">
        <button type="button" onClick={skip} className={styles.skip}>Skip</button>

        <div className={styles.copy} key={`copy-${step}`}>
          <p className={styles.eyebrow}>A gentler way to eat well</p>
          <h1>{slide.title}</h1>
          <div className={styles.lotusRule} aria-hidden="true"><span>✦</span></div>
          <p className={styles.body}>{slide.body}</p>
        </div>

        <figure className={styles.hero} key={`image-${step}`}>
          <Image
            src={slide.image}
            alt={slide.imageAlt}
            fill
            priority={step === 0}
            sizes="(min-width: 900px) 52vw, 100vw"
            style={{ objectPosition: slide.imagePosition }}
          />
          <span className={styles.heroWash} aria-hidden="true" />
        </figure>
      </section>

      <section className={styles.panel} aria-label="Onboarding benefits">
        <div className={styles.panelInner}>
          <div className={styles.panelTitle}>
            <p>You&apos;ll get</p>
            <span aria-hidden="true">— &nbsp;❧&nbsp; —</span>
          </div>

          <div className={styles.benefits}>
            {BENEFITS.map((benefit) => (
              <div className={styles.benefit} key={benefit.label}>
                <span className={styles.icon}><BenefitIcon kind={benefit.icon} /></span>
                <p>{benefit.label}</p>
              </div>
            ))}
          </div>

          <div className={styles.dots} role="tablist" aria-label="Onboarding slides">
            {SLIDES.map((item, index) => (
              <button
                key={item.title}
                type="button"
                role="tab"
                aria-selected={index === step}
                aria-label={`Show slide ${index + 1}: ${item.title.replace("\n", " ")}`}
                className={index === step ? styles.dotActive : styles.dot}
                onClick={() => setStep(index)}
              />
            ))}
          </div>

          <button type="button" onClick={next} className={styles.next}>
            <span>{step === SLIDES.length - 1 ? "Begin" : "Next"}</span>
            <span aria-hidden="true">→</span>
          </button>

          <p className={styles.private}><span aria-hidden="true">♢</span> Your information stays private</p>
        </div>
      </section>
    </main>
  );
}
