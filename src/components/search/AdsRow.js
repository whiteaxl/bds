'use strict';

import React from 'react';
import { Image, StyleSheet, Text, View , TouchableHighlight, Dimensions, ListView} from 'react-native';
import Swiper from 'react-native-swiper';
import TruliaIcon from '../TruliaIcon';
import {Actions} from 'react-native-router-flux';
import LinearGradient from 'react-native-linear-gradient';
import log from '../../lib/logUtil';
import DanhMuc from '../../assets/DanhMuc';

var imgHeight = 180;

var { createIconSet } = require('react-native-vector-icons');
var glyphMap = { 'heart':59457, 'heart-o':59458};
var Icon = createIconSet(glyphMap, 'TruliaIcon');


class AdsRow extends React.Component {
  renderLikeIcon(ads) {
    //log.info("renderLikeIcon, ", ads.isLiked);
    const {adsLikes} = this.props;
    const isLiked = adsLikes && adsLikes.indexOf(ads.adsID) > -1;
    const color = isLiked ? 'red' : 'white';

    return (
      <TouchableHighlight underlayColor='transparent' style={{overflow: 'hidden'}} onPress={() => this.onLike(ads)}>
        <View style={myStyles.heartButton} >
          <Icon color={color} name={'heart-o'} size={23}  />
        </View>
      </TouchableHighlight>
    )
  }

  onLike(ads) {
    console.log("AdsRow.Onlike", this.props);
    if (!this.props.loggedIn) {
      //this.props.actions.onAuthFieldChange('activeRegisterLoginTab',0);
      Actions.LoginRegister({page:1});
    } else {
      this.props.likeAds(this.props.userID, ads)
    }
  }

  renderImageStack(ads) {
    var imageIndex  = 0;
    if (ads.image) {
      if (!ads.image.images || ads.image.images.length===0) {
        return (
          <MyImage imageIndex={0} ads={ads} imageUrl={ads.image.cover} />
        )
      }

      let list = [];
      for (var i=0; i < ads.image.images.length ; i++) {
        if (i==0) {
          list.push(ads.image.images[i]);
        } else {
          list.push(ads.image.images[i]);
        }
      }

      return list.map(imageUrl => {
        return <MyImage key={imageIndex} imageIndex={imageIndex++} ads={ads} imageUrl={imageUrl} />
      });

    } else {
      return (
        <MyImage imageIndex={0} ads={ads} imageUrl={''} />
      );
    }
  }

  getMoreInfo(loaiNhaDat, dienTich, soPhongNgu, soTang) {
    var moreInfo = '';
    if (loaiNhaDat == DanhMuc.LoaiNhaDatKey[1]) {
      moreInfo = ' ' + dienTich + soPhongNgu;
    }
    if ((loaiNhaDat == DanhMuc.LoaiNhaDatKey[2])
      || (loaiNhaDat == DanhMuc.LoaiNhaDatKey[3])
      || (loaiNhaDat == DanhMuc.LoaiNhaDatKey[4])) {
      moreInfo = ' ' + dienTich + soTang;
    }
    if ((loaiNhaDat == DanhMuc.LoaiNhaDatKey[5])
      || (loaiNhaDat == DanhMuc.LoaiNhaDatKey[6])) {
      moreInfo = ' ' + dienTich;
    }
    return moreInfo;
  }

  render() {
    const {ads} = this.props;
    
    var diaChi = ads.diaChi;
    var loaiNhaDat = ads.loaiNhaDat;
    var dienTich = '';
    if (ads.dienTich) {
      dienTich = '· ' + ads.dienTichFmt;
    }
    var soPhongNgu = '';
    if (ads.soPhongNguFmt) {
      soPhongNgu = " " + ads.soPhongNguFmt;
    }

    var soTang = '';
    if (ads.soTangFmt) {
      soTang = " " + ads.soTangFmt;
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
    if (diaChi.length < ads.diaChi.length) {
      diaChi = diaChi + '...';
    }
    var moreInfo = this.getMoreInfo(loaiNhaDat, dienTich, soPhongNgu, soTang);

    return (
      <View key={ads.adsID}>
        <View style={myStyles.detail}>
          <Swiper style={myStyles.wrapper} height={imgHeight}
                  showsButtons={false} autoplay={false} loop={false}
                  dot={<View style={[myStyles.dot, {backgroundColor: 'transparent'}]} />}
                  activeDot={<View style={[myStyles.dot, {backgroundColor: 'transparent'}]}/>}
          >
            {this.renderImageStack(ads)}
          </Swiper>

          <View style={myStyles.searchListViewRowAlign}
                onStartShouldSetResponder={(evt) => false}
                onMoveShouldSetResponder={(evt) => false}
          >
            <View
              onStartShouldSetResponder={(evt) => false}
              onMoveShouldSetResponder={(evt) => false}
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

      </View>
    );
  }
}

class MyImage extends React.Component {
  render() {
    return(
      <View style={myStyles.slide} key={"img"+(this.props.imageIndex)}>
        <TouchableHighlight onPress={() => Actions.SearchResultDetail({adsID: this.props.ads.adsID, source: 'server'})}>
          <Image style={myStyles.thumb} source={{uri: `${this.props.imageUrl}`}}>
            <LinearGradient colors={['transparent', 'rgba(0, 0, 0, 0.9)']}
                            style={myStyles.linearGradient2}>
            </LinearGradient>
          </Image>
        </TouchableHighlight>
      </View>
    );
  }
}

const myStyles = StyleSheet.create({
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
  wrapper: {},
  searchListViewRowAlign: {
    position: 'absolute',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    top: imgHeight - 53,
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
    fontSize: 14,
    textAlign: 'left',
    backgroundColor: 'transparent',
    marginLeft: 17,
    marginBottom: 15,
    margin: 5,
    marginTop: 2,
    color: 'white'
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
    paddingRight: 19
  },
  image: {

    height: 200,
    alignSelf: 'stretch',
  }
});

module.exports = AdsRow;
