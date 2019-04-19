import React, { Component } from 'react'

export default class ListingCard extends Component {
  render() {
    const { name, description, image_id, price_in_wei } = this.props;
    return (
      <div>
        <img style={{
            width: '100%',
            height: 'auto'
        }} src={"https://res.cloudinary.com/blocktame/image/upload/v1555706663/" + image_id}/>
        <h2>{name}</h2>
        <h3>{price_in_wei}</h3>
      </div>
    )
  }
}
