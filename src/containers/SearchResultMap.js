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


import React, { Text, View, Component, StyleSheet } from 'react-native'

import {Actions} from 'react-native-router-flux';

import Icon from 'react-native-vector-icons/FontAwesome';
import MapApi from '../lib/MapApi';
import styles from './styles';
import SearchHeader from '../components/SearchHeader';

import gui from '../lib/gui';

import MapView from 'react-native-maps';
import MMapMarker from '../components/MMapMarker';

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

class SearchResultMap extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    var markerList = [];

    if (this.props.search.form.fields.listData) {
      let i = 0;
      this.props.search.form.fields.listData.map(function(item){
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
      });

    }

    var region = {
      latitude: (markerList[0] ? markerList[0].coordinate.latitude : 10.75759410858154),
      longitude: (markerList[0] ? markerList[0].coordinate.longitude : 106.7169036865234),
      latitudeDelta: 0.0461,
      longitudeDelta: 0.0211,
    };

    if (this.state && this.state.region) {
      region = this.state.region;
    }

    return (
      <View style={styles.fullWidthContainer}>
        <View style={myStyles.search}>
            <SearchHeader />
          </View>
        <MapView
          region={region}
          onRegionChangeComplete={this.onRegionChangeComplete.bind(this)}
          style={myStyles.map}
        >
          {markerList.map( marker =>(
            <MMapMarker marker={marker}>
            </MMapMarker>
          ))}
        </MapView>

        <View style={myStyles.searchButton}>
          <View style={myStyles.searchListButton}>
            <Icon.Button onPress={this.onLocalInfo}
              name="location-arrow" backgroundColor="white"
              underlayColor="gray" color={gui.blue1}
              style={myStyles.searchListButtonText} >
              Local Info
            </Icon.Button>
            <Icon.Button onPress={this.onSaveSearch}
              name="hdd-o" backgroundColor="white"
              underlayColor="gray" color={gui.blue1}
              style={myStyles.searchListButtonText} >
              Lưu tìm kiếm
            </Icon.Button>
            <Icon.Button onPress={this.onList}
              name="list" backgroundColor="white"
              underlayColor="gray" color={gui.blue1}
              style={myStyles.searchListButtonText} >
              Danh sách
            </Icon.Button>
          </View>          
        </View>
			</View>
		)
	}
  onRegionChangeComplete(region) {
    this.setState({
      region: region
    });
    MapApi(region.latitude, region.longitude)
      .then((data) => {
        //console.log(data);
        this.setState(data);
      });
  }
  onLocalInfo() {
    console.log("On Local Info pressed!");
    
  }
  onSaveSearch() {
    console.log("On Save Search pressed!");
  }
  onList() {
    Actions.pop();
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchResultMap);


// Later on in your styles..
var myStyles = StyleSheet.create({
  searchListButtonText: {
      marginLeft: 15,
      marginRight: 15,
      marginTop: 10,
      marginBottom: 10,
  },
  
  map: {
    flex: 1,
    marginTop: 30,
    marginBottom: 0
  },

  searchListButton: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: 'white',
  },

  searchButton: {
      alignItems: 'stretch',
      justifyContent: 'flex-end',
  },
  search: {
      top:0,
      alignItems: 'stretch',
      justifyContent: 'flex-start',
  },
});
