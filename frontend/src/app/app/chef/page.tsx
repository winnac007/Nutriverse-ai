import React, { Suspense } from "react";
import ChefClient from "./ChefClient";

export const metadata = {
  title: "Featured Chef • Chef Harshita • Zenplato",
  description: "Creating nourishing, delicious meals that heal the body and delight the soul.",
};

export default function ChefPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#786C56]">Loading chef profile…</div>}>
      <ChefClient />
    </Suspense>
  );
}

