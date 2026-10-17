import {
  queryOptions,
  type UseQueryOptions,
  useQuery,
} from "@tanstack/react-query";
import { apiGet } from "@/http/api";
import { getTrackKeys } from "@/queries/keys/tracks/get-track";
import { trackDetailSchema } from "@/schemas/http/track";

const getTrackFn = (trackId: string, signal?: AbortSignal) =>
  apiGet(`tracks/${encodeURIComponent(trackId)}`, trackDetailSchema, signal);

export type GetTrackData = Awaited<ReturnType<typeof getTrackFn>>;
export type GetTrackQueryOptions = Omit<
  UseQueryOptions<
    GetTrackData,
    Error,
    GetTrackData,
    ReturnType<typeof getTrackKeys.byId>
  >,
  "queryKey" | "queryFn"
>;

// Returns query options; the HTTP request runs only when Query executes queryFn.
export function getTrack(trackId: string, options?: GetTrackQueryOptions) {
  return queryOptions({
    enabled: !!trackId,
    ...options,
    queryKey: getTrackKeys.byId(trackId),
    queryFn: ({ signal }) => getTrackFn(trackId, signal),
  });
}

export function useGetTrack(trackId: string, options?: GetTrackQueryOptions) {
  return useQuery(getTrack(trackId, options));
}
