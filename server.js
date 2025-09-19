// server.js (ESM) - 簡潔版
import fs from "fs";
import path from "path";
import express from "express";
import { pathToFileURL } from "url";

const isProd = process.env.NODE_ENV === "production";

async function createServer() {
  const app = express();

  const distPath = path.resolve(process.cwd(), "dist");

  // 共通ヘルパー: HTML をクライアントに返す
  const renderAndSend = (res, html, status = 200) => {
    res.status(status).type("html").send(html);
  };

  if (!isProd) {
    // ---- Development ----
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
        console.log(
          ">>> SSR HTML (dev preview):",
          String(appHtml).slice(0, 400)
        );
        renderAndSend(res, template.replace("<!--app-->", appHtml));
      } catch (err) {
        vite.ssrFixStacktrace(err);
        console.error("Dev SSR error:", err);
        renderAndSend(res, String(err.stack || err), 500);
      }
    });
  } else {
    // ---- Production ----
    app.use(express.static(distPath, { index: false }));

    // preload template and SSR bundle at startup for performance
    const templatePath = path.resolve(distPath, "index.html");
    if (!fs.existsSync(templatePath)) {
      console.error("Production index.html not found at", templatePath);
      // keep server running but serve a helpful message on requests
      app.use("*", (req, res) =>
        res.status(500).send("index.html not found. Run build.")
      );
      return { app };
    }
    const template = fs.readFileSync(templatePath, "utf-8");

    const ssrBundlePath = path.resolve(
      distPath,
      "server-ssr",
      "entry-server.js"
    );
    let renderFn = null;
    if (fs.existsSync(ssrBundlePath)) {
      try {
        const serverModule = await import(pathToFileURL(ssrBundlePath).href);
        // named export 'render' or default.render
        renderFn =
          typeof serverModule.render === "function"
            ? serverModule.render
            : serverModule.default &&
                typeof serverModule.default.render === "function"
              ? serverModule.default.render
              : null;

        if (!renderFn) {
          console.warn(
            "SSR bundle found but no render() export. Keys:",
            Object.keys(serverModule)
          );
        }
      } catch (err) {
        console.error("Failed to import SSR bundle:", ssrBundlePath, err);
      }
    } else {
      console.warn("SSR bundle not found at", ssrBundlePath);
    }

    app.use("*", async (req, res) => {
      try {
        if (!renderFn) {
          // no SSR available: serve static template
          return renderAndSend(res, template);
        }
        const appHtml = await renderFn(req.originalUrl);
        console.log(
          ">>> SSR HTML (prod preview):",
          String(appHtml).slice(0, 400)
        );
        renderAndSend(res, template.replace("<!--app-->", appHtml));
      } catch (err) {
        console.error("Production SSR error:", err);
        renderAndSend(res, "Internal Server Error", 500);
      }
    });
  }

  return { app };
}

// 起動
const { app } = await createServer();
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(
    `Server listening at http://localhost:${port} (NODE_ENV=${process.env.NODE_ENV || "development"})`
  );
});
