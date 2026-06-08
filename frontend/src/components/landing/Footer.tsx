export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-cream">
      {/* Background Image Header */}
      <div className="relative h-[60vh] min-h-[480px] w-full overflow-hidden flex items-center">
        <img 
          src="/landing/footer-still.jpg" 
          alt="" 
          className="absolute inset-0 h-full w-full object-cover" 
          loading="lazy" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cream/40 via-cream/10 to-cream" />
        
        <div className="relative z-10 mx-auto max-w-4xl text-center px-6">
          <p className="uppercase tracking-[0.2em] text-[11px] font-medium text-olive mb-6">A way of living</p>
          <p className="font-serif text-[36px] leading-[1.15] text-espresso md:text-[68px]">
            Wellness is not a destination.<br />
            <span className="italic text-olive">It's a way of living.</span>
          </p>
          <div className="mt-12">
            <a
              href="#early-access"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-olive text-ivory hover:bg-olive-deep transition shadow-lg"
            >
              Join the waitlist →
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-10">
        <div className="flex flex-col items-start justify-between gap-8 border-t border-espresso/10 pt-10 md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <span className="font-serif text-[18px] tracking-[0.28em] text-espresso">ZENPLATO</span>
          </div>
          <nav className="flex flex-wrap gap-x-8 gap-y-3 text-[13px] text-espresso/65">
            <a href="#journeys" className="hover:text-olive">Journeys</a>
            <a href="#recipes" className="hover:text-olive">Library</a>
            <a href="#personalize" className="hover:text-olive">Approach</a>
            <a href="#" className="hover:text-olive">Privacy</a>
            <a href="#" className="hover:text-olive">Contact</a>
          </nav>
          <p className="text-[12px] text-espresso/45">© {new Date().getFullYear()} Zenplato · Made with care</p>
        </div>
      </div>
    </footer>
  );
}