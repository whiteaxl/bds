import React, {StyleSheet, PixelRatio} from 'react-native';

import gui from '../lib/gui';

module.exports = StyleSheet.create({
	pageHeader: {
	    alignItems: 'center',
			justifyContent: 'center',
			backgroundColor: '#f44336',
	},
	search: {
			marginTop: 25,
	    flexDirection: 'row',
	    alignItems: 'center',
			justifyContent: 'center',
			backgroundColor: '#f44336',
	},
  row: {
    justifyContent: 'center',
    backgroundColor: '#F6F6F6',
  },
  separator: {
    height: 1,
    backgroundColor: '#CCCCCC',
  },
	thumb: {
		justifyContent: 'flex-end',
		alignItems: 'stretch',
		height: 181,
    alignSelf: 'auto',
	},
  price: {
    fontSize: 16,
		fontWeight: 'bold',
    textAlign: 'left',
		backgroundColor: 'transparent',
    marginLeft: 10,
		color: 'white',
  },
  text: {
    fontSize: 14,
    textAlign: 'left',
		backgroundColor: 'transparent',
    marginLeft: 10,
		marginBottom: 15,
		margin: 5,
		color: 'white',
  },
  searchListButton: {
	    flexDirection: 'row',
	    justifyContent: 'space-between',
			backgroundColor: 'white',
  },
	searchListButtonText: {
			marginLeft: 15,
			marginRight: 15,
			marginTop: 10,
			marginBottom: 10,
			color: '#5BB622'
	},
	searchListViewRowAlign: {
		backgroundColor: 'transparent',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	heartButton: {
		marginBottom: 10,
	},
	searchListView: {
		marginTop: 65,
		margin: 0,
	},
	searchMapView: {
		flex: 2,
		marginTop: 65,
		margin: 0,
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
			marginTop: 65,
	},
	searchFilterDetail: {
			flex: 1,
			flexDirection:"column",
			//borderWidth:1,
			//borderColor: "green"
	},
	searchFilterAttribute: {
			flexDirection : "row",
			//borderWidth:1,
			//borderColor: "red",
			justifyContent :'space-between',
			padding: 10,
			borderTopWidth: 1,
			borderTopColor: 'lightgray'
	},
	searchMoreFilterAttribute: {
			padding: 10,
			borderTopWidth: 1,
			borderTopColor: 'lightgray'
	},
	searchMoreFilterButton: {
			flex: 2,
			alignItems: 'stretch',
			justifyContent: 'center',
	},
  searchFilterButton: {
	    flexDirection: 'row',

  },
	searchFilterButtonText: {
			marginLeft: 50,
			marginRight: 50,
			marginTop: 10,
			marginBottom: 10,
	},
	searchButton: {
			alignItems: 'stretch',
			justifyContent: 'flex-end',
	},
  searchButtonWrapper: {
	    flexDirection: 'row',
	    justifyContent: 'space-between',
			backgroundColor: gui.green,
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
	searchAttributeLabel : {
		fontSize: 15,
		color: 'black',
	},
	searchAttributeValue : {
		fontSize: 15,
		color: 'gray',
	},
	searchSectionTitle: {
		flexDirection : "row",
		//borderWidth:1,
		//borderColor: "red",
		justifyContent :'space-between',
		padding: 10,
		borderTopWidth: 1,
		borderTopColor: 'lightgray',
		backgroundColor: '#f8f8f8'
	},
});
