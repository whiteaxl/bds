'use strict';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as globalActions from '../../reducers/global/globalActions';
import * as meActions from '../../reducers/me/meActions';
import * as authActions from '../../reducers/auth/authActions';


import {Map} from 'immutable';

import React, {Component} from 'react';
import TruliaIcon from '../../components/TruliaIcon'

import {
  Text, View, Image, ListView, Dimensions, StatusBar
  , RecyclerViewBackedScrollView, TouchableHighlight, StyleSheet
  , Alert, RefreshControl, ScrollView, TouchableOpacity
} from 'react-native'

import {Actions} from 'react-native-router-flux';

import gui from '../../lib/gui';

import LineWithIcon from "./LineWithIcon";

import log from '../../lib/logUtil';

const actions = [
  globalActions,
  meActions,
  authActions
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

class MeContent extends Component {
  constructor(props) {
    super(props);
    StatusBar.setBarStyle('light-content');
  }

  _onProfile() {
    let currentUser = this.props.global.currentUser;
    this.props.actions.profile(currentUser.userID, currentUser.token).then(
        (res) => {
          if (res.success){
            Actions.Profile();
          } else {
            Alert.alert("Tải thông tin cá nhân không thành công");
          }
        }
    );
  }

  _onLogout() {
    this.props.actions.logout();
  }

  _onTopup() {
    Actions.Topup();
  }

  render() {
    log.info("Call MeContent render, currentUser:", this.props.global.currentUser);
    let avatarUri = this.props.global.currentUser.avatar ? {uri: this.props.global.currentUser.avatar} :
        require('../../assets/image/register_avatar_icon.png');
    return (
      <ScrollView style={styles.fullWidthContainer}>
        <TouchableOpacity onPress={this._onProfile.bind(this)}>
          <View style={styles.settingLine}>
            <Image
              style={styles.avatarIcon}
              resizeMode={Image.resizeMode.cover}
              source={avatarUri}
            />

            <View style={styles.profileLabel}>
              <Text style={styles.lineLabel}>
                {this.props.global.currentUser.fullName}
              </Text>
              <Text style={styles.lineSmall}>
                {this.props.global.currentUser.phone}
              </Text>
              <Text style={styles.lineSmall}>
                {this.props.global.currentUser.email}
              </Text>
            </View>

            <View style={styles.rightIcon}>
              <TruliaIcon name="arrow-right" color={gui.arrowColor} size={18} />
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.boxSeparator}><Text/></View>

        <LineWithIcon iconSource = {require('../../assets/image/me/me_napTien.png')}
                      title = "Nạp tiền" />
        <View style={styles.lineSeparator}><Text/></View>
        <LineWithIcon iconSource = {require('../../assets/image/me/me_lichSu.png')}
                      title = "Lịch sử giao dịch" />

        <View style={styles.boxSeparator}><Text/></View>

        <LineWithIcon iconSource = {require('../../assets/image/me/me_goiDv.png')}
                      title = "Thông tin các gói dịch vụ" />

        <View style={styles.boxSeparator}><Text/></View>

        <LineWithIcon iconSource = {require('../../assets/image/me/me_help.png')}
                      title = "Trợ giúp" />
        <View style={styles.lineSeparator}><Text/></View>
        <LineWithIcon iconSource = {require('../../assets/image/me/me_setting.png')}
                      title = "Cài đặt" />
        <View style={styles.boxSeparator}><Text/></View>

        <TouchableOpacity onPress={this._onLogout.bind(this)}>
          <View style={styles.logoutLine}>
            <Text style={styles.logoutText}>Đăng xuất</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    )
  }

  coming() {
    Alert.alert("Coming soon...");
  }
}

var styles = StyleSheet.create({
  fullWidthContainer: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },

  settingLine: {
    flexDirection : "row",
    flex: 1,
    paddingTop: 15,
    paddingLeft: 17,
    paddingRight: 19,
    paddingBottom: 13,
    borderTopWidth: 1,
    borderTopColor: gui.separatorLine,
    alignItems:'center',
    backgroundColor : 'white'
  },

  logoutLine : {
    flexDirection : "row",
    flex: 1,
    paddingLeft: 17,
    paddingRight: 19,
    justifyContent:'center',
    backgroundColor : 'white',
    alignItems: 'center',
    height: 45,
    borderBottomWidth: 1,
    borderColor: gui.separatorLine,
  },

  profileLabel : {
    paddingLeft : 16
  },

  lineLabel : {
    fontSize: 17,
    fontFamily: 'Open Sans',
    color: 'black',
    fontWeight: 'normal',

  },

  logoutText : {
    fontSize: 17,
    fontFamily: 'Open Sans',
    color: 'red',
    fontWeight: 'normal',

  },


  lineSmall : {
    fontSize: 12,
    fontFamily: 'Open Sans',
    color: 'gray',
    fontWeight: 'normal',

  },

  avatarIcon : {
    height: 60,
    width: 60,
    borderRadius: 30
  },

  rightIcon : {
    right : 1,
    flex : 1,
    alignItems:"flex-end"
  },
  boxSeparator : {
    height: 36,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: gui.separatorLine
  },

  lineSeparator : {
    height: 1,
    borderTopWidth: 1,
    borderColor: gui.separatorLine,
    marginLeft: 63
  },

});

export default connect(mapStateToProps, mapDispatchToProps)(MeContent);
