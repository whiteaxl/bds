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
          Tìm kiếm BDS
        </Icon.Button>

        <View style={styles.homeDetailInfo}>
          <View style={styles.homeDetailInfo}>
  				    <Text style={styles.welcome}>Thông tin dự án</Text>
          </View>
          <View style={styles.homeDetailInfo}>
  				    <Text style={styles.welcome}>Nhà đất bán</Text>
              <View style={styles.homeRowAlign}>
                <Text style={styles.welcome}>Bán căn hộ chung cư</Text>
                <Text style={styles.welcome}>Bán nhà riêng</Text>
              </View>
              <View style={styles.homeRowAlign}>
                <Text style={styles.welcome}>Bán nhà mặt phố</Text>
                <Text style={styles.welcome}>Bán biệt thự, liền kề</Text>
              </View>
              <View style={styles.homeRowAlign}>
                <Text style={styles.welcome}>Bán đất</Text>
                <Text style={styles.welcome}>Bán các bds khác</Text>
              </View>
          </View>
          <View style={styles.homeDetailInfo}>
  				    <Text style={styles.welcome}>Nhà đất cho thuê</Text>
              <View style={styles.homeRowAlign}>
                <Text style={styles.welcome}>Thuê chung cư</Text>
                <Text style={styles.welcome}>Thuê nhà riêng</Text>
              </View>
              <View style={styles.homeRowAlign}>
                <Text style={styles.welcome}>Thuê nha mặt phố</Text>
                <Text style={styles.welcome}>Cho thuê văn phòng</Text>
              </View>
              <View style={styles.homeRowAlign}>
                <Text style={styles.welcome}>Thuê cửa hàng, ki-ốt</Text>
                <Text style={styles.welcome}>Thuê bds khác</Text>
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
