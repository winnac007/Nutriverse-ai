import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";
import { ArrowLeft, MapPin, ArrowRight, Globe2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { COUNTRY_IMAGES, COUNTRY_BLURBS } from "../lib/countries";

const REGION_DESCRIPTIONS = {
  "South India": "Coconut, curry leaves, tamarind. Steamed batters and tempered spice.",
  "North India": "Wheat, ghee, dairy. Tandoor, slow-simmered curries, royal flavours.",
  "East India": "Mustard oil, river fish, jaggery. Light curries, sweets.",
  "West India": "Vada-pav, bhel, jaggery & tamarind. Coastal seafood meets bold spice.",
  "Naples": "Wood-fired pizza, San Marzano tomatoes, mozzarella di bufala.",
  "Tokyo": "Donburi bowls, miso, yakitori — precision and umami.",
  "Bangkok Street": "Hot wok action, tamarind sweetness, fish sauce funk.",
  "Mexico City": "Maize, salsa, slow-roasted meats, pineapple-tinged tacos.",
  "Marrakesh": "Tagines, ras el hanout, preserved lemon and dried fruit.",
  "Valencia": "Bomba rice, saffron, paella over open flame.",
  "Hanoi": "Pho, herbs, fish sauce — clear broths, fresh aromatics.",
  "Provence": "Sun-ripened vegetables, herbs, olive oil — countryside soul.",
  "Beirut": "Mezze culture, tahini, sumac, charcoal grilling.",
  "Seoul": "Banchan, gochujang, fermentation — bold Korean flavours.",
  "Pacific Northwest": "Wild salmon, berries, wholesome grains.",
  "Andean": "Quinoa, potatoes, corn — high-altitude superfoods.",
  "Mediterranean": "Olive oil, herbs, sea-fresh ingredients.",
};

const DOTS = [
  { country: "India", x: "72%", y: "55%" },
  { country: "China", x: "78%", y: "45%" },
  { country: "Japan", x: "88%", y: "44%" },
  { country: "Korea", x: "84%", y: "44%" },
  { country: "Vietnam", x: "80%", y: "55%" },
  { country: "Thailand", x: "76%", y: "57%" },
  { country: "Italy", x: "53%", y: "44%" },
  { country: "France", x: "50%", y: "40%" },
  { country: "Spain", x: "47%", y: "44%" },
  { country: "Greece", x: "55%", y: "46%" },
  { country: "Morocco", x: "46%", y: "50%" },
  { country: "Lebanon", x: "59%", y: "47%" },
  { country: "USA", x: "23%", y: "42%" },
  { country: "Mexico", x: "22%", y: "55%" },
  { country: "Peru", x: "30%", y: "70%" },
];

// Featured "medallion" countries — match the reference (food bowl + label)
const MEDALLIONS = [
  { country: "Mexico",   word: "Vibrant.",   x: "20%", y: "52%", img: "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=400&q=80", side: "right" },
  { country: "Italy",    word: "Fresh.",     x: "52%", y: "30%", img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80", side: "right", label: "Mediterranean" },
  { country: "India",    word: "Flavorful.", x: "70%", y: "55%", img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80", side: "left" },
  { country: "Japan",    word: "Simple.",    x: "88%", y: "42%", img: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80", side: "left" },
  { country: "Korea",    word: "Balanced.",  x: "83%", y: "70%", img: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&q=80", side: "left" },
];

const WORLD_MAP_BG = "https://customer-assets.emergentagent.com/job_nutriverse-preview/artifacts/3483sgg6_6ACC1EC3-0E85-4696-A48A-B2DC92FA1A5E.png";

function WorldMapHero({ countries, onPick }) {
  return (
    <div className="relative rounded-3xl overflow-hidden zp-card-dark nv-shadow">
      <div className="relative p-6 sm:p-8">
        <p className="font-overline" style={{ color: "#d9c189" }}>Chapter 03 · Discover</p>
        <h2 className="font-display text-3xl sm:text-5xl mt-2" style={{ color: "#f4f1e8" }}>Travel the Plate</h2>
        <p className="text-sm mt-3 max-w-md" style={{ color: "#d4cab8" }}>
          Forty cuisines. One quiet way to eat. Tap any bowl to step into a country.
        </p>

        {/* The real world map background with food medallions */}
        <div className="relative mt-6 aspect-[3/2] rounded-2xl overflow-hidden" style={{ background: "#0f0d0b" }}>
          {/* Base map */}
          <img src={WORLD_MAP_BG} alt="" className="absolute inset-0 w-full h-full object-cover" />
          {/* Subtle wash to lift the contrast */}
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 30%, rgba(15,13,11,0.55) 90%)" }} />

          {/* Connection lines between medallions */}
          <svg viewBox="0 0 100 67" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <g fill="none" stroke="#d9c189" strokeWidth="0.18" strokeDasharray="0.6 0.8" opacity="0.65">
              <path d="M20 52 Q35 30 52 30" />
              <path d="M52 30 Q60 40 70 55" />
              <path d="M70 55 Q80 50 88 42" />
              <path d="M88 42 Q85 56 83 70" />
            </g>
          </svg>

          {/* Food medallions */}
          {MEDALLIONS.map((m, i) => (
            <button
              key={m.country}
              onClick={() => onPick(m.country)}
              data-testid={`map-medallion-${m.country}`}
              className="absolute -translate-x-1/2 -translate-y-1/2 group"
              style={{ left: m.x, top: m.y }}
            >
              <div className="relative">
                <div
                  className="size-14 sm:size-16 rounded-full overflow-hidden ring-2"
                  style={{ ringColor: "#d9c189", boxShadow: "0 6px 20px rgba(0,0,0,0.55), 0 0 0 2px rgba(217,193,137,0.4)" }}
                >
                  <img src={m.img} alt={m.country} className="w-full h-full object-cover" />
                </div>
                {/* Label tether */}
                <div
                  className={`absolute top-1/2 ${m.side === "right" ? "left-full ml-3" : "right-full mr-3"} -translate-y-1/2 whitespace-nowrap text-left`}
                >
                  <div className="flex items-center gap-1.5">
                    {m.side === "left" && <span className="size-1.5 rounded-full" style={{ background: "#d9c189" }} />}
                    <div>
                      <div className="text-xs sm:text-sm font-semibold tracking-wide" style={{ color: "#f4f1e8", fontFamily: "Playfair Display, serif", textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>
                        {m.label || m.country}
                      </div>
                      <div className="text-[10px] sm:text-xs" style={{ color: "#d4cab8", textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>{m.word}</div>
                    </div>
                    {m.side === "right" && <span className="size-1.5 rounded-full" style={{ background: "#d9c189" }} />}
                  </div>
                </div>
              </div>
            </button>
          ))}

          {/* Smaller secondary pins for other countries */}
          {DOTS.filter((d) => countries.includes(d.country) && !MEDALLIONS.some(m => m.country === d.country)).map((d) => (
            <button
              key={d.country}
              onClick={() => onPick(d.country)}
              data-testid={`map-pin-${d.country}`}
              className="absolute -translate-x-1/2 -translate-y-1/2 group"
              style={{ left: d.x, top: d.y }}
              aria-label={d.country}
            >
              <span className="block size-2 rounded-full" style={{ background: "#d9c189", boxShadow: "0 0 8px rgba(217,193,137,0.85)" }} />
            </button>
          ))}
        </div>

        <p className="text-xs italic mt-5 text-center" style={{ color: "#9b9080" }}>
          Slow food, gently mapped.
        </p>
      </div>
    </div>
  );
}

export default function StoryMap() {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [regions, setRegions] = useState([]);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => { api.get("/recipes/countries").then((r) => setCountries(r.data)); }, []);
  useEffect(() => {
    if (!selectedCountry) { setRegions([]); setRecipes([]); return; }
    api.get("/recipes/regions", { params: { country: selectedCountry } }).then((r) => setRegions(r.data));
    api.get("/recipes", { params: { country: selectedCountry } }).then((r) => setRecipes(r.data));
  }, [selectedCountry]);

  return (
    <div className="space-y-6">
      <Link to="/app" className="inline-flex items-center gap-2 text-sm hover:opacity-80" style={{ color: "#5e6b55" }} data-testid="storymap-back">
        <ArrowLeft className="size-4" /> Home
      </Link>

      <AnimatePresence mode="wait">
        {!selectedCountry ? (
          <motion.div key="atlas" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <WorldMapHero countries={countries} onPick={setSelectedCountry} />

            <section>
              <h3 className="font-display text-xl mb-3" style={{ color: "#2e2a26" }}>Countries & cuisines</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {countries.map((c) => (
                  <button key={c} onClick={() => setSelectedCountry(c)} data-testid={`storymap-country-${c}`}
                    className="text-left rounded-2xl overflow-hidden zp-card-soft nv-shadow hover:-translate-y-0.5 transition-all">
                    <div className="aspect-[4/3] relative overflow-hidden">
                      <img src={COUNTRY_IMAGES[c] || COUNTRY_IMAGES["International"]} alt={c}
                        className="w-full h-full object-cover" loading="lazy" />
                      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 50%, rgba(46,42,38,0.65) 100%)" }} />
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <div className="font-display text-lg" style={{ color: "#f4f1e8" }}>{c}</div>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-xs italic" style={{ color: "#6b6258" }}>{COUNTRY_BLURBS[c] || "A quiet way to eat anywhere."}</p>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          </motion.div>
        ) : (
          <motion.section key={`country-${selectedCountry}`} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="space-y-5">
            <button onClick={() => setSelectedCountry(null)} className="text-xs underline" style={{ color: "#5e6b55" }} data-testid="storymap-allcountries">
              ← All countries
            </button>

            {/* Country hero */}
            <div className="relative rounded-3xl overflow-hidden nv-shadow">
              <img src={COUNTRY_IMAGES[selectedCountry] || COUNTRY_IMAGES["International"]} alt={selectedCountry}
                className="w-full aspect-[16/9] object-cover" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(46,42,38,0.1) 0%, rgba(46,42,38,0.75) 100%)" }} />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="font-overline" style={{ color: "#d9c189" }}>Country</div>
                <h2 className="font-display text-3xl sm:text-5xl" style={{ color: "#f4f1e8" }}>
                  <MapPin className="size-7 inline mb-2 mr-1" style={{ color: "#d9c189" }} /> {selectedCountry}
                </h2>
                <p className="text-sm italic mt-1" style={{ color: "#d4cab8" }}>{COUNTRY_BLURBS[selectedCountry]}</p>
              </div>
            </div>

            <div>
              <div className="font-overline mb-2" style={{ color: "#8a6e3a" }}>Regions</div>
              <div className="flex flex-wrap gap-2">
                {regions.map((r) => (
                  <span key={r} className="zp-card-soft rounded-full px-3 py-1.5 text-xs font-medium" style={{ color: "#2e2a26" }}>
                    {r}
                  </span>
                ))}
              </div>
            </div>

            {/* Region storytelling cards */}
            <div className="grid gap-4 sm:grid-cols-2">
              {regions.map((r) => {
                const desc = REGION_DESCRIPTIONS[r] || "Local ingredients, time-honoured methods, soulful stories.";
                const regionRecipes = recipes.filter((rec) => (rec.region || "").toLowerCase() === r.toLowerCase());
                return (
                  <div key={r} className="zp-card-soft rounded-2xl p-5 nv-shadow">
                    <div className="font-overline" style={{ color: "#8a6e3a" }}>Region</div>
                    <div className="font-display text-xl mt-1" style={{ color: "#2e2a26" }}>{r}</div>
                    <p className="text-sm mt-1.5 italic" style={{ color: "#6b6258" }}>{desc}</p>
                    <div className="mt-3 space-y-1.5">
                      {regionRecipes.map((rec) => (
                        <Link key={rec.id} to={`/app/recipe/${rec.id}`} data-testid={`storymap-recipe-${rec.id}`}
                          className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                          <img src={rec.image} alt={rec.title} className="size-10 rounded-lg object-cover" />
                          <span className="text-sm font-medium" style={{ color: "#2e2a26" }}>{rec.title}</span>
                          <ArrowRight className="size-3 ml-auto" style={{ color: "#5e6b55" }} />
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
