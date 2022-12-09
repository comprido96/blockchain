import { ethers } from "hardhat";

async function main() {

  const CompriNFT = await ethers.getContractFactory("CompriNFT");
  console.log('Deploying CompriNFT...');
  const nft = await CompriNFT.deploy();

  await nft.deployed();
  console.log("CompriNFT deployed to:", nft.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });