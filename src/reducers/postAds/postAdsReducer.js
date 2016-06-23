'use strict';

const InitialState = require('./postAdsInitialState').default;

const {
    ON_POST_ADS_FIELD_CHANGE

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
  }

  return state;
}
