import { Suspense } from "react";
import HealthcareClient from "./HealthcareClient";
import styles from "./Healthcare.module.css";

export default function HealthcarePage() {
  return (
    <Suspense fallback={<div className={styles.loadingState}>Preparing your health library…</div>}>
      <HealthcareClient />
    </Suspense>
  );
}
