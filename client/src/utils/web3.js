import { BrowserProvider, Contract } from "ethers";
import Upload from "../artifacts/contracts/Upload.sol/Upload.json";

export async function connectWallet() {
  if (!window.ethereum) throw new Error("MetaMask not installed");
  const provider = new BrowserProvider(window.ethereum);
  const accounts = await provider.send("eth_requestAccounts", []);
  const address = accounts[0];
  const signer = await provider.getSigner(address);
  return { provider, signer, address };
}

export function getContract(signer) {
  const contractAddress = "0x5Fd63CbB1252e24dB6904fF3223B8Fc60B3100bb"; // update as needed
  return new Contract(contractAddress, Upload.abi, signer);
}
