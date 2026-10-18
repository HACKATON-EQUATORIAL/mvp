"use client";

import { Zap } from "lucide-react";
import { ENERGY_MAX, energyOf, useJourneyProgress } from "../_lib/progress";
import styles from "./roadmap.module.css";

/** Energia acumulada na trilha (kWh de conhecimento). */
export function EnergyMeter() {
  const energy = energyOf(useJourneyProgress());
  return (
    <div className={styles.energy}>
      <span className="sr-only">Energia acumulada:</span>
      <Zap size={20} aria-hidden="true" />
      <strong>{energy}</strong>
      <span>/ {ENERGY_MAX} kWh</span>
      <span className={styles.energyBar} aria-hidden="true">
        <span style={{ width: `${(energy / ENERGY_MAX) * 100}%` }} />
      </span>
    </div>
  );
}
