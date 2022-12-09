import { task } from "hardhat/config";

task("mint_nft", "mint nft task").addParam("contract", "contract's address").addParam("receiver", "receiver's account")
    .addParam("ipfs", "ipfs url").setAction(async (taskArgs, hre) => {
        const contract = await hre.ethers.getContractAt("CompriNFT", taskArgs.contract);
        await contract.mintNFT(taskArgs.receiver, taskArgs.ipfs);
    });

task("mint_collection", "mint collection task").addParam("contract", "contract's address")
    .addParam("receiver", "receiver's account").addParam("id", "token id").addParam("amount", "token amount")
    .addParam("uri", "ipfs uri").setAction(async (taskArgs, hre) => {
        const contract = await hre.ethers.getContractAt("CompriCollection", taskArgs.contract);
        await contract.mint(taskArgs.receiver, taskArgs.id, taskArgs.amount);
        await contract.setURI(taskArgs.id, taskArgs.uri);
    });