// Import some code we need
import React, {View, Component, Text, StyleSheet, Dimensions, AlertIOS } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

var Communications = require('react-native-communications');

// Create our component
var SearchResultDetailFooter = React.createClass({
  render: function() {
    return <View style={myStyles.searchButton}>
      <View style={myStyles.searchListButton}>
        <View style={myStyles.searchListButtonItem1}>
          <Icon.Button onPress={this.onCall}
            name="phone" backgroundColor="white"
            underlayColor="gray" color='gray'
            style={myStyles.searchListButtonText} >
            Call
          </Icon.Button>
        </View>
        <View style={myStyles.searchListButtonItem2}>
          <Icon.Button onPress={this.onChat}
            name="commenting-o" backgroundColor="gray"
            underlayColor="white" color='white'
            style={myStyles.searchListButtonText} >
            Chat
          </Icon.Button>
        </View>
        <View style={myStyles.searchListButtonItem3}>
          <Icon.Button onPress={this.onAlertComment}
            name="comment-o" backgroundColor='#0070C0'
            underlayColor="white" color='white'
            style={myStyles.searchListButtonText} >
            Comment
          </Icon.Button>
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
      margin: 0,
      flexDirection: 'column',
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
