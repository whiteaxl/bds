import React, {Component} from 'react';

import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput, Alert
} from 'react-native';

import gui from '../../lib/gui';
import {Actions} from 'react-native-router-flux';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {Map} from 'immutable';

import * as globalActions from '../../reducers/global/globalActions';
import * as registerActions from '../../reducers/register/registerActions';
import * as postAdsActions from '../../reducers/postAds/postAdsActions';

import moment from 'moment';

import cfg from "../../cfg";

var rootUrl = `http://${cfg.server}:5000`;

import log from "../../lib/logUtil";

import GiftedSpinner from "../GiftedSpinner";



const actions = [
  globalActions,
  registerActions,
  postAdsActions
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

class RegisterMoreInfor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      avatar: null
    }
  }

  coming() {
    Alert.alert("Coming soon...");
  }

  dataValid() {
    if (!this.props.register.matKhau) {
      Alert.alert(gui.ERR_dataRequired + "mật khẩu!");
      return false;
    }
    if (!this.props.register.fullName) {
      Alert.alert(gui.ERR_dataRequired + "tên đầy đủ!");
      return false;
    }

    return true;
  }

  takePicture() {
    Actions.PostAds({owner: 'register'});
  }

  onUploadImage() {
    var filepath = this.props.register.image;
    if (!filepath) {
      this.state.avatar = null;
      this.register();
      return;
    }
    var ms = moment().toDate().getTime();
    var userID = this.props.register.username;
    var filename = 'Avatar_' + userID + '_' + ms + filepath.substring(filepath.lastIndexOf('.'));
    this.props.actions.onUploadImage(filename, filepath, this.uploadCallBack.bind(this));
  }

  uploadCallBack(err, result) {
    var {data} = result;
    if (err || data == '') {
      return;
    }
    var {success, file} = JSON.parse(data);
    if (success) {
      var {url} = file;
      this.state.avatar = rootUrl + url;
      this.register();
    }
  }

  register()  {
    if (this.dataValid()) {

      let username = this.props.register.username;

      let userDto = {
        phone: username.indexOf("@") > -1 ? undefined : username,
        email: username.indexOf("@") > -1 ? username : undefined,
        fullName: this.props.register.fullName,
        matKhau: this.props.register.matKhau,
        avatar: this.state.avatar,
        deviceID: this.props.global.deviceInfo.deviceID || undefined,
        deviceModel: this.props.global.deviceInfo.deviceModel || undefined
      };
      log.info(userDto);

      this.setState({
        loading: true
      });

      this.props.actions.registerUser(userDto)
        .then(res=>{
          this.setState({
            loading: false
          });
          
          if (!res.login || res.login==false) {
            Alert.alert(res.err.message);
          } else {
            Alert.alert(gui.INFO_userCreatedSuccessfully);
            Actions.pop();
            Actions.pop();
            this.props.actions.registerSuccess(userDto);
          }

        })
    }
  }

  render() {
    let myProps = this.state;
    if (myProps.loading) {
      return (
        <View style={{flex:1, alignItems:'center', justifyContent:'center', marginTop: 30}}>
          {/*<Text> Loading ... </Text>*/}
          <GiftedSpinner size="large" />
        </View>
      )
    }

    let avatarUri = this.props.register.image ? {uri: this.props.register.image} :
        require('../../assets/image/register_avatar_icon.png');

    return (
      <View style={styles.wrapper}>
        <View style={[styles.line, { marginTop: 100}]}/>
        <View style={styles.phoneLine}>
          <Text style={styles.phoneText}> {this.props.register.username} </Text>
        </View>
        <View style={[styles.line, { marginTop: 0}]}/>

        <View style={[styles.line, { marginTop: 17}]}/>
        <TextInput style={styles.input} placeholder="Mật khẩu"
                   secureTextEntry={true}
                   selectTextOnFocus={true}
                   value={this.props.register.matKhau}
                   onChangeText={(text) => {
                      this.props.actions.onRegisterFieldChange('matKhau',text)
                 }}
        />
        <View style={[styles.line, { marginTop: 0}]}/>

        <View style={[styles.line, { marginTop: 17}]}/>
        <TextInput style={styles.input} placeholder="Tên đầy đủ"
                   selectTextOnFocus={true}
                   value={this.props.register.fullName}
                   onChangeText={(text) => {
                      this.props.actions.onRegisterFieldChange('fullName',text)
                 }}
        />
        <View style={[styles.line, { marginTop: 0}]}/>

        <TouchableOpacity
                          onPress={this.takePicture.bind(this)}
        >
          <View style={styles.avatarLine}>
            <Image
              style={styles.avatarIcon}
              resizeMode={Image.resizeMode.cover}
              source={avatarUri}
            />
            <Text style={styles.avatarText}>Chạm để thêm ảnh đại diện</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn}
                          onPress={this.onUploadImage.bind(this)}
        >
          <Text style={styles.btnText}>Đăng ký</Text>
        </TouchableOpacity>

      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterMoreInfor);


var styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'column',
    //borderColor: 'red',
    //borderWidth: 1,
    backgroundColor: "#f2f2f2"
  },

  btnText: {
    alignSelf:'center',
    fontSize: 15,
    fontFamily: 'Open Sans',
    color: 'white',
    fontWeight : 'normal',
  },

  btnTextQuickLogin: {
    fontSize: 15,
    fontFamily: 'Open Sans',
    color: 'white',
    fontWeight : 'normal',
    justifyContent:"center",
    alignSelf: 'center',
    alignItems:'center'
  },

  forgot: {
    flex: 1,
    alignSelf:'center',
    fontSize: 14,
    fontFamily: 'Open Sans',
    color: gui.mainColor,
    fontWeight : 'normal',
    top: 9,
  },

  quickLoginTitle: {
    alignSelf:'center',
    fontSize: 15,
    fontFamily: 'Open Sans',
    color: '#686868',
    fontWeight : 'normal',
    marginTop: 127,
  },

  btn: {
    marginTop: 0,
    backgroundColor: gui.mainColor,
    alignItems:'center',
    height: 39,
    marginLeft: 18,
    marginRight: 18,
    borderRadius:4,
    justifyContent:"center"
  },

  quickBtn: {
    backgroundColor: gui.mainColor,
    alignItems:'center',
    height: 39,
    borderRadius:4,
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center'
  },

  line: {
    borderColor: '#dcdbdc',
    borderTopWidth: 1,
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
  quickBtnContainer :{
    flexDirection:"row",

    height: 39,
    marginTop: 20,
  },
  phoneText :{
    fontSize: 15,
    fontFamily: 'Open Sans',
    color: '#686868',
    fontWeight : 'normal',
  },
  phoneLine : {
    height: 36,
    paddingLeft: 18,
    justifyContent: 'center',
    backgroundColor : '#f9f9f9'
  },
  avatarIcon : {
    height: 30,
    width: 30,
    margin: 10,
    alignSelf: 'center',
    borderRadius: 15
  },
  avatarText : {
    fontSize: 15,
    fontFamily: 'Open Sans',
    color: '#686868',
    fontWeight : 'normal',
  },
  avatarLine : {
    height: 76,
    marginLeft: 10,
    alignItems: 'center',
    flexDirection: 'row'
    //backgroundColor : '#f9f9f9'
  }
});