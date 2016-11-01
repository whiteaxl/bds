'use strict';

const {
  GET_PROFILE_SUCCESS,
  SIGNUP_SUCCESS,

  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,

  LAUNCH_APP,
  ROUTER_FOCUS,
  ON_DB_CHANGE,
  REGISTER_PUSHTOKEN_SUCCESS,

  SEARCH_LIST_LIKE_SUCCESS,
  SEARCH_LIST_UNLIKE_SUCCESS,
  ON_CURRENT_USER_FIELD_CHANGE,
  ON_SETTING_FIELD_CHANGE
} = require('../../lib/constants').default;

import InitialState from './globalInitialState';
import log from '../../lib/logUtil';
import localDB from '../../lib/localDB';


const initialState = new InitialState;

export default function globalReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return initialState.merge(state);

  if (action.type==='focus') {
    action.type = ROUTER_FOCUS;
  }

  switch (action.type) {

    case GET_PROFILE_SUCCESS:
    case SIGNUP_SUCCESS:
    case LOGIN_SUCCESS: {
      let newState = state
        .setIn(['currentUser','userID'], action.payload.userID)
        .setIn(['currentUser','token'], action.payload.token)
        .setIn(["currentUser", "phone"], action.payload.phone)
        .setIn(['currentUser','email'], action.payload.email)
        .setIn(['currentUser','fullName'], action.payload.userName)
        .setIn(['currentUser','avatar'], action.payload.avatar)
        .setIn(['currentUser','adsLikes'], action.payload.adsLikes)
        .setIn(['currentUser','saveSearch'], action.payload.saveSearch)
        .set("loggedIn", true);

      return newState;
    }
    case LOGOUT_SUCCESS: {
      let newState = state
        .setIn(["currentUser", "phone"], '')
        .set("loggedIn", false)
        .setIn(['currentUser','userID'], '');

      return newState;
    }

    case ON_CURRENT_USER_FIELD_CHANGE:{
      const {field, value} = action.payload;
      let nextState = state.setIn(['currentUser', field], value);
      return nextState;
    }

    case LAUNCH_APP :
    {
      var data  =  action.payload;

      log.info("state:", state);
      var next = state
        .set('deviceInfo', data.deviceInfo)
        .set('appInfo', data.appInfo);

      return next;
    }

    case ROUTER_FOCUS: { //RNRF action
      //log.info("Call globalReducer.route ");
      let prevScene = state.scene;

      var next = state
        .set("scene", action.scene)
        .set("prevScene", prevScene);

      return next;
    }
    case ON_DB_CHANGE:
    {
      /*
      if (!state.loggedIn || state.currentUser.userID) {
        return state;
      }
      */

      var {doc} = action.payload;
      var next = state;

      if (doc.type == 'User') {
        const e = doc;
        //log.info("globalreducer.ON_DB_CHANGE, user", e);
        log.info("globalreducer.ON_DB_CHANGE, update current User", e);

        next = state
          .setIn(['currentUser','userID'], e.userID)
          .setIn(['currentUser','phone'], e.phone)
          .setIn(['currentUser','email'], e.email)
          .setIn(['currentUser','fullName'], e.fullName)
          .setIn(['currentUser','avatar'], e.avatar)
          .setIn(['currentUser','adsLikes'], e.adsLikes)
          .setIn(['currentUser','saveSearch'], e.saveSearch)
          .setIn(['currentUser','mainAccount'], e.account && e.account.main)
          .setIn(['currentUser','bonusAccount'], e.account && e.account.bonus)
        ;
      } 

      return next;
    }
    case REGISTER_PUSHTOKEN_SUCCESS : {
      let newState = state
        .setIn(["deviceInfo", "tokenRegistered"], true);

      return newState;
    }

    case SEARCH_LIST_LIKE_SUCCESS :
    {
      log.info("globalReducer ", action.payload);
      return state.setIn(['currentUser','adsLikes'], action.payload)
    }

    case SEARCH_LIST_UNLIKE_SUCCESS :
    {
      log.info("globalReducer ", action.payload);
      return state.setIn(['currentUser','adsLikes'], action.payload)
    }

    case ON_SETTING_FIELD_CHANGE:{
      const {field, value} = action.payload;
      console.log("ON_SETTING_FIELD_CHANGE");
      console.log(action.payload);
      console.log("ON_SETTING_FIELD_CHANGE")
      let nextState = state.setIn(['setting', field], value);
      return nextState;
    }

  }
  
  return state;
}
