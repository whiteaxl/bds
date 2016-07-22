'use strict';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as globalActions from '../../reducers/global/globalActions';
import * as adsMgmtActions from '../../reducers/adsMgmt/adsMgmtActions';

import React, {Component} from 'react';

import {Text, View, StyleSheet, TextInput, StatusBar, Dimensions, TouchableHighlight} from 'react-native'

import TruliaIcon from '../TruliaIcon';

import {Map} from 'immutable';
import {Actions} from 'react-native-router-flux';
import log from "../../lib/logUtil";
import gui from "../../lib/gui";
import placeUtil from "../../lib/PlaceUtil";

import LineWithIcon from "./UpgradePackgeSelector_LineWithIcon";

const actions = [
  globalActions,
  adsMgmtActions
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


class UpgradePackgeSelector extends Component {
  constructor(props) {
    super(props);
    StatusBar.setBarStyle('light-content');
  }
  _onSelect(val) {
    this.props.actions.changeSelectedPackage(val);
    Actions.PackageUpdater();
  }

  render() {
    var ghiChuTitle = 'Để tin của bạn được nhiều người xem hơn, hãy nâng cấp tin bằng các gói dịch vụ sau: \n';
    var ghiChuViTri = 'Sử dụng gói VỊ TRÍ để tin của bạn luôn nằm trên các tin khác trong KẾT QUẢ TÌM KIẾM của người dùng.\n';
    var ghiChuTrangChu = "Sử dụng gói TRANG CHỦ để tin của bạn luôn nằm trên các tin khác trong các BỘ SƯU TẬP ở màn hình chính.\n";
    var ghiChuLogo = "Sử dụng gói LOGO để tin của bạn thu hút được nhiều sự chú ý của người xem hơn.\n";

    return (
      <View style={myStyles.container}>
        <View style={myStyles.customPageHeader}>
          <View style={myStyles.customPageTitle}>
            <Text style={myStyles.customPageTitleText}>
              Nâng cấp tin
            </Text>
          </View>
          <TruliaIcon onPress={this._onBack.bind(this)}
                      name="arrow-left" color={'white'} size={25}
                      mainProps={myStyles.backButton} text={this.props.backTitle}
                      textProps={myStyles.backButtonText}>
          </TruliaIcon>
        </View>

        <View >
          <Text style={myStyles.introText}>{ghiChuTitle}</Text>

          <LineWithIcon iconSource = {require('../../assets/image/goi/viTri.png')}
                        onPress = {() => this._onSelect('goiViTri')}
                        value = {this.props.adsMgmt.package.current_goiViTri}
                        titleColor = {"#e52663"}
                        title = "Gói VỊ TRÍ" />
          <Text style={myStyles.introText}>{ghiChuViTri}</Text>

          <LineWithIcon iconSource = {require('../../assets/image/goi/trangChu.png')}
                        onPress = {() => this._onSelect('goiTrangChu')}
                        value = {this.props.adsMgmt.package.current_goiTrangChu}
                        titleColor = {"#ffbc34"}
                        title = "Gói TRANG CHỦ" />
          <Text style={myStyles.introText}>{ghiChuTrangChu}</Text>

          <LineWithIcon iconSource = {require('../../assets/image/goi/logo.png')}
                        onPress = {() => this._onSelect('goiLogo')}
                        value = {this.props.adsMgmt.package.current_goiLogo}
                        titleColor = {"#2a9ad2"}
                        title = "Gói LOGO" />
          <Text style={myStyles.introText}>{ghiChuLogo}</Text>

        </View>
      </View>
    )
  }

  _onBack() {
    Actions.pop();
  }
}

/**
 * ## Styles
 */
var myStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: '#f6f6f6'
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
    top: 0,
    height: 60
  },
  customPageTitle: {
    left: 36,
    right: 36,
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

  label: {
    fontSize: gui.normalFontSize,
    fontFamily: gui.fontFamily,
    color: '#8A8A8A'
  },

  introText: {
    fontSize: 14,
    fontFamily: gui.fontFamily,
    color: '#8A8A8A',
    paddingLeft: 19,
    paddingRight: 19,
    paddingTop: 10,

  },
});

export default connect(mapStateToProps, mapDispatchToProps)(UpgradePackgeSelector);

