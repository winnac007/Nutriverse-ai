import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { SectionLabel } from "./SectionLabel";

const TIERS = [
  { name: "Seedling", price: "Free forever", perks: ["10 personalized recipes / wk", "1 health focus", "Daily mindful prompts"] },
  { name: "Grove", price: "Early access", perks: ["Full recipe library", "All three journeys", "Adaptive weekly plan", "Grocery sync"], featured: true },
  { name: "Garden", price: "Founding member", perks: ["Everything in Grove", "1:1 nutritionist chat", "Travel-the-plate concierge", "Locked-in lifetime pricing"] },
];

export function Waitlist() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <section id="waitlist" className="relative bg-ivory py-24 md:py-40">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-14 max-w-3xl">
          <SectionLabel index="VI">Early access</SectionLabel>
          <h2 className="mt-6 font-serif text-[40px] leading-[1.05] text-espresso md:text-[60px]">
            Be among the first<br />to <span className="italic text-olive">eat differently.</span>
          </h2>
          <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-espresso/70">
            Zenplato opens in waves. Founding members get a calmer pace, early-access pricing, and a hand in shaping the platform.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Form */}
          <div className="md:col-span-5">
            <div className="rounded-[28px] bg-cream p-8 md:p-10">
              <p className="eyebrow mb-5">Join the waitlist</p>
              {done ? (
                <div className="flex items-start gap-3 rounded-2xl bg-sage-soft/60 p-5">
                  <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-olive text-ivory">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="font-serif text-[20px] text-espresso">You're on the list.</p>
                    <p className="mt-1 text-[13px] text-espresso/65">We'll send a quiet note when your wave opens.</p>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={(e) => { e.preventDefault(); if (email) setDone(true); }}
                  className="flex flex-col gap-3"
                >
                  <input
                    type="email"
                    required
                    placeholder="you@kitchen.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-full border border-espresso/15 bg-ivory px-5 py-4 text-[15px] text-espresso placeholder:text-espresso/35 focus:border-olive focus:outline-none"
                  />
                  <button type="submit" className="group inline-flex items-center justify-center gap-2 rounded-full bg-olive px-6 py-4 text-[14px] font-medium text-ivory transition hover:bg-olive-deep">
                    Reserve my spot <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </form>
              )}
              <p className="mt-5 text-[12px] text-espresso/55">
                Free to join. Founding pricing locked for life.
              </p>
            </div>
          </div>

          {/* Tiers */}
          <div className="md:col-span-7">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {TIERS.map((t) => (
                <div key={t.name} className={`flex flex-col gap-5 rounded-[24px] p-7 ${t.featured ? "bg-espresso text-ivory" : "border border-espresso/12 bg-cream/40"}`}>
                  <div>
                    <p className={`font-serif text-[26px] ${t.featured ? "text-gold" : "text-espresso"}`}>{t.name}</p>
                    <p className={`mt-1 text-[12px] tracking-wider uppercase ${t.featured ? "text-ivory/60" : "text-espresso/55"}`}>{t.price}</p>
                  </div>
                  <ul className="flex flex-col gap-3">
                    {t.perks.map((p) => (
                      <li key={p} className={`flex items-start gap-2.5 text-[13px] ${t.featured ? "text-ivory/85" : "text-espresso/75"}`}>
                        <span className={`mt-1.5 h-1 w-1 flex-shrink-0 rounded-full ${t.featured ? "bg-gold" : "bg-olive"}`} />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}