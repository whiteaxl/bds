'use strict';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as globalActions from '../../reducers/global/globalActions';
import * as postAdsActions from '../../reducers/postAds/postAdsActions';

import {Map} from 'immutable';

import React, {Component} from 'react';

import { Text, View, StyleSheet, Navigator, TouchableOpacity, Dimensions, StatusBar } from 'react-native'
import {Actions} from 'react-native-router-flux';
import MapView from 'react-native-maps';
import Button from 'react-native-button';

import CommonHeader from '../CommonHeader';

import gui from '../../lib/gui';

import log from '../../lib/logUtil';

import findApi from '../../lib/FindApi';

import placeUtil from '../../lib/PlaceUtil';

import utils from '../../lib/utils';

var { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / (height-110);
const LATITUDE = 20.95389909999999;
const LONGITUDE = 105.75490945;
const LATITUDE_DELTA = 0.06102071125314978;
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
              // onPress={this._onDragEnd.bind(this)}
              onRegionChangeComplete={this._onRegionChangeComplete.bind(this)}
            >
              <MapView.Marker.Animated
                  // draggable
                  // onDragEnd={this._onDragEnd.bind(this)}
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
    this.setState({region: region});
  }

  // _onDragEnd(e) {
  //   var newRegion = {};
  //   var coordinate = e.nativeEvent.coordinate;
  //   newRegion.latitude = coordinate.latitude;
  //   newRegion.longitude = coordinate.longitude;
  //   newRegion.latitudeDelta = this.state.region.latitudeDelta;
  //   newRegion.longitudeDelta = this.state.region.longitudeDelta;
  //   this.setState({region: newRegion});
  // }

  _onApply() {
    var {region} = this.state;
    findApi.getGeocoding(region.latitude, region.longitude, this.geoCallback.bind(this));
  }

  geoCallback(data) {
    var {place} = this.props.postAds;
    //not allow to directly change state object, so we need clone it first
    let nextPlace = {} ; Object.assign(nextPlace, place);
    place = nextPlace;

    var {region} = this.state;
    place.geo.lat = region.latitude;
    place.geo.lon = region.longitude;
    var places = data.results;
    if (places.length > 0) {
      var newPlace = places[0];
      for (var i=0; i<places.length; i++) {
        var xa = placeUtil.getXa(places[i]);
        if (xa != '') {
          newPlace = places[i];
          break;
        }
      }
      place.placeId = newPlace.place_id;
      var tinh = placeUtil.getTinh(newPlace);
      var huyen = placeUtil.getHuyen(newPlace);
      var xa = placeUtil.getXa(newPlace);
      var {diaChinh} = place;
      diaChinh.tinh = tinh;
      diaChinh.huyen = huyen;
      diaChinh.xa = xa;
      diaChinh.tinhKhongDau = utils.locDau(tinh);
      diaChinh.huyenKhongDau = utils.locDau(huyen);
      diaChinh.xaKhongDau = utils.locDau(xa);
      place.diaChiFullName = tinh;
      if (huyen != '') {
        place.diaChiFullName = huyen + ', ' + place.diaChiFullName;
      }
      if (xa != '') {
        place.diaChiFullName = xa + ', ' + place.diaChiFullName;
      }
      if (place.diaChi != '') {
        place.diaChiFullName = place.diaChi + ', ' + place.diaChiFullName;
      }
    }

    this.props.actions.onPostAdsFieldChange("place", place);
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