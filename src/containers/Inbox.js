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

import InboxTabBar from "../components/inbox/InboxTabBar";

import AllInboxTab from "../components/inbox/AllInboxTab";

import ScrollableTabView from 'react-native-scrollable-tab-view';

import InboxHeader from '../components/inbox/InboxHeader';

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

  render() {
		console.log("Calling Inbox.render ..., loggedIn = ", this.props.global.loggedIn);

		if (this.props.global.loggedIn) {
			return (
				<View style={styles.container}>
					<InboxHeader headerTitle={"Chat"}/>

					<ScrollableTabView page={this.props.auth.activeRegisterLoginTab}
														 renderTabBar={this.renderTabBar.bind(this)}
														 style={styles.scrollContainer}
														 tabBarUnderlineColor={gui.mainColor}
														 tabBarActiveTextColor={gui.mainColor}
														 onChangeTab={this.onChangeTab.bind(this)}
					>
						<AllInboxTab tabLabel="TẤT CẢ" ref="allTab"/>
						<AllInboxTab tabLabel="MUA" ref="buyTab"/>
						<AllInboxTab tabLabel="BÁN/CHO THUÊ" ref="sellTab"/>
					</ScrollableTabView>
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
		flex:1
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

	}
});


export default connect(mapStateToProps, mapDispatchToProps)(Inbox);