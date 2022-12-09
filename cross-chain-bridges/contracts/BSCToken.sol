// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./TokenBase.sol";

contract BSCToken is TokenBase("BSC Token", "BSCT") {
    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }
}
