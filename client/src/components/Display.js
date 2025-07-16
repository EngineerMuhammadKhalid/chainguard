import { useState } from "react";
import "./Display.css";
const Display = ({ contract, account }) => {
  const [data, setData] = useState("");
  const getdata = async () => {
    const downloadStart = performance.now(); // Start timing
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
        return;
      }
    } catch (e) {
      alert("You don't have access or contract call failed.");
      return;
    }
    const downloadEnd = performance.now(); // End timing
    const downloadTime = (downloadEnd - downloadStart) / 1000; // seconds
    console.log(`Download/display time: ${downloadTime} seconds`);
    // Security metrics
    console.log(`User authenticated: ${!!account}`);
    if (!dataArray || Object.keys(dataArray).length === 0) {
      alert("No image to display");
      return;
    }
    const str = dataArray.toString();
    const str_array = str.split(",");
    const images = str_array.map((item, i) => {
      return (
        <a href={item} key={i} target="_blank" rel="noopener noreferrer">
          <img
            key={i}
            src={`https://gateway.pinata.cloud/ipfs/${item.substring(6)}`}
            alt="new"
            className="image-list"
          ></img>
        </a>
      );
    });
    setData(images);
  };
  return (
    <>
      <div className="image-list">{data}</div>
      <input
        type="text"
        placeholder="Enter Address"
        className="address"
      ></input>
      <button className="center button" onClick={getdata}>
        Get Data
      </button>
    </>
  );
};
export default Display;
