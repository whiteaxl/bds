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



import React, { Text, View, Component, MapView } from 'react-native'

import Button from 'react-native-button';
import {Actions} from 'react-native-router-flux';

import Icon from 'react-native-vector-icons/FontAwesome';
import MapApi from '../components/MapApi';
import styles from './styles';


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
        <View style={styles.customPageHeader}>
          <Icon.Button onPress={this.onList}
            name="chevron-left" backgroundColor="#f44336"
            underlayColor="gray"
            style={styles.search} >
          </Icon.Button>
          <View style={styles.customPageTitle}>
            <Text style={styles.customPageTitleText}>
              Bản đồ
            </Text>
          </View>
        </View>

        <MapView
          annotations={[pin]}
          onRegionChangeComplete={this.onRegionChangeComplete}
          style={styles.searchMapView}>
        </MapView>
        <View style={styles.searchButton}>
          <View style={styles.searchListButton}>
            <Button onPress={this.onLocalInfo}
              style={styles.searchListButtonText}>Local Info</Button>
            <Button onPress={this.onSaveSearch}
              style={styles.searchListButtonText}>Lưu tìm kiếm</Button>
            <Button onPress={this.onList}
              style={styles.searchListButtonText}>Danh sách</Button>
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
