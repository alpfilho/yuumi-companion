import React from "react";
import { createRoot } from "react-dom/client";

import { LeagueOverlay } from "./leagueOverlay";

import "./leagueOverlay.css";

const containerElement = document.getElementById("app-root");

if (containerElement) {
  const container = createRoot(containerElement);
  container.render(<LeagueOverlay />);
}
