'use strict';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as adsMgmtActions from '../../reducers/adsMgmt/adsMgmtActions';

import {Map} from 'immutable';

import React, {Component} from 'react';

import {View, Text, StyleSheet} from 'react-native'

import {Actions} from 'react-native-router-flux';

import CommonHeader from '../../components/CommonHeader';
import danhMuc from '../../assets/DanhMuc';

import MultipleChoice from '../MultipleChoice';

import gui from '../../lib/gui';

/**
 * ## Redux boilerplate
 */
const actions = [
  adsMgmtActions
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

class PackageTypes extends Component {
  constructor(props) {
    super(props);
  }

  _getCurrentName() {
    let current = this.props.adsMgmt.package.packageSelected;
    let name = this.props.adsMgmt.package[current].lengthName;

    return name;
  }

  render() {
    return (
      <View style={myStyles.fullWidthContainer}>
        <CommonHeader headerTitle={"Số ngày"}/>
        <View style={myStyles.headerSeparator}/>

        <MultipleChoice
          options={Object.values(danhMuc.package.length)}
          style={myStyles.choiceList}
          selectedOptions={[this._getCurrentName()]}
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
    /*
    let found = null;
    for (let field in danhMuc.package.level) {
      if (danhMuc.package.level[field] == option) {
        found = Number(field);
      }
    }
    */

    this.props.actions.onSelectedPackageFieldChange("lengthName", option);
    Actions.pop();
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PackageTypes);

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
    fontWeight: 'normal'
  },
  headerSeparator: {
    marginTop: 2,
    borderTopWidth: 1,
    borderTopColor: gui.separatorLine
  }
});

