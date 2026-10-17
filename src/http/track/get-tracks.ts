import {
  queryOptions,
  type UseQueryOptions,
  useQuery,
} from "@tanstack/react-query";
import { apiGet } from "@/http/api";
import { getTracksKeys } from "@/queries/keys/tracks/get-tracks";
import { trackListSchema } from "@/schemas/http/track";

const getTracksFn = (signal?: AbortSignal) =>
  apiGet("tracks", trackListSchema, signal);

export type GetTracksData = Awaited<ReturnType<typeof getTracksFn>>;
export type GetTracksQueryOptions = Omit<
  UseQueryOptions<
    GetTracksData,
    Error,
    GetTracksData,
    typeof getTracksKeys.list
  >,
  "queryKey" | "queryFn"
>;

// Returns query options; the HTTP request runs only when Query executes queryFn.
export function getTracks(options?: GetTracksQueryOptions) {
  return queryOptions({
    ...options,
    queryKey: getTracksKeys.list,
    queryFn: ({ signal }) => getTracksFn(signal),
  });
}

export function useGetTracks(options?: GetTracksQueryOptions) {
  return useQuery(getTracks(options));
}
