'use strict';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as globalActions from '../reducers/global/globalActions';
import * as searchActions from '../reducers/search/searchActions';

import {Map} from 'immutable';

import React, {Component} from 'react';
import {View, Text, StyleSheet, StatusBar } from 'react-native'

import {Actions} from 'react-native-router-flux';

import CommonHeader from '../components/CommonHeader';

import MultipleChoice from './MultipleChoice';

import gui from '../lib/gui';

import PlaceUtil from '../lib/PlaceUtil';

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

const orderTypes1 = [
    'Mặc định',
    'Ngày đăng',
    'Giá (Tăng dần)',
    'Giá (Giảm dần)',
    'Giá/m²',
    'Số phòng ngủ',
    'Diện tích'
];

const orderKeys1 = [
    '',
    'ngayDangTinDESC',
    'giaASC',
    'giaDESC',
    'giaM2',
    'soPhongNguASC',
    'dienTichDESC'
];

const orderTypes2 = [
    'Mặc định',
    'Ngày đăng',
    'Giá (Tăng dần)',
    'Giá (Giảm dần)',
    'Giá/m²',
    'Số phòng ngủ',
    'Khoảng cách',
    'Diện tích'
];

const orderKeys2 = [
    '',
    'ngayDangTinDESC',
    'giaASC',
    'giaDESC',
    'giaM2',
    'soPhongNguASC',
    'khoangCach',
    'dienTichDESC'
];

class OrderPicker extends Component {
  constructor(props) {
    super();
    StatusBar.setBarStyle('default');
      var place = props.search.form.fields.place;
      var isDiaDiem = PlaceUtil.isDiaDiem(place);
      var orderBy = this.getValueByKey(props.search.form.fields.orderBy, isDiaDiem);
      if (!orderBy) {
          orderBy = orderTypes[0];
      }
      this.state = {
          orderBy: orderBy,
          isDiaDiem: isDiaDiem
      };
  }

  render() {
    var {isDiaDiem} = this.state;
    var orderTypes = isDiaDiem ? orderTypes2 : orderTypes1;

    return (
      <View style={myStyles.fullWidthContainer}>
        <CommonHeader headerTitle={"Sắp xếp"} />
        <View style={myStyles.headerSeparator} />

        <MultipleChoice
          options={orderTypes}
          style={myStyles.choiceList}
          selectedOptions={[this.state.orderBy]}
          maxSelectedOptions={1}
          onSelection={(option)=>this._onApply(option)}
        />

      </View>
    );
  }
  _onBack() {
    Actions.pop();
  }

    _onApply(option) {
        var {isDiaDiem} = this.state;
        this.props.actions.onSearchFieldChange("orderBy", this.getKeyByValue(option, isDiaDiem));

        this.props.actions.search(
            this.props.search.form.fields
            , () => {
                Actions.pop();
            }
        );
    }

  getValueByKey(key, isDiaDiem) {
    var orderTypes = isDiaDiem ? orderTypes2 : orderTypes1;
    var orderKeys = isDiaDiem ? orderKeys2 : orderKeys1;
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

  getKeyByValue(value, isDiaDiem) {
    var orderTypes = isDiaDiem ? orderTypes2 : orderTypes1;
    var orderKeys = isDiaDiem ? orderKeys2 : orderKeys1;
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
      backgroundColor: 'white'
  },
    choiceList: {
        paddingTop: 10,
        paddingLeft: 26,
        paddingRight: 0
    },
    searchButton: {
        alignItems: 'stretch',
        justifyContent: 'flex-end'
    },
    searchButtonWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: gui.mainColor,
        height: 44
    },
    searchButtonText: {
        marginLeft: 17,
        marginRight: 17,
        marginTop: 10,
        marginBottom: 10,
        color: 'white',
        fontSize: gui.buttonFontSize,
        fontFamily: gui.fontFamily,
        fontWeight : 'normal'
    },
    headerSeparator: {
        marginTop: 2,
        borderTopWidth: 1,
        borderTopColor: gui.separatorLine
    }
});
