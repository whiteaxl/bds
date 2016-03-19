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


import React, {View, Component, SegmentedControlIOS} from 'react-native'

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
      ...state,
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

var LoaiNhaDatBan = [
    "Bán căn hộ chung cư",
    "Bán nhà riêng",
    "Bán nhà mặt phố",
    "Bán biệt thự, liền kề",
    "Bán đất",
    "Bán các bds khác"
];

var LoaiNhaDatThue = [
    "Cho Thuê căn hộ chung cư",
    "Cho Thuê nhà riêng",
    "Cho Thuê nhà mặt phố",
    "Cho Thuê văn phòng",
    "Cho Thuê cửa hàng, ki-ốt",
    "Cho Thuê các bds khác"
];

var LoaiNhaDatKey = [
    1,
    2,
    3,
    4,
    5,
    99
];

class PropertyTypes extends Component {
  constructor() {
    super();
  }

  render() {
    var values = this.props.search.form.fields.loaiTin=='ban' ? LoaiNhaDatBan : LoaiNhaDatThue ;
    var loaiNhaDat = this.getValueByKey(values, this.props.search.form.fields.loaiNhaDat);
    return (
      <View style={styles.container}>
        <MultipleChoice
          options={values}
          style={{paddingTop: 80, paddingLeft: 20, paddingRight: 20}}
          selectedOptions={[loaiNhaDat]}
          maxSelectedOptions={1}//{this.props.search.form.fields.loaiTin=='ban' ? nhaDatBan.length : nhaDatChoThue.length}
          onSelection={(option)=>this._onPropertyTypeSelected(option)}
        />
      </View>
    );
  }

  _onPropertyTypeSelected(option) {
    var values = this.props.search.form.fields.loaiTin=='ban' ? LoaiNhaDatBan : LoaiNhaDatThue ;
    this.props.actions.onSearchFieldChange("loaiNhaDat", this.getKeyByValue(values, option));
  }

  getValueByKey(values, key) {
    var value = '';
    for (var i = 0; i < LoaiNhaDatKey.length; i++) {
      var loaiKey = LoaiNhaDatKey[i];
      if (key === loaiKey) {
        value = values[i];
        break;
      }
    }
    //console.log(value);
    return value;
  }

  getKeyByValue(values, value) {
    var key = '';
    for (var i = 0; i < values.length; i++) {
      var oneValue = values[i];
      if (value === oneValue) {
        key = LoaiNhaDatKey[i];
        break;
      }
    }
    //console.log(key);
    return key;
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(PropertyTypes);
