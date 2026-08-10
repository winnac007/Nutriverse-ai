import CountryExperience from "@/components/culinary/CountryExperience";

export default async function CulinaryCountryPage({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params;
  return <CountryExperience slug={country} />;
}
