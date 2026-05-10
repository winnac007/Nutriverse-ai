"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, HeartPulse, Dumbbell, Globe2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="size-8 rounded-lg nv-gradient-hc grid place-items-center text-black font-bold">N</div>
          <span className="font-display text-xl font-bold tracking-tight">NutriVerse</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/auth" className="text-sm text-muted-foreground hover:text-foreground">Sign in</Link>
          <Link href="/auth?mode=register">
            <Button className="rounded-full">Get started <ArrowRight className="size-4 ml-1" /></Button>
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1714842981153-ffeaf74e7a1a?w=1600" alt="" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 nv-hero-overlay" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 py-24 sm:py-32 text-center">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-xs uppercase tracking-[0.3em] text-[#00d4aa] mb-6">Food · Nutrition · Wellness</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter">
            Cook the right food,<br />with the right ingredients.
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Personalized recipes for healthcare conditions, fitness goals, and global cuisines — with precise nutrition, exact amounts, and AI meal planning.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link href="/auth?mode=register"><Button size="lg" className="rounded-full px-8">Start cooking smart</Button></Link>
            <Link href="/auth"><Button size="lg" variant="outline" className="rounded-full px-8">Sign in</Button></Link>
          </motion.div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { title: "Healthcare", icon: HeartPulse, color: "nv-gradient-hc", desc: "Disease-specific recipes for diabetes, PCOS, heart & kidney care." },
            { title: "Fitness", icon: Dumbbell, color: "nv-gradient-ft", desc: "TDEE, macros, and goal-based meals for every training phase." },
            { title: "Cultural", icon: Globe2, color: "nv-gradient-cu", desc: "40+ cuisines, regional stories, authentic techniques." },
          ].map((c) => (
            <div key={c.title} className="nv-card p-6">
              <div className={`size-12 rounded-2xl grid place-items-center text-white ${c.color}`}><c.icon className="size-6" /></div>
              <h3 className="mt-4 font-display text-2xl font-semibold">{c.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
