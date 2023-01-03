import { useAtomValue } from "jotai";
import React, { FC } from "react";
import { yuumiAccountInfoAtom, playerAccountInfoAtom } from "../../app.atoms";

export const PartyStatus: FC = () => {
  const playerAccount = useAtomValue(playerAccountInfoAtom);
  const yuumiAccount = useAtomValue(yuumiAccountInfoAtom);

  return (
    <div>
      {playerAccount !== null ? (
        <div>
          <h4 className="status-warn">Player:</h4>
          <p>{playerAccount.summonerName}</p>
        </div>
      ) : null}
      {yuumiAccount !== null ? (
        <div>
          <h4 className="status-success">Yuumi:</h4>
          <p>{yuumiAccount.summonerName}</p>
        </div>
      ) : null}
    </div>
  );
};
