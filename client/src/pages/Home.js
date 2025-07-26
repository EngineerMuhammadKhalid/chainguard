import React, { useState, useEffect } from "react";
import { connectWallet } from "../utils/web3";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [account, setAccount] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
    <div className="container" style={{textAlign:'center',marginTop:'64px'}}>
      <h1>Welcome to ChainGuard</h1>
      <p>Decentralized Storage Platform</p>
      <button className="btn" onClick={handleConnect} disabled={!!account} style={{margin:'24px 0'}}>
        {account ? "Wallet Connected" : "Connect Wallet"}
      </button>
      <br />
      <button className="btn" onClick={() => navigate("/dashboard")}>Go to Dashboard</button>
      {account && <div style={{marginTop:'18px',color:'#43e97b'}}>Connected: {account}</div>}
      {error && <div style={{color:'#f44336',marginTop:'8px'}}>{error}</div>}
    </div>
  );
}
