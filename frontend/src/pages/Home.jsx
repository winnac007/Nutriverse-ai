import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "../lib/auth";
import RecipeCard from "../components/RecipeCard";
import Logo from "../components/Logo";
import { ArrowRight, ArrowUpRight, Bell, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { CHAPTERS } from "../lib/brand";

function Greeting({ name }) {
  const hour = new Date().getHours();
  const word = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  return (
    <div>
      <h1 className="font-display text-3xl sm:text-4xl font-semibold leading-tight" style={{ color: "#2e2a26" }}>
        {word},<br />{name?.split(" ")[0] || "there"}.
      </h1>
      <p className="text-sm mt-2" style={{ color: "#6b6258" }}>Today is a new beginning.</p>
    </div>
  );
}

function ChapterCard({ chapter, i }) {
  const Icon = chapter.icon;
  const dark = chapter.dark;
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
      <Link
        to={chapter.to}
        data-testid={`home-chapter-${chapter.id}`}
        className={`block relative overflow-hidden rounded-3xl ${chapter.accentClass} nv-shadow group`}
        style={{ minHeight: "200px" }}
      >
        {/* Leaf watermark */}
        <svg viewBox="0 0 200 200" className="absolute top-3 right-24 w-32 h-32 opacity-30 pointer-events-none">
          <path d="M30 80 C50 50 90 40 130 60" stroke={chapter.iconColor} strokeWidth="1" fill="none" />
          {Array.from({ length: 10 }).map((_, k) => (
            <ellipse key={k} cx={36 + k * 9} cy={76 + Math.sin(k) * 10} rx="5" ry="2.5"
              fill={chapter.iconColor} opacity="0.55"
              transform={`rotate(${k * 10} ${36 + k * 9} ${76 + Math.sin(k) * 10})`} />
          ))}
        </svg>

        <div className="relative grid grid-cols-[1fr_auto] gap-3 p-5 sm:p-6">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="font-display text-2xl font-semibold" style={{ color: dark ? "#d9c189" : "#8a6e3a" }}>{chapter.number}</span>
              <span className="font-overline" style={{ color: dark ? "#d9c189" : undefined }}>{chapter.overline}</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold leading-tight" style={{ color: dark ? "#f4f1e8" : "#2e2a26" }}>
              {chapter.title}
            </h2>
            <div className="w-10 h-px" style={{ background: dark ? "#d9c189" : "#5e6b55", opacity: 0.6 }} />
            <p className="text-sm leading-relaxed max-w-[18ch]" style={{ color: dark ? "#d4cab8" : "#5b554d" }}>
              {chapter.desc}
            </p>
          </div>
          {/* Image */}
          <div className="relative w-28 sm:w-44 rounded-2xl overflow-hidden" style={{ alignSelf: "center" }}>
            <img src={chapter.image} alt={chapter.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
        </div>

        {/* Bottom row: icon chip + arrow */}
        <div className="relative flex items-center justify-between px-5 sm:px-6 pb-5">
          <div className="size-10 rounded-full grid place-items-center" style={{ background: dark ? "rgba(244,241,232,0.08)" : "rgba(255,255,255,0.85)" }}>
            <Icon className="size-4" style={{ color: chapter.iconColor }} />
          </div>
          <div className="size-9 rounded-full grid place-items-center" style={{ background: dark ? "rgba(217,193,137,0.18)" : "rgba(255,255,255,0.9)", border: dark ? "1px solid rgba(217,193,137,0.4)" : "1px solid rgba(94,107,85,0.18)" }}>
            <ArrowUpRight className="size-4" style={{ color: dark ? "#d9c189" : "#5e6b55" }} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Home() {
  const { user } = useAuth();
  const [trending, setTrending] = useState([]);
  const [today, setToday] = useState({ totals: { calories: 0, protein: 0, carbs: 0, fat: 0 } });

  useEffect(() => {
    api.get("/recipes", { params: { category: user?.category } })
      .then((r) => setTrending(r.data.slice(0, 4)));
    api.get("/nutrition/today").then((r) => setToday(r.data)).catch(() => {});
  }, [user?.category]);

  return (
    <div className="space-y-10">
      <header className="flex items-start justify-between">
        <div>
          <Logo size="sm" className="mb-3" />
          <Greeting name={user?.name} />
        </div>
        <div className="flex items-center gap-2">
          {user?.is_premium ? (
            <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider" style={{ background: "#b59b5a", color: "#2e2a26" }}>Premium</span>
          ) : (
            <Link data-testid="home-upgrade-pill" to="/app/profile" className="text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider border" style={{ borderColor: "#b59b5a", color: "#8a6e3a" }}>Upgrade</Link>
          )}
          <button className="size-9 rounded-full border grid place-items-center" style={{ borderColor: "#ddd6c4" }}>
            <Bell className="size-4" style={{ color: "#2e2a26" }} />
          </button>
        </div>
      </header>

      {/* Today snapshot */}
      <section data-testid="home-today-snapshot" className="rounded-3xl p-5 zp-card-soft nv-shadow">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-lg" style={{ color: "#2e2a26" }}>Today's focus</h2>
          <Link to="/app/track" className="text-xs inline-flex items-center gap-1" style={{ color: "#5e6b55" }}>See all <ArrowRight className="size-3" /></Link>
        </div>
        <p className="text-sm mb-4 italic" style={{ color: "#6b6258" }}>Nourish your body. Calm your mind.</p>
        <div className="grid grid-cols-4 gap-3 text-center">
          {["calories", "protein", "carbs", "fat"].map((k) => (
            <div key={k}>
              <div className="font-display text-2xl font-semibold" style={{ color: "#2e2a26" }}>{today.totals[k] || 0}</div>
              <div className="font-overline" style={{ color: "#8a6e3a" }}>{k === "calories" ? "kcal" : `${k} g`}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Three chapters + Chef Specials */}
      <section className="space-y-5">
        {CHAPTERS.map((c, i) => <ChapterCard key={c.id} chapter={c} i={i} />)}
      </section>

      {/* AI Coach CTA for premium hint */}
      <section className="rounded-3xl p-5 sm:p-6 relative overflow-hidden zp-card-soft nv-shadow">
        <div className="flex items-center gap-4">
          <div className="size-11 rounded-full grid place-items-center" style={{ background: "rgba(94,107,85,0.18)" }}>
            <Sparkles className="size-5" style={{ color: "#5e6b55" }} />
          </div>
          <div className="flex-1">
            <h3 className="font-display text-lg" style={{ color: "#2e2a26" }}>Your AI nutrition guide</h3>
            <p className="text-sm" style={{ color: "#6b6258" }}>A 7-day plan, grocery list, and adaptive coach — tuned to you.</p>
          </div>
          <Link data-testid="home-ai-plan-link" to="/app/meal-plan" className="text-sm font-medium" style={{ color: "#5e6b55" }}>Open →</Link>
        </div>
      </section>

      {/* Featured */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl" style={{ color: "#2e2a26" }}>Featured for you</h2>
          <Link to="/app/explore" className="text-xs" style={{ color: "#5e6b55" }}>View all</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {trending.map((r) => <RecipeCard key={r.id} recipe={r} />)}
        </div>
      </section>

      {/* Values strip */}
      <section className="rounded-3xl p-6 zp-card-soft">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 text-center">
          {[
            { t: "Curated", d: "with purpose" },
            { t: "Backed", d: "by science" },
            { t: "Global", d: "cuisines" },
            { t: "Personal", d: "to you" },
          ].map((x) => (
            <div key={x.t}>
              <div className="font-display text-base" style={{ color: "#2e2a26" }}>{x.t}</div>
              <div className="text-xs" style={{ color: "#6b6258" }}>{x.d}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
