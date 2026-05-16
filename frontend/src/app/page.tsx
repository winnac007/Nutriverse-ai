"use client";

import React from "react";
import Link from "next/link";

export default function Landing() {
  return (
    <div style={{ minHeight: "100vh", background: "#FAF7F0", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');`}</style>

      {/* Nav */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: "rgba(250,247,240,0.88)", backdropFilter: "blur(20px)", borderBottom: "1px solid #E5DDD0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "1rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            {/* Zen circle logo */}
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="18" r="16" stroke="#3D5C3E" strokeWidth="2.5" fill="none" opacity="0.7"/>
              <ellipse cx="18" cy="20" rx="7" ry="5" fill="#3D5C3E" opacity="0.15"/>
              <path d="M14 22 Q18 16 22 22" stroke="#3D5C3E" strokeWidth="1.5" fill="none"/>
              <circle cx="18" cy="14" r="2.5" fill="#3D5C3E"/>
              <path d="M16 12 L15 10 M20 12 L21 10" stroke="#3D5C3E" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 500, color: "#1F2E1F", letterSpacing: "0.05em" }}>ZENPLATE</span>
          </div>
          <nav style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
            {["Features", "How it Works", "Recipes"].map(l => (
              <span key={l} style={{ fontSize: "0.78rem", fontWeight: 500, color: "#8D9E8D", cursor: "pointer", letterSpacing: "0.03em" }}>{l}</span>
            ))}
          </nav>
          <Link href="/auth" style={{ textDecoration: "none" }}>
            <button style={{ background: "#3D5C3E", color: "#FFFFFF", border: "none", borderRadius: 999, padding: "0.6rem 1.5rem", fontSize: "0.82rem", fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", letterSpacing: "0.02em" }}>
              Get Started
            </button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section style={{ paddingTop: "7rem", paddingBottom: "4rem", position: "relative", overflow: "hidden" }}>
        {/* Botanical background art */}
        <svg style={{ position: "absolute", top: 60, right: -60, width: 500, height: 500, opacity: 0.12 }} viewBox="0 0 300 300" fill="none">
          <ellipse cx="200" cy="80" rx="55" ry="100" fill="#3D5C3E" transform="rotate(-25 200 80)"/>
          <ellipse cx="240" cy="150" rx="40" ry="80" fill="#3D5C3E" transform="rotate(15 240 150)"/>
          <ellipse cx="170" cy="200" rx="35" ry="70" fill="#3D5C3E" transform="rotate(-40 170 200)"/>
          <line x1="200" y1="80" x2="180" y2="250" stroke="#3D5C3E" strokeWidth="3" opacity="0.5"/>
          <line x1="200" y1="80" x2="240" y2="150" stroke="#3D5C3E" strokeWidth="2" opacity="0.4"/>
        </svg>

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 2rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
          {/* Left */}
          <div>
            <p style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#C4974A", marginBottom: "1.5rem" }}>🌿 Mindful Nutrition • AI Powered</p>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(3rem, 5vw, 5rem)", fontWeight: 400, color: "#1F2E1F", lineHeight: 1.05, margin: "0 0 1.5rem" }}>
              Eat with intention.<br />
              <em style={{ color: "#3D5C3E" }}>Heal with food.</em>
            </h1>
            <p style={{ fontSize: "1.05rem", color: "#7D8E7D", lineHeight: 1.75, marginBottom: "2.5rem", maxWidth: 400, fontWeight: 300 }}>
              Personalised nutrition plans built around your health conditions, culture, and goals. Real food. Real healing.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              <Link href="/onboarding" style={{ textDecoration: "none" }}>
                <button style={{ background: "#3D5C3E", color: "#FFFFFF", border: "none", borderRadius: 999, padding: "1rem 2.5rem", fontSize: "1rem", fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", boxShadow: "0 8px 32px rgba(61,92,62,0.28)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  Begin your journey
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </Link>
              <Link href="/auth" style={{ textDecoration: "none", fontSize: "0.9rem", color: "#3D5C3E", fontWeight: 500, borderBottom: "1.5px solid rgba(61,92,62,0.3)", paddingBottom: "0.1rem" }}>
                Sign in
              </Link>
            </div>

            {/* Social proof */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "2.5rem" }}>
              <div style={{ display: "flex" }}>
                {[1,2,3,4].map(i => (
                  <div key={i} style={{ width: 32, height: 32, borderRadius: "50%", border: "2px solid #FAF7F0", marginLeft: i > 1 ? -10 : 0, overflow: "hidden" }}>
                    <img src={`https://i.pravatar.cc/64?img=${i+10}`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                ))}
              </div>
              <p style={{ fontSize: "0.8rem", color: "#8D9E8D", fontWeight: 400 }}>
                <strong style={{ color: "#1F2E1F", fontWeight: 600 }}>2,400+</strong> people healing with Zenplate
              </p>
            </div>
          </div>

          {/* Right — phone mockup */}
          <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
            <div style={{ width: 280, background: "#FFFFFF", borderRadius: "2.5rem", boxShadow: "0 40px 100px rgba(31,46,31,0.18), 0 10px 30px rgba(31,46,31,0.1)", overflow: "hidden", border: "1px solid #E5DDD0" }}>
              {/* Phone status bar */}
              <div style={{ background: "#F0EBE0", padding: "0.75rem 1.25rem 0.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "#1F2E1F" }}>9:41</span>
                <div style={{ display: "flex", gap: "0.35rem", alignItems: "center" }}>
                  {[3,4,5].map(i => <div key={i} style={{ width: 3, height: i, background: "#1F2E1F", borderRadius: 1 }} />)}
                  <svg width="14" height="10" viewBox="0 0 24 17" fill="none" stroke="#1F2E1F" strokeWidth="2"><path d="M1 6.4C4.2 3.2 8.4 1.4 12 1.4c3.6 0 7.8 1.8 11 5M5 10.8C7.4 8.4 9.7 7.2 12 7.2c2.3 0 4.6 1.2 7 3.6M9 14.8C10.1 13.6 11.1 13 12 13c.9 0 1.9.6 3 1.8"/><circle cx="12" cy="17" r="1.5" fill="#1F2E1F"/></svg>
                </div>
              </div>
              {/* App preview content */}
              <div style={{ background: "#F5F0E8", padding: "1rem" }}>
                {/* Greeting */}
                <div style={{ marginBottom: "0.75rem" }}>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: "#1F2E1F", margin: 0 }}>Good morning,</p>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: "#3D5C3E", margin: 0 }}>Aisha 🌿</p>
                  <p style={{ fontSize: "0.65rem", color: "#8D9E8D", margin: "0.15rem 0 0" }}>Today is a fresh start.</p>
                </div>
                {/* Focus card */}
                <div style={{ background: "#FFFFFF", borderRadius: "0.75rem", padding: "0.7rem", marginBottom: "0.75rem", border: "1px solid #E5DDD0" }}>
                  <p style={{ fontSize: "0.5rem", color: "#A8B8A8", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, margin: "0 0 0.2rem" }}>Today's Focus</p>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.8rem", color: "#1F2E1F", margin: 0 }}>Eat mindfully and stay hydrated</p>
                </div>
                {/* Meal thumbnails */}
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.85rem", color: "#1F2E1F", margin: "0 0 0.5rem" }}>Today's Meals</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.4rem" }}>
                  {["1546069901-ba9599a7e63c", "1512621776951-a57141f2eefd", "1504674900247-0877df9cc836"].map((id, i) => (
                    <div key={i} style={{ aspectRatio: "1", borderRadius: "0.5rem", overflow: "hidden", background: "#E8E0D0" }}>
                      <img src={`https://images.unsplash.com/photo-${id}?w=100`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  ))}
                </div>
                {/* Streak */}
                <div style={{ background: "#FFFFFF", borderRadius: "0.75rem", padding: "0.7rem", marginTop: "0.75rem", border: "1px solid #E5DDD0", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <div style={{ fontSize: "1.2rem" }}>🌿</div>
                  <div>
                    <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.85rem", color: "#1F2E1F", margin: 0 }}>12 days in a row</p>
                    <p style={{ fontSize: "0.55rem", color: "#8D9E8D", margin: 0 }}>Mindful streak</p>
                  </div>
                </div>
              </div>
              {/* Bottom nav */}
              <div style={{ background: "#FFFFFF", padding: "0.5rem 1rem 0.75rem", display: "flex", justifyContent: "space-around", borderTop: "1px solid #E5DDD0" }}>
                {["🏠","🍽️","📷","📊","👤"].map((ic, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                    <span style={{ fontSize: "1rem" }}>{ic}</span>
                    <div style={{ width: 4, height: 4, borderRadius: "50%", background: i === 0 ? "#3D5C3E" : "transparent" }} />
                  </div>
                ))}
              </div>
            </div>
            {/* Floating badge */}
            <div style={{ position: "absolute", top: "20%", right: -20, background: "#FFFFFF", borderRadius: "1rem", padding: "0.75rem 1rem", boxShadow: "0 8px 24px rgba(31,46,31,0.12)", border: "1px solid #E5DDD0" }}>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: "#3D5C3E", margin: 0, fontWeight: 500 }}>PCOS</p>
              <p style={{ fontSize: "0.65rem", color: "#8D9E8D", margin: "0.1rem 0 0" }}>Hormonal balance</p>
            </div>
            <div style={{ position: "absolute", bottom: "20%", left: -30, background: "#3D5C3E", borderRadius: "1rem", padding: "0.75rem 1rem", boxShadow: "0 8px 24px rgba(61,92,62,0.3)" }}>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.9rem", color: "#FFFFFF", margin: 0 }}>Kichari Bowl</p>
              <p style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.65)", margin: "0.1rem 0 0" }}>PCOS Friendly ✓</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "5rem 2rem", background: "#FFFFFF" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <p style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#C4974A", marginBottom: "1rem" }}>✦ You'll Get</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 400, color: "#1F2E1F", margin: 0 }}>Mindful nutrition, personalised for you</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem" }}>
            {[
              { emoji: "🌿", title: "Mindful Choices", desc: "Recipes aligned with your health conditions, dietary type, and cultural roots." },
              { emoji: "🍽️", title: "Personalised Nutrition", desc: "AI-generated 7-day meal plans with macro targets calibrated to your body." },
              { emoji: "🌸", title: "Lasting Wellness", desc: "Track progress, log meals, and watch your body respond to real nourishment." },
            ].map((f, i) => (
              <div key={i} style={{ background: "#FAF7F0", borderRadius: "1.5rem", padding: "2rem", border: "1px solid #E5DDD0" }}>
                <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>{f.emoji}</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: "#1F2E1F", margin: "0 0 0.75rem" }}>{f.title}</h3>
                <p style={{ fontSize: "0.88rem", color: "#7D8E7D", lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section style={{ padding: "5rem 2rem", background: "linear-gradient(135deg, #2D4A2E 0%, #1A2E1B 100%)", position: "relative", overflow: "hidden" }}>
        <svg style={{ position: "absolute", right: 0, bottom: 0, opacity: 0.15 }} width="300" height="300" viewBox="0 0 300 300" fill="none">
          <ellipse cx="250" cy="200" rx="80" ry="130" fill="#FFFFFF" transform="rotate(-25 250 200)"/>
          <ellipse cx="200" cy="270" rx="60" ry="100" fill="#FFFFFF" transform="rotate(15 200 270)"/>
        </svg>
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(196,151,74,0.9)", marginBottom: "1.5rem" }}>✦ Begin Your Healing</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "#FFFFFF", fontWeight: 400, margin: "0 0 1.5rem", lineHeight: 1.2 }}>
            Your plate is your medicine.
          </h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "1rem", lineHeight: 1.7, marginBottom: "2.5rem" }}>
            Small choices, made with awareness, create lasting change.
          </p>
          <Link href="/onboarding" style={{ textDecoration: "none" }}>
            <button style={{ background: "#FFFFFF", color: "#1F2E1F", border: "none", borderRadius: 999, padding: "1.1rem 3rem", fontSize: "1rem", fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
              Start for free →
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
