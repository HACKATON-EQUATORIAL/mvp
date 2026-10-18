import {
  queryOptions,
  type UseQueryOptions,
  useQuery,
} from "@tanstack/react-query";
import { apiRequest } from "@/http/api";
import { getAttemptKeys } from "@/queries/keys/practice/get-attempt";
import { attemptStateSchema } from "@/schemas/http/practice";

const getAttemptFn = (attemptId: string, signal?: AbortSignal) =>
  apiRequest(
    `practice/attempts/${encodeURIComponent(attemptId)}`,
    attemptStateSchema,
    { session: true, signal },
  );

export type GetAttemptData = Awaited<ReturnType<typeof getAttemptFn>>;
export type GetAttemptQueryOptions = Omit<
  UseQueryOptions<
    GetAttemptData,
    Error,
    GetAttemptData,
    ReturnType<typeof getAttemptKeys.byId>
  >,
  "queryKey" | "queryFn"
>;

// Retoma uma tentativa salva; o estado é sempre o do backend.
export function getAttempt(
  attemptId: string,
  options?: GetAttemptQueryOptions,
) {
  return queryOptions({
    enabled: !!attemptId,
    staleTime: 0,
    ...options,
    queryKey: getAttemptKeys.byId(attemptId),
    queryFn: ({ signal }) => getAttemptFn(attemptId, signal),
  });
}

export function useGetAttempt(
  attemptId: string,
  options?: GetAttemptQueryOptions,
) {
  return useQuery(getAttempt(attemptId, options));
}
