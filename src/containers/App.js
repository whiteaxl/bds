import React, {
	StyleSheet, 
	View, 
	Text
} from 'react-native';


import Tabbar from '../components/Tabbar'

export default class App extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		console.log(this.props.user);
		return (
			<Tabbar user={this.props.user} facade={this.props.facade} />
		)
	}
}