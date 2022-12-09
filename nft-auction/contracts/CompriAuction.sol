// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract CompriAuction {
    IERC721 public nft;
    IERC20 public currency;
    uint public nftId;
    address public issuer;
    address public owner;
    uint256 startAt;
    uint256 public endAt;
    bool public started;
    bool public ended;
    address public highestBidder;
    uint public highestBid;
    mapping(address => uint) public bids;

    event DepositedToken(address from, address to, uint256 nftId);

    event ListedTokenOnAuction(
        IERC20 currency,
        uint256 tokenId,
        uint256 startTime,
        uint256 endTime,
        uint256 minBid
    );

    event BidPlaced(uint256 timestamp, address from, uint256 amount);

    event Withdraw(address from, uint256 amount);

    event AuctionSummary(
        uint256 id,
        uint256 startTime,
        uint256 endTime,
        address winner,
        uint256 price
    );

    constructor(address _nft, uint _nftId) {
        nft = IERC721(_nft);
        nft.safeTransferFrom(msg.sender, address(this), _nftId);
        nftId = _nftId;
        owner = msg.sender;
    }

    function onERC721Received(
        address _operator,
        address _from,
        uint256 _tokenId
    ) external returns (bytes4) {
        require(nft.ownerOf(_tokenId) == address(this));

        emit DepositedToken(_from, _operator, _tokenId);

        return this.onERC721Received.selector;
    }

    function listNFTOnAuction(
        address _currency,
        uint32 _startsIn,
        uint32 _durationTime,
        uint256 _minBid
    ) external {
        require(
            msg.sender == owner,
            "msg.sender is not the owner of the token deposited."
        );
        require(!started, "token is already listed on auction.");

        issuer = msg.sender;
        currency = IERC20(_currency);
        startAt = block.timestamp + _startsIn;
        endAt = startAt + _durationTime;
        started = true;
        ended = false;
        highestBid = _minBid;
        highestBidder = issuer;

        emit ListedTokenOnAuction(currency, nftId, startAt, endAt, _minBid);
    }

    function placeBid(uint256 _bid) external {
        require(started, "auction not started");
        require(!ended, "auction is ended");

        address _bidder = msg.sender;

        if (_bid > highestBid) {
            currency.transfer(address(this), _bid);
            bids[_bidder] += _bid;

            highestBid = _bid;
            highestBidder = _bidder;
        }

        emit BidPlaced(block.timestamp, _bidder, _bid);
    }

    function withdraw() external {
        require(
            msg.sender != highestBidder,
            "Cannot withdraw if msg.sender is current winner."
        );

        uint256 totBidded = bids[msg.sender];
        bids[msg.sender] = 0;

        currency.transfer(msg.sender, totBidded);
        emit Withdraw(msg.sender, totBidded);
    }

    function finishAuction() external {
        require(block.timestamp >= endAt, "auction is not ended yet.");

        emit AuctionSummary(nftId, startAt, endAt, highestBidder, highestBid);

        bids[highestBidder] -= highestBid;

        if (highestBidder != issuer) {
            currency.transfer(issuer, highestBid);
        }

        ended = true;
        started = false;

        owner = highestBidder;

        highestBidder = address(0);
    }

    function withdrawNFT() external {
        require(!started, "Cannot withdraw token listed on auction.");

        require(owner == msg.sender, "Only owner can withdraw the token.");

        this.approveTokenTransfer(msg.sender);

        nft.safeTransferFrom(address(this), msg.sender, nftId);
    }

    function approveTokenTransfer(address _to) external {
        require(
            msg.sender == address(this),
            "only this contract can call the method."
        );

        nft.approve(_to, nftId);
    }
}
