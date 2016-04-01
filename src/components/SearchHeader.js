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
        name="home" backgroundColor="transparent"
        underlayColor="transparent" color={gui.blue1}
        >
      </Icon.Button>
      </View>
      <View style={mStyles.text}>
        <SearchInput />
      </View>
      <View style={mStyles.search}>
      <Icon.Button onPress={this._onSearch}
        name="search" backgroundColor="transparent"
        underlayColor="transparent" color={gui.blue1}
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
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: 'transparent',
  },
  search: {
      top: 22,
      alignItems: 'flex-end',
      justifyContent: 'center',
      backgroundColor: 'transparent',
  },
  home: {
      top: 22,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
  },
  text: {
    backgroundColor: '#F5FCFF',
    position: 'absolute',
    left:30, 
    right:35, }
});
