import React from "react";
import { Link } from "react-router-dom";
import "../styles/Sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-title">ChainGuard</div>
      <nav>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/files">Files</Link>
        <Link to="/access">Access Control</Link>
        <Link to="/settings">Settings</Link>
      </nav>
    </aside>
  );
}
