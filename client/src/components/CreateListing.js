import React, { Component } from 'react'

export default class CreateListing extends Component {

  state = {
    name: '',
    description: '',
    image_id: '',
    price_in_wei: '',
    category: '',
    preview: null
  }

  onChange = e => {
      this.setState({ [e.target.name]: e.target.value })
  }

  uploadImageToCloudinaryAndSubmitData = async () => {
    var cloudinary_url = 'https://api.cloudinary.com/v1_1/blocktame/image/upload?upload_preset=eth-hack';

    let formData = new FormData();
    
    formData.append('file', this.state.image_id)
    formData.append("upload_preset", 'nudge-uploads')

    const res = await fetch(cloudinary_url, {
        method: 'POST',
        body: formData
    })
    const imageResponse = await res.json()

    return imageResponse.public_id;
    
  }


  submit = async () => {
    const {name, description, category, loading, price_in_wei} = this.state;
    const { contract, accounts } = this.props;

    this.setState({ loading: true })
    
    try {
        const image_id = await this.uploadImageToCloudinaryAndSubmitData()

        await contract.methods.createListing(
            name,
            description,
            category,
            image_id,
            parseInt(price_in_wei)
        ).send({ from: accounts[0] });

        const listingCount = await contract.methods.getListingCount().call();

        await this.props.getListings(contract, listingCount);

        this.props.close()

        this.setState({
            name: '',
            description: '',
            image_id: '',
            price_in_wei: '',
            category: '',
            preview: null
          });
        
    } catch(err) {
        console.log("ERR", err);
    }
    
    this.setState({ loading: false })
  }

  render() {
    const {name, description, category, loading, price_in_wei} = this.state;
    return (
      <div>
        {
            loading ?
            <p>Loading bru...</p> :
            <div className='pure-form'>
                <h2>Create Listing</h2>
                <input onChange={this.onChange} placeholder="Name" name='name' type='text' value={name}/>
                <br/><br/>
                <input onChange={this.onChange} placeholder="Category" name='category' type='text' value={category}/>
                <br/><br/>
                <input onChange={this.onChange} placeholder="Description" name='description' type='text' value={description}/>
                <br/><br/>
                <input onChange={this.onChange} placeholder="Price" name='price_in_wei' value={price_in_wei}/>
                <br/>
                <div style={{
                    position: 'relative'
                }}>
                    <h5>Upload image</h5>
                    <input style={{ 
                        position: 'absolute', 
                        width: '100%', 
                        top: 0, left: 0, 
                        right: 0, bottom: 0, 
                        zIndex:9999,
                        cursor: 'pointer'
                    }} onChange={(e) => {
                        var file = e.target.files[0];

                        let f = file && window.URL.createObjectURL(file);

                        var reader  = new FileReader();

                        reader.addEventListener("load", function () {
                            this.setState({ preview: f, image_id: file, changeImg: false })
                        }.bind(this), false);

                        if (file) {
                            reader.readAsDataURL(file);
                        }
                    }} type="file" />
                </div>
                <div style={{
                    position: 'relative'
                }}>
                    {
                        this.state.preview ?
                        <img style={{
                            position: 'relative',
                            top: 0,
                            left: 0,
                            right: 0,
                            width: '100%',
                            height: '100%',
                            boxSizing: 'border-box',
                            objectFit: 'cover'
                        }} src={this.state.preview} alt="" /> :
                        null
                    }
                </div>
                <button className='pure-button' onClick={this.submit}>Add</button>
            </div>
        }
      </div>
    )
  }
}
