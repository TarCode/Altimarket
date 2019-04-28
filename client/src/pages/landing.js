import React, { Component } from 'react'
import Button from '@material-ui/core/Button';

export default class  extends Component {
  render() {
    return (
      <div className='container' style={{
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'center',
        justifyItems: 'center',
        alignSelf: 'center',
        height: '100vh'
      }}>
            <div style={{
              width: '100%',
              maxWidth: '700px'
            }}>
              <img style={{
                height: 'auto',
                maxWidth: '150px',
                paddingLeft: '20px',
                width: 'auto'
              }} className='container' src='/img/logo.png'/>
              <br/>
              <img style={{
                height: 'auto',
                maxWidth: '200px',
                width: 'auto'
              }}  className='container' src='/img/logo2.png'/>
              <br/>
              <div style={{
                fontSize: '150%'
              }}>
                <h1><small>The decentralized<br/></small> 
                  <span style={{
                    textDecoration: 'underline'
                  }}>Classified Ads</span>
                <small><br/>platform</small></h1>
                <p>Buy, sell and rent stuff for Ether</p>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => this.props.history.push('/main') }
                >
                    Connect wallet and browse
                </Button>
              </div>
            </div>
      </div>
    )
  }
}
