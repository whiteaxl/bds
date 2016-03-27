'use strict';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

/**
 * The actions we need
 */
import * as globalActions from '../reducers/global/globalActions';

/**
 * Immutable Map
 */
import {Map} from 'immutable';



import React, { Text, View, Component, MapView, StyleSheet } from 'react-native'

import {Actions} from 'react-native-router-flux';

import Icon from 'react-native-vector-icons/FontAwesome';
import MapApi from '../lib/MapApi';
import styles from './styles';
import CommonHeader from '../components/CommonHeader';

import gui from '../lib/gui';


/**
* ## Redux boilerplate
*/
const actions = [
  globalActions
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



class SearchResultMap extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    var pin = {latitude: 0, longitude: 0};
    return (
      <View style={styles.fullWidthContainer}>
        <CommonHeader headerTitle={"Bản đồ"} />

        <MapView
          annotations={[pin]}
          onRegionChangeComplete={this.onRegionChangeComplete}
          style={styles.searchMapView}>
        </MapView>
        <View style={myStyles.searchButton}>
          <View style={myStyles.searchListButton}>
            <Icon.Button onPress={this.onLocalInfo}
              name="location-arrow" backgroundColor="white"
              underlayColor="gray" color={gui.blue1}
              style={myStyles.searchListButtonText} >
              Local Info
            </Icon.Button>
            <Icon.Button onPress={this.onSaveSearch}
              name="hdd-o" backgroundColor="white"
              underlayColor="gray" color={gui.blue1}
              style={myStyles.searchListButtonText} >
              Lưu tìm kiếm
            </Icon.Button>
            <Icon.Button onPress={this.onList}
              name="list" backgroundColor="white"
              underlayColor="gray" color={gui.blue1}
              style={myStyles.searchListButtonText} >
              Danh sách
            </Icon.Button>
          </View>
        </View>
			</View>
		)
	}
  onRegionChangeComplete(region) {
    MapApi(region.latitude, region.longitude)
      .then((data) => {
        console.log(data);
      });
  }
  onLocalInfo() {
    console.log("On Local Info pressed!");
  }
  onSaveSearch() {
    console.log("On Save Search pressed!");
  }
  onList() {
    Actions.pop();
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchResultMap);


// Later on in your styles..
var myStyles = StyleSheet.create({
  searchListButtonText: {
      marginLeft: 15,
      marginRight: 15,
      marginTop: 10,
      marginBottom: 10,
  },

  searchListButton: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: 'white',
  },

  searchButton: {
      alignItems: 'stretch',
      justifyContent: 'flex-end',
  },
});
