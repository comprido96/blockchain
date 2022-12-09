# Multisignature wallets

Write a multisig wallet contract. Specify the owners (save to mapping), const minQuorum

Functions to be implemented:
- propose(address, calldata) - can be sent only by one of the owners
- confirm(uint id) - confirms a particular proposed transaction
- executeTransaction(uint id) - gets calldata, checks minimum number of approvals
- add/remove/changeQuorum - these function should be called by the contract itself
