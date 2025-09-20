// src/pages/Detail.jsx
import React from "react";
import { useParams } from "react-router-dom";

export default function Detail({ initialData = {} }) {
  const { id } = useParams();
  // use server-provided initial data if present (window.__INITIAL_DATA__ when hydrated)
  const serverData =
    typeof window !== "undefined" &&
    window.__INITIAL_DATA__ &&
    window.__INITIAL_DATA__.item
      ? window.__INITIAL_DATA__.item
      : initialData.item || null;

  const [item, setItem] = React.useState(serverData);

  React.useEffect(() => {
    if (!item) {
      // client-side fetch fallback
      fetch(`/api/item/${id}`)
        .then((r) => r.json())
        .then((data) => setItem(data.item))
        .catch(() => setItem({ id, title: "取得失敗", body: "" }));
    }
  }, [id, item]);

  if (!item) return <main style={{ padding: 24 }}>Loading...</main>;

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
      <h1>Detail: {item.title}</h1>
      <p>{item.body}</p>
    </main>
  );
}
