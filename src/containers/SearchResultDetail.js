'use strict';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

/**
 * The actions we need
 */
import * as globalActions from '../reducers/global/globalActions';
import * as searchActions from '../reducers/search/searchActions';

/**
 * Immutable Map
 */
import {Map} from 'immutable';



import React, { Text, View, Component, Image, Dimensions, ScrollView, StyleSheet, MapView } from 'react-native'

import Button from 'react-native-button';
import {Actions} from 'react-native-router-flux';

import Icon from 'react-native-vector-icons/FontAwesome';
import DanhMuc from '../assets/DanhMuc';
import styles from './styles';
import SearchResultDetailFooter from '../components/SearchResultDetailFooter';
import CommonHeader from '../components/CommonHeader';

import Swiper from 'react-native-swiper';

import gui from '../lib/gui';

/**
* ## Redux boilerplate
*/
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

var LoaiNhaDatBan = [
    {key: 1, value: DanhMuc['ban'][1]},
    {key: 2, value: DanhMuc['ban'][2]},
    {key: 3, value: DanhMuc['ban'][3]},
    {key: 4, value: DanhMuc['ban'][4]},
    {key: 5, value: DanhMuc['ban'][5]},
    {key: 99, value: DanhMuc['ban'][99]}
];

var LoaiNhaDatThue = [
    {key: 1, value: DanhMuc['thue'][1]},
    {key: 2, value: DanhMuc['thue'][2]},
    {key: 3, value: DanhMuc['thue'][3]},
    {key: 4, value: DanhMuc['thue'][4]},
    {key: 5, value: DanhMuc['thue'][5]},
    {key: 99, value: DanhMuc['thue'][99]}
];

var LoaiTin = [
    {key: 0, value: "Bán"},
    {key: 1, value: "Cho thuê"}
];


class SearchResultDetail extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    //console.log(this.props);
    var rowIndex = this.props.data;
    var listData = this.props.search.form.fields.listData;
    if (!listData) {
  			return (
          <View style={styles.fullWidthContainer}>
            <CommonHeader headerTitle={"Chi tiết"} />
            <View style={styles.searchContent}>
              <Text style={styles.welcome}>"Lỗi kết nối đến máy chủ!"</Text>
            </View>
            <SearchResultDetailFooter />
    			</View>
        )
    }
    var rowData = listData[rowIndex];
    //console.log(rowData);
    //var imageUrl = rowData.cover;
    //console.log(imageUrl);
    var loaiTin = this.getValueByKey(LoaiTin, rowData.loaiTin);
    var loaiNhaDatArr = rowData.loaiTin ? LoaiNhaDatThue : LoaiNhaDatBan;
    var loaiNhaDat = this.getValueByKey(loaiNhaDatArr, rowData.loaiNhaDat);
    var diaChi = rowData.diaChi;
    var dienTich = '';
    if (rowData.dienTich) {
      dienTich = rowData.dienTich + ' m²';
    }
    var gia = rowData.price_value + ' ' + rowData.price_unit;
    var soTang = rowData.soTang;
    var soPhongNgu = rowData.soPhongNgu;
    var ngayDangTin = rowData.ngayDangTin;
    var chiTiet = rowData.loc;
    var dangBoi = rowData.cust_dangBoi;
    var email = rowData.cust_email;
    var mobile = rowData.cust_mobile;
    var phone = rowData.cust_phone;
    var _scrollView: ScrollView;
    var mapSize = Dimensions.get('window').width-20;
    var mapUrl = 'http://maps.google.com/maps/api/staticmap?zoom=16&size='+mapSize+'x'+mapSize+'&markers=color:red|'+rowData.hdLat+','+rowData.hdLong+'&sensor=false';
    var imageItems = [];
    var imageIndex = 0;
    rowData.images_small.map(function(imageUrl) {
      imageItems.push(
        <View style={detailStyles.slide} key={"img"+(imageIndex++)}>
          <Image style={detailStyles.imgItem}
             source={{uri: `${imageUrl}`}}>
          </Image>
        </View>
      );
    });
    return (
			<View style={styles.fullWidthContainer}>
        <View style={detailStyles.customPageHeader}>
          <Icon.Button onPress={this._onBack}
            name="chevron-left" backgroundColor="transparent"
            underlayColor="gray" color={gui.blue1}
            style={detailStyles.search} >
          </Icon.Button>
          <View style={detailStyles.shareButton}>
            <Icon.Button onPress={this._onLike}
              name="heart-o" backgroundColor="transparent"
              underlayColor="gray" color={gui.blue1}
              style={detailStyles.search} >
            </Icon.Button>
            <Icon.Button onPress={this._onShare}
              name="share-alt" backgroundColor="transparent"
              underlayColor="gray" color={gui.blue1}
              style={detailStyles.search} >
            </Icon.Button>
          </View>
        </View>
        <ScrollView
          ref={(scrollView) => { _scrollView = scrollView; }}
          automaticallyAdjustContentInsets={false}
          vertical={true}
          style={detailStyles.scrollView}>
          <View style={styles.searchContent}>

            <Swiper style={detailStyles.wrapper} height={256}
                    showsButtons={false} autoplay={false} loop={false}
                    dot={<View style={[detailStyles.dot, {backgroundColor: 'transparent'}]} />}
                    activeDot={<View style={[detailStyles.dot, {backgroundColor: 'transparent'}]}/>}
            >
              {imageItems}
            </Swiper>

            <View style={detailStyles.slideItem}>
              <Text style={detailStyles.price}>
                Giá: {gia}
              </Text>
              <View style={styles.searchDetailRowAlign}>
                <Text style={detailStyles.textHalfWidth}>
                  Bán/Cho thuê: {loaiTin}
                </Text>
                <Text style={detailStyles.textHalfWidth}>
                  Loại nhà: {loaiNhaDat}
                </Text>
              </View>
              <Text style={detailStyles.textFullWidth}>
                Diện tích: {dienTich}
              </Text>
              <Text style={detailStyles.textFullWidth}>
                Địa chỉ: {diaChi}
              </Text>
              <Text style={detailStyles.textFullWidth}>
                Chi tiết: {chiTiet}
              </Text>
              <Text style={detailStyles.textFullWidth}>
                Số tầng: {soTang}
              </Text>
              <Text style={detailStyles.textFullWidth}>
                Số phòng ngủ: {soPhongNgu}
              </Text>
              <Text style={detailStyles.textFullWidth}>
                Ngày đăng: {ngayDangTin}
              </Text>
              <View style={detailStyles.imgItem}>
                <Image style={detailStyles.searchMapView}
                   source={{uri: `${mapUrl}`}}>
                </Image>
              </View>
              <Text style={detailStyles.textTitle}>
                Liên hệ
              </Text>
              <Text style={detailStyles.textFullWidth}>
                Đăng bởi: {dangBoi}
              </Text>
              <Text style={detailStyles.textFullWidth}>
                Email: {email}
              </Text>
              <Text style={detailStyles.textFullWidth}>
                Mobile: {mobile}
              </Text>
              <Text style={detailStyles.textFullWidth}>
                Phone: {phone}
              </Text>
              <Text style={detailStyles.textTitle}>
                Danh sách comments
              </Text>
            </View>
          </View>
        </ScrollView>
        <SearchResultDetailFooter />
			</View>
		)
	}

  getValueByKey(hashArr, key) {
    var value = '';
    for (var i = 0; i < hashArr.length; i++) {
      var attr = hashArr[i];
      if (key == attr["key"]) {
        value = attr["value"];
        break;
      }
    }
    console.log(value);
    return value;
  }

  _onBack() {
    Actions.pop();
  }

  _onShare() {
    console.log("On share pressed!");
  }

    _onLike() {
      console.log("On like pressed!");
    }

  onRegionChangeComplete(region) {
    MapApi(region.latitude, region.longitude)
      .then((data) => {
        console.log(data);
      });
  }
}

var detailStyles = StyleSheet.create({
  scrollView: {
      flex: 1,
  },
  shareButton: {
      flexDirection: 'row',
  },
  customPageHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      backgroundColor: 'transparent',
  },
	search: {
			marginTop: 25,
	    flexDirection: 'row',
	    alignItems: 'center',
			justifyContent: 'center',
			backgroundColor: 'transparent',
	},
  wrapper: {
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
  imgItem: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width,
    height: 256
  },
  searchMapView: {
    flex: 1,
    width: 256,
    height: 256,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  slideItem: {
    flex: 1, justifyContent: 'flex-start', alignItems: 'stretch',
          backgroundColor: 'transparent', marginTop: 15
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
    backgroundColor: 'transparent',
    color: 'black',
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  textTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
    backgroundColor: 'transparent',
    color: 'black',
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  textHalfWidth: {
    textAlign: 'left',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
    fontSize: 14,
    color: 'black',
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    width: Dimensions.get('window').width/2-20
  },
  textFullWidth: {
    textAlign: 'left',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
    fontSize: 14,
    color: 'black',
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchResultDetail);
