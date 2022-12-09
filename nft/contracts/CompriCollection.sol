// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CompriCollection is ERC1155, Ownable {
    string public name;
    string public symbol;

    mapping(uint => string) public tokenURI;

    event Minted(address to, uint256 id, uint256 amount);

    event MintedBatch(address to, uint256[] ids, uint256[] amounts);

    event Burned(uint256 id, uint256 amount);

    event BurnedBatch(uint256[] ids, uint256[] amounts);

    constructor() ERC1155("") {
        name = "CompriCollection";
        symbol = "CC";
    }

    function mint(
        address _to,
        uint _id,
        uint _amount
    ) external onlyOwner {
        _mint(_to, _id, _amount, "");

        emit Minted(_to, _id, _amount);
    }

    function mintBatch(
        address _to,
        uint[] memory _ids,
        uint[] memory _amounts
    ) external onlyOwner {
        _mintBatch(_to, _ids, _amounts, "");

        emit MintedBatch(_to, _ids, _amounts);
    }

    function burn(uint _id, uint _amount) external {
        _burn(msg.sender, _id, _amount);

        emit Burned(_id, _amount);
    }

    function burnBatch(uint[] memory _ids, uint[] memory _amounts) external {
        _burnBatch(msg.sender, _ids, _amounts);

        emit BurnedBatch(_ids, _amounts);
    }

    function setURI(uint _id, string memory _uri) external onlyOwner {
        tokenURI[_id] = _uri;
        emit URI(_uri, _id);
    }

    function uri(uint _id) public view override returns (string memory) {
        return tokenURI[_id];
    }
}
