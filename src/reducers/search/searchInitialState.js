/**
 * # authInitialState.js
 *
 * This class is a Immutable object
 * Working *successfully* with Redux, requires
 * state that is immutable.
 * In my opinion, that can not be by convention
 * By using Immutable, it's enforced.  Just saying....
 *
 */
'use strict';
/**
 * ## Import
 */
const {Record} = require('immutable');
const {
  SEARCH_STATE_INPUT
} = require('../../lib/constants').default;

import RangeUtils from "../../lib/RangeUtils"

/**
 * This Record contains the state of the seach form
 */
const SearchForm = Record({
  state: SEARCH_STATE_INPUT,

  fields: new (Record({
    loaiTin:'ban',
    loaiNhaDat:'',
    soPhongNgu:0,
    soTang:0,
    dienTich:RangeUtils.BAT_KY_RANGE,
    gia:RangeUtils.BAT_KY_RANGE,
    //pickerDienTich: [[0, 30,60,100,200, 300, 1000], [0, 30,60,100,200, 300, 1000]],
    orderBy:'',
    giaPicker : RangeUtils.sellPriceRange.getPickerData(),
  }))
});

/**
 * ## InitialState
 * The form is set
 */
var InitialState = Record({
  form: new SearchForm
});
export default InitialState;
