import { ethers, } from "hardhat";
import { CompriCollection } from "../typechain-types";
import { expect } from "chai";

describe("CompriCollection", async () => {
    let cc: CompriCollection;
    let owner: any;
    let addr1: any;
    let addr2: any;

    before(async () => {
        [owner, addr1, addr2] = await ethers.getSigners();
    })

    beforeEach(async () => {
        const CC = await ethers.getContractFactory("CompriCollection");
        cc = await CC.deploy();
        await cc.deployed();
    })

    // You can nest describe calls to create subsections.
    describe("mint", function () {
        it("Should implement onlyOwner", async function () {
            await expect(cc.connect(addr1).mint(addr2.address, 1, 12))
                .to.be.reverted;
        });

        it("Should emit Minted", async function () {
            await expect(cc.mint(addr1.address, 1, 12))
                .to.emit(cc, "Minted");
        });
    });

    describe("mint batch", function () {
        it("Should implement onlyOwner", async function () {
            await expect(cc.connect(addr1).mintBatch(addr2.address, [1, 3], [10, 12]))
                .to.be.reverted;
        });

        it("Should emit MintedBatch", async function () {
            await expect(cc.mintBatch(addr1.address, [1, 3], [10, 12]))
                .to.emit(cc, "MintedBatch");
        });
    });

    describe("burn", function () {
        it("Should execute correctly", async function () {
            await cc.mint(owner.address, 0, 2);
            await expect(cc.burn(0, 1)).to.emit(cc, "Burned");
        });
    });

    describe("burnedBatch", function () {
        it("Should emit BurnedBatch", async function () {
            await cc.mintBatch(addr1.address, [1, 3], [10, 12]);
            await expect(cc.connect(addr1).burnBatch([1, 3], [2, 5])).to.emit(cc, "BurnedBatch");
        });
    });

    describe("setURI", function () {
        it("Should implement onlyOwner", async function () {
            await expect(cc.connect(addr1).setURI(1, "url"))
                .to.be.reverted;
        });

        it("Should emit setURI", async function () {
            await expect(cc.setURI(1, "url"))
                .to.emit(cc, "URI");
        });
    });

    describe("uri", function () {
        it("Should execute correctly", async function () {
            await cc.mint(addr1.address, 1, 12);
            await cc.uri(1);
        });
    });



});