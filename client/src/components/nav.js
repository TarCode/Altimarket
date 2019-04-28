import React, { Component } from 'react'
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import ListingIcon from '@material-ui/icons/List';
import AddIcon from '@material-ui/icons/Add';
import SettingsIcon from '@material-ui/icons/Settings';

export default class extends Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    if (value === 0) {
      this.props.history.push('/')
    } else if (value === 1) {
      this.props.history.push('/add')
    } 
    this.setState({ value });
  };
  render() {
    const { value } = this.state
    return (
      <BottomNavigation
        value={value}
        onChange={this.handleChange}
        showLabels
        style={{
          position: 'fixed',
          width: '100%',
          bottom: 0,
          left: 0, right: 0,
          zIndex: 10001
        }}
      >
        <BottomNavigationAction label="Listings" icon={<ListingIcon />} />
        <BottomNavigationAction label="Add listing" icon={<AddIcon />} />
        <BottomNavigationAction label="Settings" icon={<SettingsIcon />} />
      </BottomNavigation>
    )
  }
}
