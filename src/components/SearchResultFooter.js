// Import some code we need
import React, {View, Component, Text, StyleSheet} from 'react-native';

import gui from '../lib/gui';

import {Actions} from 'react-native-router-flux';

import Button from 'react-native-button';

// Create our component
var SearchResultFooter = React.createClass({
  render: function() {
    return <View style={myStyles.searchButton}>
      <View style={myStyles.searchListButton}>
        <Button onPress={this.onSort}
          style={myStyles.searchListButtonText} >
          Sắp xếp
        </Button>
        <Button onPress={this.onSaveSearch}
          style={myStyles.searchListButtonText} >
          Lưu tìm kiếm
        </Button>
        <Button onPress={this.onMap}
          style={myStyles.searchListButtonText} >
          Bản đồ
        </Button>
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
  searchListButtonText: {
      marginLeft: 15,
      marginRight: 15,
      marginTop: 10,
      marginBottom: 10,
      color: gui.blue1,
      fontWeight : 'normal'
  },

  searchListButton: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: 'white',
  },

  searchButton: {
      alignItems: 'stretch',
      justifyContent: 'flex-end',
  },
});

// Make this code available elsewhere
module.exports = SearchResultFooter;
