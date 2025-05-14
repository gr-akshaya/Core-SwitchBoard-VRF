// Import Hardhat runtime environment and ethers
const { ethers } = require("hardhat");

async function main() {
  // Set the address of the Switchboard contract on Core Testnet or Mainnet
  const switchboardAddress = "0x33A5066f65f66161bEb3f827A3e40fce7d7A2e6C"; // Example address for Core Testnet

  //Mainnet - 0x33A5066f65f66161bEb3f827A3e40fce7d7A2e6C

  // Set to true if deploying to Mainnet, false if Testnet
  const isMainnet = false; // Set this flag accordingly

  // Get the signer (deployer) for deployment
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Get the RandomNumberGenerator contract
  const RandomNumberGenerator = await ethers.getContractFactory(
    "RandomNumberGenerator"
  );

  // Deploy the contract
  console.log("Deploying RandomNumberGenerator...");
  const randomNumberGenerator = await RandomNumberGenerator.deploy(
    switchboardAddress,
    isMainnet
  );

  console.log(
    "RandomNumberGenerator deployed to:",
    randomNumberGenerator.target
  );
}

// Run the main function
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
