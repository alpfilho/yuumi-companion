import { app, BrowserWindow, ipcMain } from "electron";
import LCUConnector from "lcu-connector";
import { LeagueClientController } from "./modules/leagueClient";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

const leagueConnector = new LCUConnector();
const leagueClient = new LeagueClientController();

if (require("electron-squirrel-startup")) {
  app.quit();
}

type Credentials = {
  address: string;
  port: number;
  username: string;
  password: string;
  protocol: string;
};

app.whenReady().then(() => {
  const mainWindow = new BrowserWindow({
    width: 720,
    height: 448,
    title: "Yuumi Companion",
    resizable: false,
    frame: true,
    movable: true,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  const sendCredentials = (credentials: Credentials) => {
    console.log("send-credentials");
    ipcMain.emit("league-client-credentials", credentials);
  };

  leagueConnector.on("connect", sendCredentials);
  leagueConnector.on("disconnect", () => sendCredentials(null));

  ipcMain.on("front-end-ready", () => {
    leagueConnector.start();
    leagueClient.updateStatus();
  });

  ipcMain.on("league-client-credentials", (credentials) => {
    if (credentials) {
      leagueClient.setStatus("idle");
    } else {
      leagueClient.setStatus("notOpen");
    }
  });

  ipcMain.on("league-client-status", (status) => {
    mainWindow.webContents.send("league-client-status", status);
  });
});
