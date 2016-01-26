'use strict';
import React, {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import {Router, Route, Schema, Animations, TabBar} from 'react-native-router-flux';

import Launch from './containers/Launch';
import App from './containers/App';

//screen header
class Header extends React.Component {
    render(){
        return <Text></Text>
    }
}


export default class MainBDS extends React.Component {
	render() {
		return (
			<Router hideNavBar={true}>
				<Route name="launch" header={Header} component={Launch} wrapRouter={true} title="Launch title" hideNavBar={true} initial={true}/>		
				<Route name="app" component={App} title="Replace" type="replace"/>
			</Router>
		);
	}
} 
