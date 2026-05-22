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

function WorldMapHero({ countries, onPick }) {
  return (
    <div className="relative rounded-3xl overflow-hidden zp-card-dark nv-shadow">
      <div className="relative p-6 sm:p-10">
        <p className="font-overline" style={{ color: "#d9c189" }}>Chapter 03 · Discover</p>
        <h2 className="font-display text-3xl sm:text-5xl mt-2" style={{ color: "#f4f1e8" }}>Travel the Plate</h2>
        <p className="text-sm mt-3 max-w-md" style={{ color: "#d4cab8" }}>
          Forty cuisines. One quiet way to eat. Tap any pin to step into a country.
        </p>

        <div className="relative mt-6 aspect-[16/9] rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, #1c1916 0%, #2e2a26 100%)" }}>
          {/* Stylised dotted world silhouette */}
          <svg viewBox="0 0 1000 500" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <defs>
              <pattern id="dot" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
                <circle cx="7" cy="7" r="1.3" fill="#d9c189" opacity="0.55" />
              </pattern>
            </defs>
            {/* North America */}
            <path d="M120 130 Q180 100 240 120 Q280 130 290 170 Q260 210 220 230 Q170 240 130 220 Q100 190 120 130 Z" fill="url(#dot)" />
            {/* South America */}
            <path d="M250 270 Q280 260 300 290 Q320 340 300 400 Q280 440 260 430 Q240 400 240 350 Q240 300 250 270 Z" fill="url(#dot)" />
            {/* Europe */}
            <path d="M460 130 Q500 110 540 130 Q560 160 540 190 Q500 200 470 180 Q450 160 460 130 Z" fill="url(#dot)" />
            {/* Africa */}
            <path d="M470 220 Q510 210 540 240 Q560 290 540 350 Q510 390 480 380 Q450 340 450 280 Q450 240 470 220 Z" fill="url(#dot)" />
            {/* Middle East */}
            <path d="M555 200 Q585 195 600 220 Q605 245 585 250 Q565 245 555 220 Z" fill="url(#dot)" />
            {/* Asia */}
            <path d="M580 140 Q680 110 780 140 Q830 170 820 220 Q780 250 700 240 Q620 230 590 200 Q570 170 580 140 Z" fill="url(#dot)" />
            {/* South-East Asia */}
            <path d="M730 260 Q780 250 810 280 Q800 310 760 310 Q720 300 720 280 Z" fill="url(#dot)" />
            {/* Australia */}
            <path d="M820 340 Q870 330 900 360 Q890 390 850 395 Q810 385 810 360 Z" fill="url(#dot)" />
          </svg>

          {/* Dots */}
          {DOTS.filter((d) => countries.includes(d.country)).map((d) => (
            <button
              key={d.country}
              onClick={() => onPick(d.country)}
              data-testid={`map-pin-${d.country}`}
              className="absolute -translate-x-1/2 -translate-y-1/2 group"
              style={{ left: d.x, top: d.y }}
            >
              <span className="block size-3 rounded-full ring-2 ring-[#d9c189]" style={{ background: "#d9c189", boxShadow: "0 0 12px rgba(217,193,137,0.7)" }} />
              <span className="absolute left-1/2 -translate-x-1/2 mt-1.5 text-[10px] font-medium uppercase tracking-widest opacity-100 whitespace-nowrap" style={{ color: "#f4f1e8", textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>{d.country}</span>
            </button>
          ))}
        </div>

        <p className="text-xs italic mt-4 text-center" style={{ color: "#9b9080" }}>
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
