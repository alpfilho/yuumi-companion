import { ipcMain } from "electron";

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
  protected credentials: Credentials | undefined = undefined;
  protected status: ClientStatus = "notOpen";

  public setCredentials(credentials: Credentials) {
    this.credentials = credentials;
  }

  public setStatus(status: ClientStatus) {
    this.status = status;
    this.onChangeStatus();
  }

  protected onChangeStatus() {
    this.updateStatus();
  }

  public updateStatus() {
    ipcMain.emit("league-client-status", this.status);
  }
}
