'use strict';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as globalActions from '../../reducers/global/globalActions';
import * as adsMgmtActions from '../../reducers/adsMgmt/adsMgmtActions';

import {Map} from 'immutable';

import React, {Component} from 'react';

import {
  Text, View, Image, ListView, Dimensions, StatusBar
  , RecyclerViewBackedScrollView, TouchableHighlight, StyleSheet
  , Alert, RefreshControl, ScrollView
} from 'react-native'

import {Actions} from 'react-native-router-flux';
import TruliaIcon from '../../components/TruliaIcon';

import LinearGradient from 'react-native-linear-gradient';

import Swiper from 'react-native-swiper';

import gui from '../../lib/gui';

import DanhMuc from '../../assets/DanhMuc';

import GiftedSpinner from "../../components/GiftedSpinner";

import log from '../../lib/logUtil';

const actions = [
  globalActions,
  adsMgmtActions
];

function mapStateToProps(state) {
  return {
    //listAds: state.adsMgmt.likedList,
    loading: state.adsMgmt.loadingFromServer,
    errorMsg: state.adsMgmt.errorMsg,
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

var imgHeight = 181;

var myDs = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

class AdsListTab extends Component {
  constructor(props) {
    super(props);
    StatusBar.setBarStyle('light-content');
  }

  _onRefresh() {
    log.info("_onRefresh", this.props);

    if (this.props.name == 'likedTab') {
      this.props.actions.refreshLikedTab(this.props.global.currentUser.userID);
    }

    /*
    fetchData().then(() => {
      this.setState({refreshing: false});
    });
    */
  }


  _getListContent() {
    let myProps = this.props;

    if (myProps.errorMsg) {
      return (
        <View style={{flex:1, alignItems:'center', justifyContent:'center', marginTop: 30}}>
          <Text style={myStyles.welcome}>{myProps.errorMsg}</Text>
        </View>
      )
    }

    if (myProps.listAds.length === 0) {
      return (
        <ScrollView
          refreshControl={
          <RefreshControl
            refreshing={this.props.adsMgmt.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }
        >
          <View style={{flex:1, alignItems:'center', justifyContent:'center'
            , marginTop: 30}}>
            <Text style={gui.styles.defaultText}> {gui.INF_KhongCoKetQua} </Text>

            <TouchableHighlight
              onPress = {this._onRefresh.bind(this)}
            >
              <Text style={myStyles.linkText}> {gui.INF_ClickToRefresh} </Text>
            </TouchableHighlight>
          </View>
        </ScrollView>
      )
    }

    let ds = myDs.cloneWithRows(myProps.listAds);
    //this.setState({dataSource:ds});

    return (
      <ListView
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={this._onRefresh.bind(this)}
          />
        }

        enableEmptySections = {true}

        dataSource={ds}
        renderRow={this.renderRow.bind(this)}
        renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
        renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={myStyles.separator} />}
        style={myStyles.searchListView}
      />
    )
  }

  render() {
    log.info("Call AdsListTab render", this.props.adsMgmt);


    return (
      <View style={myStyles.fullWidthContainer}>
        {this._getListContent()}
      </View>
    )


  }

  _renderImageStack(rowData) {
    var imageIndex = 0;
    if (rowData.image) {
      if (!rowData.image.images || rowData.image.images.length === 0) {
        return (
          <MyImage imageIndex={0} rowData={rowData} imageUrl={rowData.image.cover}/>
        )
      }

      return rowData.image.images.map(imageUrl => {
        return <MyImage key={imageIndex} imageIndex={imageIndex++} rowData={rowData} imageUrl={imageUrl}/>
      });

    } else {
      return (
        <MyImage imageIndex={0} rowData={rowData} imageUrl={''}/>
      );
    }
  }

  coming() {
    Alert.alert("Coming soon...");
  }

  renderRow(rowData, sectionID, rowID) {
    var diaChi = rowData.diaChi;
    var loaiNhaDat = rowData.loaiNhaDat;
    var dienTich = '';
    if (rowData.dienTich) {
      dienTich = '· ' + rowData.dienTichFmt;
    }
    var soPhongNgu = '';
    if (rowData.soPhongNguFmt) {
      soPhongNgu = " " + rowData.soPhongNguFmt;
    }

    var soTang = '';
    if (rowData.soTangFmt) {
      soTang = " " + rowData.soTangFmt;
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
    if (diaChi.length < rowData.diaChi.length) {
      diaChi = diaChi + '...';
    }
    var moreInfo = this.getMoreInfo(loaiNhaDat, dienTich, soPhongNgu, soTang);

    return (
      <View key={rowData.adsID}>
        <View style={myStyles.detail}>
          <Swiper style={myStyles.wrapper} height={imgHeight}
                  showsButtons={false} autoplay={false} loop={false}
                  onMomentumScrollEnd={function(e, state, context){log.info('index:', state.index)}}
                  dot={<View style={[myStyles.dot, {backgroundColor: 'transparent'}]} />}
                  activeDot={<View style={[myStyles.dot, {backgroundColor: 'transparent'}]}/>}
          >
            {this._renderImageStack(rowData)}
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
              >{rowData.giaFmt}</Text>
              <Text style={myStyles.text}>{diaChi}{moreInfo}</Text>
            </View>
          </View>
        </View>
      </View>
    );
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
}

class MyImage extends Component {
  render() {
    return (
      <View style={myStyles.slide} key={"img"+(this.props.imageIndex)}>
        <TouchableHighlight
          onPress={() => Actions.SearchResultDetail({adsID: this.props.rowData.adsID, source: 'server'})}>
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

// Later on in your styles..
var myStyles = StyleSheet.create({
  welcome: {
    marginTop: -50,
    marginBottom: 50,
    fontSize: 16,
    textAlign: 'center',
    margin: 10
  },
  fullWidthContainer: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: 'white',
  },
  search: {
    backgroundColor: gui.mainColor,
    height: 30
  },
  searchContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  wrapper: {},
  slide: {
    justifyContent: 'center',
    backgroundColor: 'transparent'
    //
  },
  separator: {
    height: 0.5,
    backgroundColor: 'transparent'
  },
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
  detail: {
    flex: 1,
    paddingLeft: 0,
    paddingRight: 0,
    backgroundColor: "transparent"
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
  searchListView: {
    margin: 0,
    backgroundColor: 'gray'
  },
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
    marginLeft: 15,
    color: 'white'
  },
  text: {
    fontSize: 14,
    textAlign: 'left',
    backgroundColor: 'transparent',
    marginLeft: 15,
    marginBottom: 15,
    margin: 5,
    marginTop: 2,
    color: 'white'
  },

  heartButton: {
    marginBottom: 10,
    paddingRight: 18
  },
  linkText  : {
    fontFamily: gui.fontFamily,
    fontSize: gui.normalFontSize,
    color : gui.mainColor
  }

});

export default connect(mapStateToProps, mapDispatchToProps)(AdsListTab);
