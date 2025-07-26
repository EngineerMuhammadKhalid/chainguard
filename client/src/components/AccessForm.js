import React, { useState } from "react";

export default function AccessForm({ contract, account }) {
  const [address, setAddress] = useState("");
  const [action, setAction] = useState("grant");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!address || !contract || !account) return;
    setLoading(true);
    try {
      if (action === "grant") {
        await contract.grantAccess(address); // update with your contract's method
        setMessage(`Access granted to ${address}`);
      } else {
        await contract.revokeAccess(address); // update with your contract's method
        setMessage(`Access revoked for ${address}`);
      }
      setAddress("");
    } catch (err) {
      setMessage("Error: " + err.message);
    }
    setLoading(false);
  }

  return (
    <form className="card" style={{maxWidth:'400px',margin:'0 auto'}} onSubmit={handleSubmit}>
      <h3>Access Control</h3>
      <input className="btn" type="text" placeholder="Wallet Address" value={address} onChange={e => setAddress(e.target.value)} style={{margin:'8px 0'}} />
      <div style={{display:'flex',gap:'12px',margin:'8px 0'}}>
        <button className="btn btn-share" type="submit" onClick={() => setAction("grant")} disabled={loading}>Grant</button>
        <button className="btn btn-revoke" type="submit" onClick={() => setAction("revoke")} disabled={loading}>Revoke</button>
      </div>
      {message && <div style={{marginTop:'12px',color:'#43e97b'}}>{message}</div>}
    </form>
  );
}
