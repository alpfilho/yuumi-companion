import React, { FC } from "react";

import "./summonerAvatar.css";

export const SummonerAvatar: FC<{ path: string | undefined }> = ({ path }) => {
  return (
    <div className="summoner-avatar">
      <img src={path} />
    </div>
  );
};
