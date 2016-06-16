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

import SearchHeader from '../components/SearchHeader';
import TruliaIcon from '../components/TruliaIcon';
import RelandIcon from '../components/RelandIcon';

import gui from '../lib/gui';

var { width, height } = Dimensions.get('window');

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
                <Text style={styles.categoryLabel}>Nhà Gần Vị Trí Bạn</Text>
                <Text style={styles.arrowLabel}>Quận Hà Đông, Hà Nội</Text>
              </View>

              <View style={styles.rowItem}>
                  <TouchableOpacity onPress={this._onAdsDetailPressed.bind(this)}>
                    <View style={styles.column}>
                      <Image style={styles.imgItem_6}
                             source={{uri: 'http://nhadat24h.net/Upload/User/Dangtin/Images/218628/Thumbnai/fceb8f91-9e68-40bc-b375-766f53bdfdcc_bthumb.jpg'}}>
                      </Image>
                    </View>
                  </TouchableOpacity>
                  <View style={{flex: 1, width:1}}>
                  </View>
                  <TouchableOpacity onPress={this._onAdsDetailPressed.bind(this)}>
                    <View style={styles.column}>
                      <Image style={styles.imgItem_4}
                             source={{uri: 'http://nhadat24h.net/Upload/User/Dangtin/Images/218628/Thumbnai/fceb8f91-9e68-40bc-b375-766f53bdfdcc_bthumb.jpg'}}>
                      </Image>
                    </View>
                  </TouchableOpacity>
              </View>

              <View style={{flex: 1, height:1}}>
              </View>
                <View style={styles.rowItem}>
                  <TouchableOpacity onPress={this._onAdsDetailPressed.bind(this)}>
                    <View style={styles.column}>
                      <Image style={styles.imgItem_4}
                             source={{uri: 'http://nhadat24h.net/Upload/User/Dangtin/Images/218628/Thumbnai/fceb8f91-9e68-40bc-b375-766f53bdfdcc_bthumb.jpg'}}>
                      </Image>
                    </View>
                  </TouchableOpacity>
                  <View style={{flex: 1, width:1}}>
                  </View>
                  <TouchableOpacity onPress={this._onAdsDetailPressed.bind(this)}>
                    <View style={styles.column}>
                      <Image style={styles.imgItem_6}
                             source={{uri: 'http://nhadat24h.net/Upload/User/Dangtin/Images/218628/Thumbnai/fceb8f91-9e68-40bc-b375-766f53bdfdcc_bthumb.jpg'}}>
                      </Image>
                    </View>
                  </TouchableOpacity>
                </View>

              <View style={{flex: 1, height:1}}>
              </View>
              <View style={{flex: 1}}>
                <Image style={styles.fullImageItem}
                  source={require('../lib/image/home1.jpg')}>
                </Image>
              </View>

              <View style={{flex: 1, backgroundColor:'transparent'}}>
                <Text style={styles.moreDetailButton}>Xem thêm</Text>
              </View>
            </View>

            <View style={{flex:1, flexDirection: "column"}}>
              <View style={{flex: 1, height: 75, alignItems:'center', justifyContent: 'center'}}>
                <Text style={styles.boldTitle}>BỘ SƯU TẬP</Text>
                <Text style={styles.categoryLabel}>Nhà Mới Đăng Hôm Nay</Text>
                <Text style={styles.arrowLabel}>Quận Hà Đông, Hà Nội</Text>
              </View>

              <View style={styles.rowItem}>
                <TouchableOpacity onPress={this._onAdsDetailPressed.bind(this)}>
                  <View style={styles.column}>
                    <Image style={styles.imgItem_6}
                           source={{uri: 'http://nhadat24h.net/Upload/User/Dangtin/Images/218628/Thumbnai/fceb8f91-9e68-40bc-b375-766f53bdfdcc_bthumb.jpg'}}>
                    </Image>
                  </View>
                </TouchableOpacity>
                <View style={{flex: 1, width:1}}>
                </View>
                <TouchableOpacity onPress={this._onAdsDetailPressed.bind(this)}>
                  <View style={styles.column}>
                    <Image style={styles.imgItem_4}
                           source={{uri: 'http://nhadat24h.net/Upload/User/Dangtin/Images/218628/Thumbnai/fceb8f91-9e68-40bc-b375-766f53bdfdcc_bthumb.jpg'}}>
                    </Image>
                  </View>
                </TouchableOpacity>
              </View>

              <View style={{flex: 1, height:1}}>
              </View>
              <View style={styles.rowItem}>
                <TouchableOpacity onPress={this._onAdsDetailPressed.bind(this)}>
                  <View style={styles.column}>
                    <Image style={styles.imgItem_4}
                           source={{uri: 'http://nhadat24h.net/Upload/User/Dangtin/Images/218628/Thumbnai/fceb8f91-9e68-40bc-b375-766f53bdfdcc_bthumb.jpg'}}>
                    </Image>
                  </View>
                </TouchableOpacity>
                <View style={{flex: 1, width:1}}>
                </View>
                <TouchableOpacity onPress={this._onAdsDetailPressed.bind(this)}>
                  <View style={styles.column}>
                    <Image style={styles.imgItem_6}
                           source={{uri: 'http://nhadat24h.net/Upload/User/Dangtin/Images/218628/Thumbnai/fceb8f91-9e68-40bc-b375-766f53bdfdcc_bthumb.jpg'}}>
                    </Image>
                  </View>
                </TouchableOpacity>
              </View>

              <View style={{flex: 1, height:1}}>
              </View>
              <View style={{flex: 1}}>
                <Image style={styles.fullImageItem}
                       source={require('../lib/image/home1.jpg')}>
                </Image>
              </View>

              <View style={{flex: 1, backgroundColor:'transparent'}}>
                <Text style={styles.moreDetailButton}>Xem thêm</Text>
              </View>
            </View>

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
  linearGradient: {
    flex: 1,
    paddingLeft: 0,
    paddingRight: 0,
    backgroundColor : "transparent"
  },
  imgItem: {
    flex:1,
    alignItems: 'flex-start',
    width: Dimensions.get('window').width/2-10,
    height:82
  },
  imgItem_6: {
    flex:1,
    alignItems: 'flex-start',
    width: (width*0.55)-1,
    height:143
  },
  imgItem_4: {
    flex:1,
    alignItems: 'flex-start',
    width: (width*0.45)-1,
    height:143
  },
  fullImageItem: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width,
    height:143
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
  }
});



export default connect(mapStateToProps, mapDispatchToProps)(Home);
