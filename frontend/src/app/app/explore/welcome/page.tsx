import { CulinaryPage, PrimaryLink, ZenplatoMark } from "@/components/culinary/CulinaryPrimitives";

import styles from "./page.module.css";

export default function CulinaryWelcomePage() {
  return (
    <CulinaryPage className={styles.page}>
      <main className={styles.stage}>
        <img className={styles.plate} src="/landing/hero-bowl.jpg" alt="A nourishing plate with greens, avocado, chickpeas, and grains" />
        <img className={styles.branch} src="/landing/olive-branch.png" alt="" aria-hidden="true" />
        <div className={styles.shade} />

        <div className={styles.content}>
          <ZenplatoMark />

          <div className={styles.copy}>
            <h1>
              Travel the plate.
              <span>Discover the world.</span>
            </h1>
            <p>
              <span>Global cuisines.</span>
              <span>Authentic recipes.</span>
              <span>Timeless traditions.</span>
            </p>
            <PrimaryLink href="/app/explore">Start Exploring</PrimaryLink>
          </div>
        </div>
      </main>
    </CulinaryPage>
  );
}
