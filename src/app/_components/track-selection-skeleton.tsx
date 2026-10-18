import { Skeleton } from "@/components/ui/skeleton";
import styles from "./track-selection.module.css";

export function TrackSelectionSkeleton({ paused }: { paused: boolean }) {
  return (
    <div>
      <p role="status" className={paused ? undefined : "sr-only"}>
        {paused
          ? "Você está sem conexão. Os serviços serão carregados quando ela voltar."
          : "Carregando serviços…"}
      </p>
      <div className={styles.list} aria-hidden="true" data-paused={paused}>
        {["first", "second", "third", "fourth"].map((id) => (
          <div key={id} className={styles.skeletonCard}>
            <Skeleton className={styles.skeletonTitle} />
            {id !== "first" && <Skeleton className={styles.skeletonStatus} />}
          </div>
        ))}
      </div>
    </div>
  );
}
