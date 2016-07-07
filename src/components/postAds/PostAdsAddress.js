'use strict';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as globalActions from '../../reducers/global/globalActions';
import * as postAdsActions from '../../reducers/postAds/postAdsActions';

import React, {Component} from 'react';

import { Text, View, StyleSheet, TextInput, StatusBar, Dimensions } from 'react-native'

import TruliaIcon from '../TruliaIcon';

import {Map} from 'immutable';
import {Actions} from 'react-native-router-flux';
import log from "../../lib/logUtil";
import gui from "../../lib/gui";
import placeUtil from "../../lib/PlaceUtil";

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
      StatusBar.setBarStyle('light-content');
      var {place} = this.props.postAds;

      this.state = {
          diaChi: place.diaChi,
          xaPhuong: placeUtil.getDiaChinhFullName(place)
      };
  }

  render() {
    var ghiChuDuongPho = 'Ví dụ: Nhà số 12, ngõ 68, đường Hai Bà Trưng';
    var ghiChuXaPhuong = 'Thông tin này được lấy từ vị trí bạn chọn trên bản đồ.\r\nNếu chưa đúng, bạn hãy quay lại phần bản đồ và chọn lại vị trí nhà.';
    var headerTitle = "Địa chỉ";
    return (
			<View style={myStyles.container}>
                <View style={myStyles.search}>
                    <View style={myStyles.customPageHeader}>
                        <View style={myStyles.customPageTitle}>
                            <Text style={myStyles.customPageTitleText}>
                                {headerTitle}
                            </Text>
                        </View>
                        <TruliaIcon onPress={this._onBack.bind(this)}
                                    name="arrow-left" color={'white'} size={25}
                                    mainProps={myStyles.backButton} text={this.props.backTitle}
                                    textProps={myStyles.backButtonText} >
                        </TruliaIcon>
                    </View>
                </View>
                <View style={{marginTop: 15, marginLeft: 15, marginRight: 15}}>
                    <Text style={myStyles.label}>SỐ NHÀ, NGÕ, ĐƯỜNG</Text>
                    <TextInput
                        secureTextEntry={false}
                        autoFocus={true}
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

  _onBack() {
      Actions.pop();
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
        backgroundColor: '#F6F6F6'
    },
    headerSeparator: {
        marginTop: 2,
        borderTopWidth: 1,
        borderTopColor: gui.separatorLine
    },
    customPageHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        backgroundColor: gui.mainColor,
        height: 60
    },
    customPageTitle: {
        left:36,
        right:36,
        marginTop: 31,
        marginBottom: 10,
        position: 'absolute'
    },
    customPageTitleText: {
        color: 'white',
        fontSize: gui.normalFontSize,
        fontWeight: 'bold',
        fontFamily: gui.fontFamily,
        textAlign: 'center'
    },
    backButton: {
        marginTop: 28,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        paddingLeft: 18,
        paddingRight: 18
    },
    backButtonText: {
        color: 'white',
        fontSize: gui.normalFontSize,
        fontFamily: gui.fontFamily,
        textAlign: 'left',
        marginLeft: 7
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
        paddingLeft: 17,
        paddingRight: 15,
        height: 35,
        borderColor: '#EFEFEF',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        margin: 5,
        width: Dimensions.get('window').width,
        alignSelf: 'center',
        backgroundColor: "white"
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(PostAdsAddress);

