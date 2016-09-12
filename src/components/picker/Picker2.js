'use strict';

import React, {Component,PropTypes} from 'react';

import {
	StyleSheet,
	View,
	Text,
	Platform,
	Dimensions,
	PickerIOS
} from 'react-native';

import PickerAndroid from './PickerAndroid';

let Picker = Platform.OS === 'ios' ? PickerIOS : PickerAndroid;
let PickerItem = Picker.Item;
let {width, height} = Dimensions.get('window');

export default class PickerAny extends Component {

	static propTypes = {
		style: View.propTypes.style,
		pickerData: PropTypes.any.isRequired,
		selectedValue: PropTypes.any.isRequired,
		onPickerDone: PropTypes.func,
		onValueChange: PropTypes.func
	};

	static defaultProps = {
		style: {
			width: width
		},
		onPickerDone: ()=>{},
		onValueChange: ()=>{}
	};

	constructor(props, context){
		super(props, context);
	}

	componentWillMount(){
		this.state = this._getStateFromProps(this.props);
	}

	componentWillReceiveProps(newProps){
		let newState = this._getStateFromProps(newProps);
		this.setState(newState);
	}

	shouldComponentUpdate(nextProps, nextState, context){
		return true;
	}

	_getStateFromProps(props){
		//the pickedValue must looks like [wheelone's, wheeltwo's, ...]
		//this.state.selectedValue may be the result of the first pickerWheel
		let {pickerData, selectedValue} = props;
		let firstWheelData;
		let firstPickedData;

		firstWheelData = Object.keys(pickerData);
		firstPickedData = props.selectedValue[0];
		let cascadeData = this._getCascadeData(pickerData, selectedValue, firstPickedData, true);

		//save picked data
		this.pickedValue = JSON.parse(JSON.stringify(selectedValue));
		return {
			...props,
			pickerData,
			selectedValue,
			//list of first wheel data
			firstWheelData,
			//first wheel selected value
			firstPickedData,
			//list of second wheel data and pickedDataIndex
			secondWheelData: cascadeData.secondWheelData,
			secondPickedDataIndex: cascadeData.secondPickedDataIndex
		};
	}

	_getCascadeData(pickerData, pickedValue, firstPickedData, onInit){
		let secondWheelData;
		let secondPickedDataIndex;
		//only support two and three stage
		for(let key in pickerData){
			//two stage
			if(pickerData[key].constructor === Array){
				secondWheelData = pickerData[firstPickedData];
				if(onInit){
					secondWheelData.forEach(function(v, k){
						if(v === pickedValue[1]){
							secondPickedDataIndex = k;
						}
					}.bind(this));
				}
				else{
					secondPickedDataIndex = 0;
				}
				break;
			}
		}

		return {
			secondWheelData,
			secondPickedDataIndex
		}
	}

	_renderCascadeWheel(pickerData){

		return (
			<View style={[styles.pickerWrap, {width: this.state.style.width || width}]}>
				<View style={styles.pickerWheel}>
					<Picker
						ref={'firstWheel'}
						selectedValue={this.state.firstPickedData}
						onValueChange={value => {
							let secondWheelData = Object.keys(pickerData[value]);
							let cascadeData = this._getCascadeData(pickerData, this.pickedValue, value);
							//when onPicked, this.pickedValue will pass to the parent
							//when firstWheel changed, second and third will also change
							this.pickedValue.splice(0, 2, value, cascadeData.secondWheelData[0]);

							this.setState({
								selectedValue: 'wheel1'+value,
								firstPickedData: value,
								secondWheelData: cascadeData.secondWheelData,
								secondPickedDataIndex: 0
							});
							this.state.onValueChange(JSON.parse(JSON.stringify(this.pickedValue)), 0);
							this.refs.secondWheel && this.refs.secondWheel.moveTo && this.refs.secondWheel.moveTo(0);
							this.state.onPickerDone(this.pickedValue);
						}} >
						{this.state.firstWheelData.map((value, index) => (
							<PickerItem
								key={index}
								value={value}
								label={value.toString()}
							/>)
						)}
					</Picker>
				</View>
				<View style={styles.pickerWheel}>
					<Picker
						ref={'secondWheel'}
						selectedValue={this.state.secondPickedDataIndex}
						onValueChange={(index) => {
							this.pickedValue.splice(1, 1, this.state.secondWheelData[index]);

							this.setState({
								secondPickedDataIndex: index,
								selectedValue: 'wheel2'+index
							});
							this.state.onValueChange(JSON.parse(JSON.stringify(this.pickedValue)), 1);
							this.state.onPickerDone(this.pickedValue);
						}} >
						{this.state.secondWheelData.map((value, index) => (
							<PickerItem
								key={index}
								value={index}
								label={value.toString()}
							/>)
						)}
					</Picker>
				</View>
			</View>
		);
	}

	render(){
		return this._renderCascadeWheel(this.state.pickerData);
	}
};

let styles = StyleSheet.create({
	pickerWrap: {
		flexDirection: 'row'
	},
	pickerWheel: {
		flex: 1
	}
});
