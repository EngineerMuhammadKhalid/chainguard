require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    ganache: {
      url: "http://127.0.0.1:7545",
      chainId: 1337,
      accounts: ["0x7c4973f07a87e21fd188f272e9508eb2cca9df12044360951d1ad290d65eb3bb"],
    },
  },
  paths: {
    artifacts: "./client/src/artifacts",
  },
};
