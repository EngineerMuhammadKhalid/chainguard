import React, { useState, useEffect } from "react";
import { BrowserProvider, Contract } from "ethers";
import Upload from "./artifacts/contracts/Upload.sol/Upload.json";
import Modal from "./components/Modal";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import FilesPage from "./pages/FilesPage";
import AccessPage from "./pages/AccessPage";
import UploadPage from "./pages/UploadPage";
import DisplayPage from "./pages/DisplayPage";
import "./App.css";

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [network, setNetwork] = useState("Ethereum Mainnet");

  useEffect(() => {
    if (window.ethereum) {
      const provider = new BrowserProvider(window.ethereum);
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
      window.ethereum.on("accountsChanged", () => {
        window.location.reload();
      });
      setProvider(provider);
    } else {
      console.error("Metamask is not installed");
    }
  }, []);

  const connectWallet = async () => {
    if (!provider) return;
    const accounts = await provider.send("eth_requestAccounts", []);
    const address = accounts[0];
    const signer = await provider.getSigner(address);
    setAccount(address);
    let contractAddress = "0x5Fd63CbB1252e24dB6904fF3223B8Fc60B3100bb";
    const contract = new Contract(
      contractAddress,
      Upload.abi,
      signer
    );
    setContract(contract);
  };

  return (
    <Router>
      <div className="app-bg">
        <aside className="sidebar">
          <div className="sidebar-title">
            <span style={{display:'flex',alignItems:'center',gap:10}}>
              <span style={{fontSize:'2rem'}}>🛡️</span>
              ChainGuard
            </span>
          </div>
          <nav>
            <Link to="/dashboard" className="active"><span style={{marginRight:8}}>📊</span>Dashboard</Link>
            <Link to="/files"><span style={{marginRight:8}}>🗂️</span>Files</Link>
            <Link to="/access"><span style={{marginRight:8}}>🔒</span>Access Control</Link>
            <Link to="/upload"><span style={{marginRight:8}}>☁️</span>Upload Data</Link>
            <Link to="/display"><span style={{marginRight:8}}>🧬</span>Your Stored Data</Link>
          </nav>
        </aside>
        <div className="main-area">
          <header className="dashboard-header">
            <div style={{display:'flex',alignItems:'center',gap:18}}>
              <img src="/logo192.png" alt="Chainguard Logo" className="logo" onError={e => {e.target.style.display='none';}} />
              <span className="dashboard-title">ChainGuard Dashboard</span>
            </div>
            <div className="dashboard-actions">
              <div className="network-selector">
                <select value={network} onChange={e => setNetwork(e.target.value)}>
                  <option>Ethereum Mainnet</option>
                  <option>Sepolia Testnet</option>
                  <option>Goerli Testnet</option>
                </select>
              </div>
              <div className="wallet-status">
                <span className={account ? "connected" : "disconnected"}>
                  {account ? "Connected" : "Disconnected"}
                </span>
                {account && (
                  <span className="wallet-address">
                    {account.slice(0,6)}...{account.slice(-4)}
                    <button className="copy-btn" onClick={() => navigator.clipboard.writeText(account)} title="Copy address">📋</button>
                  </span>
                )}
              </div>
              <button className="nav-btn" onClick={connectWallet} disabled={!!account}>
                {account ? "Wallet Connected" : "Connect Wallet"}
              </button>
              <button className="nav-btn" onClick={() => setModalOpen(true)}>
                Share
              </button>
            </div>
          </header>
          {modalOpen && (
            <Modal setModalOpen={setModalOpen} contract={contract}></Modal>
          )}
          <main className="main-content">
            <Routes>
              <Route path="/dashboard" element={<DashboardPage account={account} contract={contract} />} />
              <Route path="/files" element={<FilesPage contract={contract} account={account} />} />
              <Route path="/access" element={<AccessPage contract={contract} account={account} />} />
              <Route path="/upload" element={<UploadPage account={account} provider={provider} contract={contract} />} />
              <Route path="/display" element={<DisplayPage contract={contract} account={account} />} />
              <Route path="/" element={<DashboardPage account={account} contract={contract} />} />
            </Routes>
          </main>
          <footer className="app-footer" style={{background:'#181b28',color:'#fff',padding:'18px 0',fontSize:'1.05rem',textAlign:'center',letterSpacing:'0.01em',borderTop:'1px solid #23263a'}}>
            <div style={{marginBottom:'4px',fontWeight:600}}>
              Engr. Muhammad Khalid &nbsp;|&nbsp; Engr. Muhammad ShahZaib
            </div>
            <div style={{marginBottom:'2px'}}>Abasyn University, Peshawar</div>
            <div>Bachelor of Science in Software Engineering</div>
            <div style={{marginTop:'6px',fontSize:'0.98rem',color:'#b0b6c1'}}>Chainguard &copy; 2025. Decentralized Storage Powered by Blockchain.</div>
          </footer>
        </div>
      </div>
    </Router>
  );
}

export default App;
