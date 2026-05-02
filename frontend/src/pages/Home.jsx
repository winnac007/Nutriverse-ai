import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "../lib/auth";
import RecipeCard from "../components/RecipeCard";
import { HeartPulse, Dumbbell, Globe2, ChefHat, Sparkles, ArrowRight, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const cats = [
  { id: "healthcare", title: "Healthcare", icon: HeartPulse, gradient: "nv-gradient-hc", image: "https://images.unsplash.com/photo-1751890893842-7807b463b344?w=800", tagline: "Disease-aware nutrition" },
  { id: "fitness", title: "Fitness", icon: Dumbbell, gradient: "nv-gradient-ft", image: "https://images.unsplash.com/photo-1587996616596-b714c1c54146?w=800", tagline: "Goal-based macros" },
  { id: "cultural", title: "Cultural", icon: Globe2, gradient: "nv-gradient-cu", image: "https://images.unsplash.com/photo-1661607775751-dc9efc8f3a9c?w=800", tagline: "40+ cuisines" },
  { id: "chef-special", title: "Chef Specials", icon: ChefHat, gradient: "nv-gradient-cs", image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800", tagline: "Desserts · Bakery" },
];

export default function Home() {
  const { user } = useAuth();
  const [trending, setTrending] = useState([]);
  const [today, setToday] = useState({ totals: { calories: 0, protein: 0, carbs: 0, fat: 0 } });

  useEffect(() => {
    api.get("/recipes", { params: { category: user?.category } })
      .then((r) => setTrending(r.data.slice(0, 6)));
    api.get("/nutrition/today").then((r) => setToday(r.data)).catch(() => {});
  }, [user?.category]);

  return (
    <div className="space-y-10">
      <header className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Welcome back</p>
          <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight mt-1">Hi {user?.name?.split(" ")[0]} 👋</h1>
          {user?.location && (
            <p className="text-sm text-muted-foreground mt-1 inline-flex items-center gap-1"><MapPin className="size-3.5" /> {user.location}</p>
          )}
        </div>
        {user?.is_premium ? (
          <span className="text-xs font-semibold px-3 py-1 rounded-full nv-gradient-pm text-black">PREMIUM</span>
        ) : (
          <Link data-testid="home-upgrade-pill" to="/app/profile" className="text-xs font-semibold px-3 py-1 rounded-full border border-[#c28a00]/40 text-[#c28a00] hover:bg-[#ffd166]/10">Upgrade</Link>
        )}
      </header>

      <section data-testid="home-today-snapshot" className="nv-card nv-shadow p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Today</h2>
          <Link to="/app/track" className="text-xs text-primary inline-flex items-center gap-1">See all <ArrowRight className="size-3" /></Link>
        </div>
        <div className="grid grid-cols-4 gap-3 text-center">
          {["calories", "protein", "carbs", "fat"].map((k) => (
            <div key={k}>
              <div className="text-2xl font-display font-bold">{today.totals[k] || 0}</div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{k === "calories" ? "kcal" : `${k} g`}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Storymap CTA */}
      <Link to="/app/storymap" data-testid="home-storymap" className="block group">
        <div className="nv-ancient nv-shadow rounded-2xl p-6 sm:p-8 relative overflow-hidden">
          <div className="relative">
            <div className="text-[10px] uppercase tracking-[0.3em] mb-2" style={{color: "#6b4423"}}>The Origins Atlas</div>
            <h3 className="font-display text-2xl sm:text-3xl font-bold leading-tight" style={{color: "#3a2618"}}>
              Travel the world through food.
            </h3>
            <p className="mt-2 text-sm max-w-md" style={{color: "#5b3d22"}}>
              Zoom into a country, a region, a street — and discover what the locals actually cook.
            </p>
            <span className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium" style={{color: "#6b4423"}}>
              Open the atlas <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      </Link>

      <section>
        <h2 className="font-display text-xl font-semibold mb-4">Browse categories</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {cats.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Link to={`/app/category/${c.id}`} data-testid={`home-cat-${c.id}`}
                className="block relative overflow-hidden nv-card nv-shadow aspect-[16/10] group">
                <img src={c.image} alt={c.title} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" />
                <div className={`absolute inset-0 ${c.gradient} opacity-50 mix-blend-multiply`} />
                <div className="absolute inset-0 nv-hero-overlay" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <c.icon className="size-5 text-white mb-1" />
                  <div className="font-display text-xl font-semibold text-white">{c.title}</div>
                  <div className="text-xs text-white/80">{c.tagline}</div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="nv-card nv-shadow p-6 relative overflow-hidden">
        <div className="absolute inset-0 nv-gradient-cu opacity-10" />
        <div className="relative flex items-center gap-4">
          <div className="size-12 rounded-2xl nv-gradient-cu grid place-items-center text-white"><Sparkles className="size-6" /></div>
          <div className="flex-1">
            <h3 className="font-display text-lg font-semibold">Smart Personalized Meal Plan</h3>
            <p className="text-sm text-muted-foreground">Body-type aware. Goal-tuned. Powered by Claude Sonnet 4.5.</p>
          </div>
          <Link data-testid="home-ai-plan-link" to="/app/meal-plan" className="text-sm text-primary font-medium">Open →</Link>
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold mb-4">Recommended for you</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {trending.map((r) => <RecipeCard key={r.id} recipe={r} />)}
        </div>
      </section>
    </div>
  );
}
