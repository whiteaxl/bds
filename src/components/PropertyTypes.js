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


import React, {View, Component, SegmentedControlIOS, Text, StyleSheet} from 'react-native'

import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';

import CommonHeader from '../components/CommonHeader';
import DanhMuc from '../assets/DanhMuc';

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

var LoaiNhaDatKey = [
    1,
    2,
    3,
    4,
    5,
    99
];

var LoaiNhaDatBan = [
    DanhMuc['ban'][LoaiNhaDatKey[0]],
    DanhMuc['ban'][LoaiNhaDatKey[1]],
    DanhMuc['ban'][LoaiNhaDatKey[2]],
    DanhMuc['ban'][LoaiNhaDatKey[3]],
    DanhMuc['ban'][LoaiNhaDatKey[4]],
    DanhMuc['ban'][LoaiNhaDatKey[5]]
];

var LoaiNhaDatThue = [
    DanhMuc['thue'][LoaiNhaDatKey[0]],
    DanhMuc['thue'][LoaiNhaDatKey[1]],
    DanhMuc['thue'][LoaiNhaDatKey[2]],
    DanhMuc['thue'][LoaiNhaDatKey[3]],
    DanhMuc['thue'][LoaiNhaDatKey[4]],
    DanhMuc['thue'][LoaiNhaDatKey[5]]
];

class PropertyTypes extends Component {
  constructor() {
    super();
  }

  render() {
    var values = this.props.search.form.fields.loaiTin=='ban' ? LoaiNhaDatBan : LoaiNhaDatThue ;
    var loaiNhaDat = this.getValueByKey(values, this.props.search.form.fields.loaiNhaDat);
    return (
      <View style={myStyles.fullWidthContainer}>
        <CommonHeader headerTitle={"Loại nhà đất"} />

        <MultipleChoice
          options={values}
          style={{paddingTop: 10, paddingLeft: 20, paddingRight: 20}}
          selectedOptions={[loaiNhaDat]}
          maxSelectedOptions={1}//{this.props.search.form.fields.loaiTin=='ban' ? nhaDatBan.length : nhaDatChoThue.length}
          onSelection={(option)=>this._onPropertyTypeSelected(option)}
        />
      </View>
    );
  }

  _onBack() {
    Actions.pop();
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



// Later on in your styles..
var myStyles = StyleSheet.create({
  fullWidthContainer: {
      flex: 1,
      alignItems: 'stretch',
      backgroundColor: '#F5FCFF'
  }
});

