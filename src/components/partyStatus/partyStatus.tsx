import { useAtomValue } from "jotai";
import React, { FC, useEffect } from "react";
import { yuumiAccountInfoAtom, playerAccountInfoAtom } from "../../app.atoms";
import { SummonerAvatar } from "../summonerAvatar";

import "./partyStatus.css";

export const PartyStatus: FC = () => {
  const playerAccount = useAtomValue(playerAccountInfoAtom);
  const yuumiAccount = useAtomValue(yuumiAccountInfoAtom);

  useEffect(() => {
    console.log(playerAccount, yuumiAccount);
  }, [playerAccount, yuumiAccount]);

  return (
    <div className="party-status">
      <div className="party-side">
        {playerAccount ? (
          <div className="summoner">
            <SummonerAvatar path={playerAccount.profile} />
            <div className="body1 text-container">
              <div className="player-name">Player:</div>
              <div className="info-text">{playerAccount.name}</div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="hand-shake-container">🤝</div>

      <div className="party-side">
        {yuumiAccount ? (
          <div className="summoner">
            <SummonerAvatar path={yuumiAccount.profile} />
            <div className="body1 text-container">
              <div className="player-name">Bot:</div>
              <div className="info-text">{yuumiAccount.name}</div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
