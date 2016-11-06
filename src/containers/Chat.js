'use strict';

import  React, {Component} from 'react';

import {View, Text, StyleSheet, ScrollView} from 'react-native';

import {Actions} from 'react-native-router-flux';
import log from "../lib/logUtil";
import gui from "../lib/gui";
import {Map} from 'immutable';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as globalActions from '../reducers/global/globalActions';
import * as chatActions from '../reducers/chat/chatActions';

import HomeHeader from '../components/home/HomeHeader';

import ChatContent from "../components/chat/ChatContent";
import ChatHeader from "../components/chat/ChatHeader";

import chatApi  from "../lib/ChatApi";


const actions = [
  globalActions, chatActions
];

function mapStateToProps(state) {
  return {
    ...state
  };
}

function mapDispatchToProps(dispatch) {
  const creators = Map()
    .merge(...actions)
    .filter(value => typeof value === 'function')
    .toObject();

  return {
    actions: bindActionCreators(creators, dispatch),
    dispatch
  };
}

class Chat extends Component {
  constructor(props) {
    super(props);
    //props.partner, props.ads
    //chatApi.onNewMsg();
  }

  render() {
    return (
      <View style={styles.container}>
        <ChatHeader/>
        <ChatContent/>
      </View>
    );
  }
}


var styles = StyleSheet.create({
  container: {
    paddingTop: 0,
    backgroundColor: "white",
    flex: 1,
  },

  content: {
    paddingTop: 0,
    backgroundColor: "white",
    flex: 1,
  },

  scrollContainer: {
    paddingTop: 0,
    backgroundColor: "white",
  },

  label: {
    fontSize: 15,
    fontWeight: "bold"
  },

  input: {
    fontSize: 15,
    width: 200,
    height: 30,
    borderWidth: 1,
    alignSelf: 'center',
    padding: 5

  },
  tabbar: {
    flexDirection: 'row',
    paddingLeft: 5,
    paddingRight: 5,
    borderColor: '#e6e6e6',
    borderBottomWidth: 1,
    paddingTop: 2
  },

});


export default connect(mapStateToProps, mapDispatchToProps)(Chat);