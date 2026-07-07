import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { initFootprintSystem } from "./footprint-system.js";
import "./footprints.css";

initFootprintSystem({ mode: "default" });

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
