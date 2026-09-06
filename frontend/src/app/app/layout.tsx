"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import BottomNav from "@/components/BottomNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isEbook = pathname?.startsWith("/app/ebook");
  const isCulinary = [
    "/app/culinary",
    "/app/passport",
    "/app/story-map",
  ].some((prefix) => pathname?.startsWith(prefix)) || Boolean(pathname?.startsWith("/app/explore/"));
  const hideBottomNav = isEbook || pathname === "/app/culinary" || pathname === "/app/explore/welcome";
  const usesReferenceShell =
    pathname === "/app" ||
    pathname === "/app/explore" ||
    pathname?.startsWith("/app/healthcare") ||
    pathname?.startsWith("/app/meals") ||
    pathname?.startsWith("/app/recipe") ||
    pathname?.startsWith("/app/fitness") ||
    pathname?.startsWith("/app/marketplace") ||
    pathname?.startsWith("/app/chef") ||
    pathname?.startsWith("/app/category") ||
    pathname?.startsWith("/app/coaches") ||
    pathname?.startsWith("/app/consult");

  useEffect(() => {
    if (!loading) {
      if (!user) router.replace("/auth");
      else if (!user.onboarded) router.replace("/onboarding");
    }
  }, [user, loading, router]);

  if (loading || !user?.onboarded) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#F5EFE2",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 16,
      }}>
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <path d="M20 4 Q20 14 20 8" stroke="#3D5C3E" strokeWidth="2" strokeLinecap="round" />
          <path d="M20 12 Q14 9 12 4 Q18 7 20 12 Z" fill="#3D5C3E" fillOpacity="0.6" />
          <path d="M20 12 Q26 9 28 4 Q22 7 20 12 Z" fill="#3D5C3E" fillOpacity="0.8" />
          <path d="M12 24 L28 24 Q28 34 20 36 Q12 34 12 24 Z" fill="#3D5C3E" opacity="0.9" />
          <ellipse cx="20" cy="24" rx="8" ry="2" fill="#2D4530" />
        </svg>
        <p style={{ fontFamily: "DM Sans, system-ui, sans-serif", fontSize: 13, color: "#8D9E8D" }}>Loading…</p>
      </div>
    );
  }

  return (
    <div
      className={isEbook ? "" : isCulinary ? "" : "core-app"}
      style={{
        minHeight: isEbook || isCulinary ? "100vh" : "100dvh",
        background: isEbook ? "#0A0D16" : isCulinary ? "#090B09" : "#F4F1E8",
      }}
    >
      <main
        className={
          isEbook
            ? ""
            : isCulinary
              ? "max-w-md md:max-w-3xl lg:max-w-6xl mx-auto"
              : usesReferenceShell
                ? "w-full max-w-3xl mx-auto min-h-[100dvh] px-4 sm:px-6 pt-6"
                : "w-full max-w-[78rem] mx-auto min-h-[100dvh]"
        }
        style={hideBottomNav ? {} : {
          paddingBottom: `calc(var(--app-bottom-nav-height) + env(safe-area-inset-bottom, 0px) + ${isCulinary ? "1rem" : "2rem"} + 1px)`,
        }}
      >
        {children}
      </main>
      {!hideBottomNav && <BottomNav />}
    </div>
  );
}
