import { ethers, } from "hardhat"
import { Staking, CompriToken, CompriWETH } from "../typechain-types";
import { expect } from "chai";

describe("Staking", async () => {
    let st: Staking;
    let ct: CompriToken;
    let weth: CompriWETH;
    let accounts: any[];
    let owner: any;
    let addr1: any;

    before(async () => {
        accounts = await ethers.getSigners();
    })

    beforeEach(async () => {
        const Staking = await ethers.getContractFactory("Staking");
        const CompriToken = await ethers.getContractFactory("CompriToken");
        const CompriWETH = await ethers.getContractFactory("CompriWETH");
        const lockTimeInDays = 7;
        const interest = "0.01";

        ct = await CompriToken.deploy();
        console.log("Deployed CompriToken at ", ct.address);

        weth = await CompriWETH.deploy();
        console.log("Deployed CompriWETH at ", weth.address);

        st = await Staking.deploy(weth.address, ct.address, lockTimeInDays, ethers.utils.parseEther(interest), { gasLimit: 20000000 });
        console.log("Deployed Staking at ", st.address);

        ct.setBurner(st.address);
        console.log("Set %s as burner for CompriToken", st.address);

        ct.setMinter(st.address);
        console.log("Set %s as minter for CompriToken", st.address);

        owner = accounts[0];
        addr1 = accounts[1];
        addr2 = accounts[2];
    })

    /*
    lpToken.transferFrom(msg.sender, address(this), _amount);

    Stake storage s = stakes[msg.sender];
    s.amount += _amount;
    s.timestamp = block.timestamp;

    canUnstakeAt[msg.sender] = block.timestamp + lockTime;

    emit Staked(msg.sender, _amount, block.timestamp);
    */

    it("stake test", async function () {
        await weth.mint({ value: 50 });
        expect(await weth.balanceOf(owner.address)).to.eq(50);

        await weth.approve(st.address, 20);
        expect(await weth.allowance(owner.address, st.address)).to.eq(20);

        expect(await st.stake(20)).to.emit(st, "Staked");
    });

    it("claim test", async function () {
        await weth.mint({ value: 50 });

        await weth.approve(st.address, 20);

        await st.stake(20);

        ethers.provider.send("evm_increaseTime", [3600 * 24 * 4]);

        await expect(st.claim()).to.be.reverted;

        ethers.provider.send("evm_increaseTime", [3600 * 24 * 10]);

        expect(await st.claim()).to.emit(st, "Claimed");
    });

    it("unstake test", async function () {
        await weth.mint({ value: 50 });

        await weth.approve(st.address, 20);

        await st.stake(20);

        ethers.provider.send("evm_increaseTime", [3600 * 24 * 4]);

        await expect(st.unstake()).to.be.reverted;

        ethers.provider.send("evm_increaseTime", [3600 * 24 * 10]);

        expect(await st.unstake()).to.emit(st, "Unstaked");
    });

    it("checkStake test", async function () {
        let result = await st.checkStake(owner.address);

        expect(result[0]).to.eq(0);
        expect(result[1]).to.eq(0);
        expect(result[2]).to.eq(0);
    });

    it("setStakeParams test", async function () {
        await expect(st.connect(addr1).setStakeSParams(ethers.utils.parseEther("0.1"), 12)).to.be.reverted;

        expect(await st.setStakeSParams(ethers.utils.parseEther("0.1"), 12)).to.emit(st, "ChangedStakeParams");
    });
})