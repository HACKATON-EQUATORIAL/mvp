import {
  queryOptions,
  type UseQueryOptions,
  useQuery,
} from "@tanstack/react-query";
import { apiGet } from "@/http/api";
import { getChannelSimulationsKeys } from "@/queries/keys/tracks/get-channel-simulations";
import { channelSimulationListSchema } from "@/schemas/http/track";

const getChannelSimulationsFn = (trackId: string, signal?: AbortSignal) =>
  apiGet(
    `tracks/${encodeURIComponent(trackId)}/channel-simulations`,
    channelSimulationListSchema,
    signal,
  );

export type GetChannelSimulationsData = Awaited<
  ReturnType<typeof getChannelSimulationsFn>
>;
export type GetChannelSimulationsQueryOptions = Omit<
  UseQueryOptions<
    GetChannelSimulationsData,
    Error,
    GetChannelSimulationsData,
    ReturnType<typeof getChannelSimulationsKeys.byTrackId>
  >,
  "queryKey" | "queryFn"
>;

// Returns query options; the HTTP request runs only when Query executes queryFn.
export function getChannelSimulations(
  trackId: string,
  options?: GetChannelSimulationsQueryOptions,
) {
  return queryOptions({
    enabled: !!trackId,
    ...options,
    queryKey: getChannelSimulationsKeys.byTrackId(trackId),
    queryFn: ({ signal }) => getChannelSimulationsFn(trackId, signal),
  });
}

export function useGetChannelSimulations(
  trackId: string,
  options?: GetChannelSimulationsQueryOptions,
) {
  return useQuery(getChannelSimulations(trackId, options));
}
