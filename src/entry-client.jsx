// src/entry-client.jsx
import React from "react";
import { hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

const rootEl = document.getElementById("root");
console.log(
  ">>> server HTML (preview):",
  rootEl ? rootEl.innerHTML.slice(0, 200) : "<no root>"
);

// Hydrate with BrowserRouter on client
hydrateRoot(
  rootEl,
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

console.log("✅ client hydrated (entry-client)");
