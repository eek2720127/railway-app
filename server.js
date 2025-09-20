// server.js (ESM) - 404 判定を追加した改良版
import fs from "fs";
import path from "path";
import express from "express";
import { pathToFileURL } from "url";

const isProd = process.env.NODE_ENV === "production";

async function createServer() {
  const app = express();
  const distPath = path.resolve(process.cwd(), "dist");

  // helper: send HTML
  const renderAndSend = (res, html, status = 200) => {
    res.status(status).type("html").send(html);
  };

  // Simple API for demo
  app.get("/api/item/:id", (req, res) => {
    const { id } = req.params;
    const item = {
      id,
      title: `データ #${id}`,
      body: `これはサーバーが返したダミーデータです（id=${id}）。`,
    };
    res.json({ item });
  });

  // small helper: detect 404 text in SSR output
  const containsNotFound = (htmlFragment) => {
    if (!htmlFragment) return false;
    return (
      String(htmlFragment).includes("404 - ページが見つかりません") ||
      String(htmlFragment).includes("404 - ページが見つかりません")
    );
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
        const maybeRender =
          typeof mod.render === "function"
            ? mod.render
            : mod.default && typeof mod.default.render === "function"
              ? mod.default.render
              : null;
        const appHtml = maybeRender ? await maybeRender(url) : "";

        // If render returned an object { html, status }, normalize:
        let htmlFragment = "";
        let status = 200;
        if (appHtml == null) {
          htmlFragment = "";
        } else if (typeof appHtml === "string") {
          htmlFragment = appHtml;
        } else if (
          typeof appHtml === "object" &&
          typeof appHtml.html === "string"
        ) {
          htmlFragment = appHtml.html;
          status = typeof appHtml.status === "number" ? appHtml.status : status;
        } else {
          htmlFragment = String(appHtml);
        }

        // simple 404 detection: if HTML fragment contains "404 - ページが見つかりません", set 404 status (unless render already set status)
        if (status === 200 && containsNotFound(htmlFragment)) {
          status = 404;
        }

        console.log(
          ">>> SSR HTML (dev preview):",
          String(htmlFragment).slice(0, 400)
        );

        let full = template.replace("<!--app-->", htmlFragment);

        // support no-js demo via ?nojs=1
        if (req.query && req.query.nojs === "1") {
          full = full.replace(
            /<script[^>]*type=["']module["'][\s\S]*?<\/script>\s*/gi,
            ""
          );
        }

        renderAndSend(res, full, status);
      } catch (err) {
        vite.ssrFixStacktrace(err);
        console.error("Dev SSR error:", err);
        renderAndSend(res, String(err.stack || err), 500);
      }
    });
  } else {
    // ---- Production ----
    app.use(express.static(distPath, { index: false }));

    const templatePath = path.resolve(distPath, "index.html");
    if (!fs.existsSync(templatePath)) {
      console.error("Production index.html not found at", templatePath);
      app.use("*", (req, res) =>
        res.status(500).send("index.html not found. Run build first.")
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

        if (typeof serverModule.render === "function") {
          renderFn = serverModule.render;
        } else if (serverModule.default) {
          if (typeof serverModule.default === "function") {
            renderFn = serverModule.default;
          } else if (typeof serverModule.default.render === "function") {
            renderFn = serverModule.default.render;
          }
        }

        if (!renderFn) {
          console.warn(
            "SSR bundle found but no usable render() export. Keys:",
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
          return renderAndSend(res, template);
        }

        const rv = await renderFn(req.originalUrl);

        // normalize return value
        let htmlFragment = "";
        let status = 200;
        if (rv == null) {
          htmlFragment = "";
        } else if (typeof rv === "string") {
          htmlFragment = rv;
        } else if (typeof rv === "object" && typeof rv.html === "string") {
          htmlFragment = rv.html;
          status = typeof rv.status === "number" ? rv.status : status;
        } else {
          htmlFragment = String(rv);
        }

        // ここで簡易 404 検出（render が status を既にセットしていなければ）
        if (status === 200 && containsNotFound(htmlFragment)) {
          status = 404;
        }

        console.log(
          ">>> SSR HTML (prod preview):",
          String(htmlFragment).slice(0, 400)
        );

        let full = template.replace("<!--app-->", htmlFragment);

        if (req.query && req.query.nojs === "1") {
          full = full.replace(
            /<script[^>]*type=["']module["'][\s\S]*?<\/script>\s*/gi,
            ""
          );
        }

        renderAndSend(res, full, status);
      } catch (err) {
        console.error("Production SSR error:", err);
        renderAndSend(res, "Internal Server Error", 500);
      }
    });
  }

  return { app };
}

// start server
const { app } = await createServer();
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(
    `Server listening at http://localhost:${port} (NODE_ENV=${process.env.NODE_ENV || "development"})`
  );
});
