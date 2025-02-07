const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("EscrowFactory", (m) => {
    const escrowFactoryContract = m.contract("EscrowFactory", []);

    return { escrowFactoryContract };
})