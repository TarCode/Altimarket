import React, { Component } from 'react'

export default class CreateListing extends Component {

  state = {
    name: '',
    description: '',
    image_url: '',
    price_in_wei: '',

  }

  onChange = e => {
      this.setState({ [e.target.name]: e.target.value })
  }

  uploadImageToCloudinaryAndSubmitData = async () => {
    var cloudinary_url = 'https://api.cloudinary.com/v1_1/blocktame/image/upload?upload_preset=nudge-uploads';

    let formData = new FormData();
    
    formData.append('file', this.state.image_url)
    formData.append("upload_preset", 'nudge-uploads')

    const res = await fetch(cloudinary_url, {
        method: 'POST',
        body: formData
    })
    const imageResponse = await res.json()

    console.log("IMAGE RESPONSE", imageResponse);
    
  }

  render() {
    const {name , description, image_url, price_in_wei} = this.state;
    return (
      <div>
        <h2>Create Listing</h2>
        <input onChange={this.onChange} placeholder="Name" name='name' type='text' value={name}/>
        <input onChange={this.onChange} placeholder="Description" name='description' type='text' value={description}/>
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
        <input onChange={this.onChange} placeholder="Price" name='price_in_wei' value={price_in_wei}/>
        <button onClick={this.submit}>Add</button>
      </div>
    )
  }
}
