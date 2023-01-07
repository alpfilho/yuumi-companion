import React, { FC, useCallback } from "react";
import { useAtomValue } from "jotai";

import { leagueClientStatusAtom, selectedRoleAtom } from "../../app.atoms";

import "./backButton.css";

const { app } = window;

export const BackButton: FC = () => {
  const selectedRole = useAtomValue(selectedRoleAtom);
  const leagueClientStatus = useAtomValue(leagueClientStatusAtom);

  const onClickBack = useCallback(() => {
    app.send("mainFrontEnd:changeRole", "notSelected");
  }, []);

  if (
    selectedRole !== "notSelected" &&
    (leagueClientStatus === "idle" || leagueClientStatus === "open" || leagueClientStatus === "notOpen")
  ) {
    return (
      <button className="back-button" onClick={onClickBack}>
        Voltar
      </button>
    );
  }

  return null;
};
