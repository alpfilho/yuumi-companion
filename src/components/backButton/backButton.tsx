import React, { FC, useCallback } from "react";
import { useAtomValue } from "jotai";

import { leagueClientStatusAtom } from "../../app.atoms";

import "./backButton.css";

const { app } = window;

export const BackButton: FC = () => {
  const leagueClientStatus = useAtomValue(leagueClientStatusAtom);

  const onClickBack = useCallback(() => {
    app.send("mainFrontEnd:changeRole", null);
  }, []);

  if (leagueClientStatus === "idle" || leagueClientStatus === "notOpen") {
    return (
      <button className="back-button" onClick={onClickBack}>
        {"<"} Voltar
      </button>
    );
  }

  return null;
};
