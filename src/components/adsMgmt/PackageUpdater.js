'use strict';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as globalActions from '../../reducers/global/globalActions';
import * as adsMgmtActions from '../../reducers/adsMgmt/adsMgmtActions';

import React, {Component} from 'react';

import {Text, View, StyleSheet, TextInput, StatusBar, Dimensions,
  TouchableHighlight, Image, Picker, Alert} from 'react-native'

import TruliaIcon from '../TruliaIcon';

import {Map} from 'immutable';
import {Actions} from 'react-native-router-flux';
import log from "../../lib/logUtil";
import gui from "../../lib/gui";
import placeUtil from "../../lib/PlaceUtil";

import danhMuc from "../../assets/DanhMuc";

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


class PackageUpdater extends Component {
  constructor(props) {
    super(props);
    StatusBar.setBarStyle('light-content');
  }
  _onGoiPressed() {

  }

  _getTitle() {
    return "Gói vị trí";
  }

  _renderMoneyLine(label, value) {
    return (
      <View style={{flexDirection:'row'}}>
        <Text style={{fontSize: 14, width: 130,fontFamily: gui.fontFamily}}>
          {label}
        </Text>
        <Text style={{fontSize: 14, fontFamily: gui.fontFamily}}>
          {value}
        </Text>
      </View>
    )
  }

  _renderTitleLine(value) {
    return (
      <Text style = {{color:'#919191', padding: 10, paddingTop:20, paddingLeft: 19}}>
        {value}
      </Text>
    );
  }

  _getCurrentLevelName() {
    let current = this.props.adsMgmt.package.packageSelected;
    let levelName = this.props.adsMgmt.package[current].levelName;

    return levelName;
  }

  _getCurrentLength() {
    let current = this.props.adsMgmt.package.packageSelected;
    let length = this.props.adsMgmt.package[current].lengthName;

    return length;
  }

  _renderPackageLine(title, value, onPress) {
    return (
        <TouchableHighlight
          onPress={onPress}>
          <View style={[myStyles.selectLine, myStyles.headerSeparator]}>
            <Text style={myStyles.label}>
              {title}
            </Text>
            <View style={myStyles.arrowIcon}>
              <Text style={myStyles.label}> {value} </Text>
              <TruliaIcon name={"arrow-right"} color={gui.arrowColor} size={18} />
            </View>
          </View>
        </TouchableHighlight>
    );
  }

  onApply() {
    Alert.alert(
      'Alert Title',
      'Bạn đồng ý mua gói dịch vụ ?',
      [
        {text: 'Hủy', onPress: () => console.log('Cancel Pressed!')},
        {text: 'Đồng ý', onPress: () => {
          this.props.actions.buyCurrentPackage(this.props.adsMgmt.package);
          Actions.pop();
        }}
      ]
    )
  }

  render() {
    return (
      <View style={myStyles.container}>
        <View style={myStyles.customPageHeader}>
          <View style={myStyles.customPageTitle}>
            <Text style={myStyles.customPageTitleText}>
              {this._getTitle()}
            </Text>
          </View>
          <TruliaIcon onPress={this._onBack.bind(this)}
                      name="arrow-left" color={'white'} size={25}
                      mainProps={myStyles.backButton} text={this.props.backTitle}
                      textProps={myStyles.backButtonText}>
          </TruliaIcon>

          <TouchableHighlight
            style={{right: 10
            , position:'absolute', top : 32}}

            onPress={this.onApply.bind(this)}>
            <Text style={{color: 'white', fontSize: 16
            , fontFamily: gui.fontFamily, fontWeight:'600'}}>
                Thực hiện
            </Text>
          </TouchableHighlight>

        </View>

        <View >
          {this._renderTitleLine("TÀI KHOẢN VÀ PHÍ DỊCH VỤ")}

          <View style={{flexDirection: "row", paddingLeft: 19, backgroundColor:'white', paddingTop:8, paddingBottom: 8}}>
            <Image
              style={{width: 45, height: 45}}
              resizeMode={Image.resizeMode.contain}
              source={require('../../assets/image/goi/money.png')}
            />

            <View style={{paddingLeft: 13, paddingTop:5}}>
              {this._renderMoneyLine("Tổng tài khoản:", "500k")}
              {this._renderMoneyLine("Phí dịch vụ:", "100k")}
            </View>
          </View>

          {this._renderTitleLine("CHỌN GÓI DỊCH VỤ và SỐ NGÀY")}

          {this._renderPackageLine("Gói dịch vụ"
            , this._getCurrentLevelName()
            , () => Actions.PackageTypes())}

          {this._renderPackageLine("Số ngày"
            , this._getCurrentLength()
            , () => Actions.PackageLengths())}

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

  picker : {
    backgroundColor: 'white',
  },

  pickerItem: {
    fontSize: 11,
    fontFamily: gui.fontFamily,
  },
  selectLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 17,
    paddingRight: 10,
    backgroundColor: 'white',
    paddingTop: 8,
    paddingBottom: 8
  },

  arrowIcon: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingRight: 4
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(PackageUpdater);

