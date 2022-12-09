// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CompriWETH is ERC20 {
    constructor() ERC20("Wrapped Ether", "WETH") {}

    function mint() external payable {
        _mint(msg.sender, msg.value);
    }

    function burn(uint256 _amount) external returns (bool) {
        _burn(msg.sender, _amount);

        (bool success, ) = msg.sender.call{value: _amount}("");
        return success;
    }
}
