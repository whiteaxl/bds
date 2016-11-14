// Import some code we need
import React, {Component} from 'react';

import {View, Text, StyleSheet, Dimensions, AlertIOS } from 'react-native';

import TruliaIcon from './../TruliaIcon';

import RelandIcon from './../RelandIcon';

import gui from '../../lib/gui';

import Communications from 'react-native-communications';

import {Actions} from 'react-native-router-flux';

// Create our component
var SearchResultDetailFooter = React.createClass({
  render: function() {
    const color = this.props.isLiked ? '#E50064' : 'white';
    return <View style={myStyles.searchButton}>
      <View style={[myStyles.searchListButton, this.props.style]}>
          <TruliaIcon onPress={this.onCall} name="phone" color={'white'} size={18}
                      mainProps={myStyles.searchListButtonItem1} textProps={myStyles.searchListButtonText1}
                      text={'Gọi điện'} />
          <RelandIcon onPress={this.props.onChat} name="chat" color={'white'} size={22}
                      mainProps={[myStyles.searchListButtonItem2,{flexDirection: 'row'}]}
                      textProps={[myStyles.searchListButtonText2,{paddingLeft: 0}]}
                      text={'Chat'} />
          <TruliaIcon onPress={this.onLike} name="heart" color={color} size={18}
                      mainProps={myStyles.searchListButtonItem3} textProps={myStyles.searchListButtonText3}
                      text={'Lưu tin'} />
      </View>
    </View>
  },
  onCall() {
    Communications.phonecall(this.props.mobile, true);
  },

  onLike() {
    if (!this.props.loggedIn) {
        //this.props.actions.onAuthFieldChange('activeRegisterLoginTab',0);
        Actions.Login();
    } else {
        if (!this.props.isLiked) {
            this.props.likeAds(this.props.userID, this.props.ads.adsID)
        } else {
            this.props.unlikeAds(this.props.userID, this.props.ads.adsID)
        }
    }
  }
});

// Make this code available elsewhere
module.exports = SearchResultDetailFooter;


var myStyles = StyleSheet.create({
  searchListButtonItem1: {
      backgroundColor: '#F53113',
      width: Dimensions.get('window').width/3-3,
      borderRadius: 5,
      borderColor: 'transparent',
      height: 38,
      marginLeft: 2,
      justifyContent: 'center'
  },
  searchListButtonItem2: {
      backgroundColor: '#E99409',
      width: Dimensions.get('window').width/3-3,
      borderRadius: 5,
      borderColor: 'transparent',
      height: 38,
      marginLeft: 2,
      justifyContent: 'center'
  },
  searchListButtonItem3: {
      backgroundColor: '#1396E0',
      width: Dimensions.get('window').width/3-3,
      borderRadius: 5,
      borderColor: 'transparent',
      height: 38,
      marginLeft: 2,
      marginRight: 2,
      justifyContent: 'center'
  },
  searchListButtonText1: {
      marginLeft: 5,
      alignItems: 'center',
      backgroundColor: 'transparent',
      color: 'white',
      fontFamily: gui.fontFamily,
      fontWeight: 'normal',
      fontSize: gui.normalFontSize
  },
  searchListButtonText2: {
      marginLeft: 5,
      alignItems: 'center',
      backgroundColor: 'transparent',
      color: 'white',
      fontFamily: gui.fontFamily,
      fontWeight: 'normal',
      fontSize: gui.normalFontSize
  },
  searchListButtonText3: {
      marginLeft: 5,
      alignItems: 'center',
      backgroundColor: 'transparent',
      color: 'white',
      fontFamily: gui.fontFamily,
      fontWeight: 'normal',
      fontSize: gui.normalFontSize
  },
  searchListButton: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: 'transparent',
      width: Dimensions.get('window').width,
      borderTopColor: '#EBEBEB',
      borderTopWidth: 1,
      height: 44
  },
  searchButton: {
      alignItems: 'center',
      justifyContent: 'flex-start',
      backgroundColor: 'transparent'
  },
});
