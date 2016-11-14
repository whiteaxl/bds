import React from 'react';
import {
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  StatusBar
} from 'react-native';

import {Actions} from 'react-native-router-flux';
import gui from '../../lib/gui';

var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');

import moment from 'moment';

import cfg from "../../cfg";

var rootUrl = `http://${cfg.server}:5000`;

import log from "../../lib/logUtil";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {Map} from 'immutable';

import * as globalActions from '../../reducers/global/globalActions';
import * as registerActions from '../../reducers/register/registerActions';
import * as postAdsActions from '../../reducers/postAds/postAdsActions';


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

class Register extends React.Component {
    constructor(props) {
        super(props);
        StatusBar.setBarStyle('light-content');
        this.state = {
            avatar: null
        }
    }

    render(){
        let imgUrl = !this.props.register.image || this.props.register.image.length<=0 ?
                    require('../../assets/image/user.png') : {uri: this.props.register.image}
        return(
          <View style={styles.container}>
          <View style={[styles.toolbar, Platform.OS === 'ios' ? {marginTop: 0} : null]}>
            <TouchableOpacity onPress = {() => Actions.pop()} style={styles.viewHuy} >
                   <Text style={styles.textHuy}>Huỷ</Text>
            </TouchableOpacity>
            <View style={styles.viewTitle}>
                  <Text style={styles.textTitle}></Text>
            </View>
            <View style={styles.viewCan}></View>
          </View>
            <View style={styles.viewBody}>
              <View style ={styles.viewWelcome}>
                <Text style={styles.textWelcome}>Chào mừng đến với Landber</Text>
              </View>
              <View style ={styles.viewInput1}>
                <TextInput
                  underlineColorAndroid='rgba(0,0,0,0)'
                  returnKeyType='next'
                  selectTextOnFocus={true}
                  style={styles.viewTextInput}
                  placeholder="(+84)978 666768" placeholderTextColor='#adb4b7'
                  onChangeText={(text) => {this.props.actions.onRegisterFieldChange('username',text)}}
                  value={this.props.register.username}
                  />
              </View>
              <View style ={styles.viewInput2}>
                <TextInput
                  underlineColorAndroid='rgba(0,0,0,0)'
                  returnKeyType='next'
                  secureTextEntry={true}
                  style={styles.viewTextInput}
                  placeholder="Chọn một mật khẩu" placeholderTextColor='#adb4b7'
                  onChangeText={(text) => {this.props.actions.onRegisterFieldChange('matKhau',text)}}
                  value={this.props.register.matKhau}
                  />
              </View>
              <View style ={styles.viewInput2}>
                <TextInput
                  underlineColorAndroid='rgba(0,0,0,0)'
                  returnKeyType='go'
                  style={styles.viewTextInput}
                  placeholder="Họ và tên" placeholderTextColor='#adb4b7'
                  onChangeText={(text) => {this.props.actions.onRegisterFieldChange('fullName',text)}}
                  value={this.props.register.fullName}
                  />
              </View>
              <View style ={styles.changeImage}>

                <TouchableOpacity onPress={this._takePicture.bind(this)}>
                  <Image style={styles.detailImage} source={imgUrl}/>
                </TouchableOpacity>
                <Text style={styles.textImage} >Chạm để thêm ảnh đại diện</Text>
              </View>
              <TouchableOpacity onPress = {this._onThucHien.bind(this)}style={styles.viewAction} >
                  <Text style={styles.textAction} >Thực hiện</Text>
              </TouchableOpacity>

            </View>
          </View>

        );
  }

   _takePicture() {
      Actions.PostAds({owner: 'register'});
  }

    _onThucHien() {
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

}

const styles = StyleSheet.create({

 toolbar :{
  height: 64,
  flexDirection:'row',
  backgroundColor:'#f5f6f7',
  borderBottomWidth:1,
  borderColor:'#e8e9e9'
},
  container: {
    backgroundColor:'white',
    flex:1,
    alignItems:'center'
  },
  
  viewHuy: {
    width: 40,
    marginLeft:12, 
    marginTop: 30 
 },
  textHuy: {
    fontSize: 16, 
    color: '#00a8e6', 
    fontFamily: gui.fontFamily
  },
  viewTitle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textTitle: {
    fontSize: 18,
    color: 'white' 
  },
  viewCan: {width: 40},
  viewBody: {
    flex:1, 
    alignItems:'center'
  },
  viewWelcome: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:47
  },
  textWelcome: {
    fontSize:23,
    color:'black',
    fontFamily: gui.fontFamily
  },
  viewInput1: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:34
  },
  viewTextInput: {
    fontFamily: gui.fontFamily,
    backgroundColor:'white',
    width: width- 40,
    height:37,
    borderRadius: 6,
    borderWidth:1, 
    borderColor:'#c6cbce',
    fontSize: 14,
    paddingLeft: 10
  },
  viewInput2: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:10.5
  },
  changeImage: {
    alignItems: 'center',
    marginTop:16, 
    flexDirection:'row',
    width: width- 40
  },
  detailImage: {
    width: 40,
    height: 40
  },
  textImage: {
    fontSize:13,
    color:'#a9a9a9',
    marginLeft: 10,
    fontFamily: gui.fontFamily,
    marginBottom:7
  },
  viewAction: {
    backgroundColor:'#00a8e6',
    borderRadius: 6,
    marginTop: 14,
    justifyContent: 'center',
    alignItems: 'center', 
    width: width- 39,
    height: 39
  },
  textAction: {
    fontSize:18,
    color:'white',
    fontFamily: gui.fontFamily
  },
         
});

export default connect(mapStateToProps, mapDispatchToProps)(Register);
