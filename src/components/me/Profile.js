'use strict';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as globalActions from '../../reducers/global/globalActions';
import * as meActions from '../../reducers/me/meActions';

import React, {Component} from 'react';

import {Text, View, StyleSheet, PixelRatio, ScrollView,
    TextInput, StatusBar, Dimensions, TouchableHighlight} from 'react-native'

import TruliaIcon from '../TruliaIcon';

import {Map} from 'immutable';
import {Actions} from 'react-native-router-flux';
import gui from "../../lib/gui";
import util from "../../lib/utils";
import CollapsiblePanel from '../CollapsiblePanel';
import MChartView from '../MChartView';

var {width, height} = Dimensions.get('window');

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


class Profile extends Component {
  constructor(props) {
    super(props);
    StatusBar.setBarStyle('light-content');
  }

  render() {

    let currentUser = this.props.global.currentUser;

    return (

        <View style={style.container}>

          {this._renderHeader()}
          <ScrollView>
          <View style = {{flexDirection: 'column', flex:1}}>

            {this._renderContentGroupTitle('THÔNG TIN LIÊN LẠC')}

            {this._renderTenDayDu()}
            <View style={[style.line]} />

            {this._renderSoDienThoai()}
            <View style={[style.line]} />

            {this._renderEmail()}
            <View style={[style.line]} />

            {this._renderWebsite()}
            <View style={[style.line]} />

            {this._renderGioiThieu()}

            {this._renderContentGroupTitle('')}

            {this._renderDoiMatKhau()}

            {this._renderContentGroupTitle('THÔNG TIN CÁ NHÂN')}

            {this._renderGioiTinh()}
            <View style={[style.line]} />

            {this._renderNgaySinh()}
            <View style={[style.line]} />

            {this._renderDiaChi()}
            <View style={[style.line]} />

            {this._renderMoiGioi()}

            {this._renderContentGroupTitle('THÔNG TIN TÀI KHOẢN')}

            {this._renderThongTinTaiKhoan()}
          </View>
          </ScrollView>
        </View>
    )
  }

  _onBack() {
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
              Trần Việt Anh
            </Text>
          </View>

          <View style={style.changeButton}>
            <Text style={[style.headerTitleText,{textAlign:'right'}]}>
              Thay đổi
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

  _renderTenDayDu(){
    return (
        <View style={style.rowContainer}>
          <Text style={[style.contentLabel]}>
            Tên đầy đủ
          </Text>

          <TextInput
              secureTextEntry={false}
              style={style.contentText}
              value={'Trần Việt Anh'}
              onChangeText={(text) => this.onValueChange("fullName", text)}
          />
        </View>
    );
  }

  _renderSoDienThoai(){
    return (
        <View style={style.rowContainer}>
          <Text style={[style.contentLabel]}>
            Số điện thoại
          </Text>

          <TextInput
              secureTextEntry={false}
              style={style.contentText}
              value={'0906508555'}
              onChangeText={(text) => this.onValueChange("phone", text)}
          />
        </View>
    );
  }

  _renderEmail(){
    return (
        <View style={style.rowContainer}>
          <Text style={[style.contentLabel]}>
            Email
          </Text>

          <TextInput
              secureTextEntry={false}
              style={style.contentText}
              value={'tranvietanh83@gmail.com'}
              onChangeText={(text) => this.onValueChange("email", text)}
          />
        </View>
    );
  }

  _renderWebsite(){
    return (
        <View style={style.rowContainer}>
          <Text style={[style.contentLabel]}>
            Website
          </Text>

          <TextInput
              secureTextEntry={false}
              style={style.contentText}
              value={'landber.com'}
              onChangeText={(text) => this.onValueChange("website", text)}
          />
        </View>
    );
  }

  _renderGioiThieu(){
    return (
        <View style={style.rowContainer}>
          <Text style={[style.contentLabel]}>
            Giới thiệu
          </Text>

          <TextInput
              secureTextEntry={false}
              multiline = {true}
              numberOfLines = {5}
              style={[style.contentText, {borderColor: 'lightgray', borderWidth: 1, height: 100}]}
              value={''}
              onChangeText={(text) => this.onValueChange("gioiThieu", text)}
          />
        </View>
    );
  }

  _renderDoiMatKhau(){
    return (
      <TouchableHighlight>
        <View style={style.rowIconContainer}>
            <Text style={[style.contentLabel, {width: 150}]}>
              Thay đổi mật khẩu
            </Text>
            <View style={style.arrowIcon}>
              <Text style={style.label}> </Text>
              <TruliaIcon name={"arrow-right"} color={gui.arrowColor} size={18} />
            </View>
        </View>
      </TouchableHighlight>
    );
  }

  _renderGioiTinh(){
    return (
        <TouchableHighlight>
          <View style={style.rowIconContainer}>
            <Text style={[style.contentLabel]}>
              Giới tính
            </Text>
            <View style={style.arrowIcon}>
              <Text style={style.label}>Nam</Text>
              <TruliaIcon name={"arrow-right"} color={gui.arrowColor} size={18} />
            </View>
          </View>
        </TouchableHighlight>
    );
  }

  _renderNgaySinh(){
    return (
        <TouchableHighlight>
          <View style={style.rowIconContainer}>
            <Text style={[style.contentLabel]}>
              Ngày sinh
            </Text>
            <View style={style.arrowIcon}>
              <Text style={style.label}>11/11/1982</Text>
              <TruliaIcon name={"arrow-down"} color={gui.arrowColor} size={18} />
            </View>
          </View>
        </TouchableHighlight>
    );
  }

  _renderDiaChi(){
    return (
        <TouchableHighlight>
          <View style={style.rowIconContainer}>
            <Text style={[style.contentLabel]}>
              Địa chỉ
            </Text>
            <View style={style.arrowIcon}>
              <Text style={style.label}>KĐT Xala, Hà Đông</Text>
              <TruliaIcon name={"arrow-right"} color={gui.arrowColor} size={18} />
            </View>
          </View>
        </TouchableHighlight>
    );
  }

  _renderMoiGioi(){
    return (
        <TouchableHighlight>
          <View style={style.rowIconContainer}>
            <Text style={[style.contentLabel, {width: 150}]}>
              Vai trò của bạn
            </Text>
            <View style={style.arrowIcon}>
              <Text style={style.label}>Môi giới</Text>
              <TruliaIcon name={"arrow-right"} color={gui.arrowColor} size={18} />
            </View>
          </View>
        </TouchableHighlight>
    );
  }

  _renderThongTinTaiKhoan() {
    var data = [{
      "name": "",
      "fillColor" : gui.mainColor,
      "value": 400
    }, {
      "name": "",
      "fillColor" : "#DE6207",
      "value": 100
    }];
    var pallete = [
      util.hexToRgb(gui.mainColor), util.hexToRgb("#EA9409")
    ];
    var options = {
      margin: {
        top: 1,
        left: 2,
        bottom: 1,
        right: 2
      },
      width: 126,
      height: 126,
      r: 46,
      R: 61,
      legendPosition: 'topLeft',
      animate: {
        type: 'oneByOne',
        duration: 200,
        fillTransition: 3
      },
      label: {
        fontFamily: gui.fontFamily,
        fontSize: gui.buttonFontSize,
        fontWeight: 'normal'
      }
    };
    var chartTitleBold = '500K';
    var chartTitle = 'Tổng tài khoản';

    return (
        <View>
            <View style={{flexDirection: "row", alignItems: 'center', justifyContent: 'flex-start', backgroundColor:'white', paddingTop:0}}>
              <View style={{paddingLeft: 13, paddingTop:2, width: width/2-25, alignItems: 'center', justifyContent: 'center'}}>
                <MChartView
                    data={data}
                    options={options}
                    pallete={pallete}
                    chartTitle={chartTitle}
                    chartTitleBold={chartTitleBold}
                />
              </View>
              <View style={{paddingLeft: 0, paddingTop:2}}>
                {this._renderMoneyLine("Tài khoản chính", '400K', gui.mainColor)}
                {this._renderMoneyLine("Tiền khoản Khuyến mãi", '100K', '#EA9409')}
              </View>
            </View>
            <Text style={{fontSize: 5}} />

          {/*<View style={detailStyles.lineBorder2} />*/}
        </View>
    );
  }

  _renderMoneyLine(label, value, dotColor) {
    return (
        <View style={{flexDirection:'row'}}>
          <View style={[style.dot3, {borderColor: dotColor}]}>
          </View>
          <View style={{flexDirection:'column', marginTop: 8, marginBottom: 8}}>
            <Text style={{fontSize: 13, fontFamily: gui.fontFamily, fontWeight: 'bold'}}>
              {value}
            </Text>
            <Text style={{fontSize: 12, fontFamily: gui.fontFamily, color: '#9C9C9C'}}>
              {label}
            </Text>
          </View>
        </View>
    )
  }


  onValueChange(field, value){
    //todo: need to implement
    this.props.actions.onProfileFieldChange(field, value);
    console.log("Need to implement method Profile.onValueChange");
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
    fontSize: 14,
    fontWeight: 'bold',
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
    marginLeft: 10,
    width: width-150
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
    paddingRight: 15
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
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);

