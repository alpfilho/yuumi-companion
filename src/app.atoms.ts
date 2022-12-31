import { atom } from "jotai";

import type { ClientStatus } from "./modules/leagueClient";

export type Role = "player" | "yuumi";

export const selectedRoleAtom = atom<Role, Role>(null, (_get, set, update) => {
  set(selectedRoleAtom, update);
});

export const isPartnerConnectedAtom = atom(false);

export const playerSelectedChampionAtom = atom<"draven" | "jinx">(null);
export const leagueClientStatusAtom = atom<ClientStatus>("notOpen");
export const yuumiCompanionStatusAtom = atom<
  "notFound" | "found" | "connected"
>("notFound");
