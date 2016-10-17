'use strict';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as globalActions from '../reducers/global/globalActions';
import * as searchActions from '../reducers/search/searchActions';

import {Map} from 'immutable';

import  React, {Component} from 'react';

import {
  Text, View, ListView
  , TextInput, StyleSheet, RecyclerViewBackedScrollView
  , TouchableHighlight, StatusBar
} from 'react-native'

import {Actions} from 'react-native-router-flux';

var gui = require("../lib/gui");
var log = require("../lib/logUtil");

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

var {GooglePlacesAutocomplete} = require('../components/GooglePlacesAutocomplete');

class PlacesAutoComplete extends React.Component {
  constructor(props) {
    super(props);
    StatusBar.setBarStyle('default');
  }

  _onPress(data) {
    //console.log(data);
    log.enter("PlacesAutocomplete._onPress", data);

    this.props.actions.onSearchFieldChange("viewport", {});
    this.props.actions.onPolygonsChange([]);
    this.props.actions.onSearchFieldChange("polygon", []);
    this.props.actions.onSearchFieldChange("orderBy", '');

    if (data.isRecent || data.isSaveSearch) {
      this.props.actions.loadSavedSearch(data);
    } else {
      /*
      let value = {
        fullName: data.fullName,
        currentLocation: data.currentLocation
      };
      */
      console.log("PlacesAutoComplete, place =", data);

      data.fullName = data.shortName || data.fullName;

      this.props.actions.onSearchFieldChange("viewport", data.viewport);
      this.props.actions.onSearchFieldChange("diaChinhViewport", data.viewport);
      this.props.actions.onSearchFieldChange("center", data.center);
      let diaChinh = {tinhKhongDau: data.tinh, huyenKhongDau: data.huyen,
          xaKhongDau: data.xa, duAnKhongDau: data.duAn, fullName: data.fullName};
      this.props.actions.onSearchFieldChange("diaChinh", diaChinh);
    }

    //if not call from Search page, then need perform action
    if (this.props.needReload) {
      setTimeout(() => { //must wait for onSearchFieldChange("place", value) complete
        this.props.actions.search(
          this.props.search.form.fields
          , () => {this.props.loadHomeData && setTimeout(() => this.props.loadHomeData(), 100)}
        );
        Actions.pop();
        StatusBar.setBarStyle('light-content');
        this.props.refreshRegion && this.props.refreshRegion();
      }, 1000);
    } else {
      Actions.pop();
      StatusBar.setBarStyle('light-content');
    }
    this.props.onShowMessage && this.props.onShowMessage();
  }

  _onCancelPress() {
    Actions.pop();
    StatusBar.setBarStyle('light-content');
  }

  render() {
    log.info("Place Autocomplete - render, search=", this.props.search);

    let predefinedPlaces = [
      ...this.props.search.saveSearchList,
      ...this.props.search.recentSearchList
    ];

    return (

      <GooglePlacesAutocomplete
        placeholder='Nhập Tỉnh, Huyện, Xã hoặc tên Dự án'
        minLength={2} // minimum length of text to search
        autoFocus={true}
        fetchDetails={false}
        onPress={this._onPress.bind(this)}
        onCancelPress={this._onCancelPress.bind(this)}
        getDefaultValue={() => {
          return ''; // text input default value
        }}
        styles={{
          description: {
            //fontWeight: 'bold',
            fontFamily : gui.fontFamily,
            fontSize: 16,
            marginLeft:10,
            marginRight: 10
          },
          predefinedPlacesDescription: {
            color: '#1faadb'
          },
          container: {
            paddingTop:20,
            backgroundColor: 'white'
          },
          row : {
            height: 44
          },
          separator:{
            backgroundColor: "#E9E9E9",
            marginLeft: 10,
            marginRight: 10
          }
        }}

        currentLocation={true} // Will add a 'Vị trí Hiện tại' button at the top of the predefined places list
        predefinedPlacesAlwaysVisible={false}
        predefinedPlaces = {predefinedPlaces}
        enablePoweredByContainer={false}
      />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlacesAutoComplete);