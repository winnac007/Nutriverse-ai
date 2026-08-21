import { notFound } from "next/navigation";
import { CONSULTANTS, getConsultant, type ConsultationMode } from "@/lib/consultants";
import ConsultantProfileClient from "./ConsultantProfileClient";

type ConsultantProfilePageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ book?: string; mode?: string }>;
};

export function generateStaticParams() {
  return CONSULTANTS.map((consultant) => ({ id: consultant.id }));
}

export default async function ConsultantProfilePage({ params, searchParams }: ConsultantProfilePageProps) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const consultant = getConsultant(id);

  if (!consultant) notFound();

  const initialMode: ConsultationMode = query.mode === "chat" || query.mode === "audio" ? query.mode : "video";

  return (
    <ConsultantProfileClient
      consultant={consultant}
      initialBooking={query.book === "true"}
      initialMode={initialMode}
    />
  );
}
