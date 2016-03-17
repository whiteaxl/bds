'use strict';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

/**
 * The actions we need
 */
import * as globalActions from '../reducers/global/globalActions';
import * as searchActions from '../reducers/search/searchActions';

/**
 * Immutable Mapn
 */
import {Map} from 'immutable';


import React, {View, Component} from 'react-native'

import Button from 'react-native-button';
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';

import styles from './styles';

import MultipleChoice from 'react-native-multiple-choice';

/**
* ## Redux boilerplate
*/
const actions = [
  globalActions,
  searchActions
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

const orderTypes = [
          'Mặc định',
          'Ngày nhập',
          'Giá (Giảm dần)',
          'Giá (Tăng dần)',
          'Số phòng ngủ',
          'Diện tích'
        ];


class OrderPicker extends Component {
  constructor() {
    super();
  }

  render() {
    var orderBy = this.props.search.form.fields.orderBy;
    if (!orderBy) {
      orderBy = orderTypes[0];
    }
    return (
      <View style={styles.container}>

        <MultipleChoice
          options={orderTypes}
          style={{paddingTop: 80, paddingLeft: 20}}
          selectedOptions={[orderBy]}
          maxSelectedOptions={1}
          onSelection={(option)=>this.handleOrderTypeChosen(option)}
        />
      </View>
    );
  }
  handleOrderTypeChosen(option) {
    this.props.actions.onSearchFieldChange("orderBy", option);
    Actions.pop();
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(OrderPicker);
