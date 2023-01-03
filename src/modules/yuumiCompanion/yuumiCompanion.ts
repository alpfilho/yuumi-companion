import { BrowserWindow, ipcMain, app } from "electron";
import LCUConnector from "lcu-connector";
import { LeagueClientController } from "../leagueClient";
import Diont, { diontService } from "diont";
import { AccountInfo, PlayerStatus, Role, YuumiStatus } from "../../app.atoms";
import { Server } from "socket.io";
import { io, Socket } from "socket.io-client";

const diont = Diont({ broadcast: true });

const leagueConnector = new LCUConnector();

export class YuumiCompanion {
  private mainWindow: BrowserWindow = null;
  private leagueClient: LeagueClientController = null;
  private ioServer: Server = null;
  private ioClient: Socket = null;

  private role: Role = "notSelected";
  private yuumiStatus: YuumiStatus = "notFound";
  private playerStatus: PlayerStatus = "notFound";

  private hasAlreadyStarted = false;

  /* Networking */
  private yuumiIp: string = null;
  private isListeningToYuumi = false;
  private isListeningToPlayer = false;

  private playerAccountInfo: AccountInfo = null;
  private yuumiAccountInfo: AccountInfo = null;

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
    this.updateFrontEnd();
  }

  private onAccountInfo(accountInfo: AccountInfo) {
    if (this.role === "player") {
      this.playerAccountInfo = accountInfo;
      this.updateFrontEnd();
    } else if (this.role === "yuumi") {
      this.yuumiAccountInfo = accountInfo;
      this.updateFrontEnd();
    }
  }

  private subscribeToEvents() {
    /**
     * League Client
     */
    leagueConnector.on("connect", (credentials) => {
      this.leagueClient.onConnectToLeagueClient(credentials);
    });

    leagueConnector.on("disconnect", () => {
      this.leagueClient.onDisconnectToLeagueClient();
    });

    ipcMain.on("leagueClient:accountInfo", (_event, accountInfo: AccountInfo) => {
      this.onAccountInfo(accountInfo);
    });

    /**
     * Front-End;
     */
    ipcMain.on("mainFrontEnd:ready", () => {
      if (!this.hasAlreadyStarted) {
        this.startYuumiCompanion();
      } else {
        this.updateFrontEnd();
      }
    });

    /**
     * Troca de Função
     */
    ipcMain.on("mainFrontEnd:changeRole", (_event, role) => {
      this.setRole(role);
    });

    /**
     * Descobrimento do IP da Yuumi
     */
    diont.on("serviceAnnounced", ({ service }) => {
      if (service.name === "yuumi-companion") {
        this.onYuumiAppear(service);
      }
    });

    diont.on("serviceRenounced", ({ service }) => {
      if (service.name === "yuumi-companion") {
        this.onYuumiDisappear();
      }
    });
  }

  private onChangeRole() {
    if (this.role === "player") {
      this.startListeningToYuumi();
    }

    if (this.role === "yuumi") {
      this.startListeningToPlayer();
    }

    if (this.role === "notSelected") {
      if (this.isListeningToPlayer) {
        this.stopListeningToPlayer();
      }

      if (this.isListeningToYuumi) {
        this.stopListeningToYuumi();
      }

      this.setPlayerAccountInfo(null);
      this.setYuumiAccountInfo(null);
      this.setYuumiStatus("notFound");
      this.setPlayerStatus("notFound");
    }
  }

  /**
   * Player
   */
  private onYuumiAppear(service: diontService) {
    this.yuumiIp = service.host;
    this.setYuumiStatus("found");
  }

  private onYuumiDisappear() {
    this.yuumiIp = null;
    this.setYuumiStatus("notFound");
  }

  private startListeningToYuumi() {
    this.isListeningToYuumi = true;
    this.setPlayerStatus("found");

    const connectOrWait = () => {
      if (this.yuumiIp !== null) {
        this.ioClient = io(`http://${this.yuumiIp}:3010`);
        this.ioClient.on("connect", () => {
          this.onPlayerConnectToYuumi();
        });
        this.ioClient.on("yuumi:accountInfo", (info) => {
          this.setYuumiAccountInfo(info);
        });
        this.ioClient.on("disconnect", () => {
          this.onPlayerDisconnectToYuumi();
        });
      } else {
        setTimeout(() => {
          connectOrWait();
        }, 2000);
      }
    };

    connectOrWait();
  }

  private stopListeningToYuumi() {
    this.yuumiIp = null;
    if (this.ioClient) {
      this.ioClient.disconnect();
      this.ioClient = null;
    }
    this.isListeningToYuumi = false;
  }

  private onPlayerConnectToYuumi() {
    this.setPlayerStatus("connected");
    this.setYuumiStatus("connected");
  }

  private onPlayerDisconnectToYuumi() {
    this.setPlayerStatus("found");
    this.setYuumiStatus("found");
  }

  /**
   * Yuumi
   */
  private startListeningToPlayer() {
    this.isListeningToPlayer = true;
    this.yuumiIp = "127.0.0.1";
    this.setYuumiStatus("found");
    this.propagateIpUntilConnected();

    this.ioServer = new Server({
      serveClient: false,
    });

    this.ioServer.on("connection", (socket) => {
      this.onYuumiConnectToPlayer();

      socket.on("draven:accountInfo", (info) => {
        this.setPlayerAccountInfo(info);
      });

      socket.on("disconnect", () => {
        this.onYummiDisconnectToPlayer();
      });
    });

    this.ioServer.listen(3010);
  }

  private stopListeningToPlayer() {
    this.yuumiIp = null;
    this.setYuumiStatus("notFound");
    this.renouncePropagatedYuumiIp();
    this.ioServer.close(() => {
      this.ioServer = null;
    });
    this.isListeningToPlayer = false;
  }

  private propagateIpUntilConnected() {
    if (this.playerStatus === "notFound") {
      const services = diont.getServiceInfos();

      if (Object.keys(services).length === 0) {
        diont.announceService({
          name: "yuumi-companion",
          port: "3010",
        });
      } else {
        diont.repeatAnnouncements();
      }
    } else {
      setTimeout(() => {
        this.propagateIpUntilConnected();
      }, 2000);
    }
  }

  private onYuumiConnectToPlayer() {
    this.setPlayerStatus("connected");
    this.setYuumiStatus("connected");
  }

  private onYummiDisconnectToPlayer() {
    this.setPlayerStatus("notFound");
    this.setYuumiStatus("found");
    this.propagateIpUntilConnected();
  }

  private renouncePropagatedYuumiIp() {
    diont.renounceService({
      name: "yuumi-companion",
      port: "3010",
    });
  }

  /**
   * On Changes
   */

  private onChangePlayerStatus() {
    this.updateFrontEnd();
  }

  private onChangeYuumiStatus() {
    this.updateFrontEnd();
  }

  private onChangeYuumiAccountInfo() {
    if (this.role === "yuumi") {
      this.ioServer.send("yuumi:accountInfo", this.yuumiAccountInfo);
    }
  }

  private onChangePlayerAccountInfo() {
    if (this.role === "player") {
      this.ioClient.send("player:accountInfo", this.playerAccountInfo);
    }
  }

  /**
   * Front-End
   */
  private updateFrontEnd() {
    this.mainWindow.webContents.send("main:roleStatus", this.role);
    this.mainWindow.webContents.send("main:yuumiStatus", this.yuumiStatus);
    this.mainWindow.webContents.send("main:playerStatus", this.playerStatus);
    this.mainWindow.webContents.send("main:playerAccountInfo", this.playerAccountInfo);
    this.mainWindow.webContents.send("main:yuumiAccountInfo", this.yuumiAccountInfo);
    this.leagueClient.updateFrontEnd();
  }

  public setRole(role: Role) {
    this.role = role;
    this.onChangeRole();
  }

  private setYuumiStatus(status: YuumiStatus) {
    this.yuumiStatus = status;
    this.onChangeYuumiStatus();
  }

  private setPlayerStatus(status: PlayerStatus) {
    this.playerStatus = status;
    this.onChangePlayerStatus();
  }

  private setPlayerAccountInfo(account: AccountInfo) {
    this.playerAccountInfo = account;
    this.onChangePlayerAccountInfo();
  }

  private setYuumiAccountInfo(account: AccountInfo) {
    this.playerAccountInfo = account;
    this.onChangeYuumiAccountInfo();
  }
}
