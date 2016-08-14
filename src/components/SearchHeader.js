// Import some code we need
import React, {Component} from 'react';

import {View, Text, StyleSheet} from 'react-native';
import TruliaIcon from './TruliaIcon';

import RelandIcon from './RelandIcon';

import {Actions} from 'react-native-router-flux';

import gui from '../lib/gui';

import HeaderSearchInput from './HeaderSearchInput';

// Create our component
var CommonHeader = React.createClass({
  render: function() {
    return <View style={mStyles.container}>
      <View style={mStyles.home}>
      <RelandIcon onPress={this._onHome}
        name="close" color="white" size={20}
        mainProps={{marginTop: 16, paddingLeft: 16, paddingRight: 16}}
        >
      </RelandIcon>
      </View>
      <View style={mStyles.text}>
        <HeaderSearchInput placeName={this.props.placeName}/>
      </View>
      <View style={mStyles.search}>
      <TruliaIcon onPress={this._onSearch}
        name="search" color="white" size={18}
        mainProps={{paddingLeft: 16, paddingRight: 16}}
        >
      </TruliaIcon>
      </View>
    </View>
  },

  _onHome: function() {
    Actions.Home({type:"reset"});
  },

  _onSearch: function(){
    Actions.Search({needBack:true});
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
      backgroundColor: gui.mainColor,
      height: 62.5
  },
  search: {
      marginTop: 15,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: gui.mainColor
  },
  home: {
      marginTop: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: gui.mainColor
  },
  text: {
    backgroundColor: 'white',
    position: 'absolute',
    left:52,
    right:52
  }
});
