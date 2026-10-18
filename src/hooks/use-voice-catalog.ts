"use client";

import { useGetDifficulties } from "@/http/track/get-difficulties";
import { useGetTrack } from "@/http/track/get-track";
import { useGetTracks } from "@/http/track/get-tracks";
import type { InterpretationRequest } from "@/lib/assistant/schemas";

export function useVoiceCatalog(enabled: boolean) {
  const tracks = useGetTracks({ enabled });
  const secondCopyAvailable =
    tracks.data?.some(
      (track) => track.id === "segunda-via" && track.status === "available",
    ) ?? false;
  const detail = useGetTrack("segunda-via", {
    enabled: enabled && secondCopyAvailable,
  });
  // Dificuldades enriquecem o contexto, mas não bloqueiam o catálogo.
  const difficulties = useGetDifficulties("segunda-via", {
    enabled: enabled && secondCopyAvailable,
  });
  const catalog: InterpretationRequest["catalog"] = {
    state:
      tracks.isError || (secondCopyAvailable && detail.isError)
        ? "error"
        : !tracks.data || (secondCopyAvailable && !detail.data)
          ? "loading"
          : "ready",
    tracks: (tracks.data ?? [])
      .filter(
        (track) => track.id === "segunda-via" && track.status === "available",
      )
      .map(({ id, title, status }) => ({ id, title, status })),
    secondCopy:
      secondCopyAvailable && detail.data?.status === "available"
        ? {
            title: detail.data.title,
            objective: detail.data.objective,
            steps: detail.data.steps.map(({ id, title }) => ({ id, title })),
            difficulties: (difficulties.data?.items ?? []).map(
              ({ id, label }) => ({ id, label }),
            ),
          }
        : null,
  };
  return {
    catalog,
    retry: () => {
      void tracks.refetch();
      if (secondCopyAvailable) void detail.refetch();
    },
  };
}
