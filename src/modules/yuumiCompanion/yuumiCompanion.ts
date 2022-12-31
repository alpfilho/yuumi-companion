import { BrowserWindow, ipcMain, app } from "electron";
import LCUConnector from "lcu-connector";
import { LeagueClientController } from "../leagueClient";
import Diont, { diontService } from "diont";
import { Role } from "../../app.atoms";

const diont = Diont({ broadcast: true });

type LeagueClientCredentials = {
  address: string;
  port: number;
  username: string;
  password: string;
  protocol: string;
};

const leagueConnector = new LCUConnector();

export class YuumiCompanion {
  private role: Role;
  private mainWindow: BrowserWindow;
  private leagueClient: LeagueClientController;
  private hasAlreadyStarted: boolean;

  /* Networking */
  private yuumiIp: string;
  private isConnectedToPartner: boolean;

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
      /**
       * Propagação de Ip ao selecionar Yuumi
       */
      if (this.role === null && role === "yuumi") {
        this.propagateYuumiIpUltilConnected();
      } else if (this.role === "yuumi" && role === null) {
        this.renouncePropagatedYuumiIp();
      }

      this.mainWindow.webContents.send("selectRole", role);
      this.role = role;
    });

    /**
     * Descobrimento do IP da Yuumi
     */
    diont.on("serviceAnnounced", (serviceInfo) => {
      if (serviceInfo.name === "yuumi-companion") {
        this.onCompanionYuumiFound(serviceInfo);
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

    /**
     * Antes de Sair
     */
    app.on("before-quit", () => {
      if (this.role === "yuumi") {
        diont.renounceService({
          name: "yuumi-companion",
          port: "3010",
        });
      }
    });
  }

  private onCompanionYuumiFound(service: diontService) {
    this.yuumiIp = service.host;
    this.mainWindow.webContents.send("foundYuumiCompanion", this.yuumiIp);
  }

  private propagateYuumiIpUltilConnected() {
    const checkIfIsConnectedAndPropagate = () => {
      if (!this.isConnectedToPartner) {
        const services = diont.getServiceInfos();

        if (Object.keys(services).length === 0) {
          diont.announceService({
            name: "yuumi-companion",
            port: "3010",
          });
        } else {
          diont.repeatAnnouncements();
        }

        setTimeout(() => {
          checkIfIsConnectedAndPropagate();
        }, 1000);
      }
    };

    checkIfIsConnectedAndPropagate();
  }

  private renouncePropagatedYuumiIp() {
    diont.renounceService({
      name: "yuumi-companion",
      port: "3010",
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
