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

import RelandIcon from '../../components/RelandIcon';

import GiftedSpinner from "../GiftedSpinner";



const actions = [
  globalActions,
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

class RegisterMoreInfor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
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

  register()  {
    if (this.dataValid()) {
      //Alert.alert("Coming soon...");
      let userDto = {
        phone: this.props.register.username,
        fullName: this.props.register.fullName,
        matKhau: this.props.register.matKhau
      };

      this.setState({
        loading: true
      });


      this.props.actions.registerUser(userDto)
        .then(res=>{
          this.setState({
            loading: false
          });


          if (res.status) {
            Alert.alert(res.msg);
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
          <GiftedSpinner />
        </View>
      )
    }


    return (
      <View style={styles.wrapper}>
        <View style={[styles.line, { marginTop: 100}]}/>
        <View style={styles.phoneLine}>
          <Text style={styles.phoneText}> {this.props.register.username} </Text>
        </View>
        <View style={[styles.line, { marginTop: 0}]}/>

        <View style={[styles.line, { marginTop: 17}]}/>
        <TextInput style={styles.input} placeholder="Mật khẩu"
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
                          onPress={this.coming.bind(this)}
        >
          <View style={styles.avatarLine}>
            <Image
              style={styles.avatarIcon}
              resizeMode={Image.resizeMode.contain}
              source={require('../../assets/image/register_avatar_icon.png')}
            />
            <Text style={styles.avatarText}>Chạm để thêm ảnh đại diện</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn}
                          onPress={this.register.bind(this)}
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
    height: 60,
    width: 60,
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