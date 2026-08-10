import Link from "next/link";
import type { ReactNode } from "react";

import styles from "./CulinaryPrimitives.module.css";

export function ArrowIcon({ direction = "right" }: { direction?: "left" | "right" }) {
  return (
    <svg className={direction === "left" ? styles.flip : undefined} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h13M13 6l6 6-6 6" />
    </svg>
  );
}

export function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m9 5 7 7-7 7" />
    </svg>
  );
}

export function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m16.5 16.5 4 4" />
    </svg>
  );
}

export function HeartIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" data-filled={filled || undefined}>
      <path d="M20.8 4.7a5.4 5.4 0 0 0-7.7 0L12 5.8l-1.1-1.1a5.4 5.4 0 0 0-7.7 7.7l1.1 1.1L12 21l7.7-7.5 1.1-1.1a5.4 5.4 0 0 0 0-7.7Z" />
    </svg>
  );
}

export function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 17v3h14v-3" />
    </svg>
  );
}

export function ZenplatoMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`${styles.logo} ${compact ? styles.logoCompact : ""}`} aria-label="Zenplato">
      <svg viewBox="0 0 54 54" aria-hidden="true">
        <path d="M39 9A20 20 0 1 0 43 38" />
        <path d="M15 17h25L15 42h27" />
        <circle cx="44" cy="32" r="1.8" />
      </svg>
      <span>Zenplato</span>
    </span>
  );
}

export function CulinaryPage({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`${styles.page} ${className}`}>{children}</div>;
}

export function CulinaryShell({
  children,
  narrow = false,
  className = "",
}: {
  children: ReactNode;
  narrow?: boolean;
  className?: string;
}) {
  return (
    <div className={`${styles.shell} ${narrow ? styles.shellNarrow : ""} ${className}`}>
      {children}
    </div>
  );
}

export function ScreenHeader({
  title,
  backHref,
  backLabel = "Back",
  right,
}: {
  title: string;
  backHref: string;
  backLabel?: string;
  right?: ReactNode;
}) {
  return (
    <header className={styles.screenHeader}>
      <Link href={backHref} className={styles.roundButton} aria-label={backLabel}>
        <ArrowIcon direction="left" />
      </Link>
      <h1>{title}</h1>
      <div className={styles.headerRight}>{right}</div>
    </header>
  );
}

export function SectionHeading({
  title,
  href,
  action = "View all",
}: {
  title: string;
  href?: string;
  action?: string;
}) {
  return (
    <div className={styles.sectionHeading}>
      <h2>{title}</h2>
      {href ? (
        <Link href={href}>{action} <ArrowIcon /></Link>
      ) : null}
    </div>
  );
}

export function PrimaryLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link className={`${styles.primaryLink} ${className}`} href={href}>
      <span>{children}</span>
      <ArrowIcon />
    </Link>
  );
}

export function EmptyState({ title, message, action }: { title: string; message: string; action?: ReactNode }) {
  return (
    <section className={styles.emptyState} role="status">
      <span aria-hidden="true">✦</span>
      <h2>{title}</h2>
      <p>{message}</p>
      {action}
    </section>
  );
}
