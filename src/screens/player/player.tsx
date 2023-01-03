import React, { FC } from "react";
import { useAtomValue } from "jotai";
import { leagueClientStatusAtom, yuumiStatusAtom } from "../../app.atoms";

import "./player.css";
import { PartyStatus } from "../../components/partyStatus";
import { WaitingScreen } from "../waitingScreen";

export const Player: FC = () => {
  const yuumiStatus = useAtomValue(yuumiStatusAtom);
  const leagueClientStatus = useAtomValue(leagueClientStatusAtom);

  return (
    <div className="screen-container">
      <header>
        <h1 className="head1 status-warn">Jogador</h1>
      </header>

      <div className="screen-body">
        {leagueClientStatus !== "notOpen" ? (
          yuumiStatus === "connected" ? (
            <>
              <span className="body1 status-idle">Aguardando informações dos jogadores</span>
            </>
          ) : (
            <h1 className="head1 status-idle">Aguardando Yuumi</h1>
          )
        ) : (
          <WaitingScreen />
        )}
      </div>

      <footer>
        <PartyStatus />
      </footer>
    </div>
  );
};
