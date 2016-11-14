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

  CHECK_USER_EXIST_REQUEST,
  CHECK_USER_EXIST_SUCCESS,
  CHECK_USER_EXIST_FAILURE,

  ON_AUTH_FIELD_CHANGE,

  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAILURE,

  ON_DB_CHANGE,
  ON_NEW_MESSAGE

} = require('../../lib/constants').default;

const _ = require('lodash');

import ls from "../../lib/localStorage";

import log from "../../lib/logUtil";
import userApi from "../../lib/userApi";
import chatApi from "../../lib/ChatApi";

import {savedSearchSuccess, loadLastSearchSuccess} from "../search/searchActions";



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
 * ## checkUserExist actions
 */
export function checkUserExistRequest() {
  return {
    type: CHECK_USER_EXIST_REQUEST
  };
}

export function checkUserExistSuccess() {
  return {
    type: CHECK_USER_EXIST_SUCCESS
  };
}
export function checkUserExistFailure(error) {
  return {
    type: CHECK_USER_EXIST_FAILURE
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

export function logout(userID) {
  return dispatch => {
    log.info("start authenAction.logout");
    ls.removeLogin();
    dispatch(logoutSuccess());
    // disconnect to chat
    chatApi.disconnect(userID);
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
export function onDBChange(doc) {
  log.enter("AuthenAction.onDBChange");

  return {
    type: ON_DB_CHANGE,
    payload: {doc}
  };

}

export function onNewMessage(msg) {
  log.enter("AuthenAction.onNewMessage");

  return {
    type: ON_NEW_MESSAGE,
    payload: {msg}
  };

}

export function login(username, password, deviceDto) {

  return dispatch => {
    dispatch(loginRequest());

    return userApi.login(username, password)
      .then(function (json) {
        log.info("authActions.login", json);

        if (json.login === true) {
          let token = json.token;
          ls.setLoginInfo({username,password,token});
          dispatch(loginSuccess(json));
          
          if (json.saveSearch && json.saveSearch.length >0 ){
            dispatch(savedSearchSuccess(json.saveSearch));
          }

          if (json.lastSearch && json.lastSearch.length >0){
            dispatch(loadLastSearchSuccess(json.lastSearch));
          }

          //connect to socket server
          chatApi.connectAndStartListener(json,
              (data) =>{
                dispatch(onNewMessage(data))
              });

          //todo: need to check update device function
          //userApi.updateDevice(deviceDto);

        } else {
          dispatch(loginFailure(json.error));
        }

        return json;
      });
  };
}

export function checkUserExist(username) {

  return dispatch => {
    dispatch(checkUserExistRequest());

    return userApi.checkUserExist(username)
        .then(function (json) {
          log.info("authActions.checkUserExist", json);

          if (json.exist) {
            dispatch(checkUserExistSuccess(json));
          } else {
            console.log("CheckUserExist error");
            dispatch(checkUserExistFailure());
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

