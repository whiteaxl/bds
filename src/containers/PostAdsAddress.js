'use strict';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as globalActions from '../reducers/global/globalActions';
import * as postAdsActions from '../reducers/postAds/postAdsActions';

import React, {Component} from 'react';

import { Text, View, StyleSheet, TextInput, StatusBar, Dimensions } from 'react-native'

import {Map} from 'immutable';
import {Actions} from 'react-native-router-flux';
import log from "../lib/logUtil";
import gui from "../lib/gui";

import CommonHeader from '../components/CommonHeader';

const actions = [
  globalActions,
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



class PostAdsAddress extends Component {
  constructor(props) {
      super(props);
      StatusBar.setBarStyle('default');
      var {place} = this.props.postAds;
      var tinh = place.diaChinh.tinh;
      var huyen = place.diaChinh.huyen;
      var xa = place.diaChinh.xa;
      var xaPhuong = '';
      if (xa != '') {
          xaPhuong = xa + ', ' + huyen + ', ' + tinh;
      }
      this.state = {
          diaChi: place.diaChi,
          xaPhuong: xaPhuong
      };
  }

  render() {
    var ghiChuDuongPho = 'Ví dụ: Nhà số 12, ngõ 68, đường Hai Bà Trưng';
    var ghiChuXaPhuong = 'Thông tin này được lấy từ vị trí bạn chọn trên bản đồ.\r\nNếu chưa đúng, bạn hãy quay lại phần bản đồ và chọn lại vị trí nhà.';
    return (
			<View style={myStyles.container}>
                <View style={myStyles.search}>
                    <CommonHeader backTitle={"Địa chỉ"} />
                    <View style={myStyles.headerSeparator} />
                </View>
                <View style={{marginTop: 15, marginLeft: 15, marginRight: 15}}>
                    <Text style={myStyles.label}>SỐ NHÀ, NGÕ, ĐƯỜNG</Text>
                    <TextInput
                        secureTextEntry={false}
                        style={myStyles.input}
                        value={this.state.diaChi}
                        onChangeText={(text) => this.onValueChange("diaChi", text)}
                    />
                    <Text style={myStyles.label2}>{ghiChuDuongPho}</Text>
                    <Text style={[myStyles.label, {marginTop: 20}]}>PHƯỜNG, QUẬN, THÀNH PHỐ</Text>
                    <TextInput
                        editable={false}
                        secureTextEntry={false}
                        style={[myStyles.input, {color: '#8A8A8A'}]}
                        value={this.state.xaPhuong}
                        onChangeText={(text) => this.onValueChange("xaPhuong", text)}
                    />
                    <Text style={myStyles.label2}>{ghiChuXaPhuong}</Text>
                </View>
			</View>
		)
	}

  onValueChange(key: string, value: string) {
      const newState = {};
      newState[key] = value;
      this.setState(newState);
      this._updateDiaChiFull(key, value);
  }

  _updateDiaChiFull(key: string, value: string) {
      var {place} = this.props.postAds;
      var {xaPhuong} = this.state;
      if (key == 'diaChi') {
          place.diaChi = value;
          if (xaPhuong != '') {
              place.diaChiFullName = value + ', ' + xaPhuong;
          } else {
              place.diaChiFullName = value;
          }
      }
      this.props.actions.onPostAdsFieldChange("place", place);
  }
}

/**
 * ## Styles
 */
var myStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
        backgroundColor: 'white'
    },
    headerSeparator: {
        marginTop: 2,
        borderTopWidth: 1,
        borderTopColor: gui.separatorLine
    },
    search: {
        top:0,
        alignItems: 'stretch',
        justifyContent: 'flex-start',
    },
    label: {
        fontSize: gui.normalFontSize,
        fontFamily: gui.fontFamily,
        color: '#8A8A8A'
    },
    label2: {
        fontSize: 12,
        fontFamily: gui.fontFamily,
        color: '#A9A9A9'
    },
    input: {
        padding: 4,
        height: 35,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        margin: 5,
        width: Dimensions.get('window').width - 30,
        alignSelf: 'center'
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(PostAdsAddress);

