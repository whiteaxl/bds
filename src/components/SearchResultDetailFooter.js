// Import some code we need
import React, {View, Component, Text, StyleSheet} from 'react-native';

import gui from '../lib/gui';

import Icon from 'react-native-vector-icons/FontAwesome';

// Create our component
var SearchResultDetailFooter = React.createClass({
  render: function() {
    return <View style={myStyles.searchButton}>
      <View style={myStyles.searchListButton}>
        <Icon.Button onPress={this.onContact}
          name="hdd-o" backgroundColor="white"
          underlayColor="gray" color={gui.blue1}
          style={myStyles.searchListButtonText} >
          Liên hệ
        </Icon.Button>
        <Icon.Button onPress={this.onChat}
          name="comment-o" backgroundColor="white"
          underlayColor="gray" color={gui.blue1}
          style={myStyles.searchListButtonText} >
          Trò chuyện
        </Icon.Button>
        <Icon.Button onPress={this.onComment}
          name="sticky-note-o" backgroundColor="white"
          underlayColor="gray" color={gui.blue1}
          style={myStyles.searchListButtonText} >
          Chú thích
        </Icon.Button>
      </View>
    </View>
  },
  onContact() {
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

