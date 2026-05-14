"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Leaf, Sparkles, Heart, ChevronRight } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    title: "Eat with intention",
    subtitle: "Mindful eating for a healthier you.",
    image: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=1200&auto=format&fit=crop",
    features: [
      { icon: Leaf, text: "Mindful choices" },
      { icon: Sparkles, text: "Personalized nutrition" },
      { icon: Heart, text: "Lasting wellness" }
    ]
  }
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const step = steps[currentStep];

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden max-w-md mx-auto relative">
      {/* Top Bar */}
      <div className="absolute top-8 left-8 right-8 z-20 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
            <div className="size-6 rounded-full bg-primary grid place-items-center text-primary-foreground">
                <Leaf className="size-3" />
            </div>
            <span className="font-serif text-lg tracking-tight text-foreground">ZENPLATE</span>
        </Link>
        <button className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 hover:text-foreground">Skip</button>
      </div>

      {/* Main Image */}
      <div className="h-[55vh] relative overflow-hidden rounded-b-[3rem] shadow-2xl">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentStep}
            src={step.image}
            alt={step.title}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col px-10 pt-12 pb-10">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1"
        >
          <h1 className="text-4xl font-serif text-foreground mb-4 leading-tight">
            {step.title}
          </h1>
          <p className="text-lg text-foreground/50 mb-10 font-serif italic">
            "{step.subtitle}"
          </p>

          <div className="space-y-6 mb-12">
            {step.features.map((f, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-5 group"
              >
                <div className="size-10 rounded-full glass-zen grid place-items-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-sm border border-border/20">
                  <f.icon className="size-4" />
                </div>
                <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-foreground/60 group-hover:text-foreground transition-colors">
                  {f.text}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                  <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === currentStep ? "w-6 bg-primary" : "w-1.5 bg-border"}`} />
              ))}
          </div>
          
          <Link href="/onboarding/personalize">
              <Button size="lg" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-10 h-14 text-base font-bold group shadow-lg shadow-primary/20">
                  Next
                  <ChevronRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
              </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
