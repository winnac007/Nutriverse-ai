export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg width="22" height="26" viewBox="0 0 22 26" fill="none" className="text-olive">
        <path d="M11 24 L11 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M11 13 C 6 11, 3 7, 4 2 C 9 3, 12 7, 11 13 Z" fill="currentColor" opacity="0.85" />
        <path d="M11 16 C 16 14, 19 10, 18 5 C 13 6, 10 10, 11 16 Z" fill="currentColor" opacity="0.6" />
      </svg>
      <span className="font-serif text-[18px] tracking-[0.28em] text-espresso">ZENPLATO</span>
    </div>
  );
}
