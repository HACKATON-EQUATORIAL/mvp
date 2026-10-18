import { getTrackKeys } from "./get-track";

export const getBundleKeys = {
  byTrackId: (trackId: string) =>
    [...getTrackKeys.byId(trackId), "bundle"] as const,
};
