'use strict';

import global from './global/globalReducer';
import search from './search/searchReducer';
import auth from './auth/authReducer';
import register from './register/registerReducer';



import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  auth,
  global,
  search,
  register
});

export default rootReducer;