// Import some code we need
import React, {Component} from 'react';

import {View, Text, StyleSheet, Dimensions, AlertIOS } from 'react-native';

import TruliaIcon from './TruliaIcon';

import RelandIcon from './RelandIcon';

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
          <RelandIcon onPress={this.onChat} name="chat" color={'white'} size={22}
                      mainProps={[myStyles.searchListButtonItem2,{flexDirection: 'row'}]}
                      textProps={[myStyles.searchListButtonText2,{paddingLeft: 0}]}
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
      width: Dimensions.get('window').width/3-10,
      borderRadius: 5,
      borderColor: '#E2E2E2',
      height: 34,
      margin: 5,
      justifyContent: 'center'
  },
  searchListButtonItem2: {
      backgroundColor: '#EA9409',
      width: Dimensions.get('window').width/3-10,
      borderRadius: 5,
      borderColor: '#E2E2E2',
      height: 34,
      margin: 5,
      justifyContent: 'center'
  },
  searchListButtonItem3: {
      backgroundColor: '#1396E0',
      width: Dimensions.get('window').width/3-10,
      borderRadius: 5,
      borderColor: '#E2E2E2',
      height: 34,
      margin: 5,
      justifyContent: 'center'
  },
  searchListButtonText1: {
      marginLeft: 10,
      alignItems: 'center',
      backgroundColor: '#FB0007',
      color: 'white',
      fontFamily: gui.fontFamily,
      fontWeight: 'normal',
      fontSize: gui.normalFontSize
  },
  searchListButtonText2: {
      marginLeft: 10,
      alignItems: 'center',
      backgroundColor: '#EA9409',
      color: 'white',
      fontFamily: gui.fontFamily,
      fontWeight: 'normal',
      fontSize: gui.normalFontSize
  },
  searchListButtonText3: {
      marginLeft: 10,
      alignItems: 'center',
      backgroundColor: '#1396E0',
      color: 'white',
      fontFamily: gui.fontFamily,
      fontWeight: 'normal',
      fontSize: gui.normalFontSize
  },
  searchListButton: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: '#E2E2E2',
      width: Dimensions.get('window').width,
      height: 44
  },
  searchButton: {
      alignItems: 'center',
      justifyContent: 'flex-end'
  },
});
