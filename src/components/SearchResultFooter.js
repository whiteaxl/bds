// Import some code we need
import React, {View, Component, Text, StyleSheet} from 'react-native';

import {Actions} from 'react-native-router-flux';

import RelandIcon from './RelandIcon'

// Create our component
var SearchResultFooter = React.createClass({
  render: function() {
    return <View style={myStyles.searchButton}>
      <View style={myStyles.searchListButton}>
        <RelandIcon onPress={this.onSort} name="sort" size={16} text="Sắp xếp" textProps={myStyles.buttonText}/>
        <RelandIcon onPress={this.onSaveSearch} name="save" size={16} text="Lưu tìm kiếm" textProps={myStyles.buttonText}/>
        <RelandIcon onPress={this.onMap} name="map" size={12} iconProps={{style: {marginTop: 4}}} text="Bản đồ" textProps={myStyles.buttonText}/>
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
      borderTopWidth: 1,
      borderColor : 'lightgray'
  },

  searchButton: {
      alignItems: 'stretch',
      justifyContent: 'flex-end',
  },

  buttonText: {
      fontSize: 11,
      fontFamily: 'Open Sans'
  }
});

// Make this code available elsewhere
module.exports = SearchResultFooter;
