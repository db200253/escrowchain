const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("Escrow", (m) => {
    const seller = m.getParameter("seller", "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
    const buyer = m.getParameter("buyer", "0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
    const value = m.getParameter("value", 1000);

    const escrowContract = m.contract("Escrow", [seller, buyer, value]);

    return { escrowContract };
})