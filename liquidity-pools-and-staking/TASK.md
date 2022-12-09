# Liquidity Pools and Staking

1. Write and test WETH contract - it mints ERC20 tokens in 1:1 ratio for native ETH currency (received by function with `payable` modifier) and sends native ETH currency by burning user ERC20 tokens. Please note that there should be no admin for this contract and `totalSupply()` MUST always be equal amount of ETH held by WETH smart contract.
2. Create a Uniswap Liquidity Pool with token pair WETH-[token from first task]   

    - You should make sure that the ERC-20 token from the 1st task can be minted and burnt by another contract (staking contract) and no one else. Use of AccessControl is recommended.
  
4. Write a staking contract that gives an income of 1 token every week per specific amount of LP tokens (e.g. 1 token every week per 100 LP tokens given by Uniswap V2). 

&ensp;&ensp;&ensp;The following functions **should be implemented**:  

    - stake(): transfers LP tokes from the user to the contract. 
    - claim(): withdraws reward tokens available to the user from the contract 
    - unstake(): withdraws LP tokens available for withdrawal.
    - A view function that will allow anyone to check amount of immediately available reward tokens for address 
    - A few functions with restricted access to admin that should change staking parameters


4. Write tests.
5. Write deploy script.
6. Deploy on testnet.
7. Write tasks for stake, unstake, claim. 
8. Verify the contract.

### Tips

For testing purposes to simulate that some time has passed use.

```jsx
ethers.provider.send("evm_increaseTime", [1500])
```
In tests you don't have to write whole Uniswap pools and simulate their logic - just create another mintable ERC20 token and assume that it is LP token from Uniswap.

