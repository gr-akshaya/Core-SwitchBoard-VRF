require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  settings: {
    evmVersion: "shanghai", // For Testnet1 use "Paris"
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },

  networks: {
    hardhat: {},
    core_testnet2: {
      url: "https://rpc.test2.btcs.network",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 1114,
    },
  },
};
