import { useAtom, useSetAtom } from "jotai";
import React, { useEffect } from "react";
import {
  yuumiStatusAtom,
  leagueClientStatusAtom,
  Role,
  selectedRoleAtom,
  YuumiStatus,
  playerStatusAtom,
  yuumiAccountInfoAtom,
  playerAccountInfoAtom,
  AccountInfo,
} from "./app.atoms";
import { RoleSelector } from "./screens/roleSelector/roleSelector";

import { StatusBar } from "./components/statusBar";

import type { ClientStatus } from "./modules/leagueClient";
import { Player } from "./screens/player";
import { Yuumi } from "./screens/yuumi";
import { BackButton } from "./components/backButton";

const { app } = window;

export const App = () => {
  const [selectedRole, setSelectedRole] = useAtom(selectedRoleAtom);
  const setClientStatus = useSetAtom(leagueClientStatusAtom);
  const setYuumiStatus = useSetAtom(yuumiStatusAtom);
  const setPlayerStatus = useSetAtom(playerStatusAtom);
  const setPlayerAccountInfo = useSetAtom(playerAccountInfoAtom);
  const setYuumiAccountInfo = useSetAtom(yuumiAccountInfoAtom);

  /**
   * On Init
   */
  useEffect(() => {
    /**
     * Eventos
     */

    app.on("leagueClient:clientStatus", (_event, status: ClientStatus) => {
      setClientStatus(status);
    });

    app.on("main:roleStatus", (_event, role: Role) => {
      setSelectedRole(role);
    });

    app.on("main:yuumiStatus", (_event, status: YuumiStatus) => {
      setYuumiStatus(status);
    });

    app.on("main:playerStatus", (_event, status: YuumiStatus) => {
      setPlayerStatus(status);
    });

    app.on("main:playerAccountInfo", (_event, accountInfo: AccountInfo) => {
      console.log(accountInfo);
      setPlayerAccountInfo(accountInfo);
    });

    app.on("main:yuumiAccountInfo", (_event, accountInfo: AccountInfo) => {
      setYuumiAccountInfo(accountInfo);
    });

    /**
     * Sinal de inicialização
     */
    app.send("mainFrontEnd:ready");
  }, []);

  return (
    <>
      <div className="app-body">
        {selectedRole === "notSelected" ? (
          <RoleSelector />
        ) : (
          (selectedRole === "player" && <Player />) || (selectedRole === "yuumi" && <Yuumi />)
        )}
      </div>

      <StatusBar />
      <BackButton />
    </>
  );
};
