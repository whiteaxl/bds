'use strict';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as globalActions from '../reducers/global/globalActions';
import * as searchActions from '../reducers/search/searchActions';

import {Map} from 'immutable';

import  React, {Component} from 'react';

import { Text, StyleSheet, View, ScrollView, RefreshControl, Image, Dimensions, TouchableOpacity, StatusBar } from 'react-native'

import {Actions} from 'react-native-router-flux';

import TruliaIcon from '../components/TruliaIcon';

import RelandIcon from '../components/RelandIcon';

import Icon from 'react-native-vector-icons/FontAwesome';

import LinearGradient from 'react-native-linear-gradient';

import gui from '../lib/gui';
import log from '../lib/logUtil';

import HomeCollection from '../components/home/HomeCollection';

import GiftedSpinner from 'react-native-gifted-spinner';

import HomeHeader from '../components/home/HomeHeader';

var { width, height } = Dimensions.get('window');
var imageHeight = 143;

const actions = [
  globalActions,
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


class Home extends Component {
  componentDidMount() {
    log.info("call home.componentWillMount");
    StatusBar.setBarStyle('light-content');
    if (this._isTheFirstLoading()) {
      this.props.actions.loadHomeData();
    } else {
      let recentSearchList = this.props.search.recentSearchList;
      recentSearchList.sort((a, b) => b.timeModified - a.timeModified);

      var newSearch = recentSearchList[0];

      if (!newSearch || !newSearch.query.diaChinh
          || !newSearch.query.diaChinh.tinhKhongDau
          || newSearch.query.diaChinh.duAnKhongDau){
        return;
      }

      if (recentSearchList.length = 1){
        this.props.actions.loadHomeData();
      } else {
        var oldSearch = recentSearchList[1];
        if (newSearch.query.diaChinh.fullName != oldSearchquery.diaChinh.fullName
            || newSearch.query.loaiTin != oldSearchquery.loaiTin
            || JSON.stringify(newSearch.query.dienTichBETWEEN)!=JSON.stringify(oldSearch.query.dienTichBETWEEN)
            || JSON.stringify(newSearch.query.giaBETWEEN)!=JSON.stringify(oldSearch.query.giaBETWEEN)
            || JSON.stringify(newSearch.query.huongNha)!=JSON.stringify(oldSearch.query.huongNha))
        {
          this.props.actions.loadHomeData();
        }
      }
    }
  }

  renderCollections(collections) {
    let adsLikes = [];
    let userID = null;
    if (this.props.global.loggedIn) {
      let currentUser = this.props.global.currentUser;
      adsLikes = currentUser && currentUser.adsLikes;
      userID = currentUser && currentUser.userID;
    }

    return collections.map(e => {
      return <HomeCollection key={e.title1} collectionData = {e} searchFromHome={this.props.actions.searchFromHome}
                             onResetSearch={() => this.onResetSearch()}
                             adsLikes={adsLikes} loggedIn={this.props.global.loggedIn}
                             likeAds={this.props.actions.likeAds}
                             unlikeAds={this.props.actions.unlikeAds} userID={userID}
                             loadHomeData={this.props.actions.loadHomeData}/>
    });
  }

  onResetSearch() {
    this.props.actions.onSearchFieldChange("orderBy", '');
    this.props.actions.onResetAdsList();
  }

  renderContent(collections) {
    if (this.props.search.homeDataErrorMsg) {
      return (
        <View style={{flex:1, alignItems:'center', justifyContent:'center', marginTop: 30}}>
          <Text style={styles.welcome}>{this.props.search.homeDataErrorMsg}</Text>
        </View>
      )
    }

    return (
      <ScrollView
        automaticallyAdjustContentInsets={false}
        showsVerticalScrollIndicator={false}
        vertical={true}
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={this.props.search.homeRefreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }
      >

        {this.renderCollections(collections)}

        <View style={{height:40}}></View>
      </ScrollView>
    );
  }

  _renderLoadingView(placeName) {
    return (
      <View style={styles.fullWidthContainer}>
        <HomeHeader placeName={placeName} />

        <View style={[styles.homeDetailInfo, {marginBottom: 64}]}>
          {/*<Text> Loading ... </Text>*/}
          <GiftedSpinner size="large" />
        </View>
      </View>
    );
  }

  _onRefresh(){
    log.info("_onRefresh Home");
    this.props.actions.loadHomeData();
  }

  _getHeaderTitle() {
    let diaChinh = this.props.search.form.fields.diaChinh;

    //1. Search by diaChinh, then name = diaChinh's name
    if (this.props.search.map.polygons && this.props.search.map.polygons.length) {
      //placeName = `[${r.latitude}, ${r.longitude}]`
      return 'Trong khu vực vẽ tay';
    }

    if (this.props.search.form.fields.center && Object.keys(this.props.search.form.fields.center).length > 0) {
      return 'Xung quanh vị trí hiện tại';
    }

    let placeName;
    //2. Search by Polygon: name is just center
    if (diaChinh.tinhKhongDau) {
      placeName = diaChinh.fullName;
    } else { //others: banKinh or currentLocation
      //let geoBox = apiUtils.getBbox(r);
      //placeName = geoBox.toString()
      placeName = 'Tìm tất cả theo khung nhìn'
    }

    return placeName;
  }

  _isTheFirstLoading(){
    let recentSearchList = this.props.search.recentSearchList;
    let collections = this.props.search.collections;
    let empty = false;
    if (collections.length ==1 && collections[0].title1 == '')
        empty = true;

    return ((!recentSearchList || (recentSearchList && recentSearchList.length <= 0)) && empty)
  }

  render() {
    log.info("call home.render", this.props.search.collections, this.props.search.homeDataErrorMsg);
    let placeName = this._getHeaderTitle();

    if (this.props.search.loadingHomeData && this._isTheFirstLoading()) {
      return this._renderLoadingView(placeName);
    }
    return (
      <View style={styles.fullWidthContainer}>
        <HomeHeader placeName={placeName} />

        <View style={styles.homeDetailInfo}>
          {this.renderContent(this.props.search.collections)}
        </View>

        {this._renderHeaderLoadingView()}

      </View>
		)
	}

  _renderHeaderLoadingView() {
    if (this.props.search.loadingHomeData) {
      return (<View style={styles.resultContainer}>
        <View style={styles.loadingContent}>
          <GiftedSpinner color="white" />
        </View>
      </View>)
    }
  }
}


var styles = StyleSheet.create({
  loadingContent: {
    position: 'absolute',
    top: -23,
    left: width/2 - 71,
    alignItems: 'center',
    justifyContent: 'center'
  },
  resultContainer: {
    position: 'absolute',
    top: 64,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginVertical: 0,
    marginBottom: 0,
    backgroundColor: 'transparent'
  },
  logoIcon: {
    height: 21,
    width: 99,
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
  title: {
    backgroundColor: 'transparent',
    position: 'absolute',
    left:113,
    right:60
  },
  titleText: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 20,
    marginTop: 32,
    textAlign: 'center',
    color: 'white'
  },
  searchButton: {
    paddingTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: gui.mainColor
  },
  fullWidthContainer: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: 'white',
  },
  homeDetailInfo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
    marginBottom: 49
  },
  pageHeader: {
    top: 0,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    backgroundColor: gui.mainColor,
    height: 64
  },
  search: {
    backgroundColor: gui.mainColor,
    height: 61
  },
  imgItem: {
    flex:1,
    alignItems: 'flex-start',
    height:imageHeight
  },
  imgItem_55: {
    flex:1,
    justifyContent: 'flex-start',
    height:imageHeight,
    width: (width*0.55)-1,
  },
  imgItem_45: {
    flex:1,
    alignItems: 'flex-start',
    width: (width*0.45)-1,
    height:imageHeight
  },
  imgItem_100: {
    flex:1,
    alignItems: 'flex-start',
    width: width,
    height:imageHeight
  },
  column: {
    flex:1,
    alignItems: "center"
  },
  boldTitle: {
    fontFamily: gui.fontFamily,
    fontSize: 12,
    fontWeight: '600',
    backgroundColor: 'transparent',
    color: gui.mainColor
  },
  categoryLabel: {
    fontFamily: gui.fontFamily,
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: 'transparent'
  },
  arrowLabel: {
    fontFamily: gui.fontFamily,
    fontSize: 14,
    backgroundColor: 'transparent',
    color: gui.arrowColor
  },
  rowItem: {
    flexDirection: "row",
  },
  moreDetailButton: {
    margin: 12,
    marginLeft:20,
    marginRight:20,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    backgroundColor: gui.mainColor,
    color: 'white',
    fontFamily: gui.fontFamily,
    fontWeight: 'normal',
    fontSize: gui.normalFontSize
  },
  linearGradient: {
    backgroundColor : "transparent"
  },
  itemContent: {
    position: 'absolute',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    top: imageHeight - 60
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
    backgroundColor: 'transparent',
    marginLeft: 10,
    color: 'white'
  },
  text: {
    fontSize: 14,
    textAlign: 'left',
    backgroundColor: 'transparent',
    marginLeft: 10,
    color: 'white'
  },
  heartContent: {
    backgroundColor: 'transparent',
    alignItems: 'flex-start'
  },
  heartButton: {
    marginTop: 5,
  },
  heartButton_45: {
    marginTop: 5,
    marginLeft: width*0.45-30
  },
  heartButton_55: {
    marginTop: 5,
    marginLeft: width*0.55-30
  },
  heartButton_100: {
    marginTop: 5,
    marginLeft: width-30
  },
  titleContainer : {
    height: 75,
    alignItems:'center',
    justifyContent: 'center',
    /*
    borderColor: 'red',
    borderWidth : 1,
     */
  },
  welcome: {
    marginTop: -50,
    marginBottom: 50,
    fontSize: 16,
    textAlign: 'center',
    margin: 10,
  },
});



export default connect(mapStateToProps, mapDispatchToProps)(Home);
