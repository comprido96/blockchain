
import { ethers } from "hardhat";

async function main() {

    const TYToken = await ethers.getContractFactory("TY");
    console.log('Deploying TYToken...');
    const token = await TYToken.deploy('1000000');

    await token.deployed();
    console.log("TYToken deployed to:", token.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });