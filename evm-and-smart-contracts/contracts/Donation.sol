// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "hardhat/console.sol";

//import "@openzeppelin/contracts/access/Ownable.sol";

contract Donation {
    address public owner;
    address[] public donors;
    mapping(address => uint256) public amounts;

    constructor() {
        owner = msg.sender;
    }

    function donate() public payable {
        require(msg.value > 0, "you have to provide some eth");
        uint256 amount = msg.value;

        if (amounts[msg.sender] == 0) {
            donors.push(msg.sender);
        }

        amounts[msg.sender] += amount;

        console.log(
            "Donation from %s with value %d incoming...",
            msg.sender,
            amount
        );
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "only owner can release funds");
        _;
    }

    function releaseFunds(address _to, uint256 _amount) external onlyOwner {
        require(amounts[_to] >= _amount, "insufficient funds");

        payable(_to).transfer(_amount);
    }

    function getDonors() public view returns (address[] memory) {
        return donors;
    }
}
