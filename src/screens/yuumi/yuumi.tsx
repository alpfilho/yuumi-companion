import React, { FC } from "react";
import { useAtomValue } from "jotai";
import { yuumiStatusAtom, leagueClientStatusAtom } from "../../app.atoms";
import { WaitingScreen } from "../waitingScreen";
import { PartyStatus } from "../../components/partyStatus";

export const Yuumi: FC = () => {
  const yuumiStatus = useAtomValue(yuumiStatusAtom);
  const leagueClientStatus = useAtomValue(leagueClientStatusAtom);

  return (
    <div className="screen-container">
      <header>
        <h1 className="head1 status-success">Yuumi</h1>
      </header>
      <div className="screen-body">
        {leagueClientStatus !== "notOpen" ? (
          yuumiStatus === "connected" ? (
            <>
              <span className="body2 status-success">Pronto</span>
            </>
          ) : (
            <h1 className="body1 status-idle">Aguardando Player</h1>
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
