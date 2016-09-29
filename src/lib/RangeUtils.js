'use strict';

import danhMuc from "../assets/DanhMuc";


var BIG = danhMuc.BIG;

var {sellStepValues,rentStepValues,dienTichStepValues, BAT_KY, CHUA_XAC_DINH, THOA_THUAN} = danhMuc;

function getPriceStepsDisplay(val) {
	if (val == -1 || val == BIG) {
		return BAT_KY;
	}
	if (val == 0) {
		return THOA_THUAN;
	}

	if (val < 1000) {
		return val + " triệu";
	}

	return val/1000 + " tỷ";	
}

function getDienTichStepsDisplay(val) {
	if (val == -1 || val == BIG) {
		return BAT_KY;
	}
	if (val == 0) {
		return CHUA_XAC_DINH;
	}

	return val + " m²";
}

function getGiaUnitValue(unit) {
	return unit == "tỷ" ? 1000 : 1;
}


class IncRange {
	constructor(stepsVal, getDisplay, getUnitValue) {
		this.stepsVal = stepsVal;
		this.getDisplay = getDisplay;
		this.getUnitValue = getUnitValue;
		//calc display
		this.stepsDisplay = stepsVal.map(getDisplay);
		this._map = {};
		for (var i = 0; i < stepsVal.length; i ++) {
			this._map[this.stepsDisplay[i]] = stepsVal[i];
		}

		//default
		this.firstStep =  BAT_KY;
		this.lastStep = BAT_KY;
	}

	getPickerData() {
		var arr = this.stepsDisplay;

		var ret = {};
		for (var i = 0; i < arr.length ; i++) {
			ret[arr[i]] = [BAT_KY].concat(arr.slice(i+1));
		}
		
		return ret;
	}

	getVal(display) {
		
		return this._map[display];
	}

	getAllRangeVal() {
		var ret = [];
		var len = this.stepsVal.length;
		for (var i=0; i<len; i++) {
			var val = this.stepsVal[i];
			if (val == -1 || val == 0) {
				ret.push([val, val]);
			} else {
				ret.push([this.stepsVal[i-1], val]);
			}
		}
		ret.push([this.stepsVal[len-1], BIG]);
		return ret;
	}

	toValRange(displayArr) {
		let fromVal = displayArr[0] == -1 ? -1 : (displayArr[0] == 0 ? 0 :
			(this._map[displayArr[0]] ? this._map[displayArr[0]] : displayArr[0]));
		let toVal = displayArr[1] == -1 ? -1 : (displayArr[1] == 0 ? 0 :
			(this._map[displayArr[1]] ? this._map[displayArr[1]] : displayArr[1]));
		fromVal = String(fromVal);
		if (fromVal && fromVal.indexOf(" ") != -1) {
			let unitVal = this.getUnitValue ? this.getUnitValue(fromVal.substring(fromVal.indexOf(" ")+1)) : 1;
			fromVal = Number(fromVal.substring(0, fromVal.indexOf(" ")))*unitVal;
		} else {
			fromVal = Number(fromVal);
		}
		toVal = String(toVal);
		if (toVal && toVal.indexOf(" ") != -1) {
			let unitVal = this.getUnitValue ? this.getUnitValue(toVal.substring(toVal.indexOf(" ")+1)) : 1;
			toVal = Number(toVal.substring(0, toVal.indexOf(" ")))*unitVal;
		} else {
			toVal = Number(toVal);
		}
		toVal = toVal == -1 ? BIG : toVal;

		return [fromVal, toVal];
	}

	rangeVal2Display(rangeVal) {
		// console.log("rangeVal=", rangeVal);
		let fromDisplay = this.getDisplay(rangeVal[0]);
		let toDisplay = this.getDisplay(rangeVal[1]);

		return [fromDisplay, toDisplay];
	}
}



var RangeUtils = {
	sellPriceRange : new IncRange(sellStepValues, getPriceStepsDisplay, getGiaUnitValue),
	rentPriceRange : new IncRange(rentStepValues, getPriceStepsDisplay, getGiaUnitValue),
	dienTichRange : new IncRange(dienTichStepValues, getDienTichStepsDisplay), 
	
	//gia= [1 ty, 2ty]
	getFromToDisplay:function(values) {
		let fromVal = values[0];
	    let toVal  = values[1];
	    if (fromVal == BAT_KY && toVal == BAT_KY ) {
	        return BAT_KY;
	    }
		if (fromVal == CHUA_XAC_DINH && toVal == CHUA_XAC_DINH ) {
			return CHUA_XAC_DINH;
		}
		if (fromVal == THOA_THUAN && toVal == THOA_THUAN ) {
			return THOA_THUAN;
		}
		if (fromVal == CHUA_XAC_DINH || fromVal == THOA_THUAN) {
			fromVal = '0 m²';
		}
		if (toVal == CHUA_XAC_DINH) {
			toVal = '0 m²';
		}

	    return fromVal + " - " + toVal;
	},

	BAT_KY_RANGE : [BAT_KY, BAT_KY],
	
	BAT_KY: BAT_KY
};


export { RangeUtils as default };