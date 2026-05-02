import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";
import { ArrowLeft, MapPin, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const REGION_DESCRIPTIONS = {
  "South India": "Coconut, curry leaves, tamarind. Steamed batters and tempered spice.",
  "North India": "Wheat, ghee, dairy. Tandoor, slow-simmered curries, royal flavours.",
  "East India": "Mustard oil, river fish, jaggery. Light curries, sweets, panch phoron.",
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
};

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
    <div className="space-y-6 -mx-4 sm:-mx-6 px-4 sm:px-6 nv-ancient min-h-screen pb-12 -mt-6 pt-6 -mb-28">
      <Link to="/app" className="inline-flex items-center gap-2 text-sm" style={{color: "#5b3d22"}} data-testid="storymap-back">
        <ArrowLeft className="size-4" /> Home
      </Link>

      <header className="relative">
        <div className="text-[10px] uppercase tracking-[0.4em]" style={{color: "#8a5d33"}}>The Origins Atlas</div>
        <h1 className="font-display text-3xl sm:text-5xl font-bold mt-1" style={{color: "#3a2618"}}>
          Where does your food come from?
        </h1>
        <p className="text-sm mt-2 max-w-md" style={{color: "#5b3d22"}}>
          A storytelling atlas. Pick a country, then drift into a region or city to taste what locals actually cook.
        </p>
      </header>

      {/* Country grid (stylized parchment cards) */}
      <AnimatePresence mode="wait">
        {!selectedCountry ? (
          <motion.section key="countries" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <h2 className="font-display text-lg mb-3" style={{color: "#3a2618"}}>Choose a country</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {countries.map((c) => (
                <button key={c} onClick={() => setSelectedCountry(c)} data-testid={`storymap-country-${c}`}
                  className="nv-parchment-card rounded-2xl p-4 text-left hover:-translate-y-1 transition-all">
                  <div className="text-xs uppercase tracking-[0.2em]" style={{color: "#8a5d33"}}>Country</div>
                  <div className="font-display text-lg font-bold mt-1" style={{color: "#3a2618"}}>{c}</div>
                  <div className="mt-2 inline-flex items-center gap-1 text-xs" style={{color: "#6b4423"}}>
                    Travel here <ArrowRight className="size-3" />
                  </div>
                </button>
              ))}
            </div>
          </motion.section>
        ) : (
          <motion.section key="country" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="space-y-5">
            <button onClick={() => setSelectedCountry(null)} className="text-xs underline" style={{color: "#5b3d22"}}>
              ← All countries
            </button>
            <h2 className="font-display text-3xl font-bold" style={{color: "#3a2618"}}>
              <MapPin className="size-6 inline mb-1" /> {selectedCountry}
            </h2>

            <div>
              <div className="text-xs uppercase tracking-[0.2em] mb-2" style={{color: "#8a5d33"}}>Regions in {selectedCountry}</div>
              <div className="flex flex-wrap gap-2">
                {regions.map((r) => (
                  <span key={r} className="nv-parchment-card rounded-full px-3 py-1.5 text-xs font-medium">
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
                  <div key={r} className="nv-parchment-card rounded-2xl p-5">
                    <div className="text-[10px] uppercase tracking-[0.25em]" style={{color: "#8a5d33"}}>Region</div>
                    <div className="font-display text-xl font-bold" style={{color: "#3a2618"}}>{r}</div>
                    <p className="text-sm mt-1.5 italic" style={{color: "#5b3d22"}}>{desc}</p>
                    <div className="mt-3 space-y-1.5">
                      {regionRecipes.map((rec) => (
                        <Link key={rec.id} to={`/app/recipe/${rec.id}`} data-testid={`storymap-recipe-${rec.id}`}
                          className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                          <img src={rec.image} alt={rec.title} className="size-10 rounded-lg object-cover" />
                          <span className="text-sm font-medium" style={{color: "#3a2618"}}>{rec.title}</span>
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
