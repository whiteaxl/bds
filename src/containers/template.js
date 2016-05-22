'use strict';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as globalActions from '../reducers/global/globalActions';

import React, {Component} from 'react';

import { Text, View, StyleSheet } from 'react-native'

import {Map} from 'immutable';
import {Actions} from 'react-native-router-flux';
import log from "../lib/logUtil";
import gui from "../lib/gui";


const actions = [
  globalActions
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



class Home extends Component {
  render() {
    return (
			<View style={styles.container}>
				<Text style={styles.welcome}>........Home screen........</Text>
				<Text style={styles.stuff}>Welcome: {this.props.global.currentUser.userID}</Text>
				<Text style={styles.stuff}>Awesome stuffs are here</Text>
				<Text style={styles.notes}>You can take a tour by using the side menu </Text>
			</View>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);

