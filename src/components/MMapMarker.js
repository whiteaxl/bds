'use strict';

import React, {Component} from 'react-native'

import MapView from 'react-native-maps';

import PriceMarker from './PriceMarker';


import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

/**
 * The actions we need
 */
import * as globalActions from '../reducers/global/globalActions';
import * as searchActions from '../reducers/search/searchActions';

/**
 * Immutable Mapn
 */
import {Map} from 'immutable';

import {Actions} from 'react-native-router-flux';

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

class MMapMarker extends Component {
	
	render() {
		var mcolor = this.props.marker.color ? this.props.marker.color : '#FF5A5F';
		if (this.state && this.state.mcolor){
			mcolor = this.state.mcolor;
		}

		return(
			<MapView.Marker
            	coordinate={this.props.marker.coordinate}
            	onSelect={this._onMarkerSelect.bind(this)}
          	>
            	<PriceMarker color={mcolor} 
            		amount={this.props.marker.price} 
            		unit={this.props.marker.unit}/>
          	</MapView.Marker>
		);
	}

	_onMarkerSelect(event) {
		console.log(JSON.stringify(event.nativeEvent ? event.nativeEvent : event));
		this.setState({mcolor: "grey"});
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(MMapMarker);


