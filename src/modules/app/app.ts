import { ipcRenderer, IpcRendererEvent } from "electron";

export const app = {
  on: (
    event: string,
    callback: (event: IpcRendererEvent, ...args: any[]) => void
  ) => {
    console.log("register renderer callback", event);
    ipcRenderer.on(event, callback);
  },
  send: (event: string, ...args: any[]) => {
    ipcRenderer.send(event, ...args);
  },
};
