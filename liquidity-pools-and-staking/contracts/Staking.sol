//SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./CompriToken.sol";
import "./CompriWETH.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Staking is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    uint lockTime;

    uint interest;

    struct Stake {
        uint amount;
        uint timestamp;
    }

    CompriToken token;
    CompriWETH lpToken;

    mapping(address => Stake) stakes;

    mapping(address => uint) canUnstakeAt;

    event Staked(address indexed account, uint amount, uint timestamp);

    event Claimed(address indexed account, uint amount);

    event Unstaked(address indexed account, uint amount);

    event ChangedStakeParams(uint lockTime, uint interest);

    constructor(
        address _lpToken,
        address _rewardToken,
        uint _lockTimeInDays,
        uint _interest
    ) {
        _setupRole(ADMIN_ROLE, msg.sender);

        lpToken = CompriWETH(_lpToken);

        token = CompriToken(_rewardToken);

        lockTime = _lockTimeInDays * 24 * 60 * 60;

        interest = _interest;
    }

    function _claim(address _account) internal returns (uint) {
        uint _amountClaimed = _computeReward(_account);

        token.mint(msg.sender, _amountClaimed);

        stakes[_account].timestamp = block.timestamp;

        return _amountClaimed;
    }

    function _computeReward(address _account) internal view returns (uint) {
        Stake storage _s = stakes[_account];
        uint _stakingTime = block.timestamp - _s.timestamp;
        require(
            _stakingTime >= lockTime,
            "You still have not earned interest on your stake"
        );

        uint _interest = _getInterest(_stakingTime);

        uint _amountClaimed = _s.amount * _interest;

        return _amountClaimed;
    }

    function _getInterest(uint _stakingTime) internal view returns (uint) {
        return (interest / 100) * (_stakingTime / lockTime);
    }

    function stake(uint _amount) external {
        lpToken.transferFrom(msg.sender, address(this), _amount);

        Stake storage s = stakes[msg.sender];
        s.amount += _amount;
        s.timestamp = block.timestamp;

        canUnstakeAt[msg.sender] = block.timestamp + lockTime;

        emit Staked(msg.sender, _amount, block.timestamp);
    }

    function claim() external {
        uint _amountClaimed = _claim(msg.sender);

        emit Claimed(msg.sender, _amountClaimed);
    }

    function unstake() external {
        require(
            block.timestamp >= canUnstakeAt[msg.sender],
            "Your staked tokens are still frozen"
        );

        _claim(msg.sender);
        uint _amount = stakes[msg.sender].amount;
        stakes[msg.sender].amount = 0;

        lpToken.transfer(msg.sender, _amount);

        emit Unstaked(msg.sender, _amount);
    }

    function checkStake(address _account)
        public
        view
        returns (
            uint256,
            uint256,
            uint256
        )
    {
        return (
            stakes[_account].amount,
            stakes[_account].timestamp,
            _computeReward(_account)
        );
    }

    function setStakeSParams(uint256 _interest, uint256 _lockTimeInDays)
        public
        onlyRole(ADMIN_ROLE)
    {
        interest = _interest;
        lockTime = _lockTimeInDays * 24 * 60 * 60;
        emit ChangedStakeParams(interest, lockTime);
    }
}
