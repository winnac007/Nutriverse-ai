"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";

const FALLBACK_GROCERIES = [
  {
    category: "Vegetables",
    emoji: "🥬",
    items: [
      { name: "Spinach", img: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=120" },
      { name: "Tomato", img: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=120" },
      { name: "Cucumber", img: "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=120" },
      { name: "Carrot", img: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=120" },
    ],
    extra: 3,
  },
  {
    category: "Grains & Pulses",
    emoji: "🌾",
    items: [
      { name: "Brown Rice", img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=120" },
      { name: "Moong Dal", img: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=120" },
      { name: "Quinoa", img: "https://images.unsplash.com/photo-1622348512579-73da9531493a?w=120" },
      { name: "Oats", img: "https://images.unsplash.com/photo-1517093728264-0d3f54a86c73?w=120" },
    ],
    extra: 2,
  },
  {
    category: "Fruits",
    emoji: "🍎",
    items: [
      { name: "Banana", img: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=120" },
      { name: "Apple", img: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=120" },
      { name: "Blueberry", img: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=120" },
      { name: "Papaya", img: "https://images.unsplash.com/photo-1526318472351-c75fcf070305?w=120" },
    ],
    extra: 1,
  },
  {
    category: "Spices & Others",
    emoji: "🌿",
    items: [
      { name: "Turmeric", img: "https://images.unsplash.com/photo-1615486171448-4e12e105e608?w=120" },
      { name: "Cumin", img: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=120" },
      { name: "Flax Seeds", img: "https://images.unsplash.com/photo-1508061461528-98e3b123683a?w=120" },
      { name: "Himalayan Salt", img: "https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=120" },
    ],
    extra: 5,
  },
];

export default function GroceryList() {
  const [groceries, setGroceries] = useState(FALLBACK_GROCERIES);
  const [loading, setLoading] = useState(true);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/meal-plan/grocery-list")
      .then((r) => { if (r.data?.length) setGroceries(r.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggle = (key: string) => setChecked(prev => {
    const n = new Set(prev);
    if (n.has(key)) { n.delete(key); } else { n.add(key); }
    return n;
  });

  const clearChecked = () => setChecked(new Set());

  return (
    <div style={{ minHeight: "100vh", background: "#FAF7F0", paddingBottom: "6rem" }}>
      {/* Header */}
      <div style={{ position: "relative", background: "linear-gradient(180deg, #F0EBE0 0%, #FAF7F0 100%)", padding: "2.5rem 1.25rem 1.25rem", overflow: "hidden" }}>
        <svg style={{ position: "absolute", top: -10, right: -10, width: 130, height: 130, opacity: 0.28 }} viewBox="0 0 130 130" fill="none">
          <ellipse cx="90" cy="30" rx="28" ry="48" fill="#3D5C3E" transform="rotate(-30 90 30)"/>
          <ellipse cx="112" cy="68" rx="20" ry="36" fill="#3D5C3E" opacity="0.6" transform="rotate(12 112 68)"/>
        </svg>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
          <Link href="/app/meal-plan" style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.7)", border: "1px solid #E5DDD0", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3D5C3E" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          </Link>
          <button style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.7)", border: "1px solid #E5DDD0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3D5C3E" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
          </button>
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.75rem", fontWeight: 400, color: "#1F2E1F", margin: "0 0 0.2rem" }}>Grocery List</h1>
        <p style={{ fontSize: "0.8rem", color: "#8D9E8D", margin: 0 }}>This Week ↓</p>
      </div>

      <div style={{ padding: "1rem 1.25rem 0" }}>
        {/* Search bar */}
        <div style={{ position: "relative", marginBottom: "1.25rem" }}>
          <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A8B8A8" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search for items..."
            style={{ width: "100%", padding: "0.75rem 0.75rem 0.75rem 2.5rem", border: "1.5px solid #E0D8CC", borderRadius: "0.85rem", fontSize: "0.88rem", fontFamily: "'DM Sans'", color: "#1F2E1F", background: "#FFFFFF", outline: "none", boxSizing: "border-box" }}
          />
        </div>

        {/* Checked items bar */}
        {checked.size > 0 && (
          <div style={{ background: "rgba(61,92,62,0.08)", borderRadius: "0.75rem", padding: "0.6rem 1rem", marginBottom: "1rem", display: "flex", alignItems: "center", justifyContent: "space-between", border: "1px solid rgba(61,92,62,0.15)" }}>
            <span style={{ fontSize: "0.8rem", color: "#3D5C3E", fontWeight: 500 }}>{checked.size} item{checked.size > 1 ? "s" : ""} checked</span>
            <button onClick={clearChecked} style={{ fontSize: "0.75rem", color: "#8D9E8D", background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans'" }}>Clear checked</button>
          </div>
        )}

        {/* Categories */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {loading ? (
            [1, 2, 3].map(i => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                  <div style={{ height: 14, width: 80, background: "#E8E0D4", borderRadius: 4 }} />
                  <div style={{ height: 14, width: 40, background: "#E8E0D4", borderRadius: 4 }} />
                </div>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  {[1,2,3,4].map(j => <div key={j} style={{ width: 72, height: 72, borderRadius: "50%", background: "#E8E0D4" }} />)}
                </div>
              </div>
            ))
          ) : (
            groceries.map((section) => {
              const filtered = section.items.filter(item =>
                !search || item.name.toLowerCase().includes(search.toLowerCase())
              );
              if (search && !filtered.length) return null;
              return (
                <div key={section.category}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", color: "#1F2E1F", margin: 0, fontWeight: 500 }}>
                      {section.emoji} {section.category}
                    </h3>
                    <span style={{ fontSize: "0.72rem", color: "#A8B8A8" }}>{section.items.length + section.extra} items</span>
                  </div>
                  <div style={{ display: "flex", gap: "0.75rem", overflowX: "auto", paddingBottom: "0.5rem" }}>
                    {filtered.map((item) => {
                      const key = `${section.category}-${item.name}`;
                      const isChecked = checked.has(key);
                      return (
                        <button key={item.name} onClick={() => toggle(key)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem", cursor: "pointer", background: "none", border: "none", flexShrink: 0, width: 72 }}>
                          <div style={{ width: 72, height: 72, borderRadius: "50%", overflow: "hidden", border: isChecked ? "2.5px solid #3D5C3E" : "1.5px solid #E5DDD0", background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", opacity: isChecked ? 0.6 : 1, transition: "all 0.2s" }}>
                            <img src={item.img} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "multiply" }} loading="lazy" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                            {isChecked && (
                              <div style={{ position: "absolute", inset: 0, background: "rgba(61,92,62,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3D5C3E" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                              </div>
                            )}
                          </div>
                          <span style={{ fontFamily: "'DM Sans'", fontSize: "0.62rem", color: isChecked ? "#A8B8A8" : "#4A5E4A", textAlign: "center", lineHeight: 1.3, textDecoration: isChecked ? "line-through" : "none" }}>{item.name}</span>
                        </button>
                      );
                    })}
                    {section.extra > 0 && !search && (
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem", flexShrink: 0, width: 72 }}>
                        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#F5F0E8", border: "1.5px dashed #E5DDD0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ fontFamily: "'Playfair Display', serif", color: "#A8B8A8", fontSize: "1rem" }}>+{section.extra}</span>
                        </div>
                        <span style={{ fontSize: "0.62rem", color: "#A8B8A8" }}>more</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Eat fresh banner */}
        <div style={{ background: "linear-gradient(135deg, #F5F0E8 0%, #EDE5D8 100%)", borderRadius: "1.25rem", border: "1px solid #E5DDD0", padding: "1.1rem 1.25rem", marginTop: "1.5rem", display: "flex", alignItems: "center", gap: "0.9rem", position: "relative", overflow: "hidden" }}>
          <svg style={{ position: "absolute", right: -8, bottom: -8, opacity: 0.1 }} width="70" height="70" viewBox="0 0 24 24" fill="#3D5C3E"><path d="M17 8C8 10 5.9 16.17 3.82 22c3.5-5 9-7 13.18-7 0-3.17-1.5-6.17-4-8z"/></svg>
          <span style={{ fontSize: "1.5rem" }}>🌿</span>
          <div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.9rem", color: "#1F2E1F", margin: "0 0 0.15rem" }}>Eat fresh, live well</p>
            <p style={{ fontSize: "0.72rem", color: "#8D9E8D", margin: 0 }}>Choose whole, natural foods for a nourished body and mind.</p>
          </div>
        </div>

        {/* Add item button */}
        <button style={{ width: "100%", background: "#3D5C3E", color: "#FFFFFF", border: "none", borderRadius: 999, padding: "1rem", fontSize: "0.95rem", fontWeight: 600, fontFamily: "'DM Sans'", cursor: "pointer", marginTop: "1.25rem", boxShadow: "0 4px 20px rgba(61,92,62,0.25)", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Item
        </button>
      </div>
    </div>
  );
}
