const { ethers: hreEthers } = require("hardhat");

async function CallRandom() {
  const contractAddress = "0x33943D4C8391fc30Ada912856ce59813826B6A26"; //  contract Address

  // Create an instance of the contract
  const RandomNumberGenerator = await hreEthers.getContractFactory(
    "RandomNumberGenerator"
  );
  const randomNumberGenerator = await RandomNumberGenerator.attach(
    contractAddress
  );

  try {
    console.log("Calling roll() function...");
    const tx = await randomNumberGenerator.roll();
    console.log("Transaction sent:", tx.hash);
    console.log("Waiting for transaction confirmation...");
    await tx.wait();
    console.log("Transaction confirmed!");
  } catch (error: any) {
    console.error("Error details:", error);
    if (error.data) {
      console.error("Error data:", error.data);
    }
    throw error;
  }
}

// Run the main function
CallRandom()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
