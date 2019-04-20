import React, { Component } from 'react'

export default class extends Component {
    state = {
        loading: false,
        message_count: 0
    }

    async componentDidMount() {
        const { chat_contract, id } = this.props;

        this.setState({ loading: true })
        const message_count = await chat_contract.methods.getListingMessageCount(id).call();
        const messages = [];
        console.log("MESSAGE COUNT", message_count);

        for (let i = 0; i < message_count; i++) {
            const message = await chat_contract.methods.getListingMessageTextByIndex(id).call();
            messages.push({
                message
            })
        }
        
        this.setState({ loading: false, message_count, messages })
    }

  render() {
    const { name, description, image_id, price_in_wei } = this.props;
    const { loading, message_count } = this.state;
    return (
      <div>
        {
            loading ?
            <p>Loading...</p> :
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
                }}>Chat ({message_count.toString()})</button>

                <div className="chat-popup" id="myForm">
                <form action="/action_page.php" className="form-container">
                    <h1>Chat</h1>

                    <label for="msg"><b>Message</b></label>
                    <textarea className='msg-box' placeholder="Type message.." name="msg" required></textarea>

                    <button type="submit" className="btn">Send</button>
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
