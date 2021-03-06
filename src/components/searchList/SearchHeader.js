// Import some code we need
import React, {Component} from 'react';

import {View, Text, StyleSheet} from 'react-native';
import TruliaIcon from './../TruliaIcon';

import RelandIcon from './../RelandIcon';

import {Actions} from 'react-native-router-flux';

import gui from '../../lib/gui';

import HeaderSearchInput from './HeaderSearchInputExt';

// Create our component
var CommonHeader = React.createClass({
  render: function() {
    return <View style={mStyles.container}>
      <View style={mStyles.home}>
      <TruliaIcon onPress={this._onHome}
                  name="arrow-left" color={"white"}
                  mainProps={{paddingLeft: 20, paddingRight: 17}} size={28} />
          {/* <RelandIcon onPress={this._onHome}
        name="close" color="white" size={18}
        mainProps={{flexDirection: 'row', paddingLeft: 20, paddingRight: 17}}
        >
      </RelandIcon>*/}
      </View>
      <View style={mStyles.text}>
        <HeaderSearchInput placeName={this.props.placeName} refreshRegion={this.props.refreshRegion}
                           onShowMessage={this.props.onShowMessage}/>
      </View>
      <View style={mStyles.search}>
      <TruliaIcon onPress={this._onSearch}
        name="search" color="white" size={20}
        mainProps={{paddingLeft: 17, paddingRight: 21}}
        >
      </TruliaIcon>
      </View>
    </View>
  },

  _onHome: function() {
    Actions.Home({type:"reset"});
  },

  _onSearch: function(){
    Actions.Search({onShowMessage: this.props.onShowMessage, refreshRegion: this.props.refreshRegion,
                    owner: this.props.owner});
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
      height: 64
  },
  search: {
      marginTop: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: gui.mainColor
  },
  home: {
      marginTop: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: gui.mainColor
  },
  text: {
    backgroundColor: 'white',
    position: 'absolute',
    left:55,
    right:54
  }
});
