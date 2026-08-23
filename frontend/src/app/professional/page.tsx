import Link from "next/link";
import { ChefHat, Sprout } from "lucide-react";
import styles from "@/components/professional/Professional.module.css";

export default function ProfessionalPortalPage() {
  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.topbar}>
          <Link className={styles.brand} href="/"><Sprout /><span>Zenplato</span></Link>
          <Link className={styles.backLink} href="/app">Back to user app</Link>
        </header>
        <section className={styles.portalIntro}>
          <p className={styles.eyebrow}>Professional workspace</p>
          <h1>Bring trusted care and thoughtful food to the table.</h1>
          <p>Choose your professional path. Consultant and chef accounts have separate registration, sessions and dashboards.</p>
        </section>
        <section className={styles.roleGrid} aria-label="Professional account types">
          <article className={styles.roleCard}>
            <span className={styles.roleIcon}><Sprout /></span><h2>Consultants</h2><p>Present your expertise, manage availability and receive consultation requests from members.</p>
            <div className={styles.roleLinks}><Link className={styles.primaryLink} href="/professional/consultant/register">Register as consultant</Link><Link className={styles.secondaryLink} href="/professional/consultant/login">Consultant sign in</Link></div>
          </article>
          <article className={styles.roleCard}>
            <span className={styles.roleIcon}><ChefHat /></span><h2>Chefs</h2><p>Create a chef profile, publish Chef Specials, and manage budget or premium recipes.</p>
            <div className={styles.roleLinks}><Link className={styles.primaryLink} href="/professional/chef/register">Register as chef</Link><Link className={styles.secondaryLink} href="/professional/chef/login">Chef sign in</Link></div>
          </article>
        </section>
      </div>
    </main>
  );
}
