'use strict';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as globalActions from '../../reducers/global/globalActions';
import * as meActions from '../../reducers/me/meActions';

import React, {Component} from 'react';

import {Text, View, StyleSheet, TextInput, StatusBar, Dimensions, Image, TouchableOpacity} from 'react-native'

import TruliaIcon from '../TruliaIcon';

import {Map} from 'immutable';
import {Actions} from 'react-native-router-flux';
import log from "../../lib/logUtil";
import gui from "../../lib/gui";
import cfg from "../../cfg";

import Communications from 'react-native-communications';
import CarrierInfoModule from 'NativeModules';
//var CarrierInfo = CarrierInfoModule.RNCarrierInfo;
var CarrierInfo = require('NativeModules').RNCarrierInfo;

const actions = [
  globalActions,
  meActions
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


class Topup_SMS extends Component {
  constructor(props) {
    super(props);
    StatusBar.setBarStyle('light-content');
  }

  _onScratchTypeChange(val) {
    this.props.actions.onTopupScratchFieldChange('type',val);
  }


  render() {
    let userID = this.props.global.currentUser.userID;

    return (
      <View style={myStyles.container}>
        <View style={myStyles.customPageHeader}>
          <View style={myStyles.customPageTitle}>
            <Text style={myStyles.customPageTitleText}>
              Tin nhắn SMS
            </Text>
          </View>
          <TruliaIcon onPress={this._onBack.bind(this)}
                      name="arrow-left" color={'white'} size={25}
                      mainProps={myStyles.backButton} text={this.props.backTitle}
                      textProps={myStyles.backButtonText}>
          </TruliaIcon>
        </View>

        <SmsOption topup="100" tk="50" userID = {userID}/>
        <View style={myStyles.lineSeparator}/>
        <SmsOption topup="50" tk="25" userID = {userID}/>
        <View style={myStyles.lineSeparator}/>
        <SmsOption topup="30" tk="15" userID = {userID}/>
        <View style={myStyles.lineSeparator} />
        <SmsOption topup="20" tk="10" userID = {userID}/>

        <View style={myStyles.introTextContainer}>
          <Text style={myStyles.introText}>Chú ý: chọn gói tin SMS, soạn tin đúng cú pháp trước khi gửi tin nhắn</Text>
        </View>
      </View>
    )
  }

  _onBack() {
    Actions.pop();
  }
}

class SmsOption extends Component {
  sendSms() {
    var topup = this.props.topup;
    var userID = this.props.userID;

    CarrierInfo.mobileNetworkCode(
      (result) => {
        let body = `MW RL NAP${topup} ${userID}`;

        if (result == "01" || result == "02") { //vina or mobi
          body = `MW RL NAP${topup} ${userID}`;
        } else if (result == "04") {
          body = `MW ${topup}000 RL NAP ${userID}`;
        } else {
          alert("Không xác định được nhà mạng, xin vui lòng tự soạn tin nhắn!");
          return;
        }
        Communications.text(cfg.topupSMSNumber, body);
      }
    );
  }

  render() {
    let topup = this.props.topup;
    let tk= this.props.tk;

    return(
      <View style = {{flexDirection: "row", alignItems: 'center',
        justifyContent:'space-between',
        marginTop: 17, marginBottom: 17

      }}>
        <View style = {{flexDirection: "row", alignItems: 'center'}}>
          <View style={{flexDirection: "column", marginLeft: 17, marginRight: 25}}>
            <Image
              style={{height: 60, width: 60}}
              resizeMode={Image.resizeMode.contain}
              source={require('../../assets/image/topup/sms_50k.png')}
            />

            <Text style={[myStyles.introText,
              {
                borderRadius:3, backgroundColor:'#ffb148', color: 'white',
                paddingTop: 5,paddingBottom: 5,
                paddingLeft: 5,paddingRight: 5,
                fontSize: 12,fontWeight: "bold",
                width: 60, marginTop: 10, textAlign : 'center'
              }]}>
              + {tk}k
            </Text>
          </View>

          <View style={{flexDirection: "column"}}>
            <Text style={[myStyles.textContent]}>
              Soạn tin nhắn gửi 9029
            </Text>

            <Text style={[myStyles.textContent, {paddingLeft: 10,fontSize: 13}]}>
              Vina/Mobi: MW RL NAP{topup}
            </Text>
            <Text style={[myStyles.textContent, {paddingLeft: 10,fontSize: 13}]}>
              Viettel: MW {topup}000 RL NAP
            </Text>

            <Text style={[myStyles.textContent, {fontSize: 13}]}>
              Phí nhắn tin:    {topup}k
            </Text>

            <Text style={[myStyles.textContent, {fontSize: 13}]}>
              Tiền nạp vào TK: {tk}k
            </Text>

          </View>
        </View>


        <TouchableOpacity style={{right: 17}}
                          onPress={this.sendSms.bind(this)}>
          <Text style={[myStyles.introText,
            {
              borderRadius:3, backgroundColor:'#f3000f', color: 'white',
              paddingTop: 5,
              paddingBottom: 5,
              paddingLeft: 10,
              paddingRight: 10,
              fontSize: 13,
              fontWeight: "600",
            }]}>
            Gửi SMS
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

/**
 * ## Styles
 */
var myStyles = StyleSheet.create({
  accountInfo: {
    flex: 1,
    height: 200,
  },

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
  lineSeparator: {
    marginLeft: 17,
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
  title: {
    fontSize: 13,
    fontFamily: gui.fontFamily,
    color: '#8A8A8A',
    paddingTop: 8,
    paddingLeft: 19,
    paddingBottom: 8,
  },

  textContent : {
    fontSize: 16,
    fontFamily: gui.fontFamily,
    color: 'black',
  },

  introText: {
    fontSize: 14,
    fontFamily: gui.fontFamily,
    color: '#8A8A8A',
  },

  introTextContainer : {
    paddingLeft: 19,
    paddingRight: 19,
    paddingTop: 10,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderTopColor: gui.separatorLine,
    flexDirection : "column",
    flex: 1,
    backgroundColor : "#f6f6f6",
  },

});

export default connect(mapStateToProps, mapDispatchToProps)(Topup_SMS);

