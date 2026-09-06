import React, { Suspense } from "react";
import CoachesListClient from "./CoachesListClient";

export const metadata = {
  title: "Health Coaches • Zenplato",
  description: "Expert guidance for your wellness journey. Nutritionists, fitness trainers, and holistic wellness coaches.",
};

export default function CoachesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#786C56]">Loading health coaches…</div>}>
      <CoachesListClient />
    </Suspense>
  );
}

