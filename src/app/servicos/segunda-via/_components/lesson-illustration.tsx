"use client";

import { CheckCircle2, FileText, Hand, Search, Zap } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { feedback } from "@/lib/feedback/sound";
import type { Step } from "../_lib/navigation";
import styles from "./lesson.module.css";

// Ilustrações de treino, coerentes com o conteúdo da API (menu de exemplo e
// conta DEMO-001, referência 09/2026). Não reproduzem o canal oficial.
// Aprender fazendo: a pessoa toca no lugar certo antes de ver o destaque.
export function LessonIllustration({ step }: { step: Step }) {
  return step === "encontrar" ? <ServiceMenu /> : <SampleBill />;
}

type Tap = { id: string; ok: boolean } | null;

function useTapChallenge(target: string) {
  const [tap, setTap] = useState<Tap>(null);
  const found = tap?.ok === true;
  function choose(id: string) {
    if (found) return;
    const ok = id === target;
    setTap({ id, ok });
    if (ok) feedback.correct();
    else feedback.wrong();
  }
  return { tap, found, choose };
}

function Prompt({
  found,
  hint,
  done,
}: {
  found: boolean;
  hint: string;
  done: string;
}) {
  return (
    <p
      className={styles.tapPrompt}
      data-found={found || undefined}
      role="status"
    >
      {found ? (
        <CheckCircle2 size={18} aria-hidden="true" />
      ) : (
        <Hand size={18} aria-hidden="true" />
      )}
      {found ? done : hint}
    </p>
  );
}

function ServiceMenu() {
  const reduced = useReducedMotion();
  const { tap, found, choose } = useTapChallenge("segunda-via");
  const items = [
    { id: "segunda-via", label: "Segunda via", icon: FileText },
    { id: "debitos", label: "Consultar débitos", icon: Search },
    { id: "falta", label: "Falta de energia", icon: Zap },
  ];
  return (
    <figure className={styles.figure}>
      <Prompt
        found={found}
        hint="Sua vez: toque na opção que entrega a conta."
        done="Isso! A outra via fica em “Segunda via”."
      />
      <div className={styles.device}>
        <p className={styles.deviceTitle}>Serviços</p>
        <ul className={styles.menu}>
          {items.map(({ id, label, icon: Icon }) => {
            const wrong = tap?.id === id && !tap.ok;
            const right = found && id === "segunda-via";
            return (
              <li key={id}>
                <motion.button
                  type="button"
                  className={styles.menuItem}
                  data-highlight={right || undefined}
                  data-wrong={wrong || undefined}
                  onClick={() => choose(id)}
                  animate={
                    wrong && !reduced ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }
                  }
                  transition={{ duration: 0.4 }}
                >
                  <Icon size={20} aria-hidden="true" />
                  <span>{label}</span>
                  {right && (
                    <CheckCircle2
                      size={18}
                      className={styles.check}
                      aria-hidden="true"
                    />
                  )}
                </motion.button>
              </li>
            );
          })}
        </ul>
      </div>
      <figcaption>
        {tap && !tap.ok
          ? "Essa opção é outro serviço. Procure a que tem “via” no nome."
          : "Menu de exemplo: a outra via da conta fica em “Segunda via”, não em “Consultar débitos”."}
      </figcaption>
    </figure>
  );
}

function SampleBill() {
  const { tap, found, choose } = useTapChallenge("mes");
  const rows = [
    { id: "id", label: "Identificação", value: "Conta exemplo DEMO-001" },
    { id: "mes", label: "Mês de referência", value: "09/2026" },
    { id: "valor", label: "Valor", value: "R$ 0,00 (fictício)" },
  ];
  return (
    <figure className={styles.figure}>
      <Prompt
        found={found}
        hint="Sua vez: toque no mês de referência da conta."
        done="Isso! 09/2026 é setembro de 2026."
      />
      <div className={styles.bill}>
        <div className={styles.billHeader}>
          <Zap size={18} aria-hidden="true" />
          <span>Conta de energia · exemplo</span>
        </div>
        <dl>
          {rows.map((row) => (
            <div
              key={row.id}
              data-highlight={
                (found && (row.id === "mes" || row.id === "id")) || undefined
              }
              data-wrong={(tap?.id === row.id && !tap.ok) || undefined}
            >
              <dt>
                <button
                  type="button"
                  className={styles.billTap}
                  onClick={() => choose(row.id)}
                >
                  {row.label}
                </button>
              </dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <figcaption>
        {tap && !tap.ok
          ? "Quase! O mês aparece em número, seguido do ano."
          : "Conta de exemplo: confira a identificação e o mês de referência. Setembro de 2026 aparece como 09/2026."}
      </figcaption>
    </figure>
  );
}
