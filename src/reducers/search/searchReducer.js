'use strict';

import RangeUtils from "../../lib/RangeUtils";

const InitialState = require('./searchInitialState').default;

const {
    ON_SEARCH_FIELD_CHANGE,
    SET_SEARCH_LOAI_TIN,

    SEARCH_STATE_LOADING,
    SEARCH_STATE_SUCCESS,
    SEARCH_STATE_FAILURE,
    FETCH_SEARCH_RESULT_FAIL,
    FETCH_SEARCH_RESULT_SUCCESS,
    CHANGE_TO_LOADING_SEARCH_RESULT

} = require('../../lib/constants').default;

const initialState = new InitialState;
/**
 * ## authReducer function
 * @param {Object} state - initialState 
 * @param {Object} action - type and payload
 */
export default function searchReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return initialState.mergeDeep(state);
  switch (action.type) {

    case ON_SEARCH_FIELD_CHANGE: {
      const {field, value} = action.payload;
      let nextState =  state.setIn(['form', 'fields', field], value);

      return nextState;
    }
    case SET_SEARCH_LOAI_TIN : {
      let value = action.payload;

      let pickerData = null;

      if (value === 'ban') {
        pickerData = RangeUtils.sellPriceRange.getPickerData();
      } else {
        pickerData = RangeUtils.rentPriceRange.getPickerData();
      }

      let nextState =  state
          .setIn(['form', 'fields', "gia"], RangeUtils.BAT_KY_RANGE)
          .setIn(['form', 'fields', "giaPicker"], pickerData)
          .setIn(['form', 'fields', "loaiTin"], value);
      return nextState;
    }

    case FETCH_SEARCH_RESULT_FAIL:
      return state.setIn(['result','errorMsg'], action.payload);
          //.set("state", SEARCH_STATE_FAILURE);

    case FETCH_SEARCH_RESULT_SUCCESS :
      return state.setIn(['result',"listAds"], action.payload)
          .set("state", SEARCH_STATE_SUCCESS)
          .setIn(['result', "errorMsg"], null);

    case CHANGE_TO_LOADING_SEARCH_RESULT : {
      return state.set("state", SEARCH_STATE_LOADING)
    }

  }
  
  /**
   * ## Default
   */
  return state;
}
