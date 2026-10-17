import {
  queryOptions,
  type UseQueryOptions,
  useQuery,
} from "@tanstack/react-query";
import { apiGet } from "@/http/api";
import { getStepKeys } from "@/queries/keys/tracks/get-step";
import { stepDetailSchema } from "@/schemas/http/track";

const getStepFn = (trackId: string, stepId: string, signal?: AbortSignal) =>
  apiGet(
    `tracks/${encodeURIComponent(trackId)}/steps/${encodeURIComponent(stepId)}`,
    stepDetailSchema,
    signal,
  );

export type GetStepData = Awaited<ReturnType<typeof getStepFn>>;
export type GetStepQueryOptions = Omit<
  UseQueryOptions<
    GetStepData,
    Error,
    GetStepData,
    ReturnType<typeof getStepKeys.byId>
  >,
  "queryKey" | "queryFn"
>;

// Returns query options; the HTTP request runs only when Query executes queryFn.
export function getStep(
  trackId: string,
  stepId: string,
  options?: GetStepQueryOptions,
) {
  return queryOptions({
    enabled: !!trackId && !!stepId,
    ...options,
    queryKey: getStepKeys.byId(trackId, stepId),
    queryFn: ({ signal }) => getStepFn(trackId, stepId, signal),
  });
}

export function useGetStep(
  trackId: string,
  stepId: string,
  options?: GetStepQueryOptions,
) {
  return useQuery(getStep(trackId, stepId, options));
}
