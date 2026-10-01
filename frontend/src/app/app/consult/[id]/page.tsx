import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import {
  CONSULTANTS,
  getConsultant,
  type ConsultationMode,
} from "@/lib/consultants";
import ConsultantProfileClient from "./ConsultantProfileClient";

type ConsultantProfilePageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    booking?: string;
    mode?: string;
  }>;
};

export function generateStaticParams() {
  return CONSULTANTS.map((consultant) => ({ id: consultant.id }));
}

export default async function ConsultantProfilePage({ params, searchParams }: ConsultantProfilePageProps) {
  const { id } = await params;
  const query = await searchParams;
  const consultant = getConsultant(id);

  if (!consultant) notFound();

  const requestedMode = query.mode;
  const initialMode: ConsultationMode =
    requestedMode === "chat" || requestedMode === "audio" || requestedMode === "video"
      ? requestedMode
      : "video";

  return (
    <Suspense fallback={<div className="p-8 text-center text-[#786C56]">Loading specialist profile…</div>}>
      <ConsultantProfileClient
        consultant={consultant}
        initialBooking={query.booking === "1"}
        initialMode={initialMode}
      />
    </Suspense>
  );
}
