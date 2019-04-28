import React, { Component } from "react";
import MarketContract from "../contracts/Market.json";
import ChatContract from "../contracts/Chat.json";
import CreateListing from './CreateListing';
import ListingCard from '../components/ListingCard';
import swal from 'sweetalert';

import ShowListing from './listing';

import getWeb3 from "../utils/getWeb3";

export default class App extends Component {
  state = { 
    listingCount: 0, 
    web3: null, 
    accounts: null, 
    contract: null,
    chat_contract: null,
    create_listing: false,
    selected_listing: null,
    search: ''
  };

  getListings = async (contract, count) => {

    const listings = [];
    for (let i = 0; i < count; i++) {
        const name = await contract.methods.getListingName(i).call();
        const description = await contract.methods.getListingDescription(i).call();
        const image_id = await contract.methods.getListingImageId(i).call();
        const price_in_wei = await contract.methods.getListingPrice(i).call();
        const seller = await contract.methods.getListingOwnerById(i).call();

        listings.push({
            id: i,
            name,
            description,
            image_id,
            price_in_wei,
            seller
        })
    }
    return listings;
  }

  setListingState = async (instance) => {
    const listingCount = await instance.methods.getListingCount().call();
      
    const listings = await this.getListings(instance, listingCount);

    this.setState({ listings, listingCount });
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();

      const balance = await web3.eth.getBalance(accounts[0]);

      console.log("BALANCE", balance);
      
      
      const deployedNetwork = MarketContract.networks[networkId];
      const chatDeployedNetwork = ChatContract.networks[networkId];
      

      const instance = new web3.eth.Contract(
        MarketContract.abi,
        "0x96b4B899E5534207bdb19A8FDBA8b2Ab9fec9030", // HARDCODED ADDRESS
      );

      const chat_contract = new web3.eth.Contract(
        ChatContract.abi,
        "0x34CDce009A15983aB9Aa2f7b5FEEbCC8A68cD45F" // HARDCODED ADDRESS
      );

      
      await this.setListingState(instance);


      this.setState({ web3, accounts, contract: instance, chat_contract, balance });

      instance.events.BoughtListing(function(error, event){ console.log(event); })
      .on('data', event => {
          console.log("BOUGHT SOMETHING", event);

          swal("Transaction complete!", "You just bough something! Yeah!", "success", {
              button: "Awwww yeah!",
          });

          this.setListingState(instance);
      })
      .on('error', console.error);

      
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  render() {
    const { accounts, contract, chat_contract, listings, create_listing, selected_listing, balance } = this.state;
    
    const options = [
      { value: 'electronics', label: 'Electronics' },
      { value: 'cars', label: 'Cars' },
      { value: 'fashion', label: 'Fashion' }
    ]

    const the_listings = this.state.search.length > 0 ? listings.filter(l => l.name.toLowerCase().includes(this.state.search.toLowerCase())) : listings;
    
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    
    return (
      <div className='container'>
        <div style={{
            textAlign: 'center',
            position: 'fixed',
            left: '50vw',
            top: '20px',
            zIndex: 10001
        }}>
          <b>{(balance/1000000000000000000)} ETH</b>
          <p style={{ marginTop: '0px'}}>ZAR 1234</p>
        </div>
        <div style={{
            position: 'fixed',
            right: '10px',
            top: '20px',
            zIndex: 10001
        }}>
            <button onClick={() => {
                this.setState({ create_listing: !create_listing})
            }}>{
                create_listing ?
                "Close" : 
                "CREATE LISTING"
            }</button>
        </div>
          <br/><br/>
        {
          !selected_listing && !create_listing &&
          <div style={{
            position: 'relative'
          }} className='row'>
            <div className='col-9'>
              <input onChange={(e) => {
                this.setState({ search: e.target.value})
              }} style={{
                maxWidth: '650px',
                width: '90%',
                height: '75px',
                display: 'inline-block'
              }} placeholder="Start typing..."/>
            </div>
            {/* <div className="col-3">
              <Select options={options} />
            </div> */}
            <div style={{
              position: 'relative',
              right: 0
            }} className='col-2'>
              <button style={{
                height: '80px',
                width: '100%',
                fontSize: '22px'
              }}>SEARCH</button>
            </div>
          </div>
        }
        {!selected_listing && !create_listing && <h1 className='left'>On the market: {this.state.listingCount}</h1>}
        {
            create_listing ?
            <div>
                <CreateListing close={() => this.setState({ create_listing: false })} getListings={this.setListingState} listingCount={this.state.listingCount} accounts={accounts} contract={contract}/>
            </div> :
            selected_listing ?
           <div style={{
               position: 'relative'
           }}>
                <button style={{
                    position: 'absolute',
                    right: '15px',
                    top: '0px',
                    zIndex: 1001
                }} onClick={() => {
                    this.setState({ selected_listing: null})
                }}>Back</button>
                <ShowListing
                    id={selected_listing.id}
                    accounts={accounts}
                    web3={this.state.web3}
                    name={selected_listing.name}
                    price_in_ether={this.state.priceInEther/1000000000000000000}
                    description={selected_listing.description}
                    image_id={selected_listing.image_id}
                    chat_contract={chat_contract}
                    contract={contract}
                    seller={selected_listing.seller}
                />
           </div>:
            <div className='row'>
                {
                    listings.length > 0 ?
                    the_listings.map((l, index) => (
                        <div onClick={() => this.setState({ selected_listing: l, priceInEther: (parseInt(l.price_in_wei)/1000000000000000000).toString() })} key={index} className='col-4'>
                            <ListingCard
                                price_in_wei={(parseInt(l.price_in_wei)/1000000000000000000).toString()}
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