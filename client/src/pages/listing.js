import React, { Component } from 'react'

// const {
//     MKR,
//     DAI,
//     ETH,
//     WETH,
//     PETH,
//     USD_ETH,
//     USD_MKR,
//     USD_DAI
// } = Maker;


export default class extends Component {
    state = {
        loading: false,
        message_count: 0,
        msg: ''
    }

    async componentDidMount() {

        // STORING TESTNET PRIV KEY HERE. NOT SAFE IN REAL LIFE.
    
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
  render() {
    const { id, name, description, image_id, price_in_wei, seller } = this.props;
    const { loading, message_count, messages, msg } = this.state;
    return (
      <div>
        {
            <div>
                <img style={{
                    width: '100%',
                    height: '50vh',
                    objectFit: 'cover',
                    
                }} src={"https://res.cloudinary.com/blocktame/image/upload/v1555706663/" + image_id}/>
                <div style={{
                    padding: '10px 20px 20px'
                }}>
                    <h2>{name}</h2>
                    <p>{description}</p>
                    <h3>{price_in_wei}</h3>
                    <button>Buy</button>
                </div>
                <button className="open-button" onClick={() => {
                    document.getElementById("myForm").style.display = "block";
                }}>{
                    loading ? 
                    "Loading chat..." :
                    <span>Chat ({message_count.toString()})</span>
                }</button>

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
                        <button type="button" className="btn cancel" onClick={() => {
                            document.getElementById("myForm").style.display = "none";
                        }}>Close</button>
                    </form>
                </div>
            </div>
        }
      </div>
    )
  }
}
