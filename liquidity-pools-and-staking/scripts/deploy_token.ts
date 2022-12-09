import { ethers } from "hardhat";

async function main() {

    const CT = await ethers.getContractFactory("CompriToken");
    console.log('Deploying CompriToken...');
    const ct = await CT.deploy();

    await ct.deployed();
    console.log("CompriToken deployed to:", ct.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });