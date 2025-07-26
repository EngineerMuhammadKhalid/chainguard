import React, { useState } from "react";

export default function UploadForm({ setFiles, contract, account }) {
  const [fileName, setFileName] = useState("");
  const [cid, setCid] = useState("");
  const [owner, setOwner] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpload(e) {
    e.preventDefault();
    if (!fileName || !cid || !owner || !contract) {
      setError("Missing fields or wallet not connected");
      return;
    }
    setLoading(true);
    setError("");
    try {
      // Call smart contract upload method
      await contract.uploadFile(fileName, cid, owner); // update with your contract's method
      setFiles(prev => [...prev, { name: fileName, cid, owner }]);
      setFileName("");
      setCid("");
      setOwner("");
    } catch (err) {
      setError("Upload failed: " + err.message);
    }
    setLoading(false);
  }

  return (
    <form className="card" style={{marginBottom:'24px',maxWidth:'500px'}} onSubmit={handleUpload}>
      <h3>Upload File</h3>
      <input className="btn" type="text" placeholder="File Name" value={fileName} onChange={e => setFileName(e.target.value)} style={{margin:'8px 0'}} />
      <input className="btn" type="text" placeholder="CID (IPFS Hash)" value={cid} onChange={e => setCid(e.target.value)} style={{margin:'8px 0'}} />
      <input className="btn" type="text" placeholder="Owner Address" value={owner} onChange={e => setOwner(e.target.value)} style={{margin:'8px 0'}} />
      <button className="btn btn-download" type="submit" disabled={loading}>{loading ? "Uploading..." : "Upload"}</button>
      {error && <div style={{color:'#f44336',marginTop:'8px'}}>{error}</div>}
    </form>
  );
}
