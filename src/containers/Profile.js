import React, {
	StyleSheet, 
	View, 
	Text
} from 'react-native';

import Button from 'apsl-react-native-button';

import ErrorAlert from '../components/ErrorAlert';


export default class Profile extends React.Component {
	logout() {
		new ErrorAlert().checkError({error:'Havent implemented yet!'})
	}

	render() {
		return(
			<View style={styles.container}>
				<Text> Profile screen: </Text>
				<View style={{}}>
					<Button style={{
							backgroundColor: 'lightgreen', width: 100
						}} 
						textStyle={{fontSize: 18}}
						onPress={this.logout}
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
