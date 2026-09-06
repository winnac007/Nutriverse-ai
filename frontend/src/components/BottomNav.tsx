"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";
import styles from "./BottomNav.module.css";


type Tab = {
  href: string;
  label: string;
  matches: (pathname: string) => boolean;
  icon: ReactNode;
};

const culinaryTabs: Tab[] = [
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
    label: "Profile",
    matches: (pathname) => pathname.startsWith("/app/profile"),
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
      </svg>
    ),
  },
];

const wellnessTabs: Tab[] = [
  culinaryTabs[0],
  {
    href: "/app/meals",
    label: "Meals",
    matches: (pathname) => [
      "/app/meals",
      "/app/daily-plan",
      "/app/meal-plan",
      "/app/grocery",
      "/app/food-guidelines",
      "/app/category",
    ].some((prefix) => pathname.startsWith(prefix)),
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 14h16c0 4-3.6 7-8 7s-8-3-8-7Z" />
        <path d="M2.5 14h19M8 11c0-2 1-3 1-5M12 11c0-2 1-3 1-5M16 11c0-2 1-3 1-5" />
      </svg>
    ),
  },
  {
    href: "/app/progress",
    label: "Journey",
    matches: (pathname) => pathname.startsWith("/app/progress") || pathname.startsWith("/app/track"),
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="5.5" width="16" height="15" rx="2.5" />
        <path d="M8 3v5M16 3v5M4 10h16M8 14h3M13 14h3M8 17h3" />
      </svg>
    ),
  },
  {
    href: "/app/consult",
    label: "Consult",
    matches: (pathname) => pathname.startsWith("/app/consult"),
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 11.5a7.5 7.5 0 0 1-8 7.47 8.7 8.7 0 0 1-3.2-.83L4 20l1.7-4.12A7.5 7.5 0 1 1 20 11.5Z" />
      </svg>
    ),
  },
  culinaryTabs[4],
];

export default function BottomNav() {
  const pathname = usePathname() ?? "/app";
  const culinaryTheme = [
    "/app/culinary",
    "/app/passport",
    "/app/recipe",
    "/app/story-map",
  ].some((prefix) => pathname.startsWith(prefix)) || pathname.startsWith("/app/explore/");

  const palette = culinaryTheme
    ? {
        background: "rgba(9, 11, 9, 0.94)",
        border: "rgba(143, 112, 64, 0.4)",
        active: "#b7b25a",
        inactive: "#817a6c",
        activeSurface: "rgba(163, 161, 80, 0.16)",
      }
    : {
        background: "rgba(250, 247, 238, 0.9)",
        border: "#DDD6C9",
        active: "#5E6B55",
        inactive: "#6B6258",
        activeSurface: "transparent",
      };

  const isHealthcareOrMarketplace =
    pathname.startsWith("/app/healthcare") || pathname.startsWith("/app/marketplace");

  const dynamicWellnessTabs: Tab[] = [
    wellnessTabs[0],
    wellnessTabs[1],
    isHealthcareOrMarketplace
      ? {
          href: "/app/marketplace",
          label: "Healthcare",
          matches: (p) => p.startsWith("/app/healthcare") || p.startsWith("/app/marketplace"),
          icon: (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: isHealthcareOrMarketplace ? "#374B33" : "transparent",
                color: isHealthcareOrMarketplace ? "#FFFFFF" : "currentColor",
                transition: "all 0.2s ease",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill={isHealthcareOrMarketplace ? "#FFFFFF" : "none"}
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ width: 15, height: 15 }}
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </span>
          ),
        }
      : wellnessTabs[2],
    wellnessTabs[3],
    wellnessTabs[4],
  ];

  const tabs = culinaryTheme ? culinaryTabs : dynamicWellnessTabs;
  const navigationStyle = {
    "--nav-background": palette.background,
    "--nav-border": palette.border,
  } as CSSProperties;

  return (
    <div
      className={`${styles.frame} ${culinaryTheme ? styles.culinary : ""}`}
      style={navigationStyle}
    >
      <nav
        className={styles.nav}
        aria-label="Primary navigation"
      >
        {tabs.map((tab) => {
          const isActive = tab.matches(pathname);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={isActive ? "page" : undefined}
              className={`${styles.link} ${isActive ? styles.active : ""}`}
              style={{
                "--nav-item-color": isActive ? palette.active : palette.inactive,
                "--nav-item-surface": isActive ? palette.activeSurface : "transparent",
              } as CSSProperties}
            >
              <span className={styles.iconFrame}>
                {tab.icon}
                {isActive && culinaryTheme ? <span className={styles.dot} /> : null}
              </span>
              <span className={styles.label}>{tab.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
