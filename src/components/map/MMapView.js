'use strict';

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

import ScalableText from 'react-native-text';

var { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / (height-110);
const LATITUDE = 20.95389909999999;
const LONGITUDE = 105.75490945;
const LATITUDE_DELTA = 0.00616620000177733;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

/**
 * ## Redux boilerplate
 */

class MMapView extends Component {

  constructor(props) {
    log.info("Call PostAdsMapView.constructor");
    super(props);
    StatusBar.setBarStyle('default');

    var location = props.location;
    var region ={}
    if (!location || !location.lat ||location.lat == '') {
      region.latitude = LATITUDE;
      region.longitude = LONGITUDE;
    } else{
      region.latitude = location.lat;
      region.longitude = location.lon;
    }
    region.latitudeDelta = LATITUDE_DELTA;
    region.longitudeDelta = LONGITUDE_DELTA;
    

    this.state = {
      showSuggestionPosition: props.showSuggestionPosition || false,
      region: region,
      firstRegion: region,
      diaChi: null,
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
              region={this.state.region}
              style={styles.mapView}
              mapType={this.state.mapType}
              onRegionChangeComplete={this._onRegionChangeComplete.bind(this)}
            >
            </MapView>

            {this._renderGooglePlaceAutoComplete()}

            <View style={styles.positionIcon}>
              <RelandIcon name="home-marker" color={gui.mainColor}
                          size={30} textProps={{paddingLeft: 0}}
                          />
            </View>

            {this._renderButtonOnMap()}

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
        <TouchableHighlight onPress={this._onPress.bind(this)} style={styles.touchSearch}>
          <View style={styles.searchTextContainer}>
            <View style={{ height: 28, width: 32, backgroundColor: 'transparent', left: 20, justifyContent: 'center', alignItems: 'flex-start' }}>
              <RelandIcon name="search" color='#8a8a8a' mainProps={{ top: 8, marginLeft: 5 }}
                          size={22} textProps={{}}
              />
            </View>
            <View style={styles.viewSearch}>
              <ScalableText style={styles.searchTextBottom}>
                {this.state.diaChi ? this.state.diaChi : 'Chọn địa điểm'}
              </ScalableText>
            </View>
          </View>
        </TouchableHighlight>
    );
  }

  _onPress(){
    console.log("PostAdsMapView press place");
    Actions.PostAdsGoogleAutoComplete({onPress: (data, details)=>this._setRegionFromGoogleAutoComplete(data, details)});
  }

  _renderButtonOnMap(){
    return (
        <View style={styles.inMapButtonContainer}>
          {this._renderSuggestionPositionButton()}
          {this._renderCurrentPositionButton()}
        </View>
    );
  }
  _renderCurrentPositionButton() {
    return (
        <View >
          <TouchableOpacity onPress={this._onCurrentLocationPress.bind(this)} >
            <View style={[styles.bubble, styles.button, {marginTop: 10}]}>
              <RelandIcon name="direction" color='black' mainProps={{flexDirection: 'row'}}
                          size={20} textProps={{paddingLeft: 0}}
                          noAction={true}></RelandIcon>
            </View>
          </TouchableOpacity>
        </View>
    );
  }

  _renderSuggestionPositionButton() {
    if (!this.props.showSuggestionPosition)
        return;

    return (
        <View >
          <TouchableOpacity onPress={this._onSuggestionLocationPress.bind(this)} >
            <View style={[styles.bubble, styles.button, {flexDirection: 'column', width: 60}]}>
              <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start'}}>
                <RelandIcon name="hand-o-up" color={'black'}
                            mainProps={{flexDirection: 'row'}}
                            size={20} textProps={{paddingLeft: 0}}
                            noAction={true}></RelandIcon>
                <Text style={[styles.positionSuggetionIconText, {color: 'black'}]}>Vị trí gợi ý</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
    );
  }

  _onCurrentLocationPress() {
    navigator.geolocation.getCurrentPosition(
        (position) => {
          var region = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
          };
          this.setState({region: region});
        },
        (error) => {
          console.log(error);
        },
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  }

  _onSuggestionLocationPress() {
    let region = this.state.firstRegion;
    this.setState({region: region});
    findApi.getGeocoding(region.latitude, region.longitude, this._getDiaChinhContent.bind(this));
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
    console.log("========== on region change complete");
    this.setState({region: region});
    findApi.getGeocoding(region.latitude, region.longitude, this._getDiaChinhContent.bind(this));
  }

  _onApply() {
    var {region} = this.state;
    findApi.getGeocoding(region.latitude, region.longitude, this.geoCallback.bind(this));
    Actions.pop();
  }

  _getDiaChinhContent(data){
    var places = data.results;
    console.log(places);
    if (places.length > 0){
      var newPlace = places[0];
      for (var i=0; i<places.length; i++) {
        var xa = placeUtil.getXa(places[i]);
        if (xa != '') {
          newPlace = places[i];
          break;
        }
      }

      for (var i=0; i<places.length; i++) {
        var diaDiem = placeUtil.getDiaDiem(places[i]);
        if (diaDiem != '') {
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

      if (diaDiem && diaDiem.length >0){
        fullName = diaDiem + ', ' + fullName;
      }

      console.log(fullName);

      this.setState({diaChi: fullName});

    }
  }


  geoCallback(data) {
    let location = {};
    var {region} = this.state;
    location.lat = region.latitude;
    location.lon = region.longitude;
    var places = data.results;

    console.log("===================== print result");
    console.log(places);
    console.log("===================== print result end");

    if (places.length > 0) {
      var newPlace = places[0];
      for (var i=0; i<places.length; i++) {
        var xa = placeUtil.getXa(places[i]);
        if (xa != '') {
          newPlace = places[i];
          break;
        }
      }

      for (var i=0; i<places.length; i++) {
        var diaDiem = placeUtil.getDiaDiem(places[i]);
        if (diaDiem != '') {
          break;
        }
      }
      
      var tinh = placeUtil.getTinh(newPlace);
      var huyen = placeUtil.getHuyen(newPlace);
      var xa = placeUtil.getXa(newPlace);
      var diaChinh = {};
      diaChinh.tinh = tinh;
      diaChinh.huyen = huyen;
      diaChinh.xa = xa;
      diaChinh.tinhKhongDau = utils.locDau(tinh);
      diaChinh.huyenKhongDau = utils.locDau(huyen);
      diaChinh.xaKhongDau = utils.locDau(xa);
      
    }
    var placeType = 'T';
    if (diaChinh.huyenKhongDau)
        placeType = 'H';
    if (diaChinh.xaKhongDau)
        placeType = 'X';

    var diaChinhDto = {
      tinhKhongDau: diaChinh.tinhKhongDau || undefined,
      tinh: diaChinh.tinh,
      huyenKhongDau: diaChinh.huyenKhongDau || undefined,
      huyen: diaChinh.huyen,
      xaKhongDau: diaChinh.xaKhongDau || undefined,
      xa: diaChinh.xa,
      placeType: placeType
    }
    
    let position = {
      location: location,
      diaChi: this.state.diaChi,
      diaChinh: diaChinhDto
    }

    this.props.onPress(position);

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
  mapIcon: {
    color: 'white',
    textAlign: 'center'
  },
  text: {
    color: 'white'
  },
  mapButtonContainer: {
    position: 'absolute',
    bottom: 0,
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
    height: 28,
    width: width
  },
  searchText: {
    fontFamily: gui.fontFamily,
    fontSize: 14,
    textAlign: 'center',
    paddingLeft:2,
    paddingRight: 2,
    backgroundColor:'transparent'
  },
  positionIcon: {
    position: 'absolute',
    top: (height-60-25-60)/2,
    left: width/2 - 10,
    justifyContent: 'center',
    borderColor: gui.mainColor,
    backgroundColor: 'transparent'
  },
  inMapButtonContainer: {
    position: 'absolute',
    bottom: 80,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginVertical: 5,
    marginBottom: 0,
    backgroundColor: 'transparent',
  },
  bubble: {
    backgroundColor: gui.mainColor,
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#C5C2BA',
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    width: 43,
    height: 38,
    paddingVertical: 5,
    alignItems: 'center',
    marginVertical: 5,
    backgroundColor: 'white',
    opacity: 0.9,
    marginLeft: 15
  },
  positionSuggetionIconText: {
    fontSize: 9,
    fontFamily: gui.fontFamily,
    fontWeight : 'normal',
    textAlign: 'center'
  },
  touchSearch:{
    position: 'absolute',
    top: 15,
    borderRadius:4,
    paddingLeft:0,
    marginLeft:15,
    marginRight:15,
    marginTop: 5,
    height:30,
    width:width - 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth:1,
    borderColor:'lightgray',
    opacity: 0.9,
  },
  viewSearch:{
    width:width-80,
    height:28,
    right:20,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor:'white',
    marginLeft:-10
  },
  searchTextBottom: {
    fontFamily: gui.fontFamily,
    fontSize: 14,
    textAlign: 'left',
    paddingLeft:0,
    paddingTop:3,
    backgroundColor:'transparent',
    fontWeight:'400',
    width:width-80,
    height:28,
    color:'#1d1d1d'
  },
});

export default MMapView;