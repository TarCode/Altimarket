import React, { Component } from 'react'

export default class extends Component {
  render() {
    const { name, description, image_id, price_in_wei } = this.props;
    return (
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
        </div>
      </div>
    )
  }
}
