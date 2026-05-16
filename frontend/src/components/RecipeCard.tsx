"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";

export default function RecipeCard({ recipe }: { recipe: any }) {
  const { user } = useAuth();
  const locked = recipe.is_premium && !user?.is_premium;

  return (
    <Link
      href={locked ? "/app/profile" : `/app/recipe/${recipe.id}`}
      style={{ textDecoration: "none", display: "block" }}
    >
      <div style={{ background: "#FFFFFF", borderRadius: "1.25rem", border: "1px solid #E5DDD0", overflow: "hidden", boxShadow: "0 2px 12px rgba(61,92,62,0.06)", transition: "transform 0.2s, box-shadow 0.2s" }}
        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(61,92,62,0.12)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 12px rgba(61,92,62,0.06)"; }}
      >
        {/* Image */}
        <div style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden", background: "#F0EBE0" }}>
          <img
            src={recipe.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400"}
            alt={recipe.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", filter: locked ? "blur(8px) brightness(0.7)" : "none", transition: "transform 0.5s" }}
            loading="lazy"
            onMouseEnter={e => { (e.target as HTMLImageElement).style.transform = "scale(1.05)"; }}
            onMouseLeave={e => { (e.target as HTMLImageElement).style.transform = "scale(1)"; }}
            onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400"; }}
          />
          {/* Badges */}
          {recipe.is_premium && (
            <div style={{ position: "absolute", top: 8, right: 8, background: "rgba(250,247,240,0.9)", border: "1px solid #E0D8CC", borderRadius: 999, padding: "0.2rem 0.6rem", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#C4974A", backdropFilter: "blur(4px)" }}>
              ✦ Premium
            </div>
          )}
          {recipe.cook_time && (
            <div style={{ position: "absolute", bottom: 8, left: 8, background: "rgba(255,255,255,0.9)", borderRadius: 999, padding: "0.2rem 0.6rem", fontSize: "0.65rem", fontWeight: 500, color: "#4A5E4A", display: "flex", alignItems: "center", gap: "0.25rem", backdropFilter: "blur(4px)" }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#3D5C3E" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {recipe.cook_time} min
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: "0.75rem 0.9rem" }}>
          {(recipe.category || recipe.country) && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "0.3rem" }}>
              {recipe.category && <span style={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#3D5C3E" }}>{recipe.category}</span>}
              {recipe.country && <><span style={{ width: 3, height: 3, borderRadius: "50%", background: "#E0D8CC", flexShrink: 0, display: "inline-block" }} /><span style={{ fontSize: "0.6rem", color: "#A8B8A8" }}>{recipe.country}</span></>}
            </div>
          )}
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.92rem", color: "#1F2E1F", margin: "0 0 0.5rem", lineHeight: 1.3, fontWeight: 400 }}>{recipe.title}</h3>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              {recipe.nutrition?.calories && (
                <span style={{ fontSize: "0.65rem", color: "#8D9E8D", display: "flex", alignItems: "center", gap: "0.2rem" }}>
                  <span style={{ color: "#C4974A" }}>🔥</span> {recipe.nutrition.calories} kcal
                </span>
              )}
            </div>
            <div style={{ width: 26, height: 26, borderRadius: "50%", border: "1px solid #E5DDD0", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8D9E8D" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>
          {/* Condition tags */}
          {recipe.conditions?.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginTop: "0.5rem" }}>
              {recipe.conditions.slice(0, 2).map((c: string) => (
                <span key={c} style={{ padding: "0.15rem 0.5rem", borderRadius: 999, background: "rgba(61,92,62,0.08)", color: "#3D5C3E", fontSize: "0.58rem", fontWeight: 600, border: "1px solid rgba(61,92,62,0.12)" }}>{c}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
