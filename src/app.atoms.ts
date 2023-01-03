import { atom } from "jotai";

import type { ClientStatus } from "./modules/leagueClient";

export type Role = "player" | "yuumi" | "notSelected";
export type YuumiStatus = "notFound" | "found" | "connected";
export type PlayerStatus = "notFound" | "found" | "connected";

export type AccountInfo = {
  summonerProfilePic: string;
  summonerId: number;
  summonerName: string;
};

export const selectedRoleAtom = atom<Role, Role>("notSelected", (_get, set, update) => {
  set(selectedRoleAtom, update);
});

export const playerSelectedChampionAtom = atom<"draven" | "jinx">(null);
export const leagueClientStatusAtom = atom<ClientStatus>("notOpen");

export const yuumiStatusAtom = atom<YuumiStatus>("notFound");
export const playerStatusAtom = atom<PlayerStatus>("notFound");

export const yuumiAccountInfoAtom = atom<AccountInfo, AccountInfo>(null, (_get, set, update) => {
  set(yuumiAccountInfoAtom, update);
});
export const playerAccountInfoAtom = atom<AccountInfo, AccountInfo>(null, (_get, set, update) => {
  set(playerAccountInfoAtom, update);
});
