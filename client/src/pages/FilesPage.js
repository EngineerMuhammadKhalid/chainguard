
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function FilesPage({ contract, account }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFiles = async () => {
      if (!contract || !account) return;
      setLoading(true);
      try {
        const dataArray = await contract.display(account);
        setFiles(dataArray);
      } catch (e) {
        setFiles([]);
      }
      setLoading(false);
    };
    fetchFiles();
  }, [contract, account]);

  return (
    <section className="glass-card" style={{width:'100%',maxWidth:'900px',marginBottom:'32px'}}>
      <h2 style={{color:'#00c6ff',fontSize:'1.35rem',marginBottom:'18px',display:'flex',alignItems:'center',gap:8}}>
        <span>🗂️</span> Uploaded Files
      </h2>
      <div style={{overflowX:'auto'}}>
        <table style={{width:'100%',borderCollapse:'collapse',background:'none',color:'#fff'}}>
          <thead>
            <tr style={{background:'#23263a'}}>
              <th style={{padding:'12px 8px',textAlign:'left'}}>File Name</th>
              <th style={{padding:'12px 8px',textAlign:'left'}}>CID (IPFS)</th>
              <th style={{padding:'12px 8px',textAlign:'left'}}>Owner</th>
              <th style={{padding:'12px 8px',textAlign:'center'}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} style={{textAlign:'center'}}>Loading...</td></tr>
            ) : files.length === 0 ? (
              <tr><td colSpan={4} style={{textAlign:'center'}}>No files found.</td></tr>
            ) : (
              files.map((url, idx) => {
                // Extract CID from the URL
                let cid = url.replace("https://gateway.pinata.cloud/ipfs/", "");
                let fileName = `File #${idx+1}`;
                return (
                  <tr key={idx} style={{background: idx % 2 === 0 ? 'rgba(0,198,255,0.04)' : 'rgba(67,233,123,0.04)'}}>
                    <td style={{padding:'10px 8px'}}>{fileName}</td>
                    <td style={{padding:'10px 8px'}}>{cid.slice(0,6)}...{cid.slice(-4)}</td>
                    <td style={{padding:'10px 8px'}}>{account.slice(0,6)}...{account.slice(-4)}</td>
                    <td style={{padding:'10px 8px',textAlign:'center'}}>
                      <a href={url} target="_blank" rel="noopener noreferrer">
                        <button style={{marginRight:8,padding:'6px 14px',borderRadius:8,border:'none',background:'#00c6ff',color:'#fff',cursor:'pointer'}}>Download</button>
                      </a>
                      <button style={{marginRight:8,padding:'6px 14px',borderRadius:8,border:'none',background:'#43e97b',color:'#fff',cursor:'pointer'}}>Share</button>
                      <button style={{padding:'6px 14px',borderRadius:8,border:'none',background:'#f44336',color:'#fff',cursor:'pointer'}}>Revoke</button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
