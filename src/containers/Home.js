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



import React, { Text, StyleSheet, View, Component, ScrollView, Image, Dimensions, TouchableOpacity } from 'react-native'

import Button from 'react-native-button';
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';

import styles from './styles';

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



class Home extends Component {

  render() {
    var _scrollView: ScrollView;

    return (
      <View style={styles.fullWidthContainer}>
        <View style={styles.pageHeader}>
          <Icon.Button onPress={this.handleSearchButton}
            name="search" backgroundColor="#f44336"
            underlayColor="gray"
            style={styles.search}>
            Tìm kiếm
          </Icon.Button>
        </View>

        <View style={styles.homeDetailInfo}>
          <ScrollView
            ref={(scrollView) => { _scrollView = scrollView; }}
            automaticallyAdjustContentInsets={false}
            vertical={true}
            style={styles.scrollView}>

            <View style={{flex: 1}}>
  				    <Image style={homeStyles.slideImgItem}
                source={require('../lib/image/home1.jpg')}>
                <Text style={homeStyles.boldLabel}>Thông tin dự án</Text>
              </Image>
            </View>

            <View style={{flex:1, flexDirection: "column"}}>
  				    <View style={{flex:1, alignItems: "center"}}>
                <Text style={homeStyles.headerLabel}>
                  Nhà đất bán
                </Text>
              </View>

              <View style={homeStyles.itemRow}>
                <TouchableOpacity style={homeStyles.column} onPress={this._onBanCanHoChungCuPressed.bind(this)}>
                  <HotDeal title="Bán căn hộ chung cư" imageUrl={'http://nhadat24h.net/Upload/User/Dangtin/Images/218628/Thumbnai/fceb8f91-9e68-40bc-b375-766f53bdfdcc_bthumb.jpg'}/>
                </TouchableOpacity>
                <TouchableOpacity style={homeStyles.column} onPress={this._onBanNhaRiengPressed.bind(this)}>
                  <HotDeal title="Bán nhà riêng" imageUrl={'http://nhadat24h.net/Upload/User/Dangtin/Images/218628/Thumbnai/fceb8f91-9e68-40bc-b375-766f53bdfdcc_bthumb.jpg'}/>
                </TouchableOpacity>
              </View>

              <View style={homeStyles.itemRow}>
                <TouchableOpacity style={homeStyles.column} onPress={this._onBanNhaMatPhoPressed.bind(this)}>
                  <HotDeal title="Bán nhà mặt phố" imageUrl={'http://nhadat24h.net/Upload/User/Dangtin/Images/218628/Thumbnai/fceb8f91-9e68-40bc-b375-766f53bdfdcc_bthumb.jpg'}/>
                </TouchableOpacity>
                <TouchableOpacity style={homeStyles.column} onPress={this._onBanBietThuLienKePressed.bind(this)}>
                  <HotDeal title="Bán biệt thự, liền kề" imageUrl={'http://nhadat24h.net/Upload/User/Dangtin/Images/218628/Thumbnai/fceb8f91-9e68-40bc-b375-766f53bdfdcc_bthumb.jpg'}/>
                </TouchableOpacity>
              </View>

              <View style={homeStyles.itemRow}>
                <TouchableOpacity style={homeStyles.column} onPress={this._onBanDatPressed.bind(this)}>
                  <HotDeal title="Bán đất" imageUrl={'http://nhadat24h.net/Upload/User/Dangtin/Images/218628/Thumbnai/fceb8f91-9e68-40bc-b375-766f53bdfdcc_bthumb.jpg'}/>
                </TouchableOpacity>
                <TouchableOpacity style={homeStyles.column} onPress={this._onBanBdsKhacPressed.bind(this)}>
                  <HotDeal title="Bán bất động sản khác" imageUrl={'http://nhadat24h.net/Upload/User/Dangtin/Images/218628/Thumbnai/fceb8f91-9e68-40bc-b375-766f53bdfdcc_bthumb.jpg'}/>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{flex:1, flexDirection: "column"}}>
              <View style={{flex: 1, alignItems: "center"}}>
                <Text style={homeStyles.headerLabel}>
                  Nhà đất cho thuê
                </Text>
              </View>

              <View style={homeStyles.itemRow}>
                <TouchableOpacity style={homeStyles.column} onPress={this._onChoThueCanHoChungCuPressed.bind(this)}>
                  <HotDeal title="Cho thuê chung cư" imageUrl={'http://nhadat24h.net/Upload/User/Dangtin/Images/218628/Thumbnai/fceb8f91-9e68-40bc-b375-766f53bdfdcc_bthumb.jpg'}/>
                </TouchableOpacity>
                <TouchableOpacity style={homeStyles.column} onPress={this._onChoThueNhaRiengPressed.bind(this)}>
                  <HotDeal title="Cho thuê nhà riêng" imageUrl={'http://nhadat24h.net/Upload/User/Dangtin/Images/218628/Thumbnai/fceb8f91-9e68-40bc-b375-766f53bdfdcc_bthumb.jpg'}/>
                </TouchableOpacity>
              </View>

              <View style={homeStyles.itemRow}>
                <TouchableOpacity style={homeStyles.column} onPress={this._onChoThueNhaMatPhoPressed.bind(this)}>
                  <HotDeal title="Cho thuê nhà mặt phố" imageUrl={'http://nhadat24h.net/Upload/User/Dangtin/Images/218628/Thumbnai/fceb8f91-9e68-40bc-b375-766f53bdfdcc_bthumb.jpg'}/>
                </TouchableOpacity>
                <TouchableOpacity style={homeStyles.column} onPress={this._onChoThueVanPhongPressed.bind(this)}>
                  <HotDeal title="Cho thuê văn phòng" imageUrl={'http://nhadat24h.net/Upload/User/Dangtin/Images/218628/Thumbnai/fceb8f91-9e68-40bc-b375-766f53bdfdcc_bthumb.jpg'}/>
                </TouchableOpacity>
              </View>

              <View style={homeStyles.itemRow}>
                <TouchableOpacity style={homeStyles.column} onPress={this._onChoThueCuaHangKiotPressed.bind(this)}>
                  <HotDeal title="Cho thuê cửa hàng, ki-ốt" imageUrl={'http://nhadat24h.net/Upload/User/Dangtin/Images/218628/Thumbnai/fceb8f91-9e68-40bc-b375-766f53bdfdcc_bthumb.jpg'}/>
                </TouchableOpacity>
                <TouchableOpacity style={homeStyles.column} onPress={this._onChoThueBdsKhacPressed.bind(this)}>
                  <HotDeal title="Cho thuê bds khác" imageUrl={'http://nhadat24h.net/Upload/User/Dangtin/Images/218628/Thumbnai/fceb8f91-9e68-40bc-b375-766f53bdfdcc_bthumb.jpg'}/>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>

      </View>
		)
	}

  handleSearchButton() {
    Actions.Search();
  }

  _onBanCanHoChungCuPressed() {
    this._onHotDealPressed('ban', 1);
  }

  _onBanNhaRiengPressed() {
    this._onHotDealPressed('ban', 2);
  }

  _onBanNhaMatPhoPressed() {
    this._onHotDealPressed('ban', 3);
  }

  _onBanBietThuLienKePressed() {
    this._onHotDealPressed('ban', 4);
  }

  _onBanDatPressed() {
    this._onHotDealPressed('ban', 5);
  }

  _onBanBdsKhacPressed() {
    this._onHotDealPressed('ban', 99);
  }

  _onChoThueCanHoChungCuPressed() {
    this._onHotDealPressed('thue', 1);
  }

  _onChoThueNhaRiengPressed() {
    this._onHotDealPressed('thue', 2);
  }

  _onChoThueNhaMatPhoPressed() {
    this._onHotDealPressed('thue', 3);
  }

  _onChoThueVanPhongPressed() {
    this._onHotDealPressed('thue', 4);
  }

  _onChoThueCuaHangKiotPressed() {
    this._onHotDealPressed('thue', 5);
  }

  _onChoThueBdsKhacPressed() {
    this._onHotDealPressed('thue', 99);
  }

  _onHotDealPressed(loaiTin, loaiNhaDat){
    this.props.actions.onSearchFieldChange("loaiTin", loaiTin)
    this.props.actions.onSearchFieldChange("loaiNhaDat", loaiNhaDat);
    console.log("Search cridential:");
    console.log(this.props.search.form.fields);
    Actions.SearchResultList();
  }
}

class HotDeal extends React.Component{
  render() {
    return (
        <View style={homeStyles.column}>
          <Image style={homeStyles.imgItem}
            source={{uri: this.props.imageUrl}}>
           <LinearGradient colors={['transparent', 'rgba(0, 0, 0, 0.5)']}
             style={homeStyles.linearGradient}>
            <Text style={homeStyles.boldTitle}>{this.props.title}</Text>
          </LinearGradient>
          </Image>
        </View>
    );
  }
}

var homeStyles = StyleSheet.create({
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
    height:80
  },
  slideImgItem: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width,
    height:120
  },
  column: {
    flex:1,
    alignItems: "center"
  },
  boldTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
    backgroundColor: 'transparent',
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
    color: 'white',
  },
  boldLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'transparent',
    color: 'white',
  },
  headerLabel: {
    textAlign: "center",
    paddingTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF3366"
  },
  itemRow: {
    flex:1,
    flexDirection: "row",
    paddingTop:10
  }
});



export default connect(mapStateToProps, mapDispatchToProps)(Home);
