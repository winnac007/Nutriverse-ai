"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { ChefHat, Sprout } from "lucide-react";
import professionalApi, {
  PROFESSIONAL_ACCESS_TOKEN_KEY,
  PROFESSIONAL_REFRESH_TOKEN_KEY,
  persistProfessionalSession,
} from "@/lib/professionalApi";
import styles from "./Professional.module.css";

export type ProfessionalRole = "consultant" | "chef";

type Props = {
  role: ProfessionalRole;
  mode: "register" | "login";
};

export default function ProfessionalAuth({ role, mode }: Props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [headline, setHeadline] = useState("");
  const [credentials, setCredentials] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [specialties, setSpecialties] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const hasSession = Boolean(
      localStorage.getItem(PROFESSIONAL_ACCESS_TOKEN_KEY)
      || localStorage.getItem(PROFESSIONAL_REFRESH_TOKEN_KEY),
    );
    if (!hasSession) return;
    professionalApi.get("/professionals/me")
      .then(({ data }) => {
        if (data.role === role) router.replace(`/professional/${role}/dashboard`);
      })
      .catch(() => undefined);
  }, [role, router]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const payload = mode === "register"
        ? {
            role,
            name,
            email,
            password,
            headline,
            credentials,
            location,
            bio,
            specialties: specialties.split(",").map((item) => item.trim()).filter(Boolean),
          }
        : { role, email, password };
      const { data } = await professionalApi.post(`/professionals/${mode}`, payload);
      persistProfessionalSession(data);
      router.replace(`/professional/${role}/dashboard`);
    } catch (requestError: any) {
      setError(requestError?.response?.data?.detail || "We could not continue. Check your details and try again.");
    } finally {
      setBusy(false);
    }
  };

  const isConsultant = role === "consultant";
  const roleLabel = isConsultant ? "consultant" : "chef";
  const Icon = isConsultant ? Sprout : ChefHat;

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.topbar}>
          <Link className={styles.brand} href="/professional"><Icon aria-hidden="true" /><span>Zenplato</span></Link>
          <Link className={styles.backLink} href="/professional">All professional paths</Link>
        </header>

        <div className={styles.authLayout}>
          <section className={styles.authCopy}>
            <p className={styles.eyebrow}>{isConsultant ? "Care partner" : "Chef's table"}</p>
            <h1>{mode === "register" ? `Create your ${roleLabel} workspace.` : `Welcome back to your ${roleLabel} dashboard.`}</h1>
            <p>
              {isConsultant
                ? "Manage your public expertise, availability and incoming consultation requests in one calm workspace."
                : "Publish Chef Specials, manage free and premium dishes, and keep your recipe catalogue current."}
            </p>
          </section>

          <section className={styles.authCard} aria-labelledby="professional-form-title">
            <p className={styles.eyebrow}>{mode === "register" ? "Registration" : "Secure sign in"}</p>
            <h1 id="professional-form-title">{mode === "register" ? `Join as a ${roleLabel}` : `${isConsultant ? "Consultant" : "Chef"} sign in`}</h1>
            <form className={styles.form} onSubmit={submit}>
              {mode === "register" ? (
                <>
                  <label className={styles.field}><span>Full name</span><input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" required minLength={2} /></label>
                  <label className={styles.field}><span>Professional headline</span><input value={headline} onChange={(event) => setHeadline(event.target.value)} placeholder={isConsultant ? "Clinical nutritionist" : "Pastry and wellness chef"} required minLength={3} /></label>
                  <label className={styles.field}><span>Credentials</span><input value={credentials} onChange={(event) => setCredentials(event.target.value)} placeholder={isConsultant ? "RD, MSc Nutrition" : "Culinary Institute, 8 years"} required minLength={2} /></label>
                  <label className={styles.field}><span>Specialties, comma separated</span><input value={specialties} onChange={(event) => setSpecialties(event.target.value)} placeholder={isConsultant ? "PCOS, diabetes, gut health" : "Mindful desserts, plant-based baking"} /></label>
                  <label className={styles.field}><span>Location</span><input value={location} onChange={(event) => setLocation(event.target.value)} autoComplete="address-level2" placeholder="City, country" /></label>
                  <label className={styles.textareaField}><span>Short bio</span><textarea value={bio} onChange={(event) => setBio(event.target.value)} placeholder="Tell clients about your approach." /></label>
                </>
              ) : null}
              <label className={styles.field}><span>Email</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></label>
              <label className={styles.field}><span>Password</span><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === "register" ? "new-password" : "current-password"} required minLength={6} /></label>
              {error ? <p className={styles.error} role="alert">{error}</p> : null}
              <button className={styles.primaryButton} type="submit" disabled={busy} aria-busy={busy}>
                {busy ? "Please wait…" : mode === "register" ? "Create professional account" : "Open dashboard"}
              </button>
            </form>
            <p className={styles.formFoot}>
              {mode === "register" ? "Already registered? " : `New ${roleLabel}? `}
              <Link className={styles.textLink} href={`/professional/${role}/${mode === "register" ? "login" : "register"}`}>
                {mode === "register" ? "Sign in" : "Create an account"}
              </Link>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
