import { BrowserWindow, ipcMain } from "electron";
import LCUConnector from "lcu-connector";
import { LeagueClientController } from "../leagueClient";
import Diont from "diont";

const diont = Diont();

type LeagueClientCredentials = {
  address: string;
  port: number;
  username: string;
  password: string;
  protocol: string;
};

const leagueConnector = new LCUConnector();

export class YuumiCompanion {
  private mainWindow: BrowserWindow;
  private hasAlreadyStarted: boolean;
  private leagueClient: LeagueClientController;

  /**
   *  Construtor
   * @param mainWindow Front-End Principal
   */
  constructor(mainWindow: BrowserWindow) {
    this.leagueClient = new LeagueClientController(mainWindow);
    this.mainWindow = mainWindow;
    this.subscribeToEvents();
  }

  private startYuumiCompanion() {
    leagueConnector.start();
    this.hasAlreadyStarted = true;
  }

  private subscribeToEvents() {
    /**
     * Troca de Função
     */
    ipcMain.on("selectRole", (_event, role) => {
      this.mainWindow.webContents.send("selectRole", role);
      if (role === "player") {
        this.propagatePlayerIp();
      }
    });

    /**
     * League Client
     */
    leagueConnector.on("connect", this.onConnectToLeagueClient.bind(this));
    leagueConnector.on(
      "disconnect",
      this.onDisconnectToLeagueClient.bind(this)
    );

    /**
     * Front-End;
     */
    ipcMain.on("frontEndReady", () => {
      if (!this.hasAlreadyStarted) {
        this.startYuumiCompanion();
      }
    });
  }

  private propagatePlayerIp() {
    diont.announceService({
      name: "yuumiCompanion:draven",
    });
  }

  private onConnectToLeagueClient(credentials: LeagueClientCredentials) {
    this.leagueClient.setCredentials(credentials);
    this.leagueClient.setStatus("idle");
  }

  private onDisconnectToLeagueClient() {
    this.leagueClient.setStatus("notOpen");
    this.leagueClient.setCredentials(null);
  }
}
