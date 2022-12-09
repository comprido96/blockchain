import { ethers, } from "hardhat"
import { CompriToken } from "../typechain-types";
import { expect } from "chai";

describe("CompriToken", async () => {
    let ct: CompriToken;
    let accounts: any[];
    let owner: any;
    let addr1: any;
    let addr2: any;

    before(async () => {
        accounts = await ethers.getSigners();
    })

    beforeEach(async () => {
        const CT = await ethers.getContractFactory("CompriToken");
        ct = await CT.deploy();
        owner = accounts[0];
        addr1 = accounts[1];
        addr2 = accounts[2];
    })

    it("Only owner can set minter", async () => {
        await expect(ct.connect(addr1).setMinter(addr2.address)).to.be.reverted;
    });

    it("Only minter can mint", async () => {
        await ct.setMinter(addr1.address);
        await expect(ct.connect(addr2).mint(addr2.address, 100)).to.be.reverted;
    });

    it("Should mint correctly", async () => {
        await ct.setMinter(addr1.address);
        await ct.connect(addr1).mint(addr2.address, 100);
        expect(await ct.totalSupply()).to.eq(100);
    });

    it("Only owner can set burner", async () => {
        await expect(ct.connect(addr1).setBurner(addr2.address)).to.be.reverted;
    });

    it("Only burner can burn", async () => {
        await ct.setBurner(addr1.address);
        await expect(ct.connect(addr2).burn(addr2.address, 100)).to.be.reverted;
    });

    it("Should burn correctly", async () => {
        await ct.setMinter(addr1.address);
        await ct.connect(addr1).mint(addr2.address, 100);
        expect(await ct.totalSupply()).to.eq(100);
        await ct.setBurner(addr1.address);
        await ct.connect(addr1).burn(addr2.address, 50)
        expect(await ct.totalSupply()).to.eq(50);
    });

})