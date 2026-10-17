import { getTracksKeys } from "./get-tracks";

export const getTrackKeys = {
  byId: (trackId: string) => [...getTracksKeys.all, "detail", trackId] as const,
};
