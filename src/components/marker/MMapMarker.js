'use strict';

import React, {Component} from 'react';

import {PropTypes} from 'react-native'

import MapView from 'react-native-maps';

import PriceMarker from './PriceMarker';


import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as globalActions from '../../reducers/global/globalActions';
import * as searchActions from '../../reducers/search/searchActions';

import {Map} from 'immutable';

import {Actions} from 'react-native-router-flux';

import gui from '../../lib/gui';

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
  constructor(props){
    super(props);
    this.state = { mcolor: gui.mainColor};
  }

  render() {
		return(
			<MapView.Marker
              coordinate={this.props.marker.coordinate}
            	onSelect={this._onSelect.bind(this)}
          	>
            	<PriceMarker color={this.state.mcolor} 
            		amount={this.props.marker.price}
            		unit={this.props.marker.unit}/>
          	</MapView.Marker>
		);
  }

  _onSelect(event) {
        this.props.actions.onSearchFieldChange("marker", this.props.marker);
	    this.setState({mcolor: "grey"});
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MMapMarker);


