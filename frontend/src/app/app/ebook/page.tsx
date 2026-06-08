"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import api from "@/lib/api";

/* ─── Types ─────────────────────────────────────────────────────────────── */
interface Chapter {
  id: number;
  title: string;
  html_content: string;
}

interface Summary {
  greeting: string;
  headline: string;
  condition_label: string;
  condition_blurb: string;
  all_conditions: string[];
  goal_30day: string | null;
  stats: { label: string; value: string }[];
  diet: { type: string | null; allergies: string[] };
  focus_points: string[];
}

interface Ebook {
  condition_id: string;
  condition_label: string;
  generated_at: string;
  chapters: Chapter[];
  summary: Summary;
}

/* ─── Constants ──────────────────────────────────────────────────────────── */
const CONDITION_ICONS: Record<string, string> = {
  pcos: "🌸",
  diabetes: "🩸",
  thyroid: "⚡",
  "gut-health": "🌿",
  "anti-inflammatory": "🔥",
  menopause: "🌙",
};

/* Soft parchment-tinted gradients (light theme) for the cover & header */
const CONDITION_GRADIENT: Record<string, string> = {
  pcos: "linear-gradient(135deg, #F3E6EE 0%, #FBF6F0 100%)",
  diabetes: "linear-gradient(135deg, #E4ECF5 0%, #F8F4EC 100%)",
  thyroid: "linear-gradient(135deg, #E2F0E9 0%, #F7F3EA 100%)",
  "gut-health": "linear-gradient(135deg, #ECF1E2 0%, #F8F4EC 100%)",
  "anti-inflammatory": "linear-gradient(135deg, #F6E8DE 0%, #FBF5EE 100%)",
  menopause: "linear-gradient(135deg, #EFE6F2 0%, #F8F4EF 100%)",
};

/* Muted, deep accents that stay legible on cream parchment */
const CONDITION_ACCENT: Record<string, string> = {
  pcos: "#A85B86",
  diabetes: "#3F6E9E",
  thyroid: "#3E8F76",
  "gut-health": "#5E7D3C",
  "anti-inflammatory": "#C07248",
  menopause: "#8A5CA0",
};

/* ─── Injected CSS for ebook HTML content ────────────────────────────────── */
const EBOOK_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  .ebook-content { font-family: 'DM Sans', system-ui, sans-serif; font-size: 1rem; }
  .ebook-content h3 { font-family: 'Playfair Display', serif; font-size: 1.5rem; font-weight: 600; margin: 2.5rem 0 0.85rem; color: var(--accent, #3D5C3E); letter-spacing: -0.01em; border-bottom: 1px solid #EAE3D2; padding-bottom: 0.5rem; }
  .ebook-content h4 { font-family: 'Playfair Display', serif; font-size: 1.2rem; font-weight: 600; margin: 1.75rem 0 0.6rem; color: #2D4530; }
  .ebook-content h5 { font-family: 'DM Sans', sans-serif; font-size: 0.78rem; font-weight: 700; margin: 1.2rem 0 0.4rem; color: #8D9E8D; text-transform: uppercase; letter-spacing: 0.1em; }
  .ebook-content p { line-height: 1.85; margin: 0.85rem 0; color: #4A4036; font-size: 1rem; }
  .ebook-content ul, .ebook-content ol { padding-left: 1.6rem; margin: 0.85rem 0; }
  .ebook-content li { line-height: 1.75; margin: 0.4rem 0; color: #54493D; }
  .ebook-content strong { color: #2D4530; font-weight: 600; }
  .ebook-content em { color: #6F7E6F; }
  .ebook-content table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-family: 'DM Sans', sans-serif; font-size: 0.9rem; background: #FFFFFF; border: 1px solid #EAE3D2; border-radius: 12px; overflow: hidden; }
  .ebook-content th { background: rgba(61,92,62,0.06); padding: 0.7rem 1rem; text-align: left; color: #3D5C3E; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; font-size: 0.72rem; border-bottom: 1px solid #EAE3D2; }
  .ebook-content td { border-bottom: 1px solid #F0EADE; padding: 0.65rem 1rem; color: #54493D; vertical-align: top; }
  .ebook-content tr:hover td { background: rgba(61,92,62,0.025); }
  .ebook-content .recipe-card { background: #FFFFFF; border: 1px solid #E5DDD0; border-radius: 16px; padding: 0; margin: 1.5rem 0; overflow: hidden; box-shadow: 0 2px 16px rgba(61,92,62,0.06); transition: box-shadow 0.2s, transform 0.2s; }
  .ebook-content .recipe-card:hover { box-shadow: 0 8px 28px rgba(61,92,62,0.12); transform: translateY(-2px); }
  .ebook-content .recipe-img { width: 100%; height: 200px; object-fit: cover; display: block; background: #EFE9DD; }
  .ebook-content .recipe-body { padding: 1.35rem 1.6rem; border-top: 3px solid var(--accent, #C4974A); }
  .ebook-content .recipe-card h4 { margin-top: 0; font-size: 1.2rem; color: #2D4530; }
  .ebook-content .recipe-meta { font-family: 'DM Sans', sans-serif; font-size: 0.8rem; color: #8D9E8D; margin: 0.25rem 0 1rem; font-style: normal; }
  .ebook-content .disclaimer-banner { background: rgba(61,92,62,0.05); border: 1px solid rgba(61,92,62,0.18); border-radius: 12px; padding: 0.85rem 1.1rem; margin: 1.25rem 0; font-size: 0.88rem; color: #3D5C3E; font-family: 'DM Sans', sans-serif; line-height: 1.6; }
  .ebook-content .disclaimer { font-size: 0.8rem; color: #9A8F7E; font-style: italic; margin-top: 1.25rem; line-height: 1.6; font-family: 'DM Sans', sans-serif; }
`;

/* ─── Sub-components ─────────────────────────────────────────────────────── */
function BookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  );
}

function PrintIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 6 2 18 2 18 9"/>
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
      <rect x="6" y="14" width="12" height="8"/>
    </svg>
  );
}

function SkeletonBlock({ height = 16, width = "100%" }: { height?: number; width?: string }) {
  return (
    <div style={{
      height, width,
      background: "linear-gradient(90deg, rgba(61,92,62,0.05) 25%, rgba(61,92,62,0.10) 50%, rgba(61,92,62,0.05) 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.5s infinite",
      borderRadius: 6,
      marginBottom: 10,
    }} />
  );
}

function EbookSkeleton() {
  return (
    <div style={{ padding: "3rem 4rem" }}>
      <SkeletonBlock height={12} width="30%" />
      <SkeletonBlock height={36} width="60%" />
      <SkeletonBlock height={12} width="40%" />
      <div style={{ height: 32 }} />
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} style={{ marginBottom: 12 }}>
          <SkeletonBlock height={14} width={`${70 + Math.random() * 25}%`} />
        </div>
      ))}
      <div style={{ height: 24 }} />
      {Array.from({ length: 4 }).map((_, i) => (
        <SkeletonBlock key={i} height={13} width={`${55 + Math.random() * 35}%`} />
      ))}
    </div>
  );
}

/* ─── Personalised summary cover ─────────────────────────────────────────── */
function SummaryCover({ ebook, accent }: { ebook: Ebook; accent: string }) {
  const s = ebook.summary;
  const rgb = hexToRgb(accent);
  return (
    <div style={{
      background: CONDITION_GRADIENT[ebook.condition_id] ?? "linear-gradient(135deg, #F2EEE2 0%, #FBF7EF 100%)",
      borderBottom: "1px solid #E5DDD0",
      padding: "3rem 4rem 2.75rem",
    }}>
      <div style={{ maxWidth: 760 }}>
        {/* Eyebrow */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: `rgba(${rgb}, 0.1)`,
          border: `1px solid rgba(${rgb}, 0.25)`,
          borderRadius: 20, padding: "0.35rem 0.9rem", marginBottom: "1.25rem",
        }}>
          <span style={{ fontSize: "1rem", lineHeight: 1 }}>{CONDITION_ICONS[ebook.condition_id] ?? "📖"}</span>
          <span style={{ fontSize: "0.7rem", color: accent, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Your Personalised Library
          </span>
        </div>

        {/* Greeting + headline */}
        <h1 style={{
          fontSize: "2.6rem", fontWeight: 500, color: "#1F2E1F", margin: "0 0 0.5rem",
          fontFamily: "'Playfair Display', serif", lineHeight: 1.12, letterSpacing: "-0.02em",
        }}>
          {s.greeting}.<br />
          <span style={{ color: accent, fontStyle: "italic" }}>{s.headline}</span>
        </h1>
        <p style={{ color: "#5E6B5E", fontSize: "1.02rem", lineHeight: 1.7, margin: "0 0 1.75rem", maxWidth: 560 }}>
          {s.condition_blurb}
        </p>

        {/* Stat row — label/value pairs, echoing the reference cover meta-row */}
        {s.stats.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: "1.5rem" }}>
            {s.stats.map((st) => (
              <div key={st.label} style={{
                background: "rgba(255,255,255,0.6)",
                border: "1px solid #E5DDD0",
                borderRadius: 12, padding: "0.7rem 1.1rem", minWidth: 110,
              }}>
                <div style={{ fontSize: "0.64rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#8D9E8D", fontWeight: 600, marginBottom: 4 }}>
                  {st.label}
                </div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", color: "#1F2E1F", fontWeight: 500 }}>
                  {st.value}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Personalised detail panel */}
        <div style={{
          background: "rgba(255,255,255,0.55)",
          border: "1px solid #E5DDD0",
          borderRadius: 16,
          padding: "1.5rem 1.75rem",
          display: "grid",
          gap: "1.25rem",
        }}>
          {/* Conditions */}
          {s.all_conditions.length > 0 && (
            <div>
              <div style={{ fontSize: "0.64rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#8D9E8D", fontWeight: 600, marginBottom: "0.55rem" }}>
                Tailored for
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {s.all_conditions.map((c) => (
                  <span key={c} style={{
                    fontSize: "0.8rem", fontWeight: 600, color: accent,
                    background: `rgba(${rgb}, 0.1)`,
                    border: `1px solid rgba(${rgb}, 0.22)`,
                    borderRadius: 999, padding: "0.3rem 0.85rem",
                  }}>{c}</span>
                ))}
              </div>
            </div>
          )}

          {/* 30-day goal */}
          {s.goal_30day && (
            <div>
              <div style={{ fontSize: "0.64rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#8D9E8D", fontWeight: 600, marginBottom: "0.4rem" }}>
                Your 30-day goal
              </div>
              <p style={{ margin: 0, color: "#4A4036", fontSize: "0.95rem", lineHeight: 1.6, fontStyle: "italic" }}>
                “{s.goal_30day}”
              </p>
            </div>
          )}

          {/* Focus points */}
          {s.focus_points.length > 0 && (
            <div>
              <div style={{ fontSize: "0.64rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#8D9E8D", fontWeight: 600, marginBottom: "0.55rem" }}>
                What this guide focuses on
              </div>
              <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none", display: "grid", gap: 8 }}>
                {s.focus_points.map((f, i) => (
                  <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", color: "#54493D", fontSize: "0.92rem", lineHeight: 1.55 }}>
                    <span style={{ color: accent, marginTop: 1, flexShrink: 0 }}>✦</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Diet + allergies */}
          {(s.diet.type || s.diet.allergies.length > 0) && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1.75rem" }}>
              {s.diet.type && (
                <div>
                  <div style={{ fontSize: "0.64rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#8D9E8D", fontWeight: 600, marginBottom: "0.35rem" }}>
                    Diet
                  </div>
                  <div style={{ color: "#4A4036", fontSize: "0.9rem", fontWeight: 500 }}>{s.diet.type}</div>
                </div>
              )}
              {s.diet.allergies.length > 0 && (
                <div>
                  <div style={{ fontSize: "0.64rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#8D9E8D", fontWeight: 600, marginBottom: "0.35rem" }}>
                    Avoiding
                  </div>
                  <div style={{ color: "#4A4036", fontSize: "0.9rem", fontWeight: 500 }}>
                    {s.diet.allergies.join(", ")}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────────────── */
export default function EbookPage() {
  const [ebook, setEbook] = useState<Ebook | null>(null);
  const [activeChapter, setActiveChapter] = useState<number>(0); // 0 = summary cover
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [preparing, setPreparing] = useState(false);
  const chapterRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const contentRef = useRef<HTMLDivElement>(null);

  const accent = ebook ? (CONDITION_ACCENT[ebook.condition_id] ?? "#3D5C3E") : "#3D5C3E";

  /* fetch the user's single ebook */
  useEffect(() => {
    setLoading(true);
    api.get("/ebook/me")
      .then(r => { setEbook(r.data); })
      .catch(e => {
        const status = e?.response?.status;
        if (status === 202) {
          setPreparing(true);
        } else {
          setError(e?.response?.data?.detail ?? "Your guide isn't available yet.");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  /* scroll to chapter (id 0 = summary cover / top) */
  const scrollToChapter = useCallback((id: number) => {
    setActiveChapter(id);
    if (id === 0) {
      contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = chapterRefs.current[id];
    if (el && contentRef.current) {
      contentRef.current.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" });
    }
  }, []);

  /* track active chapter on scroll */
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const handler = () => {
      if (el.scrollTop < 120) { setActiveChapter(0); return; }
      const ids = Object.keys(chapterRefs.current).map(Number).sort((a, b) => a - b);
      for (let i = ids.length - 1; i >= 0; i--) {
        const ref = chapterRefs.current[ids[i]];
        if (ref && ref.offsetTop - 120 <= el.scrollTop) {
          setActiveChapter(ids[i]);
          break;
        }
      }
    };
    el.addEventListener("scroll", handler, { passive: true });
    return () => el.removeEventListener("scroll", handler);
  }, [ebook]);

  return (
    <>
      <style>{EBOOK_CSS}</style>
      <style>{`
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        :root { --accent: ${accent}; }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(61,92,62,0.18); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(61,92,62,0.32); }

        /* ── Print: unlock the scroll container so every chapter flows onto paper ── */
        @media print {
          @page { margin: 16mm; }
          /* hide app chrome — sidebar, bottom nav, the print button itself */
          .ebook-sidebar, .ebook-print-bar { display: none !important; }
          .fixed.bottom-0 { display: none !important; }
          /* break the fixed-height / overflow:hidden cage that was clipping to one screen */
          .ebook-shell {
            display: block !important;
            height: auto !important;
            overflow: visible !important;
            background: #FFFFFF !important;
          }
          .ebook-main {
            display: block !important;
            height: auto !important;
            overflow: visible !important;
          }
          html, body { background: #FFFFFF !important; height: auto !important; overflow: visible !important; }
          /* preserve the cream/gradient styling on paper */
          .ebook-shell, .ebook-content, .ebook-content * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          /* each chapter starts a fresh page; keep tables & recipe cards intact */
          .ebook-chapter { break-before: page; page-break-before: always; padding-top: 0 !important; }
          .ebook-content table, .ebook-content .recipe-card { break-inside: avoid; page-break-inside: avoid; }
        }
      `}</style>

      <div className="ebook-shell" style={{
        display: "flex",
        height: "calc(100vh - 4.5rem)", /* account for fixed BottomNav */
        background: "#F5EFE2",
        color: "#4A4036",
        fontFamily: "'DM Sans', system-ui, sans-serif",
        overflow: "hidden",
        marginBottom: 0,
      }}>

        {/* ── Sidebar ─────────────────────────────────────────────────── */}
        <aside className="ebook-sidebar" style={{
          width: 272,
          minWidth: 272,
          background: "#FBF7EF",
          borderRight: "1px solid #E5DDD0",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}>
          {/* Sidebar header */}
          <div style={{ padding: "1.5rem 1.25rem 1rem", borderBottom: "1px solid #E5DDD0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: accent, marginBottom: 6 }}>
              <BookIcon />
              <span style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Your Guide
              </span>
            </div>
            {ebook ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: "1.25rem", lineHeight: 1 }}>{CONDITION_ICONS[ebook.condition_id] ?? "📖"}</span>
                <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "#2D4530" }}>{ebook.condition_label}</span>
              </div>
            ) : (
              <p style={{ fontSize: "0.78rem", color: "#8D9E8D", margin: 0, lineHeight: 1.5 }}>
                Your personalised nutrition guide
              </p>
            )}
          </div>

          {/* Chapter list */}
          {ebook && (
            <div style={{ flex: 1, overflowY: "auto", padding: "1rem 1rem 1rem" }}>
              {/* Summary cover link */}
              <button
                onClick={() => scrollToChapter(0)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 8,
                  padding: "0.5rem 0.75rem", marginBottom: 8, borderRadius: 8, border: "none",
                  background: activeChapter === 0 ? `rgba(${hexToRgb(accent)}, 0.1)` : "transparent",
                  color: activeChapter === 0 ? accent : "#6F7E6F",
                  cursor: "pointer", textAlign: "left", fontSize: "0.82rem", fontWeight: 600,
                  transition: "all 0.12s",
                }}
              >
                ✦ Personalised summary
              </button>

              <p style={{ fontSize: "0.7rem", fontWeight: 600, color: "#8D9E8D", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.6rem", paddingLeft: "0.25rem" }}>
                Chapters
              </p>
              {ebook.chapters.map(ch => (
                <button
                  key={ch.id}
                  onClick={() => scrollToChapter(ch.id)}
                  style={{
                    width: "100%", display: "flex", alignItems: "flex-start", gap: 8,
                    padding: "0.45rem 0.75rem", marginBottom: 2, borderRadius: 8, border: "none",
                    background: activeChapter === ch.id ? `rgba(${hexToRgb(accent)}, 0.1)` : "transparent",
                    color: activeChapter === ch.id ? accent : "#6F7E6F",
                    cursor: "pointer", textAlign: "left", transition: "all 0.12s", fontSize: "0.8rem",
                  }}
                >
                  <span style={{ fontSize: "0.7rem", fontWeight: 700, minWidth: 18, color: activeChapter === ch.id ? accent : "#B6AD9C", marginTop: 1 }}>{ch.id}</span>
                  <span style={{ lineHeight: 1.4, fontWeight: activeChapter === ch.id ? 500 : 400 }}>{ch.title}</span>
                </button>
              ))}
            </div>
          )}
        </aside>

        {/* ── Main content ─────────────────────────────────────────────── */}
        <main ref={contentRef} className="ebook-main" style={{ flex: 1, overflowY: "auto", position: "relative" }}>
          {/* Loading skeleton */}
          {loading && <EbookSkeleton />}

          {/* "Being prepared" state (202) */}
          {preparing && !loading && (
            <div style={{ padding: "3rem 3.5rem", animation: "fadeIn 0.3s ease" }}>
              <div style={{ background: "rgba(61,92,62,0.05)", border: "1px solid rgba(61,92,62,0.18)", borderRadius: 16, padding: "2rem", maxWidth: 480 }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>📖</div>
                <h3 style={{ color: "#3D5C3E", margin: "0 0 0.5rem", fontWeight: 600, fontFamily: "'Playfair Display', serif" }}>Your guide is being prepared</h3>
                <p style={{ color: "#7B8A7B", fontSize: "0.9rem", lineHeight: 1.6, margin: 0 }}>
                  We&apos;re assembling your personalised nutrition guide. Please check back in a moment.
                </p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div style={{ padding: "3rem 3.5rem", animation: "fadeIn 0.3s ease" }}>
              <div style={{ background: "rgba(196,151,74,0.08)", border: "1px solid rgba(196,151,74,0.25)", borderRadius: 16, padding: "2rem", maxWidth: 480 }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>📖</div>
                <h3 style={{ color: "#9A7228", margin: "0 0 0.5rem", fontWeight: 600, fontFamily: "'Playfair Display', serif" }}>Guide unavailable</h3>
                <p style={{ color: "#7B8A7B", fontSize: "0.9rem", lineHeight: 1.6, margin: 0 }}>{error}</p>
              </div>
            </div>
          )}

          {/* Ebook content */}
          {ebook && !loading && (
            <div style={{ animation: "fadeUp 0.35s ease" }}>
              {/* Print button bar — sticky so it stays reachable while reading */}
              <div className="ebook-print-bar" style={{
                display: "flex", justifyContent: "flex-end",
                padding: "1rem 4rem 0",
                position: "sticky", top: 0, zIndex: 20,
                pointerEvents: "none",
              }}>
                <button
                  onClick={() => window.print()}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "0.5rem 0.9rem", borderRadius: 999, border: "1px solid #E0D8CC",
                    background: "#FFFFFF", color: "#3D5C3E", cursor: "pointer",
                    fontSize: "0.8rem", fontWeight: 600, transition: "all 0.15s",
                    pointerEvents: "auto",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(61,92,62,0.06)";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#3D5C3E";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = "#FFFFFF";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#E0D8CC";
                  }}
                >
                  <PrintIcon />
                  Print
                </button>
              </div>

              {/* Personalised summary cover */}
              <SummaryCover ebook={ebook} accent={accent} />

              {/* Disclaimer strip */}
              <div style={{ padding: "1.25rem 4rem 0" }}>
                <div style={{
                  padding: "0.55rem 0.9rem", background: "rgba(61,92,62,0.05)",
                  border: "1px solid rgba(61,92,62,0.18)", borderRadius: 10,
                  fontSize: "0.78rem", color: "#3D5C3E", lineHeight: 1.5,
                }}>
                  ⚕️ This guide is for educational purposes only and does not replace professional medical advice.
                  Always consult your healthcare provider before making significant dietary changes.
                </div>
              </div>

              {/* Chapters */}
              <div style={{ padding: "0 4rem 4rem" }}>
                {ebook.chapters.map((ch, idx) => (
                  <div
                    key={ch.id}
                    className="ebook-chapter"
                    ref={el => { chapterRefs.current[ch.id] = el; }}
                    style={{ paddingTop: "3rem" }}
                  >
                    {/* Chapter header */}
                    <div style={{
                      display: "flex", alignItems: "center", gap: 14,
                      marginBottom: "1.5rem", paddingBottom: "1rem",
                      borderBottom: `2px solid rgba(${hexToRgb(accent)}, 0.15)`,
                    }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 10,
                        background: `rgba(${hexToRgb(accent)}, 0.12)`,
                        border: `1px solid rgba(${hexToRgb(accent)}, 0.25)`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "0.8rem", fontWeight: 700, color: accent,
                        fontFamily: "'DM Sans', sans-serif", flexShrink: 0,
                      }}>
                        {ch.id}
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: "0.7rem", color: "#A89F8E", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                          Chapter {ch.id}
                        </p>
                        <h2 style={{
                          margin: 0, fontSize: "1.65rem", fontWeight: 500, color: "#1F2E1F",
                          fontFamily: "'Playfair Display', serif", letterSpacing: "-0.015em", lineHeight: 1.2,
                        }}>
                          {ch.title}
                        </h2>
                      </div>
                    </div>

                    {/* Chapter content */}
                    {ch.html_content ? (
                      <div
                        className="ebook-content"
                        style={{ "--accent": accent } as React.CSSProperties}
                        dangerouslySetInnerHTML={{ __html: ch.html_content }}
                      />
                    ) : (
                      <div style={{
                        padding: "2rem", background: "rgba(61,92,62,0.03)", borderRadius: 12,
                        color: "#A89F8E", fontSize: "0.9rem", textAlign: "center",
                      }}>
                        Content being prepared…
                      </div>
                    )}

                    {/* Chapter divider (not after last) */}
                    {idx < ebook.chapters.length - 1 && (
                      <div style={{
                        marginTop: "3rem", height: 1,
                        background: "linear-gradient(90deg, transparent, rgba(61,92,62,0.14) 20%, rgba(61,92,62,0.14) 80%, transparent)",
                      }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

/* ─── Utility ────────────────────────────────────────────────────────────── */
function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}
