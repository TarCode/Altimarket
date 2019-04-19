import React, { Component } from 'react'

export default class ListingCard extends Component {
  render() {
    const { name, description, image_url, price_in_wei } = this.props;
    return (
      <div>
        <img src={"https://res.cloudinary.com/blocktame/image/upload/v1555706663/" + image_id}/>
      </div>
    )
  }
}
