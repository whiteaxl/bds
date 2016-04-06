'use strict';

var React = require('react-native');

var {View,StyleSheet} = React;


var {GooglePlacesAutocomplete} = require('react-native-google-places-autocomplete');

//const homePlace = {description: 'Home', geometry: { location: { lat: 48.8152937, lng: 2.4597668 } }};

var PlacesAutoComplete = React.createClass({
    render() {
        return (

        <GooglePlacesAutocomplete
                placeholder='Search'
                minLength={2} // minimum length of text to search
                autoFocus={false}
                fetchDetails={true}
                onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
          console.log(data);
          console.log(details);
        }}
                getDefaultValue={() => {
          return ''; // text input default value
        }}
                query={{
          // available options: https://developers.google.com/places/web-service/autocomplete
          key: 'AIzaSyAnioOM0qiWwUoCz8hNS8B2YuzKiYYaDdU',
          language: 'en', // language of the results
          types: '(regions)', // default: 'geocode', cities,regions
          componentRestrictions: {country: "vn"}

        }}
                styles={{
          description: {
            fontWeight: 'bold',
          },
          predefinedPlacesDescription: {
            color: '#1faadb',
          },
          container: {
            top:20
          }
        }}

                currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
                currentLocationLabel="Current location"
                nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
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

                predefinedPlacesAlwaysVisible={true}
            />
        );
    }
});


module.exports = PlacesAutoComplete;