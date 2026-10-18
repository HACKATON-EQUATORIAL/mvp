"use client";

import { Zap } from "lucide-react";
import { ENERGY_MAX, energyOf, useJourneyProgress } from "../_lib/progress";
import styles from "./roadmap.module.css";

/** Energia acumulada no serviço (kWh de conhecimento). */
export function EnergyMeter({ completed }: { completed: boolean }) {
  const progress = useJourneyProgress();
  const energy = energyOf(progress);
  return (
    <div className={styles.energy}>
      <div className={styles.energyHeader}>
        <h2 className={styles.energyTitle}>Energia de Aprendizado</h2>
        <span className={styles.energyStatus}>
          {completed ? "Meta atingida!" : "Em progresso"}
        </span>
      </div>
      <div className={styles.energyScore}>
        <span className="sr-only">Energia acumulada:</span>
        <Zap size={20} aria-hidden="true" />
        <strong>{energy}</strong>
        <span>/ {ENERGY_MAX} kWh virtuais</span>
      </div>
      <span className={styles.energyBar} aria-hidden="true">
        <span style={{ width: `${(energy / ENERGY_MAX) * 100}%` }} />
      </span>
      <p className={styles.energyMessage}>
        {completed
          ? "Você completou sua jornada de aprendizado!"
          : "Ganhe energia a cada etapa concluída."}
      </p>
    </div>
  );
}
