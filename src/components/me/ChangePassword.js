'use strict';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as globalActions from '../../reducers/global/globalActions';
import * as meActions from '../../reducers/me/meActions';
import * as authActions from '../../reducers/auth/authActions';

import React, {Component} from 'react';

import {Text, View, StyleSheet, ScrollView, Alert,
    TextInput, StatusBar, Dimensions, TouchableOpacity } from 'react-native'

import TruliaIcon from '../TruliaIcon';

import {Map} from 'immutable';
import {Actions} from 'react-native-router-flux';
import gui from "../../lib/gui";

var {width} = Dimensions.get('window');

var _ = require('lodash');

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


class ChangePassword extends Component {
  constructor(props) {
    super(props);
    StatusBar.setBarStyle('light-content');
    
    this.state = {
      password: null,
      newPassword: null,
      retypeNewPassword:null
    }
  }

  render() {
    return (

        <View style={style.container}>

          {this._renderHeader()}
          <ScrollView ref={(scrollView) => { this._scrollView = scrollView; }}
            >
          <View style = {{flexDirection: 'column', flex:1}}>

            {this._renderOldPassword()}
            <View style={[style.line]} />

            {this._renderNewPassword()}
            <View style={[style.line]} />

            {this._renderRetypeNewPassword()}

            {this._renderThucHienButton()}

          </View>
          </ScrollView>
        </View>
    )
  }

  _onBack() {
    Actions.pop();
  }

  _onApply(){
    console.log("Thay đổi mật khẩu");
    if (!this.validate()){
        return;
    }

    let dto = {
        password: this.state.password,
        newPassword: this.state.newPassword
    }

    let token = this.props.global.currentUser.token;

    this.props.actions.changePassword(dto, token).then(
        (res) => {
            if (res.success){
                Alert.alert("Bạn đổi mật khẩu thành công!");
                this.props.actions.logout();
                Actions.pop();
                Actions.pop();
            } else {
                Alert.alert(res.msg);
            }
        }
    ). catch((res) => {
        Alert.alert(res.toString());
    });
  }

  validate(){
      let {password, newPassword, retypeNewPassword} = this.state;

      console.log(password + "-" + newPassword + "-" + retypeNewPassword);
      if (_.isNull(password)){
          Alert.alert("Bạn chưa nhập mật khẩu cũ");
          return false;
      }

      if (_.isNull(newPassword) || _.isNull(retypeNewPassword)){
          Alert.alert("Bạn chưa nhập mật khẩu mới");
          return false;
      }

      if (newPassword != retypeNewPassword){
          Alert.alert("Mật khẩu mới và nhập lại mật khẩu mới không trùng nhau");
          return false;
      }

      return true;
  }

  _renderHeader(){
    return (
        <View style={style.headerContainer}>
          <TruliaIcon onPress={this._onBack.bind(this)}
                      name="arrow-left" color={'white'} size={25}
                      mainProps={style.backButton} text={this.props.backTitle}
                      textProps={style.backButtonText}>
          </TruliaIcon>

          <View style={style.headerTitle}>
            <Text style={style.headerTitleText}>
              Thay đổi mật khẩu
            </Text>
          </View>
        </View>
    );
  }

  _renderOldPassword(){
    return (
        <View style={style.rowContainer}>

          <Text style={[style.contentLabel]}>
            Mật khẩu cũ
          </Text>

          <TextInput
              secureTextEntry={true}
              autoCapitalize = {'none'}
              autoCorrect = {false}
              style={style.contentText}
              onChangeText={(text) => {this.setState({password:text})}}
          />

        </View>
    );
  }

  _renderNewPassword(){
    return (
        <View style={style.rowContainer}>
          <Text style={[style.contentLabel]}>
            Mật khẩu mới
          </Text>

          <TextInput
              secureTextEntry={true}
              autoCapitalize = {'none'}
              autoCorrect = {false}
              style={style.contentText}
              onChangeText={(text) => {this.setState({newPassword:text})}}
          />
        </View>
    );
  }

  _renderRetypeNewPassword(){
    return (
        <View style={style.rowContainer}>
          <Text style={[style.contentLabel]}>
            Nhập lại
          </Text>

          <TextInput
              secureTextEntry={true}
              autoCapitalize = {'none'}
              autoCorrect = {false}
              style={style.contentText}
              onChangeText={(text) => {this.setState({retypeNewPassword:text})}}
          />
        </View>
    );
  }

  _renderThucHienButton(){
    return (
        <View style = {{alignItems:'center', marginTop: 10}}>
            <View style={style.button}>
                <TouchableOpacity onPress={() => this._onApply()}>
                    <Text style={style.buttonLabel}>
                        Xong
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
  }

}

/**
 * ## Styles
 */
var style = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    backgroundColor: 'transparent'
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    backgroundColor: gui.mainColor,
    top: 0,
    height: 60
  },
  headerTitle: {
    left: 36,
    right: 36,
    marginTop: 30,
    marginBottom: 10,
    position: 'absolute'
  },
  headerTitleText: {
    color: 'white',
    fontSize: gui.normalFontSize,
    fontWeight: 'bold',
    fontFamily: gui.fontFamily,
    textAlign: 'center'
  },
  changeButton: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: 80,
    right: 15,
    marginTop: 30,
    marginBottom: 10,
    position: 'absolute'
  },
  backButton: {
    marginTop: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    paddingLeft: 15,
    paddingRight: 15
  },
  backButtonText: {
    color: 'white',
    fontSize: gui.normalFontSize,
    fontFamily: gui.fontFamily,
    textAlign: 'left',
    marginLeft: 7
  },
  label: {
    fontSize: 14,
    fontFamily: gui.fontFamily,
    paddingRight: 5,
    color: '#8A8A8A'
  },
  normalFont: {
    fontSize: 14,
    fontFamily: gui.fontFamily,
    color: '#8A8A8A'
  },
  contentGroupTitle: {
    flexDirection : "row",
    justifyContent :'space-between',
    paddingRight: 15,
    paddingLeft: 15,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: '#f8f8f8'
  },
  contentGroupTitleText: {
    fontSize: 12,
    fontFamily: gui.fontFamily,
    color: '#606060',
    justifyContent :'space-between',
    padding: 0
  },
  line: {
    backgroundColor: 'lightgray',
    height: 1,
    marginLeft: 15
  },
  fullLine: {
    backgroundColor: 'lightgray',
    height: 1
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 15
  },
  contentLabel: {
    textAlign: 'left',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    fontSize: 14,
    fontFamily: gui.fontFamily,
    color: 'black',
    width: 100
  },
  contentText: {
    textAlign: 'left',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
    fontSize: 14,
    fontFamily: gui.fontFamily,
    color: '#8A8A8A',
    height: 30,
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 5,
    marginLeft: 10,
    width: width-140,
    paddingLeft: 5,
    paddingRight: 5
  },
  button: {
     justifyContent: 'center',
     alignItems: 'center',
     backgroundColor: '#fa4916',
     height: 30,
     borderRadius: 5,
     width: width-30
  },
  buttonLabel: {
    textAlign: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: gui.fontFamily
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);

