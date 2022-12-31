import { useAtom } from "jotai";
import React, { useEffect } from "react";
import { leagueClientStatusAtom, Role, selectedRoleAtom } from "./app.atoms";
import { RoleSelector } from "./screens/roleSelector/roleSelector";

import { StatusBar } from "./components/statusBar";
import { WaitingScreen } from "./screens/waitingScreen";

import type { ClientStatus } from "./modules/leagueClient";
import { Player } from "./screens/player";
import { Yuumi } from "./screens/yuumi";

const { app } = window;

export const App = () => {
  const [clientStatus, setClientStatus] = useAtom(leagueClientStatusAtom);
  const [selectedRole, setSelectedRole] = useAtom(selectedRoleAtom);

  /**
   * On Init
   */
  useEffect(() => {
    app.on("clientStatus", (_event, status: ClientStatus) => {
      setClientStatus(status);
    });

    app.on("selectRole", (_event, role: Role) => {
      setSelectedRole(role);
    });

    app.send("frontEndReady");
  }, []);

  return (
    <>
      <div className="app-body">
        {clientStatus === "notOpen" ? (
          <WaitingScreen />
        ) : selectedRole === null ? (
          <RoleSelector />
        ) : (
          (selectedRole === "player" && <Player />) ||
          (selectedRole === "yuumi" && <Yuumi />)
        )}
      </div>
      <StatusBar />
    </>
  );
};
