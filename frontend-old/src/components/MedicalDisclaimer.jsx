import React from "react";
import { AlertTriangle } from "lucide-react";

export default function MedicalDisclaimer({ variant = "inline" }) {
  const text =
    "This app provides general nutritional guidance and is not a substitute for professional medical advice. Always consult your doctor before making dietary changes, especially with a medical condition.";

  if (variant === "page-footer") {
    return (
      <div className="mt-8 pt-6 border-t border-border">
        <p className="text-xs text-muted-foreground leading-relaxed flex gap-2">
          <AlertTriangle className="size-3.5 shrink-0 mt-0.5 text-amber-500" />
          {text}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-950/20 px-4 py-3 flex gap-2.5">
      <AlertTriangle className="size-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
      <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">{text}</p>
    </div>
  );
}
