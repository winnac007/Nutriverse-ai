import { useState } from "react";

const fitnessImg = "/landing/fitness-plate.jpg";

type Meal = {
  name: string;
  macros: [number, number, number];
  tag: string;
  recipes: string[];
};

const meals: Meal[] = [
  { name: "Muscle gain", macros: [42, 60, 18], tag: "Gym", recipes: ["Paneer tikka bowl", "Chicken quinoa", "Egg-oats stack"] },
  { name: "Fat loss", macros: [35, 30, 14], tag: "Cut", recipes: ["Moong cheela", "Grilled fish salad", "Veg poha"] },
  { name: "Pre-workout", macros: [18, 45, 8], tag: "Fuel", recipes: ["Banana peanut toast", "Date energy balls", "Coffee oats"] },
  { name: "Post-workout", macros: [38, 52, 10], tag: "Recover", recipes: ["Whey smoothie", "Sprouts bhel", "Tofu rice"] },
  { name: "Yoga & calm", macros: [22, 48, 16], tag: "Flow", recipes: ["Khichdi", "Coconut curry", "Herbal kanji"] },
  { name: "Balanced", macros: [30, 40, 20], tag: "Daily", recipes: ["Dal-rice bowl", "Greek salad", "Veg pulao"] },
];

const flow = ["Your goal", "Smart macros", "Personalised recipes", "Strength & balance"];

export function Fitness() {
  const [active, setActive] = useState<string>("Muscle gain");
  const current = meals.find((m) => m.name === active)!;

  return (
    <section id="fitness" className="px-6 md:px-12 py-32 bg-ivory relative overflow-hidden">
      <div className="absolute top-40 -left-20 w-80 h-80 rounded-full bg-olive/10 blur-3xl" />

      <div className="max-w-6xl mx-auto relative">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 items-end mb-16">
          <div>
            <p className="eyebrow text-olive mb-4">Chapter two · Strength & Fuel</p>
            <h2 className="font-serif text-4xl md:text-6xl text-espresso leading-[1.05]">
              Fuel your goals,
              <br />
              <em className="text-olive not-italic">without food stress.</em>
            </h2>
          </div>
          <p className="text-espresso/65 max-w-md">
            Yoga, gym, meditation, an active life — meals that move with you. Pick your goal, see the macros and recipes shift instantly.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs mb-12">
          {flow.map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-full bg-sage/30 text-espresso/80">{step}</span>
              {i < flow.length - 1 && <span className="text-olive/60">→</span>}
            </div>
          ))}
        </div>

        {/* Interactive macro showcase */}
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-6">
          {/* Left: image w/ active recipe overlay */}
          <div className="relative rounded-3xl overflow-hidden h-[480px] group">
            <img src={fitnessImg} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-editorial/85 via-editorial/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-ivory">
              <p className="eyebrow text-ivory/60 mb-2">{current.tag} · today's plate</p>
              <h3 className="font-serif text-3xl mb-4">{current.name}</h3>
              <div className="flex items-end gap-3 h-24 mb-5 max-w-[220px]">
                {["P", "C", "F"].map((label, i) => {
                  const val = current.macros[i];
                  return (
                    <div key={label} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full rounded-t-md bg-sage transition-all duration-700" style={{ height: `${val * 1.4}px` }} />
                      <span className="text-[10px] text-ivory/60">{label} {val}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-wrap gap-2">
                {current.recipes.map((r) => (
                  <span key={r} className="text-xs px-3 py-1 rounded-full bg-ivory/15 backdrop-blur border border-ivory/20">{r}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: goal selector grid — varied sizes */}
          <div className="grid grid-cols-2 grid-rows-3 gap-3">
            {meals.map((m, i) => {
              const isActive = active === m.name;
              const span = i === 0 ? "col-span-2" : "";
              return (
                <button
                  key={m.name}
                  onClick={() => setActive(m.name)}
                  onMouseEnter={() => setActive(m.name)}
                  className={`${span} group relative rounded-2xl p-5 text-left border transition-all duration-500 overflow-hidden ${
                    isActive
                      ? "bg-olive text-ivory border-olive shadow-[0_20px_40px_-15px_rgba(138,149,118,0.6)] -translate-y-0.5"
                      : "bg-ivory border-stone/40 hover:border-olive/60 hover:-translate-y-0.5"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`eyebrow ${isActive ? "text-ivory/70" : "text-olive"}`}>{m.tag}</span>
                    <span className={`text-xs ${isActive ? "text-ivory/80" : "text-espresso/40"}`}>0{i + 1}</span>
                  </div>
                  <h3 className={`font-serif text-xl leading-tight ${isActive ? "text-ivory" : "text-espresso"}`}>{m.name}</h3>
                  <p className={`text-[11px] mt-1 ${isActive ? "text-ivory/70" : "text-espresso/50"}`}>
                    P {m.macros[0]} · C {m.macros[1]} · F {m.macros[2]}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <a href="#early-access" className="mt-14 inline-flex items-center gap-3 px-8 py-4 rounded-full bg-olive text-ivory hover:bg-[var(--olive-deep)] hover:translate-x-1 transition-all">
          Build your food routine →
        </a>
      </div>
    </section>
  );
}
