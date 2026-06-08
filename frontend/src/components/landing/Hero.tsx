const heroBowl = "/landing/hero-bowl.jpg";

const tags = [
  { label: "Diabetes friendly", top: "8%", left: "-8%", delay: "0.6s" },
  { label: "PCOS smart swaps", top: "22%", right: "-10%", delay: "1.2s" },
  { label: "High protein", bottom: "30%", left: "-12%", delay: "1.8s" },
  { label: "Mediterranean", bottom: "8%", right: "-6%", delay: "2.4s" },
];

export function Hero() {
  return (
    <section id="top" className="relative min-h-screen bg-ivory pt-28 pb-20 px-6 md:px-12 overflow-hidden">
      <div aria-hidden className="absolute -top-32 -left-32 w-[28rem] h-[28rem] rounded-full bg-sage/40 blur-3xl pointer-events-none animate-float" />
      <div aria-hidden className="absolute -bottom-40 -right-32 w-[32rem] h-[32rem] rounded-full bg-olive/20 blur-3xl pointer-events-none animate-float" style={{ animationDelay: "2s" }} />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative">
        <div className="animate-fade-up">
          <p className="eyebrow text-olive mb-6">Pre-launch · Early access open</p>
          <h1 className="font-serif text-[clamp(2.75rem,6vw,5.25rem)] leading-[1.02] text-espresso">
            <em className="text-olive not-italic">Your Food Intelligence Companion.</em>
            <br />
          </h1>
          <p className="mt-8 text-lg text-espresso/70 max-w-md leading-relaxed">
            Personalized nutrition for real life — rooted in health, fitness and global food wisdom.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <a
              href="#early-access"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-olive text-ivory hover:bg-[var(--olive-deep)] transition shadow-[0_10px_40px_-12px_rgba(138,149,118,0.5)]"
            >
              Join Early Access
              <span className="w-1.5 h-1.5 rounded-full bg-ivory group-hover:translate-x-1 transition" />
            </a>
            <a href="#journeys" className="text-espresso/70 hover:text-olive transition text-sm border-b border-espresso/30 pb-1">
              Explore how it works ↓
            </a>
          </div>
        </div>

        <div className="relative animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <div className="relative aspect-square max-w-xl mx-auto">
            <div className="absolute inset-0 rounded-full bg-sage/40 blur-3xl" />
            <img
              src={heroBowl}
              alt="A balanced ceramic bowl with quinoa, chickpeas, avocado and microgreens"
              width={1280}
              height={1280}
              className="relative rounded-[2rem] object-cover w-full h-full shadow-[0_30px_80px_-30px_rgba(74,64,54,0.4)]"
            />
            {tags.map((t) => (
              <span
                key={t.label}
                className="absolute px-4 py-2 rounded-full bg-ivory/90 backdrop-blur border border-stone/50 text-xs text-espresso shadow-md animate-fade-up whitespace-nowrap"
                style={{
                  top: t.top,
                  left: t.left,
                  right: t.right,
                  bottom: t.bottom,
                  animationDelay: t.delay,
                }}
              >
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-olive mr-2 align-middle animate-pulse-soft" />
                {t.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}