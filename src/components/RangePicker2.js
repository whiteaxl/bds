'use strict';

import React, {Component} from 'react';

import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity
} from 'react-native';


import Picker from './picker/Picker2';

export default class RangePicker2 extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return(
			<Picker ref={picker => this.picker = picker}
                    style={{height: 220}} showDuration={300}
                    pickerData={this.props.pickerData}
                    selectedValue={this.props.selectedValue}
                    onPickerDone={this.props.onPickerDone}
              />
		)
	}

	toggle() {
		this.picker.toggle();
	}
}
