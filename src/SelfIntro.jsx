// src/SelfIntro.jsx
import React from "react";

export default function SelfIntro() {
  return (
    <section style={styles.container}>
      <h1 style={styles.h1}>日向野　方暉（ひがの まさき）</h1>

      <dl style={styles.dl}>
        <dt style={styles.dt}>出身地</dt>
        <dd style={styles.dd}>栃木県</dd>

        <dt style={styles.dt}>趣味</dt>
        <dd style={styles.dd}>ランニング</dd>

        <dt style={styles.dt}>現在の仕事</dt>
        <dd style={styles.dd}>金融機関</dd>
      </dl>

      <p style={styles.note}>
        これは Vite + React（SSR） の自己紹介ページです。
      </p>
    </section>
  );
}

const styles = {
  container: {
    fontFamily:
      'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
    maxWidth: 760,
    margin: "40px auto",
    padding: "24px",
    borderRadius: 12,
    boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
    background: "white",
  },
  h1: {
    margin: 0,
    marginBottom: 12,
    fontSize: "1.8rem",
    lineHeight: 1.2,
  },
  dl: {
    margin: 0,
    padding: 0,
    display: "grid",
    gridTemplateColumns: "120px 1fr",
    gap: "8px 16px",
    alignItems: "start",
  },
  dt: {
    fontWeight: 700,
    color: "#333",
  },
  dd: {
    margin: 0,
    color: "#555",
  },
  note: {
    marginTop: 18,
    color: "#666",
    fontSize: "0.95rem",
  },
};
