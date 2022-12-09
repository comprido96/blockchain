// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface MultiSigWallet {
    // owners_ - initial owners
    // constructor(address[] memory owners_) { }

    /**
     * @notice Execute a multi-signature transaction.
     * @param _to The destination address to send an outgoing transaction.
     * @param _amount The amount in Wei to be sent.
     * @param _data The data to send to the to when invoking the transaction.
     * @param _multiSignature The array of multi signatures.
     */
    function execute(
        address _to,
        uint256 _amount,
        bytes calldata _data,
        bytes[] calldata _multiSignature
    ) external;

    /**
     * @notice Adding or removing signer.
     * @dev Can be only called by multisig contract itself.
     * @param _owner The signer address.
     * @param _isAdded If true, a new signer will be added, otherwise, remove.
     */
    function updateOwner(address _owner, bool _isAdded) external;
    // use trick: require(address(this) == msg.sender)
}
