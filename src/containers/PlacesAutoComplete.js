'use strict';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as globalActions from '../reducers/global/globalActions';
import * as searchActions from '../reducers/search/searchActions';

import {Map} from 'immutable';

import  React, {Component} from 'react';

import {
  Text, View, ListView
  , TextInput, StyleSheet, RecyclerViewBackedScrollView
  , TouchableHighlight, StatusBar
} from 'react-native'

import {Actions} from 'react-native-router-flux';

var gui = require("../lib/gui");
var log = require("../lib/logUtil");

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

var {GooglePlacesAutocomplete} = require('../components/GooglePlacesAutocomplete');

//const homePlace = {description: 'Home', geometry: { location: { lat: 48.8152937, lng: 2.4597668 } }};

class PlacesAutoComplete extends React.Component {
  constructor(props) {
    super(props);
    StatusBar.setBarStyle('default');
  }

  _onPress(data, details = null) {
    //console.log(data);
    log.enter("PlacesAutocomplete._onPress", data, details);

    if (data.isRecent || data.isSaveSearch) {
      this.props.actions.loadSavedSearch(data);
    } else {
      let value = {
        placeId: data.place_id,
        relandTypeName: data.relandTypeName,
        fullName: data.fullName,
        currentLocation: data.currentLocation
      };
      console.log("PlacesAutoComplete, place cridential=", value);

      this.props.actions.onSearchFieldChange("place", value);
    }

    //if not call from Search page, then need perform action
    if (this.props.needReload) {
      setTimeout(() => { //must wait for onSearchFieldChange("place", value) complete
        this.props.actions.search(
          this.props.search.form.fields
          , () => {
            Actions.pop();
          }
        );
      }, 100);
    } else {
      Actions.pop();
    }
  }

  _onCancelPress() {
    Actions.pop();
  }

  render() {
    /*
    let predefinedPlaces = [
      {
        name : "Save 1",
        desc : "Desc save 1",
        isSaveSearch: true,
        query : {}
      },
      {
        name : "Save 2",
        desc : "Desc save 2",
        isSaveSearch: true
      },
      {
        name : "recent 1",
        desc : "Desc recent 1",
        isRecent: true
      },
      {
        name : "recent 2",
        desc : "Desc recent 2",
        isRecent: true
      },
      {
        name : "recent 3",
        desc : "Desc recent 3",
        isRecent: true
      },
    ];
    */
    log.info("Place Autocomplete - render, search=", this.props.search);

    let predefinedPlaces = [
      ...this.props.search.saveSearchList,
      ...this.props.search.recentSearchList
    ];

    return (

      <GooglePlacesAutocomplete
        placeholder='Tìm kiếm'
        minLength={2} // minimum length of text to search
        autoFocus={true}
        fetchDetails={false}
        onPress={this._onPress.bind(this)}
        onCancelPress={this._onCancelPress.bind(this)}
        onPress_original={(data, details = null) => {}} // 'details' is provided when fetchDetails = true
        getDefaultValue={() => {
          return ''; // text input default value
        }}
        query={{
          // available options: https://developers.google.com/places/web-service/autocomplete
          key: 'AIzaSyAnioOM0qiWwUoCz8hNS8B2YuzKiYYaDdU',
          language: 'en', // language of the results
          //types: 'geocode', // default: 'geocode', cities,regions
          components:'country:vn' //restrict to VN

        }}
        styles={{
          description: {
            //fontWeight: 'bold',
            fontFamily : gui.fontFamily,
            fontSize: 16,
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

        currentLocation={true} // Will add a 'Vị trí Hiện tại' button at the top of the predefined places list
        nearbyPlacesAPI='GoogleReverseGeocoding' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
        GoogleReverseGeocodingQuery={{
          // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
        }}
        GooglePlacesSearchQuery={{
          // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
          //rankby: 'distance',
          //types: 'food',
        }}


        //filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']}
        // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities

        //predefinedPlaces={[homePlace, workPlace]}

        predefinedPlacesAlwaysVisible={false}
        predefinedPlaces = {predefinedPlaces}
      />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlacesAutoComplete);