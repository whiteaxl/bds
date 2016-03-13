'use strict';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

/**
 * The actions we need
 */
import * as globalActions from '../reducers/global/globalActions';

/**
 * Immutable Mapn
 */
import {Map} from 'immutable';



import React, { Text, View, Component, Navigator } from 'react-native'

import Button from 'react-native-button';
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';

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



class Search extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.searchFilter}>
          <View style={styles.searchFilterButton}>
            <Button onPress={this.onForSale}
            style={styles.searchFilterButtonText}>FOR SALE</Button>
            <Button onPress={this.onForRent}
            style={styles.searchFilterButtonText}>FOR RENT</Button>
            <Button onPress={this.onSaveSearch}
            style={styles.searchFilterButtonText}>Saved search</Button>
          </View>
          <View style={styles.searchFilterDetail}>
            <View style={styles.searchFilterAttribute}>
              <Text style={styles.welcome}>
              Price Range
              </Text>
            </View>
            <View style={styles.searchFilterAttribute}>
              <Text style={styles.welcome}>
              Property Types
              </Text>
            </View>
            <View style={styles.searchFilterAttribute}>
              <Text style={styles.welcome}>
              Dien tich
              </Text>
            </View>
          </View>
          <View style={styles.searchMoreFilterButton}>
            <View style={styles.searchFilterAttribute}>
              <Button onPress={this.onMoreOption}>More</Button>
            </View>
            <View style={styles.searchFilterAttribute}>
              <Button onPress={this.onResetFilters}>Reset Filters</Button>
            </View>
          </View>
        </View>
        <View style={styles.searchButton}>
          <View style={styles.searchButtonWrapper}>
            <Button onPress={this.onCancel}
            style={styles.searchButtonText}>Cancel</Button>
            <Button onPress={this.onApply}
            style={styles.searchButtonText}>Apply</Button>
          </View>
        </View>
      </View>
    );
  }
  onCancel() {
    Actions.pop();
  }
  onApply() {
    console.log("On Apply pressed!");
  }
  onForSale() {
    console.log("On For Sale pressed!");
  }
  onForRent() {
    console.log("On For Rent pressed!");
  }
  onMoreOption() {
    console.log("On More Option pressed!");
  }
  onResetFilters() {
    console.log("On Reset Filters pressed!");
  }
  onSaveSearch() {
    console.log("On Save Search pressed!");
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);
