// src/Nav.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Nav() {
  return (
    <nav style={{ marginBottom: 16 }}>
      <Link to="/" style={{ marginRight: 12 }}>
        Home
      </Link>
      <Link to="/detail/1" style={{ marginRight: 12 }}>
        Detail 1
      </Link>
      <Link to="/detail/2" style={{ marginRight: 12 }}>
        Detail 2
      </Link>
      <Link to="/no-such-page" style={{ marginRight: 12 }}>
        404 page
      </Link>
    </nav>
  );
}
