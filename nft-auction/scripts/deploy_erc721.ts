import { ethers } from "hardhat";

async function main() {

    const NFT = await ethers.getContractFactory("MockERC721");
    console.log('Deploying MockERC721...');
    const nft = await NFT.deploy();

    await nft.deployed();
    console.log("MockERC721 deployed to:", nft.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });