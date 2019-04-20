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


        this.setState({ loading: false, message_count })
    }

  render() {
    const { name, description, image_id, price_in_wei } = this.props;
    const { loading } = this.state;
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
                    <button>Chat</button>
                </div>
            </div>
        }
      </div>
    )
  }
}
