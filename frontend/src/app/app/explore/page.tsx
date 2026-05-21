"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useDebounce } from "@/hooks/use-debounce";

const FALLBACK_IMG = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300";

const CATEGORIES = [
  { label: "Recipes", icon: RecipeIcon },
  { label: "Articles", icon: ArticleIcon },
  { label: "Guides", icon: GuideIcon },
  { label: "Ingredients", icon: IngredientIcon },
  { label: "Wellness", icon: WellnessIcon },
  { label: "Videos", icon: VideoIcon },
];

const CONDITION_TAGS = ["PCOS Friendly", "Diabetes Friendly", "Thyroid Friendly", "Heart Healthy", "Keto", "High Protein"];

const WELLNESS_ARTICLES = [
  { title: "Understanding PCOS & Nutrition", readTime: "7 min read", tag: "Evidence-based", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300" },
  { title: "Gut Health 101", readTime: "6 min read", tag: "Beginner friendly", img: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=300" },
];

function RecipeIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3D5C3E" strokeWidth="1.8" strokeLinecap="round"><path d="M4 16 Q4 20 12 20 Q20 20 20 16 L18 10 H6 Z" /><path d="M8 10 Q8 6 12 6 Q16 6 16 10" /></svg>;
}
function ArticleIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3D5C3E" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M7 8h10M7 12h10M7 16h6" /></svg>;
}
function GuideIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3D5C3E" strokeWidth="1.8" strokeLinecap="round"><path d="M12 2 Q8 6 8 10 Q12 8 12 2 Z M12 2 Q16 6 16 10 Q12 8 12 2 Z" fill="#3D5C3E" fillOpacity="0.2" /><path d="M12 10 L12 22" /></svg>;
}
function IngredientIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3D5C3E" strokeWidth="1.8" strokeLinecap="round"><rect x="6" y="2" width="12" height="20" rx="2" /><path d="M9 7h6M9 11h6M9 15h4" /></svg>;
}
function WellnessIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3D5C3E" strokeWidth="1.8" strokeLinecap="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="M7 13s1.5 2 5 2 5-2 5-2M9 9h.01M15 9h.01" /></svg>;
}
function VideoIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3D5C3E" strokeWidth="1.8" strokeLinecap="round"><polygon points="5 3 19 12 5 21 5 3" /></svg>;
}

export default function Explore() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Recipes");

  useEffect(() => {
    setLoading(true);
    const params: any = { number: 6 };
    if (debouncedSearch) params.search = debouncedSearch;
    api.get("/recipes", { params })
      .then(r => setRecipes(r.data || []))
      .catch(() => setRecipes([]))
      .finally(() => setLoading(false));
  }, [debouncedSearch]);

  const firstName = user?.name?.split(" ")[0] || "";

  return (
    <div style={{
      minHeight: "100vh", background: "#F5EFE2",
      fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
    }}>
      {/* Header */}
      <div style={{ position: "relative", overflow: "hidden", padding: "18px 20px 0" }}>
        {/* Landscape image slot */}
        <div
          data-image-slot="explore-landscape-top"
          style={{
            position: "absolute", top: 0, right: 0, width: "60%", bottom: 0,
            pointerEvents: "none",
            background: "linear-gradient(135deg, rgba(200,210,180,0.35), rgba(170,185,150,0.2))",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 2 }}>
          <h1 style={{
            fontFamily: "var(--font-playfair), 'Playfair Display', serif",
            fontSize: 32, fontWeight: 500, color: "#2D4530", margin: 0,
            display: "inline-flex", alignItems: "center", gap: 8,
          }}>
            Explore
            <svg width="20" height="16" viewBox="0 0 24 18" fill="none">
              <path d="M12 16 Q4 12 6 4 Q12 8 12 16 Z" fill="#C4974A" opacity="0.85" />
              <path d="M12 16 Q20 12 18 4 Q12 8 12 16 Z" fill="#C4974A" opacity="0.85" />
            </svg>
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button style={{ background: "transparent", border: "none", cursor: "pointer", padding: 4 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2D4530" strokeWidth="1.8" strokeLinecap="round">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
              </svg>
            </button>
            <div style={{
              width: 34, height: 34, borderRadius: "50%", background: "#D9E0D3",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              fontSize: 14, fontWeight: 500, color: "#3D5C3E",
            }}>
              {firstName[0]?.toUpperCase() || "?"}
            </div>
          </div>
        </div>
        <p style={{ position: "relative", zIndex: 2, fontSize: 14, color: "#7B8A7B", margin: "6px 0 14px" }}>
          Discover. Learn. Grow.
        </p>
      </div>

      {/* Search */}
      <div style={{ padding: "0 20px 14px" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          background: "#FFFFFF", border: "1px solid #EAE3D2", borderRadius: 14,
          padding: "11px 14px", boxShadow: "0 1px 6px rgba(31,46,31,0.05)",
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9DA89D" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search recipes, articles, guides..."
            style={{
              flex: 1, border: "none", outline: "none", background: "transparent",
              fontSize: 14, color: "#2D4530", fontFamily: "inherit",
            }}
          />
        </div>
      </div>

      {/* Category icons */}
      <div style={{ padding: "0 20px 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {CATEGORIES.map(cat => {
            const active = activeCategory === cat.label;
            const Icon = cat.icon;
            return (
              <button key={cat.label} onClick={() => setActiveCategory(cat.label)} style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                background: "transparent", border: "none", cursor: "pointer", fontFamily: "inherit",
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: active ? "#3D5C3E" : "#FFFFFF",
                  border: active ? "none" : "1px solid #EAE3D2",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 1px 4px rgba(31,46,31,0.05)",
                  transition: "all 0.2s",
                }}>
                  <div style={{ color: active ? "#fff" : "#3D5C3E" }}>
                    <Icon />
                  </div>
                </div>
                <span style={{ fontSize: 10.5, color: active ? "#2D4530" : "#9DA89D", fontWeight: active ? 600 : 400 }}>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ padding: "0 20px 0", display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Trending Recipes */}
        <section>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <h2 style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontSize: 18, fontWeight: 500, color: "#2D4530", margin: 0 }}>
              Trending Recipes
            </h2>
            <button style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 12.5, color: "#3D5C3E", fontFamily: "inherit", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 3 }}>
              View all <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          </div>
          {loading ? (
            <div style={{ textAlign: "center", padding: "24px 0", color: "#A8B8A8", fontSize: 14 }}>Loading…</div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {(recipes.length > 0 ? recipes.slice(0, 3) : FALLBACK_RECIPES).map((r, i) => (
                <Link key={r.id || i} href={r.id ? `/app/recipe/${r.id}` : "#"} style={{ textDecoration: "none" }}>
                  <div style={{ borderRadius: 14, overflow: "hidden", position: "relative" }}>
                    <div style={{ position: "relative", aspectRatio: "1 / 1", background: "#E8E3D8" }}>
                      <img
                        src={r.image || FALLBACK_IMG} alt={r.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        loading="lazy"
                        onError={e => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }}
                      />
                      {/* Cook time badge */}
                      <div style={{
                        position: "absolute", top: 7, left: 7,
                        background: "rgba(0,0,0,0.55)", borderRadius: 8,
                        padding: "2px 7px", fontSize: 10, color: "#fff",
                      }}>
                        {r.cook_time || 25} min
                      </div>
                      {/* Heart */}
                      <button onClick={e => { e.preventDefault(); }} style={{
                        position: "absolute", top: 6, right: 6,
                        width: 24, height: 24, borderRadius: "50%", background: "rgba(255,255,255,0.85)",
                        border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C25E4B" strokeWidth="2" strokeLinecap="round">
                          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                        </svg>
                      </button>
                    </div>
                    <div style={{ padding: "8px 2px 2px" }}>
                      <p style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontSize: 13, color: "#2D4530", margin: "0 0 3px", lineHeight: 1.3, fontWeight: 500 }}>
                        {r.title?.slice(0, 20)}{r.title?.length > 20 ? "…" : ""}
                      </p>
                      <p style={{ fontSize: 10.5, color: "#9DA89D", margin: "0 0 4px" }}>
                        {r.description?.slice(0, 30) || "Nourishing & balanced"}…
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <svg width="9" height="9" viewBox="0 0 24 18" fill="none">
                          <path d="M12 16 Q4 12 6 4 Q12 8 12 16 Z" fill="#3D5C3E" opacity="0.8" />
                          <path d="M12 16 Q20 12 18 4 Q12 8 12 16 Z" fill="#3D5C3E" opacity="0.8" />
                        </svg>
                        <span style={{ fontSize: 10, color: "#7B8A7B" }}>4.{7 + i} ({180 + i * 70})</span>
                      </div>
                      {/* Condition tag */}
                      <div style={{
                        marginTop: 4, display: "inline-block", padding: "2px 7px",
                        background: "#E8F0E8", borderRadius: 6, fontSize: 9.5, color: "#3D5C3E", fontWeight: 500,
                      }}>
                        {CONDITION_TAGS[i % CONDITION_TAGS.length]}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Wellness Articles */}
        <section>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <h2 style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontSize: 18, fontWeight: 500, color: "#2D4530", margin: 0 }}>
              Wellness Articles
            </h2>
            <button style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 12.5, color: "#3D5C3E", fontFamily: "inherit", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 3 }}>
              View all <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {WELLNESS_ARTICLES.map((art, i) => (
              <div key={i} style={{ borderRadius: 14, overflow: "hidden", background: "#FFFFFF", boxShadow: "0 1px 6px rgba(31,46,31,0.05)", position: "relative" }}>
                <div style={{ height: 90, background: "#E8E3D8", overflow: "hidden" }}>
                  <img src={art.img} alt={art.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
                  <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0, padding: "40px 10px 10px",
                    background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)",
                  }}>
                    <p style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontSize: 12.5, color: "#fff", margin: 0, lineHeight: 1.3 }}>{art.title}</p>
                  </div>
                </div>
                <div style={{ padding: "10px 10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: 10.5, color: "#9DA89D" }}>{art.readTime} · {art.tag}</div>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D7CFC0" strokeWidth="2" strokeLinecap="round">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Seasonal Picks */}
        <section style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <h2 style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontSize: 18, fontWeight: 500, color: "#2D4530", margin: 0 }}>
              Seasonal Picks
            </h2>
            <button style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 12.5, color: "#3D5C3E", fontFamily: "inherit", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 3 }}>
              View all <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          </div>
          <div style={{ borderRadius: 18, overflow: "hidden", position: "relative", background: "#FFFFFF", boxShadow: "0 1px 8px rgba(31,46,31,0.06)" }}>
            <div style={{ display: "flex", gap: 0 }}>
              <div style={{ width: 130, flexShrink: 0, background: "#E8E3D8", overflow: "hidden" }}>
                <img
                  src="https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=200"
                  alt="Summer Nourishment"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  loading="lazy"
                />
              </div>
              <div style={{ flex: 1, padding: "16px" }}>
                <h3 style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontSize: 17, color: "#2D4530", margin: "0 0 6px" }}>
                  Summer Nourishment ☀️
                </h3>
                <p style={{ fontSize: 12.5, color: "#7B8A7B", margin: "0 0 12px", lineHeight: 1.5 }}>
                  Cooling foods, hydrating drinks and recipes to keep you balanced this season.
                </p>
                <button style={{
                  background: "#3D5C3E", color: "#fff", border: "none",
                  borderRadius: 999, padding: "8px 16px", fontSize: 12.5, fontWeight: 500,
                  fontFamily: "inherit", cursor: "pointer",
                }}>
                  Explore Now
                </button>
              </div>
            </div>
            {/* Dots */}
            <div style={{ display: "flex", justifyContent: "center", gap: 5, padding: "10px 0" }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: i === 0 ? 18 : 6, height: 6, borderRadius: 999, background: i === 0 ? "#3D5C3E" : "#D7CFC0" }} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

const FALLBACK_RECIPES = [
  { id: null, title: "Kichari Bowl", description: "Light, nourishing & gut friendly", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300", cook_time: 20 },
  { id: null, title: "Stuffed Paratha", description: "High fiber, Satisfying", image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=300", cook_time: 25 },
  { id: null, title: "Moong Dal Soup", description: "Comforting & protein rich", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300", cook_time: 15 },
];
