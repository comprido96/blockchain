import { ethers } from "hardhat";

async function main() {

    const Token = await ethers.getContractFactory("MockERC20");
    console.log('Deploying MockERC20...');
    const token = await Token.deploy();

    await token.deployed();
    console.log("CompriNFT deployed to:", token.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });