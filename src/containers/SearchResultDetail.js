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



import React, { Text, View, Component, Image, Dimensions, ScrollView, StyleSheet, StatusBarIOS } from 'react-native'

var ShareManager = React.NativeModules.ShareManager;

import Button from 'react-native-button';
import {Actions} from 'react-native-router-flux';

import Icon from 'react-native-vector-icons/FontAwesome';
import DanhMuc from '../assets/DanhMuc';

import SearchResultDetailFooter from '../components/SearchResultDetailFooter';
import CommonHeader from '../components/CommonHeader';

import Swiper from 'react-native-swiper';

import gui from '../lib/gui';

import CollapsiblePanel from '../components/CollapsiblePanel';
import SummaryText from '../components/SummaryText';

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

var mapSize = Dimensions.get('window').width-30;

var imgHeight = 256;

var url = '';

var text = '';

class SearchResultDetail extends Component {
  constructor(props) {
    super(props);

    StatusBarIOS.setStyle('light-content');

    this.state = {
      headerButtonColor: 'white'
    }
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
    var chiTiet = rowData.loc;
    var dangBoi = rowData.cust_dangBoi;
    var email = rowData.cust_email;
    var mobile = rowData.cust_mobile;
    if (!mobile) {
      mobile = rowData.cust_phone;
    }
    var _scrollView: ScrollView;
    var mapUrl = 'http://maps.google.com/maps/api/staticmap?zoom=12&size='+mapSize+'x'+((mapSize-mapSize%2)/2)+'&markers=color:red|'+rowData.hdLat+','+rowData.hdLong+'&sensor=false';
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
			<View style={detailStyles.fullWidthContainer}>
        <View style={detailStyles.mainView}>
          <ScrollView
            ref={(scrollView) => { _scrollView = scrollView; }}
            automaticallyAdjustContentInsets={false}
            vertical={true}
            style={detailStyles.scrollView}
            onScroll={this.handleScroll.bind(this)}
            scrollEventThrottle={1}>
            <View style={detailStyles.searchContent}>

              <Swiper style={detailStyles.wrapper} height={imgHeight}
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
                <View style={detailStyles.lineBorder}>
                  <Text style={detailStyles.textFullWidth}>
                    {diaChi}
                  </Text>
                </View>
                {this.renderTwoNormalProps(loaiTin, loaiNhaDat)}
                {this.renderTwoNormalProps(dienTich, soPhongNgu)}
                {this.renderTwoNormalProps(soPhongTam, ngayDangTin)}
                <View style={[detailStyles.lineBorder, {marginBottom: 10}]} />
                <View style={detailStyles.chiTietText}>
                  <SummaryText longText={chiTiet} expanded={false}>
                  </SummaryText>
                </View>
                <View style={detailStyles.lineBorder} />
                <CollapsiblePanel title="Đặc Điểm" expanded={true}>
                  {this.renderTitleProps("Loại tin rao", loaiNhaDat)}
                  {this.renderTitleProps("Giá", gia)}
                  {this.renderTitleProps("Phòng ngủ", soPhongNguVal)}
                  {this.renderTitleProps("Phòng tắm", soPhongTamVal)}
                  {this.renderTitleProps("Diện tích", dienTich)}
                  {this.renderTitleProps("Số tầng", soTang)}
                  {this.renderTitleProps("Ngày đăng tin", ngayDangTin)}
                  {this.renderTitleProps("Địa chỉ", diaChi)}
                </CollapsiblePanel>
                <View style={detailStyles.lineBorder2} />
                <View style={detailStyles.shareButton}>
                  <Icon.Button onPress={this._onShare}
                    name="twitter" backgroundColor="transparent"
                    underlayColor="gray" color={gui.blue1}
                    style={detailStyles.wrapper} >
                  </Icon.Button>
                  <Icon.Button onPress={this._onShare}
                    name="facebook" backgroundColor="transparent"
                    underlayColor="gray" color={gui.blue1}
                    style={detailStyles.wrapper} >
                  </Icon.Button>
                  <Icon.Button onPress={this._onShare}
                    name="envelope-o" backgroundColor="transparent"
                    underlayColor="gray" color={gui.blue1}
                    style={detailStyles.wrapper} >
                  </Icon.Button>
                  <Icon.Button onPress={this._onShare}
                    name="share-alt" backgroundColor="transparent"
                    underlayColor="gray" color={gui.blue1}
                    style={detailStyles.wrapper} >
                  </Icon.Button>
                </View>
                <View style={detailStyles.lineBorder2} />
                <View style={detailStyles.searchMapView}>
                  <Image style={detailStyles.imgMapView}
                     source={{uri: `${mapUrl}`}}>
                  </Image>
                </View>
                <View style={detailStyles.lineBorder2} />
                <CollapsiblePanel title="Liên Hệ" expanded={false}>
                  {this.renderTitleProps("Tên liên lạc", dangBoi)}
                  {this.renderTitleProps("Điện thoại", mobile)}
                  {this.renderTitleProps("Email", email)}
                  <Text style={{fontSize: 5}} />
                </CollapsiblePanel>
                <View style={detailStyles.lineBorder2} />
                <CollapsiblePanel title="Danh Sách Comments" expanded={false}>
                </CollapsiblePanel>
              </View>
            </View>
          </ScrollView>

          <View>
            <LinearGradient colors={['transparent', 'rgba(0, 0, 0, 0.5)']}
            style={detailStyles.linearGradient}>
              <View style={detailStyles.customPageHeader}>
                <Icon.Button onPress={this._onBack}
                  name="angle-left" backgroundColor="transparent"
                  underlayColor="transparent" color={this.state.headerButtonColor}
                  style={detailStyles.search} >
                </Icon.Button>
                <View style={detailStyles.shareButton}>
                  <Icon.Button onPress={this._onLike}
                    name="heart-o" backgroundColor="transparent"
                    underlayColor="transparent" color={this.state.headerButtonColor}
                    style={detailStyles.search} >
                  </Icon.Button>
                  <Icon.Button onPress={this._onShare}
                    name="share-alt" backgroundColor="transparent"
                    underlayColor="transparent" color={this.state.headerButtonColor}
                    style={detailStyles.search} >
                  </Icon.Button>
                </View>
              </View>
            </LinearGradient>
          </View>
        </View>
        <SearchResultDetailFooter mobile={mobile}/>
			</View>
		)
	}

  renderTwoNormalProps(prop1, prop2) {
    if (prop1 && prop2) {
      return (
        <View style={[detailStyles.searchDetailRowAlign,detailStyles.lineBorder]}>
          <Text style={detailStyles.textHalfWidth}>
            {prop1}
          </Text>
          <Text style={detailStyles.textHalfWidth}>
            {prop2}
          </Text>
        </View>
      )
    } else if (prop1 || prop2) {
      return (
        <View style={detailStyles.lineBorder}>
          <Text style={detailStyles.textFullWidth}>
            {prop1 ? prop1 : prop2}
          </Text>
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

  handleScroll(event: Object) {
    if (event.nativeEvent.contentOffset.y <= imgHeight-30 && this.state.headerButtonColor != 'white') {
      StatusBarIOS.setStyle('light-content');
      this.setState({
        headerButtonColor: 'white'
      });
    } else if (event.nativeEvent.contentOffset.y > imgHeight-30 && this.state.headerButtonColor != gui.blue1) {
      StatusBarIOS.setStyle('default');
      this.setState({
        headerButtonColor: gui.blue1
      });
    }
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
    height: Dimensions.get('window').height-45
  },
  fullWidthContainer: {
      flex: 1,
      alignItems: 'stretch',
      backgroundColor: '#F5FCFF',
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
  chiTietText: {
      marginBottom: 15,
      marginLeft: 15
  },
  shareButton: {
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
      backgroundColor: 'transparent',
  },
	search: {
			marginTop: 25,
	    flexDirection: 'row',
	    alignItems: 'center',
			justifyContent: 'center',
			backgroundColor: 'transparent',
      width: 30,
      height: 20,
      marginLeft: 0,
      marginRight: 0,
      marginBottom: 10
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
    marginLeft: 15,
    marginRight: 15
  },
  slideItem: {
    flex: 1, justifyContent: 'flex-start', alignItems: 'stretch',
          backgroundColor: 'transparent', marginTop: 15
  },
  price: {
    fontSize: 22,
    fontFamily: 'Open Sans',
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
    fontFamily: 'Open Sans',
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
    fontFamily: 'Open Sans',
    color: 'gray',
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 10,
    marginRight: 10,
    width: Dimensions.get('window').width/2-20
  },
  textHalfWidthBold: {
    textAlign: 'left',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
    fontSize: 14,
    fontFamily: 'Open Sans',
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
    fontFamily: 'Open Sans',
    color: 'gray',
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
    fontFamily: 'Open Sans',
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
    fontFamily: 'Open Sans',
    color: 'gray',
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
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchResultDetail);
