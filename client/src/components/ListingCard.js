import React, { Component } from 'react'

export default class ListingCard extends Component {
  render() {
    const { name, image_id, price_in_wei } = this.props;
    return (
      <div className='card'>
        <img style={{
            width: '100%',
            height: '250px',
            objectFit: 'cover',
            
        }} src={"https://res.cloudinary.com/blocktame/image/upload/v1555706663/" + image_id}/>
        <div style={{
            padding: '10px 20px 20px'
        }}>
            <h2>{name}</h2>
            <h3>{price_in_wei/1000000000000000000} ETH</h3>
        </div>
      </div>
    )
  }
}
