import React, { Component } from 'react';
import {
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert
} from 'react-native';

var Dimensions = require('Dimensions');
var { width, height } = Dimensions.get('window');

import Icon from 'react-native-vector-icons/FontAwesome';
import LikeTabButton from '../LikeTabButton';

import {Actions} from 'react-native-router-flux';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {Map} from 'immutable';

import * as globalActions from '../../reducers/global/globalActions';
import * as pricingActions from '../../reducers/pricing/pricingActions';
import * as postAdsActions from '../../reducers/postAds/postAdsActions';

const actions = [
  globalActions,
  pricingActions,
  postAdsActions
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


class DinhGia extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaiTin: 'ban',
      loaiNhaDat: {key: null, value: ''},
      diaChi: "",
      diaChinh: {},
      duAn: {},
      dientich: '',
      location: {},
      showMoRong: false
    };
  }

  componentWillMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var location = {
          lat: position.coords.latitude,
          lon: position.coords.longitude
        };
        this.setState({ location: location });
      },
      (error) => {
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }

  _onLoaiNhaDatSelected(selected) {
    let loaiNhaDat = {
      key: selected.key,
      value: selected.value
    }
    this.setState({ loaiNhaDat: loaiNhaDat});
  }

  _onLoaiDuAn(selected) {
    this.setState({ duAn: selected});
  }

  _onDuAnPress(){
    let diaChinhDto = this.state.diaChinh;
    diaChinhDto.tinh = undefined;
    diaChinhDto.huyen = undefined;
    diaChinhDto.xa = undefined;
    this.props.actions.getDiaChinhFromGoogleData(diaChinhDto).then(
        (res) =>{
          if ( res.status =='OK')
            Actions.DuAn({func:'pricing', onPress: this._onLoaiDuAn.bind(this) })
        }
    )
  }

  _onVitri(position) {
    this.setState({ diaChi: position.diaChi,
                    diaChinh: position.diaChinh,
                    location: position.location});
  }

  _renderThietLap() {
    return (
      <View style={styles.viewNenMoRong}>
        <TouchableOpacity onPress={this.onResetFilters.bind(this)} style={styles.viewMoRong}>
          <Text style={styles.textThietLap}>Thiết lập lại</Text>
        </TouchableOpacity>
      </View>

    );
  }

  onResetFilters() {
    this.setState(
      {
        loaiTin: 'ban',
        loaiNhaDat: {key: null, value: ''},
        diaChi: '',
        diaChinh: {},
        duAn: '',
        dientich: '',
        location: {},
        showMoRong: false
      });
  }

  onMoRongPress() {
    this.setState({ showMoRong: true });
  }

  _onThucHien(){
    let loaiNhaDat = [this.state.loaiNhaDat.key];
    let codeDuAn = '';

    if (this.state.duAn && this.state.duAn.duAn && this.state.duAn.duAn.length>0)
      codeDuAn = this.state.duAn.duAn;

    let dienTich = -1;
    if (this.state.dientich && this.state.dientich.length >0)
        dienTich = Number(this.state.dientich);
    
    let condition = {
      loaiTin:this.state.loaiTin == 'ban' ? 0 : 1,
      loaiNhaDat:loaiNhaDat,
      position: this.state.location,
      codeDuAn: codeDuAn.length>0 ? codeDuAn : undefined,
      dienTich: dienTich >0 ? dienTich : undefined
    }
    this.props.actions.calculatePricing(condition).then(
        (res) =>{
          if (res.success){
            Actions.KetQuaDinhGia({ loaiTin: this.state.loaiTin == 'ban' ? "bán" : "thuê",
                                    data: res.data,
                                    diaChi: this.state.diaChi,
                                    loaiNhaDat: this.state.loaiNhaDat.value})
          }else {
            Alert.alert("Không có thông tin định giá khu vực bạn cần tìm");
          }
        }
    );

  }

  _renderMoRong() {
    if (!this.state.showMoRong) {
      return (
          <View style={styles.viewNenMoRong}>
            <TouchableOpacity onPress={this.onMoRongPress.bind(this)} style={styles.viewMoRong}>
              <Text style={styles.textMoRong}>Mở rộng</Text>
            </TouchableOpacity>
          </View>
      );
    }
  }

  _renderDienTich() {
    if (this.state.showMoRong) {
      return (
          <View style={styles.viewNenMoRong} >
            <View style={styles.viewShowDienTich}>
              <Text style={styles.textViTri}>Diện tích (m²)</Text>
              <TextInput
                  keyboardType={'numeric'}
                  returnKeyType='done'
                  style={styles.inputDienTich}
                  onChangeText={(text) => this.setState({ dientich: (text) })}
                  value={this.state.dientich}
              />
            </View>
          </View>
      )
    }
  }

  _onLoaiNhaDat() {
    Actions.LoaiNhaDat({ loaiTin: this.state.loaiTin, onPress: this._onLoaiNhaDatSelected.bind(this) })
  }

  _onViTriPress() {
    Actions.MMapView({ onPress: this._onVitri.bind(this), location: this.state.location });
  }

  _onLoaiTinChange(value) {
    this.setState({ loaiTin: value });
  }

  _getLoaiNhaDatDisplay(){
    if (this.state.loaiNhaDat == {})
        return "";
    return this.state.loaiNhaDat.value.substring(0, 25);
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={[styles.toolbar, Platform.OS === 'ios' ? { marginTop: 0 } : null]}>
          <TouchableOpacity onPress={() => Actions.pop()} style={styles.modalBack} >
            <Icon name="angle-left" size={40} color="white" />
          </TouchableOpacity>
          <View style={styles.viewTitle}>
            <Text style={styles.textTitle}>Định giá nhà đất</Text>
          </View>
          <View style={styles.viewCan}></View>
        </View>
        <View style={styles.viewBody}>
          <View style={styles.viewBanThue}>
            <LikeTabButton name={'ban'}
              onPress={this._onLoaiTinChange.bind(this)}
              selected={this.state.loaiTin == 'ban'}>Bán</LikeTabButton>
            <LikeTabButton name={'thue'}
              onPress={this._onLoaiTinChange.bind(this)}
              selected={this.state.loaiTin == 'thue'}>Cho Thuê</LikeTabButton>
          </View>
          <View style={styles.viewNhaDat}>
            <View style={styles.viewDacDiem}>
              <Text style={styles.textDacDiem}>ĐẶC ĐIỂM CỦA NHÀ ĐẤT CẦN ĐỊNH GIÁ</Text>
            </View>
            <TouchableOpacity onPress={this._onViTriPress.bind(this)} style={styles.touchViTri}>
              <View style={styles.viewWidth}>
                <Text style={styles.textViTri}>Vị trí</Text>
              </View>
              <View style={styles.viewLoaiNha}>
                <Text style={styles.textNhaDat}>{this.state.diaChi.substring(0, 25)}</Text>
              </View>
              <Icon name="angle-right" size={24} color="#bebec0" />
            </TouchableOpacity>
            <TouchableOpacity onPress={this._onLoaiNhaDat.bind(this)} style={styles.touchViTri}>
              <View style={styles.viewWidth}>
                <Text style={styles.textViTri}>Loại nhà đất</Text>
              </View>
              <View style={styles.viewLoaiNha}>
                <Text style={styles.textNhaDat}>{this.state.loaiNhaDat.value.substring(0, 25)}</Text>
              </View>
              <Icon name="angle-right" size={24} color="#bebec0" />
            </TouchableOpacity>
            <TouchableOpacity onPress={this._onDuAnPress.bind(this)} style={styles.touchViTri}>
              <View style={styles.viewWidth}>
                <Text style={styles.textViTri}>Thuộc dự án</Text>
              </View>
              <View style={styles.viewLoaiNha}>
                <Text style={styles.textNhaDat}>{this._getDuAnText()}</Text>
              </View>
              <Icon name="angle-right" size={24} color="#bebec0" />
            </TouchableOpacity>
          </View>

          {this._renderDienTich()}

          {this._renderMoRong()}
          {this._renderThietLap()}
        </View>

        <TouchableOpacity onPress={this._onThucHien.bind(this)} style={styles.viewActions}>
          <Text style={styles.textActions}>Thực hiện</Text>
        </TouchableOpacity>

      </View>

    );
  }

  _getDuAnText(){
    console.log(this.state.duAn);
    if (this.state.duAn && this.state.duAn.fullName && this.state.duAn.fullName.length>0){
      return this.state.duAn.fullName.substring(0, 25);
    }

    return '';
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(DinhGia);

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flex: 1,
    alignItems: 'center'
  },
  toolbar: {
    height: 64,
    flexDirection: 'row',
    backgroundColor: '#1ea7de',
    borderBottomWidth: 1,
    borderColor: '#1ea7de'
  },
  modalBack: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    marginLeft: 7
  },
  imageBack: {
    width: 21,
    height: 21
  },
  viewTitle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textTitle: {
    fontSize: 18,
    color: 'white',
    marginTop: 17,
    fontFamily: 'OpenSans-Bold'
  },

  viewHuy: {
    width: 40,
    marginLeft: 12,
    marginTop: 30
  },
  textHuy: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'Open Sans',
  },

  viewCan: {
    width: 40
  },
  viewBody: {
    flex: 1,
    backgroundColor: 'white'
  },
  viewActions: {
    backgroundColor: '#ef562c',
    width: width,
    height: 43,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 0
  },
  textActions: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'OpenSans-Bold'
  },
  viewBanThue: {
    height: 44,
    width: width,
    backgroundColor: 'white',
    flexDirection: 'row'
  },
  viewBan: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textBan: {
    color: '#1ea7de',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'OpenSans-Bold'
  },
  viewThue: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textThue: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'OpenSans-Bold'
  },
  viewNenButton: {
    backgroundColor: '#1ea7de',
    height: 2,
    width: width / 2
  },
  viewNhaDat: {
    height: 152,
    width: width
  },
  viewDacDiem: {
    backgroundColor: '#f3f3f5',
    width: width,
    height: 25,
    justifyContent: 'center'
  },
  textDacDiem: {
    color: '#9fa0a4',
    fontSize: 10,
    marginLeft: 28,
    fontFamily: 'Open Sans'
  },
  touchViTri: {
    flex: 1,
    marginLeft: 28,
    borderBottomWidth: 1,
    borderColor: '#f3f3f5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',

  },
  textViTri: {
    color: 'black',
    fontSize: 15,
    fontFamily: 'Open Sans'
  },
  textNhaDat: {
    color: '#9fa0a4',
    fontSize: 15,
    fontFamily: 'Open Sans',
    justifyContent: 'center',
    marginRight: 10
  },
  viewNenMoRong: {
    backgroundColor: '#f3f3f5',
    width: width,
    height: 80,
    justifyContent: 'flex-end'
  },
  viewMoRong: {
    backgroundColor: 'white',
    width: width,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#f3f3f5',
  },
  textMoRong: {
    color: '#1ea7de',
    fontSize: 16,
    fontFamily: 'Open Sans'
  },

  viewDuAn: {
    width: width - 55,
    flexDirection: 'row',
    backgroundColor: 'white'
  },
  viewWidth: {
    width: 90,
    flexDirection: 'row',
    backgroundColor: 'white'
  },
  viewLoaiNha: {
    width: width - 144,
    backgroundColor: 'white',
    alignItems: 'flex-end',
    height: 21

  },
  viewDienTich: {
    height: 42,
    width: width,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: '#f3f3f5',
  },
  viewShowDienTich:{
    backgroundColor: 'white',
    height: 42,
    flexDirection:'row',
    paddingLeft:28,
    alignItems: 'center',
  },
  inputDienTich: {
    fontSize: 15,
    fontFamily: 'Open Sans',
    padding: 4,
    paddingRight: 10,
    height: 30,
    borderColor: '#bebec0',
    borderWidth: 1,
    borderRadius: 5,
    marginLeft: width / 3 + 15,
    width: 80,
    textAlign: 'right',
    alignSelf: 'center'
  },
  textThietLap: {
    color: 'red',
    fontSize: 15,
    fontFamily: 'Open Sans'
  },


});


