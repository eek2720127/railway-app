// src/Toggle.jsx
import React from "react";

export default function Toggle({ initial = false }) {
  const [on, setOn] = React.useState(() => initial);
  return (
    <div style={{ marginTop: 12 }}>
      <button onClick={() => setOn((v) => !v)}>{on ? "ON" : "OFF"}</button>
      <span style={{ marginLeft: 8 }}>{on ? "状態: ON" : "状態: OFF"}</span>
    </div>
  );
}
