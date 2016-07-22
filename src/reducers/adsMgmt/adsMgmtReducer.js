'use strict';
const InitialState = require('./adsMgmtInitialState').default;

import log from '../../lib/logUtil';

const {
  ON_ADSMGMT_FIELD_CHANGE,
  LOGOUT_SUCCESS,
  ON_SELECTED_PACKAGE_FIELD_CHANGE,
  CHANGE_SELECTED_PACKAGE,
  CHANGE_PACKAGE_FIELD
} = require('../../lib/constants').default;

const initialState = new InitialState;

export default function adsMgmtReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return initialState.mergeDeep(state);
  switch (action.type) {

    case ON_ADSMGMT_FIELD_CHANGE:
    {
      const {field, value} = action.payload;
      let nextState = state.set(field, value);
      return nextState;
    }

    case LOGOUT_SUCCESS: {
      let newState = state
        .set("likedList", [])
        .set("sellList", [])
        .set("rentList", [])
        .set("activeTab", 0)
        ;

      return newState;
    }
    case ON_SELECTED_PACKAGE_FIELD_CHANGE: {
      const {field, value} = action.payload;
      const packageSelected = state.package.packageSelected;

      log.info("ON_SELECTED_PACKAGE_FIELD_CHANGE,packageSelected=", packageSelected,action.payload );

      return state.setIn(["package", packageSelected, field], value);
    }
    case CHANGE_SELECTED_PACKAGE : {
      return state.setIn(['package', 'packageSelected'], action.payload);
    }

    case CHANGE_PACKAGE_FIELD:
    {
      const {field, value} = action.payload;
      let nextState = state.setIn(['package', field], value);
      return nextState;
    }
  }

  return state;
}
