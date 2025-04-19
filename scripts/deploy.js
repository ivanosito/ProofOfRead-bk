// scripts/deploy.js

const hre = require("hardhat");

async function main() {
  // Get the contract factory
  const ImmutableWork = await hre.ethers.getContractFactory("ImmutableWork");

  // Deploy the contract
  const immutableWork = await ImmutableWork.deploy();

  // Wait for deployment
  await immutableWork.deployed();

  console.log(`✅ ImmutableWork deployed to: ${immutableWork.address}`);
}

// Run the deployment script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
