import { ethers } from "hardhat";

async function main() {

    const WETH = await ethers.getContractFactory("CompriWETH");
    console.log('Deploying CompriWETH...');
    const weth = await WETH.deploy();

    await weth.deployed();
    console.log("CompriWETH deployed to:", weth.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });