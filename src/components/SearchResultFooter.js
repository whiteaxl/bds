// Import some code we need
import React, {View, Component, Text, StyleSheet} from 'react-native';

import gui from '../lib/gui';

import {Actions} from 'react-native-router-flux';

import Icon from 'react-native-vector-icons/FontAwesome';

// Create our component
var SearchResultFooter = React.createClass({
  render: function() {
    return <View style={myStyles.searchButton}>
      <View style={myStyles.searchListButton}>
        <Icon.Button onPress={this.onSort}
          name="sort" backgroundColor="white"
          underlayColor="gray" color={gui.blue1}
          style={myStyles.searchListButtonText} >
          Sắp xếp
        </Icon.Button>
        <Icon.Button onPress={this.onSaveSearch}
          name="hdd-o" backgroundColor="white"
          underlayColor="gray" color={gui.blue1}
          style={myStyles.searchListButtonText} >
          Lưu tìm kiếm
        </Icon.Button>
        <Icon.Button onPress={this.onMap}
          name="map-o" backgroundColor="white"
          underlayColor="gray" color={gui.blue1}
          style={myStyles.searchListButtonText} >
          Bản đồ
        </Icon.Button>
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
      marginTop: 0,
      marginBottom: 0,
      flexDirection: 'column',
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
