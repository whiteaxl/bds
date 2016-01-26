'use strict';
import React, {
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';

import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';
import Dimensions from 'Dimensions';

//google sigin
import { NativeAppEventEmitter } from 'react-native';

var GoogleSignin = require('react-native-google-signin');

import RwGoogleSignIn from '../lib/google.js'


/**
 * The ErrorAlert displays an alert for both ios & android
 */
import ErrorAlert from '../components/ErrorAlert';

//intro swiper
import IntroSwiper from '../components/IntroSwiper';

var topHeight = function() {
  return Dimensions.get('window').height * 4 / 5 - 15;
}

export default class Launch extends React.Component {
  constructor(props) {
    super(props);
    this.errorAlert = new ErrorAlert();

    this.state = {
      user:null
    }
  }
  componentDidMount() {
    this._rwGoogleSignIn = new RwGoogleSignIn(this);
  }

	loginWithFacebook() {

  }

  loginWithGoogle() {
    _rwGoogleSignIn.signIn();
    this.signOut = _rwGoogleSignIn.signOut
  }

  render() {
		return (
			<View style={styles.container}>
				<View style={styles.swiper}>
		      <IntroSwiper />
				</View>
				<View style={styles.buttonControl} > 
       		<Icon.Button style={styles.button} name="facebook-official" backgroundColor="#3b5998" onPress={this.loginWithFacebook}>
            Login with Facebook
          </Icon.Button>

          <Text style={{height: 10}}> </Text>
       
          <Icon.Button style={styles.button} name="google" backgroundColor="#f44336" onPress={this.loginWithGoogle}>
            Login with Google
          </Icon.Button>

          <Text style={styles.termLine}> 
            Bằng việc đăng ký, bạn đồng ý với 
            <Text style={{color: 'lightblue'}}> Điều Khoản Dịch Vụ </Text>
            </Text>
         </View>
			</View>
		); 
	}

  

  signInFail(error) {
    console.log('ERROR signin in', error);
    this.errorAlert.checkError(error);
  }

  signInSuccess(user) {
    console.log(user);
    this.setState({user: user});
    Actions.app(user);
  }

  postSignOut() {
    this.setState({user: null});
  }
} 

var styles = StyleSheet.create({
  container : {
  	flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  },

  swiper : {
  	flex: 4, 
    //borderWidth: 5,
  }, 
  buttonControl : {
  	justifyContent : 'center', 
  	alignItems : 'center', 
    padding: 15,
    //position: 'absolute', 
    bottom: 30
  }, 

  button : {
    width: 200, 
    //marginLeft: 10
  }, 

  termLine : {
    fontSize:11, 
    paddingTop: 10, 
    color: 'white'
  }
});