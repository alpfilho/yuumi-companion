import { useAtom } from "jotai";
import React, { useEffect } from "react";
import { leagueClientStatusAtom } from "./app.atoms";
// import { useAtomValue } from "jotai";

// import { selectedRoleAtom } from "./app.atoms";
// import { Player } from "./screens/player";
// import { Yuumi } from "./screens/yuumi";
// import { Home } from "./screens/home";
import { StatusBar } from "./components/statusBar";

import type { ClientStatus } from "./modules/leagueClient";

const { app } = window;

export const App = () => {
  const [clientStatus, setClientStatus] = useAtom(leagueClientStatusAtom);

  /**
   * On Init
   */
  useEffect(() => {
    app.on("league-client-status", (_event, status: ClientStatus) => {
      setClientStatus(status);
    });
    app.send("front-end-ready");
  }, []);

  return (
    <>
      <div className="app-body">
        {clientStatus === "notOpen" && <h1>Aguardando Jogo Iniciar</h1>}
      </div>
      <StatusBar clientStatus={clientStatus} />
    </>
  );
};
