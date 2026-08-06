"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";


type Tab = {
  href: string;
  label: string;
  matches: (pathname: string) => boolean;
  icon: ReactNode;
};

const tabs: Tab[] = [
  {
    href: "/app",
    label: "Home",
    matches: (pathname) => pathname === "/app",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M3 10.5 12 3l9 7.5V21H6a3 3 0 0 1-3-3v-7.5Z" />
        <path d="M9 21v-7h6v7" />
      </svg>
    ),
  },
  {
    href: "/app/explore",
    label: "Discover",
    matches: (pathname) => pathname.startsWith("/app/explore") || pathname.startsWith("/app/story-map"),
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <circle cx="12" cy="12" r="9" />
        <path d="m15.6 8.4-2.1 5.1-5.1 2.1 2.1-5.1 5.1-2.1Z" />
      </svg>
    ),
  },
  {
    href: "/app/daily-plan",
    label: "Plate",
    matches: (pathname) => ["/app/daily-plan", "/app/meal-plan", "/app/recipe", "/app/grocery"].some((prefix) => pathname.startsWith(prefix)),
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M4 14h16c0 4-3.6 7-8 7s-8-3-8-7Z" />
        <path d="M2.5 14h19M8 11c0-2 1-3 1-5M12 11c0-2 1-3 1-5M16 11c0-2 1-3 1-5" />
      </svg>
    ),
  },
  {
    href: "/app/passport",
    label: "Passport",
    matches: (pathname) => pathname.startsWith("/app/passport"),
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M7 3h11a2 2 0 0 1 2 2v16H7a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3Z" />
        <path d="M7 3v18" />
        <circle cx="13.5" cy="11.5" r="3.5" />
        <path d="M10 11.5h7M13.5 8c1.3 1.4 1.3 5.6 0 7" />
      </svg>
    ),
  },
  {
    href: "/app/profile",
    label: "You",
    matches: (pathname) => pathname.startsWith("/app/profile"),
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname() ?? "/app";
  const culinaryTheme = pathname.startsWith("/app/explore") || pathname.startsWith("/app/passport");

  const palette = culinaryTheme
    ? {
        background: "rgba(9, 11, 9, 0.94)",
        border: "rgba(143, 112, 64, 0.4)",
        active: "#b7b25a",
        inactive: "#817a6c",
        activeSurface: "rgba(163, 161, 80, 0.16)",
      }
    : {
        background: "rgba(255, 255, 255, 0.9)",
        border: "#E5DDD0",
        active: "#3D5C3E",
        inactive: "#A8B8A8",
        activeSurface: "rgba(61, 92, 62, 0.1)",
      };

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-50"
      style={{
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        borderTop: `1px solid ${palette.border}`,
        background: palette.background,
        WebkitBackdropFilter: "blur(20px)",
        backdropFilter: "blur(20px)",
      }}
    >
      <nav
        className="flex items-center justify-around px-2 max-w-2xl mx-auto"
        style={{ height: "var(--app-bottom-nav-height)" }}
        aria-label="Primary navigation"
      >
        {tabs.map((tab) => {
          const isActive = tab.matches(pathname);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={isActive ? "page" : undefined}
              className="flex flex-col items-center gap-1 transition-all duration-200 min-w-[3rem] rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ color: isActive ? palette.active : palette.inactive }}
            >
              <span
                className="relative flex items-center justify-center w-12 h-8 rounded-xl transition-all duration-200"
                style={{ background: isActive ? palette.activeSurface : "transparent" }}
              >
                {tab.icon}
                {isActive ? (
                  <span
                    className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{ background: palette.active }}
                  />
                ) : null}
              </span>
              <span
                className="text-[10px] tracking-wide"
                style={{ fontWeight: isActive ? 600 : 400 }}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
