'use strict';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

/**
 * The actions we need
 */
import * as globalActions from '../reducers/global/globalActions';
import * as searchActions from '../reducers/search/searchActions';

/**
 * Immutable Map
 */

import {Map} from 'immutable';

import React, { Text, View, Component, StyleSheet, Navigator, TouchableOpacity, Dimensions, StatusBar, Linking } from 'react-native'
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';
import MapView from 'react-native-maps';

import CommonHeader from '../components/CommonHeader';

import DirectionMarker from '../components/DirectionMarker';

import gui from '../lib/gui';

import api from '../lib/FindApi';
import apiUtils from '../lib/ApiUtils';

const {
    MAP_STATE_LOADING,
} = require('../lib/constants').default;

var { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / (height-110);

/**
 * ## Redux boilerplate
 */
const actions = [
  globalActions,
  searchActions
];

function mapStateToProps(state) {
  console.log("SearchMapDetail.mapStateToProps");


  //var listAds = state.search.result.listAds;

  //var viewport = state.search.result.viewport;
  //console.log(viewport);
  //var geoBox = [viewport.southwest.lon, viewport.southwest.lat,
  //  viewport.northeast.lon, viewport.northeast.lat];

  //var region = apiUtils.getRegion(geoBox);
  //region.longitudeDelta = region.latitudeDelta * ASPECT_RATIO;

  return {
    ... state,
    errorMsg: state.search.result.errorMsg,
    placeFullName: state.search.form.fields.place.fullName
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

class SearchMapDetail extends Component {

  constructor(props) {
    console.log("Call SearchMapDetail.constructor");
    super(props);
    StatusBar.setBarStyle('default');

    this.state = {
      mapType: "standard",
      mmarker:{},
      region: this.props.region
    }
  }

  render() {
    console.log("Call SearchMapDetail.render");

    var region = this.props.region;
    region.longitudeDelta = region.latitudeDelta * ASPECT_RATIO;

    let listAds = this.props.listAds;

    console.log("SearchMapDetail: number of data " + listAds.length);

    var markerList = [];

    if (listAds) {
      var i = 0;
      listAds.map(function(item){
        if (item.place.geo.lat && item.place.geo.lon) {
          let marker = {
            coordinate: {latitude: item.place.geo.lat, longitude: item.place.geo.lon},
            price: item.giaFmt,
            id: i,
            cover: item.image.cover,
            diaChi: item.place.diaChi,
            dienTich: item.dienTich
          };
          markerList.push(marker);
          i++;
        }
      });
    }

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
            >
              {markerList.map( marker =>(
                  <MapView.Marker key={marker.id} coordinate={marker.coordinate} onPress={()=>this._onMarkerPress(marker)}>
                    <DirectionMarker fontSize={17} diaChi={marker.diaChi}/>
                  </MapView.Marker>
              ))}
            </MapView>
          </View>
        </View>
    )
  }

  _onSatellitePress(){
    this.setState({
      mapType: "satellite"
    });
  }

  _onHybridPress(){
    this.setState({
      mapType: "hybrid"
    });
  }

  _onStandardPress(){
    this.setState({
      mapType: "standard"
    });
  }

  _onMarkerPress(marker) {
    var {coords} = this.props;
    if (coords) {
      var geoUrl = 'http://maps.apple.com/?saddr='+coords.latitude+','+coords.longitude+'&daddr='+marker.coordinate.latitude+','+marker.coordinate.longitude+'&dirflg=d&t=s';
      this._onDanDuong(geoUrl);
    } else {
      var geoUrl = 'http://maps.apple.com/?daddr='+marker.coordinate.latitude+','+marker.coordinate.longitude+'&dirflg=d&t=s';
      this._onDanDuong(geoUrl);
    }
  }

  _onDanDuong(geoUrl) {
    Linking.canOpenURL(geoUrl).then(supported => {
      if (supported) {
        Linking.openURL(geoUrl);
      } else {
        console.log('Don\'t know how to open URI: ' + geoUrl);
      }
    });
  }

  _onListPressed() {
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
    backgroundColor: '#F5FCFF',
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
    borderRadius: 10,
  },
  button: {
    width: 50,
    paddingVertical: 5,
    alignItems: 'center',
    marginVertical: 5,
    backgroundColor: 'white',
    marginLeft: 15
  },
  mapIcon: {
    color: 'black',
  },
  text: {
    color: 'white',
  },
  mapButtonContainer: {
    position: 'absolute',
    top: height-250,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginVertical: 5,
    marginBottom: 0,
    backgroundColor: 'transparent',
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
  searchListButton: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
  },
  sumBds: {
    marginBottom: 10,
    paddingLeft: 20,
    color: 'white',
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchMapDetail);