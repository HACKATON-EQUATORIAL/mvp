import { getTrackKeys } from "./get-track";

export const getStepKeys = {
  byId: (trackId: string, stepId: string) =>
    [...getTrackKeys.byId(trackId), "steps", stepId] as const,
};
