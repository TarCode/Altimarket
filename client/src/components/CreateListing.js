import React, { Component } from 'react'

export default class CreateListing extends Component {

  state = {
    name: '',
    description: '',
    image_url: '',
    price_in_wei: '',

  }

  render() {
    return (
      <div>
        <h2>Create Listing</h2>
        <input name='name'/>
        <input name='description'/>
        <input name='image_url'/>
        <input name='price_in_wei'/>
      </div>
    )
  }
}
