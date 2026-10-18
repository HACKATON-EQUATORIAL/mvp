import { getTrackKeys } from "./get-track";

export const getChannelSimulationsKeys = {
  byTrackId: (trackId: string) =>
    [...getTrackKeys.byId(trackId), "channel-simulations"] as const,
};
