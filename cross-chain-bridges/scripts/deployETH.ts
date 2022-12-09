import { ethers } from "hardhat";

async function main() {
    const ETHToken = await ethers.getContractFactory("ETHToken");
    const ethToken = await ETHToken.deploy();

    await ethToken.deployed();

    console.log(`ETHToken deployed to ${ethToken.address}`);

    const actor = process.env.ACTOR_ETH;
    const ETHBridge = await ethers.getContractFactory("ETHBridge");
    const ethBridge = await ETHBridge.deploy(actor), '0xe');

    await ethBridge.deployed();

    console.log(`ETHBridge deployed to ${ethBridge.address}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});