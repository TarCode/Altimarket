pragma solidity >=0.4.21 < 0.6.0;

import "./Chat.sol";

contract Escrow is Chat {

  address payable public buyer;
  address payable public seller;
  address public arbiter;
  
  constructor (address payable _seller, address _arbiter) public {
    buyer = msg.sender;
    seller = _seller;
    arbiter = _arbiter;
  }
  
  function payoutToSeller() public {
    if(msg.sender == buyer || msg.sender == arbiter) {
      seller.transfer(address(this).balance);
    }
  }
  
  function refundToBuyer() public {
    if(msg.sender == seller || msg.sender == arbiter) {
      buyer.transfer(address(this).balance);
    }
  }
  
  function getBalance() external view returns (uint) {
    return address(this).balance;
  }

}