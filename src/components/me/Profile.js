'use strict';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as globalActions from '../../reducers/global/globalActions';

import React, {Component} from 'react';

import {Text, View, StyleSheet, TextInput, StatusBar, Dimensions, TouchableHighlight} from 'react-native'

import TruliaIcon from '../TruliaIcon';

import {Map} from 'immutable';
import {Actions} from 'react-native-router-flux';
import gui from "../../lib/gui";

import LineWithIcon from './LineWithIcon';

var {width, height} = Dimensions.get('window');

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


class Profile extends Component {
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
    Actions.Topup_SMS();
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
                Trần Việt Anh
              </Text>
            </View>
            <TruliaIcon onPress={this._onBack.bind(this)}
                        name="arrow-left" color={'white'} size={25}
                        mainProps={myStyles.backButton} text={this.props.backTitle}
                        textProps={myStyles.backButtonText}>
            </TruliaIcon>
            <View style={myStyles.changeButton}>
              <Text style={[myStyles.customPageTitleText,{textAlign:'right'}]}>
                Thay đổi
              </Text>
            </View>
          </View>

          <View >
            <View style={myStyles.contentGroupTitle}>
              <Text style={myStyles.contetnGroupTitleText}>THÔNG TIN LIÊN LẠC</Text>
            </View>

            <View style={myStyles.searchDetailRowAlign}>
              <Text style={[myStyles.contentLable]}>
                Tên đầy đủ
              </Text>

              <TextInput style={[myStyles.contentText]}>
                Trần Việt Anh
              </TextInput>
            </View>

            <View style={[myStyles.lineBorder, {marginBottom: 4}]} />

            <View style={myStyles.searchDetailRowAlign}>
              <Text style={[myStyles.contentLable]}>
                Số điện thoại
              </Text>

              <Text style={[myStyles.contentText]}>
                090658555
              </Text>
            </View>

            <View style={[myStyles.lineBorder, {marginBottom: 4}]} />

            <View style={myStyles.searchDetailRowAlign}>
              <Text style={[myStyles.contentLable]}>
                Email
              </Text>

              <Text style={[myStyles.contentText]}>
                tranvietanh83@gmail.com
              </Text>
            </View>

            <View style={myStyles.contentGroupTitle}>
              <Text style={myStyles.contetnGroupTitleText}></Text>
            </View>

            <View style={myStyles.searchDetailRowAlign}>
              <Text style={[myStyles.contentLable]}>
                Thay đổi mật khẩu
              </Text>

              <Text style={[myStyles.contentText]}>
                ****
              </Text>
            </View>

            <View style={myStyles.contentGroupTitle}>
              <Text style={myStyles.contetnGroupTitleText}>THÔNG TIN CÁ NHÂN</Text>
            </View>

            <View style={myStyles.searchDetailRowAlign}>
              <Text style={[myStyles.contentLable]}>
                Giới tinh
              </Text>

              <Text style={[myStyles.contentText]}>
                Nam
              </Text>
            </View>

            <View style={[myStyles.lineBorder, {marginBottom: 4}]} />

            <View style={myStyles.searchDetailRowAlign}>
              <Text style={[myStyles.contentLable]}>
                Ngày sinh
              </Text>

              <Text style={[myStyles.contentText]}>
                11/11/1980
              </Text>
            </View>

            <View style={myStyles.contentGroupTitle}>
              <Text style={myStyles.contetnGroupTitleText}>THÔNG TIN TÀI KHOẢN</Text>
            </View>



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

  lineWithIconStyle : {
    borderTopColor: '#ebebeb',
    borderBottomColor: '#ebebeb',
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: 'transparent'
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
  changeButton: {
    left: 36,
    right: 36,
    marginTop: 31,
    marginBottom: 10,
    position: 'absolute'
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
  contentGroupTitle: {
    flex: 1,
    height: 30,
    paddingLeft: 5,
    justifyContent: 'center',
    backgroundColor: '#f6f6f6'
  },
  contetnGroupTitleText: {
    fontSize: 14,
    fontFamily: gui.fontFamily,
    fontWeight: 'bold',
    color: '#8A8A8A',
    paddingLeft: 5
  },
  lineBorder: {
    borderTopWidth: 1,
    borderTopColor: 'lightgray',
    width: width,
    marginLeft: 0,
    marginRight: 0,
    paddingLeft: 5
  },
  searchDetailRowAlign: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'white'
  },
  contentLable: {
    textAlign: 'left',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    fontSize: 14,
    marginLeft: 5,
    fontWeight: 'bold',
    fontFamily: gui.fontFamily,
    color: 'black',
    width: width/2-60
  },
  contentText: {
    textAlign: 'left',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
    fontSize: 14,
    fontFamily: gui.fontFamily,
    color: 'black',
    marginTop: 3,
    marginBottom: 2,
    marginLeft: 10,
    marginRight: 9.5,
    width: width/2-19
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);

