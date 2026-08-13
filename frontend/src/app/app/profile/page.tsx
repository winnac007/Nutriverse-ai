"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Bell,
  ChevronRight,
  CircleHelp,
  Crown,
  HeartPulse,
  Info,
  Leaf,
  LockKeyhole,
  Pencil,
  RefreshCcw,
  Salad,
  ShieldCheck,
  Target,
  UserRound,
  X,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";
import styles from "./page.module.css";

type Panel = "preferences" | "privacy" | "about" | null;

interface SettingRow {
  icon: LucideIcon;
  label: string;
  description: string;
  action?: "edit" | Exclude<Panel, null>;
  href?: string;
  unavailable?: boolean;
}

interface FormState {
  name: string;
  age: string;
  weight_kg: string;
  height_cm: string;
  activity_level: string;
}

const SETTINGS_ROWS: SettingRow[] = [
  { icon: Target, label: "My goals", description: "Review the details used for your plan", action: "edit" },
  { icon: UserRound, label: "Personal information", description: "Name, age, height and weight", action: "edit" },
  { icon: Salad, label: "Dietary preferences", description: "See your current food preferences", action: "preferences" },
  { icon: HeartPulse, label: "Health conditions", description: "Open your condition-aware food guidance", href: "/app/food-guidelines" },
  { icon: Bell, label: "Notifications", description: "Reminders and alerts are not available yet", unavailable: true },
  { icon: ShieldCheck, label: "Privacy & security", description: "How your account is protected", action: "privacy" },
  { icon: CircleHelp, label: "Help & support", description: "In-app support is coming soon", unavailable: true },
  { icon: Info, label: "About ZenPlate", description: "Product and experience details", action: "about" },
];

const EMPTY_FORM: FormState = {
  name: "",
  age: "",
  weight_kg: "",
  height_cm: "",
  activity_level: "moderate",
};

export default function ProfilePage() {
  const { user, refresh, logout } = useAuth();
  const router = useRouter();
  const [streak, setStreak] = useState(0);
  const [streakStatus, setStreakStatus] = useState<"loading" | "ready" | "error">("loading");
  const [editOpen, setEditOpen] = useState(false);
  const [panel, setPanel] = useState<Panel>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!user) return;
    setForm({
      name: user.name || "",
      age: user.age ? String(user.age) : "",
      weight_kg: user.weight_kg ? String(user.weight_kg) : "",
      height_cm: user.height_cm ? String(user.height_cm) : "",
      activity_level: user.activity_level || "moderate",
    });
  }, [user]);

  const loadStreak = useCallback(async () => {
    setStreakStatus("loading");
    try {
      const response = await api.get<{ current_streak_days: number }>("/healthcare/streak");
      setStreak(response.data?.current_streak_days ?? 0);
      setStreakStatus("ready");
    } catch {
      setStreakStatus("error");
    }
  }, []);

  useEffect(() => {
    void loadStreak();
  }, [loadStreak]);

  useEffect(() => {
    if (!editOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !saving) setEditOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [editOpen, saving]);

  const openEdit = () => {
    setFormError("");
    setEditOpen(true);
  };

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = form.name.trim();
    if (!trimmedName) {
      setFormError("Please enter your name.");
      return;
    }

    setSaving(true);
    setFormError("");
    try {
      const payload: Record<string, string | number> = {
        name: trimmedName,
        activity_level: form.activity_level,
      };
      if (form.age) payload.age = Number.parseInt(form.age, 10);
      if (form.weight_kg) payload.weight_kg = Number.parseFloat(form.weight_kg);
      if (form.height_cm) payload.height_cm = Number.parseFloat(form.height_cm);
      await api.put("/user/profile", payload);
      await refresh();
      toast.success("Profile saved");
      setEditOpen(false);
    } catch {
      setFormError("Your changes could not be saved. Please try again.");
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/auth");
  };

  const handleSetting = (row: SettingRow) => {
    if (row.action === "edit") {
      openEdit();
      return;
    }
    const nextPanel = row.action;
    if (nextPanel) setPanel((current) => current === nextPanel ? null : nextPanel);
  };

  const firstName = user?.name?.split(" ")[0] || "Friend";
  const conditions = user?.conditions ?? [];
  const savedRecipes = user?.saved_recipes?.length ?? 0;

  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.vaseArt} aria-hidden="true">
          <span className={styles.vase} />
          <i className={styles.stemOne} />
          <i className={styles.stemTwo} />
          <i className={styles.stemThree} />
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconButton} type="button" onClick={() => router.back()} aria-label="Go back">
            <ArrowLeft size={20} />
          </button>
          <button className={styles.editHeaderButton} type="button" onClick={openEdit}>
            <Pencil size={15} /> Edit profile
          </button>
        </div>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Your space</p>
          <h1>Profile &amp; Settings <Leaf size={20} aria-hidden="true" /></h1>
          <p>Manage the information that shapes your ZenPlate experience.</p>
        </div>
      </header>

      <div className={styles.contentGrid}>
        <div className={styles.profileColumn}>
          <section className={styles.profileCard} aria-label="Account summary">
            <div className={styles.identityRow}>
              <div className={styles.avatar} aria-hidden="true">{firstName[0]?.toUpperCase()}</div>
              <div className={styles.identityCopy}>
                <p className={styles.eyebrow}>Your profile</p>
                <h2>{user?.name || "Your ZenPlate account"}</h2>
                <p>{user?.email}</p>
              </div>
              <button className={styles.avatarEdit} type="button" onClick={openEdit} aria-label="Edit profile">
                <Pencil size={13} />
              </button>
            </div>

            <div className={styles.accountStats}>
              <div>
                <span><Crown size={15} /></span>
                <strong>{user?.is_premium ? "Premium" : "Free"}</strong>
                <small>membership</small>
              </div>
              <div>
                <span><Leaf size={15} /></span>
                <strong>{savedRecipes}</strong>
                <small>saved recipes</small>
              </div>
              <div>
                <span><Target size={15} /></span>
                <strong>{streakStatus === "ready" ? streak : "—"}</strong>
                <small>day streak</small>
              </div>
            </div>

            {streakStatus === "loading" && <p className={styles.inlineStatus}>Refreshing your current meal streak…</p>}
            {streakStatus === "error" && (
              <div className={styles.inlineError} role="status">
                <span>Streak data is unavailable.</span>
                <button type="button" onClick={() => void loadStreak()}><RefreshCcw size={13} /> Retry</button>
              </div>
            )}

            <div className={styles.profileDetails}>
              <div><span>Food style</span><strong>{user?.dietary_type || "Not set"}</strong></div>
              <div><span>Activity</span><strong>{user?.activity_level?.replace("_", " ") || "Not set"}</strong></div>
              <div><span>Primary goal</span><strong>{user?.goal?.replace("_", " ") || user?.goal_30day || "Not set"}</strong></div>
            </div>

            <div className={styles.conditions}>
              <p className={styles.eyebrow}>Health focus</p>
              {conditions.length ? (
                <div>{conditions.map((condition) => <span key={condition}>{condition.replaceAll("-", " ")}</span>)}</div>
              ) : (
                <p>No health conditions have been added.</p>
              )}
            </div>
          </section>

          <section className={styles.encouragement}>
            <span className={styles.roundIcon}><Leaf size={18} /></span>
            <p className={styles.eyebrow}>Keep going, {firstName}</p>
            <h2>Small choices, noticed over time.</h2>
            <p>Your progress view uses only what you have actually logged.</p>
            <Link href="/app/progress">Continue your journey <ChevronRight size={15} /></Link>
          </section>
        </div>

        <section className={styles.settingsCard} aria-label="Profile settings">
          <div className={styles.settingsHeading}>
            <p className={styles.eyebrow}>Settings</p>
            <h2>Shape your experience</h2>
          </div>
          <div className={styles.settingsList}>
            {SETTINGS_ROWS.map((row) => {
              const Icon = row.icon;
              const content = (
                <>
                  <span className={styles.settingIcon}><Icon size={18} aria-hidden="true" /></span>
                  <span className={styles.settingCopy}>
                    <strong>{row.label}</strong>
                    <small>{row.description}</small>
                  </span>
                  {row.unavailable ? <span className={styles.soonBadge}>Soon</span> : <ChevronRight className={styles.chevron} size={16} aria-hidden="true" />}
                </>
              );

              if (row.href) {
                return <Link className={styles.settingRow} href={row.href} key={row.label}>{content}</Link>;
              }

              return (
                <button
                  className={styles.settingRow}
                  type="button"
                  key={row.label}
                  onClick={() => handleSetting(row)}
                  disabled={row.unavailable}
                  aria-expanded={row.action && row.action !== "edit" ? panel === row.action : undefined}
                >
                  {content}
                </button>
              );
            })}
          </div>

          {panel === "preferences" && (
            <div className={styles.infoPanel} role="status">
              <Salad size={18} />
              <div>
                <strong>Your current dietary preference</strong>
                <p>{user?.dietary_type || "No dietary preference is set."} Editing this setting here is not available yet.</p>
              </div>
            </div>
          )}
          {panel === "privacy" && (
            <div className={styles.infoPanel} role="status">
              <LockKeyhole size={18} />
              <div>
                <strong>Account security</strong>
                <p>Your signed-in session protects access to this profile. In-app password and data controls are not available yet.</p>
              </div>
            </div>
          )}
          {panel === "about" && (
            <div className={styles.infoPanel} role="status">
              <Leaf size={18} />
              <div>
                <strong>ZenPlate</strong>
                <p>Mindful nutrition planning, recipe discovery, and progress tracking in one calm experience.</p>
              </div>
            </div>
          )}

          <button className={styles.signOutButton} type="button" onClick={handleLogout}>Sign out</button>
        </section>
      </div>

      {editOpen && (
        <div
          className={styles.modalBackdrop}
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !saving) setEditOpen(false);
          }}
        >
          <section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="edit-profile-title">
            <div className={styles.modalHeader}>
              <div>
                <p className={styles.eyebrow}>Personal details</p>
                <h2 id="edit-profile-title">Edit profile</h2>
              </div>
              <button type="button" onClick={() => setEditOpen(false)} disabled={saving} aria-label="Close edit profile">
                <X size={19} />
              </button>
            </div>

            <form onSubmit={save}>
              <div className={styles.formGrid}>
                <label className={styles.fullField}>
                  <span>Name</span>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                    autoComplete="name"
                    required
                  />
                </label>
                <label>
                  <span>Age</span>
                  <input
                    type="number"
                    min="13"
                    max="120"
                    value={form.age}
                    onChange={(event) => setForm((current) => ({ ...current, age: event.target.value }))}
                    inputMode="numeric"
                  />
                </label>
                <label>
                  <span>Weight (kg)</span>
                  <input
                    type="number"
                    min="20"
                    max="400"
                    step="0.1"
                    value={form.weight_kg}
                    onChange={(event) => setForm((current) => ({ ...current, weight_kg: event.target.value }))}
                    inputMode="decimal"
                  />
                </label>
                <label>
                  <span>Height (cm)</span>
                  <input
                    type="number"
                    min="80"
                    max="250"
                    step="0.1"
                    value={form.height_cm}
                    onChange={(event) => setForm((current) => ({ ...current, height_cm: event.target.value }))}
                    inputMode="decimal"
                  />
                </label>
                <label>
                  <span>Activity level</span>
                  <select
                    value={form.activity_level}
                    onChange={(event) => setForm((current) => ({ ...current, activity_level: event.target.value }))}
                  >
                    <option value="sedentary">Sedentary</option>
                    <option value="light">Light</option>
                    <option value="moderate">Moderate</option>
                    <option value="active">Active</option>
                    <option value="very_active">Very active</option>
                  </select>
                </label>
              </div>
              {formError && <p className={styles.formError} role="alert">{formError}</p>}
              <button className={styles.saveButton} type="submit" disabled={saving}>
                {saving ? "Saving changes…" : "Save changes"}
              </button>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
