"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowLeftRight, BookOpen, CheckCircle2, RefreshCw, ShieldAlert, XCircle } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";
import styles from "../wellnessMeals.module.css";

type Guide = {
  label?: string;
  food_rules?: string[];
  foods_to_eat?: string[];
  plan_foods_to_eat?: string[];
  foods_to_avoid?: string[];
  plan_foods_to_avoid?: string[];
};
type Swap = { from: string; to: string; reason?: string; best_for?: string[] };

const displayCondition = (condition: string) => condition.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
const unique = (items: string[]) => [...new Set(items)];

export default function FoodGuidelines() {
  const { user } = useAuth();
  const conditionKey = (user?.conditions || []).join("|");
  const conditions = useMemo(() => conditionKey ? conditionKey.split("|") : [], [conditionKey]);
  const [guidelines, setGuidelines] = useState<Record<string, Guide>>({});
  const [swaps, setSwaps] = useState<Swap[]>([]);
  const [activeCondition, setActiveCondition] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadGuidelines = useCallback(async () => {
    if (!conditions.length) { setLoading(false); return; }
    setLoading(true);
    setError("");
    try {
      const [guidelinesResponse, swapsResponse] = await Promise.all([
        api.get<Record<string, Guide>>("/healthcare/food-guidelines"),
        api.get<Swap[]>("/healthcare/swaps"),
      ]);
      setGuidelines(guidelinesResponse.data);
      setSwaps(swapsResponse.data);
      setActiveCondition((current) => current && conditions.includes(current) ? current : conditions[0]);
    } catch {
      setError("Your personalized food guidance could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, [conditions]);

  useEffect(() => { void loadGuidelines(); }, [loadGuidelines]);

  const active = activeCondition ? guidelines[activeCondition] : undefined;
  const foodsToEat = unique([...(active?.plan_foods_to_eat || []), ...(active?.foods_to_eat || [])]);
  const foodsToLimit = unique([...(active?.plan_foods_to_avoid || []), ...(active?.foods_to_avoid || [])]);
  const conditionSwaps = swaps.filter((swap) => activeCondition && swap.best_for?.includes(activeCondition));

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <nav className={styles.topbar} aria-label="Food guide navigation">
          <Link className={styles.backLink} href="/app/meal-plan" aria-label="Back to meal plan"><ArrowLeft size={19} /></Link>
          <span className={styles.brand}><span className={styles.brandMark}>❧</span> Zenplate</span>
          <span className={styles.iconButton} aria-hidden="true"><BookOpen size={20} /></span>
        </nav>

        <header className={styles.hero}>
          <p className={styles.eyebrow}>Personalized nourishment</p>
          <h1 className={styles.title}>Your Food Guide <span className={styles.leaf}>❧</span></h1>
          <p className={styles.subtitle}>Practical choices shaped around the health details in your profile.</p>
        </header>

        <div className={styles.disclaimer}><ShieldAlert size={17} /><span>General nutrition guidance only. For condition-specific changes, speak with your doctor or dietitian.</span></div>

        {loading ? (
          <div className={styles.state} aria-live="polite"><div className={styles.skeleton} aria-label="Loading food guidelines" /></div>
        ) : error ? (
          <State title="Guidance is unavailable" text={error} action={<button className={styles.primaryButton} type="button" onClick={loadGuidelines}><RefreshCw size={14} /> Try again</button>} />
        ) : !conditions.length ? (
          <State title="Tell us what matters" text="Add a health condition in your profile to see personalized foods, limits, and practical swaps." action={<Link className={styles.secondaryButton} href="/app/profile">Open profile</Link>} />
        ) : (
          <div className={styles.guideLayout}>
            <div className={styles.conditionTabs} role="tablist" aria-label="Health condition">
              {conditions.map((condition) => (
                <button
                  key={condition}
                  type="button"
                  role="tab"
                  aria-selected={activeCondition === condition}
                  className={`${styles.tab} ${styles.conditionTab} ${activeCondition === condition ? styles.activeTab : ""}`}
                  onClick={() => setActiveCondition(condition)}
                >
                  {displayCondition(condition)}
                </button>
              ))}
            </div>

            {active ? (
              <div className={styles.guideColumns}>
                {active.food_rules?.length ? (
                  <section className={`${styles.editorialCard} ${styles.guideSection} ${styles.rulesWide}`}>
                    <p className={styles.sectionLabel}>A few grounding principles</p>
                    <h2 className={styles.cardTitle}>{active.label || displayCondition(activeCondition || "")}</h2>
                    <ul className={styles.guideList}>
                      {active.food_rules.map((rule, index) => <li className={styles.guideItem} key={`${rule}-${index}`}><span className={styles.ruleNumber}>{index + 1}</span><span>{rule}</span></li>)}
                    </ul>
                  </section>
                ) : null}

                <FoodList title="Foods to include" items={foodsToEat} kind="good" />
                <FoodList title="Foods to limit" items={foodsToLimit} kind="limit" />

                {conditionSwaps.length ? (
                  <section className={`${styles.editorialCard} ${styles.guideSection} ${styles.rulesWide}`}>
                    <p className={styles.sectionLabel}>Smart swaps</p>
                    <h2 className={styles.cardTitle}>Small changes, familiar meals</h2>
                    {conditionSwaps.map((swap, index) => (
                      <div className={styles.swap} key={`${swap.from}-${index}`}>
                        <span className={styles.swapFrom}>{swap.from}</span><ArrowLeftRight size={16} /><span className={styles.swapTo}>{swap.to}</span>
                        {swap.reason && <p className={styles.swapReason}>{swap.reason}</p>}
                      </div>
                    ))}
                  </section>
                ) : null}

                {!active.food_rules?.length && !foodsToEat.length && !foodsToLimit.length && !conditionSwaps.length && (
                  <State title="No guidance is listed yet" text="This condition is saved to your profile, but its food guidance is still being prepared." />
                )}
              </div>
            ) : (
              <State title="Choose a condition" text="Select one of your profile conditions to view its food guidance." />
            )}
          </div>
        )}
      </div>
    </main>
  );
}

function FoodList({ title, items, kind }: { title: string; items: string[]; kind: "good" | "limit" }) {
  if (!items.length) return null;
  const Icon = kind === "good" ? CheckCircle2 : XCircle;
  return (
    <section className={`${styles.editorialCard} ${styles.guideSection}`}>
      <p className={styles.sectionLabel}>{title}</p>
      <ul className={styles.guideList}>{items.map((item) => <li className={styles.guideItem} key={item}><Icon className={kind === "good" ? styles.good : styles.limit} size={17} /><span>{item}</span></li>)}</ul>
    </section>
  );
}

function State({ title, text, action }: { title: string; text: string; action?: React.ReactNode }) {
  return <div className={styles.state}><div><span className={styles.stateIcon}><BookOpen size={20} /></span><h2 className={styles.stateTitle}>{title}</h2><p className={styles.stateText}>{text}</p>{action}</div></div>;
}
