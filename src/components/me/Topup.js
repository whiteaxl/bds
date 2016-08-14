'use strict';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as globalActions from '../../reducers/global/globalActions';

import React, {Component} from 'react';

import {Text, View, StyleSheet, TextInput, StatusBar, Dimensions, TouchableHighlight} from 'react-native'

import TruliaIcon from '../TruliaIcon';

import {Map} from 'immutable';
import {Actions} from 'react-native-router-flux';
import log from "../../lib/logUtil";
import gui from "../../lib/gui";

import LineWithIcon from './LineWithIcon';

const actions = [
  globalActions,
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


class Topup extends Component {
  constructor(props) {
    super(props);
    StatusBar.setBarStyle('light-content');
  }

  _onScratch() {
    Actions.Topup_Scratch();
  }
  _onIAP() {
  }
  _onSMS() {
  }
  _onBank() {
  }

  render() {

    let currentUser = this.props.global.currentUser;

    return (
      <View style={myStyles.container}>
        <View style={myStyles.customPageHeader}>
          <View style={myStyles.customPageTitle}>
            <Text style={myStyles.customPageTitleText}>
              Nạp tiền
            </Text>
          </View>
          <TruliaIcon onPress={this._onBack.bind(this)}
                      name="arrow-left" color={'white'} size={25}
                      mainProps={myStyles.backButton} text={this.props.backTitle}
                      textProps={myStyles.backButtonText}>
          </TruliaIcon>
        </View>

        <View >
          <View style={myStyles.accountInfo}>
            <Text style={myStyles.introText}>Thong tin tai khoan:</Text>
            <View style={{flexDirection: "row"}}>
              <Text style={[myStyles.normalFont, {width: 200, paddingLeft: 10}]}>Tài khoản chính:</Text>
              <Text style={[myStyles.normalFont, {fontWeight: 'bold'}]}>{currentUser.mainAccount}</Text>
            </View>
            <View style={{flexDirection: "row"}}>
              <Text style={[myStyles.normalFont, {width: 200, paddingLeft: 10}]}>Tài khoản KM:</Text>
              <Text style={[myStyles.normalFont, {fontWeight: 'bold'}]}>{currentUser.bonusAccount}</Text>
            </View>

          </View>

          <LineWithIcon iconSource = {require('../../assets/image/topup/scratch.png')}
                        onPress = {() => this._onScratch()}
                        containerStyle = {myStyles.lineWithIconStyle}
                        title = "Nạp thẻ cào điện thoại" />
          <Text style={myStyles.introText}>Thời gian 0-5 phút, bạn phải chịu phí 20% tổng số tiền nạp vào tài khoản</Text>

          <LineWithIcon iconSource = {require('../../assets/image/topup/iap.png')}
                        onPress = {() => this._onIAP()}
                        containerStyle = {myStyles.lineWithIconStyle}
                        title = "Thanh toán In-App" />
          <Text style={myStyles.introText}>Thời gian 0-5 phút, bạn chịu phí 30% tổng số tiền nạp vào tài khoản</Text>

          <LineWithIcon iconSource = {require('../../assets/image/topup/sms.png')}
                        onPress = {() => this._onSMS()}
                        containerStyle = {myStyles.lineWithIconStyle}
                        title = "Tin nhắn SMS" />
          <Text style={myStyles.introText}>Thời gian 0-5 phút, bạn chịu phí 50% tổng số tiền nạp vào tài khoản</Text>

          <LineWithIcon iconSource = {require('../../assets/image/topup/bank.png')}
                        onPress = {() => this._onBank()}
                        containerStyle = {myStyles.lineWithIconStyle}
                        title = "Chuyển khoản ngân hàng" />
          <Text style={myStyles.introText}>Thời gian 1-2 ngày, phí ngân hàng thu (thường ko mất phí)</Text>

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
  accountInfo: {
    flex: 1,
    height: 200,
    paddingLeft: 19,
    paddingRight: 19,
    paddingTop: 10,
    paddingBottom: 10
  },

  lineWithIconStyle : {
    borderTopColor: '#ebebeb',
    borderBottomColor: '#ebebeb',
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },

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

  normalFont: {
    fontSize: 14,
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
    paddingBottom: 10,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Topup);

