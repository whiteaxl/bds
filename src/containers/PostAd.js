import React, {
	StyleSheet, 
	View, 
	Text
} from 'react-native';


export default class PostAd extends React.Component {
	render() {
		return(
			<View style={styles.container}>
				<Text> PostAd </Text>
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