import React, { Suspense } from "react";
import ConsultDirectoryClient from "./ConsultDirectoryClient";

export const metadata = {
  title: "Care Team & Experts • Zenplato",
  description: "Find nutritionists, fitness trainers, and holistic wellness coaches for your wellness goals.",
};

export default function ConsultPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#786C56]">Loading specialists…</div>}>
      <ConsultDirectoryClient />
    </Suspense>
  );
}
