'use strict';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

/**
 * The actions we need
 */
import * as globalActions from '../reducers/global/globalActions';
import * as searchActions from '../reducers/search/searchActions';

/**
 * Immutable Mapn
 */
import {Map} from 'immutable';

import  React, {Component} from 'react';

import { Text, StyleSheet, View, ScrollView, Image, Dimensions, TouchableOpacity } from 'react-native'

import {Actions} from 'react-native-router-flux';

import TruliaIcon from '../components/TruliaIcon';

import Icon from 'react-native-vector-icons/FontAwesome';

import LinearGradient from 'react-native-linear-gradient';

import gui from '../lib/gui';

var { width, height } = Dimensions.get('window');
var imageHeight = 143;

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


class Home extends Component {

  render() {
    var _scrollView: ScrollView;

    return (
      <View style={styles.fullWidthContainer}>
        <View style={styles.pageHeader}>
          <TruliaIcon onPress={this.handleSearchButton}
                      name="search" size={18} color={'white'}
                      mainProps={styles.search} textProps={{paddingLeft: 10}}
                      text="Tìm kiếm" />
        </View>

        <View style={styles.homeDetailInfo}>
          <ScrollView
            ref={(scrollView) => { _scrollView = scrollView; }}
            automaticallyAdjustContentInsets={false}
            showsVerticalScrollIndicator={false}
            vertical={true}
            style={styles.scrollView}>

            <View style={{flex:1, flexDirection: "column"}}>
              <View style={{flex: 1, height: 75, alignItems:'center', justifyContent: 'center'}}>
                <Text style={styles.boldTitle}>BỘ SƯU TẬP</Text>
                <Text style={styles.categoryLabel}>Nhà Mới Đăng Hôm Nay</Text>
                <Text style={styles.arrowLabel}>Quận Hà Đông, Hà Nội</Text>
              </View>

              <View style={styles.rowItem}>
                  <TouchableOpacity onPress={this._onAdsDetailPressed.bind(this)}>
                    <ImageItem imageUrl={'http://nhadat24h.net/Upload/User/Dangtin/Images/218628/Thumbnai/fceb8f91-9e68-40bc-b375-766f53bdfdcc_bthumb.jpg'}
                               price="2.5 Tỷ" address="Khu đô thị Pháp Vân" detail="2 pn  1 pt"
                               width={0.55}
                    >
                    </ImageItem>
                  </TouchableOpacity>
                  <View style={{flex: 1, width:1}}>
                  </View>
                  <TouchableOpacity onPress={this._onAdsDetailPressed.bind(this)}>
                    <ImageItem imageUrl={'http://nhadat24h.net/Upload/User/Dangtin/Images/218628/Thumbnai/fceb8f91-9e68-40bc-b375-766f53bdfdcc_bthumb.jpg'}
                               price="2.5 Tỷ" address="Khu đô thị Pháp Vân" detail="2 pn  1 pt"
                               width={0.45}
                    >
                    </ImageItem>
                  </TouchableOpacity>
              </View>

              <View style={{flex: 1, height:1}}>
              </View>

              <View style={styles.rowItem}>
                  <TouchableOpacity onPress={this._onAdsDetailPressed.bind(this)}>
                    <ImageItem imageUrl={'http://nhadat24h.net/Upload/User/Dangtin/Images/218628/Thumbnai/fceb8f91-9e68-40bc-b375-766f53bdfdcc_bthumb.jpg'}
                               price="2.5 Tỷ" address="Khu đô thị Pháp Vân" detail="2 pn  1 pt"
                               width={0.45}
                    >
                    </ImageItem>
                  </TouchableOpacity>
                  <View style={{flex: 1, width:1}}>
                  </View>
                  <TouchableOpacity onPress={this._onAdsDetailPressed.bind(this)}>
                    <ImageItem imageUrl={'http://nhadat24h.net/Upload/User/Dangtin/Images/218628/Thumbnai/fceb8f91-9e68-40bc-b375-766f53bdfdcc_bthumb.jpg'}
                               price="2.5 Tỷ" address="Khu đô thị Pháp Vân" detail="2 pn  1 pt"
                               width={0.55}
                    >
                    </ImageItem>
                  </TouchableOpacity>
              </View>

              <View style={{flex: 1, height:1}}>
              </View>
              <View style={{flex: 1}}>
                <ImageItem imageUrl={'http://nhadat24h.net/Upload/User/DangTin/Images/184026/duan/7feaac4b-d60f-4c56-aa21-8c6c7a7b94ec.jpg'}
                           price="10 Tỷ" address="Biệt thự biển Phú Quốc" detail="5 pn  3 pt"
                           width={1}
                >
                </ImageItem>
              </View>

              <View style={{flex: 1, backgroundColor:'transparent'}}>
                <Text style={styles.moreDetailButton}>Xem thêm</Text>
              </View>
            </View>

            <View style={{flex:1, flexDirection: "column"}}>
              <View style={{flex: 1, height: 75, alignItems:'center', justifyContent: 'center'}}>
                <Text style={styles.boldTitle}>BỘ SƯU TẬP</Text>
                <Text style={styles.categoryLabel}>Nhà Gần Vị Trí Bạn</Text>
                <Text style={styles.arrowLabel}>Quận Hà Đông, Hà Nội</Text>
              </View>

              <View style={styles.rowItem}>
                <TouchableOpacity onPress={this._onAdsDetailPressed.bind(this)}>
                  <ImageItem imageUrl={'http://nhadat24h.net/Upload/User/Dangtin/Images/218628/Thumbnai/fceb8f91-9e68-40bc-b375-766f53bdfdcc_bthumb.jpg'}
                             price="2.5 Tỷ" address="Khu đô thị Pháp Vân" detail="2 pn  1 pt"
                             width={0.55}
                  >
                  </ImageItem>
                </TouchableOpacity>
                <View style={{flex: 1, width:1}}>
                </View>
                <TouchableOpacity onPress={this._onAdsDetailPressed.bind(this)}>
                  <ImageItem imageUrl={'http://nhadat24h.net/Upload/User/Dangtin/Images/218628/Thumbnai/fceb8f91-9e68-40bc-b375-766f53bdfdcc_bthumb.jpg'}
                             price="2.5 Tỷ" address="Khu đô thị Pháp Vân" detail="2 pn  1 pt"
                             width={0.45}
                  >
                  </ImageItem>
                </TouchableOpacity>
              </View>

              <View style={{flex: 1, height:1}}>
              </View>

              <View style={styles.rowItem}>
                <TouchableOpacity onPress={this._onAdsDetailPressed.bind(this)}>
                  <ImageItem imageUrl={'http://nhadat24h.net/Upload/User/Dangtin/Images/218628/Thumbnai/fceb8f91-9e68-40bc-b375-766f53bdfdcc_bthumb.jpg'}
                             price="2.5 Tỷ" address="Khu đô thị Pháp Vân" detail="2 pn  1 pt"
                             width={0.45}
                  >
                  </ImageItem>
                </TouchableOpacity>
                <View style={{flex: 1, width:1}}>
                </View>
                <TouchableOpacity onPress={this._onAdsDetailPressed.bind(this)}>
                  <ImageItem imageUrl={'http://nhadat24h.net/Upload/User/Dangtin/Images/218628/Thumbnai/fceb8f91-9e68-40bc-b375-766f53bdfdcc_bthumb.jpg'}
                             price="2.5 Tỷ" address="Khu đô thị Pháp Vân" detail="2 pn  1 pt"
                             width={0.55}
                  >
                  </ImageItem>
                </TouchableOpacity>
              </View>

              <View style={{flex: 1, height:1}}>
              </View>
              <View style={{flex: 1}}>
                <ImageItem imageUrl={'http://nhadat24h.net/Upload/User/DangTin/Images/184026/duan/7feaac4b-d60f-4c56-aa21-8c6c7a7b94ec.jpg'}
                           price="10 Tỷ" address="Biệt thự biển Phú Quốc" detail="5 pn  3 pt"
                           width={1}
                >
                </ImageItem>
              </View>

              <View style={{flex: 1, backgroundColor:'transparent'}}>
                <Text style={styles.moreDetailButton}>Xem thêm</Text>
              </View>
            </View>
            <View style={{height:40}}></View>
          </ScrollView>
        </View>
      </View>
		)
	}

  _onAdsDetailPressed() {
    console.log("On Ads detail pressed");
  }

  handleSearchButton() {
    Actions.Search();
  }


}

class ImageItem extends React.Component{
  render() {
    return (
     <View style={styles.column}>
        <Image style={[styles.imgItem, {width:(width*this.props.width)-1}]}
               source={{uri: this.props.imageUrl}}>

          <View style={styles.heartContent}>
            <TruliaIcon name="heart-o" mainProps={[styles.heartButton,{marginLeft: width*this.props.width-30}]}
                        color={'white'} size={20}/>
          </View>

          <View style={styles.itemContent}
                onStartShouldSetResponder={(evt) => false}
                onMoveShouldSetResponder={(evt) => false}
          >
            <View
                onStartShouldSetResponder={(evt) => false}
                onMoveShouldSetResponder={(evt) => false}
            >
              <Text style={styles.price}
                    onStartShouldSetResponder={(evt) => false}
                    onMoveShouldSetResponder={(evt) => false}
              >{this.props.price}</Text>
              <Text style={styles.text}>{this.props.address}</Text>
              <Text style={styles.text}>{this.props.detail}</Text>
            </View>
          </View>

        </Image>
      </View>
  );
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
    alignItems: 'flex-start',
    height:imageHeight
  },
  imgItem_55: {
    flex:1,
    justifyContent: 'flex-start',
    height:imageHeight,
    width: (width*0.55)-1,
  },
  imgItem_45: {
    flex:1,
    alignItems: 'flex-start',
    width: (width*0.45)-1,
    height:imageHeight
  },
  imgItem_100: {
    flex:1,
    alignItems: 'flex-start',
    width: width,
    height:imageHeight
  },
  column: {
    flex:1,
    alignItems: "center"
  },
  boldTitle: {
    fontFamily: gui.fontFamily,
    fontSize: 12,
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    color: gui.mainColor
  },
  categoryLabel: {
    fontFamily: gui.fontFamily,
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: 'transparent'
  },
  arrowLabel: {
    fontFamily: gui.fontFamily,
    fontSize: 14,
    backgroundColor: 'transparent',
    color: gui.arrowColor
  },
  rowItem: {
    flex:1,
    flexDirection: "row"
  },
  moreDetailButton: {
    margin: 12,
    marginLeft:20,
    marginRight:20,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    backgroundColor: gui.mainColor,
    color: 'white',
    fontFamily: gui.fontFamily,
    fontWeight: 'normal',
    fontSize: gui.normalFontSize
  },
  linearGradient: {
    backgroundColor : "transparent"
  },
  itemContent: {
    position: 'absolute',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    top: imageHeight - 60
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
    backgroundColor: 'transparent',
    alignItems: 'flex-start'
  },
  heartButton: {
    marginTop: 5,
  },
  heartButton_45: {
    marginTop: 5,
    marginLeft: width*0.45-30
  },
  heartButton_55: {
    marginTop: 5,
    marginLeft: width*0.55-30
  },
  heartButton_100: {
    marginTop: 5,
    marginLeft: width-30
  }
});



export default connect(mapStateToProps, mapDispatchToProps)(Home);
