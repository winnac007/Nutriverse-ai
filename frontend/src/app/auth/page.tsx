"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import styles from "./Auth.module.css";

function ZenMark({ inverse = false }: { inverse?: boolean }) {
  return (
    <span className={`${styles.mark} ${inverse ? styles.markInverse : ""}`} aria-hidden="true">
      <span className={styles.markBowl} />
      <span className={styles.markStem} />
      <span className={styles.markLeafLeft} />
      <span className={styles.markLeafRight} />
    </span>
  );
}

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "register" ? "register" : "login";
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState("");
  const { login, register } = useAuth();

  const getSafeNext = () => {
    const next = searchParams.get("next");
    return next?.startsWith("/") && !next.startsWith("//") ? next : null;
  };

  useEffect(() => {
    const nextMode = searchParams.get("mode") === "register" ? "register" : "login";
    setMode(nextMode);
    setFormError("");
  }, [searchParams]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setFormError("");

    try {
      if (mode === "register") {
        const user = await register(email, password, name);
        toast.success("Welcome to Zenplate");
        router.push(getSafeNext() || (user.onboarded ? "/app" : "/onboarding"));
      } else {
        const user = await login(email, password);
        toast.success("Welcome back");
        router.push(getSafeNext() || (user.onboarded ? "/app" : "/onboarding"));
      }
    } catch (error: any) {
      const message = error?.response?.data?.detail || "Something went wrong. Please try again.";
      setFormError(message);
      toast.error(message);
    } finally {
      setBusy(false);
    }
  };

  const toggleMode = () => {
    setMode((current) => current === "register" ? "login" : "register");
    setFormError("");
  };

  return (
    <main className={styles.page}>
      <section className={styles.story} aria-label="Zenplate philosophy">
        <div className={styles.storyImage} aria-hidden="true" />
        <div className={styles.storyWash} aria-hidden="true" />
        <div className={styles.botanicalTop} aria-hidden="true" />
        <div className={styles.botanicalBottom} aria-hidden="true" />

        <div className={styles.storyContent}>
          <div className={styles.enso} aria-hidden="true"><ZenMark inverse /></div>
          <p className={styles.wordmark}>ZENPLATE</p>
          <div className={styles.lotusRule} aria-hidden="true"><span>✦</span></div>
          <h1>Eat with intention.<br />Heal with food.</h1>
          <p className={styles.storyBody}>
            Personalised nourishment rooted in your culture, rhythm, and real life.
          </p>
        </div>

        <p className={styles.storyFoot}>A calmer way to care for your everyday health</p>
      </section>

      <section className={styles.formSide}>
        <div className={styles.mobileBrand}>
          <Link href="/" className={styles.brandLink} aria-label="Zenplate home">
            <ZenMark />
            <span>ZENPLATE</span>
          </Link>
          <p>Eat with intention. Heal with food.</p>
        </div>

        <div className={styles.formWrap}>
          <Link href="/" className={styles.desktopBrand} aria-label="Zenplate home">
            <ZenMark />
            <span>ZENPLATE</span>
          </Link>

          <p className={styles.eyebrow}>{mode === "register" ? "Your journey begins" : "Welcome home"}</p>
          <h2>{mode === "register" ? "Create your space" : "Continue your journey"}</h2>
          <p className={styles.intro}>
            {mode === "register"
              ? "Tell us where to save the plan we will shape around you."
              : "Sign in to return to your meals, progress, and wellness plan."}
          </p>

          <form onSubmit={submit} className={styles.form}>
            {mode === "register" && (
              <label className={styles.field}>
                <span>Name</span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your name"
                  autoComplete="name"
                  required
                />
              </label>
            )}

            <label className={styles.field}>
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </label>

            <label className={styles.field}>
              <span>Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 6 characters"
                autoComplete={mode === "register" ? "new-password" : "current-password"}
                required
                minLength={6}
              />
            </label>

            {formError && <p className={styles.error} role="alert">{formError}</p>}

            <button className={styles.submit} type="submit" disabled={busy} aria-busy={busy}>
              <span>{busy ? "Please wait…" : mode === "register" ? "Create account" : "Sign in"}</span>
              {!busy && <span aria-hidden="true">→</span>}
            </button>
          </form>

          <div className={styles.divider}><span>or</span></div>

          <button type="button" onClick={toggleMode} className={styles.switchMode}>
            {mode === "register" ? "Already have an account? Sign in" : "New to Zenplate? Create an account"}
          </button>

          <Link className={styles.professionalLink} href="/professional">
            Joining as a consultant or chef? Open the professional portal →
          </Link>

          <p className={styles.privacy}>
            <span aria-hidden="true">♢</span> Your information is safe and private
          </p>
        </div>
      </section>
    </main>
  );
}

export default function Auth() {
  return (
    <Suspense fallback={<div className={styles.loading} role="status">Preparing your space…</div>}>
      <AuthContent />
    </Suspense>
  );
}
