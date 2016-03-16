import React, {StyleSheet, PixelRatio} from 'react-native';

module.exports = StyleSheet.create({
	search: {
			marginTop: 15,
	    flexDirection: 'row',
	    alignItems: 'center',
			justifyContent: 'center',
			backgroundColor: '#f44336',
	},
  row: {
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#F6F6F6',
  },
  separator: {
    height: 1,
    backgroundColor: '#CCCCCC',
  },
	thumb: {
		justifyContent: 'flex-end',
		alignItems: 'stretch',
		height: 128,
    alignSelf: 'auto',
	},
  text: {
    fontSize: 16,
    textAlign: 'left',
		backgroundColor: 'transparent',
    margin: 10,
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
	searchFilter: {
			flex: 1,
			alignItems: 'stretch',
			justifyContent: 'flex-start',
			marginTop: 65,
	},
	searchFilterDetail: {
			flex: 1,
			alignItems: 'flex-start',
			justifyContent: 'flex-start',
			marginTop: 65,
	},
	searchFilterAttribute: {
			margin: 15,
	},
	searchMoreFilterButton: {
			flex: 1,
			alignItems: 'center',
			justifyContent: 'center',
	},
  searchFilterButton: {
	    flexDirection: 'row',
	    justifyContent: 'space-between',
  },
	searchFilterButtonText: {
			marginLeft: 50,
			marginRight: 50,
			marginTop: 10,
			marginBottom: 10,
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
