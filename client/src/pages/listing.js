import React, { Component } from 'react'

import swal from 'sweetalert';

import Maker from '@makerdao/dai';
const {
    DAI
} = Maker;


export default class extends Component {
    state = {
        loading: false,
        message_count: 0,
        msg: ''
    }

    async componentDidMount() {
        this.getMessages();

        this.props.chat_contract.events.NewMessage(function(error, event){ console.log(event); })
        .on('data', event => {
            console.log("MESSAGE", event);
            this.getMessages();
        })
        .on('error', console.error);
    }

    getMessages = async () => {
        const { chat_contract, id } = this.props;

        this.setState({ loading: true })
        const message_count = await chat_contract.methods.getListingMessageCount(id).call();
        const messages = [];

        for (let i = 0; i < message_count; i++) {
            const message = await chat_contract.methods.getListingMessageTextByIndex(id, i).call();
            const sender = await chat_contract.methods.getListingMessageSenderByIndex(id, i).call();
            messages.push({
                message,
                sender
            })
        }
        
        this.setState({ loading: false, message_count, messages })
    }

    buyItem = async (recipient_address, amount) => {
        this.setState({ loading_buy: true })

        swal("Processing transaction...", "Transaction is being processed...", "success", {
            button: "Awwww yeah!",
        });

         // STORING TESTNET PRIV KEY HERE. NOT SAFE IN REAL LIFE.
         const maker = await Maker.create('http',{
            privateKey: "581e159d4833a9bab99bc58f8622106ea70a7c97d7211b9a1080941919d2b7b3",
            url: 'https://kovan.infura.io/v3/97efc724e0d44243947abcc78db59c5a'
         })

        await maker.authenticate();

        // const txMgr = maker.service('transactionManager');
        
        const cdp = await maker.openCdp();

        await cdp.lockEth(amount);
        await cdp.drawDai(10);

        const dai = maker.service('token').getToken('DAI');

        // TODO: Send to contract via Raiden network

        // TODO: Add txMgr listener to listen for DAI payments

        await dai.transfer(recipient_address, DAI(10));


        this.setState({ loading_buy: false })
    }

  render() {
    const { id, name, description, image_id, price_in_wei, seller, accounts } = this.props;
    const { loading, loading_buy, message_count, messages, msg } = this.state;

    
    return (
        <div>
            <div className="row">
                <div className='col-6'>
                    <img style={{
                        width: '100%',
                        height: '50vh',
                        objectFit: 'cover',
                        
                    }} src={"https://res.cloudinary.com/blocktame/image/upload/v1555706663/" + image_id}/>
                </div>
                    <div className="col-6">
                        <h2>{name}</h2>
                        <p>{description}</p>
                        <h3>{price_in_wei/1000000000000000000} ETH</h3>
                        <button disabled={loading_buy} onClick={() => this.buyItem(seller, (price_in_wei * 1000000000000000000)) }>
                            {
                                loading_buy ?
                                "Processing transaction..." :
                                "Buy"
                            }
                        </button>
                    </div>
                    {<button className="open-button" onClick={() => {
                        document.getElementById("myForm").style.display = "block";
                    }}>{
                        loading ? 
                        "Loading chat..." :
                        <span>Chat ({message_count.toString()})</span>
                    }</button>}

            </div>
            <div className="chat-popup" id="myForm">
                <form className="form-container">
                    <h1>Chat</h1>
                    {
                        messages && messages.length > 0 ?
                        messages.map((m, index) => (
                            <p key={index}>
                                {m.message}
                                <br/>
                                <small>
                                    <i>{m.sender}</i>
                                </small>
                            </p>
                        )) :
                        <p>No messages yet</p>
                    }
                    <label htmlFor="msg"><b>Message</b></label>
                    <textarea onChange={e => {
                        this.setState({ msg: e.target.value })
                    }} className='msg-box' placeholder="Type message.." name="msg" required></textarea>
                    <button onClick={async e => {
                        e.preventDefault();

                        await this.props.chat_contract.methods.sendMessage(msg, seller, id).send({ from: this.props.accounts[0] });

                        this.setState({ msg: '' })
                    }} disabled={loading} className="btn">{
                        loading ?
                        "Sending..." :
                        "Send"
                    }</button>
                
                </form>
            </div>
        </div>
    )
  }
}
