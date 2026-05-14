"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Leaf, ChevronRight, Activity, Zap, Heart, Wind } from "lucide-react";
import Link from "next/link";

const conditions = [
  { id: "pcos", title: "PCOS", subtitle: "Hormonal balance", icon: <Zap /> },
  { id: "diabetes", title: "Diabetes", subtitle: "Blood sugar management", icon: <Activity /> },
  { id: "thyroid", title: "Thyroid", subtitle: "Thyroid support", icon: <Wind /> },
  { id: "heart", title: "Heart Health", subtitle: "Heart friendly nutrition", icon: <Heart /> },
];

export default function Personalize() {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center pt-24 px-8 pb-10 max-w-md mx-auto">
      {/* Top Nav */}
      <div className="absolute top-8 left-8 right-8 flex justify-between items-center">
        <button onClick={() => window.history.back()} className="size-10 rounded-full glass-zen grid place-items-center text-foreground/40 hover:text-foreground border border-border/20">
            <ChevronRight className="size-5 rotate-180" />
        </button>
        <div className="flex items-center gap-2">
            <div className="size-5 rounded-full bg-primary grid place-items-center text-primary-foreground">
                <Leaf className="size-3" />
            </div>
            <span className="font-serif text-sm tracking-tight text-foreground uppercase">ZENPLATE</span>
        </div>
        <div className="size-10" /> {/* Spacer */}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full mb-12"
      >
        <h1 className="text-4xl font-serif text-foreground mb-3">Tell us about you</h1>
        <p className="text-sm text-foreground/40 font-serif italic">
          "So we can personalize your ritual"
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 w-full mb-12">
        {conditions.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => toggle(c.id)}
            className={`cursor-pointer p-6 rounded-[2rem] border-2 transition-all duration-500 flex items-center gap-5 group ${
              selected.includes(c.id) 
                ? "bg-primary border-primary text-primary-foreground shadow-xl shadow-primary/20" 
                : "bg-white border-border/40 hover:border-primary/30"
            }`}
          >
            <div className={`size-14 rounded-2xl grid place-items-center transition-all duration-500 ${
              selected.includes(c.id) 
                ? "bg-primary-foreground/20 text-primary-foreground" 
                : "bg-primary/5 text-primary group-hover:scale-110"
            }`}>
              {React.cloneElement(c.icon as React.ReactElement, { className: "size-6" })}
            </div>
            <div className="text-left flex-1">
              <h3 className="font-serif text-xl mb-0.5">{c.title}</h3>
              <p className={`text-[10px] uppercase tracking-widest font-bold ${
                selected.includes(c.id) ? "text-primary-foreground/60" : "text-foreground/30"
              }`}>
                {c.subtitle}
              </p>
            </div>
            {selected.includes(c.id) && (
                <div className="size-6 rounded-full bg-primary-foreground/20 grid place-items-center">
                    <Leaf className="size-3 text-primary-foreground" />
                </div>
            )}
          </motion.div>
        ))}
      </div>

      <button className="w-full py-6 rounded-[2rem] border-2 border-dashed border-border/40 text-[10px] font-bold uppercase tracking-widest text-foreground/30 hover:text-primary hover:border-primary transition-all mb-12">
        Other Condition
      </button>

      <div className="mt-auto w-full">
        <Link href="/app">
            <Button size="lg" className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 h-16 text-base font-bold group shadow-lg shadow-primary/20">
                Continue
                <ChevronRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
            </Button>
        </Link>
      </div>
    </div>
  );
}
