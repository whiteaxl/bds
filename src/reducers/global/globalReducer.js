'use strict';

const {
  GET_PROFILE_SUCCESS,
  SIGNUP_SUCCESS,

  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,

  LAUNCH_APP,
  ROUTER_FOCUS,
  ON_DB_CHANGE,
  REGISTER_PUSHTOKEN_SUCCESS
} = require('../../lib/constants').default;

import InitialState from './globalInitialState';

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
        .setIn(["currentUser", "phone"], action.payload.phone)
        .set("loggedIn", true);

      return newState;
    }
    case LOGOUT_SUCCESS: {
      let newState = state
        .setIn(["currentUser", "phone"], '')
        .set("loggedIn", false);

      return newState;
    }

    case LAUNCH_APP :
    {
      var data  =  action.payload;

      console.log("state:", state);
      var next = state
        .set('deviceInfo', data.deviceInfo)
        .set('appInfo', data.appInfo);

      return next;
    }

    case ROUTER_FOCUS: { //RNRF action
      //console.log("Call globalReducer.route ");
      let prevScene = state.scene;

      var next = state
        .set("scene", action.scene)
        .set("prevScene", prevScene);

      return next;
    }
    case ON_DB_CHANGE:
    {

      if (!state.loggedIn || state.currentUser.userID) {
        return state;
      }

      var {all} = action.payload;
      var next = state;

      let users = all.filter(e => e.doc.type == 'User');

      if (users.length > 0) {
        const e = users[0].doc;
        console.log("globalreducer.ON_DB_CHANGE, user", e);
        next = state
          .setIn(['currentUser','userID'], e.userID)
          .setIn(['currentUser','phone'], e.phone)
          .setIn(['currentUser','email'], e.email)
          .setIn(['currentUser','fullName'], e.fullName)
          .setIn(['currentUser','avatar'], e.avatar)
        ;
      }

      return next;
    }
    case REGISTER_PUSHTOKEN_SUCCESS : {
      let newState = state
        .setIn(["deviceInfo", "tokenRegistered"], true);

      return newState;
    }

  }
  
  return state;
}
