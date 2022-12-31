import React, { FC, useCallback, useEffect } from "react";
import { useAtomValue } from "jotai";
import {
  leagueClientStatusAtom,
  yuumiCompanionStatusAtom,
} from "../../app.atoms";

import "./player.css";
import { WaitingScreen } from "../waitingScreen";

const { app } = window;

export const Player: FC = () => {
  const yuumiCompanionStatus = useAtomValue(yuumiCompanionStatusAtom);
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
        {leagueClientStatus !== "notOpen" ? (
          yuumiCompanionStatus === "connected" ? (
            <>
              <span className="body2 status-success">
                Pronto para criar sala
              </span>
              <button>Criar sala</button>
            </>
          ) : (
            <h1 className="head1 muted-title">Aguardando Yuumi</h1>
          )
        ) : (
          <WaitingScreen />
        )}
      </div>
      {(leagueClientStatus === "idle" || leagueClientStatus === "notOpen") && (
        <button className="back-button" onClick={onClickBack}>
          {"<"} Voltar
        </button>
      )}
    </div>
  );
};
