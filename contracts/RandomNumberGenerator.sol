// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ISwitchboard} from "@switchboard-xyz/on-demand-solidity/ISwitchboard.sol";
import {Structs} from "@switchboard-xyz/on-demand-solidity/structs/Structs.sol";
import "hardhat/console.sol";

// Contract to request and resolve randomness from the Switchboard oracle
contract RandomNumberGenerator {
    // Address of the Switchboard contract
    address private immutable _switchboard;
    
    // Random number to receive from Switchboard randomness
    uint256 public randomNumber;
    
    // Reference to the Switchboard contract interface
    ISwitchboard switchboard;
    
    // Queue IDs for mainnet and testnet (pre-configured)
    bytes32 constant MAINNET_QUEUE = 0x86807068432f186a147cf0b13a30067d386204ea9d6c8b04743ac2ef010b0752;
    bytes32 constant TESTNET_QUEUE = 0xd9cd6a04191d6cd559a5276e69a79cc6f95555deeae498c3a2f8b3ee670287d1;

    // Choose chain-appropriate queue
    bytes32 public queue;
    
    // Unique identifier for each randomness request
    bytes32 public randomnessId;

    // Constructor to initialize the contract with the Switchboard address and select the network
    //0x2f833D73bA1086F3E5CDE9e9a695783984636A76 - core testnet
    constructor(address switchboardAddress, bool isMainnet) {
        _switchboard = switchboardAddress;
        switchboard = ISwitchboard(switchboardAddress);

        // Setup the chain selection for mainnet or testnet
        if(isMainnet) {
            queue = MAINNET_QUEUE;
        } else {
            queue = TESTNET_QUEUE;
        }
    }

    // Function to request randomness
    function roll() external {
        // Make the randomnessId unique for each request (based on sender and timestamp)
        randomnessId = keccak256(abi.encodePacked(msg.sender, block.timestamp));
        
        // Invoke the on-demand contract to request randomness
        switchboard.requestRandomness(
            randomnessId,        // Randomness ID (bytes32): Unique ID for the request
            address(this),       // Authority (address): The contract requesting randomness
            queue,               // Queue ID (bytes32): Chain selection for requesting randomness
            30                   // MinSettlementDelay (uint16): Minimum seconds to settle the request
        );
    }

    // Function to resolve randomness after the request is settled
    function resolve(bytes[] calldata switchboardUpdateFeeds) external {
        // Invoke the updateFeeds function from the Switchboard interface
        switchboard.updateFeeds(switchboardUpdateFeeds);

        // Get the randomness result from Switchboard
        Structs.RandomnessResult memory randomness = switchboard.getRandomness(randomnessId).result;

        // Ensure that the randomness has been settled
        require(randomness.settledAt != 0, "Randomness failed to settle");

        // Store the resolved randomness value
        randomNumber = randomness.value;
    }

    function getrandomNumber() public returns (uint256){
        Structs.RandomnessResult memory randomness = switchboard.getRandomness(randomnessId).result;

        // Ensure that the randomness has been settled
        require(randomness.settledAt != 0, "Randomness failed to settle");

        // Store the resolved randomness value
        randomNumber = randomness.value;
        console.log("randomness.value",randomness.value);

        return randomNumber;
    }
}
