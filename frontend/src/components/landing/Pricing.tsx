import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function Pricing() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || submitting) return;
    setSubmitting(true);
    setError(null);
    const { error: dbError } = await supabase
      .from("early_access_signups")
      .insert({
        email: email.trim().toLowerCase(),
        source: "pricing_section",
        user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
      });
    setSubmitting(false);
    if (dbError) {
      if (dbError.code === "23505") {
        // duplicate — still a success from the user's POV
        setSent(true);
      } else {
        setError("Something went wrong. Please try again.");
      }
      return;
    }
    setSent(true);
  }

  return (
    <section id="early-access" className="px-6 md:px-12 py-32 bg-sage/10">
      <div className="max-w-4xl mx-auto">
        <div className="p-8 md:p-16 rounded-[3rem] bg-editorial text-ivory relative overflow-hidden shadow-2xl">
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="eyebrow text-sage mb-6">Early access</p>
              <h2 className="font-serif text-4xl md:text-6xl leading-[1.05] mb-6">
                Join the first
                <br />
                <em className="not-italic text-sage">1,000.</em>
              </h2>
              <p className="text-ivory/70 text-lg max-w-sm mb-8">
                Lifetime perks for early members. Unlock the full recipe library at <span className="text-white font-serif italic text-2xl">₹99</span>.
              </p>
              
              <div className="flex items-center gap-4 py-6 border-y border-white/10">
                <div>
                  <p className="text-white font-serif text-xl">₹99</p>
                  <p className="text-[10px] uppercase tracking-widest text-ivory/40">Early Price</p>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div>
                  <p className="text-ivory/50 line-through">₹499</p>
                  <p className="text-[10px] uppercase tracking-widest text-ivory/40">Regular</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10">
              {sent ? (
                <div className="text-center py-8">
                  <p className="font-serif text-3xl text-sage mb-2">You're on the list 🌿</p>
                  <p className="text-ivory/60 text-sm">We'll write when the kitchen opens.</p>
                </div>
              ) : (
                <>
                  <p className="font-serif text-xl mb-6 text-ivory/90">One quiet email. No spam, ever.</p>
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      disabled={submitting}
                      className="w-full px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:border-sage transition disabled:opacity-60"
                    />
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full px-8 py-4 rounded-full bg-sage text-black font-bold hover:bg-white hover:translate-y-[-2px] transition-all disabled:opacity-60 disabled:hover:translate-y-0"
                    >
                      {submitting ? "Joining…" : "Join early access →"}
                    </button>
                  </form>
                  {error && <p className="mt-4 text-xs text-red-400 text-center">{error}</p>}
                </>
              )}
            </div>
          </div>

          {/* Background Decor */}
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-sage/20 blur-[100px]" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-gold/10 blur-[100px]" />
        </div>
      </div>
    </section>
  );
}