"use client";

import { useGetBundle } from "@/http/track/get-bundle";
import { useGetTracks } from "@/http/track/get-tracks";
import type { InterpretationRequest } from "@/lib/assistant/schemas";

// Catálogo do assistente a partir dos dados já em cache (lista de serviços e o
// pacote único da segunda via), sem requisições extras.
export function useVoiceCatalog(enabled: boolean) {
  const tracks = useGetTracks({ enabled });
  const available =
    tracks.data?.some(
      (track) => track.id === "segunda-via" && track.status === "available",
    ) ?? false;
  const bundle = useGetBundle("segunda-via", { enabled: enabled && available });
  const catalog: InterpretationRequest["catalog"] = {
    state:
      tracks.isError || (available && bundle.isError)
        ? "error"
        : !tracks.data || (available && !bundle.data)
          ? "loading"
          : "ready",
    tracks: (tracks.data ?? [])
      .filter(
        (track) => track.id === "segunda-via" && track.status === "available",
      )
      .map(({ id, title, status }) => ({ id, title, status })),
    secondCopy: bundle.data
      ? {
          title: bundle.data.title,
          objective: bundle.data.objective,
          steps: bundle.data.steps.map(({ id, title }) => ({ id, title })),
          difficulties: bundle.data.difficulties.map(({ id, label }) => ({
            id,
            label,
          })),
        }
      : null,
  };
  return {
    catalog,
    retry: () => {
      void tracks.refetch();
      if (available) void bundle.refetch();
    },
  };
}
