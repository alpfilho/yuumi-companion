import { app, BrowserWindow, ipcMain } from "electron";
import LCUConnector from "lcu-connector";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

const leagueConnector = new LCUConnector();

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
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  mainWindow.webContents.openDevTools();

  const sendCredentials = (credentials: Credentials) => {
    mainWindow.webContents.send("league-client-credentials", credentials);
  };

  leagueConnector.on("connect", sendCredentials);
  leagueConnector.on("disconnect", () => sendCredentials(null));

  ipcMain.on("front-end-ready", () => {
    leagueConnector.start();
  });
});
