import React, {
	StyleSheet, 
	View, 
	Text
} from 'react-native';


export default class Home extends React.Component {
	render() {
		return(
			<View style={styles.container}>
				<Text> Home - Welcome </Text>
				<Text> {this.props.user.name} </Text>
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