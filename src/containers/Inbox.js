'use strict';

import  React, {Component} from 'react';

import { View, Text, StyleSheet} from 'react-native';

import {Actions} from 'react-native-router-flux';
import log from "../lib/logUtil";
import gui from "../lib/gui";
import {Map} from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as globalActions from '../reducers/global/globalActions';

import LoginRegister from './LoginRegister';

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

export default class Inbox extends Component {
	constructor(props) {
		super(props);
	}

  render() {
		console.log("Calling Inbox.render ..., loggedIn = ", this.props.global.loggedIn, this);

		if (this.props.global.loggedIn) {
			return (
				<View style={[styles.container]} >
					<Text style={styles.welcome}>Screen 2 </Text>
					<Text style={styles.stuff}>Awesome stuffs are here</Text>
				</View>
			);
		} else {
			return (
				<LoginRegister />
			);
		}
	}
}


var styles = StyleSheet.create({
	container: {
		paddingTop: 15,
		backgroundColor: "white"
	},

	label: {
		fontSize: 15,
		fontWeight: "bold"
	},

	input: {
		fontSize: 15,
		width: 200,
		height: 30,
		borderWidth: 1,
		alignSelf: 'center',
		padding: 5

	}
});


export default connect(mapStateToProps, mapDispatchToProps)(Inbox);