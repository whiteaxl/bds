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


import React, {View, Component, Text, StyleSheet, StatusBar } from 'react-native'

import {Actions} from 'react-native-router-flux';

import CommonHeader from '../components/CommonHeader';

import MultipleChoice from './MultipleChoice';

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
  constructor(props) {
    super();
    StatusBar.setBarStyle('default');
      var orderBy = this.getValueByKey(props.search.form.fields.orderBy);
      if (!orderBy) {
          orderBy = orderTypes[0];
      }
      this.state = {
          orderBy: orderBy
      };
  }

  render() {
    return (
      <View style={myStyles.fullWidthContainer}>
        <CommonHeader headerTitle={"Sắp xếp"} backTitle={"Danh sách"} />
        <View style={myStyles.headerSeparator} />

        <MultipleChoice
          options={orderTypes}
          style={myStyles.choiceList}
          selectedOptions={[this.state.orderBy]}
          maxSelectedOptions={1}
          onSelection={(option)=>this.handleOrderTypeChosen(option)}
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
        var {orderBy} = this.state;
        this.props.actions.onSearchFieldChange("orderBy", this.getKeyByValue(orderBy));

        this.props.actions.search(
            this.props.search.form.fields
            , () => {
                Actions.pop();
            }
        );
    }

    handleOrderTypeChosen(option) {
        if (this.state.orderBy == option) {
            this.setState({orderBy: ''});
        } else {
            this.setState({orderBy: option});
        }
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
