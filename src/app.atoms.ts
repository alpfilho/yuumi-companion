import { atom } from "jotai";

export const selectedRoleAtom = atom<"player" | "yuumi" | undefined>(undefined);
