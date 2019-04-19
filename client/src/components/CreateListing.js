import React, { Component } from 'react'

export default class CreateListing extends Component {

  state = {
    name: '',
    description: '',
    image_url: '',
    price_in_wei: '',

    preview: null
  }

  onChange = e => {
      this.setState({ [e.target.name]: e.target.value })
  }

  uploadImageToCloudinaryAndSubmitData = async () => {
    this.setState({ loading: true })
    var cloudinary_url = 'https://api.cloudinary.com/v1_1/blocktame/image/upload?upload_preset=eth-hack';

    let formData = new FormData();
    
    formData.append('file', this.state.image_url)
    formData.append("upload_preset", 'nudge-uploads')

    const res = await fetch(cloudinary_url, {
        method: 'POST',
        body: formData
    })
    const imageResponse = await res.json()

    console.log("IMAGE RESPONSE", imageResponse);
    this.setState({ loading: false })
    
  }

  render() {
    const {name , description, loading, price_in_wei} = this.state;
    return (
      <div>
        {
            loading ?
            <p>Loading bru...</p> :
            <div className='pure-form'>
                <h2>Create Listing</h2>
                <input onChange={this.onChange} placeholder="Name" name='name' type='text' value={name}/>
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
                            this.setState({ preview: f, image_url: file, changeImg: false })
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
                <button className='pure-button' onClick={this.uploadImageToCloudinaryAndSubmitData}>Add</button>

            </div>
        }
      </div>
    )
  }
}
