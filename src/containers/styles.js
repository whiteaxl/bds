import React, {Component} from 'react';

import {StyleSheet, PixelRatio} from 'react-native';

import gui from '../lib/gui';

module.exports = StyleSheet.create({
	searchDetailImage: {
			justifyContent: 'center',
			alignItems: 'stretch',
			flex: 1,
	    alignSelf: 'auto',
	},
	searchDetailRowAlign: {
			flexDirection: 'row',
			alignItems: 'flex-start',
			justifyContent: 'space-around',
	},
	searchDetailInfo: {
			flex: 1,
			justifyContent: 'center',
			alignItems: 'stretch',
			backgroundColor: 'transparent',
	},
	customPageHeader: {
			flexDirection: 'row',
			alignItems: 'flex-start',
			justifyContent: 'space-between',
			backgroundColor: gui.mainColor,
	},
	customPageTitle: {
			marginTop: 35,
			marginLeft: 15,
			marginRight: 15,
			marginBottom: 10,
			alignItems: 'stretch',
	},
	customPageTitleText: {
			color: 'white',
			fontSize: 14,
			fontWeight: 'bold',
			textAlign: 'center',
	},
	pageHeader: {
	    alignItems: 'center',
			justifyContent: 'center',
			backgroundColor: gui.mainColor,
	},
	search: {
		marginTop: 25,
	    flexDirection: 'row',
	    alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: gui.mainColor,
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

  searchListButton: {
	    flexDirection: 'row',
	    justifyContent: 'space-around',
			backgroundColor: 'white',
  },
	searchListButtonText: {
			marginLeft: 15,
			marginRight: 15,
			marginTop: 10,
			marginBottom: 10,
			color: gui.mainColor
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
		margin: 0,
	},
	searchContent: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	
	fullWidthContainer: {
			flex: 1,
			alignItems: 'stretch',
			backgroundColor: 'white',
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
	},
	searchFilterDetail: {
			flex: 1,
			flexDirection:"column",
			//borderWidth:1,
			//borderColor: "green"
	},
  scrollView: {
			flex: 1,
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
			flex: 0.5,
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
			backgroundColor: gui.mainColor,
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
			backgroundColor: 'white',
	},
	welcome: {
			marginTop: -50,
			marginBottom: 50,
			fontSize: 16,
			textAlign: 'center',
			margin: 10,
	},
	boldLabel: {
			fontSize: 16,
			fontWeight: 'bold',
    		textAlign: 'center',
			backgroundColor: 'grey',
    		marginLeft: 10,
			color: 'white',
	},
	boldTitle: {
			fontSize: 16,
			fontWeight: 'bold',
    		textAlign: 'left',
			backgroundColor: 'transparent',
    		marginLeft: 10,
			color: 'white',
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
		color: 'red',
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
