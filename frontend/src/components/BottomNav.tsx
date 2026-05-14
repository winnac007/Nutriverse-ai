"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, UtensilsCrossed, Maximize, BarChart2, User } from "lucide-react";

const tabs = [
  { href: "/app", label: "Home", icon: Home },
  { href: "/app/meals", label: "Meals", icon: UtensilsCrossed },
  { href: "/app/scan", label: "Scan", icon: Maximize },
  { href: "/app/progress", label: "Progress", icon: BarChart2 },
  { href: "/app/profile", label: "You", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-white/80 backdrop-blur-xl border-t border-border/40 pb-safe">
      <nav className="flex items-center justify-around h-20 px-4 max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || (tab.href !== "/app" && pathname?.startsWith(tab.href));
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center gap-1 transition-all duration-300 ${
                isActive ? "text-primary" : "text-foreground/30 hover:text-primary/60"
              }`}
            >
              <div className={`relative p-2 rounded-2xl transition-all ${isActive ? "bg-primary/10" : ""}`}>
                <tab.icon className="size-6" />
                {isActive && (
                    <motion.div 
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-2xl border-2 border-primary/20"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                )}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest">{tab.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

import { motion } from "framer-motion";
