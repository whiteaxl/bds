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

import DeviceInfo from 'react-native-device-info';



import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
/**
 * The actions we need
 */
import * as globalActions from '../reducers/global/globalActions';
import * as authActions from '../reducers/auth/authActions';

/**
 * Immutable Mapn
 */
import {Map} from 'immutable';



/**
 * The ErrorAlert displays an alert for both ios & android
 */
import ErrorAlert from '../components/ErrorAlert';

//intro swiper
import IntroSwiper from '../components/IntroSwiper';


/**
 * The 4 states were interested in
 */
const {
  LOGIN_STATE_LOGOUT,
} = require('../lib/constants').default;

/**
 * ## Redux boilerplate
 */
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



var topHeight = function() {
  return Dimensions.get('window').height * 4 / 5 - 15;
}

class Launch extends React.Component {
  constructor(props) {
    super(props);
    this.errorAlert = new ErrorAlert();

    this.state = {
      user:null
    }
  }
  componentDidMount() {

  }

  loginWithoutUser() {
    let uid = DeviceInfo.getUniqueID();

    console.log("Device Unique ID", uid);
    console.log("Device Model", DeviceInfo.getModel());

    this.props.actions.loginWithoutUser({
      userID : uid
      , name : 'Device'
      , isDevice : true
    })

    Actions.Home()
  }

  login() {

  }

  render() {
		return (
			<View style={styles.container}>
				<View style={styles.swiper}>
		      <IntroSwiper />
				</View>
				<View style={styles.buttonControl} >

          <View style={{flexDirection: 'row'}}>
            <Icon.Button style={styles.button} name="sign-in" backgroundColor="#f44336"
                onPress={this.login.bind(this)}>
              Dang Nhap
            </Icon.Button>
            <Text style={{width: 10}}> </Text>
            <Icon.Button style={styles.button} name="book" backgroundColor="#f44336"
                onPress={this.login.bind(this)}>
              Dang Ky
            </Icon.Button>
          </View>

          <Text style={{height: 10}}> </Text>

          <Icon.Button style={{width: 250}} name="play" backgroundColor="#004306"
              onPress={this.loginWithoutUser.bind(this)}>
            Dang nhap khong can dang ky
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
    console.log('ERROR signin in:', error);
    //this.errorAlert.checkError(error);
  }

  signInSuccess(user) {
    this.signInService = this._rwGoogleSignIn; //incase auto call when startup

    this.setState({user: user});

    Actions.app({user: user, facade: this });
  }

  signOut() {
    console.log("signout:")
    console.log(this)
    console.log(this.signInService)
    return this.signInService.signOut();
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
    width: 120,
    //marginLeft: 10
  },

  termLine : {
    fontSize:11,
    paddingTop: 10,
    color: 'white'
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Launch);
