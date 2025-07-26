
import { useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from "chart.js";
import "./FileUpload.css";
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const FileUpload = ({ contract, account, provider }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No image selected");
  const [metrics, setMetrics] = useState([]); // Store all upload metrics
  const [uploadedFiles, setUploadedFiles] = useState([]); // Store fetched uploaded files
  const [loading, setLoading] = useState(false);

  const retrieveFile = (e) => {
    const data = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = () => {
      setFile(e.target.files[0]);
    };
    setFileName(e.target.files[0].name);
    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    const uploadStart = performance.now();
    const fileSizeMB = file.size / (1024 * 1024);
    let ipfsHash = null;
    try {
      const formData = new FormData();
      formData.append("file", file);
      // Security metrics (advanced)
      const isAuthenticated = !!account;
      const isHttps = "https://api.pinata.cloud/pinning/pinFileToIPFS".startsWith("https://");
      const trustedEndpoint = "api.pinata.cloud";
      const endpointUsed = new URL("https://api.pinata.cloud/pinning/pinFileToIPFS").hostname;
      const keysExposed = !!(process.env.pinata_api_key || process.env.pinata_secret_api_key);
      console.log("--- Security Metrics ---");
      console.log(`User authenticated: ${isAuthenticated}`);
      console.log(`API uses HTTPS: ${isHttps}`);
      console.log(`Trusted endpoint: ${endpointUsed === trustedEndpoint}`);
      if (keysExposed) {
        console.warn("Warning: Sensitive API keys should not be exposed in client-side code!");
      }

      // 1. Upload to Pinata
      let resFile;
      try {
        resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: `7faf0b79d26df98b1e7f`,
            pinata_secret_api_key: `83fd85d69ec19ffbe4857c0942bfe23e604d633082b45ee3f0d96edf98d5859f`,
            "Content-Type": "multipart/form-data",
          },
        });
        ipfsHash = resFile.data.IpfsHash || "-";
      } catch (err) {
        alert("Unable to upload image to Pinata");
        setFileName("No image selected");
        setFile(null);
        return;
      }

      // 2. Save metrics
      const uploadEnd = performance.now();
      const uploadTime = (uploadEnd - uploadStart) / 1000;
      const throughput = fileSizeMB / uploadTime;
      setMetrics((prev) => [
        ...prev,
        {
          fileName: file.name,
          fileSizeMB: fileSizeMB.toFixed(2),
          uploadTime: uploadTime.toFixed(2),
          throughput: throughput.toFixed(2),
          ipfsHash,
          isAuthenticated,
          isHttps,
          trustedEndpoint: endpointUsed === trustedEndpoint,
        },
      ]);
      console.log("--- Speed Metrics ---");
      console.log(`File size: ${fileSizeMB.toFixed(2)} MB`);
      console.log(`Upload time: ${uploadTime.toFixed(2)} seconds`);
      console.log(`Upload throughput: ${throughput.toFixed(2)} MB/s`);
      if (ipfsHash && ipfsHash !== "-") {
        console.log(`Uploaded file IPFS hash: ${ipfsHash}`);
      }

      // 3. Trigger MetaMask transaction (contract call)
      const ImgHash = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
      try {
        // Always use a MetaMask signer (ethers.js v6)
        let contractWithSigner = contract;
        if (window.ethereum && provider && contract) {
          // Use BrowserProvider from ethers.js v6
          // If provider is not already a BrowserProvider, create one
          let browserProvider = provider;
          if (!provider.getSigner) {
            // Dynamically import BrowserProvider if needed
            const { BrowserProvider } = await import("ethers");
            browserProvider = new BrowserProvider(window.ethereum);
          }
          const signer = await browserProvider.getSigner();
          contractWithSigner = contract.connect(signer);
        }
        await contractWithSigner.add(account, ImgHash); // This will trigger MetaMask
        alert("Successfully Image Uploaded");
      } catch (err) {
        let errorMsg = "Image uploaded to Pinata, but transaction failed. Please confirm MetaMask and try again.";
        if (err && err.message) {
          errorMsg += `\nBlockchain error: ${err.message}`;
        }
        if (err && err.data && err.data.message) {
          errorMsg += `\nContract error: ${err.data.message}`;
        }
        alert(errorMsg);
        console.error("Blockchain transaction error:", err);
      }
      setFileName("No image selected");
      setFile(null);
    } catch (e) {
      alert("Unexpected error during upload");
      setFileName("No image selected");
      setFile(null);
    }
  };
  // Fetch uploaded files from contract
  const handleGetData = async () => {
    if (!contract || !account) return;
    setLoading(true);
    try {
      // Assumes contract has a function: get(account) that returns an array of hashes
      let contractWithSigner = contract;
      if (window.ethereum && provider && contract) {
        let browserProvider = provider;
        if (!provider.getSigner) {
          const { BrowserProvider } = await import("ethers");
          browserProvider = new BrowserProvider(window.ethereum);
        }
        const signer = await browserProvider.getSigner();
        contractWithSigner = contract.connect(signer);
      }
      const files = await contractWithSigner.get(account);
      setUploadedFiles(files);
    } catch (err) {
      let errorMsg = "Unable to fetch uploaded files.";
      if (err && err.message) {
        errorMsg += `\nBlockchain error: ${err.message}`;
      }
      alert(errorMsg);
      console.error("Fetch uploaded files error:", err);
    }
    setLoading(false);
  };
  // Table and Chart Data
  const chartData = {
    labels: metrics.map((m, i) => `#${i + 1}`), // Use short labels
    datasets: [
      {
        label: "Upload Time (s)",
        data: metrics.map((m) => parseFloat(m.uploadTime)),
        borderColor: "#36a2eb",
        backgroundColor: "#36a2eb33",
        yAxisID: 'y',
      },
      {
        label: "Throughput (MB/s)",
        data: metrics.map((m) => parseFloat(m.throughput)),
        borderColor: "#4bc0c0",
        backgroundColor: "#4bc0c033",
        yAxisID: 'y1',
      },
    ],
  };
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Upload Metrics' },
      tooltip: { mode: 'index', intersect: false },
    },
    interaction: { mode: 'nearest', axis: 'x', intersect: false },
    scales: {
      x: { title: { display: true, text: 'Upload #' } },
      y: { type: 'linear', display: true, position: 'left', title: { display: true, text: 'Upload Time (s)' } },
      y1: { type: 'linear', display: true, position: 'right', grid: { drawOnChartArea: false }, title: { display: true, text: 'Throughput (MB/s)' } },
    },
  };
  return (
    <div className="top">
      <form className="form" onSubmit={handleSubmit}>
        <div className="upload-controls">
          <label htmlFor="file-upload">
            Choose File
          </label>
          <input
            disabled={!account}
            type="file"
            id="file-upload"
            name="data"
            onChange={retrieveFile}
          />
          <span className="file-name">{fileName}</span>
          <button type="submit" disabled={!file}>
            Upload File
          </button>
        </div>
      </form>
      <button className="get-data" onClick={handleGetData} disabled={!account || loading} style={{marginTop: 16}}>
        {loading ? "Loading..." : "Get Data"}
      </button>
      {uploadedFiles.length > 0 && (
        <div style={{marginTop: 24, background:'#fff', borderRadius:'12px', padding:'24px', boxShadow:'0 2px 8px rgba(0,0,0,0.08)', border:'1px solid #e0e0e0', maxWidth:'600px'}}>
          <h3 style={{color:'#222', marginBottom:'16px'}}>Your Uploaded Files</h3>
          <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
            {uploadedFiles.map((hash, idx) => (
              <div key={idx} style={{display:'flex', alignItems:'center', justifyContent:'space-between', background:'#f5f5f5', borderRadius:'8px', padding:'10px 16px'}}>
                <span style={{fontFamily:'monospace', fontSize:'15px', color:'#333', wordBreak:'break-all', maxWidth:'340px'}}>{hash}</span>
                <a href={`https://gateway.pinata.cloud/ipfs/${hash}`} target="_blank" rel="noopener noreferrer" style={{marginLeft:'16px', color:'#1976d2', fontWeight:'bold', textDecoration:'none', fontSize:'15px'}}>View</a>
              </div>
            ))}
          </div>
        </div>
      )}
      {metrics.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h3 style={{color:'#fff'}}>Upload Metrics Table</h3>
          <div style={{overflowX:'auto', maxWidth:'100vw'}}>
            <table className="metrics-table" style={{width:'100%', background:'#fff', color:'#222', borderRadius:'8px', boxShadow:'0 2px 8px rgba(0,0,0,0.08)'}}>
              <thead>
                <tr style={{background:'#eaf6fb'}}>
                  <th style={{color:'#fff'}}>File Name</th>
                  <th style={{color:'#fff'}}>Size (MB)</th>
                  <th style={{color:'#fff'}}>Upload Time (s)</th>
                  <th style={{color:'#fff'}}>Throughput (MB/s)</th>
                  <th style={{color:'#fff'}}>IPFS Hash</th>
                  <th style={{color:'#fff'}}>Authenticated</th>
                  <th style={{color:'#fff'}}>HTTPS</th>
                  <th style={{color:'#fff'}}>Trusted Endpoint</th>
                </tr>
              </thead>
              <tbody>
                {metrics.map((m, i) => {
                  // Truncate IPFS hash for display, show full hash on hover
                  const hash = m.ipfsHash;
                  const truncatedHash = hash.length > 12 ? `${hash.slice(0, 6)}...${hash.slice(-6)}` : hash;
                  return (
                    <tr key={i} style={{background: i % 2 === 0 ? '#fff' : '#f5f5f5'}}>
                      <td>{m.fileName}</td>
                      <td>{m.fileSizeMB}</td>
                      <td>{m.uploadTime}</td>
                      <td>{m.throughput}</td>
                      <td style={{whiteSpace:'nowrap', maxWidth:'180px', overflow:'hidden', textOverflow:'ellipsis'}}>
                        <span title={hash}>{truncatedHash}</span>
                      </td>
                      <td>{m.isAuthenticated ? "Yes" : "No"}</td>
                      <td>{m.isHttps ? "Yes" : "No"}</td>
                      <td>{m.trustedEndpoint ? "Yes" : "No"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <h3 style={{marginTop:'32px', color:'#fff'}}>Upload Metrics Graph</h3>
          <div className="metrics-graph-container" style={{background:'#fff', borderRadius:'12px', padding:'24px', boxShadow:'0 2px 8px rgba(0,0,0,0.08)', border:'1px solid #e0e0e0'}}>
            <Line data={{
              ...chartData,
              datasets: chartData.datasets.map(ds => ({
                ...ds,
                pointBackgroundColor: '#36a2eb',
                pointBorderColor: '#222',
                pointRadius: 5,
                pointHoverRadius: 7,
                borderWidth: 3
              }))
            }} options={{
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                legend: { ...chartOptions.plugins.legend, labels: { color: '#222', font: { size: 16 } } },
                title: { ...chartOptions.plugins.title, color: '#222', font: { size: 18 } }
              },
              scales: {
                x: { ...chartOptions.scales.x, ticks: { color: '#222', font: { size: 14 } }, grid: { color: '#e0e0e0' } },
                y: { ...chartOptions.scales.y, ticks: { color: '#222', font: { size: 14 } }, grid: { color: '#e0e0e0' } },
                y1: { ...chartOptions.scales.y1, ticks: { color: '#222', font: { size: 14 } }, grid: { color: '#e0e0e0' } },
              },
            }} />
          </div>
        </div>
      )}
    </div>
  );
};
export default FileUpload;

// import { useState } from "react";
// import axios from "axios";
// import "./FileUpload.css";
// function FileUpload({ contract, provider, account }) {
//   // const [urlArr, setUrlArr] = useState([]);
//   const [file, setFile] = useState(null);
//   const [fileName, setFileName] = useState("No image selected");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (file) {
//         try {
//           const formData = new FormData();
//           formData.append("file", file);

//           const resFile = await axios({
//             method: "post",
//             url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
//             data: formData,
//             headers: {
//               pinata_api_key: `95f328a012f1634eab8b`,
//               pinata_secret_api_key: `8ea64e6b39c91631c66128a7c0e0dde35a6fbdf797a8393cc5ba8bf8d58e9b54`,
//               "Content-Type": "multipart/form-data",
//             },
//           });

//           const ImgHash = `ipfs://${resFile.data.IpfsHash}`;
//           const signer = contract.connect(provider.getSigner());
//           signer.add(account, ImgHash);

//           //setUrlArr((prev) => [...prev, ImgHash]);

//           //Take a look at your Pinata Pinned section, you will see a new file added to you list.
//         } catch (error) {
//           alert("Error sending File to IPFS");
//           console.log(error);
//         }
//       }

//       alert("Successfully Uploaded");
//       setFileName("No image selected");
//       setFile(null); //to again disable the upload button after upload
//     } catch (error) {
//       console.log(error.message); //this mostly occurse when net is not working
//     }
//   };
//   const retrieveFile = (e) => {
//     const data = e.target.files[0];
//     console.log(data);

//     const reader = new window.FileReader();

//     reader.readAsArrayBuffer(data);
//     reader.onloadend = () => {
//       setFile(e.target.files[0]);
//     };
//     setFileName(e.target.files[0].name);
//     e.preventDefault();
//   };
//   return (
//     <div className="top">
//       <form className="form" onSubmit={handleSubmit}>
//         <label htmlFor="file-upload" className="choose">
//           {/*turn around for avoding choose file */}
//           Choose Image
//         </label>
//         <input
//           disabled={!account} //disabling button when metamask account is not connected
//           type="file"
//           id="file-upload"
//           name="data"
//           onChange={retrieveFile}
//         />
//         <span className="textArea">Image: {fileName}</span>
//         {/* choose file */}
//         <button type="submit" disabled={!file} className="upload">
//           Upload file
//         </button>
//       </form>
//     </div>
//   );
// }

// export default FileUpload;
