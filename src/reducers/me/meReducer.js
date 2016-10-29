'use strict';
const InitialState = require('./meInitialState').default;

import log from '../../lib/logUtil';

const {
  ON_ME_FIELD_CHANGE,
  ON_TOPUP_SCRATCH_FIELD_CHANGE,
  ON_PROFILE_FIELD_CHANGE,
  ON_LOADING_PROFILE_REQUEST,
  ON_LOADING_PROFILE_SUCCESS,
  ON_LOADING_PROFILE_FAILURE,
  ON_UPDATING_PROFILE_REQUEST,
  ON_UPDATING_PROFILE_SUCCESS,
  ON_UPDATING_PROFILE_FAILURE
} = require('../../lib/constants').default;

const initialState = new InitialState;

export default function adsMgmtReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return initialState.mergeDeep(state);
  switch (action.type) {

    case ON_ME_FIELD_CHANGE:
    {
      const {field, value} = action.payload;
      let nextState = state.set(field, value);
      return nextState;
    }

    case ON_PROFILE_FIELD_CHANGE:
    {
      const {field, value} = action.payload;
      let nextState = state.setIn(['profile', field], value);
      return nextState;
    }

    case ON_LOADING_PROFILE_SUCCESS:
    {
      const user = action.payload;

      let nextState = state.setIn(["profile","userID"], user.userID)
                      .setIn(['profile', 'fullName'], user.fullName)
                      .setIn(['profile', 'email'], user.email)
                      .setIn(['profile', 'phone'], user.phone)
                      .setIn(['profile', 'diaChi'], user.diaChi)
                      .setIn(['profile', 'gioiThieu'], user.gioiThieu)
                      .setIn(['profile', 'avatar'], user.avatar)
                      .setIn(['profile', 'sex'], user.sex)
                      .setIn(['profile', 'birthDate'], user.birthDate)
                      .setIn(['profile', 'website'], user.website)
                      .setIn(['profile', 'broker'], user.vaiTro);
      return nextState;
     }

    case ON_UPDATING_PROFILE_REQUEST: {
      return state.set('isUpdatingProfile', true);
    }

    case ON_UPDATING_PROFILE_SUCCESS: {
      return state.set('isUpdatingProfile', false);
    }

    case ON_TOPUP_SCRATCH_FIELD_CHANGE:
    {
      const {field, value} = action.payload;
      let nextState = state.setIn(["topup","scratch",field], value);
      return nextState;
    }

  }

  return state;
}
