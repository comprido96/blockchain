import { ethers, } from "hardhat"
import { Donation } from "../typechain-types";
import { expect } from "chai";

describe("Donation", async () => {
    let donation: Donation;
    let accounts: any[];

    before(async () => {
        accounts = await ethers.getSigners();
    })

    beforeEach(async () => {
        const Donation = await ethers.getContractFactory("Donation");
        donation = await Donation.deploy();
    })

    it("Should donate correctly", async () => {
        await donation.connect(accounts[1]).donate({ value: ethers.utils.parseEther("1.0") });
        // check that amount was added in a mapping
        expect(await donation.amounts(accounts[1].address)).to.equal(ethers.utils.parseEther("1.0"));

        await expect(donation.connect(accounts[1]).donate({ value: ethers.utils.parseEther("0.0") })).to.be.revertedWith("you have to provide some eth");
    })

    it("Should keep track of donors", async () => {
        await donation.connect(accounts[2]).donate({ value: ethers.utils.parseEther("1.0") });

        let result = await donation.getDonors();
        console.log("Retrieved address %s from donors", result[0]);

        expect(await accounts[2].address).to.equal(result[0]);
    })

    it("Should release funds correctly", async () => {
        await donation.connect(accounts[2]).donate({ value: ethers.utils.parseEther("1.0") });

        await expect(donation.connect(accounts[1]).releaseFunds(accounts[2].address, ethers.utils.parseEther("1.0"))).to.be.revertedWith("only owner can release funds");
    })

    it("Donors list should add donor only if it donates for the first time", async () => {
        await donation.connect(accounts[1]).donate({ value: ethers.utils.parseEther("1.0") });
        const totDonors = await (await donation.getDonors()).length;

        await donation.connect(accounts[1]).donate({ value: ethers.utils.parseEther("1.0") });
        const totDonors2 = await (await donation.getDonors()).length;

        expect(totDonors == totDonors2);
    })

    it("Should release only if sufficient funds are available", async () => {
        await donation.connect(accounts[1]).donate({ value: ethers.utils.parseEther("0.5") });
        await expect(donation.releaseFunds(accounts[1].address, ethers.utils.parseEther("1.0"))).to.be.revertedWith("insufficient funds");
    })

    it("new", async () => {
        await donation.connect(accounts[2]).donate({ value: ethers.utils.parseEther("1.0") });

        const balanceBefore = await accounts[2].getBalance()

        await donation.releaseFunds(accounts[2].address, ethers.utils.parseEther("0.5"));

        const balanceAfter = await accounts[2].getBalance()

        expect(balanceAfter).to.be.equal(balanceBefore.add(ethers.utils.parseEther("0.5")));
    })
})