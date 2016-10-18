/**
 * # authInitialState.js
 * 
 * This class is a Immutable object
 * Working *successfully* with Redux, requires
 * state that is immutable.
 * In my opinion, that can not be by convention
 * By using Immutable, it's enforced.  Just saying....
 *
 */
'use strict';
/**
 * ## Import
 */
const {Record} = require('immutable');
const {
  LOGIN_STATE_REGISTER,
    LOGIN_STATE_LOGOUT
} = require('../../lib/constants').default;


/**
 * ## InitialState
 * The form is set 
 */
var InitialState = Record({
    phone: "0988673558",
    matKhau:"abc",
    isFetching : false,
    error: "",
    sessionCookie:"",
    state: LOGIN_STATE_LOGOUT,
    activeRegisterLoginTab : 1, //0 or 1
    token:undefined
});
export default InitialState;

