import { ethers } from "hardhat";

async function main() {

    const CompriAuction = await ethers.getContractFactory("CompriAuction");
    console.log('Deploying CompriAuction...');
    const auction = await CompriAuction.deploy();

    await auction.deployed();
    console.log("CompriAuction deployed to:", auction.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });