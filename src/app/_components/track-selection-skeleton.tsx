import { Skeleton } from "@/components/ui/skeleton";
import styles from "./track-selection.module.css";

export function TrackSelectionSkeleton({ paused }: { paused: boolean }) {
  return (
    <div>
      <p role="status" className={paused ? undefined : "sr-only"}>
        {paused
          ? "Você está sem conexão. As trilhas serão carregadas quando ela voltar."
          : "Carregando trilhas…"}
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
