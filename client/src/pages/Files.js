import React, { useState, useEffect } from "react";
import FileTable from "../components/FileTable";
import UploadForm from "../components/UploadForm";
import { getContract } from "../utils/web3";

export default function Files() {
  const [files, setFiles] = useState([]);
  const [account, setAccount] = useState("");
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    async function init() {
      if (window.ethereum) {
        const { provider, signer, address } = await connectWallet();
        setProvider(provider);
        setAccount(address);
        const contract = getContract(signer);
        setContract(contract);
        // Fetch files from contract
        try {
          const uploadedFiles = await contract.getFiles(); // update with your contract's method
          setFiles(uploadedFiles);
        } catch (err) {
          // handle error
        }
      }
    }
    init();
  }, []);

  return (
    <div className="container">
      <h2>Files</h2>
      <UploadForm setFiles={setFiles} contract={contract} account={account} />
      <FileTable files={files} setFiles={setFiles} contract={contract} account={account} />
    </div>
  );
}
