"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

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
        toast.success("Welcome to NutriVerse");
        router.push(u.onboarded ? "/app" : "/onboarding");
      } else {
        const u = await login(email, password);
        toast.success("Signed in");
        router.push(u.onboarded ? "/app" : "/onboarding");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center p-6 bg-background">
      <div className="w-full max-w-sm nv-card p-8">
        <Link href="/" className="flex items-center gap-2 mb-6">
          <div className="size-8 rounded-lg nv-gradient-hc grid place-items-center text-black font-bold">N</div>
          <span className="font-display text-xl font-bold">NutriVerse</span>
        </Link>
        <h1 className="text-2xl font-display font-semibold mb-1">
          {mode === "register" ? "Create account" : "Welcome back"}
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          {mode === "register" ? "Start your nutrition journey." : "Sign in to continue."}
        </p>

        <form onSubmit={submit} className="space-y-4">
          {mode === "register" && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e: any) => setName(e.target.value)} required />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e: any) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e: any) => setPassword(e.target.value)} required minLength={6} />
          </div>
          <Button type="submit" disabled={busy} className="w-full rounded-full">
            {busy ? "…" : mode === "register" ? "Create account" : "Sign in"}
          </Button>
        </form>
        <button
          type="button"
          onClick={() => setMode(mode === "register" ? "login" : "register")}
          className="mt-6 text-sm text-muted-foreground hover:text-foreground w-full"
        >
          {mode === "register" ? "Already have an account? Sign in" : "New here? Create an account"}
        </button>
      </div>
    </div>
  );
}

export default function Auth() {
  return (
    <Suspense fallback={<div className="min-h-screen grid place-items-center bg-background">Loading…</div>}>
      <AuthContent />
    </Suspense>
  );
}
