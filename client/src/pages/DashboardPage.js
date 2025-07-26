
import React, { useEffect, useState } from "react";

export default function DashboardPage({ account, contract }) {
  const [totalFiles, setTotalFiles] = useState("--");
  const [totalUsers, setTotalUsers] = useState("--");
  const [storageUsed, setStorageUsed] = useState("--");

  useEffect(() => {
    const fetchStats = async () => {
      if (!account || !contract) return;
      try {
        // Get files for current user
        let files = [];
        try {
          files = await contract.display(account);
        } catch (e) {
          files = [];
        }
        setTotalFiles(files.length);
        // Estimate storage used (assuming each file is a URL string, so not accurate)
        // If you want to sum file sizes, you need to store them in the contract or off-chain
        setStorageUsed(files.length > 0 ? `${files.length} files` : "0 files");
        // Get users shared with
        let users = [];
        try {
          users = await contract.shareAccess();
        } catch (e) {
          users = [];
        }
        setTotalUsers(users.length);
      } catch (err) {
        setTotalFiles("--");
        setTotalUsers("--");
        setStorageUsed("--");
      }
    };
    fetchStats();
  }, [account, contract]);

  return (
    <section className="glass-card" style={{minWidth:'320px',maxWidth:'900px',width:'100%',marginBottom:'32px'}}>
      <h2 style={{color:'#43e97b',fontSize:'1.5rem',marginBottom:'18px',display:'flex',alignItems:'center',gap:8}}>
        <span>📊</span> Dashboard Stats
      </h2>
      <div style={{display:'flex',gap:'32px',justifyContent:'center',flexWrap:'wrap'}}>
        <div style={{background:'rgba(0,198,255,0.12)',borderRadius:'18px',padding:'18px 32px',minWidth:'120px',textAlign:'center'}}>
          <div style={{fontSize:'2.2rem'}}>🗂️</div>
          <div style={{fontWeight:700,fontSize:'1.2rem'}}>Total Files</div>
          <div style={{fontSize:'1.1rem'}}>{totalFiles}</div>
        </div>
        <div style={{background:'rgba(67,233,123,0.12)',borderRadius:'18px',padding:'18px 32px',minWidth:'120px',textAlign:'center'}}>
          <div style={{fontSize:'2.2rem'}}>👥</div>
          <div style={{fontWeight:700,fontSize:'1.2rem'}}>Total Users Shared</div>
          <div style={{fontSize:'1.1rem'}}>{totalUsers}</div>
        </div>
        <div style={{background:'rgba(255,255,255,0.10)',borderRadius:'18px',padding:'18px 32px',minWidth:'120px',textAlign:'center'}}>
          <div style={{fontSize:'2.2rem'}}>💾</div>
          <div style={{fontWeight:700,fontSize:'1.2rem'}}>Storage Used</div>
          <div style={{fontSize:'1.1rem'}}>{storageUsed}</div>
        </div>
      </div>
    </section>
  );
}
