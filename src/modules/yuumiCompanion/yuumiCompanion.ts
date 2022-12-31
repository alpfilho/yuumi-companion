import { BrowserWindow, ipcMain, app } from "electron";
import LCUConnector from "lcu-connector";
import { LeagueClientController } from "../leagueClient";
import Diont, { diontService } from "diont";
import { Role } from "../../app.atoms";

const diont = Diont({ broadcast: true });

const leagueConnector = new LCUConnector();

export class YuumiCompanion {
  private role: Role = null;
  private mainWindow: BrowserWindow;
  private leagueClient: LeagueClientController;
  private hasAlreadyStarted: boolean;

  /* Networking */
  private yuumiIp: string = null;
  private isConnectedToPartner = false;

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

    this.updateFrontEnd();
    this.hasAlreadyStarted = true;
  }

  private subscribeToEvents() {
    /**
     * League Client
     */
    leagueConnector.on("connect", (credentials) => {
      this.leagueClient.setCredentials(credentials);
      this.leagueClient.setStatus("idle");
    });

    leagueConnector.on("disconnect", () => {
      this.leagueClient.setStatus("notOpen");
      this.leagueClient.setCredentials(null);
    });

    /**
     * Front-End;
     */
    ipcMain.on("frontEndReady", () => {
      if (!this.hasAlreadyStarted) {
        this.startYuumiCompanion();
      } else {
        this.updateFrontEnd();
      }
    });

    /**
     * Troca de Função
     */
    ipcMain.on("selectRole", (_event, role) => {
      /**
       * Propagação de Ip ao selecionar Yuumi
       */
      if (this.role === null && role === "yuumi") {
        this.role = role;
        this.propagateYuumiIpUltilConnected();
      } else if (this.role === "yuumi" && role === null) {
        /**
         * Renúncia ao ip ao sair da função de yuumi
         */
        this.role = null;
        this.renouncePropagatedYuumiIp();
      } else {
        this.role = role;
      }

      this.updateSelectedRoleOnFrontEnd();
    });

    /**
     * Descobrimento do IP da Yuumi
     */
    diont.on("serviceAnnounced", ({ service }) => {
      if (service.name === "yuumi-companion") {
        this.onCompanionYuumiFound(service);
      }
    });

    /**
     * Antes de Sair
     */
    app.on("before-quit", () => {
      if (this.role === "yuumi") {
        this.renouncePropagatedYuumiIp();
      }
    });
  }

  /**
   * Player
   */
  private onCompanionYuumiFound(service: diontService) {
    this.yuumiIp = service.host;
    this.updateYuumiStateOnFrontEnd();
  }

  /**
   * Yuumi
   */
  private propagateYuumiIpUltilConnected() {
    const checkIfIsConnectedAndPropagate = () => {
      if (this.role === "yuumi" && !this.isConnectedToPartner) {
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

  private updateFrontEnd() {
    this.updateSelectedRoleOnFrontEnd();
    this.updateYuumiStateOnFrontEnd();
  }

  private updateSelectedRoleOnFrontEnd() {
    this.mainWindow.webContents.send("selectRole", this.role);
  }

  private updateYuumiStateOnFrontEnd() {
    if (this.yuumiIp !== null) {
      this.mainWindow.webContents.send("foundYuumiCompanion");
    }
  }
}
