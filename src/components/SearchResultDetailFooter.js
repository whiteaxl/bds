// Import some code we need
import React, {View, Component, Text, StyleSheet} from 'react-native';
import Button from 'react-native-button';

import gui from '../lib/gui';

// Create our component
var SearchResultDetailFooter = React.createClass({
  render: function() {
    return <View style={myStyles.searchButton}>
      <View style={myStyles.searchListButton}>
        <Button onPress={this.onSave}
          style={myStyles.searchListButtonText}>Lưu lại</Button>
        <Button onPress={this.onChat}
          style={myStyles.searchListButtonText}>Trò chuyện</Button>
        <Button onPress={this.onComment}
          style={myStyles.searchListButtonText}>Chú thích</Button>
      </View>
    </View>
  },
  onSave() {
    console.log("On Save pressed!");
  },
  onChat() {
    console.log("On Chat pressed!");
  },
  onComment() {
    console.log("On Comment pressed!");
  }
});

// Make this code available elsewhere
module.exports = SearchResultDetailFooter;


var myStyles = StyleSheet.create({
  searchListButtonText: {
      marginLeft: 15,
      marginRight: 15,
      marginTop: 10,
      marginBottom: 10,
      color: gui.blue1
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

