import { appIpc } from "./src/preload";

declare global {
  interface Window {
    app: typeof appIpc;
  }
}
