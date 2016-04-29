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



import React, { Text, View, Component, Image, Dimensions, ScrollView, StyleSheet, StatusBar, TouchableHighlight, Linking } from 'react-native'

var ShareManager = React.NativeModules.ShareManager;

import {Actions} from 'react-native-router-flux';

import Icon from 'react-native-vector-icons/FontAwesome';
import DanhMuc from '../assets/DanhMuc';

import SearchResultDetailFooter from '../components/SearchResultDetailFooter';
import CommonHeader from '../components/CommonHeader';

import Swiper from 'react-native-swiper';

import gui from '../lib/gui';

import CollapsiblePanel from '../components/CollapsiblePanel';
import SummaryText from '../components/SummaryText';

import GiftedSpinner from "../components/GiftedSpinner";

import TruliaIcon from '../components/TruliaIcon';

import RelandIcon from '../components/RelandIcon';

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

var mapSize = Dimensions.get('window').width-36;

var imgHeight = 256;

var url = '';

var text = '';

class SearchResultDetail extends Component {
  constructor(props) {
    super(props);

    StatusBar.setBarStyle('light-content');

    this.state = {
      'data' : null,
      loaded: false
    }
  }
  fetchData() {
    //console.log("adsID: " + this.props.adsID);
    this.props.actions.getDetail(
        {'adsID' : this.props.adsID}
        , (data) => {
          this.refreshRowData(data)
        });
  }
  refreshRowData(data) {
    var geoUrl = 'http://maps.apple.com/?daddr='+data.ads.place.diaChi+'&dirflg=d&t=s';
    this.setState({
      'data' : data.ads,
      'geoUrl' : geoUrl,
      loaded: true
    });
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
    console.log(rowData);
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
    var imageIndex = 0;
    if (rowData.image) {
      rowData.image.images.map(function(imageUrl) {
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
               source={{uri: `${rowData.image.cover}`}}>
            </Image>
          </View>
        );
      }
      url = rowData.image.cover;
    }
    text = 'Check out this property | found using the Reway Mobile app\n\n'
        + loaiNhaDat + '\n' + diaChi + '\n' + gia + '\n' + soPhongNgu + ', ' + dienTich + '\n';
    return (
			<View style={detailStyles.fullWidthContainer}>
        <View style={detailStyles.customPageHeader}>
          <Icon onPress={this._onBack}
            name="angle-left" backgroundColor="transparent"
            underlayColor="transparent" color="white"
            style={detailStyles.search} size={32} >
          </Icon>
          <View style={detailStyles.shareButton}>
            <Icon onPress={this._onLike}
              name="heart-o" backgroundColor="transparent"
              underlayColor="transparent" color="white"
              style={detailStyles.search2} size={18} >
            </Icon>
            <Icon onPress={this._onShare}
              name="share-alt" backgroundColor="transparent"
              underlayColor="transparent" color="white"
              style={detailStyles.search2} size={20} >
            </Icon>
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
                  {this.renderTitleProps("Giá/m²", gia)}
                  {this.renderTitleProps("Số phòng ngủ", soPhongNguVal)}
                  {this.renderTitleProps("Số phòng tắm", soPhongTamVal)}
                  {this.renderTitleProps("Diện tích", dienTich)}
                  {this.renderTitleProps("Số tầng", soTang)}
                  {this.renderTitleProps("Ngày đăng tin", ngayDangTin)}
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
                <View style={detailStyles.shareButton}>
                  <View style={detailStyles.shareLeft}>
                    <View style={[detailStyles.circleContainer, {backgroundColor: '#0A5594'}]} >
                      <Icon.Button onPress={this._onShare}
                                   name="facebook" backgroundColor="transparent"
                                   underlayColor="transparent" color={'white'}
                                   style={{marginLeft: 5}} size={20} >
                      </Icon.Button>
                    </View>
                    <View style={[detailStyles.circleContainer, {backgroundColor: '#EA9409'}]} >
                      <Icon.Button onPress={this._onShare}
                                   name="share-alt" backgroundColor="transparent"
                                   underlayColor="transparent" color={'white'}
                                   style={{marginLeft: 0}} size={20} >
                      </Icon.Button>
                    </View>
                    <View style={[detailStyles.circleContainer, {marginTop: 0, backgroundColor: 'white'}]} >
                      <RelandIcon onPress={this._onShare}
                                  name="zalo" color={'#1E7AC0'}
                                  size={48} iconProps={{style: [detailStyles.shareIcon,{marginTop: 0}]}}>
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
                    <View style={detailStyles.circleContainer} >
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
                </CollapsiblePanel>
              </View>
            </View>
          </ScrollView>

        </View>
        <SearchResultDetailFooter mobile={mobile}/>
			</View>
		)
	}

  _onMapPressed() {
    Actions.SearchMapDetail();
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
    ShareManager.share({text: text, url: url, imageUrl: url});
  }

  _onLike() {
    console.log("On like pressed!");
  }
}

var detailStyles = StyleSheet.create({
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
    width: Dimensions.get('window').width/2-10,
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  shareRight: {
    width: Dimensions.get('window').width/2-10,
    alignItems: 'flex-end'
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
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 14,
    marginLeft: 20,
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
