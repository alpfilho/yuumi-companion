import { BrowserWindow, ipcMain } from "electron";
import fetch from "node-fetch";
import https from "https";
import { AccountInfo } from "../../app.atoms";
import { DataDragon } from "../dataDragon";

export type Credentials = {
  address: string;
  port: number;
  username: string;
  password: string;
  protocol: string;
};

export type ClientStatus =
  | "notOpen"
  | "open"
  | "idle"
  | "inLobby"
  | "inQueue"
  | "champSelect"
  | "InGame"
  | "afterGameHonor"
  | "afterGame";

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

export class LeagueClientController {
  private mainWindow: BrowserWindow;
  private dataDragon: DataDragon;
  private credentials: Credentials;
  private apiUrl: string;
  private status: ClientStatus = "notOpen";
  public accountInfo: AccountInfo = null;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
    this.dataDragon = new DataDragon();
  }

  private async fetchClient<DataType>(url: string): Promise<DataType> {
    return new Promise((resolve, reject) => {
      try {
        fetch(`${this.apiUrl}${url}`, {
          method: "GET",
          agent: httpsAgent,
          headers: {
            Authorization: `Basic ${Buffer.from(this.credentials.username + ":" + this.credentials.password).toString(
              "base64"
            )}`,
          },
        }).then((response) => {
          resolve(response.json() as Promise<DataType>);
        });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  private async getAccountInfo() {
    try {
      setTimeout(async () => {
        const {
          summonerId,
          displayName: summonerName,
          profileIconId,
        } = await this.fetchClient<{
          displayName: string;
          summonerId: number;
          profileIconId: number;
        }>("/lol-summoner/v1/current-summoner");

        this.setAccountInfo({
          id: summonerId,
          name: summonerName,
          profile: this.dataDragon.getProfilePath(profileIconId),
        });
      }, 10000);
    } catch (error) {
      console.log(error);
      this.setAccountInfo(null);
    }
  }

  public setAccountInfo(accountInfo: AccountInfo) {
    this.accountInfo = accountInfo;
    this.onChangeAccountInfo();
  }

  private onChangeAccountInfo() {
    ipcMain.emit("leagueClient:accountInfo", this.accountInfo);
  }

  private clearAccountInfo() {
    this.setAccountInfo(null);
  }

  public onConnectToLeagueClient(credentials: Credentials) {
    this.setCredentials(credentials);
    this.setStatus("open");
    this.getAccountInfo();
  }

  public onDisconnectToLeagueClient() {
    this.setCredentials(null);
    this.clearAccountInfo();
    this.setStatus("notOpen");
  }

  public setCredentials(credentials: Credentials) {
    this.credentials = credentials;
    this.onChangeCredentials();
  }

  private onChangeCredentials() {
    if (this.credentials) {
      this.apiUrl = `${this.credentials.protocol}://${this.credentials.address}:${this.credentials.port}`;
    } else {
      this.apiUrl = null;
    }
  }

  public setStatus(status: ClientStatus) {
    this.status = status;
    this.onChangeStatus();
  }

  private onChangeStatus() {
    this.updateFrontEnd();
  }

  public updateFrontEnd() {
    this.mainWindow.webContents.send("leagueClient:clientStatus", this.status);
    this.mainWindow.webContents.send("leagueClient:accountInfo", this.accountInfo);
  }
}
