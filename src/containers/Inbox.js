'use strict';

import  React, {Component} from 'react';

import { View, Text, StyleSheet, ScrollView} from 'react-native';

import {Actions} from 'react-native-router-flux';
import log from "../lib/logUtil";
import gui from "../lib/gui";
import {Map} from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as globalActions from '../reducers/global/globalActions';
import * as inboxActions from '../reducers/inbox/inboxActions';

import LoginRegister from './LoginRegister';
import InboxContent from "../components/inbox/InboxContent";
import InboxHeader from '../components/inbox/InboxHeader';
import LikeTabButton from '../components/LikeTabButton';


const actions = [
	globalActions, inboxActions
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

class Inbox extends Component {
	constructor(props) {
		super(props);
	}

	onChangeTab(data) {
		//this.props.actions.onAuthFieldChange('activeRegisterLoginTab',data.i);

		//change focus, not now
		if (data.i===0) {
			//this.usernameRegister.focus();
		} else {
			//this.usernameLogin.focus();
		}
	}

	renderTabBar() {
		return <InboxTabBar />
	}

	_onLoaiTinChange(value) {
		this.props.actions.onInboxFieldChange('loaiTin', value);
	}

  render() {
		console.log("Calling Inbox.render ..., loggedIn = ", this.props.global.loggedIn);
		let loaiTin = this.props.inbox.loaiTin;

		if (this.props.global.loggedIn) {
			return (
				<View style={styles.container}>
					<InboxHeader headerTitle={"Chat"}/>
					<View style = {styles.tabbar}>
						<LikeTabButton name={'all'}
													 onPress={this._onLoaiTinChange.bind(this)}
													 selected={loaiTin === 'all'}>TẤT CẢ</LikeTabButton>
						<LikeTabButton name={'buy'}
													 onPress={this._onLoaiTinChange.bind(this)}
													 selected={loaiTin === 'buy'}>MUA</LikeTabButton>
						<LikeTabButton name={'sell'}
													 onPress={this._onLoaiTinChange.bind(this)}
													 selected={loaiTin === 'sell'}>BÁN/CHO THUÊ</LikeTabButton>
					</View>
					<InboxContent/>
					
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
		paddingTop: 0,
		backgroundColor: "white",
		flex:1,
	},

	scrollContainer: {
		paddingTop: 0,
		backgroundColor: "white",
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

	},
	tabbar : {
		flexDirection: 'row',
		paddingLeft: 5,
		paddingRight: 5,
		borderColor: '#e6e6e6',
		borderBottomWidth: 1,
		paddingTop: 2
	},

});


export default connect(mapStateToProps, mapDispatchToProps)(Inbox);