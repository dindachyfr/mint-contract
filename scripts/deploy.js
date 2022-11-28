
const hre = require("hardhat");

async function main() {

  const DNFT = await hre.ethers.getContractFactory("MyToken");
  const dNFT = await DNFT.deploy();

  await dNFT.deployed();

  console.log("Smart Contract has been deployed to:", dNFT.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
