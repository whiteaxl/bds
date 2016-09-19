'use strict';

import  React from 'react';

import {View, Text, Navigator, Platform, StyleSheet} from 'react-native';
import {Scene, Router, TabBar, Modal, Schema, Actions, Reducer, Switch} from 'react-native-router-flux';

import Launch from './Launch';
import Home from '../containers/Home';
import Inbox from '../containers/Inbox';
import PostAds from '../containers/PostAds';
import PostAdsDetail from '../components/postAds/PostAdsDetail';
import PostAdsMapView from '../components/postAds/PostAdsMapView';
import PostAdsAddress from '../components/postAds/PostAdsAddress';
import PostAdsTitle from '../components/postAds/PostAdsTitle';
import CameraRollView from '../components/CameraRollView';
import PostAdsPrice from '../components/postAds/PostAdsPrice';

import LoginRegister from './LoginRegister';

import Search from './Search';

import SearchResultList from './SearchResultList';
import SearchResultMap from './SearchResultMap';
import PropertyTypes from '../components/PropertyTypes';
import OrderPicker from '../components/OrderPicker';
import SearchResultDetail from './SearchResultDetail';
import SearchMapDetail from './SearchMapDetail';
import HuongNha from '../components/HuongNha';
import VerifyPhone from '../components/login/VerifyPhone';
import RegisterMoreInfor from '../components/login/RegisterMoreInfor';
import Me from './Me';
import AdsMgmt from './AdsMgmt';
import UpgradePackgeSelector from '../components/adsMgmt/UpgradePackgeSelector';
import AdsAlertUs from '../components/detail/AdsAlertUs';

import PackageUpdater from '../components/adsMgmt/PackageUpdater';
import PackageTypes from '../components/adsMgmt/PackageTypes';
import PackageLengths from '../components/adsMgmt/PackageLengths';

import Topup from '../components/me/Topup';
import Topup_Scratch from '../components/me/Topup_Scratch';
import Topup_SMS from '../components/me/Topup_SMS';


import SearchSuggestion from '../containers/PlacesAutoComplete';
import Chat from './Chat';

import SquareImageCropper from '../components/SquareImageCropper';

import gui from '../lib/gui';
import log from '../lib/logUtil';

import RelandIcon from '../components/RelandIcon';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import * as searchActions from '../reducers/search/searchActions';
import {Map} from 'immutable';
const actions = [
  searchActions,
];

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

const RouterWithRedux = connect()(Router);

class TabIcon extends React.Component {
  render() {
    var color = this.props.selected ? gui.mainColor : '#8f8f8f';
    return (
      <View style={styles.tabIcon}>
        <RelandIcon.Icon style={{color: color}} name={this.props.iconName} size={this.props.iconSize}/>
        <Text style={[styles.tabIconText, {color: color}]}>{this.props.title}</Text>
      </View>
    );
  }
}

class App extends React.Component {
  render() {

    return (
      <RouterWithRedux >

        <Scene key="root" hideNavBar={true}
               titleStyle={styles.titleStyle}
        >
          <Scene key='Launch' component={Launch} initial={true} title="Welcome" />

          <Scene key="Home" tabs={true} default="Main" type="replace" tabBarStyle={styles.tabBarStyle}>
            <Scene key="Main" title="Trang chủ" iconName={"home-f"} iconSize={26} icon={TabIcon}
                   component={Home}
                   hideNavBar={true} initial={true}/>

            <Scene key="Inbox" component={Inbox} title="Chat"
                   iconName={"chat"} iconSize={26}
                   icon={TabIcon} hideNavBar={true} />
            <Scene key="activity" component={PostAds} title="Đăng tin"
                   iconName={"camera-o"} iconSize={26} icon={TabIcon} hideNavBar={true}/>
            <Scene key="AdsMgmt" component={AdsMgmt} title="Quản lý tin" hideNavBar={true}
                   iconName={"mgmt"} iconSize={26} icon={TabIcon}/>
            <Scene key="Me" component={Me} title="Tôi" hideNavBar={true}
                   iconName={"me"} iconSize={26} icon={TabIcon}/>
            {
              /*
            <Scene key="UpgradeAds11" component={UpgradePackgeSelector} hideNavBar={true} title="Upgrade"
                   iconName={"me"} iconSize={21} icon={TabIcon}/>
             */
            }

          </Scene>

          <Scene key='LoginRegister' component={LoginRegister} title="Register Screen" direction="vertical"/>

          <Scene key='Search' component={Search} title="Tìm kiếm" hideNavBar={true} direction="vertical" panHandlers={null} />
          <Scene key='SearchResultList' component={SearchResultList} title="Danh sách" hideNavBar={true}/>
          <Scene key='SearchResultMap' component={SearchResultMap} title="Bản đồ" hideNavBar={true}/>
          <Scene key='PropertyTypes' component={PropertyTypes} title="Loại nhà đất" hideNavBar={true}/>
          <Scene key='AdsAlertUs' component={AdsAlertUs} title="Thông báo cho chúng tôi" hideNavBar={true}/>

          <Scene key='HuongNha' component={HuongNha} title="Hướng nhà" hideNavBar={true}/>
          <Scene key='SquareImageCropper' component={SquareImageCropper} title="Image Cropper" hideNavBar={true}/>
          <Scene key='PostAds' component={PostAds} title="Post Ads" hideNavBar={true}/>
          <Scene key='PostAdsDetail' component={PostAdsDetail} title="Post Ads Detail" hideNavBar={true}/>
          <Scene key='PostAdsMapView' component={PostAdsMapView} title="Post Ads MapView" hideNavBar={true}/>
          <Scene key='PostAdsAddress' component={PostAdsAddress} title="Post Ads Address" hideNavBar={true}/>
          <Scene key='PostAdsTitle' component={PostAdsTitle} title="Post Ads Title" hideNavBar={true}/>
          <Scene key='CameraRollView' component={CameraRollView} title="Kho ảnh" hideNavBar={true}/>
          <Scene key='PostAdsPrice' component={PostAdsPrice} title="Giá tiền" hideNavBar={true}/>

          <Scene key='OrderPicker' component={OrderPicker} title="Sắp xếp" hideNavBar={true}/>
          <Scene key='SearchResultDetail' component={SearchResultDetail} title="Chi tiết" hideNavBar={true}/>
          <Scene key='SearchSuggestion' duration={20} direction="vertical" component={SearchSuggestion}
                 title="Serch Text" hideNavBar={true}/>
          <Scene key='SearchMapDetail' component={SearchMapDetail}
                 title="Bản đồ" hideNavBar={true}/>

          <Scene key='VerifyPhone' component={VerifyPhone}
                 navigationBarStyle = {styles.navigationBarStyleWhite}
                 titleStyle={styles.titleStyleWhite}
                 leftButtonIconStyle = {styles.leftButtonIconStyle}
                 title="Xác minh số điện thoại" hideNavBar={false}/>
          <Scene key='RegisterMoreInfor' component={RegisterMoreInfor}
                 navigationBarStyle = {styles.navigationBarStyleWhite}
                 titleStyle={styles.titleStyleWhite}
                 leftButtonIconStyle = {styles.leftButtonIconStyle}
                 title="Đăng ký" hideNavBar={false}/>

          <Scene key='Chat' component={Chat} hideNavBar={true}/>

          <Scene key='UpgradePackgeSelector' component={UpgradePackgeSelector} hideNavBar={true}/>
          <Scene key='PackageUpdater' component={PackageUpdater} hideNavBar={true}/>

          {/* Multi choice */}
          <Scene key='PackageTypes' component={PackageTypes} hideNavBar={true}/>
          <Scene key='PackageLengths' component={PackageLengths} hideNavBar={true}/>

          <Scene key='Topup' component={Topup} hideNavBar={true}/>
          <Scene key='Topup_Scratch' component={Topup_Scratch} hideNavBar={true}/>
          <Scene key='Topup_SMS' component={Topup_SMS} hideNavBar={true}/>

        </Scene>
      </RouterWithRedux>
    );
  }
}


var styles = StyleSheet.create({
  tabIcon: {
    flex:1, flexDirection:'column',
    alignItems:'center',
    alignSelf:'center',
    top: 5
  },

  tabIconText: {
    top: 4,
    fontSize:10,
    fontFamily: 'Open Sans'
  },

  tabBarStyle : {
    height: 49,
    borderTopWidth:1,
    backgroundColor: '#F2F4F5',
    borderTopColor: '#dcdbdc'
  },

  navigationBarStyle : {
    height: 64,
    backgroundColor: gui.mainColor,
  },

  navigationBarStyleWhite : {
    height: 64,
    backgroundColor: 'white',
    borderBottomWidth: 0.5,
    borderBottomColor: gui.separatorLine,
  },

  titleStyleWhite : {
    color: 'black',
    fontSize: 17,
    fontFamily: 'Open Sans',
  },

  titleStyle : {
    color: 'white'
  }

});


export default connect(null, mapDispatchToProps)(App);
