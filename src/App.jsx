// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Nav from "./Nav";
import Home from "./pages/Home";
import Detail from "./pages/Detail";
import NotFound from "./pages/NotFound";

export default function App({ initialData = {} }) {
  // pass initialData via context (prop drilling simplified here)
  return (
    <div style={{ background: "#f7f7fb", minHeight: "100vh", padding: 24 }}>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/detail/:id"
          element={<Detail initialData={initialData} />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
