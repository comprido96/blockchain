import { ethers } from "hardhat";

async function main() {

    const Staking = await ethers.getContractFactory("Staking");
    console.log('Deploying Staking...');
    const st = await Staking.deploy("0xc49975638db966B4f1eFE8eCe655fAE008D92DDf", "0xa74E8eecd618D06a33f92d37a78f0a6aC75857a9",
        7, ethers.utils.parseEther("0.01"));

    await st.deployed();
    console.log("Staking deployed to:", st.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });