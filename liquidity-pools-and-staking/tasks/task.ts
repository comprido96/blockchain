import { task } from "hardhat/config";

task("stake", "stake task").addParam("contract", "contract's address").addParam("amount", "staking amount")
    .setAction(async (taskArgs, hre) => {
        const contract = await hre.ethers.getContractAt("Staking", taskArgs.contract);
        await contract.stake(taskArgs.amount);
    });

task("unstake", "unstake task")
    .addParam("contract", "contract's address").setAction(async (taskArgs, hre) => {
        const contract = await hre.ethers.getContractAt("Staking", taskArgs.contract);
        await contract.unstake();
    });

task("claim", "claim task")
    .addParam("contract", "contract's address").setAction(async (taskArgs, hre) => {
        const contract = await hre.ethers.getContractAt("Staking", taskArgs.contract);
        await contract.claim();
    });