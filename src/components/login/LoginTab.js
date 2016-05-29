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
import * as authActions from '../../reducers/auth/authActions';

import RelandIcon from '../../components/RelandIcon';


const actions = [
  globalActions,
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

class LoginTab extends React.Component {
  componentDidMount() {
    this.props.onDidMount(this.refs.username);
  }

  login() {
    let userDto = {
      phone: this.props.auth.phone,
      matKhau: this.props.auth.matKhau
    };

    this.props.actions.login(userDto.phone, userDto.matKhau)
      .then((res) => {
        if (res.status ===0) {
          if (this.props.onLoginSuccess) {
            this.props.onLoginSuccess();
          } else {
            Actions.pop();
          }
        } else {
          Alert.alert("Invalid username or password!");
        }
      })
      .catch((res) => {
        Alert.alert(res.toString());
      })
  }

  coming() {
    Alert.alert("Coming soon...");
  }

  render() {
    return (
      <View style={styles.wrapper}>
        <View style={[styles.line, { marginTop: 36}]}/>
        <TextInput style={styles.input}
                   selectTextOnFocus={true}
                   ref='username'
                   clearButtonMode='always'
                   //autoFocus={true}
                   value={this.props.auth.phone}
                   placeholder="Số điện thoại hoặc Email"
                   onChangeText={(text) => {
                        this.props.actions.onAuthFieldChange('phone',text)
                   }}
        />

        <View style={[styles.line, { marginTop: 0}]}/>

        <View style={[styles.line, { marginTop: 18}]}/>
        <TextInput style={styles.input} placeholder="Mật khẩu"
                   selectTextOnFocus={true}
                   value={this.props.auth.matKhau}
                   onChangeText={(text) => {
                        this.props.actions.onAuthFieldChange('matKhau',text)
                   }}
        />
        <View style={[styles.line, { marginTop: 0}]}/>

        <TouchableOpacity style={styles.btn}
                          onPress={this.login.bind(this)}
        >
          <Text style={styles.btnText}>Đăng nhập</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={this.coming.bind(this)}
        >
          <Text style={styles.forgot}>Quên mật khẩu ?</Text>
        </TouchableOpacity>

        <Text style={styles.quickLoginTitle}>Đăng nhập nhanh với</Text>
        <View style={styles.quickBtnContainer}>
          <TouchableOpacity
            style={[styles.quickBtn, {marginLeft:18, marginRight:9, backgroundColor:'#b90000'}]}
                            onPress={this.coming.bind(this)}
          >
            <Text style={styles.btnTextQuickLogin}>Google</Text>
            <RelandIcon.Icon
              style={{left:15, top: 10, position:'absolute'}}
              name="google" size={23} color="white"/>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickBtn, {marginLeft:9, marginRight:18, backgroundColor:'#1453a3'}]}
                            onPress={this.coming.bind(this)}
          >
            <Text style={styles.btnTextQuickLogin}>Facebook</Text>

            <RelandIcon.Icon
                        name="facebook" color="white"
                        style={{left:15, top: 8, position:'absolute'}}
                        size={25} />

          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginTab);


var styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'column',
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
    marginTop: 17,
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
  }
});