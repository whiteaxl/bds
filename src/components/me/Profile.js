'use strict';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as globalActions from '../../reducers/global/globalActions';
import * as meActions from '../../reducers/me/meActions';
import GiftedSpinner from 'react-native-gifted-spinner';

import React, {Component} from 'react';

import {Text, View, StyleSheet, PixelRatio, ScrollView, Image, Alert,
    TextInput, StatusBar, Dimensions, TouchableHighlight, DatePickerIOS } from 'react-native'

import TruliaIcon from '../TruliaIcon';

import {Map} from 'immutable';
import {Actions} from 'react-native-router-flux';
import gui from "../../lib/gui";
import util from "../../lib/utils";
import MChartView from '../MChartView';
import moment from 'moment';

import DanhMuc from '../../assets/DanhMuc';

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
    let currentUser = this.props.global.currentUser;
    this.props.actions.profile(currentUser.userID, currentUser.token);

    let date = this.props.me.profile.date ? this.props.me.profile.date : new Date();

    this.state = {
      date: date,
      timeZoneOffsetInHours: (+7) * (date).getTimezoneOffset() / 60,
      showNgaySinhPicker:false
    }
  }

  render() {
    return (

        <View style={style.container}>

          {this._renderHeader()}
          <ScrollView ref={(scrollView) => { this._scrollView = scrollView; }}
            >
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

            <View style={[style.line]} />
            {this._renderPhoto()}

            {this._renderContentGroupTitle('')}

            {this._renderDoiMatKhau()}

            {this._renderContentGroupTitle('THÔNG TIN CÁ NHÂN')}

            {this._renderGioiTinh()}
            <View style={[style.line]} />

            {this._renderNgaySinh()}
            {this._renderNgaySinhPicker()}
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

  validateData(profile){
    if (!profile.phone && !profile.email){
      Alert.alert("Số điện thoại và email không được phép rỗng đồng thời");
      return false;
    }

    if (profile.email && profile.email.indexOf('@')==-1){
      Alert.alert("Email không đúng định dạng");
      return false;
    }

    return true;
  }

  _onApply(){
    let profile = this.props.me.profile;

    if (!this.validateData(profile))
        return;

    let dto = {
      userID: profile.userID,
      fullName : profile.fullName,
      email : profile.email||undefined,
      phone : profile.phone||undefined,
      diaChi : profile.diaChi||undefined,
      gioiThieu: profile.gioiThieu||undefined,
      avatar : profile.avatar||undefined,
      sex: profile.sex||'U', // F, M, U
      birthDate: profile.birthDate||undefined, // date type
      website: profile.website||undefined,
      broker: profile.broker||'U'
    }

    let token = this.props.global.currentUser.token;
    this.props.actions.updateProfile(dto, token).then(
        (res) =>{
          if (res.success){
            Alert.alert("Cập nhật thông tin cá nhân thành công");
            Actions.pop();
          } else {
            Alert.alert(res.msg);
          }
        }
    ). catch((res) => {
      Alert.alert(res.toString());
    })

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
          <TouchableHighlight onPress={() => this._onApply()}>
            <View style={style.changeButton}>
              {this._renderLoadingView()}
              <Text style={[style.headerTitleText,{marginLeft:5, textAlign:'right'}]}>
                Thay đổi
              </Text>
            </View>
          </TouchableHighlight>
        </View>
    );
  }

  _renderLoadingView(){
      if (!this.props.me.isUpdatingProfile){
          return <View />
      }
      return (
          <GiftedSpinner size="small" color="white" />
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
              autoCorrect = {false}
              style={style.contentText}
              value={this._getFullName()}
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
              editable={false}
              secureTextEntry={false}
              autoCorrect = {false}
              keyboardType="numeric"
              style={style.contentText}
              value={this._getSoDienThoai()}
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
              autoCapitalize = {'none'}
              autoCorrect = {false}
              style={style.contentText}
              value={this._getEmail()}
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
              autoCapitalize = {'none'}
              autoCorrect = {false}
              style={style.contentText}
              value={this._getWebsite()}
              onChangeText={(text) => this.onValueChange("website", text)}
          />
        </View>
    );
  }

  _renderPhoto(){
    let avatarUri = this.props.global.currentUser.avatar ? {uri: this.props.global.currentUser.avatar} :
        require('../../assets/image/register_avatar_icon.png');

    return (
        <View style={style.rowContainer}>
          <Text style={[style.contentLabel]}>
            Ảnh
          </Text>
          <Image
              style={style.avatarIcon}
              resizeMode={Image.resizeMode.cover}
              source={avatarUri}
          />
          <Text style={style.contentText}>
          Chạm để thay đổi ảnh
          </Text>
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
              value={this._getGioiThieu()}
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
        <TouchableHighlight onPress={() => this._onGioiTinhPressed()}>
          <View style={style.rowIconContainer}>
            <Text style={[style.contentLabel]}>
              Giới tính
            </Text>
            <View style={style.arrowIcon}>
              <Text style={style.label}>{this._getGioiTinh()}</Text>
              <TruliaIcon name={"arrow-right"} color={gui.arrowColor} size={18} />
            </View>
          </View>
        </TouchableHighlight>
    );
  }

  _renderNgaySinh(){
    return (
        <TouchableHighlight onPress={() => this._onNgaySinhPressed()}>
          <View style={style.rowIconContainer}>
            <Text style={[style.contentLabel]}>
              Ngày sinh
            </Text>
            <View style={style.arrowIcon}>
              <Text style={style.label}>{this._getNgaySinh()}</Text>
              <TruliaIcon name={"arrow-down"} color={gui.arrowColor} size={18} />
            </View>
          </View>
        </TouchableHighlight>
    );
  }

  _renderNgaySinhPicker(){
    if (!this.state.showNgaySinhPicker)
      return <View />;

    return (
        <DatePickerIOS
            date={this.state.date}
            mode="date"
            timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours}
            onDateChange={this._onNgaySinhChange.bind(this)}
        />
    );
  }

  _renderDiaChi(){
    return (
        <View style={style.rowContainer}>
          <Text style={[style.contentLabel]}>
            Địa chỉ
          </Text>

          <TextInput
              secureTextEntry={false}
              multiline = {true}
              autoCorrect = {false}
              numberOfLines = {3}
              style={[style.contentText, {borderColor: 'lightgray', borderWidth: 1, height: 60}]}
              value={this._getDiaChi()}
              onChangeText={(text) => this.onValueChange("diaChi", text)}
          />
        </View>
    );
  }

  _renderMoiGioi(){
    return (
        <TouchableHighlight onPress={() => this._onMoiGioiPressed()}>
          <View style={style.rowIconContainer}>
            <Text style={[style.contentLabel, {width: 150}]}>
              Vai trò của bạn
            </Text>
            <View style={style.arrowIcon}>
              <Text style={style.label}>{this._getMoiGioi()}</Text>
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

  _onGioiTinhPressed(){
    Actions.GioiTinh();
  }

  _onMoiGioiPressed(){
    Actions.MoiGioi();
  }

  _onNgaySinhPressed(){
    let showNgaySinhPicker = this.state.showNgaySinhPicker;

    this.setState({showNgaySinhPicker: !showNgaySinhPicker});

    if (!showNgaySinhPicker)
      this._onScrollNgaySinh();
  }

  _onNgaySinhChange(date){
    console.log("on Ngay Sinh change");
    let birthDate = moment(date).subtract(1, 'days')
    this.setState( { date: date});
    this.onValueChange('birthDate', birthDate);
  }

  _onScrollNgaySinh() {
    let  scrollTo = 300;
    this._scrollView.scrollTo({y: scrollTo});
  }

  onValueChange(field, value){
    //todo: need to implement
    this.props.actions.onProfileFieldChange(field, value);
  }

  _getFullName(){
    return this.props.me.profile.fullName;
  }

  _getSoDienThoai(){
    return this.props.me.profile.phone;
  }

  _getEmail(){
    return this.props.me.profile.email;
  }

  _getWebsite(){
    return this.props.me.profile.website;
  }

  _getGioiThieu(){
    return this.props.me.profile.gioiThieu;
  }

  _getAvatar(){
    return this.props.me.profile.avatar;
  }

  _getGioiTinh(){
    return DanhMuc.GioiTinh[this.props.me.profile.sex]||'';
  }

  _getNgaySinh(){
    return this.props.me.profile.birthDate ? moment(this.props.me.profile.birthDate).format('DD/MM/YYYY') : ''
  }

  _getDiaChi(){
    return this.props.me.profile.diaChi;
  }

  _getMoiGioi(){
    return DanhMuc.MoiGioi[this.props.me.profile.broker]||'';
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
    width: width-150,
    paddingLeft: 5,
    paddingRight: 5
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
  avatarIcon : {
    height: 60,
    width: 60,
    borderRadius: 30
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);

