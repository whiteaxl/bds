'use strict';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as globalActions from '../../reducers/global/globalActions';

import React, {Component} from 'react';

import {Text, View, StyleSheet, PixelRatio, ScrollView, Image, Alert,
    TextInput, StatusBar, Dimensions, TouchableOpacity, TouchableHighlight,
    DatePickerIOS, Switch } from 'react-native'

import TruliaIcon from '../TruliaIcon';

import {Map} from 'immutable';
import {Actions} from 'react-native-router-flux';
import gui from "../../lib/gui";

var {width, height} = Dimensions.get('window');

const actions = [
  globalActions
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


class Setting extends Component {
  constructor(props) {
    super(props);
    StatusBar.setBarStyle('light-content');
  }

  render() {
    return (

        <View style={style.container}>

          {this._renderHeader()}
          <ScrollView ref={(scrollView) => { this._scrollView = scrollView; }}
            >
          <View style = {{flexDirection: 'column', flex:1}}>

            {this._renderContentGroupTitle('KẾT QUẢ TÌM KIẾM')}

            {this._renderSoKetQuaTrenBanDo()}
            <View style={[style.line]} />

            {this._renderAutoLoadAds()}

          </View>
          </ScrollView>
        </View>
    )
  }

  _onBack() {
    this.props.actions.updateLocalSetting(this.props.global.setting);
    Actions.pop();
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
                Cài đặt
            </Text>
          </View>
        </View>
    );
  }

  _renderContentGroupTitle(title){
    return (
      <View style={style.contentGroupTitle}>
        <Text style={style.contentGroupTitleText}>{title}</Text>
      </View>
    );
  }

  _renderSoKetQuaTrenBanDo(){
    return (
        <View style={style.rowContainer}>
          <View style={{flexDirection: 'column'}}>
            <Text style={[style.contentLabel]}>
               Số kết quả hiển thị trên bản đồ
            </Text>
            <Text style={[style.noteLabel]}>
               Từ 10-50
            </Text>
          </View>

          <TextInput
              secureTextEntry={false}
              autoCorrect = {false}
              keyboardType="numeric"
              style={[style.contentText]}
              value={this._getMaxAdsInMapView()}
              onChangeText={(text) => this.onValueChange("maxAdsInMapView", text)}
          />

        </View>
    );
  }

  _renderAutoLoadAds(){
     return (
         <View style={style.rowIconContainer}>
             <Text style={[style.contentLabel]}>
                 Cập nhật kết quả khi bản đồ di chuyển
             </Text>
             <View style={style.arrowIcon}>
                 <Switch
                     onValueChange={(value) => this.onValueChange('autoLoadAds', value)}
                     value={this._getAutoLoadAds()} />
             </View>
         </View>
        );
  }

  onMaxAdsInMapViewChange(field, text){
     this.onValueChange(field, Number(text));
  }

  onValueChange(field, value){
    this.props.actions.onSettingFieldChange(field, value);
  }

  _getMaxAdsInMapView(){
    let maxAdsInMapView = this.props.global.setting.maxAdsInMapView;
    return maxAdsInMapView ? maxAdsInMapView.toString() : '25';
  }

  _getAutoLoadAds(){
    return this.props.global.setting.autoLoadAds;
  }
}

/**
 * ## Styles
 */
var style = StyleSheet.create({

  lineWithIconStyle : {
    borderTopColor: '#ebebeb',
    borderBottomColor: '#ebebeb',
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
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
    marginTop: 6,
    marginBottom: 6,
    paddingLeft: 15
  },
  contentLabel: {
    textAlign: 'left',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    fontSize: gui.normalFontSize,
    fontFamily: gui.fontFamily,
    color: 'black',
    width: width-100
  },
  noteLabel: {
    textAlign: 'left',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    fontSize: 12,
    fontFamily: gui.fontFamily,
    color: 'gray',
    width: width-100,
    marginRight: 15
  },
  contentText: {
    textAlign: 'center',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
    fontSize: 14,
    fontFamily: gui.fontFamily,
    color: '#8A8A8A',
    marginLeft: 10,
    width: 50,
    height: 25,
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'lightgray'
  },
  rowIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    marginTop: 6,
    marginBottom: 6,
    paddingLeft: 15
  },
  arrowIcon: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: 'center',
    marginRight: 10
  },
  textFullWidth: {
    textAlign: 'left',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
    fontSize: 14,
    fontFamily: gui.fontFamily,
    color: 'black',
    marginTop: 8,
    marginBottom: 7,
    marginLeft: 0,
    marginRight: 0,
  },
  dot3 : {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 14,
    marginTop: 18,
    backgroundColor: 'white',
    borderWidth: 3.5
  },
  avatarIcon : {
    height: 60,
    width: 60,
    borderRadius: 30
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Setting);

