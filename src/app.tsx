import { useAtom, useSetAtom } from "jotai";
import React, { useEffect } from "react";
import {
  yuumiCompanionStatusAtom,
  leagueClientStatusAtom,
  Role,
  selectedRoleAtom,
} from "./app.atoms";
import { RoleSelector } from "./screens/roleSelector/roleSelector";

import { StatusBar } from "./components/statusBar";

import type { ClientStatus } from "./modules/leagueClient";
import { Player } from "./screens/player";
import { Yuumi } from "./screens/yuumi";

const { app } = window;

export const App = () => {
  const [selectedRole, setSelectedRole] = useAtom(selectedRoleAtom);
  const setClientStatus = useSetAtom(leagueClientStatusAtom);
  const setYuumiCompanionStatus = useSetAtom(yuumiCompanionStatusAtom);

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

    app.on("yuumiFound", () => {
      setYuumiCompanionStatus("found");
    });

    app.on("yuumiConnected", () => {
      setYuumiCompanionStatus("connected");
    });

    app.on("yuumiDisappeared", () => {
      setYuumiCompanionStatus("notFound");
    });

    app.send("frontEndReady");
  }, []);

  return (
    <>
      <div className="app-body">
        {selectedRole === null ? (
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
