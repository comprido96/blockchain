import { ethers, } from "hardhat"
import { CompriWETH } from "../typechain-types";
import { expect } from "chai";

describe("CompriWETH", async () => {
    let weth: CompriWETH;
    let accounts: any[];
    let owner: any;
    let addr1: any;
    let addr2: any;

    before(async () => {
        accounts = await ethers.getSigners();
    })

    beforeEach(async () => {
        const WETH = await ethers.getContractFactory("CompriWETH");
        weth = await WETH.deploy();
        owner = accounts[0];
        addr1 = accounts[1];
        addr2 = accounts[2];
    })

    it("Should mint correctly", async () => {
        await weth.mint({ value: 30 });
        expect(await weth.totalSupply()).to.eq(30);
    });

    it("Should burn correctly", async () => {
        await weth.connect(addr1).mint({ value: 20 });
        expect(await weth.totalSupply()).to.eq(20);

        await (weth.connect(addr1).burn(5));
        expect(await weth.totalSupply()).to.eq(15);
    });



})