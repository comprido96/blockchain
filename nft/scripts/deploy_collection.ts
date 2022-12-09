import { ethers } from "hardhat";

async function main() {

    const CompriCollection = await ethers.getContractFactory("CompriCollection");
    console.log('Deploying CompriCollection...');
    const collection = await CompriCollection.deploy();

    await collection.deployed();
    console.log("CompriCollection deployed to:", collection.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });