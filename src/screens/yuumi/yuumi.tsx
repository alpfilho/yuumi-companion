import React, { FC } from "react";
import { useAtomValue } from "jotai";
import {
  yuumiCompanionStatusAtom,
  leagueClientStatusAtom,
} from "../../app.atoms";
import { WaitingScreen } from "../waitingScreen";

export const Yuumi: FC = () => {
  const yuumiCompanionStatus = useAtomValue(yuumiCompanionStatusAtom);
  const leagueClientStatus = useAtomValue(leagueClientStatusAtom);

  return (
    <div className="screen-container">
      <header>
        <h1 className="head1 status-success">Yuumi</h1>
      </header>
      <div className="screen-body">
        {leagueClientStatus !== "notOpen" ? (
          yuumiCompanionStatus === "connected" ? (
            <>
              <span className="body2 status-success">
                Pronto para criar sala
              </span>
            </>
          ) : (
            <h1 className="head1 muted-title">Aguardando Player</h1>
          )
        ) : (
          <WaitingScreen />
        )}
      </div>
    </div>
  );
};
