import React, { Component } from 'react'

export default class extends Component {
  render() {
    return (
      <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          height: '76px'
      }}>
        <img style={{
            position: 'absolute',
            left: '40px',
            top: '10px',
            height: '68px'
        }} src="/img/logo.png"/>
        <img style={{
            position: 'absolute',
            left: '130px',
            top: '35px',
            height: '21px'
        }} src="/img/logo2.png"/>
      </div>
    )
  }
}
