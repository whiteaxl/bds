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

var ShareManager = React.NativeModules.ShareManager;

import Button from 'react-native-button';
import {Actions} from 'react-native-router-flux';

import Icon from 'react-native-vector-icons/FontAwesome';
import DanhMuc from '../assets/DanhMuc';
import styles from './styles';
import SearchResultDetailFooter from '../components/SearchResultDetailFooter';
import CommonHeader from '../components/CommonHeader';

import Swiper from 'react-native-swiper';

import gui from '../lib/gui';

import CollapsiblePanel from '../components/CollapsiblePanel';

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

var mapSize = 256;

var url = '';

var text = '';

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
    if (soPhongNgu) {
      soPhongNgu = soPhongNgu + ' phòng ngủ';
    }
    var ngayDangTin = rowData.ngayDangTin;
    var chiTiet = rowData.loc;
    var dangBoi = rowData.cust_dangBoi;
    var email = rowData.cust_email;
    var mobile = rowData.cust_mobile;
    if (!mobile) {
      mobile = rowData.cust_phone;
    }
    var _scrollView: ScrollView;
    var mapUrl = 'http://maps.google.com/maps/api/staticmap?zoom=12&size='+mapSize+'x'+mapSize+'&markers=color:red|'+rowData.hdLat+','+rowData.hdLong+'&sensor=false';
    var imageItems = [];
    var imageIndex = 0;
    rowData.images_small.map(function(imageSmallUrl) {
      var imageUrl = imageSmallUrl.replace("80x60", "745x510");
      imageItems.push(
        <View style={detailStyles.slide} key={"img"+(imageIndex++)}>
          <Image style={detailStyles.imgItem}
             source={{uri: `${imageUrl}`}}>
          </Image>
        </View>
      );
    });
    if (imageItems.length == 0) {
      imageItems.push(
        <View style={detailStyles.slide} key={"img"+(imageIndex)}>
          <Image style={detailStyles.imgItem}
             source={{uri: `${rowData.cover}`}}>
          </Image>
        </View>
      );
    }
    url = rowData.cover;
    text = 'Check out this property | found using the Reway Mobile app\n\n'
        + loaiNhaDat + '\n' + diaChi + '\n' + gia + '\n' + soPhongNgu + ', ' + dienTich + '\n';
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
                {gia}
              </Text>
              <Text style={detailStyles.textFullWidth}>
                {soPhongNgu}
              </Text>
              <Text style={detailStyles.textFullWidth}>
                {loaiNhaDat}, {ngayDangTin}
              </Text>
              <Text style={detailStyles.textFullWidth}>
                {diaChi}
              </Text>
              <CollapsiblePanel title="Chi tiết">
                <Text style={detailStyles.textFullWidth}>
                  {chiTiet}
                </Text>
              </CollapsiblePanel>

              <CollapsiblePanel title="Đặc điểm">
                <View style={styles.searchDetailRowAlign}>
                  <Text style={detailStyles.textHalfWidth}>
                    Diện tích
                  </Text>
                  <Text style={detailStyles.textHalfWidthBold}>
                    {dienTich}
                  </Text>
                </View>
                <View style={styles.searchDetailRowAlign}>
                  <Text style={detailStyles.textHalfWidth}>
                    Số tầng
                  </Text>
                  <Text style={detailStyles.textHalfWidthBold}>
                    {soTang}
                  </Text>
                </View>
              </CollapsiblePanel>
              <View style={detailStyles.imgItem}>
                <Image style={detailStyles.searchMapView}
                   source={{uri: `${mapUrl}`}}>
                </Image>
              </View>
              <CollapsiblePanel title="Liên hệ">
                <Text style={detailStyles.textFullWidth}>
                  {dangBoi}
                </Text>
                <Text style={detailStyles.textFullWidth}>
                  {mobile}
                </Text>
                <Text style={detailStyles.textFullWidth}>
                  {email}
                </Text>
              </CollapsiblePanel>
              <CollapsiblePanel title="Danh sách comments">
              </CollapsiblePanel>
            </View>
          </View>
        </ScrollView>
        <SearchResultDetailFooter mobile={mobile}/>
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
    //console.log(value);
    return value;
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
    width: mapSize,
    height: mapSize,
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
    marginLeft: 15,
    marginRight: 15,
  },
  textTitle: {
    fontSize: 16,
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
    color: 'black',
    marginBottom: 10,
    marginLeft: 15,
    marginRight: 5,
    width: Dimensions.get('window').width/2-60
  },
  textHalfWidthBold: {
    textAlign: 'left',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
    marginLeft: 5,
    marginRight: 15,
    width: Dimensions.get('window').width/2-20
  },
  textFullWidth: {
    textAlign: 'left',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
    fontSize: 14,
    color: 'black',
    marginBottom: 10,
    marginLeft: 15,
    marginRight: 15,
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchResultDetail);
