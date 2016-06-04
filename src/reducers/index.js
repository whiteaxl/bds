'use strict';

import global from './global/globalReducer';
import search from './search/searchReducer';
import auth from './auth/authReducer';
import register from './register/registerReducer';
import inbox from './inbox/inboxReducer';

import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  auth,
  global,
  search,
  register,
  inbox
});

export default rootReducer;