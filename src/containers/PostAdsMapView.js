'use strict';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as globalActions from '../reducers/global/globalActions';
import * as postAdsActions from '../reducers/postAds/postAdsActions';

import {Map} from 'immutable';

import React, {Component} from 'react';

import { Text, View, StyleSheet, Navigator, TouchableOpacity, Dimensions, StatusBar } from 'react-native'
import {Actions} from 'react-native-router-flux';
import MapView from 'react-native-maps';
import Button from 'react-native-button';

import CommonHeader from '../components/CommonHeader';

import gui from '../lib/gui';

import log from '../lib/logUtil';

var { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / (height-110);
const LATITUDE = 20.95389909999999;
const LONGITUDE = 105.75490945;
const LATITUDE_DELTA = 0.021;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

/**
 * ## Redux boilerplate
 */
const actions = [
  globalActions,
  postAdsActions
];

function mapStateToProps(state) {
  log.info("SearchMapDetail.mapStateToProps");

  return {
    ... state
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

class PostAdsMapView extends Component {

  constructor(props) {
    log.info("Call PostAdsMapView.constructor");
    super(props);
    StatusBar.setBarStyle('default');

    var {geo} = props.postAds.place;
    var region = {latitude: geo.lat, longitude: geo.lon,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA};
    if (geo.lat == '') {
      region.latitude = LATITUDE;
      region.longitude = LONGITUDE;
    }
    this.state = {
      region: region,
      mapType: "standard",
      mapName: "Satellite"
    }
  }

  render() {
    log.info("Call PostAdsMapView.render");

    return (
        <View style={styles.fullWidthContainer}>

          <View style={styles.search}>
            <CommonHeader backTitle={"Trở lại"} />
            <View style={styles.headerSeparator} />
          </View>

          <View style={styles.map}>
            <MapView
              initialRegion={this.state.region}
              style={styles.mapView}
              mapType={this.state.mapType}
              onRegionChangeComplete={this._onRegionChangeComplete.bind(this)}
            >
              <MapView.Marker.Animated
                  coordinate={this.state.region}
              />
            </MapView>
            <View style={styles.mapButtonContainer}>
              <View style={styles.searchListButton}>
                <Button onPress={this._onCancel.bind(this)}
                        style={styles.buttonText}>Thoát</Button>
                <Button onPress={this._onApply.bind(this)}
                        style={styles.buttonText}>Chọn</Button>
              </View>
            </View>
          </View>
        </View>
    )
  }

  _onRegionChangeComplete(region) {
    log.info("Call PostAdsMapView._onRegionChangeComplete");
    this.setState({region: region});
  }

  _onApply() {
    var {place} = this.props.postAds;
    var {region} = this.state;
    place.geo.lat = region.latitude;
    place.geo.lon = region.longitude;
    Actions.pop();
  }

  _onCancel() {
    Actions.pop();
  }
}

// Later on in your styles..
var styles = StyleSheet.create({
  headerSeparator: {
    marginTop: 2,
    borderTopWidth: 1,
    borderTopColor: gui.separatorLine
  },
  fullWidthContainer: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: 'white',
  },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  searchListButtonText: {
    marginLeft: 15,
    marginRight: 15,
    marginTop: 0,
    marginBottom: 0,
    flexDirection: 'column',
  },

  map: {
    flex: 1,
    marginTop: 0,
    marginBottom: 0
  },
  mapView: {
    flex: 1,
    marginTop: 0,
    marginBottom: 0
  },
  title: {
    top:0,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    backgroundColor: 'white'
  },
  search: {
    top:0,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  bubble: {
    backgroundColor: gui.mainColor,
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 3
  },
  button: {
    width: 85,
    paddingTop: 8,
    paddingBottom: 8,
    alignItems: 'center',
    backgroundColor: gui.mainColor,
    marginLeft: 15,
    marginRight: 15
  },
  mapIcon: {
    color: 'white',
    textAlign: 'center'
  },
  text: {
    color: 'white'
  },
  mapButtonContainer: {
    position: 'absolute',
    top: height-105,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: Dimensions.get('window').width,
    backgroundColor: 'transparent'
  },

  tabbar: {
    position: 'absolute',
    top: height-50,
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    borderColor : 'lightgray'
  },
  sumBds: {
    marginBottom: 10,
    paddingLeft: 20,
    color: 'white',
  },
  buttonText: {
    marginLeft: 17,
    marginRight: 17,
    marginTop: 10,
    marginBottom: 10,
    color: 'white',
    fontSize: gui.buttonFontSize,
    fontFamily: gui.fontFamily,
    fontWeight : 'normal'
  },
  searchListButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: Dimensions.get('window').width,
    backgroundColor: gui.mainColor,
    height: 44
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(PostAdsMapView);