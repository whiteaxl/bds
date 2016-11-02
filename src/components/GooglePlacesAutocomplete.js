import React, {Component} from 'react';

const {
  TextInput, View, ListView, Image, Text, Dimensions, TouchableHighlight, TouchableWithoutFeedback
  , Platform, ActivityIndicator, ProgressBarAndroid, StyleSheet
} = require('react-native');
const Qs = require('qs');

import placeUtil from "../lib/PlaceUtil";


var gui = require("../lib/gui");

import TruliaIcon from './TruliaIcon';

import RelandIcon from './RelandIcon';

import apiUtils from '../lib/ApiUtils';

import cfg from '../cfg';



const GooglePlacesAutocomplete = React.createClass({

  propTypes: {
    placeholder: React.PropTypes.string,
    onPress: React.PropTypes.func,
    minLength: React.PropTypes.number,
    fetchDetails: React.PropTypes.bool,
    autoFocus: React.PropTypes.bool,
    getDefaultValue: React.PropTypes.func,
    timeout: React.PropTypes.number,
    onTimeout: React.PropTypes.func,
    styles: React.PropTypes.object,
    textInputProps: React.PropTypes.object,
    enablePoweredByContainer: React.PropTypes.bool,
    predefinedPlaces: React.PropTypes.array,
    currentLocation: React.PropTypes.bool,
    currentLocationLabel: React.PropTypes.string,
    predefinedPlacesAlwaysVisible: React.PropTypes.bool,
  },

  getDefaultProps() {
    return {
      placeholder: 'Tìm kiếm',
      onPress: () => {
      },
      minLength: 0,
      fetchDetails: false,
      autoFocus: false,
      getDefaultValue: () => '',
      timeout: 20000,
      onTimeout: () => console.warn('Places autocomplete: request timeout'),
      styles: {},
      textInputProps: {},
      enablePoweredByContainer: true,
      predefinedPlaces: [],
      currentLocation: false,
      currentLocationLabel: gui.VI_TRI_HIEN_TAI,
      predefinedPlacesAlwaysVisible: false,
    };
  },

  getInitialState() {
    const ds = new ListView.DataSource({
      rowHasChanged: function rowHasChanged(r1, r2) {
        if (typeof r1.isLoading !== 'undefined') {
          return true;
        }
        return r1 !== r2;
      }
    });
    return {
      text: this.props.getDefaultValue(),
      focused: false,
      dataSource: ds.cloneWithRows(this.buildRowsFromResults([])),
      listViewDisplayed: false,
    };
  },

  buildRowsFromResults(results) {
    var res = null;

    if ((!this.state || this.state.text.length < this.props.minLength) &&
        (results.length === 0 || this.props.predefinedPlacesAlwaysVisible === true)) {
      res = [...this.props.predefinedPlaces];
      if (this.props.currentLocation === true) {
        res.unshift({
          description: this.props.currentLocationLabel,
          shortName: this.props.currentLocationLabel,
          isCurrentLocation: true,
        });
      }
    } else {
      res = [];
    }

    res = res.map(function (place) {
      return {
        ...place,
        isPredefinedPlace: true,
      }
    });

    return [...res, ...results];
  },

  componentWillUnmount() {
    this._abortRequests();
  },

  _abortRequests() {
    for (let i = 0; i < this._requests.length; i++) {
      this._requests[i].abort();
    }
    this._requests = [];
  },

  /**
   * This method is exposed to parent components to focus on textInput manually.
   * @public
   */
  triggerFocus() {
    if (this.refs.textInput) this.refs.textInput.focus();
  },

  /**
   * This method is exposed to parent components to blur textInput manually.
   * @public
   */
  triggerBlur() {
    if (this.refs.textInput) this.refs.textInput.blur();
  },

  getCurrentLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        
        this._abortRequests();

        //this._requestNearby(position.coords.latitude, position.coords.longitude);
        let data = {
          name: gui.VI_TRI_HIEN_TAI,
          fullName: gui.VI_TRI_HIEN_TAI,
          currentLocation: {
            "lat": position.coords.latitude,
            "lon": position.coords.longitude
          }
        };

        var region = {
          latitude: data.currentLocation.lat,
          longitude: data.currentLocation.lon,
          latitudeDelta: gui.LATITUDE_DELTA,
          longitudeDelta: gui.LONGITUDE_DELTA
        };

        data.viewport = apiUtils.getViewport(region);

        data.center = {lat: region.latitude, lon: region.longitude};

        this.props.onPress(data, null);
      },
      (error) => {
        this._disableRowLoaders();
        alert(error.message);
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  },

  _enableRowLoader(rowData) {

    let rows = this.buildRowsFromResults(this._results);
    for (let i = 0; i < rows.length; i++) {
      if ((rows[i].place_id === rowData.place_id) || (rows[i].isCurrentLocation === true && rowData.isCurrentLocation === true)) {
        rows[i].isLoading = true;
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(rows),
        });
        break;
      }
    }
  },
  _disableRowLoaders() {
    if (this.isMounted()) {
      for (let i = 0; i < this._results.length; i++) {
        if (this._results[i].isLoading === true) {
          this._results[i].isLoading = false;
        }
      }
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.buildRowsFromResults(this._results)),
      });
    }
  },

  _onPress(rowData) {
    if (rowData.isPredefinedPlace !== true && this.props.fetchDetails === true) {
      if (rowData.isLoading === true) {
        // already requesting
        return;
      }

      this._abortRequests();

      this.setState({
        text: rowData.fullName
        // text: rowData.shortName
      });

      delete rowData.isLoading;

      this.props.onPress(rowData);

    } else if (rowData.isCurrentLocation === true) {
      // display loader
      this._enableRowLoader(rowData);

      this.setState({
        text: rowData.fullName,
      });
      this.triggerBlur(); // hide keyboard but not the results

      delete rowData.isLoading;

      this.getCurrentLocation();

    } else {
      this.setState({
        text: rowData.fullName,
      });

      this._onBlur();

      delete rowData.isLoading;

      let predefinedPlace = this._getPredefinedPlace(rowData);

      // sending predefinedPlace as details for predefined places
      this.props.onPress(predefinedPlace);
    }
  },
  _results: [],
  _requests: [],

  _getPredefinedPlace(rowData) {
    if (rowData.isPredefinedPlace !== true) {
      return rowData;
    }
    for (let i = 0; i < this.props.predefinedPlaces.length; i++) {
      if (this.props.predefinedPlaces[i].description === rowData.description) {
        return this.props.predefinedPlaces[i];
      }
    }
    return rowData;
  },

  _filterResultsByTypes(responseJSON, types) {
    if (types.length === 0) return responseJSON.results;

    var results = [];
    for (let i = 0; i < responseJSON.results.length; i++) {
      let found = false;
      for (let j = 0; j < types.length; j++) {
        if (responseJSON.results[i].types.indexOf(types[j]) !== -1) {
          found = true;
          break;
        }
      }
      if (found === true) {
        results.push(responseJSON.results[i]);
      }
    }
    return results;
  },


  _request(text) {
    this._abortRequests();
    if (text.length >= this.props.minLength) {
      const request = new XMLHttpRequest();
      this._requests.push(request);
      request.timeout = this.props.timeout;
      request.ontimeout = this.props.onTimeout;
      request.onreadystatechange = () => {
        if (request.readyState !== 4) {
          return;
        }
        if (request.status === 200) {
          const responseJSON = JSON.parse(request.responseText);
          if (typeof responseJSON.predictions !== 'undefined') {
            if (this.isMounted()) {
              this._results = responseJSON.predictions;
              this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.buildRowsFromResults(responseJSON.predictions)),
              });
            }
          }
          if (typeof responseJSON.error_message !== 'undefined') {
            console.warn('google places autocomplete: ' + responseJSON.error_message);
          }
        } else {
          // console.warn("google places autocomplete: request could not be completed or has been aborted");
        }
      };

      /*
      request.open('GET', 'https://maps.googleapis.com/maps/api/place/autocomplete/json?&input='
        + encodeURI(text) + '&' + Qs.stringify(this.props.query));
      request.send();
      */

      request.open('GET', cfg.rootUrl + "/place/autocomplete?input=" + encodeURI(text));
      request.send();
    } else {
      this._results = [];
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.buildRowsFromResults([])),
      });
    }
  },
  _onChangeText(text) {
    this.currentText = text;

    let pre = text;
    setTimeout(() => {
      if (pre == this.currentText) {
        this._request(pre);
      }
    }, 100);

    this.setState({
      text: text,
      listViewDisplayed: true,
    });
  },

  _getRowLoader() {
    if (Platform.OS === 'android') {
      return (
        <ProgressBarAndroid
          style={[defaultStyles.androidLoader, this.props.styles.androidLoader]}
          styleAttr="Inverse"
        />
      );
    }
    /*return (
      <ActivityIndicator
        animating={true}
        size="small"
      />
    );*/
    return null;
  },

  _renderLoader(rowData) {
    if (rowData.isLoading === true) {
      return (
        <View
          style={[defaultStyles.loader, this.props.styles.loader]}
        >
          {this._getRowLoader()}
        </View>
      );
    }
    return null;
  },

  _getRowHight(place) {
    if (place.isSaveSearch || place.isRecent) {
      return 50;
    }

    return 44;
  },

  _renderRowIcon(rowData) {
    let source ;
    if (rowData.isSaveSearch) {
      source = require('../assets/image/search/savedSearch.png');
    } else if (rowData.isRecent) {
      source = require('../assets/image/search/recent.png');
    } else if (rowData.isCurrentLocation) {
      source = require('../assets/image/search/currentLocation.png');
    } else {
    //   source = require('../assets/image/search/notPoint.png');
      return null;
    }

    return (
      <Image
        style={styles.avatarIcon}
        resizeMode={Image.resizeMode.contain}
        source={source}
      />
    )
  },

  _renderRowText(rowData) {
    if (rowData.isSaveSearch || rowData.isRecent) {
      return (
        <View style={styles.textView}>
          <Text
            style={styles.textLine1}
            numberOfLines={1}
          >
            {rowData.name}
          </Text>

          <Text
            style={styles.textLine2}
            numberOfLines={1}
          >
            {rowData.desc}
          </Text>
        </View>
      );
    }

    return (
      <Text
        style={[{flex: 1}, defaultStyles.description
                , this.props.styles.description
                , rowData.isPredefinedPlace ? this.props.styles.predefinedPlacesDescription : {}]}

        numberOfLines={1}
      >
        {rowData.shortName}
      </Text>
    );
  },

  _renderRow(rowData = {}, sectionID, rowID, isFirstRow) {
    console.log(rowData);

    rowData.description = rowData.description || rowData.name;
    let rowHeight = this._getRowHight(rowData);
    var separatorStypeExt = isFirstRow ? {marginLeft: 0} : (this.state.text.length < this.props.minLength ? {marginLeft: 47} : {marginLeft: 25});

    return (
      <TouchableHighlight
        onPress={() =>
          this._onPress(rowData)
        }
        underlayColor="#c8c7cc"
      >
        <View>
          <View style={[defaultStyles.separator, this.props.styles.separator, separatorStypeExt]} />
          <View style={[defaultStyles.row, {height: rowHeight}]}>
            <View style={{
              flex:1,
              flexDirection:'row',
              alignItems:'center',
              paddingTop: 5,
              marginBottom: 5,
              marginLeft: 15,
              marginRight: 15}}>

              {this._renderRowIcon(rowData)}

              {this._renderRowText(rowData)}
            </View>

            {this._renderLoader(rowData)}
          </View>
        </View>
      </TouchableHighlight>
    );
  },

  _renderSeparator(sectionID, rowID, isLastRow) {
    if (isLastRow) {
      return (
          <View key={`${sectionID}-${rowID}`}
                style={[defaultStyles.separator, this.props.styles.separator]}/>
      );
    } else {
      return null;
    }
  },

  _onBlur() {
    this.triggerBlur();
    this.setState({listViewDisplayed: false});
  },

  _onFocus() {
    this.setState({listViewDisplayed: true, focused: true});
  },

  _getListView() {
    if ((this.state.text !== '' || this.props.predefinedPlaces.length || this.props.currentLocation === true) && this.state.listViewDisplayed === true) {
      return (
        <ListView
          keyboardShouldPersistTaps={true}
          keyboardDismissMode="on-drag"
          style={[defaultStyles.listView, this.props.styles.listView]}
          dataSource={this.state.dataSource}
          renderRow={(rowData, sectionID, rowID) => this._renderRow(rowData, sectionID, rowID, (rowID == 0))}
          renderSeparator={(sectionID, rowID) => this._renderSeparator(sectionID, rowID, (rowID == (this.state.dataSource._dataBlob.s1.length-1)))}
          automaticallyAdjustContentInsets={false}

          {...this.props}
        />
      );
    }

    if (this.props.enablePoweredByContainer) {
      return (
        <View
          style={[defaultStyles.poweredContainer, this.props.styles.poweredContainer]}
        >
          <Image
            style={[defaultStyles.powered, this.props.styles.powered]}
            resizeMode={Image.resizeMode.contain}
            source={require('../assets/image/powered_by_google_on_white.png')}
          />
        </View>
      );
    }

    return null;
  },
  render() {
    let {onChangeText, onFocus, ...userProps} = this.props.textInputProps;
    return (
      <View
        style={[defaultStyles.container, this.props.styles.container]}
      >
        <View
          style={[defaultStyles.textInputContainer, this.props.styles.textInputContainer]}
        >
          <View style={defaultStyles.inputView}>
            <TruliaIcon name="search" size={14} color={'white'}
                        mainProps={{paddingRight: 7, paddingTop: 1}}></TruliaIcon>
            <TextInput
              { ...userProps }
              ref="textInput"
              autoFocus={this.props.autoFocus}
              style={[defaultStyles.textInput, this.props.styles.textInput]}
              onChangeText={onChangeText ? text => {this._onChangeText(text); onChangeText(text)} : this._onChangeText}
              value={this.state.text}
              placeholder={this.props.placeholder}
              placeholderTextColor={"white"}
              selectionColor={'white'}
              onFocus={onFocus ? () => {this._onFocus(); onFocus()} : this._onFocus}
              clearButtonMode="never"
            />
            {this.state.focused && this.state.text != '' ?
            <RelandIcon name="close-circle-f" size={18} color={'white'}
                        mainProps={{flexDirection: 'row', paddingTop: 1}}
                        textProps={{paddingLeft: 0}}
                        onPress={() => {this._onChangeText(''); onChangeText && onChangeText('')}}></RelandIcon> : null
            }
          </View>

          <TouchableHighlight underlayColor="transparent" onPress={this.props.onCancelPress}>
            <Text style={defaultStyles.cancel}>
              Hủy
            </Text>
          </TouchableHighlight>

        </View>
        <View style={[defaultStyles.separator, this.props.styles.separator]}/>
        {this._getListView()}
      </View>
    );
  },
});


var styles = StyleSheet.create({
  avatarIcon : {
    height: 22,
    width: 22,
  },
  textLine1: {
    //fontWeight: 'bold',
    fontFamily : gui.fontFamily,
    fontSize: 16,
    color: '#323538'
  },
  textLine2: {
    //fontWeight: 'bold',
    fontFamily : gui.fontFamily,
    fontSize: 12,
    color: '#6E757D',
  },
  textView : {
    marginLeft:10,
    marginRight: 10,
    flex: 1
  }
});

const defaultStyles = {
  container: {
    flex: 1,
  },
  textInputContainer: {
    backgroundColor: 'white',
    height: 44,
    borderTopColor: 'white',
    borderBottomColor: 'white',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    alignItems: 'center',

  },
  inputView: {
    backgroundColor: '#1396E0',
    height: 28,
    borderRadius: 5,
    paddingTop: 4.5,
    paddingBottom: 4.5,
    paddingLeft: 10,
    paddingRight: 10,
    marginLeft: 15,
    marginRight: 8,
    flex: 1,
    flexDirection: 'row'
  },
  textInput: {
    backgroundColor: '#1396E0',
    color: 'white',
    fontSize: 15,
    flex: 1
  },
  cancel: {
    fontSize: 15,
    color: '#1396E0',
    paddingRight: 15,
    paddingTop: 4.5,
    paddingBottom: 4.5,
    height: 28
  },
  poweredContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  powered: {
    marginTop: 15,
  },
  listView: {
    // flex: 1,
  },
  row: {
    height: 44,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#E9E9E9',
  },
  description: {},
  loader: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    height: 20,
  },
  androidLoader: {
    marginRight: -15,
  },
};


module.exports = {GooglePlacesAutocomplete};