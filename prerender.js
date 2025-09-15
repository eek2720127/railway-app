// 実行: NODE_ENV=production node prerender.js
const fs = require("fs");
const path = require("path");

// server bundle を読み込む
const { render } = require("./dist/server/entry-server.js");

(async () => {
  const routes = ["/"]; // 必要ならルートを増やす
  const template = fs.readFileSync(
    path.resolve("dist/client/index.html"),
    "utf-8"
  );

  for (const url of routes) {
    const appHtml = await render(url);
    const html = template.replace("<!--app-->", appHtml);
    const outDir = path.resolve(
      "dist/static" + (url === "/" ? "/index.html" : url + "/index.html")
    );
    const outPath = path.dirname(outDir);
    fs.mkdirSync(outPath, { recursive: true });
    fs.writeFileSync(outDir, html, "utf8");
    console.log("Prerendered", url, "->", outDir);
  }
})();
