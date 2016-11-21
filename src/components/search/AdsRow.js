'use strict';

import React from 'react';
import { Image, StyleSheet, Text, View , TouchableHighlight, Dimensions, ListView} from 'react-native';
import Swiper from 'react-native-swiper';
import TruliaIcon from '../TruliaIcon';
import {Actions} from 'react-native-router-flux';
import LinearGradient from 'react-native-linear-gradient';
import log from '../../lib/logUtil';
import DanhMuc from '../../assets/DanhMuc';
import MHeartIcon from '../MHeartIcon';
import CommonUtils from '../../lib/CommonUtils';
import gui from '../../lib/gui';
import GiftedSpinner from 'react-native-gifted-spinner';


var imgHeight = 181;

var { createIconSet } = require('react-native-vector-icons');
var glyphMap = { 'heart':59457, 'heart-o':59458};
var Icon = createIconSet(glyphMap, 'TruliaIcon');


class AdsRow extends React.Component {
  renderLikeIcon(ads) {
    //log.info("renderLikeIcon, ", ads.isLiked);
    let isLiked = this.isLiked(ads);
    let color = isLiked ? '#A2A7AD' : 'white';
    let bgColor = isLiked ? '#E50064' : '#4A443F';
    let bgStyle = isLiked ? {} : {opacity: 0.55};

    if (this.props.uploadingLikedAds.uploading && this.props.uploadingLikedAds.adsID == ads.adsID){
      return (
            <View style={myStyles.heartButton}>
              <GiftedSpinner size="small" color="white"/>
            </View>
      );
    } else {
      return (
          <TouchableHighlight underlayColor='transparent' style={{overflow: 'hidden'}} onPress={() => this.onLike(ads)}>
            <View style={myStyles.heartButton} >
              <MHeartIcon color={color} bgColor={bgColor} bgStyle={bgStyle} size={22} noAction={true} />
            </View>
          </TouchableHighlight>
      )
    }
  }

  /*
   <TouchableHighlight underlayColor='transparent' style={{overflow: 'hidden'}} onPress={() => this.onLike(ads)}>
   <View style={myStyles.heartButton} >
   <MHeartIcon color={color} bgColor={bgColor} bgStyle={bgStyle} size={22} noAction={true} />
   </View>
   </TouchableHighlight>
  */

  isLiked(ads) {
    const {adsLikes} = this.props;
    return adsLikes && adsLikes.indexOf(ads.adsID) > -1;
  }

  onLike(ads) {
    console.log("AdsRow.Onlike", this.props);
    if (!this.props.loggedIn) {
      //this.props.actions.onAuthFieldChange('activeRegisterLoginTab',0);
      Actions.Login();
    } else {
      if (!this.isLiked(ads)) {
        this.props.likeAds(this.props.userID, ads.adsID)
      } else {
        this.props.unlikeAds(this.props.userID, ads.adsID)
      }
    }
  }

  renderImageStack(ads) {
    var imageIndex  = 0;
    if (ads.image) {
      if (!ads.image.images || ads.image.images.length===0) {
        return (
          <MyImage imageIndex={0} ads={ads} imageUrl={ads.image.cover} noCoverUrl={this.props.noCoverUrl}/>
        )
      }

      // let list = [];
      // for (var i=0; i < ads.image.images.length ; i++) {
      //   list.push(ads.image.images[i]);
      // }
      //
      // return list.map(imageUrl => {
      //   return <MyImage key={imageIndex} imageIndex={imageIndex++} ads={ads} imageUrl={imageUrl}/>
      // });

      return (
          <MyImage imageIndex={0} ads={ads} imageUrl={ads.image.images[0]} noCoverUrl={this.props.noCoverUrl}/>
      );
    } else {
      return (
        <MyImage imageIndex={0} ads={ads} imageUrl={this.props.noCoverUrl} noCoverUrl={this.props.noCoverUrl}/>
      );
    }
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

  render() {
    const {ads} = this.props;

    var loaiTin = ads.loaiTin;
    var diaChi = ads.diaChi;
    var loaiNhaDat = ads.loaiNhaDat;
    var dienTich = '';
    if (ads.dienTichFmt && ads.dienTichFmt != 'Không rõ') {
      dienTich = '· ' + ads.dienTichFmt;
    }
    var soPhongNgu = '';
    if (ads.soPhongNguFmt) {
      soPhongNgu = "   " + ads.soPhongNguFmt;
    }

    var soTang = '';
    if (ads.soTangFmt) {
      soTang = "   " + ads.soTangFmt;
    }

    var moreInfo = this.getMoreInfo(loaiTin, loaiNhaDat, dienTich, soPhongNgu, soTang);

    var maxDiaChiLength = Dimensions.get('window').width*7/64 - moreInfo.length;

    var index = diaChi.indexOf(',', maxDiaChiLength - 5);
    var length = 0;
    if (index !== -1 && index <= maxDiaChiLength) {
      length = index;
    } else {
      index = diaChi.indexOf(' ', maxDiaChiLength - 5);
      length = index !== -1 && index <= maxDiaChiLength ? index : maxDiaChiLength;
    }
    diaChi = diaChi.substring(0, length);
    if (diaChi.length < ads.diaChi.length) {
      diaChi = diaChi + '...';
    }

    let firstControl = null;
    let lastControl = null;
    let {showFirstControl, isFirstRow, showLastControl, isLastRow} = this.props;

    if (showFirstControl && isFirstRow) {
      if (this.props.loading) {
        firstControl = <View style={{flex: 0, height: 40, alignItems: 'center', justifyContent: 'center'}}>
          <GiftedSpinner size="small" />
        </View>;
      } else {
        firstControl = <View style={{flex: 0, height: 40, alignItems: 'center', justifyContent: 'center'}}>
          <TouchableHighlight onPress={this.props.loadPreviousPage} underlayColor="transparent">
            <View style={{flexDirection: 'column'}}>
              <Text style={myStyles.rowControl}>Nhấn vào đây để quay lại trang trước</Text>
              <Text style={myStyles.pagingTitle}>{this.props.getPagingTitle()}</Text>
            </View>
          </TouchableHighlight>
        </View>;
      }
    }
    if (showLastControl && isLastRow) {
      lastControl = <View style={{flex: 0, height: 40, alignItems: 'center', justifyContent: 'center'}}>
        <TouchableHighlight onPress={this.props.loadNextPage} underlayColor="transparent">
        <View style={{flexDirection: 'column'}}>
          <Text style={myStyles.rowControl}>Nhấn vào đây để đi đến trang sau</Text>
          <Text style={myStyles.pagingTitle}>{this.props.getPagingTitle()}</Text>
        </View>
      </TouchableHighlight>
      </View>;
    }
    return (
      <View key={ads.adsID} style={{flexDirection: 'column'}}>
        {firstControl}
        <View style={myStyles.detail}
              onStartShouldSetResponder={(evt) => false}
              onMoveShouldSetResponder={(evt) => false}>
          {/*<Swiper style={myStyles.wrapper} height={imgHeight}
                  showsButtons={false} autoplay={false} loop={false} bounces={true}
                  dot={<View style={[myStyles.dot, {backgroundColor: 'transparent'}]} />}
                  activeDot={<View style={[myStyles.dot, {backgroundColor: 'transparent'}]}/>}
          >
            {this.renderImageStack(ads)}
          </Swiper>*/}
          {this.renderImageStack(ads)}

          <View style={myStyles.searchListViewRowAlign}
                onStartShouldSetResponder={(evt) => false}
                onMoveShouldSetResponder={(evt) => false}
          >
            <View
              onStartShouldSetResponder={(evt) => false}
              onMoveShouldSetResponder={(evt) => false}
              pointerEvents="none"
            >
              <Text style={myStyles.price}
                    onStartShouldSetResponder={(evt) => false}
                    onMoveShouldSetResponder={(evt) => false}
              >{ads.giaFmt}</Text>
              <Text style={myStyles.text}>{diaChi}{moreInfo}</Text>
            </View>
            {this.renderLikeIcon(ads)}
          </View>

        </View>
        {lastControl}
      </View>
    );
  }
}

class MyImage extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let imageUri = {uri: this.props.imageUrl};
    if (this.props.noCoverUrl == this.props.imageUrl) {
      imageUri = require('../../assets/image/reland_house_large.jpg');
    }
    return(
      <View style={myStyles.slide} key={"img"+(this.props.imageIndex)}>
        <TouchableHighlight onPress={() => Actions.SearchResultDetail({adsID: this.props.ads.adsID, source: 'server'})}>
          <Image style={myStyles.thumb} source={imageUri} defaultSource={CommonUtils.getNoCoverImage()} >
            <LinearGradient colors={['transparent', 'rgba(0, 0, 0, 0.55)']}
                            style={myStyles.linearGradient2}>
            </LinearGradient>
          </Image>
        </TouchableHighlight>
      </View>
    );
  }
}

const myStyles = StyleSheet.create({
  detail: {
    flex: 0
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
  wrapper: {
    backgroundColor: 'black'
  },
  searchListViewRowAlign: {
    position: 'absolute',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    top: imgHeight - 55,
    width: Dimensions.get('window').width
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
    backgroundColor: 'transparent',
    marginLeft: 17,
    color: 'white'
  },
  text: {
    fontSize: 13,
    textAlign: 'left',
    backgroundColor: 'transparent',
    marginLeft: 17,
    marginBottom: 15,
    marginRight: 0,
    marginTop: 2,
    color: 'white'
  },
  rowControl: {
    fontSize: 13,
    textAlign: 'center',
    backgroundColor: 'transparent',
    color: gui.mainColor
  },
  pagingTitle: {
    fontSize: 13,
    textAlign: 'center',
    backgroundColor: 'transparent',
    color: 'gray'
  },

  slide: {
    justifyContent: 'center',
    backgroundColor: 'transparent'
    //
  },
  linearGradient2: {
    marginTop: imgHeight / 2,
    height: imgHeight / 2,
    paddingLeft: 0,
    paddingRight: 0,
    backgroundColor: "transparent"
  },
  thumb: {
    justifyContent: 'flex-end',
    alignItems: 'stretch',
    height: imgHeight,
    alignSelf: 'auto'
  },

  heartButton: {
    marginTop: 6,
    paddingRight: 25,
    paddingLeft: 0
  },
  image: {

    height: 200,
    alignSelf: 'stretch',
  }
});

module.exports = AdsRow;
