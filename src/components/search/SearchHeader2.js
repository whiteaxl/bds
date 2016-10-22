// Import some code we need
import React, {Component} from 'react';

import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import TruliaIcon from './../TruliaIcon';

import RelandIcon from './../RelandIcon';

import {Actions} from 'react-native-router-flux';

import gui from '../../lib/gui';

import SearchInputExt from './SearchInputExt2';

// Create our component
var CommonHeader = React.createClass({
  render: function() {
    return <View style={mStyles.container}>
      <View style={mStyles.home}>
      <TruliaIcon onPress={this._onHome}
                  name="arrow-left" color={"white"}
                  mainProps={{paddingLeft: 20, paddingRight: 12}} size={28} />
          {/* <RelandIcon onPress={this._onHome}
        name="close" color="white" size={18}
        mainProps={{flexDirection: 'row', paddingLeft: 20, paddingRight: 17}}
        >
      </RelandIcon>*/}
      </View>
      <View style={mStyles.text}>
        <SearchInputExt placeName={this.props.placeName} refreshRegion={this.props.refreshRegion}
                           onShowMessage={this.props.onShowMessage} isHeaderLoading={this.props.isHeaderLoading}
                           loadHomeData={this.props.loadHomeData} owner={this.props.owner}/>
      </View>
      <View style={mStyles.search}>
      <TouchableOpacity onPress={this._onSearch} underlayColor="transparent"
        style={{paddingLeft: 7, paddingRight: 15}}
        >
          <Text style={mStyles.titleText}>Lọc</Text>
      </TouchableOpacity>
      </View>
    </View>
  },

  _onHome: function() {
    Actions.Home({type:"reset"});
  },

  _onSearch: function(){
    Actions.Search2({needBack:true, onShowMessage: this.props.onShowMessage, refreshRegion: this.props.refreshRegion,
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
    backgroundColor: 'transparent',
    position: 'absolute',
    left:50,
    right:40
  },
  titleText: {
      backgroundColor: 'transparent',
      color: 'white',
      fontFamily: gui.fontFamily,
      fontSize: 16,
      fontWeight: '600'
  }
});
