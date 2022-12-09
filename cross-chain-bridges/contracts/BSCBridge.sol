// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "./BridgeBase.sol";

contract BSCBridge is BridgeBase {
    constructor(address _validator, address _token) {
        validator = _validator;
        token = TokenBase(_token);

        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }
}
