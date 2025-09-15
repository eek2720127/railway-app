// src/entry-client.jsx
import React from "react";
import { hydrateRoot } from "react-dom/client";
import App from "./App";

hydrateRoot(document.getElementById("root"), <App />);

// ここはクライアントでしか実行されないので安全にログを出せます
console.log("✅ client hydrated (entry-client)");
