'use strict';

import React, {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity
} from 'react-native';


import Picker from 'react-native-picker';

export default class RangePicker extends React.Component {
	constructor(props) {
		super();
	}

	render() {
		return(
			<Picker ref={picker => this.picker = picker}
                    style={{height: 220}} showDuration={300}
                    pickerBtnText = {"Đồng ý"} 
                    pickerCancelBtnText = {"Hủy"}
                    pickerTitle = {this.props.pickerTitle}
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




var styles = StyleSheet.create({
 
 });