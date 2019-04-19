pragma solidity >=0.4.21 < 0.6.0;

contract Market {

    struct Listing {
        string name;
        string description;
        string image_url;
        uint price_in_wei;
        bool available;
    }

    Listing[] public listings;

    mapping (uint => address) public listingToOwner;
    mapping (address => uint) ownerListingCount;
}