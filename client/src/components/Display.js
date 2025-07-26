
import { useState } from "react";
import "./Display.css";

const Display = ({ contract, account }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const getdata = async () => {
    setLoading(true);
    let dataArray;
    const Otheraddress = document.querySelector(".address").value;
    try {
      if (contract) {
        if (Otheraddress) {
          dataArray = await contract.display(Otheraddress);
        } else {
          dataArray = await contract.display(account);
        }
      } else {
        alert("Contract not connected. Please connect your wallet.");
        setLoading(false);
        return;
      }
    } catch (e) {
      alert("You don't have access or contract call failed.");
      setLoading(false);
      return;
    }
    if (!dataArray || Object.keys(dataArray).length === 0) {
      alert("No file to display");
      setFiles([]);
      setLoading(false);
      return;
    }
    const str = dataArray.toString();
    const str_array = str.split(",");
    setFiles(str_array);
    setLoading(false);
  };

  // Helper to detect image file
  const isImage = (url) => {
    const ext = url.split('.').pop().toLowerCase();
    return ["jpg","jpeg","png","gif","bmp","webp","svg"].includes(ext);
  };

  // Helper to get file extension
  const getExt = (url) => url.split('.').pop().toLowerCase();

  return (
    <>
      <div className="file-grid">
        {files.map((url, i) => (
          <div className="file-card" key={i}>
            {isImage(url) ? (
              <a href={url} target="_blank" rel="noopener noreferrer">
                <img
                  src={url}
                  alt="file"
                  className="file-preview"
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/150?text=No+Preview";
                  }}
                />
              </a>
            ) : (
              <a href={url} target="_blank" rel="noopener noreferrer" className="file-link">
                <span className="file-icon" style={{fontSize:'2.2rem'}}>
                  {getExt(url)==="pdf" ? "📄" : getExt(url)==="zip" ? "🗜️" : "📁"}
                </span>
                <div className="file-label">{getExt(url).toUpperCase()} File</div>
                <div className="file-download">View/Download</div>
              </a>
            )}
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Enter Address"
        className="address"
        style={{marginTop:24}}
      />
      <button className="center button" onClick={getdata} style={{marginTop:16}} disabled={loading}>
        {loading ? "Loading..." : "Get Data"}
      </button>
    </>
  );
};

export default Display;
