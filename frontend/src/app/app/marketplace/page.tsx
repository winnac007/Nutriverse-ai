import React, { Suspense } from "react";
import MarketplaceClient from "./MarketplaceClient";

export const metadata = {
  title: "Healthcare Marketplace • Zenplato",
  description: "Curated kits and Ayurvedic essentials to support your health naturally.",
};

export default function MarketplacePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#786C56]">Loading marketplace…</div>}>
      <MarketplaceClient />
    </Suspense>
  );
}

