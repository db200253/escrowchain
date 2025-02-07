const { expect } = require("chai");
const { ethers } = require("hardhat");
const {any} = require("hardhat/internal/core/params/argumentTypes");

describe("EscrowFactory Contract", function () {
    let escrowFactory;
    let seller;
    let buyer;
    let value;
    let Escrow;

    beforeEach(async function () {
        seller = await ethers.getSigner("0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
        buyer = await ethers.getSigner("0x14dC79964da2C08b23698B3D3cc7Ca32193d9955");

        value = ethers.parseEther("1"); // 1 ETH

        const EscrowFactory = await ethers.getContractFactory("EscrowFactory");
        escrowFactory = await EscrowFactory.deploy();

        Escrow = await ethers.getContractFactory("Escrow");
    });

    describe("Escrow creation", function () {
        it("should create an escrow contract", async function () {
            await expect(
                escrowFactory.createEscrow(seller.address, buyer.address, value)
            )
                .to.emit(escrowFactory, "EscrowCreated");

            const escrows = await escrowFactory.getEscrows();
            expect(escrows.length).to.equal(1);

            const escrowAddress = escrows[0];
            const escrow = await Escrow.attach(escrowAddress);

            expect(await escrow.getSeller()).to.equal(seller.address);
            expect(await escrow.getBuyer()).to.equal(buyer.address);
            expect(await escrow.getValue()).to.equal(value);
        });

        it("should store created escrows for the user", async function () {
            await escrowFactory.createEscrow(seller.address, buyer.address, value);

            const sellerEscrows = await escrowFactory.getUserEscrows(seller.address);
            const buyerEscrows = await escrowFactory.getUserEscrows(buyer.address);

            expect(sellerEscrows.length).to.equal(1);
            expect(buyerEscrows.length).to.equal(1);

            const sellerEscrowAddress = sellerEscrows[0];
            const buyerEscrowAddress = buyerEscrows[0];

            expect(sellerEscrowAddress).to.equal(buyerEscrowAddress);
        });

        it("should handle multiple escrows for the same user", async function () {
            await escrowFactory.createEscrow(seller.address, buyer.address, value);
            await escrowFactory.createEscrow(seller.address, buyer.address, value);

            const sellerEscrows = await escrowFactory.getUserEscrows(seller.address);

            expect(sellerEscrows.length).to.equal(2);
        });
    });

    describe("Getting escrows", function () {
        it("should return all escrows", async function () {
            // Create some escrows
            await escrowFactory.createEscrow(seller.address, buyer.address, value);
            await escrowFactory.createEscrow(seller.address, buyer.address, value);

            const escrows = await escrowFactory.getEscrows();
            expect(escrows.length).to.equal(2); // Two escrows should exist
        });

        it("should return user specific escrows", async function () {
            await escrowFactory.createEscrow(seller.address, buyer.address, value);
            await escrowFactory.createEscrow(seller.address, buyer.address, value);

            const buyerEscrows = await escrowFactory.getUserEscrows(buyer.address);
            expect(buyerEscrows.length).to.equal(2);
        });
    });
});
