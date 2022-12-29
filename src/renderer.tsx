import React from "react";
import { createRoot } from "react-dom/client";

import { App } from "./app";

import "./app.css";

const containerElement = document.getElementById("app-root");

if (containerElement) {
  const container = createRoot(containerElement);
  container.render(<App />);
}
