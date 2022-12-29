// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("yuumiCompanion", {
  start: () => {
    // Start the yuumi companion
  },
  stop: () => {
    // Stop the yuumi companion
  },
});

contextBridge.exposeInMainWorld("player", {
  start: () => {
    // Start the yuumi companion
  },
  stop: () => {
    // Stop the yuumi companion
  },
});

contextBridge.exposeInMainWorld("channel", {
  on: (event: string, callback: () => void) => {
    ipcRenderer.on(event, callback);
  },
  send: (event: string) => {
    ipcRenderer.send(event);
  },
});
