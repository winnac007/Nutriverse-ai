import React, { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useAuth } from "../lib/auth";
import { toast } from "sonner";
import Logo from "../components/Logo";

export default function Auth() {
  const [search] = useSearchParams();
  const initialMode = search.get("mode") === "register" ? "register" : "login";
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const { login, register } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "register") {
        const u = await register(email, password, name);
        toast.success("Welcome to Zenplato");
        nav(u.onboarded ? "/app" : "/onboarding");
      } else {
        const u = await login(email, password);
        toast.success("Welcome back");
        nav(u.onboarded ? "/app" : "/onboarding");
      }
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center p-6" style={{ background: "#f7f3e7" }}>
      <div className="w-full max-w-sm rounded-3xl p-8 zp-card-soft nv-shadow">
        <Link to="/" className="block mb-8" data-testid="auth-logo">
          <Logo size="md" />
        </Link>
        <p className="font-overline mb-2" style={{ color: "#5e6b55" }}>
          {mode === "register" ? "Begin your journey" : "Welcome back"}
        </p>
        <h1 className="font-display text-3xl mb-1" style={{ color: "#2e2a26" }}>
          {mode === "register" ? "Create your account" : "Sign in"}
        </h1>
        <p className="text-sm mb-7" style={{ color: "#6b6258" }}>
          {mode === "register" ? "A calmer relationship with what you eat." : "Continue where you left off."}
        </p>

        <form onSubmit={submit} className="space-y-4">
          {mode === "register" && (
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider" style={{ color: "#6b6258" }}>Name</Label>
              <Input data-testid="auth-name" value={name} onChange={(e) => setName(e.target.value)} required className="h-11 bg-white" />
            </div>
          )}
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wider" style={{ color: "#6b6258" }}>Email</Label>
            <Input data-testid="auth-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-11 bg-white" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wider" style={{ color: "#6b6258" }}>Password</Label>
            <Input data-testid="auth-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="h-11 bg-white" />
          </div>
          <Button data-testid="auth-submit" type="submit" disabled={busy}
            className="w-full rounded-full h-12 text-sm font-medium border-0 mt-2"
            style={{ background: "#5e6b55", color: "#f4f1e8" }}>
            {busy ? "…" : mode === "register" ? "Create account" : "Sign in"}
          </Button>
        </form>
        <button
          data-testid="auth-toggle"
          type="button"
          onClick={() => setMode(mode === "register" ? "login" : "register")}
          className="mt-6 text-sm w-full"
          style={{ color: "#5e6b55" }}
        >
          {mode === "register" ? "Already have an account? Sign in" : "New here? Create an account"}
        </button>
        <p className="text-xs italic text-center mt-6" style={{ color: "#9b9080" }}>You are the zen for your body.</p>
      </div>
    </div>
  );
}
