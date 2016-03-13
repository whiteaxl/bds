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



import React, { Text, View, Component } from 'react-native'

import Button from 'react-native-button';
import {Actions} from 'react-native-router-flux';

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



class SearchResultList extends Component {
  render() {
    return (
			<View style={styles.container}>
				<Text style={styles.welcome}>........Home screen........</Text>
				<Text style={styles.stuff}>Welcome: {this.props.global.currentUser.userID}</Text>
				<Text style={styles.stuff}>Awesome stuffs are here</Text>
				<Text style={styles.notes}>You can take a tour by using the side menu </Text>
			</View>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchResultList);
