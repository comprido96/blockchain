import { ethers } from "hardhat";

async function main() {
    const actor = process.env.ACTOR_BSC;

    const BSCToken = await ethers.getContractFactory("BSCToken");
    const bscToken = await BSCToken.deploy();

    await bscToken.deployed();

    const BSCBridge = await ethers.getContractFactory("BSCBridge");
    const bscBridge = await BSCBridge.deploy(actor, '0xe');

    await bscBridge.deployed();

    console.log(`BSCToken deployed to ${bscToken.address}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});