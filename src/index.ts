import { app, BrowserWindow } from "electron";
import { YuumiCompanion } from "./yuumiCompanion";

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
    frame: false,
    alwaysOnTop: false,
    movable: false,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });
  const companion = new YuumiCompanion(mainWindow);

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  /**
   * Inicia o processo principal:
   */
  companion.start();
});
