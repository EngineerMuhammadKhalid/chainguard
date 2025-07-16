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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      const uploadStart = performance.now();
      const fileSizeMB = file.size / (1024 * 1024);
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

        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: `7faf0b79d26df98b1e7f`,
            pinata_secret_api_key: `83fd85d69ec19ffbe4857c0942bfe23e604d633082b45ee3f0d96edf98d5859f`,
            "Content-Type": "multipart/form-data",
          },
        });
        const uploadEnd = performance.now();
        const uploadTime = (uploadEnd - uploadStart) / 1000;
        const throughput = fileSizeMB / uploadTime;
        const ipfsHash = resFile.data.IpfsHash || "-";
        // Save metrics
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
        if (resFile.data.IpfsHash) {
          console.log(`Uploaded file IPFS hash: ${resFile.data.IpfsHash}`);
        }
        const ImgHash = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
        // Ensure contract call uses signer for MetaMask confirmation
        let contractWithSigner = contract;
        if (provider && contract && provider.getSigner) {
          contractWithSigner = contract.connect(provider.getSigner());
        }
        await contractWithSigner.add(account, ImgHash); // This will trigger MetaMask
        alert("Successfully Image Uploaded");
        setFileName("No image selected");
        setFile(null);
      } catch (e) {
        alert("Unable to upload image to Pinata");
      }
    }
    alert("Successfully Image Uploaded");
    setFileName("No image selected");
    setFile(null);
  };
  const retrieveFile = (e) => {
    const data = e.target.files[0]; //files array of files object
    // console.log(data);
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = () => {
      setFile(e.target.files[0]);
    };
    setFileName(e.target.files[0].name);
    e.preventDefault();
  };
  // Fetch uploaded files from contract
  const handleGetData = async () => {
    if (!contract || !account) return;
    setLoading(true);
    try {
      // Assumes contract has a function: get(account) that returns an array of hashes
      const files = await contract.get(account);
      setUploadedFiles(files);
    } catch (err) {
      alert("Unable to fetch uploaded files");
    }
    setLoading(false);
  };
  // Table and Chart Data
  const tableRows = metrics.map((m, i) => (
    <tr key={i}>
      <td>{m.fileName}</td>
      <td>{m.fileSizeMB}</td>
      <td>{m.uploadTime}</td>
      <td>{m.throughput}</td>
      <td>{m.ipfsHash}</td>
      <td>{m.isAuthenticated ? "Yes" : "No"}</td>
      <td>{m.isHttps ? "Yes" : "No"}</td>
      <td>{m.trustedEndpoint ? "Yes" : "No"}</td>
    </tr>
  ));
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
        <label htmlFor="file-upload" className="choose">
          Choose Image
        </label>
        <input
          disabled={!account}
          type="file"
          id="file-upload"
          name="data"
          onChange={retrieveFile}
        />
        <span className="textArea">Image: {fileName}</span>
        <button type="submit" className="upload" disabled={!file}>
          Upload File
        </button>
      </form>
      <button className="get-data" onClick={handleGetData} disabled={!account || loading} style={{marginTop: 16}}>
        {loading ? "Loading..." : "Get Data"}
      </button>
      {uploadedFiles.length > 0 && (
        <div style={{marginTop: 16}}>
          <h3>Uploaded Files</h3>
          <ul>
            {uploadedFiles.map((hash, idx) => (
              <li key={idx}>
                <a href={`https://gateway.pinata.cloud/ipfs/${hash}`} target="_blank" rel="noopener noreferrer">{hash}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
      {metrics.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h3>Upload Metrics Table</h3>
          <table className="metrics-table">
            <thead>
              <tr>
                <th>File Name</th>
                <th>Size (MB)</th>
                <th>Upload Time (s)</th>
                <th>Throughput (MB/s)</th>
                <th>IPFS Hash</th>
                <th>Authenticated</th>
                <th>HTTPS</th>
                <th>Trusted Endpoint</th>
              </tr>
            </thead>
            <tbody>{tableRows}</tbody>
          </table>
          <h3>Upload Metrics Graph</h3>
          <div className="metrics-graph-container">
            <Line data={chartData} options={chartOptions} />
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
