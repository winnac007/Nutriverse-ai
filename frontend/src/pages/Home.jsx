import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "../lib/auth";
import RecipeCard from "../components/RecipeCard";
import Logo from "../components/Logo";
import { ArrowRight, ArrowUpRight, Menu, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { CHAPTERS } from "../lib/brand";

// Decorative watercolour-style leaf branch on the left of light cards
function LeafBranch({ tint = "#8a9576", opacity = 0.22 }) {
  return (
    <svg viewBox="0 0 220 320" className="absolute -left-2 top-6 w-32 h-48 pointer-events-none" aria-hidden>
      <g fill={tint} opacity={opacity}>
        <path d="M105 10 Q60 60 70 130 Q80 200 50 280" stroke={tint} strokeWidth="1.2" fill="none" />
        {Array.from({ length: 11 }).map((_, i) => {
          const t = i / 10;
          const cx = 105 - Math.sin(t * 3) * 30 - t * 50;
          const cy = 10 + t * 270;
          const rot = (i % 2 === 0 ? 35 : -35) - t * 20;
          return (
            <g key={i} transform={`translate(${cx} ${cy}) rotate(${rot})`}>
              <path d="M0 0 Q14 -10 28 0 Q14 12 0 0 Z" />
            </g>
          );
        })}
      </g>
    </svg>
  );
}

// Sprig watermark inside the card (top-right of text column)
function Sprig({ color = "#8a9576" }) {
  return (
    <svg viewBox="0 0 80 40" className="absolute top-4 right-3 w-16 h-8 pointer-events-none" aria-hidden>
      <g fill="none" stroke={color} strokeWidth="1" opacity="0.6">
        <path d="M5 25 Q30 5 75 18" />
      </g>
      {Array.from({ length: 7 }).map((_, i) => {
        const x = 12 + i * 9;
        const y = 22 - Math.sin(i / 2) * 6;
        return <ellipse key={i} cx={x} cy={y} rx="3.5" ry="1.6" fill={color} opacity="0.45" transform={`rotate(${i * 9} ${x} ${y})`} />;
      })}
    </svg>
  );
}

const VARIANTS = {
  sage: { bg: "#eef0e6", overlineColor: "#5e6b55", numberColor: "#8a6e3a", titleColor: "#2e2a26", descColor: "#5b554d", divider: "#5e6b55", iconBg: "#ffffff", iconColor: "#5e6b55", arrowBg: "#ffffff", arrowColor: "#5e6b55", border: "#dfdbcb", leafTint: "#8a9576" },
  cream: { bg: "#f0e7d0", overlineColor: "#8a6e3a", numberColor: "#8a6e3a", titleColor: "#2e2a26", descColor: "#5b554d", divider: "#8a6e3a", iconBg: "#ffffff", iconColor: "#8a6e3a", arrowBg: "#ffffff", arrowColor: "#5e6b55", border: "#dccaa3", leafTint: "#b59b5a" },
  warm: { bg: "#ead8be", overlineColor: "#8a6e3a", numberColor: "#8a6e3a", titleColor: "#2e2a26", descColor: "#5b554d", divider: "#8a6e3a", iconBg: "#ffffff", iconColor: "#8a6e3a", arrowBg: "#ffffff", arrowColor: "#5e6b55", border: "#d9c8a3", leafTint: "#b59b5a" },
  dark: { bg: "#23211d", overlineColor: "#d9c189", numberColor: "#d9c189", titleColor: "#f4f1e8", descColor: "#d4cab8", divider: "#d9c189", iconBg: "rgba(217,193,137,0.16)", iconColor: "#d9c189", arrowBg: "transparent", arrowColor: "#d9c189", border: "#3a342f", leafTint: "#d9c189" },
};

function ChapterCard({ chapter, i }) {
  const v = VARIANTS[chapter.variant] || VARIANTS.sage;
  const Icon = chapter.icon;
  const isDark = chapter.variant === "dark";

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
      <Link
        to={chapter.to}
        data-testid={`home-chapter-${chapter.id}`}
        className="block relative overflow-hidden rounded-3xl group"
        style={{ background: v.bg, border: `1px solid ${v.border}`, minHeight: 220, boxShadow: "0 12px 30px rgba(60,50,30,0.06)" }}
      >
        {/* Dark world-map texture for the Travel card */}
        {isDark && (
          <svg viewBox="0 0 1000 500" className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="xMidYMid slice">
            <defs>
              <pattern id="zp-dotmap" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
                <circle cx="6" cy="6" r="1.1" fill="#d9c189" opacity="0.6" />
              </pattern>
            </defs>
            <path d="M120 130 Q180 100 240 120 Q280 130 290 170 Q260 210 220 230 Q170 240 130 220 Q100 190 120 130 Z" fill="url(#zp-dotmap)" />
            <path d="M250 270 Q280 260 300 290 Q320 340 300 400 Q280 440 260 430 Q240 400 240 350 Q240 300 250 270 Z" fill="url(#zp-dotmap)" />
            <path d="M460 130 Q500 110 540 130 Q560 160 540 190 Q500 200 470 180 Q450 160 460 130 Z" fill="url(#zp-dotmap)" />
            <path d="M470 220 Q510 210 540 240 Q560 290 540 350 Q510 390 480 380 Q450 340 450 280 Q450 240 470 220 Z" fill="url(#zp-dotmap)" />
            <path d="M580 140 Q680 110 780 140 Q830 170 820 220 Q780 250 700 240 Q620 230 590 200 Q570 170 580 140 Z" fill="url(#zp-dotmap)" />
            <path d="M730 260 Q780 250 810 280 Q800 310 760 310 Q720 300 720 280 Z" fill="url(#zp-dotmap)" />
            <path d="M820 340 Q870 330 900 360 Q890 390 850 395 Q810 385 810 360 Z" fill="url(#zp-dotmap)" />
            {/* Gold map pin sparkles */}
            {[{x:23,y:42},{x:53,y:44},{x:72,y:55},{x:80,y:48},{x:88,y:44},{x:30,y:70}].map((d,k)=>(
              <circle key={k} cx={d.x*10} cy={d.y*5} r="3.5" fill="#d9c189" opacity="0.95" />
            ))}
          </svg>
        )}

        {/* Decorative left leaves (light variants) */}
        {!isDark && <LeafBranch tint={v.leafTint} />}

        {/* Right-side hero image, with soft fade-in to card colour */}
        <div className="absolute top-0 right-0 bottom-0 w-[58%] sm:w-[55%]">
          <img src={chapter.image} alt={chapter.title} className="w-full h-full object-cover" loading="lazy" />
          {/* Linear gradient fade from card bg to transparent */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(90deg, ${v.bg} 0%, ${v.bg}cc 18%, transparent 55%)`,
            }}
          />
          {isDark && (
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(35,33,29,0.15) 0%, rgba(35,33,29,0.4) 100%)" }} />
          )}
        </div>

        {/* Text column */}
        <div className="relative p-5 sm:p-6 pr-[55%] sm:pr-[52%]">
          <Sprig color={v.leafTint} />
          <div className="flex items-baseline gap-3 mb-3">
            <span className="font-display text-2xl font-semibold" style={{ color: v.numberColor }}>{chapter.number}</span>
            <span className="text-[11px] uppercase tracking-[0.3em] font-medium" style={{ color: v.overlineColor }}>{chapter.overline}</span>
          </div>
          <h2 className="font-display font-semibold leading-[1.05] text-2xl sm:text-3xl" style={{ color: v.titleColor, fontFamily: "Playfair Display, serif" }}>
            {chapter.title}
          </h2>
          <div className="w-10 h-px mt-3 mb-3" style={{ background: v.divider, opacity: 0.6 }} />
          <p className="text-sm leading-relaxed" style={{ color: v.descColor }}>{chapter.desc}</p>

          {/* Icon chip bottom-left */}
          <div className="mt-6">
            <div className="size-11 rounded-full grid place-items-center" style={{ background: v.iconBg, boxShadow: isDark ? "none" : "0 2px 6px rgba(60,50,30,0.06)", border: isDark ? `1px solid rgba(217,193,137,0.4)` : "none" }}>
              <Icon className="size-5" style={{ color: v.iconColor }} />
            </div>
          </div>
        </div>

        {/* Arrow chip top-right */}
        <div className="absolute top-5 right-5">
          <div className="size-10 rounded-full grid place-items-center" style={{ background: v.arrowBg, border: isDark ? `1.5px solid ${v.arrowColor}` : "none", boxShadow: isDark ? "none" : "0 2px 6px rgba(60,50,30,0.08)" }}>
            <ArrowUpRight className="size-4" style={{ color: v.arrowColor }} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function Greeting({ name }) {
  const hour = new Date().getHours();
  const word = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  return (
    <div>
      <h1 className="font-display text-2xl sm:text-3xl font-semibold leading-tight" style={{ color: "#2e2a26" }}>
        {word},<br />{name?.split(" ")[0] || "there"}.
      </h1>
      <p className="text-sm mt-1.5" style={{ color: "#6b6258" }}>Today is a new beginning.</p>
    </div>
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
    <div className="space-y-8">
      {/* Top app bar */}
      <header className="flex items-center justify-between">
        <Logo size="sm" />
        <div className="flex items-center gap-2">
          {user?.is_premium ? (
            <span className="text-[10px] font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider" style={{ background: "#b59b5a", color: "#2e2a26" }}>Premium</span>
          ) : (
            <Link data-testid="home-upgrade-pill" to="/app/profile"
              className="text-xs font-medium px-4 py-2 rounded-full"
              style={{ background: "#5e6b55", color: "#f4f1e8" }}>
              Get Started
            </Link>
          )}
          <button className="size-9 rounded-full border grid place-items-center" style={{ borderColor: "#ddd6c4" }}>
            <Menu className="size-4" style={{ color: "#2e2a26" }} />
          </button>
        </div>
      </header>

      <Greeting name={user?.name} />

      {/* Today snapshot */}
      <section data-testid="home-today-snapshot" className="rounded-3xl p-5 nv-shadow" style={{ background: "#f0e7d0", border: "1px solid #dccaa3" }}>
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

      {/* Chapter cards */}
      <section className="space-y-5">
        {CHAPTERS.map((c, i) => <ChapterCard key={c.id} chapter={c} i={i} />)}
      </section>

      {/* AI Coach CTA */}
      <section className="rounded-3xl p-5 sm:p-6 relative overflow-hidden nv-shadow" style={{ background: "#eef0e6", border: "1px solid #dfdbcb" }}>
        <div className="flex items-center gap-4">
          <div className="size-11 rounded-full grid place-items-center" style={{ background: "#ffffff" }}>
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
      {trending.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl" style={{ color: "#2e2a26" }}>Featured for you</h2>
            <Link to="/app/explore" className="text-xs" style={{ color: "#5e6b55" }}>View all</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {trending.map((r) => <RecipeCard key={r.id} recipe={r} />)}
          </div>
        </section>
      )}
    </div>
  );
}
