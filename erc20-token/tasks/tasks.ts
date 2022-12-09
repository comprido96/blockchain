import { task } from "hardhat/config";

task("approve", "approve task").addParam("contract", "contract's address").addParam("spender", "spender's account")
    .addParam("value", "the amount allowed to be spent")
    .setAction(async (taskArgs, hre) => {

        const contract = await hre.ethers.getContractAt("TY", taskArgs.contract.address);
        await contract.approve(taskArgs.spender.address, taskArgs.value);
    });

task("mint", "mint task").addParam("contract", "contract's address").addParam("receiver", "receiver's account")
    .addParam("value", "the amount minted to the receiver").setAction(async (taskArgs, hre) => {
        const contract = await hre.ethers.getContractAt("TY", taskArgs.contract.address);
        await contract.mint(taskArgs.receiver.address, taskArgs.value);
    });

task("transfer", "transfer task").addParam("contract", "contract's address").addParam("receiver", "receiver's account")
    .addParam("value", "the amount sent to the receiver").setAction(async (taskArgs, hre) => {
        const contract = await hre.ethers.getContractAt("TY", taskArgs.contract.address);
        await contract.transfer(taskArgs.receiver.address, taskArgs.value);
    });

task("transferFrom", "transferFrom task").addParam("contract", "contfact's address").addParam("spender", "spender's account")
    .addParam("receiver", "receiver's account").addParam("value", "the amount sent to the receiver")
    .setAction(async (taskArgs, hre) => {
        const contract = await hre.ethers.getContractAt("TY", taskArgs.contract.address);
        await contract.transferFrom(taskArgs.spender.address, taskArgs.receiver.address, taskArgs.value);
    });

