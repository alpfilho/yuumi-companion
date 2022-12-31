import React, { FC, useCallback, useEffect } from "react";
import { useAtomValue } from "jotai";
import {
  isPartnerConnectedAtom,
  leagueClientStatusAtom,
} from "../../app.atoms";

import "./player.css";

const { app } = window;

export const Player: FC = () => {
  const isPartnerConnected = useAtomValue(isPartnerConnectedAtom);
  const leagueClientStatus = useAtomValue(leagueClientStatusAtom);

  const onClickBack = useCallback(() => {
    app.send("selectRole", null);
  }, []);

  /**
   * On Init
   */
  useEffect(() => {
    app.on("companion.clientInfo", (event, info) => {
      console.log(event, info);
    });

    app.send("companion.updateClientInfo");
  }, []);

  return (
    <div className="screen-container">
      <header>
        <h1 className="head1 status-warn">Jogador</h1>
      </header>
      <div className="screen-body">
        {isPartnerConnected ? (
          <span className="body2 status-success">Pronto para criar sala</span>
        ) : (
          <span className="head1 status-danger">Aguardando Yuumi</span>
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
