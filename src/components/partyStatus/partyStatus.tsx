import { useAtomValue } from "jotai";
import React, { FC, useEffect } from "react";
import { yuumiAccountInfoAtom, playerAccountInfoAtom, yuumiStatusAtom } from "../../app.atoms";
import { SummonerAvatar } from "../summonerAvatar";

import "./partyStatus.css";

export const PartyStatus: FC = () => {
  const yuumiStatus = useAtomValue(yuumiStatusAtom);
  const playerAccount = useAtomValue(playerAccountInfoAtom);
  const yuumiAccount = useAtomValue(yuumiAccountInfoAtom);

  useEffect(() => {
    console.log(playerAccount, yuumiAccount);
  }, [playerAccount, yuumiAccount]);

  if (playerAccount || yuumiAccount) {
    return (
      <div className="party-status">
        <div className="party-side">
          <div className="summoner">
            <div className="body1 text-container">
              <div className="player-title">Player:</div>
              <div className={`info-text ${playerAccount ? "status-success" : "status-idle"}`}>{playerAccount.name}</div>
            </div>
            <SummonerAvatar path={playerAccount.profile} />
          </div>
        </div>

        <div className="hand-shake-container">
          <div className="icon-container">🤝</div>
        </div>

        <div className="party-side">
          <div className="summoner">
            <SummonerAvatar path={yuumiAccount ? yuumiAccount.profile : null} />
            <div className="body1 text-container">
              <div className="yuumi-title">Bot:</div>
              <div className={`info-text ${yuumiAccount ? "status-info" : "status-idle"}`}>
                {yuumiAccount ? yuumiAccount.name : "Aguardando Yuumi"}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
