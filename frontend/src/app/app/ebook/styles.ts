export const ZENPLATO_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,400..600&family=Hanken+Grotesk:wght@300;400;500;600;700;800&display=swap');

  :root {
    --paper: #F7F1E8;
    --paper-2: #FBF6EE;
    --ink: #26211B;
    --ink-soft: #5E5447;
    --ink-faint: #8C8071;
    --clay: #BC5B38;
    --clay-soft: #D58A6B;
    --forest: #3F5247;
    --forest-soft: #5E7264;
    --plum: #6C4F5C;
    --ochre: #C8943C;
    --gold: #B9882E;
    --sand: #EEE4D4;
    --sage-tint: #E6EBE0;
    --clay-tint: #F4E4D9;
    --plum-tint: #EFE7E9;
    --ochre-tint: #F5EAD3;
    --line: #DCD0BD;
    --line-soft: #E7DDCC;
    --shadow: 0 1px 2px rgba(38,33,27,.04), 0 10px 30px -14px rgba(38,33,27,.18);
    --shadow-lg: 0 2px 4px rgba(38,33,27,.05), 0 30px 64px -22px rgba(38,33,27,.30);
    --serif: 'Fraunces', Georgia, serif;
    --sans: 'Hanken Grotesk', -apple-system, sans-serif;
    --maxw: 980px;
  }

  .zen-wrapper {
    background: var(--paper);
    color: var(--ink);
    font-family: var(--sans);
    font-size: 17px;
    line-height: 1.62;
    -webkit-font-smoothing: antialiased;
    position: relative;
    min-height: 100vh;
  }

  /* film grain */
  .zen-wrapper::after {
    content: ""; position: fixed; inset: 0; pointer-events: none; z-index: 99; opacity: .04;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }

  .ebook-content { font-family: var(--sans); font-size: 17px; line-height: 1.62; }
  .ebook-content h3 { font-family: var(--serif); font-weight: 340; font-size: clamp(30px,5.4vw,52px); line-height: 1.04; letter-spacing: -0.015em; margin: 2.5rem 0 1rem; color: var(--ink); }
  .ebook-content h4 { font-family: var(--serif); font-weight: 500; font-size: clamp(21px,3vw,28px); line-height: 1.18; margin: 1.75rem 0 0.8rem; color: var(--ink); letter-spacing: -0.01em; }
  .ebook-content h5 { font-family: var(--sans); font-size: 11.5px; letter-spacing: 0.28em; text-transform: uppercase; color: var(--clay); font-weight: 700; margin: 1.2rem 0 0.5rem; }
  .ebook-content p { margin: 0 0 18px; color: var(--ink-soft); max-width: 68ch; }
  .ebook-content ul:not(.clean) { list-style: none; padding: 0; margin: 20px 0; max-width: 64ch; }
  .ebook-content ul:not(.clean) li { position: relative; padding: 11px 0 11px 30px; border-bottom: 1px solid var(--line-soft); font-size: 16.5px; color: var(--ink-soft); }
  .ebook-content ul:not(.clean) li::before { content: ""; position: absolute; left: 4px; top: 19px; width: 7px; height: 7px; border-radius: 50%; background: var(--clay); }
  
  .ebook-content .callout { position: relative; background: var(--paper-2); border: 1px solid var(--line); border-radius: 20px; padding: 30px; margin: 34px 0; box-shadow: var(--shadow); }
  .ebook-content .callout::before { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 5px; background: var(--clay); }
  .ebook-content .clabel { display: inline-flex; align-items: center; gap: 9px; font-size: 11px; letter-spacing: .22em; text-transform: uppercase; font-weight: 800; color: var(--clay); margin-bottom: 14px; }

  .ebook-content .compare { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin: 34px 0; }
  .ebook-content .ccol { border-radius: 20px; padding: 26px; border: 1px solid var(--line); }
  .ebook-content .ccol.good { background: var(--sage-tint); }
  .ebook-content .ccol.bad { background: var(--clay-tint); }

  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 50; display: flex; align-items: center;
    justify-content: space-between; padding: 14px clamp(18px, 5vw, 40px);
    background: rgba(247, 241, 232, 0.72); backdrop-filter: blur(14px);
    border-bottom: 1px solid var(--line-soft); transform: translateY(-110%);
    transition: transform 0.3s;
  }
  .nav.show { transform: translateY(0); }

  .drawer {
    position: fixed; top: 0; right: 0; height: 100%; width: min(380px, 86vw); z-index: 80;
    background: var(--paper-2); border-left: 1px solid var(--line); transform: translateX(105%); transition: transform .4s;
    padding: 30px 28px; overflow-y: auto;
  }
  .drawer.open { transform: translateX(0); }

  .cover {
    min-height: 100svh; display: flex; flex-direction: column; justify-content: center;
    padding: 80px clamp(22px, 6vw, 60px) 60px; position: relative; overflow: hidden;
  }
  .cover h1 {
    font-family: var(--serif); font-weight: 300; font-size: clamp(46px, 9vw, 104px); line-height: .96;
    letter-spacing: -.02em; margin: 0 0 6px; color: var(--ink);
  }
  .cover h1 em { font-style: italic; font-weight: 400; color: var(--clay); }

  .progress { position: fixed; top: 0; left: 0; height: 3px; width: 0; z-index: 60; background: var(--clay); }

  @media (max-width: 820px) {
    .ebook-content .compare { grid-template-columns: 1fr; }
  }
`;
