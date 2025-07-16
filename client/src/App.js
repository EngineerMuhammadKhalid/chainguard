import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Upload from "./artifacts/contracts/Upload.sol/Upload.json";
import FileUpload from "./components/FileUpload";
import Display from "./components/Display";
import Modal from "./components/Modal";
import "./App.css";

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    if (provider) {
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
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    setAccount(address);
    let contractAddress = "0x5Fd63CbB1252e24dB6904fF3223B8Fc60B3100bb";
    const contract = new ethers.Contract(
      contractAddress,
      Upload.abi,
      signer
    );
    setContract(contract);
  };

  return (
    <div className="app-bg">
      {!account && (
        <button className="connect-wallet" onClick={connectWallet}>
          Connect Wallet
        </button>
      )}
      {!modalOpen && (
        <button className="share" onClick={() => setModalOpen(true)}>
          Share
        </button>
      )}
      {modalOpen && (
        <Modal setModalOpen={setModalOpen} contract={contract}></Modal>
      )}
      <div className="App">
        <h1 style={{ color: "white" }}>Chainguard: Decentralized Storage System</h1>
        <div className="bg"></div>
        <div className="bg bg2"></div>
        <div className="bg bg3"></div>
        <p style={{ color: "white" }}>
          Account : {account ? account : "Not connected"}
        </p>
        <FileUpload
          account={account}
          provider={provider}
          contract={contract}
        />
        <Display contract={contract} account={account} />
      </div>
    </div>
  );
}

export default App;
