"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

const inp: React.CSSProperties = {
  width: "100%", padding: "0.75rem 1rem",
  border: "1.5px solid #E0D8CC", borderRadius: "0.75rem",
  fontSize: "0.9rem", color: "#1F2E1F", outline: "none",
  fontFamily: "'DM Sans', sans-serif", background: "#FDFAF6",
  transition: "border-color 0.2s",
};

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "register" ? "register" : "login";
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const { login, register } = useAuth();

  useEffect(() => {
    const m = searchParams.get("mode") === "register" ? "register" : "login";
    setMode(m);
  }, [searchParams]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "register") {
        const u = await register(email, password, name);
        toast.success("Welcome to Zenplate");
        router.push(u.onboarded ? "/app" : "/onboarding");
      } else {
        const u = await login(email, password);
        toast.success("Welcome back");
        router.push(u.onboarded ? "/app" : "/onboarding");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] flex" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');input:focus{border-color:#3D5C3E!important;}`}</style>

      {/* Left botanical art — visible on wider screens */}
      <div className="hidden lg:flex w-[45%] flex-col items-center justify-center p-12 relative overflow-hidden" style={{ background: "linear-gradient(160deg, #2D4A2E 0%, #1A2E1B 100%)" }}>
        <svg style={{ position: "absolute", top: 0, right: 0, opacity: 0.2 }} width="200" height="200" viewBox="0 0 200 200" fill="none">
          <ellipse cx="150" cy="40" rx="50" ry="90" fill="#FFFFFF" transform="rotate(-25 150 40)"/>
          <ellipse cx="180" cy="120" rx="35" ry="65" fill="#FFFFFF" transform="rotate(15 180 120)"/>
        </svg>
        <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          {/* Zen circle */}
          <svg width="90" height="90" viewBox="0 0 90 90" fill="none" style={{ marginBottom: "2rem" }}>
            <circle cx="45" cy="45" r="40" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" fill="none"/>
            <circle cx="45" cy="45" r="30" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" fill="none"/>
            <ellipse cx="45" cy="50" rx="16" ry="11" fill="rgba(255,255,255,0.15)"/>
            <circle cx="45" cy="33" r="7" fill="rgba(255,255,255,0.5)"/>
            <path d="M40 30 L38 25 M50 30 L52 25" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", color: "#FFFFFF", fontWeight: 400, margin: "0 0 0.5rem" }}>ZENPLATE</p>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: "rgba(255,255,255,0.65)", fontStyle: "italic", margin: 0 }}>Eat with intention.<br/>Heal with food.</p>
        </div>
        <div style={{ position: "absolute", bottom: "2rem", textAlign: "center", width: "100%" }}>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem" }}>2,400+ people healing with Zenplate</p>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-[440px] bg-white rounded-[1.5rem] border border-[#E5DDD0] p-6 sm:p-10 shadow-[0_8px_40px_rgba(31,46,31,0.08)]">
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", marginBottom: "2rem" }}>
            <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="18" r="16" stroke="#3D5C3E" strokeWidth="2.5" fill="none" opacity="0.7"/>
              <circle cx="18" cy="14" r="2.5" fill="#3D5C3E"/>
              <path d="M14 22 Q18 16 22 22" stroke="#3D5C3E" strokeWidth="1.5" fill="none"/>
            </svg>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: "#1F2E1F", letterSpacing: "0.04em" }}>ZENPLATE</span>
          </Link>

          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.75rem", fontWeight: 400, color: "#1F2E1F", margin: "0 0 0.4rem" }}>
            {mode === "register" ? "Begin your journey" : "Welcome back"}
          </h1>
          <p style={{ fontSize: "0.85rem", color: "#8D9E8D", margin: "0 0 2rem", lineHeight: 1.5 }}>
            {mode === "register" ? "Create your account to start healing with food." : "Sign in to continue your wellness journey."}
          </p>

          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {mode === "register" && (
              <div>
                <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#8D9E8D", marginBottom: "0.4rem" }}>Name</label>
                <input style={inp} value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required />
              </div>
            )}
            <div>
              <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#8D9E8D", marginBottom: "0.4rem" }}>Email</label>
              <input style={inp} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#8D9E8D", marginBottom: "0.4rem" }}>Password</label>
              <input style={inp} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
            </div>
            <button type="submit" disabled={busy} style={{ marginTop: "0.5rem", background: busy ? "#A8B8A8" : "#3D5C3E", color: "#FFFFFF", border: "none", borderRadius: 999, padding: "0.9rem", fontSize: "0.95rem", fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: busy ? "default" : "pointer", boxShadow: busy ? "none" : "0 4px 20px rgba(61,92,62,0.25)", transition: "all 0.2s" }}>
              {busy ? "Please wait…" : mode === "register" ? "Create account" : "Sign in"}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", margin: "1.5rem 0" }}>
            <div style={{ flex: 1, height: 1, background: "#E5DDD0" }} />
            <span style={{ fontSize: "0.72rem", color: "#A8B8A8" }}>or</span>
            <div style={{ flex: 1, height: 1, background: "#E5DDD0" }} />
          </div>

          <button type="button" onClick={() => setMode(mode === "register" ? "login" : "register")} style={{ width: "100%", background: "transparent", border: "1.5px solid #E0D8CC", borderRadius: 999, padding: "0.75rem", fontSize: "0.88rem", color: "#4A5E4A", fontFamily: "'DM Sans', sans-serif", cursor: "pointer", fontWeight: 500 }}>
            {mode === "register" ? "Already have an account? Sign in" : "New to Zenplate? Create an account"}
          </button>

          <p style={{ textAlign: "center", fontSize: "0.72rem", color: "#A8B8A8", marginTop: "1.5rem" }}>
            🔒 Your information is safe and private
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Auth() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#FAF7F0" }}>Loading…</div>}>
      <AuthContent />
    </Suspense>
  );
}
