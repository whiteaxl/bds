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

import React, { Text, View, Component, StyleSheet, Navigator, TouchableOpacity, Dimensions } from 'react-native'
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';
import MapView from 'react-native-maps';

import SearchHeader from '../components/SearchHeader';
import PriceMarker from '../components/PriceMarker';
import TopModal from '../components/TopModal';

import gui from '../lib/gui';

import api from '../lib/FindApi';
import apiUtils from '../lib/ApiUtils';

const {
    MAP_STATE_LOADING,
} = require('../lib/constants').default;


/**
* ## Redux boilerplate
*/
const actions = [
  globalActions,
  searchActions
];

function mapStateToProps(state) {
  console.log("SearchResultMap.mapStateToProps");
  console.log(state.search.state);
  console.log(state.search.form.fields.geoBox);
  console.log(state.search.form.fields.place);

  let listAds = state.search.result.listAds;
  var place = state.search.form.fields.place;
  // var geoBox = [place.geometry.viewport.southwest.lng, place.geometry.viewport.southwest.lat,
  //               place.geometry.viewport.northeast.lng, place.geometry.viewport.northeast.lat];

  var region = {};

  if (listAds && listAds.length >0 ){
    region =  {
      latitude: listAds[0].place.geo.lat,
      longitude: listAds[0].place.geo.lon,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA
    }
  } else {
    region = apiUtils.getRegion(state.search.form.fields.geoBox);
    region.longitudeDelta = region.latitudeDelta * ASPECT_RATIO;
  }

  return {
    listAds: listAds,
    mapState: state.search.state,
    errorMsg: state.search.result.errorMsg,
    placeFullName: state.search.form.fields.place.fullName,
    allMarker: listAds ? listAds.length : 0,
    region: region
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

var { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / (height-40);
const LATITUDE_DELTA = 0.0465;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class SearchResultMap extends Component {

  constructor(props) {
    console.log("Call SearchResultMap.constructor");
    super(props);

    this.state = {
      modal: false,
      mapType: "standard",
      mmarker:{}
    }
  }

  render() {
    console.log("Call SearchResultMap.render");
    console.log(this.props.region);

    let listAds = this.props.listAds;

    console.log("SearchResultMap: number of data " + listAds.length);

    var markerList = [];

    if (listAds) {
      let i = 0;
      listAds.map(function(item){
        if (item.place.geo.lat && item.place.geo.lon) {
          let marker = {
            coordinate: {latitude: item.place.geo.lat, longitude: item.place.geo.lon},
            price: item.giaDisplay,
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
        <View style={styles.title}>
          <Text style={{color: gui.mainColor}}> Số bất động sản trên bản đồ : {this.props.allMarker}</Text>
        </View>
        <View style={styles.search}>
          <SearchHeader placeName={this.props.placeFullName}/>
        </View>
        <View style={styles.map}>
          <MapView 
            region={this.props.region}
            onRegionChangeComplete={this._onRegionChangeComplete.bind(this)}
            onMarkerSelect={this.props.openModal}
            style={styles.mapView}
            mapType={this.state.mapType}
          >
            {markerList.map( marker =>(
              <MapView.Marker
                key={marker.id}
                coordinate={marker.coordinate}
                onPress={()=>this._onMarkerPress(marker)}
              >
                <PriceMarker color={gui.mainColor}
                           amount={marker.price}
                />
              </MapView.Marker>
             ))}
          </MapView>
          <View style={styles.mapButtonContainer}>
            <TouchableOpacity onPress={this._onDrawPressed.bind(this)} style={[styles.bubble, styles.button]}>
                <Text style={styles.mapIcon}>Draw</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this._onCurrentLocationPress.bind(this)} style={[styles.bubble, styles.button]}>
                <Icon name="location-arrow" style={styles.mapIcon} size={20}></Icon>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tabbar}>
          <View style={styles.searchListButton}>
            <Icon.Button onPress={this._onLocalInfoPressed}
              name="location-arrow" backgroundColor="white"
              underlayColor="gray" color={gui.mainColor}
              style={styles.searchListButtonText} >
              Local Info
            </Icon.Button>
            <Icon.Button onPress={this._onSaveSearchPressed}
              name="hdd-o" backgroundColor="white"
              underlayColor="gray" color={gui.mainColor}
              style={styles.searchListButtonText} >
              Lưu tìm kiếm
            </Icon.Button>
            <Icon.Button onPress={this._onListPressed}
              name="list" backgroundColor="white"
              underlayColor="gray" color={gui.mainColor}
              style={styles.searchListButtonText} >
              Danh sách
            </Icon.Button>
          </View>
        </View>

        {this.state.modal ? <TopModal marker={this.state.mmarker} closeModal={() => this.setState({modal: false}) }/> : null }
      </View>
    )
  }

  _onRegionChangeComplete(region) {
    console.log("Call SearhResultMap._onRegionChangeComplete");
    console.log(region);
    var geoBox = apiUtils.getBbox(region);
    this.props.actions.onSearchFieldChange("geoBox", geoBox);
    this.refreshListData();
  }

  refreshListData() {
    console.log("Call SearhResultMap.refreshListData");
    
    // var dataBlob = [];
    // api.getItems(this.props.search.form.fields)
    //   .then((data) => {
    //     if (data.list) {
    //       data.list.map(function(aRow) {
    //           dataBlob.push(aRow.value);
    //         }
    //       );
    //       console.log("SearchResultMap: number of refresh data " + dataBlob.length);
    //       this.props.actions.onSearchFieldChange("listData", dataBlob);
    //       this.setState({allMarker: this.props.listAds.length});
    //     } else {
    //       console.log("Lỗi kết nối đến máy chủ!");
    //     }
    //   });
  }

  _onCurrentLocationPress(){
    console.log("Call SearchResultMap._onCurrentLocationPress");
  }

  _onDrawPressed(){
    console.log("Call SearchResultMap._onDrawPressed");
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

  _onMarkerSelect() {
    this.setState({modal: true});
  }

  _onMarkerPress(marker) {
    console.log("Call SearchResultMap._onMarkerPress");
    this.setState({
      modal: true,
      mmarker: marker
    });
  }

  _onMarkerDeselect(){
    this.setState({modal: false});
  }

  _onLocalInfoPressed() {
    console.log("On Local Info pressed!");
  }

  _onSaveSearchPressed() {
    console.log("On Save Search pressed!");
  }

  _onListPressed() {
    Actions.pop();
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(SearchResultMap);

// Later on in your styles..
var styles = StyleSheet.create({
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
    marginBottom: 50
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
    marginVertical: 10,
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
    alignItems: 'center',
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
});
