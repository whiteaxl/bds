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
        <Text style={styles.welcome}>
        Search filters
        </Text>
        <View style={styles.buttonWrapper}>
          <Button onPress={this.onCancel}>Cancel</Button>
          <Button onPress={this.onApply}>Apply</Button>
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
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);
