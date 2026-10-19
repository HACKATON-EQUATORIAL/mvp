import { ChevronRight, type LucideIcon } from "lucide-react";
import Link from "next/link";
import styles from "./choice-card.module.css";

export { styles as choiceCardStyles };

/**
 * Card de escolha (serviço ou canal): disponível abre com seta; indisponível
 * fica tracejado com “Em breve” e não clica.
 */
export function ChoiceCard({
  href,
  icon: Icon,
  tone = "brand",
  title,
  description,
  meta,
  progress,
  tag,
}: {
  /** Sem `href`, o card aparece como “Em breve”. */
  href?: string;
  icon: LucideIcon;
  tone?: "brand" | "whatsapp";
  title: string;
  description: string;
  /** Linha de destaque (ex.: “Continuar · 40 de 90 kWh”). */
  meta?: string;
  /** Fração de 0 a 1 para a barra de progresso. */
  progress?: number;
  /** Etiqueta curta ao lado do título (ex.: “Treino”: deixa claro que não é o atendimento real). */
  tag?: string;
}) {
  const content = (
    <>
      <span
        className={styles.icon}
        data-tone={tone === "brand" ? "brand" : undefined}
        aria-hidden="true"
      >
        <Icon size={28} />
      </span>
      <span className={styles.text}>
        <span className={styles.title}>
          <strong>{title}</strong>
          {tag && <span className={styles.tag}>{tag}</span>}
        </span>
        <span>{description}</span>
        {meta && <span className={styles.meta}>{meta}</span>}
        {progress !== undefined && (
          <span className={styles.progress} aria-hidden="true">
            <span style={{ width: `${Math.min(progress, 1) * 100}%` }} />
          </span>
        )}
      </span>
      {href ? (
        <ChevronRight size={22} aria-hidden="true" />
      ) : (
        <span className={styles.soon}>Em breve</span>
      )}
    </>
  );
  return href ? (
    <Link href={href} className={styles.card}>
      {content}
    </Link>
  ) : (
    <div className={styles.card} aria-disabled="true">
      {content}
    </div>
  );
}
