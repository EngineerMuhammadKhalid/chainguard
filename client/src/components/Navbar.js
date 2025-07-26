import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import { connectWallet } from "../utils/web3";

export default function Navbar() {
  const [account, setAccount] = useState("");
  const [error, setError] = useState("");

  async function handleConnect() {
    try {
      const { address } = await connectWallet();
      setAccount(address);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <nav className="navbar container">
      <div className="navbar-brand">ChainGuard</div>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/files">Files</Link>
        <Link to="/access">Access Control</Link>
        <Link to="/settings">Settings</Link>
      </div>
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "12px" }}>
        {account ? (
          <span style={{ background: "#222", color: "#43e97b", padding: "6px 12px", borderRadius: "8px" }}>
            {account.slice(0, 6)}...{account.slice(-4)}
          </span>
        ) : (
          <button className="btn" onClick={handleConnect}>
            Connect Wallet
          </button>
        )}
      </div>
      {error && <div style={{ color: "#f44336", marginLeft: "18px" }}>{error}</div>}
    </nav>
  );
}
