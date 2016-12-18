'use strict';
import  React, {Component} from 'react';
import {View, Text, StyleSheet, TextInput, Dimensions, Image, TouchableOpacity} from 'react-native';
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
import TruliaIcon from '../components/TruliaIcon';

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

  _renderHeaderAds(){
    return (
        <View style={styles.pageHeader}>
          <View style={styles.searchButton}>
            <TruliaIcon onPress={() => this.handleSearchButton()}
                        name="search" color="white" size={20}
                        mainProps={{paddingLeft: 18, paddingRight: 21}}
            >
            </TruliaIcon>
          </View>
          <View style={styles.home}>
            <Image
                style={styles.logoIcon}
                resizeMode={Image.resizeMode.cover}
                source={require('../assets/image/logo.png')}
            />
          </View>
          <TouchableOpacity style={styles.viewEdit}>
            <Text style={styles.textEdit}>Sửa</Text>
          </TouchableOpacity>
        </View>
    );
  }

  render() {
    if (this.props.global.loggedIn) {
      let page = this.props.adsMgmt.activeTab;

      return (
        <View style={{flex: 1, marginBottom: 45}}>
          <HomeHeader />
          {/*this._renderHeaderAds()*/}

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

  },
  pageHeader: {
    top: 0,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    backgroundColor: gui.mainColor,
    height: 64
  },
  searchButton: {
    paddingTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: gui.mainColor
  },
  logoIcon: {
    height: 21,
    width: 87,
    marginTop: 0,
    marginLeft: 19,
    marginRight: 16
  },
  home: {
    paddingTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: gui.mainColor
  },
  viewEdit: {
    paddingTop: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: gui.mainColor
  },
  textEdit:{
    fontSize:gui.buttonFontSize,
    fontFamily:gui.fontFamily,
    color:'#fff',
    paddingRight: 18,
    paddingLeft: 18
  }
});