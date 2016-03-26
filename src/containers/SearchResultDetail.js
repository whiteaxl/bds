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



import React, { Text, View, Component, Image, Dimensions, ScrollView, StyleSheet } from 'react-native'

import Button from 'react-native-button';
import {Actions} from 'react-native-router-flux';

import Icon from 'react-native-vector-icons/FontAwesome';
import MapApi from '../components/MapApi';
import DanhMuc from '../components/DanhMuc';
import styles from './styles';
import SearchResultDetailFooter from './SearchResultDetailFooter';
import CommonHeader from './CommonHeader';

import LinearGradient from 'react-native-linear-gradient';

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
    var imageUrl = rowData.cover;
    console.log(imageUrl);
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
    var lienHe = '';
    var dangBoi = rowData.cust_dangBoi;
    if (dangBoi) {
      lienHe = lienHe + 'đăng bởi ' + dangBoi + '; ';
    }
    var email = rowData.cust_email;
    if (email) {
      lienHe = lienHe + 'email ' + email + '; ';
    }
    var mobile = rowData.cust_mobile;
    if (mobile) {
      lienHe = lienHe + 'mobile ' + mobile + '; ';
    }
    var phone = rowData.cust_phone;
    if (phone) {
      lienHe = lienHe + 'phone ' + phone + '; ';
    }
    var _scrollView: ScrollView;
    return (
			<View style={styles.fullWidthContainer}>
        <View style={styles.customPageHeader}>
          <Icon.Button onPress={this._onBack}
            name="chevron-left" backgroundColor="#f44336"
            underlayColor="gray"
            style={styles.search} >
          </Icon.Button>
          <Icon.Button onPress={this._onShare}
            name="facebook" backgroundColor="#f44336"
            underlayColor="gray"
            style={styles.search} >
          </Icon.Button>
          <Icon.Button onPress={this._onShare}
            name="envelope-o" backgroundColor="#f44336"
            underlayColor="gray"
            style={styles.search} >
          </Icon.Button>
          <Icon.Button onPress={this._onShare}
            name="share-alt" backgroundColor="#f44336"
            underlayColor="gray"
            style={styles.search} >
          </Icon.Button>
          <Icon.Button onPress={this._onShare}
            name="comment-o" backgroundColor="#f44336"
            underlayColor="gray"
            style={styles.search} >
          </Icon.Button>
          <Icon.Button onPress={this._onShare}
            name="clone" backgroundColor="#f44336"
            underlayColor="gray"
            style={styles.search} >
          </Icon.Button>
        </View>
        <ScrollView
          ref={(scrollView) => { _scrollView = scrollView; }}
          automaticallyAdjustContentInsets={false}
          vertical={true}
          style={styles.scrollView}>
          <View style={styles.searchContent}>
            <Image style={detailStyles.imgItem}
               source={{uri: `${imageUrl}`}}>
            </Image>
             <LinearGradient colors={['transparent', 'rgba(0, 0, 0, 0.5)']}
               style={detailStyles.linearGradient}>

              <View style={detailStyles.slideItem}>
                <View style={styles.searchDetailRowAlign}>
                  <Text style={detailStyles.textHalfWidth}>
                    Bán/Cho thuê: {loaiTin}
                  </Text>
                  <Text style={detailStyles.textHalfWidth}>
                    Loại nhà: {loaiNhaDat}
                  </Text>
                </View>
                <Text style={detailStyles.textFullWidth}>
                  Địa chỉ: {diaChi}
                </Text>
                <View style={styles.searchDetailRowAlign}>
                  <Text style={detailStyles.textHalfWidth}>
                    Diện tích: {dienTich}
                  </Text>
                  <Text style={detailStyles.textHalfWidth}>
                    Giá: {gia}
                  </Text>
                </View>
                <View style={styles.searchDetailRowAlign}>
                  <Text style={detailStyles.textHalfWidth}>
                    Số tầng: {soTang}
                  </Text>
                  <Text style={detailStyles.textHalfWidth}>
                    Số phòng ngủ: {soPhongNgu}
                  </Text>
                </View>
                <Text style={detailStyles.textFullWidth}>
                  Ngày đăng: {ngayDangTin}
                </Text>
                <Text style={detailStyles.textFullWidth}>
                  Chi tiết: {chiTiet}
                </Text>
                <Text style={detailStyles.textFullWidth}>
                  Liên hệ: {lienHe}
                </Text>
                <Text style={detailStyles.textFullWidth}>
                  Danh sách comments
                </Text>
              </View>

            </LinearGradient>
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
}

var detailStyles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    paddingLeft: 0,
    paddingRight: 0,
    backgroundColor : "transparent"
  },
  imgItem: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width,
    height: 256
  },
  slideItem: {
    flex: 1, justifyContent: 'flex-start', alignItems: 'stretch',
          backgroundColor: 'transparent', marginTop: 15
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
