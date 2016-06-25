'use strict';

import global from './global/globalReducer';
import search from './search/searchReducer';
import auth from './auth/authReducer';
import register from './register/registerReducer';
import inbox from './inbox/inboxReducer';
import chat from './chat/chatReducer';
import postAds from './postAds/postAdsReducer';
import adsMgmt from './adsMgmt/adsMgmtReducer';
import me from './me/meReducer';

import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  auth,
  global,
  search,
  register,
  inbox,
  chat,
  postAds,
  adsMgmt,
  me
});

export default rootReducer;