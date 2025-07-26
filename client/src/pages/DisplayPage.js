import React from "react";
import Display from "../components/Display";
export default function DisplayPage({ contract, account }) {
  return (
    <section className="glass-card" style={{width:'100%',maxWidth:'900px',marginBottom:'32px'}}>
      <h2 style={{color:'#00c6ff',fontSize:'1.35rem',marginBottom:'18px',display:'flex',alignItems:'center',gap:8}}>
        <span>🧬</span> Your Stored Data
      </h2>
      <Display contract={contract} account={account} />
    </section>
  );
}
