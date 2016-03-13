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
import Api from '../components/Api';

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
    Api.getItems()
      .then((data) => {
        console.log(data);
      });
    return (
			<View style={styles.container}>
				<Text style={styles.welcome}>Kết quả tìm kiếm 1</Text>
        <Text style={styles.welcome}>Kết quả tìm kiếm 2</Text>
        <Text style={styles.welcome}>Kết quả tìm kiếm 3</Text>
			</View>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchResultList);
