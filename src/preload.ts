import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";

export const appIpc = {
  on: (event: string, callback: (event: IpcRendererEvent, ...args: unknown[]) => void) => {
    ipcRenderer.on(event, callback);
  },
  send: (event: string, payload?: unknown) => {
    ipcRenderer.send(event, payload);
  },
};

contextBridge.exposeInMainWorld("app", appIpc);
