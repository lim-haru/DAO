// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DAO {
  IERC20 public token;
  bool public saleActive = true;
  uint256 public pricePerShare;
  mapping(address => uint256) public shares;

  constructor(IERC20 _token, uint256 _pricePerShare) {
    token = _token;
    pricePerShare = _pricePerShare;
  }
  
  function buyShares(uint256 amount) public {
    require(saleActive, "Token sale is closed");
    require(token.transferFrom(msg.sender, address(this), amount * pricePerShare), "Token trasfer failed");

    shares[msg.sender] += amount;
  }
}