'use strict';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as globalActions from '../../reducers/global/globalActions';
import * as meActions from '../../reducers/me/meActions';

import React, {Component} from 'react';

import {Text, View, StyleSheet, TextInput, StatusBar, Dimensions, TouchableHighlight, TouchableOpacity} from 'react-native'

import TruliaIcon from '../TruliaIcon';

import {Map} from 'immutable';
import {Actions} from 'react-native-router-flux';
import log from "../../lib/logUtil";
import gui from "../../lib/gui";

import LineWithIcon from './LineWithIcon';

import LikeTabButton from "../LikeTabButton";

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


class Topup_Scratch extends Component {
  constructor(props) {
    super(props);
    StatusBar.setBarStyle('light-content');
  }

  _onScratchTypeChange(val) {
    this.props.actions.onTopupScratchFieldChange('type',val);
  }

  _submit() {
    alert("Coming soon!")
  }

  render() {
    log.info("this.props.me==", this.props.me);
    let main = this.props.global.currentUser.mainAccount;
    let scratchType = this.props.me.topup.scratch.type;

    return (
      <View style={myStyles.container}>
        <View style={myStyles.customPageHeader}>
          <View style={myStyles.customPageTitle}>
            <Text style={myStyles.customPageTitleText}>
              Nạp thẻ cào điện thoại
            </Text>
          </View>
          <TruliaIcon onPress={this._onBack.bind(this)}
                      name="arrow-left" color={'white'} size={25}
                      mainProps={myStyles.backButton} text={this.props.backTitle}
                      textProps={myStyles.backButtonText}>
          </TruliaIcon>
        </View>

        <View >
          <View style = {{flex:1, flexDirection: 'row', paddingLeft: 5, paddingRight: 5}}>
            <LikeTabButton name={'Mobifone'}
                           onPress={() => this._onScratchTypeChange('Mobifone')}
                           selected={scratchType === 'Mobifone'}>MOBIFONE</LikeTabButton>
            <LikeTabButton name={'Viettel'}
                           onPress={() => this._onScratchTypeChange('Viettel')}
                           selected={scratchType === 'Viettel'}>VIETTEL</LikeTabButton>

            <LikeTabButton name={'Vinaphone'}
                           onPress={() => this._onScratchTypeChange('Vinaphone')}
                           selected={scratchType === 'Vinaphone'}>VINAPHONE</LikeTabButton>
          </View>
          <View style={myStyles.titleContainer}>
            <Text style={myStyles.title}>NHẬP MÃ SỐ THẺ CÀO</Text>
          </View>

          <TextInput style={myStyles.input} placeholder="Mã số thẻ cào"
                     selectTextOnFocus={true}
                     value={this.props.me.topup.scratch.pin}
                     onChangeText={(text) => {
                       this.props.actions.onTopupScratchFieldChange('pin',text)
                     }}
          />

          <View style={myStyles.titleContainer}>
            <Text style={myStyles.title}>NHẬP SỐ SERIAL</Text>
          </View>

          <TextInput style={myStyles.input} placeholder="Số serial"
                     value={this.props.me.topup.scratch.serial}
                     onChangeText={(text) => {
                       this.props.actions.onTopupScratchFieldChange('serial',text)
                     }}
          />

          <View style={myStyles.titleContainer}>
            <Text style={myStyles.introText}>Số tiền ghi có trong tk chính là 60k</Text>
            <Text style={myStyles.introText}>Số tiền ghi có trong tk KM là 10k</Text>
          </View>

          <TouchableOpacity style={myStyles.napTheBtn} onPress={this._submit}>
            <Text style={myStyles.napTheBtnText}>Nạp thẻ</Text>
          </TouchableOpacity>

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
  titleContainer : {
    borderTopColor: '#e6e6e6',
    borderBottomColor: '#e6e6e6',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    justifyContent : "center",
  },

  title: {
    fontSize: 13,
    fontFamily: gui.fontFamily,
    color: '#8A8A8A',
    paddingTop: 8,
    paddingLeft: 19,
    paddingBottom: 8,
  },

  introText: {
    fontSize: 14,
    fontFamily: gui.fontFamily,
    color: '#8A8A8A',
    paddingLeft: 19,
    paddingRight: 19,
    paddingTop: 10,
    paddingBottom: 10
  },

  input : {
    fontSize: 14,
    fontFamily: 'Open Sans',
    padding: 10,
    paddingLeft: 17,
    paddingRight: 17,
    color: '#686868',
    fontWeight : 'normal',
    height: 36,
    backgroundColor:"white",
  },

  napTheBtn : {
    alignItems: 'center',
    backgroundColor: "white",
    borderBottomColor: '#e6e6e6',
    borderBottomWidth: 1,
  },
  napTheBtnText : {
    color: "#ff000b",
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 16,
    fontFamily: 'Open Sans',
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Topup_Scratch);

