"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import api from "@/lib/api";
import RecipeCard from "@/components/RecipeCard";
import { Search, Sparkles, Wallet, Loader2 } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { useThrottleCallback } from "@/hooks/use-throttle";

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
  }, 1000); // 1s throttle for scroll trigger

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
    <div className="space-y-6 pb-20">
      <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">Explore</h1>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input placeholder="Try “idli sambar”, “Korean”, “PCOS”…"
          value={search} onChange={(e: any) => setSearch(e.target.value)}
          className="pl-9 rounded-full h-11 bg-card" />
      </div>

      <Tabs value={category} onValueChange={setCategory}>
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="healthcare">Health</TabsTrigger>
          <TabsTrigger value="fitness">Fitness</TabsTrigger>
          <TabsTrigger value="cultural">Cultural</TabsTrigger>
          <TabsTrigger value="chef-special">Chef</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <Select value={country} onValueChange={setCountry}>
          <SelectTrigger><SelectValue placeholder="Country" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All countries</SelectItem>
            {countries.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={region} onValueChange={setRegion} disabled={regions.length === 0}>
          <SelectTrigger><SelectValue placeholder="Region" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All regions</SelectItem>
            {regions.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="col-span-2 sm:col-span-1 flex gap-2 rounded-full border border-border p-1 bg-card">
          {[
            { v: "all", l: "All", icon: null },
            { v: "budget", l: "Budget", icon: Wallet },
            { v: "premium", l: "Premium", icon: Sparkles },
          ].map((t) => (
            <button key={t.v} onClick={() => setTier(t.v as any)}
              className={`flex-1 inline-flex items-center justify-center gap-1 text-xs font-medium rounded-full py-1.5 transition-all ${tier === t.v ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
              {t.icon && <t.icon className="size-3.5" />} {t.l}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-0 scrollbar-none">
        {[
          { v: "all", l: "Any budget" },
          { v: "100", l: "₹100/day" },
          { v: "200", l: "₹200/day" },
          { v: "300", l: "₹300/day" },
        ].map((b) => (
          <button key={b.v} onClick={() => setBudget(b.v)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              budget === b.v ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground bg-card"
            }`}>
            {b.l}
          </button>
        ))}
      </div>

      <div className="flex gap-2 overflow-x-auto nv-scroll pb-2">
        <button onClick={() => setTag("")}
          className={`shrink-0 px-3 py-1.5 rounded-full text-xs border ${!tag ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground bg-card"}`}>All</button>
        {TAGS.map((t) => (
          <button key={t} onClick={() => setTag(tag === t ? "" : t)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs border capitalize ${tag === t ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground bg-card"}`}>
            {t}
          </button>
        ))}
      </div>

      {recipes.length === 0 && !loading ? (
        <div className="text-center py-12 text-muted-foreground">No recipes found</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((r, i) => <RecipeCard key={`${r.id}-${i}`} recipe={r} />)}
        </div>
      )}

      {/* Infinite Scroll Sentinel */}
      <div ref={observerTarget} className="h-10 flex items-center justify-center">
        {loading && <Loader2 className="size-6 text-primary animate-spin" />}
      </div>
    </div>
  );
}
