"use client";

import React, { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import api from "@/lib/api";
import RecipeCard from "@/components/RecipeCard";
import { Search, Sparkles, Wallet, Loader2, Filter } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { useThrottleCallback } from "@/hooks/use-throttle";
import { motion } from "framer-motion";

const TAGS = ["vegetarian", "vegan", "gluten-free", "dairy-free", "high-protein", "pescatarian", "dessert"];
const PAGE_SIZE = 12;

export default function Explore() {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [tag, setTag] = useState("");
  const [tier, setTier] = useState("all");
  const [budget, setBudget] = useState("all");
  const [country, setCountry] = useState("all");
  const [region, setRegion] = useState("all");
  const [offset, setOffset] = useState(0);
  
  const [countries, setCountries] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const observerTarget = useRef<HTMLDivElement>(null);

  // Initial data
  useEffect(() => { api.get("/recipes/countries").then((r) => setCountries(r.data)); }, []);
  
  // Region fetching
  useEffect(() => {
    const params = country !== "all" ? { country } : {};
    api.get("/recipes/regions", { params }).then((r) => setRegions(r.data));
    setRegion("all");
    setOffset(0);
  }, [country]);

  // Reset offset on filter change
  useEffect(() => {
    setOffset(0);
  }, [category, debouncedSearch, tag, tier, budget]);

  // Fetch logic
  const fetchRecipes = async (currentOffset: number) => {
    setLoading(true);
    const params: any = { offset: currentOffset };
    if (category !== "all") params.category = category;
    if (debouncedSearch) params.search = debouncedSearch;
    if (tag) params.tag = tag;
    if (tier !== "all") params.tier = tier;
    if (country !== "all") params.country = country;
    if (region !== "all") params.region = region;
    if (budget !== "all") params.budget = budget;
    
    try {
      const r = await api.get("/recipes", { params });
      const newRecipes = r.data;
      
      if (currentOffset === 0) {
        setRecipes(newRecipes);
      } else {
        setRecipes(prev => [...prev, ...newRecipes]);
      }
      
      setHasMore(newRecipes.length >= PAGE_SIZE);
    } catch (err) {
      console.error("Fetch recipes failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes(offset);
  }, [category, debouncedSearch, tag, tier, country, region, budget, offset]);

  // Throttled scroll trigger
  const handleLoadMore = useThrottleCallback(() => {
    if (!loading && hasMore) {
      setOffset(prev => prev + PAGE_SIZE);
    }
  }, 1000);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [handleLoadMore]);

  return (
    <div className="space-y-8 pb-32 pt-6">
      <header>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#3A2618] mb-2">Explore</h1>
        <p className="text-[#3A2618]/50 text-sm">Discover mindful recipes tailored to your journey.</p>
      </header>

      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-[#3A2618]/30 group-focus-within:text-[#004D40] transition-colors" />
        <Input 
          placeholder="Search recipes, ingredients, or goals..."
          value={search} 
          onChange={(e: any) => setSearch(e.target.value)}
          className="pl-12 rounded-2xl h-14 bg-white border-[#D9C39A]/40 focus:border-[#004D40] focus:ring-[#004D40]/10 shadow-sm text-[#3A2618]" 
        />
      </div>

      <div className="space-y-6">
        <Tabs value={category} onValueChange={setCategory} className="w-full">
          <TabsList className="flex bg-transparent p-0 h-auto gap-4 overflow-x-auto scrollbar-none pb-2">
            {[
              { v: "all", l: "All" },
              { v: "healthcare", l: "Health" },
              { v: "fitness", l: "Fitness" },
              { v: "cultural", l: "Cultural" },
              { v: "chef-special", l: "Chef" },
            ].map((t) => (
              <TabsTrigger 
                key={t.v} 
                value={t.v}
                className={`px-6 py-2 rounded-full border border-[#D9C39A]/40 data-[state=active]:bg-[#004D40] data-[state=active]:text-white data-[state=active]:border-[#004D40] text-[#3A2618]/60 transition-all font-medium`}
              >
                {t.l}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[140px]">
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger className="rounded-xl border-[#D9C39A]/40 bg-white">
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All countries</SelectItem>
                {countries.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 min-w-[140px]">
            <Select value={region} onValueChange={setRegion} disabled={regions.length === 0}>
              <SelectTrigger className="rounded-xl border-[#D9C39A]/40 bg-white">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All regions</SelectItem>
                {regions.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-1 p-1 rounded-xl border border-[#D9C39A]/40 bg-white">
            {[
              { v: "all", l: "All" },
              { v: "budget", l: "Budget", icon: Wallet },
              { v: "premium", l: "Premium", icon: Sparkles },
            ].map((t) => (
              <button 
                key={t.v} 
                onClick={() => setTier(t.v as any)}
                className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${tier === t.v ? "bg-[#004D40] text-white" : "text-[#3A2618]/40 hover:text-[#3A2618]"}`}
              >
                {t.l}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto nv-scroll pb-2 -mx-4 px-4">
        <button 
          onClick={() => setTag("")}
          className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border ${!tag ? "bg-[#3A2618] text-white border-[#3A2618]" : "border-[#D9C39A]/40 text-[#3A2618]/60 bg-white"}`}
        >
          All Tags
        </button>
        {TAGS.map((t) => (
          <button 
            key={t} 
            onClick={() => setTag(tag === t ? "" : t)}
            className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${tag === t ? "bg-[#3A2618] text-white border-[#3A2618]" : "border-[#D9C39A]/40 text-[#3A2618]/60 bg-white hover:border-[#3A2618]"}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="pt-4">
        {recipes.length === 0 && !loading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 text-[#3A2618]/30 font-serif text-xl"
          >
            No recipes found in our pantry.
          </motion.div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((r, i) => (
              <motion.div
                key={`${r.id}-${i}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <RecipeCard recipe={r} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Infinite Scroll Sentinel */}
      <div ref={observerTarget} className="h-20 flex items-center justify-center">
        {loading && <Loader2 className="size-8 text-[#004D40] animate-spin opacity-40" />}
      </div>
    </div>
  );
}
