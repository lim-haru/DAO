// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract DAO is Ownable {
  struct Proposal {
    string title;
    string description;
    address payable recipient;
    uint256 amount;
    uint256 votesFor;
    uint256 votesAgainst;
    uint256 votesAbstain;
    bool executed;
    uint256 endTime;
    mapping(address => bool) voted;
  }

  IERC20 public token;
  bool public saleActive = true;
  uint256 public pricePerShare;
  uint256 public proposalCount;

  mapping(address => uint256) public shares;
  mapping(uint256 => Proposal) public proposals;
  
  modifier onlyMember() {
    require(shares[msg.sender] > 0, "Not a DAO member");
    _;
  }
  
  constructor(IERC20 _token, uint256 _pricePerShare) Ownable(msg.sender) {
    token = _token;
    pricePerShare = _pricePerShare;
  }
  
  function buyShares(uint256 amount) external {
    require(saleActive, "Token sale is closed");
    require(token.transferFrom(msg.sender, address(this), amount * pricePerShare), "Token trasfer failed");

    shares[msg.sender] += amount;
  }

  function endSale() external onlyOwner {
    saleActive = false;
  }

  function proposeDecision(string calldata _title, string calldata _description, address payable _recipient, uint256 _amount, uint256 _votingPeriod) external onlyMember {
    Proposal storage proposal = proposals[proposalCount++];
    proposal.title = _title;
    proposal.description = _description;
    proposal.recipient = _recipient;
    proposal.amount = _amount;
    proposal.executed = false;
    proposal.endTime = block.timestamp + _votingPeriod * 1 days;
  }
}