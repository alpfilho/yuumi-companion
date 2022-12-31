import { app, BrowserWindow } from "electron";
import { YuumiCompanion } from "./modules/yuumiCompanion";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

if (require("electron-squirrel-startup")) {
  app.quit();
}

app.whenReady().then(() => {
  const mainWindow = new BrowserWindow({
    width: 720,
    height: 448,
    title: "Yuumi Companion",
    resizable: false,
    frame: true,
    alwaysOnTop: false,
    movable: true,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  new YuumiCompanion(mainWindow);
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  mainWindow.webContents.openDevTools();
});
