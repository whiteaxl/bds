// Import some code we need
import React, {Component} from 'react';
import {View, Text, StyleSheet, AlertIOS, Dimensions} from 'react-native';

import {Actions} from 'react-native-router-flux';

import RelandIcon from './../RelandIcon';

import SortMenu from './../SortMenu';

import PlaceUtil from '../../lib/PlaceUtil';

import gui from '../../lib/gui';

import findApi from '../../lib/FindApi';

import Button from 'react-native-button';


// Create our component
var SearchResultFooter = React.createClass({
  render: function() {
    return <View style={myStyles.searchListButton}>
        <SortMenu isDiaDiem={this.props.center} scrollToTop={this.props.scrollToTop}/>
          <Button onPress={this._onAlertSaveSearch}
                  style={[myStyles.buttonText, {fontWeight : '500'}]}>Lưu tìm kiếm</Button>
          <Button onPress={this._onMap}
                  style={[myStyles.buttonText, {textAlign: 'right', paddingRight: 17}]}>Bản đồ</Button>
        {/*<RelandIcon onPress={this._onAlertSaveSearch} name="save" size={24} text="Lưu tìm kiếm" textProps={myStyles.buttonText}/>
        <RelandIcon onPress={this._onMap} name="map" size={18} iconProps={{style: {marginTop: 6}}} text="Bản đồ" textProps={myStyles.buttonText}/>
        */}
      </View>
  },

  _onSort() {
    Actions.OrderPicker();
  },

  _onAlertSaveSearch() {
     if (!this.props.loggedIn) {
       Actions.LoginRegister({page:1});
     } else {
       var name = this.props.placeName;
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
    console.log(this.props.token);

    let saveSearch = {
      name : name,
      query : this.props.query,
      timeModified : new Date().getTime()
    };

    this.props.saveSearch(this.props.userID, saveSearch, this.props.token);
  },

  _onMap() {
    console.log("On Map pressed!");
    Actions.SearchResultMap({type: "reset", viewport: this.props.viewport});
    console.log("On Map pressed completed");
  }
});



// Later on in your styles..
var myStyles = StyleSheet.create({
  searchListButton: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: 'white',
      height: 44
  },

  buttonText: {
      fontSize: gui.buttonFontSize,
      fontFamily: gui.fontFamily,
      fontWeight : 'normal',
      color: '#1396E0',
      textAlign: 'center',
      marginTop: 10,
      paddingLeft: 0,
      width: Dimensions.get('window').width/3
  }
});

// Make this code available elsewhere
module.exports = SearchResultFooter;
