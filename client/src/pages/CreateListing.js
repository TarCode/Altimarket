import React, { Component } from 'react'
import swal from 'sweetalert';
import Button from '@material-ui/core/Button';

const BigNumber = require('bignumber.js')

export default class CreateListing extends Component {

  state = {
    name: '',
    description: '',
    image_id: '',
    price_in_wei: '',
    category: '',
    preview: null,
    account: this.props.accounts[0]
  }

  async componentDidMount() {
    this.props.contract.events.NewListing(function(error, event){ console.log(event); })
    .on('data', async event => {
        const listingCount = await this.props.contract.methods.getListingCount().call();

        await this.props.getListings(this.props.contract, listingCount);
    })
    .on('error', console.error);
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
    const {name, description, category, price_in_wei} = this.state;
    const { contract, accounts } = this.props;

    this.setState({ loading: true })
    
    try {
        const image_id = await this.uploadImageToCloudinaryAndSubmitData()

        await contract.methods.createListing(
            name,
            description,
            category,
            image_id,
            BigNumber((parseFloat(price_in_wei) * 1000000000000000000)).toString()
        ).send({ from: this.state.account });

        swal("Listing submitted", "Listing submitted and waiting to be confirmed...", "success", {
            button: "Awwww yeah!",
        });

        this.setState({
            name: '',
            description: '',
            image_id: '',
            price_in_wei: '',
            category: '',
            preview: null,
            loading: false
          });
        
    } catch(err) {
        console.log("ERR", err);
    }
    
  }

  render() {
    const {name, description, category, loading, image_id, price_in_wei} = this.state;

    const btn_disabled = name.length > 0 && category.length > 0 && description.length > 0 && image_id && price_in_wei > 0 ? false : true;
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
                <input onChange={this.onChange} type="number" placeholder="Price" name='price_in_wei' value={price_in_wei}/>
                <br/>
                <div style={{
                    position: 'relative',
                    paddingLeft: '8px'
                }}>
                    <Button variant="contained" color="secondary">
                        Upload Image
                    </Button>
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
                            height: '200px',
                            width: 'auto',
                            boxSizing: 'border-box',
                            objectFit: 'cover'
                        }} src={this.state.preview} alt="" /> :
                        null
                    }
                </div>
                <br/>
                <Button disabled={btn_disabled} variant="contained" color="primary" onClick={this.submit}>Add</Button>
            </div>
        }
      </div>
    )
  }
}
