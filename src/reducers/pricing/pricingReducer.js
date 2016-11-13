'use strict';
const InitialState = require('./meInitialState').default;

import log from '../../lib/logUtil';

const {
    ON_PRICING_FIELD_CHANGE,
    ON_PRICING_LOADING,
    ON_PRICING_REQUEST,
    ON_PRICING_SUCCESS,
    ON_PRICING_FAILURE,
} = require('../../lib/constants').default;

const initialState = new InitialState;

export default function pricingReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return initialState.mergeDeep(state);
  switch (action.type) {

    case ON_PRICING_FIELD_CHANGE:
    {
      const {field, value} = action.payload;
      let nextState = state.setIn(['condition', field], value);
      return nextState;
    }

    case ON_PRICING_LOADING:

    case ON_PRICING_REQUEST: {
      return state.set('isLoading', true);
    }

    case ON_PRICING_SUCCESS: {
      return state.set('isLoading', false);
    }

    case ON_PRICING_FAILURE:
    {
      return state.set('isLoading', false);
    }

  }

  return state;
}
