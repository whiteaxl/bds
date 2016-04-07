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
import MMapMarker from '../components/MMapMarker';
import TopModal from '../components/TopModal';

import gui from '../lib/gui';
import api from '../lib/FindApi';
import apiUtils from '../lib/ApiUtils';

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

var { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / (height-40);
const LATITUDE_DELTA = 0.0465;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class SearchResultMap extends Component {

  constructor(props) {
    console.log("SearchResultMap.constructor");

    super(props);

    var marker = this.props.search.form.fields.listData;

    var region = {};
    if (marker && marker.length >0 ){
      region =  {
        latitude: marker[0].hdLat,
        longitude:marker[0].hdLong,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      }
    } else{
      region = apiUtils.getRegion(this.props.search.form.fields.bbox);
      region.longitudeDelta = region.latitudeDelta * ASPECT_RATIO;
    }

    this.state = {
      modal: false,
      mapType: "standard",
      allMarker: this.props.search.form.fields.listData ? this.props.search.form.fields.listData.length : 0,
      region: region
    }
    /*
    var region = {latitude : 21.0226823,
                  longitude: 105.7669236,
                  latituDelta: LATITUDE_DELTA,
                  longitudeDelta: LONGITUDE_DELTA};

    if ( this.props.search.form.fields.bbox && this.props.search.form.fields.bbox.length == 4){
      region = apiUtils.getRegion(this.props.search.form.fields.bbox);
      region.longitudeDelta = region.latitudeDelta * ASPECT_RATIO;
    }
    this.state ={
      modal: false,
      mapType: "standard",
      allMarker: this.props.search.form.fields.listData ? this.props.search.form.fields.listData.length : 0,
      region: region,
    }
    */
  }

  render() {
    console.log("SearchResultMap.render");
    console.log("SearchResultMap: number of data " + this.props.search.form.fields.listData.length);

    var markerList = [];

    if (this.props.search.form.fields.listData) {
      let i = 0;
      this.props.search.form.fields.listData.map(function(item){
        if (item.hdLat && item.hdLong) {
          let marker = {
            coordinate: {latitude: item.hdLat, longitude: item.hdLong},
            price: item.price_value,
            unit: item.price_unit,
            id: i,
            cover: item.cover,
            diaChi: item.diaChi,
            dienTich: item.dienTich
          }
          markerList.push(marker);
          i++;
        }
      });
    }

    return (
      <View style={styles.fullWidthContainer}>
        <View style={styles.search}>
            <SearchHeader placeName={this.props.search.form.fields.place.fullName}/>
        </View>
        <View style={styles.map}>
          <MapView 
            region={this.state.region}
            onRegionChange={this._onRegionChange.bind(this)}
            onRegionChangeComplete={this._onRegionChangeComplete.bind(this)}
            onPress={this._onPress()}
            onMarkerPress={this._onMarkerPress.bind(this)}
            onMarkerSelect={this.props.openModal}
            style={styles.mapView}
            mapType={this.state.mapType}
          >
            {markerList.map( marker =>(
              <MMapMarker key={marker.id} marker={marker}>
              </MMapMarker>
            ))}
          </MapView>
          <View style={styles.buttonContainer}>
            <View style={[styles.bubble, styles.button, {width: 80}]}>
              <Text style={styles.text}> Sum = {this.state.allMarker} </Text>
            </View>
            <TouchableOpacity onPress={this._onSatellitePress.bind(this)} style={[styles.bubble, styles.button]}>
              <Text style={styles.text}>Satellite</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this._onHybridPress.bind(this)} style={[styles.bubble, styles.button]}>
              <Text style={styles.text}>Hybrid</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this._onStandardPress.bind(this)} style={[styles.bubble, styles.button]}>
              <Text style={styles.text}>Standard</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tabbar}>
          <View style={styles.searchListButton}>
            <Icon.Button onPress={this._onLocalInfoPressed}
              name="location-arrow" backgroundColor="white"
              underlayColor="gray" color={gui.blue1}
              style={styles.searchListButtonText} >
              Local Info
            </Icon.Button>
            <Icon.Button onPress={this._onSaveSearchPressed}
              name="hdd-o" backgroundColor="white"
              underlayColor="gray" color={gui.blue1}
              style={styles.searchListButtonText} >
              Lưu tìm kiếm
            </Icon.Button>
            <Icon.Button onPress={this._onListPressed}
              name="list" backgroundColor="white"
              underlayColor="gray" color={gui.blue1}
              style={styles.searchListButtonText} >
              Danh sách
            </Icon.Button>
          </View>
        </View>

        {this.state.modal ? <TopModal closeModal={() => this.setState({modal: false}) }/> : null }
      </View>
    )
  }

  _onRegionChange(region) {
    console.log("SearhResultMap._onRegionChange");
    this.setState({
      region: region
    });
  }

  _onRegionChangeComplete(region) {
    console.log("SearhResultMap._onRegionChangeComplete");
    var bbox = apiUtils.getBbox(this.state.region);
    this.props.actions.onSearchFieldChange("bbox", bbox);
    this.refreshListData();
  }

  refreshListData() {
    console.log("SearhResultMap.refreshListData");
    var loaiTin = this.props.search.form.fields.loaiTin;
    var loaiNhaDat = this.props.search.form.fields.loaiNhaDat;
    var gia = this.props.search.form.fields.gia;
    var soPhongNgu = this.props.search.form.fields.soPhongNgu;
    var soTang = this.props.search.form.fields.soTang;
    var dienTich = this.props.search.form.fields.dienTich;
    var orderBy = this.props.search.form.fields.orderBy;
    var placeName = this.props.search.form.fields.place.fullName;
    var bbox = this.props.search.form.fields.bbox;
    var dataBlob = [];
    api.getItems(loaiTin, loaiNhaDat, gia, soPhongNgu, soTang, dienTich, orderBy, placeName, bbox)
      .then((data) => {
        if (data.list) {
          data.list.map(function(aRow) {
              dataBlob.push(aRow.value);
            }
          );
          console.log("SearchResultMap: number of refresh data " + dataBlob.length);
          this.props.actions.onSearchFieldChange("listData", dataBlob);
          this.setState({allMarker: this.props.search.form.fields.listData.length});
        } else {
          console.log("Lỗi kết nối đến máy chủ!");
        }
      });
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

  _onMarkerPress(event) {
    this.setState({modal: true});
  }

  _onPress(event){
    //console.log(event);
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
  search: {
      top:0,
      alignItems: 'stretch',
      justifyContent: 'flex-start',
  },
  bubble: {
    backgroundColor: gui.blue1,
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 10,
  },
  button: {
    width: 70,
    paddingHorizontal: 5,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  text: {
    color: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
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
  },
  searchListButton: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: 'white',
  },
});
