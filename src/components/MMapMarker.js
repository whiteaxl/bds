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

import gui from '../lib/gui';

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
		var mcolor = this.props.marker.color ? this.props.marker.color : gui.blue1;
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
    this.props.actions.onSearchFieldChange("marker", this.props.marker);
    console.log("seleled marker");
    console.log(this.props.search.form.fields.marker);
		this.setState({mcolor: "grey"});
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(MMapMarker);


