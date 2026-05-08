import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import BottomNav from "./BottomNav";
import { useAuth } from "../lib/auth";

export default function AppLayout() {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen grid place-items-center text-muted-foreground">Loading…</div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (!user.onboarded) return <Navigate to="/onboarding" replace />;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 pb-28">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
