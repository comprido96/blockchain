import { ethers } from "hardhat";
import 'dotenv/config';

let quorum = 0;

async function main() {
  const Wallet = await ethers.getContractFactory("CompriWallet");
  const wallet = await Wallet.deploy([], quorum);

  await wallet.deployed();
  console.log("CompriWallet deployed to:", wallet.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });