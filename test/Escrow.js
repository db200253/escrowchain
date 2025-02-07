const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Escrow Contract", function () {
    let escrow;
    let seller;
    let buyer;
    let value;

    beforeEach(async function () {
        seller = await ethers.getSigner("0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
        buyer = await ethers.getSigner("0x14dC79964da2C08b23698B3D3cc7Ca32193d9955");

        value = ethers.parseEther("1");

        const Escrow = await ethers.getContractFactory("Escrow");
        escrow = await Escrow.deploy(seller.address, buyer.address, value);
    });

    describe("Contract deployment", function () {
        it("should deploy with correct seller, buyer, and value", async function () {
            expect(await escrow.getSeller()).to.equal(seller.address);
            expect(await escrow.getBuyer()).to.equal(buyer.address);
            expect(await escrow.getValue()).to.equal(value);
        });
    });

    describe("Deposit funds", function () {
        it("should allow the buyer to deposit funds", async function () {
            await escrow.connect(buyer).depositFunds({ value: value });

            expect(await escrow.getFundsDeposited()).to.equal(true);
        });

        it("should not allow non-buyer to deposit funds", async function () {
            await expect(
                escrow.connect(seller).depositFunds({ value: value })
            ).to.be.revertedWith("Seul un acheteur peut effectuer cette action.");
        });

        it("should not allow the buyer to deposit funds twice", async function () {
            await escrow.connect(buyer).depositFunds({ value: value });

            await expect(
                escrow.connect(buyer).depositFunds({ value: value })
            ).to.be.revertedWith("Les fonds ont deja ete deposes.");
        });
    });

    describe("Status transitions", function () {
        it("should allow seller to move from Sent to Loading", async function () {
            await escrow.connect(buyer).depositFunds({ value: value });
            await escrow.connect(seller).setStatus(1);

            expect(await escrow.getStatus()).to.equal(1);
        });

        it("should not allow invalid status transition", async function () {
            await escrow.connect(buyer).depositFunds({ value: value });
            await escrow.connect(seller).setStatus(1);
            await escrow.connect(buyer).validateLoading();

            await expect(escrow.connect(buyer).setStatus(4)).to.be.revertedWith(
                "Transition de statut invalide."
            );
        });

        it("should allow buyer to move from Loading to Transport after validation", async function () {
            await escrow.connect(buyer).depositFunds({ value: value });
            await escrow.connect(seller).setStatus(1);
            await escrow.connect(buyer).validateLoading();

            expect(await escrow.getStatus()).to.equal(2);
        });

        it("should not allow buyer to validate loading when not in Loading status", async function () {
            await escrow.connect(buyer).depositFunds({ value: value });

            await expect(escrow.connect(buyer).validateLoading()).to.be.revertedWith(
                "Le statut doit etre 'Loading'."
            );
        });
    });

    describe("Cancel transaction", function () {
        it("should allow the seller to cancel the transaction", async function () {
            await escrow.connect(buyer).depositFunds({ value: value });
            await escrow.connect(seller).cancelTransaction(seller.address, "Reason");

            expect(await escrow.getStatus()).to.equal(5);
        });

        it("should not allow cancel if loading has been validated", async function () {
            await escrow.connect(buyer).depositFunds({ value: value });
            await escrow.connect(seller).setStatus(1);
            await escrow.connect(buyer).validateLoading();

            await expect(
                escrow.connect(seller).cancelTransaction(seller.address, "Reason")
            ).to.be.revertedWith("La transaction ne peut pas etre annulee si acheteur a valide le chargement.");
        });
    });

    describe("Release funds", function () {
        it("should allow the seller to release funds after loading is validated", async function () {
            await escrow.connect(buyer).depositFunds({ value: value });
            await escrow.connect(seller).setStatus(1);
            await escrow.connect(buyer).validateLoading();

            await escrow.connect(seller).releaseFunds();

            const sellerBalance = await ethers.provider.getBalance(seller.address);
            expect(sellerBalance).to.be.above(value);
        });

        it("should not allow release of funds before loading is validated", async function () {
            await escrow.connect(buyer).depositFunds({ value: value });

            await expect(
                escrow.connect(seller).releaseFunds()
            ).to.be.revertedWith("Les fonds ne peuvent etre liberes que lorsque le chargement a ete valide.");
        });
    });
});
