// Import some code we need
import React, {View, Component, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import TruliaIcon from './TruliaIcon';

import {Actions} from 'react-native-router-flux';

import gui from '../lib/gui';

import HeaderSearchInput from './HeaderSearchInput';

// Create our component
var CommonHeader = React.createClass({
  render: function() {
    return <View style={mStyles.container}>
      <View style={mStyles.home}>
      <TruliaIcon onPress={this._onHome}
        name="menu" color="white" size={20}
        >
      </TruliaIcon>
      </View>
      <View style={mStyles.text}>
        <HeaderSearchInput placeName={this.props.placeName}/>
      </View>
      <View style={mStyles.search}>
      <TruliaIcon onPress={this._onSearch}
        name="search" color="white" size={18}
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
      height: 60
  },
  search: {
      marginTop: 15,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: gui.mainColor,
      marginRight: 16
  },
  home: {
      marginTop: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: gui.mainColor,
      marginLeft: 16
  },
  text: {
    backgroundColor: '#F5FCFF',
    position: 'absolute',
    left:36,
    right:35
  }
});
