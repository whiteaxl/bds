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



import React, { Text, View, Component, Image, ListView, Dimensions
  , RecyclerViewBackedScrollView, TouchableHighlight , StyleSheet} from 'react-native'

import Button from 'react-native-button';
import {Actions} from 'react-native-router-flux';
import Api from '../lib/FindApi';
import Icon from 'react-native-vector-icons/FontAwesome';

import styles from './styles';
import CommonHeader from '../components/CommonHeader';
import SearchResultFooter from '../components/SearchResultFooter';

import LinearGradient from 'react-native-linear-gradient';

import Swiper from 'react-native-swiper';
import SearchHeader from '../components/SearchHeader';
import ProgressBar from 'react-native-progress-bar';

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

var imgHeight = Dimensions.get('window').height/3 - 39;

class SearchResultList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      progress: 0,
      dataSource: null,
      errormsg: null
    };
  }
  isChangeSearchFilter() {
    var _loaiTin = this.props.search.form.fields.loaiTin;
    var _loaiNhaDat = this.props.search.form.fields.loaiNhaDat;
    var _gia = this.props.search.form.fields.gia;
    var _soPhongNgu = this.props.search.form.fields.soPhongNgu;
    var _soTang = this.props.search.form.fields.soTang;
    var _dienTich = this.props.search.form.fields.dienTich;
    var _orderBy = this.props.search.form.fields.orderBy;

    var loaiTin = null;
    var loaiNhaDat = null;
    var gia = null;
    var soPhongNgu = null;
    var soTang = null;
    var dienTich = null;
    var orderBy = null;
    var loaded = false;
    if (this.state) {
      loaiTin = this.state.loaiTin;
      loaiNhaDat = this.state.loaiNhaDat;
      gia = this.state.gia;
      soPhongNgu = this.state.soPhongNgu;
      soTang = this.state.soTang;
      dienTich = this.state.dienTich;
      orderBy = this.state.orderBy;
      loaded = this.state.loaded;
    }
    if (loaded && _loaiTin === loaiTin && _loaiNhaDat === loaiNhaDat
      && _gia === gia && _soPhongNgu === soPhongNgu && _soTang === soTang
      && _dienTich === dienTich && _orderBy === orderBy) {
      return false;
    }
    return true;
  }
  updateSearchFilterState(dataSource, errormsg) {
    var _loaiTin = this.props.search.form.fields.loaiTin;
    var _loaiNhaDat = this.props.search.form.fields.loaiNhaDat;
    var _gia = this.props.search.form.fields.gia;
    var _soPhongNgu = this.props.search.form.fields.soPhongNgu;
    var _soTang = this.props.search.form.fields.soTang;
    var _dienTich = this.props.search.form.fields.dienTich;
    var _orderBy = this.props.search.form.fields.orderBy;
    this.setState({
      loaiTin: _loaiTin,
      loaiNhaDat: _loaiNhaDat,
      gia: _gia,
      soPhongNgu: _soPhongNgu,
      soTang: _soTang,
      dienTich: _dienTich,
      orderBy: _orderBy,
      dataSource: dataSource,
      errormsg: errormsg,
      loaded: true
    })
  }
  refreshListData() {
    var loaiTin = this.props.search.form.fields.loaiTin;
    var loaiNhaDat = this.props.search.form.fields.loaiNhaDat;
    var gia = this.props.search.form.fields.gia;
    var soPhongNgu = this.props.search.form.fields.soPhongNgu;
    var soTang = this.props.search.form.fields.soTang;
    var dienTich = this.props.search.form.fields.dienTich;
    var orderBy = this.props.search.form.fields.orderBy;
    var dataBlob = [];
    this.state.dataSource = null;
    this.state.errormsg = null;
    Api.getItems(loaiTin, loaiNhaDat, gia, soPhongNgu, soTang, dienTich, orderBy)
      .then((data) => {
        if (data.list) {
          data.list.map(function(aRow) {
              //console.log(aRow.value);
              dataBlob.push(aRow.value);
            }
          );
          this.props.actions.onSearchFieldChange("listData", dataBlob);
          var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
          var dataSource = ds.cloneWithRows(dataBlob);
          this.updateSearchFilterState(dataSource, null);
        } else {
          this.updateSearchFilterState(null, "Lỗi kết nối đến máy chủ!");
        }
      });
  }
  render() {
    if (this.isChangeSearchFilter()) {
      this.refreshListData();
    }
    if (!this.state.dataSource && !this.state.errormsg) {
      setTimeout((function() {
        this.setState({ progress: this.state.progress + (0.4 * Math.random())});
      }).bind(this), 1000);
      return (
  			<View style={styles.fullWidthContainer}>
          <View style={myStyles.search}>
            <SearchHeader placeName={this.props.search.form.fields.place.fullName}/>
          </View>
          <View style={styles.searchContent}>
            <ProgressBar
              fillStyle={{}}
              backgroundStyle={{backgroundColor: '#cccccc', borderRadius: 2}}
              style={{marginTop: 10, width: 300}}
              progress={this.state.progress}
            />
          </View>
          <SearchResultFooter />
  			</View>
      )
    }
    if (this.state.progress) {
      this.state.progress = 0;
    }
    if (this.state.errormsg) {
      return (
  			<View style={styles.fullWidthContainer}>
          <View style={myStyles.search}>
            <SearchHeader placeName={this.props.search.form.fields.place.fullName}/>
          </View>
          <View style={styles.searchContent}>
            <Text style={styles.welcome}>{this.state.errormsg}</Text>
          </View>
          <SearchResultFooter />
  			</View>
      )
    }
    return (
      <View style={styles.fullWidthContainer}>
        <View style={myStyles.search}>
          <SearchHeader placeName={this.props.search.form.fields.place.fullName}/>
        </View>

        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
          renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.separator} />}
          style={myStyles.searchListView}
        />
        <SearchResultFooter />
			</View>
		)
	}
  renderRow(rowData, sectionID, rowID) {
    var diaChi = rowData.diaChi;
    var soPhongNgu = rowData.soPhongNgu;
    if (soPhongNgu) {
      soPhongNgu = " " + soPhongNgu + " p.ngủ";
    }
    var soPhongTam = rowData.soPhongTam;
    if (soPhongTam) {
      soPhongTam = " " + soPhongTam + " p.tắm";
    }
    var maxDiaChiLength = 30;
    if (soPhongNgu) {
      maxDiaChiLength = maxDiaChiLength - 5;
    }
    if (soPhongTam) {
      maxDiaChiLength = maxDiaChiLength - 5;
    }
    var index = diaChi.indexOf(',', maxDiaChiLength-5);
    var length = 0;
    if (index !== -1 && index <= maxDiaChiLength) {
      length = index;
    } else {
      index = diaChi.indexOf(' ', maxDiaChiLength-5);
      length = index !== -1 && index <= maxDiaChiLength ? index : maxDiaChiLength;
    }
    diaChi = diaChi.substring(0,length);
    if (diaChi.length < rowData.diaChi.length) {
      diaChi = diaChi + '...';
    }
    var imageItems = [];
    var imageIndex = 0;
    rowData.images_small.map(function(imageSmallUrl) {
      var imageUrl = imageSmallUrl.replace("80x60", "745x510");
      imageItems.push(
        <View style={myStyles.slide} key={"img"+(imageIndex++)}>
          <TouchableHighlight onPress={() => Actions.SearchResultDetail(rowID)}>
            <Image style={myStyles.thumb} source={{uri: `${imageUrl}`}} >
              <LinearGradient colors={['transparent', 'rgba(0, 0, 0, 0.5)']}
              style={myStyles.linearGradient}>
              </LinearGradient>
            </Image>
          </TouchableHighlight>
        </View>
      );
    });
    if (imageItems.length == 0) {
      imageItems.push(
        <View style={myStyles.slide} key={"img"+(imageIndex)}>
          <TouchableHighlight onPress={() => Actions.SearchResultDetail(rowID)}>
            <Image style={myStyles.thumb} source={{uri: `${rowData.cover}`}} >
              <LinearGradient colors={['transparent', 'rgba(0, 0, 0, 0.5)']}
              style={myStyles.linearGradient}>
              </LinearGradient>
            </Image>
          </TouchableHighlight>
        </View>
      );
    }
    return (
        <View>

          <View style={myStyles.linearGradient}>

            <Swiper style={myStyles.wrapper} height={imgHeight}
                    showsButtons={false} autoplay={false} loop={false}
                    dot={<View style={[myStyles.dot, {backgroundColor: 'transparent'}]} />}
                    activeDot={<View style={[myStyles.dot, {backgroundColor: 'transparent'}]}/>}
            >
              {imageItems}
            </Swiper>

            <View style={myStyles.searchListViewRowAlign}>
              <View>
                <Text style={myStyles.price}>{rowData.price_value} {rowData.price_unit}</Text>
                <Text style={myStyles.text}>{diaChi}{soPhongNgu}{soPhongTam}</Text>
              </View>
              <Icon.Button name="heart-o" backgroundColor="transparent"
                underlayColor="transparent" style={myStyles.heartButton}/>
            </View>

          </View>

        </View>
    );
  }
}

// Later on in your styles..
var myStyles = StyleSheet.create({
  search: {
    backgroundColor: gui.blue1,
    height: 30
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
  linearGradient: {
    flex: 1,
    paddingLeft: 0,
    paddingRight: 0,
    backgroundColor : "transparent"
  },
  thumb: {
    justifyContent: 'flex-end',
    alignItems: 'stretch',
    height: imgHeight,
    alignSelf: 'auto',
  },
  searchListView: {
    marginTop: 30,
    margin: 0,
  },

  searchListViewRowAlign: {
    position: 'absolute',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    top: imgHeight-60,
    width: Dimensions.get('window').width
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
    backgroundColor: 'transparent',
    marginLeft: 10,
    color: 'white',
  },
  text: {
    fontSize: 14,
    textAlign: 'left',
    backgroundColor: 'transparent',
    marginLeft: 10,
    marginBottom: 15,
    margin: 5,
    color: 'white',
  },
  heartButton: {
    marginBottom: 10,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchResultList);
