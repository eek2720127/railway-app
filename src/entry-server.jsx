import React from "react";
import { renderToString } from "react-dom/server";
import App from "./App";

// export してサーバから呼び出す（dev/prod 共用）
export function render(url = "/") {
  // 必要ならルーティングや data fetching をここで行って HTML に差し込む
  return renderToString(<App />);
}
