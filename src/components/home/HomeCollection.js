'use strict';

import  React, {Component} from 'react';
import { Text, StyleSheet, View, ScrollView, Image, Dimensions, TouchableOpacity, AlertIOS } from 'react-native'

import gui from '../../lib/gui';
import log from '../../lib/logUtil';

import LinearGradient from 'react-native-linear-gradient';

import DanhMuc from '../../assets/DanhMuc';

import {Actions} from 'react-native-router-flux';

import MHeartIcon from '../MHeartIcon';

import GiftedSpinner from 'react-native-gifted-spinner';

import cfg from "../../cfg";

import CommonUtils from '../../lib/CommonUtils';

const noCoverUrl = cfg.noCoverUrl;

var imageHeight = 143;

export default class HomeCollection extends Component {
  _onAdsPressed(ads) {
    Actions.SearchResultDetail({adsID: ads.adsID, source: 'server'})
  }

  _onSeeMore() {
    let {query} = this.props.collectionData;
    query.limit = 2*this.props.maxAdsInMapView;
    query.isIncludeCountInResponse = false;
    this.props.onResetSearch();
    Actions.SearchResultListExt({collection: this.props.collectionData});
    this.props.searchFromHome(query, () => {}, (error) =>
        AlertIOS.alert('Thông báo',
            error,
            [{
              text: 'Đóng',
              onPress: () => {}
            }]));
  }

  _renderAds(ads, flex) {
    if (ads) {
      return (
        <TouchableOpacity onPress={() => this._onAdsPressed(ads)} style={{flex: flex}}>
          <ImageItem ads={ads} adsLikes={this.props.adsLikes} loggedIn={this.props.loggedIn}
                     likeAds={this.props.likeAds}
                     unlikeAds={this.props.unlikeAds} userID={this.props.userID}
                     loadHomeData={this.props.loadHomeData}
                     uploadingLikedAds = {this.props.uploadingLikedAds}
          />
        </TouchableOpacity>
      );
    } else {
      log.info("_renderAds null");

      return null
    }
  }

  render() {
    let {title1, title2, data, query} = this.props.collectionData;

    if (!data[0]) {
      return (
          <View>{null}</View>
      );
    }
    return(
      <View style={{flexDirection: "column"}}>
        <View style={styles.titleContainer}>
          <Text style={styles.boldTitle}>BỘ SƯU TẬP</Text>
          <Text style={styles.categoryLabel}>{title1}</Text>
          <Text style={styles.arrowLabel}>{title2}</Text>
        </View>

        <View style={styles.rowItem}>
          {this._renderAds(data[0], 0.55)}
          <View style={{width:1}}/>
          {this._renderAds(data[1], 0.45)}
        </View>

        <View style={{height:1}}/>

        <View style={styles.rowItem}>
          {this._renderAds(data[2], 0.45)}
          <View style={{width:1}}/>
          {this._renderAds(data[3], 0.55)}
        </View>

        <View style={{height:1}}/>
        <View style={{flex: 1}}>
          {this._renderAds(data[4], 1)}
        </View>

        <TouchableOpacity style={{backgroundColor:'transparent'}} onPress={this._onSeeMore.bind(this)} >
          <View style={styles.moreDetail}>
            <Text style={styles.moreDetailButton}>Xem thêm</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}


class ImageItem extends React.Component{
  constructor(props){
    super(props);
    let {adsLikes, ads} = props;
    let initLikedState = (adsLikes && adsLikes.indexOf(ads.adsID) > -1);

    this.state = {
      uploadingLikedAds: props.uploadingLikedAds,
      initLikedState: initLikedState
    }
  }
  render() {
    let {adsID, cover, giaFmt, khuVuc} = this.props.ads;
    let detail = this.getMoreInfo(this.props.ads);

    let imageUri = {uri: cover};
    
    /*if (noCoverUrl == cover) {
      imageUri = require('../../assets/image/reland_house_large.jpg');
    }*/

    if (!adsID || adsID.length ==0 || adsID == 'EMPTY'){
      imageUri = require('../../assets/image/no_cover_home.jpg');
    }

    return (
      <Image style={[styles.imgItem]} resizeMode = {'cover'}
             source={imageUri} defaultSource={CommonUtils.getNoCoverImage()}>

        <LinearGradient colors={['transparent', 'rgba(0, 0, 0, 0.55)']}
                        style={styles.linearGradient2}>
        </LinearGradient>

        {this._renderHeartButton()}

        <View style={styles.itemContent}>
          <View style={{flex: 1, paddingRight: 7}}>
            <Text style={styles.price}>{giaFmt}</Text>
            <Text style={styles.text} numberOfLines={1}>{khuVuc}</Text>
            <Text style={styles.text}>{detail}</Text>
          </View>
        </View>
      </Image>
    );
  }

  _renderHeartButton(){
    let isLiked = this.isLiked();
    let color = isLiked ? '#E7E9EB' : 'white';
    let bgColor = isLiked ? '#EC1B77' : '#4A443F';
    let bgStyle = isLiked ? {} : {opacity: 0.55};

    if (this.props.uploadingLikedAds.uploading && this.props.uploadingLikedAds.adsID == this.props.ads.adsID){
      return (
          <View style={styles.heartContent}>
            <View style={styles.heartButton}>
              <GiftedSpinner size="small" color="white"/>
            </View>
          </View>);
    } else {
      return (
          <View style={styles.heartContent}>
            <MHeartIcon onPress={() => this.onLike()} color={color} bgColor={bgColor} bgStyle={bgStyle}
                        mainProps={styles.heartButton}/>
          </View>
      )
    }
  }

  getMoreInfo(ads) {
    var loaiTin = ads.loaiTin;
    var loaiNhaDat = ads.loaiNhaDat;
    var dienTich = '';
    if (ads.dienTichFmt && ads.dienTichFmt != 'Không rõ') {
      dienTich = ads.dienTichFmt;
    }
    var soPhongNgu = '';
    if (ads.soPhongNguFmt) {
      soPhongNgu = "   " + ads.soPhongNguFmt;
    }

    var soTang = '';
    if (ads.soTangFmt) {
      soTang = "   " + ads.soTangFmt;
    }
    var moreInfo = '';
    var loaiNhaDatKeys = loaiTin ? DanhMuc.LoaiNhaDatThueKey : DanhMuc.LoaiNhaDatBanKey;
    if (loaiNhaDat == loaiNhaDatKeys[1]) {
      moreInfo = dienTich + soPhongNgu;
    }
    else if ( !loaiTin && ((loaiNhaDat == loaiNhaDatKeys[2])
        || (loaiNhaDat == loaiNhaDatKeys[3])
        || (loaiNhaDat == loaiNhaDatKeys[4])) ||
        loaiTin && ((loaiNhaDat == loaiNhaDatKeys[2])
        || (loaiNhaDat == loaiNhaDatKeys[3])
        || (loaiNhaDat == loaiNhaDatKeys[6]))) {
      moreInfo = dienTich + soTang;
    }
    else {
      moreInfo = dienTich;
    }
    return moreInfo;
  }

  isLiked() {
    const {adsLikes, ads} = this.props;
    return adsLikes && adsLikes.indexOf(ads.adsID) > -1;
  }

  onLike() {
    if (!this.props.loggedIn) {
      Actions.Login();
    } else {
      if (!this.isLiked()) {
        this.props.likeAds(this.props.userID, this.props.ads.adsID);
      } else {
        this.props.unlikeAds(this.props.userID, this.props.ads.adsID);
      }
    }
  }
}

var styles = StyleSheet.create({
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
    marginBottom: 45
  },
  pageHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: gui.mainColor,
    height: 61
  },
  search: {
    backgroundColor: gui.mainColor,
    height: 61
  },
  imgItem: {
    flex:1,
    height:imageHeight
  },
  column: {
    flex:1,
    alignItems: "center"
  },
  boldTitle: {
    fontFamily: gui.fontFamily,
    fontSize: 12,
    fontWeight: 'normal',
    backgroundColor: 'transparent',
    color: gui.mainColor
  },
  categoryLabel: {
    fontFamily: gui.fontFamily,
    fontSize: 16,
    fontWeight: '500',
    backgroundColor: 'transparent'
  },
  arrowLabel: {
    fontFamily: gui.fontFamily,
    fontSize: 12,
    backgroundColor: 'transparent',
    color: gui.arrowColor,
    fontWeight: 'normal'
  },
  rowItem: {
    flexDirection: "row",
  },
  moreDetail: {
    margin: 9,
    marginLeft:25,
    marginRight:25,
    marginBottom: 11,
    padding: 4,
    paddingBottom: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: gui.mainColor,
    borderRadius: 5,
    borderColor: 'transparent'
  },
  moreDetailButton: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    backgroundColor: 'transparent',
    color: 'white',
    fontFamily: gui.fontFamily,
    fontWeight: 'normal',
    fontSize: 15
  },
  linearGradient: {
    backgroundColor : "transparent"
  },
  itemContent: {
    position: 'absolute',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    top: imageHeight - 60,
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
    position: 'absolute',
    backgroundColor: 'transparent',
    top: 3,
    right: 10,
    alignSelf: 'auto'
  },
  heartButton: {
    marginTop: 6,
    marginLeft: 30
  },

  titleContainer : {
    height: 72,
    alignItems:'center',
    justifyContent: 'center',
    padding: 0,
    marginBottom: 2
    /*
     borderColor: 'red',
     borderWidth : 1,
     */
  },
  linearGradient2: {
    marginTop: imageHeight / 2,
    height: imageHeight / 2,
    paddingLeft: 0,
    paddingRight: 0,
    backgroundColor: "transparent",
    flex: 1
  },
});
