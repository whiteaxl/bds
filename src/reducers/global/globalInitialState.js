'use strict';

import {Record} from 'immutable';

var InitialState = Record({
  currentUser: new (Record({
  	userID : null,
  	fullName : '',
    phone : '',
    email: '',
    avatar:''
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
  scene : {},
  prevScene: {},
});

export default InitialState;
