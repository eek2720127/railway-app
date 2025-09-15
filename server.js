// server.js (ESM対応・dist/index.html を使う版)
import fs from "fs";
import path from "path";
import express from "express";
import { pathToFileURL } from "url";

const isProd = process.env.NODE_ENV === "production";

async function createServer() {
  const app = express();

  if (!isProd) {
    // development: vite middleware
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: "ssr" },
      appType: "custom",
    });
    app.use(vite.middlewares);

    app.use("*", async (req, res) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve("index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);

        const mod = await vite.ssrLoadModule("/src/entry-server.jsx");
        const appHtml = await mod.render(url);

        const html = template.replace("<!--app-->", appHtml);
        res.status(200).set({ "Content-Type": "text/html" }).end(html);
      } catch (e) {
        vite.ssrFixStacktrace(e);
        console.error(e);
        res.status(500).end(e.stack);
      }
    });
  } else {
    // production: serve dist (index.html at dist/index.html)
    const distPath = path.resolve("dist");
    // serve static files from dist (assets/ etc.)
    app.use(express.static(distPath, { index: false }));

    app.use("*", async (req, res) => {
      try {
        const url = req.originalUrl;
        // read the generated index.html from dist
        const template = fs.readFileSync(
          path.resolve(distPath, "index.html"),
          "utf-8"
        );

        // import the server bundle that Vite produced into dist/server
        const serverBundlePath = path.resolve(
          distPath,
          "server",
          "entry-server.js"
        );
        const serverModule = await import(pathToFileURL(serverBundlePath).href);

        const appHtml = await serverModule.render(url);
        const html = template.replace("<!--app-->", appHtml);
        res.status(200).set({ "Content-Type": "text/html" }).end(html);
      } catch (e) {
        console.error(e);
        res.status(500).end(e.stack);
      }
    });
  }

  return { app };
}

const { app } = await createServer();
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(
    `Server listening at http://localhost:${port} (NODE_ENV=${process.env.NODE_ENV || "development"})`
  );
});
