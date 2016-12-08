'use strict';
import  React, {Component} from 'react';

import {View, Text, StyleSheet, TextInput, Dimensions} from 'react-native';
import {Actions} from 'react-native-router-flux';


import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as globalActions from '../reducers/global/globalActions';
import * as adsMgmtActions from '../reducers/adsMgmt/adsMgmtActions';
import * as searchActions from '../reducers/search/searchActions';

var { width, height } = Dimensions.get('window');

import {Map} from 'immutable';

import {Alert} from "react-native";

import ScrollableTabView from 'react-native-scrollable-tab-view';

import gui from "../lib/gui";
import log from "../lib/logUtil";

import AdsMgmtTabBar from "../components/adsMgmt/AdsMgmtTabBar";
import AdsListTab from '../components/adsMgmt/AdsListTab';
import Login from '../components/login/Login';

import HomeHeader from '../components/home/HomeHeader';


const actions = [
  globalActions,
  adsMgmtActions,
  searchActions
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

class AdsMgmt extends React.Component {
  constructor(props) {
    super(props);
  }

  onChangeTab(data) {
    this.props.actions.onAdsMgmtFieldChange('activeTab',data.i);
  }

  renderTabBar() {
    return <AdsMgmtTabBar />
  }

  componentDidMount() {
    log.info("AdsMgmt - componentDidMount");
    //todo: temporary disable
    //this.props.actions.loadMySellRentList(this.props.global.currentUser.userID);
    //this.props.actions.loadLikedList(this.props.global.currentUser.userID);
  }

  render() {
    if (this.props.global.loggedIn) {
      let page = this.props.adsMgmt.activeTab;

      return (
        <View style={{flex: 1, marginBottom: 45}}>
          <HomeHeader/>

          <ScrollableTabView page={page} initialPage={0}
                             renderTabBar={this.renderTabBar.bind(this)}
                             locked = {true}
                             style={styles.container}
                             tabBarUnderlineColor={gui.mainColor}
                             tabBarActiveTextColor={gui.mainColor}
                             onChangeTab={this.onChangeTab.bind(this)}
          >
            <AdsListTab name="likedTab" tabLabel="ĐÃ LƯU" ref="likedTab"
                        listAds={this.props.adsMgmt.likedList} source={"server"}
                        likeAds={this.props.actions.likeAds}
                        unlikeAds={this.props.actions.unlikeAds}
            />
            <AdsListTab name="sellTab" tabLabel="BÁN" ref="sellTab"
                        listAds={this.props.adsMgmt.sellList} source={"server"}
            />
            <AdsListTab name="rentTab" tabLabel="CHO THUÊ" ref="rentTab"
                        listAds={this.props.adsMgmt.rentList} source={"server"}
            />
          </ScrollableTabView>
        </View>
      )
    } else {
      return (
        <Login />
      );
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AdsMgmt);

var styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    width: width

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