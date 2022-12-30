import React, { FC } from "react";
import { ClientStatus } from "../../modules/leagueClient";

import "./statusBar.css";

export const StatusBar: FC<{ clientStatus: ClientStatus }> = ({
  clientStatus,
}) => {
  return (
    <div
      className={`status-bar ${
        clientStatus === "notOpen" ? "not-initiated" : "initiated"
      }`}
    >
      {clientStatus === "notOpen"
        ? "Jogo não iniciado"
        : clientStatus === "idle"
        ? "Jogo Iniciado"
        : clientStatus === "inLobby"
        ? "Criando Partida"
        : clientStatus === "inQueue"
        ? "Em Fila"
        : clientStatus === "champSelect"
        ? "Jogo Iniciado"
        : clientStatus === "InGame"
        ? "Jogo Iniciado"
        : clientStatus === "afterGameHonor"
        ? "Jogo Iniciado"
        : clientStatus === "afterGame"
        ? "Jogo Iniciado"
        : "–"}
    </div>
  );
};
