"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, CalendarDays, BarChart3, User } from "lucide-react";

const tabs = [
  { href: "/app", label: "Home", icon: Home },
  { href: "/app/explore", label: "Explore", icon: Compass },
  { href: "/app/meal-plan", label: "Meal Plan", icon: CalendarDays },
  { href: "/app/track", label: "Track", icon: BarChart3 },
  { href: "/app/profile", label: "Profile", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 glass border-t"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="max-w-3xl mx-auto flex items-stretch justify-between px-2 py-2">
        {tabs.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== "/app" && pathname?.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-1 flex-col items-center gap-1 py-2 rounded-xl transition-all ${
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="size-5" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
