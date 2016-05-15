'use strict';

import {Record} from 'immutable';

var InitialState = Record({
  currentUser: new (Record({
  	userID : '',
  	fullName : '',
    phone : '',
    email: '',
  })),

  deviceInfo : {
    ID : null,
    model: null
  },

  appInfo : {
    version : null,
    platform: null
  },

  loggedIn : false,
});

export default InitialState;
