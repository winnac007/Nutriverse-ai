"use client";

import React, { useEffect, useState, useRef } from "react";
import api from "@/lib/api";
import RecipeCard from "@/components/RecipeCard";
import { Loader2 } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { useThrottleCallback } from "@/hooks/use-throttle";

const TAGS = ["vegetarian", "vegan", "gluten-free", "dairy-free", "high-protein", "pescatarian"];
const PAGE_SIZE = 12;
const CATEGORIES = [
  { v: "all", l: "All", emoji: "🌿" },
  { v: "healthcare", l: "Health", emoji: "❤️" },
  { v: "fitness", l: "Fitness", emoji: "⚡" },
  { v: "cultural", l: "Cultural", emoji: "🌍" },
  { v: "chef-special", l: "Chef's Pick", emoji: "👨‍🍳" },
];

const sel: React.CSSProperties = {
  padding: "0.6rem 0.9rem", border: "1.5px solid #E0D8CC", borderRadius: "0.75rem",
  fontSize: "0.82rem", color: "#1F2E1F", fontFamily: "'DM Sans'", background: "#FFFFFF",
  outline: "none", appearance: "none", WebkitAppearance: "none", cursor: "pointer", width: "100%",
};

export default function Explore() {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [tag, setTag] = useState("");
  const [tier, setTier] = useState("all");
  const [budget, setBudget] = useState("all");
  const [country, setCountry] = useState("all");
  const [region, setRegion] = useState("all");
  const [offset, setOffset] = useState(0);

  const [countries, setCountries] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => { api.get("/recipes/countries").then((r) => setCountries(r.data)); }, []);

  useEffect(() => {
    const params = country !== "all" ? { country } : {};
    api.get("/recipes/regions", { params }).then((r) => setRegions(r.data));
    setRegion("all");
    setOffset(0);
  }, [country]);

  useEffect(() => { setOffset(0); }, [category, debouncedSearch, tag, tier, budget]);

  const fetchRecipes = async (currentOffset: number) => {
    setLoading(true);
    const params: any = { offset: currentOffset };
    if (category !== "all") params.category = category;
    if (debouncedSearch) params.search = debouncedSearch;
    if (tag) params.tag = tag;
    if (tier !== "all") params.tier = tier;
    if (country !== "all") params.country = country;
    if (region !== "all") params.region = region;
    if (budget !== "all") params.budget = budget;
    try {
      const r = await api.get("/recipes", { params });
      const newRecipes = r.data;
      if (currentOffset === 0) { setRecipes(newRecipes); } else { setRecipes(prev => [...prev, ...newRecipes]); }
      setHasMore(newRecipes.length >= PAGE_SIZE);
    } catch (err) { console.error("Fetch recipes failed", err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchRecipes(offset); }, [category, debouncedSearch, tag, tier, country, region, budget, offset]);

  const handleLoadMore = useThrottleCallback(() => {
    if (!loading && hasMore) setOffset(prev => prev + PAGE_SIZE);
  }, 1000);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => { if (entries[0].isIntersecting) handleLoadMore(); }, { threshold: 0.1 });
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [handleLoadMore]);

  return (
    <div style={{ minHeight: "100vh", background: "#FAF7F0", paddingBottom: "6rem" }}>
      {/* Header */}
      <div style={{ position: "relative", background: "linear-gradient(180deg, #F0EBE0 0%, #FAF7F0 100%)", padding: "2.5rem 1.25rem 1.25rem", overflow: "hidden" }}>
        <svg style={{ position: "absolute", top: -10, right: -10, width: 130, height: 130, opacity: 0.28 }} viewBox="0 0 130 130" fill="none">
          <ellipse cx="90" cy="30" rx="28" ry="48" fill="#3D5C3E" transform="rotate(-30 90 30)"/>
          <ellipse cx="112" cy="68" rx="20" ry="36" fill="#3D5C3E" opacity="0.6" transform="rotate(12 112 68)"/>
          <line x1="90" y1="30" x2="65" y2="110" stroke="#5A7A5B" strokeWidth="1.5" opacity="0.4"/>
        </svg>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
          <div />
          <button style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.7)", border: "1px solid #E5DDD0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3D5C3E" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
          </button>
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.75rem", fontWeight: 400, color: "#1F2E1F", margin: "0 0 0.2rem" }}>Explore 🌿</h1>
        <p style={{ fontSize: "0.8rem", color: "#8D9E8D", margin: 0 }}>Discover. Learn. Grow.</p>
      </div>

      <div style={{ padding: "1rem 1.25rem 0", display: "flex", flexDirection: "column", gap: "1rem" }}>

        {/* Search bar */}
        <div style={{ position: "relative" }}>
          <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A8B8A8" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search recipes, articles, guides..."
            style={{ width: "100%", padding: "0.8rem 0.8rem 0.8rem 2.5rem", border: "1.5px solid #E0D8CC", borderRadius: "0.9rem", fontSize: "0.88rem", fontFamily: "'DM Sans'", color: "#1F2E1F", background: "#FFFFFF", outline: "none", boxSizing: "border-box" }}
          />
        </div>

        {/* Category tabs */}
        <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto", paddingBottom: "0.25rem" }}>
          {CATEGORIES.map(cat => (
            <button key={cat.v} onClick={() => setCategory(cat.v)} style={{ display: "flex", alignItems: "center", gap: "0.35rem", padding: "0.5rem 1rem", borderRadius: 999, border: "1.5px solid", flexShrink: 0, fontFamily: "'DM Sans'", fontSize: "0.8rem", fontWeight: category === cat.v ? 600 : 400, cursor: "pointer", transition: "all 0.18s", background: category === cat.v ? "#3D5C3E" : "#FFFFFF", borderColor: category === cat.v ? "#3D5C3E" : "#E0D8CC", color: category === cat.v ? "#FFFFFF" : "#7D8E7D" }}>
              <span>{cat.emoji}</span> {cat.l}
            </button>
          ))}
        </div>

        {/* Diet tags */}
        <div style={{ display: "flex", gap: "0.45rem", overflowX: "auto", paddingBottom: "0.25rem" }}>
          <button onClick={() => setTag("")} style={{ padding: "0.35rem 0.85rem", borderRadius: 999, border: "1.5px solid", flexShrink: 0, fontFamily: "'DM Sans'", fontSize: "0.72rem", fontWeight: !tag ? 600 : 400, cursor: "pointer", background: !tag ? "#1F2E1F" : "#FFFFFF", borderColor: !tag ? "#1F2E1F" : "#E0D8CC", color: !tag ? "#FFFFFF" : "#8D9E8D" }}>
            All Tags
          </button>
          {TAGS.map(t => (
            <button key={t} onClick={() => setTag(tag === t ? "" : t)} style={{ padding: "0.35rem 0.85rem", borderRadius: 999, border: "1.5px solid", flexShrink: 0, fontFamily: "'DM Sans'", fontSize: "0.72rem", fontWeight: tag === t ? 600 : 400, cursor: "pointer", transition: "all 0.18s", background: tag === t ? "#1F2E1F" : "#FFFFFF", borderColor: tag === t ? "#1F2E1F" : "#E0D8CC", color: tag === t ? "#FFFFFF" : "#8D9E8D" }}>
              {t}
            </button>
          ))}
        </div>

        {/* Cuisine + Region selectors */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem" }}>
          <div style={{ position: "relative" }}>
            <select style={sel} value={country} onChange={e => setCountry(e.target.value)}>
              <option value="all">All cuisines</option>
              {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <svg style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#A8B8A8" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
          <div style={{ position: "relative" }}>
            <select style={{ ...sel, opacity: regions.length === 0 ? 0.5 : 1 }} value={region} onChange={e => setRegion(e.target.value)} disabled={regions.length === 0}>
              <option value="all">All regions</option>
              {regions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <svg style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#A8B8A8" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        </div>

        {/* Budget filter */}
        <div style={{ display: "flex", gap: "0.45rem" }}>
          {[{ v: "all", l: "All Budget" }, { v: "100", l: "₹100" }, { v: "200", l: "₹200" }, { v: "300", l: "₹300+" }].map(b => (
            <button key={b.v} onClick={() => setBudget(b.v)} style={{ flex: 1, padding: "0.5rem", borderRadius: 999, border: "1.5px solid", fontFamily: "'DM Sans'", fontSize: "0.72rem", fontWeight: budget === b.v ? 600 : 400, cursor: "pointer", transition: "all 0.18s", background: budget === b.v ? "#3D5C3E" : "#FFFFFF", borderColor: budget === b.v ? "#3D5C3E" : "#E0D8CC", color: budget === b.v ? "#FFFFFF" : "#7D8E7D" }}>
              {b.l}
            </button>
          ))}
        </div>

        {/* Trending label */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: "#1F2E1F", margin: 0 }}>
            {debouncedSearch ? `Results for "${debouncedSearch}"` : category === "all" ? "Trending Recipes" : CATEGORIES.find(c => c.v === category)?.l}
          </p>
          {recipes.length > 0 && <span style={{ fontSize: "0.72rem", color: "#A8B8A8" }}>View all</span>}
        </div>

        {/* Recipe grid */}
        {recipes.length === 0 && !loading ? (
          <div style={{ textAlign: "center", padding: "3rem 1rem", background: "#FFFFFF", borderRadius: "1.25rem", border: "1px solid #E5DDD0" }}>
            <span style={{ fontSize: "2.5rem" }}>🌾</span>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: "#1F2E1F", margin: "0.75rem 0 0.4rem" }}>No recipes found</p>
            <p style={{ fontSize: "0.82rem", color: "#8D9E8D", margin: 0 }}>Try adjusting your filters or search query</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {recipes.map((r, i) => (
              <div key={`${r.id}-${i}`} style={{ animation: "fadeUp 0.3s ease forwards", animationDelay: `${(i % 12) * 40}ms`, opacity: 0 }}>
                <RecipeCard recipe={r} />
              </div>
            ))}
          </div>
        )}

        {/* Infinite scroll sentinel */}
        <div ref={observerTarget} style={{ height: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {loading && <Loader2 style={{ width: 24, height: 24, color: "#3D5C3E", animation: "spin 1s linear infinite" }} />}
        </div>
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
