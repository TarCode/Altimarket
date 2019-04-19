import React, { Component } from "react";
import MarketContract from "../contracts/Market.json";

import CreateListing from '../components/CreateListing';
import ListingCard from '../components/ListingCard';

import ShowListing from './listing';

import getWeb3 from "../utils/getWeb3";

export default class App extends Component {
  state = { 
    listingCount: 0, 
    web3: null, 
    accounts: null, 
    contract: null,
    create_listing: false,
    selected_listing: null
  };

  getListings = async (contract, count) => {

    const listings = [];
    for (let i = 0; i < count; i++) {
        const name = await contract.methods.getListingName(i).call();
        const description = await contract.methods.getListingDescription(i).call();
        const image_id = await contract.methods.getListingImageId(i).call();

        listings.push({
            name,
            description,
            image_id
        })
    }
    return listings;
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = MarketContract.networks[networkId];
      const instance = new web3.eth.Contract(
        MarketContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      
      const listingCount = await instance.methods.getListingCount().call();
      
      const listings = await this.getListings(instance, listingCount);

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance, listingCount, listings });

      console.log("LISTINGS", listings);
      
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  render() {
    const { accounts, contract, listings, create_listing, selected_listing } = this.state;

    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className='container'>
        <div style={{
            position: 'absolute',
            right: '20px',
            top: '10px'
        }}>
            <button onClick={() => {
                this.setState({ create_listing: !create_listing})
            }}>{
                create_listing ?
                "Close" : 
                "New Ad"
            }</button>
        </div>
        <h1>ETH Hack</h1>
        <p>Listings: {this.state.listingCount}</p>
        <p>The start of the ETH hack project</p>
        {
            create_listing ?
            <div>
                <CreateListing close={() => this.setState({ create_listing: false })} getListings={this.getListings} listingCount={this.state.listingCount} accounts={accounts} contract={contract}/>
            </div> :
            selected_listing ?
           <div style={{
               position: 'relative'
           }}>
                <button style={{
                    position: 'absolute',
                    right: '15px',
                    top: '0px'
                }} onClick={() => {
                    this.setState({ selected_listing: null})
                }}>Close</button>
                <ShowListing
                    name={selected_listing.name}
                    description={selected_listing.description}
                    image_id={selected_listing.image_id}
                />
           </div>:
            <div className='row'>
                {
                    listings.length > 0 ?
                    listings.map((l, index) => (
                        <div onClick={() => this.setState({ selected_listing: l })} key={index} className='col-4'>
                            <ListingCard
                                name={l.name}
                                description={l.description}
                                image_id={l.image_id}
                            />
                        </div>
                    )) :
                    <p>No listings yet</p>
                }
            </div>
        }
      </div>
    );
  }
}