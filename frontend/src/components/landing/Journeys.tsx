import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useState } from "react";
import { ArrowUpRight, Heart, Dumbbell, Globe, X } from "lucide-react";
import { SectionLabel } from "./SectionLabel";

const healthcareImg = "/landing/healthcare-bowl.jpg";
const fitnessImg = "/landing/fitness-plate.jpg";
const discoverImg = "/landing/discover-bowl.jpg";

type Journey = {
  id: string;
  number: string;
  kicker: string;
  title: string;
  subtitle: string;
  body: string;
  focus: string[];
  image: string;
  Icon: typeof Heart;
  dark?: boolean;
  span: string;
};

const JOURNEYS: Journey[] = [
  {
    id: "heal",
    number: "01",
    kicker: "Healthcare",
    title: "Heal & Restore",
    subtitle: "Safe, calm, restorative.",
    body: "Recipes shaped around your body — PCOS, diabetes, gut, thyroid, cholesterol — translated into the kind of meals you'd actually cook on a Tuesday night.",
    focus: ["PCOS", "Diabetes", "Gut health", "Thyroid", "Cholesterol"],
    image: healthcareImg,
    Icon: Heart,
    span: "md:col-span-7 md:row-span-2",
  },
  {
    id: "fuel",
    number: "02",
    kicker: "Fitness",
    title: "Strength & Fuel",
    subtitle: "Disciplined wellness, balanced energy.",
    body: "High-protein plates, macro-honest portions, recovery meals and timing that fit around your training week — not the other way round.",
    focus: ["High protein", "Muscle gain", "Fat loss", "Meal timing", "Recovery"],
    image: fitnessImg,
    Icon: Dumbbell,
    dark: true,
    span: "md:col-span-5",
  },
  {
    id: "travel",
    number: "03",
    kicker: "Discover",
    title: "Travel the Plate",
    subtitle: "Joyful, exploratory, warm.",
    body: "Global cuisines, gently adapted to how you live — eat Kyoto on Monday, Marrakech on Thursday, without losing your nutrition goals.",
    focus: ["Japan", "India", "Italy", "Mexico", "Morocco", "Vietnam"],
    image: discoverImg,
    Icon: Globe,
    dark: true,
    span: "md:col-span-5",
  },
];

export function Journeys() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section id="journeys" className="relative bg-ivory py-24 md:py-40">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-14 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel index="II">The three journeys</SectionLabel>
            <h2 className="mt-6 max-w-2xl font-serif text-[40px] leading-[1.05] text-espresso md:text-[64px]">
              One platform. <span className="italic text-olive">Three ways</span> to eat well.
            </h2>
          </div>
          <p className="max-w-sm text-[15px] leading-relaxed text-espresso/65">
            Tap any card to step inside. Each journey shapes recipes, planning, and rituals differently — so the app fits the life you actually live.
          </p>
        </div>

        <LayoutGroup>
          <div className="grid grid-cols-1 gap-5 md:auto-rows-[220px] md:grid-cols-12">
            {JOURNEYS.map((j) => (
              <JourneyCard key={j.id} journey={j} dimmed={openId !== null && openId !== j.id} onOpen={() => setOpenId(j.id)} />
            ))}
          </div>
          <AnimatePresence>
            {openId && (
              <JourneyOverlay journey={JOURNEYS.find((j) => j.id === openId)!} onClose={() => setOpenId(null)} />
            )}
          </AnimatePresence>
        </LayoutGroup>
      </div>
    </section>
  );
}

function JourneyCard({ journey, dimmed, onOpen }: { journey: Journey; dimmed: boolean; onOpen: () => void }) {
  const { Icon } = journey;
  return (
    <motion.button
      layoutId={`journey-${journey.id}`}
      onClick={onOpen}
      animate={{ opacity: dimmed ? 0.35 : 1, scale: dimmed ? 0.98 : 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative overflow-hidden rounded-[28px] text-left ${journey.span} ${
        journey.dark ? "bg-espresso text-ivory" : "bg-cream text-espresso"
      }`}
      style={{ minHeight: 380 }}
    >
      {/* Image */}
      <motion.div layoutId={`journey-img-${journey.id}`} className="absolute inset-0">
        <img src={journey.image} alt={journey.title} className="h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-105" loading="lazy" />
        <div className={`absolute inset-x-0 bottom-0 h-3/5 ${
          journey.dark
            ? "bg-gradient-to-t from-espresso via-espresso/80 to-transparent"
            : "bg-gradient-to-t from-cream/90 via-cream/30 to-transparent"
        }`} />
      </motion.div>

      {/* Decorative botanic */}
      <svg className={`pointer-events-none absolute right-4 top-4 h-20 w-20 ${journey.dark ? "text-gold/30" : "text-olive/20"}`} viewBox="0 0 100 100" fill="none">
        <path d="M50 95 L50 40 M50 50 C 25 45 15 25 20 5 C 45 10 55 30 50 50 M50 55 C 75 50 85 30 80 10 C 55 15 45 35 50 55" fill="currentColor" />
      </svg>

      <div className="relative flex h-full flex-col justify-between p-7 md:p-10">
        <div className="flex items-start justify-between">
          <motion.span layoutId={`journey-num-${journey.id}`} className={`font-serif text-3xl italic ${journey.dark ? "text-gold" : "text-olive/70"}`}>
            {journey.number}
          </motion.span>
          <span className={`flex h-10 w-10 items-center justify-center rounded-full ${
            journey.dark ? "bg-ivory/10 text-gold" : "bg-ivory text-olive"
          } transition-transform group-hover:rotate-45`}>
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>

        <div className="drop-shadow-[0_2px_4px_rgba(255,255,255,0.4)]">
          <motion.p layoutId={`journey-kicker-${journey.id}`} className={`eyebrow mb-4 ${journey.dark ? "!text-gold drop-shadow-none" : ""}`}>
            {journey.kicker}
          </motion.p>
          <motion.h3 layoutId={`journey-title-${journey.id}`} className="font-serif text-[34px] leading-[1] md:text-[42px]">
            {journey.title}
          </motion.h3>
          <div className={`mt-4 h-px w-10 ${journey.dark ? "bg-gold/60" : "bg-olive/40"}`} />
          <motion.p layoutId={`journey-sub-${journey.id}`} className={`mt-4 max-w-[26ch] text-[14px] leading-relaxed ${journey.dark ? "text-ivory/75 drop-shadow-none" : "text-espresso/70"}`}>
            {journey.subtitle}
          </motion.p>

          <div className="mt-5 flex items-center gap-2">
            <Icon className={`h-4 w-4 ${journey.dark ? "text-gold" : "text-olive"}`} />
            <span className={`text-[12px] tracking-wider uppercase ${journey.dark ? "text-ivory/55" : "text-espresso/45"}`}>
              Tap to step inside
            </span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}

function JourneyOverlay({ journey, onClose }: { journey: Journey; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-espresso/40 backdrop-blur-sm p-4 md:p-10"
      onClick={onClose}
    >
      <motion.div
        layoutId={`journey-${journey.id}`}
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-5xl overflow-hidden rounded-[32px] ${journey.dark ? "bg-espresso text-ivory" : "bg-cream text-espresso"}`}
        style={{ maxHeight: "90vh" }}
      >
        <button onClick={onClose} className={`absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full ${journey.dark ? "bg-ivory/10 text-ivory hover:bg-ivory/20" : "bg-espresso/10 text-espresso hover:bg-espresso/20"} transition`}>
          <X className="h-4 w-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          <motion.div layoutId={`journey-img-${journey.id}`} className="relative aspect-[4/3] md:aspect-auto md:min-h-[560px]">
            <img src={journey.image} alt={journey.title} className="h-full w-full object-cover" />
          </motion.div>
          <div className="flex flex-col gap-6 p-8 md:gap-8 md:p-12 overflow-y-auto" style={{ maxHeight: "90vh" }}>
            <div className="flex items-center gap-4">
              <motion.span layoutId={`journey-num-${journey.id}`} className={`font-serif text-4xl italic ${journey.dark ? "text-gold" : "text-olive/70"}`}>
                {journey.number}
              </motion.span>
              <motion.p layoutId={`journey-kicker-${journey.id}`} className={`eyebrow ${journey.dark ? "!text-gold" : ""}`}>{journey.kicker}</motion.p>
            </div>
            <motion.h3 layoutId={`journey-title-${journey.id}`} className="font-serif text-[44px] leading-[0.95] md:text-[56px]">
              {journey.title}
            </motion.h3>
            <motion.p layoutId={`journey-sub-${journey.id}`} className={`text-[16px] italic ${journey.dark ? "text-ivory/70" : "text-espresso/60"}`}>
              {journey.subtitle}
            </motion.p>
            <p className={`text-[16px] leading-relaxed ${journey.dark ? "text-ivory/80" : "text-espresso/75"}`}>
              {journey.body}
            </p>

            <div>
              <p className={`mb-3 text-[11px] tracking-[0.22em] uppercase ${journey.dark ? "text-ivory/50" : "text-espresso/50"}`}>Focus areas</p>
              <div className="flex flex-wrap gap-2">
                {journey.focus.map((f) => (
                  <span key={f} className={`rounded-full border px-4 py-1.5 text-[13px] ${journey.dark ? "border-gold/40 text-gold" : "border-olive/30 text-olive-deep"}`}>{f}</span>
                ))}
              </div>
            </div>

            <a href="#recipes" className={`mt-auto inline-flex items-center gap-2 self-start rounded-full px-6 py-3 text-[14px] font-medium ${journey.dark ? "bg-gold text-espresso hover:bg-gold/90" : "bg-olive text-ivory hover:bg-olive-deep"} transition`}>
              Explore this journey
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
