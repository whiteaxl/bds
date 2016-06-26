// Import some code we need
import React, {Component} from 'react';
import {View, Text, StyleSheet, AlertIOS} from 'react-native';

import {Actions} from 'react-native-router-flux';

import RelandIcon from './RelandIcon';

import SortMenu from './SortMenu';

import PlaceUtil from '../lib/PlaceUtil';

import gui from '../lib/gui';

import findApi from '../lib/FindApi';



// Create our component
var SearchResultFooter = React.createClass({
  render: function() {
    return <View style={myStyles.searchButton}>
      <View style={myStyles.searchListButton}>
        <SortMenu isDiaDiem={PlaceUtil.isDiaDiem(this.props.place)}/>
        <RelandIcon onPress={this._onAlertSaveSearch} name="save" size={24} text="Lưu tìm kiếm" textProps={myStyles.buttonText}/>
        <RelandIcon onPress={this._onMap} name="map" size={18} iconProps={{style: {marginTop: 6}}} text="Bản đồ" textProps={myStyles.buttonText}/>
      </View>
    </View>
  },

  _onSort() {
    Actions.OrderPicker();
  },

  _onAlertSaveSearch() {
    if (!this.props.loggedIn) {
      Actions.LoginRegister({page:1});
    } else {
      var name = this.props.place.fullName;
      AlertIOS.prompt('Tên tìm kiếm cần lưu', 'Ví dụ: Gần chỗ làm, gần bệnh viện',
        [{
          text: 'Lưu lại',
          onPress: this._onSaveSearch
        }, {
          text: 'Thoát',
          style: 'cancel'
        }], 'plain-text', name);
    }
  },

  _onSaveSearch(name) {
    console.log("On Save Search pressed!", name);

    let saveSearch = {
      name : name,
      query : this.props.query,
      timeModified : new Date().getTime()
    };

    this.props.saveSearch(this.props.userID, saveSearch);
  },

  _onMap() {
    console.log("On Map pressed!");
    Actions.SearchResultMap({type: "reset"});
    console.log("On Map pressed completed");
  }
});



// Later on in your styles..
var myStyles = StyleSheet.create({
  searchListButton: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: 'white',
      borderTopWidth: 1,
      borderColor : 'lightgray',
      height: 44
  },

  searchButton: {
      alignItems: 'stretch',
      justifyContent: 'flex-end'
  },

  buttonText: {
      fontSize: 11,
      fontFamily: gui.fontFamily,
      paddingLeft: 0
  }
});

// Make this code available elsewhere
module.exports = SearchResultFooter;
