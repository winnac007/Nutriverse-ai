import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";
import { Sprout } from "lucide-react";

const HERO = "https://customer-assets.emergentagent.com/job_nutriverse-preview/artifacts/x6r3i5w1_eccac6cd-619e-4eb1-be44-a84e3afa84dc.jpeg";

export default function Landing() {
  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "#efe7d4" }}>
      {/* Full-bleed hero background */}
      <div className="absolute inset-0">
        <img src={HERO} alt="A Zenplato bowl with olive leaves and warm light" className="w-full h-full object-cover" />
        {/* Soft ivory wash for legibility on the top half */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(244,241,232,0.35) 0%, rgba(244,241,232,0.05) 30%, rgba(244,241,232,0) 60%, rgba(244,241,232,0.55) 95%, rgba(244,241,232,0.85) 100%)",
          }}
        />
      </div>

      {/* Top-right sign-in link */}
      <header className="relative z-10 max-w-3xl mx-auto px-6 pt-6 flex justify-end">
        <Link
          to="/auth"
          data-testid="landing-signin"
          className="text-[11px] font-medium tracking-[0.25em] uppercase px-4 py-2 rounded-full"
          style={{ color: "#2e2a26", background: "rgba(244,241,232,0.6)", backdropFilter: "blur(6px)" }}
        >
          I have an account
        </Link>
      </header>

      <main className="relative z-10 max-w-md mx-auto px-6 pt-12 sm:pt-20 pb-12 flex flex-col items-center text-center min-h-screen">
        {/* Brand mark */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          {/* Decorative ring + leaf */}
          <div className="relative mx-auto mb-4" style={{ width: 110, height: 110 }}>
            <svg viewBox="0 0 110 110" className="absolute inset-0">
              <path d="M15 55 A40 40 0 0 1 95 55" fill="none" stroke="#5e6b55" strokeWidth="1.4" strokeLinecap="round" opacity="0.85" />
            </svg>
            <div className="absolute inset-0 grid place-items-center">
              <Sprout className="size-10" style={{ color: "#5e6b55" }} />
            </div>
          </div>
          <h1
            className="font-display font-semibold uppercase"
            style={{
              color: "#2e2a26",
              fontFamily: "Playfair Display, serif",
              letterSpacing: "0.32em",
              fontSize: "2.1rem",
              lineHeight: 1,
            }}
            data-testid="zp-wordmark"
          >
            Zenplato
          </h1>
          <div className="mt-4 space-y-0">
            <p className="text-lg" style={{ color: "#2e2a26", fontFamily: "DM Sans, sans-serif" }}>Mindful nutrition.</p>
            <p className="text-lg" style={{ color: "#2e2a26", fontFamily: "DM Sans, sans-serif" }}>Balanced living.</p>
          </div>
          {/* Small leaf glyph */}
          <svg viewBox="0 0 40 16" className="mx-auto mt-4 w-10 h-4">
            <path d="M4 8 Q12 0 20 8 Q28 16 36 8" fill="none" stroke="#b59b5a" strokeWidth="1.4" />
            <ellipse cx="20" cy="8" rx="3" ry="1.5" fill="#b59b5a" opacity="0.85" />
          </svg>
        </motion.div>

        <div className="flex-1" />

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7 }}
          className="w-full max-w-sm space-y-4 mt-8"
        >
          <Link to="/auth?mode=register" className="block">
            <Button
              data-testid="hero-cta"
              className="w-full rounded-full h-14 text-base font-medium border-0 hover:opacity-95"
              style={{ background: "#5e6b55", color: "#f4f1e8" }}
            >
              Get Started
            </Button>
          </Link>
          <Link to="/auth" data-testid="hero-signin" className="block text-center text-sm font-medium" style={{ color: "#2e2a26" }}>
            I have an account
          </Link>
          <p className="text-[11px] italic text-center pt-3" style={{ color: "#6b6258" }}>
            You are the zen for your body.
          </p>
        </motion.div>
      </main>
    </div>
  );
}
