"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf } from "lucide-react";
import { motion } from "framer-motion";

const Nav = () => (
  <header className="fixed top-0 left-0 right-0 z-50 bg-white/60 backdrop-blur-xl border-b border-border/10">
    <div className="max-w-7xl mx-auto px-10 py-6 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2">
        <div className="size-8 rounded-full bg-primary grid place-items-center text-primary-foreground">
          <Leaf className="size-4" />
        </div>
        <span className="font-serif text-2xl tracking-tighter text-foreground uppercase">ZENPLATE</span>
      </Link>
      <div className="hidden lg:flex items-center gap-12 text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/40">
        <Link href="#" className="hover:text-primary transition-colors">Features</Link>
        <Link href="#" className="hover:text-primary transition-colors">How it Works</Link>
        <Link href="#" className="hover:text-primary transition-colors">Recipes</Link>
        <Link href="#" className="hover:text-primary transition-colors">Blog</Link>
      </div>
      <Link href="/onboarding">
        <Button className="rounded-full bg-foreground text-background hover:bg-primary transition-all px-8 py-6 h-auto text-[11px] font-bold uppercase tracking-widest shadow-xl shadow-foreground/5">
          Download App
        </Button>
      </Link>
    </div>
  </header>
);

export default function Landing() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/10 selection:text-primary overflow-hidden">
      <Nav />
      
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 lg:pt-60 lg:pb-40">
        <div className="max-w-7xl mx-auto px-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-serif text-foreground leading-[0.9] mb-10 tracking-tighter">
                Your Plate. <br />
                Your Peace. <br />
                <span className="text-primary italic">Your Health.</span>
              </h1>
              <p className="text-xl lg:text-2xl text-foreground/50 max-w-lg mb-14 leading-relaxed font-serif">
                AI-powered nutrition plans for your body, your goals, and your life.
              </p>
              <div className="flex items-center gap-10">
                <Link href="/onboarding">
                  <Button className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-12 py-8 text-lg h-auto shadow-2xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                    Get Started
                  </Button>
                </Link>
                <Link href="#" className="text-foreground font-bold text-lg border-b-2 border-foreground/10 hover:border-primary transition-all pb-1 flex items-center gap-2 group">
                  Learn More
                  <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-[4/5] lg:aspect-square rounded-[4rem] overflow-hidden shadow-2xl shadow-foreground/5 relative group">
                <img 
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1400&auto=format&fit=crop" 
                  alt="Zen Buddha Bowl" 
                  className="w-full h-full object-cover transition-transform duration-[4s] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 size-40 bg-primary/5 rounded-full blur-[80px]" />
              <div className="absolute -bottom-20 -left-20 size-60 bg-accent/5 rounded-full blur-[100px]" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-40 bg-white/40 border-y border-border/10">
        <div className="max-w-7xl mx-auto px-10 text-center">
            <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-primary/60 mb-8 block">Zen Philosophy</span>
            <h2 className="font-serif text-5xl md:text-7xl text-foreground mb-12">Eat with Intention.</h2>
            <div className="grid md:grid-cols-3 gap-20 max-w-5xl mx-auto mt-32 text-left">
                {[
                    { title: "Wabi-Sabi", desc: "Finding beauty in the imperfect and natural flow of nourishment." },
                    { title: "Mindfulness", desc: "Presence in every bite. Listening to the wisdom of your body." },
                    { title: "Balance", desc: "Harmonizing ancient rituals with modern AI-driven health science." }
                ].map((p, i) => (
                    <div key={i} className="space-y-6 group">
                        <div className="size-12 rounded-full border border-border/40 grid place-items-center text-lg font-serif group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                            0{i + 1}
                        </div>
                        <h3 className="font-serif text-3xl text-foreground">{p.title}</h3>
                        <p className="text-foreground/50 leading-relaxed font-serif italic text-lg">{p.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>
    </div>
  );
}
