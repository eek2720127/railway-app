// src/pages/Home.jsx
import React from "react";
import Counter from "../Counter";
import Toggle from "../Toggle";

export default function Home() {
  return (
    <main
      style={{
        maxWidth: 760,
        margin: "24px auto",
        padding: 24,
        background: "white",
        borderRadius: 12,
      }}
    >
      <h1>ホーム</h1>
      <p>
        これはホームページです。下のカウンターはインタラクティブです（SSR +
        Hydration）。
      </p>
      <Counter initial={0} />
      <Toggle initial={false} />
    </main>
  );
}
