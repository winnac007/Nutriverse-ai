import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../components/Logo";

const HERO_1 = "https://customer-assets.emergentagent.com/job_nutriverse-preview/artifacts/ze5tyr90_b3135b09-bc03-422c-b9f6-9c11e8f33176.jpeg";
const HERO_2 = "https://customer-assets.emergentagent.com/job_nutriverse-preview/artifacts/28mwp314_9b9c2ff2-9f48-440e-aa2b-d3ef12165c5c.jpeg";

export default function Landing() {
  const [slide, setSlide] = useState(0);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "#f7f3e7" }}>
      <header className="relative max-w-6xl mx-auto px-6 py-5 flex items-center justify-between z-10">
        <Logo size="sm" />
        <Link to="/auth" data-testid="landing-signin" className="text-xs font-medium tracking-wider uppercase" style={{ color: "#2e2a26" }}>I have an account</Link>
      </header>

      <main className="relative max-w-md mx-auto px-0 pb-16">
        <AnimatePresence mode="wait">
          {slide === 0 ? (
            <motion.section key="s1"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }} className="text-center">
              <div className="px-6">
                <Logo size="xl" className="justify-center mt-6 mb-2" />
                <p className="font-display text-lg mt-2" style={{ color: "#2e2a26" }}>Mindful nutrition.</p>
                <p className="font-display text-lg" style={{ color: "#2e2a26" }}>Balanced living.</p>
              </div>
              <div className="mt-8 px-4">
                <div className="relative rounded-3xl overflow-hidden" style={{ boxShadow: "0 20px 50px rgba(60,50,30,0.12)" }}>
                  <img src={HERO_1} alt="A nourishing Zenplato bowl" className="w-full" />
                </div>
              </div>
              <div className="px-6 mt-10 space-y-4">
                <Button data-testid="landing-getstarted" onClick={() => setSlide(1)}
                  className="w-full rounded-full h-14 text-base font-medium border-0 hover:opacity-90"
                  style={{ background: "#5e6b55", color: "#f4f1e8" }}>
                  Get Started <ArrowRight className="size-4 ml-2" />
                </Button>
                <Link to="/auth" className="block text-center text-sm font-medium" style={{ color: "#2e2a26" }}>I have an account</Link>
              </div>
              <p className="text-xs italic mt-8" style={{ color: "#6b6258" }}>You are the zen for your body.</p>
            </motion.section>
          ) : (
            <motion.section key="s2"
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }} className="relative">
              <div className="relative aspect-[3/4] overflow-hidden">
                <img src={HERO_2} alt="" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(247,243,231,0.4) 0%, rgba(247,243,231,0.85) 75%, #f7f3e7 100%)" }} />
                <div className="absolute inset-0 flex flex-col justify-end px-6 pb-12">
                  <h1 className="font-display text-4xl sm:text-5xl leading-[1.1]" style={{ color: "#2e2a26" }}>
                    A calmer<br />relationship<br />with what<br />you eat.
                  </h1>
                  <p className="text-sm mt-4 max-w-[20ch]" style={{ color: "#5b554d" }}>
                    Personalized nutrition guided by mindfulness and real life.
                  </p>
                </div>
              </div>
              <div className="px-6 mt-2 space-y-4">
                <Link to="/auth?mode=register">
                  <Button data-testid="hero-cta"
                    className="w-full rounded-full h-14 text-base font-medium border-0 hover:opacity-90"
                    style={{ background: "#5e6b55", color: "#f4f1e8" }}>
                    Get Started <ArrowRight className="size-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/auth" data-testid="hero-signin" className="block text-center text-sm font-medium" style={{ color: "#2e2a26" }}>
                  I have an account
                </Link>
                <button onClick={() => setSlide(0)} className="block mx-auto text-xs underline pt-2" style={{ color: "#6b6258" }}>← Back</button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Pagination dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {[0, 1].map((i) => (
            <button key={i} onClick={() => setSlide(i)} aria-label={`Slide ${i + 1}`}
              className="size-2 rounded-full transition-all"
              style={{ background: slide === i ? "#5e6b55" : "#d4cab8" }} />
          ))}
        </div>
      </main>
    </div>
  );
}
