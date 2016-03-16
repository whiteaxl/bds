/**
 * # authReducer.js
 * 
 * The reducer for all the actions from the various log states
 */
'use strict';
/**
 * ## Imports
 * The InitialState for auth
 * fieldValidation for validating the fields
 * formValidation for setting the form's valid flag
 */
const InitialState = require('./searchInitialState').default;

/**
 * ## Auth actions
 */
const {
  ON_SEARCH_FIELD_CHANGE,
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
  }}
  
  /**
   * ## Default
   */
  return state;
}
