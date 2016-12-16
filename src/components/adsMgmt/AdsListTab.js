'use strict';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as globalActions from '../../reducers/global/globalActions';
import * as adsMgmtActions from '../../reducers/adsMgmt/adsMgmtActions';
import * as postAdsActions from '../../reducers/postAds/postAdsActions';

import {Map} from 'immutable';

import React, {Component} from 'react';

import {
  Text, View, Image, ListView, Dimensions, StatusBar,
  RecyclerViewBackedScrollView, TouchableOpacity, Alert,
  TouchableHighlight, StyleSheet, RefreshControl, ScrollView
} from 'react-native'

import {Actions} from 'react-native-router-flux';

import MHeartIcon from '../MHeartIcon';

import LinearGradient from 'react-native-linear-gradient';

import Swipeout from 'react-native-swipeout';

import ScalableText from 'react-native-text';

import gui from '../../lib/gui';

import DanhMuc from '../../assets/DanhMuc';

import GiftedSpinner from "../../components/GiftedSpinner";
import cfg from "../../cfg";

import log from '../../lib/logUtil';
import danhMuc from '../../assets/DanhMuc';

var { width, height } = Dimensions.get('window');

const actions = [
  globalActions,
  adsMgmtActions,
  postAdsActions
];

function mapStateToProps(state) {
  return {
    //listAds: state.adsMgmt.likedList,
    loading: state.adsMgmt.loadingFromServer,
    errorMsg: state.adsMgmt.errorMsg,
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

var imgHeight = 181;

var {width} = Dimensions.get('window');

var myDs = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

class AdsListTab extends Component {
  constructor(props) {
    super(props);
    StatusBar.setBarStyle('light-content');
    this.state = {
      scrollEnabled: true
    }
  }

  componentDidMount() {
    log.info("AdsListTab - componentDidMount");
    this.props.actions.loadMySellRentList(this.props.global.currentUser.userID);
    this.props.actions.loadLikedList(this.props.global.currentUser.userID);
  }

  _onRefresh() {
    log.info("_onRefresh", this.props);

    if (this.props.name == 'likedTab') {
      this.props.actions.loadLikedList(this.props.global.currentUser.userID);
    } else {
      this.props.actions.loadMySellRentList(this.props.global.currentUser.userID);
    }

    /*
    fetchData().then(() => {
      this.setState({refreshing: false});
    });
    */
  }

  _getListContent() {
    let myProps = this.props;

    if (myProps.errorMsg) {
      return (
        <View style={{flex:1, alignItems:'center', justifyContent:'center', marginTop: 30}}>
          <Text style={myStyles.welcome}>{myProps.errorMsg}</Text>
        </View>
      )
    }

    log.info("listAds", myProps.listAds);
    if (myProps.listAds.length === 0 || myProps.listAds.size == 0) {
      return (
        <ScrollView
          refreshControl={
          <RefreshControl
            refreshing={this.props.adsMgmt.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }
        >
          <View style={{flex:1, alignItems:'center', justifyContent:'center'
            , marginTop: 30}}>
            <Text style={gui.styles.defaultText}> {gui.INF_KhongCoKetQua} </Text>

            <TouchableHighlight
              onPress = {this._onRefresh.bind(this)}
            >
              <Text style={myStyles.linkText}> {gui.INF_ClickToRefresh} </Text>
            </TouchableHighlight>
          </View>
        </ScrollView>
      )
    }

    let ds = myDs.cloneWithRows(myProps.listAds);
    //this.setState({dataSource:ds});

    return (
      <ListView
          scrollEnabled = {this.state.scrollEnabled}
          refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={this._onRefresh.bind(this)}
          />
        }

        enableEmptySections = {true}

        dataSource={ds}
        renderRow={this.renderRow.bind(this)}
        renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
        renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={myStyles.separator} />}
        style={myStyles.searchListView}
      />
    )
  }

  render() {
    log.info("Call AdsListTab render", this.props.adsMgmt);

    return (
      <View style={myStyles.fullWidthContainer}>
        {this._getListContent()}
        {this._renderLoadingView()}
      </View>
    )
  }

  _renderImageStack(rowData) {
    var imageIndex = 0;
    if (rowData.image && rowData.image.cover) {
      return (
          <MyImage imageIndex={0} rowData={rowData} imageUrl={rowData.image.cover} source={this.props.source}/>
      );
    } else {
      return (
          <MyImage imageIndex={0} rowData={rowData} imageUrl={''} source={this.props.source}/>
      );
    }
  }

  onEditButton(adsID){
    this.props.actions.getUpdateAds(adsID, this.props.global.currentUser.token)
        .then(
            (res) => {
              if (res.success){
                Actions.PostAdsDetail();
              } else {
                Alert.alert('Lỗi không tải được tin đã đăng');
              }
            }
        );
  }

  onDeleteButton(adsID){
    Alert.alert('', 'Bạn có muốn xóa tin này không ?',
        [ {text: 'Thoát' , onPress: () => console.log('Cancel Pressed!')},
          {text: 'Đồng ý', onPress: () => this._deleteAds(adsID)}
        ]);
  }

  _getLevelName(pack) {
    return pack ? danhMuc.package.level[pack.level] : "Chưa có";
  }

  _deleteAds(adsID){
    let token = this.props.global.currentUser.token;

    this.props.actions.deleteAds(adsID, token).then (
        (res) => {
          if (res.success){
            Alert.alert('Bạn đã xóa thành công tin đăng');
            this.props.actions.loadMySellRentList(this.props.global.currentUser.userID);
          }else {
            Alert.alert(res.msg);
          }
        }
    );
  }

  upgradeAds(ads) {
    this.props.actions.changePackageField('adsID', ads.adsID);

    this.props.actions.changePackageField(
      'current_goiViTri', this._getLevelName(ads.goiViTri));
    this.props.actions.changePackageField(
      'current_goiTrangChu', this._getLevelName(ads.goiTrangChu));
    this.props.actions.changePackageField(
      'current_goiLogo', this._getLevelName(ads.goiLogo));

    Actions.UpgradePackgeSelector();
  }

  coming() {
    Alert.alert("Coming soon...");
  }

  _getPackValue(prefix, pack) {
    if (pack && pack.level) {
      return prefix + danhMuc.package.level[pack.level] + " - " + danhMuc.package.length[pack.length];
    }

    return '';
  }

  _renderGoiTin(rowData) {
    if (this.props.name == 'likedTab') {
      return null;
    }

    let viTriLabel = this._getPackValue("Vị trí : " , rowData.goiViTri);
    let trangChuLabel =  this._getPackValue("Trang chủ : ", rowData.goiTrangChu);
    let logoLabel = this._getPackValue("Logo : " , rowData.goiLogo);

    return (
      <View style={myStyles.rightTextGroup}>
        <Text numberOfLines={1} style={myStyles.tinChoDuyet}>TIN ĐÃ ĐĂNG</Text>

        {/*<TouchableHighlight disabled={true} underlayColor='transparent' onPress={() => {this.upgradeAds(rowData)}}>
          <View style={myStyles.nangCap} >
            <RelandIcon.Icon color={'white'} name={"update"} size={12} style={{marginLeft:5, marginRight:5}} />
            <Text style={myStyles.textNangCap}>
              NÂNG CẤP
            </Text>
          </View>
        </TouchableHighlight>
        <Text numberOfLines={1} style={myStyles.textGoiTin}>{viTriLabel}</Text>
        <Text numberOfLines={1} style={myStyles.textGoiTin}>{trangChuLabel}</Text>
        <Text numberOfLines={1} style={myStyles.textGoiTin}>{logoLabel}</Text>
        */}
      </View>
    )
  }

  _renderText(rowData) {
    var diaChi = rowData.diaChiChiTiet || rowData.diaChi || '';
    var loaiTin = rowData.loaiTin;
    var loaiNhaDat = rowData.loaiNhaDat;
    var dienTich = '';
    if (rowData.dienTichFmt) {
      dienTich = '· ' + rowData.dienTichFmt;
    }
    var soPhongNgu = '';
    if (rowData.soPhongNguFmt) {
      soPhongNgu = " " + rowData.soPhongNguFmt;
    }

    var soTang = '';
    if (rowData.soTangFmt) {
      soTang = " " + rowData.soTangFmt;
    }

    var maxDiaChiLength = 25;
    var index = diaChi.indexOf(',', maxDiaChiLength - 5);
    var length = 0;
    if (index !== -1 && index <= maxDiaChiLength) {
      length = index;
    } else {
      index = diaChi.indexOf(' ', maxDiaChiLength - 5);
      length = index !== -1 && index <= maxDiaChiLength ? index : maxDiaChiLength;
    }
    diaChi = diaChi.substring(0, length);
    if (diaChi.length < rowData.diaChi.length) {
      diaChi = diaChi + '...';
    }

    var moreInfo = this.getMoreInfo(loaiTin, loaiNhaDat, dienTich, soPhongNgu, soTang);
    var moreInfoWithoutDot = moreInfo.substring(3);

    let adsID = rowData.adsID || rowData.id;
    let isLiked = this.isLiked(adsID);
    let color = isLiked ? '#A2A7AD' : 'white';
    let bgColor = isLiked ? '#E50064' : '#4A443F';
    let bgStyle = isLiked ? {} : {opacity: 0.55};

    if (this.props.name == 'likedTab') {
      return (
        <View style={myStyles.likedItemContainer}>
          <View style={myStyles.searchListViewRowAlign}>
            <ScalableText style={myStyles.price}>{rowData.giaFmt}</ScalableText>
            <ScalableText style={myStyles.text}>{diaChi}{moreInfo}</ScalableText>
          </View>
          <View style={myStyles.heartContent}>
            <MHeartIcon onPress={() => this.onLike(adsID)}
                        color={color} bgColor={bgColor}
                        bgStyle={bgStyle} mainProps={myStyles.heartButton} />             
          </View>
        </View>
      );
    }
    //Ban or Cho Thue
    return (
      <View style={myStyles.leftTextGroup}>
        <Text numberOfLines={1} style={myStyles.price}>{rowData.giaFmt}</Text>
        <Text numberOfLines={1} style={myStyles.smallText1}>{rowData.diaChi}</Text>
        <Text numberOfLines={1} style={myStyles.smallText1}>{moreInfoWithoutDot}</Text>
      </View>
    )
  }

  isLiked(adsID) {
    const {adsLikes} = this.props.global.currentUser;
    return adsLikes && adsLikes.indexOf(adsID) > -1;
  }

  onLike(adsID) {
    if (!this.props.global.loggedIn) {
      Actions.Login();
    } else {
      if (!this.isLiked(adsID)) {
        this.props.likeAds(this.props.global.currentUser.userID, adsID);
      } else {
        this.props.unlikeAds(this.props.global.currentUser.userID, adsID);
      }
      this.props.actions.loadLikedList(this.props.global.currentUser.userID);
    }
  }

  _renderLoadingView() {
    if (this.props.postAds.loadingUpdateAds || this.props.adsMgmt.deletingAds) {
      return (<View style={myStyles.resultContainer}>
        <View style={myStyles.loadingContent}>
          <GiftedSpinner color="white" />
        </View>
      </View>)
    }
  }

  renderRow(rowData, sectionID, rowID) {
    let adsID = rowData.id || rowData.adsID;


    if (this.props.name == 'likedTab'){
      var swipeoutBtns = [
        {
          text: 'Xóa',
          backgroundColor:'#ff2714',
          onPress: () => this.onLike(adsID)
        }
      ];
      return (
          <View key={adsID}>
            <Swipeout right={swipeoutBtns} scroll={event => this._allowScroll(event)}>
              <View style={myStyles.detail}>
                {this._renderImageStack(rowData)}
                {this._renderText(rowData)}
                {this._renderGoiTin(rowData)}
              </View>
            </Swipeout>
          </View>
      );
    } else {
      var swipeoutBtns = [
        {
          text: 'Sửa',
          backgroundColor: '#E99409',
          onPress: () => this.onEditButton(adsID)
        },
        {
          text: 'Xóa',
          backgroundColor:'#ff2714',
          onPress: () => this.onDeleteButton(adsID)
        }
      ];
      return (
          <View key={adsID}>
            <Swipeout right={swipeoutBtns} scroll={event => this._allowScroll(event)} autoClose={true}>
              <View style={myStyles.detail}>
                {this._renderImageStack(rowData)}
                {this._renderText(rowData)}
                {this._renderGoiTin(rowData)}
              </View>
            </Swipeout>
          </View>
      );
    }
  }

 _allowScroll(scrollEnabled) {
    this.setState({ scrollEnabled: scrollEnabled })
  }

  getMoreInfo(loaiTin, loaiNhaDat, dienTich, soPhongNgu, soTang) {
    var moreInfo = '';
    var loaiNhaDatKeys = loaiTin ? DanhMuc.LoaiNhaDatThueKey : DanhMuc.LoaiNhaDatBanKey;
    if (loaiNhaDat == loaiNhaDatKeys[1]) {
      moreInfo = ' ' + dienTich + soPhongNgu;
    }
    else if ( !loaiTin && ((loaiNhaDat == loaiNhaDatKeys[2])
        || (loaiNhaDat == loaiNhaDatKeys[3])
        || (loaiNhaDat == loaiNhaDatKeys[4])) ||
        loaiTin && ((loaiNhaDat == loaiNhaDatKeys[2])
        || (loaiNhaDat == loaiNhaDatKeys[3])
        || (loaiNhaDat == loaiNhaDatKeys[6]))) {
      moreInfo = ' ' + dienTich + soTang;
    }
    else {
      moreInfo = ' ' + dienTich;
    }
    return moreInfo;
  }
}

class MyImage extends Component {
  render() {
    let source = this.props.source ? this.props.source : 'server';
    
    let image =  (this.props.imageUrl && this.props.imageUrl.length>0 ) ? {uri: `${this.props.imageUrl}`}
                  : {uri: `${cfg.noCoverUrl}`};

    return (
      <View style={myStyles.slide} key={"img"+(this.props.imageIndex)}>
        <TouchableHighlight
          onPress={() => Actions.SearchResultDetail({adsID: this.props.rowData.adsID, source: source})}>
          <Image style={myStyles.thumb} source={image}>
            <LinearGradient colors={['transparent', 'rgba(0, 0, 0, 0.9)']}
                            style={myStyles.linearGradient2}>
            </LinearGradient>
          </Image>
        </TouchableHighlight>
      </View>
    );
  }
}

// Later on in your styles..
var myStyles = StyleSheet.create({
  welcome: {
    marginTop: -50,
    marginBottom: 50,
    fontSize: 16,
    textAlign: 'center',
    margin: 10
  },
  fullWidthContainer: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: 'white',
  },
  search: {
    backgroundColor: gui.mainColor,
    height: 30
  },
  searchContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  wrapper: {},
  slide: {
    justifyContent: 'center',
    backgroundColor: 'transparent'
    //
  },
  separator: {
    height: 0.5,
    backgroundColor: 'transparent'
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
    bottom: 32
  },
  detail: {
    flex: 1,
    paddingLeft: 0,
    paddingRight: 0,
    backgroundColor: "transparent"
  },
  linearGradient2: {
    marginTop: imgHeight / 3,
    height: 2 * (imgHeight / 3),
    paddingLeft: 0,
    paddingRight: 0,
    backgroundColor: "transparent"
  },
  thumb: {
    justifyContent: 'flex-end',
    alignItems: 'stretch',
    height: imgHeight,
    alignSelf: 'auto',
    right: 0
  },
  searchListView: {
    margin: 0,
    backgroundColor: 'white'
  },

  likedItemContainer: {
    flexDirection: 'row',
    position: 'absolute',
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    top: imgHeight - 53,
    width: Dimensions.get('window').width
  },

  searchListViewRowAlign: {
    backgroundColor: 'transparent',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: 2*width/3,
    marginLeft: 17
  },

  leftTextGroup: {
    position: 'absolute',
    backgroundColor: 'transparent',
    flexDirection: 'column',
    top: imgHeight - 70,
    width: 220,
    marginLeft: 17
  },

  price: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
    backgroundColor: 'transparent',
    color: 'white',
    fontFamily: 'Open Sans',
  },
  text: {
    fontSize: 15,
    textAlign: 'left',
    backgroundColor: 'transparent',
    color: 'white',
    fontFamily: 'Open Sans',
    marginTop: 2,
  },
  heartContent: {
    backgroundColor: 'transparent',
    marginRight: 10
  },
  heartButton: {
    marginTop: 6,
    marginRight: 10
  },


  smallText1: {
    fontSize: 13,
    textAlign: 'left',
    color: 'white',
    fontFamily: 'Open Sans',
  },

  linkText  : {
    fontFamily: gui.fontFamily,
    fontSize: gui.normalFontSize,
    color : gui.mainColor
  },
  rightTextGroup: {
    position: 'absolute',
    backgroundColor: 'transparent',
    flexDirection: 'column',
    top: imgHeight - 110,
    width: 180,
    right: 19,
    alignItems : 'flex-end'
  },

  nangCap : {
    backgroundColor: '#ff2714',
    flexDirection: 'row',
    padding: 3,
    width: 80,
    borderRadius : 3,
    marginBottom: 7,
    marginTop: 7,
  },

  textNangCap : {
    color : "white",
    fontFamily: gui.fontFamily,
    fontSize: 10,
    fontWeight : 'bold'
  },

  textGoiTin: {
    fontSize: 10,
    textAlign: 'left',
    color: '#f3f0bc',
    fontFamily: 'Open Sans',
    fontWeight : 'bold',
    marginTop: 2
  },

  tinChoDuyet : {
    fontFamily: gui.fontFamily,
    fontSize: 10,
    color : '#dcd135',

    fontWeight : 'bold'
  },

  editContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    height: imgHeight
  },
  editButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    marginTop: 10,
    padding: 5,
    borderRadius : 3
  },
  editButtonText: {
    color : "white",
    fontFamily: gui.fontFamily,
    fontSize: 12,
    fontWeight : 'bold',
    width: 80,
    borderRadius : 3,
    textAlign: 'center'
  },
  loadingContent: {
    position: 'absolute',
    top: -23,
    left: width/2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  resultContainer: {
    position: 'absolute',
    top: height/2,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginVertical: 0,
    marginBottom: 0,
    backgroundColor: 'transparent'
  }

});

export default connect(mapStateToProps, mapDispatchToProps)(AdsListTab);
