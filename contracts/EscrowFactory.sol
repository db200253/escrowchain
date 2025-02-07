// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "./Escrow.sol";

contract EscrowFactory {
    Escrow[] public escrows;
    mapping(address => Escrow[]) public userEscrows;

    event EscrowCreated(address escrowAddress, address seller, address buyer, uint value);

    function createEscrow(address payable _seller, address payable _buyer, uint _value) public {
        Escrow newEscrow = new Escrow(_seller, _buyer, _value);
        escrows.push(newEscrow);
        userEscrows[_buyer].push(newEscrow);
        userEscrows[_seller].push(newEscrow);

        emit EscrowCreated(address(newEscrow), _seller, _buyer, _value);
    }

    function getEscrows() public view returns (Escrow[] memory) {
        return escrows;
    }

    function getUserEscrows(address _user) public view returns (address[] memory) {
        uint length = userEscrows[_user].length;
        address[] memory escrowAddresses = new address[](length);

        for (uint i = 0; i < length; i++) {
            escrowAddresses[i] = address(userEscrows[_user][i]);
        }

        return escrowAddresses;
    }
}