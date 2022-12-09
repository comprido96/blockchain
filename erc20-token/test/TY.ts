import { ethers, } from "hardhat";
import { TY } from "../typechain-types";
import { expect } from "chai";

describe("TY", async () => {
    let token: TY;
    let owner: any;
    let addr1: any;
    let addr2: any;

    before(async () => {
        [owner, addr1, addr2] = await ethers.getSigners();
    })

    beforeEach(async () => {
        const TYToken = await ethers.getContractFactory("TY");
        let totalSupply = 1000;
        token = await TYToken.deploy(totalSupply);
        await token.deployed();
    })

    // You can nest describe calls to create subsections.
    describe("Deployment", function () {
        it("Should assign the total supply of tokens to the owner", async function () {
            const ownerBalance = await token.balanceOf(owner.address);
            expect(await token.totalSupply()).to.be.eq(ownerBalance);

            expect(await token.isMinter(owner.address)).to.be.true;

            expect(await token.deployed()).to.emit(token, "Transfer");

            expect(await token.name()).to.equal("Ten Yaksha");

            expect(await token.symbol()).to.equal("TY");

            expect(await token.standard()).to.equal("Ten Yaksha v1.0");

            expect(await token.decimals()).to.equal(4);
        });
    });



    describe("Transfer", function () {

        it("Should transfer tokens between accounts", async function () {
            // Transfer 50 tokens from owner to addr1
            await token.transfer(addr1.address, 50);

            const addr1Balance = await token.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(50);

            // Transfer 50 tokens from addr1 to addr2
            // We use .connect(signer) to send a transaction from another account
            await token.connect(addr1).transfer(addr2.address, 50);
            const addr2Balance = await token.balanceOf(addr2.address);
            expect(addr2Balance).to.equal(50);
        });

        it("should revert if receiver is zero address", async function () {
            expect(token.transfer(ethers.constants.AddressZero, 200)).to.be.revertedWith("transfer to the zero address");
        });

        it("Should fail if sender doesn’t have enough tokens", async function () {
            const initialOwnerBalance = await token.balanceOf(owner.address);

            // Try to send 1 token from addr1 (0 tokens) to owner (1000000 tokens).
            // `require` will evaluate false and revert the transaction.
            await expect(
                token.connect(addr1).transfer(owner.address, 1)
            ).to.be.revertedWith("reverted for insufficient funds");

            // Owner balance shouldn't have changed.
            expect(await token.balanceOf(owner.address)).to.equal(
                initialOwnerBalance
            );
        });

        it("Should update balances after transfers", async function () {
            const initialOwnerBalance = await token.balanceOf(owner.address);

            // Transfer 100 tokens from owner to addr1.
            await token.transfer(addr1.address, 100);

            // Transfer another 50 tokens from owner to addr2.
            await token.transfer(addr2.address, 50);

            // Check balances.
            const finalOwnerBalance = await token.balanceOf(owner.address);
            expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(150));

            const addr1Balance = await token.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(100);

            const addr2Balance = await token.balanceOf(addr2.address);
            expect(addr2Balance).to.equal(50);
        });

        it("should emit Transfer event", async function () {
            // Transfer 100 tokens from owner to addr1.
            const tx = await token.transfer(addr1.address, 100);

            expect(tx).to.emit(token, "Transfer");
        });
    });


    describe("Approval", function () {
        it("it should sets the correct allowance value", async function () {
            let allowedValue = 100;
            await token.approve(addr1.address, allowedValue);

            expect(await token.allowance(owner.address, addr1.address)).to.equal(allowedValue);
        });

        it("it should emit an Approval event", async function () {
            // Transfer 100 tokens from owner to addr1.
            const tx = await token.approve(addr1.address, 100);

            expect(tx).to.emit(token, "Approval");
        });
    });

    describe("Transfer from", function () {
        it("should revert if value greater than sender's balance", async function () {
            expect(token.connect(addr1).transferFrom(owner.address, addr2.address, 1001))
                .to.be.revertedWith("reverted for insufficient funds");
        });

        it("should revert if value greater than allowance", async function () {
            await token.approve(addr1.address, 100);
            expect(token.connect(addr1.address).transferFrom(owner.address, addr2.address, 101))
                .to.be.revertedWith("value is greater than allowance");
        });

        it("should update balances of spender and receiver and decrease spender value in owner's allowance", async function () {
            const toSpendOnBehalf = 200;
            const ownerInitialBalance = await token.balanceOf(owner.address);
            const receiverInitialBalance = await token.balanceOf(addr2.address);

            await token.approve(addr1.address, toSpendOnBehalf);
            const ownerAddr1ALlowance = await token.allowance(owner.address, addr1.address);

            await expect(token.connect(addr1).transferFrom(owner.address, addr2.address, toSpendOnBehalf))
                .to.emit(token, "Transfer");

            expect(await token.balanceOf(owner.address)).to.equal(ownerInitialBalance.toNumber() - toSpendOnBehalf);
            expect(await token.balanceOf(addr2.address)).to.equal(receiverInitialBalance.toNumber() + toSpendOnBehalf);
            expect(await token.allowance(owner.address, addr1.address)).to.be.equal(ownerAddr1ALlowance.toNumber() - toSpendOnBehalf);
        });
    });

    describe("Mint", function () {

        it("should be called only by minters", async function () {
            await token.transfer(addr1.address, 200);

            expect(token.connect(addr1).mint(addr2.address, 100)).to.be.revertedWith("only minters can mint");
        });

        it("can't mint to address(0)", async function () {
            expect(token.mint(ethers.constants.AddressZero, 200)).to.be.revertedWith("mint to the zero address");
        });

        it("should increase total supply and receiver's balance", async function () {
            const initialSupply = await token.totalSupply();
            const initialBalance = await token.balanceOf(addr1.address);

            await token.mint(addr1.address, 200);

            expect(await token.totalSupply()).to.equal(initialSupply.toNumber() + 200);

            expect(await token.balanceOf(addr1.address)).to.equal(initialBalance.toNumber() + 200);
        });


        it("should emit Transfer event", async function () {
            expect(await token.mint(addr2.address, 100)).to.emit(token, "Transfer");
        });

        it("should add minters correctly", async function () {
            expect(await token.addMinter(addr1.address)).to.emit(token, "AddedMinter")
                .then(function () {
                    expect(token.connect(addr1).mint(addr2.address, 200)).to.be.fulfilled;
                });
        });

        it("only owner can add or remove minters", async function () {
            expect(token.connect(addr1).addMinter(addr2.address)).to.be.revertedWith("only owner method");
            expect(token.connect(addr1).removeMinter(addr2.address)).to.be.revertedWith("only owner method");
        });


        it("removeMinter should return event", async function () {
            await token.addMinter(addr1.address);
            expect(await token.removeMinter(addr1.address)).to.emit(token, "RemovedMinter");
        });

        it("should remove minters correctly", async function () {
            await token.addMinter(addr1.address);
            await token.connect(addr1).mint(addr2.address, 200);
            await token.removeMinter(addr1.address);

            expect(token.connect(addr1).mint(addr2.address, 200))
                .to.be.revertedWith("only minters can mint");
        });

    });

    describe("Burn", function () {
        it("can't burn from the zero address", async function () {
            expect(token.connect(ethers.constants.AddressZero).burn(200)).to.be.revertedWith("burn from the zero address");
        });

        it("should burn only if amount doesn't exceed balance", async function () {
            expect(token.burn(1001)).to.be.revertedWith("burn amount exceeds balance");
        });

        it("should decrease totalSupply and sender's balance", async function () {
            const initialSupply = (await token.totalSupply()).toNumber();
            const initialBalance = (await token.balanceOf(owner.address)).toNumber();
            const toBurn = 500;

            await token.burn(toBurn).then(
                async function () {
                    expect(await token.totalSupply()).to.be.equal(initialSupply - toBurn);
                })
                .then(async function () {
                    expect(await token.balanceOf(owner.address)).to.be.equal(initialBalance - toBurn);
                });

        });
    });

});
