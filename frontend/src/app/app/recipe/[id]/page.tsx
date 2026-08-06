"use client";

import { useEffect, useRef, useState, use } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

const FALLBACK_IMG = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600";

export default function RecipeDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user, refresh } = useAuth();
  const [recipe, setRecipe] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"Ingredients" | "Nutrition" | "Steps">("Ingredients");
  const [cookingStage, setCookingStage] = useState<"idle" | "cooking" | "complete">("idle");
  const [completing, setCompleting] = useState(false);
  const tabContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.get(`/recipes/${id}`).then(r => setRecipe(r.data)).catch(() => {});
  }, [id]);

  const saved = user?.saved_recipes?.includes(id);

  const toggleSave = async () => {
    try {
      await api.post(`/user/save-recipe/${id}`);
      await refresh();
      toast.success(saved ? "Removed from saved" : "Saved to favorites");
    } catch {
      toast.error("Failed to save");
    }
  };

  const handleCookingAction = async () => {
    if (cookingStage === "complete") {
      router.push("/app/passport");
      return;
    }

    if (cookingStage === "idle") {
      setActiveTab("Steps");
      setCookingStage("cooking");
      window.setTimeout(() => {
        tabContentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 60);
      return;
    }

    setCompleting(true);
    try {
      const { data } = await api.post(`/passport/complete/${id}`);
      const completion = data?.completion;
      setCookingStage("complete");

      if (completion?.stamp_awarded) {
        toast.success(`${completion.destination.name} stamp earned!`);
      } else if (completion?.created) {
        toast.success(
          `Added to your Passport · ${completion.destination.dishes_cooked}/${completion.destination.stamp_goal} dishes`,
        );
      } else {
        toast.success("This dish is already in your Passport");
      }
    } catch {
      toast.error("Could not update your Passport");
    } finally {
      setCompleting(false);
    }
  };

  if (!recipe) return (
    <div style={{
      minHeight: "100vh", background: "#F5EFE2",
      display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 14,
    }}>
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <path d="M20 8 Q20 20 20 14" stroke="#3D5C3E" strokeWidth="2" strokeLinecap="round">
          <animateTransform attributeName="transform" type="rotate" from="0 20 20" to="360 20 20" dur="1.2s" repeatCount="indefinite" />
        </path>
        <path d="M20 16 Q14 13 12 7 Q18 10 20 15 Z" fill="#3D5C3E" fillOpacity="0.6" />
        <path d="M20 16 Q26 13 28 7 Q22 10 20 15 Z" fill="#3D5C3E" />
      </svg>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#8D9E8D" }}>Preparing recipe…</p>
    </div>
  );

  const nutrition = recipe.nutrition || {};
  const tags = [
    recipe.nutrition?.fiber > 5 && "High fiber",
    recipe.nutrition?.protein > 15 && "Protein rich",
    recipe.tags?.includes("anti-inflammatory") && "Anti-inflammatory",
    recipe.dietary_type && recipe.dietary_type,
  ].filter(Boolean) as string[];

  return (
    <div style={{
      minHeight: "100vh", background: "#F5EFE2",
      fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
    }}>
      {/* Hero image */}
      <div style={{ position: "relative", height: 300, background: "#E8E3D8", overflow: "hidden" }}>
        <img
          src={recipe.image || FALLBACK_IMG}
          alt={recipe.title}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          loading="eager"
          onError={e => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }}
        />
        {/* Gradient overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)",
        }} />
        {/* Top bar */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 18px",
        }}>
          <button
            onClick={() => window.history.back()}
            style={{
              width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.9)",
              border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2D4530" strokeWidth="2.2" strokeLinecap="round">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={toggleSave} style={{
              width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.9)",
              border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill={saved ? "#C25E4B" : "none"} stroke={saved ? "#C25E4B" : "#2D4530"} strokeWidth="2" strokeLinecap="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
            <button style={{
              width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.9)",
              border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2D4530" strokeWidth="2" strokeLinecap="round">
                <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
              </svg>
            </button>
          </div>
        </div>
        {/* Dots indicator */}
        <div style={{ position: "absolute", bottom: 14, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 5 }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{ width: i === 1 ? 8 : 6, height: i === 1 ? 8 : 6, borderRadius: "50%", background: i === 1 ? "#fff" : "rgba(255,255,255,0.5)" }} />
          ))}
        </div>
      </div>

      {/* Content card */}
      <div style={{
        background: "#F5EFE2", borderTopLeftRadius: 0, padding: "20px 20px 0",
      }}>
        {/* Title + tags */}
        <h1 style={{
          fontFamily: "var(--font-playfair), 'Playfair Display', serif",
          fontSize: 26, fontWeight: 500, color: "#2D4530", margin: "0 0 6px",
          display: "inline-flex", alignItems: "center", gap: 8, flexWrap: "wrap",
        }}>
          {recipe.title}
          <svg width="18" height="14" viewBox="0 0 24 18" fill="none">
            <path d="M12 16 Q4 12 6 4 Q12 8 12 16 Z" fill="#C4974A" opacity="0.85" />
            <path d="M12 16 Q20 12 18 4 Q12 8 12 16 Z" fill="#C4974A" opacity="0.85" />
          </svg>
        </h1>
        {tags.length > 0 && (
          <p style={{ fontSize: 13, color: "#7B8A7B", margin: "0 0 14px" }}>
            {tags.slice(0, 3).join(" • ")}
          </p>
        )}

        {/* Stats row */}
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid #EAE3D2" }}>
          {[
            {
              icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9DA89D" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>,
              label: recipe.cook_time ? `${recipe.cook_time} min` : "—",
            },
            {
              icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9DA89D" strokeWidth="2" strokeLinecap="round"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>,
              label: recipe.cooking_ability || "Easy",
            },
            {
              icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9DA89D" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>,
              label: `Serves ${recipe.servings || 1}`,
            },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              {s.icon}
              <span style={{ fontSize: 13, color: "#7B8A7B" }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Why you'll love it */}
        {recipe.description && (
          <div style={{
            background: "#FFFFFF", borderRadius: 16, padding: "14px 16px",
            display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 16,
            boxShadow: "0 1px 6px rgba(31,46,31,0.04)",
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%", background: "#F0EDE0",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <svg width="16" height="16" viewBox="0 0 24 18" fill="none">
                <path d="M12 16 Q4 12 6 4 Q12 8 12 16 Z" fill="#3D5C3E" opacity="0.85" />
                <path d="M12 16 Q20 12 18 4 Q12 8 12 16 Z" fill="#3D5C3E" opacity="0.85" />
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#3D5C3E", margin: "0 0 4px", letterSpacing: "0.05em" }}>Why you&apos;ll love it</p>
              <p style={{ fontSize: 13, color: "#5C6B5C", margin: 0, lineHeight: 1.55 }}>
                {recipe.description.slice(0, 120)}{recipe.description.length > 120 ? "…" : ""}
              </p>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C8D4C8" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid #EAE3D2", marginBottom: 16 }}>
          {(["Ingredients", "Nutrition", "Steps"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              flex: 1, padding: "10px 0", background: "transparent", border: "none",
              fontSize: 14, fontWeight: activeTab === tab ? 600 : 400,
              color: activeTab === tab ? "#2D4530" : "#9DA89D",
              fontFamily: "inherit", cursor: "pointer",
              borderBottom: activeTab === tab ? "2px solid #3D5C3E" : "2px solid transparent",
              marginBottom: -1, transition: "all 0.2s",
            }}>
              {tab}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div ref={tabContentRef} style={{ position: "relative", scrollMarginTop: 16 }}>
          {activeTab === "Ingredients" && (
            <div style={{ paddingBottom: 20 }}>
              {(recipe.ingredients || []).map((ing: any, i: number) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "9px 0", borderBottom: i < recipe.ingredients.length - 1 ? "1px solid #EAE3D2" : "none",
                }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#3D5C3E", flexShrink: 0 }} />
                  <span style={{ fontSize: 13.5, color: "#2D4530", lineHeight: 1.4 }}>
                    {ing.amount ? `${ing.amount} ` : ""}{ing.unit ? `${ing.unit} ` : ""}{ing.name}
                  </span>
                </div>
              ))}
              {/* Botanical watermark */}
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8, opacity: 0.2, pointerEvents: "none" }}>
                <svg width="60" height="80" viewBox="0 0 60 80" fill="none">
                  <path d="M30 70 Q30 40 30 20" stroke="#3D5C3E" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M30 40 Q18 34 16 20 Q26 26 30 38 Z" fill="#3D5C3E" />
                  <path d="M30 40 Q42 34 44 20 Q34 26 30 38 Z" fill="#3D5C3E" />
                </svg>
              </div>
              {/* Add to grocery */}
              <div style={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
                <button style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "transparent", border: "none", cursor: "pointer",
                  fontSize: 13, color: "#3D5C3E", fontFamily: "inherit", fontWeight: 500,
                  padding: "8px 16px",
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
                  </svg>
                  Add to grocery list
                </button>
              </div>
            </div>
          )}

          {activeTab === "Nutrition" && (
            <div style={{ paddingBottom: 20 }}>
              {[
                { label: "Calories", val: nutrition.calories, unit: "kcal", color: "#C4974A" },
                { label: "Protein", val: nutrition.protein, unit: "g", color: "#4A7A5B" },
                { label: "Carbs", val: nutrition.carbs, unit: "g", color: "#7AACCF" },
                { label: "Fat", val: nutrition.fat, unit: "g", color: "#C25E4B" },
                { label: "Fiber", val: nutrition.fiber, unit: "g", color: "#3D5C3E" },
                { label: "Sodium", val: nutrition.sodium, unit: "mg", color: "#9DA89D" },
              ].map(n => (
                <div key={n.label} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "10px 0", borderBottom: "1px solid #EAE3D2",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: n.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 14, color: "#2D4530" }}>{n.label}</span>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 500, color: "#2D4530" }}>
                    {n.val != null ? `${Math.round(n.val)} ${n.unit}` : "—"}
                  </span>
                </div>
              ))}
              <p style={{ fontSize: 11, color: "#A8B8A8", marginTop: 12, textAlign: "center" }}>
                * Nutritional values are estimates per serving
              </p>
            </div>
          )}

          {activeTab === "Steps" && (
            <div style={{ paddingBottom: 20 }}>
              {(recipe.steps || []).map((step: string, i: number) => (
                <div key={i} style={{ display: "flex", gap: 14, marginBottom: 16 }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: "50%", background: "#3D5C3E",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                    fontSize: 13, color: "#fff", fontWeight: 500, marginTop: 1,
                  }}>
                    {i + 1}
                  </div>
                  <p style={{ fontSize: 13.5, color: "#2D4530", lineHeight: 1.6, margin: 0, flex: 1 }}>{step}</p>
                </div>
              ))}
              {(!recipe.steps || recipe.steps.length === 0) && (
                <p style={{ fontSize: 13, color: "#9DA89D", textAlign: "center", padding: "20px 0" }}>
                  Cooking steps not available for this recipe.
                </p>
              )}
              {cookingStage === "cooking" && (
                <div style={{
                  marginTop: 18, padding: "13px 15px", borderRadius: 14,
                  background: "#EDF1E7", border: "1px solid #D7E0CE",
                  display: "flex", alignItems: "center", gap: 10,
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3D5C3E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M7 3h11a2 2 0 012 2v16H7a3 3 0 01-3-3V6a3 3 0 013-3z" />
                    <path d="M7 3v18M11 12l2 2 4-5" />
                  </svg>
                  <p style={{ margin: 0, color: "#4D654E", fontSize: 12.5, lineHeight: 1.45 }}>
                    When your plate is ready, finish below to record this dish in your Food Passport.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Start Cooking CTA */}
      <div style={{ padding: "0 20px 32px" }}>
        <button onClick={handleCookingAction} disabled={completing} style={{
          width: "100%", background: cookingStage === "complete" ? "#7E7A35" : "#3D5C3E", color: "#fff", border: "none",
          borderRadius: 999, padding: "17px 24px", fontSize: 16, fontWeight: 500,
          fontFamily: "inherit", cursor: completing ? "wait" : "pointer", boxShadow: "0 8px 24px rgba(61,92,62,0.28)",
          display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10,
          opacity: completing ? 0.7 : 1,
        }}>
          {completing
            ? "Adding to Passport…"
            : cookingStage === "idle"
              ? "Start Cooking"
              : cookingStage === "cooking"
                ? "Finish & add to Passport"
                : "View Passport"}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
        </button>
      </div>
    </div>
  );
}
