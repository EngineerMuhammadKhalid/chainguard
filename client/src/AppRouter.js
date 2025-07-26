import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Files from "./pages/Files";
import Access from "./pages/Access";
import Settings from "./pages/Settings";
import "./styles/Navbar.css";
import "./styles/Sidebar.css";
import "./styles/Card.css";
import "./styles/Grid.css";
import "./App.css";

export default function AppRouter() {
  const [isConnected, setIsConnected] = useState(false);
  // Dummy connect wallet handler
  function handleConnect() {
    setIsConnected(true);
  }
  return (
    <Router>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={{ flex: 1 }}>
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  onConnect={handleConnect}
                  isConnected={isConnected}
                />
              }
            />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/files" element={<Files />} />
            <Route path="/access" element={<Access />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
