import { BrowserWindow, ipcMain } from "electron";
import LCUConnector from "lcu-connector";
import { LeagueClientController } from "./modules/leagueClient";
import Diont, { diontReturn, diontService } from "diont";
import { AccountInfo, PlayerStatus, Role, YuumiStatus } from "./app.atoms";
import { Server } from "socket.io";
import { io, Socket } from "socket.io-client";

export class YuumiCompanion {
  private mainWindow: BrowserWindow = null;
  private diont: diontReturn = null;
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

  /**
   * League Client
   */
  private leagueConnector: LCUConnector = null;
  private leagueClient: LeagueClientController = null;
  private clientAccountInfo: AccountInfo = null;

  private playerAccountInfo: AccountInfo = null;
  private yuumiAccountInfo: AccountInfo = null;

  /**
   *  Construtor
   * @param mainWindow Front-End Principal
   */
  constructor(mainWindow: BrowserWindow) {
    this.leagueConnector = new LCUConnector();
    this.leagueClient = new LeagueClientController(mainWindow);
    this.diont = Diont({ broadcast: true });
    this.mainWindow = mainWindow;
  }

  public start() {
    /**
     * Se inscreve á eventos de outros processos
     */
    this.subscribeToEvents();

    /**
     * Inicia a integração com o cliente do lol
     */
    this.leagueConnector.start();
    this.hasAlreadyStarted = true;
  }

  private setAccountInfo() {
    if (this.role === "player") {
      this.playerAccountInfo = this.clientAccountInfo;
    }

    if (this.role === "yuumi") {
      this.yuumiAccountInfo = this.clientAccountInfo;
    }

    if (this.role === "notSelected") {
      this.playerAccountInfo = null;
      this.yuumiAccountInfo = null;
    }
  }

  private onChangeClientAccountInfo() {
    this.setAccountInfo();
    this.updateFrontEnd();
  }

  private setClientAccountInfo(accountInfo: AccountInfo) {
    this.clientAccountInfo = accountInfo;
    this.onChangeClientAccountInfo();
  }

  private subscribeToEvents() {
    /**
     * League Client
     */
    this.leagueConnector.on("connect", (credentials) => {
      this.leagueClient.onConnectToLeagueClient(credentials);
    });

    this.leagueConnector.on("disconnect", () => {
      this.leagueClient.onDisconnectToLeagueClient();
    });

    /**
     * Não faço ideia do porquê desse evento chegar diferente
     */
    ipcMain.on("leagueClient:accountInfo", (accountInfo: AccountInfo) => {
      this.setClientAccountInfo(accountInfo);
    });

    /**
     * Front-End;
     */
    ipcMain.on("mainFrontEnd:ready", () => {
      this.updateFrontEnd();
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
    this.diont.on("serviceAnnounced", ({ service }) => {
      if (service.name === "yuumi-companion") {
        this.onYuumiAppear(service);
      }
    });

    this.diont.on("serviceRenounced", ({ service }) => {
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

      this.setYuumiStatus("notFound");
      this.setPlayerStatus("notFound");
    }

    this.setAccountInfo();
    this.updateFrontEnd();
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
      this.onYuumiConnectToPlayer(socket as unknown as Socket);

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
      const services = this.diont.getServiceInfos();

      if (Object.keys(services).length === 0) {
        this.diont.announceService({
          name: "yuumi-companion",
          port: "3010",
        });
      } else {
        this.diont.repeatAnnouncements();
      }
    } else {
      setTimeout(() => {
        this.propagateIpUntilConnected();
      }, 2000);
    }
  }

  private onYuumiConnectToPlayer(socket: Socket) {
    this.setPlayerStatus("connected");
    this.setYuumiStatus("connected");

    this.subscribeToPlayerEvents(socket);
  }

  private subscribeToPlayerEvents(socket: Socket) {
    socket.on("player:accountInfo", (data) => {
      console.log("o player falou olá", data);
    });
  }

  private onYummiDisconnectToPlayer() {
    this.setPlayerStatus("notFound");
    this.setYuumiStatus("found");
    this.propagateIpUntilConnected();
  }

  private renouncePropagatedYuumiIp() {
    this.diont.renounceService({
      name: "yuumi-companion",
      port: "3010",
    });
  }

  /**
   * Front-End
   */
  private updateFrontEnd() {
    this.leagueClient.updateFrontEnd();
    this.mainWindow.webContents.send("main:roleStatus", this.role);
    this.mainWindow.webContents.send("main:yuumiStatus", this.yuumiStatus);
    this.mainWindow.webContents.send("main:yuumiAccountInfo", this.yuumiAccountInfo);
    this.mainWindow.webContents.send("main:playerStatus", this.playerStatus);
    this.mainWindow.webContents.send("main:playerAccountInfo", this.playerAccountInfo);
  }

  public setRole(role: Role) {
    this.role = role;
    this.onChangeRole();
  }

  private onChangeYuumiStatus() {
    this.updateFrontEnd();
  }

  private onChangePlayerStatus() {
    this.updateFrontEnd();
  }

  private setYuumiStatus(status: YuumiStatus) {
    this.yuumiStatus = status;
    this.onChangeYuumiStatus();
  }

  private setPlayerStatus(status: PlayerStatus) {
    this.playerStatus = status;
    this.onChangePlayerStatus();
  }
}
