# Design System: NutriVerse UI

NutriVerse UI is a premium wellness design system built around the feeling of a calm, editorial health journal. The visual language draws from botanical and culinary worlds — warm, organic, and grounded rather than clinical or tech-forward.

- **Color palette** centers on an earthy neutral ramp (warm ivory through espresso) with forest green as the primary action color, sage as a soft botanical secondary, gold for warm accents and premium moments, and coral reserved for warmth or caution. Shadows carry a subtle green tint.
- **Typography** pairs Playfair Display (serif, for headings and display text) with DM Sans (geometric sans, for body copy and UI chrome). Headings use medium weight with tight tracking for editorial impact. The signature eyebrow pattern — tiny uppercase with wide letter-spacing — appears throughout as section labels.
- **Shapes** favor generous radius values, with the pill shape (fully rounded) as a signature element on buttons, tags, and progress bars. Cards use a consistent 1.25rem radius.
- **Surfaces** range from bright white zen cards with warm borders, through paper and sage-tinted backgrounds, to frosted glass overlays and dark forest-green brand moments. The layering feels like natural materials — paper, linen, frosted glass — rather than flat UI.
- **Motion** is gentle and reassuring: subtle hover lifts on interactive cards, smooth transitions at 150–300ms, and a spring easing curve for moments of delight. Nothing should feel sudden or jarring.
- **Icons** use the Phosphor pack — rounded, friendly, and organic in feel, complementing the botanical personality without looking clinical.
- **Personality** is calm, reassuring, and personal. The system should feel like a trusted wellness guide: warm enough to be approachable, editorial enough to feel premium, and clear enough to be understood at a glance on a phone screen.

## Component Vocabulary

1. **Button**
The primary interactive element across NutriVerse. Available in three variants: a bold filled style for main calls to action, an outlined style for secondary choices, and a ghost style for subtle or toolbar-level actions. All variants use the signature pill shape — fully rounded corners that give the brand its soft, approachable feel. The filled variant carries a colored drop shadow for lift and presence. Supports a loading spinner for async operations and an optional icon at either end of the label. Pair one filled button with outline or ghost alternatives — never stack multiple filled buttons together.

2. **Card**
The foundational container for grouping related content across NutriVerse. Available in six surface treatments: the signature zen card (white with warm border and forest-tinted shadow), elevated for prominent features, subtle for quieter sections on paper backgrounds, soft with a sage botanical tint, glass for frosted overlays and bottom bars, and brand for dark forest-green hero moments. Cards accept optional header, body, media, and footer zones. When marked as interactive, they gain a gentle hover lift that matches the recipe card and chapter card behavior from the app. Padding scales from none (for cards with full-bleed images) through generous for feature callouts.

3. **Progress Bar**
A horizontal bar that visualizes progress toward a goal — used for nutrition tracking (calories, protein, carbs, fat), hydration, streaks, and wellness metrics. The default fill uses a gradient from soft sage to deep forest green, matching the progress bars on the wellness journey page. Additional variants offer solid brand green, a warm gold gradient for accent metrics, and coral for limits or warnings. Three thickness sizes from thin (small inline indicators) to thick (hero-level stats). An optional header row shows a label and current value above the bar.

4. **Tag**
A compact pill-shaped label used to classify recipes, health conditions, dietary tags, and status indicators. Five color variants cover the main use cases: the default forest green for general categorization, gold accent for premium or highlighted items, sage for softer botanical groupings, coral for warnings or restrictions, and a solid filled style for high-emphasis badges. Each tag can display an icon or a small dot indicator. Supports an optional remove action for filter-style usage.

## Theme Reference

```css
/* theme/colors.css */
:root {
  /* ─── Neutral (Warm Ivory → Espresso → Editorial) ─── */
  --theme-neutral-0: #FFFFFF;
  --theme-neutral-50: #FDFBF7;
  --theme-neutral-100: #FAF7EE;
  --theme-neutral-200: #F4F1E8;
  --theme-neutral-300: #E5DDD0;
  --theme-neutral-400: #C8BFB0;
  --theme-neutral-500: #BDB3A3;
  --theme-neutral-600: #9A9182;
  --theme-neutral-700: #706860;
  --theme-neutral-800: #4A4036;
  --theme-neutral-900: #2E2A26;
  --theme-neutral-950: #1E1C1A;
  --theme-neutral-1000: #111010;

  /* ─── Green (Forest / Action) ─── */
  --theme-green-0: #F5F8F5;
  --theme-green-50: #EBF2EB;
  --theme-green-100: #DDE8DD;
  --theme-green-200: #C2D4C3;
  --theme-green-300: #A0B8A1;
  --theme-green-400: #7D9E7E;
  --theme-green-500: #5E8560;
  --theme-green-600: #3D5C3E;
  --theme-green-700: #334E34;
  --theme-green-800: #2D4530;
  --theme-green-900: #1F2E1F;
  --theme-green-950: #141E14;
  --theme-green-1000: #0A100A;

  /* ─── Sage (Botanical Muted Green) ─── */
  --theme-sage-0: #F7F9F4;
  --theme-sage-50: #F0F3EA;
  --theme-sage-100: #E9ECDF;
  --theme-sage-200: #D5DACA;
  --theme-sage-300: #C7CEB2;
  --theme-sage-400: #A8B4A0;
  --theme-sage-500: #8D9E8D;
  --theme-sage-600: #738573;
  --theme-sage-700: #5C6B5C;
  --theme-sage-800: #465346;
  --theme-sage-900: #313B31;
  --theme-sage-950: #1F261F;
  --theme-sage-1000: #111611;

  /* ─── Gold (Warm Accent) ─── */
  --theme-gold-0: #FBF8F0;
  --theme-gold-50: #F7F0E0;
  --theme-gold-100: #F0E5CC;
  --theme-gold-200: #E5D4A8;
  --theme-gold-300: #DABC80;
  --theme-gold-400: #CAAA70;
  --theme-gold-500: #B59B5A;
  --theme-gold-600: #9D7841;
  --theme-gold-700: #826030;
  --theme-gold-800: #664A24;
  --theme-gold-900: #4A351A;
  --theme-gold-950: #322410;
  --theme-gold-1000: #1A1208;

  /* ─── Coral (Warmth / Destructive) ─── */
  --theme-coral-0: #FEF6F4;
  --theme-coral-50: #FDEDE9;
  --theme-coral-100: #FBDAD3;
  --theme-coral-200: #F5B8AA;
  --theme-coral-300: #EE9580;
  --theme-coral-400: #D8775C;
  --theme-coral-500: #C4604A;
  --theme-coral-600: #A84A38;
  --theme-coral-700: #8A3A2C;
  --theme-coral-800: #6C2D22;
  --theme-coral-900: #4E2019;
  --theme-coral-950: #351510;
  --theme-coral-1000: #1C0B08;
}

/* theme/motion.css */
:root {
  /* ─── Durations ─── */
  --theme-motion-instant: 100ms;
  --theme-motion-fast: 150ms;
  --theme-motion-normal: 200ms;
  --theme-motion-ease: 300ms;
  --theme-motion-slow: 500ms;
  --theme-motion-gentle: 900ms;

  /* ─── Easing Curves ─── */
  --theme-ease-default: cubic-bezier(0.25, 0.1, 0.25, 1);
  --theme-ease-in: cubic-bezier(0.4, 0, 1, 1);
  --theme-ease-out: cubic-bezier(0, 0, 0.2, 1);
  --theme-ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --theme-ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* theme/radii.css */
:root {
  /* ─── Border Radii ─── */
  --theme-radius-sm: 0.375rem;
  --theme-radius-md: 0.625rem;
  --theme-radius-base: 0.75rem;
  --theme-radius-lg: 1rem;
  --theme-radius-xl: 1.25rem;
  --theme-radius-2xl: 1.5rem;
  --theme-radius-3xl: 2rem;
  --theme-radius-pill: 999px;
  --theme-radius-round: 50%;
}

/* theme/shadows.css */
:root {
  /* ─── Shadows (Forest-tinted, soft) ─── */
  --theme-shadow-xs: 0 1px 2px rgba(31, 46, 31, 0.04);
  --theme-shadow-sm: 0 2px 8px rgba(31, 46, 31, 0.05);
  --theme-shadow-md: 0 2px 16px rgba(61, 92, 62, 0.06);
  --theme-shadow-lg: 0 4px 24px rgba(31, 46, 31, 0.06);
  --theme-shadow-xl: 0 8px 40px rgba(31, 46, 31, 0.08);

  /* ─── Overlays ─── */
  --theme-overlay-light: rgba(255, 255, 255, 0.88);
  --theme-overlay-dark: rgba(30, 28, 26, 0.4);
}

/* theme/spacing.css */
:root {
  /* ─── Spacing Scale ─── */
  --theme-spacing-2xs: 0.125rem;
  --theme-spacing-xs: 0.25rem;
  --theme-spacing-sm: 0.5rem;
  --theme-spacing-md: 0.75rem;
  --theme-spacing-base: 1rem;
  --theme-spacing-lg: 1.25rem;
  --theme-spacing-xl: 1.5rem;
  --theme-spacing-2xl: 2rem;
  --theme-spacing-3xl: 2.5rem;
  --theme-spacing-4xl: 3rem;
  --theme-spacing-5xl: 4rem;
  --theme-spacing-6xl: 6rem;
}

/* theme/typography.css */
:root {
  /* ─── Font Families ─── */
  --theme-font-serif: 'Playfair Display', Georgia, serif;
  --theme-font-sans: 'DM Sans', Inter, system-ui, sans-serif;

  /* ─── Font Sizes ─── */
  --theme-font-size-2xs: 0.65rem;
  --theme-font-size-xs: 0.75rem;
  --theme-font-size-sm: 0.85rem;
  --theme-font-size-base: 0.95rem;
  --theme-font-size-md: 1.05rem;
  --theme-font-size-lg: 1.2rem;
  --theme-font-size-xl: 1.4rem;
  --theme-font-size-2xl: 1.75rem;
  --theme-font-size-3xl: 2.15rem;
  --theme-font-size-4xl: 2.75rem;
  --theme-font-size-5xl: 3.5rem;

  /* ─── Font Weights ─── */
  --theme-font-weight-light: 300;
  --theme-font-weight-regular: 400;
  --theme-font-weight-medium: 500;
  --theme-font-weight-semibold: 600;
  --theme-font-weight-bold: 700;

  /* ─── Line Heights ─── */
  --theme-line-height-tight: 1.1;
  --theme-line-height-snug: 1.25;
  --theme-line-height-normal: 1.5;
  --theme-line-height-relaxed: 1.65;

  /* ─── Letter Spacing ─── */
  --theme-tracking-tight: -0.01em;
  --theme-tracking-normal: 0.005em;
  --theme-tracking-wide: 0.06em;
  --theme-tracking-wider: 0.14em;
  --theme-tracking-widest: 0.22em;
}
```

## Tokens and Recipes

```css
/* styles/tokens.css */
:root {
  /* ─── Brand ─── */
  --ds-color-brand: var(--theme-green-600);
  --ds-color-brand-hover: var(--theme-green-700);
  --ds-color-brand-subtle: var(--theme-green-50);
  --ds-color-brand-muted: var(--theme-sage-500);
  --ds-color-accent: var(--theme-gold-400);
  --ds-color-accent-subtle: var(--theme-gold-50);

  /* ─── Text ─── */
  --ds-text-primary: var(--theme-neutral-900);
  --ds-text-secondary: var(--theme-neutral-700);
  --ds-text-muted: var(--theme-neutral-600);
  --ds-text-hint: var(--theme-neutral-500);
  --ds-text-inverse: var(--theme-neutral-50);
  --ds-text-brand: var(--theme-green-600);
  --ds-text-accent: var(--theme-gold-600);
  --ds-text-error: var(--theme-coral-600);
  --ds-text-on-brand: var(--theme-neutral-0);

  /* ─── Surface ─── */
  --ds-surface-canvas: var(--theme-neutral-200);
  --ds-surface-paper: var(--theme-neutral-100);
  --ds-surface-card: var(--theme-neutral-0);
  --ds-surface-subtle: var(--theme-neutral-50);
  --ds-surface-muted: var(--theme-neutral-300);
  --ds-surface-brand: var(--theme-green-600);
  --ds-surface-brand-subtle: var(--theme-green-0);
  --ds-surface-sage: var(--theme-sage-100);
  --ds-surface-accent-subtle: var(--theme-gold-0);
  --ds-surface-error-subtle: var(--theme-coral-0);
  --ds-surface-overlay-light: var(--theme-overlay-light);
  --ds-surface-overlay-dark: var(--theme-overlay-dark);

  /* ─── Border ─── */
  --ds-border-default: var(--theme-neutral-300);
  --ds-border-subtle: var(--theme-neutral-200);
  --ds-border-muted: var(--theme-neutral-400);
  --ds-border-brand: var(--theme-green-600);
  --ds-border-brand-subtle: rgba(61, 92, 62, 0.15);
  --ds-border-accent: var(--theme-gold-400);
  --ds-border-error: var(--theme-coral-500);
  --ds-border-input: var(--theme-neutral-300);
  --ds-border-input-focus: var(--theme-green-600);

  /* ─── Focus ─── */
  --ds-focus-ring: var(--theme-green-600);
  --ds-focus-ring-offset: var(--theme-neutral-0);

  /* ─── Interactive ─── */
  --ds-interactive-hover: rgba(61, 92, 62, 0.04);
  --ds-interactive-pressed: rgba(61, 92, 62, 0.08);
  --ds-interactive-disabled-bg: var(--theme-sage-200);
  --ds-interactive-disabled-text: var(--theme-neutral-500);

  /* ─── Semantic Status ─── */
  --ds-color-success: var(--theme-green-500);
  --ds-color-warning: var(--theme-gold-500);
  --ds-color-error: var(--theme-coral-500);
  --ds-color-info: var(--theme-sage-600);
}

/* styles/recipes/divider.css */
/* ─── Decorative Divider (Gold accent with lines) ─── */
.ds-divider-accent {
  display: flex;
  align-items: center;
  gap: var(--theme-spacing-md);
  color: var(--ds-text-accent);
  font-family: var(--theme-font-sans);
  font-size: var(--theme-font-size-xs);
  font-weight: var(--theme-font-weight-medium);
}

.ds-divider-accent::before,
.ds-divider-accent::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--ds-border-default);
}

/* ─── Simple Divider ─── */
.ds-divider {
  height: 1px;
  background: var(--ds-border-default);
  border: none;
  margin: 0;
}

/* styles/recipes/surface.css */
/* ─── Card ─── */
.ds-surface-card {
  background: var(--ds-surface-card);
  border: 1px solid var(--ds-border-default);
  border-radius: var(--theme-radius-xl);
  box-shadow: var(--theme-shadow-md);
}

/* ─── Elevated Card ─── */
.ds-surface-card-elevated {
  background: var(--ds-surface-card);
  border: 1px solid var(--ds-border-subtle);
  border-radius: var(--theme-radius-xl);
  box-shadow: var(--theme-shadow-lg);
}

/* ─── Soft Surface (Sage Tinted) ─── */
.ds-surface-soft {
  background: var(--ds-surface-sage);
  border: 1px solid var(--theme-sage-200);
  border-radius: var(--theme-radius-xl);
}

/* ─── Subtle Surface (Paper) ─── */
.ds-surface-subtle {
  background: var(--ds-surface-paper);
  border: 1px solid var(--ds-border-subtle);
  border-radius: var(--theme-radius-lg);
}

/* ─── Glass (Frosted Overlay) ─── */
.ds-surface-glass {
  background: var(--ds-surface-overlay-light);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid var(--ds-border-default);
}

/* ─── Brand Surface ─── */
.ds-surface-brand {
  background: var(--ds-surface-brand);
  color: var(--ds-text-on-brand);
  border-radius: var(--theme-radius-xl);
}

/* ─── Accent Tint (Gold) ─── */
.ds-surface-accent {
  background: var(--ds-surface-accent-subtle);
  border: 1px solid var(--theme-gold-100);
  border-radius: var(--theme-radius-lg);
}

/* ─── Error Tint ─── */
.ds-surface-error {
  background: var(--ds-surface-error-subtle);
  border: 1px solid var(--theme-coral-100);
  border-radius: var(--theme-radius-lg);
}

/* styles/recipes/tag.css */
/* ─── Tag (Pill Badge) ─── */
.ds-tag {
  display: inline-flex;
  align-items: center;
  gap: var(--theme-spacing-xs);
  padding: var(--theme-spacing-2xs) var(--theme-spacing-md);
  border-radius: var(--theme-radius-pill);
  font-family: var(--theme-font-sans);
  font-size: var(--theme-font-size-2xs);
  font-weight: var(--theme-font-weight-semibold);
  letter-spacing: var(--theme-tracking-wide);
  text-transform: uppercase;
  line-height: var(--theme-line-height-normal);
  background: var(--ds-interactive-pressed);
  color: var(--ds-text-brand);
  border: 1px solid var(--ds-border-brand-subtle);
}

/* ─── Tag Variants ─── */
.ds-tag-accent {
  background: var(--ds-surface-accent-subtle);
  color: var(--ds-text-accent);
  border-color: var(--theme-gold-200);
}

.ds-tag-sage {
  background: var(--ds-surface-sage);
  color: var(--theme-sage-700);
  border-color: var(--theme-sage-200);
}

.ds-tag-error {
  background: var(--ds-surface-error-subtle);
  color: var(--ds-text-error);
  border-color: var(--theme-coral-100);
}

.ds-tag-solid {
  background: var(--ds-surface-brand);
  color: var(--ds-text-on-brand);
  border-color: transparent;
}

/* styles/recipes/type.css */
/* ─── Display (Hero / Feature) ─── */
.ds-type-display-lg {
  font-family: var(--theme-font-serif);
  font-size: var(--theme-font-size-5xl);
  font-weight: var(--theme-font-weight-medium);
  line-height: var(--theme-line-height-tight);
  letter-spacing: var(--theme-tracking-tight);
}

.ds-type-display-md {
  font-family: var(--theme-font-serif);
  font-size: var(--theme-font-size-4xl);
  font-weight: var(--theme-font-weight-medium);
  line-height: var(--theme-line-height-tight);
  letter-spacing: var(--theme-tracking-tight);
}

.ds-type-display-sm {
  font-family: var(--theme-font-serif);
  font-size: var(--theme-font-size-3xl);
  font-weight: var(--theme-font-weight-medium);
  line-height: var(--theme-line-height-snug);
  letter-spacing: var(--theme-tracking-tight);
}

/* ─── Heading (Section / Card) ─── */
.ds-type-heading-lg {
  font-family: var(--theme-font-serif);
  font-size: var(--theme-font-size-2xl);
  font-weight: var(--theme-font-weight-medium);
  line-height: var(--theme-line-height-snug);
  letter-spacing: var(--theme-tracking-tight);
}

.ds-type-heading-md {
  font-family: var(--theme-font-serif);
  font-size: var(--theme-font-size-xl);
  font-weight: var(--theme-font-weight-medium);
  line-height: var(--theme-line-height-snug);
}

.ds-type-heading-sm {
  font-family: var(--theme-font-serif);
  font-size: var(--theme-font-size-lg);
  font-weight: var(--theme-font-weight-medium);
  line-height: var(--theme-line-height-snug);
}

/* ─── Body (Content) ─── */
.ds-type-body-lg {
  font-family: var(--theme-font-sans);
  font-size: var(--theme-font-size-md);
  font-weight: var(--theme-font-weight-regular);
  line-height: var(--theme-line-height-relaxed);
  letter-spacing: var(--theme-tracking-normal);
}

.ds-type-body-md {
  font-family: var(--theme-font-sans);
  font-size: var(--theme-font-size-base);
  font-weight: var(--theme-font-weight-regular);
  line-height: var(--theme-line-height-relaxed);
  letter-spacing: var(--theme-tracking-normal);
}

.ds-type-body-sm {
  font-family: var(--theme-font-sans);
  font-size: var(--theme-font-size-sm);
  font-weight: var(--theme-font-weight-regular);
  line-height: var(--theme-line-height-normal);
  letter-spacing: var(--theme-tracking-normal);
}

/* ─── Label (UI Chrome) ─── */
.ds-type-label-lg {
  font-family: var(--theme-font-sans);
  font-size: var(--theme-font-size-base);
  font-weight: var(--theme-font-weight-semibold);
  line-height: var(--theme-line-height-normal);
}

.ds-type-label-md {
  font-family: var(--theme-font-sans);
  font-size: var(--theme-font-size-sm);
  font-weight: var(--theme-font-weight-semibold);
  line-height: var(--theme-line-height-normal);
}

.ds-type-label-sm {
  font-family: var(--theme-font-sans);
  font-size: var(--theme-font-size-xs);
  font-weight: var(--theme-font-weight-semibold);
  line-height: var(--theme-line-height-normal);
}

/* ─── Eyebrow (Section Label / Overline) ─── */
.ds-type-eyebrow {
  font-family: var(--theme-font-sans);
  font-size: var(--theme-font-size-2xs);
  font-weight: var(--theme-font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: var(--theme-tracking-widest);
  line-height: var(--theme-line-height-normal);
}

.ds-type-eyebrow-lg {
  font-family: var(--theme-font-sans);
  font-size: var(--theme-font-size-xs);
  font-weight: var(--theme-font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: var(--theme-tracking-wider);
  line-height: var(--theme-line-height-normal);
}

/* ─── Caption (Fine Print / Metadata) ─── */
.ds-type-caption {
  font-family: var(--theme-font-sans);
  font-size: var(--theme-font-size-xs);
  font-weight: var(--theme-font-weight-regular);
  line-height: var(--theme-line-height-normal);
  letter-spacing: var(--theme-tracking-normal);
}
```

## Components

### Button
Tag: `<ds-button>`
Props:
- label (string, default: Button)
- variant (select: primary | outline | ghost, default: primary)
- size (select: sm | md | lg, default: md)
- icon (icon, default: )
- icon-position (select: start | end, default: start)
- disabled (boolean, default: false)
- loading (boolean, default: false)
- full-width (boolean, default: false)
Slots: none

Example data:
```json
{
  "props": {
    "label": "Join Early Access",
    "variant": "primary",
    "size": "lg",
    "icon": "arrow-right",
    "icon-position": "end"
  }
}
```

Implementation (`components/button/button.js`):
```js
class DsButton extends HTMLElement {
  static props = {
    label: { type: 'string', default: 'Button' },
    variant: { type: 'select', options: ['primary', 'outline', 'ghost'], default: 'primary' },
    size: { type: 'select', options: ['sm', 'md', 'lg'], default: 'md' },
    icon: { type: 'icon', default: '' },
    'icon-position': { type: 'select', options: ['start', 'end'], default: 'start' },
    disabled: { type: 'boolean', default: false },
    loading: { type: 'boolean', default: false },
    'full-width': { type: 'boolean', default: false },
  };

  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    return ['label', 'variant', 'size', 'icon', 'icon-position', 'disabled', 'loading', 'full-width'];
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const label = this.getAttribute('label') || 'Button';
    const variant = this.getAttribute('variant') || 'primary';
    const size = this.getAttribute('size') || 'md';
    const icon = this.getAttribute('icon') || '';
    const iconPos = this.getAttribute('icon-position') || 'start';
    const disabled = this.hasAttribute('disabled');
    const loading = this.hasAttribute('loading');
    const fullWidth = this.hasAttribute('full-width');

    const classes = [
      'ds-button',
      `ds-button--${variant}`,
      `ds-button--${size}`,
      fullWidth ? 'ds-button--full' : '',
      loading ? 'ds-button--loading' : '',
    ].filter(Boolean).join(' ');

    const iconHtml = icon ? `<i class="ph ph-${icon} ds-button__icon"></i>` : '';

    const spinner = loading
      ? '<span class="ds-button__spinner" aria-hidden="true"><svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="40 20" /></svg></span>'
      : '';

    const content = iconPos === 'end'
      ? `<span class="ds-button__label">${label}</span>${iconHtml}`
      : `${iconHtml}<span class="ds-button__label">${label}</span>`;

    this.innerHTML = `<button class="${classes}" ${disabled || loading ? 'disabled' : ''} aria-busy="${loading}">${spinner}${content}</button>`;
  }
}

customElements.define('ds-button', DsButton);
```

Styles (`components/button/button.css`):
```css
/* ─── Base ─── */
.ds-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--theme-spacing-sm);
  border-radius: var(--theme-radius-pill);
  font-family: var(--theme-font-sans);
  font-weight: var(--theme-font-weight-semibold);
  letter-spacing: var(--theme-tracking-normal);
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  border: 1.5px solid transparent;
  position: relative;
  transition:
    background var(--theme-motion-fast) var(--theme-ease-default),
    border-color var(--theme-motion-fast) var(--theme-ease-default),
    color var(--theme-motion-fast) var(--theme-ease-default),
    transform var(--theme-motion-fast) var(--theme-ease-default),
    box-shadow var(--theme-motion-fast) var(--theme-ease-default);
  -webkit-tap-highlight-color: transparent;
}

.ds-button:hover {
  transform: translateY(-1px);
}

.ds-button:active {
  transform: translateY(0);
}

/* ─── Sizes ─── */
.ds-button--sm {
  padding: var(--theme-spacing-sm) var(--theme-spacing-lg);
  font-size: var(--theme-font-size-xs);
}

.ds-button--md {
  padding: var(--theme-spacing-md) var(--theme-spacing-xl);
  font-size: var(--theme-font-size-sm);
}

.ds-button--lg {
  padding: var(--theme-spacing-base) var(--theme-spacing-2xl);
  font-size: var(--theme-font-size-base);
}

/* ─── Primary ─── */
.ds-button--primary {
  background: var(--ds-color-brand);
  color: var(--ds-text-on-brand);
  box-shadow: 0 10px 40px -12px rgba(61, 92, 62, 0.35);
}

.ds-button--primary:hover {
  background: var(--ds-color-brand-hover);
  box-shadow: 0 14px 44px -12px rgba(61, 92, 62, 0.4);
}

.ds-button--primary:active {
  background: var(--ds-color-brand-hover);
  box-shadow: 0 6px 24px -8px rgba(61, 92, 62, 0.3);
}

/* ─── Outline ─── */
.ds-button--outline {
  background: transparent;
  color: var(--ds-text-primary);
  border-color: var(--ds-border-default);
}

.ds-button--outline:hover {
  border-color: var(--ds-color-brand);
  background: var(--ds-interactive-hover);
  color: var(--ds-text-brand);
}

.ds-button--outline:active {
  background: var(--ds-interactive-pressed);
}

/* ─── Ghost ─── */
.ds-button--ghost {
  background: transparent;
  color: var(--ds-text-secondary);
  border-color: transparent;
}

.ds-button--ghost:hover {
  background: var(--ds-interactive-hover);
  color: var(--ds-text-brand);
}

.ds-button--ghost:active {
  background: var(--ds-interactive-pressed);
}

/* ─── Full Width ─── */
.ds-button--full {
  width: 100%;
}

/* ─── Disabled ─── */
.ds-button:disabled {
  background: var(--ds-interactive-disabled-bg);
  color: var(--ds-interactive-disabled-text);
  border-color: transparent;
  cursor: default;
  transform: none;
  box-shadow: none;
}

/* ─── Loading ─── */
.ds-button--loading .ds-button__label,
.ds-button--loading .ds-button__icon {
  opacity: 0;
}

.ds-button__spinner {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ds-button__spinner svg {
  width: 1.2em;
  height: 1.2em;
  animation: ds-button-spin 0.8s linear infinite;
}

@keyframes ds-button-spin {
  to { transform: rotate(360deg); }
}

/* ─── Icon ─── */
.ds-button__icon {
  font-size: 1.15em;
  line-height: 1;
  flex-shrink: 0;
}

/* ─── Host ─── */
ds-button {
  display: inline-block;
}
```

### Card
Tag: `<ds-card>`
Props:
- variant (select: default | elevated | subtle | soft | glass | brand, default: default)
- padding (select: none | sm | md | lg, default: md)
- interactive (boolean, default: false)
Slots: media, header, (default), footer

Example data:
```json
{
  "props": {
    "variant": "default",
    "padding": "md",
    "interactive": false
  },
  "children": "<span slot=\"header\" class=\"ds-type-eyebrow\" style=\"color: var(--ds-text-muted);\">Healthcare</span>\n<h3 class=\"ds-type-heading-md\" style=\"margin-top: var(--theme-spacing-xs);\">Your AI Nutrition Guide</h3>\n<p class=\"ds-type-body-sm\" style=\"color: var(--ds-text-secondary); margin-top: var(--theme-spacing-sm);\">A 7-day plan, grocery list, and adaptive coach \u2014 tuned to you.</p>"
}
```

Implementation (`components/card/card.js`):
```js
const SHADOW_CSS = `
  :host {
    display: block;
    width: 100%;
  }

  .card {
    position: relative;
    overflow: hidden;
    transition:
      transform var(--theme-motion-normal) var(--theme-ease-default),
      box-shadow var(--theme-motion-normal) var(--theme-ease-default);
  }

  /* ─── Default (Zen Card) ─── */
  .card--default {
    background: var(--ds-surface-card);
    border: 1px solid var(--ds-border-default);
    border-radius: var(--theme-radius-xl);
    box-shadow: var(--theme-shadow-md);
  }

  /* ─── Elevated ─── */
  .card--elevated {
    background: var(--ds-surface-card);
    border: 1px solid var(--ds-border-subtle);
    border-radius: var(--theme-radius-xl);
    box-shadow: var(--theme-shadow-lg);
  }

  /* ─── Subtle (Paper / Muted) ─── */
  .card--subtle {
    background: var(--ds-surface-paper);
    border: 1px solid var(--ds-border-subtle);
    border-radius: var(--theme-radius-xl);
    box-shadow: 0 3px 12px rgba(60, 50, 30, 0.03);
  }

  /* ─── Soft (Sage Tinted) ─── */
  .card--soft {
    background: var(--ds-surface-sage);
    border: 1px solid var(--theme-sage-200);
    border-radius: var(--theme-radius-xl);
    box-shadow: none;
  }

  /* ─── Glass (Frosted) ─── */
  .card--glass {
    background: var(--ds-surface-overlay-light);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid var(--ds-border-default);
    border-radius: var(--theme-radius-xl);
    box-shadow: var(--theme-shadow-sm);
  }

  /* ─── Brand (Dark / Forest) ─── */
  .card--brand {
    background: var(--ds-surface-brand);
    color: var(--ds-text-on-brand);
    border: none;
    border-radius: var(--theme-radius-xl);
    box-shadow: var(--theme-shadow-lg);
  }

  /* ─── Interactive hover lift ─── */
  :host([interactive]) .card {
    cursor: pointer;
  }

  :host([interactive]) .card:hover {
    transform: translateY(-2px);
  }

  :host([interactive]) .card--default:hover,
  :host([interactive]) .card--elevated:hover {
    box-shadow: 0 14px 34px rgba(56, 67, 49, 0.11);
  }

  :host([interactive]) .card--subtle:hover {
    box-shadow: 0 8px 22px rgba(60, 50, 30, 0.06);
  }

  :host([interactive]) .card--glass:hover {
    box-shadow: var(--theme-shadow-md);
  }

  :host([interactive]) .card--brand:hover {
    box-shadow: var(--theme-shadow-xl);
  }

  /* ─── Padding sizes ─── */
  .card--pad-none { padding: 0; }
  .card--pad-sm { padding: var(--theme-spacing-md); }
  .card--pad-md { padding: var(--theme-spacing-lg); }
  .card--pad-lg { padding: var(--theme-spacing-2xl); }

  /* ─── Slots ─── */
  .card__header {
    padding: var(--theme-spacing-lg) var(--theme-spacing-lg) 0;
  }

  .card__body {
    padding: var(--theme-spacing-lg);
  }

  .card--pad-none .card__header {
    padding: 0;
  }

  .card--pad-none .card__body {
    padding: 0;
  }

  .card--pad-sm .card__header {
    padding: var(--theme-spacing-md) var(--theme-spacing-md) 0;
  }

  .card--pad-sm .card__body {
    padding: var(--theme-spacing-md);
  }

  .card--pad-lg .card__header {
    padding: var(--theme-spacing-2xl) var(--theme-spacing-2xl) 0;
  }

  .card--pad-lg .card__body {
    padding: var(--theme-spacing-2xl);
  }

  ::slotted([slot='media']) {
    display: block;
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
  }

  ::slotted([slot='footer']) {
    padding-top: var(--theme-spacing-md);
    border-top: 1px solid var(--ds-border-subtle);
  }
`;

class DsCard extends HTMLElement {
  static props = {
    variant: { type: 'select', options: ['default', 'elevated', 'subtle', 'soft', 'glass', 'brand'], default: 'default' },
    padding: { type: 'select', options: ['none', 'sm', 'md', 'lg'], default: 'md' },
    interactive: { type: 'boolean', default: false },
  };

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    if (window.__DS_STYLES) shadow.adoptedStyleSheets = [window.__DS_STYLES];

    const variant = this.getAttribute('variant') || 'default';
    const padding = this.getAttribute('padding') || 'md';

    shadow.innerHTML = `<style>${SHADOW_CSS}</style>
      <div class="card card--${variant} card--pad-${padding}">
        <slot name="media"></slot>
        <div class="card__header"><slot name="header"></slot></div>
        <div class="card__body"><slot></slot></div>
        <slot name="footer"></slot>
      </div>`;
  }
}

customElements.define('ds-card', DsCard);
```

Styles (`components/card/card.css`):
```css
ds-card {
  display: block;
  width: 100%;
}
```

### Progress Bar
Tag: `<ds-progress-bar>`
Props:
- value (number, default: 0)
- max (number, default: 100)
- variant (select: default | brand | accent | error, default: default)
- size (select: sm | md | lg, default: md)
- label (string, default: )
- show-value (boolean, default: false)
Slots: none

Example data:
```json
{
  "props": {
    "value": 65,
    "max": 100,
    "variant": "default",
    "size": "md",
    "label": "Protein",
    "show-value": true
  }
}
```

Implementation (`components/progress-bar/progress-bar.js`):
```js
class DsProgressBar extends HTMLElement {
  static props = {
    value: { type: 'number', default: 0 },
    max: { type: 'number', default: 100 },
    variant: { type: 'select', options: ['default', 'brand', 'accent', 'error'], default: 'default' },
    size: { type: 'select', options: ['sm', 'md', 'lg'], default: 'md' },
    label: { type: 'string', default: '' },
    'show-value': { type: 'boolean', default: false },
  };

  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    return ['value', 'max', 'variant', 'size', 'label', 'show-value'];
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const value = parseFloat(this.getAttribute('value')) || 0;
    const max = parseFloat(this.getAttribute('max')) || 100;
    const variant = this.getAttribute('variant') || 'default';
    const size = this.getAttribute('size') || 'md';
    const label = this.getAttribute('label') || '';
    const showValue = this.hasAttribute('show-value');

    const percent = Math.min(100, Math.max(0, (value / max) * 100));
    const displayValue = max === 100 ? `${Math.round(percent)}%` : `${Math.round(value)} / ${Math.round(max)}`;

    const hasHeader = label || showValue;
    const headerHtml = hasHeader
      ? `<div class="ds-progress-bar__header">${label ? `<span class="ds-progress-bar__label">${label}</span>` : ''}${showValue ? `<span class="ds-progress-bar__value">${displayValue}</span>` : ''}</div>`
      : '';

    this.innerHTML = `
      <div class="ds-progress-bar ds-progress-bar--${variant} ds-progress-bar--${size}">
        ${headerHtml}
        <div class="ds-progress-bar__track" role="progressbar" aria-valuenow="${Math.round(value)}" aria-valuemin="0" aria-valuemax="${Math.round(max)}" ${label ? `aria-label="${label}"` : ''}>
          <div class="ds-progress-bar__fill" style="width: ${percent}%"></div>
        </div>
      </div>`;
  }
}

customElements.define('ds-progress-bar', DsProgressBar);
```

Styles (`components/progress-bar/progress-bar.css`):
```css
/* ─── Host ─── */
ds-progress-bar {
  display: block;
  width: 100%;
}

/* ─── Container ─── */
.ds-progress-bar {
  display: flex;
  flex-direction: column;
  gap: var(--theme-spacing-sm);
}

/* ─── Header (label + value) ─── */
.ds-progress-bar__header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--theme-spacing-md);
}

.ds-progress-bar__label {
  font-family: var(--theme-font-sans);
  font-size: var(--theme-font-size-sm);
  font-weight: var(--theme-font-weight-semibold);
  color: var(--ds-text-primary);
  line-height: var(--theme-line-height-normal);
}

.ds-progress-bar__value {
  font-family: var(--theme-font-sans);
  font-size: var(--theme-font-size-xs);
  font-weight: var(--theme-font-weight-regular);
  color: var(--ds-text-muted);
  line-height: var(--theme-line-height-normal);
  white-space: nowrap;
}

/* ─── Track ─── */
.ds-progress-bar__track {
  width: 100%;
  overflow: hidden;
  border-radius: var(--theme-radius-pill);
  background: var(--ds-surface-muted);
}

/* ─── Fill ─── */
.ds-progress-bar__fill {
  height: 100%;
  border-radius: inherit;
  transition: width var(--theme-motion-ease) var(--theme-ease-default);
  min-width: 0;
}

/* ─── Sizes ─── */
.ds-progress-bar--sm .ds-progress-bar__track {
  height: 0.25rem;
}

.ds-progress-bar--md .ds-progress-bar__track {
  height: 0.375rem;
}

.ds-progress-bar--lg .ds-progress-bar__track {
  height: 0.625rem;
}

/* ─── Default (Forest gradient) ─── */
.ds-progress-bar--default .ds-progress-bar__fill {
  background: linear-gradient(90deg, var(--theme-sage-400), var(--theme-green-600));
}

/* ─── Brand (Solid forest) ─── */
.ds-progress-bar--brand .ds-progress-bar__fill {
  background: var(--ds-color-brand);
}

/* ─── Accent (Gold) ─── */
.ds-progress-bar--accent .ds-progress-bar__fill {
  background: linear-gradient(90deg, var(--theme-gold-300), var(--theme-gold-500));
}

/* ─── Error (Coral) ─── */
.ds-progress-bar--error .ds-progress-bar__fill {
  background: linear-gradient(90deg, var(--theme-coral-300), var(--theme-coral-500));
}
```

### Tag
Tag: `<ds-tag>`
Props:
- label (string, default: Tag)
- variant (select: default | accent | sage | error | solid, default: default)
- icon (icon, default: )
- removable (boolean, default: false)
Slots: none

Example data:
```json
{
  "props": {
    "label": "Diabetes friendly",
    "variant": "default"
  }
}
```

Implementation (`components/tag/tag.js`):
```js
class DsTag extends HTMLElement {
  static props = {
    label: { type: 'string', default: 'Tag' },
    variant: { type: 'select', options: ['default', 'accent', 'sage', 'error', 'solid'], default: 'default' },
    icon: { type: 'icon', default: '' },
    removable: { type: 'boolean', default: false },
  };

  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    return ['label', 'variant', 'icon', 'removable'];
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const label = this.getAttribute('label') || 'Tag';
    const variant = this.getAttribute('variant') || 'default';
    const icon = this.getAttribute('icon') || '';
    const removable = this.hasAttribute('removable');

    const variantClass = variant === 'default' ? '' : ` ds-tag-${variant}`;
    const iconHtml = icon
      ? `<i class="ph ph-${icon} ds-tag__icon"></i>`
      : '<span class="ds-tag__dot"></span>';
    const removeHtml = removable
      ? '<button class="ds-tag__remove" aria-label="Remove" type="button"><i class="ph ph-x"></i></button>'
      : '';

    this.innerHTML = `<span class="ds-tag${variantClass}">${iconHtml}<span class="ds-tag__label">${label}</span>${removeHtml}</span>`;

    if (removable) {
      const btn = this.querySelector('.ds-tag__remove');
      if (btn) {
        btn.addEventListener('click', () => {
          this.dispatchEvent(new CustomEvent('ds-remove', { bubbles: true }));
        });
      }
    }
  }
}

customElements.define('ds-tag', DsTag);
```

Styles (`components/tag/tag.css`):
```css
/* ─── Host ─── */
ds-tag {
  display: inline-block;
}

/* ─── Dot indicator ─── */
.ds-tag__dot {
  display: inline-block;
  width: 0.375rem;
  height: 0.375rem;
  border-radius: var(--theme-radius-round);
  background: currentColor;
  opacity: 0.55;
  flex-shrink: 0;
}

/* ─── Icon inside tag ─── */
.ds-tag__icon {
  font-size: 0.85em;
  line-height: 1;
  flex-shrink: 0;
}

/* ─── Label ─── */
.ds-tag__label {
  white-space: nowrap;
}

/* ─── Remove button ─── */
.ds-tag__remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: var(--theme-spacing-2xs);
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  color: currentColor;
  opacity: 0.5;
  font-size: 0.78em;
  line-height: 1;
  border-radius: var(--theme-radius-round);
  transition: opacity var(--theme-motion-fast) var(--theme-ease-default);
}

.ds-tag__remove:hover {
  opacity: 1;
}
```

## Guidelines

### guidelines/color-usage.md

## Forest Green is for Action

The primary green appears on buttons, active tabs, progress fills, and focus rings. It should not be used as a background fill for large areas (use the brand card variant for that). On a typical screen, only one or two elements should carry the full forest green.

## Gold is for Accent Moments

Gold marks premium content, divider decorations, and eyebrow labels on featured sections. It works best at small scale — text, icons, thin borders. Never use gold as a button color or large surface fill.

## Sage is the Botanical Neutral

Sage surfaces and tags provide a softer alternative when forest green would be too strong. Use sage for secondary groupings, soft backgrounds behind metrics, and tags that need to feel calm rather than action-oriented.

## Coral Means Caution

Coral is the warmest color in the palette and carries emotional weight. Reserve it for error states, allergen warnings, dietary restrictions, and destructive actions. It should never appear as a decorative accent.

## Neutral Warmth is Intentional

The neutral ramp runs from warm ivory to espresso — there are no cool grays. This warmth is deliberate and should not be overridden with blue-gray or pure-gray alternatives. Borders use the warm stone tones, and text descends through espresso rather than black.

## Text Contrast Hierarchy

Primary text (espresso) is for headings and key content. Secondary text is for body paragraphs and descriptions. Muted text is for metadata and supporting details. Hint text is the lightest and should only appear on non-essential labels. Never skip levels — if something is less important than body copy, it’s muted, not hint.

### guidelines/composition.md

## Cards Are the Primary Container

Nearly all grouped content lives inside a card. Standalone text blocks, floating metrics, or bare lists without a containing surface feel incomplete in this system. When in doubt, put it in a card.

## Never Nest Cards

A card inside a card creates visual confusion and breaks the surface hierarchy. If content inside a card needs its own grouping, use a subtle background shift (sage tint or paper surface) rather than a nested card.

## Button Pairing Rules

Pair one primary (filled) button with one or more outline or ghost alternatives. Never place two primary buttons side by side. Full-width buttons are for single-action contexts (modals, bottom sheets, onboarding steps). In horizontal button groups, the primary action sits on the right.

## Tags Group, Don’t Decorate

Tags should communicate real information: dietary categories, health conditions, cooking time, cuisine origin. Don’t use tags as visual decoration or to label things that are already obvious from context.

## Progress Bars Need Context

A progress bar without a label or value is meaningless. Always pair with at least a label, and show the current value when the specific number matters (nutrition tracking, goal completion). Bare bars are only acceptable as tiny inline indicators within a larger labeled context.

## Eyebrow Before Heading

The eyebrow + heading pattern is a signature of the system. Eyebrows in accent or muted color sit above a serif heading to establish context ("Healthcare" above "Heal & Restore"). The eyebrow is always smaller, uppercase, and wide-tracked. Don’t use an eyebrow without a heading below it.

## Dividers Are Rare

The gold accent divider is a special-occasion element — use it to mark major section breaks, not to separate every list item. The simple divider works for subtle content separation within cards (between tags and content, between footer and body).

### guidelines/design-principles.md

## Readability is Premium

Every piece of text must be legible without zooming, even on a phone. Body copy sits on warm, high-contrast backgrounds. Headings never compete with imagery. If a layout forces text to shrink below comfortable reading size, the layout needs to change — not the text.

## One Clear Reading Sequence Per Screen

Each view should have a single, obvious flow: where to look first, what to read next, and what action to take. Avoid splitting attention between multiple equally-weighted elements. When in doubt, stack vertically rather than arranging side-by-side.

## Personalization Feels Integrated

User-specific data (names, conditions, metrics) should look like it belongs in the design, not pasted over it. Use the same typography and spacing as surrounding content. Never frame personalized content in a visually distinct "widget" that breaks the editorial flow.

## Calm Pacing Over Density

Favor generous whitespace and breathing room. A screen with three well-spaced pieces of information is more useful than one with eight cramped items. Progress and nutrition data should feel encouraging, not overwhelming.

## Warmth Without Excess

The palette is earthy and organic, but restraint matters. Gold accents appear sparingly — in dividers, premium badges, and eyebrow text — never as large fills. Coral is reserved for warnings and destructive actions, not decoration. Forest green carries the weight of primary actions and should not be diluted across too many elements on one screen.

## Editorial, Not Dashboard

Layouts should feel like pages of a wellness journal, not panels of a data dashboard. Use serif headings, generous line heights, and eyebrow labels to create a sense of narrative structure. Metrics and charts sit inside the editorial framework, not the other way around.

## Gallery

### Button Variants

```html
<div style="max-width: 640px; margin: 0 auto; padding: var(--theme-spacing-2xl);">

  <!-- Primary -->
  <div style="padding: var(--theme-spacing-lg) 0;">
    <div style="font-size: var(--theme-font-size-xs); color: var(--ds-text-muted); text-transform: uppercase; letter-spacing: 0.05em; padding-bottom: var(--theme-spacing-sm); font-family: var(--theme-font-sans); font-weight: 600;">Primary</div>
    <div style="display: flex; flex-wrap: wrap; align-items: center; gap: var(--theme-spacing-md);">
      <ds-button label="Join Early Access" variant="primary" size="lg" icon="arrow-right" icon-position="end"></ds-button>
      <ds-button label="Get Started" variant="primary" size="md"></ds-button>
      <ds-button label="Save" variant="primary" size="sm" icon="floppy-disk"></ds-button>
    </div>
  </div>

  <!-- Outline -->
  <div style="padding: var(--theme-spacing-lg) 0;">
    <div style="font-size: var(--theme-font-size-xs); color: var(--ds-text-muted); text-transform: uppercase; letter-spacing: 0.05em; padding-bottom: var(--theme-spacing-sm); font-family: var(--theme-font-sans); font-weight: 600;">Outline</div>
    <div style="display: flex; flex-wrap: wrap; align-items: center; gap: var(--theme-spacing-md);">
      <ds-button label="Explore How It Works" variant="outline" size="lg"></ds-button>
      <ds-button label="View Details" variant="outline" size="md" icon="arrow-up-right" icon-position="end"></ds-button>
      <ds-button label="Filter" variant="outline" size="sm" icon="funnel"></ds-button>
    </div>
  </div>

  <!-- Ghost -->
  <div style="padding: var(--theme-spacing-lg) 0;">
    <div style="font-size: var(--theme-font-size-xs); color: var(--ds-text-muted); text-transform: uppercase; letter-spacing: 0.05em; padding-bottom: var(--theme-spacing-sm); font-family: var(--theme-font-sans); font-weight: 600;">Ghost</div>
    <div style="display: flex; flex-wrap: wrap; align-items: center; gap: var(--theme-spacing-md);">
      <ds-button label="See Insights" variant="ghost" size="md" icon="arrow-right" icon-position="end"></ds-button>
      <ds-button label="Open Plan" variant="ghost" size="sm"></ds-button>
      <ds-button label="Settings" variant="ghost" size="sm" icon="gear"></ds-button>
    </div>
  </div>

  <!-- States -->
  <div style="padding: var(--theme-spacing-lg) 0;">
    <div style="font-size: var(--theme-font-size-xs); color: var(--ds-text-muted); text-transform: uppercase; letter-spacing: 0.05em; padding-bottom: var(--theme-spacing-sm); font-family: var(--theme-font-sans); font-weight: 600;">States</div>
    <div style="display: flex; flex-wrap: wrap; align-items: center; gap: var(--theme-spacing-md);">
      <ds-button label="Disabled" variant="primary" disabled></ds-button>
      <ds-button label="Loading" variant="primary" loading></ds-button>
      <ds-button label="Disabled" variant="outline" disabled></ds-button>
    </div>
  </div>

  <!-- Full Width -->
  <div style="padding: var(--theme-spacing-lg) 0;">
    <div style="font-size: var(--theme-font-size-xs); color: var(--ds-text-muted); text-transform: uppercase; letter-spacing: 0.05em; padding-bottom: var(--theme-spacing-sm); font-family: var(--theme-font-sans); font-weight: 600;">Full Width</div>
    <div style="display: flex; flex-direction: column; gap: var(--theme-spacing-sm);">
      <ds-button label="Join Early Access" variant="primary" size="lg" full-width icon="arrow-right" icon-position="end"></ds-button>
      <ds-button label="Maybe Later" variant="outline" size="md" full-width></ds-button>
    </div>
  </div>

</div>
```

### Card Variants

```html
<div style="max-width: 720px; margin: 0 auto; padding: var(--theme-spacing-2xl);">

  <!-- Default -->
  <div style="padding: var(--theme-spacing-lg) 0;">
    <div style="font-size: var(--theme-font-size-xs); color: var(--ds-text-muted); text-transform: uppercase; letter-spacing: 0.05em; padding-bottom: var(--theme-spacing-sm); font-family: var(--theme-font-sans); font-weight: 600;">Default (Zen Card)</div>
    <ds-card variant="default">
      <span slot="header" class="ds-type-eyebrow" style="color: var(--ds-text-accent);">Healthcare</span>
      <h3 class="ds-type-heading-md" style="margin-top: var(--theme-spacing-xs);">Your AI Nutrition Guide</h3>
      <p class="ds-type-body-sm" style="color: var(--ds-text-secondary); margin-top: var(--theme-spacing-sm);">A 7-day plan, grocery list, and adaptive coach — tuned to you.</p>
    </ds-card>
  </div>

  <!-- Elevated -->
  <div style="padding: var(--theme-spacing-lg) 0;">
    <div style="font-size: var(--theme-font-size-xs); color: var(--ds-text-muted); text-transform: uppercase; letter-spacing: 0.05em; padding-bottom: var(--theme-spacing-sm); font-family: var(--theme-font-sans); font-weight: 600;">Elevated</div>
    <ds-card variant="elevated" interactive>
      <span slot="header" class="ds-type-eyebrow" style="color: var(--ds-text-muted);">Featured Recipe</span>
      <h3 class="ds-type-heading-md" style="margin-top: var(--theme-spacing-xs);">Turmeric Ginger Lentil Dal</h3>
      <p class="ds-type-body-sm" style="color: var(--ds-text-secondary); margin-top: var(--theme-spacing-sm);">A warm, anti-inflammatory bowl with 245 kcal and 18g protein.</p>
      <div style="display: flex; gap: var(--theme-spacing-sm); margin-top: var(--theme-spacing-md);">
        <ds-tag label="30 min" icon="clock"></ds-tag>
        <ds-tag label="India" variant="sage"></ds-tag>
      </div>
    </ds-card>
  </div>

  <!-- Subtle + Soft side by side -->
  <div style="padding: var(--theme-spacing-lg) 0;">
    <div style="font-size: var(--theme-font-size-xs); color: var(--ds-text-muted); text-transform: uppercase; letter-spacing: 0.05em; padding-bottom: var(--theme-spacing-sm); font-family: var(--theme-font-sans); font-weight: 600;">Subtle &amp; Soft</div>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--theme-spacing-md);">
      <ds-card variant="subtle" padding="sm">
        <div style="display: flex; align-items: center; gap: var(--theme-spacing-sm);">
          <i class="ph ph-drop" style="font-size: 1.2rem; color: var(--ds-text-brand);"></i>
          <div>
            <span class="ds-type-label-sm" style="color: var(--ds-text-muted);">Water</span>
            <p class="ds-type-label-lg" style="margin: 0;">5 <span class="ds-type-caption" style="color: var(--ds-text-hint);">/ 8 cups</span></p>
          </div>
        </div>
        <div style="margin-top: var(--theme-spacing-sm);">
          <ds-progress-bar value="62" size="sm"></ds-progress-bar>
        </div>
      </ds-card>
      <ds-card variant="soft" padding="sm">
        <div style="display: flex; align-items: center; gap: var(--theme-spacing-sm);">
          <i class="ph ph-heart" style="font-size: 1.2rem; color: var(--ds-text-accent);"></i>
          <div>
            <span class="ds-type-label-sm" style="color: var(--ds-text-muted);">Mindful Meals</span>
            <p class="ds-type-label-lg" style="margin: 0;">2 <span class="ds-type-caption" style="color: var(--ds-text-hint);">/ 3</span></p>
          </div>
        </div>
        <div style="margin-top: var(--theme-spacing-sm);">
          <ds-progress-bar value="66" variant="accent" size="sm"></ds-progress-bar>
        </div>
      </ds-card>
    </div>
  </div>

  <!-- Glass -->
  <div style="padding: var(--theme-spacing-lg) 0;">
    <div style="font-size: var(--theme-font-size-xs); color: var(--ds-text-muted); text-transform: uppercase; letter-spacing: 0.05em; padding-bottom: var(--theme-spacing-sm); font-family: var(--theme-font-sans); font-weight: 600;">Glass</div>
    <div style="background: linear-gradient(135deg, var(--theme-sage-300), var(--theme-green-400)); padding: var(--theme-spacing-2xl); border-radius: var(--theme-radius-xl);">
      <ds-card variant="glass" padding="md">
        <p class="ds-type-body-md">Frosted glass overlay, perfect for bottom navigation bars and floating panels.</p>
      </ds-card>
    </div>
  </div>

  <!-- Brand -->
  <div style="padding: var(--theme-spacing-lg) 0;">
    <div style="font-size: var(--theme-font-size-xs); color: var(--ds-text-muted); text-transform: uppercase; letter-spacing: 0.05em; padding-bottom: var(--theme-spacing-sm); font-family: var(--theme-font-sans); font-weight: 600;">Brand</div>
    <ds-card variant="brand" padding="lg">
      <span slot="header" class="ds-type-eyebrow" style="color: var(--theme-sage-300);">Early Access</span>
      <h3 class="ds-type-heading-lg" style="margin-top: var(--theme-spacing-xs); color: var(--ds-text-on-brand);">Join the first 1,000.</h3>
      <p class="ds-type-body-sm" style="color: var(--theme-green-200); margin-top: var(--theme-spacing-sm);">Lifetime perks for early members. Unlock the full recipe library.</p>
      <div style="margin-top: var(--theme-spacing-lg);">
        <ds-button label="Join Early Access" variant="outline" size="md" icon="arrow-right" icon-position="end"></ds-button>
      </div>
    </ds-card>
  </div>

</div>
```

### Progress Bar Variants

```html
<div style="max-width: 640px; margin: 0 auto; padding: var(--theme-spacing-2xl);">

  <!-- Variants -->
  <div style="padding: var(--theme-spacing-lg) 0;">
    <div style="font-size: var(--theme-font-size-xs); color: var(--ds-text-muted); text-transform: uppercase; letter-spacing: 0.05em; padding-bottom: var(--theme-spacing-md); font-family: var(--theme-font-sans); font-weight: 600;">Variants</div>
    <div style="display: flex; flex-direction: column; gap: var(--theme-spacing-lg);">
      <ds-progress-bar value="72" label="Default (Forest)" show-value></ds-progress-bar>
      <ds-progress-bar value="58" variant="brand" label="Brand (Solid)" show-value></ds-progress-bar>
      <ds-progress-bar value="45" variant="accent" label="Accent (Gold)" show-value></ds-progress-bar>
      <ds-progress-bar value="88" variant="error" label="Error (Coral)" show-value></ds-progress-bar>
    </div>
  </div>

  <!-- Sizes -->
  <div style="padding: var(--theme-spacing-lg) 0;">
    <div style="font-size: var(--theme-font-size-xs); color: var(--ds-text-muted); text-transform: uppercase; letter-spacing: 0.05em; padding-bottom: var(--theme-spacing-md); font-family: var(--theme-font-sans); font-weight: 600;">Sizes</div>
    <div style="display: flex; flex-direction: column; gap: var(--theme-spacing-lg);">
      <ds-progress-bar value="65" size="sm" label="Small"></ds-progress-bar>
      <ds-progress-bar value="65" size="md" label="Medium"></ds-progress-bar>
      <ds-progress-bar value="65" size="lg" label="Large"></ds-progress-bar>
    </div>
  </div>

  <!-- Nutrition Tracking -->
  <div style="padding: var(--theme-spacing-lg) 0;">
    <div style="font-size: var(--theme-font-size-xs); color: var(--ds-text-muted); text-transform: uppercase; letter-spacing: 0.05em; padding-bottom: var(--theme-spacing-md); font-family: var(--theme-font-sans); font-weight: 600;">Nutrition Tracking</div>
    <ds-card variant="default" padding="md">
      <div style="display: flex; flex-direction: column; gap: var(--theme-spacing-lg);">
        <ds-progress-bar value="1480" max="2100" label="Calories" show-value size="md"></ds-progress-bar>
        <ds-progress-bar value="85" max="130" variant="brand" label="Protein" show-value size="md"></ds-progress-bar>
        <ds-progress-bar value="180" max="260" variant="accent" label="Carbohydrates" show-value size="md"></ds-progress-bar>
        <ds-progress-bar value="52" max="70" variant="error" label="Fat" show-value size="md"></ds-progress-bar>
      </div>
    </ds-card>
  </div>

  <!-- Minimal (No Label) -->
  <div style="padding: var(--theme-spacing-lg) 0;">
    <div style="font-size: var(--theme-font-size-xs); color: var(--ds-text-muted); text-transform: uppercase; letter-spacing: 0.05em; padding-bottom: var(--theme-spacing-md); font-family: var(--theme-font-sans); font-weight: 600;">Minimal (Inline)</div>
    <div style="display: flex; flex-direction: column; gap: var(--theme-spacing-md);">
      <ds-progress-bar value="25" size="sm"></ds-progress-bar>
      <ds-progress-bar value="50" size="sm" variant="brand"></ds-progress-bar>
      <ds-progress-bar value="75" size="sm" variant="accent"></ds-progress-bar>
      <ds-progress-bar value="100" size="sm" variant="error"></ds-progress-bar>
    </div>
  </div>

</div>
```

### Tag Variants

```html
<div style="max-width: 640px; margin: 0 auto; padding: var(--theme-spacing-2xl);">

  <!-- All Variants -->
  <div style="padding: var(--theme-spacing-lg) 0;">
    <div style="font-size: var(--theme-font-size-xs); color: var(--ds-text-muted); text-transform: uppercase; letter-spacing: 0.05em; padding-bottom: var(--theme-spacing-sm); font-family: var(--theme-font-sans); font-weight: 600;">Variants</div>
    <div style="display: flex; flex-wrap: wrap; gap: var(--theme-spacing-sm);">
      <ds-tag label="Diabetes Friendly"></ds-tag>
      <ds-tag label="Premium" variant="accent" icon="crown"></ds-tag>
      <ds-tag label="Mediterranean" variant="sage"></ds-tag>
      <ds-tag label="Allergen" variant="error" icon="warning"></ds-tag>
      <ds-tag label="New" variant="solid"></ds-tag>
    </div>
  </div>

  <!-- With Icons -->
  <div style="padding: var(--theme-spacing-lg) 0;">
    <div style="font-size: var(--theme-font-size-xs); color: var(--ds-text-muted); text-transform: uppercase; letter-spacing: 0.05em; padding-bottom: var(--theme-spacing-sm); font-family: var(--theme-font-sans); font-weight: 600;">With Icons</div>
    <div style="display: flex; flex-wrap: wrap; gap: var(--theme-spacing-sm);">
      <ds-tag label="30 min" icon="clock"></ds-tag>
      <ds-tag label="245 kcal" icon="fire"></ds-tag>
      <ds-tag label="High Protein" icon="barbell"></ds-tag>
      <ds-tag label="India" icon="globe" variant="sage"></ds-tag>
      <ds-tag label="PCOS" icon="heart-half" variant="accent"></ds-tag>
    </div>
  </div>

  <!-- Dot Indicator (default) -->
  <div style="padding: var(--theme-spacing-lg) 0;">
    <div style="font-size: var(--theme-font-size-xs); color: var(--ds-text-muted); text-transform: uppercase; letter-spacing: 0.05em; padding-bottom: var(--theme-spacing-sm); font-family: var(--theme-font-sans); font-weight: 600;">Dot Indicator</div>
    <div style="display: flex; flex-wrap: wrap; gap: var(--theme-spacing-sm);">
      <ds-tag label="Diabetes Friendly"></ds-tag>
      <ds-tag label="PCOS Smart Swaps"></ds-tag>
      <ds-tag label="High Protein"></ds-tag>
      <ds-tag label="Anti-inflammatory" variant="sage"></ds-tag>
    </div>
  </div>

  <!-- Removable -->
  <div style="padding: var(--theme-spacing-lg) 0;">
    <div style="font-size: var(--theme-font-size-xs); color: var(--ds-text-muted); text-transform: uppercase; letter-spacing: 0.05em; padding-bottom: var(--theme-spacing-sm); font-family: var(--theme-font-sans); font-weight: 600;">Removable (Filters)</div>
    <div style="display: flex; flex-wrap: wrap; gap: var(--theme-spacing-sm);">
      <ds-tag label="Vegetarian" removable icon="leaf"></ds-tag>
      <ds-tag label="Under 30 min" removable icon="clock" variant="sage"></ds-tag>
      <ds-tag label="Low Sugar" removable variant="accent"></ds-tag>
    </div>
  </div>

  <!-- In Context (Recipe Card Tags) -->
  <div style="padding: var(--theme-spacing-lg) 0;">
    <div style="font-size: var(--theme-font-size-xs); color: var(--ds-text-muted); text-transform: uppercase; letter-spacing: 0.05em; padding-bottom: var(--theme-spacing-sm); font-family: var(--theme-font-sans); font-weight: 600;">In Context</div>
    <ds-card variant="subtle" padding="md">
      <h3 class="ds-type-heading-sm">Turmeric Ginger Lentil Dal</h3>
      <p class="ds-type-body-sm" style="color: var(--ds-text-secondary); margin-top: var(--theme-spacing-xs);">A warm, anti-inflammatory bowl packed with plant protein.</p>
      <div style="display: flex; flex-wrap: wrap; gap: var(--theme-spacing-xs); margin-top: var(--theme-spacing-md); padding-top: var(--theme-spacing-md); border-top: 1px solid var(--ds-border-subtle);">
        <ds-tag label="Diabetes" variant="sage"></ds-tag>
        <ds-tag label="Anti-inflammatory"></ds-tag>
      </div>
    </ds-card>
  </div>

</div>
```

### Typography And Recipes

```html
<div style="max-width: 640px; margin: 0 auto; padding: var(--theme-spacing-2xl);">

  <!-- Display -->
  <div style="padding: var(--theme-spacing-lg) 0;">
    <div style="font-size: var(--theme-font-size-xs); color: var(--ds-text-muted); text-transform: uppercase; letter-spacing: 0.05em; padding-bottom: var(--theme-spacing-md); font-family: var(--theme-font-sans); font-weight: 600;">Display</div>
    <div style="display: flex; flex-direction: column; gap: var(--theme-spacing-md);">
      <p class="ds-type-display-lg" style="color: var(--ds-text-primary);">Nourish Body & Mind</p>
      <p class="ds-type-display-md" style="color: var(--ds-text-primary);">Your Food Intelligence</p>
      <p class="ds-type-display-sm" style="color: var(--ds-text-primary);">Wellness Journey</p>
    </div>
  </div>

  <!-- Headings -->
  <div style="padding: var(--theme-spacing-lg) 0;">
    <div style="font-size: var(--theme-font-size-xs); color: var(--ds-text-muted); text-transform: uppercase; letter-spacing: 0.05em; padding-bottom: var(--theme-spacing-md); font-family: var(--theme-font-sans); font-weight: 600;">Headings</div>
    <div style="display: flex; flex-direction: column; gap: var(--theme-spacing-sm);">
      <p class="ds-type-heading-lg" style="color: var(--ds-text-primary);">Explore Your Plate</p>
      <p class="ds-type-heading-md" style="color: var(--ds-text-primary);">Today at a Glance</p>
      <p class="ds-type-heading-sm" style="color: var(--ds-text-primary);">Featured For You</p>
    </div>
  </div>

  <!-- Body -->
  <div style="padding: var(--theme-spacing-lg) 0;">
    <div style="font-size: var(--theme-font-size-xs); color: var(--ds-text-muted); text-transform: uppercase; letter-spacing: 0.05em; padding-bottom: var(--theme-spacing-md); font-family: var(--theme-font-sans); font-weight: 600;">Body</div>
    <div style="display: flex; flex-direction: column; gap: var(--theme-spacing-md);">
      <p class="ds-type-body-lg" style="color: var(--ds-text-secondary);">Personalized nutrition for real life — rooted in health, fitness and global food wisdom.</p>
      <p class="ds-type-body-md" style="color: var(--ds-text-secondary);">Let’s nourish your body and mind, one plate at a time. Small choices today, powerful changes tomorrow.</p>
      <p class="ds-type-body-sm" style="color: var(--ds-text-muted);">A warm, anti-inflammatory bowl with 245 kcal and 18g protein. Perfect for managing blood sugar levels.</p>
    </div>
  </div>

  <!-- Labels & Eyebrows -->
  <div style="padding: var(--theme-spacing-lg) 0;">
    <div style="font-size: var(--theme-font-size-xs); color: var(--ds-text-muted); text-transform: uppercase; letter-spacing: 0.05em; padding-bottom: var(--theme-spacing-md); font-family: var(--theme-font-sans); font-weight: 600;">Labels &amp; Eyebrows</div>
    <div style="display: flex; flex-direction: column; gap: var(--theme-spacing-md);">
      <p class="ds-type-label-lg">Label Large</p>
      <p class="ds-type-label-md">Label Medium</p>
      <p class="ds-type-label-sm">Label Small</p>
      <p class="ds-type-eyebrow" style="color: var(--ds-text-accent);">Pre-launch · Early access open</p>
      <p class="ds-type-eyebrow-lg" style="color: var(--ds-text-brand);">Your week in view</p>
      <p class="ds-type-caption" style="color: var(--ds-text-hint);">Caption · Fine print and metadata</p>
    </div>
  </div>

  <!-- Dividers -->
  <div style="padding: var(--theme-spacing-lg) 0;">
    <div style="font-size: var(--theme-font-size-xs); color: var(--ds-text-muted); text-transform: uppercase; letter-spacing: 0.05em; padding-bottom: var(--theme-spacing-md); font-family: var(--theme-font-sans); font-weight: 600;">Dividers</div>
    <div style="display: flex; flex-direction: column; gap: var(--theme-spacing-xl);">
      <hr class="ds-divider">
      <div class="ds-divider-accent">✶</div>
    </div>
  </div>

</div>
```

## Icon Style

This design system uses Phosphor icons.

## Font Configuration

- Playfair Display: weights 400, 500, 600, 700 (normal, italic), fallback: serif
- DM Sans: weights 300, 400, 500, 600, 700, fallback: sans-serif