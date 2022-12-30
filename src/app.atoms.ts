import { atom } from "jotai";

import type { ClientStatus } from "./modules/leagueClient";

export const selectedRoleAtom = atom<"player" | "yuumi" | undefined>(undefined);
export const playerSelectedChampionAtom = atom<"draven" | "jinx" | undefined>(
  undefined
);
export const leagueClientStatusAtom = atom<ClientStatus>("notOpen");
