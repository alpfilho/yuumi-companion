import { useAtomValue } from "jotai";
import React, { FC } from "react";

import { leagueClientStatusAtom, selectedRoleAtom, yuumiStatusAtom } from "../../app.atoms";

import "./statusBar.css";

export const StatusBar: FC = () => {
  const clientStatus = useAtomValue(leagueClientStatusAtom);
  const selectedRole = useAtomValue(selectedRoleAtom);
  const yuumiStatus = useAtomValue(yuumiStatusAtom);

  return (
    <div className="status-bar">
      <div className="caption1 status-bar-info">
        <span>status:</span>
        <strong
          className={
            clientStatus === "notOpen"
              ? "status-danger"
              : clientStatus === "InGame"
              ? "status-success"
              : clientStatus === "idle"
              ? "status-idle"
              : "status-info"
          }
        >
          {clientStatus === "notOpen"
            ? "Jogo não iniciado"
            : clientStatus === "open"
            ? "Aberto"
            : clientStatus === "idle"
            ? "Aguardando"
            : clientStatus === "inLobby"
            ? "Criando Partida"
            : clientStatus === "inQueue"
            ? "Em Fila"
            : clientStatus === "champSelect"
            ? "Selecionando Campeões"
            : clientStatus === "InGame"
            ? "Em Jogo"
            : clientStatus === "afterGameHonor"
            ? "Honrando"
            : clientStatus === "afterGame"
            ? "Pós Jogo"
            : "–"}
        </strong>
      </div>

      <div className="status-bar-divider" />
      <div className="caption1 status-bar-info">
        <span>função:</span>
        <strong
          className={
            selectedRole === "notSelected"
              ? "status-danger"
              : selectedRole === "player"
              ? "status-warn"
              : "status-success"
          }
        >
          {selectedRole === "player" && "Jogador"}
          {selectedRole === "yuumi" && "Yuumi"}
          {selectedRole === "notSelected" && "Não Selecionado"}
        </strong>
      </div>

      <div className="status-bar-divider" />
      <div className="caption1 status-bar-info">
        <span>parceiro:</span>
        {yuumiStatus === "notFound" ? (
          <strong className="status-danger">Não encontrado</strong>
        ) : yuumiStatus === "connected" ? (
          <strong className="status-success">Conectado</strong>
        ) : (
          <strong className="status-idle">Encontrado</strong>
        )}
      </div>
    </div>
  );
};
