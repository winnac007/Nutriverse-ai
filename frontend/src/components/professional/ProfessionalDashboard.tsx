"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { CalendarClock, ChefHat, Inbox, LogOut, Sprout } from "lucide-react";
import professionalApi, {
  clearProfessionalSession,
  PROFESSIONAL_ACCESS_TOKEN_KEY,
  PROFESSIONAL_REFRESH_TOKEN_KEY,
} from "@/lib/professionalApi";
import type { ProfessionalRole } from "./ProfessionalAuth";
import styles from "./Professional.module.css";

type Professional = {
  id: string;
  role: ProfessionalRole;
  name: string;
  email: string;
  headline: string;
  credentials: string;
  location?: string;
  specialties: string[];
  accepting_clients?: boolean;
  status: string;
};

type ChefRecipe = {
  id: string;
  title: string;
  image?: string;
  tier?: string;
  cook_time?: number;
};

type DashboardData = {
  professional: Professional;
  status: string;
  metrics: Record<string, number>;
  recipes?: ChefRecipe[];
  requests?: Array<{ id?: string; client_name?: string; status?: string }>;
};

const EMPTY_RECIPE = {
  title: "",
  description: "",
  image: "",
  country: "International",
  cuisine: "International",
  cook_time: "30",
  servings: "2",
  tier: "premium",
  tags: "",
  ingredients: "",
  steps: "",
  calories: "",
  protein: "",
  carbs: "",
  fat: "",
};

export default function ProfessionalDashboard({ role }: { role: ProfessionalRole }) {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [savingAvailability, setSavingAvailability] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [recipe, setRecipe] = useState(EMPTY_RECIPE);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data: nextData } = await professionalApi.get<DashboardData>("/professionals/dashboard");
      if (nextData.professional.role !== role) {
        router.replace(`/professional/${nextData.professional.role}/dashboard`);
        return;
      }
      setData(nextData);
    } catch {
      const hasSession = Boolean(
        localStorage.getItem(PROFESSIONAL_ACCESS_TOKEN_KEY)
        || localStorage.getItem(PROFESSIONAL_REFRESH_TOKEN_KEY),
      );
      if (!hasSession) router.replace(`/professional/${role}/login`);
      else setError("Your dashboard could not be loaded. Please retry.");
    } finally {
      setLoading(false);
    }
  }, [role, router]);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const logout = () => {
    clearProfessionalSession();
    router.replace(`/professional/${role}/login`);
  };

  const toggleAvailability = async () => {
    if (!data) return;
    setSavingAvailability(true);
    setMessage("");
    try {
      const { data: professional } = await professionalApi.patch<Professional>("/professionals/me", {
        accepting_clients: !data.professional.accepting_clients,
      });
      setData((current) => current ? { ...current, professional } : current);
      setMessage(professional.accepting_clients ? "You are now accepting consultation requests." : "New consultation requests are paused.");
    } catch {
      setError("Availability could not be updated.");
    } finally {
      setSavingAvailability(false);
    }
  };

  const publishRecipe = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPublishing(true);
    setError("");
    setMessage("");
    try {
      const payload = {
        ...recipe,
        cook_time: Number(recipe.cook_time),
        servings: Number(recipe.servings),
        calories: Number(recipe.calories || 0),
        protein: Number(recipe.protein || 0),
        carbs: Number(recipe.carbs || 0),
        fat: Number(recipe.fat || 0),
        tags: recipe.tags.split(",").map((item) => item.trim().toLowerCase()).filter(Boolean),
        ingredients: recipe.ingredients.split("\n").map((item) => item.trim()).filter(Boolean),
        steps: recipe.steps.split("\n").map((item) => item.trim()).filter(Boolean),
      };
      const { data: published } = await professionalApi.post<ChefRecipe>("/professionals/chef-specials", payload);
      setData((current) => current ? {
        ...current,
        recipes: [published, ...(current.recipes || [])],
        metrics: {
          ...current.metrics,
          published_recipes: (current.metrics.published_recipes || 0) + 1,
          premium_recipes: (current.metrics.premium_recipes || 0) + (published.tier === "premium" ? 1 : 0),
        },
      } : current);
      setRecipe(EMPTY_RECIPE);
      setMessage(`${published.title} is now live in Chef Specials.`);
    } catch (requestError: any) {
      setError(requestError?.response?.data?.detail || "The recipe could not be published. Review the fields and try again.");
    } finally {
      setPublishing(false);
    }
  };

  if (loading) return <main className={`${styles.page} ${styles.loading}`}>Loading your professional workspace…</main>;

  if (!data) {
    return (
      <main className={styles.page}>
        <div className={styles.shell}>
          <section className={styles.emptyState}>
            <h3>Dashboard unavailable</h3>
            <p>{error || "Your professional session needs attention."}</p>
            <button className={styles.primaryButton} type="button" onClick={() => void loadDashboard()}>Retry</button>
          </section>
        </div>
      </main>
    );
  }

  const isConsultant = role === "consultant";
  const metrics = isConsultant
    ? [
        ["Session requests", data.metrics.session_requests || 0],
        ["Upcoming sessions", data.metrics.upcoming_sessions || 0],
        ["Specialties", data.professional.specialties.length],
        ["Profile status", data.status === "active" ? "Live" : data.status],
      ]
    : [
        ["Published recipes", data.metrics.published_recipes || 0],
        ["Premium dishes", data.metrics.premium_recipes || 0],
        ["Specialties", data.professional.specialties.length],
        ["Profile status", data.status === "active" ? "Live" : data.status],
      ];

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.topbar}>
          <Link className={styles.brand} href="/professional">{isConsultant ? <Sprout /> : <ChefHat />}<span>Zenplato</span></Link>
          <div className={styles.topActions}>
            <Link className={styles.secondaryLink} href="/app">User app</Link>
            <button className={styles.secondaryButton} type="button" onClick={logout}><LogOut size={14} /> Sign out</button>
          </div>
        </header>

        <section className={styles.dashboardHeader}>
          <div>
            <p className={styles.eyebrow}>{isConsultant ? "Consultant dashboard" : "Chef dashboard"}</p>
            <h1>Good to see you, {data.professional.name.split(" ")[0]}.</h1>
            <p>{data.professional.headline} · {data.professional.credentials}</p>
          </div>
          <span className={styles.statusPill}>{data.status}</span>
        </section>

        <section className={styles.metricGrid} aria-label="Dashboard summary">
          {metrics.map(([label, value]) => <div className={styles.metricCard} key={String(label)}><span>{label}</span><strong>{value}</strong></div>)}
        </section>

        {error ? <p className={styles.error} role="alert">{error}</p> : null}
        {message ? <p className={styles.success} role="status">{message}</p> : null}

        {isConsultant ? (
          <div className={styles.dashboardGrid}>
            <section className={styles.panel}>
              <div className={styles.panelHeader}><div><h2>Your practice</h2><p>Control whether members can request a consultation.</p></div></div>
              <div className={styles.statusRow}><span>Accepting new clients</span><button className={styles.toggleButton} type="button" onClick={() => void toggleAvailability()} disabled={savingAvailability}>{data.professional.accepting_clients ? "Open" : "Paused"}</button></div>
              <div className={styles.statusRow}><span>Location</span><strong>{data.professional.location || "Remote"}</strong></div>
              <div className={styles.statusRow}><span>Specialties</span><strong>{data.professional.specialties.join(", ") || "Add specialties"}</strong></div>
            </section>
            <section className={styles.panel}>
              <div className={styles.panelHeader}><div><h2>Consultation requests</h2><p>New member requests appear here as soon as they are submitted.</p></div></div>
              {data.requests?.length ? data.requests.map((request, index) => (
                <div className={styles.statusRow} key={request.id || index}><span>{request.client_name || "Zenplato member"}</span><span className={styles.statusPill}>{request.status || "new"}</span></div>
              )) : (
                <div className={styles.emptyState}><CalendarClock /><h3>No requests yet</h3><p>Your profile is active. Incoming consultation requests will be shown here.</p></div>
              )}
            </section>
          </div>
        ) : (
          <div className={`${styles.dashboardGrid} ${styles.chefDashboardGrid}`}>
            <section className={styles.panel}>
              <div className={styles.panelHeader}><div><h2>Publish a Chef Special</h2><p>The dish becomes available in the user app after publishing.</p></div></div>
              <form className={styles.form} onSubmit={publishRecipe}>
                <label className={styles.field}><span>Dish name</span><input value={recipe.title} onChange={(event) => setRecipe((current) => ({ ...current, title: event.target.value }))} required minLength={3} /></label>
                <label className={styles.textareaField}><span>Description</span><textarea value={recipe.description} onChange={(event) => setRecipe((current) => ({ ...current, description: event.target.value }))} required minLength={10} /></label>
                <label className={styles.field}><span>Image URL</span><input type="url" value={recipe.image} onChange={(event) => setRecipe((current) => ({ ...current, image: event.target.value }))} placeholder="https://…" /></label>
                <div className={styles.fieldRow}>
                  <label className={styles.field}><span>Country</span><input value={recipe.country} onChange={(event) => setRecipe((current) => ({ ...current, country: event.target.value }))} required /></label>
                  <label className={styles.field}><span>Cuisine</span><input value={recipe.cuisine} onChange={(event) => setRecipe((current) => ({ ...current, cuisine: event.target.value }))} required /></label>
                </div>
                <div className={styles.fieldRow}>
                  <label className={styles.field}><span>Cook time</span><input type="number" min="1" max="480" value={recipe.cook_time} onChange={(event) => setRecipe((current) => ({ ...current, cook_time: event.target.value }))} required /></label>
                  <label className={styles.field}><span>Servings</span><input type="number" min="1" max="30" value={recipe.servings} onChange={(event) => setRecipe((current) => ({ ...current, servings: event.target.value }))} required /></label>
                  <label className={styles.field}><span>Tier</span><select value={recipe.tier} onChange={(event) => setRecipe((current) => ({ ...current, tier: event.target.value }))}><option value="premium">Premium</option><option value="budget">Budget</option></select></label>
                </div>
                <label className={styles.field}><span>Tags, comma separated</span><input value={recipe.tags} onChange={(event) => setRecipe((current) => ({ ...current, tags: event.target.value }))} placeholder="vegetarian, dessert" /></label>
                <label className={styles.textareaField}><span>Ingredients, one per line</span><textarea value={recipe.ingredients} onChange={(event) => setRecipe((current) => ({ ...current, ingredients: event.target.value }))} required /></label>
                <label className={styles.textareaField}><span>Steps, one per line</span><textarea value={recipe.steps} onChange={(event) => setRecipe((current) => ({ ...current, steps: event.target.value }))} required /></label>
                <div className={styles.fieldRow}>
                  {(["calories", "protein", "carbs", "fat"] as const).map((field) => <label className={styles.field} key={field}><span>{field}</span><input type="number" min="0" step={field === "calories" ? "1" : "0.1"} value={recipe[field]} onChange={(event) => setRecipe((current) => ({ ...current, [field]: event.target.value }))} /></label>)}
                </div>
                <button className={styles.primaryButton} type="submit" disabled={publishing}>{publishing ? "Publishing…" : "Publish Chef Special"}</button>
              </form>
            </section>

            <section className={styles.panel}>
              <div className={styles.panelHeader}><div><h2>Your Chef Specials</h2><p>Published dishes are visible in the user recipe collection.</p></div><Inbox size={18} /></div>
              {data.recipes?.length ? (
                <div className={styles.recipeList}>{data.recipes.map((item) => (
                  <article className={styles.recipeCard} key={item.id}>
                    <img src={item.image || "/landing/footer-still.jpg"} alt={item.title} />
                    <div><h3>{item.title}</h3><div className={styles.recipeMeta}><span>{item.tier || "budget"}</span><span>{item.cook_time || 30} min</span></div><div className={styles.recipeActions}><Link href={`/app/recipe/${item.id}`}>View live dish</Link></div></div>
                  </article>
                ))}</div>
              ) : (
                <div className={styles.emptyState}><ChefHat /><h3>No Chef Specials yet</h3><p>Use the form to publish your first dish. It will appear here and in the user app.</p></div>
              )}
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
