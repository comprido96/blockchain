import { ethers } from "hardhat";
import { readFile } from "fs/promises";
import { providers } from "";
import Web3 from 'web3';
import * as dotenv from "dotenv";



async function main() {
    const BSCBridgeABI = await readFile("../contract_abi/BSCBridge.json");
    const bscBridge = JSON.parse(BSCBridgeABI.toString());

    const ETHBridgeABI = await readFile("../contract_abi/ETHBridge.json");
    const ethBridge = JSON.parse(ETHBridgeABI.toString());

    const eth_network = new ethers.providers.JsonRpcProvider("https://eth-goerli.public.blastapi.io");
    const bsc_network = new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545/");

    let validator_private: any = process.env.VALIDATOR_PRIVATE;
    const actor_eth = new ethers.Wallet(validator_private, eth_network);
    const actor_bsc = new ethers.Wallet(validator_private, bsc_network)

    // Deployed contract addresses
    const ethAddress = "0xe";
    const bscAdress = "0xe";
    const EthAddress = "0xe";
    const BscAddress = "0xe";

    let eth = new ethers.Contract(ethAddress, ethBridge, eth_network);
    let bsc = new ethers.Contract(bscAdress, bscBridge, bsc_network);
    let Eth = new ethers.Contract(EthAddress, ethBridge, actor_eth)
    let Bsc = new ethers.Contract(BscAddress, bscBridge, actor_eth)

    eth.on("SwapInitialised", async (from: any, to: any, amount: any, chainTo: any, chainFrom: any, nonce: any) => {
        const swapHash = ethers.utils.solidityKeccak256(
            ["uint256", "address", "uint256", "uint256"],
            [amount, to, chainFrom, nonce]
        );

        const hashArray = ethers.utils.arrayify(swapHash);
        const signedMessage = await from.signMessage(hashArray);
        const signature = ethers.utils.splitSignature(signedMessage);

        await bscBridge.connect(actor_eth).redeem(
            to.address,
            amount,
            signature.v,
            signature.r,
            signature.s,
            chainFrom,
            nonce);
    });

