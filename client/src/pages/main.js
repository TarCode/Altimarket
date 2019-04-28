import React, { Component } from "react";
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import MarketContract from "../contracts/Market.json";
import ChatContract from "../contracts/Chat.json";
import CreateListing from './CreateListing';
import ListingCard from '../components/ListingCard';
import Nav from '../components/nav';
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
        const available = await contract.methods.getListingAvailability(i).call();
        const seller = await contract.methods.getListingOwnerById(i).call();

        listings.push({
            id: i,
            name,
            description,
            image_id,
            available,
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
      return <div style={{
        display: 'flex',
        margin: 'auto',
        justifyContent: 'center',
        height: '90vh'
      }}>
        <div style={{
          paddingTop: '10vh',
          textAlign: 'center'
        }}>
          <CircularProgress />
          <br/>
          Loading...<br/>Please be patient.
        </div>
      </div>;
    }
    
    return (
      <div style={{
        paddingTop: '80px'
      }} className='container'>
        <Card style={{
            textAlign: 'right',
            position: 'fixed',
            top: 0,
            height: '80px',
            left: 0, right: 0,
            zIndex: 10001
        }}>
          <div style={{
            textAlign: 'right',
            paddingTop: '20px',
            position: 'relative'
        }}>
            <img style={{
              height: '70px',
              width: 'auto',
              position: 'absolute',
              left: 0, top: 0
            }} src='/img/logo.png'/>
            <div style={{
              position: 'absolute',
              right: '15px', top: '15px'
            }}>
              <b>{(balance/1000000000000000000)} ETH</b>
              <p style={{ marginTop: '0px'}}>{accounts[0]}</p>
            </div>
          </div>
        </Card>
          <br/>
        {
          !selected_listing && !create_listing &&
          <div>
            <div style={{
              position: 'fixed',
              display: 'flex',
              justifyContent: 'center',
              alignContent: 'center',
              alignSelf: 'center',
              top: '80px',
              left: 0, right: 0,
              background: "#fff",
              zIndex: 1001
            }}>
              <input onChange={(e) => {
                this.setState({ search: e.target.value})
              }} style={{
                maxWidth: '650px',
                width: '100%',
                maxWidth: '400px',
                height: '75px',
                display: 'inline-block'
              }} placeholder="Search listings..."/>
            </div>
            <br/>
          </div>
        }
        <br/>
        {!selected_listing && !create_listing ? <h1 className='left'>On the market: {this.state.listingCount}</h1> : null}
        {
            create_listing ?
            <div>
                <CreateListing
                  close={() => this.setState({ create_listing: false })}
                  web3={this.state.web3}
                  getListings={this.setListingState} 
                  listingCount={this.state.listingCount} 
                  accounts={accounts} 
                  contract={contract}
                />
            </div> :
            selected_listing ?
           <div style={{
               position: 'relative'
           }}>
                <Button onClick={() => {
                    this.setState({ selected_listing: null})
                }} variant="contained" color="primary" style={{
                    position: 'absolute',
                    right: '15px',
                    top: '0px',
                    zIndex: 1001
                }} >
                  Back
                </Button>
                <ShowListing
                    id={selected_listing.id}
                    accounts={accounts}
                    web3={this.state.web3}
                    name={selected_listing.name}
                    price_in_wei={selected_listing.price_in_wei}
                    description={selected_listing.description}
                    image_id={selected_listing.image_id}
                    available={selected_listing.available}
                    chat_contract={chat_contract}
                    contract={contract}
                    seller={selected_listing.seller}
                />
           </div>:
            <div className='row'>
                {
                    listings.length > 0 ?
                    the_listings.map((l, index) => (
                        <div onClick={() => this.setState({ selected_listing: l })} key={index} className='col-4'>
                            <ListingCard
                                price_in_wei={(parseInt(l.price_in_wei)).toString()}
                                name={l.name}
                                description={l.description}
                                image_id={l.image_id}
                                available={l.available}
                            />
                        </div>
                    )) :
                    <p>No listings yet</p>
                }
            </div>
        }
        <br/><br/>
        <Nav
          showListings={() => this.setState({ create_listing: false, selected_listing: false})}
          newListing={() => this.setState({ create_listing: true })}
        />
      </div>
    );
  }
}