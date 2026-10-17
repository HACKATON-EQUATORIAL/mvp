import {
  queryOptions,
  type UseQueryOptions,
  useQuery,
} from "@tanstack/react-query";
import { apiGet } from "@/http/api";
import { getDifficultiesKeys } from "@/queries/keys/tracks/get-difficulties";
import { difficultyListSchema } from "@/schemas/http/track";

const getDifficultiesFn = (trackId: string, signal?: AbortSignal) =>
  apiGet(
    `tracks/${encodeURIComponent(trackId)}/difficulties`,
    difficultyListSchema,
    signal,
  );

export type GetDifficultiesData = Awaited<ReturnType<typeof getDifficultiesFn>>;
export type GetDifficultiesQueryOptions = Omit<
  UseQueryOptions<
    GetDifficultiesData,
    Error,
    GetDifficultiesData,
    ReturnType<typeof getDifficultiesKeys.byTrackId>
  >,
  "queryKey" | "queryFn"
>;

// Returns query options; the HTTP request runs only when Query executes queryFn.
export function getDifficulties(
  trackId: string,
  options?: GetDifficultiesQueryOptions,
) {
  return queryOptions({
    enabled: !!trackId,
    ...options,
    queryKey: getDifficultiesKeys.byTrackId(trackId),
    queryFn: ({ signal }) => getDifficultiesFn(trackId, signal),
  });
}

export function useGetDifficulties(
  trackId: string,
  options?: GetDifficultiesQueryOptions,
) {
  return useQuery(getDifficulties(trackId, options));
}
