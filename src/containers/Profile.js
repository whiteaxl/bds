import React, {
	StyleSheet, 
	View, 
	Text
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Button from 'apsl-react-native-button';

import ErrorAlert from '../components/ErrorAlert';


export default class Profile extends React.Component {
	logout() {
		//new ErrorAlert().checkError({error:'Havent implemented yet!'})
		console.log(this.props.facade)
		this.props.facade.signOut();

		Actions.pop();
	}

	render() {
		return(
			<View style={styles.container}>
				<Text> Name : {this.props.user.name} </Text>
				<Text> Email : {this.props.user.email} </Text>

				<View style={{paddingTop: 10}}>
					<Button style={{
							backgroundColor: 'lightgreen', width: 100
						}} 
						textStyle={{fontSize: 18}}
						onPress={this.logout.bind(this)}
					>
					  Logout
					</Button>
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex : 1, 
		justifyContent : 'center',
		alignItems: 'center'
	}
});
