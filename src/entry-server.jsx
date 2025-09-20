// src/entry-server.jsx
import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App from "./App";

// simple mock data source (could call DB or external API)
async function fetchDataForUrl(url) {
  // detail page pattern: /detail/:id
  const m = url.match(/^\/detail\/([^/?#]+)/);
  if (m) {
    const id = m[1];
    // simulate server-side data fetch (could be await fetch from API)
    return {
      item: {
        id,
        title: `データ #${id}`,
        body: `これはサーバーから取得したデータ（id=${id}）です。`,
      },
    };
  }
  return {}; // default no data
}

// export render(url) which returns HTML fragment to be injected into template
export async function render(url = "/") {
  const initialData = await fetchDataForUrl(url);

  // render app with StaticRouter and pass initialData via props (App/Detail will read window.__INITIAL_DATA__ on client)
  const appHtml = renderToString(
    <StaticRouter location={url}>
      <App initialData={initialData} />
    </StaticRouter>
  );

  // return the inner HTML and also include serialized initial data script so client can reuse
  const safe = (v) => JSON.stringify(v).replace(/</g, "\\u003c");
  return `${appHtml}<script>window.__INITIAL_DATA__ = ${safe(initialData)};</script>`;
}
