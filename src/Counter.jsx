// src/Counter.jsx
import React from "react";

export default function Counter({ initial = 0 }) {
  // 初期値は props から（SSR と CSR で一致させるため）
  const [count, setCount] = React.useState(() => initial);

  return (
    <div style={{ marginTop: 18 }}>
      <button onClick={() => setCount((c) => c - 1)} aria-label="decrement">
        -
      </button>
      <span style={{ margin: "0 12px" }}>Count: {count}</span>
      <button onClick={() => setCount((c) => c + 1)} aria-label="increment">
        +
      </button>
    </div>
  );
}
