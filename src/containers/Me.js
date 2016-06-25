'use strict';
import  React, {Component} from 'react';

import {View, Text, StyleSheet, TextInput} from 'react-native';
import {Actions} from 'react-native-router-flux';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as globalActions from '../reducers/global/globalActions';
import * as meActions from '../reducers/me/meActions';


import {Map} from 'immutable';

import {Alert} from "react-native";

import ScrollableTabView from 'react-native-scrollable-tab-view';

import gui from "../lib/gui";
import log from "../lib/logUtil";

import MeHeader from "../components/me/MeHeader";
import MeContent from "../components/me/MeContent";
import LoginRegister from '../containers/LoginRegister';

const actions = [
  globalActions,
  meActions
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

export default class Me extends React.Component {
  constructor(props) {
    super(props);
  }

  onChangeTab(data) {
    //this.props.actions.onAuthFieldChange('activeRegisterLoginTab',data.i);
  }

  renderTabBar() {
    return <AdsMgmtTabBar />
  }

  render() {
    if (this.props.global.loggedIn) {
      let page = this.props.adsMgmt.activeTab;

      return (
        <View style={{flex: 1, marginBottom: 45}}>
          <View style={styles.header}>
            <MeHeader />
          </View>

          <MeContent/>
        </View>
      )
    } else {
      return (
        <LoginRegister />
      );
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Me);

var styles = StyleSheet.create({
  container: {
    backgroundColor: "#f2f2f2",
    flex: 1
  },

  label: {
    fontSize: 15,
    fontWeight: "bold"
  },

  header: {
    backgroundColor: gui.mainColor,
    height: 64
  },

  input: {
    fontSize: 15,
    width: 200,
    height: 30,
    borderWidth: 1,
    alignSelf: 'center',
    padding: 5

  }
});