'use strict';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as globalActions from '../../reducers/global/globalActions';
import * as postAdsActions from '../../reducers/postAds/postAdsActions';

import {Map} from 'immutable';

import React, {Component} from 'react';

import { Text, View, StyleSheet, Navigator, TouchableOpacity,
    TouchableHighlight, Dimensions, StatusBar } from 'react-native'

import {Actions} from 'react-native-router-flux';
import MapView from 'react-native-maps';
import Button from 'react-native-button';

import CommonHeader from '../CommonHeader';

import gui from '../../lib/gui';

import log from '../../lib/logUtil';

import findApi from '../../lib/FindApi';

import placeUtil from '../../lib/PlaceUtil';

import RelandIcon from '../RelandIcon';

import utils from '../../lib/utils';

var { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / (height-110);
const LATITUDE = 20.95389909999999;
const LONGITUDE = 105.75490945;
const LATITUDE_DELTA = 0.00616620000177733;
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
    if (!geo || !geo.lat ||geo.lat == '') {
      region.latitude = LATITUDE;
      region.longitude = LONGITUDE;
    }
    let diaChinh ={};
    this.state = {
      region: region,
      diaChinh: diaChinh,
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

          {this._renderGooglePlaceAutoComplete()}

          <View style={styles.map}>
            <MapView
              region={this.state.region}
              style={styles.mapView}
              mapType={this.state.mapType}
              onRegionChangeComplete={this._onRegionChangeComplete.bind(this)}
            >
            </MapView>

            <View style={styles.positionIcon}>
              <RelandIcon name="location" color={'red'}
                          size={30} textProps={{paddingLeft: 0}}
                          />
            </View>

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

  _renderGooglePlaceAutoComplete(){
    return (
        <TouchableHighlight onPress={() => this._onPress()}>
          <View style={styles.searchTextContainer}>
            <Text style={styles.searchText}>
              {this.state.diaChinh.fullName ? this.state.diaChinh.fullName : 'Chọn địa điểm'}
            </Text>
          </View>
        </TouchableHighlight>
    );
  }

  _onPress(){
    console.log("PostAdsMapView press place");
    Actions.PostAdsGoogleAutoComplete({onPress: (data, details)=>this._setRegionFromGoogleAutoComplete(data, details)});
  }

  _setRegionFromGoogleAutoComplete(data, details){

    if (details.geometry && details.geometry.location){
      let location = details.geometry.location;
      let region = {  latitude: location.lat,
                      longitude: location.lng,
                      latitudeDelta: this.state.region.latitudeDelta,
                      longitudeDelta: this.state.region.longitudeDelta
                    }
      this.setState({region: region});
    }

    Actions.pop();
  }

  _onRegionChangeComplete(region) {
    this.setState({region: region});
    findApi.getGeocoding(region.latitude, region.longitude, this._getDiaChinhContent.bind(this));
  }

  _onApply() {
    var {region} = this.state;
    findApi.getGeocoding(region.latitude, region.longitude, this.geoCallback.bind(this));
  }

  _getDiaChinhContent(data){
    var places = data.results;
    if (places.length > 0){
      var newPlace = places[0];
      for (var i=0; i<places.length; i++) {
        var xa = placeUtil.getXa(places[i]);
        if (xa != '') {
          newPlace = places[i];
          break;
        }
      }

      var tinh = placeUtil.getTinh(newPlace);
      var huyen = placeUtil.getHuyen(newPlace);
      var xa = placeUtil.getXa(newPlace);

      let fullName = tinh;
      if (huyen && huyen!=''){
        fullName = huyen + ', ' + fullName;
      }

      if (xa && xa!=''){
        fullName = xa + ', ' + fullName;
      }

      let diaChinh = {fullName: fullName};
      this.setState({diaChinh: diaChinh});

    }
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
    var placeType = 'T';
    if (diaChinh.huyenKhongDau)
        placeType = 'H';
    if (diaChinh.xaKhongDau)
        placeType = 'X';

    var diaChinhDto = {
      tinhKhongDau: diaChinh.tinhKhongDau,
      huyenKhongDau: diaChinh.huyenKhongDau,
      xaKhongDau: diaChinh.xaKhongDau,
      placeType: placeType
    }

    this.props.actions.getDiaChinhFromGoogleData(diaChinhDto);
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
    top: height-130,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: Dimensions.get('window').width,
    backgroundColor: 'transparent'
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
    width: width,
    backgroundColor: gui.mainColor,
    height: 44
  },
  searchTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 25,
    width: width
  },
  searchText: {
    fontFamily: gui.fontFamily,
    fontSize: 14,
    width: width,
    textAlign: 'center'
  },
  positionIcon: {
    position: 'absolute',
    top: (height-60-25-60)/2,
    left: width/2 - 10,
    justifyContent: 'center',
    borderColor: gui.mainColor,
    backgroundColor: 'transparent'
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(PostAdsMapView);