import { BrowserWindow, ipcMain, app } from "electron";
import LCUConnector from "lcu-connector";
import { LeagueClientController } from "../leagueClient";
import Diont, { diontService } from "diont";
import { Role } from "../../app.atoms";
import { Server } from "socket.io";
import { io, Socket } from "socket.io-client";

const diont = Diont({ broadcast: true });

const leagueConnector = new LCUConnector();

export class YuumiCompanion {
  private role: Role = null;
  private mainWindow: BrowserWindow;
  private leagueClient: LeagueClientController;
  private hasAlreadyStarted = false;
  private ioServer: Server = null;
  private ioClient: Socket = null;

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
      if (this.role === null && role === "yuumi") {
        this.role = "yuumi";
        this.propagateYuumiIpUltilConnected();
        this.startListeningToPlayer();
      } else if (this.role === "yuumi" && role === null) {
        this.role = null;
        this.stopListeningToPlayer();
        this.renouncePropagatedYuumiIp();
      } else if (this.role === null && role === "player") {
        this.role = "player";
        this.startListeningToYuumi();
      } else if (this.role === "player" && role === null) {
        this.role = null;
        if (this.isConnectedToPartner) {
          this.stopListeningToYuumi();
        }
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

    diont.on("serviceRenounced", ({ service }) => {
      if (service.name === "yuumi-companion") {
        this.onCompanionYuumiDisappear();
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
    if (this.ioClient === null && this.role === "player") {
      this.startListeningToYuumi();
    }
    this.updateYuumiStateOnFrontEnd();
  }

  private onCompanionYuumiDisappear() {
    this.yuumiIp = null;
    if (this.ioClient !== null) {
      this.stopListeningToYuumi();
    }
    this.updateYuumiStateOnFrontEnd();
  }

  private startListeningToYuumi() {
    if (this.yuumiIp) {
      this.ioClient = io(`http://${this.yuumiIp}:3010`);
      this.ioClient.on("connect", () => {
        this.isConnectedToPartner = true;
        this.updateYuumiStateOnFrontEnd();
      });

      this.ioClient.on("disconnect", () => {
        this.isConnectedToPartner = false;
        this.updateYuumiStateOnFrontEnd();
      });
    }
  }

  private stopListeningToYuumi() {
    this.ioClient.disconnect();
    this.ioClient = null;
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

  private startListeningToPlayer() {
    this.ioServer = new Server({
      serveClient: false,
    });

    this.ioServer.on("connect", () => {
      this.isConnectedToPartner = true;
      this.updateYuumiStateOnFrontEnd();
    });

    this.ioServer.on("disconnect", () => {
      this.isConnectedToPartner = false;
      this.updateYuumiStateOnFrontEnd();
    });

    this.ioServer.listen(3010);
  }

  private stopListeningToPlayer() {
    this.ioServer.close(() => {
      this.ioServer = null;
    });
  }

  /**
   * Front-End
   */
  private updateFrontEnd() {
    this.updateSelectedRoleOnFrontEnd();
    this.updateYuumiStateOnFrontEnd();
  }

  private updateSelectedRoleOnFrontEnd() {
    this.mainWindow.webContents.send("selectRole", this.role);
  }

  private updateYuumiStateOnFrontEnd() {
    if (this.isConnectedToPartner) {
      this.mainWindow.webContents.send("yuumiConnected");
    } else if (this.yuumiIp !== null) {
      this.mainWindow.webContents.send("yuumiFound");
    } else {
      this.mainWindow.webContents.send("yuumiDisappeared");
    }
  }
}
