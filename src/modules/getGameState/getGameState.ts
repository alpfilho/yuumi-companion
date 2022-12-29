import { getActiveWindow } from "@nut-tree/nut-js";

export const getGameState = {
  loopId: undefined as NodeJS.Timeout | undefined,
  loopTickInterval: 500,
  start: () => {},
  stop: () => {
    clearInterval(getGameState.loopId);
  },
};
