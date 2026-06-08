"use client";

import { useState, useEffect } from "react";
import { Bookmark, Clock, Flame, ArrowRight, Star, Loader2 } from "lucide-react";
import api from "@/lib/api";

const japan = "/landing/dish-japan.jpg";
const india = "/landing/dish-india.jpg";
const morocco = "/landing/dish-morocco.jpg";
const greece = "/landing/dish-greece.jpg";
const healthcareImg = "/landing/journey-healthcare.jpg";
const fitnessImg = "/landing/journey-fitness.jpg";

const STATIC_RECIPES = [
  { tag: "PCOS Friendly", title: "Spiced Chickpea & Spinach Bowl", min: 20, kcal: 410, image: healthcareImg },
  { tag: "Gut Health", title: "Miso Soup with Tofu & Seaweed", min: 15, kcal: 180, image: japan },
  { tag: "Hormonal Balance", title: "Quinoa & Roasted Veggie Bowl", min: 25, kcal: 320, image: fitnessImg },
  { tag: "Thyroid Friendly", title: "Millet Idli with Coconut Chutney", min: 18, kcal: 210, image: india },
  { tag: "Heart Healthy", title: "Mediterranean Mezze Plate", min: 15, kcal: 380, image: greece },
  { tag: "Anti-inflammatory", title: "Saffron Vegetable Tagine", min: 40, kcal: 340, image: morocco },
];

export function Recipes() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const res = await api.get("/recipes");
        if (res.data && res.data.length > 0) {
          // Map to match the UI expectation
          const mapped = res.data.map((r: any) => {
            let img = r.image;
            if (!img || img.includes("source.unsplash.com")) {
              // Generate a real image dynamically matching the actual recipe title
              img = `https://image.pollinations.ai/prompt/${encodeURIComponent(r.title + " food photography, professional, highly detailed")}?width=400&height=500&nologo=true`;
            }
            return {
              id: r.id,
              tag: r.diets?.[0] || (r.tags && r.tags[0]) || "Featured",
              title: r.title,
              min: r.cook_time || 20,
              kcal: r.nutrition?.calories || 350,
              image: img
            };
          });
          setRecipes(mapped);
        } else {
          setRecipes(STATIC_RECIPES);
        }
      } catch (err) {
        console.error("Failed to fetch recipes:", err);
        setRecipes(STATIC_RECIPES);
      } finally {
        setLoading(false);
      }
    }
    fetchRecipes();
  }, []);

  // Duplicate recipes for seamless looping
  const loopedRecipes = recipes.length > 0 ? [...recipes, ...recipes] : [];

  return (
    <section id="recipes" className="relative bg-espresso py-24 text-ivory md:py-40">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-serif text-2xl italic text-gold">IV</span>
              <span className="h-px w-8 bg-gold/40" />
              <span className="eyebrow !text-gold">Featured for you</span>
            </div>
            <h2 className="mt-6 max-w-2xl font-serif text-[40px] leading-[1.05] md:text-[60px]">
              A library that <span className="italic text-gold">knows</span><br />what your body needs.
            </h2>
          </div>
          <a href="#" className="group inline-flex items-center gap-2 self-start rounded-full border border-ivory/25 px-6 py-3 text-[13px] tracking-wide text-ivory transition hover:bg-ivory/10 md:self-end">
            View all recipes <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>

      {/* Marquee Container */}
      <div className="relative marquee-pause overflow-hidden min-h-[400px] flex items-center">
        {loading ? (
          <div className="w-full flex flex-col items-center justify-center gap-4 text-gold/60">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="text-[10px] tracking-[0.2em] uppercase">Opening the library...</span>
          </div>
        ) : (
          <div className="marquee-track marquee-left py-4" style={{ animationDuration: "60s" }}>
            {loopedRecipes.map((r, i) => (
              <article key={i} className="group relative w-[280px] mx-2.5 flex-shrink-0 overflow-hidden rounded-[24px] border border-ivory/8 bg-espresso md:w-[320px] md:mx-3 transition-transform duration-500 hover:scale-[1.02]">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img src={r.image} alt={r.title} className="h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-105" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/30 to-transparent" />
                  <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-ivory/25 bg-espresso/40 px-3 py-1.5 text-[10px] tracking-[0.18em] uppercase text-ivory backdrop-blur">
                    <Star className="h-2.5 w-2.5 text-gold" /> {r.tag}
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-serif text-[22px] leading-tight text-ivory line-clamp-2">{r.title}</h3>
                  <div className="mt-3 flex items-center justify-between text-[12px] text-ivory/70">
                    <div className="flex gap-4">
                      <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {r.min} min</span>
                      <span className="inline-flex items-center gap-1"><Flame className="h-3 w-3" /> {r.kcal} kcal</span>
                    </div>
                    <button className="flex h-8 w-8 items-center justify-center rounded-full border border-ivory/25 text-ivory/80 transition hover:bg-ivory/10">
                      <Bookmark className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mt-12 flex items-center justify-center gap-4">
          <svg className="h-4 w-4 text-gold" viewBox="0 0 20 20"><path d="M10 18 V10 M10 12 C 6 11 4 8 5 4 C 9 5 11 8 10 12 M10 13 C 14 12 16 8 15 4 C 11 5 9 8 10 13" fill="currentColor" /></svg>
          <p className="font-serif text-[18px] text-ivory/70 md:text-[22px]">
            <span className="text-gold">{loading ? "..." : "240+"}</span> recipes across all three journeys
          </p>
          <svg className="h-4 w-4 text-gold scale-x-[-1]" viewBox="0 0 20 20"><path d="M10 18 V10 M10 12 C 6 11 4 8 5 4 C 9 5 11 8 10 12 M10 13 C 14 12 16 8 15 4 C 11 5 9 8 10 13" fill="currentColor" /></svg>
        </div>
      </div>
    </section>
  );
}
