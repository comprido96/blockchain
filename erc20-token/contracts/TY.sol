// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract TY {
    address internal owner;

    // optional in ERC20
    uint8 internal _decimals = 4;

    uint256 internal _totalSupply;

    // optional in ERC20
    string internal _name = "Ten Yaksha";

    // optional in ERC20
    string internal _symbol = "TY";

    // not required in ERC20
    string internal _standard = "Ten Yaksha v1.0";

    mapping(address => uint256) internal _balances;

    mapping(address => bool) internal _isMinter;

    mapping(address => mapping(address => uint256)) internal _allowance;

    // Events
    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    event AddedMinter(address indexed _account);

    event RemovedMinter(address indexed _account);

    // Constructor
    constructor(uint256 _initialSupply) {
        owner = msg.sender;
        _isMinter[owner] = true;
        _mint(owner, _initialSupply);
    }

    // Modifiers
    modifier onlyOwner() {
        require(owner == msg.sender, "only owner method");
        _;
    }

    // methods
    function name() public view returns (string memory) {
        return _name;
    }

    function symbol() public view returns (string memory) {
        return _symbol;
    }

    function standard() public view returns (string memory) {
        return _standard;
    }

    function decimals() public view returns (uint8) {
        return _decimals;
    }

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address _owner) public view returns (uint256 balance) {
        return _balances[_owner];
    }

    function allowance(address _owner, address _spender)
        public
        view
        returns (uint256 remaining)
    {
        return _allowance[_owner][_spender];
    }

    function isMinter(address _account) public view returns (bool) {
        return _isMinter[_account];
    }

    function transfer(address _to, uint256 _value)
        public
        returns (bool success)
    {
        require(_to != address(0), "transfer to the zero address");
        require(
            _balances[msg.sender] >= _value,
            "reverted for insufficient funds"
        );
        _balances[msg.sender] -= _value;
        _balances[_to] += _value;

        // Trigger Transfer event
        emit Transfer(msg.sender, _to, _value);

        return true;
    }

    function approve(address _spender, uint256 _value)
        public
        returns (bool success)
    {
        _allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool success) {
        require(_value <= _balances[_from], "reverted for insufficient funds");
        require(
            _value <= _allowance[_from][msg.sender],
            "value is greater than allowance"
        );

        _balances[_from] -= _value;
        _balances[_to] += _value;

        _allowance[_from][msg.sender] -= _value;

        emit Transfer(_from, _to, _value);

        return true;
    }

    // adding minting functionalities
    function _mint(address account, uint256 amount) internal {
        require(account != address(0), "mint to the zero address");

        _totalSupply += amount;
        _balances[account] += amount;
        emit Transfer(address(0), account, amount);
    }

    function mint(address account, uint256 amount)
        public
        returns (bool success)
    {
        require(_isMinter[msg.sender], "only minters can mint");
        _mint(account, amount);
        return true;
    }

    function addMinter(address _account) external onlyOwner {
        _isMinter[_account] = true;
        emit AddedMinter(_account);
    }

    function removeMinter(address _account) external onlyOwner {
        _isMinter[_account] = false;
        emit RemovedMinter(_account);
    }

    // adding burning functionalities
    function _burn(address _account, uint256 _amount) internal {
        require(_account != address(0), "burn from the zero address");

        uint256 _accountBalance = _balances[_account];
        require(_accountBalance >= _amount, "burn amount exceeds balance");
        unchecked {
            _balances[_account] = _accountBalance - _amount;
            // Overflow not possible: amount <= accountBalance <= totalSupply.
            _totalSupply -= _amount;
        }
    }

    function burn(uint256 _amount) public {
        _burn(msg.sender, _amount);
    }
}
