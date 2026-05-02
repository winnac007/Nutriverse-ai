import React from "react";
import { Lock, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import api from "../lib/api";
import { useAuth } from "../lib/auth";
import { toast } from "sonner";

export default function PremiumGate({ title = "Unlock Premium", description }) {
  const { refresh } = useAuth();
  const upgrade = async () => {
    try {
      await api.post("/user/upgrade");
      await refresh();
      toast.success("Welcome to NutriVerse Premium!");
    } catch {
      toast.error("Upgrade failed");
    }
  };
  return (
    <div data-testid="premium-gate" className="nv-card p-6 sm:p-8 text-center space-y-4 relative overflow-hidden">
      <div className="absolute inset-0 nv-gradient-pm opacity-10" />
      <div className="relative space-y-4">
        <div className="mx-auto size-14 rounded-2xl grid place-items-center nv-gradient-pm text-black">
          <Sparkles className="size-7" />
        </div>
        <h3 className="text-xl font-semibold">{title}</h3>
        {description && <p className="text-muted-foreground text-sm max-w-md mx-auto">{description}</p>}
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>✓ AI-personalized weekly meal plans</li>
          <li>✓ Unlimited recipes & rare cuisines</li>
          <li>✓ Video chef tutorials</li>
          <li>✓ Lab report & health-data integration</li>
        </ul>
        <Button data-testid="upgrade-btn" onClick={upgrade} className="rounded-full px-8 nv-gradient-pm text-black hover:opacity-90 border-0">
          <Lock className="size-4 mr-2" /> Upgrade – ₹300/mo
        </Button>
      </div>
    </div>
  );
}
