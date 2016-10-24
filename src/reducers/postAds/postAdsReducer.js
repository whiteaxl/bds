'use strict';

const InitialState = require('./postAdsInitialState').default;

const {
    ON_POST_ADS_FIELD_CHANGE,
    POST_ADS_REQUEST,
    POST_ADS_SUCCESS,
    POST_ADS_FAILURE,
    POST_ADS_GET_DIACHINH_REQUEST,
    POST_ADS_GET_DIACHINH_SUCCESS,
    POST_ADS_GET_DIACHINH_FAILURE

} = require('../../lib/constants').default;

const initialState = new InitialState;

export default function postAdsReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return initialState.mergeDeep(state);
  switch (action.type) {

    case ON_POST_ADS_FIELD_CHANGE: {
      const {field, value} = action.payload;
      let nextState =  state.set(field, value)
          .set('error', null);
      return nextState;
    }

    case POST_ADS_REQUEST:
    case POST_ADS_SUCCESS:{
      let nextState =  state.set('error', null);
      return nextState;
    }
    case POST_ADS_FAILURE:
      return state.set('error', action.payload);

    case POST_ADS_GET_DIACHINH_REQUEST:
    case POST_ADS_GET_DIACHINH_FAILURE:
    case POST_ADS_GET_DIACHINH_SUCCESS: {
      let selectedDiaChinh = action.payload.diaChinh;
      let duAnList = action.payload.duAn;
      let nextState = state.set('selectedDiaChinh', selectedDiaChinh)
          .set('duAnList', duAnList);
      return nextState;
    }

  }

  return state;
}
