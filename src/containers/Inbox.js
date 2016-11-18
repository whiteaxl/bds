'use strict';

import  React, {Component} from 'react';

import { View, Text, StyleSheet, ScrollView, ListView} from 'react-native';

import {Actions} from 'react-native-router-flux';
import log from "../lib/logUtil";
import gui from "../lib/gui";
import {Map} from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as globalActions from '../reducers/global/globalActions';
import * as inboxActions from '../reducers/inbox/inboxActions';

import LoginRegister from './LoginRegister';
import Login from '../components/login/Login';
import InboxContent from "../components/inbox/InboxContent";
import HomeHeader from '../components/home/HomeHeader';
import FullLine from '../components/line/FullLine';

import LikeTabButton from '../components/LikeTabButton';

import dbService from "../lib/localDB";

var myDs = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

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
		props.actions.loadInbox(props.global.currentUser.userID);
	}

	renderTabBar() {
		return <InboxTabBar />
	}

	_onLoaiTinChange(value) {
		this.props.actions.onInboxFieldChange('loaiTin', value);
		let currentInboxList = this.props.inbox.inboxList;
		let allInboxDS = [];
		let loaiTin = this.decodeLoaiTin(value);
		currentInboxList.map(function (data) {
			if (loaiTin == undefined || data.relatedToAds.loaiTin == loaiTin) {
				allInboxDS.push(data);
			}
		});
		this.props.actions.onInboxFieldChange('allInboxDS', myDs.cloneWithRows(allInboxDS));
	}

	decodeLoaiTin(value) {
		if ('all' == value) {
			return undefined;
		}
		else if ('sell' == value) {
			return 0;
		}
		else {
			return 1;
		}
	}

	render() {
		log.info("Calling Inbox.render ..., loggedIn = ", this.props.global.loggedIn);
		let loaiTin = this.props.inbox.loaiTin;

		if (this.props.global.loggedIn) {
			return (
				<View style={styles.container}>
					<HomeHeader />
					<View style = {styles.tabbar}>
						<LikeTabButton name={'all'}
									   onPress={this._onLoaiTinChange.bind(this)}
									   selected={loaiTin === 'all'}>TẤT CẢ</LikeTabButton>
						<LikeTabButton name={'sell'}
									   onPress={this._onLoaiTinChange.bind(this)}
									   selected={loaiTin === 'sell'}>BÁN</LikeTabButton>
						<LikeTabButton name={'hire'}
									   onPress={this._onLoaiTinChange.bind(this)}
									   selected={loaiTin === 'hire'}>CHO THUÊ</LikeTabButton>
					</View>
					<FullLine />
					<InboxContent/>


				</View>

			);
		} else {
			return (
				<Login />
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
		borderWidth: 0,
		alignSelf: 'center',
		padding: 5

	},
	tabbar : {
		flexDirection: 'row',
		paddingLeft: 5,
		paddingRight: 5,
		borderColor: '#dfdfdf',
		borderBottomWidth: 0,
		paddingTop: 0
	},

});


export default connect(mapStateToProps, mapDispatchToProps)(Inbox);