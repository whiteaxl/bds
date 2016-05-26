'use strict';
const InitialState = require('./registerInitialState').default;

const {
  ON_REGISTER_FIELD_CHANGE
} = require('../../lib/constants').default;

const initialState = new InitialState;

export default function registerReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return initialState.mergeDeep(state);
  switch (action.type) {
    case ON_REGISTER_FIELD_CHANGE:
    {
      const {field, value} = action.payload;
      let nextState = state.set(field, value)
        .set('error', null);
      return nextState;
    }
  }

  return state;
}
