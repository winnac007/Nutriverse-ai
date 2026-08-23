import Link from "next/link";
import { ArrowLeft, ArrowRight, Globe2, Menu, Sparkles, Sprout } from "lucide-react";
import styles from "./page.module.css";

const COUNTRY_CARDS = [
  {
    name: "China",
    cuisine: "Chinese",
    blurb: "Five-element cooking, fire, breath, time.",
    image: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=1000&q=85",
  },
  {
    name: "France",
    cuisine: "French",
    blurb: "Quiet refinement, herbs of Provence.",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1000&q=85",
  },
  {
    name: "Greece",
    cuisine: "Greek",
    blurb: "Mediterranean balance — olives, sun, fish.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&q=85",
  },
  {
    name: "India",
    cuisine: "Indian",
    blurb: "Flavorful. Rooted. Made for your health.",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1000&q=85",
  },
  {
    name: "Japan",
    cuisine: "Japanese",
    blurb: "Umami, ritual, season, and the sea.",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1000&q=85",
  },
  {
    name: "Italy",
    cuisine: "Italian",
    blurb: "Simple ingredients, generous tables.",
    image: "https://images.unsplash.com/photo-1529260830199-42c24126f198?w=1000&q=85",
  },
  {
    name: "Mexico",
    cuisine: "Mexican",
    blurb: "Maize, fire, citrus, slow-cooked depth.",
    image: "https://images.unsplash.com/photo-1518638150340-f706e86654de?w=1000&q=85",
  },
  {
    name: "Korea",
    cuisine: "Korean",
    blurb: "Fermentation, contrast, seasoned comfort.",
    image: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=1000&q=85",
  },
] as const;

export default function DiscoverThePlate() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.backButton} href="/app" aria-label="Back to home"><ArrowLeft /></Link>
        <Link className={styles.brand} href="/app"><Sprout /><span>Zenplato</span></Link>
        <Link className={styles.menuButton} href="/app/profile" aria-label="Open profile"><Menu /></Link>
      </header>

      <section className={styles.hero}>
        <img src="https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=1400&q=85" alt="Ramen with eggs, greens and chopsticks" />
        <span className={styles.heroShade} />
        <div className={styles.heroCopy}>
          <p>Chapter 03 · Discover</p>
          <h1>Travel the Plate</h1>
          <span className={styles.rule} />
          <p>Global cuisines, gently adapted to how you live.</p>
          <a href="#countries">Choose a country <ArrowRight /></a>
        </div>
        <span className={styles.heroIcon}><Globe2 /></span>
      </section>

      <section id="countries" className={styles.countries} aria-labelledby="countries-title">
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>Choose, then explore</p>
            <h2 id="countries-title">Countries &amp; cuisines</h2>
          </div>
          <Sparkles aria-hidden="true" />
        </div>
        <p className={styles.instruction}>Select a country card to open its dishes. You do not need to choose a pin on a map.</p>

        <div className={styles.countryGrid}>
          {COUNTRY_CARDS.map((country) => (
            <Link className={styles.countryCard} href={`/app/meals?country=${encodeURIComponent(country.cuisine)}`} key={country.name}>
              <span className={styles.countryImage}>
                <img src={country.image} alt={`${country.name} landscape`} loading="lazy" />
                <span className={styles.countryShade} />
                <strong>{country.name}</strong>
              </span>
              <span className={styles.countryCopy}><em>{country.blurb}</em><span>View dishes <ArrowRight /></span></span>
            </Link>
          ))}
        </div>
      </section>

      <aside className={styles.passportCard}>
        <span><Globe2 /></span>
        <div><h2>Keep a culinary passport</h2><p>Save the countries you explore and the recipes you complete.</p></div>
        <Link href="/app/passport">Open passport <ArrowRight /></Link>
      </aside>
    </div>
  );
}
