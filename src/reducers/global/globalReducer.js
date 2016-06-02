'use strict';

const {
  GET_PROFILE_SUCCESS,
  SIGNUP_SUCCESS,

  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,

  INIT_LOCAL_DB,
  LAUNCH_APP,
  ROUTER_FOCUS,
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

    case INIT_LOCAL_DB:
    {
      var global = JSON.parse(action.payload).global;
      var next = state.set('currentUser', global.currentUser);
      return next;
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
      console.log("Call globalReducer.route ");
      let prevScene = state.scene;

      var next = state
        .set("scene", action.scene)
        .set("prevScene", prevScene);

      return next;
    }
  }
  
  return state;
}
