import React, {StyleSheet, PixelRatio} from 'react-native';

module.exports = StyleSheet.create({
	search: {
			marginTop: 15,
	    flexDirection: 'row',
	    alignItems: 'center',
			justifyContent: 'center',
			backgroundColor: '#f44336',
	},
	fullWidthContainer: {
			flex: 1,
			alignItems: 'stretch',
			backgroundColor: '#F5FCFF',
	},
	homeDetailInfo: {
			flex: 1,
			justifyContent: 'center',
			alignItems: 'stretch',
			backgroundColor: '#CCC0DA',
	},
	homeRowAlign: {
	    flexDirection: 'row',
			alignItems: 'flex-start',
	    justifyContent: 'space-between',
			margin: 15,
	},
	searchButton: {
			flex: 1,
			alignItems: 'stretch',
			justifyContent: 'flex-end',
	},
  searchButtonWrapper: {
	    flexDirection: 'row',
	    justifyContent: 'space-between',
			backgroundColor: 'green',
  },
	searchButtonText: {
			marginLeft: 15,
			marginRight: 15,
			marginTop: 10,
			marginBottom: 10,
			color: 'white'
	},
	container: {
			flex: 1,
			justifyContent: 'center',
			alignItems: 'stretch',
			backgroundColor: '#F5FCFF',
	},
	welcome: {
			marginTop: -50,
			marginBottom: 50,
			fontSize: 16,
			textAlign: 'center',
			margin: 10,
	},
	stuff: {
			textAlign: 'center',
			fontSize: 22,
			marginBottom: 15,
	},
	instructions: {
			textAlign: 'center',
			color: '#333333',
			fontSize: 13,
	},
	notes: {
		marginTop: 20,
		fontSize: 10,
	},
	link: {
		color: '#3257DA',
	},
});
