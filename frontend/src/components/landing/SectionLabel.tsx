export function SectionLabel({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-serif text-2xl text-olive/70 italic">{index}</span>
      <span className="h-px w-8 bg-olive/30" />
      <span className="eyebrow">{children}</span>
    </div>
  );
}
