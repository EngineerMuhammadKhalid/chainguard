import React, { useState, useEffect } from "react";
import { connectWallet, getContract } from "../utils/web3";

export default function Settings() {
  const [network, setNetwork] = useState("Ethereum Mainnet");
  const [account, setAccount] = useState("");
  const [provider, setProvider] = useState(null);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    async function init() {
      if (window.ethereum) {
        const { provider, address } = await connectWallet();
        setProvider(provider);
        setAccount(address);
      }
    }
    init();
  }, []);

  function handleDisconnect() {
    setAccount("");
    setProvider(null);
  }

  function handleThemeToggle() {
    setTheme(theme === "dark" ? "light" : "dark");
    document.body.className = theme === "dark" ? "light" : "dark";
  }

  return (
    <div className="container">
      <h2>Settings</h2>
      <div className="card" style={{maxWidth:'400px',margin:'32px auto'}}>
        <div>
          <label>Network:</label>
          <select className="btn" style={{width:'100%',margin:'8px 0'}} value={network} onChange={e => setNetwork(e.target.value)}>
            <option>Ethereum Mainnet</option>
            <option>Sepolia Testnet</option>
            <option>Goerli Testnet</option>
          </select>
        </div>
        <div style={{marginTop:'16px'}}>
          <label>Wallet Address:</label>
          <div style={{background:'#222',color:'#fff',padding:'8px',borderRadius:'8px'}}>{account || '--'}</div>
        </div>
        <button className="btn" style={{marginTop:'16px'}} onClick={handleDisconnect}>Disconnect</button>
        <button className="btn" style={{marginTop:'16px'}} onClick={handleThemeToggle}>Toggle Light/Dark Mode</button>
      </div>
    </div>
  );
}
