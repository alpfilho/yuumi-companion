import { app } from "./src/modules/app";
import { LeagueClientController } from "./src/modules/leagueClient";

declare global {
  interface Window {
    app: typeof app;
    leagueClient: typeof LeagueClientController;
  }
}
