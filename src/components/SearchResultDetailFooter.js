// Import some code we need
import React, {View, Component, Text, StyleSheet, Dimensions, AlertIOS } from 'react-native';

import Button from 'react-native-button';

import TruliaIcon from './TruliaIcon';

import gui from '../lib/gui';

var Communications = require('react-native-communications');

// Create our component
var SearchResultDetailFooter = React.createClass({
  render: function() {
    return <View style={myStyles.searchButton}>
      <View style={myStyles.searchListButton}>
          <TruliaIcon onPress={this.onCall} name="phone" color={'white'} size={18}
                      mainProps={myStyles.searchListButtonItem1} textProps={myStyles.searchListButtonText1}
                      text={'Gọi điện'} />
          <TruliaIcon onPress={this.onChat} name="chat" color={'white'} size={18}
                      mainProps={myStyles.searchListButtonItem2} textProps={myStyles.searchListButtonText2}
                      text={'Chat'} />
          <TruliaIcon onPress={this.onAlertComment} name="heart" color={'white'} size={18}
                      mainProps={myStyles.searchListButtonItem3} textProps={myStyles.searchListButtonText3}
                      text={'Lưu tin'} />
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
      backgroundColor: '#FB0007',
      width: Dimensions.get('window').width/3,
      borderRadius: 2,
      borderColor: '#E2E2E2'
  },
  searchListButtonItem2: {
      backgroundColor: '#EA9409',
      width: Dimensions.get('window').width/3,
      borderRadius: 2,
      borderColor: '#E2E2E2'
  },
  searchListButtonItem3: {
      backgroundColor: '#1396E0',
      width: Dimensions.get('window').width/3,
      borderRadius: 2,
      borderColor: '#E2E2E2'
  },
  searchListButtonText1: {
      margin: 10,
      alignItems: 'center',
      width: Dimensions.get('window').width/3,
      backgroundColor: '#FB0007',
      color: 'white',
      fontFamily: gui.fontFamily,
      fontWeight: 'normal',
      fontSize: bui.normalFontSize
  },
  searchListButtonText2: {
      margin: 10,
      alignItems: 'center',
      width: Dimensions.get('window').width/3,
      backgroundColor: '#EA9409',
      color: 'white',
      fontFamily: gui.fontFamily,
      fontWeight: 'normal',
      fontSize: bui.normalFontSize
  },
  searchListButtonText3: {
      margin: 10,
      alignItems: 'center',
      width: Dimensions.get('window').width/3,
      backgroundColor: '#1396E0',
      color: 'white',
      fontFamily: gui.fontFamily,
      fontWeight: 'normal',
      fontSize: bui.normalFontSize
  },
  searchListButton: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: '#E2E2E2',
      height: 44
  },
  searchButton: {
      alignItems: 'stretch',
      justifyContent: 'flex-end'
  },
});
