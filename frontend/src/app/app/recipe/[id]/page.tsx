"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ArrowLeft, Clock, Users, Flame, Plus, Bookmark, ShoppingBag, ChefHat, PlayCircle } from "lucide-react";
import { toast } from "sonner";
import PremiumGate from "@/components/PremiumGate";
import { useAuth } from "@/lib/auth";

export default function RecipeDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user, refresh } = useAuth();
  const [recipe, setRecipe] = useState<any>(null);
  const [mealType, setMealType] = useState("lunch");
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    api.get(`/recipes/${id}`).then((r) => setRecipe(r.data));
    setShowVideo(false);
  }, [id]);

  if (!recipe) return <div className="text-muted-foreground">Loading…</div>;

  const locked = recipe.is_premium && !user?.is_premium;

  const logMeal = async () => {
    try {
      await api.post("/nutrition/log", { recipe_id: recipe.id, meal_type: mealType, servings: 1 });
      toast.success(`Logged ${recipe.title}`);
    } catch { toast.error("Could not log meal"); }
  };
  const toggleSave = async () => {
    try {
      await api.post(`/user/save-recipe/${recipe.id}`);
      await refresh();
      toast.success("Updated saved");
    } catch { toast.error("Failed"); }
  };

  const saved = user?.saved_recipes?.includes(recipe.id);
  const affiliate = `https://www.amazon.com/s?k=${encodeURIComponent(recipe.ingredients.map((i: any) => i.name).join(" "))}`;

  if (locked) {
    return (
      <div className="space-y-6">
        <Link href="/app/explore" className="inline-flex items-center gap-2 text-sm text-muted-foreground"><ArrowLeft className="size-4" /> Back</Link>
        <PremiumGate title={recipe.title} description={recipe.description + " — Premium recipe."} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="relative -mx-4 sm:-mx-6 aspect-[4/3] sm:aspect-[16/9] overflow-hidden sm:rounded-2xl">
        <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" loading="lazy"
          onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800"; }} />
        <div className="absolute inset-0 nv-hero-overlay" />
        <Link href="/app/explore" className="absolute top-4 left-4 size-10 rounded-full glass grid place-items-center">
          <ArrowLeft className="size-4" />
        </Link>
        <button onClick={toggleSave} className={`absolute top-4 right-4 size-10 rounded-full glass grid place-items-center ${saved ? "text-primary" : ""}`}>
          <Bookmark className={`size-4 ${saved ? "fill-current" : ""}`} />
        </button>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex flex-wrap gap-2 mb-2">
            {recipe.region && <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/85 text-black">{recipe.country} · {recipe.region}</span>}
            {recipe.tags?.slice(0, 3).map((t: string) => (
              <span key={t} className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 backdrop-blur text-white">{t}</span>
            ))}
          </div>
          <h1 className="font-display text-2xl sm:text-4xl font-bold text-white leading-tight">{recipe.title}</h1>
        </div>
      </div>

      {recipe.chef && (
        <div className="nv-card nv-shadow p-4 flex items-center gap-3">
          <div className="size-10 rounded-full nv-gradient-cs grid place-items-center text-white"><ChefHat className="size-5" /></div>
          <div>
            <div className="text-sm font-semibold">{recipe.chef.name}</div>
            <div className="text-xs text-muted-foreground">{recipe.chef.credentials}</div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-6 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1.5"><Clock className="size-4" /> {recipe.cook_time} min</span>
        <span className="inline-flex items-center gap-1.5"><Users className="size-4" /> {recipe.servings}</span>
        <span className="inline-flex items-center gap-1.5"><Flame className="size-4" /> {recipe.nutrition?.calories} kcal</span>
      </div>

      <p className="text-base text-muted-foreground">{recipe.description}</p>

      {recipe.video_url && (
        <section className="nv-card nv-shadow overflow-hidden">
          {showVideo ? (
            <div className="aspect-video">
              <iframe
                title={`${recipe.title} video`}
                src={`${recipe.video_url}?autoplay=1`}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <button onClick={() => setShowVideo(true)}
              className="w-full aspect-video relative group">
              <img src={recipe.image} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy"
                onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800"; }} />
              <div className="absolute inset-0 bg-black/40 grid place-items-center">
                <div className="flex flex-col items-center gap-2">
                  <PlayCircle className="size-16 text-white group-hover:scale-110 transition-transform" />
                  <span className="text-white font-medium">How to cook · Watch tutorial</span>
                </div>
              </div>
            </button>
          )}
        </section>
      )}

      <section className="nv-card nv-shadow p-5">
        <h3 className="font-display text-lg font-semibold mb-3">Nutrition (per serving)</h3>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {["calories", "protein", "carbs", "fat", "fiber", "sodium"].map((k) => (
            <div key={k}>
              <div className="text-xl font-display font-bold">{recipe.nutrition[k]}{k === "sodium" ? "mg" : k === "calories" ? "" : "g"}</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</div>
            </div>
          ))}
        </div>
        {recipe.nutrition.gi && <p className="text-xs text-muted-foreground mt-3">Glycemic Index: {recipe.nutrition.gi}</p>}
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-lg font-semibold">Ingredients</h3>
          <a href={affiliate} target="_blank" rel="noreferrer"
            className="text-xs text-primary inline-flex items-center gap-1"><ShoppingBag className="size-3.5" /> Shop all</a>
        </div>
        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {recipe.ingredients.map((i: any, idx: number) => (
            <li key={idx} className="nv-card nv-shadow p-3 flex flex-col items-center text-center">
              {i.image && (
                <img src={i.image} alt={i.name} loading="lazy" className="size-16 rounded-full object-cover mb-2 ring-1 ring-border" />
              )}
              <div className="text-sm font-medium leading-tight">{i.name}</div>
              <div className="text-xs text-muted-foreground mt-1">{i.amount}</div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="font-display text-lg font-semibold mb-3">Method</h3>
        <ol className="space-y-3">
          {recipe.steps.map((s: string, idx: number) => (
            <li key={idx} className="flex gap-3 nv-card nv-shadow p-4">
              <span className="shrink-0 size-7 rounded-full nv-gradient-hc text-white text-sm font-bold grid place-items-center">{idx + 1}</span>
              <span className="text-sm leading-relaxed pt-0.5">{s}</span>
            </li>
          ))}
        </ol>
      </section>

      {recipe.avoid && (
        <section className="nv-card p-5 border-destructive/30">
          <h3 className="font-display text-lg font-semibold mb-2 text-destructive">Avoid</h3>
          <p className="text-sm text-muted-foreground">{recipe.avoid.join(", ")}</p>
        </section>
      )}

      <section className="nv-card nv-shadow p-5 space-y-3 sticky bottom-24 z-10">
        <h3 className="font-semibold">Log this meal</h3>
        <div className="flex gap-3">
          <Select value={mealType} onValueChange={setMealType}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="breakfast">Breakfast</SelectItem>
              <SelectItem value="lunch">Lunch</SelectItem>
              <SelectItem value="dinner">Dinner</SelectItem>
              <SelectItem value="snack">Snack</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={logMeal} className="rounded-full flex-1"><Plus className="size-4 mr-1" /> Log meal</Button>
        </div>
      </section>
    </div>
  );
}
