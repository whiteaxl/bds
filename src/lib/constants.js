import keyMirror from 'key-mirror';

export default keyMirror({
  ON_MAP_CHANGE: null,
  ON_SEARCH_FIELD_CHANGE : null,
  SEARCH_STATE_INPUT: null,
  SEARCH_STATE_LOADING: null,
  SEARCH_STATE_SUCCESS: null,
  SEARCH_STATE_FAILURE: null,
  CHANGE_LOADING_SEARCH_RESULT:null,

  FETCH_DETAIL_FAIL: null,
  FETCH_DETAIL_SUCCESS: null,
  SET_LOADING_DETAIL: null,

  SET_SEARCH_LOAI_TIN : null,


  SET_PLATFORM: null,
  SET_VERSION: null,


  ON_LOGIN_STATE_CHANGE: null,
  LOGIN_STATE_LOGOUT: null,
  LOGIN_STATE_REGISTER: null,
  LOGIN_STATE_LOGIN: null,
  LOGIN_STATE_FORGOT_PASSWORD: null,

  SIGNUP_REQUEST: null,
  SIGNUP_SUCCESS: null,
  SIGNUP_FAILURE: null,

  LOGIN_REQUEST: null,
  LOGIN_SUCCESS: null,
  LOGIN_FAILURE: null,

  LOGOUT_REQUEST: null,
  LOGOUT_SUCCESS: null,
  LOGOUT_FAILURE: null,


  //global
  SET_STATE: null,
  GET_STATE: null,
  SET_STORE: null,

  //search-search result
  SET_LISTRESULT_DATASOURCE:null,
  CHANGE_LISTRESULT_TO_LOADING:null,
  FETCH_SEARCH_RESULT_FAIL: null,
  FETCH_SEARCH_RESULT_SUCCESS : null,
  
  //search - map


  ON_AUTH_FIELD_CHANGE: null,

  LAUNCH_APP:null, //enter application
  ROUTER_FOCUS:null,

  //register
  ON_REGISTER_FIELD_CHANGE:null,
  REGISTER_SUCCESS : null,

  ON_DB_CHANGE: null,

  ON_INBOX_FIELD_CHANGE: null,
  ON_CHAT_FIELD_CHANGE: null,
  REQUEST_START_CHAT : null,
  INSERT_MY_CHAT: null,
  REGISTER_PUSHTOKEN_SUCCESS: null,

  //post ads
  ON_POST_ADS_FIELD_CHANGE:null,
  ON_UPLOAD_IMAGE: null,
  
  SEARCH_LIST_LIKE_SUCCESS: null,
  ON_ADSMGMT_FIELD_CHANGE: null,
  ON_ME_FIELD_CHANGE : null,
  SEARCH_LOAD_SAVED_SEARCH: null,
  CHANGE_LOADING_HOME_DATA : null,
  LOAD_HOME_DATA_DONE : null,
  CHANGE_SEARCH_CALLED_FROM : null,
  ON_SELECTED_PACKAGE_FIELD_CHANGE : null,
  CHANGE_SELECTED_PACKAGE: null,
  CHANGE_PACKAGE_FIELD: null,
  ON_TOPUP_SCRATCH_FIELD_CHANGE: null
});
