/**
 * # globalActions.js
 * 
 * Actions that are global in nature
 */
'use strict';

/**
 * ## Imports
 * 
 * The actions supported
 */
const {
  INIT_LOCAL_DB,
  LAUNCH_APP,
  REGISTER_PUSHTOKEN_SUCCESS
} = require('../../lib/constants').default;

export function initLocalDB() {
  return {
    type: INIT_LOCAL_DB,
    payload: null
  };
}

export function lauchApp(data) {
  return {
      type: LAUNCH_APP,
      payload: data
  }
}

export function registerPushTokenSuccess() {
  return {
    type: REGISTER_PUSHTOKEN_SUCCESS,
    payload: null
  }
}





