'use strict';

import React, {
  StyleSheet,
  Text,
  View,
  Image, TouchableHighlight
} from 'react-native';

import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';
import Dimensions from 'Dimensions';


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

//intro swiper
import IntroSwiper from '../components/IntroSwiper';
import gui from "../lib/gui";


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
    this.state = {
      user:null
    }
  }
  componentDidMount() {

  }

  enterApp() {
    Actions.Home()
  }

  login() {
      Actions.Login();
  }

    register() {
        Actions.LoginRegister();
    }

  render() {
		return (
			<View style={styles.container}>
				<View style={styles.swiper}>
		      <IntroSwiper />
				</View>
				<View style={styles.buttonControl} >
          <TouchableHighlight style={styles.batDauBtn}
              onPress={this.enterApp.bind(this)}>
            <Text style={styles.batDauText}> BẮT ĐẦU </Text>
          </TouchableHighlight>

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
    //position: 'absolute',
    padding: 15,
    bottom: 35
  },

  batDauBtn : {
    width: 240,
    height: 50,
    backgroundColor: 'red',//gui.mainColor,
    borderRadius : 5,
    alignItems: 'center',
    justifyContent : 'center'
  },

  batDauText : {
    fontSize: 18,
    fontWeight: "normal",
    color: "white",
  },

  termLine : {
    fontSize:11,
    paddingTop: 10,
    color: 'white',
    backgroundColor: 'transparent'
  },

});

export default connect(mapStateToProps, mapDispatchToProps)(Launch);
