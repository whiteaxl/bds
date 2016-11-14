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
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
var Modal  = require('react-native-modalbox');
import Icon from 'react-native-vector-icons/FontAwesome';
import gui from '../../lib/gui';
import GiftedSpinner from 'react-native-gifted-spinner';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {Map} from 'immutable';

import * as globalActions from '../../reducers/global/globalActions';
import * as authActions from '../../reducers/auth/authActions';


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

class UserComeback extends React.Component {

    constructor(props) {
        console.log("UserBack.constructor");
        super(props);
        StatusBar.setBarStyle('light-content');
        
        this.state = {
         username: props.username,
         password: '',
         email: '',
         phone: '',
         maKichHoat: '',
         newPassword: '',
         verifyCode: ''
        };

    }

    forgetPassWord() {
        Alert.alert("coming soon ...");
        //this.refs.modalForgetPassword.open();
    }

    resetPassword() {
        //TODO: call API to send sms
        this.refs.modalResetPassword.open();
    }

    _onHuyPress(){
        Actions.pop()
    }

    _onThucHienPress(){
        console.log("_onThucHienPress");
        console.log(this.state);
        let userDto = {
            username: this.state.username,
            password: this.state.password
        };

        const deviceDto = {
            ... this.props.global.deviceInfo,
            phone: this.state.username //TODO: later can be email
        };

        this.props.actions.login(userDto.username, userDto.password, deviceDto)
            .then((res) => {
                if (res.login ===true) {
                    if (this.props.onLoginSuccess) {
                        this.props.onLoginSuccess();
                    } else {
                        Actions.pop();
                        Actions.pop();
                    }
                } else {
                    Alert.alert("Sai tên đăng nhập hoặc mật khẩu!");
                }
            })
            .catch((res) => {
                Alert.alert(res.toString());
            })
    }

    _onThucHienResetPasswordPress(){
        console.log("_onThucHienResetPasswordPress");
        console.log(this.state);
        //Actions.Login();
    }

    render(){
        if (this.props.auth.isFetching ||
            (this.props.global.loggedIn && !this.props.global.currentUser.userID)) {
            return (
                <View style={{flex:1, alignItems:'center', justifyContent:'center', marginTop: 30}}>
                    <GiftedSpinner size="large" />
                </View>
            )
        }

        return(
            <View style={styles.container}>
                <View style={[styles.toolbar, Platform.OS === 'ios' ? {marginTop: 0} : null]}>
                    <TouchableOpacity onPress = {this._onHuyPress.bind(this)} style={styles.viewHuy}>
                        <Text style={styles.textHuy}>Huỷ</Text>
                    </TouchableOpacity>
                    <View style={styles.viewTitle}>
                        <Text style={styles.textTitle}></Text>
                    </View>
                    <View style={styles.viewCan}></View>
                </View>
                <View style={styles.viewBody}>
                    <View style ={styles.viewWelcome}>
                        <Text style={styles.textWelcome}>Chào mừng bạn quay lại</Text>
                    </View>
                    <View style ={styles.viewInput}>
                        <TextInput
                         underlineColorAndroid='rgba(0,0,0,0)'
                         returnKeyType='go'
                         secureTextEntry={true}
                         style={styles.viewTextInput}
                         placeholder="Nhập mật khẩu" placeholderTextColor='#adb4b7'
                         onChangeText={(text) => this.setState({password: (text)})}
                         value={this.state.password}
                         />
                    </View>
                    <TouchableOpacity onPress = {this._onThucHienPress.bind(this)} style={styles.viewAction} >
                        <Text style={styles.textAction} >Thực hiện</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.forgetPassWord.bind(this)} style ={styles.viewForgetPass}>
                        <Text style={styles.textForgetPass} >Quên mật khẩu?</Text>
                    </TouchableOpacity>
                </View>

                {this._renderQuenMkModal()}

                {this._renderCapNhatMkModal()}

            </View>

        );
    }

    _renderQuenMkModal(){
        return (
            <Modal open={this.state.open} style={styles.modalmore} ref={"modalForgetPassword"} position={"center"} swipeToClose={false}>
                <View style={styles.modalContainer}>
                    <View style={[styles.toolbarModalSend, Platform.OS === 'ios' ? {marginTop: 0} : null]}>
                        <TouchableOpacity onPress={()=>this.refs.modalForgetPassWord.close()} style={styles.passWordHuy}>
                            <Text style={styles.textPassHuy}>Huỷ</Text>
                        </TouchableOpacity>
                        <View style={styles.modalViewTitle}>
                            <Text style={styles.modalTextTile}></Text>
                        </View>
                        <View style={styles.modalTextCan}></View>
                    </View>
                    <View style={styles.modalBody}>
                        <View style ={styles.bodyForget}>
                            <Text style={styles.bodyTextFoget}>Quên mật khẩu?</Text>
                        </View>
                        <TextInput
                         underlineColorAndroid='rgba(0,0,0,0)'
                         returnKeyType='go'
                         selectTextOnFocus={true}
                         style={styles.modalInput}
                         placeholder="Nhập email hoặc số điện thoại" placeholderTextColor='#adb4b7'
                         onChangeText={(text) => this.setState({username: (text)})}
                         value={this.state.username}
                         />

                        <TouchableOpacity onPress={this.resetPassword.bind(this)} style={styles.actionButton} >
                            <Text style={styles.textActionButton}>Tiếp tục</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>this.refs.modalForgetPassword.close()} style ={styles.viewForgetPass}>
                            <Text style={styles.textForgetPass}>Nhớ lại mật khẩu? Đăng nhập.</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        )
    }

    _renderCapNhatMkModal(){
        return (
            <Modal open={this.state.open} style={styles.modalmore} ref={"modalResetPassword"} position={"center"} swipeToClose={false}>
                <View style={styles.modalContainer}>
                    <View style={[styles.toolbarModalSend, Platform.OS === 'ios' ? {marginTop: 0} : null]}>
                        <TouchableOpacity onPress={()=>this.refs.modalResetPassword.close()} style={styles.modalBack} >
                            <Icon name="angle-left" size={40} color="white" />
                        </TouchableOpacity>
                        <View style={styles.modalViewTitle}>
                            <Text style={styles.modalTextTile}>Cập nhật mật khẩu</Text>
                        </View>
                        <View style={styles.modalTextCan}></View>
                    </View>
                    <View style={styles.modalBody}>
                        <View style ={styles.viewCapNhat}>
                            <Text style={styles.textXacNhan}>Tạo mật khẩu mới cho tài khoản của bạn</Text>
                        </View>

                         <TextInput
                         underlineColorAndroid='rgba(0,0,0,0)'
                         returnKeyType='next'
                         style={styles.textInput}
                         placeholder="Email hoặc số điện thoại" placeholderTextColor='#adb4b7'
                         onChangeText={(text) => this.setState({username: (text)})}
                         value={this.state.username}
                         />
                         <TextInput
                         underlineColorAndroid='rgba(0,0,0,0)'
                         returnKeyType='next'
                         style={styles.textInput}
                         placeholder="Mã xác nhận" placeholderTextColor='#adb4b7'
                         onChangeText={(text) => this.setState({verifyCode: (text)})}
                         value={this.state.verifyCode}
                         />
                         <TextInput
                         underlineColorAndroid='rgba(0,0,0,0)'
                         returnKeyType='go'
                         secureTextEntry={true}
                         style={styles.textInput}
                         placeholder="Mật khẩu mới" placeholderTextColor='#adb4b7'
                         onChangeText={(text) => this.setState({newPassword: (text)})}
                         value={this.state.newPassword}
                         />

                        <TouchableOpacity onPress={() => this._onThucHienResetPasswordPress()} style={styles.actionButton} >
                            <Text style={styles.textActionButton}>Thực hiện</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        )
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
    modalmore: {
        position:'absolute',
        backgroundColor: 'white',
        width: width,
        height: height
    },
    toolbarModalSend :{
        height: 64,
        flexDirection:'row',
        backgroundColor:'#00a8e6',
        borderBottomWidth:1,
        borderColor:'#e8e9e9'
    },
    container: {
        backgroundColor:'transparent',
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
    viewCan: {
        width: 40
    },
    viewBody: {
        flex:1,
        alignItems:'center'
    },
    viewWelcome: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:46
    },
    textWelcome: {
        fontSize:23,
        color:'black',
        fontFamily: gui.fontFamily
    },
    viewInput: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:35
    },
    viewTextInput: {
        fontFamily: gui.fontFamily,
        backgroundColor:'white',
        width: width- 39,
        height:37,
        borderRadius: 5,
        borderWidth:1,
        borderColor:'#c6cbce',
        fontSize: 15,
        paddingLeft: 10
    },
    viewAction: {
        backgroundColor:'#00a8e6',
        borderRadius: 5,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        width: width- 39,
        height: 38
    },
    textAction: {
        fontSize:18,
        color:'white',
        fontFamily: gui.fontFamily
    },
    viewForgetPass: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:38
    },
    textForgetPass: {
        fontSize:13.5,
        color:'#7b8b91',
        fontFamily: gui.fontFamily
    },
    modalContainer: {
        backgroundColor:'transparent',
        flex:1,
        alignItems:'center'
    },
    passWordHuy: {
        width: 40,
        marginLeft:12,
        marginTop: 30
    },
    textPassHuy: {
        fontSize: 16,
        color: 'white',
        fontFamily: gui.fontFamily
    },
    modalViewTitle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:15
    },
    modalTextTile: {
        fontSize: 18,
        color: 'white'
    },
    modalTextCan: {
        width: 40
    },
    modalBody: {
        flex:1,
        alignItems:'center'
    },
    bodyForget: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:46
    },
    bodyTextFoget: {
        fontSize:21,
        color:'black',
        fontFamily: gui.fontFamily
    },
    modalInput: {
        fontFamily: gui.fontFamily,
        backgroundColor:'white',
        width: width- 39,
        height:38,
        borderRadius: 5,
        borderWidth:1,
        borderColor:'#c6cbce',
        fontSize: 15,
        marginTop:46,
        paddingLeft: 10
    },
    textInput: {
        fontFamily: gui.fontFamily,
        backgroundColor:'white',
        height:38,
        borderRadius: 5,
        borderWidth:1,
        borderColor:'#c6cbce',
        fontSize: 15,
        marginTop:10,
        marginRight: 10,
        marginLeft: 10,
        paddingLeft: 10
    },
    actionButton: {
        backgroundColor:'#00a8e6',
        borderRadius: 5,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        width: width-39,
        height: 38
    },
    textActionButton: {
        fontSize:18,
        color:'white',
        fontFamily: gui.fontFamily
    },
    modalBack: {
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:15
    },
    viewXacNhan: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:28
    },
    viewCapNhat: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:46
    },
    textXacNhan: {
        fontSize:19,
        color:'black',
        fontFamily: gui.fontFamily
    },

});

export default connect(mapStateToProps, mapDispatchToProps)(UserComeback);
