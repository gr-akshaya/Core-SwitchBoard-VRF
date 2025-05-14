const { CrossbarClient } = require("@switchboard-xyz/common");
const { ethers: hardhatEthers } = require("hardhat");

async function fetchRandom() {
  const crossbar = new CrossbarClient("https://crossbar.switchboard.xyz");

  const { encoded } = await crossbar.resolveEVMRandomness({
    chainId: 1115, // Chain ID for Core Testnet.  Example:  Morph Holesky/Testnet is (1115).
    randomnessId:
      "0xe2a3bd3bc41ec386c6df6762269b0862f6ac4fb5c8a7ac0f8b51c426514cf689", //  ID from your Solidity contract
  });

  const contractAddress = "0xc7723FdB5493c646ef7153C48A4e8d6861744e0C"; //  contract Address
  // Create an instance of the contract
  const RandomNumberGenerator = await hardhatEthers.getContractFactory(
    "RandomNumberGenerator"
  );
  const randomNumberGenerator = await RandomNumberGenerator.attach(
    contractAddress
  );

  const tx = await randomNumberGenerator.roll();
  await tx.wait();

  console.log("Randomness resolved in transaction:", tx.hash);
}

// Run the main function
fetchRandom()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
