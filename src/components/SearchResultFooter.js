// Import some code we need
import React, {View, Component, Text, StyleSheet} from 'react-native';

import gui from '../lib/gui';

import {Actions} from 'react-native-router-flux';

import Button from 'react-native-button';

import RelandIcon from './RelandIcon'

// Create our component
var SearchResultFooter = React.createClass({
  render: function() {
    return <View style={myStyles.searchButton}>
      <View style={myStyles.searchListButton}>
        <RelandIcon onPress={this.onSort} name="sort" text="Sắp xếp"/>
        <RelandIcon onPress={this.onSaveSearch} name="save" text="Lưu tìm kiếm"/>
        <RelandIcon onPress={this.onMap} name="map" size={16} text="Bản đồ"/>
      </View>
    </View>
  },
  onSort() {
    Actions.OrderPicker();
  },
  onSaveSearch() {
    console.log("On Save Search pressed!");
  },
  onMap() {
    Actions.SearchResultMap();
  }
});



// Later on in your styles..
var myStyles = StyleSheet.create({
  searchListButton: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: 'white',
      height: 45
  },

  searchButton: {
      alignItems: 'stretch',
      justifyContent: 'flex-end',
  }
});

// Make this code available elsewhere
module.exports = SearchResultFooter;
