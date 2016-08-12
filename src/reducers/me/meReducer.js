'use strict';
const InitialState = require('./meInitialState').default;

import log from '../../lib/logUtil';

const {
  ON_ME_FIELD_CHANGE,
  ON_TOPUP_SCRATCH_FIELD_CHANGE
} = require('../../lib/constants').default;

const initialState = new InitialState;

export default function adsMgmtReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return initialState.mergeDeep(state);
  switch (action.type) {

    case ON_ME_FIELD_CHANGE:
    {
      const {field, value} = action.payload;
      let nextState = state.set(field, value);
      return nextState;
    }

    case ON_TOPUP_SCRATCH_FIELD_CHANGE:
    {
      const {field, value} = action.payload;
      let nextState = state.setIn(["topup","scratch",field], value);
      return nextState;
    }

  }

  return state;
}
