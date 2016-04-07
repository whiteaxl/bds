// Import some code we need
import React, {View, Component, Text, StyleSheet, Dimensions, AlertIOS } from 'react-native';

import Button from 'react-native-button';

var Communications = require('react-native-communications');

// Create our component
var SearchResultDetailFooter = React.createClass({
  render: function() {
    return <View style={myStyles.searchButton}>
      <View style={myStyles.searchListButton}>
        <View style={myStyles.searchListButtonItem1}>
          <Button onPress={this.onCall}
            style={[myStyles.searchListButtonText, {color: 'gray'}]} >
            Gọi điện
          </Button>
        </View>
        <View style={myStyles.searchListButtonItem2}>
          <Button onPress={this.onChat}
            style={[myStyles.searchListButtonText, {color: 'white'}]} >
            Chat
          </Button>
        </View>
        <View style={myStyles.searchListButtonItem3}>
          <Button onPress={this.onAlertComment}
            style={[myStyles.searchListButtonText, {color: 'white'}]} >
            Lưu tin
          </Button>
        </View>
      </View>
    </View>
  },
  onCall() {
    Communications.phonecall(this.props.mobile, true);
  },
  onChat() {
    Communications.text(this.props.mobile);
  },
  onAlertComment() {
    AlertIOS.prompt('Nhập comment', null,
            [{
              text: 'Thực hiện',
              onPress: this.onComment
            }, {
              text: 'Thoát',
              style: 'cancel',
            }], 'plain-text', 'Default comment');
  },
  onComment(comment) {
    console.log("Comment value: " + comment);
  }
});

// Make this code available elsewhere
module.exports = SearchResultDetailFooter;


var myStyles = StyleSheet.create({
  searchListButtonItem1: {
      backgroundColor: 'white',
      width: Dimensions.get('window').width/3,
  },
  searchListButtonItem2: {
      backgroundColor: 'gray',
      width: Dimensions.get('window').width/3,
  },
  searchListButtonItem3: {
      backgroundColor: '#0070C0',
      width: Dimensions.get('window').width/3,
  },
  searchListButtonText: {
      margin: 10,
      alignItems: 'center',
      width: Dimensions.get('window').width/3,
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
