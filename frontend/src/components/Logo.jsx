import React from "react";
import { Sprout } from "lucide-react";

// Zenplato wordmark — Playfair Display with a sprout leaf
export default function Logo({ size = "md", showWord = true, className = "" }) {
  const sizes = {
    sm: { icon: "size-5", text: "text-base tracking-[0.25em]" },
    md: { icon: "size-6", text: "text-xl tracking-[0.3em]" },
    lg: { icon: "size-8", text: "text-2xl sm:text-3xl tracking-[0.35em]" },
    xl: { icon: "size-10", text: "text-3xl sm:text-4xl tracking-[0.4em]" },
  };
  const s = sizes[size] || sizes.md;
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`} data-testid="zp-logo">
      <Sprout className={s.icon} style={{ color: "#5e6b55" }} />
      {showWord && (
        <span
          className={`font-display font-semibold uppercase ${s.text}`}
          style={{ color: "#2e2a26", fontFamily: "Playfair Display, serif" }}
        >
          Zenplato
        </span>
      )}
    </span>
  );
}
