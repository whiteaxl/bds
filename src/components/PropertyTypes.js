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

import CommonHeader from '../components/CommonHeader';
import DanhMuc from '../assets/DanhMuc';

import MultipleChoice from 'react-native-multiple-choice';

import Button from 'react-native-button';

import gui from '../lib/gui';

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

var loaiNhaDatValues = [];

class PropertyTypes extends Component {
  constructor(props) {
    super();
    loaiNhaDatValues = props.search.form.fields.loaiTin=='ban' ? DanhMuc.getLoaiNhaDatBanValues() : DanhMuc.getLoaiNhaDatThueValues() ;
    var loaiNhaDat = this.getValueByKey(loaiNhaDatValues, props.search.form.fields.loaiNhaDat);
    this.state = {
        loaiNhaDat: loaiNhaDat
    };
  }

  render() {
    return (
      <View style={myStyles.fullWidthContainer}>
        <CommonHeader headerTitle={"Loại nhà đất"} backTitle={"Tìm kiếm"} />

        <MultipleChoice
          options={loaiNhaDatValues}
          style={{paddingTop: 10, paddingLeft: 20, paddingRight: 20}}
          selectedOptions={[this.state.loaiNhaDat]}
          maxSelectedOptions={1}//{this.props.search.form.fields.loaiTin=='ban' ? nhaDatBan.length : nhaDatChoThue.length}
          onSelection={(option)=>this._onPropertyTypeSelected(option)}
        />

        <View style={myStyles.searchButton}>
          <View style={myStyles.searchButtonWrapper}>
              <Button onPress={this._onBack}
                      style={myStyles.searchButtonText}>Thoát</Button>
              <Button onPress={this._onApply.bind(this)}
                      style={myStyles.searchButtonText}>Thực hiện</Button>
          </View>
        </View>

      </View>
    );
  }

  _onBack() {
    Actions.pop();
  }

    _onApply() {
        var {loaiNhaDat} = this.state;
        this.props.actions.onSearchFieldChange("loaiNhaDat", this.getKeyByValue(loaiNhaDatValues, loaiNhaDat));
        Actions.pop();
    }

  _onPropertyTypeSelected(option) {
      if (this.state.loaiNhaDat == option) {
          this.setState({loaiNhaDat: ''});
      } else {
          this.setState({loaiNhaDat: option});
      }
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
        fontFamily: 'Open Sans',
        fontWeight : 'normal'
    }
});

