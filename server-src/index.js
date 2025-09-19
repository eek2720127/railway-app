// server-src/index.js (修正版: dist の解決に process.cwd() を使用)
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// ここを process.cwd() ベースにすることで "dist/dist" 問題を防ぎます
const distPath = path.resolve(process.cwd(), "dist");

console.log("Server serving dist from:", distPath);

app.use(express.static(distPath, { index: false }));

app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(port, () => {
  console.log(
    `Static server listening at http://localhost:${port} (serving ${distPath})`
  );
});
