'use strict';

var BAT_KY = "Bất kỳ";
var BIG = 9999999;

var sellStepValues = [0, 1000, 2000, 3000, 5000, 7000, 10000, 20000, 30000];

var rentStepValues = [0, 2, 5, 10, 20, 50, 100, 500]; //by month

var dienTichStepValues = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 150, 200, 250, 300, 400, 500]; //by month

function getPriceStepsDisplay(val) {
	if (val == 0 ) {
		return BAT_KY;
	}

	if (val < 1000) {
		return val + " triệu";
	}

	return val/1000 + " tỷ";	
}

function getDienTichStepsDisplay(val) {
	if (val == 0 ) {
		return BAT_KY;
	}

	return val + " m²";
}


class IncRange {
	constructor(stepsVal, getDisplay) {
		this.stepsVal = stepsVal;
		this.getDisplay = getDisplay;
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

	toValRange(displayArr) {
		let fromVal = this._map[displayArr[0]];

		let toVal = this._map[displayArr[1]];
		toVal = toVal == 0 ? BIG : toVal;

		return [fromVal, toVal];
	}
}



var RangeUtils = {
	sellPriceRange : new IncRange(sellStepValues, getPriceStepsDisplay),
	rentPriceRange : new IncRange(rentStepValues, getPriceStepsDisplay),
	dienTichRange : new IncRange(dienTichStepValues, getDienTichStepsDisplay), 
	
	//gia= [1 ty, 2ty]
	getFromToDisplay:function(values) {
		let fromVal = values[0];
	    let toVal  = values[1];
	    if (fromVal == BAT_KY && toVal == BAT_KY ) {
	        return BAT_KY;
	    }

	    return fromVal + " - " + toVal;
	}, 

	BAT_KY_RANGE : [BAT_KY, BAT_KY]
};


export { RangeUtils as default };