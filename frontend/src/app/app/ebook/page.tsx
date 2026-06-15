"use client";

import React, { useEffect, useState, useRef } from "react";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { motion } from "framer-motion";
import { ZENPLATO_CSS } from "./styles";
import { 
  Sparkles, 
  BookOpen, 
  ArrowRight, 
  Check, 
  Clock, 
  Target, 
  Heart,
  ChevronLeft
} from "lucide-react";

/* ─── Types ─────────────────────────────────────────────────────────────── */
interface Chapter {
  id: number;
  title: string;
  html_content: string;
}

interface Summary {
  greeting: string;
  headline: string;
  condition_label: string;
  condition_blurb: string;
  all_conditions: string[];
  goal_30day: string | null;
  stats: { label: string; value: string }[];
  diet: { type: string | null; allergies: string[] };
  focus_points: string[];
}

interface Ebook {
  condition_id: string;
  condition_label: string;
  generated_at: string;
  chapters: Chapter[];
  summary: Summary;
  is_premium?: boolean;
}

/* ─── Constants ──────────────────────────────────────────────────────────── */
const CONDITION_COLORS: Record<string, { clay: string; forest: string; accent: string }> = {
  pcos: { clay: "#BC5B38", forest: "#3F5247", accent: "#A85B86" },
  diabetes: { clay: "#BC5B38", forest: "#3F5247", accent: "#3F6E9E" },
  thyroid: { clay: "#BC5B38", forest: "#3F5247", accent: "#3E8F76" },
  "gut-health": { clay: "#BC5B38", forest: "#3F5247", accent: "#5E7D3C" },
  "anti-inflammatory": { clay: "#BC5B38", forest: "#3F5247", accent: "#C07248" },
  menopause: { clay: "#BC5B38", forest: "#3F5247", accent: "#8A5CA0" },
};

/* ─── Injected CSS ────────────────────────────────────────────────────────── */

/* ─── Sub-components ─────────────────────────────────────────────────────── */
function Reveal({ children, delay = 0, y = 22 }: { children: React.ReactNode; delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

function BotanicalSVG() {
  return (
    <svg className="absolute right-[-60px] top-1/2 -translate-y-1/2 w-[min(620px,70vw)] opacity-[0.16] pointer-events-none text-[var(--forest)]" viewBox="0 0 400 600" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M200 580 C200 420 200 300 200 120" />
      <path d="M200 200 C150 180 120 140 110 90 C160 100 195 140 200 200Z" fill="currentColor" fillOpacity=".05"/>
      <path d="M200 260 C250 240 280 200 290 150 C240 160 205 200 200 260Z" fill="currentColor" fillOpacity=".05"/>
      <circle cx="200" cy="90" r="9" fill="currentColor" fillOpacity=".12"/>
    </svg>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────────────── */
export default function EbookPage() {
  const { user } = useAuth();
  const [view, setView] = useState<'loading' | 'summary' | 'choice' | 'questionnaire' | 'generating' | 'reader'>('loading');
  const [ebook, setEbook] = useState<Ebook | null>(null);
  const [isNavVisible, setIsNavVisible] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Questionnaire state
  const [premiumAnswers, setPremiumAnswers] = useState({
    aspiration: "",
    flavor: "",
    time: "",
    why: ""
  });

  const chapterRefs = useRef<Record<number, HTMLElement | null>>({});

  useEffect(() => {
    fetchEbook();
  }, []);

  const fetchEbook = async () => {
    try {
      // Check if user has a premium ebook already
      const premiumRes = await api.get("/ebook/me?type=premium").catch(() => null);
      if (premiumRes?.data) {
        setEbook(premiumRes.data);
        setView('reader');
      } else {
        // Otherwise check general
        const generalRes = await api.get("/ebook/me").catch(() => null);
        if (generalRes?.data) {
          setEbook(generalRes.data);
          setView('summary');
        } else {
          setView('choice');
        }
      }
    } catch {
      setView('choice');
    }
  };

  /* Scroll effects */
  useEffect(() => {
    if (view !== 'reader') return;
    const handleScroll = () => {
      const h = document.documentElement;
      const st = window.pageYOffset || h.scrollTop;
      const sh = h.scrollHeight || document.body.scrollHeight;
      const ch = h.clientHeight;
      setScrollProgress((st / (sh - ch)) * 100);
      setIsNavVisible(st > window.innerHeight * 0.7);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [view]);

  const handlePremiumGenerate = async () => {
    setView('generating');
    try {
      const res = await api.post("/ebook/craft", premiumAnswers);
      setEbook(res.data);
      setView('reader');
    } catch {
      setView('questionnaire');
    }
  };

  const plan = user?.health_plan || {};
  const summaryInsights = ebook ? [
    {
      label: "Key findings",
      value: ebook.summary.goal_30day || plan.summary || "Your habits, food preferences and health goals are ready for a guided starting plan.",
    },
    {
      label: "Nutrition insights",
      value: ebook.summary.focus_points?.[0] || plan.analysis || "Your profile benefits from steady meals, whole-food anchors and simple repeatable routines.",
    },
    {
      label: "Foods to prioritize",
      value: (plan.foods_to_eat || ebook.summary.focus_points || ["Balanced proteins", "Fiber-rich plants", "Hydrating meals"]).slice(0, 4).join(", "),
    },
    {
      label: "Foods to limit",
      value: (plan.foods_to_avoid || ebook.summary.diet?.allergies || ["Refined sugar", "Ultra-processed snacks"]).slice(0, 4).join(", "),
    },
    {
      label: "Starter action plan",
      value: Array.isArray(plan.food_rules) && plan.food_rules.length ? plan.food_rules.slice(0, 2).join(" ") : "Start with regular meal timing, a protein source at each meal, and one planned grocery list.",
    },
  ] : [];

  if (view === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F7F1E8]">
        <motion.div 
          animate={{ rotateY: [0, 180, 360], scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-6xl"
        >
          📖
        </motion.div>
      </div>
    );
  }

  /* ─── Personalised Summary View ───────────────────────────────────────── */
  if (view === 'summary' && ebook) {
    return (
      <div className="min-h-screen bg-[#F7F1E8] p-5 md:p-8 flex items-center justify-center relative overflow-hidden">
        <style>{ZENPLATO_CSS}</style>
        <BotanicalSVG />

        <div className="relative z-10 w-full max-w-5xl">
          <Reveal y={-16}>
            <div className="mb-8 md:mb-10">
              <span className="inline-flex rounded-full border border-[#DCD0BD] px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C8071]">
                Your ZenPlato report preview
              </span>
              <h1 className="mt-5 max-w-3xl font-serif text-4xl md:text-6xl leading-[1.04] text-[#26211B]">
                {ebook.summary.greeting}. Your {ebook.summary.condition_label || ebook.condition_label} plan is ready.
              </h1>
              <p className="mt-5 max-w-2xl text-[#5E5447] text-base md:text-lg leading-relaxed">
                {ebook.summary.condition_blurb}
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-5 md:gap-6">
            <Reveal delay={0.1}>
              <div className="bg-white/78 border border-[#DCD0BD] rounded-[28px] p-5 md:p-8 shadow-xl shadow-[#26211B]/5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {summaryInsights.map((item) => (
                    <div key={item.label} className="rounded-2xl bg-[#F7F1E8] border border-[#DCD0BD]/70 p-5">
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#BC5B38]">{item.label}</p>
                      <p className="m-0 text-sm leading-relaxed text-[#26211B]/78">{item.value}</p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setView('reader')}
                  className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#26211B] px-7 py-4 text-sm font-bold text-white transition hover:bg-[#3F5247]"
                >
                  Open My Free Handbook <BookOpen size={18} />
                </button>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="bg-[#26211B] rounded-[28px] p-6 md:p-8 shadow-2xl relative overflow-hidden">
                <Sparkles className="absolute right-6 top-6 text-[#BC5B38]/25" size={92} />
                <p className="relative text-[10px] font-bold uppercase tracking-[0.2em] text-[#BC5B38] mb-4">
                  There is more beneath the surface
                </p>
                <h2 className="relative font-serif text-3xl md:text-4xl leading-tight text-[#F7F1E8] mb-4">
                  Unlock your personalised premium blueprint.
                </h2>
                <p className="relative text-sm leading-relaxed text-[#F7F1E8]/62 mb-6">
                  The premium ebook reveals deeper condition guidance, personalised recipes, grocery lists, food swaps, nutrition strategies, lifestyle recommendations and practical steps to follow.
                </p>
                <ul className="relative space-y-3 mb-8">
                  {["Foods to prioritize", "Foods to be mindful of", "Personalized recipes", "Grocery lists", "Lifestyle recommendations"].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-[#F7F1E8]/72">
                      <Check size={15} className="text-[#BC5B38]" /> {item}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setView('questionnaire')}
                  className="relative inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#BC5B38] px-7 py-4 text-sm font-bold text-white transition hover:bg-[#A94F31]"
                >
                  Unlock Premium Personalisation <ArrowRight size={18} />
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    );
  }

  /* ─── Choice View ─────────────────────────────────────────────────────── */
  if (view === 'choice') {
    return (
      <div className="min-h-screen bg-[#F7F1E8] p-6 flex flex-col items-center justify-center relative overflow-hidden">
        <style>{ZENPLATO_CSS}</style>
        <BotanicalSVG />
        
        <Reveal y={-20}>
          <div className="text-center mb-12">
            <h2 className="font-serif text-5xl text-[#26211B] mb-4">Choose Your Path</h2>
            <p className="text-[#5E5447] text-lg max-w-md mx-auto">Select the guide that matches your commitment level today.</p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full">
          {/* General Card */}
          <motion.div 
            whileHover={{ y: -10, rotateY: -5 }}
            className="bg-white/60 backdrop-blur rounded-[40px] p-10 border border-[#DCD0BD] shadow-xl flex flex-col cursor-pointer group"
            onClick={() => setView('reader')}
          >
            <div className="w-16 h-16 bg-[#F7F1E8] rounded-2xl flex items-center justify-center mb-6">
              <BookOpen className="text-[#8C8071]" />
            </div>
            <h3 className="font-serif text-3xl mb-4">The Essential Handbook</h3>
            <p className="text-[#5E5447] mb-8 flex-grow">A comprehensive, evidence-based guide tailored to your primary condition.</p>
            <ul className="space-y-3 mb-10">
              {["16 Chapters", "Standard Nutrition", "Lifestyle Tips"].map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-[#8C8071]">
                  <Check size={14} className="text-[#3F5247]" /> {f}
                </li>
              ))}
            </ul>
            <button className="w-full py-4 bg-transparent border border-[#DCD0BD] rounded-full font-bold text-[#26211B] group-hover:bg-[#26211B] group-hover:text-white transition-all flex items-center justify-center gap-2">
              Open General <ArrowRight size={18} />
            </button>
          </motion.div>

          {/* Premium Card */}
          <motion.div 
            whileHover={{ y: -10, rotateY: 5 }}
            className="bg-[#26211B] rounded-[40px] p-10 shadow-2xl flex flex-col relative overflow-hidden group cursor-pointer"
            onClick={() => setView('questionnaire')}
          >
            <div className="absolute top-0 right-0 p-8 opacity-20">
              <Sparkles size={120} className="text-[#BC5B38]" />
            </div>
            <div className="w-16 h-16 bg-[#BC5B38]/20 rounded-2xl flex items-center justify-center mb-6">
              <Sparkles className="text-[#BC5B38]" />
            </div>
            <h3 className="font-serif text-3xl text-[#F7F1E8] mb-4">The AI Alchemist Guide</h3>
            <p className="text-[#8C8071] mb-8 flex-grow">A hyper-personalised, AI-crafted masterpiece that evolves with your unique goals.</p>
            <ul className="space-y-3 mb-10">
              {["100% Personalised", "Goal-Specific AI Content", "Deep Biological Insights"].map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-[#F7F1E8]/60">
                  <Check size={14} className="text-[#BC5B38]" /> {f}
                </li>
              ))}
            </ul>
            <button className="w-full py-4 bg-[#BC5B38] text-white rounded-full font-bold shadow-lg shadow-[#BC5B38]/30 group-hover:scale-105 transition-all flex items-center justify-center gap-2">
              Start Premium <ArrowRight size={18} />
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  /* ─── Questionnaire View ──────────────────────────────────────────────── */
  if (view === 'questionnaire') {
    return (
      <div className="min-h-screen bg-[#F7F1E8] p-6 flex items-center justify-center">
        <style>{ZENPLATO_CSS}</style>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full bg-white/80 backdrop-blur-md rounded-[48px] p-12 border border-[#DCD0BD] shadow-2xl"
        >
          <button onClick={() => setView('choice')} className="flex items-center gap-2 text-[#8C8071] mb-8 hover:text-[#26211B] transition-colors">
            <ChevronLeft size={18} /> Back
          </button>
          
          <div className="mb-10">
            <span className="text-[#BC5B38] font-bold text-xs uppercase tracking-[0.2em] block mb-2">Personalisation Phase</span>
            <h2 className="font-serif text-4xl text-[#26211B]">Fine-tuning your AI.</h2>
          </div>

          <div className="space-y-8">
            <div>
              <label className="block text-sm font-bold text-[#26211B] mb-3 flex items-center gap-2">
                <Target size={16} className="text-[#BC5B38]" /> What's your primary aspiration?
              </label>
              <select 
                value={premiumAnswers.aspiration}
                onChange={e => setPremiumAnswers({...premiumAnswers, aspiration: e.target.value})}
                className="w-full bg-[#F7F1E8] border border-[#DCD0BD] rounded-2xl p-4 text-[#26211B] focus:ring-2 focus:ring-[#BC5B38] outline-none"
              >
                <option value="">Select an aspiration...</option>
                <option value="boundless-energy">Boundless Energy</option>
                <option value="zero-bloating">Zero Bloating & Gut Comfort</option>
                <option value="mental-clarity">Peak Mental Clarity</option>
                <option value="weight-freedom">Sustainable Weight Freedom</option>
                <option value="hormonal-peace">Balanced Hormones & Calm</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#26211B] mb-3 flex items-center gap-2">
                <Heart size={16} className="text-[#BC5B38]" /> Which flavor palette speaks to you?
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['Mediterranean', 'Spiced & Warm', 'Fresh & Green', 'Bold & Umami'].map(p => (
                  <button 
                    key={p}
                    onClick={() => setPremiumAnswers({...premiumAnswers, flavor: p})}
                    className={`py-3 px-4 rounded-xl border text-sm transition-all ${premiumAnswers.flavor === p ? 'bg-[#BC5B38] text-white border-[#BC5B38]' : 'bg-[#F7F1E8] text-[#5E5447] border-[#DCD0BD]'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#26211B] mb-3 flex items-center gap-2">
                <Clock size={16} className="text-[#BC5B38]" /> Cooking time on busy days?
              </label>
              <div className="flex gap-3">
                {['5m', '15m', '30m+'].map(t => (
                  <button 
                    key={t}
                    onClick={() => setPremiumAnswers({...premiumAnswers, time: t})}
                    className={`flex-1 py-3 rounded-xl border text-sm transition-all ${premiumAnswers.time === t ? 'bg-[#BC5B38] text-white border-[#BC5B38]' : 'bg-[#F7F1E8] text-[#5E5447] border-[#DCD0BD]'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <button 
              disabled={!premiumAnswers.aspiration || !premiumAnswers.flavor || !premiumAnswers.time}
              onClick={handlePremiumGenerate}
              className="w-full py-5 bg-[#26211B] text-white rounded-full font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#3F5247] transition-all flex items-center justify-center gap-3"
            >
              Craft My Premium Guide <Sparkles size={20} />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  /* ─── Generating View ─────────────────────────────────────────────────── */
  if (view === 'generating') {
    return (
      <div className="min-h-screen bg-[#26211B] flex flex-col items-center justify-center p-8 text-center">
        <style>{ZENPLATO_CSS}</style>
        
        {/* 3D Animated Elements */}
        <div className="relative w-64 h-64 mb-12">
          <motion.div 
            animate={{ rotateY: 360, rotateZ: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            style={{ transformStyle: "preserve-3d" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-48 h-64 bg-[#BC5B38] rounded-r-2xl border-2 border-[#DCD0BD]/20 shadow-2xl relative">
              <div className="absolute left-0 top-0 bottom-0 w-4 bg-[#8C3D21] rounded-r-sm shadow-inner" />
              <div className="absolute inset-4 border border-white/10 rounded-lg flex flex-col justify-center items-center text-white">
                <Sparkles size={48} className="mb-4 opacity-50" />
                <div className="text-[8px] tracking-[0.4em] font-bold opacity-30">ALCHEMIST</div>
              </div>
            </div>
          </motion.div>
          
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                y: [-20, 20], 
                x: [-20, 20],
                opacity: [0, 1, 0],
                scale: [0.5, 1.5, 0.5]
              }}
              transition={{ 
                duration: 2 + i, 
                repeat: Infinity, 
                delay: i * 0.4 
              }}
              className="absolute text-[#BC5B38] opacity-0"
              style={{ 
                left: `${Math.random() * 100}%`, 
                top: `${Math.random() * 100}%` 
              }}
            >
              <Sparkles size={16} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-md"
        >
          <h2 className="font-serif text-3xl text-[#F7F1E8] mb-4">AI Alchemist at work...</h2>
          <p className="text-[#8C8071] leading-relaxed">
            We're synthesising biological data, culinary preferences, and health goals into your unique nutritional blueprint. This takes about 30 seconds.
          </p>
          
          <div className="mt-12 flex justify-center gap-2">
            {[0, 1, 2].map(i => (
              <motion.div 
                key={i}
                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                className="w-2 h-2 rounded-full bg-[#BC5B38]"
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  /* ─── Reader View ─────────────────────────────────────────────────────── */
  if (!ebook) return null;
  const colors = CONDITION_COLORS[ebook.condition_id] || CONDITION_COLORS["anti-inflammatory"];

  return (
    <div className="zen-wrapper" style={{ 
      "--clay": colors.clay,
      "--forest": colors.forest,
      "--accent": colors.accent
    } as React.CSSProperties}>
      <style>{ZENPLATO_CSS}</style>

      {/* Progress bar */}
      <div className="progress" style={{ width: `${scrollProgress}%` }} />

      {/* Navigation */}
      <nav className={`nav ${isNavVisible ? "show" : ""}`}>
        <div className="flex items-center gap-4">
          <div className="font-bold tracking-[0.3em] text-xs">ZEN <span>·</span> PLATO</div>
          <button 
            onClick={() => setView('choice')}
            className="text-[10px] font-bold uppercase tracking-widest text-[#8C8071] hover:text-[#26211B] transition-colors"
          >
            Switch Guide
          </button>
        </div>
        <button className="text-xs font-bold uppercase tracking-widest bg-[#26211B] text-white px-6 py-2 rounded-full" onClick={() => setIsDrawerOpen(true)}>
          Contents
        </button>
      </nav>

      {/* Drawer */}
      <aside className={`drawer ${isDrawerOpen ? "open" : ""}`}>
        <button className="absolute top-8 right-8 text-2xl" onClick={() => setIsDrawerOpen(false)}>×</button>
        <h4 className="text-[10px] tracking-[0.3em] uppercase text-[#8C8071] mb-12">Navigation</h4>
        <div className="space-y-6">
          <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({top:0, behavior:'smooth'}); setIsDrawerOpen(false); }} className="block font-serif text-2xl hover:text-[#BC5B38] transition-colors">Cover</a>
          {ebook.chapters.map(ch => (
            <a key={ch.id} href={`#c${ch.id}`} onClick={(e) => { e.preventDefault(); const el = chapterRefs.current[ch.id]; if(el) window.scrollTo({top: el.offsetTop - 80, behavior:'smooth'}); setIsDrawerOpen(false); }} className="flex items-baseline gap-4 group">
              <span className="text-xs font-serif italic text-[#BC5B38]">{ch.id.toString().padStart(2, '0')}</span>
              <span className="text-lg font-medium group-hover:pl-2 transition-all">{ch.title}</span>
            </a>
          ))}
        </div>
      </aside>

      {/* COVER */}
      <section className="cover bg-white" id="top">
        <BotanicalSVG />
        <div className="max-w-4xl mx-auto w-full">
          <Reveal delay={0.2}>
            <span className="inline-block px-4 py-1 rounded-full border border-[#DCD0BD] text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C8071] mb-8">
              {ebook.is_premium ? "✨ Premium AI Blueprint" : "Essential Condition Guide"}
            </span>
          </Reveal>
          <Reveal delay={0.4}>
            <h1 className="text-[#26211B]">Your {ebook.condition_label}<br /><em>Handbook</em></h1>
          </Reveal>
          <Reveal delay={0.6}>
            <p className="text-2xl font-serif italic text-[#5E5447] mt-8 max-w-2xl">{ebook.summary.greeting}. {ebook.summary.condition_blurb}</p>
          </Reveal>
          
          <Reveal delay={0.8}>
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
              {ebook.summary.stats.map(s => (
                <div key={s.label} className="bg-[#F7F1E8] p-6 rounded-3xl border border-[#DCD0BD]/50">
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-[#8C8071] mb-1">{s.label}</span>
                  <span className="text-lg font-serif">{s.value}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-30">
          <div className="w-[1px] h-20 bg-gradient-to-b from-[#26211B] to-transparent" />
          <span className="text-[10px] tracking-[0.4em] uppercase">Begin Reading</span>
        </div>
      </section>

      {/* CHAPTERS */}
      {ebook.chapters.map(ch => (
        <section 
          key={ch.id} 
          className="py-24 max-w-4xl mx-auto px-6" 
          id={`c${ch.id}`}
          ref={el => { chapterRefs.current[ch.id] = el; }}
        >
          <Reveal delay={0.1}>
            <div className="flex items-center gap-6 mb-12">
              <span className="text-6xl font-serif text-transparent stroke-1" style={{ WebkitTextStroke: "1px var(--clay)" }}>{ch.id.toString().padStart(2, '0')}</span>
              <div className="h-[1px] flex-grow bg-[#DCD0BD]" />
              <h2 className="font-serif text-4xl">{ch.title}</h2>
            </div>
          </Reveal>
          
          <Reveal delay={0.3}>
            <div 
              className="ebook-content leading-relaxed text-[#26211B]/80"
              dangerouslySetInnerHTML={{ __html: ch.html_content }}
            />
          </Reveal>
        </section>
      ))}

      {/* FOOTER */}
      <footer className="bg-[#26211B] text-[#F7F1E8] py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="text-2xl font-bold tracking-[0.5em] mb-8">ZEN · PLATO</div>
          <p className="text-sm text-[#8C8071] max-w-xl mx-auto leading-loose italic">
            "Your body is the vessel for your spirit. Treat it with the reverence it deserves."
          </p>
          <div className="mt-20 pt-8 border-t border-white/5 text-[10px] text-[#5E5447] tracking-widest uppercase">
            © 2026 NutriVerse AI · Personalised Wellness
          </div>
        </div>
      </footer>
    </div>
  );
}
