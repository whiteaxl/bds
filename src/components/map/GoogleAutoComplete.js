'use strict';

import  React, {Component} from 'react';

import {
    Text, View, ListView
    , TextInput, StyleSheet, RecyclerViewBackedScrollView
    , TouchableHighlight, StatusBar
} from 'react-native'

import {Actions} from 'react-native-router-flux';
import CommonHeader from '../CommonHeader';

var gui = require("../../lib/gui");
var log = require("../../lib/logUtil");

var {GooglePlacesAutocomplete} = require('react-native-google-places-autocomplete');

export default class GoogleAutoComplete extends React.Component {
  constructor(props) {
    super(props);
    StatusBar.setBarStyle('default');
  }

  _onCancelPress() {
    Actions.pop();
    StatusBar.setBarStyle('light-content');
  }

  _onBack() {
    Actions.pop();
  }

  render() {
    log.info("Place Autocomplete - render, search=", this.props.search);

    return (
        <View>
          <CommonHeader headerTitle={"Chọn địa điểm"} />
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

        </View>
    );
  }
}

