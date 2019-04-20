pragma solidity >=0.4.21 < 0.6.0;

import "./Market.sol";

contract Chat is Market {

    event NewMessage(string message, address user, uint timestamp, uint listingId);

    address owner;

    struct Message {
        string message;
        address user;
        uint timestamp;
    }

    mapping(uint => Message[]) listingIdToMessages;


}