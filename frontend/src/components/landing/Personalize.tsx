import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Heart, Activity, Droplet, Brain, Check } from "lucide-react";
import { useRef } from "react";
import { SectionLabel } from "./SectionLabel";

const STEPS = [
  {
    n: "01",
    title: "Understand",
    body: "A gentle onboarding maps your conditions, energy, sleep, cravings and rituals — no calorie shame, no aggressive quizzes.",
    visual: "onboard",
  },
  {
    n: "02",
    title: "Adapt",
    body: "Your plan reshapes weekly: meals that suit your cycle, training, travel, or a stressful week — automatically.",
    visual: "plan",
  },
  {
    n: "03",
    title: "Evolve",
    body: "Insights surface patterns you'd never notice alone — and the plan gets quieter, not louder, as you settle in.",
    visual: "insight",
  },
];

export function Personalize() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <section id="personalize" ref={containerRef} className="relative bg-ivory py-24 md:py-40 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          style={{ y: useTransform(scrollYProgress, [0, 1], [0, -150]) }}
          className="absolute top-1/4 -left-20 opacity-[0.03] text-espresso"
        >
          <svg width="400" height="400" viewBox="0 0 200 200">
            <path d="M40 100 Q 100 20 160 100 T 40 180" fill="currentColor" />
          </svg>
        </motion.div>
        <motion.div 
          style={{ y: useTransform(scrollYProgress, [0, 1], [0, 200]) }}
          className="absolute bottom-1/4 -right-20 opacity-[0.03] text-olive"
        >
          <svg width="500" height="500" viewBox="0 0 200 200">
            <path d="M100 20 C 120 80 180 100 100 180 C 20 100 80 80 100 20" fill="currentColor" />
          </svg>
        </motion.div>
      </div>

      <div className="mx-auto max-w-7xl px-6 md:px-10 relative">
        {/* Vertical Connecting Line */}
        <div className="absolute left-6 md:left-[50%] top-[400px] bottom-40 w-px bg-espresso/5 hidden md:block">
          <motion.div 
            style={{ scaleY, originY: 0 }}
            className="w-full h-full bg-gradient-to-b from-olive/40 via-olive to-olive/10"
          />
        </div>

        <div className="mb-16 max-w-3xl md:mb-24 relative z-10">
          <SectionLabel index="V">Personalization engine</SectionLabel>
          <h2 className="mt-6 font-serif text-[40px] leading-[1.05] text-espresso md:text-[64px]">
            A plan that <span className="italic text-olive">knows</span> you — and keeps learning.
          </h2>
        </div>

        <div className="space-y-32 md:space-y-64 relative z-10">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className={`grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-24 items-center ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}
            >
              <div className="md:col-span-5 md:pt-10">
                <motion.div
                  initial={{ opacity: 0, x: i % 2 === 1 ? 20 : -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  <span className="font-serif text-7xl italic text-olive/20 md:text-9xl block mb-2">{s.n}</span>
                  <h3 className="font-serif text-[40px] leading-tight text-espresso md:text-[56px]">{s.title}</h3>
                  <div className="mt-6 h-px w-16 bg-olive/30 mb-6" />
                  <p className="max-w-md text-[18px] leading-relaxed text-espresso/70">{s.body}</p>
                </motion.div>
              </div>
              <div className="md:col-span-7 relative">
                {/* Floating Shadow Decoration */}
                <div className="absolute -inset-10 bg-gradient-to-tr from-sage-soft/10 via-transparent to-olive/5 rounded-full blur-3xl opacity-50 -z-10" />
                
                <motion.div
                  whileHover={{ y: -10, rotate: i % 2 === 0 ? 1 : -1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {s.visual === "onboard" && <OnboardMock />}
                  {s.visual === "plan" && <PlanMock />}
                  {s.visual === "insight" && <InsightMock />}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto aspect-[9/16] w-full max-w-[340px] md:max-w-[380px] overflow-hidden rounded-[48px] border-[8px] border-espresso/5 bg-ivory shadow-[0_40px_100px_-20px_rgba(60,50,30,0.15)]">
      <div className="absolute left-1/2 top-4 z-10 h-1.5 w-16 -translate-x-1/2 rounded-full bg-espresso/5" />
      <div className="h-full p-6 pt-12">{children}</div>
    </div>
  );
}

function OnboardMock() {
  const items = [
    { icon: Heart, label: "PCOS", sub: "Hormonal balance", on: true },
    { icon: Droplet, label: "Digestive Health", sub: "Gut health & bloating", on: true },
    { icon: Activity, label: "Thyroid", sub: "Metabolic care", on: false },
    { icon: Brain, label: "Stress & Sleep", sub: "Mental well-being", on: false },
  ];
  return (
    <PhoneFrame>
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="font-serif text-[24px] leading-tight text-espresso"
      >
        Let's understand<br />you better
      </motion.p>
      <motion.p 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-2 text-[12px] text-espresso/55"
      >
        This helps us personalize your nutrition journey.
      </motion.p>
      <div className="mt-6 space-y-3">
        {items.map(({ icon: Icon, label, sub, on }, idx) => (
          <motion.div 
            key={label}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * idx + 0.3 }}
            className={`flex items-center gap-3 rounded-2xl p-4 ${on ? "bg-sage-soft/40 border border-olive/10 shadow-sm" : "bg-cream/50"}`}
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${on ? "bg-olive text-ivory" : "bg-ivory text-olive border border-espresso/5"}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-medium text-espresso">{label}</p>
              <p className="text-[11px] text-espresso/50">{sub}</p>
            </div>
            {on && <Check className="h-4 w-4 text-olive" />}
          </motion.div>
        ))}
      </div>
      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="mt-6 w-full rounded-full bg-olive py-4 text-[13px] font-medium text-ivory shadow-lg shadow-olive/20"
      >
        Continue
      </motion.button>
    </PhoneFrame>
  );
}

function PlanMock() {
  const meals = [
    { name: "Breakfast", dish: "Moong Dal Chilla", meta: "High protein · 20 min" },
    { name: "Lunch", dish: "Millet Buddha Bowl", meta: "Balanced · 30 min" },
    { name: "Snack", dish: "Fruit & Nuts Bowl", meta: "Light · 10 min" },
    { name: "Dinner", dish: "Khichdi with Ghee", meta: "Comforting · 25 min" },
  ];
  return (
    <PhoneFrame>
      <div className="flex items-baseline justify-between mb-2">
        <p className="font-serif text-[24px] text-espresso">Today's Plan</p>
        <span className="text-[11px] text-espresso/50">Tue · Mar 12</span>
      </div>
      <div className="flex gap-4 border-b border-espresso/10 pb-2 text-[12px]">
        <span className="border-b-2 border-olive pb-2 font-medium text-olive">Plan</span>
        <span className="text-espresso/50">Recipes</span>
        <span className="text-espresso/50">Groceries</span>
      </div>
      <div className="mt-5 space-y-3">
        {meals.map((m, idx) => (
          <motion.div 
            key={m.name} 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * idx + 0.2 }}
            className="flex items-center gap-4 rounded-2xl bg-cream/60 p-4 hover:bg-cream transition-colors cursor-pointer"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sage-soft text-[11px] font-bold tracking-wider text-olive-deep uppercase">{m.name.slice(0,3)}</div>
            <div className="flex-1">
              <p className="text-[10px] uppercase tracking-widest text-espresso/40 font-bold mb-0.5">{m.name}</p>
              <p className="text-[14px] font-medium text-espresso">{m.dish}</p>
              <p className="text-[11px] text-espresso/50">{m.meta}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </PhoneFrame>
  );
}

function InsightMock() {
  return (
    <PhoneFrame>
      <p className="font-serif text-[24px] text-espresso">Your Progress</p>
      <div className="mt-2 flex gap-4 border-b border-espresso/10 pb-2 text-[12px]">
        <span className="border-b-2 border-olive pb-2 font-medium text-olive">Overview</span>
        <span className="text-espresso/50">Nutrition</span>
        <span className="text-espresso/50">Habits</span>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        className="mt-6 rounded-3xl bg-cream/60 p-5 shadow-sm"
      >
        <p className="text-[12px] font-bold text-espresso uppercase tracking-wider mb-1">Energy levels</p>
        <p className="text-[11px] text-espresso/50">This week (High intensity)</p>
        <svg viewBox="0 0 200 80" className="mt-4 h-24 w-full">
          <motion.polyline 
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            points="10,60 40,50 70,55 100,40 130,30 160,25 190,15" 
            fill="none" 
            stroke="oklch(0.52 0.055 130)" 
            strokeWidth="2" 
          />
          {[10,40,70,100,130,160,190].map((x,i) => (
            <motion.circle 
              key={i} 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.1 * i + 1 }}
              cx={x} 
              cy={[60,50,55,40,30,25,15][i]} 
              r="3" 
              fill="oklch(0.52 0.055 130)" 
            />
          ))}
          <g fontSize="8" fill="oklch(0.45 0.02 70)" className="font-medium">
            {["M","T","W","T","F","S","S"].map((d,i) => <text key={i} x={10 + i*30} y="78" textAnchor="middle">{d}</text>)}
          </g>
        </svg>
      </motion.div>

      <div className="mt-4 space-y-3">
        {[
          { label: "Mindful eating", val: "57%", sub: "4/7 days" },
          { label: "Meals logged", val: "75%", sub: "21/28 meals" }
        ].map((item, idx) => (
          <motion.div 
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 * idx + 0.5 }}
            className="rounded-2xl bg-cream/40 p-4 border border-espresso/5"
          >
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-[12px] font-medium text-espresso">{item.label}</span>
              <span className="text-[10px] text-espresso/50 font-bold">{item.sub}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-ivory shadow-inner">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: item.val }}
                transition={{ duration: 1, delay: 0.8 }}
                className="h-full rounded-full bg-olive" 
              />
            </div>
          </motion.div>
        ))}
      </div>
    </PhoneFrame>
  );
}
