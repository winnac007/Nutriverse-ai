import Link from "next/link";

export function Nav() {
  return (
    <nav className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-4 sm:px-6 sm:py-6 md:px-12">
      <a href="#top" className="font-serif text-lg tracking-[0.24em] text-espresso transition hover:text-olive sm:text-xl sm:tracking-[0.32em]">
        ZENPLATO
      </a>
      <div className="hidden md:flex items-center gap-10 text-sm">
        <a href="#healthcare" className="text-espresso/70 hover:text-olive transition">Healthcare</a>
        <a href="#fitness" className="text-espresso/70 hover:text-olive transition">Fitness</a>
        <a href="#discover" className="text-espresso/70 hover:text-olive transition">Discover</a>
        <a href="#library" className="text-espresso/70 hover:text-olive transition">Library</a>
      </div>
      <div className="flex items-center gap-1 sm:gap-3">
        <Link
          href="/auth?mode=login&next=/app"
          className="px-2 py-2.5 text-xs font-medium text-espresso/75 transition hover:text-olive sm:px-4 sm:text-sm"
        >
          Sign in
        </Link>
        <a
          href="#early-access"
          className="rounded-full bg-olive px-3 py-2.5 text-xs text-ivory transition hover:bg-[var(--olive-deep)] sm:px-5 sm:text-sm"
        >
          Early access
        </a>
      </div>
    </nav>
  );
}
