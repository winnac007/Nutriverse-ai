import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import { CONSULTANTS, getConsultant } from "@/lib/consultants";
import CoachProfileClient from "./CoachProfileClient";

type CoachPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return CONSULTANTS.map((c) => ({ id: c.id }));
}

export default async function CoachPage({ params }: CoachPageProps) {
  const { id } = await params;
  const coach = getConsultant(id);

  if (!coach) {
    notFound();
  }

  return (
    <Suspense fallback={<div className="p-8 text-center text-[#786C56]">Loading coach profile…</div>}>
      <CoachProfileClient coach={coach} />
    </Suspense>
  );
}

