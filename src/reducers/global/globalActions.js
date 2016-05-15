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



