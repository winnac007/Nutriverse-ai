"use client";

import { Suspense } from "react";
import FitnessClient from "./FitnessClient";

export default function FitnessPage() {
  return (
    <Suspense fallback={null}>
      <FitnessClient />
    </Suspense>
  );
}
