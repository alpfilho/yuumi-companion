import React, { FC, useEffect, useState } from "react";

import "./player.css";

export const Player: FC = () => {
  const [isGameStarted, setIsGameStarted] = useState(false);

  useEffect(() => {
    // window.player.

    return () => {
      // window.player.stop();
    };
  }, []);

  return (
    <div className="player-screen-container">
      <h1>Aguardando jogo iniciar</h1>
    </div>
  );
};
