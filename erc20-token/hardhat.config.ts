import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-web3";
import 'dotenv/config';

import "./tasks/tasks";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
};

export default config;

const API_URL = process.env.API_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
module.exports = {
  solidity: "0.8.9",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    sepolia: {
      url: API_URL,
      accounts: [`0x${PRIVATE_KEY}`],
    }
  }
};

