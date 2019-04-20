pragma solidity >=0.4.21 < 0.6.0;

contract Market {

    event NewListing(uint listingId, string name, string category, string description, string image_id, string price_in_wei);

    struct Listing {
        string name;
        string description;
        string image_id;
        string category;
        string price_in_wei;
        bool available;
    }

    Listing[] public listings;

    mapping (uint => address) public listingToOwner;
    mapping (address => uint) ownerListingCount;

    function getListingCount() public view returns(uint) {
        return listings.length;
    }

    function createListing(
        string memory _name,
        string memory _description,
        string memory _image_id,
        string memory _category,
        string memory _price_in_wei
    ) public {
        uint id = listings.push(Listing(_name, _description, _category, _image_id, _price_in_wei, true));
        listingToOwner[id] = msg.sender;
        ownerListingCount[msg.sender]++;
        emit NewListing(id, _name, _description, _category, _image_id, _price_in_wei);
    }

    function getListingName(uint _id) external view returns(string memory) {
        return(listings[_id].name);
    }

    function getListingDescription(uint _id) external view returns(string memory) {
        return(listings[_id].description);
    }

    function getListingImageId(uint _id) external view returns(string memory) {
        return(listings[_id].image_id);
    }

    function getListingPrice(uint _id) external view returns(string memory) {
        return(listings[_id].price_in_wei);
    }

    function getListingAvailability(uint _id) external view returns(bool) {
        return(listings[_id].available);
    }

    function getListingOwnerById(uint _id) external view returns(address) {
        return(listingToOwner[_id]);
    }
}