"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  HeartPulse, 
  Dumbbell, 
  Globe2, 
  CheckCircle2, 
  ShieldCheck, 
  Activity,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";

const Nav = () => (
  <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
    <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2">
        <div className="size-8 rounded-lg nv-gradient-hc grid place-items-center text-black font-bold">N</div>
        <span className="font-display text-xl font-bold tracking-tight">NutriVerse</span>
      </Link>
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
        <Link href="#healthcare" className="hover:text-foreground transition-colors">Healthcare</Link>
        <Link href="#fitness" className="hover:text-foreground transition-colors">Fitness</Link>
        <Link href="#cultural" className="hover:text-foreground transition-colors">Cultural</Link>
        <Link href="#planning" className="hover:text-foreground transition-colors">AI Planning</Link>
      </div>
      <div className="flex items-center gap-3">
        <Link href="/auth" className="text-sm text-muted-foreground hover:text-foreground hidden sm:block">Sign in</Link>
        <Link href="/auth?mode=register">
          <Button className="rounded-full shadow-lg">Get started <ArrowRight className="size-4 ml-1" /></Button>
        </Link>
      </div>
    </div>
  </header>
);

const SectionHero = () => (
  <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
    <div className="absolute inset-0 z-0">
      <img 
        src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=2000&auto=format&fit=crop" 
        alt="Fresh ingredients" 
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
    </div>
    
    <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] uppercase tracking-[0.3em] font-semibold mb-8">
          Nutrition · Science · Culture
        </span>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white mb-8 leading-[0.9]">
          Nutrition, calibrated <br className="hidden md:block" /> for your life.
        </h1>
        <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-12 font-medium">
          Personalized recipes for clinical conditions, fitness peaks, and global cuisines — driven by precise AI meal planning.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="rounded-full px-8 py-7 text-lg shadow-xl hover:scale-105 transition-transform">
            Start your journey
          </Button>
          <Button size="lg" variant="outline" className="rounded-full px-8 py-7 text-lg bg-white/10 text-white border-white/20 hover:bg-white/20">
            Explore recipes
          </Button>
        </div>
      </motion.div>
    </div>
  </section>
);

const SectionTrust = () => (
  <section className="py-12 border-y bg-muted/30">
    <div className="max-w-7xl mx-auto px-6">
      <p className="text-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-8 font-bold">Trusted by clinical experts & health institutes</p>
      <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale contrast-125">
        <div className="flex items-center gap-2 font-display text-xl font-bold"><ShieldCheck className="size-6" /> HealthCert</div>
        <div className="flex items-center gap-2 font-display text-xl font-bold"><Activity className="size-6" /> BioMetrics</div>
        <div className="flex items-center gap-2 font-display text-xl font-bold"><HeartPulse className="size-6" /> ClinicalNode</div>
        <div className="flex items-center gap-2 font-display text-xl font-bold"><CheckCircle2 className="size-6" /> SafeKitchen</div>
      </div>
    </div>
  </section>
);

const SectionHealthcare = () => (
  <section id="healthcare" className="py-24 md:py-32">
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
        <div className="max-w-2xl">
          <span className="text-[#00d4aa] font-bold tracking-widest text-xs uppercase mb-4 block">Medical Integrity</span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter leading-none">
            Disease-specific nutrition, <br /> validated by data.
          </h2>
        </div>
        <p className="text-muted-foreground text-lg max-w-md">
          Precision recipes designed for Diabetes, PCOS, Heart Health, and Kidney care. Exact macros, verified ingredients.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {[
          { 
            title: "Diabetes Care", 
            desc: "Low glycemic index recipes that manage blood sugar without sacrificing flavor.",
            img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop"
          },
          { 
            title: "PCOS Management", 
            desc: "Hormone-balancing meals focused on anti-inflammatory whole foods and high fiber.",
            img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&auto=format&fit=crop"
          },
          { 
            title: "Heart Health", 
            desc: "Sodium-controlled, omega-rich cardiovascular plans for long-term vitality.",
            img: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=800&auto=format&fit=crop"
          }
        ].map((item, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -10 }}
            className="group relative h-[500px] overflow-hidden rounded-3xl cursor-pointer"
          >
            <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8 text-white">
              <h3 className="text-3xl font-bold mb-2 tracking-tight">{item.title}</h3>
              <p className="text-white/70 text-sm mb-6 max-w-xs">{item.desc}</p>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest group-hover:gap-4 transition-all">
                Explore Plan <ArrowRight className="size-4" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const SectionAIPlanning = () => (
  <section id="planning" className="py-24 md:py-32 bg-[#0a0a0a] text-white overflow-hidden">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid lg:grid-cols-2 gap-20 items-center">
        <div>
          <span className="text-[#00d4aa] font-bold tracking-widest text-xs uppercase mb-4 block">AI Intelligence</span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter leading-tight mb-8">
            Your meal plan, <br /> autonomously <br /> optimized.
          </h2>
          <div className="space-y-8">
            {[
              { title: "Precise Macros", desc: "Every ingredient weighed in code to match your TDEE and fitness goals." },
              { title: "Smart Substitutions", desc: "Out of kale? Our AI swaps it for the best nutritional alternative." },
              { title: "Grocery Automation", desc: "Your weekly plan automatically generates a sorted smart grocery list." }
            ].map((feature, i) => (
              <div key={i} className="flex gap-6">
                <div className="size-10 rounded-full bg-white/5 border border-white/10 flex-shrink-0 grid place-items-center text-[#00d4aa]">
                  <CheckCircle2 className="size-5" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">{feature.title}</h4>
                  <p className="text-white/50 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-20 bg-[#00d4aa]/10 blur-[100px] rounded-full" />
          <motion.div 
            initial={{ rotate: 5, y: 50 }}
            whileInView={{ rotate: 0, y: 0 }}
            viewport={{ once: true }}
            className="relative glass rounded-[2.5rem] border-white/10 p-8 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="font-display font-bold text-xl">Daily Plan</div>
              <div className="text-xs font-bold text-white/40 uppercase tracking-widest">May 13, 2026</div>
            </div>
            
            <div className="space-y-4">
              {[
                { time: "08:00", meal: "Matcha Chia Bowl", cal: 320, carb: 45, prot: 12, fat: 8 },
                { time: "13:00", meal: "Miso Glazed Salmon", cal: 540, carb: 12, prot: 42, fat: 28 },
                { time: "19:00", meal: "Lentil & Turmeric Stew", cal: 410, carb: 58, prot: 24, fat: 6 }
              ].map((m, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="text-[10px] font-bold text-white/40">{m.time}</div>
                    <div>
                      <div className="font-bold text-sm mb-0.5">{m.meal}</div>
                      <div className="text-[10px] text-white/30 uppercase tracking-widest">{m.cal} kcal</div>
                    </div>
                  </div>
                  <div className="flex gap-3 text-[9px] font-bold opacity-40 group-hover:opacity-100 transition-opacity">
                    <div>P: {m.prot}g</div>
                    <div>C: {m.carb}g</div>
                    <div>F: {m.fat}g</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-white/10">
              <div className="flex items-center justify-between text-xs font-bold mb-4">
                <span>Daily Target</span>
                <span className="text-[#00d4aa]">1,850 / 2,100 kcal</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "85%" }}
                  className="h-full bg-[#00d4aa] rounded-full shadow-[0_0_20px_rgba(0,212,170,0.5)]"
                />
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            className="absolute -right-12 top-1/2 -translate-y-1/2 p-6 glass rounded-3xl border-white/10 shadow-2xl hidden md:block"
          >
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-4 text-center">Macros</div>
            <div className="size-32 rounded-full border-8 border-white/5 relative grid place-items-center">
              <svg className="size-full -rotate-90">
                <circle cx="64" cy="64" r="56" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-[#00d4aa]" strokeDasharray="351" strokeDashoffset="100" />
                <circle cx="64" cy="64" r="56" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-blue-400" strokeDasharray="351" strokeDashoffset="240" />
                <circle cx="64" cy="64" r="56" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-orange-400" strokeDasharray="351" strokeDashoffset="300" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold">128g</span>
                <span className="text-[8px] uppercase tracking-widest text-white/40">Protein</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  </section>
);

const SectionCultural = () => (
  <section id="cultural" className="py-24 md:py-32 bg-muted/20">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center max-w-3xl mx-auto mb-20">
        <span className="text-muted-foreground font-bold tracking-widest text-xs uppercase mb-4 block">Cultural Heritage</span>
        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">40+ cuisines. Infinite stories.</h2>
        <p className="text-muted-foreground text-lg font-medium">
          Discover authentic recipes from Kerala to Kyoto. We don't just provide ingredients; we preserve techniques and cultural context.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
        {[
          { name: "Japanese", img: "https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=800&auto=format&fit=crop", span: "row-span-2 col-span-2 md:col-span-1" },
          { name: "Indian", img: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop", span: "md:col-span-2" },
          { name: "Mediterranean", img: "https://images.unsplash.com/photo-1544124499-58912cbddaad?w=800&auto=format&fit=crop", span: "" },
          { name: "Thai", img: "https://images.unsplash.com/photo-1559311648-d46f4d8593d8?w=800&auto=format&fit=crop", span: "md:col-span-2" },
          { name: "Mexican", img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop", span: "" },
        ].map((item, i) => (
          <div key={i} className={`relative overflow-hidden rounded-3xl group cursor-pointer h-64 md:h-auto min-h-[16rem] ${item.span}`}>
            <img src={item.img} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-2xl font-bold tracking-tighter drop-shadow-md">{item.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const SectionCTA = () => (
  <section className="py-24 md:py-32 px-6">
    <motion.div 
      whileInView={{ scale: [0.95, 1], opacity: [0, 1] }}
      className="max-w-7xl mx-auto rounded-[3rem] bg-[#004d40] text-white p-12 md:p-24 text-center relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] rounded-full bg-[#00d4aa] blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] rounded-full bg-blue-500 blur-[120px]" />
      </div>

      <div className="relative z-10">
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-8 leading-[0.9]">
          Ready to cook smart?
        </h2>
        <p className="text-lg md:text-xl text-white/70 max-w-xl mx-auto mb-12 font-medium">
          Join 50,000+ home cooks and health professionals using NutriVerse to master their nutrition.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link href="/auth?mode=register">
            <Button size="lg" className="rounded-full bg-white text-[#004d40] hover:bg-white/90 px-10 py-8 text-xl font-bold h-auto shadow-2xl">
              Create your free account
            </Button>
          </Link>
          <Link href="/explore" className="text-white font-bold flex items-center gap-2 hover:gap-4 transition-all">
            Browse Recipes <ArrowRight className="size-5" />
          </Link>
        </div>
      </div>
    </motion.div>
  </section>
);

const Footer = () => (
  <footer className="py-12 border-t bg-muted/30">
    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
      <div className="flex items-center gap-2">
        <div className="size-6 rounded nv-gradient-hc grid place-items-center text-black font-bold text-[10px]">N</div>
        <span className="font-display font-bold tracking-tight">NutriVerse</span>
      </div>
      <div className="flex gap-8 text-xs font-bold text-muted-foreground uppercase tracking-widest">
        <Link href="#">Terms</Link>
        <Link href="#">Privacy</Link>
        <Link href="#">Contact</Link>
      </div>
      <p className="text-xs text-muted-foreground">© 2026 NutriVerse AI. All rights reserved.</p>
    </div>
  </footer>
);

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-[#00d4aa]/30">
      <Nav />
      <SectionHero />
      <SectionTrust />
      <SectionHealthcare />
      <SectionAIPlanning />
      <SectionCultural />
      <SectionCTA />
      <Footer />
    </div>
  );
}
