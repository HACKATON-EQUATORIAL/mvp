"use client";

import { Flame, Zap } from "lucide-react";
import {
  ENERGY_MAX,
  energyOf,
  streakOf,
  useJourneyProgress,
} from "../_lib/progress";
import styles from "./roadmap.module.css";

/** Energia acumulada na trilha (kWh de conhecimento). */
export function EnergyMeter() {
  const progress = useJourneyProgress();
  const energy = energyOf(progress);
  const streak = streakOf(progress);
  return (
    <div className={styles.energy}>
      <span className="sr-only">Energia acumulada:</span>
      <Zap size={20} aria-hidden="true" />
      <strong>{energy}</strong>
      <span>/ {ENERGY_MAX} kWh</span>
      {streak > 0 && (
        <span className={styles.streak}>
          <Flame size={18} aria-hidden="true" />
          {streak} {streak === 1 ? "dia" : "dias"} seguidos
        </span>
      )}
      <span className={styles.energyBar} aria-hidden="true">
        <span style={{ width: `${(energy / ENERGY_MAX) * 100}%` }} />
      </span>
    </div>
  );
}
