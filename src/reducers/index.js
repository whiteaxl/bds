'use strict';

import global from './global/globalReducer';
import search from './search/searchReducer';
import auth from './auth/authReducer';
import register from './register/registerReducer';
import inbox from './inbox/inboxReducer';
import chat from './chat/chatReducer';

import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  auth,
  global,
  search,
  register,
  inbox,
  chat
});

export default rootReducer;