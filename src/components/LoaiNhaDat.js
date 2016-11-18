'use strict';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as globalActions from '../reducers/global/globalActions';
import * as searchActions from '../reducers/search/searchActions';
import * as postAdsActions from '../reducers/postAds/postAdsActions';

import {Map} from 'immutable';

import React, {Component} from 'react';

import {View, SegmentedControlIOS, Text, StyleSheet} from 'react-native'

import {Actions} from 'react-native-router-flux';

import CommonHeader from '../components/CommonHeader';
import DanhMuc from '../assets/DanhMuc';

import MultipleChoice from './MultipleChoice';

import gui from '../lib/gui';

/**
* ## Redux boilerplate
*/
const actions = [
  globalActions,
  searchActions,
  postAdsActions
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

var loaiNhaDatValues = [];
var loaiNhaDatKeys = [];

class LoaiNhaDat extends Component {
  constructor(props) {
    super(props);
    var loaiTin = props.loaiTin;
    loaiNhaDatKeys = loaiTin=='ban' ? DanhMuc.LoaiNhaDatBanKey : DanhMuc.LoaiNhaDatThueKey;
    loaiNhaDatValues = loaiTin=='ban' ? DanhMuc.getLoaiNhaDatBanValues() : DanhMuc.getLoaiNhaDatThueValues() ;
    var loaiNhaDatVal = this.getLoaiNhaDatVal();
    this.state = {
        loaiNhaDat: loaiNhaDatVal
    };
  
  }

  getLoaiTin() {
      var {loaiTin} = this.props;
      return loaiTin;
  }

  getLoaiNhaDat(loaiTin) {
      var {loaiNhaDat} = this.props;
      return loaiNhaDat;
  }

  onNhaDatSelected(option) {
      var {func, search} = this.props;
      let loaiNhaDatVal = this.getKeyByValue(loaiNhaDatValues, option);
      if (func == 'search') {
          Actions.onLoaiNhaDatChange(loaiNhaDatVal)
      } else {
          null;// this.props.actions.onPostAdsFieldChange("loaiNhaDat", loaiNhaDatVal);
      }
  }

  getLoaiNhaDatVal() {
      var loaiTin = this.props.loaiTin;
      var loaiNhaDat = this.getLoaiNhaDat(loaiTin);
      var loaiNhaDatVal = this.getValueByKey(loaiNhaDatValues, loaiNhaDat);
      if (!loaiNhaDatVal) {
          loaiNhaDatVal = loaiNhaDatValues[0];
      }
      return loaiNhaDatVal;
  }

  render() {
    return (
      <View style={myStyles.fullWidthContainer}>
        <CommonHeader headerTitle={"Loại nhà đất"} />
        <View style={myStyles.headerSeparator} />

        <MultipleChoice
          options={loaiNhaDatValues}
          style={myStyles.choiceList}
          selectedOptions={[this.state.loaiNhaDat]}
          maxSelectedOptions={1}//{this.props.search.form.fields.loaiTin=='ban' ? nhaDatBan.length : nhaDatChoThue.length}
          onSelection={(option)=>this._onApply(option)}
        />
      </View>
    );
  }

  _onBack() {
    Actions.pop();
  }

    _onApply(option) {
        let key = this.getKeyByValue(loaiNhaDatValues, option);
        this.props.onPress(
          {key: key,
           value: option
          });
        Actions.pop();
    }

  getValueByKey(values, key) {
    var value = '';
    for (var i = 0; i < loaiNhaDatKeys.length; i++) {
      var loaiKey = loaiNhaDatKeys[i];
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
        key = loaiNhaDatKeys[i];
        break;
      }
    }
    //console.log(key);
    return key;
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(LoaiNhaDat);



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

