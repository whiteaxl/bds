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



import React, { Text, View, Component } from 'react-native'

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



class Home extends Component {
  render() {
    return (
      <View style={styles.fullWidthContainer}>
        <Icon.Button onPress={this.handleSearchButton}
          name="search" backgroundColor="#f44336"
          underlayColor="gray"
          style={styles.search}>
          Search BDS
        </Icon.Button>

        <View style={styles.homeDetailInfo}>
          <View style={styles.homeDetailInfo}>
  				    <Text style={styles.welcome}>Thong tin du an</Text>
          </View>
          <View style={styles.homeDetailInfo}>
  				    <Text style={styles.welcome}>Nha dat ban</Text>
              <View style={styles.homeRowAlign}>
                <Text style={styles.welcome}>Ban can ho chung cu</Text>
                <Text style={styles.welcome}>Ban nha rieng</Text>
              </View>
              <View style={styles.homeRowAlign}>
                <Text style={styles.welcome}>Ban nha mat pho</Text>
                <Text style={styles.welcome}>Ban biet thu, lien ke</Text>
              </View>
              <View style={styles.homeRowAlign}>
                <Text style={styles.welcome}>Ban dat</Text>
                <Text style={styles.welcome}>Ban cac bds khac</Text>
              </View>
          </View>
          <View style={styles.homeDetailInfo}>
  				    <Text style={styles.welcome}>Nha dat cho thue</Text>
              <View style={styles.homeRowAlign}>
                <Text style={styles.welcome}>Thue chung cu</Text>
                <Text style={styles.welcome}>Thue nha rieng</Text>
              </View>
              <View style={styles.homeRowAlign}>
                <Text style={styles.welcome}>Thue nha mat pho</Text>
                <Text style={styles.welcome}>Cho thue van phong</Text>
              </View>
              <View style={styles.homeRowAlign}>
                <Text style={styles.welcome}>Thue cua hang, ki-ot</Text>
                <Text style={styles.welcome}>Thue bds khac</Text>
              </View>
          </View>
        </View>
      </View>
		)
	}
  handleSearchButton() {
    Actions.Search();
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
