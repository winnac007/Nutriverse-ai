"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/lib/auth";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/auth");
      } else if (!user.onboarded) {
        router.replace("/onboarding");
      }
    }
  }, [user, loading, router]);

  if (loading || !user || !user.onboarded) {
    return (
      <div className="min-h-screen grid place-items-center text-muted-foreground bg-background">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 pb-28">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
