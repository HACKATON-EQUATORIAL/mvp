import {
  queryOptions,
  type UseQueryOptions,
  useQuery,
} from "@tanstack/react-query";
import { apiGet } from "@/http/api";
import { getBundleKeys } from "@/queries/keys/tracks/get-bundle";
import { trackBundleSchema } from "@/schemas/http/track";

const getBundleFn = (trackId: string, signal?: AbortSignal) =>
  apiGet(
    `tracks/${encodeURIComponent(trackId)}/bundle`,
    trackBundleSchema,
    signal,
  );

export type GetBundleData = Awaited<ReturnType<typeof getBundleFn>>;
export type GetBundleQueryOptions = Omit<
  UseQueryOptions<
    GetBundleData,
    Error,
    GetBundleData,
    ReturnType<typeof getBundleKeys.byTrackId>
  >,
  "queryKey" | "queryFn"
>;

// Conteúdo de treino muda pouco: uma busca por sessão serve a jornada toda.
export function getBundle(trackId: string, options?: GetBundleQueryOptions) {
  return queryOptions({
    enabled: !!trackId,
    staleTime: 30 * 60_000,
    gcTime: 60 * 60_000,
    ...options,
    queryKey: getBundleKeys.byTrackId(trackId),
    queryFn: ({ signal }) => getBundleFn(trackId, signal),
  });
}

export function useGetBundle(trackId: string, options?: GetBundleQueryOptions) {
  return useQuery(getBundle(trackId, options));
}
