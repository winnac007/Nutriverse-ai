export function Nav() {
  return (
    <nav className="absolute top-0 left-0 right-0 z-30 px-6 md:px-12 py-6 flex items-center justify-between">
      <a href="#top" className="font-serif text-xl tracking-[0.32em] text-espresso hover:text-olive transition">
        ZENPLATO
      </a>
      <div className="hidden md:flex items-center gap-10 text-sm">
        <a href="#healthcare" className="text-espresso/70 hover:text-olive transition">Healthcare</a>
        <a href="#fitness" className="text-espresso/70 hover:text-olive transition">Fitness</a>
        <a href="#discover" className="text-espresso/70 hover:text-olive transition">Discover</a>
        <a href="#library" className="text-espresso/70 hover:text-olive transition">Library</a>
      </div>
      <div className="flex items-center gap-3">
        <a
          href="/auth"
          className="px-5 py-2.5 rounded-full border border-espresso/20 text-espresso text-sm hover:bg-espresso/5 transition"
        >
          Sign in
        </a>
        <a
          href="#early-access"
          className="px-5 py-2.5 rounded-full bg-olive text-ivory text-sm hover:bg-[var(--olive-deep)] transition"
        >
          Early access
        </a>
      </div>
    </nav>
  );
}