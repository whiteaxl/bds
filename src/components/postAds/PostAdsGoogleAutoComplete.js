'use strict';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as globalActions from '../../reducers/global/globalActions';
import * as searchActions from '../../reducers/search/searchActions';

import {Map} from 'immutable';

import  React, {Component} from 'react';

import {
    Text, View, ListView
    , TextInput, StyleSheet, RecyclerViewBackedScrollView
    , TouchableHighlight, StatusBar
} from 'react-native'

import {Actions} from 'react-native-router-flux';

var gui = require("../../lib/gui");
var log = require("../../lib/logUtil");

/**
 * ## Redux boilerplate
 */
const actions = [
  globalActions,
  searchActions
];

function mapStateToProps(state) {
  return {
    ...state
  };
}

function mapDispatchToProps(dispatch) {
  const creators = Map()
      .merge(...actions)
      .filter(value => typeof value === 'function')
      .toObject();

  return {
    actions: bindActionCreators(creators, dispatch),
    dispatch
  };
}

var {GooglePlacesAutocomplete} = require('react-native-google-places-autocomplete');

class PostAdsGoogleAutoComplete extends React.Component {
  constructor(props) {
    super(props);
    console.log("=================== PostAdsGoogleAutoComplete constructor");
    console.log(props);
    StatusBar.setBarStyle('default');
  }

  _onPress(data) {
    log.enter("PlacesAutocomplete._onPress", data);
  }

  _handleSearchAction(){
    console.log("PostAdsGoogleAutoComplete handleSearchAction");
  }

  _onCancelPress() {
    Actions.pop();
    StatusBar.setBarStyle('light-content');
  }

  render() {
    log.info("Place Autocomplete - render, search=", this.props.search);

    return (

        <GooglePlacesAutocomplete
            placeholder='Search'
            minLength={2} // minimum length of text to search
            autoFocus={false}
            listViewDisplayed='auto'    // true/false/undefined
            fetchDetails={true}

            onPress={(data, details = null) => {this.props.onPress(data, details)}}

            getDefaultValue={() => {
              return ''; // text input default value
            }}
            query={{
              // available options: https://developers.google.com/places/web-service/autocomplete
              key: 'AIzaSyAnioOM0qiWwUoCz8hNS8B2YuzKiYYaDdU',
              language: 'vn', // language of the results
              components:'country:vn' //restrict to VN
            }}
            styles={{
              description: {
                //fontWeight: 'bold',
                fontFamily : gui.fontFamily,
                fontSize: 15,
                marginLeft:10,
                marginRight: 10
                },
                predefinedPlacesDescription: {
                  color: '#1faadb'
                },
                container: {
                  paddingTop:20,
                  backgroundColor: 'white'
                },
                row : {
                  height: 44
                },
                separator:{
                  backgroundColor: "#E9E9E9",
                  marginLeft: 10,
                  marginRight: 10
                }
            }}

            currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
            currentLocationLabel="vị trí hiện tại"
            nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
            GoogleReverseGeocodingQuery={{
          // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
        }}
            GooglePlacesSearchQuery={{
          // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
          rankby: 'distance',
          types: 'food',
        }}


            predefinedPlaces={[]}
        />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostAdsGoogleAutoComplete);