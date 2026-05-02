import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Compass, CalendarDays, BarChart3, User } from "lucide-react";

const tabs = [
  { to: "/app", label: "Home", icon: Home, testid: "bnav-home" },
  { to: "/app/explore", label: "Explore", icon: Compass, testid: "bnav-explore" },
  { to: "/app/meal-plan", label: "Meal Plan", icon: CalendarDays, testid: "bnav-mealplan" },
  { to: "/app/track", label: "Track", icon: BarChart3, testid: "bnav-track" },
  { to: "/app/profile", label: "Profile", icon: User, testid: "bnav-profile" },
];

export default function BottomNav() {
  return (
    <nav
      data-testid="bottom-nav"
      className="fixed bottom-0 inset-x-0 z-40 glass border-t"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="max-w-3xl mx-auto flex items-stretch justify-between px-2 py-2">
        {tabs.map(({ to, label, icon: Icon, testid }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/app"}
            data-testid={testid}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-1 py-2 rounded-xl transition-all ${
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`
            }
          >
            <Icon className="size-5" />
            <span className="text-xs font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
