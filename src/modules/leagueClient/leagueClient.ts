import { BrowserWindow, ipcMain } from "electron";
import fetch from "node-fetch";

type Credentials = {
  address: string;
  port: number;
  username: string;
  password: string;
  protocol: string;
};

export type ClientStatus =
  | "notOpen"
  | "idle"
  | "inLobby"
  | "inQueue"
  | "champSelect"
  | "InGame"
  | "afterGameHonor"
  | "afterGame";

export class LeagueClientController {
  private mainWindow: BrowserWindow;
  private credentials: Credentials;
  private apiUrl: string;
  private status: ClientStatus = "notOpen";

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
    this.subscribeToEvents();
  }

  private subscribeToEvents() {
    ipcMain.on("frontEndReady", () => {
      this.updateFrontEnd();
    });
  }

  public setCredentials(credentials: Credentials) {
    this.credentials = credentials;
    this.apiUrl = credentials
      ? `${credentials.protocol}://${credentials.address}:${credentials.port}`
      : undefined;
  }

  public setStatus(status: ClientStatus) {
    this.status = status;
    this.onChangeStatus();
  }

  public getStatus() {
    return this.status;
  }

  private onChangeStatus() {
    this.updateFrontEnd();
  }

  private updateFrontEnd() {
    this.mainWindow.webContents.send("clientStatus", this.status);
  }
}
