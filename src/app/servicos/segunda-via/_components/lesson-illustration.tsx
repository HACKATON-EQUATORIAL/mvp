import { CheckCircle2, FileText, Search, Zap } from "lucide-react";
import type { Step } from "../_lib/navigation";
import styles from "./lesson.module.css";

// Ilustrações de treino, coerentes com o conteúdo da API (menu de exemplo e
// conta DEMO-001, referência 09/2026). Não reproduzem o canal oficial.
export function LessonIllustration({ step }: { step: Step }) {
  return step === "encontrar" ? <ServiceMenu /> : <SampleBill />;
}

function ServiceMenu() {
  const items = [
    { label: "Segunda via", icon: FileText, highlight: true },
    { label: "Consultar débitos", icon: Search },
    { label: "Falta de energia", icon: Zap },
  ];
  return (
    <figure className={styles.figure}>
      <div className={styles.device} aria-hidden="true">
        <p className={styles.deviceTitle}>Serviços</p>
        <ul className={styles.menu}>
          {items.map(({ label, icon: Icon, highlight }) => (
            <li key={label} data-highlight={highlight || undefined}>
              <Icon size={20} />
              <span>{label}</span>
              {highlight && <CheckCircle2 size={18} className={styles.check} />}
            </li>
          ))}
        </ul>
      </div>
      <figcaption>
        Menu de exemplo: a outra via da conta fica em “Segunda via”, não em
        “Consultar débitos”.
      </figcaption>
    </figure>
  );
}

function SampleBill() {
  return (
    <figure className={styles.figure}>
      <div className={styles.bill} aria-hidden="true">
        <div className={styles.billHeader}>
          <Zap size={18} />
          <span>Conta de energia · exemplo</span>
        </div>
        <dl>
          <div data-highlight>
            <dt>Identificação</dt>
            <dd>Conta exemplo DEMO-001</dd>
          </div>
          <div data-highlight>
            <dt>Mês de referência</dt>
            <dd>09/2026</dd>
          </div>
          <div>
            <dt>Valor</dt>
            <dd>R$ 0,00 (fictício)</dd>
          </div>
        </dl>
      </div>
      <figcaption>
        Conta de exemplo: confira a identificação e o mês de referência.
        Setembro de 2026 aparece como 09/2026.
      </figcaption>
    </figure>
  );
}
