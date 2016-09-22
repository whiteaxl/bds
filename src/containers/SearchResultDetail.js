'use strict';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as globalActions from '../reducers/global/globalActions';
import * as searchActions from '../reducers/search/searchActions';
import * as chatActions from '../reducers/chat/chatActions';


import {Map} from 'immutable';

import React, {Component} from 'react';

import { Text, View, Image, Dimensions, ScrollView, StyleSheet, StatusBar, TouchableHighlight, Linking } from 'react-native'

var ShareManager = require('react-native').NativeModules.ShareManager;

import {Actions} from 'react-native-router-flux';

import DanhMuc from '../assets/DanhMuc';

import SearchResultDetailFooter from '../components/detail/SearchResultDetailFooter';
import CommonHeader from '../components/CommonHeader';

import Swiper from 'react-native-swiper';

import gui from '../lib/gui';
import utils from '../lib/utils';
import placeUtil from '../lib/PlaceUtil';

import CollapsiblePanel from '../components/CollapsiblePanel';
import SummaryText from '../components/SummaryText';

import GiftedSpinner from "../components/GiftedSpinner";

import TruliaIcon from '../components/TruliaIcon';

import RelandIcon from '../components/RelandIcon';

import Button from 'react-native-button';

import Communications from '../components/detail/MCommunications';

import ImagePreview from '../components/ImagePreview';

import dbService from "../lib/localDB";

import util from "../lib/utils";

import MChartView from '../components/MChartView';

import logUtil from '../lib/logUtil';

import HomeCollection from '../components/home/HomeCollection';

import LinearGradient from 'react-native-linear-gradient';

import MHeartIcon from '../components/MHeartIcon';

const actions = [
  globalActions,
  searchActions,
  chatActions
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

var {width, height} = Dimensions.get('window');
var mapWidth = width-44;
var mapHeight = (width-width%2)/2+3;

var imgHeight = height/2;

var url = '';

var text = '';

class SearchResultDetail extends Component {
  constructor(props) {
    super(props);

    StatusBar.setBarStyle('light-content');

    this.state = {
      'data' : null,
      loaded: false,
      modal: false,
      headerColor: 'transparent',
      headerButtonColor: 'white',
      backButtonColor: 'white',
      heartBgColor: '#4A443F'
    }
  }
  fetchData() {
    //console.log("adsID: " + this.props.adsID);
    if (this.props.source != 'local') {
      this.props.actions.getDetail(
          {'adsID' : this.props.adsID}
          , (data) => {
            this.refreshRowData(data.ads)
          });
    }
    else {
      dbService.getAds(this.props.adsID, this.refreshRowData.bind(this));
    }
  }
  refreshRowData(ads) {
    navigator.geolocation.getCurrentPosition(
        (position) => {
          var geoUrl = 'http://maps.apple.com/?saddr='+position.coords.latitude+','+position.coords.longitude+'&daddr='+ads.place.geo.lat+','+ads.place.geo.lon+'&dirflg=d&t=s';
          this.setState({
            'data' : ads,
            'geoUrl' : geoUrl,
            'coords' : position.coords,
            loaded: true
          });
        },
        (error) => {
          var geoUrl = 'http://maps.apple.com/?daddr='+ads.place.geo.lat+','+ads.place.geo.lon+'&dirflg=d&t=s';
          this.setState({
            'data' : ads,
            'geoUrl' : geoUrl,
            'coords' : {},
            loaded: true
          });
          alert(error.message);
        },
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  }
  componentWillMount() {
    this.fetchData();
  }
  renderLoadingView() {
    return (
        <View style={detailStyles.fullWidthContainer}>
          {this._renderHeaderBar()}
          <View style={detailStyles.searchContent}>
            <GiftedSpinner size="large" />
          </View>
          <SearchResultDetailFooter />
        </View>
    )
  }
  _renderHeaderBar() {
    return (
        <View style={this.state.headerColor != 'transparent' ? detailStyles.headerContainer : {}}>
          <LinearGradient colors={['rgba(0, 0, 0, 0.9)', 'transparent']}
                          style={detailStyles.linearGradient}>
            <Text style={{height: 64}}></Text>
            <View style={[detailStyles.customPageHeader, {backgroundColor: this.state.headerColor}]}>
              <TruliaIcon onPress={this._onBack.bind(this)}
                          name="arrow-left" color={this.state.backButtonColor}
                          mainProps={[detailStyles.backButton, {marginTop: 28, paddingLeft: 20}]} size={28} >
              </TruliaIcon>
              <View style={[detailStyles.shareMainView, {marginRight: 0, marginLeft: 0}]}>
                <RelandIcon onPress={this._onShare.bind(this)}
                            name="share-o" color={this.state.headerButtonColor}
                            iconProps={{style: [detailStyles.shareButton, {paddingLeft: 25, paddingRight: 4, marginTop: 28}]}} size={28} >
                </RelandIcon>
                {/*<View style={detailStyles.shareButton}>
                 <MHeartIcon onPress={this._onShare.bind(this)} color={this.state.headerButtonColor}
                 bgColor={this.state.heartBgColor} size={22} />
                 </View>*/}
                <RelandIcon onPress={this._onAdsAlertUs.bind(this)}
                            name="alert" color={this.state.headerButtonColor}
                            iconProps={{style: [detailStyles.shareButton, {paddingRight: 26, marginTop: 30}]}} size={25} >
                </RelandIcon>
              </View>
            </View>
          </LinearGradient>
        </View>
    );
  }
  _renderFooter(mobile, rowData) {
    let isLiked = false;
    let userID = null;
    if (this.props.global.loggedIn) {
      let currentUser = this.props.global.currentUser;
      let adsLikes = currentUser && currentUser.adsLikes;
      userID = currentUser && currentUser.userID;
      isLiked = adsLikes && adsLikes.indexOf(rowData.adsID) > -1;
    }
    return (
        <SearchResultDetailFooter mobile={mobile} onChat={() => this._onChat(rowData)} userID={userID}
                                  isLiked={isLiked} ads={rowData} loggedIn={this.props.global.loggedIn}
                                  likeAds={this.props.actions.likeAds}
                                  unlikeAds={this.props.actions.unlikeAds}/>
    );
  }
  _renderImagePreviewModal(imageDataItems, mobile, rowData) {
    let isLiked = false;
    let userID = null;
    if (this.props.global.loggedIn) {
      let currentUser = this.props.global.currentUser;
      let adsLikes = currentUser && currentUser.adsLikes;
      userID = currentUser && currentUser.userID;
      isLiked = adsLikes && adsLikes.indexOf(rowData.adsID) > -1;
    }
    return (
        <ImagePreview images={imageDataItems} mobile={mobile} onChat={() => this._onChat(rowData)}
                      closeModal={() => this.setState({modal: false}) } isLiked={isLiked} ads={rowData} userID={userID}
                      loggedIn={this.props.global.loggedIn} likeAds={this.props.actions.likeAds}
                      unlikeAds={this.props.actions.unlikeAds}/>
    );
  }
  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }
    var rowData = this.state.data;
    //var listData = this.props.search.form.fields.listData;

    //var rowData = listData[rowIndex];
    // console.log(rowData);
    if (!rowData) {
        return (
          <View style={detailStyles.fullWidthContainer}>
            <CommonHeader headerTitle={"Chi tiết"} />
            <View style={detailStyles.searchContent}>
            </View>
            <SearchResultDetailFooter />
          </View>
        )
    }

    var loaiTin = DanhMuc.getLoaiTinValue(rowData.loaiTin);
    var loaiNhaDat = rowData.loaiTin ? DanhMuc.LoaiNhaDatThue[rowData.loaiNhaDat] :  DanhMuc.LoaiNhaDatBan[rowData.loaiNhaDat];
    var diaChi = rowData.place.diaChi;
    var dienTich = '';
    dienTich = rowData.dienTichFmt;

    var gia = rowData.giaFmt;
    if (gia) {
      gia = gia.replace('TỶ','Tỷ');
    }
    var giaM2 = rowData.giaM2;
    if (giaM2) {
      giaM2 = Math.round(giaM2) + 'tr/m²';
    }
    var soTang = rowData.soTang;
    if (soTang) {
      soTang = soTang + ' tầng';
    }
    var huongNha = DanhMuc.HuongNha[rowData.huongNha];
    var huongNhaText = '';
    if (rowData.huongNha) {
      huongNhaText = "Hướng " + huongNha;
    }
    var duAn = rowData.duAn;
    var luotXem = rowData.luotXem;
    var soPhongNguVal = rowData.soPhongNgu;
    var soPhongNgu = soPhongNguVal;
    if (soPhongNgu) {
      soPhongNgu = soPhongNgu + ' phòng ngủ';
    }
    var soPhongTamVal = rowData.soPhongTam;
    var soPhongTam = soPhongTamVal;
    if (soPhongTam) {
      soPhongTam = soPhongTam + ' phòng tắm';
    }

    var isChungCu = rowData.loaiNhaDat == 1;
    let soTangOrNhaTam = isChungCu ? soPhongTam : soTang;

    var ngayDangTin = rowData.ngayDangTinFmt;
    var soNgayDaDangTin = rowData.soNgayDaDangTinFmt;

    var chiTiet = rowData.chiTiet;
    var dangBoi = '';
    var email = '';
    var mobile = '';
    if (rowData.dangBoi) {
      dangBoi = rowData.dangBoi.name;
      email = rowData.dangBoi.email;
      mobile = rowData.dangBoi.phone;
    }

    var _scrollView: ScrollView;
    var mapUrl = 'http://maps.google.com/maps/api/staticmap?zoom=16&size='+mapWidth+'x'+mapHeight+'&markers=color:red|'+rowData.place.geo.lat+','+rowData.place.geo.lon+'&sensor=false';
    var imageItems = [];
    var imageDataItems = [];
    var imageIndex = 0;
    var imagePreviewAction = this._onImagePreviewPressed.bind(this);
    if (rowData.image) {
      rowData.image.images.map(function(imageUrl) {
        imageDataItems.push(imageUrl);
        imageItems.push(
          <View style={detailStyles.slide} key={"img"+(imageIndex++)}>
            <TouchableHighlight onPress={imagePreviewAction} underlayColor="transparent" >
            <Image style={detailStyles.imgItem}
               source={{uri: `${imageUrl}`}} defaultSource={require('../assets/image/no_cover.jpg')}>
            </Image>
            </TouchableHighlight>
          </View>
        );
      });
      if (imageItems.length == 0) {
        var imageUrl = rowData.image.cover;
        imageDataItems.push(imageUrl);
        imageItems.push(
          <View style={detailStyles.slide} key={"img"+(imageIndex)}>
            <TouchableHighlight onPress={imagePreviewAction} underlayColor="transparent" >
            <Image style={detailStyles.imgItem}
               source={{uri: `${imageUrl}`}} defaultSource={require('../assets/image/no_cover.jpg')}>
            </Image>
            </TouchableHighlight>
          </View>
        );
      }
      url = rowData.image.cover;
    }
    text = 'Check out this property | found using the Reland Mobile app\n\n'
        + loaiNhaDat + '\n' + diaChi + '\n' + gia + ', ' + dienTich;
    if (soPhongNgu) {
      text = text + '\n' + soPhongNgu;
    }
    if (soPhongTam) {
      text = text + '\n' + soPhongTam;
    }
    text = text + '\n';
    var moiGioiTuongTu = [];
    if (rowData.moiGioiTuongTu) {
      for (var i=0; i < rowData.moiGioiTuongTu.length; i++) {
        var oneMoiGioi = rowData.moiGioiTuongTu[i];
        var diemDanhGia = this._drawDiemDanhGia(oneMoiGioi.diemDanhGia);
        var numberOfAds = (<Text style={detailStyles.moiGioiNumberOfAds}>{'Có ' + oneMoiGioi.numberOfAds + ' bất động sản đang bán'}</Text>);
        var phone = oneMoiGioi.phone;
        var userID = oneMoiGioi.userID;
        moiGioiTuongTu.push(<View key={'mg-'+i}>
          <View style={[detailStyles.moiGioiRow, {marginTop: 10}]}>
            <View style={detailStyles.moiGioiRowLeft}>
              <Image source={{uri: `${oneMoiGioi.cover}`}} style={detailStyles.moiGioiImage}></Image>
              <View style={detailStyles.moiGioiInfo}>
                <Text style={detailStyles.moiGioiName}>{oneMoiGioi.name}</Text>
                {diemDanhGia}
                {numberOfAds}
              </View>
            </View>
            <View style={detailStyles.moiGioiButtons}>
              <Button onPress={() => this._onChat(rowData)} style={detailStyles.moiGioiChatButton}>CHAT</Button>
              <Button onPress={() => this._onCall(phone)} style={detailStyles.moiGioiCallButton}>GỌI</Button>
            </View>
          </View>
          <View style={[detailStyles.lineBorder2, {marginTop: 10}]} />
        </View>);
      }
    }

    return (
        <View style={detailStyles.fullWidthContainer}>
        <View style={detailStyles.mainView}>
          <ScrollView
              ref={(scrollView) => { _scrollView = scrollView; }}
              automaticallyAdjustContentInsets={false}
              vertical={true}
              style={detailStyles.scrollView}
              onScroll={this.handleScroll.bind(this)}
              scrollEventThrottle={200}
          >
            <View style={detailStyles.searchContent}>

              <Swiper style={[detailStyles.wrapper,{backgroundColor: 'white'}]} height={imgHeight}
                      showsButtons={false} autoplay={false} loop={false} bounces={true}
                      dot={<View style={[detailStyles.dot, {backgroundColor: 'transparent'}]} />}
                      activeDot={<View style={[detailStyles.dot, {backgroundColor: 'transparent'}]}/>}
                      renderPagination={this._renderPagination}
                      paginationStyle={{
                        bottom: 20, left: 20, right: null,
                      }}
              >
                {imageItems}
              </Swiper>

              <View style={detailStyles.slideItem}>
                <Text style={detailStyles.price}>
                  {gia}
                </Text>
                <View style={detailStyles.lineBorder}>
                  <Text style={[detailStyles.textFullWidth, {marginBottom: 8}]}>
                    {diaChi}
                  </Text>
                </View>
                <View style={[detailStyles.lineBorder, {marginBottom: 4}]} />
                {this.renderTwoNormalProps(loaiNhaDat, dienTich, {marginTop: 11}, {marginTop: 4, marginBottom: 4})}
                {this.renderTwoNormalProps(soTangOrNhaTam, soPhongNgu, {marginTop: 12}, {marginTop: 4, marginBottom: 4})}
                {this.renderTwoNormalProps(huongNhaText, soNgayDaDangTin, {marginTop: 11}, {marginTop: 4, marginBottom: 4})}
                <View style={[detailStyles.lineBorder2, {marginTop: 4, marginBottom: 8}]} />
                <View style={detailStyles.chiTietText}>
                  <Text style={[detailStyles.textTitle, {marginLeft: 0, marginBottom: 16}]}>Chi Tiết</Text>
                  <SummaryText longText={chiTiet}
                               expanded={false}>
                  </SummaryText>
                </View>
                {this._renderDanDuong()}
                {this._renderStreetView()}
                <View style={detailStyles.lineBorder2} />
                {this._renderDacDiem(loaiNhaDat, gia, giaM2, soPhongNguVal, soPhongTamVal, dienTich,
                    huongNha, duAn, ngayDangTin, luotXem, diaChi)}
                <View style={detailStyles.lineBorder2} />
                {this._renderViTri(mapUrl)}
                <View style={detailStyles.lineBorder2} />
                {this._renderShareButtons(mobile, email)}
                <View style={detailStyles.lineBorder2} />
                {this._renderLienHe(dangBoi, mobile, email)}
                <View style={detailStyles.lineBorder2} />
                {/*<CollapsiblePanel title="Môi giới" expanded={true}>
                  <Text style={[detailStyles.textFullWidth,{marginTop: 0}]}>
                    Các môi giới đang bán nhà tương tự
                  </Text>
                  {moiGioiTuongTu}
                </CollapsiblePanel>*/}
                <CollapsiblePanel title="Phương Án Tài Chính"
                                    expanded={true} bodyProps={{marginTop: 0}}
                                    mainProps={{marginTop: 8}}
                                    collapseProps={{marginTop: 15, marginBottom: 15}}>
                    <Text style={[detailStyles.textFullWidth,{fontSize: 13, marginTop: 0, color: '#9C9C9C'}]}>
                      Tính trên cơ sở vay 70% giá trị nhà trong vòng 15 năm với lãi suất cố định 12%/năm theo số tiền vay
                    </Text>
                  {this._renderPhuongAnTaiChinh()}
                  <Text style={{fontSize: 5}} />
                </CollapsiblePanel>
                <View style={detailStyles.lineBorder2} />
                <View style={{marginTop: 10.5, alignItems: 'center', justifyContent:'center'}}>
                  <Text style={detailStyles.adsMore}>
                    Khám Phá Thêm
                  </Text>
                  <View style={{width: width, marginTop: 10.5}}>
                    {this.renderContent(this.props.search.collections)}
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>

          {this._renderHeaderBar()}
        </View>
        {this._renderFooter(mobile, rowData)}
        {this.state.modal ? this._renderImagePreviewModal(imageDataItems, mobile, rowData) : null }
        </View>
		)
	}

  _renderDacDiem(loaiNhaDat, gia, giaM2, soPhongNguVal, soPhongTamVal, dienTich, huongNha, duAn, ngayDangTin, luotXem, diaChi) {
    return (
        <CollapsiblePanel title="Đặc Điểm" mainProps={{marginTop: 8, marginBottom: 8}}
                          collapseProps={{marginTop: 15, marginBottom: 15}}
                          expanded={true} bodyProps={{marginTop: 0}}>
          <Text style={[detailStyles.textFullWidth,{fontSize: 13, marginTop: 0, color: '#9C9C9C'}]}>
            Thông tin tổng quan về bất động sản này
          </Text>
          {this.renderTitleProps("Loại tin rao", loaiNhaDat, {marginTop: 3, marginBottom: 2.2})}
          {this.renderTitleProps("Giá", gia, {marginTop: 3, marginBottom: 2.2})}
          {this.renderTitleProps("Giá/m²", giaM2, {marginTop: 3, marginBottom: 2.2})}
          {this.renderTitleProps("Số phòng ngủ", soPhongNguVal, {marginTop: 3, marginBottom: 2.2})}
          {this.renderTitleProps("Số phòng tắm", soPhongTamVal, {marginTop: 3, marginBottom: 2.2})}
          {this.renderTitleProps("Diện tích", dienTich, {marginTop: 3, marginBottom: 2.2})}
          {this.renderTitleProps("Hướng nhà", huongNha, {marginTop: 3, marginBottom: 2.2})}
          {this.renderTitleProps("Thuộc dự án", duAn, {marginTop: 3, marginBottom: 2.2})}
          {this.renderTitleProps("Ngày đăng tin", ngayDangTin, {marginTop: 3, marginBottom: 2.2})}
          {/*this.renderTitleProps("Lượt xem", luotXem, {marginTop: 3, marginBottom: 2.2})*/}
          {this.renderTitleProps("Địa chỉ", diaChi, {marginTop: 3, marginBottom: 2.2})}
          <Text style={{fontSize: 5}} />
        </CollapsiblePanel>
    );
  }

  _renderViTri(mapUrl) {
    return (
        <CollapsiblePanel title="Vị Trí" mainProps={{marginTop: 8}}
                          collapseProps={{marginTop: 15, marginBottom: 15}}
                          expanded={true} bodyProps={{marginTop: 0}}>
          <Text style={[detailStyles.textFullWidth,{fontSize: 13, marginTop: 0, color: '#9C9C9C'}]}>
            Vị trí của bất động sản này trên bản đồ
          </Text>
          <TouchableHighlight onPress={() => this._onMapPressed()}
              style={detailStyles.mapViewButton}>
            <Image style={detailStyles.imgMapView}
              source={{uri: `${mapUrl}`}}>
            </Image>
          </TouchableHighlight>
          <Text style={{fontSize: 5}} />
        </CollapsiblePanel>
    );
  }

  _onAddContact(dangBoi, mobile, email) {

  }

  _renderShareButtons(mobile, email) {
    return (
      <CollapsiblePanel title="Chia Sẻ" mainProps={{marginTop: 8, marginBottom: 8}}
                        collapseProps={{marginTop: 15, marginBottom: 15}}
                        expanded={true} bodyProps={{marginTop: 0}}>
        <Text style={[detailStyles.textFullWidth,{fontSize: 13, marginTop: 0, color: '#9C9C9C'}]}>
          Chia sẻ bất động sản này với người thân
        </Text>
        <View style={detailStyles.shareMainView}>
          <View style={detailStyles.shareLeft}>
            <View style={[detailStyles.circleContainer, {backgroundColor: '#1DB423'}]} >
              <RelandIcon onPress={() => this._onSms(mobile)}
                          name="sms" color={'white'}
                          size={26} iconProps={{style: detailStyles.shareIcon}}>
              </RelandIcon>
            </View>
            <View style={[detailStyles.circleContainer, {backgroundColor: '#CE0005'}]} >
              <RelandIcon onPress={() => this._onEmail(email)}
                          name="email" color={'white'}
                          size={26} iconProps={{style: detailStyles.shareIcon}}>
              </RelandIcon>
            </View>
            <View style={[detailStyles.circleContainer, {backgroundColor: '#A6A6A6'}]} >
              <RelandIcon onPress={this._onShare.bind(this)}
                          name="copy-link" color={'white'}
                          size={26} iconProps={{style: detailStyles.shareIcon}}>
              </RelandIcon>
            </View>
          </View>
          <View style={detailStyles.shareRight}>
            <View style={[detailStyles.circleContainer, {marginRight: 0}]} >
              <RelandIcon onPress={this._onShare.bind(this)}
                          name="share-o" color={'white'}
                          size={26} iconProps={{style: detailStyles.shareIcon}}>
              </RelandIcon>
            </View>
          </View>
        </View>
        <Text style={{fontSize: 5}} />
      </CollapsiblePanel>
    );
  }

  _onAdsAlertUs() {
    Actions.AdsAlertUs();
  }

  _renderLienHe(dangBoi, mobile, email) {
    return (
      <CollapsiblePanel title="Liên Hệ" mainProps={{marginTop: 8}}
                        collapseProps={{marginTop: 15, marginBottom: 15}}
                        expanded={true} bodyProps={{marginTop: 0}}>
        <Text style={[detailStyles.textFullWidth,{fontSize: 13, marginTop: 0, color: '#9C9C9C'}]}>
          Thông tin liên hệ của người đăng tin
        </Text>
        {this.renderTitleProps("Tên liên lạc", dangBoi, {marginTop: 3, marginBottom: 2.2})}
        {this.renderTitleProps("Điện thoại", mobile, {marginTop: 3, marginBottom: 2.2}, () => this._onCall(mobile))}
        {this.renderTitleProps("Email", email, {marginTop: 3, marginBottom: 2.2}, () => this._onEmail(email))}
        <Text style={{fontSize: 5}} />
      </CollapsiblePanel>
    );
  }
  _renderDanDuong() {
    return (
        <TouchableHighlight onPress={() => this._onDanDuongPressed()} underlayColor="transparent" >
          <View style={detailStyles.lineBorder2}>
            <View style={[detailStyles.danDuongView, {marginLeft: 20, marginRight: 29}]}>
              <View style={detailStyles.danDuongLeftView}>
                <TruliaIcon name={"car"} size={20} color={gui.mainColor} text={"Dẫn đường"}
                            textProps={detailStyles.danDuongText} onPress={() => this._onDanDuongPressed()}/>
              </View>
              <View style={detailStyles.danDuongRightView}>
                <TruliaIcon name={"arrow-right"} size={20} color={"gray"} onPress={() => this._onDanDuongPressed()}/>
              </View>
            </View>
          </View>
        </TouchableHighlight>
    );
  }

  _renderStreetView() {
    return (
        <TouchableHighlight onPress={() => this._onStreetViewPressed()} underlayColor="transparent" >
          <View style={detailStyles.lineBorder2}>
            <View style={[detailStyles.danDuongView, {marginLeft: 20, marginRight: 29}]}>
              <View style={detailStyles.danDuongLeftView}>
                <RelandIcon name={"street-view"} size={20} color={gui.mainColor} text={"Street view"}
                            mainProps={{flexDirection: 'row'}}
                            iconProps={{style: {marginRight: 0}}}
                            textProps={[detailStyles.danDuongText, {paddingLeft: 0}]}
                            onPress={() => this._onStreetViewPressed()}/>
              </View>
              <View style={detailStyles.danDuongRightView}>
                <TruliaIcon name={"arrow-right"} size={20} color={"gray"}
                            onPress={() => this._onStreetViewPressed()}/>
              </View>
            </View>
          </View>
        </TouchableHighlight>
    );
  }

  renderContent(collections) {
    if (this.props.search.homeDataErrorMsg) {
      return (
          <View style={{flex:1, alignItems:'center', justifyContent:'center', marginTop: 30}}>
            <Text style={detailStyles.welcome}>{this.props.search.homeDataErrorMsg}</Text>
          </View>
      )
    }

    return this.renderCollections(collections);
  }

  renderCollections(collections) {
    return collections.map(e => {
      return <HomeCollection key={e.title1} collectionData = {e} searchFromHome={this.props.actions.searchFromHome}/>
    });
  }

  _renderPhuongAnTaiChinh() {
    let mainAccount = 400;
    let bonusAccount = 100;
    // if (this.props.global.loggedIn) {
    //   let currentUser = this.props.global.currentUser;
    //   mainAccount = currentUser.mainAccount;
    //   bonusAccount = currentUser.bonusAccount;
    // }
    var data = [{
      "name": "",
      "fillColor" : "#1396E0",
      "value": mainAccount
    }, {
      "name": "",
      "fillColor" : "#DE6207",
      "value": bonusAccount
    }];
    var pallete = [
      util.hexToRgb("#23B750"), util.hexToRgb("#EA9409")
    ];
    var options = {
      margin: {
        top: 1,
        left: 2,
        bottom: 1,
        right: 2
      },
      width: 126,
      height: 126,
      r: 46,
      R: 61,
      legendPosition: 'topLeft',
      animate: {
        type: 'oneByOne',
        duration: 200,
        fillTransition: 3
      },
      label: {
        fontFamily: gui.fontFamily,
        fontSize: gui.buttonFontSize,
        fontWeight: 'normal'
      }
    };
    var chartTitle = 'Tổng tài khoản';
    var chartTitleBold = (mainAccount+bonusAccount) + ' triệu';
    return (
        <View style={{flexDirection: "row", alignItems: 'center', justifyContent: 'flex-start', backgroundColor:'white', paddingTop:0}}>
          <View style={{paddingLeft: 13, paddingTop:2, width: width/2, alignItems: 'center', justifyContent: 'center'}}>
            <MChartView
                data={data}
                options={options}
                pallete={pallete}
                chartTitle={chartTitle}
                chartTitleBold={chartTitleBold}
            />
          </View>
          <View style={{paddingLeft: 13, paddingTop:2}}>
            {this._renderMoneyLine("Gốc", mainAccount + " triệu", '#23B750')}
            {this._renderMoneyLine("Lãi", bonusAccount + " triệu", '#EA9409')}
          </View>
        </View>
    );
  }

  _renderMoneyLine(label, value, dotColor) {
    return (
        <View style={{flexDirection:'row'}}>
          <View style={[detailStyles.dot3, {borderColor: dotColor}]}>
          </View>
          <View style={{flexDirection:'column', marginTop: 8, marginBottom: 8}}>
            <Text style={{fontSize: 14, fontFamily: gui.fontFamily, fontWeight: 'bold'}}>
              {value}
            </Text>
            <Text style={{fontSize: 12, fontFamily: gui.fontFamily, color: '#9C9C9C'}}>
              {label}
            </Text>
          </View>
        </View>
    )
  }

  _onImagePreviewPressed() {
    if (this.state.modal) {
      return;
    }
    this.setState({
      modal: true
    });
  }

  _renderPagination(index, total, context) {
    return (
        <View style={{
      position: 'absolute',
      bottom: 20,
      left: 20,
    }}>
          <RelandIcon name="camera-o" color="black"
                 iconProps={{style: detailStyles.pagingIcon}} size={16}
                 textProps={detailStyles.pagingText}
                 mainProps={detailStyles.pagingView}
                 text={(index + 1) + '/' + (total)}
          >
          </RelandIcon>
        </View>
    )
  }

  _onCall(phone) {
    Communications.phonecall(phone, true);
  }

  _onEmail(email) {
    Communications.email([email], null, null, null, null);
  }

  _onSms(phone) {
    Communications.text(phone, null);
  }

  _onChat(ads) {
    if (!ads.dangBoi.userID) {
      alert(gui.ERR_NotRelandUser);
      return;
    }


    if (!this.props.global.loggedIn) {
      Actions.LoginRegister({page:1});
    } else {
      if (ads.dangBoi.userID == this.props.global.currentUser.userID) {
        alert(gui.ERR_NotAllowChatYourSelf);
        return;
      }

      let partner = {
        userID : ads.dangBoi.userID,
        phone: ads.dangBoi.phone,
        fullName : ads.dangBoi.name,
      };

      let relatedToAds = {
        adsID : ads.adsID,
        loaiNhaDatFmt : utils.getLoaiNhaDatFmt(ads),
        giaFmt : utils.getPriceDisplay(ads.gia, ads.loaiTin),
        diaChinhFullName : placeUtil.getDiaChinhFullName(ads.place),
        cover : ads.image.cover,
        loaiTin: ads.loaiTin,
        dienTichFmt: utils.getDienTichDisplay(ads.dienTich),
        loaiNhaDat: ads.loaiNhaDat
      };

      this.props.actions.startChat(partner, relatedToAds);
      Actions.Chat();
    }
  }

  _onMapPressed() {
    var {geo} = this.state.data.place;
    let data = {
      currentLocation : {
        "lat": geo.lat,
        "lon": geo.lon
      }
    };

    var region = {
      latitude: data.currentLocation.lat,
      longitude: data.currentLocation.lon,
      latitudeDelta: 0.021,
      longitudeDelta: 0.0144
    };
    let listAds = [];
    listAds.push(this.state.data);
    Actions.SearchMapDetail({region: region, listAds: listAds, coords: this.state.coords});
  }

  _drawDiemDanhGia(diemDanhGia) {
    var diemDanhGiaItems = [];
    var i = 0;
    for(i = 0; i < diemDanhGia; i++) {
      diemDanhGiaItems.push(
          <TruliaIcon key={'diem-'+i} name="star" mainProps={detailStyles.moiGioiStar} color={'#FEBC0A'} size={16}/>);
    }
    for(i = 0; i < 5-diemDanhGia; i++) {
      diemDanhGiaItems.push(
          <TruliaIcon key={'diem-star-'+i} name="star-o" mainProps={detailStyles.moiGioiStarO} color={'#FEBC0A'} size={16}/>);
    }
    return (
        <View style={detailStyles.moiGioiStarView}>
          {diemDanhGiaItems}
        </View>
    );
  }

  _onDanDuongPressed() {
    Linking.canOpenURL(this.state.geoUrl).then(supported => {
      if (supported) {
        Linking.openURL(this.state.geoUrl);
      } else {
        console.log('Don\'t know how to open URI: ' + this.state.geoUrl);
      }
    });
  }

  _onStreetViewPressed() {

  }

  renderTwoNormalProps(prop1, prop2, dotStyle, textStyle) {
    if (prop1 || prop2) {
      return (
          <View style={[detailStyles.searchDetailRowAlign, {width: width - 42.5, marginLeft: 20}]}>
            <View style={{flexDirection: 'row'}}>
              <View style={[detailStyles.dot2, dotStyle]} />
              <Text style={[detailStyles.textHalfWidth, textStyle]}>
                {prop1}
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={[detailStyles.dot2, dotStyle]} />
              <Text style={[detailStyles.textHalfWidth, textStyle]}>
                {prop2}
              </Text>
            </View>
          </View>
      )
    }
  }

  renderTitleProps(title, prop, textStyle, onPress) {
    if (prop) {
      if (onPress) {
        return (
            <View style={detailStyles.searchDetailRowAlign}>
              <Text style={[detailStyles.textHalfWidth2, textStyle]}>
                {title}
              </Text>
              <TouchableHighlight onPress={onPress}>
                <Text style={[detailStyles.textHalfWidthBold2, textStyle]}>
                  {prop}
                </Text>
              </TouchableHighlight>
            </View>
        );
      } else {
        return (
            <View style={detailStyles.searchDetailRowAlign}>
              <Text style={[detailStyles.textHalfWidth2, textStyle]}>
                {title}
              </Text>
              <Text style={[detailStyles.textHalfWidthBold2, textStyle]}>
                {prop}
              </Text>
            </View>
        );
      }
    }
  }

 handleScroll(event: Object) {
   if (event.nativeEvent.contentOffset.y <= imgHeight-64 && this.state.headerColor != 'transparent') {
     StatusBar.setBarStyle('light-content');
     this.setState({
       headerColor: 'transparent',
       headerButtonColor: 'white',
       backButtonColor: 'white',
       heartBgColor: '#323230'
     });
   } else if (event.nativeEvent.contentOffset.y > imgHeight-64 && this.state.headerColor != '#FEFEFE') {
     StatusBar.setBarStyle('default');
     this.setState({
       headerColor: '#FEFEFE',
       headerButtonColor: 'black',
       backButtonColor: gui.mainColor,
       heartBgColor: '#FEFEFE'
     });
   }
 //   if (event.nativeEvent.contentOffset.y <= imgHeight-30 && this.state.headerButtonColor != 'white') {
 //     StatusBarIOS.setStyle('light-content');
 //     this.setState({
 //       headerButtonColor: 'white'
 //     });
 //   } else if (event.nativeEvent.contentOffset.y > imgHeight-30 && this.state.headerButtonColor != gui.mainColor) {
 //     StatusBarIOS.setStyle('default');
 //     this.setState({
 //       headerButtonColor: gui.mainColor
 //     });
 //   }
 }

  _onBack() {
    Actions.pop();
  }

  _onShare() {
    ShareManager.share({text: text, url: url});
  }

  _onLike() {
    console.log("On like pressed!");
  }
}

var detailStyles = StyleSheet.create({
  pagingText: {
    fontSize: 14,
    fontFamily: gui.fontFamily,
    fontWeight: 'normal',
    color: 'black',
    marginRight: 10,
    marginBottom: 2,
    marginTop: 2
  },
  pagingIcon: {
    borderRadius: 0,
    marginLeft: 10,
    marginBottom: 2,
    marginTop: 2
  },
  pagingView: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 5,
    opacity: 0.75
  },
  moiGioiStar: {
    marginRight: 5
  },
  moiGioiStarO: {
    marginRight: 5
  },
  moiGioiStarView: {
    flexDirection: 'row',
    marginTop: 5,
    marginBottom: 5
  },
  moiGioiRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  moiGioiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  moiGioiInfo: {
    flexDirection: 'column',
    marginLeft: 8,
    width: width - 192
  },
  moiGioiImage: {
    width: 60,
    height: 60
  },
  moiGioiName: {
    fontSize: 13,
    fontFamily: gui.fontFamily,
    fontWeight: 'bold',
    color: 'black'
  },
  moiGioiNumberOfAds: {
    fontSize: 13,
    fontFamily: gui.fontFamily,
    fontWeight: 'normal',
    color: 'black'
  },
  moiGioiButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  moiGioiChatButton: {
    backgroundColor: 'transparent',
    color: '#EA9409',
    borderColor: '#EA9409',
    fontFamily: gui.fontFamily,
    fontWeight: 'normal',
    fontSize: 14,
    textAlign: 'center',
    borderWidth: 2,
    borderRadius: 5,
    padding: 5,
    paddingTop: 3,
    paddingBottom: 0
  },
  moiGioiCallButton: {
    backgroundColor: 'transparent',
    color: '#FB0007',
    borderColor: '#FB0007',
    fontFamily: gui.fontFamily,
    fontWeight: 'normal',
    fontSize: 14,
    textAlign: 'center',
    borderWidth: 2,
    borderRadius: 5,
    marginLeft: 5,
    padding: 5,
    paddingTop: 3,
    paddingBottom: 0
  },
  shareButton: {
    paddingLeft: 10,
    marginTop: 24,
    paddingRight: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  backButton: {
    paddingLeft: 15,
    paddingRight: 15,
    marginTop: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  circleContainer: {
    marginTop: 0,
    marginBottom: 0,
    marginRight: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#A8A8A8'
  },
  shareIcon: {
    marginTop: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  shareLeft: {
    width: width-80,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
    marginBottom: 8
  },
  shareRight: {
    alignItems: 'flex-end',
    marginTop: 8,
    marginBottom: 8
  },
  welcome: {
      marginTop: -50,
      marginBottom: 50,
      fontSize: 16,
      textAlign: 'center',
      margin: 10,
  },
  linearGradient: {
    flex: 1,
    paddingLeft: 0,
    paddingRight: 0,
    backgroundColor : "transparent"
  },
  mainView: {
    flex: 1,
    paddingLeft: 0,
    paddingRight: 0,
    backgroundColor : "transparent"
  },
  scrollView: {
    flex: 1,
    position: 'absolute',
    height: height-44
  },
  fullWidthContainer: {
      flex: 1,
      alignItems: 'stretch',
      backgroundColor: 'white',
  },
  searchContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  searchDetailRowAlign: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-around',
  },
  viTriTitle: {
      alignItems: 'flex-start',
      justifyContent: 'flex-start'
  },
  viTriText: {
    textAlign: 'left',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
    fontSize: 13,
    fontFamily: 'Open Sans',
    color: 'black',
    marginTop: 3,
    marginBottom: 3,
    marginLeft: 0
  },
  chiTietText: {
      marginBottom: 8,
      marginLeft: 19.5
  },
  shareMainView: {
      flexDirection: 'row',
      // marginTop: 0,
      // marginBottom: 0,
      // marginLeft: 20,
      // marginRight: 20
  },
  headerContainer: {
    borderBottomColor: '#D7D7D7',
    borderBottomWidth: 0.5
  },
  customPageHeader: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: width,
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      // backgroundColor: gui.mainColor,
      // opacity: 0.55,
      height: 64
  },
	search: {
      marginLeft: 20,
			marginTop: 20,
	    flexDirection: 'row',
	    alignItems: 'center',
			justifyContent: 'center',
			backgroundColor: 'transparent',
	},
  search2: {
      marginLeft: 10,
      marginTop: 28,
      marginRight: 5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
  },
  wrapper: {
    marginTop: 0,
    marginBottom: 0
  },
  slide: {
    justifyContent: 'center',
    backgroundColor: 'transparent',
    //
  },
  dot : {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
    bottom: 32
  },
  dot2 : {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginTop: 11,
    marginLeft: 20,
    marginRight: 0,
    backgroundColor: '#C1C1C1'
  },
  dot3 : {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 14,
    marginTop: 18,
    backgroundColor: 'white',
    borderWidth: 3.5
  },
  imgItem: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
    height: imgHeight
  },
  searchMapView: {
    marginTop: 7,
    marginBottom: 4,
    alignItems: 'center',
    justifyContent: 'center'
  },
  imgMapView: {
    width: mapWidth,
    height: mapHeight,
  },
  mapViewButton: {
    backgroundColor: 'transparent',
    width: mapWidth,
    // marginLeft: 20,
    // marginRight: 20
  },
  slideItem: {
    flex: 1, justifyContent: 'flex-start', alignItems: 'stretch',
          backgroundColor: 'transparent', marginTop: 8
  },
  price: {
    fontSize: 22,
    fontFamily: gui.fontFamily,
    fontWeight: 'bold',
    textAlign: 'left',
    backgroundColor: 'transparent',
    color: '#BE0004',
    marginBottom: 8,
    marginLeft: 18.5,
    marginRight: 20,
  },
  textTitle: {
    fontSize: 16,
    fontFamily: gui.fontFamily,
    fontWeight: '600',
    textAlign: 'left',
    backgroundColor: 'transparent',
    color: 'black',
    marginBottom: 16,
    marginLeft: 19.5,
    marginRight: 22.5,
  },
  textHalfWidth: {
    textAlign: 'left',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
    fontSize: 14,
    fontFamily: gui.fontFamily,
    color: 'black',
    marginTop: 3,
    marginBottom: 4,
    marginLeft: 5,
    marginRight: 10,
    width: width/2-20
  },
  textHalfWidthBold: {
    textAlign: 'left',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
    fontSize: 14,
    fontFamily: gui.fontFamily,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 10,
    marginRight: 10,
    width: width/2-20
  },
  textHalfWidth2: {
    textAlign: 'left',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
    fontSize: 14,
    fontFamily: gui.fontFamily,
    color: 'black',
    marginTop: 3,
    marginBottom: 2,
    marginLeft: 9.5,
    marginRight: 9.5,
    width: width/2-19
  },
  textHalfWidthBold2: {
    textAlign: 'left',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
    fontSize: 14,
    fontFamily: gui.fontFamily,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 3,
    marginBottom: 2,
    marginLeft: 9.5,
    marginRight: 9.5,
    width: width/2-19
  },
  textFullWidth: {
    textAlign: 'left',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
    fontSize: 14,
    fontFamily: gui.fontFamily,
    color: 'black',
    marginTop: 8,
    marginBottom: 7,
    marginLeft: 0,
    marginRight: 0,
  },
  lineBorder: {
    borderTopWidth: 1,
    borderTopColor: 'lightgray',
    width: width - 44,
    marginLeft: 20
  },
  lineBorder2: {
    borderTopWidth: 1,
    borderTopColor: 'lightgray',
    width: width,
    marginLeft: 0,
    marginRight: 0
  },
  danDuongView: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    paddingTop: 8,
    marginBottom: 8
  },
  danDuongLeftView: {
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  danDuongRightView: {
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  danDuongText: {
    marginLeft: 10,
    fontSize: 14,
    fontFamily: gui.fontFamily,
    fontWeight: 'normal',
    color: 'black',
    textAlign: 'left'
  },
  adsMore: {
    fontSize: 13,
    fontFamily: gui.fontFamily,
    fontWeight: 'normal',
    color: '#f0a401',
    textAlign: 'center'
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchResultDetail);
