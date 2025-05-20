const { CrossbarClient } = require("@switchboard-xyz/common");
const { ethers: hreEthers } = require("hardhat");


async function CallRandom() {
  
  const contractAddress = "0x1ae3BcbE90465157D361C6ecB2075d48dC382BE0"; //  contract Address

  // Create an instance of the contract
  const RandomNumberGenerator = await hreEthers.getContractFactory(
    "RandomNumberGenerator"
  );
  const randomNumberGenerator = await RandomNumberGenerator.attach(
    contractAddress
  );

  // Sleep function for waiting the randomness delay
  async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Try to roll for randomness
  try {
    console.log("Calling roll() function...");
    const tx = await randomNumberGenerator.roll();
    console.log("Transaction sent:", tx.hash);
    console.log("Waiting for transaction confirmation...");
    await tx.wait();
    console.log("Transaction confirmed!");
  } catch (error: any) {
    console.log("Failed to call roll() function");
    console.error("Error details:", error);
    if (error.data) {
      console.error("Error data:", error.data);
    }
    throw error;
  }

  // Try to get the randomnessId
  let randomnessId;
  try {
    console.log("Calling getRandomNumber() function...");
    randomnessId = await randomNumberGenerator.randomnessId();
    console.log("Randomness ID:", randomnessId);
  } catch (error: any) {
    console.log("Failed to call getRandomNumber() function");
    console.error("Error details:", error);
  }

  // Wait for the randomness delay (3 seconds in the contract) - RandomnessNumberGenerator.sol:56 
  console.log("Waiting for the randomness delay (3 seconds in the contract) - RandomnessNumberGenerator.sol:56");
  await sleep(10000); 


  // Try to resolve the randomness
  try {

    // Get the randomness from Switchboard
    const crossbar = CrossbarClient.default();

    // Get the randomness from the specific Switchboard Oracle
    console.log("Resolving the randomness...");
    const { encoded } = await crossbar.resolveEVMRandomness({
      chainId: 1114, // Chain ID for Core Testnet 2.  Example: Testnet1 is (1115).
      randomnessId //  ID from your Solidity contract
    });

    // Print the randomness oracle response
    console.log("Randomness oracle response:", encoded);

    // Call the resolve function
    console.log("Calling resolveRandomness() function...");
    const resolvedRandomnessTx = await randomNumberGenerator.resolve([encoded]);

    // Wait for the transaction to be confirmed
    console.log("Waiting for the transaction to be confirmed...");
    await resolvedRandomnessTx.wait();
    console.log("Transaction confirmed!");

    // Get the randomness from the contract
    const resolvedRandomness = await randomNumberGenerator.getRandomNumber();
    console.log("Resolved randomness:", resolvedRandomness);
  } catch (error: any) {
    console.log("Failed to call resolveRandomness() function");
    console.error("Error details:", error);
  }

}

// Run the main function
CallRandom()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
