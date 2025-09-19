// src/App.jsx
import React from "react";
import SelfIntro from "./SelfIntro";
import Counter from "./Counter";
import Toggle from "./Toggle";

export default function App() {
  // ここで初期値を決めれば SSR と同じ初期マークアップが生成される
  const initialCount = 0;

  return (
    <div style={{ background: "#f7f7fb", minHeight: "100vh", padding: 24 }}>
      <SelfIntro />
      <Counter initial={initialCount} />
      <Toggle initial={false} />
    </div>
  );
}
