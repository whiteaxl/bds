'use strict';

const {
  SESSION_TOKEN_REQUEST,
  SESSION_TOKEN_SUCCESS,
  SESSION_TOKEN_FAILURE,

  LOGIN_STATE_REGISTER,
  LOGIN_STATE_LOGIN,
  LOGIN_STATE_FORGOT_PASSWORD,

  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE,

  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,

  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE,

  ON_AUTH_FIELD_CHANGE,

  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAILURE,

  ON_DB_CHANGE

} = require('../../lib/constants').default;

const _ = require('lodash');

import dbService from "../../lib/localDB";

import log from "../../lib/logUtil";
import userApi from "../../lib/userApi";


export function registerState() {
  return {
    type: LOGIN_STATE_REGISTER
  };
}

export function loginState() {
  return {
    type: LOGIN_STATE_LOGIN
  };
}

export function forgotPasswordState() {
  return {
    type: LOGIN_STATE_FORGOT_PASSWORD
  };
}

/**
 * ## Logout actions
 */
export function logoutRequest() {
  return {
    type: LOGOUT_REQUEST
  };
}

export function logoutSuccess() {
  return {
    type: LOGOUT_SUCCESS
  };
}
export function logoutFailure(error) {
  return {
    type: LOGOUT_FAILURE,
    payload: error
  };
}
/**
 * ## Login
 * After dispatching the logoutRequest, get the sessionToken
 * and call Parse
 *
 * When the response from Parse is received and it's valid
 * change the state to register and finish the logout
 *
 * But if the call to Parse fails, like expired token or
 * no network connection, just send the failure
 *
 * And if you fail due to an invalid sessionToken, be sure
 * to delete it so the user can log in.
 *
 * How could there be an invalid sessionToken?  Maybe they
 * haven't used the app for a long time.  Or they used another
 * device and logged out there.
 */

export function logout() {
  return dispatch => {
    dbService.logout().then((res) => {
      console.log("Done delete localDB", res);
      dispatch(logoutSuccess());
    })
      .catch((res) => {
        console.log("Error", res)
      });
  };
}

/**
 * ## onAuthFieldChange
 * Set the payload so the reducer can work on it
 */
export function onAuthFieldChange(field, value) {
  return {
    type: ON_AUTH_FIELD_CHANGE,
    payload: {field: field, value: value}
  };
}
/**
 * ## Signup actions
 */
export function signupRequest() {
  return {
    type: SIGNUP_REQUEST
  };
}
export function signupSuccess(json) {
  return {
    type: SIGNUP_SUCCESS,
    payload: json
  };
}
export function signupFailure(error) {
  return {
    type: SIGNUP_FAILURE,
    payload: error
  };
}
/**
 * ## SessionToken actions
 */
export function sessionTokenRequest() {
  return {
    type: SESSION_TOKEN_REQUEST
  };
}
export function sessionTokenRequestSuccess(token) {
  return {
    type: SESSION_TOKEN_SUCCESS,
    payload: token
  };
}
export function sessionTokenRequestFailure(error) {
  return {
    type: SESSION_TOKEN_FAILURE,
    payload: _.isUndefined(error) ? null : error
  };
}

/**
 * ## Delete session token
 *
 * Call the AppAuthToken deleteSessionToken
 */
export function deleteSessionToken() {
  return dispatch => {
    dispatch(sessionTokenRequest());
    return new AppAuthToken().deleteSessionToken()
      .then(() => {
        dispatch(sessionTokenRequestSuccess());
      });
  };
}
/**
 * ## getSessionToken
 * If AppAuthToken has the sessionToken, the user is logged in
 * so set the state to logout.
 * Otherwise, the user will default to the login in screen.
 */
export function getSessionToken() {
  return dispatch => {
    dispatch(sessionTokenRequest());
    return new AppAuthToken().getSessionToken()
      .then((token) => {
        if (token) {
          dispatch(logoutState());
          dispatch(sessionTokenRequestSuccess(token));
        } else {
          dispatch(sessionTokenRequestFailure());
        }
      })
      .catch((error) => {
        dispatch(sessionTokenRequestFailure(error));
      });
  };
}

/**
 * ## saveSessionToken
 * @param {Object} response - to return to keep the promise chain
 * @param {Object} json - object with sessionToken
 */
export function saveSessionToken(json) {
  return new AppAuthToken().storeSessionToken(json);
}

/**
 * ## Login actions
 */
export function loginRequest() {
  return {
    type: LOGIN_REQUEST
  };
}

export function loginSuccess(user) {
  return {
    type: LOGIN_SUCCESS,
    payload: user
  };
}

export function loginFailure(error) {
  return {
    type: LOGIN_FAILURE,
    payload: error
  };
}

/*
 e = {
 last_seq: 3,
 results: [{changes, doc, id, seq}],
 length: number
 }
 */
export function onDBChange(e, all) {
  log.enter("AuthenAction.onDBChange");

  return {
    type: ON_DB_CHANGE,
    payload: {e, all}
  };

}

export function login(username, password, deviceDto) {

  return dispatch => {
    dispatch(loginRequest());

    var dispatchDBChange = (e, all) => {
      dispatch(onDBChange(e, all));
    };

    return dbService.loginAndStartSync(username, password, dispatchDBChange)
      .then(function (json) {
        log.info("authActions.login", json);

        if (json.status === 0) {
          if (username.indexOf("@") > -1) {
            json.phone = username;
          } else {
            json.email = username;
          }
          dispatch(loginSuccess(json));
          //
          userApi.updateDevice(deviceDto);

        } else {
          dispatch(loginFailure(json.error));
        }

        return json;
      });
  };
}

export function loginWithoutUser(user) {
  return dispatch => {
    dispatch(loginSuccess(user))
  }
}

