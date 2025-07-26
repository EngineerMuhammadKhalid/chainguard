
import React, { useRef } from "react";

export default function AccessPage({ contract, account }) {
  const grantRef = useRef();
  const revokeRef = useRef();

  const handleGrant = async () => {
    const address = grantRef.current.value.trim();
    if (!address) return alert("Enter a wallet address to grant access.");
    if (!contract) return alert("Contract not connected.");
    try {
      await contract.allow(address);
      alert("Access granted to " + address);
      grantRef.current.value = "";
    } catch (e) {
      alert("Failed to grant access. " + (e?.message || ""));
    }
  };

  const handleRevoke = async () => {
    const address = revokeRef.current.value.trim();
    if (!address) return alert("Enter a wallet address to revoke access.");
    if (!contract) return alert("Contract not connected.");
    try {
      await contract.disallow(address);
      alert("Access revoked for " + address);
      revokeRef.current.value = "";
    } catch (e) {
      alert("Failed to revoke access. " + (e?.message || ""));
    }
  };

  return (
    <section className="glass-card" style={{width:'100%',maxWidth:'900px',marginBottom:'32px'}}>
      <h2 style={{color:'#38f9d7',fontSize:'1.35rem',marginBottom:'18px',display:'flex',alignItems:'center',gap:8}}>
        <span>🔒</span> Access Control
      </h2>
      <div style={{display:'flex',gap:'24px',flexWrap:'wrap'}}>
        <div style={{background:'rgba(0,198,255,0.08)',borderRadius:'12px',padding:'18px 24px',minWidth:'220px'}}>
          <div style={{fontWeight:700,fontSize:'1.1rem',marginBottom:'8px'}}>Grant Access</div>
          <input ref={grantRef} type="text" placeholder="Wallet Address" style={{width:'100%',padding:'8px',borderRadius:'8px',border:'1px solid #00c6ff',marginBottom:'8px',background:'#23263a',color:'#fff'}} />
          <button onClick={handleGrant} style={{width:'100%',padding:'8px',borderRadius:'8px',border:'none',background:'#43e97b',color:'#fff',fontWeight:700,cursor:'pointer'}}>Grant</button>
        </div>
        <div style={{background:'rgba(255,255,255,0.08)',borderRadius:'12px',padding:'18px 24px',minWidth:'220px'}}>
          <div style={{fontWeight:700,fontSize:'1.1rem',marginBottom:'8px'}}>Revoke Access</div>
          <input ref={revokeRef} type="text" placeholder="Wallet Address" style={{width:'100%',padding:'8px',borderRadius:'8px',border:'1px solid #f44336',marginBottom:'8px',background:'#23263a',color:'#fff'}} />
          <button onClick={handleRevoke} style={{width:'100%',padding:'8px',borderRadius:'8px',border:'none',background:'#f44336',color:'#fff',fontWeight:700,cursor:'pointer'}}>Revoke</button>
        </div>
      </div>
    </section>
  );
}
