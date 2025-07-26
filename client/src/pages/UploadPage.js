import React from "react";
import FileUpload from "../components/FileUpload";
export default function UploadPage({ account, provider, contract }) {
  return (
    <section className="glass-card" style={{width:'100%',maxWidth:'900px',marginBottom:'32px'}}>
      <h2 style={{color:'#00c6ff',fontSize:'1.35rem',marginBottom:'18px',display:'flex',alignItems:'center',gap:8}}>
        <span>☁️</span> Upload Data
      </h2>
      <FileUpload account={account} provider={provider} contract={contract} dragDrop={true} />
    </section>
  );
}
