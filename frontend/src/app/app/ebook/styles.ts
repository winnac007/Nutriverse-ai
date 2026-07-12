export const ZENPLATO_CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,400..600&family=Hanken+Grotesk:wght@300;400;500;600;700;800&display=swap');

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
    touch-action: pan-x pan-y pinch-zoom;
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
  .ebook-content .pillars { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; margin: 34px 0; }
  .ebook-content .pcard { min-height: 220px; border: 1px solid var(--line); border-radius: 22px; background: var(--paper-2); padding: 26px; box-shadow: var(--shadow); }
  .ebook-content .pcard .pn { width: 38px; height: 38px; display: grid; place-items: center; border-radius: 50%; background: var(--forest); color: var(--paper); font-family: var(--serif); font-style: italic; margin-bottom: 22px; }
  .ebook-content .pcard h5 { margin-top: 0; }
  .ebook-content .pcard p { margin-bottom: 0; }

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
    min-height: 100svh;
    position: relative;
    overflow: hidden;
  }

  .ebook-cover-page {
    isolation: isolate;
    display: grid;
    place-items: stretch;
    background: #E9E1D3;
    color: #14260E;
  }

  .ebook-cover-sheet {
    container-type: inline-size;
    position: relative;
    width: 100%;
    min-height: 100svh;
    overflow: hidden;
    isolation: isolate;
    background: #F4EFE5;
  }

  .ebook-cover-photo {
    position: absolute;
    inset: 0;
    z-index: -3;
    object-fit: cover;
    object-position: center;
  }

  .ebook-cover-wash {
    position: absolute;
    inset: 0;
    z-index: -2;
    background:
      linear-gradient(90deg, rgba(249, 246, 237, .82) 0%, rgba(249, 246, 237, .58) 42%, rgba(249, 246, 237, .08) 72%),
      linear-gradient(180deg, rgba(249, 246, 237, .22) 0%, rgba(249, 246, 237, 0) 40%, rgba(249, 246, 237, .18) 100%);
    pointer-events: none;
  }

  .ebook-cover-content {
    position: relative;
    z-index: 1;
    width: min(560px, calc(100% - 48px));
    min-height: 100%;
    display: flex;
    flex-direction: column;
    padding: 42px 0 74px;
    margin-left: clamp(28px, 6vw, 82px);
  }

  .cover-section-label {
    display: flex;
    align-items: center;
    gap: 28px;
    font-family: var(--sans);
    font-size: 13px;
    font-weight: 700;
    line-height: 1.35;
    letter-spacing: 0;
    text-transform: uppercase;
    color: #14260E;
  }

  .cover-leaf {
    width: 26px;
    height: 42px;
    flex: 0 0 auto;
    color: #223815;
  }

  .cover-title {
    margin: 102px 0 0;
    max-width: 520px;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 86px;
    font-weight: 500;
    line-height: .92;
    letter-spacing: 0;
    color: #12270B;
  }

  .cover-title span {
    display: block;
  }

  .cover-kicker {
    margin-top: 30px;
    font-family: var(--sans);
    font-size: 19px;
    font-weight: 700;
    line-height: 1.25;
    letter-spacing: 0;
    text-transform: uppercase;
    color: #243A1B;
  }

  .cover-rule {
    width: 34px;
    height: 2px;
    margin-top: 24px;
    background: #243A1B;
  }

  .cover-personalization {
    margin: 20px 0 0;
    max-width: 350px;
    font-size: 20px;
    line-height: 1.42;
    color: #243A1B;
  }

  .cover-brand {
    margin-top: auto;
    padding-top: 46px;
  }

  .cover-brand-name {
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 60px;
    font-weight: 500;
    line-height: .86;
    letter-spacing: 0;
    color: #14260E;
  }

  .cover-brand-subtitle {
    margin-top: 8px;
    font-family: var(--sans);
    font-size: 12px;
    font-weight: 800;
    line-height: 1.3;
    letter-spacing: 0;
    text-transform: uppercase;
    color: #243A1B;
  }

  .cover-quote {
    margin: 34px 0 0;
    max-width: 300px;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 27px;
    font-style: italic;
    font-weight: 500;
    line-height: 1.16;
    letter-spacing: 0;
    color: #14260E;
  }

  .cover-page-number {
    position: absolute;
    left: 50%;
    bottom: 34px;
    transform: translateX(-50%);
    z-index: 2;
    font-family: var(--sans);
    font-size: 15px;
    font-weight: 600;
    line-height: 1;
    letter-spacing: 0;
    color: rgba(20, 38, 14, .72);
  }

  .progress { position: fixed; top: 0; left: 0; height: 3px; width: 0; z-index: 60; background: var(--clay); }

  @media (min-width: 821px) {
    .ebook-cover-page {
      --cover-stage-x: clamp(48px, 7vw, 120px);
      --cover-stage-y: clamp(18px, 3svh, 34px);
      min-height: 100svh;
      padding: var(--cover-stage-y) var(--cover-stage-x);
      place-items: center;
    }

    .ebook-cover-sheet {
      width: min(
        calc(100vw - (var(--cover-stage-x) * 2)),
        calc((100svh - (var(--cover-stage-y) * 2)) * .6666667),
        1024px
      );
      min-height: 0;
      aspect-ratio: 2 / 3;
      box-shadow: 0 24px 70px rgba(38, 33, 27, .18);
    }

    .ebook-cover-content {
      width: min(54cqw, 560px);
      min-height: 100%;
      padding: 4.1cqw 0 7.2cqw;
      margin-left: 6.2cqw;
    }

    .cover-section-label {
      gap: clamp(14px, 2.7cqw, 28px);
      font-size: clamp(9px, 1.27cqw, 13px);
    }

    .cover-leaf {
      width: clamp(18px, 2.55cqw, 26px);
      height: clamp(30px, 4.1cqw, 42px);
    }

    .cover-title {
      margin-top: clamp(52px, 9.9cqw, 102px);
      max-width: 51cqw;
      font-size: clamp(46px, 8.4cqw, 86px);
    }

    .cover-kicker {
      margin-top: clamp(18px, 2.9cqw, 30px);
      font-size: clamp(12px, 1.85cqw, 19px);
    }

    .cover-rule {
      width: clamp(22px, 3.3cqw, 34px);
      height: 2px;
      margin-top: clamp(14px, 2.35cqw, 24px);
    }

    .cover-personalization {
      margin-top: clamp(12px, 1.95cqw, 20px);
      max-width: 34cqw;
      font-size: clamp(13px, 1.95cqw, 20px);
    }

    .cover-brand {
      padding-top: clamp(24px, 4.5cqw, 46px);
    }

    .cover-brand-name {
      font-size: clamp(38px, 5.85cqw, 60px);
    }

    .cover-brand-subtitle {
      margin-top: clamp(5px, .78cqw, 8px);
      font-size: clamp(8px, 1.17cqw, 12px);
    }

    .cover-quote {
      margin-top: clamp(20px, 3.3cqw, 34px);
      max-width: 29cqw;
      font-size: clamp(18px, 2.65cqw, 27px);
    }

    .cover-page-number {
      bottom: clamp(18px, 3.3cqw, 34px);
      font-size: clamp(10px, 1.46cqw, 15px);
    }
  }

  .ebook-note-page {
    isolation: isolate;
    display: grid;
    place-items: stretch;
    background: #E9E1D3;
    color: #14260E;
  }

  .ebook-note-sheet {
    container-type: inline-size;
    position: relative;
    width: 100%;
    min-height: 100svh;
    overflow: hidden;
    isolation: isolate;
    background:
      linear-gradient(90deg, #F1EDE4 0%, #F1EDE4 31%, #FBF8F0 31%, #FBF8F0 71%, transparent 71%),
      #FBF8F0;
  }

  .note-watermark {
    position: absolute;
    left: -42.5cqw;
    top: 49.5%;
    width: 104cqw;
    transform: translateY(-50%) rotate(-90deg);
    transform-origin: center;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 18.8cqw;
    font-weight: 600;
    line-height: .8;
    letter-spacing: -.035em;
    color: rgba(38, 33, 27, .085);
    white-space: nowrap;
    pointer-events: none;
  }

  .note-topline {
    position: absolute;
    left: 36.2cqw;
    top: 4.3cqw;
    z-index: 2;
    font-family: var(--sans);
    font-size: 1.16cqw;
    font-weight: 700;
    line-height: 1;
    letter-spacing: .46em;
    text-transform: uppercase;
    color: #17260F;
    white-space: nowrap;
  }

  .note-topline span {
    display: inline-block;
    margin: 0 1.35cqw;
  }

  .note-copy {
    position: absolute;
    z-index: 2;
    left: 36.2cqw;
    top: 21.4cqw;
    width: 30.5cqw;
  }

  .note-chapter-number {
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 9.4cqw;
    font-weight: 500;
    line-height: .78;
    letter-spacing: 0;
    color: #10250B;
  }

  .note-chapter-label {
    margin-top: 6.2cqw;
    font-family: var(--sans);
    font-size: 1.2cqw;
    font-weight: 700;
    line-height: 1;
    letter-spacing: .38em;
    text-transform: uppercase;
    color: #3D4A35;
  }

  .note-rule {
    width: 3.5cqw;
    height: 1px;
    margin-top: 1.7cqw;
    background: rgba(20, 38, 14, .72);
  }

  .note-copy h2 {
    margin: 3.1cqw 0 0;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 4.5cqw;
    font-weight: 500;
    line-height: .96;
    letter-spacing: 0;
    color: #10250B;
  }

  .note-body {
    margin-top: 5.6cqw;
    color: #283223;
  }

  .note-body p {
    margin: 0 0 3.05cqw;
    font-family: var(--sans);
    font-size: 1.28cqw;
    font-weight: 400;
    line-height: 1.85;
    letter-spacing: 0;
    color: #283223;
  }

  .note-body p:last-child {
    margin-bottom: 0;
  }

  .note-lede::first-letter {
    float: left;
    padding: .18cqw .8cqw 0 0;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 7.15cqw;
    font-weight: 500;
    line-height: .73;
    color: #10250B;
  }

  .note-image-panel {
    position: absolute;
    inset: 0 0 0 auto;
    z-index: 1;
    width: 29.4%;
    overflow: hidden;
    background: #EDE6DA;
  }

  .note-image {
    object-fit: cover;
    object-position: 56% center;
  }

  .note-page-number {
    position: absolute;
    left: 50%;
    bottom: 3.3cqw;
    z-index: 2;
    transform: translateX(-50%);
    font-family: var(--sans);
    font-size: 1.5cqw;
    font-weight: 600;
    line-height: 1;
    letter-spacing: 0;
    color: rgba(20, 38, 14, .72);
  }

  @media (min-width: 821px) {
    .ebook-note-page {
      --note-stage-x: clamp(48px, 7vw, 120px);
      --note-stage-y: clamp(18px, 3svh, 34px);
      min-height: 100svh;
      padding: var(--note-stage-y) var(--note-stage-x);
      place-items: center;
    }

    .ebook-note-sheet {
      width: min(
        calc(100vw - (var(--note-stage-x) * 2)),
        calc((100svh - (var(--note-stage-y) * 2)) * .6666667),
        1024px
      );
      min-height: 0;
      aspect-ratio: 2 / 3;
      box-shadow: 0 24px 70px rgba(38, 33, 27, .18);
    }
  }

  .ebook-snapshot-page {
    isolation: isolate;
    display: grid;
    place-items: stretch;
    background: #E9E1D3;
    color: #18220F;
  }

  .ebook-snapshot-sheet {
    container-type: inline-size;
    position: relative;
    width: 100%;
    min-height: 100svh;
    overflow: hidden;
    isolation: isolate;
    background: #F7F1E8;
  }

  .snapshot-background {
    position: absolute;
    inset: 0;
    z-index: 0;
    object-fit: cover;
    object-position: center;
    opacity: .98;
  }

  .snapshot-topline {
    position: absolute;
    left: 5.25cqw;
    top: 4.25cqw;
    z-index: 3;
    font-family: var(--sans);
    font-size: .98cqw;
    font-weight: 700;
    line-height: 1;
    letter-spacing: .42em;
    text-transform: uppercase;
    color: #1C2815;
    white-space: nowrap;
  }

  .snapshot-topline span {
    display: inline-block;
    margin: 0 1.15cqw;
  }

  .snapshot-left {
    position: absolute;
    left: 5.35cqw;
    top: 17.35cqw;
    z-index: 2;
    width: 31.7cqw;
  }

  .snapshot-left h2 {
    margin: 0;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 7.72cqw;
    font-weight: 500;
    line-height: .98;
    letter-spacing: 0;
    color: #17230F;
  }

  .snapshot-title-rule {
    width: 3.35cqw;
    height: 1px;
    margin-top: 3.05cqw;
    background: rgba(23, 35, 15, .72);
  }

  .snapshot-side-label {
    margin-top: 3.35cqw;
    font-family: var(--sans);
    font-size: 1.17cqw;
    font-weight: 800;
    line-height: 1.92;
    letter-spacing: .42em;
    text-transform: uppercase;
    color: #26331F;
  }

  .snapshot-concern-list {
    margin-top: 3.15cqw;
    border-top: 1px solid rgba(38, 33, 27, .24);
  }

  .snapshot-concern {
    display: grid;
    grid-template-columns: 8.7cqw 1fr;
    gap: 1.55cqw;
    min-height: 18.8cqw;
    padding: 2.8cqw 0 2.15cqw;
    border-bottom: 1px solid rgba(38, 33, 27, .24);
  }

  .snapshot-icon-wrap {
    width: 7.65cqw;
    height: 7.65cqw;
    display: grid;
    place-items: center;
    border-radius: 999px;
    border: 0;
    color: #1F2C18;
    background: rgba(232, 226, 215, .72);
  }

  .snapshot-icon-wrap svg {
    width: 4.25cqw;
    height: 4.25cqw;
  }

  .snapshot-concern h3 {
    margin: .15cqw 0 .9cqw;
    font-family: var(--sans);
    font-size: 1.12cqw;
    font-weight: 800;
    line-height: 1.2;
    letter-spacing: .36em;
    text-transform: uppercase;
    color: #18220F;
  }

  .snapshot-concern p {
    margin: 0;
    font-family: var(--sans);
    font-size: 1.26cqw;
    font-weight: 400;
    line-height: 1.56;
    letter-spacing: 0;
    color: rgba(30, 30, 27, .86);
  }

  .snapshot-concern .snapshot-role {
    margin-bottom: .88cqw;
    font-size: 1.12cqw;
    font-weight: 500;
    line-height: 1.2;
    text-transform: none;
    color: #9B633C;
  }

  .snapshot-brand {
    margin-top: 4.1cqw;
  }

  .snapshot-brand div {
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 5.85cqw;
    font-style: italic;
    font-weight: 400;
    line-height: .82;
    color: rgba(105, 89, 69, .23);
  }

  .snapshot-brand span {
    display: block;
    margin-top: 1.05cqw;
    font-family: var(--sans);
    font-size: .78cqw;
    font-weight: 800;
    line-height: 1.25;
    letter-spacing: .22em;
    text-transform: uppercase;
    color: #26331F;
  }

  .snapshot-spine {
    position: absolute;
    left: 42.85cqw;
    top: 17.35cqw;
    bottom: 14.75cqw;
    z-index: 2;
    width: 1px;
    background: rgba(38, 33, 27, .28);
  }

  .snapshot-spine span {
    position: absolute;
    left: 50%;
    top: 45%;
    width: .74cqw;
    height: .74cqw;
    border-radius: 999px;
    transform: translate(-50%, -50%);
    background: #BC5B38;
    box-shadow: 0 0 0 .58cqw rgba(251, 247, 239, .82);
  }

  .snapshot-right {
    position: absolute;
    left: 47.75cqw;
    top: 20.35cqw;
    z-index: 3;
    width: 36.2cqw;
  }

  .snapshot-summary-label {
    font-family: var(--sans);
    font-size: 1.12cqw;
    font-weight: 800;
    line-height: 1;
    letter-spacing: .42em;
    text-transform: uppercase;
    color: #1D2319;
  }

  .snapshot-summary-rule {
    width: 3.35cqw;
    height: 1px;
    margin-top: 2.15cqw;
    background: rgba(29, 35, 25, .58);
  }

  .snapshot-right blockquote {
    position: relative;
    margin: 8.45cqw 0 0;
    max-width: 35cqw;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 4.25cqw;
    font-style: italic;
    font-weight: 500;
    line-height: 1.36;
    letter-spacing: 0;
    color: #17230F;
  }

  .snapshot-right blockquote span {
    position: absolute;
    left: -.95cqw;
    top: -6.65cqw;
    font-size: 6.9cqw;
    line-height: 1;
    color: rgba(69, 89, 47, .92);
  }

  .snapshot-ornament {
    display: flex;
    align-items: center;
    gap: 1.05cqw;
    margin: 6.1cqw 0 0 .7cqw;
    color: rgba(102, 111, 80, .72);
  }

  .snapshot-ornament i {
    display: block;
    width: 11.5cqw;
    height: 1px;
    background: rgba(102, 111, 80, .46);
  }

  .snapshot-ornament .cover-leaf {
    width: 2.9cqw;
    height: 4.25cqw;
    color: rgba(102, 111, 80, .72);
    transform: rotate(82deg);
  }

  .snapshot-paragraphs {
    margin-top: 6.7cqw;
    width: 34.5cqw;
  }

  .snapshot-paragraphs p {
    margin: 0 0 3.28cqw;
    font-family: var(--sans);
    font-size: 1.45cqw;
    font-weight: 400;
    line-height: 1.72;
    letter-spacing: 0;
    color: rgba(24, 24, 22, .9);
  }

  .snapshot-paragraphs p:last-child {
    margin-bottom: 0;
  }

  .snapshot-page-number {
    position: absolute;
    left: 50%;
    bottom: 3.3cqw;
    z-index: 4;
    transform: translateX(-50%);
    font-family: var(--sans);
    font-size: 1.5cqw;
    font-weight: 600;
    line-height: 1;
    letter-spacing: 0;
    color: rgba(20, 38, 14, .72);
  }

  @media (min-width: 821px) {
    .ebook-snapshot-page {
      --snapshot-stage-x: clamp(48px, 7vw, 120px);
      --snapshot-stage-y: clamp(18px, 3svh, 34px);
      min-height: 100svh;
      padding: var(--snapshot-stage-y) var(--snapshot-stage-x);
      place-items: center;
    }

    .ebook-snapshot-sheet {
      width: min(
        calc(100vw - (var(--snapshot-stage-x) * 2)),
        calc((100svh - (var(--snapshot-stage-y) * 2)) * .6666667),
        1024px
      );
      min-height: 0;
      aspect-ratio: 2 / 3;
      box-shadow: 0 24px 70px rgba(38, 33, 27, .18);
    }
  }

  .ebook-findings-page {
    isolation: isolate;
    display: grid;
    place-items: stretch;
    background: #E9E1D3;
    color: #17240F;
  }

  .ebook-findings-sheet {
    container-type: inline-size;
    position: relative;
    width: 100%;
    min-height: 100svh;
    overflow: hidden;
    isolation: isolate;
    background: #F7F1E8;
  }

  .findings-background {
    position: absolute;
    inset: 0;
    z-index: 0;
    object-fit: cover;
    object-position: center;
  }

  .findings-topline {
    position: absolute;
    left: 6.25cqw;
    top: 4.85cqw;
    z-index: 3;
    font-family: var(--sans);
    font-size: 1.02cqw;
    font-weight: 800;
    line-height: 1;
    letter-spacing: .43em;
    text-transform: uppercase;
    color: #18210F;
    white-space: nowrap;
  }

  .findings-topline span {
    display: inline-block;
    margin: 0 1.65cqw;
  }

  .findings-left {
    position: absolute;
    left: 6.25cqw;
    top: 19.6cqw;
    z-index: 3;
    width: 32.2cqw;
  }

  .findings-left h2 {
    margin: 0;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 8.38cqw;
    font-weight: 500;
    line-height: .99;
    letter-spacing: 0;
    color: #17240F;
  }

  .findings-kicker {
    margin-top: 3.45cqw;
    font-family: var(--sans);
    font-size: 1.08cqw;
    font-weight: 800;
    line-height: 1.9;
    letter-spacing: .43em;
    text-transform: uppercase;
    color: rgba(42, 51, 35, .82);
  }

  .findings-takeaway-label {
    margin-top: 21.9cqw;
    font-family: var(--sans);
    font-size: 1.03cqw;
    font-weight: 800;
    line-height: 1;
    letter-spacing: .43em;
    text-transform: uppercase;
    color: rgba(42, 51, 35, .88);
  }

  .findings-left blockquote {
    margin: 3.05cqw 0 0;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 3.36cqw;
    font-style: italic;
    font-weight: 500;
    line-height: 1.22;
    letter-spacing: 0;
    color: #161B13;
  }

  .findings-left p {
    margin: 8.65cqw 0 0;
    width: 27.7cqw;
    font-family: var(--sans);
    font-size: 1.23cqw;
    font-weight: 400;
    line-height: 1.62;
    letter-spacing: 0;
    color: rgba(22, 22, 20, .9);
  }

  .findings-brand {
    position: absolute;
    left: 0;
    top: 101.45cqw;
  }

  .findings-brand div {
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 5.95cqw;
    font-style: italic;
    font-weight: 400;
    line-height: .82;
    color: rgba(105, 89, 69, .23);
  }

  .findings-brand span {
    display: block;
    margin-top: 1cqw;
    font-family: var(--sans);
    font-size: .78cqw;
    font-weight: 800;
    line-height: 1.25;
    letter-spacing: .22em;
    text-transform: uppercase;
    color: #26331F;
  }

  .findings-card-stack {
    position: absolute;
    left: 43.55cqw;
    top: 20.45cqw;
    z-index: 3;
    width: 49.85cqw;
    display: flex;
    flex-direction: column;
    gap: 2.15cqw;
  }

  .finding-card {
    position: relative;
    height: 24.1cqw;
    background: transparent;
    overflow: hidden;
  }

  .finding-card:first-child .finding-priority {
    color: #9B633C;
  }

  .finding-card-copy {
    position: absolute;
    left: 15.25cqw;
    top: 6.05cqw;
    width: 30.4cqw;
  }

  .finding-priority {
    font-family: var(--sans);
    font-size: 1.02cqw;
    font-weight: 800;
    line-height: 1;
    letter-spacing: .22em;
    text-transform: uppercase;
    color: #48623C;
  }

  .finding-card h3 {
    margin: 2.05cqw 0 0;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 2.63cqw;
    font-weight: 500;
    line-height: 1.05;
    letter-spacing: 0;
    color: #191813;
  }

  .finding-card p {
    margin: 1.5cqw 0 0;
    font-family: var(--sans);
    font-size: 1.08cqw;
    font-weight: 400;
    line-height: 1.55;
    letter-spacing: 0;
    color: rgba(25, 24, 21, .86);
  }

  .findings-page-number {
    position: absolute;
    left: 50%;
    bottom: 3.72cqw;
    z-index: 4;
    transform: translateX(-50%);
    display: grid;
    justify-items: center;
    gap: .85cqw;
    font-family: var(--sans);
    font-size: 1.52cqw;
    font-weight: 600;
    line-height: 1;
    color: rgba(20, 38, 14, .78);
  }

  .findings-page-number i {
    display: block;
    width: 1.55cqw;
    height: 1px;
    background: rgba(20, 38, 14, .78);
  }

  @media (min-width: 821px) {
    .ebook-findings-page {
      --findings-stage-x: clamp(48px, 7vw, 120px);
      --findings-stage-y: clamp(18px, 3svh, 34px);
      min-height: 100svh;
      padding: var(--findings-stage-y) var(--findings-stage-x);
      place-items: center;
    }

    .ebook-findings-sheet {
      width: min(
        calc(100vw - (var(--findings-stage-x) * 2)),
        calc((100svh - (var(--findings-stage-y) * 2)) * .75),
        1086px
      );
      min-height: 0;
      aspect-ratio: 543 / 724;
      box-shadow: 0 24px 70px rgba(38, 33, 27, .18);
    }
  }

  .ebook-focus-page {
    isolation: isolate;
    display: grid;
    place-items: stretch;
    background: #E9E1D3;
    color: #17260F;
  }

  .ebook-focus-sheet {
    container-type: inline-size;
    position: relative;
    width: 100%;
    min-height: 100svh;
    overflow: hidden;
    isolation: isolate;
    background:
      radial-gradient(circle at 18% 9%, rgba(255,255,255,.86) 0, rgba(255,255,255,0) 28%),
      radial-gradient(circle at 78% 39%, rgba(255,255,255,.68) 0, rgba(255,255,255,0) 34%),
      radial-gradient(circle at 52% 86%, rgba(218,206,187,.18) 0, rgba(218,206,187,0) 40%),
      #F7F2EA;
  }

  .ebook-focus-sheet::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    opacity: .13;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.55' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.18'/%3E%3C/svg%3E");
    mix-blend-mode: multiply;
  }

  .focus-topline {
    position: absolute;
    left: 4.85cqw;
    top: 5.55cqw;
    z-index: 3;
    font-family: var(--sans);
    font-size: 1.02cqw;
    font-weight: 800;
    line-height: 1;
    letter-spacing: .48em;
    text-transform: uppercase;
    color: #18210F;
    white-space: nowrap;
  }

  .focus-topline span {
    display: inline-block;
    margin: 0 1.55cqw;
  }

  .focus-top-rule {
    position: absolute;
    left: 4.85cqw;
    right: 9.1cqw;
    top: 8.1cqw;
    z-index: 2;
    height: 1px;
    background: rgba(36, 42, 29, .35);
  }

  .focus-top-sprig {
    position: absolute;
    right: 4.25cqw;
    top: 3.05cqw;
    z-index: 3;
    width: 5.7cqw;
    height: 7.4cqw;
    color: rgba(45, 58, 36, .7);
    transform: rotate(103deg);
    transform-origin: center;
  }

  .focus-hero {
    position: absolute;
    left: 4.85cqw;
    top: 15.25cqw;
    z-index: 2;
    width: 43cqw;
  }

  .focus-hero h2 {
    margin: 0;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 8.58cqw;
    font-weight: 500;
    line-height: .94;
    letter-spacing: 0;
    color: #11250C;
  }

  .focus-title-rule {
    width: 4.2cqw;
    height: 1px;
    margin-top: 3.25cqw;
    background: rgba(17, 37, 12, .8);
  }

  .focus-kicker {
    margin-top: 2.85cqw;
    font-family: var(--sans);
    font-size: 1.08cqw;
    font-weight: 800;
    line-height: 1;
    letter-spacing: .5em;
    text-transform: uppercase;
    color: rgba(38, 49, 31, .88);
  }

  .focus-intro {
    position: absolute;
    left: 61.2cqw;
    top: 21.05cqw;
    z-index: 2;
    width: 31.1cqw;
    margin: 0;
    font-family: var(--sans);
    font-size: 1.36cqw;
    font-weight: 400;
    line-height: 1.82;
    letter-spacing: 0;
    color: rgba(15, 18, 14, .94);
  }

  .focus-card-grid {
    position: absolute;
    left: 4.45cqw;
    top: 43.25cqw;
    z-index: 2;
    width: 91.1cqw;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1.85cqw 2.05cqw;
  }

  .focus-card {
    min-height: 31.82cqw;
    border: 1px solid rgba(108, 96, 75, .22);
    border-radius: 1.02cqw;
    background: rgba(252, 249, 242, .35);
    box-shadow: inset 0 1px 0 rgba(255,255,255,.5);
    padding: 2.55cqw 2.28cqw 2.3cqw;
    color: #191813;
  }

  .focus-card-eyebrow {
    font-family: var(--sans);
    font-size: .98cqw;
    font-weight: 800;
    line-height: 1;
    letter-spacing: .38em;
    text-transform: uppercase;
    color: #111611;
    white-space: nowrap;
  }

  .focus-card-heading {
    display: grid;
    grid-template-columns: 7.5cqw 1fr;
    align-items: center;
    gap: 1.9cqw;
    margin-top: 2.75cqw;
  }

  .focus-icon-medallion {
    width: 7.35cqw;
    height: 7.35cqw;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: rgba(222, 216, 203, .62);
    color: #304022;
  }

  .focus-icon-medallion svg {
    width: 4.48cqw;
    height: 4.48cqw;
  }

  .focus-card h3 {
    margin: 0;
    max-width: 15cqw;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 2.66cqw;
    font-weight: 500;
    line-height: 1.04;
    letter-spacing: 0;
    color: #171811;
  }

  .focus-card-status {
    margin: 2.35cqw 0 0 9.28cqw;
    font-family: var(--sans);
    font-size: 1.04cqw;
    font-weight: 800;
    line-height: 1;
    letter-spacing: .34em;
    text-transform: uppercase;
    color: #9B623C;
  }

  .focus-progress {
    position: relative;
    height: .65cqw;
    margin-top: 3.28cqw;
    overflow: visible;
    border-radius: 999px;
    background: rgba(212, 205, 190, .9);
  }

  .focus-progress span {
    position: relative;
    display: block;
    height: 100%;
    border-radius: inherit;
    background: #334B26;
  }

  .focus-progress span::after {
    content: "";
    position: absolute;
    top: 50%;
    right: 0;
    width: 1.08cqw;
    height: 1.08cqw;
    transform: translate(50%, -50%);
    border-radius: 50%;
    background: #334B26;
  }

  .focus-card p {
    margin: 2.5cqw 0 0;
    font-family: var(--sans);
    font-size: 1.2cqw;
    font-weight: 500;
    line-height: 1.58;
    letter-spacing: 0;
    color: rgba(18, 18, 15, .92);
  }

  .focus-remember {
    position: absolute;
    left: 4.45cqw;
    right: 4.45cqw;
    top: 109.72cqw;
    z-index: 2;
    min-height: 9.9cqw;
    display: flex;
    align-items: center;
    gap: 2.15cqw;
    overflow: hidden;
    border: 1px solid rgba(108, 96, 75, .24);
    border-radius: .9cqw;
    background: rgba(252, 249, 242, .36);
    padding: 2.15cqw 3cqw;
  }

  .focus-remember-icon {
    width: 5.1cqw;
    height: 5.1cqw;
    display: grid;
    place-items: center;
    flex: 0 0 auto;
    border-radius: 50%;
    background: rgba(222, 216, 203, .62);
    color: #B58B52;
  }

  .focus-remember-icon svg {
    width: 2.35cqw;
    height: 2.35cqw;
  }

  .focus-remember-copy {
    position: relative;
    z-index: 2;
    width: 45cqw;
  }

  .focus-remember-copy div {
    font-family: var(--sans);
    font-size: 1.05cqw;
    font-weight: 800;
    line-height: 1;
    letter-spacing: .42em;
    text-transform: uppercase;
    color: #7D6E3D;
  }

  .focus-remember-copy p {
    margin: 1.25cqw 0 0;
    font-family: var(--sans);
    font-size: 1.06cqw;
    font-weight: 500;
    line-height: 1.62;
    letter-spacing: 0;
    color: rgba(35, 36, 28, .82);
  }

  .focus-remember-sprig {
    position: absolute;
    right: 2.15cqw;
    bottom: -.35cqw;
    width: 32.4cqw;
    height: 8.4cqw;
    color: rgba(75, 88, 55, .58);
  }

  .focus-page-number {
    position: absolute;
    left: 50%;
    bottom: 1.82cqw;
    z-index: 3;
    transform: translateX(-50%);
    font-family: var(--sans);
    font-size: 1.48cqw;
    font-weight: 600;
    line-height: 1;
    color: rgba(20, 38, 14, .82);
  }

  @media (min-width: 821px) {
    .ebook-focus-page {
      --focus-stage-x: clamp(48px, 7vw, 120px);
      --focus-stage-y: clamp(18px, 3svh, 34px);
      min-height: 100svh;
      padding: var(--focus-stage-y) var(--focus-stage-x);
      place-items: center;
    }

    .ebook-focus-sheet {
      width: min(
        calc(100vw - (var(--focus-stage-x) * 2)),
        calc((100svh - (var(--focus-stage-y) * 2)) * .8002853),
        1122px
      );
      min-height: 0;
      aspect-ratio: 561 / 701;
      box-shadow: 0 24px 70px rgba(38, 33, 27, .18);
    }
  }

  .ebook-personalized-page {
    isolation: isolate;
    display: grid;
    place-items: stretch;
    background: #E9E1D3;
    color: #17260F;
  }

  .ebook-personalized-sheet {
    container-type: inline-size;
    position: relative;
    width: 100%;
    min-height: 100svh;
    overflow: hidden;
    isolation: isolate;
    background:
      radial-gradient(circle at 17% 17%, rgba(255,255,255,.72) 0, rgba(255,255,255,0) 28%),
      radial-gradient(circle at 80% 42%, rgba(255,255,255,.52) 0, rgba(255,255,255,0) 35%),
      #F7F2EA;
  }

  .ebook-personalized-sheet::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    opacity: .12;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.55' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.18'/%3E%3C/svg%3E");
    mix-blend-mode: multiply;
  }

  .personalized-topline {
    position: absolute;
    left: 5.15cqw;
    top: 5.78cqw;
    z-index: 4;
    font-family: var(--sans);
    font-size: 1.05cqw;
    font-weight: 800;
    line-height: 1;
    letter-spacing: .48em;
    text-transform: uppercase;
    color: #18210F;
    white-space: nowrap;
  }

  .personalized-topline span {
    display: inline-block;
    margin: 0 1.45cqw;
  }

  .personalized-top-rule {
    position: absolute;
    left: 5.15cqw;
    right: 9.65cqw;
    top: 8.35cqw;
    z-index: 2;
    height: 1px;
    background: rgba(36, 42, 29, .31);
  }

  .personalized-top-sprig {
    position: absolute;
    right: 4.45cqw;
    top: 3.2cqw;
    z-index: 3;
    width: 5.4cqw;
    height: 7.2cqw;
    color: rgba(45, 58, 36, .64);
    transform: rotate(103deg);
  }

  .personalized-sidebar {
    position: absolute;
    left: 5.15cqw;
    top: 14.6cqw;
    z-index: 2;
    width: 25.9cqw;
  }

  .personalized-sidebar h2 {
    margin: 0;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 7.7cqw;
    font-weight: 500;
    line-height: .93;
    letter-spacing: 0;
    color: #11250C;
  }

  .personalized-title-rule {
    width: 3.9cqw;
    height: 1px;
    margin-top: 2.95cqw;
    background: rgba(17, 37, 12, .76);
  }

  .personalized-kicker,
  .personalized-section-label {
    font-family: var(--sans);
    font-size: 1.03cqw;
    font-weight: 800;
    line-height: 1.85;
    letter-spacing: .43em;
    text-transform: uppercase;
    color: rgba(38, 49, 31, .9);
  }

  .personalized-kicker {
    margin: 2.7cqw 0 0;
  }

  .personalized-section-label {
    margin-top: 5.65cqw;
    line-height: 1.75;
  }

  .personalized-profile-card {
    margin-top: 1.85cqw;
    border: 1px solid rgba(108, 96, 75, .23);
    border-radius: .8cqw;
    background: rgba(252, 249, 242, .22);
    overflow: hidden;
  }

  .personalized-profile-row {
    display: grid;
    grid-template-columns: 5.9cqw 1fr;
    align-items: center;
    min-height: 5.7cqw;
    padding: .85cqw 1.45cqw;
    border-bottom: 1px solid rgba(108, 96, 75, .16);
  }

  .personalized-profile-row:last-child {
    border-bottom: 0;
  }

  .personalized-profile-icon {
    width: 4.45cqw;
    height: 4.45cqw;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: rgba(222, 216, 203, .65);
    color: #546047;
  }

  .personalized-profile-icon svg {
    width: 2.65cqw;
    height: 2.65cqw;
  }

  .personalized-profile-row div div {
    font-family: var(--sans);
    font-size: 1.13cqw;
    font-weight: 500;
    line-height: 1.2;
    color: #191813;
  }

  .personalized-profile-row p {
    margin: .34cqw 0 0;
    font-family: var(--sans);
    font-size: .95cqw;
    font-weight: 400;
    line-height: 1.2;
    color: rgba(26, 24, 20, .7);
  }

  .personalized-concern-label {
    margin-top: 3.8cqw;
  }

  .personalized-concern-list {
    margin-top: 1.8cqw;
    display: grid;
    gap: .65cqw;
  }

  .personalized-concern {
    min-height: 4.2cqw;
    display: flex;
    align-items: center;
    gap: 1.45cqw;
    border: 1px solid rgba(108, 96, 75, .2);
    border-radius: .58cqw;
    background: rgba(252, 249, 242, .22);
    padding: 0 1.45cqw;
    font-family: var(--sans);
    font-size: .95cqw;
    font-weight: 800;
    line-height: 1.2;
    letter-spacing: .32em;
    text-transform: uppercase;
    color: #25311E;
  }

  .personalized-concern i {
    width: .78cqw;
    height: .78cqw;
    flex: 0 0 auto;
    border-radius: 50%;
    background: #A9774B;
  }

  .personalized-bottom-sprig {
    position: absolute;
    left: -3.8cqw;
    top: 105.1cqw;
    width: 26.7cqw;
    height: 9.4cqw;
    color: rgba(75, 88, 55, .56);
  }

  .personalized-narrative-panel {
    position: absolute;
    left: 36.95cqw;
    top: 14.72cqw;
    z-index: 2;
    width: 58cqw;
    min-height: 114.05cqw;
    border-radius: 1.15cqw;
    background:
      radial-gradient(circle at 64% 20%, rgba(255,255,255,.4), transparent 36%),
      rgba(230, 226, 216, .58);
    padding: 8.35cqw 6.45cqw 7.3cqw;
  }

  .personalized-panel-label {
    font-family: var(--sans);
    font-size: 1.04cqw;
    font-weight: 800;
    line-height: 1;
    letter-spacing: .43em;
    text-transform: uppercase;
    color: #1B1B16;
  }

  .personalized-panel-rule {
    width: 3.15cqw;
    height: 1px;
    margin-top: 2.2cqw;
    background: rgba(24, 33, 15, .72);
  }

  .personalized-narrative-panel h3 {
    margin: 5.15cqw 0 0;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 4.55cqw;
    font-weight: 500;
    line-height: 1.11;
    letter-spacing: 0;
    color: #17260F;
  }

  .personalized-narrative-panel h3 em {
    font-style: italic;
    font-weight: 500;
  }

  .personalized-lead {
    margin: 4.75cqw 0 0;
    width: 36.5cqw;
    font-family: var(--sans);
    font-size: 1.2cqw;
    font-weight: 500;
    line-height: 1.72;
    color: rgba(20, 20, 18, .86);
  }

  .personalized-quote-mark {
    margin-top: 5.05cqw;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 5.05cqw;
    font-weight: 600;
    line-height: .55;
    color: #A9774B;
  }

  .personalized-quote-body {
    position: relative;
    margin-top: 3.4cqw;
    margin-left: .42cqw;
    padding-left: 2.95cqw;
    border-left: 1px solid rgba(169, 119, 75, .54);
  }

  .personalized-quote-body p {
    margin: 0 0 3.2cqw;
    width: 36.2cqw;
    font-family: var(--sans);
    font-size: 1.16cqw;
    font-weight: 500;
    line-height: 1.72;
    color: rgba(20, 20, 18, .88);
  }

  .personalized-quote-body p:last-child {
    margin-bottom: 0;
  }

  .personalized-path {
    position: absolute;
    left: 6.45cqw;
    right: 6.45cqw;
    bottom: 7.2cqw;
    display: grid;
    grid-template-columns: 5.2cqw 1fr;
    gap: 1.75cqw;
    align-items: center;
    padding-top: 3.3cqw;
    border-top: 1px solid rgba(38, 33, 27, .24);
  }

  .personalized-path-icon {
    width: 5.2cqw;
    height: 5.2cqw;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: #54683B;
    color: #F7F2EA;
  }

  .personalized-path-icon .cover-leaf {
    width: 2.1cqw;
    height: 3.2cqw;
  }

  .personalized-path div div {
    font-family: var(--sans);
    font-size: 1cqw;
    font-weight: 800;
    line-height: 1;
    letter-spacing: .32em;
    text-transform: uppercase;
    color: #26331F;
  }

  .personalized-path p {
    margin: 1cqw 0 0;
    font-family: var(--sans);
    font-size: 1.04cqw;
    font-weight: 500;
    line-height: 1.55;
    color: rgba(20, 20, 18, .82);
  }

  .personalized-page-number {
    position: absolute;
    left: 50%;
    bottom: 2.18cqw;
    z-index: 3;
    transform: translateX(-50%);
    font-family: var(--sans);
    font-size: 1.48cqw;
    font-weight: 600;
    line-height: 1;
    color: rgba(20, 38, 14, .78);
  }

  @media (min-width: 821px) {
    .ebook-personalized-page {
      --personalized-stage-x: clamp(48px, 7vw, 120px);
      --personalized-stage-y: clamp(18px, 3svh, 34px);
      min-height: 100svh;
      padding: var(--personalized-stage-y) var(--personalized-stage-x);
      place-items: center;
    }

    .ebook-personalized-sheet {
      width: min(
        calc(100vw - (var(--personalized-stage-x) * 2)),
        calc((100svh - (var(--personalized-stage-y) * 2)) * .75),
        1086px
      );
      min-height: 0;
      aspect-ratio: 543 / 724;
      box-shadow: 0 24px 70px rgba(38, 33, 27, .18);
    }
  }

  .ebook-glance-page {
    isolation: isolate;
    display: grid;
    place-items: stretch;
    background: #E9E1D3;
    color: #17260F;
  }

  .ebook-glance-sheet {
    container-type: inline-size;
    position: relative;
    width: 100%;
    min-height: 100svh;
    overflow: hidden;
    isolation: isolate;
    background:
      radial-gradient(circle at 18% 13%, rgba(255,255,255,.78) 0, rgba(255,255,255,0) 30%),
      radial-gradient(circle at 72% 72%, rgba(255,255,255,.42) 0, rgba(255,255,255,0) 38%),
      #F7F2EA;
  }

  .ebook-glance-sheet::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    opacity: .12;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.55' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.18'/%3E%3C/svg%3E");
    mix-blend-mode: multiply;
  }

  .glance-topline {
    position: absolute;
    left: 5.35cqw;
    top: 5.78cqw;
    z-index: 4;
    font-family: var(--sans);
    font-size: 1.05cqw;
    font-weight: 800;
    line-height: 1;
    letter-spacing: .48em;
    text-transform: uppercase;
    color: #18210F;
    white-space: nowrap;
  }

  .glance-topline span {
    display: inline-block;
    margin: 0 1.45cqw;
  }

  .glance-top-rule {
    position: absolute;
    left: 5.35cqw;
    right: 9.65cqw;
    top: 8.35cqw;
    z-index: 2;
    height: 1px;
    background: rgba(36, 42, 29, .31);
  }

  .glance-top-sprig {
    position: absolute;
    right: 4.45cqw;
    top: 3.2cqw;
    z-index: 3;
    width: 5.4cqw;
    height: 7.2cqw;
    color: rgba(45, 58, 36, .64);
    transform: rotate(103deg);
  }

  .glance-hero {
    position: absolute;
    left: 6.35cqw;
    top: 17.75cqw;
    z-index: 2;
    width: 46cqw;
  }

  .glance-hero h2 {
    margin: 0;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 8.65cqw;
    font-weight: 500;
    line-height: .95;
    letter-spacing: 0;
    color: #11250C;
  }

  .glance-title-rule {
    width: 4.2cqw;
    height: 1px;
    margin-top: 3.15cqw;
    background: rgba(17, 37, 12, .76);
  }

  .glance-hero p {
    margin: 3.05cqw 0 0;
    font-family: var(--sans);
    font-size: 1.08cqw;
    font-weight: 800;
    line-height: 1.86;
    letter-spacing: .42em;
    text-transform: uppercase;
    color: rgba(38, 49, 31, .88);
  }

  .glance-card-grid {
    position: absolute;
    left: 5.05cqw;
    right: 4.7cqw;
    top: 42.78cqw;
    z-index: 2;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 2.65cqw;
  }

  .glance-card {
    position: relative;
    min-height: 51.35cqw;
    display: grid;
    justify-items: center;
    align-content: start;
    border: 1px solid rgba(108, 96, 75, .23);
    border-radius: .9cqw;
    background: rgba(252, 249, 242, .2);
    padding: 4.65cqw 2.5cqw 3.15cqw;
    text-align: center;
  }

  .glance-card:not(:last-child)::after {
    content: "";
    position: absolute;
    right: -1.55cqw;
    top: 40.5%;
    width: .86cqw;
    height: .86cqw;
    border-radius: 50%;
    background: #43562D;
    box-shadow: 0 0 0 1px rgba(247,242,234,.85), -1.2cqw 0 0 -.56cqw rgba(36,42,29,.25), 1.2cqw 0 0 -.56cqw rgba(36,42,29,.25);
  }

  .glance-icon-medallion {
    width: 9.05cqw;
    height: 9.05cqw;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: rgba(222, 216, 203, .65);
    color: #4C5C34;
  }

  .glance-icon-medallion svg {
    width: 5.05cqw;
    height: 5.05cqw;
  }

  .glance-card:nth-child(2) .glance-icon-medallion,
  .glance-card:nth-child(2) .glance-value {
    color: #98633C;
  }

  .glance-value {
    margin-top: 4.1cqw;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 7.8cqw;
    font-weight: 500;
    line-height: .82;
    color: #142A0E;
  }

  .glance-card-rule {
    width: 11.2cqw;
    height: 1px;
    margin-top: 3.25cqw;
    background: rgba(108, 96, 75, .23);
  }

  .glance-card h3 {
    margin: 3.15cqw 0 0;
    min-height: 4.2cqw;
    font-family: var(--sans);
    font-size: 1.03cqw;
    font-weight: 800;
    line-height: 1.78;
    letter-spacing: .42em;
    text-transform: uppercase;
    color: #18210F;
  }

  .glance-card:nth-child(2) h3 {
    color: #98633C;
  }

  .glance-card p {
    margin: 2.35cqw 0 0;
    font-family: var(--sans);
    font-size: 1.18cqw;
    font-weight: 500;
    line-height: 1.7;
    color: rgba(20, 20, 18, .88);
  }

  .glance-lower-rule {
    position: absolute;
    left: 0;
    right: 0;
    top: 100.42cqw;
    z-index: 2;
    height: 1px;
    background: rgba(108, 96, 75, .25);
  }

  .glance-next {
    position: absolute;
    left: 6.6cqw;
    top: 106.65cqw;
    z-index: 3;
    width: 38.3cqw;
  }

  .glance-next-label {
    font-family: var(--sans);
    font-size: 1.04cqw;
    font-weight: 800;
    line-height: 1;
    letter-spacing: .44em;
    text-transform: uppercase;
    color: #18210F;
  }

  .glance-next-rule {
    width: 3.95cqw;
    height: 1px;
    margin-top: 2.45cqw;
    background: rgba(17, 37, 12, .76);
  }

  .glance-next h3 {
    margin: 3.2cqw 0 0;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 4.95cqw;
    font-weight: 500;
    line-height: 1.16;
    letter-spacing: 0;
    color: #11250C;
  }

  .glance-next p {
    margin: 2.55cqw 0 0;
    width: 33.6cqw;
    font-family: var(--sans);
    font-size: 1.17cqw;
    font-weight: 500;
    line-height: 1.68;
    color: rgba(20, 20, 18, .86);
  }

  .glance-cta {
    width: 38cqw;
    height: 5.75cqw;
    margin-top: 2.9cqw;
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 3.6cqw 0 4.1cqw;
    border-radius: .56cqw;
    background: #1D330F;
    color: #F7F2EA;
    font-family: var(--sans);
    font-size: 1.18cqw;
    font-weight: 800;
    line-height: 1;
    letter-spacing: .42em;
    text-transform: uppercase;
    text-decoration: none;
    box-shadow: 0 18px 38px rgba(29, 51, 15, .16);
  }

  .glance-branch {
    position: absolute;
    right: -2.2cqw;
    top: 105.8cqw;
    z-index: 2;
    width: 45.8cqw;
    height: 37.5cqw;
    color: rgba(79, 91, 55, .74);
    filter: drop-shadow(-2.2cqw 3.2cqw 1.8cqw rgba(57, 66, 47, .12));
  }

  .glance-branch-shadow {
    stroke: rgba(57, 66, 47, .13);
    stroke-width: 12;
    stroke-linecap: round;
    filter: blur(7px);
    transform: translate(-.5cqw, .8cqw);
  }

  .glance-page-number {
    position: absolute;
    left: 50%;
    bottom: 3.25cqw;
    z-index: 3;
    transform: translateX(-50%);
    display: grid;
    justify-items: center;
    gap: .9cqw;
    font-family: var(--sans);
    font-size: 1.48cqw;
    font-weight: 600;
    line-height: 1;
    color: rgba(20, 38, 14, .78);
  }

  .glance-page-number::after {
    content: "";
    width: 1.7cqw;
    height: 1px;
    background: rgba(20, 38, 14, .78);
  }

  @media (min-width: 821px) {
    .ebook-glance-page {
      --glance-stage-x: clamp(48px, 7vw, 120px);
      --glance-stage-y: clamp(18px, 3svh, 34px);
      min-height: 100svh;
      padding: var(--glance-stage-y) var(--glance-stage-x);
      place-items: center;
    }

    .ebook-glance-sheet {
      width: min(
        calc(100vw - (var(--glance-stage-x) * 2)),
        calc((100svh - (var(--glance-stage-y) * 2)) * .6666667),
        1024px
      );
      min-height: 0;
      aspect-ratio: 2 / 3;
      box-shadow: 0 24px 70px rgba(38, 33, 27, .18);
    }
  }

  .ebook-opportunity-page {
    isolation: isolate;
    display: grid;
    place-items: stretch;
    background: #E9E1D3;
    color: #17260F;
  }

  .ebook-opportunity-sheet {
    container-type: inline-size;
    position: relative;
    width: 100%;
    min-height: 100svh;
    overflow: hidden;
    isolation: isolate;
    background:
      radial-gradient(circle at 14% 11%, rgba(255,255,255,.82) 0, rgba(255,255,255,0) 28%),
      radial-gradient(circle at 70% 49%, rgba(230,224,211,.64) 0, rgba(230,224,211,0) 25%),
      #F6F2EA;
  }

  .ebook-opportunity-sheet::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    opacity: .13;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.62' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.2'/%3E%3C/svg%3E");
    mix-blend-mode: multiply;
  }

  .opportunity-artwork {
    position: absolute;
    inset: 0;
    z-index: 0;
    object-fit: cover;
    object-position: center;
  }

  .opportunity-topline {
    position: absolute;
    left: 5.35cqw;
    top: 5.42cqw;
    z-index: 4;
    font-family: var(--sans);
    font-size: 1.05cqw;
    font-weight: 800;
    line-height: 1;
    letter-spacing: .48em;
    text-transform: uppercase;
    color: #192314;
    white-space: nowrap;
  }

  .opportunity-topline span {
    display: inline-block;
    margin: 0 1.55cqw;
  }

  .opportunity-top-rule {
    position: absolute;
    left: 5.35cqw;
    right: 11.25cqw;
    top: 8.35cqw;
    z-index: 2;
    height: 1px;
    background: rgba(36, 42, 29, .3);
  }

  .opportunity-top-sprig {
    position: absolute;
    right: 4.9cqw;
    top: 3.3cqw;
    z-index: 3;
    width: 5.2cqw;
    height: 7.1cqw;
    color: rgba(45, 58, 36, .64);
    transform: rotate(103deg);
  }

  .opportunity-copy {
    position: absolute;
    left: 5.35cqw;
    top: 17.82cqw;
    z-index: 3;
    width: 35.5cqw;
  }

  .opportunity-kicker {
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 2.3cqw;
    font-style: italic;
    font-weight: 500;
    line-height: 1.15;
    letter-spacing: 0;
    color: #132B12;
  }

  .opportunity-rule {
    width: 3.75cqw;
    height: 1px;
    background: rgba(19, 43, 18, .76);
  }

  .opportunity-rule-short {
    margin-top: 3.25cqw;
  }

  .opportunity-number {
    margin-top: 4.35cqw;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 17.65cqw;
    font-weight: 500;
    line-height: .74;
    letter-spacing: 0;
    color: #B87345;
  }

  .opportunity-rule-clay {
    margin-top: 5.05cqw;
    background: rgba(184, 115, 69, .78);
  }

  .opportunity-copy h2 {
    margin: 3.2cqw 0 0;
    max-width: 36cqw;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 4.4cqw;
    font-weight: 500;
    line-height: .98;
    letter-spacing: 0;
    color: #143318;
    overflow-wrap: anywhere;
  }

  .opportunity-copy h2 span {
    color: inherit;
  }

  .opportunity-rule-green {
    margin-top: 3.7cqw;
  }

  .opportunity-body {
    margin-top: 3.45cqw;
    display: grid;
    gap: 2.65cqw;
  }

  .opportunity-body p {
    margin: 0;
    max-width: 31.8cqw;
    font-family: var(--sans);
    font-size: 1.4cqw;
    font-weight: 500;
    line-height: 1.9;
    letter-spacing: .01em;
    color: rgba(22, 25, 20, .9);
  }

  .opportunity-visual {
    display: none;
    position: absolute;
    right: -2.1cqw;
    top: 15.9cqw;
    z-index: 2;
    width: 67.2cqw;
    height: 73.2cqw;
    color: #596247;
  }

  .opportunity-brand {
    position: absolute;
    left: 5.05cqw;
    bottom: 4.9cqw;
    z-index: 3;
    color: rgba(60, 70, 45, .42);
  }

  .opportunity-brand div {
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 6.2cqw;
    font-style: italic;
    font-weight: 300;
    line-height: .72;
    letter-spacing: .02em;
  }

  .opportunity-brand span {
    display: block;
    margin-top: 2.45cqw;
    font-family: var(--sans);
    font-size: .74cqw;
    font-weight: 800;
    line-height: 1;
    letter-spacing: .36em;
    text-transform: uppercase;
    color: #192314;
  }

  .opportunity-page-number {
    position: absolute;
    left: 50%;
    bottom: 3.15cqw;
    z-index: 3;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 1.4cqw;
    font-family: var(--sans);
    font-size: 1.48cqw;
    font-weight: 600;
    line-height: 1;
    color: rgba(20, 38, 14, .82);
  }

  .opportunity-page-number::before,
  .opportunity-page-number::after {
    content: "";
    width: 1.45cqw;
    height: 1px;
    background: rgba(20, 38, 14, .82);
  }

  @media (min-width: 821px) {
    .ebook-opportunity-page {
      --opportunity-stage-x: clamp(48px, 7vw, 120px);
      --opportunity-stage-y: clamp(18px, 3svh, 34px);
      min-height: 100svh;
      padding: var(--opportunity-stage-y) var(--opportunity-stage-x);
      place-items: center;
    }

    .ebook-opportunity-sheet {
      width: min(
        calc(100vw - (var(--opportunity-stage-x) * 2)),
        calc((100svh - (var(--opportunity-stage-y) * 2)) * .75),
        1086px
      );
      min-height: 0;
      aspect-ratio: 543 / 724;
      box-shadow: 0 24px 70px rgba(38, 33, 27, .18);
    }
  }

  .ebook-common-challenges-page,
  .ebook-zenplato-framework-page {
    isolation: isolate;
    display: grid;
    place-items: stretch;
    background: #E9E1D3;
    color: #172514;
  }

  .ebook-common-challenges-sheet,
  .ebook-zenplato-framework-sheet {
    container-type: inline-size;
    position: relative;
    width: 100%;
    min-height: 100svh;
    overflow: hidden;
    isolation: isolate;
    background: #F7F3EC;
  }

  .common-challenges-artwork,
  .zenplato-framework-artwork {
    position: absolute;
    inset: 0;
    z-index: 0;
    object-fit: cover;
    object-position: center;
  }

  .common-challenges-topline,
  .zenplato-framework-topline {
    position: absolute;
    z-index: 3;
    font-family: var(--sans);
    font-size: 1.16cqw;
    font-weight: 800;
    line-height: 1;
    letter-spacing: .48em;
    text-transform: uppercase;
    color: #192314;
    white-space: nowrap;
  }

  .common-challenges-topline {
    left: 10.66cqw;
    top: 5.85cqw;
  }

  .zenplato-framework-topline {
    left: 9.34cqw;
    top: 5.72cqw;
  }

  .common-challenges-topline span,
  .zenplato-framework-topline span {
    display: inline-block;
    margin: 0 1.55cqw;
  }

  .common-challenges-content,
  .zenplato-framework-content {
    position: absolute;
    inset: 0;
    z-index: 3;
  }

  .common-challenges-heading {
    position: absolute;
    left: 5.95cqw;
    top: 14.55cqw;
    margin: 0;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 7.15cqw;
    font-weight: 500;
    line-height: 1.08;
    color: #102A12;
    opacity: 0;
  }

  .common-challenges-intro {
    position: absolute;
    left: 6.05cqw;
    top: 33.7cqw;
    width: 39cqw;
    margin: 0;
    font-family: var(--sans);
    font-size: 1.68cqw;
    font-weight: 500;
    line-height: 1.62;
    color: rgba(31, 33, 30, .88);
  }

  .common-challenges-list {
    position: absolute;
    left: 17.95cqw;
    top: 70.15cqw;
    width: 76.1cqw;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 30.7cqw));
    column-gap: 14.7cqw;
    row-gap: 27.25cqw;
  }

  .common-challenge-copy h3 {
    margin: 0;
    font-family: var(--sans);
    font-size: 1.38cqw;
    font-weight: 800;
    line-height: 1.35;
    letter-spacing: .28em;
    text-transform: uppercase;
    color: #172514;
  }

  .common-challenge-copy p {
    margin: 1.45cqw 0 0;
    font-family: var(--sans);
    font-size: 1.43cqw;
    font-weight: 500;
    line-height: 1.48;
    color: rgba(31, 33, 30, .88);
  }

  .common-challenges-page-number,
  .zenplato-framework-page-number {
    position: absolute;
    z-index: 4;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: .95cqw;
    font-family: var(--sans);
    font-size: 1.34cqw;
    font-weight: 600;
    line-height: 1;
    color: rgba(20, 38, 14, .82);
  }

  .common-challenges-page-number {
    right: 6.05cqw;
    bottom: 2.85cqw;
  }

  .zenplato-framework-page-number {
    right: 5.55cqw;
    bottom: 2.65cqw;
  }

  .common-challenges-page-number::after,
  .zenplato-framework-page-number::after {
    content: "";
    width: 3.6cqw;
    height: 1px;
    background: rgba(20, 38, 14, .72);
  }

  .zenplato-framework-content h2 {
    position: absolute;
    left: 6.9cqw;
    top: 16.2cqw;
    margin: 0;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 7.2cqw;
    font-weight: 500;
    line-height: 1.02;
    color: #102A12;
  }

  .zenplato-framework-intro {
    position: absolute;
    left: 6.95cqw;
    top: 36.55cqw;
    width: 38.2cqw;
    margin: 0;
    font-family: var(--sans);
    font-size: 1.68cqw;
    font-weight: 500;
    line-height: 1.62;
    color: rgba(31, 33, 30, .88);
  }

  .zenplato-framework-list {
    position: absolute;
    left: 19.35cqw;
    top: 49.35cqw;
    width: 25.8cqw;
    display: grid;
    grid-auto-rows: 16.45cqw;
  }

  .zenplato-framework-item h3 {
    margin: 0;
    font-family: var(--sans);
    font-size: 1.38cqw;
    font-weight: 800;
    line-height: 1.35;
    letter-spacing: .34em;
    text-transform: uppercase;
    color: #17371A;
  }

  .zenplato-framework-item p {
    margin: 2.5cqw 0 0;
    font-family: var(--sans);
    font-size: 1.4cqw;
    font-weight: 500;
    line-height: 1.55;
    color: rgba(31, 33, 30, .88);
  }

  .zenplato-framework-quote {
    position: absolute;
    left: 16.45cqw;
    top: 116.45cqw;
    width: 29.6cqw;
    margin: 0;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 2.05cqw;
    font-style: italic;
    font-weight: 500;
    line-height: 1.27;
    color: #18381B;
  }

  @media (min-width: 821px) {
    .ebook-common-challenges-page,
    .ebook-zenplato-framework-page {
      --hormonal-stage-x: clamp(48px, 7vw, 120px);
      --hormonal-stage-y: clamp(18px, 3svh, 34px);
      min-height: 100svh;
      padding: var(--hormonal-stage-y) var(--hormonal-stage-x);
      place-items: center;
    }

    .ebook-common-challenges-sheet,
    .ebook-zenplato-framework-sheet {
      width: min(
        calc(100vw - (var(--hormonal-stage-x) * 2)),
        calc((100svh - (var(--hormonal-stage-y) * 2)) * .75),
        1086px
      );
      min-height: 0;
      aspect-ratio: 543 / 724;
      box-shadow: 0 24px 70px rgba(38, 33, 27, .18);
    }

    .food-gallery-divider,
    .food-gallery-dynamic-branch,
    .hydration-top-mark,
    .hydration-top-rule,
    .hydration-divider,
    .hydration-step-icon,
    .hydration-step:not(:last-child)::after,
    .hydration-tip svg,
    .hydration-quote-branch {
      visibility: hidden;
    }
  }

  @media (max-width: 0px) {
    .opportunity-artwork {
      display: none;
    }

    .opportunity-visual {
      display: block;
      position: relative;
      width: 100%;
      aspect-ratio: 4 / 5;
      margin-top: 32px;
      overflow: hidden;
      transform: none;
    }

    .opportunity-mobile-artwork {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: 74% 48%;
    }

    .ebook-common-challenges-sheet,
    .ebook-zenplato-framework-sheet {
      min-height: 100svh;
      padding: 30px 26px 72px;
    }

    .common-challenges-artwork,
    .zenplato-framework-artwork {
      opacity: .18;
      object-position: center top;
    }

    .common-challenges-topline,
    .zenplato-framework-topline {
      left: 62px;
      top: 39px;
      max-width: calc(100vw - 88px);
      overflow: hidden;
      font-size: 10px;
      letter-spacing: .28em;
    }

    .common-challenges-topline span,
    .zenplato-framework-topline span {
      margin: 0 10px;
    }

    .common-challenges-content,
    .zenplato-framework-content {
      position: relative;
      inset: auto;
      margin-top: 122px;
    }

    .common-challenges-heading,
    .common-challenges-intro,
    .common-challenges-list,
    .zenplato-framework-content h2,
    .zenplato-framework-intro,
    .zenplato-framework-list,
    .zenplato-framework-quote,
    .common-challenges-page-number,
    .zenplato-framework-page-number {
      position: relative;
      left: auto;
      right: auto;
      top: auto;
      bottom: auto;
      width: auto;
    }

    .common-challenges-heading,
    .zenplato-framework-content h2 {
      font-size: clamp(50px, 13.5vw, 72px);
      line-height: 1.04;
      opacity: 1;
    }

    .common-challenges-intro,
    .zenplato-framework-intro {
      max-width: 340px;
      margin-top: 28px;
      font-size: 15px;
      line-height: 1.7;
    }

    .common-challenges-list,
    .zenplato-framework-list {
      margin-top: 36px;
      display: grid;
      grid-template-columns: 1fr;
      grid-auto-rows: auto;
      gap: 14px;
    }

    .common-challenge-copy,
    .zenplato-framework-item {
      border: 1px solid rgba(220, 208, 189, .78);
      border-radius: 14px;
      background: rgba(251, 247, 239, .88);
      padding: 22px 22px 20px;
      box-shadow: 0 18px 42px -30px rgba(38, 33, 27, .22);
    }

    .common-challenge-copy h3,
    .zenplato-framework-item h3 {
      font-size: 11px;
      line-height: 1.45;
      letter-spacing: .3em;
    }

    .common-challenge-copy p,
    .zenplato-framework-item p {
      margin-top: 14px;
      font-size: 14px;
      line-height: 1.65;
    }

    .zenplato-framework-quote {
      margin-top: 28px;
      border-radius: 12px;
      padding: 22px 24px;
      background: rgba(222, 218, 207, .78);
      font-size: 22px;
      line-height: 1.25;
    }

    .common-challenges-page-number,
    .zenplato-framework-page-number {
      justify-content: center;
      margin-top: 42px;
      flex-direction: row;
      font-size: 14px;
      gap: 14px;
    }

    .common-challenges-page-number::before,
    .zenplato-framework-page-number::before,
    .common-challenges-page-number::after,
    .zenplato-framework-page-number::after {
      content: "";
      width: 16px;
      height: 1px;
      background: rgba(20, 38, 14, .72);
    }
  }

  .ebook-understanding-page {
    isolation: isolate;
    display: grid;
    place-items: stretch;
    background: #E9E1D3;
    color: #102610;
  }

  .ebook-understanding-sheet {
    container-type: inline-size;
    position: relative;
    width: 100%;
    min-height: 100svh;
    overflow: hidden;
    isolation: isolate;
    background: #F4EFE7;
  }

  .ebook-understanding-sheet::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    opacity: .12;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.58' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.18'/%3E%3C/svg%3E");
    mix-blend-mode: multiply;
  }

  .understanding-photo {
    z-index: 0;
    object-fit: cover;
    object-position: center bottom;
  }

  .understanding-wash {
    position: absolute;
    inset: 0;
    z-index: 2;
    pointer-events: none;
    background:
      linear-gradient(180deg, rgba(246,242,234,.96) 0%, rgba(246,242,234,.93) 28%, rgba(246,242,234,.62) 45%, rgba(246,242,234,.08) 62%, rgba(16,24,14,.28) 100%),
      radial-gradient(circle at 51% 30%, rgba(255,255,255,.55) 0, rgba(255,255,255,0) 32%);
  }

  .understanding-topline {
    position: absolute;
    left: 5.35cqw;
    top: 5.35cqw;
    z-index: 4;
    font-family: var(--sans);
    font-size: 1.05cqw;
    font-weight: 800;
    line-height: 1;
    letter-spacing: .48em;
    text-transform: uppercase;
    color: #192314;
    white-space: nowrap;
  }

  .understanding-topline span {
    display: inline-block;
    margin: 0 1.55cqw;
  }

  .understanding-top-rule {
    position: absolute;
    left: 5.35cqw;
    right: 11.25cqw;
    top: 8.05cqw;
    z-index: 4;
    height: 1px;
    background: rgba(36, 42, 29, .3);
  }

  .understanding-top-sprig {
    position: absolute;
    right: 4.9cqw;
    top: 3.05cqw;
    z-index: 4;
    width: 5.2cqw;
    height: 7.1cqw;
    color: rgba(45, 58, 36, .64);
    transform: rotate(103deg);
  }

  .understanding-title-block {
    position: absolute;
    left: 50%;
    top: 21.25cqw;
    z-index: 4;
    width: 78cqw;
    transform: translateX(-50%);
    text-align: center;
  }

  .understanding-section-label {
    font-family: var(--sans);
    font-size: 1.25cqw;
    font-weight: 800;
    line-height: 1;
    letter-spacing: .52em;
    text-transform: uppercase;
    color: #B87345;
  }

  .understanding-title-block h2 {
    margin: 4.15cqw 0 0;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: clamp(5.2cqw, 7.3cqw, 8.25cqw);
    font-weight: 500;
    line-height: 1.08;
    letter-spacing: 0;
    color: #102E14;
  }

  .understanding-divider {
    margin: 5.05cqw auto 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2.05cqw;
    color: #B87345;
  }

  .understanding-divider i {
    display: block;
    width: 11.45cqw;
    height: 1px;
    background: rgba(184, 115, 69, .68);
  }

  .section-divider-leaf {
    width: 3.7cqw;
    height: 1.7cqw;
    transform: rotate(-5deg);
  }

  .understanding-page-number {
    position: absolute;
    left: 50%;
    bottom: 3.45cqw;
    z-index: 4;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 1.45cqw;
    font-family: var(--sans);
    font-size: 1.48cqw;
    font-weight: 600;
    line-height: 1;
    color: rgba(255, 255, 255, .9);
    text-shadow: 0 1px 10px rgba(0,0,0,.34);
  }

  .understanding-page-number::before,
  .understanding-page-number::after {
    content: "";
    width: 1.45cqw;
    height: 1px;
    background: rgba(255, 255, 255, .85);
    box-shadow: 0 1px 8px rgba(0,0,0,.24);
  }

  @media (min-width: 821px) {
    .ebook-understanding-page {
      --understanding-stage-x: clamp(48px, 7vw, 120px);
      --understanding-stage-y: clamp(18px, 3svh, 34px);
      min-height: 100svh;
      padding: var(--understanding-stage-y) var(--understanding-stage-x);
      place-items: center;
    }

    .ebook-understanding-sheet {
      width: min(
        calc(100vw - (var(--understanding-stage-x) * 2)),
        calc((100svh - (var(--understanding-stage-y) * 2)) * .75),
        1086px
      );
      min-height: 0;
      aspect-ratio: 543 / 724;
      box-shadow: 0 24px 70px rgba(38, 33, 27, .18);
    }
  }

  .ebook-understanding-detail-page {
    isolation: isolate;
    display: grid;
    place-items: stretch;
    background: #E9E1D3;
    color: #102610;
  }

  .ebook-understanding-detail-sheet {
    container-type: inline-size;
    position: relative;
    width: 100%;
    min-height: 100svh;
    overflow: hidden;
    isolation: isolate;
    background:
      radial-gradient(circle at 73% 7%, rgba(255,255,255,.68) 0, rgba(255,255,255,0) 26%),
      #F6F1E8;
  }

  .ebook-understanding-detail-sheet::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 2;
    pointer-events: none;
    opacity: .1;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.58' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.18'/%3E%3C/svg%3E");
    mix-blend-mode: multiply;
  }

  .understanding-detail-image {
    position: absolute;
    left: 0;
    top: 8.45cqw;
    bottom: 0;
    z-index: 1;
    width: 43.95cqw;
    overflow: hidden;
  }

  .understanding-detail-photo {
    object-fit: cover;
    object-position: 43% center;
    filter: saturate(.78) contrast(.94) brightness(1.04);
  }

  .understanding-detail-photo-wash {
    position: absolute;
    left: 0;
    top: 8.45cqw;
    bottom: 0;
    z-index: 3;
    width: 43.95cqw;
    pointer-events: none;
    background:
      linear-gradient(180deg, rgba(246,241,232,.86) 0%, rgba(246,241,232,.06) 19%, rgba(246,241,232,0) 100%),
      linear-gradient(90deg, rgba(246,241,232,0) 0%, rgba(246,241,232,0) 78%, rgba(246,241,232,.64) 100%);
  }

  .understanding-detail-topline {
    position: absolute;
    left: 3.85cqw;
    top: 3.9cqw;
    z-index: 6;
    font-family: var(--sans);
    font-size: .95cqw;
    font-weight: 800;
    line-height: 1;
    letter-spacing: .48em;
    text-transform: uppercase;
    color: #192314;
    white-space: nowrap;
  }

  .understanding-detail-topline span {
    display: inline-block;
    margin: 0 1.55cqw;
  }

  .understanding-detail-top-rule {
    position: absolute;
    left: 3.85cqw;
    right: 9.05cqw;
    top: 6.85cqw;
    z-index: 5;
    height: 1px;
    background: rgba(36, 42, 29, .3);
  }

  .understanding-detail-top-sprig {
    position: absolute;
    right: 4.5cqw;
    top: 2.05cqw;
    z-index: 6;
    width: 4.85cqw;
    height: 6.6cqw;
    color: rgba(45, 58, 36, .64);
    transform: rotate(103deg);
  }

  .understanding-detail-content {
    position: absolute;
    left: 50.8cqw;
    top: 13.45cqw;
    z-index: 5;
    width: 41.7cqw;
  }

  .understanding-detail-content h2 {
    margin: 0;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: clamp(5.1cqw, 7.35cqw, 8.15cqw);
    font-weight: 500;
    line-height: 1.02;
    letter-spacing: 0;
    color: #102E14;
  }

  .understanding-detail-divider {
    margin: 4.05cqw 0 0;
    display: flex;
    align-items: center;
    gap: 2.05cqw;
    color: #B87345;
  }

  .understanding-detail-divider i {
    display: block;
    width: 16.35cqw;
    height: 1px;
    background: rgba(184, 115, 69, .68);
  }

  .understanding-detail-divider .section-divider-leaf {
    width: 3.15cqw;
    height: 1.45cqw;
  }

  .understanding-detail-list {
    margin-top: 4.5cqw;
    display: grid;
  }

  .understanding-detail-item {
    display: grid;
    grid-template-columns: 7.85cqw 1.35cqw minmax(0, 1fr);
    column-gap: 2.35cqw;
    align-items: start;
    padding-bottom: 4.15cqw;
  }

  .understanding-detail-item + .understanding-detail-item {
    border-top: 1px solid rgba(82, 92, 68, .34);
    padding-top: 4.3cqw;
  }

  .understanding-detail-item:last-child {
    padding-bottom: 0;
  }

  .understanding-detail-icon {
    width: 7.85cqw;
    height: 7.85cqw;
    display: grid;
    place-items: center;
    border: 1px solid rgba(85, 100, 72, .55);
    border-radius: 50%;
    color: rgba(66, 82, 57, .86);
  }

  .understanding-detail-icon svg {
    width: 4.25cqw;
    height: 4.25cqw;
  }

  .understanding-detail-dot {
    width: .8cqw;
    height: .8cqw;
    margin-top: .85cqw;
    border-radius: 50%;
    background: #B87345;
  }

  .understanding-detail-item h3 {
    margin: 0;
    font-family: var(--sans);
    font-size: 1.14cqw;
    font-weight: 800;
    line-height: 1.45;
    letter-spacing: .38em;
    text-transform: uppercase;
    color: #17351B;
  }

  .understanding-detail-item p {
    margin: 2cqw 0 0;
    max-width: 27.9cqw;
    font-family: var(--sans);
    font-size: 1.25cqw;
    font-weight: 500;
    line-height: 1.74;
    color: rgba(22, 25, 20, .88);
  }

  .understanding-detail-page-number {
    position: absolute;
    left: 46.95cqw;
    bottom: 3.15cqw;
    z-index: 5;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 1.45cqw;
    font-family: var(--sans);
    font-size: 1.38cqw;
    font-weight: 600;
    line-height: 1;
    color: rgba(20, 38, 14, .82);
  }

  .understanding-detail-page-number::before,
  .understanding-detail-page-number::after {
    content: "";
    width: 1.45cqw;
    height: 1px;
    background: rgba(20, 38, 14, .82);
  }

  @media (min-width: 821px) {
    .ebook-understanding-detail-page {
      --understanding-detail-stage-x: clamp(48px, 6vw, 108px);
      --understanding-detail-stage-y: clamp(18px, 3svh, 34px);
      min-height: 100svh;
      padding: var(--understanding-detail-stage-y) var(--understanding-detail-stage-x);
      place-items: center;
    }

    .ebook-understanding-detail-sheet {
      width: min(
        calc(100vw - (var(--understanding-detail-stage-x) * 2)),
        calc((100svh - (var(--understanding-detail-stage-y) * 2)) * .8002853),
        1122px
      );
      min-height: 0;
      aspect-ratio: 561 / 701;
      box-shadow: 0 24px 70px rgba(38, 33, 27, .18);
    }
  }

  .ebook-symptom-flow-page {
    isolation: isolate;
    display: grid;
    place-items: stretch;
    background: #E9E1D3;
    color: #102610;
  }

  .ebook-symptom-flow-sheet {
    container-type: inline-size;
    position: relative;
    width: 100%;
    min-height: 100svh;
    overflow: hidden;
    isolation: isolate;
    background:
      radial-gradient(circle at 71% 11%, rgba(255,255,255,.72) 0, rgba(255,255,255,0) 28%),
      #F6F1E8;
  }

  .ebook-symptom-flow-sheet::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 2;
    pointer-events: none;
    opacity: .1;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.58' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.18'/%3E%3C/svg%3E");
    mix-blend-mode: multiply;
  }

  .symptom-flow-media-slot {
    position: absolute;
    left: 0;
    top: 8.35cqw;
    bottom: 0;
    z-index: 1;
    width: 42.35cqw;
    overflow: hidden;
    background: #D8D0BD;
  }

  .symptom-flow-photo {
    object-fit: cover;
    object-position: 45% center;
    filter: saturate(.82) contrast(.95) brightness(1.03);
  }

  .symptom-flow-media-slot::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 1;
    background:
      linear-gradient(180deg, rgba(246,241,232,.62) 0%, rgba(246,241,232,.03) 18%, rgba(26,30,22,.12) 100%),
      linear-gradient(90deg, rgba(246,241,232,0) 0%, rgba(246,241,232,0) 86%, rgba(246,241,232,.58) 100%);
    pointer-events: none;
  }

  .symptom-flow-topline {
    position: absolute;
    left: 3.4cqw;
    top: 3.85cqw;
    z-index: 6;
    font-family: var(--sans);
    font-size: .95cqw;
    font-weight: 800;
    line-height: 1;
    letter-spacing: .48em;
    text-transform: uppercase;
    color: #192314;
    white-space: nowrap;
  }

  .symptom-flow-topline span {
    display: inline-block;
    margin: 0 1.55cqw;
  }

  .symptom-flow-top-rule {
    position: absolute;
    left: 3.4cqw;
    right: 9.05cqw;
    top: 6.85cqw;
    z-index: 5;
    height: 1px;
    background: rgba(36, 42, 29, .3);
  }

  .symptom-flow-top-sprig {
    position: absolute;
    right: 4.45cqw;
    top: 2.05cqw;
    z-index: 6;
    width: 4.85cqw;
    height: 6.6cqw;
    color: rgba(45, 58, 36, .64);
    transform: rotate(103deg);
  }

  .symptom-flow-content {
    position: absolute;
    left: 49.2cqw;
    top: 13.7cqw;
    z-index: 5;
    width: 43.1cqw;
  }

  .symptom-flow-content h2 {
    margin: 0;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: clamp(4.6cqw, 6.45cqw, 7.35cqw);
    font-weight: 500;
    line-height: 1.04;
    letter-spacing: 0;
    color: #102E14;
  }

  .symptom-flow-divider {
    margin: 4cqw 0 0;
    display: flex;
    align-items: center;
    gap: 2.05cqw;
    color: #B87345;
  }

  .symptom-flow-divider i {
    display: block;
    width: 13.3cqw;
    height: 1px;
    background: rgba(184, 115, 69, .68);
  }

  .symptom-flow-divider .section-divider-leaf {
    width: 3.15cqw;
    height: 1.45cqw;
  }

  .symptom-flow-list {
    margin-top: 4.5cqw;
    display: grid;
    gap: 3.55cqw;
  }

  .symptom-flow-step {
    position: relative;
    display: grid;
    grid-template-columns: 8.55cqw 4.5cqw minmax(0, 1fr);
    column-gap: 2.35cqw;
    align-items: start;
    min-height: 10.6cqw;
  }

  .symptom-flow-icon {
    position: relative;
    z-index: 2;
    width: 8.55cqw;
    height: 8.55cqw;
    display: grid;
    place-items: center;
    border: 1px solid rgba(85, 100, 72, .5);
    border-radius: 50%;
    color: rgba(66, 82, 57, .86);
    background: rgba(246,241,232,.42);
  }

  .symptom-flow-icon svg {
    width: 4.45cqw;
    height: 4.45cqw;
  }

  .symptom-flow-connector {
    position: absolute;
    left: 4.27cqw;
    top: 8.55cqw;
    z-index: 1;
    width: 1px;
    height: 3.05cqw;
    background: rgba(66, 82, 57, .62);
  }

  .symptom-flow-connector::after {
    content: "";
    position: absolute;
    left: 50%;
    bottom: -.52cqw;
    width: 0;
    height: 0;
    transform: translateX(-50%);
    border-left: .38cqw solid transparent;
    border-right: .38cqw solid transparent;
    border-top: .62cqw solid rgba(66, 82, 57, .78);
  }

  .symptom-flow-number {
    padding-top: 1.05cqw;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 2.28cqw;
    font-weight: 700;
    line-height: 1;
    color: #B87345;
  }

  .symptom-flow-step-copy {
    padding-top: 1.05cqw;
  }

  .symptom-flow-step-copy h3 {
    margin: 0;
    font-family: var(--sans);
    font-size: 1.12cqw;
    font-weight: 800;
    line-height: 1.42;
    letter-spacing: .38em;
    text-transform: uppercase;
    color: #17351B;
  }

  .symptom-flow-step-copy p {
    margin: 1.85cqw 0 0;
    max-width: 28.5cqw;
    font-family: var(--sans);
    font-size: 1.16cqw;
    font-weight: 500;
    line-height: 1.72;
    color: rgba(22, 25, 20, .88);
  }

  .symptom-flow-takeaway {
    margin-top: 4cqw;
    min-height: 8.2cqw;
    display: grid;
    grid-template-columns: 5.2cqw minmax(0, 1fr);
    align-items: center;
    gap: 2.6cqw;
    border-radius: .9cqw;
    background: rgba(217, 211, 198, .55);
    padding: 1.55cqw 2.75cqw;
  }

  .symptom-flow-takeaway-sprig {
    width: 4.5cqw;
    height: 5.7cqw;
    color: rgba(72, 87, 58, .7);
  }

  .symptom-flow-takeaway p {
    margin: 0;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 1.75cqw;
    font-style: italic;
    font-weight: 500;
    line-height: 1.25;
    color: #143318;
  }

  .symptom-flow-page-number {
    position: absolute;
    left: 46.95cqw;
    bottom: 3.15cqw;
    z-index: 5;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 1.45cqw;
    font-family: var(--sans);
    font-size: 1.38cqw;
    font-weight: 600;
    line-height: 1;
    color: rgba(20, 38, 14, .82);
  }

  .symptom-flow-page-number::before,
  .symptom-flow-page-number::after {
    content: "";
    width: 1.45cqw;
    height: 1px;
    background: rgba(20, 38, 14, .82);
  }

  @media (min-width: 821px) {
    .ebook-symptom-flow-page {
      --symptom-flow-stage-x: clamp(48px, 6vw, 108px);
      --symptom-flow-stage-y: clamp(18px, 3svh, 34px);
      min-height: 100svh;
      padding: var(--symptom-flow-stage-y) var(--symptom-flow-stage-x);
      place-items: center;
    }

    .ebook-symptom-flow-sheet {
      width: min(
        calc(100vw - (var(--symptom-flow-stage-x) * 2)),
        calc((100svh - (var(--symptom-flow-stage-y) * 2)) * .8002853),
        1122px
      );
      min-height: 0;
      aspect-ratio: 561 / 701;
      box-shadow: 0 24px 70px rgba(38, 33, 27, .18);
    }
  }

  .ebook-nutrition-influence-page {
    isolation: isolate;
    display: grid;
    place-items: stretch;
    background: #E9E1D3;
    color: #102610;
  }

  .ebook-nutrition-influence-sheet {
    container-type: inline-size;
    position: relative;
    width: 100%;
    min-height: 100svh;
    overflow: hidden;
    isolation: isolate;
    background:
      radial-gradient(circle at 73% 10%, rgba(255,255,255,.72) 0, rgba(255,255,255,0) 28%),
      #F7F2EA;
  }

  .ebook-nutrition-influence-sheet::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 2;
    pointer-events: none;
    opacity: .1;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.58' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.18'/%3E%3C/svg%3E");
    mix-blend-mode: multiply;
  }

  .nutrition-influence-media-slot {
    position: absolute;
    left: 0;
    top: 12.25cqw;
    bottom: 5.55cqw;
    z-index: 1;
    width: 41.7cqw;
    overflow: hidden;
    background: #D8D0BD;
  }

  .nutrition-influence-media-slot::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 1;
    background:
      linear-gradient(180deg, rgba(247,242,234,.48) 0%, rgba(247,242,234,.06) 22%, rgba(55,62,44,.1) 100%),
      linear-gradient(90deg, rgba(247,242,234,0) 0%, rgba(247,242,234,0) 85%, rgba(247,242,234,.58) 100%);
    pointer-events: none;
  }

  .nutrition-influence-photo {
    object-fit: cover;
    object-position: 46% center;
    filter: saturate(.9) contrast(.96) brightness(1.02);
  }

  .nutrition-influence-topline {
    position: absolute;
    left: 4.95cqw;
    top: 5.35cqw;
    z-index: 6;
    font-family: var(--sans);
    font-size: 1.03cqw;
    font-weight: 800;
    line-height: 1;
    letter-spacing: .48em;
    text-transform: uppercase;
    color: #192314;
    white-space: nowrap;
  }

  .nutrition-influence-topline span {
    display: inline-block;
    margin: 0 1.55cqw;
  }

  .nutrition-influence-top-rule {
    position: absolute;
    left: 4.95cqw;
    right: 11.15cqw;
    top: 8.45cqw;
    z-index: 5;
    height: 1px;
    background: rgba(36, 42, 29, .3);
  }

  .nutrition-influence-top-sprig {
    position: absolute;
    right: 4.7cqw;
    top: 2.75cqw;
    z-index: 6;
    width: 5.15cqw;
    height: 7.1cqw;
    color: rgba(45, 58, 36, .64);
    transform: rotate(103deg);
  }

  .nutrition-influence-content {
    position: absolute;
    left: 50.85cqw;
    top: 18.1cqw;
    z-index: 5;
    width: 42.7cqw;
  }

  .nutrition-influence-content h2 {
    margin: 0;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: clamp(4.8cqw, 6.95cqw, 7.7cqw);
    font-weight: 500;
    line-height: 1.03;
    letter-spacing: 0;
    color: #102E14;
  }

  .nutrition-influence-divider {
    margin: 4.35cqw 0 0;
    display: flex;
    align-items: center;
    gap: 2.05cqw;
    color: #B87345;
  }

  .nutrition-influence-divider i {
    display: block;
    width: 14.2cqw;
    height: 1px;
    background: rgba(184, 115, 69, .68);
  }

  .nutrition-influence-divider .section-divider-leaf {
    width: 3.15cqw;
    height: 1.45cqw;
  }

  .nutrition-influence-list {
    margin-top: 5.15cqw;
    display: grid;
    gap: 4.65cqw;
  }

  .nutrition-influence-item {
    position: relative;
    display: grid;
    grid-template-columns: 8.65cqw 4.1cqw minmax(0, 1fr);
    column-gap: 2.35cqw;
    align-items: start;
    min-height: 12.7cqw;
  }

  .nutrition-influence-icon {
    position: relative;
    z-index: 2;
    width: 8.65cqw;
    height: 8.65cqw;
    display: grid;
    place-items: center;
    border: 1px solid rgba(85, 100, 72, .48);
    border-radius: 50%;
    color: rgba(66, 82, 57, .86);
    background: rgba(247,242,234,.38);
  }

  .nutrition-influence-icon svg {
    width: 4.55cqw;
    height: 4.55cqw;
  }

  .nutrition-influence-connector {
    position: absolute;
    left: 4.32cqw;
    top: 8.65cqw;
    z-index: 1;
    width: 1px;
    height: 5.15cqw;
    background: rgba(184, 115, 69, .54);
  }

  .nutrition-influence-dot {
    position: absolute;
    left: 4.32cqw;
    top: 13.48cqw;
    z-index: 2;
    width: .9cqw;
    height: .9cqw;
    transform: translateX(-50%);
    border-radius: 50%;
    background: #B87345;
  }

  .nutrition-influence-number {
    padding-top: 1.05cqw;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 2.36cqw;
    font-weight: 700;
    line-height: 1;
    color: #B87345;
  }

  .nutrition-influence-copy {
    padding-top: 1.05cqw;
  }

  .nutrition-influence-copy h3 {
    margin: 0;
    font-family: var(--sans);
    font-size: 1.17cqw;
    font-weight: 800;
    line-height: 1.42;
    letter-spacing: .38em;
    text-transform: uppercase;
    color: #17351B;
  }

  .nutrition-influence-copy p {
    margin: 1.85cqw 0 0;
    max-width: 29cqw;
    font-family: var(--sans);
    font-size: 1.22cqw;
    font-weight: 500;
    line-height: 1.72;
    color: rgba(22, 25, 20, .88);
  }

  .nutrition-influence-takeaway {
    margin-top: 5.1cqw;
    min-height: 8.35cqw;
    display: grid;
    grid-template-columns: 5.2cqw minmax(0, 1fr);
    align-items: center;
    gap: 2.6cqw;
    border-radius: .9cqw;
    background: rgba(217, 211, 198, .55);
    padding: 1.55cqw 2.75cqw;
  }

  .nutrition-influence-takeaway-sprig {
    width: 4.5cqw;
    height: 5.7cqw;
    color: rgba(72, 87, 58, .7);
  }

  .nutrition-influence-takeaway p {
    margin: 0;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 1.85cqw;
    font-style: italic;
    font-weight: 500;
    line-height: 1.22;
    color: #143318;
  }

  .nutrition-influence-page-number {
    position: absolute;
    left: 49.2cqw;
    bottom: 3.05cqw;
    z-index: 5;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 1.45cqw;
    font-family: var(--sans);
    font-size: 1.48cqw;
    font-weight: 600;
    line-height: 1;
    color: rgba(20, 38, 14, .82);
  }

  .nutrition-influence-page-number::before,
  .nutrition-influence-page-number::after {
    content: "";
    width: 1.45cqw;
    height: 1px;
    background: rgba(20, 38, 14, .82);
  }

  @media (min-width: 821px) {
    .ebook-nutrition-influence-page {
      --nutrition-influence-stage-x: clamp(48px, 7vw, 120px);
      --nutrition-influence-stage-y: clamp(18px, 3svh, 34px);
      min-height: 100svh;
      padding: var(--nutrition-influence-stage-y) var(--nutrition-influence-stage-x);
      place-items: center;
    }

    .ebook-nutrition-influence-sheet {
      width: min(
        calc(100vw - (var(--nutrition-influence-stage-x) * 2)),
        calc((100svh - (var(--nutrition-influence-stage-y) * 2)) * .7075788),
        1055px
      );
      min-height: 0;
      aspect-ratio: 1055 / 1491;
      box-shadow: 0 24px 70px rgba(38, 33, 27, .18);
    }
  }

  .ebook-food-guide-page {
    isolation: isolate;
    display: grid;
    place-items: stretch;
    background: #E9E1D3;
    color: #102A12;
  }

  .ebook-food-guide-sheet {
    container-type: inline-size;
    position: relative;
    width: 100%;
    min-height: 100svh;
    overflow: hidden;
    isolation: isolate;
    background: #F7F3EC;
  }

  .food-guide-photo {
    position: absolute;
    inset: 0;
    z-index: 0;
    object-fit: cover;
    object-position: center;
    filter: saturate(.98) contrast(.98) brightness(1.01);
  }

  .food-guide-paper-wash {
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    background:
      linear-gradient(180deg, #F7F3EC 0%, #F7F3EC 9.4%, rgba(247,243,236,.82) 13.2%, rgba(247,243,236,0) 25%),
      linear-gradient(90deg, #F7F3EC 0%, #F7F3EC 40%, rgba(247,243,236,.78) 54%, rgba(247,243,236,.18) 70%, rgba(247,243,236,0) 100%),
      radial-gradient(circle at 46% 32%, rgba(247,243,236,.92) 0, rgba(247,243,236,.55) 19%, rgba(247,243,236,0) 40%);
  }

  .food-guide-top-mark {
    position: absolute;
    left: 5.1cqw;
    top: 3.08cqw;
    z-index: 4;
    width: 2.8cqw;
    height: 5.55cqw;
    color: rgba(45, 58, 36, .76);
    transform: rotate(10deg);
  }

  .food-guide-topline {
    position: absolute;
    left: 9.05cqw;
    top: 5.28cqw;
    z-index: 4;
    font-family: var(--sans);
    font-size: 1.03cqw;
    font-weight: 800;
    line-height: 1;
    letter-spacing: .48em;
    text-transform: uppercase;
    color: #172514;
    white-space: nowrap;
  }

  .food-guide-topline span {
    display: inline-block;
    margin: 0 1.55cqw;
  }

  .food-guide-top-rule {
    position: absolute;
    left: 9.05cqw;
    right: 7.1cqw;
    top: 8.86cqw;
    z-index: 4;
    height: 1px;
    background: rgba(33, 43, 30, .36);
  }

  .food-guide-content {
    position: absolute;
    left: 8.74cqw;
    top: 38.35cqw;
    z-index: 5;
    width: 58.4cqw;
  }

  .food-guide-section-label {
    font-family: var(--sans);
    font-size: 1.64cqw;
    font-weight: 800;
    line-height: 1;
    letter-spacing: .42em;
    text-transform: uppercase;
    color: #20301D;
  }

  .food-guide-section-rule {
    width: 4.55cqw;
    height: 1px;
    margin-top: 2.15cqw;
    background: rgba(32, 48, 29, .74);
  }

  .food-guide-content h2 {
    margin: 5.15cqw 0 0;
    max-width: 59cqw;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: clamp(7.2cqw, 9.38cqw, 9.7cqw);
    font-weight: 500;
    line-height: 1.01;
    letter-spacing: 0;
    color: #102A12;
  }

  .food-guide-divider {
    margin-top: 6.35cqw;
    display: flex;
    align-items: center;
    gap: 2.35cqw;
    color: #A77141;
  }

  .food-guide-divider i {
    display: block;
    width: 11.8cqw;
    height: 1px;
    background: rgba(167, 113, 65, .72);
  }

  .food-guide-divider .section-divider-leaf {
    width: 3.35cqw;
    height: 1.55cqw;
  }

  .food-guide-meta {
    margin-top: 6.35cqw;
    display: grid;
    grid-template-columns: 8.8cqw minmax(0, 1fr);
    align-items: center;
    gap: 5.1cqw;
  }

  .food-guide-medallion {
    width: 8.55cqw;
    height: 8.55cqw;
    display: grid;
    place-items: center;
    border: 1px solid rgba(77, 91, 68, .46);
    border-radius: 50%;
    color: rgba(54, 69, 47, .9);
    background: rgba(247,243,236,.38);
  }

  .food-guide-medallion-branch {
    width: 3.7cqw;
    height: 5.35cqw;
    transform: rotate(2deg);
  }

  .food-guide-page-count {
    font-family: var(--sans);
    font-size: 1.7cqw;
    font-weight: 800;
    line-height: 1;
    letter-spacing: .42em;
    text-transform: uppercase;
    color: #2E3C27;
  }

  .food-guide-purpose {
    margin-top: 6.15cqw;
    max-width: 26.8cqw;
  }

  .food-guide-purpose-label {
    font-family: var(--sans);
    font-size: 1.08cqw;
    font-weight: 800;
    line-height: 1;
    letter-spacing: .42em;
    text-transform: uppercase;
    color: #25331F;
  }

  .food-guide-purpose p {
    margin: 2.25cqw 0 0;
    font-family: var(--sans);
    font-size: 1.55cqw;
    font-weight: 500;
    line-height: 1.68;
    color: rgba(31, 33, 30, .88);
  }

  .food-guide-bottom-rule {
    width: 31.2cqw;
    height: 1px;
    margin-top: 21.4cqw;
    background: rgba(33, 43, 30, .32);
  }

  .food-guide-page-number {
    position: absolute;
    right: 6.95cqw;
    bottom: 5.12cqw;
    z-index: 5;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: .95cqw;
    font-family: var(--sans);
    font-size: 1.34cqw;
    font-weight: 600;
    line-height: 1;
    color: rgba(20, 38, 14, .82);
  }

  .food-guide-page-number::after {
    content: "";
    width: 3.6cqw;
    height: 1px;
    background: rgba(20, 38, 14, .72);
  }

  @media (min-width: 821px) {
    .ebook-food-guide-page {
      --food-guide-stage-x: clamp(48px, 7vw, 120px);
      --food-guide-stage-y: clamp(18px, 3svh, 34px);
      min-height: 100svh;
      padding: var(--food-guide-stage-y) var(--food-guide-stage-x);
      place-items: center;
    }

    .ebook-food-guide-sheet {
      width: min(
        calc(100vw - (var(--food-guide-stage-x) * 2)),
        calc((100svh - (var(--food-guide-stage-y) * 2)) * .7075788),
        1055px
      );
      min-height: 0;
      aspect-ratio: 1055 / 1491;
      box-shadow: 0 24px 70px rgba(38, 33, 27, .18);
    }
  }

  .ebook-food-gallery-page {
    isolation: isolate;
    display: grid;
    place-items: stretch;
    background: #E9E1D3;
    color: #102A12;
  }

  .ebook-food-gallery-sheet {
    container-type: inline-size;
    position: relative;
    width: 100%;
    min-height: 100svh;
    overflow: hidden;
    isolation: isolate;
    background: #F7F3EC;
  }

  .food-gallery-photo {
    position: absolute;
    inset: 0;
    z-index: 0;
    object-fit: cover;
    object-position: center;
    filter: saturate(.98) contrast(.98) brightness(1.01);
  }

  .food-gallery-paper-wash {
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    background:
      linear-gradient(180deg, rgba(247,243,236,.64) 0%, rgba(247,243,236,0) 21%, rgba(247,243,236,0) 100%),
      linear-gradient(90deg, rgba(247,243,236,.42) 0%, rgba(247,243,236,0) 58%);
  }

  .food-gallery-topline {
    position: absolute;
    left: 9.05cqw;
    top: 5.28cqw;
    z-index: 5;
    font-family: var(--sans);
    font-size: 1.03cqw;
    font-weight: 800;
    line-height: 1;
    letter-spacing: .48em;
    text-transform: uppercase;
    color: #172514;
    white-space: nowrap;
  }

  .food-gallery-topline span {
    display: inline-block;
    margin: 0 1.55cqw;
  }

  .food-gallery-title {
    position: absolute;
    left: 8.55cqw;
    top: 18.55cqw;
    z-index: 5;
    width: 41.4cqw;
  }

  .food-gallery-title h2 {
    margin: 0;
    max-width: 45cqw;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: clamp(6.3cqw, 7.35cqw, 7.7cqw);
    font-weight: 500;
    line-height: 1.08;
    letter-spacing: 0;
    color: #102A12;
  }

  .food-gallery-divider {
    margin-top: 3.25cqw;
    display: flex;
    align-items: center;
    gap: 2.1cqw;
    color: #A77141;
  }

  .food-gallery-divider i {
    display: block;
    width: 12.2cqw;
    height: 1px;
    background: rgba(167, 113, 65, .72);
  }

  .food-gallery-divider .section-divider-leaf {
    width: 3.25cqw;
    height: 1.48cqw;
  }

  .food-gallery-title p {
    margin: 3.45cqw 0 0;
    max-width: 34.7cqw;
    font-family: var(--sans);
    font-size: 1.68cqw;
    font-weight: 500;
    line-height: 1.54;
    color: rgba(31, 33, 30, .88);
  }

  .food-gallery-dynamic {
    margin-top: 3.45cqw;
    width: 35.4cqw;
    height: 4.45cqw;
    display: flex;
    align-items: center;
    gap: 1.58cqw;
    border-radius: .74cqw;
    padding: 0 1.7cqw;
    background: rgba(222, 218, 207, .76);
  }

  .food-gallery-dynamic-branch {
    width: 1.42cqw;
    height: 2.4cqw;
    color: rgba(77, 91, 68, .82);
    transform: rotate(8deg);
  }

  .food-gallery-dynamic span {
    font-family: var(--sans);
    font-size: 1.02cqw;
    font-weight: 800;
    line-height: 1;
    letter-spacing: .34em;
    text-transform: uppercase;
    color: #435039;
  }

  .food-gallery-card-copy {
    position: absolute;
    left: 6.6cqw;
    top: 79.2cqw;
    z-index: 5;
    width: 86.05cqw;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    column-gap: 1.72cqw;
    row-gap: 22.15cqw;
  }

  .food-gallery-card-text {
    position: relative;
    min-height: 12.8cqw;
    padding: 1.36cqw 1.4cqw 0 5.55cqw;
  }

  .food-gallery-card-image {
    position: absolute;
    top: .25cqw;
    left: -.35cqw;
    width: 4.8cqw;
    height: 4.8cqw;
    overflow: hidden;
    border-radius: 50%;
  }

  .food-gallery-card-image img,
  .grocery-essentials-item-image img,
  .fruit-catalog-item-image img,
  .vegetable-catalog-item-image img { object-fit: cover; }

  .food-gallery-card-text h3 {
    margin: 0;
    min-height: 2.3cqw;
    font-family: var(--sans);
    font-size: 1.05cqw;
    font-weight: 800;
    line-height: 1.42;
    letter-spacing: .34em;
    text-transform: uppercase;
    color: #172514;
  }

  .food-gallery-card-text p {
    margin: 2.05cqw 0 0;
    font-family: var(--sans);
    font-size: 1.34cqw;
    font-weight: 500;
    line-height: 1.55;
    color: rgba(31, 33, 30, .88);
  }

  .food-gallery-quote {
    position: absolute;
    left: 14.55cqw;
    bottom: 7.35cqw;
    z-index: 5;
    width: 32.5cqw;
  }

  .food-gallery-quote p {
    margin: 0;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 1.68cqw;
    font-style: italic;
    font-weight: 500;
    line-height: 1.28;
    color: #163519;
  }

  .food-gallery-page-number {
    position: absolute;
    right: 7.45cqw;
    bottom: 4.85cqw;
    z-index: 5;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: .95cqw;
    font-family: var(--sans);
    font-size: 1.34cqw;
    font-weight: 600;
    line-height: 1;
    color: rgba(20, 38, 14, .82);
  }

  .food-gallery-page-number::after {
    content: "";
    width: 3.6cqw;
    height: 1px;
    background: rgba(20, 38, 14, .72);
  }

  @media (min-width: 821px) {
    .ebook-food-gallery-page {
      --food-gallery-stage-x: clamp(48px, 7vw, 120px);
      --food-gallery-stage-y: clamp(18px, 3svh, 34px);
      min-height: 100svh;
      padding: var(--food-gallery-stage-y) var(--food-gallery-stage-x);
      place-items: center;
    }

    .ebook-food-gallery-sheet {
      width: min(
        calc(100vw - (var(--food-gallery-stage-x) * 2)),
        calc((100svh - (var(--food-gallery-stage-y) * 2)) * .7075788),
        1055px
      );
      min-height: 0;
      aspect-ratio: 1055 / 1491;
      box-shadow: 0 24px 70px rgba(38, 33, 27, .18);
    }
  }

  .ebook-balanced-plate-page,
  .ebook-hydration-page {
    isolation: isolate;
    display: grid;
    place-items: stretch;
    background: #E9E1D3;
    color: #102A12;
  }

  .ebook-balanced-plate-sheet,
  .ebook-hydration-sheet {
    container-type: inline-size;
    position: relative;
    width: 100%;
    min-height: 100svh;
    overflow: hidden;
    isolation: isolate;
    background: #F7F3EC;
  }

  .balanced-plate-photo,
  .hydration-photo {
    position: absolute;
    inset: 0;
    z-index: 0;
    object-fit: cover;
    object-position: center;
    filter: saturate(.98) contrast(.99) brightness(1.01);
  }

  .balanced-plate-paper-wash,
  .hydration-paper-wash {
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
  }

  .balanced-plate-paper-wash {
    background:
      linear-gradient(90deg, rgba(247,243,236,.78) 0%, rgba(247,243,236,.46) 35%, rgba(247,243,236,0) 72%),
      linear-gradient(180deg, rgba(247,243,236,.42) 0%, rgba(247,243,236,0) 35%);
  }

  .hydration-paper-wash {
    background:
      linear-gradient(90deg, rgba(247,243,236,.82) 0%, rgba(247,243,236,.58) 38%, rgba(247,243,236,.08) 66%, rgba(247,243,236,0) 100%),
      linear-gradient(180deg, rgba(247,243,236,.52) 0%, rgba(247,243,236,0) 35%);
  }

  .balanced-plate-top-mark,
  .hydration-top-mark {
    position: absolute;
    left: 4.55cqw;
    top: 3.15cqw;
    z-index: 5;
    width: 2.85cqw;
    height: 5.3cqw;
    color: rgba(95, 107, 79, .88);
  }

  .balanced-plate-topline,
  .hydration-topline {
    position: absolute;
    left: 8.82cqw;
    top: 5.16cqw;
    z-index: 5;
    font-family: var(--sans);
    font-size: 1.03cqw;
    font-weight: 800;
    line-height: 1;
    letter-spacing: .46em;
    text-transform: uppercase;
    color: #172514;
    white-space: nowrap;
  }

  .balanced-plate-topline span,
  .hydration-topline span {
    display: inline-block;
    margin: 0 1.55cqw;
  }

  .balanced-plate-top-rule,
  .hydration-top-rule {
    position: absolute;
    top: 8.72cqw;
    z-index: 5;
    height: 1px;
    background: rgba(44, 50, 37, .62);
  }

  .balanced-plate-top-rule {
    left: 8.95cqw;
    right: 6.68cqw;
  }

  .hydration-top-rule {
    left: 8.95cqw;
    width: 49.86cqw;
  }

  .balanced-plate-copy,
  .hydration-copy {
    position: absolute;
    z-index: 5;
  }

  .balanced-plate-copy {
    left: 8.38cqw;
    top: 15.72cqw;
    width: 33.5cqw;
  }

  .balanced-plate-copy h2,
  .hydration-copy h2 {
    margin: 0;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-weight: 500;
    line-height: 1.05;
    letter-spacing: 0;
    color: #102A12;
  }

  .balanced-plate-copy h2 {
    font-size: clamp(6.4cqw, 7.5cqw, 7.75cqw);
  }

  .balanced-plate-divider,
  .hydration-divider {
    display: flex;
    align-items: center;
    color: #A77141;
  }

  .balanced-plate-divider {
    margin-top: 3.78cqw;
    gap: 1.7cqw;
  }

  .balanced-plate-divider i {
    display: block;
    width: 8.8cqw;
    height: 1px;
    background: rgba(167, 113, 65, .72);
  }

  .balanced-plate-divider .section-divider-leaf {
    width: 3.2cqw;
    height: 1.42cqw;
  }

  .balanced-plate-intro,
  .hydration-intro {
    margin: 3.62cqw 0 0;
    font-family: var(--sans);
    font-weight: 500;
    color: rgba(31, 33, 30, .86);
  }

  .balanced-plate-intro {
    max-width: 29.2cqw;
    font-size: 1.62cqw;
    line-height: 1.58;
  }

  .balanced-plate-segments {
    position: absolute;
    left: 8.45cqw;
    top: 62.05cqw;
    z-index: 6;
    width: 73.5cqw;
    display: grid;
    gap: 5.45cqw;
  }

  .balanced-plate-segment {
    position: relative;
    min-height: 12.75cqw;
    display: grid;
    grid-template-columns: 8.35cqw 14.2cqw;
    column-gap: 1.75cqw;
    align-items: start;
  }

  .balanced-plate-segment::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -2.68cqw;
    width: 23.2cqw;
    height: 1px;
    background: rgba(167, 113, 65, .58);
  }

  .balanced-plate-segment:last-child::after {
    display: none;
  }

  .balanced-plate-icon {
    width: 7.72cqw;
    height: 7.72cqw;
    display: grid;
    place-items: center;
    border-radius: 999px;
    background: #7D8968;
    color: rgba(255,255,255,.95);
    box-shadow: inset 0 0 0 1px rgba(255,255,255,.26);
  }

  .balanced-plate-segment:nth-child(2) .balanced-plate-icon {
    background: #BBA88B;
  }

  .balanced-plate-segment:nth-child(3) .balanced-plate-icon {
    background: #97A184;
  }

  .balanced-plate-icon svg {
    width: 4.7cqw;
    height: 4.7cqw;
  }

  .balanced-plate-segment-copy {
    position: relative;
    z-index: 2;
  }

  .balanced-plate-value {
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 4.35cqw;
    font-weight: 500;
    line-height: .9;
    color: #102A12;
  }

  .balanced-plate-segment h3 {
    margin: .82cqw 0 0;
    font-family: var(--sans);
    font-size: 1.06cqw;
    font-weight: 800;
    line-height: 1.28;
    letter-spacing: .34em;
    text-transform: uppercase;
    color: #102A12;
  }

  .balanced-plate-segment p {
    margin: 1.78cqw 0 0;
    font-family: var(--sans);
    font-size: .93cqw;
    font-weight: 500;
    line-height: 1.55;
    color: rgba(31, 33, 30, .84);
  }

  .balanced-plate-guide {
    position: absolute;
    left: 19.45cqw;
    top: 3.25cqw;
    width: 29.2cqw;
    height: 1px;
    border-top: .2cqw dotted rgba(53, 67, 47, .72);
  }

  .balanced-plate-guide::after {
    content: "";
    position: absolute;
    right: -.45cqw;
    top: -.52cqw;
    width: .96cqw;
    height: .96cqw;
    border-radius: 999px;
    background: #F9F7EE;
    box-shadow: 0 0 0 .18cqw rgba(53, 67, 47, .35);
  }

  .balanced-plate-quote,
  .hydration-quote {
    position: absolute;
    z-index: 5;
    display: grid;
    align-items: center;
    border-radius: 1cqw;
    background: rgba(229, 226, 217, .84);
    box-shadow: 0 18px 46px -34px rgba(38, 33, 27, .22);
  }

  .balanced-plate-quote {
    left: 8.35cqw;
    bottom: 8.08cqw;
    width: 44.75cqw;
    min-height: 8.08cqw;
    grid-template-columns: 6.6cqw 1fr;
    column-gap: 2.4cqw;
    padding: 1.4cqw 3.1cqw 1.35cqw 2.2cqw;
  }

  .balanced-plate-quote-branch,
  .hydration-quote-branch {
    color: rgba(95, 107, 79, .76);
  }

  .balanced-plate-quote-branch {
    width: 4.72cqw;
    height: 6.6cqw;
  }

  .balanced-plate-quote p,
  .hydration-quote p {
    margin: 0;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-style: italic;
    font-weight: 500;
    color: #18381B;
  }

  .balanced-plate-quote p {
    font-size: 1.78cqw;
    line-height: 1.23;
  }

  .balanced-plate-page-number,
  .hydration-page-number {
    position: absolute;
    z-index: 5;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: .95cqw;
    font-family: var(--sans);
    font-size: 1.34cqw;
    font-weight: 600;
    line-height: 1;
    color: rgba(20, 38, 14, .82);
  }

  .balanced-plate-page-number {
    right: 8.2cqw;
    bottom: 4.05cqw;
  }

  .hydration-page-number {
    right: 7.58cqw;
    bottom: 4.2cqw;
  }

  .balanced-plate-page-number::after,
  .hydration-page-number::after {
    content: "";
    width: 3.6cqw;
    height: 1px;
    background: rgba(20, 38, 14, .72);
  }

  .hydration-copy {
    left: 7.2cqw;
    top: 16.45cqw;
    width: 43.8cqw;
  }

  .hydration-copy h2 {
    font-size: clamp(5.6cqw, 6.6cqw, 6.98cqw);
  }

  .hydration-divider {
    margin-top: 4.0cqw;
    gap: 2.08cqw;
  }

  .hydration-divider i {
    display: block;
    width: 11.78cqw;
    height: 1px;
    background: rgba(167, 113, 65, .72);
  }

  .hydration-divider .section-divider-leaf {
    width: 3.05cqw;
    height: 1.38cqw;
  }

  .hydration-intro {
    max-width: 39.4cqw;
    font-size: 1.47cqw;
    line-height: 1.58;
  }

  .hydration-framework-label {
    margin-top: 3.95cqw;
    font-family: var(--sans);
    font-size: 1.16cqw;
    font-weight: 800;
    line-height: 1;
    letter-spacing: .43em;
    text-transform: uppercase;
    color: #17371A;
  }

  .hydration-steps {
    position: absolute;
    left: 7.22cqw;
    top: 53.42cqw;
    z-index: 6;
    width: 40.2cqw;
    display: grid;
    gap: 3.55cqw;
  }

  .hydration-step {
    position: relative;
    display: grid;
    grid-template-columns: 7.72cqw 1fr;
    column-gap: 3.02cqw;
    min-height: 10.1cqw;
  }

  .hydration-step:not(:last-child)::after {
    content: "";
    position: absolute;
    left: 3.84cqw;
    top: 8.56cqw;
    width: 1px;
    height: 5.15cqw;
    background: repeating-linear-gradient(180deg, rgba(82, 88, 66, .56) 0 2px, transparent 2px 5px);
  }

  .hydration-step-icon {
    width: 7.72cqw;
    height: 7.72cqw;
    display: grid;
    place-items: center;
    border-radius: 999px;
    background: #7D8668;
    color: rgba(255,255,255,.95);
    box-shadow: inset 0 0 0 1px rgba(255,255,255,.22);
  }

  .hydration-step-icon svg {
    width: 4.6cqw;
    height: 4.6cqw;
  }

  .hydration-step h3 {
    margin: .92cqw 0 0;
    font-family: var(--sans);
    font-size: 1.15cqw;
    font-weight: 800;
    line-height: 1.35;
    letter-spacing: .34em;
    text-transform: uppercase;
    color: #102A12;
  }

  .hydration-step p {
    margin: 1.18cqw 0 0;
    font-family: var(--sans);
    font-size: 1.24cqw;
    font-weight: 500;
    line-height: 1.48;
    color: rgba(31, 33, 30, .86);
  }

  .hydration-tips {
    position: absolute;
    left: 55.2cqw;
    top: 100.9cqw;
    z-index: 6;
    width: 37.6cqw;
    border-radius: 1.18cqw;
    background: rgba(239, 237, 229, .9);
    padding: 2.72cqw 3.62cqw 2.4cqw;
    box-shadow: 0 24px 58px -38px rgba(38, 33, 27, .26);
  }

  .hydration-tips h3 {
    margin: 0 0 1.82cqw;
    font-family: var(--sans);
    font-size: 1.08cqw;
    font-weight: 800;
    line-height: 1;
    letter-spacing: .42em;
    text-transform: uppercase;
    color: #17371A;
  }

  .hydration-tip {
    display: grid;
    grid-template-columns: 3.45cqw 1fr;
    align-items: center;
    column-gap: 2.18cqw;
    min-height: 5.9cqw;
    padding: 1.18cqw 0;
    border-top: 1px solid rgba(186, 177, 161, .58);
  }

  .hydration-tip:first-of-type {
    border-top: 0;
  }

  .hydration-tip svg {
    width: 3.12cqw;
    height: 3.12cqw;
    color: rgba(102, 109, 84, .95);
  }

  .hydration-tip p {
    margin: 0;
    font-family: var(--sans);
    font-size: 1.22cqw;
    font-weight: 500;
    line-height: 1.45;
    color: rgba(31, 33, 30, .9);
  }

  .hydration-quote {
    left: 7.18cqw;
    bottom: 8.65cqw;
    width: 36.9cqw;
    min-height: 10.55cqw;
    grid-template-columns: 5.85cqw 1fr;
    column-gap: 2.28cqw;
    padding: 1.68cqw 2.8cqw 1.62cqw 2.2cqw;
  }

  .hydration-quote-branch {
    width: 4.32cqw;
    height: 6.45cqw;
  }

  .hydration-quote p {
    font-size: 1.74cqw;
    line-height: 1.24;
  }

  @media (min-width: 821px) {
    .ebook-balanced-plate-page,
    .ebook-hydration-page {
      --next-pages-stage-x: clamp(48px, 7vw, 120px);
      --next-pages-stage-y: clamp(18px, 3svh, 34px);
      min-height: 100svh;
      padding: var(--next-pages-stage-y) var(--next-pages-stage-x);
      place-items: center;
    }

    .ebook-balanced-plate-sheet,
    .ebook-hydration-sheet {
      width: min(
        calc(100vw - (var(--next-pages-stage-x) * 2)),
        calc((100svh - (var(--next-pages-stage-y) * 2)) * .7064343),
        1054px
      );
      min-height: 0;
      aspect-ratio: 1054 / 1492;
      box-shadow: 0 24px 70px rgba(38, 33, 27, .18);
    }
  }

  .ebook-meal-timing-page,
  .ebook-sustainable-rhythm-page,
  .ebook-smart-food-swaps-page,
  .ebook-smart-swaps-continued-page {
    isolation: isolate;
    display: grid;
    place-items: stretch;
    background: #E9E1D3;
    color: #102A12;
  }

  .ebook-meal-timing-sheet,
  .ebook-sustainable-rhythm-sheet,
  .ebook-smart-food-swaps-sheet,
  .ebook-smart-swaps-continued-sheet {
    container-type: inline-size;
    position: relative;
    width: 100%;
    min-height: 100svh;
    overflow: hidden;
    isolation: isolate;
    background: #F7F3EC;
  }

  .meal-timing-photo,
  .sustainable-rhythm-photo,
  .smart-food-swaps-photo,
  .smart-swaps-continued-photo {
    position: absolute;
    inset: 0;
    z-index: 0;
    object-fit: cover;
    object-position: center;
    filter: saturate(.98) contrast(.99) brightness(1.01);
  }

  .meal-timing-paper-wash,
  .sustainable-rhythm-paper-wash,
  .smart-food-swaps-paper-wash,
  .smart-swaps-continued-paper-wash {
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    background: linear-gradient(90deg, rgba(247,243,236,.18) 0%, rgba(247,243,236,.06) 58%, rgba(247,243,236,0) 100%);
  }

  .meal-timing-topline,
  .sustainable-rhythm-topline,
  .smart-food-swaps-topline,
  .smart-swaps-continued-topline {
    position: absolute;
    left: 8.85cqw;
    top: 5.22cqw;
    z-index: 5;
    font-family: var(--sans);
    font-size: 1.03cqw;
    font-weight: 800;
    line-height: 1;
    letter-spacing: .46em;
    text-transform: uppercase;
    color: #172514;
    white-space: nowrap;
  }

  .meal-timing-topline span,
  .sustainable-rhythm-topline span,
  .smart-food-swaps-topline span,
  .smart-swaps-continued-topline span {
    display: inline-block;
    margin: 0 1.55cqw;
  }

  .meal-timing-copy,
  .sustainable-rhythm-copy,
  .smart-food-swaps-copy {
    position: absolute;
    z-index: 5;
  }

  .meal-timing-copy {
    left: 8.75cqw;
    top: 18.65cqw;
    width: 34.2cqw;
  }

  .sustainable-rhythm-copy {
    left: 9.72cqw;
    top: 17.28cqw;
    width: 54.4cqw;
  }

  .smart-food-swaps-copy {
    left: 6.9cqw;
    top: 22.05cqw;
    width: 31.8cqw;
  }

  .meal-timing-copy h2,
  .sustainable-rhythm-copy h2,
  .smart-food-swaps-copy h2 {
    margin: 0;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-weight: 500;
    line-height: 1.05;
    letter-spacing: 0;
    color: #102A12;
  }

  .meal-timing-copy h2 {
    font-size: clamp(6.25cqw, 7.2cqw, 7.55cqw);
  }

  .sustainable-rhythm-copy h2 {
    font-size: clamp(5.65cqw, 6.45cqw, 6.86cqw);
  }

  .smart-food-swaps-copy h2 {
    font-size: clamp(6.45cqw, 7.15cqw, 7.52cqw);
  }

  .meal-timing-divider,
  .sustainable-rhythm-divider,
  .smart-food-swaps-divider {
    display: flex;
    align-items: center;
    color: #A77141;
  }

  .meal-timing-divider,
  .sustainable-rhythm-divider {
    margin-top: 3.78cqw;
    gap: 1.72cqw;
  }

  .smart-food-swaps-divider {
    margin-top: 5.65cqw;
    gap: 1.82cqw;
  }

  .meal-timing-divider i,
  .sustainable-rhythm-divider i,
  .smart-food-swaps-divider i {
    display: block;
    height: 1px;
    background: rgba(167, 113, 65, .72);
  }

  .meal-timing-divider i,
  .sustainable-rhythm-divider i {
    width: 9.35cqw;
  }

  .smart-food-swaps-divider i {
    width: 10.35cqw;
  }

  .meal-timing-divider .section-divider-leaf,
  .sustainable-rhythm-divider .section-divider-leaf,
  .smart-food-swaps-divider .section-divider-leaf {
    width: 3.1cqw;
    height: 1.42cqw;
  }

  .meal-timing-copy p,
  .sustainable-rhythm-copy p,
  .smart-food-swaps-copy p {
    margin: 3.58cqw 0 0;
    font-family: var(--sans);
    font-weight: 500;
    line-height: 1.62;
    color: rgba(31, 33, 30, .86);
  }

  .meal-timing-copy p {
    max-width: 30.4cqw;
    font-size: 1.45cqw;
  }

  .sustainable-rhythm-copy p {
    max-width: 46.8cqw;
    font-size: 1.34cqw;
  }

  .smart-food-swaps-copy p {
    max-width: 29.3cqw;
    font-size: 1.43cqw;
    line-height: 1.74;
  }

  .meal-timing-timeline-label {
    position: absolute;
    left: 53.78cqw;
    top: 17.62cqw;
    z-index: 5;
    font-family: var(--sans);
    font-size: 1.18cqw;
    font-weight: 800;
    line-height: 1;
    letter-spacing: .42em;
    text-transform: uppercase;
    color: #17371A;
  }

  .meal-timing-entry,
  .sustainable-rhythm-entry {
    position: absolute;
    z-index: 5;
    font-family: var(--sans);
    color: rgba(31, 33, 30, .88);
  }

  .meal-timing-entry {
    left: 60.42cqw;
    width: 17.95cqw;
  }

  .meal-timing-entry:nth-child(1) { top: 24.6cqw; }
  .meal-timing-entry:nth-child(2) { top: 49.52cqw; }
  .meal-timing-entry:nth-child(3) { top: 72.58cqw; }
  .meal-timing-entry:nth-child(4) { top: 94.58cqw; }
  .meal-timing-entry:nth-child(5) { top: 116.02cqw; }

  .meal-timing-time,
  .sustainable-rhythm-time {
    font-size: 1.1cqw;
    font-weight: 600;
    line-height: 1;
    letter-spacing: .12em;
    color: #102A12;
  }

  .meal-timing-entry h3,
  .sustainable-rhythm-entry h3 {
    margin: 1.08cqw 0 0;
    font-family: var(--sans);
    font-size: .98cqw;
    font-weight: 800;
    line-height: 1.28;
    letter-spacing: .32em;
    text-transform: uppercase;
    color: #102A12;
  }

  .meal-timing-entry p,
  .sustainable-rhythm-entry p {
    margin: 1.18cqw 0 0;
    font-family: var(--sans);
    font-weight: 500;
    line-height: 1.55;
    color: rgba(31, 33, 30, .88);
  }

  .meal-timing-entry p {
    font-size: 1.05cqw;
  }

  .sustainable-rhythm-entry p {
    font-size: 1.08cqw;
  }

  .meal-timing-consistency,
  .sustainable-rhythm-consistency {
    position: absolute;
    z-index: 5;
    font-family: var(--sans);
  }

  .meal-timing-consistency {
    left: 16.38cqw;
    bottom: 10.26cqw;
    width: 23.2cqw;
  }

  .sustainable-rhythm-consistency {
    left: 25.12cqw;
    top: 106.4cqw;
    width: 27.4cqw;
  }

  .meal-timing-consistency h3,
  .sustainable-rhythm-consistency h3 {
    margin: 0;
    font-family: var(--sans);
    font-size: 1.08cqw;
    font-weight: 800;
    line-height: 1;
    letter-spacing: .38em;
    text-transform: uppercase;
    color: #17371A;
  }

  .sustainable-rhythm-consistency h3::after {
    content: "";
    display: block;
    width: 2.9cqw;
    height: 1px;
    margin-top: 1.4cqw;
    background: rgba(102, 109, 84, .72);
  }

  .meal-timing-consistency p,
  .sustainable-rhythm-consistency p {
    margin: 1.28cqw 0 0;
    font-family: var(--sans);
    font-size: 1.06cqw;
    font-weight: 500;
    line-height: 1.55;
    color: rgba(31, 33, 30, .88);
  }

  .sustainable-rhythm-entry {
    left: 25.78cqw;
    width: 27.4cqw;
  }

  .sustainable-rhythm-entry:nth-child(1) { top: 57.95cqw; }
  .sustainable-rhythm-entry:nth-child(2) { top: 78.75cqw; }

  .sustainable-rhythm-quote {
    position: absolute;
    left: 28.45cqw;
    bottom: 6.55cqw;
    z-index: 5;
    width: 37.8cqw;
    text-align: center;
  }

  .sustainable-rhythm-quote p,
  .smart-swaps-continued-quote p {
    margin: 0;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-style: italic;
    font-weight: 500;
    line-height: 1.28;
    color: #18381B;
  }

  .sustainable-rhythm-quote p {
    font-size: 2.15cqw;
  }

  .smart-food-swaps-dynamic {
    margin-top: 5.45cqw;
    height: 5.45cqw;
    display: flex;
    align-items: center;
    padding-left: 4.88cqw;
  }

  .smart-food-swaps-dynamic span {
    font-family: var(--sans);
    font-size: .88cqw;
    font-weight: 800;
    line-height: 1;
    letter-spacing: .34em;
    text-transform: uppercase;
    color: rgba(76, 88, 62, .9);
  }

  .smart-swap-text-card {
    position: absolute;
    z-index: 5;
    font-family: var(--sans);
  }

  .smart-food-swaps-cards .smart-swap-text-card {
    left: 43.18cqw;
    width: 51.92cqw;
    height: 57.75cqw;
  }

  .smart-food-swaps-cards .smart-swap-text-card:nth-child(1) { top: 17.18cqw; }
  .smart-food-swaps-cards .smart-swap-text-card:nth-child(2) { top: 77.35cqw; }

  .smart-swaps-continued-cards .smart-swap-text-card {
    left: 3.92cqw;
    width: 47.85cqw;
    height: 56.9cqw;
  }

  .smart-swaps-continued-cards .smart-swap-text-card:nth-child(1) { top: 18.4cqw; }
  .smart-swaps-continued-cards .smart-swap-text-card:nth-child(2) { top: 78.5cqw; }

  .smart-swap-number {
    position: absolute;
    left: 3.12cqw;
    top: 3.98cqw;
    font-family: var(--sans);
    font-size: 2.14cqw;
    font-weight: 800;
    line-height: 1;
    color: #405934;
  }

  .smart-swap-number::after {
    content: "";
    display: block;
    width: 3.05cqw;
    height: 1px;
    margin-top: 1.25cqw;
    background: rgba(102, 109, 84, .72);
  }

  .smart-swap-before,
  .smart-swap-after {
    position: absolute;
    top: 10.48cqw;
    width: 18.5cqw;
  }

  .smart-swap-before {
    left: 3.12cqw;
  }

  .smart-swap-after {
    left: 32.28cqw;
  }

  .smart-swaps-continued-cards .smart-swap-after {
    left: 29.2cqw;
  }

  .smart-swap-label {
    font-family: var(--sans);
    font-size: .92cqw;
    font-weight: 800;
    line-height: 1;
    letter-spacing: .34em;
    text-transform: uppercase;
    color: #405934;
  }

  .smart-swap-before h3,
  .smart-swap-after h3 {
    margin: 2.06cqw 0 0;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 2.2cqw;
    font-weight: 500;
    line-height: 1.12;
    letter-spacing: 0;
    color: #172514;
  }

  .smart-swap-before p,
  .smart-swap-after p {
    margin: 2.12cqw 0 0;
    font-family: var(--sans);
    font-size: 1.14cqw;
    font-weight: 500;
    line-height: 1.58;
    color: rgba(31, 33, 30, .88);
  }

  .smart-swaps-continued-quote {
    position: absolute;
    left: 63.2cqw;
    top: 115.95cqw;
    z-index: 5;
    width: 28.2cqw;
    text-align: center;
  }

  .smart-swaps-continued-quote p {
    font-size: 3.0cqw;
  }

  .meal-timing-page-number,
  .sustainable-rhythm-page-number,
  .smart-food-swaps-page-number,
  .smart-swaps-continued-page-number {
    position: absolute;
    z-index: 5;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: .95cqw;
    font-family: var(--sans);
    font-size: 1.34cqw;
    font-weight: 600;
    line-height: 1;
    color: rgba(20, 38, 14, .82);
  }

  .meal-timing-page-number,
  .sustainable-rhythm-page-number,
  .smart-food-swaps-page-number {
    right: 7.3cqw;
    bottom: 4.15cqw;
  }

  .smart-swaps-continued-page-number {
    right: 7.0cqw;
    bottom: 4.18cqw;
  }

  .meal-timing-page-number::after,
  .sustainable-rhythm-page-number::after,
  .smart-food-swaps-page-number::after,
  .smart-swaps-continued-page-number::after {
    content: "";
    width: 3.6cqw;
    height: 1px;
    background: rgba(20, 38, 14, .72);
  }

  @media (min-width: 821px) {
    .ebook-meal-timing-page,
    .ebook-sustainable-rhythm-page,
    .ebook-smart-food-swaps-page,
    .ebook-smart-swaps-continued-page {
      --timing-swaps-stage-x: clamp(48px, 7vw, 120px);
      --timing-swaps-stage-y: clamp(18px, 3svh, 34px);
      min-height: 100svh;
      padding: var(--timing-swaps-stage-y) var(--timing-swaps-stage-x);
      place-items: center;
    }

    .ebook-meal-timing-sheet,
    .ebook-sustainable-rhythm-sheet,
    .ebook-smart-food-swaps-sheet,
    .ebook-smart-swaps-continued-sheet {
      width: min(
        calc(100vw - (var(--timing-swaps-stage-x) * 2)),
        calc((100svh - (var(--timing-swaps-stage-y) * 2)) * .7064343),
        1054px
      );
      min-height: 0;
      aspect-ratio: 1054 / 1492;
      box-shadow: 0 24px 70px rgba(38, 33, 27, .18);
    }
  }

  .ebook-lifestyle-foundation-page,
  .ebook-sleep-recovery-page,
  .ebook-stress-wellbeing-page,
  .ebook-daily-wellness-page,
  .ebook-perfection-consistency-page {
    isolation: isolate;
    display: grid;
    place-items: stretch;
    background: #E9E1D3;
    color: #102A12;
  }

  .ebook-lifestyle-foundation-sheet,
  .ebook-sleep-recovery-sheet,
  .ebook-stress-wellbeing-sheet,
  .ebook-daily-wellness-sheet,
  .ebook-perfection-consistency-sheet {
    container-type: inline-size;
    position: relative;
    width: 100%;
    min-height: 100svh;
    overflow: hidden;
    isolation: isolate;
    background: #F7F3EC;
  }

  .lifestyle-foundation-photo,
  .sleep-recovery-photo,
  .stress-wellbeing-photo,
  .daily-wellness-photo,
  .perfection-consistency-photo {
    position: absolute;
    inset: 0;
    z-index: 0;
    object-fit: cover;
    object-position: center;
    filter: saturate(.98) contrast(.99) brightness(1.01);
  }

  .lifestyle-foundation-paper-wash,
  .sleep-recovery-paper-wash,
  .stress-wellbeing-paper-wash,
  .daily-wellness-paper-wash,
  .perfection-consistency-paper-wash {
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    background: linear-gradient(90deg, rgba(247,243,236,.22) 0%, rgba(247,243,236,.05) 52%, rgba(247,243,236,0) 100%);
  }

  .lifestyle-foundation-topline,
  .sleep-recovery-topline,
  .stress-wellbeing-topline,
  .daily-wellness-topline,
  .perfection-consistency-topline {
    position: absolute;
    left: 8.65cqw;
    top: 5.18cqw;
    z-index: 5;
    font-family: var(--sans);
    font-size: 1.03cqw;
    font-weight: 800;
    line-height: 1;
    letter-spacing: .46em;
    text-transform: uppercase;
    color: #172514;
    white-space: nowrap;
  }

  .lifestyle-foundation-topline span,
  .sleep-recovery-topline span,
  .stress-wellbeing-topline span,
  .daily-wellness-topline span,
  .perfection-consistency-topline span {
    display: inline-block;
    margin: 0 1.55cqw;
  }

  .lifestyle-foundation-content,
  .sleep-recovery-copy,
  .stress-wellbeing-copy,
  .daily-wellness-copy,
  .perfection-consistency-copy {
    position: absolute;
    z-index: 5;
  }

  .lifestyle-foundation-content {
    left: 8.75cqw;
    top: 19.35cqw;
    width: 49.2cqw;
  }

  .lifestyle-foundation-section-label {
    font-family: var(--sans);
    font-size: 1.05cqw;
    font-weight: 800;
    line-height: 1;
    letter-spacing: .46em;
    text-transform: uppercase;
    color: #394D2E;
  }

  .lifestyle-foundation-number {
    margin-top: 1.05cqw;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 17.25cqw;
    font-weight: 400;
    line-height: .82;
    letter-spacing: 0;
    color: #102A12;
  }

  .lifestyle-foundation-content h2,
  .sleep-recovery-copy h2,
  .stress-wellbeing-copy h2,
  .daily-wellness-copy h2,
  .perfection-consistency-copy h2 {
    margin: 0;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-weight: 500;
    line-height: 1.04;
    letter-spacing: 0;
    color: #102A12;
  }

  .lifestyle-foundation-content h2 {
    margin-top: 3.1cqw;
    font-size: clamp(6.2cqw, 6.95cqw, 7.25cqw);
  }

  .lifestyle-foundation-divider,
  .sleep-recovery-divider,
  .stress-wellbeing-divider,
  .daily-wellness-divider,
  .perfection-consistency-divider {
    display: flex;
    align-items: center;
    gap: 1.72cqw;
    color: #A77141;
  }

  .lifestyle-foundation-divider {
    margin-top: 4.1cqw;
  }

  .sleep-recovery-divider,
  .stress-wellbeing-divider,
  .daily-wellness-divider,
  .perfection-consistency-divider {
    margin-top: 3.65cqw;
  }

  .lifestyle-foundation-divider i,
  .sleep-recovery-divider i,
  .stress-wellbeing-divider i,
  .daily-wellness-divider i,
  .perfection-consistency-divider i {
    display: block;
    width: 9.35cqw;
    height: 1px;
    background: rgba(167, 113, 65, .72);
  }

  .lifestyle-foundation-divider .section-divider-leaf,
  .sleep-recovery-divider .section-divider-leaf,
  .stress-wellbeing-divider .section-divider-leaf,
  .daily-wellness-divider .section-divider-leaf,
  .perfection-consistency-divider .section-divider-leaf {
    width: 3.1cqw;
    height: 1.42cqw;
  }

  .lifestyle-foundation-body,
  .sleep-recovery-intro,
  .stress-wellbeing-intro,
  .daily-wellness-intro,
  .perfection-consistency-body {
    margin: 3.35cqw 0 0;
    font-family: var(--sans);
    font-size: 1.38cqw;
    font-weight: 500;
    line-height: 1.66;
    color: rgba(31, 33, 30, .88);
  }

  .lifestyle-foundation-body {
    max-width: 36.4cqw;
  }

  .lifestyle-foundation-badge,
  .perfection-consistency-badge {
    position: absolute;
    z-index: 5;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-style: italic;
    font-weight: 500;
    line-height: 1.25;
    text-align: center;
    color: #18381B;
  }

  .lifestyle-foundation-badge {
    left: 15.35cqw;
    bottom: 7.35cqw;
    width: 36.4cqw;
    font-size: 2.75cqw;
  }

  .sleep-recovery-copy {
    left: 8.72cqw;
    top: 18.85cqw;
    width: 39.2cqw;
  }

  .sleep-recovery-copy h2 {
    font-size: clamp(6.15cqw, 6.75cqw, 7.1cqw);
  }

  .sleep-recovery-intro {
    max-width: 32.7cqw;
  }

  .sleep-recovery-items {
    position: absolute;
    left: 21.88cqw;
    top: 62.3cqw;
    z-index: 5;
    width: 51cqw;
    font-family: var(--sans);
  }

  .sleep-recovery-item {
    position: absolute;
    width: 50cqw;
  }

  .sleep-recovery-item:nth-child(1) { top: 0; }
  .sleep-recovery-item:nth-child(2) { top: 17.9cqw; }
  .sleep-recovery-item:nth-child(3) { top: 39.1cqw; }

  .sleep-recovery-item h3,
  .stress-cycle-card h3,
  .daily-wellness-card h3 {
    margin: 0;
    font-family: var(--sans);
    font-size: 1.05cqw;
    font-weight: 800;
    line-height: 1.25;
    letter-spacing: .34em;
    text-transform: uppercase;
    color: #17371A;
  }

  .sleep-recovery-item p,
  .stress-cycle-card p,
  .daily-wellness-card p {
    margin: 1.05cqw 0 0;
    font-family: var(--sans);
    font-size: 1.08cqw;
    font-weight: 500;
    line-height: 1.55;
    color: rgba(31, 33, 30, .88);
  }

  .sleep-recovery-quote,
  .stress-wellbeing-quote {
    position: absolute;
    z-index: 5;
    text-align: center;
  }

  .sleep-recovery-quote {
    left: 15.5cqw;
    bottom: 10.7cqw;
    width: 38.2cqw;
  }

  .sleep-recovery-quote p,
  .stress-wellbeing-quote p {
    margin: 0;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-style: italic;
    font-weight: 500;
    line-height: 1.25;
    color: #18381B;
  }

  .sleep-recovery-quote p {
    font-size: 2.4cqw;
  }

  .stress-wellbeing-copy {
    left: 8.65cqw;
    top: 18.65cqw;
    width: 39.8cqw;
  }

  .stress-wellbeing-copy h2 {
    font-size: clamp(6.15cqw, 6.85cqw, 7.22cqw);
  }

  .stress-wellbeing-intro {
    max-width: 34.4cqw;
  }

  .stress-cycle-label {
    position: absolute;
    left: 21.85cqw;
    top: 56.95cqw;
    z-index: 5;
    font-family: var(--sans);
    font-size: 1.06cqw;
    font-weight: 800;
    line-height: 1;
    letter-spacing: .38em;
    text-transform: uppercase;
    color: #17371A;
  }

  .stress-cycle-cards {
    position: absolute;
    left: 21.85cqw;
    top: 64.05cqw;
    z-index: 5;
    width: 28.3cqw;
    font-family: var(--sans);
  }

  .stress-cycle-card {
    position: absolute;
    width: 27.6cqw;
  }

  .stress-cycle-card:nth-child(1) { top: 0; }
  .stress-cycle-card:nth-child(2) { top: 17.6cqw; }
  .stress-cycle-card:nth-child(3) { top: 35.2cqw; }
  .stress-cycle-card:nth-child(4) { top: 52.8cqw; }

  .stress-insight-box {
    position: absolute;
    right: 7.65cqw;
    top: 100.85cqw;
    z-index: 5;
    width: 30.2cqw;
    min-height: 15.5cqw;
    padding: 2.15cqw 2.25cqw;
    border: 1px solid rgba(206, 191, 164, .8);
    background: rgba(248, 244, 236, .86);
    font-family: var(--sans);
    color: rgba(31, 33, 30, .88);
  }

  .stress-insight-box p {
    margin: 0;
    font-size: 1.12cqw;
    font-weight: 500;
    line-height: 1.62;
  }

  .stress-insight-box strong {
    font-weight: 800;
    letter-spacing: .06em;
    color: #17371A;
  }

  .stress-wellbeing-quote {
    right: 8.1cqw;
    bottom: 10.05cqw;
    width: 28.8cqw;
  }

  .stress-wellbeing-quote p {
    font-size: 2.35cqw;
  }

  .daily-wellness-copy {
    left: 7.5cqw;
    top: 17.25cqw;
    width: 39.5cqw;
  }

  .daily-wellness-copy h2 {
    font-size: clamp(6.25cqw, 6.95cqw, 7.28cqw);
  }

  .daily-wellness-intro {
    max-width: 34.6cqw;
  }

  .daily-wellness-dynamic {
    margin-top: 3.35cqw;
    width: 31.2cqw;
    min-height: 4.8cqw;
    display: flex;
    align-items: center;
    padding: 1.05cqw 1.5cqw;
    border: 1px solid rgba(205, 190, 164, .72);
    background: rgba(248, 244, 236, .74);
  }

  .daily-wellness-dynamic span {
    font-family: var(--sans);
    font-size: .86cqw;
    font-weight: 800;
    line-height: 1.45;
    letter-spacing: .34em;
    text-transform: uppercase;
    color: rgba(76, 88, 62, .92);
  }

  .daily-wellness-cards {
    position: absolute;
    left: 7.45cqw;
    top: 72.05cqw;
    z-index: 5;
    display: grid;
    grid-template-columns: repeat(2, 18.95cqw);
    gap: 2.18cqw 2.1cqw;
  }

  .daily-wellness-card {
    position: relative;
    min-height: 24.2cqw;
    padding: 2.05cqw 1.9cqw 1.85cqw;
    border: 1px solid rgba(202, 188, 164, .82);
    background: rgba(248, 244, 236, .9);
    box-shadow: 0 16px 38px -32px rgba(38, 33, 27, .28);
    font-family: var(--sans);
    color: rgba(31, 33, 30, .88);
  }

  .daily-wellness-card-number {
    position: absolute;
    right: 1.65cqw;
    top: 1.55cqw;
    font-family: var(--sans);
    font-size: 1.05cqw;
    font-weight: 800;
    line-height: 1;
    color: rgba(64, 89, 52, .72);
  }

  .daily-wellness-card-icon {
    width: 4.4cqw;
    height: 4.4cqw;
    margin-bottom: 1.65cqw;
    color: #405934;
  }

  .daily-wellness-card-icon svg {
    width: 100%;
    height: 100%;
  }

  .daily-wellness-card p {
    font-size: 1.03cqw;
    line-height: 1.52;
  }

  .perfection-consistency-copy {
    left: 9.55cqw;
    top: 19.6cqw;
    width: 45.4cqw;
  }

  .perfection-consistency-copy h2 {
    font-size: clamp(6.2cqw, 6.95cqw, 7.28cqw);
  }

  .perfection-consistency-copy h2 em {
    font-style: italic;
    font-weight: 500;
  }

  .perfection-consistency-body {
    max-width: 35.8cqw;
    font-size: 1.42cqw;
  }

  .perfection-consistency-badge {
    left: 10.1cqw;
    bottom: 15.2cqw;
    width: 32.8cqw;
    font-size: 2.55cqw;
    text-align: left;
  }

  .lifestyle-foundation-page-number,
  .sleep-recovery-page-number,
  .stress-wellbeing-page-number,
  .daily-wellness-page-number,
  .perfection-consistency-page-number {
    position: absolute;
    z-index: 5;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: .95cqw;
    font-family: var(--sans);
    font-size: 1.34cqw;
    font-weight: 600;
    line-height: 1;
    color: rgba(20, 38, 14, .82);
  }

  .lifestyle-foundation-page-number,
  .stress-wellbeing-page-number {
    right: 7.25cqw;
    bottom: 4.15cqw;
  }

  .sleep-recovery-page-number,
  .daily-wellness-page-number,
  .perfection-consistency-page-number {
    left: 7.15cqw;
    bottom: 4.2cqw;
  }

  .lifestyle-foundation-page-number::after,
  .sleep-recovery-page-number::after,
  .stress-wellbeing-page-number::after,
  .daily-wellness-page-number::after,
  .perfection-consistency-page-number::after {
    content: "";
    width: 3.6cqw;
    height: 1px;
    background: rgba(20, 38, 14, .72);
  }

  @media (min-width: 821px) {
    .ebook-lifestyle-foundation-page,
    .ebook-sleep-recovery-page,
    .ebook-stress-wellbeing-page,
    .ebook-daily-wellness-page,
    .ebook-perfection-consistency-page {
      --lifestyle-stage-x: clamp(48px, 7vw, 120px);
      --lifestyle-stage-y: clamp(18px, 3svh, 34px);
      min-height: 100svh;
      padding: var(--lifestyle-stage-y) var(--lifestyle-stage-x);
      place-items: center;
    }

    .ebook-lifestyle-foundation-sheet,
    .ebook-sleep-recovery-sheet,
    .ebook-stress-wellbeing-sheet,
    .ebook-daily-wellness-sheet {
      width: min(
        calc(100vw - (var(--lifestyle-stage-x) * 2)),
        calc((100svh - (var(--lifestyle-stage-y) * 2)) * .7064343),
        1055px
      );
      min-height: 0;
      aspect-ratio: 1054 / 1492;
      box-shadow: 0 24px 70px rgba(38, 33, 27, .18);
    }

    .ebook-perfection-consistency-sheet {
      width: min(
        calc(100vw - (var(--lifestyle-stage-x) * 2)),
        calc((100svh - (var(--lifestyle-stage-y) * 2)) * .75),
        1086px
      );
      min-height: 0;
      aspect-ratio: 1086 / 1448;
      box-shadow: 0 24px 70px rgba(38, 33, 27, .18);
    }
  }

  .ebook-recipe-section-page,
  .ebook-recipe-intro-page,
  .ebook-breakfasts-page,
  .ebook-breakfast-nutrition-page {
    isolation: isolate;
    display: grid;
    place-items: stretch;
    background: #E9E1D3;
    color: #102A12;
  }

  .ebook-recipe-section-sheet,
  .ebook-recipe-intro-sheet,
  .ebook-breakfasts-sheet,
  .ebook-breakfast-nutrition-sheet {
    container-type: inline-size;
    position: relative;
    width: 100%;
    min-height: 100svh;
    overflow: hidden;
    isolation: isolate;
    background: #F7F3EC;
  }

  .recipe-section-photo,
  .recipe-intro-photo,
  .breakfasts-photo,
  .breakfast-nutrition-photo {
    position: absolute;
    inset: 0;
    z-index: 0;
    object-fit: cover;
    object-position: center;
    filter: saturate(.98) contrast(.99) brightness(1.01);
  }

  .recipe-section-paper-wash,
  .recipe-intro-paper-wash,
  .breakfasts-paper-wash,
  .breakfast-nutrition-paper-wash {
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    background: linear-gradient(90deg, rgba(247,243,236,.2) 0%, rgba(247,243,236,.04) 58%, rgba(247,243,236,0) 100%);
  }

  .recipe-section-top-mark,
  .recipe-intro-top-mark,
  .breakfasts-top-mark,
  .breakfast-nutrition-top-mark {
    position: absolute;
    left: 4.55cqw;
    top: 3.6cqw;
    z-index: 5;
    width: 2.55cqw;
    height: 3.85cqw;
    color: #314C2E;
  }

  .recipe-section-topline,
  .recipe-intro-topline,
  .breakfasts-topline,
  .breakfast-nutrition-topline {
    position: absolute;
    left: 8.55cqw;
    top: 4.88cqw;
    z-index: 5;
    font-family: var(--sans);
    font-size: .95cqw;
    font-weight: 800;
    line-height: 1;
    letter-spacing: .34em;
    text-transform: uppercase;
    color: #172514;
    white-space: nowrap;
  }

  .recipe-section-topline span,
  .recipe-intro-topline span,
  .breakfasts-topline span,
  .breakfast-nutrition-topline span {
    display: inline-block;
    margin: 0 1.55cqw;
  }

  .recipe-section-top-rule,
  .recipe-intro-top-rule,
  .breakfasts-top-rule,
  .breakfast-nutrition-top-rule {
    position: absolute;
    left: 8.55cqw;
    right: 5.5cqw;
    top: 7.25cqw;
    z-index: 5;
    height: 1px;
    background: rgba(71, 82, 62, .34);
  }

  .recipe-section-content,
  .recipe-intro-copy,
  .breakfasts-copy,
  .breakfast-nutrition-copy {
    position: absolute;
    z-index: 5;
  }

  .recipe-section-content {
    left: 8.05cqw;
    top: 17.2cqw;
    width: 38.5cqw;
  }

  .recipe-section-label,
  .recipe-intro-kicker,
  .breakfasts-kicker,
  .breakfast-nutrition-kicker {
    font-family: var(--sans);
    font-weight: 800;
    line-height: 1;
    letter-spacing: .46em;
    text-transform: uppercase;
    color: #17371A;
  }

  .recipe-section-label {
    font-size: 1.18cqw;
  }

  .recipe-section-number {
    margin-top: 1.45cqw;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 16.7cqw;
    font-weight: 400;
    line-height: .82;
    letter-spacing: 0;
    color: #07381E;
  }

  .recipe-section-content h2,
  .recipe-intro-copy h2,
  .breakfasts-copy h2,
  .breakfast-nutrition-copy h2 {
    margin: 0;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-weight: 500;
    line-height: 1.05;
    letter-spacing: 0;
    color: #07381E;
  }

  .recipe-section-content h2 {
    margin-top: 4.25cqw;
    font-size: clamp(5.7cqw, 6.25cqw, 6.65cqw);
  }

  .recipe-section-divider,
  .recipe-intro-divider,
  .breakfasts-divider,
  .breakfast-nutrition-table-divider {
    display: flex;
    align-items: center;
    color: #A77141;
  }

  .recipe-section-divider {
    margin-top: 3.9cqw;
    gap: 1.6cqw;
  }

  .recipe-intro-divider,
  .breakfasts-divider,
  .breakfast-nutrition-table-divider {
    margin-top: 3.65cqw;
    gap: 1.55cqw;
  }

  .recipe-section-divider i,
  .recipe-intro-divider i,
  .breakfasts-divider i,
  .breakfast-nutrition-table-divider i {
    display: block;
    width: 7.35cqw;
    height: 1px;
    background: rgba(167, 113, 65, .72);
  }

  .recipe-section-divider .section-divider-leaf,
  .recipe-intro-divider .section-divider-leaf,
  .breakfasts-divider .section-divider-leaf,
  .breakfast-nutrition-table-divider .section-divider-leaf {
    width: 3.1cqw;
    height: 1.42cqw;
  }

  .recipe-section-content p,
  .recipe-intro-copy p,
  .breakfasts-copy p,
  .breakfast-nutrition-copy p {
    font-family: var(--sans);
    font-weight: 500;
    line-height: 1.65;
    color: rgba(31, 33, 30, .88);
  }

  .recipe-section-content p {
    max-width: 30.2cqw;
    margin: 4.5cqw 0 0;
    font-size: 1.24cqw;
  }

  .recipe-section-badge {
    position: absolute;
    left: 7.95cqw;
    bottom: 6.45cqw;
    z-index: 5;
    display: grid;
    grid-template-columns: 4.7cqw 1fr;
    align-items: center;
    gap: 1.5cqw;
  }

  .recipe-section-badge-icon {
    display: grid;
    place-items: center;
    width: 4.7cqw;
    height: 4.7cqw;
    border-radius: 50%;
    background: rgba(222, 218, 207, .76);
    color: #405934;
  }

  .recipe-section-badge-icon svg {
    width: 2.1cqw;
    height: 2.9cqw;
  }

  .recipe-section-badge p {
    margin: 0;
    font-family: var(--sans);
    font-size: 1.08cqw;
    font-weight: 800;
    line-height: 1.55;
    letter-spacing: .34em;
    text-transform: uppercase;
    color: #405934;
  }

  .recipe-intro-copy {
    left: 8.35cqw;
    top: 15.45cqw;
    width: 36.8cqw;
  }

  .recipe-intro-kicker,
  .breakfasts-kicker,
  .breakfast-nutrition-kicker {
    font-size: 1.08cqw;
  }

  .recipe-intro-copy h2 {
    margin-top: 2.85cqw;
    font-size: clamp(5.35cqw, 6.12cqw, 6.45cqw);
  }

  .recipe-intro-copy p {
    max-width: 31.8cqw;
    margin: 3.15cqw 0 0;
    font-size: 1.28cqw;
  }

  .recipe-intro-dynamic {
    position: absolute;
    left: 8.35cqw;
    top: 68.9cqw;
    z-index: 5;
    display: grid;
    grid-template-columns: 5.25cqw 1fr;
    align-items: center;
    gap: 1.58cqw;
    width: 34.5cqw;
    min-height: 9.7cqw;
    padding: 1.8cqw 2.0cqw;
    border-radius: .7cqw;
    background: rgba(222, 218, 207, .8);
    box-shadow: 0 16px 42px -34px rgba(38, 33, 27, .28);
  }

  .recipe-intro-dynamic-icon {
    display: grid;
    place-items: center;
    width: 5.25cqw;
    height: 5.25cqw;
    border-radius: 50%;
    background: rgba(195, 205, 178, .42);
    color: #405934;
  }

  .recipe-intro-dynamic-icon svg {
    width: 2.35cqw;
    height: 3.15cqw;
  }

  .recipe-intro-dynamic h3 {
    margin: 0;
    font-family: var(--sans);
    font-size: 1.0cqw;
    font-weight: 800;
    line-height: 1;
    letter-spacing: .32em;
    text-transform: uppercase;
    color: #17371A;
  }

  .recipe-intro-dynamic p {
    margin: 1.05cqw 0 0;
    font-family: var(--sans);
    font-size: 1.08cqw;
    font-weight: 500;
    line-height: 1.45;
    color: rgba(31, 33, 30, .88);
  }

  .recipe-intro-features {
    position: absolute;
    left: 8.1cqw;
    bottom: 12.15cqw;
    z-index: 5;
    display: grid;
    grid-template-columns: repeat(4, 11.1cqw);
    gap: 1.5cqw;
    align-items: start;
  }

  .recipe-intro-feature {
    min-height: 10.6cqw;
    display: grid;
    justify-items: center;
    align-content: start;
    gap: 1.15cqw;
    text-align: center;
    border-right: 1px solid rgba(102, 109, 84, .35);
  }

  .recipe-intro-feature:last-child {
    border-right: 0;
  }

  .recipe-intro-feature-icon {
    display: grid;
    place-items: center;
    width: 5.2cqw;
    height: 5.2cqw;
    border-radius: 50%;
    background: rgba(222, 218, 207, .78);
    color: #17371A;
  }

  .recipe-intro-feature-icon svg {
    width: 3.05cqw;
    height: 3.05cqw;
  }

  .recipe-intro-feature span,
  .recipe-intro-footer span {
    font-family: var(--sans);
    font-size: .9cqw;
    font-weight: 800;
    line-height: 1.55;
    letter-spacing: .24em;
    text-transform: uppercase;
    color: #17371A;
  }

  .recipe-intro-footer {
    position: absolute;
    left: 8.25cqw;
    bottom: 5.55cqw;
    z-index: 5;
    display: flex;
    align-items: center;
    gap: 1.45cqw;
  }

  .recipe-intro-footer svg {
    width: 2cqw;
    height: 2.9cqw;
    color: #405934;
  }

  .breakfasts-copy {
    left: 7.65cqw;
    top: 14.2cqw;
    width: 34.2cqw;
  }

  .breakfasts-copy h2 {
    margin-top: 3.05cqw;
    font-size: clamp(7.0cqw, 7.7cqw, 8.05cqw);
  }

  .breakfasts-lead {
    margin: 4.75cqw 0 0;
    font-family: "Cormorant Garamond", Georgia, serif !important;
    font-size: 2.35cqw !important;
    font-style: italic;
    line-height: 1.2 !important;
    color: #17371A !important;
  }

  .breakfasts-intro {
    max-width: 31.5cqw;
    margin: 2.1cqw 0 0;
    font-size: 1.28cqw;
  }

  .breakfasts-meta,
  .breakfast-nutrition-meta {
    position: absolute;
    z-index: 5;
    display: grid;
    align-items: start;
  }

  .breakfasts-meta {
    left: 7.9cqw;
    top: 67.85cqw;
    grid-template-columns: repeat(3, 12.8cqw);
    gap: 1.95cqw;
  }

  .breakfasts-meta-item,
  .breakfast-nutrition-meta-item {
    display: grid;
    justify-items: center;
    text-align: center;
    font-family: var(--sans);
    color: #17371A;
  }

  .breakfasts-meta-item svg,
  .breakfast-nutrition-meta-item svg {
    width: 4.6cqw;
    height: 4.6cqw;
    margin-bottom: 2.0cqw;
    opacity: 0;
  }

  .breakfasts-meta-item span,
  .breakfast-nutrition-meta-item span {
    font-size: .78cqw;
    font-weight: 800;
    line-height: 1.35;
    letter-spacing: .22em;
    text-transform: uppercase;
  }

  .breakfasts-meta-item strong,
  .breakfast-nutrition-meta-item strong {
    margin-top: .8cqw;
    font-size: 1.1cqw;
    font-weight: 500;
    line-height: 1;
    color: rgba(31, 33, 30, .88);
  }

  .breakfasts-ingredients,
  .breakfasts-method,
  .breakfasts-highlights {
    position: absolute;
    z-index: 5;
    font-family: var(--sans);
    color: rgba(31, 33, 30, .88);
  }

  .breakfasts-ingredients {
    left: 7.65cqw;
    top: 84.6cqw;
    width: 26.8cqw;
  }

  .breakfasts-method {
    left: 37.0cqw;
    top: 84.6cqw;
    width: 25.4cqw;
  }

  .breakfasts-highlights {
    right: 4.25cqw;
    top: 83.55cqw;
    width: 27.3cqw;
  }

  .breakfasts-ingredients h3,
  .breakfasts-method h3,
  .breakfasts-highlights h3,
  .breakfast-nutrition-table h3 {
    margin: 0;
    font-family: var(--sans);
    font-size: 1.18cqw;
    font-weight: 800;
    line-height: 1;
    letter-spacing: .36em;
    text-transform: uppercase;
    color: #17371A;
  }

  .breakfasts-ingredients > i,
  .breakfasts-method > i,
  .breakfasts-highlights > i {
    display: block;
    width: 2.8cqw;
    height: 1px;
    margin-top: 1.65cqw;
    background: rgba(102, 109, 84, .72);
  }

  .breakfasts-ingredients ul {
    margin: 2.6cqw 0 0;
    padding-left: 1.45cqw;
  }

  .breakfasts-ingredients li {
    margin-bottom: 1.28cqw;
    font-size: .98cqw;
    font-weight: 500;
    line-height: 1.45;
  }

  .breakfasts-make-yours {
    display: grid;
    grid-template-columns: 3.6cqw 1fr;
    align-items: center;
    gap: 1.55cqw;
    margin-top: 4.0cqw;
    min-height: 9.2cqw;
    padding: 1.55cqw 1.9cqw;
    border-radius: .65cqw;
    background: rgba(222, 218, 207, .78);
  }

  .breakfasts-make-yours svg {
    width: 2.1cqw;
    height: 2.9cqw;
    color: #405934;
  }

  .breakfasts-make-yours h4,
  .breakfasts-highlight h4 {
    margin: 0;
    font-family: var(--sans);
    font-size: .9cqw;
    font-weight: 800;
    line-height: 1.35;
    letter-spacing: .24em;
    text-transform: uppercase;
    color: #17371A;
  }

  .breakfasts-make-yours p,
  .breakfasts-highlight p {
    margin: .85cqw 0 0;
    font-size: .93cqw;
    font-weight: 500;
    line-height: 1.48;
    color: rgba(31, 33, 30, .86);
  }

  .breakfasts-method-step {
    display: grid;
    grid-template-columns: 3.55cqw 1fr;
    gap: 1.75cqw;
    margin-top: 2.35cqw;
  }

  .breakfasts-method-step span {
    display: grid;
    place-items: center;
    width: 2.45cqw;
    height: 2.45cqw;
    border-radius: 50%;
    background: rgba(222, 218, 207, .9);
    color: #17371A;
    font-size: .92cqw;
    font-weight: 700;
  }

  .breakfasts-method-step p {
    margin: 0;
    font-size: .98cqw;
    font-weight: 500;
    line-height: 1.62;
  }

  .breakfasts-highlight {
    display: grid;
    grid-template-columns: 5.9cqw 1fr;
    align-items: center;
    gap: 1.45cqw;
    min-height: 13.0cqw;
    border-bottom: 1px solid rgba(196, 184, 166, .62);
  }

  .breakfasts-highlight:last-child {
    border-bottom: 0;
  }

  .breakfasts-highlight-icon {
    display: grid;
    place-items: center;
    width: 5.1cqw;
    height: 5.1cqw;
    border-radius: 50%;
    background: rgba(222, 218, 207, .84);
    color: #17371A;
  }

  .breakfasts-highlight-icon svg {
    width: 3.05cqw;
    height: 3.05cqw;
  }

  .breakfast-nutrition-copy {
    left: 8.55cqw;
    top: 17.8cqw;
    width: 36.5cqw;
  }

  .breakfast-nutrition-kicker-rule {
    display: flex;
    align-items: center;
    gap: 1.05cqw;
    margin-top: 2.45cqw;
    color: #405934;
  }

  .breakfast-nutrition-kicker-rule .section-divider-leaf {
    width: 2.6cqw;
    height: 1.25cqw;
  }

  .breakfast-nutrition-kicker-rule i {
    display: block;
    width: 4.2cqw;
    height: 1px;
    background: rgba(102, 109, 84, .6);
  }

  .breakfast-nutrition-copy h2 {
    margin-top: 3.65cqw;
    font-size: clamp(5.5cqw, 6.1cqw, 6.42cqw);
  }

  .breakfast-nutrition-copy p {
    max-width: 31cqw;
    margin: 3.65cqw 0 0;
    font-size: 1.25cqw;
  }

  .breakfast-nutrition-meta {
    left: 8.35cqw;
    top: 65.5cqw;
    grid-template-columns: repeat(3, 12.2cqw);
    gap: 2.2cqw;
  }

  .breakfast-protein-card {
    position: absolute;
    left: 8.5cqw;
    top: 88.2cqw;
    z-index: 5;
    width: 18.4cqw;
    min-height: 44.6cqw;
    display: grid;
    justify-items: center;
    align-content: center;
    padding: 3.2cqw 2.4cqw;
    border-radius: .65cqw;
    background: rgba(222, 218, 207, .62);
    text-align: center;
    font-family: var(--sans);
  }

  .breakfast-protein-icon {
    display: grid;
    place-items: center;
    width: 8.8cqw;
    height: 8.8cqw;
    border-radius: 50%;
    background: rgba(213, 216, 198, .8);
    color: #17371A;
  }

  .breakfast-protein-icon svg {
    width: 4.4cqw;
    height: 4.4cqw;
  }

  .breakfast-protein-card h3 {
    margin: 3.5cqw 0 0;
    font-family: var(--sans);
    font-size: 1.08cqw;
    font-weight: 800;
    line-height: 1;
    letter-spacing: .34em;
    text-transform: uppercase;
    color: #17371A;
  }

  .breakfast-protein-card p {
    margin: 3.15cqw 0 0;
    font-size: 1.04cqw;
    font-weight: 500;
    line-height: 1.72;
    color: rgba(31, 33, 30, .82);
  }

  .breakfast-nutrition-table {
    position: absolute;
    right: 8.25cqw;
    top: 83.6cqw;
    z-index: 5;
    width: 56.0cqw;
    font-family: var(--sans);
    color: rgba(31, 33, 30, .88);
  }

  .breakfast-nutrition-table h3 {
    text-align: center;
  }

  .breakfast-nutrition-table-divider {
    justify-content: center;
    margin-top: 1.55cqw;
  }

  .breakfast-nutrition-table-divider i {
    width: 3.6cqw;
  }

  .breakfast-nutrition-table-head,
  .breakfast-nutrition-row,
  .breakfast-nutrition-total {
    display: grid;
    grid-template-columns: 1fr 15.2cqw;
    align-items: center;
  }

  .breakfast-nutrition-table-head {
    margin-top: 4.2cqw;
    border-bottom: 1px solid rgba(196, 184, 166, .72);
    padding: 0 0 1.35cqw;
    font-size: .78cqw;
    font-weight: 800;
    line-height: 1;
    letter-spacing: .16em;
    text-transform: uppercase;
    color: #17371A;
  }

  .breakfast-nutrition-table-head span:last-child,
  .breakfast-nutrition-row strong,
  .breakfast-nutrition-total strong {
    text-align: center;
  }

  .breakfast-nutrition-row {
    min-height: 7.0cqw;
    border-bottom: 1px solid rgba(196, 184, 166, .55);
    padding-left: 10.6cqw;
    font-size: 1.18cqw;
    font-weight: 500;
  }

  .breakfast-nutrition-row strong,
  .breakfast-nutrition-total strong {
    font-weight: 600;
  }

  .breakfast-nutrition-total {
    min-height: 4.55cqw;
    margin-top: 1.65cqw;
    border-radius: .65cqw;
    background: rgba(222, 218, 207, .62);
    padding: 0 3.0cqw 0 10.6cqw;
    font-size: 1.05cqw;
    font-weight: 800;
    line-height: 1;
    letter-spacing: .16em;
    text-transform: uppercase;
    color: #17371A;
  }

  .recipe-section-page-number,
  .recipe-intro-page-number,
  .breakfasts-page-number,
  .breakfast-nutrition-page-number {
    position: absolute;
    z-index: 5;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: .95cqw;
    font-family: var(--sans);
    font-size: 1.22cqw;
    font-weight: 600;
    line-height: 1;
    color: rgba(20, 38, 14, .82);
  }

  .recipe-section-page-number {
    right: 5.75cqw;
    bottom: 4.2cqw;
  }

  .recipe-intro-page-number,
  .breakfasts-page-number {
    left: 3.2cqw;
    bottom: 3.7cqw;
  }

  .breakfast-nutrition-page-number {
    right: 7.0cqw;
    bottom: 4.25cqw;
  }

  .recipe-section-page-number::after,
  .recipe-intro-page-number::after,
  .breakfasts-page-number::after,
  .breakfast-nutrition-page-number::after {
    content: "";
    width: 3.2cqw;
    height: 1px;
    background: rgba(20, 38, 14, .72);
  }

  @media (min-width: 821px) {
    .ebook-recipe-section-page,
    .ebook-recipe-intro-page,
    .ebook-breakfasts-page,
    .ebook-breakfast-nutrition-page {
      --recipe-stage-x: clamp(48px, 7vw, 120px);
      --recipe-stage-y: clamp(18px, 3svh, 34px);
      min-height: 100svh;
      padding: var(--recipe-stage-y) var(--recipe-stage-x);
      place-items: center;
    }

    .ebook-recipe-section-sheet,
    .ebook-recipe-intro-sheet {
      width: min(
        calc(100vw - (var(--recipe-stage-x) * 2)),
        calc((100svh - (var(--recipe-stage-y) * 2)) * .75),
        1086px
      );
      min-height: 0;
      aspect-ratio: 1086 / 1448;
      box-shadow: 0 24px 70px rgba(38, 33, 27, .18);
    }

    .ebook-breakfasts-sheet {
      width: min(
        calc(100vw - (var(--recipe-stage-x) * 2)),
        calc((100svh - (var(--recipe-stage-y) * 2)) * .6666667),
        1024px
      );
      min-height: 0;
      aspect-ratio: 1024 / 1536;
      box-shadow: 0 24px 70px rgba(38, 33, 27, .18);
    }

    .ebook-breakfast-nutrition-sheet {
      width: min(
        calc(100vw - (var(--recipe-stage-x) * 2)),
        calc((100svh - (var(--recipe-stage-y) * 2)) * .7064343),
        1055px
      );
      min-height: 0;
      aspect-ratio: 1054 / 1492;
      box-shadow: 0 24px 70px rgba(38, 33, 27, .18);
    }
  }

  .ebook-breakfast-benefits-page,
  .ebook-breakfast-ingredients-method-page,
  .ebook-breakfast-method-cooking-page {
    isolation: isolate;
    display: grid;
    place-items: stretch;
    background: #E9E1D3;
    color: #102A12;
  }

  .ebook-breakfast-benefits-sheet,
  .ebook-breakfast-ingredients-method-sheet,
  .ebook-breakfast-method-cooking-sheet {
    container-type: inline-size;
    position: relative;
    width: 100%;
    min-height: 100svh;
    overflow: hidden;
    isolation: isolate;
    background: #F7F3EC;
  }

  .breakfast-benefits-photo,
  .breakfast-ingredients-method-photo,
  .breakfast-method-cooking-photo {
    position: absolute;
    inset: 0;
    z-index: 0;
    object-fit: cover;
    object-position: center;
    filter: saturate(.98) contrast(.99) brightness(1.01);
  }

  .breakfast-benefits-paper-wash,
  .breakfast-ingredients-method-paper-wash,
  .breakfast-method-cooking-paper-wash {
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    background: linear-gradient(90deg, rgba(247,243,236,.16) 0%, rgba(247,243,236,.04) 58%, rgba(247,243,236,0) 100%);
  }

  .breakfast-benefits-top-mark,
  .breakfast-method-cooking-top-mark {
    position: absolute;
    left: 4.55cqw;
    top: 3.6cqw;
    z-index: 5;
    width: 2.55cqw;
    height: 3.85cqw;
    color: #314C2E;
  }

  .breakfast-benefits-topline,
  .breakfast-method-cooking-topline {
    position: absolute;
    left: 8.55cqw;
    top: 4.88cqw;
    z-index: 5;
    font-family: var(--sans);
    font-size: .95cqw;
    font-weight: 800;
    line-height: 1;
    letter-spacing: .34em;
    text-transform: uppercase;
    color: #172514;
    white-space: nowrap;
  }

  .breakfast-benefits-topline span,
  .breakfast-method-cooking-topline span {
    display: inline-block;
    margin: 0 1.55cqw;
  }

  .breakfast-benefits-top-rule,
  .breakfast-method-cooking-top-rule {
    position: absolute;
    left: 8.55cqw;
    right: 5.5cqw;
    top: 7.25cqw;
    z-index: 5;
    height: 1px;
    background: rgba(71, 82, 62, .34);
  }

  .breakfast-benefits-copy,
  .breakfast-method-cooking-copy {
    position: absolute;
    z-index: 5;
    font-family: var(--sans);
  }

  .breakfast-benefits-copy {
    left: 8.6cqw;
    top: 18.0cqw;
    width: 39.5cqw;
  }

  .breakfast-benefits-kicker,
  .breakfast-method-cooking-kicker {
    font-family: var(--sans);
    font-size: 1.08cqw;
    font-weight: 800;
    line-height: 1;
    letter-spacing: .46em;
    text-transform: uppercase;
    color: #17371A;
  }

  .breakfast-benefits-kicker-rule {
    display: flex;
    align-items: center;
    gap: 1.05cqw;
    margin-top: 3.25cqw;
    color: #405934;
  }

  .breakfast-benefits-kicker-rule .section-divider-leaf {
    width: 2.6cqw;
    height: 1.25cqw;
  }

  .breakfast-benefits-kicker-rule i {
    display: block;
    width: 4.2cqw;
    height: 1px;
    background: rgba(102, 109, 84, .6);
  }

  .breakfast-benefits-copy h2,
  .breakfast-method-cooking-copy h2,
  .breakfast-ingredients-copy h2,
  .breakfast-method-spread-copy h2 {
    margin: 0;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-weight: 500;
    line-height: 1.05;
    letter-spacing: 0;
    color: #07381E;
  }

  .breakfast-benefits-copy h2 {
    margin-top: 4.0cqw;
    font-size: clamp(4.6cqw, 5.32cqw, 5.65cqw);
  }

  .breakfast-benefits-copy p {
    max-width: 31.5cqw;
    margin: 3.35cqw 0 0;
    font-family: var(--sans);
    font-size: 1.25cqw;
    font-weight: 500;
    line-height: 1.65;
    color: rgba(31, 33, 30, .88);
  }

  .breakfast-benefits-cards {
    position: absolute;
    left: 8.65cqw;
    right: 8.65cqw;
    top: 69.0cqw;
    z-index: 5;
    display: grid;
    grid-template-columns: repeat(3, 24.0cqw);
    gap: 2.35cqw 5.2cqw;
  }

  .breakfast-benefit-card {
    display: grid;
    justify-items: center;
    align-content: center;
    min-height: 23.8cqw;
    padding: 2.4cqw 2.1cqw 2.1cqw;
    text-align: center;
    font-family: var(--sans);
  }

  .breakfast-benefit-icon {
    display: grid;
    place-items: center;
    width: 5.2cqw;
    height: 5.2cqw;
    border-radius: 50%;
    color: #17371A;
  }

  .breakfast-benefit-icon svg {
    width: 3.05cqw;
    height: 3.05cqw;
  }

  .breakfast-benefit-card h3,
  .breakfast-benefits-footer h3 {
    margin: 2.3cqw 0 0;
    font-family: var(--sans);
    font-size: 1.0cqw;
    font-weight: 800;
    line-height: 1.35;
    letter-spacing: .32em;
    text-transform: uppercase;
    color: #17371A;
  }

  .breakfast-benefit-card p,
  .breakfast-benefits-footer p {
    margin: 1.45cqw 0 0;
    font-family: var(--sans);
    font-size: 1.02cqw;
    font-weight: 500;
    line-height: 1.55;
    color: rgba(31, 33, 30, .84);
  }

  .breakfast-benefit-card > i {
    display: block;
    width: 3.25cqw;
    height: 1px;
    margin-top: 2.2cqw;
    background: rgba(102, 109, 84, .5);
  }

  .breakfast-benefits-footer {
    position: absolute;
    left: 8.65cqw;
    right: 8.65cqw;
    bottom: 5.55cqw;
    z-index: 5;
    display: grid;
    grid-template-columns: 5.2cqw 1fr 8.0cqw;
    align-items: center;
    gap: 1.35cqw;
    min-height: 7.2cqw;
    padding: 1.2cqw 3.0cqw 1.2cqw 1.25cqw;
    font-family: var(--sans);
  }

  .breakfast-benefits-footer-icon {
    display: grid;
    place-items: center;
    width: 5.2cqw;
    height: 5.2cqw;
    border-radius: 50%;
    background: #17451E;
    color: #F6F1E7;
  }

  .breakfast-benefits-footer-icon svg,
  .breakfast-benefits-footer > svg {
    width: 3.05cqw;
    height: 3.05cqw;
  }

  .breakfast-benefits-footer h3 {
    margin-top: 0;
  }

  .breakfast-benefits-footer p {
    margin-top: .65cqw;
  }

  .breakfast-benefits-footer > svg {
    justify-self: end;
    color: #17451E;
  }

  .breakfast-ingredients-method-left-mark,
  .breakfast-ingredients-method-right-mark {
    position: absolute;
    top: 3.05cqw;
    z-index: 5;
    width: 2.2cqw;
    height: 3.3cqw;
    color: #314C2E;
  }

  .breakfast-ingredients-method-left-mark {
    left: 6.55cqw;
  }

  .breakfast-ingredients-method-right-mark {
    left: 56.5cqw;
  }

  .breakfast-ingredients-method-left-topline,
  .breakfast-ingredients-method-right-topline {
    position: absolute;
    top: 4.22cqw;
    z-index: 5;
    font-family: var(--sans);
    font-size: .7cqw;
    font-weight: 800;
    line-height: 1;
    letter-spacing: .2em;
    text-transform: uppercase;
    color: #172514;
    white-space: nowrap;
  }

  .breakfast-ingredients-method-left-topline {
    left: 12.8cqw;
  }

  .breakfast-ingredients-method-right-topline {
    left: 62.2cqw;
  }

  .breakfast-ingredients-method-left-topline span,
  .breakfast-ingredients-method-right-topline span {
    display: inline-block;
    margin: 0 1.1cqw;
  }

  .breakfast-ingredients-copy,
  .breakfast-method-spread-copy {
    position: absolute;
    z-index: 5;
    font-family: var(--sans);
  }

  .breakfast-ingredients-copy {
    left: 6.7cqw;
    top: 16.7cqw;
    width: 38cqw;
  }

  .breakfast-method-spread-copy {
    left: 56.5cqw;
    top: 16.7cqw;
    width: 35cqw;
  }

  .breakfast-ingredients-recipe-name,
  .breakfast-method-spread-recipe-name {
    font-family: var(--sans);
    font-size: .95cqw;
    font-weight: 800;
    line-height: 1;
    letter-spacing: .38em;
    text-transform: uppercase;
    color: #17371A;
  }

  .breakfast-ingredients-copy h2,
  .breakfast-method-spread-copy h2 {
    margin-top: 3.0cqw;
    font-size: clamp(4.6cqw, 5.15cqw, 5.55cqw);
  }

  .breakfast-ingredients-divider,
  .breakfast-method-spread-divider {
    display: flex;
    align-items: center;
    gap: 1.2cqw;
    margin-top: 3.2cqw;
    color: #A77141;
  }

  .breakfast-ingredients-divider i,
  .breakfast-method-spread-divider i {
    display: block;
    width: 5.0cqw;
    height: 1px;
    background: rgba(167, 113, 65, .72);
  }

  .breakfast-ingredients-divider .section-divider-leaf,
  .breakfast-method-spread-divider .section-divider-leaf {
    width: 2.55cqw;
    height: 1.2cqw;
  }

  .breakfast-ingredient-labels {
    position: absolute;
    left: 6.8cqw;
    top: 52.1cqw;
    z-index: 5;
    display: grid;
    grid-template-columns: repeat(2, 17.2cqw);
    gap: 13.15cqw 1.95cqw;
    font-family: var(--sans);
    text-align: center;
  }

  .breakfast-ingredient-label {
    min-height: 3.7cqw;
  }

  .breakfast-ingredient-label span,
  .breakfast-ingredient-label strong {
    display: block;
    font-weight: 800;
    line-height: 1.35;
    letter-spacing: .22em;
    text-transform: uppercase;
    color: #17371A;
  }

  .breakfast-ingredient-label span {
    font-size: .78cqw;
  }

  .breakfast-ingredient-label strong {
    margin-top: .55cqw;
    font-size: .78cqw;
  }

  .breakfast-ingredients-tip,
  .breakfast-method-spread-tip {
    position: absolute;
    z-index: 5;
    display: grid;
    grid-template-columns: 5.0cqw 1fr;
    align-items: center;
    gap: 1.45cqw;
    min-height: 9.25cqw;
    font-family: var(--sans);
  }

  .breakfast-ingredients-tip {
    left: 6.75cqw;
    bottom: 7.4cqw;
    width: 38.6cqw;
  }

  .breakfast-method-spread-tip {
    left: 56.65cqw;
    bottom: 7.4cqw;
    width: 38.5cqw;
  }

  .breakfast-ingredients-tip-icon,
  .breakfast-method-spread-tip-icon {
    display: grid;
    place-items: center;
    width: 5.0cqw;
    height: 5.0cqw;
    border-radius: 50%;
    color: #17371A;
  }

  .breakfast-ingredients-tip-icon svg,
  .breakfast-method-spread-tip-icon svg {
    width: 3.05cqw;
    height: 3.05cqw;
  }

  .breakfast-ingredients-tip h3,
  .breakfast-method-spread-tip h3 {
    margin: 0;
    font-family: var(--sans);
    font-size: .9cqw;
    font-weight: 800;
    line-height: 1.35;
    letter-spacing: .25em;
    text-transform: uppercase;
    color: #17371A;
  }

  .breakfast-ingredients-tip p,
  .breakfast-method-spread-tip p {
    margin: .85cqw 0 0;
    font-family: var(--sans);
    font-size: .95cqw;
    font-weight: 500;
    line-height: 1.52;
    color: rgba(31, 33, 30, .86);
  }

  .breakfast-method-spread-steps {
    position: absolute;
    left: 79.2cqw;
    top: 38.1cqw;
    z-index: 5;
    width: 15.4cqw;
    font-family: var(--sans);
  }

  .breakfast-method-spread-step {
    min-height: 20.1cqw;
    padding-top: 1.25cqw;
  }

  .breakfast-method-spread-step span {
    display: grid;
    place-items: center;
    width: 2.35cqw;
    height: 2.35cqw;
    border-radius: 50%;
    background: rgba(102, 109, 84, .82);
    color: #F6F1E7;
    font-size: .9cqw;
    font-weight: 800;
  }

  .breakfast-method-spread-step p {
    margin: 1.45cqw 0 0;
    font-size: 1.08cqw;
    font-weight: 500;
    line-height: 1.62;
    color: rgba(31, 33, 30, .88);
  }

  .breakfast-method-cooking-copy {
    left: 8.15cqw;
    top: 14.25cqw;
    width: 36.2cqw;
  }

  .breakfast-method-cooking-copy h2 {
    margin-top: 3.0cqw;
    font-size: clamp(5.15cqw, 5.82cqw, 6.2cqw);
  }

  .breakfast-method-cooking-label {
    position: absolute;
    left: 45.1cqw;
    top: 51.9cqw;
    z-index: 5;
    display: grid;
    justify-items: center;
    gap: 1.45cqw;
    font-family: var(--sans);
    font-size: 1.28cqw;
    font-weight: 800;
    line-height: 1;
    letter-spacing: .46em;
    text-transform: uppercase;
    color: #17371A;
  }

  .breakfast-method-cooking-label div {
    display: flex;
    align-items: center;
    gap: 1.0cqw;
    color: #A77141;
  }

  .breakfast-method-cooking-label i {
    display: block;
    width: 3.85cqw;
    height: 1px;
    background: rgba(167, 113, 65, .72);
  }

  .breakfast-method-cooking-label .section-divider-leaf {
    width: 2.35cqw;
    height: 1.1cqw;
  }

  .breakfast-method-cooking-steps {
    position: absolute;
    left: 8.25cqw;
    top: 59.0cqw;
    z-index: 5;
    width: 83.6cqw;
    font-family: var(--sans);
  }

  .breakfast-method-cooking-step {
    display: grid;
    grid-template-columns: 31.5cqw 1fr;
    align-items: center;
    min-height: 14.5cqw;
    border-bottom: 1px solid rgba(196, 184, 166, .55);
  }

  .breakfast-method-cooking-step-title {
    display: grid;
    grid-template-columns: 5.7cqw 1fr;
    align-items: center;
    gap: 1.75cqw;
  }

  .breakfast-method-cooking-step-title span {
    justify-self: end;
    font-size: 1.0cqw;
    font-weight: 800;
    line-height: 1;
    letter-spacing: .12em;
    color: #17371A;
  }

  .breakfast-method-cooking-step-title h3 {
    margin: 0;
    font-family: var(--sans);
    font-size: 1.05cqw;
    font-weight: 800;
    line-height: 1.35;
    letter-spacing: .28em;
    text-transform: uppercase;
    color: #17371A;
  }

  .breakfast-method-cooking-step p {
    margin: 0;
    max-width: 26.0cqw;
    font-size: 1.08cqw;
    font-weight: 500;
    line-height: 1.58;
    color: rgba(31, 33, 30, .88);
  }

  .breakfast-method-cooking-tip {
    position: absolute;
    left: 8.25cqw;
    bottom: 5.65cqw;
    z-index: 5;
    display: grid;
    grid-template-columns: 5.0cqw 1fr;
    align-items: center;
    gap: 1.45cqw;
    width: 83.6cqw;
    min-height: 8.35cqw;
    padding: 1.2cqw 2.0cqw;
    font-family: var(--sans);
  }

  .breakfast-method-cooking-tip-icon {
    display: grid;
    place-items: center;
    width: 5.0cqw;
    height: 5.0cqw;
    border-radius: 50%;
    color: #17371A;
  }

  .breakfast-method-cooking-tip-icon svg {
    width: 3.05cqw;
    height: 3.05cqw;
  }

  .breakfast-method-cooking-tip h3 {
    margin: 0;
    font-family: var(--sans);
    font-size: .95cqw;
    font-weight: 800;
    line-height: 1.35;
    letter-spacing: .28em;
    text-transform: uppercase;
    color: #17371A;
  }

  .breakfast-method-cooking-tip p {
    margin: .8cqw 0 0;
    font-size: 1.05cqw;
    font-weight: 500;
    line-height: 1.5;
    color: rgba(31, 33, 30, .86);
  }

  .breakfast-benefits-page-number,
  .breakfast-ingredients-method-page-number,
  .breakfast-method-cooking-page-number {
    position: absolute;
    z-index: 5;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: .95cqw;
    font-family: var(--sans);
    font-size: 1.22cqw;
    font-weight: 600;
    line-height: 1;
    color: rgba(20, 38, 14, .82);
  }

  .breakfast-benefits-page-number,
  .breakfast-method-cooking-page-number {
    right: 7.0cqw;
    bottom: 4.25cqw;
  }

  .breakfast-ingredients-method-page-number {
    right: 5.0cqw;
    bottom: 3.25cqw;
  }

  .breakfast-benefits-page-number::after,
  .breakfast-ingredients-method-page-number::after,
  .breakfast-method-cooking-page-number::after {
    content: "";
    width: 3.2cqw;
    height: 1px;
    background: rgba(20, 38, 14, .72);
  }

  @media (min-width: 821px) {
    .ebook-breakfast-benefits-page,
    .ebook-breakfast-ingredients-method-page,
    .ebook-breakfast-method-cooking-page {
      --breakfast-next-stage-x: clamp(48px, 7vw, 120px);
      --breakfast-next-stage-y: clamp(18px, 3svh, 34px);
      min-height: 100svh;
      padding: var(--breakfast-next-stage-y) var(--breakfast-next-stage-x);
      place-items: center;
    }

    .ebook-breakfast-benefits-sheet,
    .ebook-breakfast-ingredients-method-sheet,
    .ebook-breakfast-method-cooking-sheet {
      width: min(
        calc(100vw - (var(--breakfast-next-stage-x) * 2)),
        calc((100svh - (var(--breakfast-next-stage-y) * 2)) * .7064343),
        1055px
      );
      min-height: 0;
      aspect-ratio: 1054 / 1492;
      box-shadow: 0 24px 70px rgba(38, 33, 27, .18);
    }
  }

  .ebook-smart-snacks-ingredients-page,
  .ebook-smart-snacks-cards-page,
  .ebook-nourishing-beverages-page,
  .ebook-grocery-essentials-page,
  .ebook-fruit-catalog-page,
  .ebook-vegetable-catalog-page {
    isolation: isolate;
    display: grid;
    place-items: stretch;
    background: #E9E1D3;
    color: #102A12;
  }

  .ebook-smart-snacks-ingredients-sheet,
  .ebook-smart-snacks-cards-sheet,
  .ebook-nourishing-beverages-sheet,
  .ebook-grocery-essentials-sheet,
  .ebook-fruit-catalog-sheet,
  .ebook-vegetable-catalog-sheet {
    container-type: inline-size;
    position: relative;
    width: 100%;
    min-height: 100svh;
    overflow: hidden;
    isolation: isolate;
    background: #F8F4ED;
  }

  .smart-snacks-ingredients-photo,
  .smart-snacks-cards-photo,
  .nourishing-beverages-photo,
  .grocery-essentials-photo,
  .fruit-catalog-photo,
  .vegetable-catalog-photo {
    position: absolute;
    inset: 0;
    z-index: 0;
    object-fit: cover;
    object-position: center;
    filter: saturate(.99) contrast(1.01) brightness(1.01);
  }

  .smart-snacks-ingredients-paper-wash,
  .smart-snacks-cards-paper-wash,
  .nourishing-beverages-paper-wash,
  .grocery-essentials-paper-wash,
  .fruit-catalog-paper-wash,
  .vegetable-catalog-paper-wash {
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    background: linear-gradient(90deg, rgba(248,244,237,.10) 0%, rgba(248,244,237,.02) 60%, rgba(248,244,237,0) 100%);
  }

  .smart-snacks-ingredients-top-mark,
  .smart-snacks-cards-top-mark,
  .nourishing-beverages-top-mark,
  .grocery-essentials-top-mark,
  .fruit-catalog-top-mark,
  .vegetable-catalog-top-mark {
    position: absolute;
    left: 4.6cqw;
    top: 3.25cqw;
    z-index: 5;
    width: 2.2cqw;
    height: 3.4cqw;
    color: #17371A;
  }

  .nourishing-beverages-top-mark,
  .grocery-essentials-top-mark,
  .fruit-catalog-top-mark,
  .vegetable-catalog-top-mark {
    color: #B67819;
  }

  .smart-snacks-ingredients-topline,
  .smart-snacks-cards-topline,
  .nourishing-beverages-topline,
  .grocery-essentials-topline,
  .fruit-catalog-topline,
  .vegetable-catalog-topline {
    position: absolute;
    left: 9.0cqw;
    top: 4.45cqw;
    z-index: 5;
    font-family: var(--sans);
    font-size: .82cqw;
    font-weight: 800;
    line-height: 1;
    letter-spacing: .34em;
    text-transform: uppercase;
    color: #14260E;
    white-space: nowrap;
  }

  .nourishing-beverages-topline,
  .grocery-essentials-topline,
  .fruit-catalog-topline,
  .vegetable-catalog-topline {
    left: 8.9cqw;
  }

  .smart-snacks-ingredients-topline span,
  .smart-snacks-cards-topline span,
  .nourishing-beverages-topline span,
  .grocery-essentials-topline span,
  .fruit-catalog-topline span,
  .vegetable-catalog-topline span {
    display: inline-block;
    margin: 0 1.55cqw;
    color: #B67819;
  }

  .smart-snacks-ingredients-copy,
  .smart-snacks-cards-copy,
  .nourishing-beverages-copy,
  .grocery-essentials-copy,
  .fruit-catalog-copy,
  .vegetable-catalog-copy {
    position: absolute;
    z-index: 5;
    font-family: var(--sans);
  }

  .smart-snacks-ingredients-copy {
    left: 7.4cqw;
    top: 16.2cqw;
    width: 43cqw;
  }

  .smart-snacks-cards-copy {
    left: 8.05cqw;
    top: 13.8cqw;
    width: 39cqw;
  }

  .nourishing-beverages-copy {
    left: 4.55cqw;
    top: 12.5cqw;
    width: 46.5cqw;
  }

  .grocery-essentials-copy,
  .fruit-catalog-copy,
  .vegetable-catalog-copy {
    left: 4.05cqw;
    top: 12.1cqw;
    width: 48cqw;
  }

  .smart-snacks-ingredients-copy h2,
  .smart-snacks-cards-copy h2,
  .nourishing-beverages-copy h2,
  .grocery-essentials-copy h2,
  .fruit-catalog-copy h2,
  .vegetable-catalog-copy h2 {
    margin: 0;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-weight: 500;
    line-height: .96;
    letter-spacing: 0;
    color: #07381E;
  }

  .smart-snacks-ingredients-copy h2,
  .smart-snacks-cards-copy h2 {
    font-size: clamp(6.4cqw, 7.55cqw, 8.05cqw);
  }

  .nourishing-beverages-copy h2,
  .grocery-essentials-copy h2,
  .fruit-catalog-copy h2,
  .vegetable-catalog-copy h2 {
    font-size: clamp(6.3cqw, 7.45cqw, 8.1cqw);
    text-transform: uppercase;
  }

  .smart-snacks-ingredients-divider,
  .smart-snacks-cards-divider,
  .nourishing-beverages-divider,
  .grocery-essentials-divider,
  .fruit-catalog-divider,
  .vegetable-catalog-divider {
    display: flex;
    align-items: center;
    gap: 1.15cqw;
    margin-top: 2.8cqw;
    color: #A77141;
  }

  .smart-snacks-ingredients-divider i,
  .smart-snacks-cards-divider i,
  .nourishing-beverages-divider i,
  .grocery-essentials-divider i,
  .fruit-catalog-divider i,
  .vegetable-catalog-divider i {
    display: block;
    width: 4.6cqw;
    height: 1px;
    background: rgba(167, 113, 65, .72);
  }

  .smart-snacks-ingredients-divider .section-divider-leaf,
  .smart-snacks-cards-divider .section-divider-leaf,
  .nourishing-beverages-divider .section-divider-leaf,
  .grocery-essentials-divider .section-divider-leaf,
  .fruit-catalog-divider .section-divider-leaf,
  .vegetable-catalog-divider .section-divider-leaf {
    width: 2.55cqw;
    height: 1.1cqw;
  }

  .smart-snacks-ingredients-copy p,
  .smart-snacks-cards-copy p,
  .nourishing-beverages-copy p,
  .grocery-essentials-copy p,
  .fruit-catalog-copy p,
  .vegetable-catalog-copy p {
    margin: 2.45cqw 0 0;
    max-width: 36cqw;
    font-family: var(--sans);
    font-size: 1.28cqw;
    font-weight: 500;
    line-height: 1.55;
    color: rgba(31, 33, 30, .9);
  }

  .nourishing-beverages-copy .nourishing-beverages-lead {
    margin-top: 2.55cqw;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 2.25cqw;
    font-style: italic;
    line-height: 1.1;
    color: #A56317;
  }

  .nourishing-beverages-copy .nourishing-beverages-lead + p {
    margin-top: 1.6cqw;
    max-width: 31cqw;
  }

  .smart-snacks-ingredient-columns {
    position: absolute;
    left: 6.4cqw;
    top: 68.2cqw;
    z-index: 5;
    display: grid;
    grid-template-columns: repeat(3, 28.2cqw);
    gap: 3.1cqw;
    font-family: var(--sans);
  }

  .smart-snacks-ingredient-column {
    min-height: 50.5cqw;
    padding: 0 1.1cqw;
    text-align: center;
  }

  .smart-snacks-ingredient-column h3 {
    min-height: 6.9cqw;
    margin: 0;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 2.85cqw;
    font-weight: 500;
    line-height: 1.03;
    letter-spacing: 0;
    color: #07381E;
  }

  .smart-snacks-ingredient-column > i {
    display: block;
    width: 4.3cqw;
    height: 1px;
    margin: 2.3cqw auto 3.2cqw;
    background: rgba(102, 109, 84, .5);
  }

  .smart-snacks-ingredient-column h4,
  .smart-snacks-recipe-card h4,
  .nourishing-beverage-card h4 {
    margin: 0;
    font-family: var(--sans);
    font-size: 1.0cqw;
    font-weight: 800;
    line-height: 1;
    letter-spacing: .34em;
    text-transform: uppercase;
    color: #17371A;
  }

  .smart-snacks-ingredient-column ul {
    display: grid;
    gap: 3.35cqw;
    margin: 4.25cqw 0 0 10.2cqw;
    padding: 0;
    text-align: left;
    list-style: none;
  }

  .smart-snacks-ingredient-column li {
    min-height: 3.2cqw;
    display: flex;
    align-items: center;
    font-size: 1.05cqw;
    font-weight: 500;
    line-height: 1.25;
    color: rgba(31, 33, 30, .88);
  }

  .smart-snacks-ingredients-footer {
    position: absolute;
    left: 6.7cqw;
    right: 6.7cqw;
    bottom: 7.55cqw;
    z-index: 5;
    display: grid;
    grid-template-columns: 37cqw 1fr;
    align-items: center;
    min-height: 8.4cqw;
    font-family: var(--sans);
  }

  .smart-snacks-ingredients-footer-title {
    padding-left: 10.2cqw;
  }

  .smart-snacks-ingredients-footer-title h3 {
    margin: 0;
    font-size: 1.02cqw;
    font-weight: 800;
    line-height: 1;
    letter-spacing: .28em;
    text-transform: uppercase;
    color: #17371A;
  }

  .smart-snacks-ingredients-footer-title p {
    margin: 1.45cqw 0 0;
    max-width: 26cqw;
    font-size: 1.05cqw;
    font-weight: 500;
    line-height: 1.55;
    color: rgba(31, 33, 30, .84);
  }

  .smart-snacks-ingredients-footer-features {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    align-items: end;
    gap: 1.4cqw;
    text-align: center;
  }

  .smart-snacks-ingredients-footer-features span {
    display: block;
    padding-top: 4.4cqw;
    font-size: 1.02cqw;
    font-weight: 500;
    line-height: 1.3;
    color: #17371A;
  }

  .smart-snacks-ingredients-bottom-note,
  .smart-snacks-cards-bottom-note,
  .nourishing-beverages-bottom-note,
  .grocery-essentials-bottom-note,
  .fruit-catalog-bottom-note,
  .vegetable-catalog-bottom-note {
    position: absolute;
    z-index: 5;
    left: 0;
    right: 0;
    bottom: 1.8cqw;
    text-align: center;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 1.45cqw;
    font-style: italic;
    line-height: 1;
    color: #17371A;
  }

  .smart-snacks-feature-row,
  .nourishing-beverages-feature-row {
    position: absolute;
    z-index: 5;
    display: grid;
    font-family: var(--sans);
    text-align: center;
  }

  .smart-snacks-feature-row {
    left: 7.4cqw;
    top: 38.2cqw;
    grid-template-columns: repeat(4, 15.7cqw);
    gap: 2.35cqw;
  }

  .nourishing-beverages-feature-row {
    left: 5.0cqw;
    right: 5.0cqw;
    top: 45.8cqw;
    grid-template-columns: repeat(4, 1fr);
    gap: 2.3cqw;
  }

  .smart-snacks-feature h3,
  .nourishing-beverages-feature h3 {
    margin: 5.6cqw 0 0;
    font-size: .82cqw;
    font-weight: 800;
    line-height: 1.2;
    letter-spacing: .25em;
    text-transform: uppercase;
    color: #17371A;
  }

  .nourishing-beverages-feature h3 {
    margin-top: 4.6cqw;
  }

  .smart-snacks-feature p,
  .nourishing-beverages-feature p {
    margin: 1.15cqw auto 0;
    max-width: 13.4cqw;
    font-size: .88cqw;
    font-weight: 500;
    line-height: 1.45;
    color: rgba(31, 33, 30, .88);
  }

  .smart-snacks-recipe-cards,
  .nourishing-beverages-cards {
    position: absolute;
    z-index: 5;
    display: grid;
    font-family: var(--sans);
  }

  .smart-snacks-recipe-cards {
    left: 7.25cqw;
    right: 7.25cqw;
    top: 51.8cqw;
    grid-template-columns: repeat(3, 1fr);
    gap: 3.25cqw;
  }

  .nourishing-beverages-cards {
    left: 3.6cqw;
    right: 3.6cqw;
    top: 61.2cqw;
    grid-template-columns: repeat(3, 1fr);
    gap: 2.1cqw;
  }

  .smart-snacks-recipe-card {
    min-height: 64.8cqw;
    padding: 23.8cqw 2.55cqw 2.0cqw;
    text-align: center;
  }

  .nourishing-beverage-card {
    min-height: 70.4cqw;
    padding: 25.2cqw 2.1cqw 1.5cqw;
    text-align: center;
  }

  .smart-snacks-recipe-badge,
  .nourishing-beverage-badge {
    display: none;
  }

  .smart-snacks-recipe-card h3,
  .nourishing-beverage-card h3 {
    margin: 0 auto;
    max-width: 18.5cqw;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 2.75cqw;
    font-weight: 500;
    line-height: 1.05;
    letter-spacing: 0;
    color: #07381E;
  }

  .nourishing-beverage-card h3 {
    max-width: 21cqw;
    font-size: 2.2cqw;
    text-transform: uppercase;
  }

  .nourishing-beverage-card.is-berry h3 { color: #74375F; }
  .nourishing-beverage-card.is-gold h3 { color: #B67819; }
  .nourishing-beverage-card.is-green h3 { color: #42651F; }

  .smart-snacks-recipe-card > p,
  .nourishing-beverage-card > p {
    margin: 1.5cqw auto 0;
    max-width: 18.5cqw;
    font-size: 1.02cqw;
    font-weight: 500;
    line-height: 1.48;
    color: rgba(31, 33, 30, .88);
  }

  .nourishing-beverage-card > i {
    display: block;
    width: 5.4cqw;
    height: 1px;
    margin: 1.2cqw auto 0;
    background: rgba(183, 120, 25, .55);
  }

  .smart-snacks-recipe-rule {
    width: 20.2cqw;
    height: 1px;
    margin: 1.85cqw auto 1.7cqw;
    background: rgba(196, 184, 166, .72);
  }

  .nourishing-beverage-card h4 {
    margin-top: 2.3cqw;
  }

  .nourishing-beverage-card.is-berry h4 { color: #74375F; }
  .nourishing-beverage-card.is-gold h4 { color: #B67819; }
  .nourishing-beverage-card.is-green h4 { color: #42651F; }

  .smart-snacks-recipe-card ul {
    margin: 1.55cqw 0 0;
    padding-left: 1.15cqw;
    text-align: left;
  }

  .smart-snacks-recipe-card li {
    margin-bottom: .78cqw;
    font-size: .92cqw;
    font-weight: 500;
    line-height: 1.35;
    color: rgba(31, 33, 30, .9);
  }

  .nourishing-beverage-card ul {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.7cqw 3.0cqw;
    margin: 2.1cqw 0 0;
    padding: 0;
    list-style: none;
    text-align: left;
  }

  .nourishing-beverage-card li {
    min-height: 3.45cqw;
    display: flex;
    align-items: center;
    padding-left: 3.9cqw;
    font-size: .8cqw;
    font-weight: 500;
    line-height: 1.28;
    color: rgba(31, 33, 30, .9);
  }

  .smart-snacks-recipe-metrics,
  .nourishing-beverage-metrics {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: .75cqw;
  }

  .smart-snacks-recipe-metrics {
    margin-top: 2.05cqw;
  }

  .nourishing-beverage-metrics {
    margin-top: 1.8cqw;
  }

  .smart-snacks-recipe-metric,
  .nourishing-beverage-metric {
    display: grid;
    justify-items: center;
    gap: .48cqw;
    text-align: center;
  }

  .smart-snacks-recipe-metric svg,
  .nourishing-beverage-metric svg {
    width: 2.15cqw;
    height: 2.15cqw;
    color: #17371A;
  }

  .nourishing-beverage-card.is-berry .nourishing-beverage-metric svg { color: #74375F; }
  .nourishing-beverage-card.is-gold .nourishing-beverage-metric svg { color: #B67819; }
  .nourishing-beverage-card.is-green .nourishing-beverage-metric svg { color: #42651F; }

  .smart-snacks-recipe-metric span,
  .nourishing-beverage-metric span {
    font-size: .72cqw;
    font-weight: 800;
    line-height: 1;
    letter-spacing: .18em;
    text-transform: uppercase;
    color: #17371A;
  }

  .smart-snacks-recipe-metric strong,
  .nourishing-beverage-metric strong {
    font-size: .82cqw;
    font-weight: 500;
    line-height: 1.1;
    color: rgba(31, 33, 30, .9);
  }

  .smart-snacks-benefits-row,
  .nourishing-beverages-benefits-row,
  .grocery-essentials-benefits-row,
  .fruit-catalog-benefits-row,
  .vegetable-catalog-benefits-row {
    position: absolute;
    z-index: 5;
    font-family: var(--sans);
  }

  .smart-snacks-benefits-row {
    left: 7.4cqw;
    right: 7.4cqw;
    bottom: 6.65cqw;
    min-height: 12.6cqw;
    text-align: center;
  }

  .smart-snacks-benefits-row h3 {
    margin: 1.7cqw 0 0;
    font-size: 1.35cqw;
    font-weight: 800;
    line-height: 1;
    letter-spacing: .42em;
    text-transform: uppercase;
    color: #17371A;
  }

  .smart-snacks-benefits-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 1.1cqw;
    margin-top: 3.15cqw;
  }

  .smart-snacks-benefit,
  .nourishing-beverages-benefit,
  .grocery-essentials-benefit,
  .fruit-catalog-benefit,
  .vegetable-catalog-benefit {
    display: grid;
    justify-items: center;
    align-content: start;
    gap: .9cqw;
    text-align: center;
  }

  .smart-snacks-benefit-icon {
    display: grid;
    place-items: center;
    width: 4.8cqw;
    height: 4.8cqw;
    border-radius: 50%;
    background: rgba(222, 218, 207, .74);
    color: #17371A;
  }

  .smart-snacks-benefit-icon svg,
  .nourishing-beverages-benefit svg,
  .grocery-essentials-benefit svg,
  .fruit-catalog-benefit svg,
  .vegetable-catalog-benefit svg {
    width: 2.6cqw;
    height: 2.6cqw;
  }

  .smart-snacks-benefit span,
  .nourishing-beverages-benefit span,
  .grocery-essentials-benefit span,
  .fruit-catalog-benefit span,
  .vegetable-catalog-benefit span {
    max-width: 9.3cqw;
    font-size: .9cqw;
    font-weight: 500;
    line-height: 1.35;
    color: #17371A;
  }

  .nourishing-beverages-benefits-row,
  .grocery-essentials-benefits-row,
  .fruit-catalog-benefits-row,
  .vegetable-catalog-benefits-row {
    left: 3.6cqw;
    right: 3.6cqw;
    bottom: 5.8cqw;
    display: grid;
    grid-template-columns: 29.4cqw 1fr;
    min-height: 10.0cqw;
  }

  .nourishing-beverages-benefit-lead,
  .grocery-essentials-benefit-lead,
  .fruit-catalog-benefit-lead,
  .vegetable-catalog-benefit-lead {
    padding: 2.0cqw 2.4cqw 1.6cqw 10.6cqw;
    color: #F8F4ED;
  }

  .nourishing-beverages-benefit-lead h3,
  .grocery-essentials-benefit-lead h3,
  .fruit-catalog-benefit-lead h3,
  .vegetable-catalog-benefit-lead h3 {
    margin: 0;
    font-size: 1.08cqw;
    font-weight: 800;
    line-height: 1.45;
    letter-spacing: .24em;
    text-transform: uppercase;
  }

  .nourishing-beverages-benefit-lead p,
  .grocery-essentials-benefit-lead p,
  .fruit-catalog-benefit-lead p,
  .vegetable-catalog-benefit-lead p {
    margin: .85cqw 0 0;
    font-size: .95cqw;
    font-weight: 500;
    line-height: 1.45;
  }

  .nourishing-beverages-benefits-grid,
  .grocery-essentials-benefits-grid,
  .fruit-catalog-benefits-grid,
  .vegetable-catalog-benefits-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    align-items: center;
    gap: 1.0cqw;
    padding: 1.55cqw 1.4cqw 1.0cqw;
  }

  .nourishing-beverages-benefit svg,
  .grocery-essentials-benefit svg,
  .fruit-catalog-benefit svg,
  .vegetable-catalog-benefit svg {
    color: #17371A;
  }

  .grocery-essentials-badge,
  .fruit-catalog-badge {
    position: absolute;
    z-index: 5;
    right: 5.15cqw;
    top: 31.5cqw;
    display: grid;
    place-items: center;
    width: 10.4cqw;
    height: 10.4cqw;
    border-radius: 50%;
    text-align: center;
    font-family: var(--sans);
    font-size: .92cqw;
    font-weight: 800;
    line-height: 1.45;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: #F8F4ED;
  }

  .fruit-catalog-badge {
    top: 28.4cqw;
  }

  .grocery-essentials-page-label {
    position: absolute;
    left: 15.8cqw;
    top: 47.2cqw;
    z-index: 5;
    font-family: var(--sans);
    font-size: 1.1cqw;
    font-weight: 600;
    line-height: 1;
    letter-spacing: .14em;
    text-transform: uppercase;
    color: #B67819;
  }

  .grocery-essentials-grid {
    position: absolute;
    left: 3.75cqw;
    right: 3.75cqw;
    top: 51.6cqw;
    z-index: 5;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.45cqw;
    font-family: var(--sans);
  }

  .grocery-essentials-card {
    min-height: 69.7cqw;
    padding: 1.45cqw 1.25cqw 1.35cqw;
  }

  .grocery-essentials-card h3 {
    margin: 0 0 0 7.7cqw;
    font-size: 1.35cqw;
    font-weight: 800;
    line-height: 1;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: #F8F4ED;
  }

  .grocery-essentials-items {
    display: grid;
    gap: .9cqw;
    margin-top: 3.0cqw;
  }

  .grocery-essentials-item {
    position: relative;
    min-height: 8.2cqw;
    padding-left: 12.4cqw;
  }

  .grocery-essentials-item-image {
    position: absolute;
    top: -.25cqw;
    left: 1.1cqw;
    width: 7.2cqw;
    height: 7.2cqw;
    overflow: hidden;
    border-radius: 50%;
  }

  .grocery-essentials-item strong {
    display: block;
    font-size: 1.15cqw;
    font-weight: 500;
    line-height: 1.2;
    color: #1F211E;
  }

  .grocery-essentials-item p {
    margin: .65cqw 0 0;
    font-size: .87cqw;
    font-weight: 500;
    line-height: 1.45;
    color: rgba(31, 33, 30, .84);
  }

  .grocery-essentials-summary {
    margin-top: 1.15cqw;
    min-height: 5.4cqw;
    padding: 1.25cqw 1.2cqw 1.0cqw 8.6cqw;
  }

  .grocery-essentials-summary p {
    margin: 0;
    font-size: .95cqw;
    font-weight: 500;
    line-height: 1.45;
    color: #17371A;
  }

  .fruit-catalog-grid {
    position: absolute;
    left: 2.9cqw;
    right: 2.9cqw;
    top: 40.3cqw;
    z-index: 5;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: 17.5cqw;
    gap: .65cqw .9cqw;
    font-family: var(--sans);
  }

  .fruit-catalog-card {
    position: relative;
    padding: 2.7cqw 1.0cqw 1.1cqw 15.8cqw;
  }

  .fruit-catalog-item-image {
    position: absolute;
    top: 1.2cqw;
    left: 1.25cqw;
    width: 11.8cqw;
    height: 11.8cqw;
    overflow: hidden;
    border-radius: 50%;
  }

  .fruit-catalog-card-copy h3 {
    margin: 0;
    font-size: 1.55cqw;
    font-weight: 800;
    line-height: 1.12;
    letter-spacing: .08em;
    text-transform: uppercase;
    color: #17371A;
  }

  .fruit-catalog-card-copy i {
    display: block;
    width: 5.0cqw;
    height: 1px;
    margin: 1.0cqw 0;
    background: rgba(183, 120, 25, .58);
  }

  .fruit-catalog-card-copy p {
    margin: 0;
    max-width: 12.2cqw;
    font-size: .9cqw;
    font-weight: 500;
    line-height: 1.45;
    color: rgba(31, 33, 30, .88);
  }

  .fruit-catalog-tags {
    position: absolute;
    left: .7cqw;
    right: .7cqw;
    bottom: 1.0cqw;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: .35cqw;
  }

  .fruit-catalog-tags span {
    display: flex;
    align-items: center;
    gap: .32cqw;
    justify-content: center;
    min-width: 0;
    font-size: .58cqw;
    font-weight: 500;
    line-height: 1.2;
    color: #17371A;
  }

  .fruit-catalog-tags svg {
    flex: 0 0 auto;
    width: 1.1cqw;
    height: 1.1cqw;
  }

  .vegetable-catalog-grid {
    position: absolute;
    left: 3.45cqw;
    right: 3.45cqw;
    top: 33.0cqw;
    z-index: 5;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: 20.05cqw;
    gap: 0;
    font-family: var(--sans);
  }

  .vegetable-catalog-card {
    position: relative;
    display: grid;
    align-content: end;
    justify-items: center;
    padding: 0 2.2cqw 2.2cqw;
    text-align: center;
  }

  .vegetable-catalog-item-image {
    position: absolute;
    top: 1.1cqw;
    left: 50%;
    width: 9.5cqw;
    height: 9.5cqw;
    overflow: hidden;
    border-radius: 50%;
    transform: translateX(-50%);
  }

  .vegetable-catalog-card h3 {
    margin: 0;
    font-size: 1.2cqw;
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: .24em;
    text-transform: uppercase;
    color: #17371A;
  }

  .vegetable-catalog-card p {
    margin: 1.0cqw 0 0;
    max-width: 16.6cqw;
    font-size: .92cqw;
    font-weight: 500;
    line-height: 1.4;
    color: rgba(31, 33, 30, .88);
  }

  .smart-snacks-ingredients-page-number,
  .smart-snacks-cards-page-number,
  .nourishing-beverages-page-number,
  .grocery-essentials-page-number,
  .fruit-catalog-page-number,
  .vegetable-catalog-page-number {
    position: absolute;
    right: 4.2cqw;
    bottom: 2.6cqw;
    z-index: 5;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: .8cqw;
    font-family: var(--sans);
    font-size: 1.05cqw;
    font-weight: 600;
    line-height: 1;
    color: rgba(20, 38, 14, .72);
  }

  .smart-snacks-ingredients-page-number::after,
  .smart-snacks-cards-page-number::after,
  .nourishing-beverages-page-number::after,
  .grocery-essentials-page-number::after,
  .fruit-catalog-page-number::after,
  .vegetable-catalog-page-number::after {
    content: "";
    width: 2.8cqw;
    height: 1px;
    background: rgba(20, 38, 14, .58);
  }

  .ebook-action-plan-page {
    isolation: isolate;
    display: grid;
    place-items: stretch;
    background: #E9E1D3;
    color: #102A12;
  }

  .ebook-action-plan-sheet {
    container-type: inline-size;
    position: relative;
    width: 100%;
    min-height: 100svh;
    overflow: hidden;
    isolation: isolate;
    background: #F8F4ED;
  }

  .action-plan-photo {
    position: absolute;
    inset: 0;
    z-index: 0;
    object-fit: cover;
    object-position: center;
    filter: saturate(.99) contrast(1.01) brightness(1.01);
  }

  .action-plan-paper-wash {
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    background: linear-gradient(90deg, rgba(248,244,237,.08) 0%, rgba(248,244,237,.02) 62%, rgba(248,244,237,0) 100%);
  }

  .action-plan-top-mark {
    position: absolute;
    left: 3.75cqw;
    top: 2.15cqw;
    z-index: 5;
    width: 2.2cqw;
    height: 3.4cqw;
    color: #B67819;
  }

  .action-plan-topline {
    position: absolute;
    left: 7.7cqw;
    top: 4.1cqw;
    z-index: 5;
    font-family: var(--sans);
    font-size: .82cqw;
    font-weight: 800;
    line-height: 1;
    letter-spacing: .34em;
    text-transform: uppercase;
    color: #14260E;
    white-space: nowrap;
  }

  .action-plan-topline span {
    display: inline-block;
    margin: 0 1.55cqw;
    color: #B67819;
  }

  .action-plan-copy {
    position: absolute;
    left: 4.45cqw;
    top: 10.35cqw;
    z-index: 5;
    width: 45.5cqw;
    font-family: var(--sans);
  }

  .action-plan-section-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 10.8cqw;
    height: 2.8cqw;
    border-radius: .45cqw;
    background: #2E5B25;
    padding: 0 1.1cqw;
    font-size: 1.12cqw;
    font-weight: 800;
    line-height: 1;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: #F8F4ED;
  }

  .action-plan-copy h2 {
    margin: 1.3cqw 0 0;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: clamp(5.6cqw, 6.7cqw, 7.2cqw);
    font-weight: 500;
    line-height: .95;
    letter-spacing: 0;
    text-transform: uppercase;
    color: #07381E;
  }

  .action-plan-divider {
    display: flex;
    align-items: center;
    gap: 1.15cqw;
    margin-top: 2.8cqw;
    color: #A77141;
  }

  .action-plan-divider i {
    display: block;
    width: 4.6cqw;
    height: 1px;
    background: rgba(167, 113, 65, .72);
  }

  .action-plan-divider .section-divider-leaf {
    width: 2.55cqw;
    height: 1.1cqw;
  }

  .action-plan-copy h3 {
    margin: 2.55cqw 0 0;
    font-size: 1.5cqw;
    font-weight: 700;
    line-height: 1;
    color: #2E5B25;
  }

  .action-plan-copy p {
    margin: .65cqw 0 0;
    max-width: 26cqw;
    font-size: 1.28cqw;
    font-weight: 500;
    line-height: 1.35;
    color: rgba(31, 33, 30, .94);
  }

  .action-plan-calendar-note {
    position: absolute;
    right: 22.15cqw;
    top: 13.1cqw;
    z-index: 5;
    display: grid;
    justify-items: center;
    width: 20cqw;
    text-align: center;
    color: #3C5D31;
  }

  .action-plan-calendar-note strong {
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 9.1cqw;
    font-weight: 500;
    line-height: .78;
  }

  .action-plan-calendar-note span {
    margin-top: 1.2cqw;
    font-family: var(--sans);
    font-size: 1.35cqw;
    font-weight: 700;
    line-height: 1.24;
    letter-spacing: .16em;
    text-transform: uppercase;
  }

  .action-plan-calendar-note .section-divider-leaf {
    width: 2.3cqw;
    height: 1.1cqw;
    margin-top: 1.35cqw;
  }

  .action-plan-principles {
    position: absolute;
    left: 14.9cqw;
    right: 5.8cqw;
    top: 41.7cqw;
    z-index: 5;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 4.1cqw;
    font-family: var(--sans);
  }

  .action-plan-principles p {
    margin: 0;
    max-width: 12.2cqw;
    font-size: .92cqw;
    font-weight: 500;
    line-height: 1.4;
    color: rgba(31, 33, 30, .9);
  }

  .action-plan-week-grid {
    position: absolute;
    left: 3.85cqw;
    right: 4.55cqw;
    top: 51.7cqw;
    z-index: 5;
    display: grid;
    grid-template-rows: 21.9cqw 20.8cqw 20.8cqw 19.3cqw;
    gap: .75cqw;
    font-family: var(--sans);
  }

  .action-plan-week-row {
    display: grid;
    grid-template-columns: 12.2cqw 1fr;
    min-height: 0;
  }

  .action-plan-week-card {
    min-height: 0;
    padding: 1.55cqw 1.45cqw;
    color: #F8F4ED;
  }

  .action-plan-week-card span {
    display: block;
    font-size: 1.4cqw;
    font-weight: 500;
    line-height: 1;
    letter-spacing: .08em;
    text-transform: uppercase;
    color: #E2C17A;
  }

  .action-plan-week-card strong {
    display: block;
    margin-top: 1.55cqw;
    font-size: 1.55cqw;
    font-weight: 500;
    line-height: 1.18;
  }

  .action-plan-week-card em {
    display: block;
    margin-top: 1.25cqw;
    font-size: 1.15cqw;
    font-style: normal;
    font-weight: 500;
    line-height: 1.2;
  }

  .action-plan-week-card p {
    margin: 1.35cqw 0 0;
    font-size: .9cqw;
    font-weight: 500;
    line-height: 1.32;
  }

  .action-plan-days {
    display: grid;
    grid-template-columns: repeat(var(--action-plan-day-count, 7), minmax(0, 1fr));
  }

  .action-plan-week-row:nth-child(4) .action-plan-days {
    --action-plan-day-count: 9;
  }

  .action-plan-day {
    display: grid;
    align-content: start;
    justify-items: center;
    min-width: 0;
    padding: 1.35cqw .55cqw .85cqw;
    text-align: center;
  }

  .action-plan-day h3 {
    margin: 0;
    font-size: 1.02cqw;
    font-weight: 800;
    line-height: 1;
    letter-spacing: .06em;
    text-transform: uppercase;
    color: #1F211E;
  }

  .action-plan-day p {
    margin: 11.1cqw 0 0;
    max-width: 8.6cqw;
    min-height: 4.4cqw;
    font-size: .8cqw;
    font-weight: 500;
    line-height: 1.38;
    color: rgba(31, 33, 30, .94);
  }

  .action-plan-week-row:nth-child(4) .action-plan-day p {
    margin-top: 9.5cqw;
    max-width: 7.0cqw;
    font-size: .72cqw;
  }

  .action-plan-footer {
    position: absolute;
    left: 3.85cqw;
    right: 4.55cqw;
    bottom: 5.95cqw;
    z-index: 5;
    display: grid;
    grid-template-columns: 31.2cqw 1fr;
    min-height: 9.0cqw;
    font-family: var(--sans);
  }

  .action-plan-remember {
    padding: 1.85cqw 2.0cqw 1.2cqw 10.0cqw;
  }

  .action-plan-remember h3,
  .action-plan-tips h3 {
    margin: 0;
    font-size: 1.25cqw;
    font-weight: 800;
    line-height: 1;
    letter-spacing: .03em;
    color: #17371A;
  }

  .action-plan-remember p {
    margin: 1.0cqw 0 0;
    max-width: 19.0cqw;
    font-size: 1.0cqw;
    font-weight: 500;
    line-height: 1.43;
    color: rgba(31, 33, 30, .94);
  }

  .action-plan-tips {
    padding: 1.25cqw 1.2cqw 1.0cqw 4.4cqw;
    text-align: center;
  }

  .action-plan-tips h3 {
    font-size: .9cqw;
    letter-spacing: .24em;
    text-transform: uppercase;
  }

  .action-plan-tips > div {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 1.1cqw;
    margin-top: 1.65cqw;
    text-align: left;
  }

  .action-plan-tips p {
    margin: 0;
    padding-top: 2.9cqw;
    font-size: .66cqw;
    font-weight: 500;
    line-height: 1.28;
    color: rgba(31, 33, 30, .92);
  }

  .action-plan-bottom-note {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 2.0cqw;
    z-index: 5;
    text-align: center;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 1.35cqw;
    font-style: italic;
    line-height: 1;
    color: #17371A;
  }

  .action-plan-page-number {
    position: absolute;
    right: 4.2cqw;
    bottom: 2.6cqw;
    z-index: 5;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: .8cqw;
    font-family: var(--sans);
    font-size: 1.05cqw;
    font-weight: 600;
    line-height: 1;
    color: rgba(20, 38, 14, .72);
  }

  .action-plan-page-number::after {
    content: "";
    width: 2.8cqw;
    height: 1px;
    background: rgba(20, 38, 14, .58);
  }

  .ebook-next-chapter-page {
    isolation: isolate;
    display: grid;
    place-items: stretch;
    background: #E9E1D3;
    color: #102A12;
  }

  .ebook-next-chapter-sheet {
    container-type: inline-size;
    position: relative;
    width: 100%;
    min-height: 100svh;
    overflow: hidden;
    isolation: isolate;
    background: #F8F4ED;
  }

  .next-chapter-photo {
    position: absolute;
    inset: 0;
    z-index: 0;
    object-fit: cover;
    object-position: center;
    filter: saturate(.96) contrast(.99) brightness(1.01);
  }

  .next-chapter-paper-wash {
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    background:
      linear-gradient(90deg, rgba(248,244,237,.94) 0%, rgba(248,244,237,.82) 48%, rgba(248,244,237,.25) 100%),
      linear-gradient(180deg, rgba(248,244,237,.12), rgba(248,244,237,.72));
  }

  .next-chapter-top-mark {
    position: absolute;
    left: 4.55cqw;
    top: 3.6cqw;
    z-index: 5;
    width: 2.55cqw;
    height: 3.85cqw;
    color: #314C2E;
  }

  .next-chapter-topline {
    position: absolute;
    left: 8.55cqw;
    top: 4.88cqw;
    z-index: 5;
    font-family: var(--sans);
    font-size: .95cqw;
    font-weight: 800;
    line-height: 1;
    letter-spacing: .34em;
    text-transform: uppercase;
    color: #172514;
    white-space: nowrap;
  }

  .next-chapter-topline span {
    display: inline-block;
    margin: 0 1.55cqw;
    color: #A77141;
  }

  .next-chapter-top-rule {
    position: absolute;
    left: 8.55cqw;
    right: 5.5cqw;
    top: 7.25cqw;
    z-index: 5;
    height: 1px;
    background: rgba(71, 82, 62, .34);
  }

  .next-chapter-copy {
    position: absolute;
    left: 8.0cqw;
    top: 14.8cqw;
    z-index: 5;
    width: 42.5cqw;
    font-family: var(--sans);
  }

  .next-chapter-section-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 10.0cqw;
    height: 2.75cqw;
    border-radius: .45cqw;
    background: #2E5B25;
    padding: 0 1.1cqw;
    font-size: 1.02cqw;
    font-weight: 800;
    line-height: 1;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: #F8F4ED;
  }

  .next-chapter-copy h2 {
    margin: 2.2cqw 0 0;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: clamp(6.5cqw, 7.8cqw, 8.3cqw);
    font-weight: 500;
    line-height: .92;
    letter-spacing: 0;
    color: #07381E;
  }

  .next-chapter-divider {
    display: flex;
    align-items: center;
    gap: 1.25cqw;
    margin-top: 3.2cqw;
    color: #A77141;
  }

  .next-chapter-divider i {
    display: block;
    width: 5.4cqw;
    height: 1px;
    background: rgba(167, 113, 65, .72);
  }

  .next-chapter-divider .section-divider-leaf {
    width: 2.8cqw;
    height: 1.22cqw;
  }

  .next-chapter-copy p {
    margin: 3.0cqw 0 0;
    max-width: 34.5cqw;
    font-size: 1.25cqw;
    font-weight: 500;
    line-height: 1.62;
    color: rgba(31, 33, 30, .9);
  }

  .next-chapter-steps {
    position: absolute;
    left: 8.0cqw;
    top: 62.4cqw;
    z-index: 5;
    display: grid;
    grid-template-columns: repeat(4, 19.2cqw);
    gap: 2.0cqw;
    font-family: var(--sans);
  }

  .next-chapter-step {
    min-height: 24.6cqw;
    border-radius: .8cqw;
    border: 1px solid rgba(196, 184, 166, .55);
    background: rgba(251, 247, 239, .74);
    padding: 2.0cqw 1.55cqw;
    text-align: center;
    box-shadow: 0 18px 48px -42px rgba(38, 33, 27, .34);
  }

  .next-chapter-step-icon {
    display: grid;
    place-items: center;
    width: 4.8cqw;
    height: 4.8cqw;
    margin: 0 auto;
    border-radius: 50%;
    background: rgba(222, 218, 207, .72);
    color: #17371A;
  }

  .next-chapter-step-icon svg {
    width: 2.7cqw;
    height: 2.7cqw;
  }

  .next-chapter-step span {
    display: block;
    margin-top: 1.7cqw;
    font-size: .82cqw;
    font-weight: 800;
    line-height: 1;
    letter-spacing: .16em;
    color: #A77141;
  }

  .next-chapter-step h3 {
    margin: 1.05cqw 0 0;
    font-size: .98cqw;
    font-weight: 800;
    line-height: 1.35;
    letter-spacing: .24em;
    text-transform: uppercase;
    color: #17371A;
  }

  .next-chapter-step p {
    margin: 1.15cqw 0 0;
    font-size: .92cqw;
    font-weight: 500;
    line-height: 1.5;
    color: rgba(31, 33, 30, .86);
  }

  .next-chapter-faqs {
    position: absolute;
    right: 8.0cqw;
    top: 14.6cqw;
    z-index: 5;
    width: 36.0cqw;
    font-family: var(--sans);
  }

  .next-chapter-faqs > h3 {
    margin: 0;
    font-size: 1.02cqw;
    font-weight: 800;
    line-height: 1;
    letter-spacing: .34em;
    text-transform: uppercase;
    color: #17371A;
  }

  .next-chapter-faqs > div {
    display: grid;
    gap: 1.35cqw;
    margin-top: 2.6cqw;
  }

  .next-chapter-faq {
    border-bottom: 1px solid rgba(196, 184, 166, .56);
    padding-bottom: 1.3cqw;
  }

  .next-chapter-faq h4 {
    margin: 0;
    font-size: 1.05cqw;
    font-weight: 800;
    line-height: 1.35;
    color: #17371A;
  }

  .next-chapter-faq p {
    margin: .75cqw 0 0;
    font-size: .96cqw;
    font-weight: 500;
    line-height: 1.5;
    color: rgba(31, 33, 30, .86);
  }

  .next-chapter-closing {
    position: absolute;
    left: 8.0cqw;
    right: 8.0cqw;
    bottom: 8.0cqw;
    z-index: 5;
    display: grid;
    grid-template-columns: 5.2cqw 1fr;
    align-items: center;
    gap: 1.5cqw;
    min-height: 7.2cqw;
    border-radius: .85cqw;
    background: rgba(222, 218, 207, .78);
    padding: 1.2cqw 2.0cqw;
    font-family: var(--sans);
  }

  .next-chapter-closing-icon {
    display: grid;
    place-items: center;
    width: 5.2cqw;
    height: 5.2cqw;
    border-radius: 50%;
    background: #17451E;
    color: #F8F4ED;
  }

  .next-chapter-closing-icon svg {
    width: 3.05cqw;
    height: 3.05cqw;
  }

  .next-chapter-closing p {
    margin: 0;
    max-width: 52cqw;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 2.0cqw;
    font-style: italic;
    line-height: 1.18;
    color: #17371A;
  }

  .next-chapter-bottom-note {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 2.0cqw;
    z-index: 5;
    text-align: center;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 1.35cqw;
    font-style: italic;
    line-height: 1;
    color: #17371A;
  }

  .next-chapter-page-number {
    position: absolute;
    right: 5.4cqw;
    bottom: 3.25cqw;
    z-index: 5;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: .8cqw;
    font-family: var(--sans);
    font-size: 1.05cqw;
    font-weight: 600;
    line-height: 1;
    color: rgba(20, 38, 14, .72);
  }

  .next-chapter-page-number::after {
    content: "";
    width: 2.8cqw;
    height: 1px;
    background: rgba(20, 38, 14, .58);
  }

  @media (min-width: 821px) {
    .ebook-smart-snacks-ingredients-page,
    .ebook-smart-snacks-cards-page,
    .ebook-nourishing-beverages-page,
    .ebook-grocery-essentials-page,
    .ebook-fruit-catalog-page,
    .ebook-vegetable-catalog-page,
    .ebook-action-plan-page,
    .ebook-next-chapter-page {
      --recipe-next-stage-x: clamp(48px, 7vw, 120px);
      --recipe-next-stage-y: clamp(18px, 3svh, 34px);
      min-height: 100svh;
      padding: var(--recipe-next-stage-y) var(--recipe-next-stage-x);
      place-items: center;
    }

    .ebook-smart-snacks-ingredients-sheet,
    .ebook-smart-snacks-cards-sheet {
      width: min(
        calc(100vw - (var(--recipe-next-stage-x) * 2)),
        calc((100svh - (var(--recipe-next-stage-y) * 2)) * .7075788),
        1055px
      );
      min-height: 0;
      aspect-ratio: 1055 / 1491;
      box-shadow: 0 24px 70px rgba(38, 33, 27, .18);
    }

    .ebook-nourishing-beverages-sheet,
    .ebook-grocery-essentials-sheet,
    .ebook-fruit-catalog-sheet,
    .ebook-vegetable-catalog-sheet,
    .ebook-action-plan-sheet,
    .ebook-next-chapter-sheet {
      width: min(
        calc(100vw - (var(--recipe-next-stage-x) * 2)),
        calc((100svh - (var(--recipe-next-stage-y) * 2)) * .6666667),
        1024px
      );
      min-height: 0;
      aspect-ratio: 1024 / 1536;
      box-shadow: 0 24px 70px rgba(38, 33, 27, .18);
    }
  }

  @media (max-width: 0px) {
    .ebook-action-plan-sheet {
      min-height: 100svh;
      padding: 30px 26px 78px;
      background: #F8F4ED;
    }
    .action-plan-photo {
      object-position: center top;
      opacity: .22;
    }
    .action-plan-paper-wash {
      background:
        linear-gradient(180deg, #F8F4ED 0%, rgba(248,244,237,.96) 42%, rgba(248,244,237,.9) 100%),
        linear-gradient(90deg, rgba(248,244,237,.96), rgba(248,244,237,.82));
    }
    .action-plan-top-mark {
      left: 24px;
      top: 30px;
      width: 24px;
      height: 36px;
    }
    .action-plan-topline {
      left: 62px;
      top: 39px;
      max-width: calc(100vw - 88px);
      overflow: hidden;
      font-size: 10px;
      letter-spacing: .24em;
    }
    .action-plan-topline span {
      margin: 0 10px;
    }
    .action-plan-copy,
    .action-plan-calendar-note,
    .action-plan-principles,
    .action-plan-week-grid,
    .action-plan-footer,
    .action-plan-bottom-note,
    .action-plan-page-number {
      position: relative;
      left: auto;
      right: auto;
      top: auto;
      bottom: auto;
      width: auto;
      height: auto;
    }
    .action-plan-copy {
      margin-top: 118px;
    }
    .action-plan-section-badge {
      min-width: 104px;
      height: 30px;
      border-radius: 6px;
      padding: 0 12px;
      font-size: 12px;
    }
    .action-plan-copy h2 {
      margin-top: 22px;
      font-size: clamp(48px, 14vw, 68px);
      line-height: .98;
    }
    .action-plan-divider {
      margin-top: 24px;
      gap: 12px;
    }
    .action-plan-divider i {
      width: 48px;
    }
    .action-plan-divider .section-divider-leaf {
      width: 30px;
      height: 14px;
    }
    .action-plan-copy h3 {
      margin-top: 28px;
      font-size: 18px;
    }
    .action-plan-copy p {
      max-width: 330px;
      margin-top: 8px;
      font-size: 15px;
      line-height: 1.6;
    }
    .action-plan-calendar-note {
      justify-items: start;
      margin-top: 28px;
      text-align: left;
    }
    .action-plan-calendar-note strong {
      font-size: 76px;
    }
    .action-plan-calendar-note span {
      margin-top: 8px;
      font-size: 14px;
      line-height: 1.35;
    }
    .action-plan-calendar-note .section-divider-leaf {
      width: 30px;
      height: 14px;
      margin-top: 14px;
    }
    .action-plan-principles {
      display: grid;
      grid-template-columns: 1fr;
      gap: 12px;
      margin-top: 30px;
    }
    .action-plan-principles p {
      max-width: none;
      border: 1px solid rgba(220, 208, 189, .78);
      border-radius: 12px;
      background: rgba(251, 247, 239, .82);
      padding: 14px 16px;
      font-size: 14px;
      line-height: 1.5;
    }
    .action-plan-week-grid {
      display: grid;
      grid-template-rows: auto;
      gap: 18px;
      margin-top: 30px;
    }
    .action-plan-week-row {
      grid-template-columns: 1fr;
      border: 1px solid rgba(220, 208, 189, .78);
      border-radius: 14px;
      background: rgba(251, 247, 239, .86);
      overflow: hidden;
    }
    .action-plan-week-card {
      background: #2E5B25;
      padding: 20px;
    }
    .action-plan-week-card span {
      font-size: 14px;
    }
    .action-plan-week-card strong {
      margin-top: 14px;
      font-size: 24px;
    }
    .action-plan-week-card em {
      margin-top: 10px;
      font-size: 15px;
    }
    .action-plan-week-card p {
      margin-top: 12px;
      font-size: 13px;
      line-height: 1.45;
    }
    .action-plan-days,
    .action-plan-week-row:nth-child(4) .action-plan-days {
      display: grid;
      grid-template-columns: 1fr;
    }
    .action-plan-day {
      display: grid;
      justify-items: start;
      border-bottom: 1px solid rgba(220, 208, 189, .78);
      padding: 16px 20px;
      text-align: left;
    }
    .action-plan-day:last-child {
      border-bottom: 0;
    }
    .action-plan-day h3 {
      font-size: 12px;
      letter-spacing: .12em;
    }
    .action-plan-day p,
    .action-plan-week-row:nth-child(4) .action-plan-day p {
      max-width: none;
      min-height: 0;
      margin-top: 8px;
      font-size: 14px;
      line-height: 1.5;
    }
    .action-plan-footer {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
      margin-top: 28px;
    }
    .action-plan-remember,
    .action-plan-tips {
      border-radius: 14px;
      background: rgba(222, 218, 207, .78);
      padding: 20px;
      text-align: left;
    }
    .action-plan-remember h3,
    .action-plan-tips h3 {
      font-size: 14px;
      line-height: 1.35;
      letter-spacing: .2em;
      text-transform: uppercase;
    }
    .action-plan-remember p {
      max-width: none;
      margin-top: 12px;
      font-size: 14px;
      line-height: 1.6;
    }
    .action-plan-tips > div {
      grid-template-columns: 1fr;
      gap: 10px;
      margin-top: 14px;
    }
    .action-plan-tips p {
      padding-top: 0;
      font-size: 13px;
      line-height: 1.45;
    }
    .action-plan-bottom-note {
      margin-top: 34px;
      font-size: 20px;
    }
    .action-plan-page-number {
      justify-content: center;
      margin-top: 34px;
      transform: none;
      flex-direction: row;
      font-size: 14px;
      gap: 14px;
    }
    .action-plan-page-number::before,
    .action-plan-page-number::after {
      content: "";
      width: 16px;
      height: 1px;
      background: rgba(20, 38, 14, .72);
    }
    .ebook-next-chapter-sheet {
      min-height: 100svh;
      padding: 30px 26px 78px;
      background: #F8F4ED;
    }
    .next-chapter-photo {
      object-position: center top;
      opacity: .2;
    }
    .next-chapter-paper-wash {
      background:
        linear-gradient(180deg, #F8F4ED 0%, rgba(248,244,237,.96) 42%, rgba(248,244,237,.9) 100%),
        linear-gradient(90deg, rgba(248,244,237,.96), rgba(248,244,237,.82));
    }
    .next-chapter-top-mark {
      left: 24px;
      top: 30px;
      width: 24px;
      height: 36px;
    }
    .next-chapter-topline {
      left: 62px;
      top: 39px;
      max-width: calc(100vw - 88px);
      overflow: hidden;
      font-size: 10px;
      letter-spacing: .24em;
    }
    .next-chapter-topline span {
      margin: 0 10px;
    }
    .next-chapter-top-rule {
      left: 62px;
      right: 24px;
      top: 70px;
    }
    .next-chapter-copy,
    .next-chapter-steps,
    .next-chapter-faqs,
    .next-chapter-closing,
    .next-chapter-bottom-note,
    .next-chapter-page-number {
      position: relative;
      left: auto;
      right: auto;
      top: auto;
      bottom: auto;
      width: auto;
      height: auto;
    }
    .next-chapter-copy {
      margin-top: 118px;
    }
    .next-chapter-section-badge {
      min-width: 104px;
      height: 30px;
      border-radius: 6px;
      padding: 0 12px;
      font-size: 12px;
    }
    .next-chapter-copy h2 {
      margin-top: 22px;
      font-size: clamp(48px, 14vw, 68px);
      line-height: .98;
    }
    .next-chapter-divider {
      margin-top: 24px;
      gap: 12px;
    }
    .next-chapter-divider i {
      width: 48px;
    }
    .next-chapter-divider .section-divider-leaf {
      width: 30px;
      height: 14px;
    }
    .next-chapter-copy p {
      max-width: 360px;
      margin-top: 24px;
      font-size: 15px;
      line-height: 1.7;
    }
    .next-chapter-steps {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
      margin-top: 34px;
    }
    .next-chapter-step {
      min-height: 0;
      border-radius: 14px;
      padding: 22px 20px;
    }
    .next-chapter-step-icon {
      width: 46px;
      height: 46px;
    }
    .next-chapter-step-icon svg {
      width: 26px;
      height: 26px;
    }
    .next-chapter-step span {
      margin-top: 16px;
      font-size: 11px;
    }
    .next-chapter-step h3 {
      margin-top: 10px;
      font-size: 12px;
      letter-spacing: .28em;
    }
    .next-chapter-step p {
      margin-top: 12px;
      font-size: 14px;
      line-height: 1.6;
    }
    .next-chapter-faqs {
      margin-top: 34px;
    }
    .next-chapter-faqs > h3 {
      font-size: 12px;
      line-height: 1.45;
      letter-spacing: .28em;
    }
    .next-chapter-faqs > div {
      gap: 14px;
      margin-top: 18px;
    }
    .next-chapter-faq {
      border-radius: 14px;
      border: 1px solid rgba(220, 208, 189, .78);
      background: rgba(251, 247, 239, .86);
      padding: 18px;
    }
    .next-chapter-faq h4 {
      font-size: 15px;
    }
    .next-chapter-faq p {
      margin-top: 10px;
      font-size: 14px;
      line-height: 1.55;
    }
    .next-chapter-closing {
      grid-template-columns: 46px 1fr;
      gap: 14px;
      margin-top: 28px;
      border-radius: 14px;
      padding: 20px;
    }
    .next-chapter-closing-icon {
      width: 46px;
      height: 46px;
    }
    .next-chapter-closing-icon svg {
      width: 28px;
      height: 28px;
    }
    .next-chapter-closing p {
      max-width: none;
      font-size: 22px;
    }
    .next-chapter-bottom-note {
      margin-top: 34px;
      font-size: 20px;
    }
    .next-chapter-page-number {
      justify-content: center;
      margin-top: 34px;
      transform: none;
      flex-direction: row;
      font-size: 14px;
      gap: 14px;
    }
    .next-chapter-page-number::before,
    .next-chapter-page-number::after {
      content: "";
      width: 16px;
      height: 1px;
      background: rgba(20, 38, 14, .72);
    }
  }

  @media (max-width: 0px) {
    .ebook-content .compare { grid-template-columns: 1fr; }
    .ebook-content .pillars { grid-template-columns: 1fr; }
    .ebook-smart-snacks-ingredients-sheet,
    .ebook-smart-snacks-cards-sheet,
    .ebook-nourishing-beverages-sheet,
    .ebook-grocery-essentials-sheet,
    .ebook-fruit-catalog-sheet,
    .ebook-vegetable-catalog-sheet {
      min-height: 100svh;
      padding: 30px 26px 78px;
      background: #F8F4ED;
    }
    .smart-snacks-ingredients-photo,
    .smart-snacks-cards-photo,
    .nourishing-beverages-photo,
    .grocery-essentials-photo,
    .fruit-catalog-photo,
    .vegetable-catalog-photo {
      object-position: center top;
      opacity: .24;
    }
    .smart-snacks-ingredients-paper-wash,
    .smart-snacks-cards-paper-wash,
    .nourishing-beverages-paper-wash,
    .grocery-essentials-paper-wash,
    .fruit-catalog-paper-wash,
    .vegetable-catalog-paper-wash {
      background:
        linear-gradient(180deg, #F8F4ED 0%, rgba(248,244,237,.96) 42%, rgba(248,244,237,.88) 100%),
        linear-gradient(90deg, rgba(248,244,237,.96), rgba(248,244,237,.8));
    }
    .smart-snacks-ingredients-top-mark,
    .smart-snacks-cards-top-mark,
    .nourishing-beverages-top-mark,
    .grocery-essentials-top-mark,
    .fruit-catalog-top-mark,
    .vegetable-catalog-top-mark {
      left: 24px;
      top: 30px;
      width: 24px;
      height: 36px;
    }
    .smart-snacks-ingredients-topline,
    .smart-snacks-cards-topline,
    .nourishing-beverages-topline,
    .grocery-essentials-topline,
    .fruit-catalog-topline,
    .vegetable-catalog-topline {
      left: 62px;
      top: 39px;
      max-width: calc(100vw - 88px);
      overflow: hidden;
      font-size: 10px;
      letter-spacing: .24em;
    }
    .smart-snacks-ingredients-topline span,
    .smart-snacks-cards-topline span,
    .nourishing-beverages-topline span,
    .grocery-essentials-topline span,
    .fruit-catalog-topline span,
    .vegetable-catalog-topline span {
      margin: 0 10px;
    }
    .smart-snacks-ingredients-copy,
    .smart-snacks-cards-copy,
    .nourishing-beverages-copy,
    .grocery-essentials-copy,
    .fruit-catalog-copy,
    .vegetable-catalog-copy,
    .smart-snacks-ingredient-columns,
    .smart-snacks-ingredients-footer,
    .smart-snacks-feature-row,
    .smart-snacks-recipe-cards,
    .smart-snacks-benefits-row,
    .nourishing-beverages-feature-row,
    .nourishing-beverages-cards,
    .nourishing-beverages-benefits-row,
    .grocery-essentials-badge,
    .grocery-essentials-page-label,
    .grocery-essentials-grid,
    .grocery-essentials-benefits-row,
    .fruit-catalog-badge,
    .fruit-catalog-grid,
    .fruit-catalog-benefits-row,
    .vegetable-catalog-grid,
    .vegetable-catalog-benefits-row,
    .smart-snacks-ingredients-page-number,
    .smart-snacks-cards-page-number,
    .nourishing-beverages-page-number,
    .grocery-essentials-page-number,
    .fruit-catalog-page-number,
    .vegetable-catalog-page-number {
      position: relative;
      left: auto;
      right: auto;
      top: auto;
      bottom: auto;
      width: auto;
      height: auto;
    }
    .smart-snacks-ingredients-copy,
    .smart-snacks-cards-copy,
    .nourishing-beverages-copy,
    .grocery-essentials-copy,
    .fruit-catalog-copy,
    .vegetable-catalog-copy {
      margin-top: 118px;
    }
    .smart-snacks-ingredients-copy h2,
    .smart-snacks-cards-copy h2,
    .nourishing-beverages-copy h2,
    .grocery-essentials-copy h2,
    .fruit-catalog-copy h2,
    .vegetable-catalog-copy h2 {
      font-size: clamp(48px, 14vw, 68px);
      line-height: .98;
    }
    .smart-snacks-ingredients-divider,
    .smart-snacks-cards-divider,
    .nourishing-beverages-divider,
    .grocery-essentials-divider,
    .fruit-catalog-divider,
    .vegetable-catalog-divider {
      margin-top: 24px;
      gap: 12px;
    }
    .smart-snacks-ingredients-divider i,
    .smart-snacks-cards-divider i,
    .nourishing-beverages-divider i,
    .grocery-essentials-divider i,
    .fruit-catalog-divider i,
    .vegetable-catalog-divider i {
      width: 48px;
    }
    .smart-snacks-ingredients-divider .section-divider-leaf,
    .smart-snacks-cards-divider .section-divider-leaf,
    .nourishing-beverages-divider .section-divider-leaf,
    .grocery-essentials-divider .section-divider-leaf,
    .fruit-catalog-divider .section-divider-leaf,
    .vegetable-catalog-divider .section-divider-leaf {
      width: 30px;
      height: 14px;
    }
    .smart-snacks-ingredients-copy p,
    .smart-snacks-cards-copy p,
    .nourishing-beverages-copy p,
    .grocery-essentials-copy p,
    .fruit-catalog-copy p,
    .vegetable-catalog-copy p,
    .nourishing-beverages-copy .nourishing-beverages-lead {
      max-width: 360px;
      margin-top: 24px;
      font-size: 15px;
      line-height: 1.7;
    }
    .nourishing-beverages-copy .nourishing-beverages-lead {
      font-size: 25px;
      line-height: 1.2;
    }
    .smart-snacks-ingredient-columns,
    .smart-snacks-recipe-cards,
    .nourishing-beverages-cards,
    .grocery-essentials-grid,
    .fruit-catalog-grid,
    .vegetable-catalog-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
      margin-top: 34px;
    }
    .smart-snacks-ingredient-column,
    .smart-snacks-recipe-card,
    .nourishing-beverage-card,
    .grocery-essentials-card,
    .fruit-catalog-card,
    .vegetable-catalog-card {
      min-height: 0;
      border: 1px solid rgba(220, 208, 189, .78);
      border-radius: 14px;
      background: rgba(251, 247, 239, .86);
      padding: 22px 20px;
      text-align: left;
    }
    .smart-snacks-ingredient-column h3,
    .smart-snacks-recipe-card h3,
    .nourishing-beverage-card h3 {
      min-height: 0;
      max-width: none;
      margin: 0;
      font-size: 32px;
      line-height: 1.08;
      text-align: left;
    }
    .smart-snacks-ingredient-column > i,
    .smart-snacks-recipe-rule,
    .nourishing-beverage-card > i {
      width: 44px;
      margin: 18px 0;
    }
    .smart-snacks-ingredient-column h4,
    .smart-snacks-recipe-card h4,
    .nourishing-beverage-card h4 {
      font-size: 11px;
      letter-spacing: .3em;
    }
    .smart-snacks-ingredient-column ul,
    .smart-snacks-recipe-card ul,
    .nourishing-beverage-card ul {
      display: grid;
      grid-template-columns: 1fr;
      gap: 8px;
      margin: 16px 0 0;
      padding-left: 18px;
      text-align: left;
      list-style: disc;
    }
    .smart-snacks-ingredient-column li,
    .smart-snacks-recipe-card li,
    .nourishing-beverage-card li {
      min-height: 0;
      padding-left: 0;
      font-size: 14px;
      line-height: 1.45;
    }
    .smart-snacks-ingredients-footer,
    .nourishing-beverages-benefits-row,
    .grocery-essentials-benefits-row,
    .fruit-catalog-benefits-row,
    .vegetable-catalog-benefits-row {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
      margin-top: 28px;
      border-radius: 14px;
      background: rgba(222, 218, 207, .78);
      padding: 20px;
    }
    .smart-snacks-ingredients-footer-title,
    .nourishing-beverages-benefit-lead,
    .grocery-essentials-benefit-lead,
    .fruit-catalog-benefit-lead,
    .vegetable-catalog-benefit-lead {
      padding: 0;
      color: #17371A;
    }
    .smart-snacks-ingredients-footer-title h3,
    .nourishing-beverages-benefit-lead h3,
    .grocery-essentials-benefit-lead h3,
    .fruit-catalog-benefit-lead h3,
    .vegetable-catalog-benefit-lead h3 {
      font-size: 12px;
      line-height: 1.45;
      letter-spacing: .26em;
    }
    .smart-snacks-ingredients-footer-title p,
    .nourishing-beverages-benefit-lead p,
    .grocery-essentials-benefit-lead p,
    .fruit-catalog-benefit-lead p,
    .vegetable-catalog-benefit-lead p {
      max-width: none;
      margin-top: 12px;
      font-size: 14px;
      line-height: 1.6;
    }
    .smart-snacks-ingredients-footer-features,
    .smart-snacks-feature-row,
    .smart-snacks-benefits-grid,
    .nourishing-beverages-feature-row,
    .nourishing-beverages-benefits-grid,
    .grocery-essentials-benefits-grid,
    .fruit-catalog-benefits-grid,
    .vegetable-catalog-benefits-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px;
      margin-top: 18px;
      padding: 0;
    }
    .smart-snacks-feature,
    .nourishing-beverages-feature,
    .smart-snacks-benefit,
    .nourishing-beverages-benefit,
    .grocery-essentials-benefit,
    .fruit-catalog-benefit,
    .vegetable-catalog-benefit {
      min-height: 0;
      border: 1px solid rgba(220, 208, 189, .66);
      border-radius: 12px;
      background: rgba(251, 247, 239, .74);
      padding: 16px;
    }
    .smart-snacks-feature h3,
    .nourishing-beverages-feature h3,
    .smart-snacks-benefits-row h3 {
      margin: 0;
      font-size: 11px;
      line-height: 1.4;
      letter-spacing: .25em;
    }
    .smart-snacks-feature p,
    .nourishing-beverages-feature p {
      max-width: none;
      margin-top: 10px;
      font-size: 13px;
      line-height: 1.5;
    }
    .smart-snacks-recipe-badge,
    .nourishing-beverage-badge {
      display: grid;
      place-items: center;
      width: 46px;
      height: 46px;
      margin-bottom: 16px;
      border-radius: 50%;
      background: #17451E;
      color: #F8F4ED;
    }
    .smart-snacks-recipe-badge svg,
    .nourishing-beverage-badge svg {
      width: 28px;
      height: 28px;
    }
    .smart-snacks-recipe-card > p,
    .nourishing-beverage-card > p {
      max-width: none;
      margin-top: 12px;
      font-size: 14px;
      line-height: 1.6;
      text-align: left;
    }
    .smart-snacks-recipe-metrics,
    .nourishing-beverage-metrics {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 10px;
      margin-top: 18px;
    }
    .smart-snacks-recipe-metric svg,
    .nourishing-beverage-metric svg,
    .smart-snacks-benefit-icon svg,
    .nourishing-beverages-benefit svg,
    .grocery-essentials-benefit svg,
    .fruit-catalog-benefit svg,
    .vegetable-catalog-benefit svg {
      width: 24px;
      height: 24px;
    }
    .smart-snacks-recipe-metric span,
    .nourishing-beverage-metric span {
      font-size: 9px;
      letter-spacing: .16em;
    }
    .smart-snacks-recipe-metric strong,
    .nourishing-beverage-metric strong,
    .smart-snacks-benefit span,
    .nourishing-beverages-benefit span,
    .grocery-essentials-benefit span,
    .fruit-catalog-benefit span,
    .vegetable-catalog-benefit span {
      max-width: none;
      font-size: 12px;
      line-height: 1.35;
    }
    .grocery-essentials-badge,
    .fruit-catalog-badge,
    .grocery-essentials-page-label {
      display: none;
    }
    .grocery-essentials-card h3,
    .fruit-catalog-card-copy h3,
    .vegetable-catalog-card h3 {
      margin: 0;
      font-size: 18px;
      line-height: 1.25;
      letter-spacing: .16em;
    }
    .grocery-essentials-items {
      margin-top: 18px;
      gap: 14px;
    }
    .grocery-essentials-item,
    .grocery-essentials-summary {
      min-height: 0;
      padding-left: 0;
    }
    .grocery-essentials-item strong {
      font-size: 16px;
    }
    .grocery-essentials-item p,
    .grocery-essentials-summary p,
    .fruit-catalog-card-copy p,
    .vegetable-catalog-card p {
      max-width: none;
      margin-top: 8px;
      font-size: 13px;
      line-height: 1.55;
    }
    .fruit-catalog-card {
      padding: 20px;
    }
    .fruit-catalog-card-copy i {
      width: 44px;
      margin: 12px 0;
    }
    .fruit-catalog-tags {
      position: relative;
      left: auto;
      right: auto;
      bottom: auto;
      grid-template-columns: 1fr;
      gap: 8px;
      margin-top: 16px;
    }
    .fruit-catalog-tags span {
      justify-content: flex-start;
      font-size: 12px;
    }
    .fruit-catalog-tags svg {
      width: 18px;
      height: 18px;
    }
    .vegetable-catalog-card {
      justify-items: start;
      align-content: start;
      text-align: left;
    }
    .smart-snacks-ingredients-bottom-note,
    .smart-snacks-cards-bottom-note,
    .nourishing-beverages-bottom-note,
    .grocery-essentials-bottom-note,
    .fruit-catalog-bottom-note,
    .vegetable-catalog-bottom-note {
      position: relative;
      margin-top: 36px;
      bottom: auto;
      font-size: 20px;
    }
    .smart-snacks-ingredients-page-number,
    .smart-snacks-cards-page-number,
    .nourishing-beverages-page-number,
    .grocery-essentials-page-number,
    .fruit-catalog-page-number,
    .vegetable-catalog-page-number {
      justify-content: center;
      margin-top: 34px;
      transform: none;
      flex-direction: row;
      font-size: 14px;
      gap: 14px;
    }
    .smart-snacks-ingredients-page-number::before,
    .smart-snacks-cards-page-number::before,
    .nourishing-beverages-page-number::before,
    .grocery-essentials-page-number::before,
    .fruit-catalog-page-number::before,
    .vegetable-catalog-page-number::before,
    .smart-snacks-ingredients-page-number::after,
    .smart-snacks-cards-page-number::after,
    .nourishing-beverages-page-number::after,
    .grocery-essentials-page-number::after,
    .fruit-catalog-page-number::after,
    .vegetable-catalog-page-number::after {
      content: "";
      width: 16px;
      height: 1px;
      background: rgba(20, 38, 14, .72);
    }
    .ebook-cover-photo {
      object-position: 58% center;
    }
    .ebook-cover-wash {
      background:
        linear-gradient(180deg, rgba(249, 246, 237, .92) 0%, rgba(249, 246, 237, .78) 46%, rgba(249, 246, 237, .18) 82%),
        linear-gradient(90deg, rgba(249, 246, 237, .66) 0%, rgba(249, 246, 237, .08) 100%);
    }
    .ebook-cover-sheet {
      min-height: 100svh;
    }
    .ebook-cover-content {
      width: calc(100% - 40px);
      margin-left: 20px;
      padding-top: 28px;
      padding-bottom: 64px;
    }
    .cover-section-label {
      gap: 16px;
      font-size: 11px;
      max-width: 330px;
    }
    .cover-title {
      margin-top: 58px;
      max-width: 330px;
      font-size: 55px;
    }
    .cover-kicker {
      margin-top: 22px;
      max-width: 300px;
      font-size: 14px;
    }
    .cover-personalization {
      max-width: 280px;
      font-size: 16px;
    }
    .cover-brand {
      padding-top: 28px;
    }
    .cover-brand-name {
      font-size: 46px;
    }
    .cover-brand-subtitle {
      max-width: 250px;
      font-size: 10px;
    }
    .cover-quote {
      max-width: 240px;
      font-size: 22px;
    }
    .ebook-note-sheet {
      min-height: 100svh;
      background:
        linear-gradient(90deg, rgba(241, 237, 228, .96) 0%, rgba(251, 248, 240, .92) 70%, rgba(251, 248, 240, .38) 100%),
        #FBF8F0;
    }
    .note-watermark {
      left: -214px;
      top: 50%;
      width: 560px;
      font-size: 104px;
    }
    .note-topline {
      left: 28px;
      top: 30px;
      max-width: calc(100% - 56px);
      overflow: hidden;
      font-size: 10px;
      letter-spacing: .32em;
    }
    .note-topline span {
      margin: 0 12px;
    }
    .note-copy {
      left: 28px;
      top: 104px;
      width: min(78vw, 350px);
    }
    .note-chapter-number {
      font-size: 82px;
    }
    .note-chapter-label {
      margin-top: 46px;
      font-size: 11px;
    }
    .note-rule {
      width: 34px;
      margin-top: 16px;
    }
    .note-copy h2 {
      margin-top: 28px;
      font-size: 45px;
    }
    .note-body {
      margin-top: 42px;
    }
    .note-body p {
      margin-bottom: 26px;
      font-size: 15px;
      line-height: 1.72;
    }
    .note-lede::first-letter {
      padding: 2px 8px 0 0;
      font-size: 70px;
    }
    .note-image-panel {
      width: 44%;
      opacity: .34;
    }
    .note-page-number {
      bottom: 24px;
      font-size: 14px;
    }
    .ebook-snapshot-sheet {
      min-height: 100svh;
      background: #FBF7EF;
    }
    .snapshot-topline {
      left: 26px;
      top: 30px;
      max-width: calc(100% - 52px);
      overflow: hidden;
      font-size: 10px;
    }
    .snapshot-topline span {
      margin: 0 10px;
    }
    .snapshot-left,
    .snapshot-right {
      position: relative;
      left: auto;
      top: auto;
      width: calc(100% - 52px);
      margin-left: 26px;
      margin-right: 26px;
    }
    .snapshot-left {
      padding-top: 92px;
    }
    .snapshot-left h2 {
      font-size: 52px;
    }
    .snapshot-title-rule {
      width: 34px;
      margin-top: 22px;
    }
    .snapshot-side-label {
      margin-top: 38px;
      font-size: 11px;
    }
    .snapshot-concern-list {
      margin-top: 22px;
    }
    .snapshot-concern {
      grid-template-columns: 56px 1fr;
      gap: 16px;
      min-height: 0;
      padding: 18px 0;
    }
    .snapshot-icon-wrap {
      width: 46px;
      height: 46px;
    }
    .snapshot-icon-wrap svg {
      width: 30px;
      height: 30px;
    }
    .snapshot-concern h3 {
      font-size: 22px;
    }
    .snapshot-concern p {
      font-size: 13px;
    }
    .snapshot-concern .snapshot-role {
      font-size: 10px;
    }
    .snapshot-brand {
      margin-top: 34px;
    }
    .snapshot-brand div {
      font-size: 48px;
    }
    .snapshot-brand span {
      font-size: 10px;
    }
    .snapshot-spine {
      display: none;
    }
    .snapshot-right {
      padding: 56px 0 92px;
    }
    .snapshot-summary-label {
      font-size: 11px;
    }
    .snapshot-summary-rule {
      width: 34px;
      margin-top: 16px;
    }
    .snapshot-right blockquote {
      max-width: 330px;
      margin-top: 34px;
      padding-left: 22px;
      font-size: 32px;
    }
    .snapshot-right blockquote span {
      left: -2px;
      top: -6px;
      font-size: 52px;
    }
    .snapshot-ornament {
      gap: 12px;
      margin-top: 34px;
      margin-left: 0;
    }
    .snapshot-ornament i {
      width: 74px;
    }
    .snapshot-ornament .cover-leaf {
      width: 22px;
      height: 36px;
    }
    .snapshot-paragraphs {
      width: min(100%, 350px);
      margin-top: 36px;
    }
    .snapshot-paragraphs p {
      margin-bottom: 22px;
      font-size: 15px;
      line-height: 1.68;
    }
    .snapshot-page-number {
      bottom: 24px;
      font-size: 14px;
    }
    .ebook-findings-sheet {
      min-height: 100svh;
      background: #F7F1E8;
    }
    .findings-background {
      display: none;
    }
    .findings-topline {
      left: 26px;
      top: 30px;
      max-width: calc(100% - 52px);
      overflow: hidden;
      font-size: 10px;
      letter-spacing: .32em;
    }
    .findings-topline span {
      margin: 0 10px;
    }
    .findings-left {
      position: relative;
      left: auto;
      top: auto;
      width: calc(100% - 52px);
      margin: 0 26px;
      padding-top: 110px;
    }
    .findings-left h2 {
      font-size: 58px;
    }
    .findings-kicker {
      margin-top: 28px;
      font-size: 11px;
      line-height: 1.8;
      letter-spacing: .34em;
    }
    .findings-takeaway-label {
      margin-top: 64px;
      font-size: 11px;
      letter-spacing: .34em;
    }
    .findings-left blockquote {
      max-width: 330px;
      margin-top: 24px;
      font-size: 33px;
    }
    .findings-left p {
      width: min(100%, 330px);
      margin-top: 42px;
      font-size: 15px;
    }
    .findings-brand {
      position: relative;
      top: auto;
      margin-top: 52px;
    }
    .findings-brand div {
      font-size: 48px;
    }
    .findings-brand span {
      font-size: 10px;
    }
    .findings-card-stack {
      position: relative;
      left: auto;
      top: auto;
      width: calc(100% - 52px);
      margin: 48px 26px 96px;
      gap: 18px;
    }
    .finding-card {
      min-height: 190px;
      height: auto;
      border-radius: 14px;
      border: 1px solid rgba(38, 33, 27, .13);
      background: rgba(251, 248, 240, .45);
    }
    .finding-card-copy {
      position: relative;
      left: auto;
      top: auto;
      width: auto;
      padding: 28px;
    }
    .finding-priority {
      font-size: 10px;
    }
    .finding-card h3 {
      margin-top: 18px;
      font-size: 28px;
    }
    .finding-card p {
      margin-top: 12px;
      font-size: 14px;
    }
    .findings-page-number {
      bottom: 24px;
      font-size: 14px;
      gap: 8px;
    }
    .findings-page-number i {
      width: 16px;
    }
    .ebook-focus-sheet {
      min-height: 100svh;
      padding: 30px 26px 84px;
      background: #F7F2EA;
    }
    .focus-topline {
      position: relative;
      left: auto;
      top: auto;
      max-width: calc(100vw - 52px);
      overflow: hidden;
      font-size: 10px;
      letter-spacing: .32em;
    }
    .focus-topline span {
      margin: 0 10px;
    }
    .focus-top-rule {
      left: 26px;
      right: 26px;
      top: 58px;
    }
    .focus-top-sprig {
      width: 48px;
      height: 62px;
      right: 20px;
      top: 24px;
      opacity: .55;
    }
    .focus-hero,
    .focus-intro,
    .focus-card-grid,
    .focus-remember,
    .focus-page-number {
      position: relative;
      left: auto;
      right: auto;
      top: auto;
      bottom: auto;
      width: auto;
    }
    .focus-hero {
      margin-top: 80px;
    }
    .focus-hero h2 {
      font-size: 58px;
      line-height: .95;
    }
    .focus-title-rule {
      width: 44px;
      margin-top: 28px;
    }
    .focus-kicker {
      margin-top: 28px;
      font-size: 11px;
      line-height: 1.8;
      letter-spacing: .34em;
    }
    .focus-intro {
      margin-top: 44px;
      font-size: 15px;
      line-height: 1.72;
    }
    .focus-card-grid {
      margin-top: 48px;
      grid-template-columns: 1fr;
      gap: 18px;
    }
    .focus-card {
      min-height: 0;
      border-radius: 14px;
      padding: 28px 24px;
    }
    .focus-card-eyebrow {
      font-size: 10px;
      letter-spacing: .34em;
    }
    .focus-card-heading {
      grid-template-columns: 64px 1fr;
      gap: 18px;
      margin-top: 28px;
    }
    .focus-icon-medallion {
      width: 62px;
      height: 62px;
    }
    .focus-icon-medallion svg {
      width: 38px;
      height: 38px;
    }
    .focus-card h3 {
      max-width: 210px;
      font-size: 31px;
    }
    .focus-card-status {
      margin: 20px 0 0 82px;
      font-size: 11px;
      letter-spacing: .32em;
    }
    .focus-progress {
      height: 6px;
      margin-top: 28px;
    }
    .focus-progress span::after {
      width: 11px;
      height: 11px;
    }
    .focus-card p {
      margin-top: 24px;
      font-size: 14px;
      line-height: 1.6;
    }
    .focus-remember {
      min-height: 0;
      margin-top: 28px;
      border-radius: 14px;
      gap: 16px;
      padding: 22px;
    }
    .focus-remember-icon {
      width: 52px;
      height: 52px;
    }
    .focus-remember-icon svg {
      width: 24px;
      height: 24px;
    }
    .focus-remember-copy {
      width: auto;
    }
    .focus-remember-copy div {
      font-size: 10px;
      letter-spacing: .34em;
    }
    .focus-remember-copy p {
      margin-top: 12px;
      font-size: 13px;
      line-height: 1.6;
    }
    .focus-remember-sprig {
      display: none;
    }
    .focus-page-number {
      display: grid;
      place-items: center;
      margin-top: 44px;
      transform: none;
      font-size: 14px;
    }
    .ebook-personalized-sheet {
      min-height: 100svh;
      padding: 30px 26px 84px;
      background: #F7F2EA;
    }
    .personalized-topline {
      position: relative;
      left: auto;
      top: auto;
      max-width: calc(100vw - 52px);
      overflow: hidden;
      font-size: 10px;
      letter-spacing: .32em;
    }
    .personalized-topline span {
      margin: 0 10px;
    }
    .personalized-top-rule {
      left: 26px;
      right: 26px;
      top: 58px;
    }
    .personalized-top-sprig {
      width: 48px;
      height: 62px;
      right: 20px;
      top: 24px;
      opacity: .55;
    }
    .personalized-sidebar,
    .personalized-narrative-panel,
    .personalized-page-number {
      position: relative;
      left: auto;
      right: auto;
      top: auto;
      bottom: auto;
      width: auto;
    }
    .personalized-sidebar {
      margin-top: 80px;
    }
    .personalized-sidebar h2 {
      font-size: 58px;
      line-height: .95;
    }
    .personalized-title-rule {
      width: 44px;
      margin-top: 28px;
    }
    .personalized-kicker,
    .personalized-section-label {
      font-size: 11px;
      line-height: 1.8;
      letter-spacing: .34em;
    }
    .personalized-kicker {
      margin-top: 28px;
    }
    .personalized-section-label {
      margin-top: 48px;
    }
    .personalized-profile-card {
      margin-top: 20px;
      border-radius: 14px;
    }
    .personalized-profile-row {
      grid-template-columns: 56px 1fr;
      min-height: 66px;
      padding: 10px 16px;
    }
    .personalized-profile-icon {
      width: 44px;
      height: 44px;
    }
    .personalized-profile-icon svg {
      width: 28px;
      height: 28px;
    }
    .personalized-profile-row div div {
      font-size: 14px;
    }
    .personalized-profile-row p {
      margin-top: 4px;
      font-size: 12px;
    }
    .personalized-concern-label {
      margin-top: 34px;
    }
    .personalized-concern-list {
      margin-top: 18px;
      gap: 8px;
    }
    .personalized-concern {
      min-height: 48px;
      border-radius: 10px;
      gap: 14px;
      padding: 0 16px;
      font-size: 10px;
      letter-spacing: .28em;
    }
    .personalized-concern i {
      width: 8px;
      height: 8px;
    }
    .personalized-bottom-sprig {
      position: relative;
      left: -24px;
      top: auto;
      width: 240px;
      height: 86px;
      margin-top: 28px;
    }
    .personalized-narrative-panel {
      min-height: 0;
      margin-top: 30px;
      border-radius: 18px;
      padding: 42px 28px 34px;
    }
    .personalized-panel-label {
      font-size: 10px;
      line-height: 1.45;
      letter-spacing: .32em;
    }
    .personalized-panel-rule {
      width: 34px;
      margin-top: 18px;
    }
    .personalized-narrative-panel h3 {
      margin-top: 42px;
      font-size: 38px;
      line-height: 1.08;
    }
    .personalized-lead {
      width: auto;
      margin-top: 34px;
      font-size: 14px;
      line-height: 1.7;
    }
    .personalized-quote-mark {
      margin-top: 34px;
      font-size: 52px;
    }
    .personalized-quote-body {
      margin-top: 22px;
      padding-left: 22px;
    }
    .personalized-quote-body p {
      width: auto;
      margin-bottom: 22px;
      font-size: 14px;
      line-height: 1.7;
    }
    .personalized-path {
      position: relative;
      left: auto;
      right: auto;
      bottom: auto;
      grid-template-columns: 52px 1fr;
      gap: 16px;
      margin-top: 38px;
      padding-top: 26px;
    }
    .personalized-path-icon {
      width: 52px;
      height: 52px;
    }
    .personalized-path-icon .cover-leaf {
      width: 22px;
      height: 34px;
    }
    .personalized-path div div {
      font-size: 10px;
      line-height: 1.3;
      letter-spacing: .28em;
    }
    .personalized-path p {
      margin-top: 10px;
      font-size: 13px;
      line-height: 1.6;
    }
    .personalized-page-number {
      display: grid;
      place-items: center;
      margin-top: 44px;
      transform: none;
      font-size: 14px;
    }
    .ebook-glance-sheet {
      min-height: 100svh;
      padding: 30px 26px 84px;
      background: #F7F2EA;
    }
    .glance-topline {
      position: relative;
      left: auto;
      top: auto;
      max-width: calc(100vw - 52px);
      overflow: hidden;
      font-size: 10px;
      letter-spacing: .32em;
    }
    .glance-topline span {
      margin: 0 10px;
    }
    .glance-top-rule {
      left: 26px;
      right: 26px;
      top: 58px;
    }
    .glance-top-sprig {
      width: 48px;
      height: 62px;
      right: 20px;
      top: 24px;
      opacity: .55;
    }
    .glance-hero,
    .glance-card-grid,
    .glance-lower-rule,
    .glance-next,
    .glance-branch,
    .glance-page-number {
      position: relative;
      left: auto;
      right: auto;
      top: auto;
      bottom: auto;
      width: auto;
    }
    .glance-hero {
      margin-top: 80px;
    }
    .glance-hero h2 {
      font-size: 58px;
      line-height: .95;
    }
    .glance-title-rule {
      width: 44px;
      margin-top: 28px;
    }
    .glance-hero p {
      margin-top: 28px;
      font-size: 11px;
      line-height: 1.8;
      letter-spacing: .34em;
    }
    .glance-card-grid {
      margin-top: 52px;
      grid-template-columns: 1fr;
      gap: 18px;
    }
    .glance-card {
      min-height: 0;
      border-radius: 14px;
      padding: 30px 24px;
    }
    .glance-card:not(:last-child)::after {
      display: none;
    }
    .glance-icon-medallion {
      width: 72px;
      height: 72px;
    }
    .glance-icon-medallion svg {
      width: 42px;
      height: 42px;
    }
    .glance-value {
      margin-top: 28px;
      font-size: 70px;
    }
    .glance-card-rule {
      width: 112px;
      margin-top: 22px;
    }
    .glance-card h3 {
      min-height: 0;
      margin-top: 24px;
      font-size: 11px;
      line-height: 1.7;
      letter-spacing: .34em;
    }
    .glance-card p {
      max-width: 260px;
      margin-top: 20px;
      font-size: 14px;
      line-height: 1.65;
    }
    .glance-lower-rule {
      display: block;
      height: 1px;
      margin: 48px -26px 0;
    }
    .glance-next {
      margin-top: 52px;
    }
    .glance-next-label {
      font-size: 11px;
      letter-spacing: .34em;
    }
    .glance-next-rule {
      width: 44px;
      margin-top: 22px;
    }
    .glance-next h3 {
      max-width: 330px;
      margin-top: 28px;
      font-size: 42px;
      line-height: 1.14;
    }
    .glance-next p {
      width: min(100%, 340px);
      margin-top: 24px;
      font-size: 14px;
      line-height: 1.7;
    }
    .glance-cta {
      width: min(100%, 388px);
      height: 58px;
      margin-top: 28px;
      border-radius: 8px;
      padding: 0 28px 0 34px;
      font-size: 12px;
      letter-spacing: .32em;
    }
    .glance-branch {
      width: min(100%, 360px);
      height: 280px;
      margin: 38px 0 0 auto;
      filter: drop-shadow(-20px 26px 18px rgba(57, 66, 47, .12));
    }
    .glance-page-number {
      display: grid;
      place-items: center;
      margin-top: 34px;
      transform: none;
      font-size: 14px;
      gap: 8px;
    }
    .glance-page-number::after {
      width: 16px;
    }
    .ebook-opportunity-sheet {
      min-height: 100svh;
      padding: 30px 26px 84px;
      background: #F6F2EA;
    }
    .opportunity-topline {
      position: relative;
      left: auto;
      top: auto;
      max-width: calc(100vw - 52px);
      overflow: hidden;
      font-size: 10px;
      letter-spacing: .32em;
    }
    .opportunity-topline span {
      margin: 0 10px;
    }
    .opportunity-top-rule {
      left: 26px;
      right: 26px;
      top: 58px;
    }
    .opportunity-top-sprig {
      width: 48px;
      height: 62px;
      right: 20px;
      top: 24px;
      opacity: .55;
    }
    .opportunity-copy,
    .opportunity-visual,
    .opportunity-brand,
    .opportunity-page-number {
      position: relative;
      left: auto;
      right: auto;
      top: auto;
      bottom: auto;
      width: auto;
    }
    .opportunity-copy {
      margin-top: 84px;
    }
    .opportunity-kicker {
      font-size: 24px;
    }
    .opportunity-rule {
      width: 42px;
    }
    .opportunity-rule-short {
      margin-top: 28px;
    }
    .opportunity-number {
      margin-top: 34px;
      font-size: 126px;
      line-height: .76;
    }
    .opportunity-rule-clay {
      margin-top: 36px;
    }
    .opportunity-copy h2 {
      max-width: 100%;
      margin-top: 30px;
      font-size: clamp(38px, 11vw, 54px);
      line-height: 1;
    }
    .opportunity-rule-green {
      margin-top: 32px;
    }
    .opportunity-body {
      margin-top: 30px;
      gap: 22px;
    }
    .opportunity-body p {
      max-width: 340px;
      font-size: 14px;
      line-height: 1.75;
    }
    .opportunity-visual {
      width: 100%;
      height: auto;
      aspect-ratio: 4 / 5;
      margin-top: 32px;
      margin-left: auto;
      overflow: hidden;
      transform: none;
    }
    .opportunity-brand {
      margin-top: 24px;
    }
    .opportunity-brand div {
      font-size: 68px;
    }
    .opportunity-brand span {
      margin-top: 24px;
      font-size: 8px;
      line-height: 1.5;
      letter-spacing: .3em;
    }
    .opportunity-page-number {
      justify-content: center;
      margin-top: 38px;
      transform: none;
      font-size: 14px;
      gap: 14px;
    }
    .opportunity-page-number::before,
    .opportunity-page-number::after {
      width: 16px;
    }
    .ebook-understanding-sheet {
      min-height: 100svh;
    }
    .understanding-photo {
      object-position: center bottom;
    }
    .understanding-wash {
      background:
        linear-gradient(180deg, rgba(246,242,234,.96) 0%, rgba(246,242,234,.92) 34%, rgba(246,242,234,.54) 53%, rgba(246,242,234,.04) 72%, rgba(16,24,14,.32) 100%),
        radial-gradient(circle at 50% 28%, rgba(255,255,255,.6) 0, rgba(255,255,255,0) 34%);
    }
    .understanding-topline {
      left: 26px;
      top: 30px;
      max-width: calc(100vw - 52px);
      overflow: hidden;
      font-size: 10px;
      letter-spacing: .32em;
    }
    .understanding-topline span {
      margin: 0 10px;
    }
    .understanding-top-rule {
      left: 26px;
      right: 26px;
      top: 58px;
    }
    .understanding-top-sprig {
      width: 48px;
      height: 62px;
      right: 20px;
      top: 24px;
      opacity: .55;
    }
    .understanding-title-block {
      top: 150px;
      width: calc(100% - 42px);
    }
    .understanding-section-label {
      font-size: 12px;
      letter-spacing: .42em;
    }
    .understanding-title-block h2 {
      margin-top: 34px;
      font-size: clamp(46px, 13.2vw, 68px);
      line-height: 1.06;
    }
    .understanding-divider {
      margin-top: 34px;
      gap: 18px;
    }
    .understanding-divider i {
      width: 78px;
    }
    .section-divider-leaf {
      width: 38px;
      height: 18px;
    }
    .understanding-page-number {
      bottom: 32px;
      font-size: 14px;
      gap: 14px;
    }
    .understanding-page-number::before,
    .understanding-page-number::after {
      width: 16px;
    }
    .ebook-understanding-detail-sheet {
      min-height: 100svh;
      padding: 30px 26px 72px;
      background: #F6F1E8;
    }
    .understanding-detail-image,
    .understanding-detail-photo-wash,
    .understanding-detail-content,
    .understanding-detail-page-number {
      position: relative;
      left: auto;
      right: auto;
      top: auto;
      bottom: auto;
      width: auto;
    }
    .understanding-detail-topline {
      left: 26px;
      top: 30px;
      max-width: calc(100vw - 52px);
      overflow: hidden;
      font-size: 10px;
      letter-spacing: .32em;
    }
    .understanding-detail-topline span {
      margin: 0 10px;
    }
    .understanding-detail-top-rule {
      left: 26px;
      right: 26px;
      top: 58px;
    }
    .understanding-detail-top-sprig {
      width: 48px;
      height: 62px;
      right: 20px;
      top: 24px;
      opacity: .55;
    }
    .understanding-detail-image {
      height: 430px;
      margin: 78px -26px 0;
      overflow: hidden;
    }
    .understanding-detail-photo {
      object-position: 46% center;
    }
    .understanding-detail-photo-wash {
      display: block;
      height: 0;
      margin: 0;
      background: none;
    }
    .understanding-detail-content {
      margin-top: 46px;
    }
    .understanding-detail-content h2 {
      font-size: clamp(54px, 15vw, 74px);
      line-height: 1.02;
    }
    .understanding-detail-divider {
      margin-top: 30px;
      gap: 16px;
    }
    .understanding-detail-divider i {
      width: min(32vw, 124px);
    }
    .understanding-detail-divider .section-divider-leaf {
      width: 36px;
      height: 17px;
    }
    .understanding-detail-list {
      margin-top: 34px;
      gap: 0;
    }
    .understanding-detail-item {
      grid-template-columns: 64px 12px minmax(0, 1fr);
      column-gap: 18px;
      padding-bottom: 34px;
    }
    .understanding-detail-item + .understanding-detail-item {
      padding-top: 34px;
    }
    .understanding-detail-icon {
      width: 64px;
      height: 64px;
    }
    .understanding-detail-icon svg {
      width: 36px;
      height: 36px;
    }
    .understanding-detail-dot {
      width: 8px;
      height: 8px;
      margin-top: 12px;
    }
    .understanding-detail-item h3 {
      font-size: 11px;
      line-height: 1.45;
      letter-spacing: .32em;
    }
    .understanding-detail-item p {
      max-width: none;
      margin-top: 16px;
      font-size: 14px;
      line-height: 1.7;
    }
    .understanding-detail-page-number {
      justify-content: center;
      margin-top: 44px;
      transform: none;
      font-size: 14px;
      gap: 14px;
    }
    .understanding-detail-page-number::before,
    .understanding-detail-page-number::after {
      width: 16px;
    }
    .ebook-symptom-flow-sheet {
      min-height: 100svh;
      padding: 30px 26px 72px;
      background: #F6F1E8;
    }
    .symptom-flow-media-slot,
    .symptom-flow-content,
    .symptom-flow-page-number {
      position: relative;
      left: auto;
      right: auto;
      top: auto;
      bottom: auto;
      width: auto;
    }
    .symptom-flow-topline {
      left: 26px;
      top: 30px;
      max-width: calc(100vw - 52px);
      overflow: hidden;
      font-size: 10px;
      letter-spacing: .32em;
    }
    .symptom-flow-topline span {
      margin: 0 10px;
    }
    .symptom-flow-top-rule {
      left: 26px;
      right: 26px;
      top: 58px;
    }
    .symptom-flow-top-sprig {
      width: 48px;
      height: 62px;
      right: 20px;
      top: 24px;
      opacity: .55;
    }
    .symptom-flow-media-slot {
      height: 420px;
      margin: 78px -26px 0;
    }
    .symptom-flow-photo {
      object-position: 45% center;
    }
    .symptom-flow-content {
      margin-top: 46px;
    }
    .symptom-flow-content h2 {
      font-size: clamp(52px, 14.5vw, 72px);
      line-height: 1.04;
    }
    .symptom-flow-divider {
      margin-top: 30px;
      gap: 16px;
    }
    .symptom-flow-divider i {
      width: min(32vw, 120px);
    }
    .symptom-flow-divider .section-divider-leaf {
      width: 36px;
      height: 17px;
    }
    .symptom-flow-list {
      margin-top: 36px;
      gap: 26px;
    }
    .symptom-flow-step {
      grid-template-columns: 68px 42px minmax(0, 1fr);
      column-gap: 16px;
      min-height: 0;
    }
    .symptom-flow-icon {
      width: 68px;
      height: 68px;
    }
    .symptom-flow-icon svg {
      width: 38px;
      height: 38px;
    }
    .symptom-flow-connector {
      left: 34px;
      top: 68px;
      height: 24px;
    }
    .symptom-flow-connector::after {
      bottom: -5px;
      border-left-width: 4px;
      border-right-width: 4px;
      border-top-width: 7px;
    }
    .symptom-flow-number {
      padding-top: 10px;
      font-size: 24px;
    }
    .symptom-flow-step-copy {
      padding-top: 10px;
    }
    .symptom-flow-step-copy h3 {
      font-size: 11px;
      line-height: 1.45;
      letter-spacing: .32em;
    }
    .symptom-flow-step-copy p {
      max-width: none;
      margin-top: 14px;
      font-size: 14px;
      line-height: 1.7;
    }
    .symptom-flow-takeaway {
      min-height: 0;
      margin-top: 36px;
      grid-template-columns: 46px minmax(0, 1fr);
      gap: 18px;
      border-radius: 12px;
      padding: 20px 22px;
    }
    .symptom-flow-takeaway-sprig {
      width: 40px;
      height: 52px;
    }
    .symptom-flow-takeaway p {
      font-size: 22px;
      line-height: 1.25;
    }
    .symptom-flow-page-number {
      justify-content: center;
      margin-top: 44px;
      transform: none;
      font-size: 14px;
      gap: 14px;
    }
    .symptom-flow-page-number::before,
    .symptom-flow-page-number::after {
      width: 16px;
    }
    .ebook-nutrition-influence-sheet {
      min-height: 100svh;
      padding: 30px 26px 72px;
      background: #F7F2EA;
    }
    .nutrition-influence-media-slot,
    .nutrition-influence-content,
    .nutrition-influence-page-number {
      position: relative;
      left: auto;
      right: auto;
      top: auto;
      bottom: auto;
      width: auto;
    }
    .nutrition-influence-topline {
      left: 26px;
      top: 30px;
      max-width: calc(100vw - 52px);
      overflow: hidden;
      font-size: 10px;
      letter-spacing: .32em;
    }
    .nutrition-influence-topline span {
      margin: 0 10px;
    }
    .nutrition-influence-top-rule {
      left: 26px;
      right: 26px;
      top: 58px;
    }
    .nutrition-influence-top-sprig {
      width: 48px;
      height: 62px;
      right: 20px;
      top: 24px;
      opacity: .55;
    }
    .nutrition-influence-media-slot {
      height: 430px;
      margin: 78px -26px 0;
    }
    .nutrition-influence-photo {
      object-position: 48% center;
    }
    .nutrition-influence-content {
      margin-top: 46px;
    }
    .nutrition-influence-content h2 {
      font-size: clamp(50px, 13.8vw, 70px);
      line-height: 1.04;
    }
    .nutrition-influence-divider {
      margin-top: 30px;
      gap: 16px;
    }
    .nutrition-influence-divider i {
      width: min(32vw, 120px);
    }
    .nutrition-influence-divider .section-divider-leaf {
      width: 36px;
      height: 17px;
    }
    .nutrition-influence-list {
      margin-top: 36px;
      gap: 30px;
    }
    .nutrition-influence-item {
      grid-template-columns: 68px 42px minmax(0, 1fr);
      column-gap: 16px;
      min-height: 0;
    }
    .nutrition-influence-icon {
      width: 68px;
      height: 68px;
    }
    .nutrition-influence-icon svg {
      width: 38px;
      height: 38px;
    }
    .nutrition-influence-connector {
      left: 34px;
      top: 68px;
      height: 28px;
    }
    .nutrition-influence-dot {
      left: 34px;
      top: 92px;
      width: 8px;
      height: 8px;
    }
    .nutrition-influence-number {
      padding-top: 10px;
      font-size: 24px;
    }
    .nutrition-influence-copy {
      padding-top: 10px;
    }
    .nutrition-influence-copy h3 {
      font-size: 11px;
      line-height: 1.45;
      letter-spacing: .32em;
    }
    .nutrition-influence-copy p {
      max-width: none;
      margin-top: 14px;
      font-size: 14px;
      line-height: 1.7;
    }
    .nutrition-influence-takeaway {
      min-height: 0;
      margin-top: 36px;
      grid-template-columns: 46px minmax(0, 1fr);
      gap: 18px;
      border-radius: 12px;
      padding: 20px 22px;
    }
    .nutrition-influence-takeaway-sprig {
      width: 40px;
      height: 52px;
    }
    .nutrition-influence-takeaway p {
      font-size: 22px;
      line-height: 1.25;
    }
    .nutrition-influence-page-number {
      justify-content: center;
      margin-top: 44px;
      transform: none;
      font-size: 14px;
      gap: 14px;
    }
    .nutrition-influence-page-number::before,
    .nutrition-influence-page-number::after {
      width: 16px;
    }
    .ebook-food-guide-sheet {
      min-height: 100svh;
      padding: 30px 26px 72px;
      background: #F7F3EC;
    }
    .food-guide-photo {
      object-position: 62% center;
      opacity: .9;
    }
    .food-guide-paper-wash {
      background:
        linear-gradient(180deg, #F7F3EC 0%, #F7F3EC 10%, rgba(247,243,236,.88) 18%, rgba(247,243,236,.08) 48%, rgba(247,243,236,.65) 100%),
        linear-gradient(90deg, #F7F3EC 0%, rgba(247,243,236,.95) 48%, rgba(247,243,236,.28) 100%);
    }
    .food-guide-top-mark {
      left: 24px;
      top: 24px;
      width: 30px;
      height: 58px;
    }
    .food-guide-topline {
      left: 70px;
      top: 36px;
      max-width: calc(100vw - 96px);
      overflow: hidden;
      font-size: 10px;
      letter-spacing: .32em;
    }
    .food-guide-topline span {
      margin: 0 10px;
    }
    .food-guide-top-rule {
      left: 26px;
      right: 26px;
      top: 76px;
    }
    .food-guide-content,
    .food-guide-page-number {
      position: relative;
      left: auto;
      right: auto;
      top: auto;
      bottom: auto;
      width: auto;
    }
    .food-guide-content {
      margin-top: 230px;
    }
    .food-guide-section-label {
      font-size: 13px;
      letter-spacing: .42em;
    }
    .food-guide-section-rule {
      width: 44px;
      margin-top: 18px;
    }
    .food-guide-content h2 {
      max-width: 100%;
      margin-top: 46px;
      font-size: clamp(54px, 15.2vw, 76px);
      line-height: 1.02;
    }
    .food-guide-divider {
      margin-top: 34px;
      gap: 16px;
    }
    .food-guide-divider i {
      width: min(30vw, 116px);
    }
    .food-guide-divider .section-divider-leaf {
      width: 36px;
      height: 17px;
    }
    .food-guide-meta {
      margin-top: 42px;
      grid-template-columns: 76px minmax(0, 1fr);
      gap: 28px;
    }
    .food-guide-medallion {
      width: 76px;
      height: 76px;
    }
    .food-guide-medallion-branch {
      width: 34px;
      height: 52px;
    }
    .food-guide-page-count {
      font-size: 13px;
      letter-spacing: .38em;
    }
    .food-guide-purpose {
      margin-top: 48px;
      max-width: 260px;
    }
    .food-guide-purpose-label {
      font-size: 11px;
      letter-spacing: .38em;
    }
    .food-guide-purpose p {
      margin-top: 22px;
      font-size: 15px;
      line-height: 1.72;
    }
    .food-guide-bottom-rule {
      width: min(100%, 330px);
      margin-top: 90px;
    }
    .food-guide-page-number {
      justify-content: center;
      margin-top: 42px;
      transform: none;
      flex-direction: row;
      font-size: 14px;
      gap: 14px;
    }
    .food-guide-page-number::before,
    .food-guide-page-number::after {
      content: "";
      width: 16px;
      height: 1px;
      background: rgba(20, 38, 14, .72);
    }
    .ebook-food-gallery-sheet {
      min-height: 100svh;
      padding: 30px 26px 72px;
      background: #F7F3EC;
    }
    .food-gallery-photo {
      object-position: center top;
      opacity: .42;
    }
    .food-gallery-paper-wash {
      background:
        linear-gradient(180deg, #F7F3EC 0%, rgba(247,243,236,.96) 30%, rgba(247,243,236,.78) 100%),
        linear-gradient(90deg, rgba(247,243,236,.92), rgba(247,243,236,.76));
    }
    .food-gallery-topline {
      left: 26px;
      top: 36px;
      max-width: calc(100vw - 52px);
      overflow: hidden;
      font-size: 10px;
      letter-spacing: .32em;
    }
    .food-gallery-topline span {
      margin: 0 10px;
    }
    .food-gallery-title,
    .food-gallery-card-copy,
    .food-gallery-quote,
    .food-gallery-page-number {
      position: relative;
      left: auto;
      right: auto;
      top: auto;
      bottom: auto;
      width: auto;
    }
    .food-gallery-title {
      margin-top: 122px;
    }
    .food-gallery-title h2 {
      max-width: 100%;
      font-size: clamp(50px, 13.5vw, 72px);
      line-height: 1.04;
    }
    .food-gallery-divider {
      margin-top: 30px;
      gap: 16px;
    }
    .food-gallery-divider i {
      width: min(30vw, 112px);
    }
    .food-gallery-divider .section-divider-leaf {
      width: 36px;
      height: 17px;
    }
    .food-gallery-title p {
      max-width: 330px;
      margin-top: 28px;
      font-size: 15px;
      line-height: 1.7;
    }
    .food-gallery-dynamic {
      width: min(100%, 390px);
      height: auto;
      min-height: 52px;
      margin-top: 28px;
      gap: 14px;
      border-radius: 10px;
      padding: 14px 18px;
    }
    .food-gallery-dynamic-branch {
      width: 18px;
      height: 30px;
    }
    .food-gallery-dynamic span {
      font-size: 10px;
      line-height: 1.5;
      letter-spacing: .28em;
    }
    .food-gallery-card-copy {
      margin-top: 44px;
      grid-template-columns: 1fr;
      gap: 14px;
    }
    .food-gallery-card-text {
      min-height: 0;
      border: 1px solid rgba(220, 208, 189, .78);
      border-radius: 14px;
      background: rgba(251, 247, 239, .84);
      padding: 22px 22px 20px;
      box-shadow: 0 18px 42px -30px rgba(38, 33, 27, .22);
    }
    .food-gallery-card-text h3 {
      min-height: 0;
      font-size: 11px;
      line-height: 1.45;
      letter-spacing: .32em;
    }
    .food-gallery-card-text p {
      margin-top: 14px;
      font-size: 14px;
      line-height: 1.65;
    }
    .food-gallery-quote {
      margin-top: 28px;
      border-radius: 12px;
      background: rgba(222, 218, 207, .72);
      padding: 22px 24px;
    }
    .food-gallery-quote p {
      font-size: 22px;
      line-height: 1.25;
    }
    .food-gallery-page-number {
      justify-content: center;
      margin-top: 42px;
      transform: none;
      flex-direction: row;
      font-size: 14px;
      gap: 14px;
    }
    .food-gallery-page-number::before,
    .food-gallery-page-number::after {
      content: "";
      width: 16px;
      height: 1px;
      background: rgba(20, 38, 14, .72);
    }
    .ebook-balanced-plate-sheet,
    .ebook-hydration-sheet {
      min-height: 100svh;
      padding: 30px 26px 72px;
      background: #F7F3EC;
    }
    .balanced-plate-photo {
      object-position: center top;
      opacity: .38;
    }
    .hydration-photo {
      object-position: 62% top;
      opacity: .36;
    }
    .balanced-plate-paper-wash,
    .hydration-paper-wash {
      background:
        linear-gradient(180deg, #F7F3EC 0%, rgba(247,243,236,.96) 32%, rgba(247,243,236,.82) 100%),
        linear-gradient(90deg, rgba(247,243,236,.94), rgba(247,243,236,.76));
    }
    .balanced-plate-top-mark,
    .hydration-top-mark {
      left: 18px;
      top: 22px;
      width: 26px;
      height: 48px;
    }
    .balanced-plate-topline,
    .hydration-topline {
      left: 62px;
      top: 39px;
      max-width: calc(100vw - 88px);
      overflow: hidden;
      font-size: 10px;
      letter-spacing: .28em;
    }
    .balanced-plate-topline span,
    .hydration-topline span {
      margin: 0 10px;
    }
    .balanced-plate-top-rule,
    .hydration-top-rule {
      left: 26px;
      right: 26px;
      top: 82px;
      width: auto;
    }
    .balanced-plate-copy,
    .balanced-plate-segments,
    .balanced-plate-quote,
    .balanced-plate-page-number,
    .hydration-copy,
    .hydration-steps,
    .hydration-tips,
    .hydration-quote,
    .hydration-page-number {
      position: relative;
      left: auto;
      right: auto;
      top: auto;
      bottom: auto;
      width: auto;
    }
    .balanced-plate-copy,
    .hydration-copy {
      margin-top: 122px;
    }
    .balanced-plate-copy h2,
    .hydration-copy h2 {
      font-size: clamp(50px, 13.5vw, 72px);
      line-height: 1.04;
    }
    .balanced-plate-divider,
    .hydration-divider {
      margin-top: 30px;
      gap: 16px;
    }
    .balanced-plate-divider i,
    .hydration-divider i {
      width: min(30vw, 112px);
    }
    .balanced-plate-divider .section-divider-leaf,
    .hydration-divider .section-divider-leaf {
      width: 36px;
      height: 17px;
    }
    .balanced-plate-intro,
    .hydration-intro {
      max-width: 340px;
      margin-top: 28px;
      font-size: 15px;
      line-height: 1.7;
    }
    .balanced-plate-segments {
      margin-top: 42px;
      gap: 14px;
    }
    .balanced-plate-segment {
      min-height: 0;
      grid-template-columns: 58px 1fr;
      column-gap: 18px;
      border: 1px solid rgba(220, 208, 189, .78);
      border-radius: 14px;
      background: rgba(251, 247, 239, .84);
      padding: 20px 20px 18px;
      box-shadow: 0 18px 42px -30px rgba(38, 33, 27, .22);
    }
    .balanced-plate-segment::after,
    .balanced-plate-guide {
      display: none;
    }
    .balanced-plate-icon {
      width: 58px;
      height: 58px;
    }
    .balanced-plate-icon svg {
      width: 34px;
      height: 34px;
    }
    .balanced-plate-value {
      font-size: 40px;
    }
    .balanced-plate-segment h3 {
      margin-top: 8px;
      font-size: 11px;
      line-height: 1.45;
      letter-spacing: .3em;
    }
    .balanced-plate-segment p {
      margin-top: 14px;
      font-size: 14px;
      line-height: 1.65;
    }
    .balanced-plate-quote,
    .hydration-quote {
      margin-top: 28px;
      border-radius: 12px;
      grid-template-columns: 52px 1fr;
      column-gap: 20px;
      min-height: 0;
      padding: 22px 24px;
      background: rgba(222, 218, 207, .72);
    }
    .balanced-plate-quote-branch,
    .hydration-quote-branch {
      width: 38px;
      height: 54px;
    }
    .balanced-plate-quote p,
    .hydration-quote p {
      font-size: 22px;
      line-height: 1.25;
    }
    .balanced-plate-page-number,
    .hydration-page-number {
      justify-content: center;
      margin-top: 42px;
      transform: none;
      flex-direction: row;
      font-size: 14px;
      gap: 14px;
    }
    .balanced-plate-page-number::before,
    .hydration-page-number::before,
    .balanced-plate-page-number::after,
    .hydration-page-number::after {
      content: "";
      width: 16px;
      height: 1px;
      background: rgba(20, 38, 14, .72);
    }
    .hydration-framework-label {
      margin-top: 34px;
      font-size: 11px;
      line-height: 1.55;
      letter-spacing: .36em;
    }
    .hydration-steps {
      margin-top: 28px;
      gap: 16px;
    }
    .hydration-step {
      grid-template-columns: 58px 1fr;
      column-gap: 18px;
      min-height: 0;
      border: 1px solid rgba(220, 208, 189, .78);
      border-radius: 14px;
      background: rgba(251, 247, 239, .84);
      padding: 18px 18px 17px;
      box-shadow: 0 18px 42px -30px rgba(38, 33, 27, .22);
    }
    .hydration-step:not(:last-child)::after {
      display: none;
    }
    .hydration-step-icon {
      width: 58px;
      height: 58px;
    }
    .hydration-step-icon svg {
      width: 34px;
      height: 34px;
    }
    .hydration-step h3 {
      margin-top: 2px;
      font-size: 11px;
      line-height: 1.45;
      letter-spacing: .3em;
    }
    .hydration-step p {
      margin-top: 12px;
      font-size: 14px;
      line-height: 1.65;
    }
    .hydration-tips {
      margin-top: 26px;
      border-radius: 14px;
      padding: 24px 22px 18px;
      background: rgba(239, 237, 229, .9);
      box-shadow: 0 18px 42px -30px rgba(38, 33, 27, .22);
    }
    .hydration-tips h3 {
      margin-bottom: 14px;
      font-size: 11px;
      line-height: 1.45;
      letter-spacing: .34em;
    }
    .hydration-tip {
      grid-template-columns: 36px 1fr;
      column-gap: 16px;
      min-height: 0;
      padding: 14px 0;
    }
    .hydration-tip svg {
      width: 30px;
      height: 30px;
    }
    .hydration-tip p {
      font-size: 14px;
      line-height: 1.55;
    }
    .ebook-meal-timing-sheet,
    .ebook-sustainable-rhythm-sheet,
    .ebook-smart-food-swaps-sheet,
    .ebook-smart-swaps-continued-sheet {
      min-height: 100svh;
      padding: 30px 26px 72px;
      background: #F7F3EC;
    }
    .meal-timing-photo,
    .sustainable-rhythm-photo,
    .smart-food-swaps-photo,
    .smart-swaps-continued-photo {
      object-position: center top;
      opacity: .36;
    }
    .smart-swaps-continued-photo {
      object-position: 61% top;
    }
    .meal-timing-paper-wash,
    .sustainable-rhythm-paper-wash,
    .smart-food-swaps-paper-wash,
    .smart-swaps-continued-paper-wash {
      background:
        linear-gradient(180deg, #F7F3EC 0%, rgba(247,243,236,.96) 32%, rgba(247,243,236,.82) 100%),
        linear-gradient(90deg, rgba(247,243,236,.94), rgba(247,243,236,.76));
    }
    .meal-timing-topline,
    .sustainable-rhythm-topline,
    .smart-food-swaps-topline,
    .smart-swaps-continued-topline {
      left: 62px;
      top: 39px;
      max-width: calc(100vw - 88px);
      overflow: hidden;
      font-size: 10px;
      letter-spacing: .28em;
    }
    .meal-timing-topline span,
    .sustainable-rhythm-topline span,
    .smart-food-swaps-topline span,
    .smart-swaps-continued-topline span {
      margin: 0 10px;
    }
    .meal-timing-copy,
    .sustainable-rhythm-copy,
    .smart-food-swaps-copy,
    .meal-timing-timeline-label,
    .meal-timing-entry,
    .meal-timing-consistency,
    .sustainable-rhythm-entry,
    .sustainable-rhythm-consistency,
    .sustainable-rhythm-quote,
    .smart-swap-text-card,
    .smart-swaps-continued-quote,
    .meal-timing-page-number,
    .sustainable-rhythm-page-number,
    .smart-food-swaps-page-number,
    .smart-swaps-continued-page-number {
      position: relative;
      left: auto;
      right: auto;
      top: auto;
      bottom: auto;
      width: auto;
      height: auto;
    }
    .meal-timing-copy,
    .sustainable-rhythm-copy,
    .smart-food-swaps-copy {
      margin-top: 122px;
    }
    .smart-swaps-continued-cards {
      margin-top: 122px;
    }
    .meal-timing-copy h2,
    .sustainable-rhythm-copy h2,
    .smart-food-swaps-copy h2 {
      font-size: clamp(50px, 13.5vw, 72px);
      line-height: 1.04;
    }
    .meal-timing-divider,
    .sustainable-rhythm-divider,
    .smart-food-swaps-divider {
      margin-top: 30px;
      gap: 16px;
    }
    .meal-timing-divider i,
    .sustainable-rhythm-divider i,
    .smart-food-swaps-divider i {
      width: min(30vw, 112px);
    }
    .meal-timing-divider .section-divider-leaf,
    .sustainable-rhythm-divider .section-divider-leaf,
    .smart-food-swaps-divider .section-divider-leaf {
      width: 36px;
      height: 17px;
    }
    .meal-timing-copy p,
    .sustainable-rhythm-copy p,
    .smart-food-swaps-copy p {
      max-width: 350px;
      margin-top: 28px;
      font-size: 15px;
      line-height: 1.7;
    }
    .meal-timing-timeline-label {
      margin-top: 36px;
      font-size: 11px;
      line-height: 1.55;
      letter-spacing: .34em;
    }
    .meal-timing-entries,
    .sustainable-rhythm-entries,
    .smart-food-swaps-cards,
    .smart-swaps-continued-cards {
      position: relative;
      display: grid;
      gap: 14px;
    }
    .meal-timing-entries,
    .sustainable-rhythm-entries {
      margin-top: 22px;
    }
    .smart-food-swaps-cards {
      margin-top: 34px;
    }
    .meal-timing-entry,
    .sustainable-rhythm-entry,
    .smart-swap-text-card {
      min-height: 0;
      border: 1px solid rgba(220, 208, 189, .78);
      border-radius: 14px;
      background: rgba(251, 247, 239, .86);
      padding: 20px 20px 18px;
      box-shadow: 0 18px 42px -30px rgba(38, 33, 27, .22);
    }
    .meal-timing-time,
    .sustainable-rhythm-time {
      font-size: 13px;
      letter-spacing: .12em;
    }
    .meal-timing-entry h3,
    .sustainable-rhythm-entry h3 {
      margin-top: 10px;
      font-size: 11px;
      line-height: 1.45;
      letter-spacing: .3em;
    }
    .meal-timing-entry p,
    .sustainable-rhythm-entry p {
      margin-top: 12px;
      font-size: 14px;
      line-height: 1.65;
    }
    .meal-timing-consistency,
    .sustainable-rhythm-consistency {
      margin-top: 24px;
      border-radius: 14px;
      background: rgba(222, 218, 207, .72);
      padding: 24px 24px 22px;
    }
    .meal-timing-consistency h3,
    .sustainable-rhythm-consistency h3 {
      font-size: 11px;
      line-height: 1.45;
      letter-spacing: .34em;
    }
    .sustainable-rhythm-consistency h3::after {
      width: 34px;
      margin-top: 12px;
    }
    .meal-timing-consistency p,
    .sustainable-rhythm-consistency p {
      margin-top: 14px;
      font-size: 14px;
      line-height: 1.65;
    }
    .sustainable-rhythm-quote,
    .smart-swaps-continued-quote {
      margin-top: 28px;
      border-radius: 12px;
      background: rgba(222, 218, 207, .72);
      padding: 24px 26px;
    }
    .sustainable-rhythm-quote p,
    .smart-swaps-continued-quote p {
      font-size: 24px;
      line-height: 1.25;
    }
    .smart-food-swaps-dynamic {
      width: min(100%, 390px);
      height: auto;
      min-height: 52px;
      margin-top: 28px;
      border-radius: 10px;
      padding: 14px 18px;
      background: rgba(222, 218, 207, .76);
    }
    .smart-food-swaps-dynamic span {
      font-size: 10px;
      line-height: 1.5;
      letter-spacing: .28em;
    }
    .smart-swap-number,
    .smart-swap-before,
    .smart-swap-after {
      position: relative;
      left: auto;
      top: auto;
      width: auto;
    }
    .smart-swap-number {
      font-size: 24px;
    }
    .smart-swap-number::after {
      width: 34px;
      margin-top: 12px;
    }
    .smart-swap-before,
    .smart-swap-after {
      margin-top: 24px;
    }
    .smart-swap-after {
      border-top: 1px solid rgba(186, 177, 161, .58);
      padding-top: 22px;
    }
    .smart-swap-label {
      font-size: 11px;
      letter-spacing: .34em;
    }
    .smart-swap-before h3,
    .smart-swap-after h3 {
      margin-top: 14px;
      font-size: 28px;
      line-height: 1.1;
    }
    .smart-swap-before p,
    .smart-swap-after p {
      margin-top: 14px;
      font-size: 14px;
      line-height: 1.65;
    }
    .meal-timing-page-number,
    .sustainable-rhythm-page-number,
    .smart-food-swaps-page-number,
    .smart-swaps-continued-page-number {
      justify-content: center;
      margin-top: 42px;
      transform: none;
      flex-direction: row;
      font-size: 14px;
      gap: 14px;
    }
    .meal-timing-page-number::before,
    .sustainable-rhythm-page-number::before,
    .smart-food-swaps-page-number::before,
    .smart-swaps-continued-page-number::before,
    .meal-timing-page-number::after,
    .sustainable-rhythm-page-number::after,
    .smart-food-swaps-page-number::after,
    .smart-swaps-continued-page-number::after {
      content: "";
      width: 16px;
      height: 1px;
      background: rgba(20, 38, 14, .72);
    }
    .ebook-lifestyle-foundation-sheet,
    .ebook-sleep-recovery-sheet,
    .ebook-stress-wellbeing-sheet,
    .ebook-daily-wellness-sheet,
    .ebook-perfection-consistency-sheet {
      min-height: 100svh;
      padding: 30px 26px 72px;
      background: #F7F3EC;
    }
    .lifestyle-foundation-photo,
    .sleep-recovery-photo,
    .stress-wellbeing-photo,
    .daily-wellness-photo,
    .perfection-consistency-photo {
      object-position: center top;
      opacity: .36;
    }
    .perfection-consistency-photo {
      object-position: 56% top;
      opacity: .42;
    }
    .lifestyle-foundation-paper-wash,
    .sleep-recovery-paper-wash,
    .stress-wellbeing-paper-wash,
    .daily-wellness-paper-wash,
    .perfection-consistency-paper-wash {
      background:
        linear-gradient(180deg, #F7F3EC 0%, rgba(247,243,236,.96) 34%, rgba(247,243,236,.82) 100%),
        linear-gradient(90deg, rgba(247,243,236,.94), rgba(247,243,236,.76));
    }
    .lifestyle-foundation-topline,
    .sleep-recovery-topline,
    .stress-wellbeing-topline,
    .daily-wellness-topline,
    .perfection-consistency-topline {
      left: 62px;
      top: 39px;
      max-width: calc(100vw - 88px);
      overflow: hidden;
      font-size: 10px;
      letter-spacing: .28em;
    }
    .lifestyle-foundation-topline span,
    .sleep-recovery-topline span,
    .stress-wellbeing-topline span,
    .daily-wellness-topline span,
    .perfection-consistency-topline span {
      margin: 0 10px;
    }
    .lifestyle-foundation-content,
    .sleep-recovery-copy,
    .stress-wellbeing-copy,
    .daily-wellness-copy,
    .perfection-consistency-copy,
    .lifestyle-foundation-badge,
    .sleep-recovery-items,
    .sleep-recovery-item,
    .sleep-recovery-quote,
    .stress-cycle-label,
    .stress-cycle-cards,
    .stress-cycle-card,
    .stress-insight-box,
    .stress-wellbeing-quote,
    .daily-wellness-cards,
    .perfection-consistency-badge,
    .lifestyle-foundation-page-number,
    .sleep-recovery-page-number,
    .stress-wellbeing-page-number,
    .daily-wellness-page-number,
    .perfection-consistency-page-number {
      position: relative;
      left: auto;
      right: auto;
      top: auto;
      bottom: auto;
      width: auto;
      height: auto;
    }
    .lifestyle-foundation-content,
    .sleep-recovery-copy,
    .stress-wellbeing-copy,
    .daily-wellness-copy,
    .perfection-consistency-copy {
      margin-top: 122px;
    }
    .lifestyle-foundation-section-label {
      font-size: 11px;
      letter-spacing: .42em;
    }
    .lifestyle-foundation-number {
      margin-top: 12px;
      font-size: clamp(96px, 28vw, 138px);
    }
    .lifestyle-foundation-content h2,
    .sleep-recovery-copy h2,
    .stress-wellbeing-copy h2,
    .daily-wellness-copy h2,
    .perfection-consistency-copy h2 {
      font-size: clamp(50px, 13.5vw, 72px);
      line-height: 1.04;
    }
    .lifestyle-foundation-divider,
    .sleep-recovery-divider,
    .stress-wellbeing-divider,
    .daily-wellness-divider,
    .perfection-consistency-divider {
      margin-top: 30px;
      gap: 16px;
    }
    .lifestyle-foundation-divider i,
    .sleep-recovery-divider i,
    .stress-wellbeing-divider i,
    .daily-wellness-divider i,
    .perfection-consistency-divider i {
      width: min(30vw, 112px);
    }
    .lifestyle-foundation-divider .section-divider-leaf,
    .sleep-recovery-divider .section-divider-leaf,
    .stress-wellbeing-divider .section-divider-leaf,
    .daily-wellness-divider .section-divider-leaf,
    .perfection-consistency-divider .section-divider-leaf {
      width: 36px;
      height: 17px;
    }
    .lifestyle-foundation-body,
    .sleep-recovery-intro,
    .stress-wellbeing-intro,
    .daily-wellness-intro,
    .perfection-consistency-body {
      max-width: 360px;
      margin-top: 28px;
      font-size: 15px;
      line-height: 1.7;
    }
    .lifestyle-foundation-badge,
    .sleep-recovery-quote,
    .stress-wellbeing-quote,
    .perfection-consistency-badge {
      margin-top: 28px;
      border-radius: 12px;
      background: rgba(222, 218, 207, .72);
      padding: 24px 26px;
      text-align: center;
    }
    .lifestyle-foundation-badge,
    .perfection-consistency-badge,
    .sleep-recovery-quote p,
    .stress-wellbeing-quote p {
      font-size: 24px;
      line-height: 1.25;
    }
    .sleep-recovery-items,
    .stress-cycle-cards,
    .daily-wellness-cards {
      display: grid;
      gap: 14px;
      margin-top: 34px;
    }
    .sleep-recovery-item,
    .stress-cycle-card,
    .daily-wellness-card,
    .stress-insight-box {
      min-height: 0;
      border: 1px solid rgba(220, 208, 189, .78);
      border-radius: 14px;
      background: rgba(251, 247, 239, .86);
      padding: 20px 20px 18px;
      box-shadow: 0 18px 42px -30px rgba(38, 33, 27, .22);
    }
    .sleep-recovery-item h3,
    .stress-cycle-card h3,
    .daily-wellness-card h3 {
      font-size: 11px;
      line-height: 1.45;
      letter-spacing: .3em;
    }
    .sleep-recovery-item p,
    .stress-cycle-card p,
    .daily-wellness-card p,
    .stress-insight-box p {
      margin-top: 12px;
      font-size: 14px;
      line-height: 1.65;
    }
    .stress-cycle-label {
      margin-top: 36px;
      font-size: 11px;
      line-height: 1.55;
      letter-spacing: .34em;
    }
    .stress-cycle-cards {
      margin-top: 18px;
    }
    .stress-insight-box {
      margin-top: 18px;
    }
    .daily-wellness-dynamic {
      width: min(100%, 390px);
      min-height: 52px;
      margin-top: 28px;
      border-radius: 10px;
      padding: 14px 18px;
      background: rgba(222, 218, 207, .76);
    }
    .daily-wellness-dynamic span {
      font-size: 10px;
      line-height: 1.5;
      letter-spacing: .28em;
    }
    .daily-wellness-cards {
      grid-template-columns: 1fr;
    }
    .daily-wellness-card-number {
      right: 20px;
      top: 20px;
      font-size: 13px;
    }
    .daily-wellness-card-icon {
      width: 46px;
      height: 46px;
      margin-bottom: 16px;
    }
    .perfection-consistency-badge {
      text-align: left;
    }
    .lifestyle-foundation-page-number,
    .sleep-recovery-page-number,
    .stress-wellbeing-page-number,
    .daily-wellness-page-number,
    .perfection-consistency-page-number {
      justify-content: center;
      margin-top: 42px;
      transform: none;
      flex-direction: row;
      font-size: 14px;
      gap: 14px;
    }
    .lifestyle-foundation-page-number::before,
    .sleep-recovery-page-number::before,
    .stress-wellbeing-page-number::before,
    .daily-wellness-page-number::before,
    .perfection-consistency-page-number::before,
    .lifestyle-foundation-page-number::after,
    .sleep-recovery-page-number::after,
    .stress-wellbeing-page-number::after,
    .daily-wellness-page-number::after,
    .perfection-consistency-page-number::after {
      content: "";
      width: 16px;
      height: 1px;
      background: rgba(20, 38, 14, .72);
    }
    .ebook-recipe-section-sheet,
    .ebook-recipe-intro-sheet,
    .ebook-breakfasts-sheet,
    .ebook-breakfast-nutrition-sheet {
      min-height: 100svh;
      padding: 30px 26px 72px;
      background: #F7F3EC;
    }
    .recipe-section-photo,
    .recipe-intro-photo,
    .breakfasts-photo,
    .breakfast-nutrition-photo {
      object-position: center top;
      opacity: .34;
    }
    .recipe-section-paper-wash,
    .recipe-intro-paper-wash,
    .breakfasts-paper-wash,
    .breakfast-nutrition-paper-wash {
      background:
        linear-gradient(180deg, #F7F3EC 0%, rgba(247,243,236,.96) 36%, rgba(247,243,236,.84) 100%),
        linear-gradient(90deg, rgba(247,243,236,.94), rgba(247,243,236,.76));
    }
    .recipe-section-top-mark,
    .recipe-intro-top-mark,
    .breakfasts-top-mark,
    .breakfast-nutrition-top-mark {
      left: 24px;
      top: 31px;
      width: 24px;
      height: 36px;
    }
    .recipe-section-topline,
    .recipe-intro-topline,
    .breakfasts-topline,
    .breakfast-nutrition-topline {
      left: 62px;
      top: 39px;
      max-width: calc(100vw - 88px);
      overflow: hidden;
      font-size: 10px;
      letter-spacing: .24em;
    }
    .recipe-section-topline span,
    .recipe-intro-topline span,
    .breakfasts-topline span,
    .breakfast-nutrition-topline span {
      margin: 0 10px;
    }
    .recipe-section-top-rule,
    .recipe-intro-top-rule,
    .breakfasts-top-rule,
    .breakfast-nutrition-top-rule {
      left: 62px;
      right: 24px;
      top: 70px;
    }
    .recipe-section-content,
    .recipe-intro-copy,
    .breakfasts-copy,
    .breakfast-nutrition-copy,
    .recipe-section-badge,
    .recipe-intro-dynamic,
    .recipe-intro-features,
    .recipe-intro-footer,
    .breakfasts-meta,
    .breakfast-nutrition-meta,
    .breakfasts-ingredients,
    .breakfasts-method,
    .breakfasts-highlights,
    .breakfast-protein-card,
    .breakfast-nutrition-table,
    .recipe-section-page-number,
    .recipe-intro-page-number,
    .breakfasts-page-number,
    .breakfast-nutrition-page-number {
      position: relative;
      left: auto;
      right: auto;
      top: auto;
      bottom: auto;
      width: auto;
      height: auto;
    }
    .recipe-section-content,
    .recipe-intro-copy,
    .breakfasts-copy,
    .breakfast-nutrition-copy {
      margin-top: 122px;
    }
    .recipe-section-label,
    .recipe-intro-kicker,
    .breakfasts-kicker,
    .breakfast-nutrition-kicker {
      font-size: 11px;
      letter-spacing: .38em;
    }
    .recipe-section-number {
      margin-top: 12px;
      font-size: clamp(96px, 28vw, 138px);
    }
    .recipe-section-content h2,
    .recipe-intro-copy h2,
    .breakfasts-copy h2,
    .breakfast-nutrition-copy h2 {
      font-size: clamp(50px, 13.5vw, 72px);
      line-height: 1.04;
    }
    .recipe-section-divider,
    .recipe-intro-divider,
    .breakfasts-divider,
    .breakfast-nutrition-table-divider {
      margin-top: 30px;
      gap: 16px;
    }
    .recipe-section-divider i,
    .recipe-intro-divider i,
    .breakfasts-divider i,
    .breakfast-nutrition-table-divider i {
      width: min(30vw, 112px);
    }
    .recipe-section-divider .section-divider-leaf,
    .recipe-intro-divider .section-divider-leaf,
    .breakfasts-divider .section-divider-leaf,
    .breakfast-nutrition-table-divider .section-divider-leaf {
      width: 36px;
      height: 17px;
    }
    .recipe-section-content p,
    .recipe-intro-copy p,
    .breakfasts-copy p,
    .breakfast-nutrition-copy p {
      max-width: 360px;
      margin-top: 28px;
      font-size: 15px;
      line-height: 1.7;
    }
    .recipe-section-badge,
    .recipe-intro-dynamic,
    .breakfasts-make-yours,
    .breakfast-protein-card {
      margin-top: 28px;
      border-radius: 14px;
      background: rgba(222, 218, 207, .76);
      padding: 20px;
    }
    .recipe-section-badge {
      grid-template-columns: 46px 1fr;
      gap: 14px;
    }
    .recipe-section-badge-icon,
    .recipe-intro-dynamic-icon {
      width: 46px;
      height: 46px;
    }
    .recipe-section-badge-icon svg,
    .recipe-intro-dynamic-icon svg {
      width: 22px;
      height: 30px;
    }
    .recipe-section-badge p,
    .recipe-intro-dynamic h3,
    .breakfasts-ingredients h3,
    .breakfasts-method h3,
    .breakfasts-highlights h3,
    .breakfast-nutrition-table h3 {
      font-size: 11px;
      line-height: 1.45;
      letter-spacing: .3em;
    }
    .recipe-intro-dynamic {
      grid-template-columns: 46px 1fr;
      gap: 14px;
    }
    .recipe-intro-dynamic p {
      margin-top: 10px;
      font-size: 14px;
      line-height: 1.6;
    }
    .recipe-intro-features,
    .breakfasts-meta,
    .breakfast-nutrition-meta {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px;
      margin-top: 28px;
    }
    .recipe-intro-feature,
    .breakfasts-meta-item,
    .breakfast-nutrition-meta-item {
      min-height: 0;
      border: 1px solid rgba(220, 208, 189, .78);
      border-radius: 14px;
      background: rgba(251, 247, 239, .82);
      padding: 18px 14px;
      border-right: 1px solid rgba(220, 208, 189, .78);
    }
    .recipe-intro-feature-icon {
      width: 46px;
      height: 46px;
    }
    .recipe-intro-feature-icon svg {
      width: 28px;
      height: 28px;
    }
    .recipe-intro-feature span,
    .recipe-intro-footer span,
    .breakfasts-meta-item span,
    .breakfast-nutrition-meta-item span {
      font-size: 10px;
      line-height: 1.5;
      letter-spacing: .24em;
    }
    .recipe-intro-footer {
      margin-top: 28px;
    }
    .recipe-intro-footer svg {
      width: 22px;
      height: 30px;
    }
    .breakfasts-lead {
      margin-top: 28px;
      font-size: 26px !important;
    }
    .breakfasts-meta-item svg,
    .breakfast-nutrition-meta-item svg {
      display: none;
    }
    .breakfasts-meta-item strong,
    .breakfast-nutrition-meta-item strong {
      margin-top: 10px;
      font-size: 14px;
    }
    .breakfasts-ingredients,
    .breakfasts-method,
    .breakfasts-highlights,
    .breakfast-nutrition-table {
      margin-top: 28px;
      border: 1px solid rgba(220, 208, 189, .78);
      border-radius: 14px;
      background: rgba(251, 247, 239, .86);
      padding: 22px 20px;
    }
    .breakfasts-ingredients > i,
    .breakfasts-method > i,
    .breakfasts-highlights > i {
      width: 34px;
      margin-top: 12px;
    }
    .breakfasts-ingredients ul {
      margin-top: 20px;
      padding-left: 18px;
    }
    .breakfasts-ingredients li {
      margin-bottom: 10px;
      font-size: 14px;
      line-height: 1.55;
    }
    .breakfasts-make-yours {
      grid-template-columns: 40px 1fr;
    }
    .breakfasts-make-yours svg {
      width: 22px;
      height: 30px;
    }
    .breakfasts-make-yours h4,
    .breakfasts-highlight h4 {
      font-size: 11px;
      line-height: 1.45;
    }
    .breakfasts-make-yours p,
    .breakfasts-highlight p,
    .breakfasts-method-step p,
    .breakfast-protein-card p {
      font-size: 14px;
      line-height: 1.65;
    }
    .breakfasts-method-step {
      grid-template-columns: 34px 1fr;
      gap: 14px;
      margin-top: 18px;
    }
    .breakfasts-method-step span {
      width: 28px;
      height: 28px;
      font-size: 12px;
    }
    .breakfasts-highlight {
      grid-template-columns: 46px 1fr;
      gap: 14px;
      min-height: 0;
      padding: 18px 0;
    }
    .breakfasts-highlight-icon,
    .breakfast-protein-icon {
      width: 46px;
      height: 46px;
    }
    .breakfasts-highlight-icon svg,
    .breakfast-protein-icon svg {
      width: 28px;
      height: 28px;
    }
    .breakfast-protein-card {
      justify-items: start;
      text-align: left;
    }
    .breakfast-protein-card h3 {
      margin-top: 18px;
      font-size: 11px;
      letter-spacing: .3em;
    }
    .breakfast-nutrition-table {
      overflow: hidden;
    }
    .breakfast-nutrition-table-head,
    .breakfast-nutrition-row,
    .breakfast-nutrition-total {
      grid-template-columns: 1fr 86px;
    }
    .breakfast-nutrition-table-head {
      margin-top: 24px;
      font-size: 10px;
      line-height: 1.45;
      letter-spacing: .16em;
    }
    .breakfast-nutrition-row {
      min-height: 54px;
      padding-left: 0;
      font-size: 14px;
    }
    .breakfast-nutrition-total {
      min-height: 46px;
      padding: 0 14px;
      font-size: 11px;
      line-height: 1.45;
    }
    .recipe-section-page-number,
    .recipe-intro-page-number,
    .breakfasts-page-number,
    .breakfast-nutrition-page-number {
      justify-content: center;
      margin-top: 42px;
      transform: none;
      flex-direction: row;
      font-size: 14px;
      gap: 14px;
    }
    .recipe-section-page-number::before,
    .recipe-intro-page-number::before,
    .breakfasts-page-number::before,
    .breakfast-nutrition-page-number::before,
    .recipe-section-page-number::after,
    .recipe-intro-page-number::after,
    .breakfasts-page-number::after,
    .breakfast-nutrition-page-number::after {
      content: "";
      width: 16px;
      height: 1px;
      background: rgba(20, 38, 14, .72);
    }
    .ebook-breakfast-benefits-sheet,
    .ebook-breakfast-ingredients-method-sheet,
    .ebook-breakfast-method-cooking-sheet {
      min-height: 100svh;
      padding: 30px 26px 72px;
      background: #F7F3EC;
    }
    .breakfast-benefits-photo,
    .breakfast-ingredients-method-photo,
    .breakfast-method-cooking-photo {
      object-position: center top;
      opacity: .34;
    }
    .breakfast-benefits-paper-wash,
    .breakfast-ingredients-method-paper-wash,
    .breakfast-method-cooking-paper-wash {
      background:
        linear-gradient(180deg, #F7F3EC 0%, rgba(247,243,236,.96) 36%, rgba(247,243,236,.84) 100%),
        linear-gradient(90deg, rgba(247,243,236,.94), rgba(247,243,236,.76));
    }
    .breakfast-benefits-top-mark,
    .breakfast-method-cooking-top-mark,
    .breakfast-ingredients-method-left-mark,
    .breakfast-ingredients-method-right-mark {
      left: 24px;
      top: 31px;
      width: 24px;
      height: 36px;
    }
    .breakfast-ingredients-method-right-mark {
      display: none;
    }
    .breakfast-benefits-topline,
    .breakfast-method-cooking-topline,
    .breakfast-ingredients-method-left-topline,
    .breakfast-ingredients-method-right-topline {
      left: 62px;
      top: 39px;
      max-width: calc(100vw - 88px);
      overflow: hidden;
      font-size: 10px;
      letter-spacing: .24em;
    }
    .breakfast-ingredients-method-right-topline {
      display: none;
    }
    .breakfast-benefits-topline span,
    .breakfast-method-cooking-topline span,
    .breakfast-ingredients-method-left-topline span {
      margin: 0 10px;
    }
    .breakfast-benefits-top-rule,
    .breakfast-method-cooking-top-rule {
      left: 62px;
      right: 24px;
      top: 70px;
    }
    .breakfast-benefits-copy,
    .breakfast-benefits-cards,
    .breakfast-benefits-footer,
    .breakfast-ingredients-copy,
    .breakfast-method-spread-copy,
    .breakfast-ingredient-labels,
    .breakfast-ingredients-tip,
    .breakfast-method-spread-steps,
    .breakfast-method-spread-tip,
    .breakfast-method-cooking-copy,
    .breakfast-method-cooking-label,
    .breakfast-method-cooking-steps,
    .breakfast-method-cooking-tip,
    .breakfast-benefits-page-number,
    .breakfast-ingredients-method-page-number,
    .breakfast-method-cooking-page-number {
      position: relative;
      left: auto;
      right: auto;
      top: auto;
      bottom: auto;
      width: auto;
      height: auto;
    }
    .breakfast-benefits-copy,
    .breakfast-ingredients-copy,
    .breakfast-method-cooking-copy {
      margin-top: 122px;
    }
    .breakfast-method-spread-copy {
      margin-top: 42px;
      border-top: 1px solid rgba(196, 184, 166, .55);
      padding-top: 34px;
    }
    .breakfast-benefits-kicker,
    .breakfast-method-cooking-kicker,
    .breakfast-ingredients-recipe-name,
    .breakfast-method-spread-recipe-name {
      font-size: 11px;
      line-height: 1.45;
      letter-spacing: .34em;
    }
    .breakfast-benefits-kicker-rule,
    .breakfast-method-cooking-label div,
    .breakfast-ingredients-divider,
    .breakfast-method-spread-divider {
      margin-top: 24px;
      gap: 12px;
    }
    .breakfast-benefits-kicker-rule i,
    .breakfast-method-cooking-label i,
    .breakfast-ingredients-divider i,
    .breakfast-method-spread-divider i {
      width: 48px;
    }
    .breakfast-benefits-kicker-rule .section-divider-leaf,
    .breakfast-method-cooking-label .section-divider-leaf,
    .breakfast-ingredients-divider .section-divider-leaf,
    .breakfast-method-spread-divider .section-divider-leaf {
      width: 30px;
      height: 14px;
    }
    .breakfast-benefits-copy h2,
    .breakfast-method-cooking-copy h2,
    .breakfast-ingredients-copy h2,
    .breakfast-method-spread-copy h2 {
      margin-top: 28px;
      font-size: clamp(44px, 12.5vw, 66px);
      line-height: 1.04;
    }
    .breakfast-benefits-copy p {
      max-width: 360px;
      margin-top: 24px;
      font-size: 15px;
      line-height: 1.7;
    }
    .breakfast-benefits-cards {
      display: grid;
      grid-template-columns: 1fr;
      gap: 14px;
      margin-top: 30px;
    }
    .breakfast-benefit-card {
      min-height: 0;
      border: 1px solid rgba(220, 208, 189, .78);
      border-radius: 14px;
      background: rgba(251, 247, 239, .86);
      padding: 22px 20px;
    }
    .breakfast-benefit-icon,
    .breakfast-benefits-footer-icon,
    .breakfast-ingredients-tip-icon,
    .breakfast-method-spread-tip-icon,
    .breakfast-method-cooking-tip-icon {
      width: 46px;
      height: 46px;
    }
    .breakfast-benefit-icon svg,
    .breakfast-benefits-footer-icon svg,
    .breakfast-benefits-footer > svg,
    .breakfast-ingredients-tip-icon svg,
    .breakfast-method-spread-tip-icon svg,
    .breakfast-method-cooking-tip-icon svg {
      width: 28px;
      height: 28px;
    }
    .breakfast-benefit-card h3,
    .breakfast-benefits-footer h3,
    .breakfast-ingredients-tip h3,
    .breakfast-method-spread-tip h3,
    .breakfast-method-cooking-tip h3,
    .breakfast-method-cooking-step-title h3 {
      font-size: 11px;
      line-height: 1.45;
      letter-spacing: .3em;
    }
    .breakfast-benefit-card p,
    .breakfast-benefits-footer p,
    .breakfast-ingredients-tip p,
    .breakfast-method-spread-tip p,
    .breakfast-method-spread-step p,
    .breakfast-method-cooking-step p,
    .breakfast-method-cooking-tip p {
      margin-top: 12px;
      font-size: 14px;
      line-height: 1.65;
    }
    .breakfast-benefits-footer,
    .breakfast-ingredients-tip,
    .breakfast-method-spread-tip,
    .breakfast-method-cooking-tip {
      grid-template-columns: 46px 1fr;
      gap: 14px;
      margin-top: 28px;
      border-radius: 14px;
      background: rgba(222, 218, 207, .76);
      padding: 20px;
    }
    .breakfast-benefits-footer > svg {
      display: none;
    }
    .breakfast-ingredient-labels {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
      margin-top: 26px;
      text-align: left;
    }
    .breakfast-ingredient-label {
      min-height: 0;
      border: 1px solid rgba(220, 208, 189, .78);
      border-radius: 12px;
      background: rgba(251, 247, 239, .82);
      padding: 14px;
    }
    .breakfast-ingredient-label span,
    .breakfast-ingredient-label strong {
      font-size: 10px;
      line-height: 1.45;
      letter-spacing: .2em;
    }
    .breakfast-method-spread-steps {
      display: grid;
      gap: 14px;
      margin-top: 24px;
    }
    .breakfast-method-spread-step {
      min-height: 0;
      border: 1px solid rgba(220, 208, 189, .78);
      border-radius: 14px;
      background: rgba(251, 247, 239, .86);
      padding: 18px;
    }
    .breakfast-method-spread-step span {
      width: 28px;
      height: 28px;
      font-size: 12px;
    }
    .breakfast-method-cooking-label {
      justify-items: start;
      margin-top: 32px;
      font-size: 12px;
      letter-spacing: .38em;
    }
    .breakfast-method-cooking-steps {
      display: grid;
      gap: 14px;
      margin-top: 22px;
    }
    .breakfast-method-cooking-step {
      grid-template-columns: 1fr;
      min-height: 0;
      border: 1px solid rgba(220, 208, 189, .78);
      border-radius: 14px;
      background: rgba(251, 247, 239, .86);
      padding: 20px;
    }
    .breakfast-method-cooking-step-title {
      grid-template-columns: 34px 1fr;
      gap: 14px;
    }
    .breakfast-method-cooking-step-title span {
      justify-self: start;
      font-size: 12px;
    }
    .breakfast-method-cooking-step p {
      max-width: none;
    }
    .breakfast-benefits-page-number,
    .breakfast-ingredients-method-page-number,
    .breakfast-method-cooking-page-number {
      justify-content: center;
      margin-top: 42px;
      transform: none;
      flex-direction: row;
      font-size: 14px;
      gap: 14px;
    }
    .breakfast-benefits-page-number::before,
    .breakfast-ingredients-method-page-number::before,
    .breakfast-method-cooking-page-number::before,
    .breakfast-benefits-page-number::after,
    .breakfast-ingredients-method-page-number::after,
    .breakfast-method-cooking-page-number::after {
      content: "";
      width: 16px;
      height: 1px;
      background: rgba(20, 38, 14, .72);
    }
  }

  /* Mobile-specific ebook overrides disabled to keep one fixed layout. */
  @media (max-width: 0px) {
    .ebook-opportunity-page,
    .ebook-common-challenges-page,
    .ebook-zenplato-framework-page,
    .ebook-food-gallery-page,
    .ebook-hydration-page {
      min-height: 0;
      padding: 10px 6px;
      place-items: center;
      overflow: visible;
    }

    .ebook-common-challenges-sheet,
    .ebook-zenplato-framework-sheet {
      width: 100%;
      min-height: 0;
      aspect-ratio: 543 / 724;
      padding: 0;
      background: #F7F3EC;
      box-shadow: 0 12px 34px rgba(38, 33, 27, .16);
    }

    .ebook-opportunity-sheet {
      width: 100%;
      min-height: 0;
      aspect-ratio: 543 / 724;
      padding: 0;
      background: #F6F2EA;
      box-shadow: 0 12px 34px rgba(38, 33, 27, .16);
    }

    .opportunity-artwork {
      display: block;
    }

    .opportunity-topline {
      position: absolute;
      left: 5.35cqw;
      top: 5.42cqw;
      max-width: none;
      overflow: visible;
      font-size: 1.05cqw;
      letter-spacing: .48em;
    }

    .opportunity-topline span {
      margin: 0 1.55cqw;
    }

    .opportunity-copy {
      position: absolute;
      left: 5.35cqw;
      top: 17.82cqw;
      width: 35.5cqw;
      margin: 0;
    }

    .opportunity-kicker {
      font-size: 2.3cqw;
    }

    .opportunity-rule {
      width: 3.75cqw;
    }

    .opportunity-rule-short {
      margin-top: 3.25cqw;
    }

    .opportunity-number {
      margin-top: 4.35cqw;
      font-size: 17.65cqw;
      line-height: .74;
    }

    .opportunity-rule-clay {
      margin-top: 5.05cqw;
    }

    .opportunity-copy h2 {
      max-width: 36cqw;
      margin-top: 3.2cqw;
      font-size: 4.4cqw;
      line-height: .98;
    }

    .opportunity-rule-green {
      margin-top: 3.7cqw;
    }

    .opportunity-body {
      margin-top: 3.45cqw;
      gap: 2.25cqw;
    }

    .opportunity-body p {
      max-width: 32.5cqw;
      font-size: 1.4cqw;
      line-height: 1.7;
    }

    .opportunity-visual {
      display: none;
    }

    .opportunity-brand {
      position: absolute;
      left: 5.05cqw;
      right: auto;
      top: auto;
      bottom: 4.9cqw;
      width: auto;
      margin: 0;
    }

    .opportunity-brand div {
      font-size: 6.2cqw;
    }

    .opportunity-brand span {
      margin-top: 2.45cqw;
      font-size: .74cqw;
      line-height: 1;
      letter-spacing: .36em;
    }

    .opportunity-page-number {
      position: absolute;
      left: 50%;
      right: auto;
      top: auto;
      bottom: 3.15cqw;
      width: auto;
      margin: 0;
      transform: translateX(-50%);
      font-size: 1.48cqw;
      gap: 1.4cqw;
    }

    .ebook-food-gallery-sheet,
    .ebook-hydration-sheet {
      width: 100%;
      min-height: 0;
      aspect-ratio: 1055 / 1491;
      padding: 0;
      background: #F7F3EC;
      box-shadow: 0 12px 34px rgba(38, 33, 27, .16);
    }

    .food-gallery-photo,
    .hydration-photo {
      opacity: 1;
      object-position: center;
    }

    .food-gallery-paper-wash {
      background:
        linear-gradient(180deg, rgba(247,243,236,.64) 0%, rgba(247,243,236,0) 21%, rgba(247,243,236,0) 100%),
        linear-gradient(90deg, rgba(247,243,236,.42) 0%, rgba(247,243,236,0) 58%);
    }

    .food-gallery-topline {
      position: absolute;
      left: 9.05cqw;
      top: 5.28cqw;
      max-width: none;
      overflow: visible;
      font-size: 1.03cqw;
      letter-spacing: .48em;
    }

    .food-gallery-topline span {
      margin: 0 1.55cqw;
    }

    .food-gallery-title {
      position: absolute;
      left: 8.55cqw;
      top: 18.55cqw;
      width: 41.4cqw;
      margin: 0;
    }

    .food-gallery-title h2 {
      max-width: 45cqw;
      font-size: 7.35cqw;
      line-height: 1.08;
    }

    .food-gallery-divider {
      margin-top: 3.25cqw;
      gap: 2.1cqw;
      visibility: hidden;
    }

    .food-gallery-divider i {
      width: 12.2cqw;
    }

    .food-gallery-divider .section-divider-leaf {
      width: 3.25cqw;
      height: 1.48cqw;
    }

    .food-gallery-title p {
      max-width: 36.5cqw;
      margin-top: 3.1cqw;
      font-size: 1.68cqw;
      line-height: 1.48;
    }

    .food-gallery-dynamic {
      width: 35.4cqw;
      height: 4.45cqw;
      min-height: 0;
      margin-top: 3.1cqw;
      gap: 1.58cqw;
      border-radius: .74cqw;
      padding: 0 1.7cqw;
    }

    .food-gallery-dynamic-branch {
      width: 1.42cqw;
      height: 2.4cqw;
      visibility: hidden;
    }

    .food-gallery-dynamic span {
      font-size: 1.02cqw;
      line-height: 1;
      letter-spacing: .34em;
    }

    .food-gallery-card-copy {
      position: absolute;
      left: 6.6cqw;
      top: 79.2cqw;
      width: 86.05cqw;
      margin: 0;
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      column-gap: 1.72cqw;
      row-gap: 22.15cqw;
    }

    .food-gallery-card-text {
      min-height: 12.8cqw;
      border: 0;
      border-radius: 0;
      background: transparent;
      padding: 1.2cqw 1.25cqw 0 5.55cqw;
      box-shadow: none;
    }

    .food-gallery-card-text h3 {
      min-height: 2.3cqw;
      font-size: 1.05cqw;
      line-height: 1.35;
      letter-spacing: .3em;
    }

    .food-gallery-card-text p {
      margin-top: 1.7cqw;
      font-size: 1.34cqw;
      line-height: 1.45;
    }

    .food-gallery-quote {
      position: absolute;
      left: 14.55cqw;
      right: auto;
      top: auto;
      bottom: 7.35cqw;
      width: 34cqw;
      margin: 0;
      border-radius: 0;
      background: transparent;
      padding: 0;
    }

    .food-gallery-quote p {
      font-size: 1.78cqw;
      line-height: 1.22;
    }

    .food-gallery-page-number,
    .hydration-page-number {
      position: absolute;
      margin: 0;
      flex-direction: column;
      justify-content: flex-start;
      gap: .95cqw;
      font-size: 1.34cqw;
    }

    .food-gallery-page-number {
      right: 7.45cqw;
      bottom: 4.85cqw;
    }

    .food-gallery-page-number::before,
    .hydration-page-number::before {
      display: none;
    }

    .food-gallery-page-number::after,
    .hydration-page-number::after {
      width: 3.6cqw;
    }

    .hydration-paper-wash {
      background:
        linear-gradient(90deg, rgba(247,243,236,.82) 0%, rgba(247,243,236,.58) 38%, rgba(247,243,236,.08) 66%, rgba(247,243,236,0) 100%),
        linear-gradient(180deg, rgba(247,243,236,.52) 0%, rgba(247,243,236,0) 35%);
    }

    .hydration-top-mark,
    .hydration-top-rule,
    .hydration-divider,
    .hydration-step-icon,
    .hydration-step:not(:last-child)::after,
    .hydration-tip svg,
    .hydration-quote-branch {
      visibility: hidden;
    }

    .hydration-topline {
      position: absolute;
      left: 8.82cqw;
      top: 5.16cqw;
      max-width: none;
      overflow: visible;
      font-size: 1.03cqw;
      letter-spacing: .46em;
    }

    .hydration-topline span {
      margin: 0 1.55cqw;
    }

    .hydration-copy {
      position: absolute;
      left: 7.2cqw;
      top: 16.45cqw;
      width: 43.8cqw;
      margin: 0;
    }

    .hydration-copy h2 {
      font-size: 6.8cqw;
      line-height: 1.05;
    }

    .hydration-divider {
      margin-top: 4cqw;
      gap: 2.08cqw;
    }

    .hydration-intro {
      max-width: 40.5cqw;
      margin-top: 3.3cqw;
      font-size: 1.62cqw;
      line-height: 1.48;
    }

    .hydration-framework-label {
      margin-top: 3.5cqw;
      font-size: 1.16cqw;
      line-height: 1;
      letter-spacing: .43em;
    }

    .hydration-steps {
      position: absolute;
      left: 7.22cqw;
      top: 53.42cqw;
      width: 40.2cqw;
      margin: 0;
      display: grid;
      gap: 3.55cqw;
    }

    .hydration-step {
      min-height: 10.1cqw;
      grid-template-columns: 7.72cqw 1fr;
      column-gap: 3.02cqw;
      border: 0;
      border-radius: 0;
      background: transparent;
      padding: 0;
      box-shadow: none;
    }

    .hydration-step-icon {
      width: 7.72cqw;
      height: 7.72cqw;
    }

    .hydration-step h3 {
      margin-top: .8cqw;
      font-size: 1.15cqw;
      line-height: 1.3;
      letter-spacing: .31em;
    }

    .hydration-step p {
      margin-top: 1.05cqw;
      font-size: 1.24cqw;
      line-height: 1.42;
    }

    .hydration-tips {
      position: absolute;
      left: 55.2cqw;
      top: 100.9cqw;
      width: 37.6cqw;
      margin: 0;
      border-radius: 1.18cqw;
      padding: 2.72cqw 3.62cqw 2.4cqw;
    }

    .hydration-tips h3 {
      margin-bottom: 1.82cqw;
      font-size: 1.08cqw;
      line-height: 1;
      letter-spacing: .42em;
    }

    .hydration-tip {
      grid-template-columns: 3.45cqw 1fr;
      column-gap: 2.18cqw;
      min-height: 5.9cqw;
      padding: 1.18cqw 0;
    }

    .hydration-tip p {
      font-size: 1.22cqw;
      line-height: 1.42;
    }

    .hydration-quote {
      position: absolute;
      left: 7.18cqw;
      right: auto;
      top: auto;
      bottom: 8.65cqw;
      width: 36.9cqw;
      min-height: 10.55cqw;
      margin: 0;
      grid-template-columns: 5.85cqw 1fr;
      column-gap: 2.28cqw;
      border-radius: 1cqw;
      padding: 1.68cqw 2.8cqw 1.62cqw 2.2cqw;
    }

    .hydration-quote p {
      font-size: 1.82cqw;
      line-height: 1.2;
    }

    .hydration-page-number {
      right: 7.58cqw;
      bottom: 4.2cqw;
    }

    .common-challenges-artwork,
    .zenplato-framework-artwork {
      opacity: 1;
      object-position: center;
    }

    .common-challenges-topline,
    .zenplato-framework-topline {
      position: absolute;
      max-width: none;
      overflow: visible;
      font-size: 1.16cqw;
      letter-spacing: .48em;
    }

    .common-challenges-topline {
      left: 10.66cqw;
      top: 5.85cqw;
    }

    .zenplato-framework-topline {
      left: 9.34cqw;
      top: 5.72cqw;
    }

    .common-challenges-topline span,
    .zenplato-framework-topline span {
      margin: 0 1.55cqw;
    }

    .common-challenges-content,
    .zenplato-framework-content {
      position: absolute;
      inset: 0;
      margin: 0;
    }

    .common-challenges-heading {
      position: absolute;
      left: 5.95cqw;
      top: 14.55cqw;
      width: auto;
      font-size: 7.15cqw;
      line-height: 1.08;
      opacity: 0;
    }

    .common-challenges-intro {
      position: absolute;
      left: 6.05cqw;
      top: 33.7cqw;
      width: 42cqw;
      max-width: none;
      margin: 0;
      font-size: 1.68cqw;
      line-height: 1.5;
    }

    .common-challenges-list {
      position: absolute;
      left: 17.95cqw;
      top: 70.15cqw;
      width: 76.1cqw;
      margin: 0;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 30.7cqw));
      grid-auto-rows: auto;
      column-gap: 14.7cqw;
      row-gap: 27.25cqw;
    }

    .common-challenge-copy,
    .zenplato-framework-item {
      border: 0;
      border-radius: 0;
      background: transparent;
      padding: 0;
      box-shadow: none;
    }

    .common-challenge-copy h3,
    .zenplato-framework-item h3 {
      font-size: 1.38cqw;
      line-height: 1.35;
      letter-spacing: .3em;
    }

    .common-challenge-copy p {
      margin-top: 1.35cqw;
      font-size: 1.43cqw;
      line-height: 1.42;
    }

    .zenplato-framework-content h2 {
      position: absolute;
      left: 6.9cqw;
      top: 16.2cqw;
      width: auto;
      font-size: 7.2cqw;
      line-height: 1.02;
    }

    .zenplato-framework-intro {
      position: absolute;
      left: 6.95cqw;
      top: 36.55cqw;
      width: 39cqw;
      max-width: none;
      margin: 0;
      font-size: 1.68cqw;
      line-height: 1.5;
    }

    .zenplato-framework-list {
      position: absolute;
      left: 19.35cqw;
      top: 49.35cqw;
      width: 27cqw;
      margin: 0;
      display: grid;
      grid-template-columns: 1fr;
      grid-auto-rows: 16.45cqw;
      gap: 0;
    }

    .zenplato-framework-item p {
      margin-top: 2.2cqw;
      font-size: 1.4cqw;
      line-height: 1.48;
    }

    .zenplato-framework-quote {
      position: absolute;
      left: 16.45cqw;
      top: 116.45cqw;
      width: 30.5cqw;
      margin: 0;
      border-radius: 0;
      padding: 0;
      background: transparent;
      font-size: 2.05cqw;
      line-height: 1.22;
    }

    .common-challenges-page-number,
    .zenplato-framework-page-number {
      position: absolute;
      margin: 0;
      flex-direction: column;
      justify-content: flex-start;
      gap: .95cqw;
      font-size: 1.34cqw;
    }

    .common-challenges-page-number {
      right: 6.05cqw;
      bottom: 2.85cqw;
    }

    .zenplato-framework-page-number {
      right: 5.55cqw;
      bottom: 2.65cqw;
    }

    .common-challenges-page-number::before,
    .zenplato-framework-page-number::before {
      display: none;
    }

    .common-challenges-page-number::after,
    .zenplato-framework-page-number::after {
      width: 3.6cqw;
    }
  }
`;
