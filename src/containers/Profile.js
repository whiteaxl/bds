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



class Profile extends Component {
  render() {
    return (
			<View style={styles.container}>
				<Text style={styles.welcome}>........Profile screen........</Text>
                <Text style={{fontFamily: 'Open Sans'}}>
                    Very long text to test new font that we will use for all app
                    Spacious, Move In Condition, 2 bedroom corner apartment that has 2 exposures. There are
                    plenty of closets. Walk to train, bus, shopping, dining, beach, marina and NewRoc Center.
                    Exercise room and laundry in building
                </Text>
				<Text style={styles.stuff}>Welcome: {this.props.global.currentUser.userID}</Text>
			</View>
		)
	}
}



export default connect(mapStateToProps, mapDispatchToProps)(Profile);

