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
const InitialState = require('./authInitialState').default;

/**
 * ## Auth actions
 */
const {
  LOGIN_STATE_LOGIN,

  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE,

  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,

  ON_AUTH_FIELD_CHANGE,

  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAILURE,
  REGISTER_SUCCESS,
  ON_DB_CHANGE,
  CHECK_USER_EXIST_REQUEST,
  CHECK_USER_EXIST_SUCCESS,
  CHECK_USER_EXIST_FAILURE,
} = require('../../lib/constants').default;

const initialState = new InitialState;
/**
 * ## authReducer function
 * @param {Object} state - initialState
 * @param {Object} action - type and payload
 */
export default function authReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return initialState.mergeDeep(state);
  switch (action.type) {

    case LOGOUT_REQUEST:
    case LOGIN_REQUEST:
    case RESET_PASSWORD_REQUEST:
      let nextState = state.set('isFetching', true);
      return nextState;


    case ON_AUTH_FIELD_CHANGE:
    {
      const {field, value} = action.payload;
      let nextState = state.set(field, value)
        .set('error', null);
      return nextState;
    }

    case LOGIN_SUCCESS:
    {
      let nextState = state
        .set("sessionCookie", action.payload.sessionCookie)
        .set('isFetching', false)
        .set('state', LOGIN_STATE_LOGIN)
        .set('token', action.payload.token)  ;
      return nextState;
    }

    case REGISTER_SUCCESS:
      let userDto = action.payload;
      return state.set('isFetching', false)
        .set("sessionCookie", '')
        .set('activeRegisterLoginTab', 1)
        .set('phone', userDto.phone)
        .set('matKhau', userDto.matKhau)
        ;

    case LOGOUT_FAILURE:
    case LOGIN_FAILURE:
    case RESET_PASSWORD_FAILURE:
      return state.set('isFetching', false)
        .set('error', action.payload);

    case LOGOUT_SUCCESS: {
      let newState = state
        .set("sessionCookie", "")
        .set("activeRegisterLoginTab", 1)
        .set('matKhau', undefined)
        .set('token', undefined);

      return newState;
    }

  }



  return state;
}
