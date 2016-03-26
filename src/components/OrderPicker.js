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


import React, {View, Component, Text, StyleSheet} from 'react-native'

import Button from 'react-native-button';
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';

import CommonHeader from '../components/CommonHeader';

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

const orderKeys = [
          '',
          'ngayDangTinDESC',
          'giaDESC',
          'giaASC',
          'soPhongNguASC',
          'dienTichDESC'
        ];

class OrderPicker extends Component {
  constructor() {
    super();
  }

  render() {
    var orderBy = this.getValueByKey(this.props.search.form.fields.orderBy);
    if (!orderBy) {
      orderBy = orderTypes[0];
    }
    return (
      <View style={myStyles.fullWidthContainer}>
        <CommonHeader headerTitle={"Sắp xếp"} />

        <MultipleChoice
          options={orderTypes}
          style={{paddingTop: 10, paddingLeft: 20}}
          selectedOptions={[orderBy]}
          maxSelectedOptions={1}
          onSelection={(option)=>this.handleOrderTypeChosen(option)}
        />
      </View>
    );
  }
  _onBack() {
    Actions.pop();
  }
  handleOrderTypeChosen(option) {
    this.props.actions.onSearchFieldChange("orderBy", this.getKeyByValue(option));
    Actions.pop();
  }

  getValueByKey(key) {
    var value = '';
    for (var i = 0; i < orderKeys.length; i++) {
      var orderKey = orderKeys[i];
      if (key === orderKey) {
        value = orderTypes[i];
        break;
      }
    }
    //console.log(value);
    return value;
  }

  getKeyByValue(value) {
    var key = '';
    for (var i = 0; i < orderTypes.length; i++) {
      var orderType = orderTypes[i];
      if (value === orderType) {
        key = orderKeys[i];
        break;
      }
    }
    //console.log(key);
    return key;
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(OrderPicker);


// Later on in your styles..
var myStyles = StyleSheet.create({
  fullWidthContainer: {
      flex: 1,
      alignItems: 'stretch',
      backgroundColor: '#F5FCFF'
  }
});
