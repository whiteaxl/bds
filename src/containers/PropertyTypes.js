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

const nhaDatBan = [
          'Tất cả',
          'Bán căn hộ chung cư',
          'Bán nhà riêng',
          'Bán biệt thự, liền kề',
          'Bán đất',
          'Bán các bds khác'
          ]

const nhaDatChoThue = [
          'Tất cả',
          'Cho Thuê căn hộ chung cư',
          'Cho Thuê nhà riêng',
          'Cho Thuê nhà mặt phố', 
          'Cho Thuê văn phòng', 
          'Cho Thuê cửa hàng, ki-ốt',
          'Cho Thuê các bds khác'
          ]


class PropertyTypes extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <View style={styles.container}>
        
        <MultipleChoice
          options={this.props.search.form.fields.loaiTin=='ban' ? nhaDatBan : nhaDatChoThue}
          style={{paddingTop: 80, paddingLeft: 20, paddingRight: 20}}
          selectedOptions={['Tất cả']}
          maxSelectedOptions={this.props.search.form.fields.loaiTin=='ban' ? nhaDatBan.length : nhaDatChoThue.length}
          onSelection={(option)=>{this.handlePropertyTypeChosen}}
        />  
        
      </View>
     
    );
  }
  
  handlePropertyTypeChosen(option) {
    alert(option);
    this.props.actions.onSearchFieldChange("loaiNhaDat", option);
    
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(PropertyTypes);
