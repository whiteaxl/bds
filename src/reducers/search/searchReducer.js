'use strict';

import RangeUtils from "../../lib/RangeUtils";
import ApiUtils from "../../lib/ApiUtils";

const InitialState = require('./searchInitialState').default;

const {
    ON_SEARCH_FIELD_CHANGE,
    SET_SEARCH_LOAI_TIN,
    SEARCH_STATE_LOADING,
    SEARCH_STATE_SUCCESS,
    SEARCH_STATE_FAILURE,
    FETCH_SEARCH_RESULT_FAIL,
    FETCH_SEARCH_RESULT_SUCCESS,
    CHANGE_LOADING_SEARCH_RESULT,
    ON_MAP_CHANGE

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
      return state.setIn(['result','errorMsg'], action.payload)
          .set("loadingFromServer", false);

    case FETCH_SEARCH_RESULT_SUCCESS :
      return state.setIn(['result',"listAds"], action.payload.list)
          .setIn(['result',"viewport"], action.payload.viewport)
          .set("state", SEARCH_STATE_SUCCESS)
          .setIn(['result', "errorMsg"], null)
          .set("loadingFromServer", false)
          .setIn(["map", "region"], ApiUtils.getRegionByViewport(action.payload.viewport));

    case CHANGE_LOADING_SEARCH_RESULT : {
      return state.set("loadingFromServer", action.payload)
    }

    case ON_MAP_CHANGE :{
      const {field, value} = action.payload;
      let nextState =  state.setIn(['map', field], value);
      return nextState;
    }
  }
  
  /**
   * ## Default
   */
  return state;
}
