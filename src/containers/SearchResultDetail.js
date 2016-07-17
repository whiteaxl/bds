'use strict';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as globalActions from '../reducers/global/globalActions';
import * as searchActions from '../reducers/search/searchActions';
import * as chatActions from '../reducers/chat/chatActions';


import {Map} from 'immutable';

import React, {Component} from 'react';

import { Text, View, Image, Dimensions, ScrollView, StyleSheet, StatusBar, TouchableHighlight, Linking } from 'react-native'

var ShareManager = React.ShareManager;

import {Actions} from 'react-native-router-flux';

import DanhMuc from '../assets/DanhMuc';

import SearchResultDetailFooter from '../components/SearchResultDetailFooter';
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

var Communications = require('react-native-communications');

import ImagePreview from '../components/ImagePreview';

import dbService from "../lib/localDB";

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

var mapSize = Dimensions.get('window').width-30;

var imgHeight = 256;

var url = '';

var text = '';

class SearchResultDetail extends Component {
  constructor(props) {
    super(props);

    StatusBar.setBarStyle('light-content');

    this.state = {
      'data' : null,
      loaded: false,
      modal: false
    }
  }
  fetchData() {
    //console.log("adsID: " + this.props.adsID);
    if (this.props.source == 'server') {
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
          <CommonHeader headerTitle={"Chi tiết"} />
          <View style={detailStyles.searchContent}>
            <GiftedSpinner />
          </View>
          <SearchResultDetailFooter />
        </View>
    )
  }
  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }
    var rowData = this.state.data;
    //var listData = this.props.search.form.fields.listData;

    //var rowData = listData[rowIndex];
    //console.log(rowData);
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
    var huongNha = DanhMuc.HuongNha[rowData.huongNha];
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
    var ngayDangTin = rowData.ngayDangTin;
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
    var mapUrl = 'http://maps.google.com/maps/api/staticmap?zoom=12&size='+mapSize+'x'+((mapSize-mapSize%2)/2)+'&markers=color:red|'+rowData.place.geo.lat+','+rowData.place.geo.lon+'&sensor=false';
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
               source={{uri: `${imageUrl}`}}>
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
               source={{uri: `${imageUrl}`}}>
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
        <View style={detailStyles.customPageHeader}>
          <TruliaIcon onPress={this._onBack.bind(this)}
            name="arrow-left" color="white"
            mainProps={detailStyles.backButton} size={25} >
          </TruliaIcon>
          <View style={[detailStyles.shareMainView, {marginRight: 0, marginLeft: 0}]}>
            <RelandIcon onPress={this._onShare.bind(this)}
              name="share-o" color="white"
              iconProps={{style: [detailStyles.shareButton, {paddingLeft: 25}]}} size={26} >
            </RelandIcon>
            <RelandIcon onPress={this._onShare.bind(this)}
              name="more" color="white"
              iconProps={{style: [detailStyles.shareButton, {paddingRight: 20}]}} size={30} >
            </RelandIcon>
          </View>
        </View>
        <View style={detailStyles.mainView}>
          <ScrollView
            ref={(scrollView) => { _scrollView = scrollView; }}
            automaticallyAdjustContentInsets={false}
            vertical={true}
            style={detailStyles.scrollView}
            //onScroll={this.handleScroll.bind(this)}
            //scrollEventThrottle={1}
            >
            <View style={detailStyles.searchContent}>

              <Swiper style={[detailStyles.wrapper,{backgroundColor: 'gray'}]} height={imgHeight}
                      showsButtons={false} autoplay={false} loop={false}
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
                  <Text style={detailStyles.textFullWidth}>
                    {diaChi}
                  </Text>
                </View>
                {this.renderTwoNormalProps(loaiTin, loaiNhaDat)}
                {this.renderTwoNormalProps(dienTich, soPhongNgu)}
                {this.renderTwoNormalProps(soPhongTam, soNgayDaDangTin)}
                <View style={[detailStyles.lineBorder, {marginBottom: 10}]} />
                <View style={detailStyles.chiTietText}>
                  <Text style={[detailStyles.textTitle, {marginLeft: 0}]}>Chi Tiết</Text>
                  <SummaryText longText={chiTiet} expanded={false}>
                  </SummaryText>
                </View>
                <TouchableHighlight onPress={() => this._onDanDuongPressed()} underlayColor="transparent" >
                  <View style={[detailStyles.lineBorder,detailStyles.danDuongView]}>
                      <View style={detailStyles.danDuongLeftView}>
                        <TruliaIcon name={"car"} size={20} color={gui.mainColor} text={"Dẫn đường"}
                                    textProps={detailStyles.danDuongText} />
                      </View>
                      <View style={detailStyles.danDuongRightView}>
                        <TruliaIcon name={"arrow-right"} size={20} color={"gray"} />
                      </View>
                  </View>
                </TouchableHighlight>
                <View style={detailStyles.lineBorder} />
                <CollapsiblePanel title="Đặc Điểm" expanded={true}>
                  {this.renderTitleProps("Loại tin rao", loaiNhaDat)}
                  {this.renderTitleProps("Giá", gia)}
                  {this.renderTitleProps("Giá/m²", giaM2)}
                  {this.renderTitleProps("Số phòng ngủ", soPhongNguVal)}
                  {this.renderTitleProps("Số phòng tắm", soPhongTamVal)}
                  {this.renderTitleProps("Diện tích", dienTich)}
                  {this.renderTitleProps("Hướng nhà", huongNha)}
                  {this.renderTitleProps("Thuộc dự án", duAn)}
                  {this.renderTitleProps("Ngày đăng tin", ngayDangTin)}
                  {this.renderTitleProps("Lượt xem", luotXem)}
                  {this.renderTitleProps("Địa chỉ", diaChi)}
                  <View style={detailStyles.viTriTitle}>
                    <Text style={detailStyles.viTriText}>
                      Vị Trí
                    </Text>
                  </View>
                  <View style={detailStyles.searchMapView}>
                    <TouchableHighlight onPress={() => this._onMapPressed()}
                      style={detailStyles.mapViewButton}>
                      <Image style={detailStyles.imgMapView}
                         source={{uri: `${mapUrl}`}}>
                      </Image>
                    </TouchableHighlight>
                  </View>
                </CollapsiblePanel>
                <View style={detailStyles.lineBorder2} />
                <View style={detailStyles.shareMainView}>
                  <View style={detailStyles.shareLeft}>
                    <View style={[detailStyles.circleContainer, {backgroundColor: '#0A5594'}]} >
                      <RelandIcon onPress={this._onShare}
                                  name="facebook" color={'white'}
                                  size={26} iconProps={{style: detailStyles.shareIcon}}>
                      </RelandIcon>
                    </View>
                    <View style={[detailStyles.circleContainer, {backgroundColor: '#EA9409'}]} >
                      <RelandIcon onPress={() => this._onChat(mobile)}
                                  name="sms" color={'white'}
                                  size={26} iconProps={{style: detailStyles.shareIcon}}>
                      </RelandIcon>
                    </View>
                    <View style={[detailStyles.circleContainer, {backgroundColor: '#1E7AC0'}]} >
                      <RelandIcon onPress={this._onShare}
                                  name="zalo" color={'white'}
                                  size={32} iconProps={{style: [detailStyles.shareIcon,{marginLeft: 2, marginTop: 0.5}]}}>
                      </RelandIcon>
                    </View>
                    <View style={[detailStyles.circleContainer, {backgroundColor: '#CE0005'}]} >
                      <RelandIcon onPress={this._onShare}
                                  name="email" color={'white'}
                                  size={26} iconProps={{style: detailStyles.shareIcon}}>
                      </RelandIcon>
                    </View>
                  </View>
                  <View style={detailStyles.shareRight}>
                    <View style={[detailStyles.circleContainer, {marginRight: 0}]} >
                      <RelandIcon onPress={this._onShare}
                                   name="share-o" color={'white'}
                                   size={26} iconProps={{style: detailStyles.shareIcon}}>
                      </RelandIcon>
                    </View>
                  </View>
                </View>
                <View style={detailStyles.lineBorder2} />
                <CollapsiblePanel title="Liên Hệ" expanded={true}>
                  {this.renderTitleProps("Tên liên lạc", dangBoi)}
                  {this.renderTitleProps("Điện thoại", mobile)}
                  {this.renderTitleProps("Email", email)}
                  <Text style={{fontSize: 5}} />
                </CollapsiblePanel>
                <View style={detailStyles.lineBorder2} />
                <CollapsiblePanel title="Môi giới" expanded={true}>
                  <Text style={[detailStyles.textFullWidth,{marginTop: 0}]}>
                    Các môi giới đang bán nhà tương tự
                  </Text>
                  {moiGioiTuongTu}
                </CollapsiblePanel>
              </View>
            </View>
          </ScrollView>

        </View>
        <SearchResultDetailFooter mobile={mobile} onChat={() => this._onChat(rowData)}/>
        {this.state.modal ? <ImagePreview images={imageDataItems} closeModal={() => this.setState({modal: false}) }/> : null }
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
          <RelandIcon name="camera" color="black"
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

  renderTwoNormalProps(prop1, prop2) {
    if (prop1 || prop2) {
      return (
          <View style={[detailStyles.searchDetailRowAlign,detailStyles.lineBorder]}>
            <View style={{flexDirection: 'row'}}>
              <View style={detailStyles.dot2} />
              <Text style={detailStyles.textHalfWidth}>
                {prop1}
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={detailStyles.dot2} />
              <Text style={detailStyles.textHalfWidth}>
                {prop2}
              </Text>
            </View>
          </View>
      )
    }
  }

  renderTitleProps(title, prop) {
    if (prop) {
      return (
        <View style={detailStyles.searchDetailRowAlign}>
          <Text style={detailStyles.textHalfWidth2}>
            {title}
          </Text>
          <Text style={detailStyles.textHalfWidthBold2}>
            {prop}
          </Text>
        </View>
      )
    }
  }

 // handleScroll(event: Object) {
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
 // }

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
    borderRadius: 5
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
    width: Dimensions.get('window').width - 192
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
    marginTop: 5,
    marginBottom: 5,
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
    width: Dimensions.get('window').width-66,
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
    marginLeft: 3
  },
  chiTietText: {
      marginBottom: 15,
      marginLeft: 15
  },
  shareMainView: {
      flexDirection: 'row',
      marginTop: 0,
      marginBottom: 0,
      marginLeft: 15,
      marginRight: 15
  },
  customPageHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      backgroundColor: gui.mainColor,
      height: 60
  },
	search: {
      marginLeft: 15,
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
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 16,
    marginLeft: 18,
    marginRight: 0,
    backgroundColor: '#C1C1C1'
  },
  imgItem: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width,
    height: 256
  },
  searchMapView: {
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  imgMapView: {
    width: mapSize,
    height: mapSize/2,
  },
  mapViewButton: {
    backgroundColor: 'transparent',
    width: mapSize,
    marginLeft: 15,
    marginRight: 15
  },
  slideItem: {
    flex: 1, justifyContent: 'flex-start', alignItems: 'stretch',
          backgroundColor: 'transparent', marginTop: 15
  },
  price: {
    fontSize: 22,
    fontFamily: gui.fontFamily,
    fontWeight: 'bold',
    textAlign: 'left',
    backgroundColor: 'transparent',
    color: '#BE0004',
    marginBottom: 10,
    marginLeft: 15,
    marginRight: 15,
  },
  textTitle: {
    fontSize: 16,
    fontFamily: gui.fontFamily,
    fontWeight: 'bold',
    textAlign: 'left',
    backgroundColor: 'transparent',
    color: 'black',
    marginBottom: 10,
    marginLeft: 15,
    marginRight: 15,
  },
  textHalfWidth: {
    textAlign: 'left',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
    fontSize: 14,
    fontFamily: gui.fontFamily,
    color: 'black',
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 5,
    marginRight: 10,
    width: Dimensions.get('window').width/2-20
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
    width: Dimensions.get('window').width/2-20
  },
  textHalfWidth2: {
    textAlign: 'left',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
    fontSize: 13,
    fontFamily: gui.fontFamily,
    color: 'black',
    marginTop: 3,
    marginBottom: 3,
    marginLeft: 10,
    marginRight: 10,
    width: Dimensions.get('window').width/2-20
  },
  textHalfWidthBold2: {
    textAlign: 'left',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
    fontSize: 13,
    fontFamily: gui.fontFamily,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 3,
    marginBottom: 3,
    marginLeft: 10,
    marginRight: 10,
    width: Dimensions.get('window').width/2-20
  },
  textFullWidth: {
    textAlign: 'left',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
    fontSize: 14,
    fontFamily: gui.fontFamily,
    color: 'black',
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 0,
    marginRight: 0,
  },
  lineBorder: {
    borderTopWidth: 1,
    borderTopColor: 'lightgray',
    width: Dimensions.get('window').width - 30,
    marginLeft: 15
  },
  lineBorder2: {
    borderTopWidth: 1,
    borderTopColor: 'lightgray',
    width: Dimensions.get('window').width,
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
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchResultDetail);
