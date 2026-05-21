"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";

const FALLBACK_CATEGORIES: Record<string, { items: { name: string; img: string }[]; extra: number }> = {
  Vegetables: {
    items: [
      { name: "Spinach", img: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=120" },
      { name: "Tomato", img: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=120" },
      { name: "Cucumber", img: "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=120" },
      { name: "Carrot", img: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=120" },
    ],
    extra: 3,
  },
  "Grains & Pulses": {
    items: [
      { name: "Brown Rice", img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=120" },
      { name: "Moong Dal", img: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=120" },
      { name: "Quinoa", img: "https://images.unsplash.com/photo-1622348512579-73da9531493a?w=120" },
      { name: "Oats", img: "https://images.unsplash.com/photo-1517093728264-0d3f54a86c73?w=120" },
    ],
    extra: 2,
  },
  Fruits: {
    items: [
      { name: "Banana", img: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=120" },
      { name: "Apple", img: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=120" },
      { name: "Blueberries", img: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=120" },
      { name: "Papaya", img: "https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?w=120" },
    ],
    extra: 1,
  },
  "Spices & Others": {
    items: [
      { name: "Turmeric", img: "https://images.unsplash.com/photo-1615485291234-9d694218abbe?w=120" },
      { name: "Cumin", img: "https://images.unsplash.com/photo-1599909533731-4aec3958da09?w=120" },
      { name: "Flax Seeds", img: "https://images.unsplash.com/photo-1598432489028-0f8e2cf52df7?w=120" },
      { name: "Himalayan Salt", img: "https://images.unsplash.com/photo-1542736143-29a8432162bc?w=120" },
    ],
    extra: 5,
  },
};

export default function GroceryList() {
  const [categories, setCategories] = useState<typeof FALLBACK_CATEGORIES>(FALLBACK_CATEGORIES);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/meal-plan/grocery-list")
      .then(({ data }) => {
        if (data && Object.keys(data).length > 0) {
          const mapped: typeof FALLBACK_CATEGORIES = {};
          Object.entries(data).forEach(([cat, items]) => {
            const arr = items as string[];
            mapped[cat] = {
              items: arr.slice(0, 4).map(name => ({
                name: name.split("(")[0].trim(),
                img: `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120`,
              })),
              extra: Math.max(0, arr.length - 4),
            };
          });
          if (Object.keys(mapped).length > 0) setCategories(mapped);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredCategories = Object.entries(categories).filter(([cat, data]) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return cat.toLowerCase().includes(q) || data.items.some(i => i.name.toLowerCase().includes(q));
  });

  const toggle = (cat: string) => setCollapsed(prev => ({ ...prev, [cat]: !prev[cat] }));

  return (
    <div style={{
      minHeight: "100vh", background: "#F5EFE2",
      fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
    }}>
      {/* Header */}
      <div style={{ position: "relative", padding: "18px 20px 0", overflow: "hidden" }}>
        {/* Leaf decoration top-right */}
        <div style={{
          position: "absolute", top: 0, right: -10, width: 130, height: 160,
          pointerEvents: "none", opacity: 0.55,
          background: "radial-gradient(ellipse at 30% 50%, rgba(160,180,140,0.45), transparent 65%)",
        }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 2 }}>
          <button
            onClick={() => window.history.back()}
            style={{ background: "transparent", border: "none", cursor: "pointer", padding: 4 }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2D4530" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
          <button style={{ background: "transparent", border: "none", cursor: "pointer", padding: 4 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2D4530" strokeWidth="1.8" strokeLinecap="round">
              <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
              <circle cx="3" cy="6" r="1" fill="#2D4530" /><circle cx="3" cy="12" r="1" fill="#2D4530" /><circle cx="3" cy="18" r="1" fill="#2D4530" />
            </svg>
          </button>
        </div>
        <div style={{ position: "relative", zIndex: 2, marginTop: 12 }}>
          <h1 style={{
            fontFamily: "var(--font-playfair), 'Playfair Display', serif",
            fontSize: 30, fontWeight: 500, color: "#2D4530", margin: 0,
          }}>Grocery List</h1>
          <button style={{
            background: "transparent", border: "none", cursor: "pointer", padding: 0,
            fontSize: 13, color: "#7B8A7B", fontFamily: "inherit", marginTop: 2,
            display: "inline-flex", alignItems: "center", gap: 4,
          }}>
            This Week
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9" /></svg>
          </button>
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: "14px 20px 0" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          background: "#FFFFFF", border: "1px solid #EAE3D2", borderRadius: 14,
          padding: "10px 14px", boxShadow: "0 1px 4px rgba(31,46,31,0.04)",
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9DA89D" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search for items..."
            style={{
              flex: 1, border: "none", outline: "none", background: "transparent",
              fontSize: 14, color: "#2D4530", fontFamily: "inherit",
            }}
          />
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9DA89D" strokeWidth="1.8" strokeLinecap="round">
            <line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="14" y2="12" /><line x1="4" y1="18" x2="20" y2="18" />
            <path d="M17 9l3 3-3 3" />
          </svg>
        </div>
      </div>

      {/* Categories */}
      <div style={{ padding: "14px 20px 0", display: "flex", flexDirection: "column", gap: 14 }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "30px 0", color: "#A8B8A8", fontSize: 14 }}>
            Loading your grocery list…
          </div>
        ) : filteredCategories.map(([cat, data]) => {
          const isCollapsed = collapsed[cat];
          return (
            <div key={cat} style={{
              background: "#FFFFFF", borderRadius: 18, overflow: "hidden",
              boxShadow: "0 1px 6px rgba(31,46,31,0.05)",
            }}>
              {/* Category header */}
              <button onClick={() => toggle(cat)} style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "14px 16px", background: "transparent", border: "none", cursor: "pointer",
                fontFamily: "inherit",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{
                    fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                    fontSize: 16, fontWeight: 500, color: "#2D4530",
                  }}>{cat}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 12, color: "#9DA89D" }}>{data.items.length + data.extra} items</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9DA89D" strokeWidth="2" strokeLinecap="round"
                    style={{ transform: isCollapsed ? "rotate(-90deg)" : "none", transition: "transform 0.2s" }}>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </button>
              {/* Items grid */}
              {!isCollapsed && (
                <div style={{ padding: "0 16px 16px", display: "flex", gap: 12, alignItems: "flex-start" }}>
                  {data.items.map((item, i) => (
                    <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flex: "0 0 60px" }}>
                      <div style={{ width: 60, height: 60, borderRadius: 14, overflow: "hidden", background: "#F5F0E8" }}>
                        <img
                          src={item.img} alt={item.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          loading="lazy"
                          onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                      </div>
                      <span style={{ fontSize: 10.5, color: "#5C6B5C", textAlign: "center", lineHeight: 1.3 }}>{item.name}</span>
                    </div>
                  ))}
                  {data.extra > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flex: "0 0 60px" }}>
                      <div style={{
                        width: 60, height: 60, borderRadius: 14, background: "#F0EDE0",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <span style={{ fontSize: 13, color: "#7B8A7B", fontWeight: 500 }}>+{data.extra}</span>
                      </div>
                      <span style={{ fontSize: 10.5, color: "#9DA89D", textAlign: "center" }}>more</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom banner */}
      <div style={{ padding: "16px 20px 0" }}>
        <div style={{
          background: "#FFFFFF", borderRadius: 18, overflow: "hidden",
          boxShadow: "0 1px 6px rgba(31,46,31,0.05)", display: "flex",
        }}>
          <div style={{ padding: "16px", flex: 1 }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%", background: "#F0EDE0",
              display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10,
            }}>
              <svg width="16" height="16" viewBox="0 0 24 18" fill="none">
                <path d="M12 16 Q4 12 6 4 Q12 8 12 16 Z" fill="#3D5C3E" opacity="0.85" />
                <path d="M12 16 Q20 12 18 4 Q12 8 12 16 Z" fill="#3D5C3E" opacity="0.85" />
              </svg>
            </div>
            <p style={{
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              fontSize: 15, color: "#2D4530", margin: "0 0 4px",
            }}>Eat fresh, live well</p>
            <p style={{ fontSize: 12, color: "#7B8A7B", lineHeight: 1.5, margin: 0 }}>
              Choose whole, natural foods for a nourished body and mind.
            </p>
          </div>
          <div
            data-image-slot="grocery-banner-right"
            style={{
              width: 100,
              background: "linear-gradient(135deg, rgba(170,185,150,0.4), rgba(200,210,180,0.3))",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <div style={{ fontSize: 32 }}>🥗</div>
          </div>
        </div>
      </div>

      {/* Add Item CTA */}
      <div style={{ padding: "16px 20px 28px" }}>
        <button style={{
          width: "100%", background: "#3D5C3E", color: "#fff", border: "none",
          borderRadius: 999, padding: "16px 24px", fontSize: 16, fontWeight: 500,
          fontFamily: "inherit", cursor: "pointer", boxShadow: "0 8px 24px rgba(61,92,62,0.28)",
        }}>
          Add Item
        </button>
      </div>
    </div>
  );
}
