'use strict';

import React from 'react';

import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  Dimensions
} from 'react-native';

import {Actions} from 'react-native-router-flux';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as globalActions from '../reducers/global/globalActions';
import * as authActions from '../reducers/auth/authActions';


import {Map} from 'immutable';

import IntroSwiper from '../components/IntroSwiper';

import gui from '../lib/gui';

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


class Launch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user:null
    };
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

  componentDidMount() {
    setTimeout(this.enterApp.bind(this), 3000);
  }

  render() {
		return (
			<View style={styles.container}>
				<View style={styles.swiper}>
		      <IntroSwiper />
				</View>
              {/*<View style={styles.buttonControl} >
          <TouchableHighlight style={styles.batDauBtn}
              onPress={this.enterApp.bind(this)}>
            <Text style={styles.batDauText}> BẮT ĐẦU </Text>
          </TouchableHighlight>

                  <Text style={styles.termLine}>
            Bằng việc đăng ký, bạn đồng ý với
            <Text style={{color: 'lightblue'}}> Điều Khoản Dịch Vụ </Text>
            </Text>
         </View>*/}
			</View>
		);
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
    bottom: 70
  },

  batDauBtn : {
    width: Dimensions.get('window').width-130,
    height: 30,
    backgroundColor: gui.mainColor,
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
