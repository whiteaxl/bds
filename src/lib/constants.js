import keyMirror from 'key-mirror';

export default keyMirror({
  ON_SEARCH_FIELD_CHANGE : null, 
  SEARCH_STATE_INPUT: null,
  SEARCH_STATE_LOADING: null,
  SEARCH_STATE_SUCCESS: null,
  SEARCH_STATE_FAILURE: null,
  CHANGE_TO_LOADING_SEARCH_RESULT:null,

  SET_SEARCH_LOAI_TIN : null,


  SET_PLATFORM: null,
  SET_VERSION: null,

  SESSION_TOKEN_REQUEST: null,
  SESSION_TOKEN_SUCCESS: null,
  SESSION_TOKEN_FAILURE: null,
  
  ON_LOGIN_STATE_CHANGE: null,
  LOGIN_STATE_LOGOUT: null,
  LOGIN_STATE_REGISTER: null,
  LOGIN_STATE_LOGIN: null,
  LOGIN_STATE_FORGOT_PASSWORD: null,
  
  ON_AUTH_FORM_FIELD_CHANGE: null,
  SIGNUP_REQUEST: null,
  SIGNUP_SUCCESS: null,
  SIGNUP_FAILURE: null,

  LOGIN_REQUEST: null,
  LOGIN_SUCCESS: null,
  LOGIN_FAILURE: null,

  LOGOUT_REQUEST: null,
  LOGOUT_SUCCESS: null,
  LOGOUT_FAILURE: null,

  LOGGED_IN: null,
  LOGGED_OUT: null,

  SET_SESSION_TOKEN: null,

  RESET_PASSWORD_REQUEST: null,
  RESET_PASSWORD_SUCCESS: null,
  RESET_PASSWORD_FAILURE: null,

  GET_PROFILE_REQUEST: null,
  GET_PROFILE_SUCCESS: null,
  GET_PROFILE_FAILURE: null,

  ON_PROFILE_FORM_FIELD_CHANGE: null,
  
  PROFILE_UPDATE_REQUEST: null,
  PROFILE_UPDATE_SUCCESS: null,
  PROFILE_UPDATE_FAILURE: null,

  //global
  SET_STATE: null,
  GET_STATE: null,
  SET_STORE: null,

  //search-search result
  SET_LISTRESULT_DATASOURCE:null,
  CHANGE_LISTRESULT_TO_LOADING:null,
  FETCH_SEARCH_RESULT_FAIL: null,
  FETCH_SEARCH_RESULT_SUCCESS : null
});
