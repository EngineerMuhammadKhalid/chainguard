import React from "react";

export default function FileTable({ files, setFiles, contract, account }) {
  async function handleDownload(file) {
    // Implement download logic (e.g., fetch from IPFS)
    window.open(`https://ipfs.io/ipfs/${file.cid}`, "_blank");
  }
  async function handleShare(file) {
    // Implement share logic (e.g., call contract.shareFile)
    if (contract && account) {
      await contract.shareFile(file.cid, account); // update with your contract's method
      alert("File shared!");
    }
  }
  async function handleRevoke(file) {
    // Implement revoke logic (e.g., call contract.revokeFile)
    if (contract && account) {
      await contract.revokeFile(file.cid, account); // update with your contract's method
      alert("Access revoked!");
    }
  }
  return (
    <div className="file-table-container overflow-scroll">
      <table className="file-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>CID</th>
            <th>Owner</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {files.length === 0 ? (
            <tr><td colSpan={4} style={{textAlign:'center'}}>No files uploaded.</td></tr>
          ) : (
            files.map((file, idx) => (
              <tr key={idx}>
                <td>{file.name}</td>
                <td>{file.cid}</td>
                <td>{file.owner}</td>
                <td>
                  <button className="btn btn-download" onClick={() => handleDownload(file)}>Download</button>
                  <button className="btn btn-share" onClick={() => handleShare(file)}>Share</button>
                  <button className="btn btn-revoke" onClick={() => handleRevoke(file)}>Revoke</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
