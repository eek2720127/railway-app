// src/entry-client.jsx
import React from "react";
import { hydrateRoot } from "react-dom/client";
import App from "./App";

const rootEl = document.getElementById("root");

// (任意) ログ：サーバHTMLの先頭を一時出す（デバッグ用）
console.log(
  ">>> server HTML (preview):",
  rootEl ? rootEl.innerHTML.slice(0, 200) : "<no root>"
);

hydrateRoot(rootEl, <App />);
console.log("✅ client hydrated (entry-client)");
