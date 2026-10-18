import {
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { apiRequest } from "@/http/api";
import { getAttemptKeys } from "@/queries/keys/practice/get-attempt";
import {
  type AttemptState,
  attemptStateSchema,
  type HelpKind,
  type HelpResponse,
  helpResponseSchema,
  type PracticeMode,
} from "@/schemas/http/practice";

// Comandos da máquina de estados da prática (POST). Cada resposta substitui o
// estado em cache da tentativa; o front não infere acerto antes da API.

const base = "practice/attempts";

const createAttemptFn = (body: { track_id: string; mode: PracticeMode }) =>
  apiRequest(base, attemptStateSchema, { method: "POST", body, session: true });

const submitActionFn = ({
  attemptId,
  ...body
}: {
  attemptId: string;
  item_id: string;
  option_id: string;
}) =>
  apiRequest(`${base}/${attemptId}/actions`, attemptStateSchema, {
    method: "POST",
    body,
    session: true,
  });

const requestHelpFn = ({
  attemptId,
  kind,
}: {
  attemptId: string;
  kind: HelpKind;
}) =>
  apiRequest(`${base}/${attemptId}/help`, helpResponseSchema, {
    method: "POST",
    body: { kind },
    session: true,
  });

const abandonAttemptFn = (attemptId: string) =>
  apiRequest(`${base}/${attemptId}/abandon`, attemptStateSchema, {
    method: "POST",
    session: true,
  });

type Options<TData, TVariables> = Omit<
  UseMutationOptions<TData, Error, TVariables>,
  "mutationFn"
>;

function useAttemptMutation<TVariables, TData>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  toState: (data: TData) => AttemptState,
  options?: Options<TData, TVariables>,
) {
  const client = useQueryClient();
  return useMutation({
    ...options,
    mutationFn,
    onSuccess: (data, ...rest) => {
      const state = toState(data);
      client.setQueryData(getAttemptKeys.byId(state.attempt_id), state);
      return options?.onSuccess?.(data, ...rest);
    },
  });
}

const same = (state: AttemptState) => state;

export const useCreateAttempt = (
  options?: Options<AttemptState, Parameters<typeof createAttemptFn>[0]>,
) => useAttemptMutation(createAttemptFn, same, options);

export const useSubmitAction = (
  options?: Options<AttemptState, Parameters<typeof submitActionFn>[0]>,
) => useAttemptMutation(submitActionFn, same, options);

export const useRequestHelp = (
  options?: Options<HelpResponse, Parameters<typeof requestHelpFn>[0]>,
) => useAttemptMutation(requestHelpFn, (data) => data.attempt, options);

export const useAbandonAttempt = (options?: Options<AttemptState, string>) =>
  useAttemptMutation(abandonAttemptFn, same, options);
