import {
  queryOptions,
  type UseQueryOptions,
  useQuery,
} from "@tanstack/react-query";
import { apiGet } from "@/http/api";
import { getChannelExitKeys } from "@/queries/keys/channel/get-channel-exit";
import { channelExitSchema } from "@/schemas/http/channel";

const getChannelExitFn = (trackId?: string, signal?: AbortSignal) =>
  apiGet(
    `channel-exit${trackId ? `?${new URLSearchParams({ track_id: trackId })}` : ""}`,
    channelExitSchema,
    signal,
  );

export type GetChannelExitData = Awaited<ReturnType<typeof getChannelExitFn>>;
export type GetChannelExitQueryOptions = Omit<
  UseQueryOptions<
    GetChannelExitData,
    Error,
    GetChannelExitData,
    ReturnType<typeof getChannelExitKeys.byTrackId>
  >,
  "queryKey" | "queryFn"
>;

// Returns query options; the HTTP request runs only when Query executes queryFn.
export function getChannelExit(
  trackId?: string,
  options?: GetChannelExitQueryOptions,
) {
  return queryOptions({
    ...options,
    queryKey: getChannelExitKeys.byTrackId(trackId),
    queryFn: ({ signal }) => getChannelExitFn(trackId, signal),
  });
}

export function useGetChannelExit(
  trackId?: string,
  options?: GetChannelExitQueryOptions,
) {
  return useQuery(getChannelExit(trackId, options));
}
