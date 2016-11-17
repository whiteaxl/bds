'use strict';

import  React from 'react';

import {View, Text, Navigator, Platform, StyleSheet, PanResponder, Alert} from 'react-native';
import {Scene, Router, TabBar, Modal, Schema, Actions, Reducer, Switch} from 'react-native-router-flux';

import Launch from './Launch';
import Home from '../containers/Home';
import Inbox from '../containers/Inbox';
import PostAds from '../containers/PostAds';
import MicroVoice from '../containers/MicroVoice';


import PostAdsDetail from '../components/postAds/PostAdsDetail';
import PostAdsMapView from '../components/postAds/PostAdsMapView';
import PostAdsAddress from '../components/postAds/PostAdsAddress';
import PostAdsTitle from '../components/postAds/PostAdsTitle';
import MCameraRollView from '../components/MCameraRollView';
import PostAdsPrice from '../components/postAds/PostAdsPrice';
import PostAdsLienHe from '../components/postAds/PostAdsLienHe';
import PostAdsGoogleAutoComplete from '../components/map/GoogleAutoComplete';

import DuAn from '../components/DuAn';

import LoginRegister from './LoginRegister';

import Search from './Search';
import Search2 from './Search2';

import SearchResultListExt from './SearchResultListExt';
import SearchResultList from './SearchResultList';
import SearchResultMap from './SearchResultMap';
import PropertyTypes from '../components/PropertyTypes';
import OrderPicker from '../components/OrderPicker';
import SearchResultDetail from './SearchResultDetail';
import SearchMapDetail from './SearchMapDetail';
import HuongNha from '../components/HuongNha';
import MHuongNha from '../components/MHuongNha';
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
import Profile from '../components/me/Profile';
import GioiTinh from '../components/GioiTinh';
import MoiGioi from '../components/MoiGioi';
import Setting from '../components/me/Setting';

import DinhGia from '../components/pricing/DinhGia';
import KetQuaDinhGia from '../components/pricing/KetQuaDinhGia';
import LoaiNhaDat from '../components/LoaiNhaDat';
import MMapView from '../components/map/MMapView';

import FullLine from '../components/line/FullLine';

import Login from '../components/login/Login';
import Register from '../components/login/Register';
import UserComeback from '../components/login/UserComeback';

import ChangePassword from '../components/me/ChangePassword';

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

    var _panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (e, gestureState) => {},
      onMoveShouldSetPanResponderCapture: (e, gestureState) => {},
      onStartShouldSetPanResponder: (e, gestureState) => {},
      onStartShouldSetPanResponderCapture: (e, gestureState) => {},
      onPanResponderReject: (e, gestureState) => {},
      onPanResponderGrant: (e, gestureState) => {},
      onPanResponderStart: (e, gestureState) => {},
      onPanResponderEnd: (e, gestureState) => {},
      onPanResponderRelease: (e, gestureState) => {},
      onPanResponderMove: (e, gestureState) => {},
      onPanResponderTerminate: (e, gestureState) => {},
      onPanResponderTerminationRequest: (e, gestureState) => {},
      onShouldBlockNativeResponder: (e, gestureState) => {},
    });

    return (
        <RouterWithRedux >

          <Scene key="root" hideNavBar={true}
                 titleStyle={styles.titleStyle}
          >
            <Scene key='Launch' component={Launch} initial={false} title="Welcome" />

            <Scene key="Home" tabs={true} default="Main" type="replace" initial={true} tabBarStyle={styles.tabBarStyle}>
              <Scene key="Main" title="Trang chủ" iconName={"home-f"} iconSize={26} icon={TabIcon}
                     component={Home}
                     hideNavBar={true} initial={true}/>

              <Scene key="Inbox" component={Inbox} title="Chat"
                     iconName={"chat2"} iconSize={26}
                     icon={TabIcon} hideNavBar={true} />
              <Scene key="MicroVoice" component={MicroVoice} title="Trợ lý Landber"
                     iconName={"mic-on"} iconSize={26} icon={TabIcon} hideNavBar={true}/>
              <Scene key="AdsMgmt" component={AdsMgmt} title="Quản lý tin" hideNavBar={true}
                     iconName={"mgmt2"} iconSize={26} icon={TabIcon}/>
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

            <Scene key='Search' component={Search} title="Tìm kiếm" hideNavBar={true} direction="vertical" panHandlers={_panResponder.panHandlers}/>
            <Scene key='Search2' component={Search2} title="Tìm kiếm" hideNavBar={true} direction="vertical" panHandlers={_panResponder.panHandlers}/>
            <Scene key='SearchResultListExt' component={SearchResultListExt} title="Danh sách" hideNavBar={true}/>
            <Scene key='SearchResultList' component={SearchResultList} title="Danh sách" hideNavBar={true}/>
            <Scene key='SearchResultMap' component={SearchResultMap} title="Bản đồ" hideNavBar={true}/>
            <Scene key='PropertyTypes' component={PropertyTypes} title="Loại nhà đất" hideNavBar={true}/>
            <Scene key='AdsAlertUs' component={AdsAlertUs} title="Thông báo cho chúng tôi" hideNavBar={true}/>

            <Scene key='HuongNha' component={HuongNha} title="Hướng nhà" hideNavBar={true}/>
            <Scene key='MHuongNha' component={MHuongNha} title="Hướng nhà" hideNavBar={true}/>
            <Scene key='SquareImageCropper' component={SquareImageCropper} title="Image Cropper" hideNavBar={true}/>
            <Scene key='PostAds' component={PostAds} title="Post Ads" hideNavBar={true}/>
            <Scene key='PostAdsDetail' component={PostAdsDetail} title="Post Ads Detail" hideNavBar={true}/>
            <Scene key='PostAdsMapView' component={PostAdsMapView} title="Post Ads MapView" hideNavBar={true}/>
            <Scene key='PostAdsAddress' component={PostAdsAddress} title="Post Ads Address" hideNavBar={true}/>
            <Scene key='PostAdsTitle' component={PostAdsTitle} title="Post Ads Title" hideNavBar={true}/>
            <Scene key='CameraRollView' component={MCameraRollView} title="Kho ảnh" hideNavBar={true}/>
            <Scene key='PostAdsPrice' component={PostAdsPrice} title="Giá tiền" hideNavBar={true}/>
            <Scene key='PostAdsLienHe' component={PostAdsLienHe} title="Liên hệ" hideNavBar={true}/>
            <Scene key='PostAdsGoogleAutoComplete' component={PostAdsGoogleAutoComplete} title="Chọn dịa điểm" hideNavBar={true}/>
            <Scene key='DuAn' component={DuAn} title="Dự Án" hideNavBar={true}/>

            <Scene key='OrderPicker' component={OrderPicker} title="Sắp xếp" hideNavBar={true}/>
            <Scene key='SearchResultDetail' component={SearchResultDetail} title="Chi tiết" hideNavBar={true}/>
            <Scene key='SearchSuggestion' duration={20} direction="vertical" component={SearchSuggestion}
                   title="Serch Text" hideNavBar={true} panHandlers={_panResponder.panHandlers}/>
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

            <Scene key='Profile' component={Profile} hideNavBar={true}/>
            <Scene key='ChangePassword' component={ChangePassword} hideNavBar={true}/>

            <Scene key='DinhGia' component={DinhGia} hideNavBar={true}/>
            <Scene key='KetQuaDinhGia' component={KetQuaDinhGia} hideNavBar={true}/>
            <Scene key='LoaiNhaDat' component={LoaiNhaDat} hideNavBar={true}/>
            <Scene key='MMapView' component={MMapView} hideNavBar={true}/>

            {/* Multi choice */}
            <Scene key='PackageTypes' component={PackageTypes} hideNavBar={true}/>
            <Scene key='PackageLengths' component={PackageLengths} hideNavBar={true}/>

            <Scene key='Topup' component={Topup} hideNavBar={true}/>
            <Scene key='Topup_Scratch' component={Topup_Scratch} hideNavBar={true}/>
            <Scene key='Topup_SMS' component={Topup_SMS} hideNavBar={true}/>
            <Scene key='GioiTinh' component={GioiTinh} hideNavBar={true}/>
            <Scene key='MoiGioi' component={MoiGioi} hideNavBar={true}/>
            <Scene key='Setting' component={Setting} hideNavBar={true}/>

            <Scene key='Login' component={Login} hideNavBar={true}/>
            <Scene key='UserComeback' component={UserComeback} hideNavBar={true}/>
            <Scene key='Register' component={Register} hideNavBar={true}/>

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
