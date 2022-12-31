import React, { FC, useCallback } from "react";
import { useAtomValue } from "jotai";
import {
  isPartnerConnectedAtom,
  leagueClientStatusAtom,
} from "../../app.atoms";

const { app } = window;

export const Yuumi: FC = () => {
  const isPartnerConnected = useAtomValue(isPartnerConnectedAtom);
  const leagueClientStatus = useAtomValue(leagueClientStatusAtom);

  const onClickBack = useCallback(() => {
    app.send("selectRole", null);
  }, []);

  return (
    <div className="screen-container">
      <header>
        <h1 className="head1 status-success">Yuumi</h1>
      </header>
      <div className="screen-body">
        {isPartnerConnected ? (
          <span className="body2 status-success">Pronto para criar sala</span>
        ) : (
          <span className="body2 status-danger">Player não conectado</span>
        )}
      </div>
      {leagueClientStatus === "idle" && (
        <button className="back-button" onClick={onClickBack}>
          {"<"} Voltar
        </button>
      )}
    </div>
  );
};
