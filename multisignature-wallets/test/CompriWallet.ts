import { ethers, } from "hardhat"
import { CompriWallet } from "../typechain-types";
import { expect } from "chai";
var Web3 = require('web3');
var web3 = new Web3('http://localhost:8545/%27');

describe("CompriWallet", async () => {
    let cw: CompriWallet;
    let accounts: any[];
    let addr0: any;
    let addr1: any;
    let addr2: any;

    before(async () => {
        accounts = await ethers.getSigners();
    })

    beforeEach(async () => {
        const quorum = 1;
        const CW = await ethers.getContractFactory("CompriWallet");
        cw = await CW.deploy([accounts[0].address, accounts[1].address], quorum);
        addr0 = accounts[0];
        addr1 = accounts[1];
        addr2 = accounts[2];
    })

    it("propose test", async () => {
        let ABI = [
            "function transfer(address to, uint amount)"
        ];
        let iface = new ethers.utils.Interface(ABI);
        const call = iface.encodeFunctionData("transfer", [addr2.address, ethers.utils.parseEther("0.01")]);

        expect(await cw.propose(addr2.address, call)).to.emit(cw, "ProposedTransaction");
    });

    it("only owner should call propose test", async () => {
        let ABI = [
            "function transfer(address to, uint amount)"
        ];
        let iface = new ethers.utils.Interface(ABI);
        const call = iface.encodeFunctionData("transfer", [addr2.address, ethers.utils.parseEther("0.01")]);

        await expect(cw.connect(addr2).propose(addr2.address, call)).to.be.reverted;
    });

    it("confirm test", async () => {
        let ABI = [
            "function transfer(address to, uint amount)"
        ];
        let iface = new ethers.utils.Interface(ABI);
        const call = iface.encodeFunctionData("transfer", [addr2.address, ethers.utils.parseEther("0.01")]);

        await cw.propose(addr2.address, call);

        expect(await cw.confirm(1)).to.emit(cw, "ConfirmedTransaction");

    });

    it("only owner should call confirm test", async () => {
        let ABI = [
            "function transfer(address to, uint amount)"
        ];
        let iface = new ethers.utils.Interface(ABI);
        const call = iface.encodeFunctionData("transfer", [addr2.address, ethers.utils.parseEther("0.01")]);

        await cw.propose(addr2.address, call);

        await expect(cw.connect(addr2).confirm(0)).to.be.reverted;
    });

    it("only existing transactions should be confirmed", async () => {
        let ABI = [
            "function transfer(address to, uint amount)"
        ];
        let iface = new ethers.utils.Interface(ABI);
        const call = iface.encodeFunctionData("transfer", [addr2.address, ethers.utils.parseEther("0.01")]);

        await cw.propose(addr2.address, call);

        await expect(cw.confirm(2)).to.be.reverted;
    });

    it("execute test", async () => {
        let ABI = [
            "function transfer(address to, uint amount)"
        ];
        let iface = new ethers.utils.Interface(ABI);
        const call = iface.encodeFunctionData("transfer", [addr2.address, ethers.utils.parseEther("1")]);

        await cw.propose(addr2.address, call);

        await cw.confirm(1);

        expect(await cw.execute(1)).to.emit(cw, "ExecutedTransaction");
    });

    it("only owner can call execute test", async () => {
        let ABI = [
            "function transfer(address to, uint amount)"
        ];
        let iface = new ethers.utils.Interface(ABI);
        const call = iface.encodeFunctionData("transfer", [addr2.address, ethers.utils.parseEther("1")]);

        await cw.propose(addr2.address, call);

        await cw.confirm(1);

        await expect(cw.connect(addr2).execute(1)).to.be.reverted;
    });

    it("only existing transactions should be executed test", async () => {
        let ABI = [
            "function transfer(address to, uint amount)"
        ];
        let iface = new ethers.utils.Interface(ABI);
        const call = iface.encodeFunctionData("transfer", [addr2.address, ethers.utils.parseEther("1")]);

        await cw.propose(addr2.address, call);

        await cw.confirm(1);

        await expect(cw.execute(2)).to.be.reverted;
    });


    it("already confirmed transactions cannot be confirmed test", async () => {
        let ABI = [
            "function transfer(address to, uint amount)"
        ];
        let iface = new ethers.utils.Interface(ABI);
        const call = iface.encodeFunctionData("transfer", [addr2.address, ethers.utils.parseEther("1")]);

        await cw.propose(addr2.address, call);

        await cw.confirm(1);

        await expect(cw.confirm(1)).to.be.reverted;
    });

    it("already executed transactions cannot be confirmed test", async () => {
        let ABI = [
            "function transfer(address to, uint amount)"
        ];
        let iface = new ethers.utils.Interface(ABI);
        const call = iface.encodeFunctionData("transfer", [addr2.address, ethers.utils.parseEther("1")]);

        await cw.propose(addr2.address, call);

        await cw.confirm(1);

        await cw.execute(1);

        await expect(cw.confirm(1)).to.be.reverted;
    });

    it("already executed transactions cannot be executed test", async () => {
        let ABI = [
            "function transfer(address to, uint amount)"
        ];
        let iface = new ethers.utils.Interface(ABI);
        const call = iface.encodeFunctionData("transfer", [addr2.address, ethers.utils.parseEther("1")]);

        await cw.propose(addr2.address, call);

        await cw.confirm(1);

        await cw.execute(1);

        await expect(cw.execute(1)).to.be.reverted;
    });

    it("Only contract can call updateOwner", async () => {
        await expect(cw.updateOwner(addr2.address, true)).to.be.reverted;
    });

    it("updateOwner test", async () => {

        await addr0.sendTransaction({
            to: cw.address,
            value: ethers.utils.parseEther("1.0"),
        });

        let ABI = [
            "function updateOwner(address _owner, bool _isAdded)"
        ];
        let iface = new ethers.utils.Interface(ABI);
        const call = iface.encodeFunctionData("updateOwner", [addr2.address, true]);

        await cw.propose(cw.address, call);

        await cw.confirm(1);

        await cw.execute(1);

        expect(await cw.isOwner(addr2.address)).to.be.true;
    });

    it("Only contract can call changeQuorum", async () => {
        await expect(cw.changeQuorum(3)).to.be.reverted;
    });

    it("changeQuorum test", async () => {

        await addr0.sendTransaction({
            to: cw.address,
            value: ethers.utils.parseEther("1.0"),
        });

        let ABI = [
            "function changeQuorum(uint _newQuorum)"
        ];
        let iface = new ethers.utils.Interface(ABI);
        const call = iface.encodeFunctionData("changeQuorum", [3]);


        await cw.propose(cw.address, call);

        await cw.confirm(1);

        await cw.execute(1);

        expect(await cw.quorum()).to.eq(3);
    });


})