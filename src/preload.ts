import { contextBridge } from "electron";
import { app } from "./modules/app";

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

contextBridge.exposeInMainWorld("app", app);
