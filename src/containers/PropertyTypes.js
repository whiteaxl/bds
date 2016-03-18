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

var LoaiNhaDatBan = {
    1  : "Bán căn hộ chung cư",
    2  : "Bán nhà riêng",
    3  : "Bán nhà mặt phố", 
    4  : "Bán biệt thự, liền kề", 
    5  : "Bán đất", 
    99 : "Bán các bds khác"
}

var LoaiNhaDatThue = {
    1 : "Cho Thuê căn hộ chung cư",
    2 : "Cho Thuê nhà riêng",
    3 : "Cho Thuê nhà mặt phố", 
    4 : "Cho Thuê văn phòng", 
    5 : "Cho Thuê cửa hàng, ki-ốt",
    99: "Cho Thuê các bds khác"
}

class PropertyTypes extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <View style={styles.container}>
        <MultipleChoice
          options={this.props.search.form.fields.loaiTin=='ban' ? LoaiNhaDatBan : LoaiNhaDatThue}
          style={{paddingTop: 80, paddingLeft: 20, paddingRight: 20}}
          selectedOptions={this.props.choice}
          maxSelectedOptions={1}//{this.props.search.form.fields.loaiTin=='ban' ? nhaDatBan.length : nhaDatChoThue.length}
          onSelection={this._onPropertyTypeSelected.bind(this)}//{this.handlePropertyTypeChosen.bind(this)}}
        />  
      </View>
    );
  }
  
  _onPropertyTypeSelected(option) {
    var hash = this.props.search.form.fields.loaiTin=='ban' ? LoaiNhaDatBan : LoaiNhaDatThue ;
    this.props.actions.onSearchFieldChange("loaiNhaDat", option);
  }

  getKeyByValue(hash, value) {
    for( var key in hash){
      if (hash[key]==value)   
        return key;
    }
    return null;
  }
  
}

export default connect(mapStateToProps, mapDispatchToProps)(PropertyTypes);
