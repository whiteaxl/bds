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

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {Map} from 'immutable';

import * as globalActions from '../../reducers/global/globalActions';
import * as authActions from '../../reducers/auth/authActions';
import * as registerActions from '../../reducers/register/registerActions';


const actions = [
  globalActions,
  authActions,
  registerActions
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

class Login extends React.Component {

  constructor(props) {
    super(props);
    StatusBar.setBarStyle('light-content');
    this.state = {
      username:''
    };
  }

  render(){
    return(
      <View style={styles.container}>
      <View style={[styles.toolbar, Platform.OS === 'ios' ? {marginTop: 0} : null]}>
        <TouchableOpacity style={styles.loginTouch01} onPress={this._onHuyPress}>
               <Text style={styles.loginText01}>Huỷ</Text>     
        </TouchableOpacity>
        <View style={styles.viewCenter}>
              <Text style={styles.textViewCenter}></Text>
        </View> 
        <View style={styles.viewDoi}></View> 
      </View>
        <View style={styles.viewDetail}>
          <View style ={styles.wiewWelcome}>
            <Text style={styles.textWelcome}>Đăng nhập hoặc đăng ký</Text>
            <Text style={styles.textWelcome}>để lưu nhà, chat và đăng tin</Text>
          </View>
          <View style ={styles.viewInput}>
            <TextInput
              style = {styles.textInput}
              autoCapitalize='none'
              autoCorrect={false}
              underlineColorAndroid='rgba(0,0,0,0)'
              style={styles.viewTextInput}
              placeholder="Nhập email hoặc số điện thoại" placeholderTextColor={gui.arrowColor}
              onChangeText={(text) => {this._onUsernameTextChange(text)}}
              value={this.state.username}
              />
            
          </View>
          <TouchableOpacity onPress = {this._onThucHien.bind(this)} style={styles.buttonAction} >
              <Text style={styles.buttonTextAction} >Thực hiện</Text>
          </TouchableOpacity>
          {/*
          <View style ={styles.buttonRegister}>
            <Text style={styles.buttonTextRegister} >Hoặc đăng nhập với</Text>
            <TouchableOpacity>
              <Icon name="facebook-square" size={35} color="#475993" style={{marginLeft:5}} />
            </TouchableOpacity>
          </View>
          */}
          <View style ={styles.viewAccept}>
            <Text style={styles.textAccept}>Tôi đồng ý với điều khoản dịch vụ của Landber</Text>
          </View>
          
        </View>
      </View>

    );
  }

  _onUsernameTextChange(text){
    this.setState({username: text});
  }

  _onHuyPress(){
    Actions.pop();
  }

  _onThucHien(){
    if (!this.validate()){
      Alert.alert("Số điện thoại hoặc địa chỉ email không đúng định dạng");
      return;
    }
    let username = this.state.username
    this.props.actions.checkUserExist(username).then(
        (res) => {
          console.log("Login._onThucHien");
          if (res.exist){
            Actions.UserComeback({username: username});
          }else {
            this.props.actions.onRegisterFieldChange('username',username)
            Actions.Register();
          }
        }
    )
  }

  validate(){
    let username = this.state.username;

    if (!username || username.length <= 0)
        return false;

    if (isNaN(username) && username.indexOf("@")<0)
        return false;

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
    backgroundColor:'transparent', 
    flex:1,
    alignItems:'center'
  },
  loginTouch01: {
    width: 40,
    marginLeft: 12,
    marginTop: 30 
  },
  loginText01: {
    fontSize: gui.fontSize,
    color: gui.mainColor,
    fontFamily: gui.fontFamily
  },
  viewCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textViewCenter: {
    fontSize: 18,
    color: 'white'
  },
  viewDoi: {
    width: 40
  },
  viewDetail: {
    flex:1,
    alignItems:'center'
  },
  wiewWelcome: {
    justifyContent: 'center',
    alignItems: 'center', 
    marginTop:36
  },
  textWelcome: {
    fontSize:23, 
    color:'black',  
    fontFamily: gui.fontFamily
  },
  viewInput: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:13
  },
  viewTextInput: {
    fontFamily: gui.fontFamily,
    backgroundColor:'white',
    width: width- 39,
    height:38, 
    borderRadius: 5,
    borderWidth:1,
    borderColor:'#c6cbce',
    fontSize: 15,
    paddingLeft: 10,
    paddingRight: 10
  },
  textInput: {
    fontFamily: gui.fontFamily,
    fontSize: gui.normalFontSize
  },
  buttonAction: {
    backgroundColor: gui.mainColor,
    borderRadius: 5, 
    marginTop: 10, 
    justifyContent: 'center', 
    alignItems: 'center',  
    width: width- 39,
    height: 38
  },
  buttonTextAction: {
    fontSize:18, 
    color:'white',
    fontFamily: gui.fontFamily
  },
  buttonRegister: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18, 
    flexDirection:'row'
  },
  buttonTextRegister: {
    fontSize:14,
    color:'black',
    fontFamily: gui.fontFamily
  },
  loginFacebook: {
    width: 30, 
    height: 30,
    marginLeft: 5
  },
  viewAccept: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8
  },
  textAccept: {
    fontSize:13,
    color:'#7b8b91',
    fontFamily: gui.fontFamily
  }
   
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
