"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function Splash() {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push("/auth")}
      style={{
        minHeight: "100vh",
        background: "#F5EFE2",
        fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
        display: "flex",
        justifyContent: "center",
        cursor: "pointer",
      }}
    >
      {/* Phone-shaped viewport */}
      <div
        style={{
          width: "100%",
          maxWidth: 440,
          minHeight: "100vh",
          position: "relative",
          overflow: "hidden",
          background: "#F5EFE2",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Image slot: bamboo leaves top-left */}
        <div
          data-image-slot="bamboo-top-left"
          style={{
            position: "absolute",
            top: 24,
            left: -10,
            width: 130,
            height: 200,
            zIndex: 1,
            pointerEvents: "none",
            background:
              "linear-gradient(135deg, rgba(160,180,140,0.18), rgba(160,180,140,0.02))",
            borderRadius: "0 60% 60% 60% / 0 50% 50% 50%",
          }}
        />

        {/* Image slot: bamboo leaves top-right */}
        <div
          data-image-slot="bamboo-top-right"
          style={{
            position: "absolute",
            top: 60,
            right: -20,
            width: 150,
            height: 220,
            zIndex: 1,
            pointerEvents: "none",
            background:
              "linear-gradient(225deg, rgba(160,180,140,0.20), rgba(160,180,140,0.02))",
            borderRadius: "60% 0 60% 60% / 50% 0 50% 50%",
          }}
        />

        {/* Image slot: background watercolor landscape (mountains/pagoda/river) */}
        <div
          data-image-slot="landscape-watercolor"
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "55%",
            zIndex: 1,
            pointerEvents: "none",
            background:
              "linear-gradient(to top, rgba(170,180,150,0.35) 0%, rgba(200,200,170,0.18) 40%, rgba(245,239,226,0) 100%)",
          }}
        />

        {/* Centre content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px 32px 80px",
            position: "relative",
            zIndex: 3,
          }}
        >
          {/* Enso circle + bowl with sprout */}
          <div style={{ position: "relative", width: 220, height: 220, marginBottom: 36 }}>
            {/* Enso (brush-stroke circle, not fully closed) */}
            <svg viewBox="0 0 220 220" width="220" height="220" style={{ position: "absolute", inset: 0 }}>
              <defs>
                <linearGradient id="ensoGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#3D5C3E" stopOpacity="0.95" />
                  <stop offset="60%" stopColor="#3D5C3E" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="#3D5C3E" stopOpacity="0.15" />
                </linearGradient>
              </defs>
              <path
                d="M 110 18
                   A 92 92 0 1 1 32 158"
                fill="none"
                stroke="url(#ensoGrad)"
                strokeWidth="14"
                strokeLinecap="round"
              />
              {/* Rough texture splash dots */}
              <circle cx="36" cy="162" r="3" fill="#3D5C3E" opacity="0.55" />
              <circle cx="44" cy="170" r="2" fill="#3D5C3E" opacity="0.35" />
              <circle cx="28" cy="155" r="2" fill="#3D5C3E" opacity="0.4" />
            </svg>

            {/* Bowl + sprout centered */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg viewBox="0 0 100 100" width="86" height="86">
                {/* sprout */}
                <path d="M50 48 Q50 36 50 28" stroke="#3D5C3E" strokeWidth="2" fill="none" strokeLinecap="round" />
                <path d="M50 36 Q40 32 38 24 Q46 26 50 34 Z" fill="#3D5C3E" />
                <path d="M50 36 Q60 32 62 24 Q54 26 50 34 Z" fill="#4A6E4B" />
                {/* bowl */}
                <path d="M28 52 L72 52 Q72 74 50 78 Q28 74 28 52 Z" fill="#3D5C3E" />
                <ellipse cx="50" cy="52" rx="22" ry="3.5" fill="#2D4530" />
              </svg>
            </div>
          </div>

          {/* Wordmark */}
          <h1
            style={{
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              fontSize: 38,
              fontWeight: 500,
              color: "#2D4530",
              letterSpacing: "0.18em",
              margin: 0,
              textAlign: "center",
            }}
          >
            ZENPLATE
          </h1>

          {/* Divider with lotus */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginTop: 18,
              marginBottom: 22,
              width: 200,
            }}
          >
            <div style={{ flex: 1, height: 1, background: "#C4A66A", opacity: 0.6 }} />
            <svg width="18" height="14" viewBox="0 0 24 18" fill="none">
              <path d="M12 16 Q4 12 6 4 Q12 8 12 16 Z" fill="#C4974A" opacity="0.85" />
              <path d="M12 16 Q20 12 18 4 Q12 8 12 16 Z" fill="#C4974A" opacity="0.85" />
              <path d="M12 16 Q12 8 12 2 Q14 9 12 16 Z" fill="#D4B070" />
            </svg>
            <div style={{ flex: 1, height: 1, background: "#C4A66A", opacity: 0.6 }} />
          </div>

          {/* Tagline */}
          <p
            style={{
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              fontSize: 17,
              color: "#2D4530",
              margin: 0,
              textAlign: "center",
              lineHeight: 1.7,
              fontStyle: "italic",
              opacity: 0.85,
            }}
          >
            Eat with intention.
            <br />
            Heal with food.
          </p>
        </div>

        {/* Bottom CTA — Enter ZenPlate */}
        <div
          style={{
            position: "relative",
            zIndex: 5,
            padding: "0 32px 40px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push("/auth");
            }}
            style={{
              background: "#3D5C3E",
              color: "#FFFFFF",
              border: "none",
              borderRadius: 999,
              padding: "16px 56px",
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              fontSize: 15,
              fontWeight: 500,
              letterSpacing: "0.04em",
              cursor: "pointer",
              boxShadow: "0 8px 24px rgba(61,92,62,0.28)",
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            Begin
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
