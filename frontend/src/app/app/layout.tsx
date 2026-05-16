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
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#FAF7F0", fontFamily: "'DM Sans', sans-serif", color: "#8D9E8D" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ animation: "spin 3s linear infinite" }}>
            <circle cx="24" cy="24" r="20" stroke="#3D5C3E" strokeWidth="2" fill="none" opacity="0.3" strokeDasharray="100 30"/>
            <circle cx="24" cy="18" r="5" fill="#3D5C3E" opacity="0.6"/>
          </svg>
          <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
          <span style={{ fontSize: "0.85rem" }}>Loading…</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#FAF7F0" }}>
      <main style={{ maxWidth: 480, margin: "0 auto", paddingBottom: "5.5rem" }}>
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
