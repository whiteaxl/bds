'use strict';

import danhMuc from "../assets/DanhMuc";
import utils from "./utils";


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

function getDienTichUnitText() {
	return "m²";
}

function getGiaUnitText() {
	return "triệu";
}

function getGiaUnitValue(unit) {
	return unit == "tỷ" ? 1000 : 1;
}


class IncRange {
	constructor(stepsVal, getDisplay, getUnitText, getUnitValue) {
		this.stepsVal = stepsVal;
		this.getDisplay = getDisplay;
		this.getUnitText = getUnitText;
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
			(this._map[displayArr[0]] != undefined ? this._map[displayArr[0]] : displayArr[0]));
		let toVal = displayArr[1] == -1 ? -1 : (displayArr[1] == 0 ? 0 :
			(this._map[displayArr[1]] != undefined ? this._map[displayArr[1]] : displayArr[1]));
		fromVal = String(fromVal);
		if (fromVal && fromVal.indexOf(" ") != -1) {
			let unitVal = this.getUnitValue ? this.getUnitValue(fromVal.substring(fromVal.indexOf(" ")+1)) : 1;
			fromVal = fromVal.substring(0, fromVal.indexOf(" "));
			fromVal = utils.normalizeNumeric(fromVal);
			fromVal = isNaN(fromVal) ? 0 : Number(fromVal)*unitVal;
		} else {
			fromVal = utils.normalizeNumeric(fromVal);
			fromVal = isNaN(fromVal) ? 0 : Number(fromVal);
		}
		toVal = String(toVal);
		if (toVal && toVal.indexOf(" ") != -1) {
			let unitVal = this.getUnitValue ? this.getUnitValue(toVal.substring(toVal.indexOf(" ")+1)) : 1;
			toVal = toVal.substring(0, toVal.indexOf(" "));
			toVal = utils.normalizeNumeric(toVal);
			toVal = isNaN(toVal) ? 0 : Number(toVal)*unitVal;
		} else {
			toVal = utils.normalizeNumeric(toVal);
			toVal = isNaN(toVal) ? 0 : Number(toVal);
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
	sellPriceRange : new IncRange(sellStepValues, getPriceStepsDisplay, getGiaUnitText, getGiaUnitValue),
	rentPriceRange : new IncRange(rentStepValues, getPriceStepsDisplay, getGiaUnitText, getGiaUnitValue),
	dienTichRange : new IncRange(dienTichStepValues, getDienTichStepsDisplay, getDienTichUnitText),
	
	//gia= [1 ty, 2ty]
	getFromToDisplay:function(values, unitText) {
		let fromVal = values[0];
	    let toVal  = values[1];
		let unitTextStr = unitText ? unitText : 'm²';
		if ((fromVal == BAT_KY || fromVal == CHUA_XAC_DINH || fromVal == THOA_THUAN) && toVal == BAT_KY) {
			return BAT_KY;
		}
	    if (fromVal == BAT_KY && (toVal == BAT_KY || toVal == CHUA_XAC_DINH || toVal == THOA_THUAN)) {
	        return BAT_KY;
	    }
		if ((fromVal == BAT_KY || fromVal == CHUA_XAC_DINH) && toVal == CHUA_XAC_DINH ) {
			return CHUA_XAC_DINH;
		}
		if ((fromVal == BAT_KY || fromVal == THOA_THUAN) && toVal == THOA_THUAN ) {
			return THOA_THUAN;
		}
		if (fromVal == THOA_THUAN && toVal == THOA_THUAN ) {
			return THOA_THUAN;
		}
		if (fromVal == BAT_KY || fromVal == CHUA_XAC_DINH || fromVal == THOA_THUAN) {
			fromVal = '0 ' + unitTextStr;
		}
		if (toVal == CHUA_XAC_DINH) {
			toVal = '0 ' + unitTextStr;
		}

	    return fromVal + " - " + toVal;
	},

	BAT_KY_RANGE : [BAT_KY, BAT_KY],
	
	BAT_KY: BAT_KY
};


export { RangeUtils as default };