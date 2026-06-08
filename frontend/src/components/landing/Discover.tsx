import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const worldMap = "/landing/map-new.jpeg";

type Place = {
  name: string;
  tag: string;
  note: string;
  dishes: string[];
  x: string;
  y: string;
  image: string;
};

const places: Place[] = [
  { 
    name: "Mexico", 
    tag: "Vibrant", 
    note: "Fibre-rich, plant-forward, slow-cooked corn & beans.", 
    dishes: ["Black bean tacos", "Charred corn salad", "Pozole verde"], 
    x: "24%", y: "55%",
    image: "/landing/hero-bowl.jpg" 
  },
  { 
    name: "Mediterranean", 
    tag: "Fresh", 
    note: "Olive oil, legumes, greens — heart-soft eating.", 
    dishes: ["Greek farro bowl", "Lemon-herb chickpeas", "Grilled sea bass"], 
    x: "50%", y: "35%",
    image: "/landing/dish-greece.jpg"
  },
  { 
    name: "India", 
    tag: "Flavorful", 
    note: "Spices that support gut, insulin and immunity.", 
    dishes: ["Millet khichdi", "Methi thepla", "Sambar bowl"], 
    x: "70%", y: "52%",
    image: "/landing/dish-india.jpg"
  },
  { 
    name: "Japan", 
    tag: "Simple", 
    note: "Portion balance, longevity, mindful plates.", 
    dishes: ["Miso & greens", "Salmon donburi", "Soba bowl"], 
    x: "88%", y: "38%",
    image: "/landing/dish-japan.jpg"
  },
  { 
    name: "Korea", 
    tag: "Balanced", 
    note: "Fermented foods for a happy microbiome.", 
    dishes: ["Bibimbap", "Kimchi jjigae", "Japchae"], 
    x: "84%", y: "38%",
    image: "/landing/discover-bowl.jpg"
  },
];

export function Discover() {
  const [active, setActive] = useState<string>("India");
  const [hovered, setHovered] = useState<string | null>(null);
  
  const current = places.find((p) => p.name === active)!;

  return (
    <section id="discover" className="py-32 bg-[#050505] relative overflow-hidden">
      {/* Header - Constrained width */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 mb-12">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 items-end">
          <div>
            <p className="eyebrow text-olive mb-4">Chapter three · Travel the Plate</p>
            <h2 className="font-serif text-4xl md:text-6xl text-ivory leading-[1.05]">
              Travel the world,
              <br />
              <em className="not-italic text-olive">through food wisdom.</em>
            </h2>
          </div>
          <p className="text-ivory/60 max-w-sm">
            Discover how cultures eat, cook and stay healthy — then bring it gently into your own kitchen.
          </p>
        </div>
      </div>

      {/* Dark interactive map - Truly Full Wide */}
      <div className="w-full mb-16">
        <div className="relative bg-[#0a0a0a] border-y border-white/5 shadow-2xl overflow-visible">
          <div className="relative overflow-hidden">
            <img src={worldMap} alt="World cuisines map" loading="lazy" className="w-full block opacity-80" />
            
            {/* Ambient glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-60" />
          </div>

          {/* Interactive Layer */}
          <div className="absolute inset-0 z-10">
            {places.map((p) => {
              const isActive = active === p.name;
              const isHovered = hovered === p.name;
              const showDetail = isActive || isHovered;

              return (
                <div
                  key={p.name}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: p.x, top: p.y }}
                >
                  <button
                    onMouseEnter={() => setHovered(p.name)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => setActive(p.name)}
                    className="relative z-30 group"
                    aria-label={p.name}
                  >
                    {/* Animated Ripple */}
                    {showDetail && (
                      <motion.span 
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 2.5, opacity: 0 }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                        className="absolute inset-0 rounded-full bg-olive/40 blur-md"
                      />
                    )}

                    <span className={`relative block rounded-full transition-all duration-500 ${
                      isActive ? "w-5 h-5 bg-olive border-2 border-white shadow-[0_0_15px_#A39E88]" : "w-3 h-3 bg-white/30 border border-white/20 group-hover:bg-olive"
                    }`} />
                  </button>

                  {/* Food Image and Details Overlay */}
                  <AnimatePresence>
                    {showDetail && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 z-40 pointer-events-none"
                      >
                        <div className="relative flex flex-col items-center">
                          {/* Food Circle */}
                          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-olive overflow-hidden shadow-2xl shadow-black">
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                          </div>
                          
                          {/* Info Card */}
                          <div className="mt-3 bg-[#121212]/90 backdrop-blur-xl border border-white/10 p-4 rounded-2xl w-48 shadow-2xl text-center">
                            <p className="eyebrow !text-olive text-[10px] mb-1">{p.tag}</p>
                            <h4 className="font-serif text-ivory text-base mb-1">{p.name}</h4>
                            <p className="text-ivory/60 text-[11px] leading-tight line-clamp-2">{p.note}</p>
                          </div>

                          {/* Connector line */}
                          <div className="h-4 w-px bg-gradient-to-t from-olive to-transparent" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active region — Full Image Card - Back to constrained width */}
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <motion.div 
          key={current.name} 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-[1.4fr_1fr] gap-6"
        >
          <div className="p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden min-h-[450px] flex flex-col justify-end border border-white/5 shadow-2xl">
            <img 
              src={current.image} 
              alt={current.name} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[3s] scale-110 group-hover:scale-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            
            <div className="relative z-10">
              <motion.p 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="eyebrow !text-olive mb-4"
              >
                {current.tag}
              </motion.p>
              <motion.h3 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="font-serif text-4xl md:text-6xl text-white mb-4"
              >
                {current.name}
              </motion.h3>
              <motion.p 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-white/70 max-w-lg mb-8 text-lg"
              >
                {current.note}
              </motion.p>
              <div className="flex flex-wrap gap-2">
                {current.dishes.map((d, i) => (
                  <motion.span 
                    key={d} 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="text-xs px-4 py-2 rounded-full bg-white/10 border border-white/10 backdrop-blur-md text-white/90"
                  >
                    {d}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {places.filter((p) => p.name !== current.name).slice(0, 4).map((p) => (
              <button
                key={p.name}
                onClick={() => setActive(p.name)}
                className="p-6 rounded-3xl bg-white/5 hover:bg-white/10 border border-white/5 text-left transition-all hover:-translate-y-1 group overflow-hidden relative shadow-lg"
              >
                <img 
                  src={p.image} 
                  alt="" 
                  className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-opacity" 
                />
                <div className="relative z-10">
                  <p className="eyebrow text-olive mb-2">{p.tag}</p>
                  <p className="font-serif text-xl text-ivory group-hover:text-white">{p.name}</p>
                  <span className="text-xs text-olive mt-4 inline-block group-hover:translate-x-1 transition-transform">Explore →</span>
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        <div className="mt-16 text-center">
          <a href="#early-access" className="inline-flex items-center gap-4 px-10 py-5 rounded-full bg-olive text-black font-semibold hover:bg-white transition-all shadow-xl shadow-olive/10">
            Unlock global recipes <span className="text-xl">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
