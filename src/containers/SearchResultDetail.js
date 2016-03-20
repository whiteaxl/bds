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



import React, { Text, View, Component, Image, Dimensions, ScrollView } from 'react-native'

import Button from 'react-native-button';
import {Actions} from 'react-native-router-flux';

import Icon from 'react-native-vector-icons/FontAwesome';
import MapApi from '../components/MapApi';
import styles from './styles';
import SearchResultDetailFooter from './SearchResultDetailFooter';
import CommonHeader from './CommonHeader';


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
    {key: 1, value: "Bán căn hộ chung cư"},
    {key: 2, value: "Bán nhà riêng"},
    {key: 3, value: "Bán nhà mặt phố"},
    {key: 4, value: "Bán biệt thự, liền kề"},
    {key: 5, value: "Bán đất"},
    {key: 99, value: "Bán các bds khác"}
];

var LoaiNhaDatThue = [
    {key: 1, value: "Cho Thuê căn hộ chung cư"},
    {key: 2, value: "Cho Thuê nhà riêng"},
    {key: 3, value: "Cho Thuê nhà mặt phố"},
    {key: 4, value: "Cho Thuê văn phòng"},
    {key: 5, value: "Cho Thuê cửa hàng, ki-ốt"},
    {key: 99, value: "Cho Thuê các bds khác"}
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
    if (dienTich) {
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
            name="share-square-o" backgroundColor="#f44336"
            underlayColor="gray"
            style={styles.search} >Chia sẻ
          </Icon.Button>
        </View>
        <ScrollView
          ref={(scrollView) => { _scrollView = scrollView; }}
          automaticallyAdjustContentInsets={false}
          vertical={true}
          style={styles.scrollView}>
          <View style={styles.searchContent}>
            <Image style={{flex:1, justifyContent: 'center',
                   alignItems: 'center', width: Dimensions.get('window').width,
                   height: Dimensions.get('window').height}}
               source={{uri: `${imageUrl}`}}>
              <View style={{flex: 1, justifyContent: 'flex-start', alignItems: 'stretch',
              			backgroundColor: 'transparent', marginTop: Dimensions.get('window').height/2-100}}>
                <View style={styles.searchDetailRowAlign}>
                  <Text style={{textAlign: 'left', alignItems: 'flex-start', backgroundColor: 'transparent',
                      fontSize: 14, color: 'white', marginBottom: 10, marginLeft: 10, width: Dimensions.get('window').width/2-50}}>
                    Bán/Cho thuê: {loaiTin}
                  </Text>
                  <Text style={{textAlign: 'left', alignItems: 'flex-start', backgroundColor: 'transparent',
                      fontSize: 14, color: 'white', marginBottom: 10, width: Dimensions.get('window').width/2+50}}>
                    Loại nhà: {loaiNhaDat}
                  </Text>
                </View>
                <Text style={{textAlign: 'left', alignItems: 'flex-start', backgroundColor: 'transparent',
                    fontSize: 14, color: 'white', marginBottom: 10, marginLeft: 10}}>
                  Địa chỉ: {diaChi}
                </Text>
                <View style={styles.searchDetailRowAlign}>
                  <Text style={{textAlign: 'left', alignItems: 'flex-start', backgroundColor: 'transparent',
                      fontSize: 14, color: 'white', marginBottom: 10, marginLeft: 10, width: Dimensions.get('window').width/2-50}}>
                    Diện tích: {dienTich}
                  </Text>
                  <Text style={{textAlign: 'left', alignItems: 'flex-start', backgroundColor: 'transparent',
                      fontSize: 14, color: 'white', marginBottom: 10}}>
                    Giá: {gia}
                  </Text>
                </View>
                <View style={styles.searchDetailRowAlign}>
                  <Text style={{textAlign: 'left', alignItems: 'flex-start', backgroundColor: 'transparent',
                      fontSize: 14, color: 'white', marginBottom: 10, marginLeft: 10, width: Dimensions.get('window').width/2-50}}>
                    Số tầng: {soTang}
                  </Text>
                  <Text style={{textAlign: 'left', alignItems: 'flex-start', backgroundColor: 'transparent',
                      fontSize: 14, color: 'white', marginBottom: 10}}>
                    Số phòng ngủ: {soPhongNgu}
                  </Text>
                </View>
                <Text style={{textAlign: 'left', alignItems: 'flex-start', backgroundColor: 'transparent',
                    fontSize: 14, color: 'white', marginBottom: 10, marginLeft: 10}}>
                  Ngày đăng: {ngayDangTin}
                </Text>
                <Text style={{textAlign: 'left', alignItems: 'flex-start', backgroundColor: 'transparent',
                    fontSize: 14, color: 'white', marginBottom: 10, marginLeft: 10}}>
                  Chi tiết: {chiTiet}
                </Text>
                <Text style={{textAlign: 'left', alignItems: 'flex-start', backgroundColor: 'transparent',
                    fontSize: 14, color: 'white', marginBottom: 10, marginLeft: 10}}>
                  Liên hệ: {lienHe}
                </Text>
                <Text style={{textAlign: 'left', alignItems: 'flex-start', backgroundColor: 'transparent',
                    fontSize: 14, color: 'white', marginBottom: 10, marginLeft: 10}}>
                  Danh sách comments
                </Text>
              </View>
            </Image>
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

export default connect(mapStateToProps, mapDispatchToProps)(SearchResultDetail);
