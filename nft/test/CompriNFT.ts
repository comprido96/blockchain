import { ethers, } from "hardhat";
import { CompriNFT } from "../typechain-types";
import { expect } from "chai";

describe("CompriNFT", async () => {
    let nft: CompriNFT;
    let owner: any;
    let addr1: any;
    let addr2: any;

    before(async () => {
        [owner, addr1, addr2] = await ethers.getSigners();
    })

    beforeEach(async () => {
        const NFT = await ethers.getContractFactory("CompriNFT");
        nft = await NFT.deploy();
        await nft.deployed();
    })

    // You can nest describe calls to create subsections.
    describe("mint", function () {
        it("Should emit correct tokenId", async function () {
            await expect(nft.mintNFT(addr1.address, "url"))
                .to.emit(nft, "Minted");
        });
    });

});