// Import some code we need
import React, {View, Component, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import {Actions} from 'react-native-router-flux';

import gui from '../lib/gui';

import SearchInput from './SearchInput';

// Create our component
var CommonHeader = React.createClass({
  render: function() {
    return <View style={mStyles.container}>
      <View style={mStyles.home}>
      <Icon.Button onPress={this._onHome}
        name="home" backgroundColor={gui.blue1}
        underlayColor="gray" color="white"
        >
      </Icon.Button>
      </View>
      <View style={mStyles.text}>
        <SearchInput placeName={this.props.placeName}/>
      </View>
      <View style={mStyles.search}>
      <Icon.Button onPress={this._onSearch}
        name="search" backgroundColor={gui.blue1}
        underlayColor="gray" color="white"
        >
      </Icon.Button>
      </View>
    </View>
  },
  _onHome: function() {
    Actions.Home();
  },
  _onSearch: function(){
    Actions.Search();
  }
});

// Make this code available elsewhere
module.exports = CommonHeader;

var mStyles = StyleSheet.create({
  container: {
      top: 0,
      flexDirection: 'row',
      alignItems: 'stretch',
      justifyContent: 'space-between',
      backgroundColor: gui.blue1,
  },
  search: {
      top: 23,
      alignItems: 'flex-end',
      justifyContent: 'center',
      backgroundColor: gui.blue1,
  },
  home: {
      top: 23,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: gui.blue1,
  },
  text: {
    backgroundColor: '#F5FCFF',
    position: 'absolute',
    left:30, 
    right:35, }
});
